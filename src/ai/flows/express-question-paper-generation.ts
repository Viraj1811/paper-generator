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
  prompt: `You are an expert teacher and a language specialist. Your primary and most critical task is to generate a question paper ENTIRELY in the '{{{language}}}' language.

**CRITICAL INSTRUCTION: The entire output, without exception, MUST be in '{{{language}}}'. This includes all titles, headings, questions, sub-questions, and multiple-choice options. Do not use any English words unless '{{{language}}}' is selected as English. For example, if the language is Hindi, the title "Multiple Choice Questions" must be translated to its Hindi equivalent like "बहुविकल्पीय प्रश्न".**

Generate a question paper based on the following details:
- Language: '{{{language}}}'
- Subject: '{{{subject}}}'
- Topic: '{{{topic}}}'
- Grade Level: '{{{gradeLevel}}}'
- Difficulty: '{{{difficultyLevel}}}'

The paper must contain exactly the following number of questions for each type. Only create sections for question types with a count greater than 0:
{{#if questionCounts.mcq}}
- Multiple Choice Questions (Total: {{{questionCounts.mcq}}})
{{/if}}
{{#if questionCounts.one_liner}}
- One Liner Questions (Total: {{{questionCounts.one_liner}}})
{{/if}}
{{#if questionCounts.short_note}}
- Short Answer Questions (Total: {{{questionCounts.short_note}}})
{{/if}}
{{#if questionCounts.long_answer}}
- Long Answer Questions (Total: {{{questionCounts.long_answer}}})
{{/if}}

Formatting rules:
- The entire output MUST be a single valid markdown string.
- Use a main heading (#) for the question paper title (e.g., "# भौतिकी प्रश्न पत्र" for Hindi).
- Use subheadings (##) for sections based on question types (e.g., "## बहुविकल्पीय प्रश्न" for Hindi).
- Use numbered lists for questions.
- For Multiple Choice Questions, use nested lettered lists for options (e.g., a., b., c., d.).

Ensure the questions are accurate and appropriate for the specified grade level and subject.
Final reminder: Your response must be exclusively in the '{{{language}}}' language.
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
