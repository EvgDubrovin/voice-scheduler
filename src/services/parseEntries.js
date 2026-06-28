export function parseEntries(raw) {
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
