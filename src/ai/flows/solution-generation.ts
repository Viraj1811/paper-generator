
'use server';
/**
 * @fileOverview AI-powered solution generation for a given question paper.
 *
 * - generateSolution - A function that handles the solution generation process.
 * - GenerateSolutionInput - The input type for the generateSolution function.
 * - GenerateSolutionOutput - The return type for the generateSolution function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSolutionInputSchema = z.object({
  questionPaper: z.string().describe('The question paper in Markdown format.'),
});
export type GenerateSolutionInput = z.infer<
  typeof GenerateSolutionInputSchema
>;

const GenerateSolutionOutputSchema = z.object({
  solution: z.string().describe('The generated solution in Markdown format.'),
});
export type GenerateSolutionOutput = z.infer<
  typeof GenerateSolutionOutputSchema
>;

export async function generateSolution(
  input: GenerateSolutionInput
): Promise<GenerateSolutionOutput> {
  return generateSolutionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateSolutionPrompt',
  input: {schema: GenerateSolutionInputSchema},
  output: {schema: GenerateSolutionOutputSchema},
  prompt: `You are an expert teacher and your task is to provide a detailed, step-by-step solution for the following question paper. The solutions should be clear, accurate, and easy to understand for the specified grade level.

**Instructions:**
1.  **Follow the original structure:** Maintain the same sections (e.g., Section A, Section B) and question numbering as the original paper.
2.  **Provide detailed answers:** For each question, provide a comprehensive answer.
    *   **MCQs:** State the correct option letter and the full correct answer. Briefly explain why it is correct.
    *   **Short/Long Answers:** Provide a well-structured and complete answer. For numerical problems, show the steps involved in reaching the solution.
3.  **Language Consistency:** Generate the solutions in the same language as the question paper. Do not translate anything.
4.  **Formatting:** The entire output MUST be a single, valid markdown string. Use a main heading (#) for the solution paper title (e.g., # Solutions). Use subheadings (##) for section titles.

**Question Paper to Solve:**
---
{{{questionPaper}}}
---
`,
});

const generateSolutionFlow = ai.defineFlow(
  {
    name: 'generateSolutionFlow',
    inputSchema: GenerateSolutionInputSchema,
    outputSchema: GenerateSolutionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
