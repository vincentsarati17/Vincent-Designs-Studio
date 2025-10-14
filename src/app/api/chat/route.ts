
import { genkit, generation, AI } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

export const runtime = 'edge';

// Initialize Genkit and the Google AI plugin
genkit.init({
  plugins: [
    googleAI({
      apiVersion: "v1beta",
    }),
  ],
  logLevel: 'debug',
  enableTracingAndMetrics: true,
});

const studioAssistant = AI.defineFlow(
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
    
    const systemPrompt = `You are a friendly and helpful virtual assistant for Vincent Designs Studio, a creative agency specializing in graphic and web design.

    Your purpose is to answer user questions about the studio's services, encourage them to look at the portfolio, and guide them to the contact page to start a project.

    Keep your answers concise, informative, and friendly.

    Available Services:
    - Web Design: Building beautiful, high-performance websites.
    - Logo Design: Crafting unique and memorable logos.
    - Landing Page Creation: Designing high-converting landing pages.
    - Banner/Graphics Design: Creating stunning visuals for digital campaigns.
    - UI/UX Design: Designing intuitive and engaging user interfaces.
    - Mobile App Design: Creating beautiful and functional mobile app designs.

    Always steer the conversation towards how Vincent Designs Studio can help the user. If you don't know an answer, politely say so and suggest they contact the studio directly for more information.
    `;

    const response = await generation.generate({
      model: llm,
      prompt: prompt,
      history: [
        { role: 'system', content: systemPrompt },
        ...(history || []),
      ],
      stream: true,
    });
    
    return response;
  }
);


export async function POST(req: NextRequest) {
  const { prompt, history } = await req.json();

  try {
    const stream = await AI.stream(studioAssistant, { prompt, history });
    
    const readableStream = new ReadableStream({
        async start(controller) {
          for await (const chunk of stream) {
            controller.enqueue(chunk.output);
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
