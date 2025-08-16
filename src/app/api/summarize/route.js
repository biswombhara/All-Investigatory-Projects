import { summarizeDocumentFlow } from '../../../ai/summarize.js';

export async function POST(req) {
  try {
    const { title, subject } = await req.json();

    if (!title || !subject) {
      return new Response(
        JSON.stringify({ error: 'Title and subject are required.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    const result = await summarizeDocumentFlow({ title, subject });

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in summarize API route:', error);
    return new Response(JSON.stringify({ error: 'An unexpected error occurred.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
