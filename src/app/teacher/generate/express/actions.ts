
'use server';

import { z } from 'zod';
import {
  expressQuestionPaperGeneration,
  type ExpressQuestionPaperGenerationInput,
} from '@/ai/flows/express-question-paper-generation';
import { generateSolution } from '@/ai/flows/solution-generation';
import { refinePaper, type RefinePaperInput } from '@/ai/flows/refine-paper-flow';

const formSchema = z.object({
  language: z.string().min(1, { message: 'Language is required.' }),
  subject: z.string({ required_error: "Subject is required." }).min(1, { message: 'Subject is required.' }),
  topic: z.string({ required_error: "Topic is required." }).min(1, { message: 'Topic is required.' }),
  difficultyLevel: z.enum(['easy', 'medium', 'hard']),
  gradeLevel: z.string().min(1, { message: 'Grade level is required.' }),
  stream: z.string().nullable().optional(),
  mcq: z.coerce.number().min(0).max(25).default(0),
  one_liner: z.coerce.number().min(0).max(25).default(0),
  short_note: z.coerce.number().min(0).max(25).default(0),
  long_answer: z.coerce.number().min(0).max(25).default(0),
  mcq_marks: z.coerce.number().min(1).max(6, { message: 'Marks cannot be greater than 6.' }).default(1),
  one_liner_marks: z.coerce.number().min(1).max(6, { message: 'Marks cannot be greater than 6.' }).default(1),
  short_note_marks: z.coerce.number().min(1).max(6, { message: 'Marks cannot be greater than 6.' }).default(2),
  long_answer_marks: z.coerce.number().min(1).max(6, { message: 'Marks cannot be greater than 6.' }).default(5),
  paperCount: z.coerce.number().min(1, {message: "You must generate at least one paper."}).max(5, {message: "You can generate a maximum of 5 papers at a time."}).default(1),
  prompt: z.string().optional(),
})
.superRefine((data, ctx) => {
    if (["11th Grade", "12th Grade", "University"].includes(data.gradeLevel) && (!data.stream || data.stream.length === 0)) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "A stream or field of study must be selected for this grade level.",
            path: ['stream'],
        });
    }
})
.refine(data => data.mcq + data.one_liner + data.short_note + data.long_answer > 0, {
  message: "You must request at least one question.",
  path: ["mcq"], // Path to an arbitrary field to display the error.
});


export type FormState = {
    message: string;
    questionPapers?: string[];
    success: boolean;
};

export async function generatePaperAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const validatedFields = formSchema.safeParse({
    language: formData.get('language'),
    subject: formData.get('subject'),
    topic: formData.get('topic'),
    difficultyLevel: formData.get('difficultyLevel'),
    gradeLevel: formData.get('gradeLevel'),
    stream: formData.get('stream'),
    mcq: formData.get('mcq'),
    one_liner: formData.get('one_liner'),
    short_note: formData.get('short_note'),
    long_answer: formData.get('long_answer'),
    mcq_marks: formData.get('mcq_marks'),
    one_liner_marks: formData.get('one_liner_marks'),
    short_note_marks: formData.get('short_note_marks'),
    long_answer_marks: formData.get('long_answer_marks'),
    paperCount: formData.get('paperCount'),
    prompt: formData.get('prompt'),
  });

  if (!validatedFields.success) {
    const formErrors = validatedFields.error.flatten();
    const firstError = formErrors.formErrors[0] || Object.values(formErrors.fieldErrors)[0]?.[0];
    return {
      message: firstError || 'Invalid form data. Please check your inputs.',
      success: false,
    };
  }
  
  try {
    const { language, subject, topic, difficultyLevel, gradeLevel, mcq, one_liner, short_note, long_answer, mcq_marks, one_liner_marks, short_note_marks, long_answer_marks, paperCount, prompt } = validatedFields.data;
    const baseInput: ExpressQuestionPaperGenerationInput = {
        language,
        subject,
        topic,
        difficultyLevel,
        gradeLevel,
        questionCounts: {
            mcq,
            one_liner,
            short_note,
            long_answer,
        },
        questionMarks: {
            mcq: mcq_marks,
            one_liner: one_liner_marks,
            short_note: short_note_marks,
            long_answer: long_answer_marks,
        },
        prompt,
    };

    const generationPromises = Array.from({ length: paperCount }, (_, i) => {
        // The underlying model (Gemini) is non-deterministic, so calling it multiple
        // times with the same prompt will naturally produce different variations.
        // No need to add a variant number to the prompt itself.
        return expressQuestionPaperGeneration(baseInput);
    });

    const results = await Promise.all(generationPromises);
    
    return {
      message: `${paperCount} question paper(s) generated successfully!`,
      questionPapers: results.map(r => r.questionPaper),
      success: true,
    };
  } catch (error) {
    console.error(error);
    return {
      message: 'An error occurred while generating the papers. Please try again.',
      success: false,
    };
  }
}

export type SolutionState = {
    message: string;
    solution?: string;
    success: boolean;
};

export async function generateSolutionAction(questionPaper: string): Promise<SolutionState> {
    if (!questionPaper || questionPaper.trim() === '') {
        return {
            message: 'Cannot generate solution for an empty paper.',
            success: false,
        };
    }

    try {
        const result = await generateSolution({ questionPaper });
        return {
            message: 'Solution generated successfully!',
            solution: result.solution,
            success: true,
        };
    } catch (error) {
        console.error(error);
        return {
            message: 'An error occurred while generating the solution. Please try again.',
            success: false,
        };
    }
}

export type RefineState = {
    message: string;
    refinedPaper?: string;
    success: boolean;
};

export async function refinePaperAction(prevState: RefineState, formData: FormData): Promise<RefineState> {
    const questionPaper = formData.get('questionPaper') as string;
    const prompt = formData.get('prompt') as string;

    if (!questionPaper || questionPaper.trim() === '') {
        return { message: 'Cannot refine an empty paper.', success: false };
    }
    if (!prompt || prompt.trim() === '') {
        return { message: 'Please provide instructions for refinement.', success: false };
    }

    try {
        const input: RefinePaperInput = { questionPaper, prompt };
        const result = await refinePaper(input);

        if (result && result.refinedPaper) {
            return {
                message: 'Paper refined successfully!',
                refinedPaper: result.refinedPaper,
                success: true,
            };
        } else {
            throw new Error('AI did not return a refined paper.');
        }

    } catch (error) {
        console.error(error);
        return {
            message: 'An error occurred while refining the paper. Please try again.',
            success: false,
        };
    }
}
