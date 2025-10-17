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

type BitrixLeadAddRequest = {
  fields: {
    TITLE: string;
    NAME: string;
    LAST_NAME: string;
    PHONE: Array<{
      VALUE: string;
      VALUE_TYPE: 'WORK' | 'HOME' | 'MOBILE' | string;
    }>;
    EMAIL: Array<{ VALUE: string; VALUE_TYPE: 'WORK' | 'HOME' | string }>;
    SOURCE_ID: string;
    COMMENTS?: string;
    // Add any UF_* custom fields here if you later need them
  };
};

type BitrixLeadAddSuccess = { result: number };
type BitrixErrorShape = { error?: string; error_description?: string };

// -------- Google Sheets helpers --------
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
    requestBody: { values: [values] },
  });
}

// -------- Bitrix helpers --------
function isRecord(x: unknown): x is Record<string, unknown> {
  return typeof x === 'object' && x !== null;
}
function isBitrixSuccess(x: unknown): x is BitrixLeadAddSuccess {
  return isRecord(x) && typeof x.result === 'number';
}
function parseJson(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    // keep it explicit for error context
    throw new Error(`Bitrix returned non-JSON: ${text.slice(0, 200)}`);
  }
}

/**
 * Send lead to Bitrix24 via webhook.
 * Docs: https://apidocs.bitrix24.com/api-reference/crm/leads/crm-lead-add.html
 */
async function sendToBitrix(
  payload: LeadPayload,
  timestampISO: string,
): Promise<{ ok: true; leadId: number }> {
  const endpoint = process.env.BITRIX_WEBHOOK_URL;
  if (!endpoint) throw new Error('Missing BITRIX_WEBHOOK_URL');

  const fullPhone = `${payload.dialCode} ${payload.phone}`.trim();
  const title =
    `Website Lead – ${payload.firstName} ${payload.lastName}`.trim();

  const commentsLines = [
    `Source Path: ${payload.path ?? ''}`,
    `Preferred Language: ${payload.language ?? ''}`,
    `Golden Visa: ${payload.goldenVisa ? 'Yes' : 'No'}`,
    `Consent: ${payload.consent ? 'Yes' : 'No'}`,
    `Submitted At: ${timestampISO}`,
  ];

  const body: BitrixLeadAddRequest = {
    fields: {
      TITLE: title,
      NAME: payload.firstName,
      LAST_NAME: payload.lastName,
      PHONE: [{ VALUE: fullPhone, VALUE_TYPE: 'WORK' }],
      EMAIL: [{ VALUE: payload.email, VALUE_TYPE: 'WORK' }],
      SOURCE_ID: 'WEB',
      COMMENTS: commentsLines.join('\n'),
    },
  };

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);

  try {
    const res = await fetch(`${endpoint}crm.lead.add.json`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    clearTimeout(timeout);

    const text = await res.text();
    const json = parseJson(text);

    // Bitrix often returns 200 even on logical errors. Inspect the shape.
    if (isBitrixSuccess(json)) {
      return { ok: true, leadId: json.result };
    }

    // Extract error shape safely (no `any`)
    const errObj: BitrixErrorShape = isRecord(json)
      ? {
          error: typeof json.error === 'string' ? json.error : undefined,
          error_description:
            typeof json.error_description === 'string'
              ? json.error_description
              : undefined,
        }
      : {};

    const errMsg =
      errObj.error_description || errObj.error || `HTTP ${res.status}`;
    throw new Error(`Bitrix error: ${errMsg}`);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Bitrix request failed';
    throw new Error(msg);
  }
}

// -------- Route --------
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

    // 1) Always write to Google Sheets (SoR)
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

    // 2) Try Bitrix; do not block Sheets on Bitrix failure
    let bitrixOk = false;
    let bitrixLeadId: number | null = null;
    try {
      const bitrixRes = await sendToBitrix(data, timestamp);
      bitrixOk = bitrixRes.ok;
      bitrixLeadId = bitrixRes.leadId;
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Unknown Bitrix error';
      console.error('Bitrix send error:', msg);
      bitrixOk = false;
    }

    return NextResponse.json(
      { ok: true, bitrixOk, bitrixLeadId },
      { status: 200 },
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('Lead POST error:', message);
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
