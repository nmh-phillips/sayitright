// Harley's and Lilou's voices (Azure neural text to speech), shared by functions/tts.mjs and functions/chat.mjs.
// Uses AZURE_SPEECH_KEY / AZURE_SPEECH_REGION. HARLEY_VOICE picks Harley's preset (default A); LILOU_VOICE picks Lilou's (L1-L4, default L1).
// Budget: TTS_DAILY_CHARS across everyone (default 15000), TTS_IP_LIMIT requests per connection (default 200). Cached audio is free.
import { getStore } from '@netlify/blobs';
import { createHash } from 'node:crypto';

export const PRESETS = {
  A: { voice: 'en-US-BrianMultilingualNeural',  pitch: 6,  rate: 6  },  // youthful, cheerful
  B: { voice: 'en-US-BrianMultilingualNeural',  pitch: 14, rate: 10 },  // extra bouncy
  C: { voice: 'en-US-AndrewMultilingualNeural', pitch: 10, rate: 6  },  // warmer
  D: { voice: 'en-US-RyanMultilingualNeural',   pitch: 10, rate: 8  },
  // Lilou (Harley's little cousin)
  L1: { voice: 'en-US-AvaMultilingualNeural',  pitch: 10, rate: 6  },  // bright, friendly
  L2: { voice: 'en-US-EmmaMultilingualNeural', pitch: 12, rate: 6  },  // warm, cheerful
  L3: { voice: 'en-US-AvaMultilingualNeural',  pitch: 18, rate: 10 },  // younger, extra playful
  L4: { voice: 'en-US-EmmaMultilingualNeural', pitch: 20, rate: 10 }
};
export const DAILY_CHARS = Number(process.env.TTS_DAILY_CHARS || 15000);
export const IP_CAP = Number(process.env.TTS_IP_LIMIT || 200);
export const LOCALE = /^[a-z]{2}-[A-Z]{2}$/;
export const pct = n => (n >= 0 ? '+' : '') + n + '%';
export const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' }[c]));
export const sha = x => createHash('sha256').update(x).digest('hex');
export const EMOJI = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu;

export function pickPreset(persona, preset) {
  const lilou = persona === 'lilou' || /^L\d$/.test(preset || '');
  return { lilou, preset: PRESETS[preset] || (lilou ? (PRESETS[process.env.LILOU_VOICE] || PRESETS.L1) : (PRESETS[process.env.HARLEY_VOICE] || PRESETS.A)) };
}
export const wrap = (preset, body) => `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xmlns:mstts="https://www.w3.org/2001/mstts" xml:lang="en-US"><voice name="${preset.voice}">${body}</voice></speak>`;
// A whole sentence in the language being learnt (Harley Chats, Interview Coach).
export function lineSsml(preset, target, text) {
  return wrap(preset, `<lang xml:lang="${target}"><prosody pitch="${pct(preset.pitch)}" rate="${pct(preset.rate - 6)}">${esc(text.replace(EMOJI, ''))}</prosody></lang>`);
}

// Turn SSML into mp3, using the cache and the daily budget. Returns { buf } or { error, status }.
export async function synth(ssml, { chars, ipKey, cache = true }) {
  const key = process.env.AZURE_SPEECH_KEY, region = process.env.AZURE_SPEECH_REGION;
  if (!key || !region) return { error: 'Voice not configured', status: 503 };
  const cacheKey = sha(ssml);
  let store = null;
  try { store = getStore('tts-cache'); const hit = await store.get(cacheKey, { type: 'arrayBuffer' }); if (hit) return { buf: hit }; } catch { store = null; }
  const day = new Date().toISOString().slice(0, 10);
  const ip = sha('harley-says-tts:' + (ipKey || 'unknown')).slice(0, 24);
  let usage = null, used = 0, ipUsed = 0;
  try { usage = getStore('tts-usage'); used = Number(await usage.get(`${day}/chars`)) || 0; ipUsed = Number(await usage.get(`${day}/ip/${ip}`)) || 0; } catch { usage = null; }
  if (used >= DAILY_CHARS || ipUsed >= IP_CAP) return { error: 'limit', status: 429 };
  let r;
  try {
    r = await fetch(`https://${region}.tts.speech.microsoft.com/cognitiveservices/v1`, {
      method: 'POST',
      headers: { 'Ocp-Apim-Subscription-Key': key, 'Content-Type': 'application/ssml+xml', 'X-Microsoft-OutputFormat': 'audio-24khz-48kbitrate-mono-mp3', 'User-Agent': 'harley-says' },
      body: ssml
    });
  } catch { return { error: 'Could not reach the voice service', status: 502 }; }
  if (!r.ok) return { error: `Voice service error ${r.status}`, status: 502 };
  const buf = await r.arrayBuffer();
  if (usage) { try { await usage.set(`${day}/chars`, String(used + chars)); await usage.set(`${day}/ip/${ip}`, String(ipUsed + 1)); } catch {} }
  if (store && cache) { try { await store.set(cacheKey, buf); } catch {} }
  return { buf };
}
