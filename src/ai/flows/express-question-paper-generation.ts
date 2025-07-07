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
  language: z.string().describe('The instructional language of the question paper, e.g., "Gujarati".'),
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
  prompt: `You are an expert educational content creator specializing in multilingual and transliterated question papers.

Your task is to generate a question paper based on the following details:
- Instructional Language: '{{{language}}}'
- Subject: '{{{subject}}}'
- Topic: '{{{topic}}}'
- Grade Level: '{{{gradeLevel}}}'
- Difficulty: '{{{difficultyLevel}}}'

**CRITICAL INSTRUCTION: Language Mixing Rule**
Your single most important task is to follow this rule: When the subject is a language itself (e.g., Hindi, Sanskrit, English Grammar), you MUST preserve the key technical terms of that subject in their original language and script. However, you MUST translate the surrounding instructional part of the question (like 'What is', 'Explain', 'Choose the correct option') into the specified '{{{language}}}'.

**Examples of the Language Mixing Rule:**
- If Instructional Language is 'Gujarati' and Subject is 'Hindi':
  - The question 'What is Visheshan?' should become 'વિશેષણ શું છે?'
  - The question 'Write 5 examples of Kriya.' should become 'Kriya ના ૫ ઉદાહરણો લખો.'
- If Instructional Language is 'English' and Subject is 'Sanskrit':
  - The question 'Explain Sandhi with two examples.' should become 'Explain সন্ধি with two examples.'
  - The question 'Define Alankar.' should become 'Define अलंकार.'

**For Non-Language Subjects (like Physics, History, Maths):**
For subjects that are not languages, you should translate the ENTIRE content, including technical terms, into the '{{{language}}}' to create a fully immersive paper. The language-mixing rule does not apply here.
- Example: If the language is 'Hindi' and the subject is 'Physics', a question about 'Force' should use the Hindi word 'बल'.
- Example: If the language is 'Marathi' and the subject is 'History', 'Mughal Empire' should be translated to 'मुघल साम्राज्य'.

The paper must contain exactly the following number of questions for each type. Only create sections for question types with a count greater than 0. Remember to translate the section titles to '{{{language}}}':
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
- Use a main heading (#) for the question paper title in the '{{{language}}}'.
- Use subheadings (##) for sections based on question types, also in '{{{language}}}'.
- Use numbered lists for questions.
- For Multiple Choice Questions, use nested lettered lists for options.
- All parts of the output must adhere to the language rules defined above.

Ensure the questions are accurate and appropriate for the specified grade level and subject.
**FINAL REMINDER:** Follow the Language Mixing Rule precisely. This is the most critical part of your task.
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
