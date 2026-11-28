// Netlify Function: POST /.netlify/functions/translate  { text, from, to }  ->  { translation }
// Uses Claude (ANTHROPIC_API_KEY). Anthropic doesn't train on API data.
// Set keys in Netlify: Project configuration -> Environment variables.
// Free users get TRANSLATE_FREE_LIMIT translations a day per device (default 5),
// with a backstop of TRANSLATE_IP_LIMIT per connection (default 50). Counts live in Netlify Blobs.
import { getStore } from '@netlify/blobs';
import { createHash } from 'node:crypto';

const FREE = Number(process.env.TRANSLATE_FREE_LIMIT || 5);
const IP_CAP = Number(process.env.TRANSLATE_IP_LIMIT || 50);
const hash = x => createHash('sha256').update('harlo:' + x).digest('hex').slice(0, 24);

const NAMES = { en: 'English (British)', enus: 'English (American)', es: 'Spanish (Spain)', esmx: 'Spanish (Latin American, as spoken in Mexico)', fr: 'French', it: 'Italian', de: 'German', pt: 'Portuguese (Portugal)' };
// Languages people can translate into (the languages being learnt)
const TARGETS = new Set(['en', 'enus', 'es', 'esmx', 'fr', 'it', 'de', 'pt', 'nl']);
// Extra languages people can type in (translation source only)
Object.assign(NAMES, { pl: 'Polish', ro: 'Romanian', uk: 'Ukrainian', zh: 'Simplified Chinese', ar: 'Arabic', nl: 'Dutch', tr: 'Turkish', ja: 'Japanese', ko: 'Korean', vi: 'Vietnamese' });

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
  if (!NAMES[to] || !NAMES[from] || !TARGETS.has(to)) return json({ error: 'Unsupported language' }, 400);
  if (from === to) return json({ translation: text });
  if (!process.env.ANTHROPIC_API_KEY) return json({ error: 'Translation not configured' }, 503);

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
    const translation = await claude(text, from, to), via = 'claude';
    if (store) { try { await store.set(devKey, String(devUsed + 1)); await store.set(ipKey, String(ipUsed + 1)); } catch {} }
    return json({ translation, via, limit: FREE, remaining: Math.max(0, FREE - devUsed - 1) });
  } catch (e) {
    return json({ error: e.message || 'Translation error' }, 502);
  }
};

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
