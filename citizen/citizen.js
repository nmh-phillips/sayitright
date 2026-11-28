// Harlo Citizen (harlolearn.com/citizen/): practice for the Life in the UK test, plus a link to English speaking
// practice in the Interview Coach (kind 'selt'). Questions: citizen/questions.js (CT_Q, written from the handbook).
// In English only: the real test is in English. Stored: hs_ct = { ok: {i: n}, bad: {i: n}, wrong: [i], tests: [{ d, s }] }
(function () {
'use strict';
const Q = window.CT_Q, CH = window.CT_CH, TEST_N = 24, PASS = 18, TEST_MIN = 45, PRACTICE_N = 10;
const $ = id => document.getElementById(id);
const app = $('app');
const get = (k, d) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } };
const put = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} };
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const fx = (k, xp) => { if (window.HSFX) { HSFX.sound(k); if (xp) HSFX.xp(xp); } };
function track(e) { try { if (location.protocol === 'file:') return; fetch('/.netlify/functions/track', { method: 'POST', keepalive: true, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ e, l: 'en', u: 'en' }) }).catch(() => {}); } catch (err) {} }
const st = () => { const s = get('hs_ct', {}); s.ok = s.ok || {}; s.bad = s.bad || {}; s.wrong = s.wrong || []; s.tests = s.tests || []; return s; };
const face = m => { const f = window.HSDog && HSDog.active() ? HSDog.face(m || 'happy') : null; return f ? (window.HSDress ? HSDress(f, 'mydog') : f) : HARLEY; };
const HARLEY = '<svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg"><rect x="10" y="10" width="280" height="280" rx="64" fill="#0E3B8C"/><path d="M92 228 l-26 40 l52 -24 z" fill="#fff"/><circle cx="212" cy="148" r="33" fill="#fff"/><circle cx="200" cy="184" r="33" fill="#fff"/><circle cx="169" cy="207" r="33" fill="#fff"/><circle cx="131" cy="207" r="33" fill="#fff"/><circle cx="100" cy="184" r="33" fill="#fff"/><circle cx="88" cy="148" r="33" fill="#fff"/><circle cx="100" cy="112" r="33" fill="#fff"/><circle cx="131" cy="89" r="33" fill="#fff"/><circle cx="169" cy="89" r="33" fill="#fff"/><circle cx="200" cy="112" r="33" fill="#fff"/><circle cx="150" cy="148" r="70" fill="#fff"/><circle cx="125" cy="138" r="9" fill="#1C2563"/><circle cx="175" cy="138" r="9" fill="#1C2563"/><circle cx="128" cy="135" r="3" fill="#fff"/><circle cx="178" cy="135" r="3" fill="#fff"/><ellipse cx="150" cy="163" rx="13" ry="9" fill="#1C2563"/><path d="M143 180 q7 16 14 0 z" fill="#F07C92"/><path d="M150 171 q-10 14 -22 4 M150 171 q10 14 22 4" fill="none" stroke="#1C2563" stroke-width="4" stroke-linecap="round"/></svg>';
const dressedHarley = () => window.HSDog && HSDog.active() ? face() : (window.HSDress ? HSDress(HARLEY, 'harley') : HARLEY);

// ---------- state of the current run ----------
let R = null; // { mode: 'test'|'practice'|'mistakes', items: [{ i, order: [option indexes] }], at, ans: {}, t0, timer, done }
function makeItems(ids) { return ids.map(i => ({ i, order: Q[i][2].length === 2 ? [0, 1] : shuffle(Q[i][2].map((_, k) => k)) })); }
const chOf = i => Q[i][0];

