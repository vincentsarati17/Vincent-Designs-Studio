
'use server';
/**
 * @fileOverview A simplified AI assistant flow for Namib Essence Designs.
 */
import { ai } from '@/ai/genkit';
import { generate } from 'genkit/ai';
import { z } from 'zod';
import { gemini15Flash } from '@genkit-ai/googleai';

const AssistantInputSchema = z.object({
  history: z
    .array(
      z.object({
        role: z.enum(['user', 'model']),
        content: z.string(),
      })
    )
    .optional(),
  prompt: z.string(),
});
export type AssistantInput = z.infer<typeof AssistantInputSchema>;

const AssistantOutputSchema = z.object({
  response: z.string(),
});
export type AssistantOutput = z.infer<typeof AssistantOutputSchema>;

export const assistantFlow = ai.defineFlow(
  {
    name: 'assistantFlow',
    inputSchema: AssistantInputSchema,
    outputSchema: AssistantOutputSchema,
  },
  async (input) => {
    // For now, ignore history and just use the prompt.
    const response = await generate({
      model: gemini15Flash,
      prompt: `You are a helpful assistant. The user said: ${input.prompt}`,
    });

    return {
      response: response.text(),
    };
  }
);
