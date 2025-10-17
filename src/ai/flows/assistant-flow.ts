
'use server';
/**
 * @fileOverview A simplified AI assistant flow for Namib Essence Designs.
 */
import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { gemini15Flash } from '@genkit-ai/googleai';

const AssistantInputSchema = z.object({
  prompt: z.string(),
  // History is not used for now to keep it simple, but schema is kept for compatibility
  history: z.array(z.any()).optional(),
});
export type AssistantInput = z.infer<typeof AssistantInputSchema>;

const AssistantOutputSchema = z.object({
  response: z.string(),
});
export type AssistantOutput = z.infer<typeof AssistantOutputSchema>;


const assistantFlow = ai.defineFlow(
  {
    name: 'assistantFlow',
    inputSchema: AssistantInputSchema,
    outputSchema: AssistantOutputSchema,
  },
  async (input) => {
    const { text } = await ai.generate({
      model: gemini15Flash,
      prompt: `You are a helpful assistant for Vincent Designs Studio. The user said: ${input.prompt}`,
    });

    return {
      response: text,
    };
  }
);

export async function runAssistantFlow(input: AssistantInput): Promise<AssistantOutput> {
    return await assistantFlow(input);
}
