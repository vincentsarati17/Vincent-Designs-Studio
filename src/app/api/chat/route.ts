
'use server';

import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

export const runtime = 'nodejs';

// Initialize Genkit with the Google AI plugin
const ai = genkit({
  plugins: [
    googleAI({
      apiVersion: "v1beta",
    }),
  ],
  logLevel: 'debug',
  enableTracingAndMetrics: true,
});

const studioAssistantSchema = z.object({
  prompt: z.string(),
  history: z.array(z.any()).optional(),
});

export async function POST(req: NextRequest) {
  const { prompt, history } = await req.json();

  try {
    const parsedInput = studioAssistantSchema.parse({ prompt, history });
    
    const systemPrompt = `You are a friendly, professional, and encouraging virtual assistant for Vincent Designs Studio, a creative agency specializing in graphic and web design. Your persona is that of a creative partner.

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
      ...(parsedInput.history || []).map(msg => ({ role: msg.role === 'assistant' ? 'model' : 'user', parts: [{text: msg.content}]})),
    ];

    const response = await ai.generate({
      model: 'gemini-1.5-flash-latest',
      prompt: parsedInput.prompt,
      history: fullHistory,
      stream: true,
    });
    
    const stream = response.stream();

    // Transform the stream for Next.js ReadableStream
    const readableStream = new ReadableStream({
        async start(controller) {
          for await (const chunk of stream) {
            const text = chunk.text;
            if (text) {
                controller.enqueue(new TextEncoder().encode(text));
            }
          }
          controller.close();
        },
      });

    return new Response(readableStream, {
        headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });

  } catch (error) {
    console.error('Error processing chat stream:', error);
    let errorMessage = 'An error occurred while processing your request.';
    if (error instanceof z.ZodError) {
      errorMessage = 'Invalid request body.';
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
