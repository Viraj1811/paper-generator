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
  language: z.string().describe('The language of the question paper, e.g., "Hindi".'),
  subject: z.string().describe('The subject of the question paper.'),
  topic: z.string().describe('The topic of the question paper.'),
  difficultyLevel: z
    .enum(['easy', 'medium', 'hard'])
    .describe('The difficulty level of the questions.'),
  gradeLevel: z
    .string()
    .describe('The grade level for the students, e.g., "10th Grade".'),
  questionCounts: z.object({
    mcq: z.number().min(0).describe('Number of multiple choice questions.'),
    one_liner: z.number().min(0).describe('Number of one-liner questions.'),
    short_note: z.number().min(0).describe('Number of short answer questions.'),
    long_answer: z.number().min(0).describe('Number of long answer questions.'),
  }).describe('The number of questions for each type.')
});
export type ExpressQuestionPaperGenerationInput = z.infer<
  typeof ExpressQuestionPaperGenerationInputSchema
>;

const ExpressQuestionPaperGenerationOutputSchema = z.object({
  questionPaper: z
    .string()
    .describe('The generated question paper in Markdown format.'),
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
  prompt: `You are an expert teacher. Generate a question paper for the subject '{{{subject}}}' for students of '{{{gradeLevel}}}', focusing on the topic '{{{topic}}}'.
The entire question paper must be in the '{{{language}}}' language.
The difficulty level of the questions should be '{{{difficultyLevel}}}'.

The paper must contain the following number of questions for each specified type:
{{#if questionCounts.mcq}}
- Multiple Choice Questions: {{{questionCounts.mcq}}}
{{/if}}
{{#if questionCounts.one_liner}}
- One Liner Questions: {{{questionCounts.one_liner}}}
{{/if}}
{{#if questionCounts.short_note}}
- Short Answer Questions: {{{questionCounts.short_note}}}
{{/if}}
{{#if questionCounts.long_answer}}
- Long Answer Questions: {{{questionCounts.long_answer}}}
{{/if}}

Only include sections for question types that have a count greater than 0. Do not generate questions for types with a count of 0 or that are not specified.

Format the entire output in Markdown.
- Use a main heading (#) for the question paper title.
- Use subheadings (##) for sections based on question types (e.g., "## Multiple Choice Questions").
- Use numbered lists for questions within each section.
- For MCQs, use nested lists for options.
Ensure the questions are accurate, well-formatted, and appropriate for the specified grade level.
The entire response should be a single markdown string for the question paper, and it must be entirely in '{{{language}}}'.
`,
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
