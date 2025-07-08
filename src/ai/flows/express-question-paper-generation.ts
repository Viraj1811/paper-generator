
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
  }).describe('The number of questions for each type.'),
  questionMarks: z.object({
    mcq: z.number().min(1).describe('Marks for each multiple choice question.'),
    one_liner: z.number().min(1).describe('Marks for each one-liner question.'),
    short_note: z.number().min(1).describe('Marks for each short answer question.'),
    long_answer: z.number().min(1).describe('Marks for each long answer question.'),
  }).describe('The marks for each question type.'),
  prompt: z.string().optional().describe('Additional instructions or specific questions to include.'),
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
  prompt: `You are an expert educational content creator. Your task is to generate a question paper based on the following specifications:

- **Instructional Language:** '{{{language}}}'
- **Subject:** '{{{subject}}}'
- **Topic:** '{{{topic}}}'
- **Grade Level:** '{{{gradeLevel}}}'
- **Difficulty:** '{{{difficultyLevel}}}'

**Core Requirement: Mixed-Language Generation**
Your primary task is to follow this specific language rule:
1.  **Translate Instructional Text:** All general text (like 'What is', 'Explain', 'Choose the correct option', section titles, and paper instructions) MUST be translated into the specified '{{{language}}}'.
2.  **Preserve Subject Keywords:** For language-specific subjects (like Hindi, Sanskrit, English Grammar), the core technical terms (keywords) MUST be kept in their original language and script. For all other subjects (like Physics, History), translate everything into the '{{{language}}}'.

**Example of the Rule:**
- If Subject is 'Sanskrit' and Language is 'Gujarati', the question 'How many types of Sandhi are there?' MUST become 'Sandhi કેટલાં પ્રકારના હોય છે?'
- If Subject is 'Hindi' and Language is 'Gujarati', the question 'What is Visheshan?' MUST become 'વિશેષણ શું છે?'

**Question Paper Structure:**
The paper must contain exactly the following number of questions, organized into sections. Only create sections if the question count is greater than 0. The section titles and any instructions MUST be in '{{{language}}}'.

{{#if questionCounts.mcq}}
- **Section A: Multiple Choice Questions** (Total: {{{questionCounts.mcq}}}, Each: {{{questionMarks.mcq}}} Marks)
{{/if}}
{{#if questionCounts.one_liner}}
- **Section B: One Liner Questions** (Total: {{{questionCounts.one_liner}}}, Each: {{{questionMarks.one_liner}}} Marks)
{{/if}}
{{#if questionCounts.short_note}}
- **Section C: Short Answer Questions** (Total: {{{questionCounts.short_note}}}, Each: {{{questionMarks.short_note}}} Marks)
{{/if}}
{{#if questionCounts.long_answer}}
- **Section D: Long Answer Questions** (Total: {{{questionCounts.long_answer}}}, Each: {{{questionMarks.long_answer}}} Marks)
{{/if}}

**Formatting Rules:**
- The entire output MUST be a single, valid markdown string.
- Use a main heading (#) for the question paper title (e.g., # Subject Name - Topic). Translate this into '{{{language}}}'.
- Use subheadings (##) for the section titles. Translate these into '{{{language}}}'.
- Use numbered lists for questions.
- **At the end of each question, you MUST include the marks for that question in parentheses, like this: (X Marks).**
- For Multiple Choice Questions, use nested lettered lists for the options (a., b., c., d.).
- Ensure all questions are accurate and appropriate for the specified grade level and subject.

{{#if prompt}}
**Additional User Instructions:**
You MUST incorporate the following instructions, additions, or specific questions into the generated paper. Prioritize these over the standard generation where there is a conflict.
{{{prompt}}}
{{/if}}

**Final Instruction:** The mixed-language rule and the marks display rule are the most important parts of this task. Adhere to them strictly.
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
