// Netlify Function: GET /.netlify/functions/stats?key=STATS_KEY&days=30  → daily usage counts (see track.mjs).
import { getStore } from '@netlify/blobs';
const json = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });

export default async (req) => {
  const url = new URL(req.url), want = process.env.STATS_KEY;
  if (!want) return json({ error: 'Set STATS_KEY in Netlify to switch on the stats page.' }, 503);
  if (url.searchParams.get('key') !== want) return json({ error: 'Wrong key' }, 401);
  const n = Math.min(90, Math.max(1, Number(url.searchParams.get('days')) || 30));
  const store = getStore('usage-stats'), out = [];
  for (let i = 0; i < n; i++) {
    const day = new Date(Date.now() - i * 864e5).toISOString().slice(0, 10);
    let v = null; try { v = await store.get(`day/${day}`, { type: 'json' }); } catch {}
    out.push({ day, ...(v || {}) });
  }
  return json({ days: out });
};
