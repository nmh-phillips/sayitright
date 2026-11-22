// Netlify Function: POST /.netlify/functions/tts  — Harley's voice (Azure neural text to speech).
// Body: { kind: 'tip'|'word'|'clip', text, target: 'es-ES' etc., preset?: 'A'..'D' }
//   tip  : coaching tip; words in the language being learnt are wrapped in «» and read in that accent, same voice
//   word : one word/phrase in the language being learnt
//   clip : 'woof' | 'yay' | 'aww' — little doggy sounds for the end-of-section summary
// Returns audio/mpeg. Clips are cached so repeats cost nothing.
// Uses AZURE_SPEECH_KEY / AZURE_SPEECH_REGION. HARLEY_VOICE picks Harley's preset (default A); LILOU_VOICE picks Lilou's (L1-L4, default L1). Body may include persona: 'lilou'.
// Budget: TTS_DAILY_CHARS across everyone (default 15000 ≈ 450k a month, inside Azure's free allowance), TTS_IP_LIMIT requests per connection (default 200).
import { getStore } from '@netlify/blobs';
import { createHash } from 'node:crypto';

const PRESETS = {
  A: { voice: 'en-US-BrianMultilingualNeural',  pitch: 6,  rate: 6  },  // youthful, cheerful
  B: { voice: 'en-US-BrianMultilingualNeural',  pitch: 14, rate: 10 },  // extra bouncy
  C: { voice: 'en-US-AndrewMultilingualNeural', pitch: 10, rate: 6  },  // warmer
  D: { voice: 'en-US-RyanMultilingualNeural',   pitch: 10, rate: 8  },
  // Lilou (Harley's little sister)
  L1: { voice: 'en-US-AvaMultilingualNeural',  pitch: 10, rate: 6  },  // bright, friendly
  L2: { voice: 'en-US-EmmaMultilingualNeural', pitch: 12, rate: 6  },  // warm, cheerful
  L3: { voice: 'en-US-AvaMultilingualNeural',  pitch: 18, rate: 10 },  // younger, extra playful
  L4: { voice: 'en-US-EmmaMultilingualNeural', pitch: 20, rate: 10 }
};
const LILOU_CLIPS = { woof: ['Yip yip!', 26, 10], yay: ['Yip yip yip!', 30, 10], aww: ['Awww…', 14, -16] };
// [text, extra pitch %, extra rate %]
const CLIPS = { woof: ['Woof woof!', 24, 10], yay: ['Woof woof woof!', 30, 10], aww: ['Awww…', 14, -16] };
const pct = n => (n >= 0 ? '+' : '') + n + '%';
const DAILY_CHARS = Number(process.env.TTS_DAILY_CHARS || 15000);
const IP_CAP = Number(process.env.TTS_IP_LIMIT || 200);
const LOCALE = /^[a-z]{2}-[A-Z]{2}$/;
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' }[c]));
const sha = x => createHash('sha256').update(x).digest('hex');
const err = (msg, status) => new Response(JSON.stringify({ error: msg }), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });

export default async (req, context) => {
  if (req.method !== 'POST') return err('Use POST', 405);
  const key = process.env.AZURE_SPEECH_KEY, region = process.env.AZURE_SPEECH_REGION;
  if (!key || !region) return err('Voice not configured', 503);
  let b = {};
  try { b = await req.json(); } catch { return err('Bad JSON', 400); }
  const kind = ['tip', 'word', 'clip'].includes(b.kind) ? b.kind : null;
  const lilou = b.persona === 'lilou' || /^L\d$/.test(b.preset || '');
  const preset = PRESETS[b.preset] || (lilou ? (PRESETS[process.env.LILOU_VOICE] || PRESETS.L1) : (PRESETS[process.env.HARLEY_VOICE] || PRESETS.A));
  const clips = lilou ? LILOU_CLIPS : CLIPS;
  const target = LOCALE.test(b.target || '') ? b.target : 'en-GB';
  const text = String(b.text || '').replace(/[\u0000-\u001f]/g, ' ').trim();
  if (!kind || !text) return err('Bad request', 400);

  // one flat <prosody> per segment (no nesting), words in the learnt language inside <lang>
  const seg = (t, dp = 0, dr = 0) => `<prosody pitch="${pct(preset.pitch + dp)}" rate="${pct(preset.rate + dr)}">${esc(t)}</prosody>`;
  const foreign = t => `<lang xml:lang="${target}">${seg(t, 0, -12)}</lang>`;
  let body;
  if (kind === 'clip') {
    if (!clips[text]) return err('Unknown clip', 400);
    body = seg(...clips[text]);
  } else if (kind === 'word') {
    if (text.length > 120) return err('Too long', 400);
    body = foreign(text);
  } else {
    if (text.length > 700) return err('Too long', 400);
    const parts = text.replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu, '').split(/«([^»]+)»/);
    body = seg(...clips.woof) + '<break time="250ms"/>' + parts.map((p, i) => !p.trim() ? '' : i % 2 ? foreign(p) : seg(p)).join('');
  }
  const ssml = `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xmlns:mstts="https://www.w3.org/2001/mstts" xml:lang="en-US"><voice name="${preset.voice}">${body}</voice></speak>`;
  const cacheKey = sha(ssml);

  let store = null;
  try { store = getStore('tts-cache'); const hit = await store.get(cacheKey, { type: 'arrayBuffer' }); if (hit) return audio(hit); } catch { store = null; }

  // usage limits (only for audio we actually have to generate)
  const day = new Date().toISOString().slice(0, 10);
  const ip = sha('harley-says-tts:' + ((context && context.ip) || req.headers.get('x-nf-client-connection-ip') || 'unknown')).slice(0, 24);
  let usage = null, chars = 0, ipUsed = 0;
  try { usage = getStore('tts-usage'); chars = Number(await usage.get(`${day}/chars`)) || 0; ipUsed = Number(await usage.get(`${day}/ip/${ip}`)) || 0; } catch { usage = null; }
  if (chars >= DAILY_CHARS || ipUsed >= IP_CAP) return err('limit', 429);

  let r;
  try {
    r = await fetch(`https://${region}.tts.speech.microsoft.com/cognitiveservices/v1`, {
      method: 'POST',
      headers: { 'Ocp-Apim-Subscription-Key': key, 'Content-Type': 'application/ssml+xml', 'X-Microsoft-OutputFormat': 'audio-24khz-48kbitrate-mono-mp3', 'User-Agent': 'harley-says' },
      body: ssml
    });
  } catch { return err('Could not reach the voice service', 502); }
  if (!r.ok) return err(`Voice service error ${r.status}`, 502);
  const buf = await r.arrayBuffer();
  if (usage) { try { await usage.set(`${day}/chars`, String(chars + text.length)); await usage.set(`${day}/ip/${ip}`, String(ipUsed + 1)); } catch {} }
  if (store && (kind !== 'tip')) { try { await store.set(cacheKey, buf); } catch {} } // words and clips repeat; tips are one-off
  return audio(buf);
};

const audio = buf => new Response(buf, { status: 200, headers: { 'Content-Type': 'audio/mpeg', 'Cache-Control': 'private, max-age=86400' } });
