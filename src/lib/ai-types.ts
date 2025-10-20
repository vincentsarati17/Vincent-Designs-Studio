import { z } from 'zod';

export const AssistantInputSchema = z.object({
  prompt: z.string(),
  history: z.array(z.any()).optional(),
});
export type AssistantInput = z.infer<typeof AssistantInputSchema>;

export const AssistantOutputSchema = z.object({
  response: z.string(),
});
export type AssistantOutput = z.infer<typeof AssistantOutputSchema>;
