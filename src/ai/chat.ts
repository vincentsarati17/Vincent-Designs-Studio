'use server';

import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';
import { z } from 'zod';
import { defineFlow } from 'genkit/flow';

// Initialize Genkit with the Google AI plugin
const ai = genkit({
  plugins: [
    googleAI({
      apiVersion: 'v1beta',
    }),
  ],
  logLevel: 'debug',
  enableTracingAndMetrics: true,
});

const studioAssistantSchema = z.object({
  prompt: z.string(),
  history: z.array(z.any()).optional(),
});

export const chatFlow = defineFlow(
  {
    name: 'chatFlow',
    inputSchema: studioAssistantSchema,
  },
  async ({ prompt, history }) => {
    const systemPrompt = `You are a friendly, professional, and encouraging virtual assistant named Vincent Designs Assistant for Vincent Designs Studio, a creative agency specializing in graphic and web design. Your persona is that of a creative partner.

    Your purpose is to answer user questions about the studio's services, encourage them to look at the portfolio, and guide them to the contact page to start a project.

    Keep your answers concise, informative, and friendly.

    Available Services:
    - Web Design: Building beautiful, high-performance websites.
    - Logo Design: Crafting unique and memorable logos.
    - Landing Page Creation: Designing high-converting landing pages.
    - Banner/Graphics Design: Creating stunning visuals for digital campaigns.
    - UI/UX Design: Designing intuitive and engaging user interfaces.
    - Mobile App Design: Creating beautiful and functional mobile app designs.

    Always steer the conversation towards how Vincent Designs Studio can help the user. If you don't know an answer to a question (like specific pricing or project timelines), politely say so and suggest they contact the studio directly for more information.
    `;

    const fullHistory = [
      { role: 'system', parts: [{ text: systemPrompt }] },
      ...(history || []).map((msg) => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }],
      })),
    ];

    const response = await ai.generate({
      model: 'gemini-1.5-flash-latest',
      prompt: prompt,
      history: fullHistory,
      stream: true,
    });

    return response.stream();
  }
);
