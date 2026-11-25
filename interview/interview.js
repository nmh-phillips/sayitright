// Harley's Interview Coach (harleysays.com/interview/): spoken mock job interviews with Harley (or Lilou) as the interviewer.
// Hands-free like Harley Chats: Harley asks, the mic opens by itself, a pause sends the answer; the report comes at the end.
// Back end: /.netlify/functions/chat (scene 'interview', with job + itype) and /.netlify/functions/tts (kind 'line').
// Text: interview/i18n.js (IV_UI) and /games/acc-i18n.js (HG_ACC, sign-in). Sign-in: /account.js. Private beta: CHAT_BETA_EMAILS.
(function () {
'use strict';
const TURNS = 6;            // matches INTERVIEW_TURNS on the server (the server has the final say)
const PAUSE_BASE = 2100;    // quiet after speaking that sends the answer (longer than Chats: interview answers need thinking time); × pause setting
const WAIT_MS = 12000;      // stop listening if nothing is said for this long
const MAX_CHARS = 2200;     // longest answer kept (about 3 minutes of speech)
// Join speech results into one text. iPhone Safari often repeats the whole sentence so far in each new result,
// so a result that starts with what we already have replaces it instead of being added on.
function joinResults(results){
  let acc = '';
  for (const x of results) {
    const tr = String(x[0].transcript || '').trim(); if (!tr) continue;
    const a = acc.toLowerCase(), b = tr.toLowerCase();
    if (b.startsWith(a)) acc = tr; else if (!a.endsWith(b)) acc = acc ? acc + ' ' + tr : tr;
  }
  return acc;
}
// How long a pause sends the answer: the person's setting (Short / Normal / Long), shared by Chats and Interview Coach.
const PAUSES = { short: 0.65, normal: 1, long: 1.6 };
const KINDS = ['general', 'competency', 'customer'];
const LEVELS = ['easy', 'normal', 'hard'];
const LANGS = { en: ['en-GB', '🇬🇧'], enus: ['en-US', '🇺🇸'], es: ['es-ES', '🇪🇸'], esmx: ['es-MX', '🇲🇽'], fr: ['fr-FR', '🇫🇷'], it: ['it-IT', '🇮🇹'], de: ['de-DE', '🇩🇪'], pt: ['pt-PT', '🇵🇹'], nl: ['nl-NL', '🇳🇱'] };
const UI = window.IV_UI, ACC = window.HG_ACC || {};
const Rec = window.SpeechRecognition || window.webkitSpeechRecognition || null;
const $ = id => document.getElementById(id);
const store = { get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } }, set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} } };
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

// ---------- language ----------
let ui = (() => { const v = store.get('sir_ui', null); if (UI[v]) return v; const b = ((navigator.languages && navigator.languages[0]) || navigator.language || 'en').toLowerCase().split('-')[0]; return UI[b] ? b : 'en'; })();
function t(k, vars) {
  let v = (UI[ui] && UI[ui][k] !== undefined) ? UI[ui][k] : UI.en[k] !== undefined ? UI.en[k] : (ACC[ui] && ACC[ui][k] !== undefined) ? ACC[ui][k] : (ACC.en || {})[k];
  if (v === undefined) v = k;
  if (vars) for (const [a, b] of Object.entries(vars)) v = v.split('{' + a + '}').join(b);
  return v;
}
window.t = (k, v) => t(k, v); // sign-in text (account.js)
let lang = (() => { const v = store.get('hs_iv_lang', null) || store.get('sir_lang', null); return LANGS[v] ? v : 'en'; })();
const code = () => LANGS[lang][0];
function langName(k) {
  try { const n = new Intl.DisplayNames([ui], { type: 'language' }).of(LANGS[k][0]); return n.charAt(0).toUpperCase() + n.slice(1); } catch (e) { return LANGS[k][0]; }
}
const coach = () => store.get('sir_coach', 'harley') === 'lilou' ? 'lilou' : 'harley';
const coachName = () => coach() === 'lilou' ? 'Lilou' : 'Harley';
const DEVICE_ID = (() => { let d = store.get('sir_dev', null); if (!d) { d = (crypto.randomUUID ? crypto.randomUUID() : String(Math.random()).slice(2) + Date.now()); store.set('sir_dev', d); } return d; })();
function track(e) { try { if (location.protocol === 'file:') return; fetch('/.netlify/functions/track', { method: 'POST', keepalive: true, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ e, l: lang, u: ui }) }).catch(() => {}); } catch (err) {} }

