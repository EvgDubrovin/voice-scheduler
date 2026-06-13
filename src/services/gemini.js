import { GoogleGenAI } from '@google/genai';

const gemini = new GoogleGenAI({
  apiKey: import.meta.env.VITE_GEMINI_API_KEY,
});

const instruction = `You are a Time-management / productivity coach / Life coach. Extract activity and return ONLY JSON (without additional text) in this format: { "date": "yyyy-mm-dd", "time": "hh:mm", "activity": "title" }. User's speech can contain long sentence and several activities. Extract each activity in a separate JSON. Shorten activity title as much as possible. User can speak in english or russian. If user speaks in russian return activity title in russian. Date and time should match with the user system's date and time. If user doesn't specify date, use current date. If user doesn't specify time, use current time.`;

async function processVoiceInput(text) {
  const now = new Date().toLocaleString('ru-RU', {
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit',
  }); 
  const response = await gemini.models.generateContent({
    model: 'gemini-3.5-flash',
    contents: text,
    config: {
      systemInstruction: instruction + `Current date and time: ${now}`,  
    //   thinkingLevel: 'medium',
    },
  });

  return response.text?.trim() ?? '';
}

export { processVoiceInput };
export default gemini;