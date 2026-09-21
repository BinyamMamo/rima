/** Calls the server route, so the API key never reaches the browser. */
export async function generateGeminiResponse(prompt: string, context?: string): Promise<string> {
  try {
    const response = await fetch('/api/gemini', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, context }),
    });

    if (!response.ok) {
      return "I'm sorry, I can't reach my brain right now.";
    }

    const data = (await response.json()) as { text?: string };
    return data.text?.trim() || "I didn't get a response.";
  } catch (error) {
    console.error('Gemini request failed:', error);
    return 'Something went wrong while thinking.';
  }
}