// ---------- Harley's face ----------
const FACE = '<svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg"><rect x="10" y="10" width="280" height="280" rx="64" fill="#3346C8"/><path d="M92 228 l-26 40 l52 -24 z" fill="#fff"/><circle cx="212" cy="148" r="33" fill="#fff"/><circle cx="200" cy="184" r="33" fill="#fff"/><circle cx="169" cy="207" r="33" fill="#fff"/><circle cx="131" cy="207" r="33" fill="#fff"/><circle cx="100" cy="184" r="33" fill="#fff"/><circle cx="88" cy="148" r="33" fill="#fff"/><circle cx="100" cy="112" r="33" fill="#fff"/><circle cx="131" cy="89" r="33" fill="#fff"/><circle cx="169" cy="89" r="33" fill="#fff"/><circle cx="200" cy="112" r="33" fill="#fff"/><circle cx="150" cy="148" r="70" fill="#fff"/><circle cx="125" cy="138" r="9" fill="#1C2563"/><circle cx="175" cy="138" r="9" fill="#1C2563"/><circle cx="128" cy="135" r="3" fill="#fff"/><circle cx="178" cy="135" r="3" fill="#fff"/><ellipse cx="150" cy="163" rx="13" ry="9" fill="#1C2563"/><path d="M143 180 q7 16 14 0 z" fill="#F07C92"/><path d="M150 171 q-10 14 -22 4 M150 171 q10 14 22 4" fill="none" stroke="#1C2563" stroke-width="4" stroke-linecap="round"/></svg>';
const BOW = '<g transform="translate(212 78) rotate(-16)"><path d="M0 0 L-34 -20 Q-40 0 -34 20 Z" fill="#FF8CC2"/><path d="M0 0 L34 -20 Q40 0 34 20 Z" fill="#FF8CC2"/><circle r="10" fill="#FF4F9A"/></g>';
const LILOU = FACE.replace('<rect x="10" y="10" width="280" height="280" rx="64" fill="#3346C8"/>', '<rect x="10" y="10" width="280" height="280" rx="64" fill="#B9478A"/><g transform="translate(24 34) scale(.84)">').replace(/<\/svg>$/, '</g>' + BOW + '</svg>');
const face = () => coach() === 'lilou' ? LILOU : FACE;

// ---------- state ----------
const S = {
  view: 'setup', access: null, job: store.get('hs_iv_job', ''), kind: store.get('hs_iv_kind', 'general'), level: store.get('hs_iv_level', 'normal'),
  history: [], items: [], hint: '', busy: false, error: '', ended: false, sum: null,
  typing: !Rec, interim: '', listening: false, talking: false, paused: false,
  auto: !!Rec && store.get('hs_iv_auto', true), live: store.get('hs_iv_live', false), pause: store.get('hs_pause', 'normal'),
  showTr: store.get('hs_iv_tr', false),
  autoBlocked: false // this phone won't let the mic open by itself (iPhone): ask for a tap instead
};
const pauseMs = () => PAUSE_BASE * (PAUSES[S.pause] || 1);
if (!KINDS.includes(S.kind)) S.kind = 'general';
if (!LEVELS.includes(S.level)) S.level = 'normal';
const rich = text => esc(text).replace(/«([^»]+)»/g, (m, w) => `<button class="w" data-line="${w}">${w}</button>`);

// ---------- voice and face (/talkhead.js: big animated head, mouth moves with the words) ----------
const stage = window.HSTalk({ persona: () => coach(), code: () => code() });
function unlock() { stage.unlock(); } // inside a tap (iPhone)
// Say a line; done() runs when finished (not if interrupted). b64: his voice, sent with the line.
function say(text, done, b64) {
  stopListening(); S.talking = true; draw();
  const it = S.items.filter(x => x.r === 'c' && x.line === text).pop();
  stage.say(text, { b64, translation: S.showTr && it ? it.translation : '' }).then(ok => { S.talking = stage.talking; draw(); if (ok && done) done(); });
}
function hush() { stage.hush(); S.talking = false; }
const inInterview = () => S.view === 'iv';
function afterLine() {
  if (!inInterview()) return;
  if (S.ended) return finish();
  if (S.auto && !S.typing && !S.paused && !S.autoBlocked) setTimeout(() => { if (inInterview() && !S.busy && !S.talking && !S.listening && !S.ended) listen('', false); }, 250);
}

