import { GoogleGenAI } from '@google/genai';
import { parseEntries } from './parseEntries';
import { getCurrentDateTime } from './dateHelper';

const gemini = new GoogleGenAI({
	apiKey: import.meta.env.VITE_GEMINI_API_KEY,
});

export const instruction = `You are a Time-management / productivity coach / Life coach. Extract activity and return ONLY JSON (without additional text) in this format: { "date": "yyyy-mm-dd", "time": "hh:mm", "activity": "title" }. User's speech can contain long sentence and several activities. Extract each activity in a separate JSON. Shorten activity title as much as possible. User can speak in english or russian. If user speaks in russian return activity title in russian. Date and time should match with the user system's date and time. If user doesn't specify date, use current date. If user doesn't specify time, use current time.`;

async function generateGeminiRaw(text) {
	const now = getCurrentDateTime();

	const response = await gemini.models.generateContent({
		model: 'gemini-2.5-flash-test',
		contents: text,
		config: {
			systemInstruction: instruction + ` Current date and time: ${now}`,
			thinkingLevel: 'minimal',
		},
	});

	const raw = response.text?.trim() ?? '';
	return raw;
}

async function processVoiceInput(text) {
	const raw = await generateGeminiRaw(text);
	if (!raw) return [];
	return parseEntries(raw);
}

export { generateGeminiRaw, processVoiceInput };
export default gemini;