// ---------- home ----------
function home() {
  stopTimer(); R = null;
  const s = st(), tests = s.tests.slice(-3), ready = tests.length ? Math.round(100 * tests.reduce((a, x) => a + x.s, 0) / (tests.length * TEST_N)) : null;
  const best = s.tests.length ? Math.max(...s.tests.map(x => x.s)) : null;
  app.innerHTML = `
    <section class="ct-hero"><div class="ct-dog">${dressedHarley()}</div><div><h1>Pass your Life in the UK test</h1><p>Mock tests, practice by chapter with explanations, and English speaking practice. Free.</p></div></section>
    ${s.tests.length ? `<section class="card ct-stats"><div><b>${ready}%</b><span>average of your last ${tests.length === 1 ? 'test' : tests.length + ' tests'}</span></div><div><b>${best}/${TEST_N}</b><span>best score</span></div><div><b>${s.tests.length}</b><span>mock tests</span></div><div class="ct-meter"><i style="width:${ready}%"></i><em style="left:${Math.round(100 * PASS / TEST_N)}%"></em></div><p class="fine">${ready >= 85 ? '🎉 You look ready. Keep it up until test day.' : ready >= 75 ? 'Close to the pass mark: aim for 85%+ to be safe.' : 'Keep practising: the pass mark is 75% (18 out of 24).'}</p></section>` : ''}
    <div class="ct-modes">
      <button class="ct-mode m-test" data-go="test" style="--i:0"><span class="ic">📝</span><b>Mock test</b><small>24 questions · 45 minutes · like the real test</small></button>
      <button class="ct-mode m-prac" data-go="chapters" style="--i:1"><span class="ic">📚</span><b>Practise by chapter</b><small>10 questions, with the answer explained</small></button>
      <button class="ct-mode m-wrong" data-go="mistakes" style="--i:2"${s.wrong.length ? '' : ' disabled'}><span class="ic">🔁</span><b>My mistakes</b><small>${s.wrong.length ? `${s.wrong.length} question${s.wrong.length === 1 ? '' : 's'} to practise again` : 'Questions you get wrong appear here'}</small></button>
      <a class="ct-mode m-speak" href="/interview/?kind=selt" style="--i:3"><span class="ic">🎙️</span><b>English speaking test</b><small>Practise a B1 speaking and listening test with an examiner</small></a>
    </div>
    <section class="card ct-facts"><h3>About the test</h3>
      <ul><li><b>24 questions</b>, multiple choice, on a computer at a test centre</li><li><b>45 minutes</b></li><li>Pass mark <b>75%</b>: at least 18 right</li><li>All questions come from the official handbook, <i>Life in the United Kingdom: A Guide for New Residents</i> (3rd edition)</li><li>Book and check the fee on <a href="https://www.gov.uk/life-in-the-uk-test" target="_blank" rel="noopener">GOV.UK</a>. Only book through the official site.</li></ul>
      <p class="fine">⚠️ Harlo Citizen is practice only. The questions here are written from the handbook; the real test questions are not published. Not affiliated with the Home Office.</p></section>`;
}

// ---------- chapters ----------
function chapters() {
  const s = st();
  app.innerHTML = `<div class="ct-top"><button class="ct-back" data-go="home" aria-label="Back">←</button><h2>Practise by chapter</h2></div>
    <div class="ct-chs">${Object.keys(CH).map((c, k) => {
      const ids = Q.map((q, i) => i).filter(i => chOf(i) === c), got = ids.filter(i => (s.ok[i] || 0) > (s.bad[i] || 0)).length;
      return `<button class="ct-ch c-${c}" data-ch="${c}" style="--i:${k}"><b>${k + 1}. ${esc(CH[c])}</b><span class="bar"><i style="width:${Math.round(100 * got / ids.length)}%"></i></span><small>${got} of ${ids.length} mastered</small></button>`;
    }).join('')}
    <button class="ct-ch c-all" data-ch="all" style="--i:5"><b>🎲 Mixed: all chapters</b><small>${Q.length} questions</small></button></div>`;
}

