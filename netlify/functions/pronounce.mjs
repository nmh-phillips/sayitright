// Netlify Function: POST /.netlify/functions/pronounce
// Body: { audio: base64 16 kHz mono 16-bit WAV, text: reference phrase, lang, device }
// Returns: { score, accuracy, fluency, completeness, words:[{word, score, error, phonemes:[{p, score}]}], limit, remaining }
// Needs AZURE_SPEECH_KEY and AZURE_SPEECH_REGION (e.g. uksouth) in Netlify environment variables.
// Free allowance: PRON_FREE_LIMIT checks per device per day (default 3), PRON_IP_LIMIT per connection (default 30).
// Assess me sends kind:'assess' (one call per passage part, each under 30 s): separate allowance ASSESS_PRON_LIMIT parts per day (default 9 = 3 assessments).
// GET returns { enabled } so the page knows whether sound scoring is switched on.
import { getStore } from '@netlify/blobs';
import { createHash } from 'node:crypto';

const LOCALES = { en: 'en-GB', enus: 'en-US', es: 'es-ES', esmx: 'es-MX', fr: 'fr-FR', it: 'it-IT', de: 'de-DE', pt: 'pt-PT' };
const FREE = Number(process.env.PRON_FREE_LIMIT || 3);
const IP_CAP = Number(process.env.PRON_IP_LIMIT || 30);
const ASSESS_FREE = Number(process.env.ASSESS_PRON_LIMIT || 9);
// Main "Tap and say it" button sends kind:'say': SAY_FREE_LIMIT per device per day (default 25), SAY_IP_LIMIT per connection (default 150).
const SAY_FREE = Number(process.env.SAY_FREE_LIMIT || 25);
const SAY_IP_CAP = Number(process.env.SAY_IP_LIMIT || 150);
const hash = x => createHash('sha256').update('harley-says-pron:' + x).digest('hex').slice(0, 24);
const json = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });
const num = v => Math.round(Number(v) || 0);

export default async (req, context) => {
  if (req.method === 'GET') return json({ enabled: !!(process.env.AZURE_SPEECH_KEY && process.env.AZURE_SPEECH_REGION) });
  if (req.method !== 'POST') return json({ error: 'Use POST' }, 405);
  let b;
  try { b = await req.json(); } catch { return json({ error: 'Bad JSON' }, 400); }
  const text = String(b.text || '').trim().slice(0, 300);
  const locale = LOCALES[b.lang];
  const audio = String(b.audio || '');
  if (!text || !locale) return json({ error: 'Missing phrase or language' }, 400);
  if (audio.length < 2000 || audio.length > 2_500_000) return json({ error: 'Recording too short or too long' }, 400);
  const key = process.env.AZURE_SPEECH_KEY, region = process.env.AZURE_SPEECH_REGION;
  if (!key || !region) return json({ error: 'Pronunciation scoring not configured' }, 503);

  // Daily free allowance (Premium accounts will skip this once logins and payments exist).
  const day = new Date().toISOString().slice(0, 10);
  const kind = b.kind === 'assess' ? 'assess' : b.kind === 'say' ? 'say' : 'check';
  const limit = kind === 'assess' ? ASSESS_FREE : kind === 'say' ? SAY_FREE : FREE;
  const ipLimit = kind === 'say' ? SAY_IP_CAP : IP_CAP;
  const devKey = `${day}/${kind === 'assess' ? 'a' : kind === 'say' ? 's' : 'd'}/${hash(String(b.device || 'none').slice(0, 64))}`;
  const ipKey = `${day}/${kind === 'say' ? 'ips' : 'ip'}/${hash((context && context.ip) || req.headers.get('x-nf-client-connection-ip') || 'unknown')}`;
  let store = null, devUsed = 0, ipUsed = 0;
  try {
    store = getStore('pron-usage');
    devUsed = Number(await store.get(devKey)) || 0;
    ipUsed = Number(await store.get(ipKey)) || 0;
  } catch { store = null; }
  if (devUsed >= limit || ipUsed >= ipLimit) return json({ error: 'limit', limit, remaining: 0 }, 429);

  const config = { ReferenceText: text, GradingSystem: 'HundredMark', Granularity: 'Phoneme', Dimension: 'Comprehensive', EnableMiscue: true, PhonemeAlphabet: 'IPA' };
  const url = `https://${region}.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1?language=${locale}&format=detailed`;
  let r;
  try {
    r = await fetch(url, {
      method: 'POST',
      headers: {
        'Ocp-Apim-Subscription-Key': key,
        'Content-Type': 'audio/wav; codecs=audio/pcm; samplerate=16000',
        'Accept': 'application/json',
        'Pronunciation-Assessment': Buffer.from(JSON.stringify(config)).toString('base64')
      },
      body: Buffer.from(audio, 'base64')
    });
  } catch (e) { return json({ error: 'Could not reach the speech service' }, 502); }
  if (!r.ok) return json({ error: `Speech service error ${r.status}` }, 502);
  const j = await r.json().catch(() => ({}));
  if (j.RecognitionStatus !== 'Success' || !Array.isArray(j.NBest) || !j.NBest.length) return json({ error: 'nomatch' }, 422);

  const nb = j.NBest[0];
  const pa = nb.PronunciationAssessment || nb;
  const words = (nb.Words || []).map(w => {
    const wp = w.PronunciationAssessment || w;
    return {
      word: w.Word,
      score: num(wp.AccuracyScore),
      error: wp.ErrorType || 'None',
      phonemes: (w.Phonemes || []).map(p => ({ p: p.Phoneme, score: num((p.PronunciationAssessment || p).AccuracyScore) }))
    };
  });
  if (store) { try { await store.set(devKey, String(devUsed + 1)); await store.set(ipKey, String(ipUsed + 1)); } catch {} }
  return json({
    score: num(pa.PronScore ?? pa.AccuracyScore),
    accuracy: num(pa.AccuracyScore), fluency: num(pa.FluencyScore), completeness: num(pa.CompletenessScore),
    words, limit, remaining: Math.max(0, limit - devUsed - 1)
  });
};
