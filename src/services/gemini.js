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
      systemInstruction: instruction + ` Current date and time: ${now}`,
      thinkingLevel: 'minimal',
    },
  });

  const raw = response.text?.trim() ?? '';
  if (!raw) return [];

  // Try full JSON parse first (handles arrays and single objects)
  let results = [];
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) results = parsed;
    else if (parsed && typeof parsed === 'object') results = [parsed];
  } catch {
    // If not valid JSON, try to extract a JSON array substring
    const arrayMatch = raw.match(/\[[\s\S]*\]/);
    if (arrayMatch) {
      try {
        const parsed = JSON.parse(arrayMatch[0]);
        if (Array.isArray(parsed)) results = parsed;
      } catch {
        // fallthrough
      }
    }

    // Fallback: extract individual JSON objects like { ... }
    if (results.length === 0) {
      const objMatches = raw.match(/\{[\s\S]*?\}/g);
      if (objMatches) {
        for (const m of objMatches) {
          try {
            const o = JSON.parse(m);
            if (o && typeof o === 'object') results.push(o);
          } catch {
            // ignore parse errors per object
          }
        }
      }
    }
  }

  return results;
}

export { processVoiceInput };
export default gemini;