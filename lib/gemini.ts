import { GoogleGenAI } from '@google/genai';

const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

export async function generateGeminiResponse(prompt: string, context?: string): Promise<string> {
    if (!GEMINI_API_KEY) {
        console.error('Missing Gemini API Key');
        return "I'm sorry, I can't access my brain right now (API Key missing).";
    }

    const fullPrompt = context
        ? `Context: ${context}\n\nUser: ${prompt}\n\nPlease provide a concise and helpful response.`
        : prompt;

    try {
        const ai = new GoogleGenAI({
            vertexai: false,
            apiKey: GEMINI_API_KEY
        });

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: fullPrompt
        });

        const candidate = response.candidates?.[0];
        const text = candidate?.content?.parts?.[0]?.text;

        if (text) {
            return text;
        } else {
            return "I didn't get a response.";
        }

    } catch (error) {
        console.error('Gemini Request Failed:', error);
        return "Something went wrong while thinking.";
    }
}
