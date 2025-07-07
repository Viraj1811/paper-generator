'use server';

import { z } from 'zod';
import {
  expressQuestionPaperGeneration,
  type ExpressQuestionPaperGenerationInput,
} from '@/ai/flows/express-question-paper-generation';

const formSchema = z.object({
  subject: z.string().min(1, { message: 'Subject is required.' }),
  topic: z.string().min(1, { message: 'Topic is required.' }),
  difficultyLevel: z.enum(['easy', 'medium', 'hard']),
  gradeLevel: z.string().min(1, { message: 'Grade level is required.' }),
  stream: z.string().optional(),
  mcq: z.coerce.number().min(0).max(25).default(0),
  one_liner: z.coerce.number().min(0).max(25).default(0),
  short_note: z.coerce.number().min(0).max(25).default(0),
  long_answer: z.coerce.number().min(0).max(25).default(0),
})
.superRefine((data, ctx) => {
    if (["10th Grade", "11th Grade", "12th Grade", "University"].includes(data.gradeLevel) && (!data.stream || data.stream.length === 0)) {
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
    questionPaper?: string;
    success: boolean;
};

export async function generatePaperAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const validatedFields = formSchema.safeParse({
    subject: formData.get('subject') ?? '',
    topic: formData.get('topic') ?? '',
    difficultyLevel: formData.get('difficultyLevel'),
    gradeLevel: formData.get('gradeLevel'),
    stream: formData.get('stream') ?? '',
    mcq: formData.get('mcq'),
    one_liner: formData.get('one_liner'),
    short_note: formData.get('short_note'),
    long_answer: formData.get('long_answer'),
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
    const { subject, topic, difficultyLevel, gradeLevel, mcq, one_liner, short_note, long_answer } = validatedFields.data;
    const input: ExpressQuestionPaperGenerationInput = {
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
    };
    const result = await expressQuestionPaperGeneration(input);
    return {
      message: 'Question paper generated successfully!',
      questionPaper: result.questionPaper,
      success: true,
    };
  } catch (error) {
    console.error(error);
    return {
      message: 'An error occurred while generating the paper. Please try again.',
      success: false,
    };
  }
}