// ---------- listening ----------
let rec = null, quietT = null, waitT = null, stopRec = null; // stopRec: finish the answer now (tap)
function clearTimers() { clearTimeout(quietT); clearTimeout(waitT); quietT = waitT = null; }
function stopListening() { clearTimers(); if (rec) { const r = rec; rec = null; try { r.onend = null; r.abort(); } catch (e) {} } S.listening = false; S.interim = ''; }
// prefix: what was already said, when the phone's recogniser stopped by itself mid-answer and we carry on listening.
function listen(prefix, tap) {
  prefix = prefix || '';
  if (S.listening && !prefix) { if (stopRec) stopRec(); return; }
  if (!Rec) { S.typing = true; draw(); return; }
  hush();
  const r = rec = new Rec(); r.lang = code(); r.interimResults = true; r.continuous = !!S.auto; r.maxAlternatives = 1;
  let heard = '', failed = '', ours = false, lastAt = 0;
  const stop = () => { ours = true; r.stop(); }; stopRec = stop;
  r.onstart = () => {
    if (rec !== r) return;
    S.listening = true; S.interim = prefix; S.error = ''; S.paused = false; draw();
    if (S.auto) waitT = setTimeout(() => { if (rec === r && !heard) stop(); }, prefix ? pauseMs() : WAIT_MS);
  };
  r.onresult = e => {
    if (rec !== r) return;
    heard = joinResults(e.results); lastAt = Date.now(); S.interim = (prefix + ' ' + heard).trim();
    stage.listening(S.interim);
    if (S.auto) { clearTimeout(waitT); clearTimeout(quietT); quietT = setTimeout(() => { if (rec === r) stop(); }, pauseMs()); }
  };
  r.onerror = e => { failed = e.error || 'error'; };
  r.onend = () => {
    if (rec !== r) return;
    clearTimers(); rec = null; S.listening = false; S.interim = '';
    const said = (prefix + ' ' + heard).replace(/\s+/g, ' ').trim();
    // The phone stopped listening by itself while they were still talking: carry on, keeping what they said.
    if (said && S.auto && !ours && !failed && Date.now() - lastAt < pauseMs() && said.length < MAX_CHARS) return listen(said, false);
    if (said) return answer(said);
    if (prefix && (failed === 'not-allowed' || failed === 'service-not-allowed')) return answer(prefix);
    if ((failed === 'not-allowed' || failed === 'service-not-allowed') && !tap) { S.autoBlocked = true; S.paused = true; } // the phone wants a tap: ask for one, no error
    else if (failed === 'not-allowed' || failed === 'service-not-allowed') { S.error = esc(t('micBlocked')); S.paused = true; }
    else if (S.auto) S.paused = true;
    else S.error = esc(t('noCatch'));
    draw();
  };
  try { r.start(); } catch (err) { rec = null; S.listening = false; S.paused = true; if (!tap) S.autoBlocked = true; if (prefix) return answer(prefix); draw(); }
}

