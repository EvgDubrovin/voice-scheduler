import { GoogleGenAI } from '@google/genai';

const gemini = new GoogleGenAI({
  apiKey: import.meta.env.VITE_GEMINI_API_KEY,
});

const instruction = `You are a Time-management / productivity coach / Life coach. Extract activity and return ONLY JSON (without additional text) in this format: { "date": "yyyy-mm-dd", "time": "hh:mm", "activity": "title" }. User's speech can contain long sentence and several activities. Extract each activity in a separate JSON. User can speak in english or russian. If user speaks in russian return activity title in russian. Date and time should match with the user system's date and time. If user doesn't specify date, use current date. If user doesn't specify time, use current time.`;

async function processVoiceInput(text) {
  const now = new Date().toISOString();  
  const response = await gemini.models.generateContent({
    model: 'gemini-3.5-flash',
    contents: text,
    config: {
      systemInstruction: instruction + ` Current date and time: ${now}`,  
      thinkingLevel: 'minimal',
    },
  });

  return response.text?.trim() ?? '';
}

export { processVoiceInput };
export default gemini;