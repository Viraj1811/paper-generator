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
  prompt: `You are an expert teacher. Your task is to generate a question paper.
The ENTIRE question paper, including all headings, questions, and options, MUST be in the '{{{language}}}' language. Do NOT use English unless the selected language is English.

Follow these instructions precisely:
- Subject: '{{{subject}}}'
- Grade Level: '{{{gradeLevel}}}'
- Topic: '{{{topic}}}'
- Difficulty: '{{{difficultyLevel}}}'

The paper must contain exactly the following number of questions for each type:
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

Only create sections for question types with a count greater than 0.

Formatting instructions:
- The entire output MUST be a single markdown string.
- Use a main heading (#) for the question paper title (e.g., "# Physics Question Paper").
- Use subheadings (##) for sections based on question types (e.g., "## Multiple Choice Questions").
- Use numbered lists for questions.
- For Multiple Choice Questions, use nested lettered lists for options (e.g., a., b., c., d.).

Ensure the questions are accurate and appropriate for the specified grade level and subject.
Remember, the language MUST be '{{{language}}}' for the entire response.
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
