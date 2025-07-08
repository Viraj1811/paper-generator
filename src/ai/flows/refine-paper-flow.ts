'use server';
/**
 * @fileOverview An AI flow for refining an existing question paper.
 *
 * - refinePaper - A function that handles the paper refinement process.
 * - RefinePaperInput - The input type for the refinePaper function.
 * - RefinePaperOutput - The return type for the refinePaper function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RefinePaperInputSchema = z.object({
  questionPaper: z.string().describe('The original question paper in Markdown format.'),
  prompt: z.string().describe('The user\'s instructions for how to change the paper.'),
});
export type RefinePaperInput = z.infer<typeof RefinePaperInputSchema>;

const RefinePaperOutputSchema = z.object({
  refinedPaper: z.string().describe('The refined question paper in Markdown format.'),
});
export type RefinePaperOutput = z.infer<typeof RefinePaperOutputSchema>;

export async function refinePaper(
  input: RefinePaperInput
): Promise<RefinePaperOutput> {
  return refinePaperFlow(input);
}

const prompt = ai.definePrompt({
  name: 'refinePaperPrompt',
  input: {schema: RefinePaperInputSchema},
  output: {schema: RefinePaperOutputSchema},
  prompt: `You are an expert educational content editor. Your task is to modify an existing question paper based on a user's specific instructions.

You must edit the 'Original Question Paper' provided below according to the 'User's Instructions'.

**Key Rules:**
1.  **Follow Instructions Precisely:** Adhere strictly to the user's prompt. If they ask to replace 5 questions, replace exactly 5. If they ask to add questions on a specific topic, ensure the new questions are relevant to that topic.
2.  **Maintain Formatting:** The output must be valid markdown. Preserve the original structure, headings, question numbering, and marks format (e.g., "(X Marks)") unless the user explicitly asks to change it.
3.  **Ensure Quality:** The refined paper should remain coherent, grammatically correct, and appropriate for the original paper's context (subject, grade, etc.).
4.  **Output Only the Paper:** Your final output should only be the complete, refined question paper markdown. Do not include any extra commentary or explanation.

**User's Instructions:**
---
{{{prompt}}}
---

**Original Question Paper:**
---
{{{questionPaper}}}
---
`,
});

const refinePaperFlow = ai.defineFlow(
  {
    name: 'refinePaperFlow',
    inputSchema: RefinePaperInputSchema,
    outputSchema: RefinePaperOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
