
import { googleAI } from '@genkit-ai/google-genai';
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
