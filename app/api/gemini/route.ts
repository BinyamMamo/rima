import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';

/** Text generation. The key stays on the server, so it never ships in the browser bundle. */
export async function POST(request: Request) {
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    return NextResponse.json({ error: 'GEMINI_API_KEY is not set on the server.' }, { status: 500 });
  }

  const { prompt, context } = (await request.json()) as { prompt?: string; context?: string };
  if (!prompt) {
    return NextResponse.json({ error: 'A prompt is required.' }, { status: 400 });
  }

  const fullPrompt = context
    ? `Context: ${context}\n\nUser: ${prompt}\n\nPlease provide a concise and helpful response.`
    : prompt;

  try {
    const ai = new GoogleGenAI({ vertexai: false, apiKey: key });
    const response = await ai.models.generateContent({
      model: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
      contents: fullPrompt,
    });
    const text = response.candidates?.[0]?.content?.parts?.[0]?.text;
    return NextResponse.json({ text: text ?? '' });
  } catch (error) {
    console.error('Gemini request failed:', error);
    return NextResponse.json({ error: 'The model could not be reached.' }, { status: 502 });
  }
}
