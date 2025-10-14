
'use server';

import { genkit, defineFlow, generate, streamFlow } from 'genkit';
import { configureGenkit } from 'genkit/core';
import { googleAI } from '@genkit-ai/google-genai';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

export const runtime = 'edge';

// Initialize Genkit and the Google AI plugin
configureGenkit({
  plugins: [
    googleAI({
      apiVersion: "v1beta",
    }),
  ],
  logLevel: 'debug',
  enableTracingAndMetrics: true,
});

const studioAssistant = defineFlow(
  {
    name: 'studioAssistant',
    inputSchema: z.object({
      prompt: z.string(),
      history: z.array(z.any()).optional(),
    }),
    outputSchema: z.any(),
  },
  async ({ prompt, history }) => {

    const llm = googleAI.model('gemini-1.5-flash-latest');
    
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
      { role: 'system', content: [{ text: systemPrompt }] },
      ...(history || []).map(msg => ({ role: msg.role === 'assistant' ? 'model' : 'user', content: [{text: msg.content}]})),
    ];

    const response = await generate({
      model: llm,
      prompt: prompt,
      history: fullHistory,
      stream: true,
    });
    
    return response;
  }
);


export async function POST(req: NextRequest) {
  const { prompt, history } = await req.json();

  try {
    const { stream } = await streamFlow(studioAssistant, { prompt, history });
    
    const readableStream = new ReadableStream({
        async start(controller) {
          const decoder = new TextDecoder();
          for await (const chunk of stream) {
            if (chunk.output) {
                // The output from a streaming flow is a JSON string.
                // We need to parse it to get the actual content.
                // It might send multiple JSON objects, so we handle that.
                const raw = decoder.decode(chunk.output as Uint8Array);
                const parts = raw.replace(/\]\[/g, '],[').split(',');
                for(const part of parts) {
                  try {
                    const parsed = JSON.parse(part);
                    if(parsed.content) {
                      controller.enqueue(parsed.content);
                    }
                  } catch(e) {
                    // Ignore parsing errors for incomplete JSON
                  }
                }
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
    return NextResponse.json(
      { error: 'An error occurred while processing your request.' },
      { status: 500 }
    );
  }
}