// ---------- server ----------
async function headers() {
  const h = { 'Content-Type': 'application/json' };
  const tok = window.hsAuthToken ? await window.hsAuthToken() : null;
  if (tok) h.Authorization = 'Bearer ' + tok;
  return h;
}
async function call(action) {
  const r = await fetch('/.netlify/functions/chat', { method: 'POST', headers: await headers(),
    body: JSON.stringify({ action, device: DEVICE_ID, lang, ui, scene: 'interview', level: S.level, persona: coach(), job: S.job, itype: S.kind, history: S.history, tips: S.live ? 'live' : 'end', voice: action !== 'end' }) });
  const j = await r.json().catch(() => ({}));
  if (!r.ok || j.error) { const e = new Error(j.error || 'HTTP ' + r.status); e.status = r.status; e.j = j; throw e; }
  return j;
}
function errMsg(status, j) {
  if (status === 429 || j.error === 'limit') { track('limit'); return esc(t('limit')); }
  if (/not configured/i.test(j.error || '')) return esc(t('off'));
  return esc(t('err')) + ` <button class="link" data-retry>${esc(t('retry'))}</button>`;
}
let pending = null;
function reset(view) { hush(); stopListening(); Object.assign(S, { view: view || 'setup', history: [], items: [], hint: '', busy: false, error: '', ended: false, sum: null, paused: false }); }
async function start() {
  reset('iv'); S.busy = true; pending = start;
  draw(); window.scrollTo({ top: 0, behavior: 'smooth' });
  try {
    const j = await call('start');
    S.history.push({ r: 'c', t: j.line }); S.items.push({ r: 'c', line: j.line, translation: j.translation });
    S.hint = j.hint || ''; track('iv_start'); stage.prefetchAcks();
    S.busy = false; say(j.line, afterLine, j.audio);
  } catch (e) {
    S.error = errMsg(e.status, e.j || {}); S.busy = false;
    if (!S.items.length) S.view = 'setup';
  }
  draw();
}
async function answer(text) {
  text = String(text || '').replace(/\s+/g, ' ').trim().slice(0, MAX_CHARS);
  if (!text || S.busy || S.ended) return;
  S.history.push({ r: 'l', t: text }); const item = { r: 'l', text }; S.items.push(item);
  S.busy = true; S.error = ''; S.hint = ''; S.interim = '';
  pending = () => { S.history.pop(); S.items.pop(); answer(text); };
  draw();
  const ack = stage.ack(); // a quick "mm-hm" while Harley thinks
  try {
    const j = await call('reply');
    if (j.feedback) item.fb = j.feedback;
    S.history.push({ r: 'c', t: j.line }); S.items.push({ r: 'c', line: j.line, translation: j.translation });
    S.hint = j.hint || ''; S.ended = !!j.end; track('iv_answer');
    await Promise.race([ack, new Promise(r => setTimeout(r, 1500))]);
    S.busy = false; if (inInterview()) say(j.line, afterLine, j.audio);
  } catch (e) { S.error = errMsg(e.status, e.j || {}); S.busy = false; }
  draw();
}
async function finish() {
  if (S.busy || S.view !== 'iv') return;
  hush(); stopListening();
  S.busy = true; S.error = ''; pending = finish; draw();
  try {
    const j = await call('end');
    // tips for each answer come with the report (unless they were shown during the interview)
    let k = 0; S.items.forEach(it => { if (it.r === 'l') { if (!it.fb && j.turns && j.turns[k]) it.fb = j.turns[k]; k++; } });
    S.sum = j; S.view = 'report'; track('iv_done');
  } catch (e) { S.error = errMsg(e.status, e.j || {}); }
  S.busy = false; draw();
  if (S.view === 'report') window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ---------- views ----------
function vGate() {
  const signedIn = window.hsAccount && window.hsAccount.signedIn();
  return `<div class="hero"><div class="dog">${face()}</div><div><h2>${esc(t('heroH'))}</h2><p>${esc(t('heroP', { name: coachName() }))}</p></div></div>
    <div class="card"><p>${esc(t(S.access === false ? 'beta' : 'wait', { name: coachName() }))}</p>
    ${S.access === false && !signedIn && window.hsAccount && window.hsAccount.ready() ? `<button class="btn primary" data-signin>👤 ${esc(t('acc_signin'))}</button>` : ''}</div>`;
}
function chips(name, list, cur, label) {
  return `<div class="chips" role="group" aria-label="${esc(label)}">${list.map(([v, txt, sub]) => `<button data-${name}="${v}" class="${cur === v ? 'on' : ''}" aria-pressed="${cur === v}">${esc(txt)}${sub ? `<small>${esc(sub)}</small>` : ''}</button>`).join('')}</div>`;
}
function vSetup() {
  return `<div class="hero"><div class="dog">${face()}</div><div><h2>${esc(t('heroH'))}</h2><p>${esc(t('heroP', { name: coachName() }))}</p></div></div>
  <div class="card">
    <label class="lbl" for="ivJob">${esc(t('job'))}</label>
    <input id="ivJob" maxlength="60" autocomplete="off" value="${esc(S.job)}" placeholder="${esc(t('jobPh'))}">
    <div class="lbl">${esc(t('kind'))}</div>
    ${chips('kind', KINDS.map(k => [k, t('t_' + k), t('d_' + k)]), S.kind, t('kind'))}
    <div class="lbl">${esc(t('level'))}</div>
    ${chips('level', LEVELS.map(l => [l, t(l)]), S.level, t('level'))}
    <label class="lbl" for="ivLang">${esc(t('ivIn'))}</label>
    <select id="ivLang">${Object.keys(LANGS).map(k => `<option value="${k}" ${k === lang ? 'selected' : ''}>${LANGS[k][1]} ${esc(langName(k))}</option>`).join('')}</select>
    <div class="opts">
      ${Rec ? `<label><input type="checkbox" data-opt="auto" ${S.auto ? 'checked' : ''}> ${esc(t('auto', { name: coachName() }))}</label>` : ''}
      <label><input type="checkbox" data-opt="live" ${S.live ? 'checked' : ''}> ${esc(t('tipsLive'))}</label>
    </div>
    ${Rec ? `<div class="lbl">${esc(t('pauseL'))}</div>${chips('pz', Object.keys(PAUSES).map(k => [k, t('pz_' + k)]), S.pause, t('pauseL'))}<div style="height:14px"></div>` : ''}
    <button class="btn primary big" data-start>${esc(t('start'))}</button>
    <p class="meta">${esc(t('meta', { n: TURNS }))}</p>
    ${Rec ? '' : `<p class="meta">${esc(t('noMic'))}</p>`}
    ${S.error ? `<p class="err">${S.error}</p>` : ''}
  </div>`;
}
const fbHtml = f => `<b>${esc(t(f.rating))}</b> ${rich(f.note)}${f.better ? `<div class="better"><span>${esc(t('stronger'))}</span> <button class="w" data-line="${esc(f.better)}">🔊 ${esc(f.better)}</button></div>` : ''}`;
function vInterview() {
  const answers = S.history.filter(h => h.r === 'l').length;
  let h = `<div class="card"><div class="top"><b>💼 ${esc(S.job || t('anyJob'))}</b><span class="meta">${esc(t('qn', { n: Math.min(answers + (S.ended ? 0 : 1), TURNS), m: TURNS }))}</span><button class="link" data-quit aria-label="${esc(t('newIv'))}">✕</button></div><div class="stage-slot"></div>
    <div class="trrow"><label><input type="checkbox" data-opt="tr" ${S.showTr ? 'checked' : ''}> ${esc(t('showTr'))}</label></div><div class="log" id="ivLog">`;
  S.items.forEach((it, i) => {
    if (it.r === 'c') {
      h += `<div class="row c"><div class="av${S.talking && i === S.items.length - 1 ? ' talk' : ''}">${face()}</div><div class="bub c"><div class="line">${esc(it.line)}</div>${it.showTr && it.translation ? `<div class="tr">${esc(it.translation)}</div>` : ''}<div class="tools"><button class="link" data-say="${i}">🔊</button>${it.translation ? `<button class="link" data-tr="${i}">${esc(t(it.showTr ? 'hideTr' : 'showTr'))}</button>` : ''}</div></div></div>`;
    } else {
      h += `<div class="row l"><div class="bub l">${esc(it.text)}</div></div>`;
      if (it.fb && S.live) h += `<div class="fb ${it.fb.rating}">${fbHtml(it.fb)}</div>`;
    }
  });
  h += `</div>`;
  if (S.error) h += `<p class="err">${S.error}</p>`;
  if (S.ended && !S.busy && !S.talking) h += `<button class="btn primary big" data-end>${esc(t('seeReport'))}</button>`;
  else if (S.items.length && !S.busy && !S.ended) {
    if (S.hint) h += `<div class="hint"><span>${esc(t('startWith'))}</span> <button class="w" data-line="${esc(S.hint)}">🔊 ${esc(S.hint)}</button></div>`;
    if (S.typing) {
      h += `<form class="type" data-form><textarea id="ivInput" rows="3" maxlength="${MAX_CHARS}" placeholder="${esc(t('placeholder'))}" lang="${esc(code())}"></textarea><button class="btn primary" type="submit">${esc(t('send'))}</button></form><div class="ctl">${Rec ? `<button class="link" data-mode>${esc(t('speakIn'))}</button>` : ''}`;
    } else if (S.auto) {
      const st = S.listening ? ['on', t('yourTurn')] : S.talking ? ['', t('speaking', { name: coachName() })] : ['tap', t('tapTalk')];
      h += `<button class="status ${st[0]}" data-mic>${S.listening ? '<span class="pulse"></span>' : S.talking ? '🔊' : '🎙️'} ${esc(st[1])}</button><div class="ctl">${S.listening || S.talking ? `<button class="link" data-pause>${esc(t('pause'))}</button>` : ''}<button class="link" data-mode>${esc(t('typeIn'))}</button>`;
    } else {
      h += `<button class="btn mic${S.listening ? ' rec' : ''}" data-mic>${esc(S.listening ? t('listening') : t('tap'))}</button><div class="ctl"><button class="link" data-mode>${esc(t('typeIn'))}</button>`;
    }
    if (answers) h += `<button class="link" data-end>${esc(t('finish'))}</button>`;
    h += `</div>`;
  }
  return h + `</div>`;
}
function vReport() {
  const s = S.sum, stars = s.score >= 85 ? 3 : s.score >= 65 ? 2 : s.score >= 40 ? 1 : 0;
  // pair each answer with the question it answered
  const pairs = []; let q = '';
  S.items.forEach(it => { if (it.r === 'c') q = it.line; else pairs.push({ q, a: it }); });
  let h = `<div class="card report"><div class="meta">💼 ${esc(S.job || t('anyJob'))} · ${esc(t('t_' + S.kind))}</div><h2>${esc(t('report'))}</h2>
    <div class="dog big">${face()}</div><div class="score">${s.score}<small>/100</small></div><div class="stars" aria-label="${stars}/3">${'★'.repeat(stars)}${'☆'.repeat(3 - stars)}</div>
    <p class="sum">${rich(s.summary)}</p>`;
  if (s.strongest) h += `<div class="box good"><b>💪 ${esc(t('strongest'))}</b><p>${rich(s.strongest)}</p></div>`;
  if (s.workOn) h += `<div class="box work"><b>🎯 ${esc(t('workOn'))}</b><p>${rich(s.workOn)}</p></div>`;
  if (pairs.length) h += `<h3>${esc(t('answers'))}</h3>` + pairs.map((p, i) => `<div class="pair"><div class="q">${i + 1}. ${esc(p.q)}</div><div class="a">“${esc(p.a.text)}”</div>${p.a.fb ? `<div class="fb ${p.a.fb.rating}">${fbHtml(p.a.fb)}</div>` : ''}</div>`).join('');
  if (s.practise && s.practise.length) h += `<h3>${esc(t('phrases'))}</h3>` + s.practise.map(x => `<div class="phr"><button class="w" data-line="${esc(x.p)}">🔊 ${esc(x.p)}</button><small>${esc(x.m)}</small></div>`).join('');
  h += `<div class="btns"><button class="btn" data-again>${esc(t('again'))}</button><button class="btn primary" data-quit>${esc(t('newIv'))}</button></div></div>`;
  return h;
}
function draw() {
  const app = $('app'); if (!app) return;
  if (S.access !== true) app.innerHTML = vGate();
  else app.innerHTML = S.view === 'iv' ? vInterview() : S.view === 'report' && S.sum ? vReport() : vSetup();
  const slot = app.querySelector('.stage-slot'); if (slot) slot.replaceWith(stage.el);
  if (S.view === 'iv') { if (S.listening) stage.listening(S.interim); else if (S.busy) stage.thinking(); else if (!S.talking) stage.mode(S.ended ? 'happy' : 'idle'); }
  const log = $('ivLog'); if (log) log.scrollTop = log.scrollHeight;
  const inp = $('ivInput'); if (inp && S.focusInput) { S.focusInput = false; inp.focus(); }
}
function applyStatic() {
  document.documentElement.lang = ui; document.documentElement.dir = window.IV_RTL[ui] ? 'rtl' : 'ltr';
  document.title = t('title') + ' — Harley Says';
  document.querySelectorAll('[data-t],[data-i18n]').forEach(el => { el.textContent = t(el.dataset.t || el.dataset.i18n); });
  const sel = $('ivUi'); if (sel) { sel.innerHTML = window.IV_UI_LANGS.map(([k, n]) => `<option value="${k}" ${k === ui ? 'selected' : ''}>${n}</option>`).join(''); }
  if (window.hsAccountRelabel) window.hsAccountRelabel();
}

// ---------- events ----------
document.addEventListener('input', e => { if (e.target.id === 'ivJob') { S.job = e.target.value.slice(0, 60); store.set('hs_iv_job', S.job); } });
document.addEventListener('change', e => {
  const el = e.target;
  if (el.id === 'ivUi') { ui = el.value; store.set('sir_ui', ui); applyStatic(); draw(); return; }
  if (el.id === 'ivLang') { lang = el.value; store.set('hs_iv_lang', lang); return; }
  if (el.dataset && el.dataset.opt === 'tr') { S.showTr = el.checked; store.set('hs_iv_tr', S.showTr); return; }
  if (el.dataset && el.dataset.opt === 'auto') { S.auto = el.checked; store.set('hs_iv_auto', S.auto); }
  if (el.dataset && el.dataset.opt === 'live') { S.live = el.checked; store.set('hs_iv_live', S.live); }
});
document.addEventListener('click', e => {
  const b = e.target.closest('#app button'); if (!b) return;
  const d = b.dataset;
  if (d.kind) { S.kind = d.kind; store.set('hs_iv_kind', S.kind); draw(); return; }
  if (d.level) { S.level = d.level; store.set('hs_iv_level', S.level); draw(); return; }
  if (d.pz) { S.pause = d.pz; store.set('hs_pause', S.pause); draw(); return; }
  if (b.hasAttribute('data-signin')) { if (window.hsAccount) window.hsAccount.open(); return; }
  if (b.hasAttribute('data-start')) { unlock(); start(); return; }
  if (d.line !== undefined) { unlock(); S.paused = true; say(d.line); return; }
  if (d.say !== undefined) { unlock(); say(S.items[+d.say].line, afterLine); return; }
  if (d.tr !== undefined) { const it = S.items[+d.tr]; it.showTr = !it.showTr; draw(); return; }
  if (b.hasAttribute('data-mic')) { unlock(); if (S.talking) hush(); S.paused = false; if (S.listening && stopRec) stopRec(); else listen('', true); return; }
  if (b.hasAttribute('data-pause')) { hush(); stopListening(); S.paused = true; draw(); return; }
  if (b.hasAttribute('data-mode')) { hush(); stopListening(); S.typing = !S.typing; S.focusInput = S.typing; if (!S.typing) S.paused = false; draw(); if (!S.typing && S.auto) listen('', true); return; }
  if (b.hasAttribute('data-end')) { unlock(); finish(); return; }
  if (b.hasAttribute('data-retry')) { S.error = ''; if (pending) pending(); return; }
  if (b.hasAttribute('data-again')) { unlock(); start(); return; }
  if (b.hasAttribute('data-quit')) { reset(); draw(); }
});
document.addEventListener('submit', e => {
  if (!e.target.closest('#app [data-form]')) return;
  e.preventDefault(); unlock();
  const inp = $('ivInput'); S.focusInput = true; answer(inp ? inp.value : '');
});
document.addEventListener('keydown', e => { if (e.target.id === 'ivInput' && e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); e.target.form.requestSubmit(); } });
document.addEventListener('visibilitychange', () => { if (document.hidden && S.view === 'iv') { hush(); stopListening(); S.paused = true; draw(); } });

// ---------- access (private beta, same list as Harley Chats) ----------
let checking = 0;
async function checkAccess() {
  const n = ++checking; let on = false;
  try {
    const r = await fetch('/.netlify/functions/chat', { method: 'POST', headers: await headers(), body: JSON.stringify({ action: 'access' }) });
    on = r.ok && !!(await r.json()).ok;
  } catch (e) {}
  if (n !== checking) return;
  if (!on) reset();
  S.access = on; draw();
}
window.addEventListener('hs-auth', checkAccess);

applyStatic(); draw();
track('interview');
if (location.protocol !== 'file:') checkAccess(); else { S.access = true; draw(); }
// account.js may finish loading its settings after this: redraw once so the sign-in button can appear on the gate.
setTimeout(draw, 1500);
})();
