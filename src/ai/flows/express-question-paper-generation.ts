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
  gradeLevel: z
    .string()
    .describe('The grade level for the students, e.g., "10th Grade".'),
  questionTypes: z
    .array(z.enum(['mcq', 'one_liner', 'short_note', 'long_answer']))
    .describe('The types of questions to include.'),
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
  prompt: `You are an expert teacher. Generate a question paper for the subject '{{{subject}}}' for students of '{{{gradeLevel}}}'.
The paper must contain exactly {{{numberOfQuestions}}} questions in total, with a difficulty level of '{{{difficultyLevel}}}'.
The questions should be a mix of the following types: {{#each questionTypes}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}.
Structure the paper with clear headings for each question type (e.g., "Section A: Multiple Choice Questions").
Ensure the questions are accurate, well-formatted, and appropriate for the specified grade level.

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
