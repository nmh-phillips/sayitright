// Netlify Function: POST /.netlify/functions/speech-token
// Body: { device }. Returns { token, region } — a 10-minute Azure Speech token so the browser can stream
// the Assess me read-aloud (no 30-second limit) without ever seeing AZURE_SPEECH_KEY.
// Each token costs 3 units of the Assess me allowance (ASSESS_PRON_LIMIT, default 9 = 3 assessments a day),
// shared with the 3-part fallback in pronounce.mjs.
import { getStore } from '@netlify/blobs';
import { createHash } from 'node:crypto';

const ASSESS_FREE = Number(process.env.ASSESS_PRON_LIMIT || 9);
const IP_CAP = Number(process.env.PRON_IP_LIMIT || 30);
const COST = 3;
// Interview Coach (kind 'iv'): its own allowance of 10-minute tokens a day (IV_SPEECH_LIMIT, default 6 ≈ 2-3 interviews).
const IV_FREE = Number(process.env.IV_SPEECH_LIMIT || 6);
const hash = x => createHash('sha256').update('harlo-pron:' + x).digest('hex').slice(0, 24);
const json = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });

export default async (req, context) => {
  if (req.method !== 'POST') return json({ error: 'Use POST' }, 405);
  let b = {};
  try { b = await req.json(); } catch {}
  const key = process.env.AZURE_SPEECH_KEY, region = process.env.AZURE_SPEECH_REGION;
  if (!key || !region) return json({ error: 'Pronunciation scoring not configured' }, 503);

  const day = new Date().toISOString().slice(0, 10);
  const iv = b.kind === 'iv', cost = iv ? 1 : COST, free = iv ? IV_FREE : ASSESS_FREE;
  const devKey = `${day}/${iv ? 'iv' : 'a'}/${hash(String(b.device || 'none').slice(0, 64))}`;
  const ipKey = `${day}/ip/${hash((context && context.ip) || req.headers.get('x-nf-client-connection-ip') || 'unknown')}`;
  let store = null, devUsed = 0, ipUsed = 0;
  try {
    store = getStore('pron-usage');
    devUsed = Number(await store.get(devKey)) || 0;
    ipUsed = Number(await store.get(ipKey)) || 0;
  } catch { store = null; }
  if (devUsed >= free || ipUsed >= IP_CAP) return json({ error: 'limit', limit: Math.floor(free / cost) }, 429);

  let r;
  try {
    r = await fetch(`https://${region}.api.cognitive.microsoft.com/sts/v1.0/issueToken`, { method: 'POST', headers: { 'Ocp-Apim-Subscription-Key': key, 'Content-Length': '0' } });
  } catch { return json({ error: 'Could not reach the speech service' }, 502); }
  if (!r.ok) return json({ error: `Speech service error ${r.status}` }, 502);
  const token = await r.text();
  if (store) { try { await store.set(devKey, String(devUsed + cost)); await store.set(ipKey, String(ipUsed + cost)); } catch {} }
  return json({ token, region, remaining: Math.max(0, Math.floor((free - devUsed - cost) / cost)) });
};
