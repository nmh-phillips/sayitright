// Netlify Function: POST /.netlify/functions/tts  — Harley's voice (Azure neural text to speech).
// Body: { kind: 'tip'|'word'|'clip', text, target: 'es-ES' etc., preset?: 'A'..'D' }
//   tip  : coaching tip; words in the language being learnt are wrapped in «» and read in that accent, same voice
//   word : one word/phrase in the language being learnt
//   clip : 'woof' | 'yay' | 'aww' — little doggy sounds for the end-of-section summary
//   line : a whole sentence in the language being learnt, no bark first (Harley Chats)
// Returns audio/mpeg. Clips are cached so repeats cost nothing.
// Uses AZURE_SPEECH_KEY / AZURE_SPEECH_REGION. HARLEY_VOICE picks Harley's preset (default A); LILOU_VOICE picks Lilou's (L1-L4, default L1). Body may include persona: 'lilou'.
// Budget: TTS_DAILY_CHARS across everyone (default 15000 ≈ 450k a month, inside Azure's free allowance), TTS_IP_LIMIT requests per connection (default 200).
import { PRESETS, LOCALE, pct, esc, EMOJI, pickPreset, wrap, lineSsml, synth } from '../lib/voice.mjs';

const LILOU_CLIPS = { woof: ['Yip yip!', 26, 10], yay: ['Yip yip yip!', 30, 10], aww: ['Awww…', 14, -16] };
// [text, extra pitch %, extra rate %]
const CLIPS = { woof: ['Woof woof!', 24, 10], yay: ['Woof woof woof!', 30, 10], aww: ['Awww…', 14, -16] };
const err = (msg, status) => new Response(JSON.stringify({ error: msg }), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });

export default async (req, context) => {
  if (req.method !== 'POST') return err('Use POST', 405);
  if (!process.env.AZURE_SPEECH_KEY || !process.env.AZURE_SPEECH_REGION) return err('Voice not configured', 503);
  let b = {};
  try { b = await req.json(); } catch { return err('Bad JSON', 400); }
  const kind = ['tip', 'word', 'clip', 'line'].includes(b.kind) ? b.kind : null;
  const { lilou, preset } = pickPreset(b.persona, b.preset);
  const clips = lilou ? LILOU_CLIPS : CLIPS;
  const target = LOCALE.test(b.target || '') ? b.target : 'en-GB';
  const text = String(b.text || '').replace(/[\u0000-\u001f]/g, ' ').trim();
  if (!kind || !text) return err('Bad request', 400);

  // one flat <prosody> per segment (no nesting), words in the learnt language inside <lang>
  const seg = (t, dp = 0, dr = 0) => `<prosody pitch="${pct(preset.pitch + dp)}" rate="${pct(preset.rate + dr)}">${esc(t)}</prosody>`;
  const foreign = t => `<lang xml:lang="${target}">${seg(t, 0, -12)}</lang>`;
  let ssml;
  if (kind === 'clip') {
    if (!clips[text]) return err('Unknown clip', 400);
    ssml = wrap(preset, seg(...clips[text]));
  } else if (kind === 'line') {
    if (text.length > 400) return err('Too long', 400);
    ssml = lineSsml(preset, target, text);
  } else if (kind === 'word') {
    if (text.length > 120) return err('Too long', 400);
    ssml = wrap(preset, foreign(text));
  } else {
    if (text.length > 700) return err('Too long', 400);
    const parts = text.replace(EMOJI, '').split(/«([^»]+)»/);
    ssml = wrap(preset, seg(...clips.woof) + '<break time="250ms"/>' + parts.map((p, i) => !p.trim() ? '' : i % 2 ? foreign(p) : seg(p)).join(''));
  }
  const out = await synth(ssml, { chars: text.length, ipKey: (context && context.ip) || req.headers.get('x-nf-client-connection-ip'), cache: kind !== 'tip' }); // words and clips repeat; tips are one-off
  if (out.error) return err(out.error, out.status);
  return audio(out.buf);
};

const audio = buf => new Response(buf, { status: 200, headers: { 'Content-Type': 'audio/mpeg', 'Cache-Control': 'private, max-age=86400' } });
