// Harley Says: "Daily 5" — five phrases a day, picked for you, with a streak.
// Picks, in order: phrases from your Harley Chats summaries not yet mastered (hs_chat_review), phrases you've tried but not
// mastered (best < 80%), then new phrases from the free topics. Same five all day (per language); a new five tomorrow.
// Done = all five tried today. Streak = days in a row done. Practice uses the normal phrase card (set DAILY5 in index.html).
// Uses globals from index.html: lang, set, idx, DATA, scores, key, store, t, render, track, FOCUS_SETS, isLocked, DAILY5, els, $.
(function(){
const N = 5, GOOD = 80;
const today = () => new Date().toISOString().slice(0,10);
const yesterday = () => new Date(Date.now() - 864e5).toISOString().slice(0,10);
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
// Small seeded shuffle, so the day's pick is stable.
function seeded(str){ let h = 2166136261; for (const ch of str) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619); } return () => { h ^= h << 13; h ^= h >>> 17; h ^= h << 5; return ((h >>> 0) % 1e6) / 1e6; }; }
function shuffle(a, rnd){ a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }

function pick(){
  const rnd = seeded(today() + '|' + lang);
  const best = p => scores[key(p)];
  const seen = new Set(), out = [];
  const add = p => { if (out.length < N && p && p[0] && !seen.has(p[0])) { seen.add(p[0]); out.push([p[0], p[1] || '']); } };
  // 1. phrases from chats in this language, newest first, not yet mastered
  store.get('hs_chat_review', []).filter(x => x.lang === lang && (best([x.p]) || 0) < GOOD).slice(0, 3).forEach(x => add([x.p, x.m]));
  const sets = Object.keys(DATA[lang].sets).filter(n => !isLocked(n) && !FOCUS_SETS.includes(n));
  const all = sets.flatMap(n => DATA[lang].sets[n]);
  // 2. tried but not mastered (weakest first), up to 2 more
  all.filter(p => best(p) !== undefined && best(p) < GOOD).sort((a, b) => best(a) - best(b)).slice(0, Math.max(0, 4 - out.length)).forEach(add);
  // 3. new phrases, then anything not mastered, then anything
  shuffle(all.filter(p => best(p) === undefined), rnd).forEach(add);
  shuffle(all.filter(p => (best(p) || 0) < GOOD), rnd).forEach(add);
  shuffle(all, rnd).forEach(add);
  return out;
}
function state(){
  let s = store.get('hs_d5', null);
  if (!s || s.day !== today() || s.lang !== lang || !Array.isArray(s.items) || !s.items.length) {
    s = { day: today(), lang, items: pick(), tried: {} };
    store.set('hs_d5', s);
  }
  return s;
}
function streak(){ const s = store.get('hs_d5_streak', null); return s && (s.last === today() || s.last === yesterday()) ? s.n : 0; }
const doneCount = s => s.items.filter(p => s.tried[p[0]] !== undefined).length;

window.daily5List = () => state().items;
window.daily5Scored = (p, pct) => {
  if (set !== DAILY5) return;
  const s = state(); if (!s.items.some(x => x[0] === p[0])) return;
  const first = doneCount(s) === 0;
  s.tried[p[0]] = Math.max(s.tried[p[0]] || 0, pct); store.set('hs_d5', s);
  if (first) track('d5_start');
  if (doneCount(s) === s.items.length && !s.done) {
    s.done = true; store.set('hs_d5', s);
    const st = store.get('hs_d5_streak', null);
    const n = st && st.last === today() ? st.n : st && st.last === yesterday() ? st.n + 1 : 1;
    store.set('hs_d5_streak', { last: today(), n, best: Math.max(n, (st && st.best) || 0) });
    track('d5_done'); celebrate = true;
  }
  renderBanner();
};
let celebrate = false;
function renderBanner(){
  const el = document.getElementById('d5Banner'); if (!el) return;
  const s = state(), n = doneCount(s), st = streak(), on = set === DAILY5;
  const done = !!s.done;
  el.className = 'd5' + (done ? ' done' : '') + (on ? ' on' : '');
  el.innerHTML = `<div class="d5-l"><b>☀️ ${esc(t('d5_title'))}</b><span>${esc(done ? t('d5_done') : t('d5_sub'))}</span></div>
    <div class="d5-r">${st ? `<span class="d5-st">${esc(t('d5_streak',{n:st}))}</span>` : ''}<span class="d5-dots" aria-label="${esc(t('d5_progress',{n,m:s.items.length}))}">${s.items.map(p => `<i class="${s.tried[p[0]] !== undefined ? (s.tried[p[0]] >= GOOD ? 'g' : 'y') : ''}"></i>`).join('')}</span>
    ${on || done ? '' : `<span class="d5-go">${esc(t(n ? 'd5_cont' : 'd5_start'))}</span>`}</div>`;
  if (celebrate) { celebrate = false; el.classList.add('pop'); setTimeout(() => el.classList.remove('pop'), 900); if (window.harleySay) harleySay('clip', 'yay'); }
}
window.renderDaily5Banner = renderBanner;
document.addEventListener('click', e => {
  if (!e.target.closest('#d5Banner')) return;
  if (set === DAILY5) return;
  const s = state(), next = s.items.findIndex(p => s.tried[p[0]] === undefined);
  set = DAILY5; idx = next >= 0 ? next : 0; render();
  els.practice.scrollIntoView({ behavior: 'smooth', block: 'start' });
});
document.addEventListener('keydown', e => { if (e.target.id === 'd5Banner' && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); e.target.click(); } });
const css = `
#d5Banner{display:flex;align-items:center;justify-content:space-between;gap:10px;cursor:pointer;margin:0 0 10px;padding:12px 14px;border-radius:16px;background:linear-gradient(135deg,#FFB547,#FF8A3D);color:#fff;box-shadow:0 3px 0 #d9682a;user-select:none}
#d5Banner.on{outline:3px solid #1C2563;outline-offset:2px;cursor:default}
#d5Banner.done{background:linear-gradient(135deg,#1f9d62,#178a55);box-shadow:0 3px 0 #10683f}
#d5Banner.pop{animation:d5pop .9s ease}
@keyframes d5pop{30%{transform:scale(1.04)}60%{transform:scale(.98)}}
#d5Banner .d5-l{display:flex;flex-direction:column;gap:2px;min-width:0} #d5Banner .d5-l b{font-size:16px} #d5Banner .d5-l span{font-size:13px;opacity:.95}
#d5Banner .d5-r{display:flex;flex-direction:column;align-items:flex-end;gap:5px;flex:0 0 auto}
#d5Banner .d5-st{font-size:13px;font-weight:700}
#d5Banner .d5-dots{display:flex;gap:4px} #d5Banner .d5-dots i{width:10px;height:10px;border-radius:50%;background:rgba(255,255,255,.4)}
#d5Banner .d5-dots i.y{background:#FFE9A8} #d5Banner .d5-dots i.g{background:#fff}
#d5Banner .d5-go{background:#fff;color:#d9531e;font-weight:800;font-size:13px;padding:5px 12px;border-radius:999px}
`;
const stEl = document.createElement('style'); stEl.textContent = css; document.head.appendChild(stEl);
renderBanner();
})();
