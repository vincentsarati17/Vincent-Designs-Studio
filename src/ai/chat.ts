
'use server';

import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

// This file is not directly used by the API route anymore,
// but is kept for reference or future use with Genkit flows.

// Initialize Genkit with the Google AI plugin
export const ai = genkit({
  plugins: [
    googleAI({
      apiVersion: 'v1beta',
    }),
  ],
  logLevel: 'debug',
  enableTracingAndMetrics: true,
});
