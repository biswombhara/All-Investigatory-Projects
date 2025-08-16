'use server';

import { ai } from './genkit.js';
import { z } from 'zod';

const SummaryInputSchema = z.object({
  title: z.string().describe('The title of the document.'),
  subject: z.string().describe('The subject category of the document.'),
});

const SummaryResponseSchema = z.object({
  summary: z.string().describe('A concise, one-paragraph summary of what the document is likely about, written for a student audience. The summary should be based on the provided title and subject.'),
});

const summaryPrompt = ai.definePrompt({
    name: 'summaryPrompt',
    input: { schema: SummaryInputSchema },
    output: { schema: SummaryResponseSchema },
    prompt: `You are an expert academic assistant. Your task is to generate a helpful, one-paragraph summary of a document based on its title and subject. This summary will help students quickly understand if the document is relevant for them.

    Document Title: {{{title}}}
    Subject: {{{subject}}}
    
    Based on this information, please generate a concise summary.
    `,
});

export const summarizeDocumentFlow = ai.defineFlow(
  {
    name: 'summarizeDocumentFlow',
    inputSchema: SummaryInputSchema,
    outputSchema: SummaryResponseSchema,
  },
  async (input) => {
    const { output } = await summaryPrompt(input);
    return output;
  }
);
