// Netlify scheduled function: runs once a day and deletes old daily-allowance counters,
// so the hashed device and IP codes are kept for a week at most (as the privacy policy says).
// The anonymous usage totals (usage-stats) and the shared audio cache (tts-cache) hold no personal data and are kept.
import { getStore } from '@netlify/blobs';

const STORES = ['pron-usage', 'ai-assess-usage', 'coach-usage', 'translate-usage', 'tts-usage', 'chat-usage'];
const KEEP_DAYS = 7;

export default async () => {
  const cutoff = new Date(Date.now() - KEEP_DAYS * 864e5).toISOString().slice(0, 10);
  let deleted = 0;
  for (const name of STORES) {
    try {
      const store = getStore(name);
      const { blobs } = await store.list();
      for (const { key } of blobs) {
        const day = key.slice(0, 10);
        if (/^\d{4}-\d{2}-\d{2}$/.test(day) && day < cutoff) { await store.delete(key); deleted++; }
      }
    } catch (e) { console.log('cleanup', name, String(e)); }
  }
  // Presentation mode counts per week (keys start 2026-W48): keep the current and previous week only.
  try {
    const d = new Date(Date.now() - 14 * 864e5), t = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
    const wd = t.getUTCDay() || 7; t.setUTCDate(t.getUTCDate() + 4 - wd);
    const y = t.getUTCFullYear(), w = Math.ceil(((t - Date.UTC(y, 0, 1)) / 864e5 + 1) / 7), old = `${y}-W${String(w).padStart(2, '0')}`;
    const store = getStore('present-usage'); const { blobs } = await store.list();
    for (const { key } of blobs) { const wk = key.slice(0, 8); if (/^\d{4}-W\d{2}$/.test(wk) && wk <= old) { await store.delete(key); deleted++; } }
  } catch (e) { console.log('cleanup present-usage', String(e)); }
  console.log('cleanup deleted', deleted, 'counters older than', cutoff);
  return new Response(null, { status: 204 });
};

export const config = { schedule: '@daily' };