// ---------- a run ----------
function startPractice(ch) {
  const s = st(), pool = Q.map((q, i) => i).filter(i => ch === 'all' || chOf(i) === ch);
  // questions not mastered yet come first
  const sorted = shuffle(pool).sort((a, b) => ((s.ok[a] || 0) - (s.bad[a] || 0)) - ((s.ok[b] || 0) - (s.bad[b] || 0)));
  R = { mode: 'practice', ch, items: makeItems(sorted.slice(0, PRACTICE_N)), at: 0, ans: {}, right: 0 };
  track('ct_practice'); question();
}
function startMistakes() {
  const s = st(); if (!s.wrong.length) return home();
  R = { mode: 'mistakes', items: makeItems(shuffle(s.wrong).slice(0, PRACTICE_N)), at: 0, ans: {}, right: 0 };
  question();
}
function startTest() {
  // a spread across chapters, like the real test
  const by = {}; Q.forEach((q, i) => { (by[q[0]] = by[q[0]] || []).push(i); });
  const want = { values: 2, uk: 3, history: 8, society: 6, law: 5 }, ids = [];
  for (const c in want) ids.push(...shuffle(by[c]).slice(0, want[c]));
  R = { mode: 'test', items: makeItems(shuffle(ids).slice(0, TEST_N)), at: 0, ans: {}, t0: Date.now(), done: false };
  track('ct_test'); question(); startTimer();
}
let timer = null;
function startTimer() { stopTimer(); timer = setInterval(tick, 1000); }
function stopTimer() { clearInterval(timer); timer = null; }
function tick() {
  if (!R || R.mode !== 'test') return stopTimer();
  const left = Math.max(0, TEST_MIN * 60 - Math.floor((Date.now() - R.t0) / 1000)), el = $('ctTime');
  if (el) { el.textContent = `⏱ ${Math.floor(left / 60)}:${String(left % 60).padStart(2, '0')}`; el.classList.toggle('low', left < 300); }
  if (left <= 0) finishTest();
}
function question() {
  const it = R.items[R.at], q = Q[it.i], n = R.items.length, test = R.mode === 'test', chosen = R.ans[R.at];
  const answered = chosen !== undefined && !test;
  app.innerHTML = `<div class="ct-top"><button class="ct-back" data-quit aria-label="Back">✕</button><h2>${test ? 'Mock test' : R.mode === 'mistakes' ? 'My mistakes' : esc(R.ch === 'all' ? 'Mixed' : CH[R.ch])}</h2>${test ? '<span class="ct-time" id="ctTime">⏱ 45:00</span>' : ''}</div>
    <div class="ct-prog">${R.items.map((x, k) => `<i class="${k === R.at ? 'cur' : ''} ${R.ans[k] !== undefined ? (test ? 'a' : (x.order[R.ans[k]] === Q[x.i][3] ? 'ok' : 'no')) : ''}"></i>`).join('')}</div>
    <section class="card ct-q" style="--k:${R.at}"><p class="ct-n">Question ${R.at + 1} of ${n} · <span>${esc(CH[q[0]])}</span></p><h3>${esc(q[1])}</h3>
      <div class="ct-opts">${it.order.map((o, k) => {
        let cls = ''; if (answered) cls = o === q[3] ? 'ok' : k === chosen ? 'no' : 'dim'; else if (test && chosen === k) cls = 'sel';
        return `<button class="ct-o ${cls}" data-opt="${k}"${answered ? ' disabled' : ''}><span class="l">${'ABCD'[k]}</span>${esc(q[2][o])}</button>`; }).join('')}</div>
      ${answered ? `<div class="ct-exp ${it.order[chosen] === q[3] ? 'good' : 'bad'}"><b>${it.order[chosen] === q[3] ? '✓ Correct!' : '✗ The answer is: ' + esc(q[2][q[3]])}</b><p>${esc(q[4])}</p></div>` : ''}
    </section>
    <div class="ct-nav">${test ? `<button class="btn" data-prev ${R.at ? '' : 'disabled'}>← Back</button>${R.at < n - 1 ? `<button class="btn primary" data-next>Next →</button>` : `<button class="btn primary" data-finish>Finish test</button>`}` : answered ? `<button class="btn primary big" data-next>${R.at < n - 1 ? 'Next question →' : 'See results'}</button>` : ''}</div>
    ${test ? `<p class="fine ct-left">${Object.keys(R.ans).length} of ${n} answered${Object.keys(R.ans).length < n && R.at === n - 1 ? ' · tap the dots to go back' : ''}</p>` : ''}`;
  if (test) tick();
}
function answer(k) {
  const it = R.items[R.at], q = Q[it.i];
  if (R.mode === 'test') { R.ans[R.at] = k; fx('tick'); question(); if (R.at < R.items.length - 1) setTimeout(() => { if (R && R.mode === 'test' && R.ans[R.at] === k) { R.at++; question(); } }, 350); return; }
  if (R.ans[R.at] !== undefined) return;
  R.ans[R.at] = k;
  const ok = it.order[k] === q[3];
  record(it.i, ok);
  if (ok) { R.right++; fx('good', 5); } else fx('try');
  question();
}
function record(i, ok) {
  const s = st();
  if (ok) { s.ok[i] = (s.ok[i] || 0) + 1; if (R.mode === 'mistakes' || (s.ok[i] > (s.bad[i] || 0))) s.wrong = s.wrong.filter(x => x !== i); }
  else { s.bad[i] = (s.bad[i] || 0) + 1; if (!s.wrong.includes(i)) s.wrong.push(i); }
  put('hs_ct', s);
}
function finishTest() {
  if (!R || R.done) return; R.done = true; stopTimer();
  let score = 0; const byCh = {};
  R.items.forEach((it, k) => { const q = Q[it.i], ok = R.ans[k] !== undefined && it.order[R.ans[k]] === q[3]; if (ok) score++; record(it.i, ok); const c = byCh[q[0]] = byCh[q[0]] || [0, 0]; c[1]++; if (ok) c[0]++; });
  const s = st(); s.tests.push({ d: new Date().toISOString().slice(0, 10), s: score }); s.tests = s.tests.slice(-30); put('hs_ct', s);
  const pass = score >= PASS, mins = Math.round((Date.now() - R.t0) / 60000);
  track(pass ? 'ct_pass' : 'ct_fail');
  if (window.HSFX) { HSFX.sound(pass ? 'win' : 'good'); if (pass) HSFX.confetti(); HSFX.xp(10 + score); }
  const order = R.items.map((it, k) => ({ it, k, ok: R.ans[k] !== undefined && it.order[R.ans[k]] === Q[it.i][3] })).sort((a, b) => a.ok - b.ok);
  app.innerHTML = `<div class="ct-top"><button class="ct-back" data-go="home" aria-label="Back">←</button><h2>Your result</h2></div>
    <section class="card ct-res ${pass ? 'pass' : 'fail'}"><div class="ct-dog big">${pass ? (window.HSDog && HSDog.active() ? face('celebrate') : dressedHarley()) : dressedHarley()}</div>
      <div class="ct-score">${score}<small>/${TEST_N}</small></div><b class="ct-verdict">${pass ? '🎉 PASS' : 'Not yet'}</b>
      <p>${pass ? `You'd pass with ${score} right. Aim for 20+ to feel safe on the day.` : `You need ${PASS} to pass: ${PASS - score} more. Practise the chapters below, then try again.`} · ${mins} min</p>
      <div class="ct-chres">${Object.keys(CH).filter(c => byCh[c]).map(c => `<div><span>${esc(CH[c])}</span><span class="bar"><i style="width:${Math.round(100 * byCh[c][0] / byCh[c][1])}%"></i></span><b>${byCh[c][0]}/${byCh[c][1]}</b></div>`).join('')}</div>
      <div class="row" style="justify-content:center;flex-wrap:wrap;margin-top:12px"><button class="btn primary" data-go="test">📝 Another mock test</button>${st().wrong.length ? `<button class="btn" data-go="mistakes">🔁 Practise my mistakes</button>` : ''}</div></section>
    <h3 class="ct-h">Review your answers</h3>
    ${order.map(({ it, k, ok }) => { const q = Q[it.i]; return `<details class="card ct-rev ${ok ? 'ok' : 'no'}"${ok ? '' : ' open'}><summary>${ok ? '✓' : '✗'} ${esc(q[1])}</summary>
      ${R.ans[k] !== undefined && !ok ? `<p class="yours">Your answer: ${esc(q[2][it.order[R.ans[k]]])}</p>` : !ok ? '<p class="yours">Not answered</p>' : ''}<p class="right">Answer: <b>${esc(q[2][q[3]])}</b></p><p class="fine">${esc(q[4])}</p></details>`; }).join('')}`;
  window.scrollTo(0, 0);
}
function practiceDone() {
  const n = R.items.length, r = R.right;
  if (window.HSFX) { HSFX.sound(r >= n * .8 ? 'win' : 'good'); if (r === n) HSFX.confetti(); HSFX.xp(10); }
  app.innerHTML = `<div class="ct-top"><button class="ct-back" data-go="home" aria-label="Back">←</button><h2>Well done!</h2></div>
    <section class="card ct-res ${r >= n * .75 ? 'pass' : 'fail'}"><div class="ct-dog big">${dressedHarley()}</div><div class="ct-score">${r}<small>/${n}</small></div>
    <p>${r === n ? 'Perfect!' : r >= n * .75 ? 'Great work. Keep going!' : 'Keep practising: the questions you missed are saved in My mistakes.'}</p>
    <div class="row" style="justify-content:center;flex-wrap:wrap"><button class="btn primary" data-again>Practise 10 more</button><button class="btn" data-go="chapters">Choose a chapter</button></div></section>`;
}

// ---------- events ----------
app.addEventListener('click', e => {
  const b = e.target.closest('button,[data-dot]'); if (!b) return;
  const d = b.dataset;
  if (d.go === 'home') return home();
  if (d.go === 'chapters') return chapters();
  if (d.go === 'test') return startTest();
  if (d.go === 'mistakes') return startMistakes();
  if (d.ch) return startPractice(d.ch);
  if (d.opt !== undefined) return answer(+d.opt);
  if (d.next !== undefined) { if (R.at < R.items.length - 1) { R.at++; question(); window.scrollTo(0, 0); } else if (R.mode === 'test') finishTest(); else practiceDone(); return; }
  if (d.prev !== undefined) { if (R.at) { R.at--; question(); } return; }
  if (d.finish !== undefined) { const left = R.items.length - Object.keys(R.ans).length; if (left && !confirm(`${left} question${left === 1 ? ' is' : 's are'} not answered. Finish anyway?`)) return; finishTest(); return; }
  if (d.again !== undefined) { if (R.mode === 'mistakes') startMistakes(); else startPractice(R.ch || 'all'); return; }
  if (d.quit !== undefined) { if (R && R.mode === 'test' && !R.done && Object.keys(R.ans).length && !confirm('Leave the mock test? Your answers will be lost.')) return; home(); }
});
// tap a dot on the progress bar to jump (mock test)
app.addEventListener('click', e => { const dot = e.target.closest('.ct-prog i'); if (!dot || !R || R.mode !== 'test') return; const k = [...dot.parentNode.children].indexOf(dot); if (k >= 0) { R.at = k; question(); } });
window.addEventListener('hs-dress', () => { if (!R) home(); });
home();
track('citizen');
})();
