'use server';

import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';

// This is a simplified initialization. In a real app, you might have more
// configuration options for plugins, logging, etc.
export const ai = genkit({
  plugins: [
    googleAI({
      // Specify the API key if it's set in environment variables.
      // Make sure GOOGLE_GENAI_API_KEY is set in your .env.local file.
      apiKey: process.env.GOOGLE_GENAI_API_KEY,
    }),
  ],
  // We recommend using a logger in production.
  logLevel: 'debug',
  // We recommend using a tracer in production.
  enableTracing: true,
});
