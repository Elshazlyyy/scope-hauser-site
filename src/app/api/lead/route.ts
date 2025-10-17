import { NextResponse } from 'next/server';
import { google } from 'googleapis';

// Ensure Node.js runtime (googleapis won't work on Edge)
export const runtime = 'nodejs';
// Always compute fresh (no ISR cache for API)
export const dynamic = 'force-dynamic';

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

type BitrixLeadAddSuccess = { result: number };

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
    // Add UF_* codes here if you later need custom fields, e.g. "UF_CRM_XXXX": "value"
  };
};

// ------------- Small utils & guards -------------
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
    throw new Error(`Non-JSON response: ${text.slice(0, 200)}`);
  }
}

function normalizePhone(dialCode: string, phone: string): string {
  const cleanDial = dialCode.trim();
  const cleanPhone = phone.replace(/[^\d+]/g, '').trim();
  return `${cleanDial} ${cleanPhone}`.trim();
}

function toFormUrlEncoded(body: Record<string, unknown>): string {
  const params = new URLSearchParams();
  const flatten = (prefix: string, value: unknown) => {
    if (Array.isArray(value)) {
      value.forEach((v, i) => flatten(`${prefix}[${i}]`, v));
    } else if (typeof value === 'object' && value !== null) {
      for (const [k, v] of Object.entries(value)) flatten(`${prefix}[${k}]`, v);
    } else if (value !== undefined && value !== null) {
      params.append(prefix, String(value));
    }
  };
  for (const [k, v] of Object.entries(body)) flatten(k, v);
  return params.toString();
}

// ------------- Google Sheets helpers -------------
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
  const sheetId = process.env.GOOGLE_SHEET_ID;
  if (!sheetId) throw new Error('Missing GOOGLE_SHEET_ID');
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

// ------------- Bitrix helpers -------------
async function sendToBitrix(
  payload: LeadPayload,
  timestampISO: string,
): Promise<{ ok: true; leadId: number }> {
  const endpoint = process.env.BITRIX_WEBHOOK_URL;
  if (!endpoint) throw new Error('Missing BITRIX_WEBHOOK_URL');

  const fullPhone = normalizePhone(payload.dialCode, payload.phone);
  const title =
    `Website Lead – ${payload.firstName} ${payload.lastName}`.trim();

  const fields: BitrixLeadAddRequest['fields'] = {
    TITLE: title,
    NAME: payload.firstName,
    LAST_NAME: payload.lastName,
    PHONE: [{ VALUE: fullPhone, VALUE_TYPE: 'WORK' }],
    EMAIL: [{ VALUE: payload.email, VALUE_TYPE: 'WORK' }],
    SOURCE_ID: 'WEB',
    COMMENTS: [
      `Source Path: ${payload.path ?? ''}`,
      `Preferred Language: ${payload.language ?? ''}`,
      `Golden Visa: ${payload.goldenVisa ? 'Yes' : 'No'}`,
      `Consent: ${payload.consent ? 'Yes' : 'No'}`,
      `Submitted At: ${timestampISO}`,
    ].join('\n'),
  };

  const url = `${endpoint}crm.lead.add.json`;

  // Attempt 1: JSON
  {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fields }),
      signal: controller.signal,
    }).finally(() => clearTimeout(timeout));

    const text = await res.text();
    let json: unknown;
    try {
      json = parseJson(text);
      if (res.ok && isBitrixSuccess(json)) {
        return { ok: true, leadId: (json as BitrixLeadAddSuccess).result };
      }
      // fall through to form retry below
    } catch {
      // fall through to form retry below
    }
  }

  // Attempt 2: application/x-www-form-urlencoded
  {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: toFormUrlEncoded({ fields }),
      signal: controller.signal,
    }).finally(() => clearTimeout(timeout));

    const text = await res.text();
    const json = parseJson(text);

    if (res.ok && isBitrixSuccess(json)) {
      return { ok: true, leadId: (json as BitrixLeadAddSuccess).result };
    }

    const errMsg =
      (isRecord(json) &&
        typeof json.error_description === 'string' &&
        json.error_description) ||
      (isRecord(json) && typeof json.error === 'string' && json.error) ||
      `HTTP ${res.status} ${text.slice(0, 200)}`;
    throw new Error(String(errMsg));
  }
}

// ------------- Route -------------
export async function POST(req: Request) {
  try {
    const data = (await req.json()) as LeadPayload;

    // Basic validation (keep visitor UX clean by handling here)
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
    // Lightweight email sanity
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      return NextResponse.json(
        { ok: false, error: 'Invalid email' },
        { status: 400 },
      );
    }

    const timestamp = new Date().toISOString();
    const fullPhone = normalizePhone(data.dialCode, data.phone);

    // 1) Always save to Google Sheets (system of record)
    await appendToSheet([
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
    ]);

    // 2) Push to Bitrix (non-blocking for visitor)
    let bitrixOk = false;
    let bitrixLeadId: number | null = null;
    let bitrixError: string | null = null;

    try {
      const res = await sendToBitrix(data, timestamp);
      bitrixOk = res.ok;
      bitrixLeadId = res.leadId;
    } catch (e: unknown) {
      bitrixError = e instanceof Error ? e.message : 'Unknown Bitrix error';
      // Keep logs for you; do not expose to visitor
      console.error('Bitrix send error:', bitrixError);
    }

    // Keep response simple for visitors; flags help you debug in Network tab
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
