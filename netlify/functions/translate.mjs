// Netlify Function: POST /.netlify/functions/translate  { text, from, to }  ->  { translation }
// Uses DeepL if DEEPL_API_KEY is set, otherwise Claude if ANTHROPIC_API_KEY is set.
// Set keys in Netlify: Project configuration -> Environment variables.
// Free users get TRANSLATE_FREE_LIMIT translations a day per device (default 5),
// with a backstop of TRANSLATE_IP_LIMIT per connection (default 50). Counts live in Netlify Blobs.
import { getStore } from '@netlify/blobs';
import { createHash } from 'node:crypto';

const FREE = Number(process.env.TRANSLATE_FREE_LIMIT || 5);
const IP_CAP = Number(process.env.TRANSLATE_IP_LIMIT || 50);
const hash = x => createHash('sha256').update('harley-says:' + x).digest('hex').slice(0, 24);

const NAMES = { en: 'English (British)', enus: 'English (American)', es: 'Spanish (Spain)', esmx: 'Spanish (Latin American, as spoken in Mexico)', fr: 'French', it: 'Italian', de: 'German', pt: 'Portuguese (Portugal)' };
const DEEPL_TARGET = { en: 'EN-GB', enus: 'EN-US', es: 'ES', esmx: 'ES', fr: 'FR', it: 'IT', de: 'DE', pt: 'PT-PT' };
const DEEPL_SOURCE = { en: 'EN', enus: 'EN', es: 'ES', esmx: 'ES', fr: 'FR', it: 'IT', de: 'DE', pt: 'PT' };

const json = (body, status = 200) => new Response(JSON.stringify(body), {
  status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }
});

export default async (req, context) => {
  if (req.method !== 'POST') return json({ error: 'Use POST' }, 405);

  let body;
  try { body = await req.json(); } catch { return json({ error: 'Bad JSON' }, 400); }
  const text = String(body.text || '').trim();
  const from = String(body.from || '');
  const to = String(body.to || '');
  if (!text) return json({ error: 'No text' }, 400);
  if (text.length > 300) return json({ error: 'Text too long (max 300 characters)' }, 400);
  if (!NAMES[to] || !NAMES[from]) return json({ error: 'Unsupported language' }, 400);
  if (from === to) return json({ translation: text });
  if (!process.env.DEEPL_API_KEY && !process.env.ANTHROPIC_API_KEY) return json({ error: 'Translation not configured' }, 503);

  // Daily free allowance (Pro accounts will skip this once logins and payments exist).
  const day = new Date().toISOString().slice(0, 10);
  const device = String(body.device || '').slice(0, 64) || 'none';
  const ip = (context && context.ip) || req.headers.get('x-nf-client-connection-ip') || 'unknown';
  const devKey = `${day}/d/${hash(device)}`, ipKey = `${day}/ip/${hash(ip)}`;
  let store = null, devUsed = 0, ipUsed = 0;
  try {
    store = getStore('translate-usage');
    devUsed = Number(await store.get(devKey)) || 0;
    ipUsed = Number(await store.get(ipKey)) || 0;
  } catch { store = null; } // if usage storage is unavailable, don't block people
  if (devUsed >= FREE || ipUsed >= IP_CAP) return json({ error: 'limit', limit: FREE, remaining: 0 }, 429);

  try {
    let translation, via;
    if (process.env.DEEPL_API_KEY) { translation = await deepl(text, from, to); via = 'deepl'; }
    else { translation = await claude(text, from, to); via = 'claude'; }
    if (store) { try { await store.set(devKey, String(devUsed + 1)); await store.set(ipKey, String(ipUsed + 1)); } catch {} }
    return json({ translation, via, limit: FREE, remaining: Math.max(0, FREE - devUsed - 1) });
  } catch (e) {
    return json({ error: e.message || 'Translation error' }, 502);
  }
};

async function deepl(text, from, to) {
  const key = process.env.DEEPL_API_KEY;
  // Free/Developer keys have used api-free.deepl.com; paid keys use api.deepl.com. Try the likely one first, then the other.
  const hosts = key.endsWith(':fx') ? ['https://api-free.deepl.com', 'https://api.deepl.com'] : ['https://api.deepl.com', 'https://api-free.deepl.com'];
  let last = 0;
  for (const host of hosts) {
    const r = await fetch(`${host}/v2/translate`, {
      method: 'POST',
      headers: { 'Authorization': `DeepL-Auth-Key ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: [text], source_lang: DEEPL_SOURCE[from], target_lang: DEEPL_TARGET[to] })
    });
    if (r.ok) { const j = await r.json(); return j.translations?.[0]?.text?.trim(); }
    last = r.status;
    if (r.status !== 403 && r.status !== 401) break; // only a wrong-host key error is worth retrying
  }
  if (last === 456) throw new Error('DeepL character allowance used up');
  throw new Error(`DeepL error ${last}`);
}

async function claude(text, from, to) {
  const r = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      model: process.env.ANTHROPIC_MODEL || 'claude-haiku-5-5',
      max_tokens: 300,
      system: `You translate short phrases for language learners. Translate from ${NAMES[from]} into natural, everyday ${NAMES[to]} as a native speaker would say it. Reply with the translation only: no quotes, notes or alternatives.`,
      messages: [{ role: 'user', content: text }]
    })
  });
  if (!r.ok) throw new Error(`Claude API error ${r.status}`);
  const j = await r.json();
  return (j.content || []).map(c => c.text || '').join('').trim();
}
