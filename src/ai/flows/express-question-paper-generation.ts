'use server';
/**
 * @fileOverview AI-powered express question paper generation flow.
 *
 * - expressQuestionPaperGeneration - A function that handles the question paper generation process.
 * - ExpressQuestionPaperGenerationInput - The input type for the expressQuestionPaperGeneration function.
 * - ExpressQuestionPaperGenerationOutput - The return type for the expressQuestionPaperGeneration function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExpressQuestionPaperGenerationInputSchema = z.object({
  subject: z.string().describe('The subject of the question paper.'),
  numberOfQuestions: z.number().describe('The number of questions to generate.'),
  difficultyLevel: z
    .enum(['easy', 'medium', 'hard'])
    .describe('The difficulty level of the questions.'),
});
export type ExpressQuestionPaperGenerationInput = z.infer<
  typeof ExpressQuestionPaperGenerationInputSchema
>;

const ExpressQuestionPaperGenerationOutputSchema = z.object({
  questionPaper: z.string().describe('The generated question paper.'),
});
export type ExpressQuestionPaperGenerationOutput = z.infer<
  typeof ExpressQuestionPaperGenerationOutputSchema
>;

export async function expressQuestionPaperGeneration(
  input: ExpressQuestionPaperGenerationInput
): Promise<ExpressQuestionPaperGenerationOutput> {
  return expressQuestionPaperGenerationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'expressQuestionPaperGenerationPrompt',
  input: {schema: ExpressQuestionPaperGenerationInputSchema},
  output: {schema: ExpressQuestionPaperGenerationOutputSchema},
  prompt: `You are an expert teacher. Generate a question paper for the subject {{{subject}}} with {{{numberOfQuestions}}} questions of {{{difficultyLevel}}} difficulty. The question paper should be well-formatted and suitable for a high school student.

Question Paper:`,
});

const expressQuestionPaperGenerationFlow = ai.defineFlow(
  {
    name: 'expressQuestionPaperGenerationFlow',
    inputSchema: ExpressQuestionPaperGenerationInputSchema,
    outputSchema: ExpressQuestionPaperGenerationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
