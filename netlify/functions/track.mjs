// Netlify Function: POST /.netlify/functions/track   { e: 'visit'|'say'|..., l: learning lang, u: interface lang }
// Privacy-friendly usage counts: no cookies, no IP addresses, no personal data, just daily totals per event and language.
// Read them at /stats.html with the STATS_KEY you set in Netlify.
import { getStore } from '@netlify/blobs';

const EVENTS = new Set(['story','visit','say','say_quick','check','read','speak','write','translate','summary','focus','waitlist','feedback','install','limit','coach','lesson','lesson_round','games','game_start','game_done','daily_start','daily_done','chat_start','chat_turn','chat_done','interview','iv_start','iv_answer','iv_done','iv_tip_up','iv_tip_down','d5_start','d5_done']);
const LANGS = new Set(['en','enus','es','esmx','fr','it','de','pt','nl']);
const ok = () => new Response(null, { status: 204, headers: { 'Cache-Control': 'no-store' } });

export default async (req) => {
  if (req.method !== 'POST') return ok();
  let b = {};
  try { b = await req.json(); } catch { return ok(); }
  const e = String(b.e || ''), l = LANGS.has(b.l) ? b.l : 'other', u = String(b.u || '').slice(0, 4).replace(/[^a-z]/g, '') || 'other';
  if (!EVENTS.has(e)) return ok();
  const day = new Date().toISOString().slice(0, 10);
  try {
    const store = getStore('usage-stats');
    const k = `day/${day}`;
    const cur = (await store.get(k, { type: 'json' })) || {};
    cur[e] = (cur[e] || 0) + 1;
    if (e === 'visit') { cur['lang:' + l] = (cur['lang:' + l] || 0) + 1; cur['ui:' + u] = (cur['ui:' + u] || 0) + 1; }
    await store.setJSON(k, cur);
  } catch {}
  return ok();
};
