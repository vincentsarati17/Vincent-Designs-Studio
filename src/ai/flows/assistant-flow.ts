'use server';
/**
 * @fileOverview A simplified AI assistant flow for Vincent Designs Studio, implemented with Genkit.
 *
 * This file defines a Genkit flow that takes a user's prompt and returns a response from the AI.
 * It is designed to be called from a Next.js client component.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import type { AssistantInput, AssistantOutput } from '@/lib/ai-types';
import { AssistantInputSchema, AssistantOutputSchema } from '@/lib/ai-types';


// This is the exported wrapper function that will be called by the client component.
export async function runAssistantFlow(input: AssistantInput): Promise<AssistantOutput> {
  // We call the internal Genkit flow and return its output.
  const response = await assistantFlow(input);
  return { response };
}

// This is the internal Genkit flow definition. It is NOT exported.
const assistantFlow = ai.defineFlow(
  {
    name: 'assistantFlow',
    inputSchema: AssistantInputSchema,
    outputSchema: z.string(),
  },
  async (input) => {
    // Construct a system prompt to guide the AI's behavior.
    // For now, we are keeping history simple and just prepending the user's prompt.
    const systemPrompt = `You are a friendly and helpful assistant for Vincent Designs Studio, a web and graphic design agency in Namibia.
Keep your answers concise and helpful.
The user said: ${input.prompt}`;

    try {
      const { output } = await ai.generate({
        // Use the correct, prefixed model name for the googleAI plugin.
        model: 'googleai/gemini-pro',
        prompt: systemPrompt,
      });

      if (!output) {
        return "Sorry, I couldn't generate a response. Please try again.";
      }
      return output;

    } catch (error) {
      console.error('Error in Genkit assistantFlow:', error);
      return "Sorry, I'm having trouble connecting to the AI service. Please try again later.";
    }
  }
);
