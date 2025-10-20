'use server';

import { googleAI } from '@genkit-ai/google-genai';
import { genkit } from 'genkit';

export const ai = genkit({
  plugins: [
    googleAI(),
  ],
  logLevel: 'debug',
  enableTracing: true,
});
