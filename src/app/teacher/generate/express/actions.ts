'use server';

import { z } from 'zod';
import {
  expressQuestionPaperGeneration,
  type ExpressQuestionPaperGenerationInput,
} from '@/ai/flows/express-question-paper-generation';

const formSchema = z.object({
  subject: z.string().min(1, {
    message: 'Subject is required.',
  }),
  topic: z.string().min(1, {
    message: 'Topic is required.',
  }),
  numberOfQuestions: z.coerce.number().min(1).max(50),
  difficultyLevel: z.enum(['easy', 'medium', 'hard']),
  gradeLevel: z.string().min(1, { message: 'Grade level is required.' }),
  questionTypes: z.array(z.enum(['mcq', 'one_liner', 'short_note', 'long_answer']))
    .min(1, { message: 'Please select at least one question type.' }),
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
    subject: formData.get('subject'),
    topic: formData.get('topic'),
    numberOfQuestions: formData.get('numberOfQuestions'),
    difficultyLevel: formData.get('difficultyLevel'),
    gradeLevel: formData.get('gradeLevel'),
    questionTypes: formData.getAll('questionTypes'),
  });

  if (!validatedFields.success) {
    const firstError = Object.values(validatedFields.error.flatten().fieldErrors)[0]?.[0];
    return {
      message: firstError || 'Invalid form data. Please check your inputs.',
      success: false,
    };
  }
  
  try {
    const input: ExpressQuestionPaperGenerationInput = validatedFields.data;
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
