// Netlify Function: POST /.netlify/functions/translate  { text, from, to }  ->  { translation }
// Uses DeepL if DEEPL_API_KEY is set, otherwise Claude if ANTHROPIC_API_KEY is set.
// Set keys in Netlify: Project configuration -> Environment variables.

const NAMES = { en: 'English (British)', enus: 'English (American)', es: 'Spanish (Spain)', esmx: 'Spanish (Latin American, as spoken in Mexico)', fr: 'French', it: 'Italian', de: 'German', pt: 'Portuguese (Portugal)' };
const DEEPL_TARGET = { en: 'EN-GB', enus: 'EN-US', es: 'ES', esmx: 'ES', fr: 'FR', it: 'IT', de: 'DE', pt: 'PT-PT' };
const DEEPL_SOURCE = { en: 'EN', enus: 'EN', es: 'ES', esmx: 'ES', fr: 'FR', it: 'IT', de: 'DE', pt: 'PT' };

const json = (body, status = 200) => new Response(JSON.stringify(body), {
  status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }
});

export default async (req) => {
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

  try {
    if (process.env.DEEPL_API_KEY) return json({ translation: await deepl(text, from, to), via: 'deepl' });
    if (process.env.ANTHROPIC_API_KEY) return json({ translation: await claude(text, from, to), via: 'claude' });
    return json({ error: 'Translation not configured' }, 503);
  } catch (e) {
    return json({ error: e.message || 'Translation error' }, 502);
  }
};

async function deepl(text, from, to) {
  const key = process.env.DEEPL_API_KEY;
  const host = key.endsWith(':fx') ? 'https://api-free.deepl.com' : 'https://api.deepl.com';
  const r = await fetch(`${host}/v2/translate`, {
    method: 'POST',
    headers: { 'Authorization': `DeepL-Auth-Key ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: [text], source_lang: DEEPL_SOURCE[from], target_lang: DEEPL_TARGET[to] })
  });
  if (!r.ok) throw new Error(`DeepL error ${r.status}`);
  const j = await r.json();
  return j.translations?.[0]?.text?.trim();
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
