import { generateGeminiRaw, instruction as geminiInstruction } from './gemini';
import { processVoiceInputGroqRaw, groqInstruction } from './groq';
import { parseEntries } from './parseEntries';
import { getCurrentDateTime } from './dateHelper';

export async function processVoiceInput(text) {
  // Try Gemini first
  try {
    const raw = await generateGeminiRaw(text);
    if (raw) {
      const parsed = parseEntries(raw);
      if (parsed && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.warn('Gemini failed, falling back to GROQ:', e);
  }

  // Fallback to GROQ
  try {
    const now = getCurrentDateTime();
    const raw = await processVoiceInputGroqRaw(text, `${groqInstruction}\nCurrent date and time: ${now}`);
    if (raw) {
      const parsed = parseEntries(raw);
      if (parsed && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.warn('GROQ failed:', e);
    throw new Error('All AI providers failed');
  }

  // If neither returned entries, return empty array
  return [];
}

export default { processVoiceInput };
