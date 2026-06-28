import { parseEntries } from './parseEntries';

export const groqInstruction = `Extract activities from user's speech about what they are doing or planning to do.
Rules:
- Combine related words into ONE activity title (e.g. "тестирую приложение" = one activity "Тестирование приложения", NOT two separate activities)
- Only split into multiple JSON objects if user clearly mentions DIFFERENT, UNRELATED activities (e.g. "иду спать, потом буду готовить завтрак" = two activities)
- Keep activity title short (2-4 words)
- Return ONLY valid JSON, no extra text
- Format: { "date": "yyyy-mm-dd", "time": "hh:mm", "activity": "title" }
- If multiple activities: return a JSON array of objects
- If user speaks Russian, write activity in Russian
- Use the provided current date/time if user doesn't specify one`;

export async function processVoiceInputGroqRaw(text, instruction) {
	const url = 'https://api.groq.com/openai/v1/chat/completions';

	const body = {
		model: 'llama-3.1-8b-instant',
		messages: [
			{ role: 'system', content: instruction },
			{ role: 'user', content: text },
		],
	};

	const res = await fetch(url, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(body),
	});

	if (!res.ok) {
		const textError = await res.text();
		throw new Error(`GROQ API error: ${res.status} ${res.statusText} - ${textError}`);
	}

	const data = await res.json();
	return data?.choices?.[0]?.message?.content ?? null;
}

export async function processVoiceInputGroq(text, instruction) {
	const raw = await processVoiceInputGroqRaw(text, instruction);
	if (!raw) return [];
	return parseEntries(raw);
}