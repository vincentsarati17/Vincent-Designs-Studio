
'use server';
import { gemini15Flash, googleAI } from '@genkit-ai/googleai';
import { genkit } from 'genkit';

export const ai = genkit({
  plugins: [
    googleAI({
      apiKey: process.env.API_KEY,
    }),
  ],
  logLevel: 'debug',
  enableTracing: true,
});
