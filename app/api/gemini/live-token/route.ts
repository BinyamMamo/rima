import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';

/**
 * Mints a short-lived token for voice mode. The live API runs in the browser, so it gets a token
 * that expires in a few minutes instead of the account key.
 */
export async function POST() {
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    return NextResponse.json({ error: 'GEMINI_API_KEY is not set on the server.' }, { status: 500 });
  }

  try {
    const ai = new GoogleGenAI({ vertexai: false, apiKey: key, httpOptions: { apiVersion: 'v1alpha' } });
    const token = await ai.authTokens.create({
      config: {
        uses: 1,
        expireTime: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
        newSessionExpireTime: new Date(Date.now() + 2 * 60 * 1000).toISOString(),
      },
    });
    return NextResponse.json({ token: token.name });
  } catch (error) {
    console.error('Could not create a live token:', error);
    return NextResponse.json({ error: 'Voice mode is unavailable right now.' }, { status: 502 });
  }
}
