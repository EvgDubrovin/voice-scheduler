// Services for interacting with Google Sheets API
async function ensureOk(response) {
	if (response.ok) return response;
	const text = await response.text();
	const err = new Error(`${response.status} ${response.statusText}: ${text}`);
	err.status = response.status;
	throw err;
}

// Create a new spreadsheet with the title "Voice Scheduler" and return its ID
export async function createSpreadsheet(accessToken) {
	if (!accessToken) throw new Error('accessToken is required');

	const url = 'https://sheets.googleapis.com/v4/spreadsheets';
	const body = {
		properties: { title: 'Voice Scheduler' },
		sheets: [{ properties: { title: 'Schedule' } }],
	};

	const res = await fetch(url, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${accessToken}`,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(body),
	});

	await ensureOk(res);
	const data = await res.json();
	return data.spreadsheetId;
}

// Append a row to the specified spreadsheet
export async function appendRow(accessToken, spreadsheetId, entry) {
	if (!accessToken) throw new Error('accessToken is required');
	if (!spreadsheetId) throw new Error('spreadsheetId is required');
	if (!entry || typeof entry !== 'object') throw new Error('entry object is required');

	const range = 'Schedule!A:C';
	const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}:append?valueInputOption=RAW`;

	const body = { values: [[entry.date ?? '', entry.time ?? '', entry.activity ?? '']] };

	const res = await fetch(url, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${accessToken}`,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(body),
	});

	await ensureOk(res);
	return res.json();
}

export default { createSpreadsheet, appendRow };
