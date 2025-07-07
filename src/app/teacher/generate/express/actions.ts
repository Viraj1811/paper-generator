'use server';

import { z } from 'zod';
import {
  expressQuestionPaperGeneration,
  type ExpressQuestionPaperGenerationInput,
} from '@/ai/flows/express-question-paper-generation';

const formSchema = z.object({
  subject: z.string().min(2, {
    message: 'Subject must be at least 2 characters.',
  }),
  numberOfQuestions: z.coerce.number().min(1).max(50),
  difficultyLevel: z.enum(['easy', 'medium', 'hard']),
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
    numberOfQuestions: formData.get('numberOfQuestions'),
    difficultyLevel: formData.get('difficultyLevel'),
  });

  if (!validatedFields.success) {
    return {
      message: 'Invalid form data. Please check your inputs.',
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
