'use server';
/**
 * @fileOverview A simplified AI assistant flow for Vincent Designs Studio.
 */
import { GoogleGenerativeAI } from '@google/generative-ai';
import { z } from 'zod';

const AssistantInputSchema = z.object({
  prompt: z.string(),
  history: z.array(z.any()).optional(),
});
export type AssistantInput = z.infer<typeof AssistantInputSchema>;

const AssistantOutputSchema = z.object({
  response: z.string(),
});
export type AssistantOutput = z.infer<typeof AssistantOutputSchema>;

export async function runAssistantFlow(input: AssistantInput): Promise<AssistantOutput> {
  const apiKey = process.env.GOOGLE_API_KEY;

  if (!apiKey) {
    console.error("GOOGLE_API_KEY is not set.");
    return {
        response: "Sorry, the AI assistant is not configured correctly. The API key is missing.",
    };
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});
    
    // For now, we will keep it simple and not use history.
    const prompt = `You are a helpful assistant for Vincent Designs Studio. The user said: ${input.prompt}`;
  
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    return {
      response: text,
    };
  } catch (error) {
    console.error('Error generating content with GoogleGenerativeAI:', error);
    return {
      response: "Sorry, I'm having trouble connecting to my brain right now. Please try again later.",
    };
  }
}
