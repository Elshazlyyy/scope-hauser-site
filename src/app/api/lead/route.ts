import { NextResponse } from 'next/server';
import { google } from 'googleapis';

type LeadPayload = {
  firstName: string;
  lastName: string;
  dialCode: string;
  phone: string;
  email: string;
  language?: string;
  goldenVisa?: boolean;
  consent?: boolean;
  path?: string;
  timestamp?: string;
};

function getJwtClient() {
  const clientEmail = process.env.GOOGLE_SA_EMAIL;
  const privateKey = process.env.GOOGLE_SA_PRIVATE_KEY?.replace(/\\n/g, '\n');
  if (!clientEmail || !privateKey) {
    throw new Error('Missing GOOGLE_SA_EMAIL or GOOGLE_SA_PRIVATE_KEY');
  }
  return new google.auth.JWT({
    email: clientEmail,
    key: privateKey,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
}

async function appendToSheet(
  values: (string | number | boolean)[],
): Promise<void> {
  const sheetId = process.env.GOOGLE_SHEET_ID!;
  const tab = process.env.GOOGLE_SHEET_TAB || 'Sheet1';

  const auth = getJwtClient();
  const sheets = google.sheets({ version: 'v4', auth });

  await sheets.spreadsheets.values.append({
    spreadsheetId: sheetId,
    range: `${tab}!A1`,
    valueInputOption: 'RAW',
    requestBody: {
      values: [values],
    },
  });
}

export async function POST(req: Request) {
  try {
    const data = (await req.json()) as LeadPayload;

    if (
      !data.firstName ||
      !data.lastName ||
      !data.dialCode ||
      !data.phone ||
      !data.email
    ) {
      return NextResponse.json(
        { ok: false, error: 'Missing required fields' },
        { status: 400 },
      );
    }
    if (!data.consent) {
      return NextResponse.json(
        { ok: false, error: 'Consent required' },
        { status: 400 },
      );
    }

    const timestamp = new Date().toISOString();
    const fullPhone = `${data.dialCode} ${data.phone}`.trim();

    const row: (string | number | boolean)[] = [
      timestamp,
      data.firstName,
      data.lastName,
      data.dialCode,
      data.phone,
      fullPhone,
      data.email,
      data.language || '',
      data.goldenVisa ? 'TRUE' : 'FALSE',
      data.consent ? 'TRUE' : 'FALSE',
      data.path || '',
    ];

    await appendToSheet(row);

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('Lead POST error:', message);
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
