// Harlo Interview Coach (harlolearn.com/interview/): spoken mock job interviews with Harley (or Lilou) as the interviewer.
// Hands-free like Harlo Chats: Harley asks, the mic opens by itself, a pause sends the answer; the report comes at the end.
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
const KINDS = ['general', 'competency', 'customer', 'selt']; // selt: English speaking test practice (Harlo Citizen)
const LEVELS = ['easy', 'normal', 'hard'];
const LANGS = { en: ['en-GB', '🇬🇧'], enus: ['en-US', '🇺🇸'], es: ['es-ES', '🇪🇸'], esmx: ['es-MX', '🇲🇽'], fr: ['fr-FR', '🇫🇷'], it: ['it-IT', '🇮🇹'], de: ['de-DE', '🇩🇪'], pt: ['pt-PT', '🇵🇹'], nl: ['nl-NL', '🇳🇱'] };
const UI = window.IV_UI, ACC = window.HG_ACC || {};
const Rec = window.SpeechRecognition || window.webkitSpeechRecognition || null;
const IOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
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
const face = () => { if (window.HSDog && HSDog.active()) return window.HSDress ? HSDress(HSDog.face('happy'), 'mydog') : HSDog.face('happy'); const f = coach() === 'lilou' ? LILOU : FACE; return window.HSDress ? HSDress(f, coach()) : f; };

// ---------- state ----------
const S = {
  who: store.get('hs_iv_who', 'man') === 'woman' ? 'woman' : 'man', // the interviewer: an illustrated man or woman
  view: 'setup', intro: true, more: false, access: null, job: store.get('hs_iv_job', ''), kind: store.get('hs_iv_kind', 'general'), level: store.get('hs_iv_level', 'normal'),
  history: [], items: [], hint: '', busy: false, error: '', ended: false, sum: null,
  typing: !Rec, interim: '', listening: false, talking: false, paused: false,
  auto: !!Rec && store.get('hs_iv_auto', !IOS), // iPhone: tap when you've finished (hands-free is unreliable there) live: store.get('hs_iv_live', false), pause: store.get('hs_pause', 'normal'),
  showTr: store.get('hs_iv_tr', false),
  mode: store.get('hs_iv_mode', 'iv') === 'pres' ? 'pres' : 'iv', // 'iv' = interview, 'pres' = presentation
  pt: store.get('hs_p_title', ''), paud: store.get('hs_p_aud', 'team'), pmin: store.get('hs_p_min', 5), pnotes: store.get('hs_p_notes', ''),
  pr: null, // presentation in progress / being checked: { text, m, secs, az }
  pres: null, // presentation report
  review: null, // { text, m }: what we heard, shown for checking before it's sent
  autoBlocked: false // this phone won't let the mic open by itself (iPhone): ask for a tap instead
};
const pauseMs = () => PAUSE_BASE * (PAUSES[S.pause] || 1);
if (!KINDS.includes(S.kind)) S.kind = 'general';
// Opened from Harlo Citizen (/interview/?kind=selt): straight to the English speaking test, in English.
try { const k = new URLSearchParams(location.search).get('kind'); if (KINDS.includes(k)) { S.kind = k; S.intro = false; S.mode = 'iv'; if (k === 'selt' && lang !== 'en' && lang !== 'enus') lang = 'en'; }
  const jb = new URLSearchParams(location.search).get('job'); if (jb) { S.job = jb.slice(0, 60); if (!new URLSearchParams(location.search).get('lang') && lang !== 'en' && lang !== 'enus') lang = 'en'; } } catch (e) {}
if (!LEVELS.includes(S.level)) S.level = 'normal';
const rich = text => esc(text).replace(/«([^»]+)»/g, (m, w) => `<button class="w" data-line="${w}">${w}</button>`);

// ---------- voice and face (/talkhead.js: big animated head, mouth moves with the words) ----------
const stage = window.HSTalk({ persona: () => S.who, code: () => code() });
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

// ---------- Azure speech (better with accents than the phone's own recogniser) ----------
// A 10-minute token from /speech-token (kind 'iv', its own daily allowance); answers stream to Azure with word timings,
// and, where Azure supports it, unscripted pronunciation and fluency scores. Anything fails → the phone's recogniser.
const SDK_SRC = '/vendor/speech-sdk-1.53.0.min.js';
const AZ = { tok: null, at: 0, ok: null, pa: true, sdkP: null };
function loadSDK() {
  if (window.SpeechSDK) return Promise.resolve();
  if (!AZ.sdkP) AZ.sdkP = new Promise((res, rej) => {
    const sc = document.createElement('script'); sc.src = SDK_SRC; sc.async = true;
    sc.onload = () => window.SpeechSDK ? res() : rej(new Error('sdk'));
    sc.onerror = () => { AZ.sdkP = null; rej(new Error('sdk')); };
    document.head.appendChild(sc);
  });
  return AZ.sdkP;
}
async function azPrepare() {
  if (AZ.ok === false || location.protocol === 'file:') return false;
  if (AZ.tok && Date.now() - AZ.at < 8.5 * 60000 && window.SpeechSDK) return true;
  try {
    const [r] = await Promise.all([
      fetch('/.netlify/functions/speech-token', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ device: DEVICE_ID, kind: 'iv' }) }),
      loadSDK()
    ]);
    const j = await r.json().catch(() => ({}));
    if (!r.ok || !j.token) { if (r.status === 503 || !AZ.tok) AZ.ok = false; return false; }
    AZ.tok = j; AZ.at = Date.now(); AZ.ok = true; return true;
  } catch (e) { if (!AZ.tok) AZ.ok = false; return false; }
}
const azReady = () => AZ.ok === true && !!window.SpeechSDK && !!AZ.tok && Date.now() - AZ.at < 9.5 * 60000;
const FILLERS = /(^|\s)(um+|uh+|erm+|er|ah+|hmm+|eh+|ehm|em+|euh|äh+|ähm|eeh|ehh|mmm+)(?=\s|$|[,.!?])/gi;
const countFillers = txt => (String(txt || '').match(FILLERS) || []).length;
// Delivery numbers for one answer: pace (words a minute), long pauses (over 2 s), fillers, and Azure's fluency/pronunciation (0-100).
function azMetrics(segs, text) {
  const words = []; let flu = 0, pron = 0, dur = 0, lex = '';
  for (const seg of segs) {
    const nb = seg.NBest && seg.NBest[0]; if (!nb) continue;
    lex += ' ' + (nb.Lexical || '');
    const pa = nb.PronunciationAssessment, d = Number(seg.Duration) || 1;
    if (pa && pa.FluencyScore != null) { flu += Number(pa.FluencyScore) * d; pron += Number(pa.PronScore != null ? pa.PronScore : pa.AccuracyScore || 0) * d; dur += d; }
    for (const w of nb.Words || []) words.push({ o: Number(w.Offset) || 0, d: Number(w.Duration) || 0 });
  }
  words.sort((a, b) => a.o - b.o);
  let pauses = 0; for (let i = 1; i < words.length; i++) if (words[i].o - (words[i - 1].o + words[i - 1].d) > 2e7) pauses++;
  const span = words.length > 1 ? (words[words.length - 1].o + words[words.length - 1].d - words[0].o) / 1e7 : 0;
  const n = String(text || '').split(/\s+/).filter(Boolean).length;
  return { wpm: span > 3 ? Math.round(n / (span / 60)) : null, pauses: words.length > 1 ? pauses : null, fillers: countFillers(lex) || countFillers(text),
    fluency: dur ? Math.round(flu / dur) : null, pron: dur ? Math.round(pron / dur) : null };
}
function listenAz(tap) {
  const SDK = window.SpeechSDK;
  let rec, finals = [], segs = [], part = '', ours = false, done = false, firstAt = 0;
  try {
    const cfg = SDK.SpeechConfig.fromAuthorizationToken(AZ.tok.token, AZ.tok.region);
    cfg.speechRecognitionLanguage = code();
    cfg.outputFormat = SDK.OutputFormat.Detailed; cfg.requestWordLevelTimestamps();
    rec = new SDK.SpeechRecognizer(cfg, SDK.AudioConfig.fromDefaultMicrophoneInput());
    if (AZ.pa) { try { new SDK.PronunciationAssessmentConfig('', SDK.PronunciationAssessmentGradingSystem.HundredMark, SDK.PronunciationAssessmentGranularity.Word, false).applyTo(rec); } catch (e) { AZ.pa = false; } }
  } catch (e) { AZ.ok = false; return listenPhone('', tap); }
  hush();
  const said = () => (finals.join(' ') + ' ' + part).replace(/\s+/g, ' ').trim();
  const end = () => {
    if (done) return; done = true; clearTimers(); stopRec = null;
    const text = finals.join(' ').replace(/\s+/g, ' ').trim() || part.trim();
    const m = azMetrics(segs, text);
    try { rec.close(); } catch (e) {}
    azRec = null; S.listening = false; S.interim = '';
    if (text) return gotAnswer(text, m);
    if (S.auto) S.paused = true; else S.error = esc(t('noCatch'));
    draw();
  };
  const stop = () => { if (ours) return; ours = true; clearTimers(); try { rec.stopContinuousRecognitionAsync(() => setTimeout(end, 250), end); } catch (e) { end(); } setTimeout(end, 4000); };
  stopRec = stop; azRec = { stop: () => { done = true; clearTimers(); try { rec.stopContinuousRecognitionAsync(() => { try { rec.close(); } catch (e) {} }, () => {}); } catch (e) {} } };
  const quiet = () => { if (S.auto) { clearTimeout(waitT); clearTimeout(quietT); quietT = setTimeout(stop, pauseMs()); } };
  rec.recognizing = (x, e) => { if (done) return; if (!firstAt) firstAt = Date.now(); part = e.result.text || ''; S.interim = said(); stage.listening(S.interim); quiet(); };
  rec.recognized = (x, e) => {
    if (done || e.result.reason !== SDK.ResultReason.RecognizedSpeech) return;
    try { segs.push(JSON.parse(e.result.properties.getProperty(SDK.PropertyId.SpeechServiceResponse_JsonResult))); } catch (err) {}
    if (e.result.text) finals.push(e.result.text); part = ''; S.interim = said(); stage.listening(S.interim); quiet();
    if (said().length >= MAX_CHARS) stop();
  };
  rec.canceled = (x, e) => {
    if (done || e.reason !== SDK.CancellationReason.Error) return;
    // pronunciation scoring not offered for this language: carry on without it next time
    if (AZ.pa && !finals.length && /pronunciation|assessment/i.test(e.errorDetails || '')) { AZ.pa = false; done = true; try { rec.close(); } catch (er) {} azRec = null; S.listening = false; return listenAz(tap); }
    if (finals.length) return stop();
    done = true; try { rec.close(); } catch (er) {} azRec = null; S.listening = false; AZ.ok = false;
    listenPhone('', tap); // fall back to the phone's recogniser for this answer and the rest
  };
  rec.startContinuousRecognitionAsync(() => {
    S.listening = true; S.interim = ''; S.error = ''; S.paused = false; draw();
    if (S.auto) waitT = setTimeout(() => { if (!finals.length && !part) stop(); }, WAIT_MS);
    setTimeout(() => { if (!done) stop(); }, 180000); // 3 minutes at most
  }, () => { done = true; azRec = null; AZ.ok = false; listenPhone('', tap); });
}
let azRec = null;
// What we heard: shown for checking (and correcting) before it's sent. Hands-free sends it by itself after a few seconds.
let reviewT = null;
function gotAnswer(text, m) {
  S.review = { text, m: m || null, auto: S.auto };
  draw();
  if (S.auto) reviewT = setTimeout(sendReview, 4500);
}
function holdReview() { clearTimeout(reviewT); reviewT = null; if (S.review) S.review.auto = false; const bar = document.querySelector('.rv-bar'); if (bar) bar.remove(); }
function sendReview() {
  clearTimeout(reviewT); reviewT = null; const r = S.review; if (!r) return;
  const box = $('rvText'); const text = (box ? box.value : r.text).replace(/\s+/g, ' ').trim();
  S.review = null;
  if (!text) { draw(); return; }
  answer(text, text === r.text ? r.m : Object.assign({}, r.m, { edited: true }));
}

// ---------- listening ----------
let rec = null, quietT = null, waitT = null, stopRec = null; // stopRec: finish the answer now (tap)
function clearTimers() { clearTimeout(quietT); clearTimeout(waitT); quietT = waitT = null; }
function stopListening() { clearTimers(); if (azRec) { const a = azRec; azRec = null; a.stop(); } if (rec) { const r = rec; rec = null; try { r.onend = null; r.abort(); } catch (e) {} } S.listening = false; S.interim = ''; }
// prefix: what was already said, when the phone's recogniser stopped by itself mid-answer and we carry on listening.
function listen(prefix, tap) {
  if (S.listening && !prefix) { if (stopRec) stopRec(); return; }
  if (S.review) return;
  if (!prefix && azReady()) return listenAz(tap);
  return listenPhone(prefix, tap);
}
function listenPhone(prefix, tap) {
  prefix = prefix || '';
  if (!Rec) { S.typing = true; draw(); return; }
  hush();
  const r = rec = new Rec(); r.lang = code(); r.interimResults = true; r.continuous = !!S.auto; r.maxAlternatives = 1;
  let heard = '', failed = '', ours = false, lastAt = 0, firstAt = 0;
  const stop = () => { ours = true; r.stop(); }; stopRec = stop;
  r.onstart = () => {
    if (rec !== r) return;
    S.listening = true; S.interim = prefix; S.error = ''; S.paused = false; draw();
    if (S.auto) waitT = setTimeout(() => { if (rec === r && !heard) stop(); }, prefix ? pauseMs() : WAIT_MS);
  };
  r.onresult = e => {
    if (rec !== r) return;
    heard = joinResults(e.results); lastAt = Date.now(); if (!firstAt) firstAt = lastAt; S.interim = (prefix + ' ' + heard).trim();
    stage.listening(S.interim);
    if (S.auto) { clearTimeout(waitT); clearTimeout(quietT); quietT = setTimeout(() => { if (rec === r) stop(); }, pauseMs()); }
  };
  r.onerror = e => { failed = e.error || 'error'; };
  r.onend = () => {
    if (rec !== r) return;
    clearTimers(); rec = null; S.listening = false; S.interim = '';
    const said = (prefix + ' ' + heard).replace(/\s+/g, ' ').trim();
    // The phone stopped listening by itself while they were still talking: carry on, keeping what they said.
    if (said && S.auto && !ours && !failed && Date.now() - lastAt < pauseMs() && said.length < MAX_CHARS) return listenPhone(said, false);
    const secs = firstAt && lastAt > firstAt ? (lastAt - firstAt) / 1000 : 0, n = said.split(/\s+/).filter(Boolean).length;
    const m = { wpm: !prefix && secs > 3 ? Math.round(n / (secs / 60)) : null, pauses: null, fillers: countFillers(said), fluency: null, pron: null };
    if (said) return gotAnswer(said, m);
    if (prefix && (failed === 'not-allowed' || failed === 'service-not-allowed')) return gotAnswer(prefix, null);
    if ((failed === 'not-allowed' || failed === 'service-not-allowed') && !tap) { S.autoBlocked = true; S.paused = true; } // the phone wants a tap: ask for one, no error
    else if (failed === 'not-allowed' || failed === 'service-not-allowed') { S.error = esc(t('micBlocked')); S.paused = true; }
    else if (S.auto) S.paused = true;
    else S.error = esc(t('noCatch'));
    draw();
  };
  try { r.start(); } catch (err) { rec = null; S.listening = false; S.paused = true; if (!tap) S.autoBlocked = true; if (prefix) return gotAnswer(prefix, null); draw(); }
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
    body: JSON.stringify({ action, device: DEVICE_ID, lang, ui, scene: 'interview', level: S.level, persona: S.who, job: S.kind === 'selt' ? '' : S.job, itype: S.kind, history: S.history, tips: S.live ? 'live' : 'end', voice: action !== 'end', delivery: S.items.filter(x => x.r === 'l').map(x => x.m || null) }) });
  const j = await r.json().catch(() => ({}));
  if (!r.ok || j.error) { const e = new Error(j.error || 'HTTP ' + r.status); e.status = r.status; e.j = j; throw e; }
  return j;
}
function errMsg(status, j) {
  if (j.error === 'selt_limit') { if (S.selt) S.selt.used = S.selt.limit; return esc(t('seltUsed')); }
  if (j.error === 'signin') return esc(t('seltSign'));
  if (status === 429 || j.error === 'limit') { track('limit'); return esc(t('limit')); }
  if (/not configured/i.test(j.error || '')) return esc(t('off'));
  return esc(t('err')) + ` <button class="link" data-retry>${esc(t('retry'))}</button>`;
}
let pending = null;
function reset(view) { hush(); stopListening(); if (typeof PR !== 'undefined' && (PR.az || PR.rec)) { PR.stopping = true; clearInterval(PR.timer); try { PR.az && PR.az.close(); } catch (e) {} try { PR.rec && PR.rec.abort(); } catch (e) {} PR.az = PR.rec = null; } clearTimeout(reviewT); Object.assign(S, { review: null, view: view || 'setup', history: [], items: [], hint: '', busy: false, error: '', ended: false, sum: null, paused: false }); }
async function start() {
  reset('iv'); S.busy = true; pending = start;
  draw(); window.scrollTo({ top: 0, behavior: 'smooth' });
  try {
    const j = await call('start');
    S.history.push({ r: 'c', t: j.line }); S.items.push({ r: 'c', line: j.line, translation: j.translation });
    S.hint = j.hint || ''; track('iv_start'); if (S.kind === 'selt' && S.selt && !S.selt.unlimited) S.selt.used++; stage.prefetchAcks(); azPrepare();
    S.busy = false; say(j.line, afterLine, j.audio);
  } catch (e) {
    S.error = errMsg(e.status, e.j || {}); S.busy = false;
    if (!S.items.length) S.view = 'setup';
  }
  draw();
}
async function answer(text, m) {
  text = String(text || '').replace(/\s+/g, ' ').trim().slice(0, MAX_CHARS);
  if (!text || S.busy || S.ended) return;
  if (azReady() && Date.now() - AZ.at > 7 * 60000) azPrepare(); // fresh token before the next answer
  S.history.push({ r: 'l', t: text }); const item = { r: 'l', text, m: m || null }; S.items.push(item);
  S.busy = true; S.error = ''; S.hint = ''; S.interim = '';
  pending = () => { S.history.pop(); S.items.pop(); answer(text, m); };
  draw();
  const ack = stage.ack(); // a quick "mm-hm" while Harley thinks
  try {
    const j = await call('reply');
    if (j.feedback) item.fb = j.feedback;
    S.history.push({ r: 'c', t: j.line }); S.items.push({ r: 'c', line: j.line, translation: j.translation });
    S.hint = j.hint || ''; S.ended = !!j.end; track('iv_answer'); if (window.HSFX) { HSFX.sound('good'); HSFX.xp(10); }
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
    S.sum = j; S.view = 'report'; track('iv_done'); if (window.HSFX) { HSFX.sound('win'); HSFX.confetti(); HSFX.xp(30); }
  } catch (e) { S.error = errMsg(e.status, e.j || {}); }
  S.busy = false; draw();
  if (S.view === 'report') window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ---------- views ----------
// English speaking test (from Harlo Citizen): one free a week for anyone signed in; Premium / Citizen pass for more.
const seltBlocked = () => S.kind === 'selt' && S.selt && S.selt.signedIn && !S.selt.unlimited && S.selt.used >= S.selt.limit;
function vSeltLimit() {
  return `<section class="iv-intro">
    <div class="iv-pair"><span class="ivp a">${window.HSTalk.face('man')}</span><span class="ivp b">${window.HSTalk.face('woman')}</span><span class="iv-bub">🇬🇧</span></div>
    <h2>${esc(t('t_selt'))}</h2>
    <div class="iv-lock" role="status"><p>✅ ${esc(t('seltUsed'))}</p><p style="font-weight:500;opacity:.92">${esc(t('seltMore'))}</p>
    <button class="iv-go" disabled style="opacity:.7;cursor:default">⭐ ${esc(t('seltPass'))} · ${esc(t('seltSoon'))}</button></div>
    <a class="iv-pres" href="/citizen/" style="display:block;text-decoration:none;margin-top:10px">← Harlo Citizen</a>
  </section>`;
}
function vGate() {
  const signedIn = window.hsAccount && window.hsAccount.signedIn();
  const canSign = S.access === false && !signedIn && window.hsAccount && window.hsAccount.ready();
  const msg = S.access === false ? (S.kind === 'selt' ? '🎙️ ' + t('seltSign') : '🔒 ' + t('beta')) : t('wait', { name: coachName() });
  const sl = S.kind === 'selt';
  return `<section class="iv-intro">
    <div class="iv-pair"><span class="ivp a">${window.HSTalk.face('man')}</span><span class="ivp b">${window.HSTalk.face('woman')}</span><span class="iv-bub">${sl ? '🇬🇧' : '💼'}</span></div>
    <h2>${esc(t(sl ? 't_selt' : 'heroH'))}</h2>
    <p>${esc(sl ? t('d_selt') + ' · ' + t('seltLeft') : t('heroP2'))}</p>
    <ol class="iv-steps">${['🎙️', '💡', '📋'].map((ic, i) => `<li style="--i:${i}"><span>${ic}</span>${esc(t('ivS' + (i + 1)))}</li>`).join('')}</ol>
    <div class="iv-lock" role="status"><p>${esc(msg)}</p>${canSign ? `<button class="iv-go" data-signin>👤 ${esc(t('acc_signin'))}</button>` : ''}</div>
  </section>`;
}
function chips(name, list, cur, label) {
  return `<div class="chips" role="group" aria-label="${esc(label)}">${list.map(([v, txt, sub]) => `<button data-${name}="${v}" class="${cur === v ? 'on' : ''}" aria-pressed="${cur === v}">${esc(txt)}${sub ? `<small>${esc(sub)}</small>` : ''}</button>`).join('')}</div>`;
}

// ---------- Presentation mode: speak for 2-10 minutes, then one report on structure, clarity and delivery ----------
const AUDS = ['team', 'class', 'pitch', 'event'], MINS = [2, 5, 10];
if (!AUDS.includes(S.paud)) S.paud = 'team';
if (!MINS.includes(S.pmin)) S.pmin = 5;
const PR = { rec: null, az: null, finals: [], part: '', segs: [], t0: 0, timer: null, stopping: false };
const prText = () => (PR.finals.join(' ') + ' ' + PR.part).replace(/\s+/g, ' ').trim();
const mmss = sec => Math.floor(sec / 60) + ':' + String(Math.floor(sec % 60)).padStart(2, '0');
function prTick() {
  if (!PR.t0 || S.view !== 'prec') return;
  const secs = (Date.now() - PR.t0) / 1000, max = S.pmin * 60;
  const el = $('pTime'); if (el) el.textContent = mmss(secs);
  const ring = $('pRing'); if (ring) { const c = 2 * Math.PI * 54; ring.style.strokeDashoffset = c * (1 - Math.min(1, secs / max)); ring.classList.toggle('over', secs > max); }
  const tx = $('pLive'); if (tx) { const w = prText().split(' '); tx.textContent = w.slice(-40).join(' '); }
  if (secs > Math.min(max * 1.5, 15 * 60)) stopPres(); // hard stop well past the target
  // keep the Azure token fresh on long talks (tokens last 10 minutes)
  if (PR.az && Date.now() - AZ.at > 8 * 60000 && !PR.refreshing) { PR.refreshing = true; AZ.at = 0; azPrepare().then(ok => { PR.refreshing = false; if (ok && PR.az) try { PR.az.authorizationToken = AZ.tok.token; } catch (e) {} }); }
}
async function startPres() {
  hush(); stopListening(); unlock();
  Object.assign(PR, { finals: [], part: '', segs: [], stopping: false, az: null, rec: null, t0: 0 });
  S.pr = null; S.pres = null; S.error = ''; S.view = 'prec'; S.busy = true; draw(); window.scrollTo(0, 0);
  track('pres_start');
  const az = await azPrepare().catch(() => false);
  if (S.view !== 'prec') return;
  S.busy = false;
  if (az && azReady()) presAz(); else presPhone();
}
function presBegin() { PR.t0 = Date.now(); clearInterval(PR.timer); PR.timer = setInterval(prTick, 500); S.listening = true; draw(); prTick(); }
function presAz() {
  const SDK = window.SpeechSDK; let rec;
  try {
    const cfg = SDK.SpeechConfig.fromAuthorizationToken(AZ.tok.token, AZ.tok.region);
    cfg.speechRecognitionLanguage = code(); cfg.outputFormat = SDK.OutputFormat.Detailed; cfg.requestWordLevelTimestamps();
    rec = new SDK.SpeechRecognizer(cfg, SDK.AudioConfig.fromDefaultMicrophoneInput());
    if (AZ.pa) { try { new SDK.PronunciationAssessmentConfig('', SDK.PronunciationAssessmentGradingSystem.HundredMark, SDK.PronunciationAssessmentGranularity.Word, false).applyTo(rec); } catch (e) { AZ.pa = false; } }
  } catch (e) { AZ.ok = false; return presPhone(); }
  PR.az = rec;
  rec.recognizing = (x, e) => { PR.part = e.result.text || ''; stage.listening(prText().split(' ').slice(-12).join(' ')); };
  rec.recognized = (x, e) => {
    if (e.result.reason !== SDK.ResultReason.RecognizedSpeech) return;
    try { PR.segs.push(JSON.parse(e.result.properties.getProperty(SDK.PropertyId.SpeechServiceResponse_JsonResult))); } catch (err) {}
    if (e.result.text) PR.finals.push(e.result.text); PR.part = '';
  };
  rec.canceled = (x, e) => {
    if (e.reason !== SDK.CancellationReason.Error || PR.stopping) return;
    if (AZ.pa && !PR.finals.length && /pronunciation|assessment/i.test(e.errorDetails || '')) { AZ.pa = false; try { rec.close(); } catch (er) {} PR.az = null; return presAz(); }
    if (PR.finals.length) return stopPres();
    try { rec.close(); } catch (er) {} PR.az = null; AZ.ok = false; presPhone();
  };
  rec.startContinuousRecognitionAsync(presBegin, () => { PR.az = null; AZ.ok = false; presPhone(); });
}
function presPhone() {
  if (!Rec) { S.view = 'setup'; S.error = esc(t('noMic')); draw(); return; }
  let base = PR.finals.join(' ');
  const go = () => {
    const r = PR.rec = new Rec(); r.lang = code(); r.interimResults = true; r.continuous = true;
    r.onresult = e => { PR.part = joinResults(e.results); stage.listening(prText().split(' ').slice(-12).join(' ')); };
    r.onerror = e => { if (e.error === 'not-allowed' || e.error === 'service-not-allowed') { PR.denied = true; } };
    r.onend = () => {
      if (PR.part) { PR.finals.push(PR.part); PR.part = ''; }
      if (PR.stopping || PR.denied) { PR.rec = null; if (PR.denied && !PR.stopping) { PR.denied = false; S.view = 'setup'; S.error = esc(t('micBlocked')); clearInterval(PR.timer); S.listening = false; draw(); } else if (PR.stopping) presDone(); return; }
      try { go(); } catch (err) { presDone(); } // the phone stopped by itself: carry on listening
    };
    r.start();
  };
  try { go(); presBegin(); } catch (e) { S.view = 'setup'; S.error = esc(t('noMic')); draw(); }
}
function stopPres() {
  if (PR.stopping || S.view !== 'prec') return; PR.stopping = true; clearInterval(PR.timer);
  if (PR.az) { const rec = PR.az; let done = false; const fin = () => { if (done) return; done = true; try { rec.close(); } catch (e) {} PR.az = null; presDone(true); }; try { rec.stopContinuousRecognitionAsync(() => setTimeout(fin, 300), fin); } catch (e) { fin(); } setTimeout(fin, 5000); }
  else if (PR.rec) { try { PR.rec.stop(); } catch (e) { presDone(); } setTimeout(() => { if (S.view === 'prec') presDone(); }, 2500); }
  else presDone();
}
function presDone(az) {
  if (S.view !== 'prec') return;
  S.listening = false; clearInterval(PR.timer);
  const secs = Math.round((Date.now() - PR.t0) / 1000), text = prText();
  const m = az ? azMetrics(PR.segs, text) : { wpm: null, pauses: null, fillers: countFillers(text), fluency: null, pron: null };
  if (!m.wpm && secs > 10) m.wpm = Math.round(text.split(/\s+/).filter(Boolean).length / (secs / 60));
  m.secs = secs;
  S.pr = { text, m, secs }; S.view = 'prev'; draw(); window.scrollTo(0, 0);
}
function cancelPres() { PR.stopping = true; clearInterval(PR.timer); if (PR.az) { try { PR.az.stopContinuousRecognitionAsync(() => {}, () => {}); PR.az.close(); } catch (e) {} PR.az = null; } if (PR.rec) { try { PR.rec.abort(); } catch (e) {} PR.rec = null; } S.listening = false; S.view = 'setup'; S.pr = null; draw(); }
async function sendPres() {
  const box = $('pText'); const text = (box ? box.value : (S.pr && S.pr.text) || '').replace(/\s+/g, ' ').trim();
  if (!text) return;
  S.pr.text = text; S.busy = true; S.error = ''; draw();
  try {
    const r = await fetch('/.netlify/functions/present', { method: 'POST', headers: await headers(), body: JSON.stringify({ device: DEVICE_ID, lang, ui, title: S.pt, audience: S.paud, minutes: S.pmin, notes: S.pnotes, transcript: text, delivery: S.pr.m }) });
    const j = await r.json().catch(() => ({}));
    if (r.status === 429 || j.error === 'limit') { S.error = esc(t('presLimit')); track('limit'); }
    else if (!r.ok || j.error) S.error = esc(t('err')) + ` <button class="link" data-pfb>${esc(t('retry'))}</button>`;
    else { S.pres = j; S.view = 'prep'; track('pres_done'); if (window.HSFX) { HSFX.sound('win'); HSFX.confetti(); HSFX.xp(40); } window.scrollTo(0, 0); }
  } catch (e) { S.error = esc(t('err')) + ` <button class="link" data-pfb>${esc(t('retry'))}</button>`; }
  S.busy = false; draw();
}
function vPresSetup() {
  const chip = (attr, val, on, label) => `<button type="button" data-${attr}="${val}" class="${on ? 'on' : ''}" aria-pressed="${on}">${label}</button>`;
  return `<div class="card iv-in" style="--d:1">
    <label class="lbl" for="pTitle" style="margin-top:0">${esc(t('presTitle'))}</label>
    <input id="pTitle" maxlength="100" autocomplete="off" value="${esc(S.pt)}" placeholder="${esc(t('presTitlePh'))}">
    <div class="lbl">${esc(t('presAud'))}</div>
    <div class="chips p-chips">${AUDS.map(a => chip('paud', a, S.paud === a, esc(t('aud_' + a)))).join('')}</div>
    <div class="lbl">${esc(t('presLen'))}</div>
    <div class="chips p-chips">${MINS.map(n => chip('pmin', n, S.pmin === n, esc(t('presMin', { n })))).join('')}</div>
    <label class="lbl" for="pNotes">${esc(t('presNotes'))}</label>
    <textarea id="pNotes" rows="3" maxlength="3000" placeholder="${esc(t('presNotesPh'))}">${esc(S.pnotes)}</textarea>
    <label class="lbl" for="ivLang">${esc(t('ivIn'))}</label>
    <select id="ivLang">${Object.keys(LANGS).map(k => `<option value="${k}" ${k === lang ? 'selected' : ''}>${LANGS[k][1]} ${esc(langName(k))}</option>`).join('')}</select>
    <div style="height:14px"></div>
    <button class="btn primary big iv-startb p-start" data-pstart>🎤 ${esc(t('presStart'))}</button>
    <p class="meta">${esc(t('presMeta'))}</p>
    ${S.error ? `<p class="err">${S.error}</p>` : ''}
  </div>`;
}
function vPresRec() {
  const c = 2 * Math.PI * 54;
  if (S.busy) return `<div class="card p-rec"><div class="stage-slot"></div><p class="meta">…</p></div>`;
  return `<div class="card p-rec">
    <div class="top"><b>🎤 ${esc(S.pt || t('modePres'))}</b><button class="link" data-pcancel aria-label="${esc(t('presCancel'))}">✕</button></div>
    <div class="p-ringwrap"><svg viewBox="0 0 120 120" class="p-ring"><circle cx="60" cy="60" r="54" class="bg"/><circle id="pRing" cx="60" cy="60" r="54" class="fg" stroke-dasharray="${c}" stroke-dashoffset="${c}"/></svg>
      <div class="p-time"><b id="pTime">0:00</b><small>${esc(t('presTarget', { t: S.pmin + ':00' }))}</small></div></div>
    <p class="p-go"><span class="pulse"></span> ${esc(t('presGo'))}</p>
    <div class="stage-slot"></div>
    <p class="p-live" id="pLive"></p>
    <button class="btn primary big p-stop" data-pstop>■ ${esc(t('presStop'))}</button>
  </div>`;
}
function vPresReview() {
  const p = S.pr, words = p.text.split(/\s+/).filter(Boolean).length;
  return `<div class="card iv-in">
    <div class="top"><b>🎤 ${esc(S.pt || t('modePres'))}</b><span class="meta">⏱ ${mmss(p.secs)} / ${S.pmin}:00</span></div>
    <div class="rv"><div class="rv-h">👂 ${esc(t('ivHeard'))}</div>
      <textarea id="pText" rows="9" maxlength="12000" lang="${esc(code())}">${esc(p.text)}</textarea>
      <p class="rv-tip">${esc(t('presCheck'))}</p>${dlvHtml(p.m)}</div>
    ${words < 40 ? `<p class="err">${esc(t('presShort'))}</p>` : ''}
    ${S.error ? `<p class="err">${S.error}</p>` : ''}
    <div class="rv-btns" style="margin-top:12px"><button class="btn" data-pagain>🎤 ${esc(t('presAgain'))}</button><button class="btn primary" data-pfb ${S.busy || !words ? 'disabled' : ''}>${S.busy ? '…' : '✨ ' + esc(t('presFeedback'))}</button></div>
  </div>`;
}
function vPresReport() {
  const s = S.pres, stars = s.score >= 85 ? 3 : s.score >= 65 ? 2 : s.score >= 40 ? 1 : 0;
  const box = (cls, ic, k, v) => v ? `<div class="box ${cls}"><b>${ic} ${esc(t(k))}</b><p>${rich(v)}</p></div>` : '';
  const line = (k, v) => v ? `<div class="box p-line"><b>${esc(t(k))}</b><button class="w" data-line="${esc(v)}">🔊 ${esc(v)}</button></div>` : '';
  let h = `<div class="card report"><div class="meta">🎤 ${esc(S.pt || t('modePres'))} · ${esc(t('aud_' + S.paud))} · ⏱ ${mmss(S.pr.secs)}</div><h2>${esc(t('presReport'))}</h2>
    <div class="dog big">${face()}</div><div class="score">${s.score}<small>/100</small></div><div class="stars" aria-label="${stars}/3">${'★'.repeat(stars)}${'☆'.repeat(3 - stars)}</div>
    <p class="sum">${rich(s.summary)}</p>`;
  h += box('good', '💪', 'strongest', s.strongest) + box('work', '🎯', 'workOn', s.workOn) + box('p-st', '🧱', 'presStructure', s.structure) + box('p-cl', '💡', 'presClarity', s.clarity);
  h += `<div class="box dlvbox"><b>🗣️ ${esc(t('ivDelivery'))}</b>${dlvHtml(S.pr.m)}${s.delivery ? `<p>${rich(s.delivery)}</p>` : ''}</div>`;
  h += line('presOpening', s.opening) + line('presClosing', s.closing);
  if (s.questions && s.questions.length) h += `<h3>${esc(t('presQs'))}</h3>` + s.questions.map(q => `<div class="phr"><button class="w" data-line="${esc(q)}">🔊 ${esc(q)}</button></div>`).join('');
  if (s.practise && s.practise.length) h += `<h3>${esc(t('phrases'))}</h3>` + s.practise.map(x => `<div class="phr"><button class="w" data-line="${esc(x.p)}">🔊 ${esc(x.p)}</button><small>${esc(x.m)}</small></div>`).join('');
  h += `<div class="btns"><button class="btn" data-pagain>${esc(t('presAgain'))}</button><button class="btn primary" data-quit>${esc(t('newIv'))}</button></div></div>`;
  return h;
}
function vIntro() {
  return `<section class="iv-intro">
    <div class="iv-pair"><span class="ivp a">${window.HSTalk.face('man')}</span><span class="ivp b">${window.HSTalk.face('woman')}</span><span class="iv-bub">💼</span></div>
    <h2>${esc(t('heroH'))}</h2>
    <p>${esc(t('heroP2'))}</p>
    <ol class="iv-steps">${['🎙️', '💡', '📋'].map((ic, i) => `<li style="--i:${i}"><span>${ic}</span>${esc(t('ivS' + (i + 1)))}</li>`).join('')}</ol>
    <button class="iv-go" data-ivgo>${esc(t('ivGo'))} →</button>
    <button class="iv-pres" data-presgo>🎤 ${esc(t('presOr'))}</button>
    <p class="iv-meta">${esc(t('meta', { n: TURNS }))}</p>
  </section>`;
}
function vSetup() {
  if (S.intro) return vIntro();
  const tabs = `<div class="modes iv-in" role="tablist">${[['iv', '💼', 'modeIv'], ['pres', '🎤', 'modePres']].map(([m, ic, k]) => `<button role="tab" aria-selected="${S.mode === m}" data-pmode="${m}" class="${S.mode === m ? 'on' : ''}">${ic} ${esc(t(k))}</button>`).join('')}</div>`;
  if (S.mode === 'pres') return tabs + `<div class="hero iv-in"><div class="dog ivr">${window.HSTalk.face(S.who)}</div><div><h2>${esc(t('presH'))}</h2><p>${esc(t('presP'))}</p></div></div>` + vPresSetup();
  return tabs + `<div class="hero iv-in"><div class="dog ivr">${window.HSTalk.face(S.who)}</div><div><h2>${esc(t('heroH'))}</h2></div></div>
  <div class="card iv-in" style="--d:1">
    <div class="lbl" style="margin-top:0">${esc(t('who'))}</div>
    <div class="who">${['man', 'woman'].map(w => `<button data-who="${w}" class="${S.who === w ? 'on' : ''}" aria-pressed="${S.who === w}"><span class="pic">${window.HSTalk.face(w)}</span>${esc(t('who_' + w))}</button>`).join('')}</div>
    ${S.kind === 'selt' ? '' : `<label class="lbl" for="ivJob">${esc(t('job'))}</label>
    <input id="ivJob" maxlength="60" autocomplete="off" value="${esc(S.job)}" placeholder="${esc(t('jobPh'))}">`}
    <div class="lbl">${esc(t('kind'))}</div>
    ${chips('kind', KINDS.map(k => [k, t('t_' + k), t('d_' + k)]), S.kind, t('kind'))}
    <div class="lbl">${esc(t('level'))}</div>
    ${chips('level', LEVELS.map(l => [l, t(l)]), S.level, t('level'))}
    <label class="lbl" for="ivLang">${esc(t('ivIn'))}</label>
    <select id="ivLang">${Object.keys(LANGS).map(k => `<option value="${k}" ${k === lang ? 'selected' : ''}>${LANGS[k][1]} ${esc(langName(k))}</option>`).join('')}</select>
    <button type="button" class="iv-moretog${S.more ? ' open' : ''}" data-ivmore aria-expanded="${!!S.more}">⚙️ ${esc(t('ivMore'))}<i aria-hidden="true">▾</i></button>
    <div class="iv-more"${S.more ? '' : ' hidden'}>
    <div class="opts">
      ${Rec ? `<label><input type="checkbox" data-opt="auto" ${S.auto ? 'checked' : ''}> ${esc(t('auto', { name: t('ivr_' + S.who) }))}</label>` : ''}
      <label><input type="checkbox" data-opt="live" ${S.live ? 'checked' : ''}> ${esc(t('tipsLive'))}</label>
    </div>
    ${Rec ? `<div class="lbl">${esc(t('pauseL'))}</div>${chips('pz', Object.keys(PAUSES).map(k => [k, t('pz_' + k)]), S.pause, t('pauseL'))}` : ''}
    </div>
    <div style="height:14px"></div>
    <button class="btn primary big iv-startb" data-start>▶ ${esc(t('start'))}</button>
    <p class="meta">${esc(t('meta', { n: TURNS }))}</p>
    ${Rec ? '' : `<p class="meta">${esc(t('noMic'))}</p>`}
    ${S.error ? `<p class="err">${S.error}</p>` : ''}
  </div>`;
}
// Delivery chips for one answer: pace, long pauses, fillers, fluency (only what was measured).
function dlvHtml(m) {
  if (!m) return '';
  const c = [];
  if (m.wpm) c.push(`<span class="${m.wpm < 90 || m.wpm > 175 ? 'warn' : ''}">🗣️ ${esc(t('ivWpm', { n: m.wpm }))}</span>`);
  if (m.pauses != null) c.push(`<span class="${m.pauses > 2 ? 'warn' : ''}">⏸️ ${esc(t('ivPauses', { n: m.pauses }))}</span>`);
  if (m.fillers) c.push(`<span class="${m.fillers > 3 ? 'warn' : ''}">💬 ${esc(t('ivFillers', { n: m.fillers }))}</span>`);
  if (m.fluency != null) c.push(`<span class="${m.fluency < 60 ? 'warn' : ''}">🌊 ${esc(t('ivFluency', { n: m.fluency }))}</span>`);
  return c.length ? `<div class="dlv">${c.join('')}</div>` : '';
}
const voteHtml = (i, v) => `<div class="vote">${v ? `<span>${esc(t('ivThanks'))}</span>` : `<span>${esc(t('ivUseful'))}</span><button class="link" data-vote="up" data-vi="${i}" aria-label="👍">👍</button><button class="link" data-vote="down" data-vi="${i}" aria-label="👎">👎</button>`}</div>`;
const fbHtml = f => `<b>${esc(t(f.rating))}</b> ${rich(f.note)}${f.better ? `<div class="better"><span>${esc(t('stronger'))}</span> <button class="w" data-line="${esc(f.better)}">🔊 ${esc(f.better)}</button></div>` : ''}`;
function vInterview() {
  const answers = S.history.filter(h => h.r === 'l').length;
  let h = `<div class="card"><div class="top"><b>💼 ${esc(S.job || t('anyJob'))}</b><span class="meta">${esc(t('qn', { n: Math.min(answers + (S.ended ? 0 : 1), TURNS), m: TURNS }))}</span><button class="link" data-quit aria-label="${esc(t('newIv'))}">✕</button></div><div class="stage-slot"></div>
    <div class="trrow"><label><input type="checkbox" data-opt="tr" ${S.showTr ? 'checked' : ''}> ${esc(t('showTr'))}</label></div><div class="log" id="ivLog">`;
  S.items.forEach((it, i) => {
    if (it.r === 'c') {
      h += `<div class="row c"><div class="av">${window.HSTalk.face(S.who)}</div><div class="bub c"><div class="line">${esc(it.line)}</div>${it.showTr && it.translation ? `<div class="tr">${esc(it.translation)}</div>` : ''}<div class="tools"><button class="link" data-say="${i}">🔊</button>${it.translation ? `<button class="link" data-tr="${i}">${esc(t(it.showTr ? 'hideTr' : 'showTr'))}</button>` : ''}</div></div></div>`;
    } else {
      h += `<div class="row l"><div class="bub l">${esc(it.text)}${dlvHtml(it.m)}</div></div>`;
      if (it.fb && S.live) h += `<div class="fb ${it.fb.rating}">${fbHtml(it.fb)}${voteHtml(i, it.vote)}</div>`;
    }
  });
  h += `</div>`;
  if (S.error) h += `<p class="err">${S.error}</p>`;
  if (S.ended && !S.busy && !S.talking) h += `<button class="btn primary big" data-end>${esc(t('seeReport'))}</button>`;
  else if (S.items.length && !S.busy && !S.ended) {
    if (S.hint) h += `<div class="hint"><span>${esc(t('startWith'))}</span> <button class="w" data-line="${esc(S.hint)}">🔊 ${esc(S.hint)}</button></div>`;
    if (S.review) {
      h += `<div class="rv"><div class="rv-h">👂 ${esc(t('ivHeard'))}</div><textarea id="rvText" rows="3" maxlength="${MAX_CHARS}" lang="${esc(code())}">${esc(S.review.text)}</textarea>
        <p class="rv-tip">${esc(t('ivHeardTip'))}</p>${S.review.auto ? '<div class="rv-bar"><i></i></div>' : ''}
        <div class="rv-btns"><button class="btn" data-rvagain>🎙️ ${esc(t('ivAgain'))}</button><button class="btn primary" data-rvsend>${esc(t('send'))} ➤</button></div></div><div class="ctl">`;
    } else if (S.typing) {
      h += `<form class="type" data-form><textarea id="ivInput" rows="3" maxlength="${MAX_CHARS}" placeholder="${esc(t('placeholder'))}" lang="${esc(code())}"></textarea><button class="btn primary" type="submit">${esc(t('send'))}</button></form><div class="ctl">${Rec ? `<button class="link" data-mode>${esc(t('speakIn'))}</button>` : ''}`;
    } else if (S.auto) {
      const st = S.listening ? ['on', t('yourTurn')] : S.talking ? ['', t('speaking', { name: t('Ivr_' + S.who) })] : ['tap', t('tapTalk')];
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
  if (s.delivery) h += `<div class="box dlvbox"><b>🗣️ ${esc(t('ivDelivery'))}</b><p>${rich(s.delivery)}</p></div>`;
  if (pairs.length) h += `<h3>${esc(t('answers'))}</h3>` + pairs.map((p, i) => `<div class="pair"><div class="q">${i + 1}. ${esc(p.q)}</div><div class="a">“${esc(p.a.text)}”${dlvHtml(p.a.m)}</div>${p.a.fb ? `<div class="fb ${p.a.fb.rating}">${fbHtml(p.a.fb)}${voteHtml(S.items.indexOf(p.a), p.a.vote)}</div>` : ''}</div>`).join('');
  if (s.practise && s.practise.length) h += `<h3>${esc(t('phrases'))}</h3>` + s.practise.map(x => `<div class="phr"><button class="w" data-line="${esc(x.p)}">🔊 ${esc(x.p)}</button><small>${esc(x.m)}</small></div>`).join('');
  h += `<div class="btns"><button class="btn" data-again>${esc(t('again'))}</button><button class="btn primary" data-quit>${esc(t('newIv'))}</button></div></div>`;
  return h;
}
function draw() {
  const app = $('app'); if (!app) return;
  if (S.access !== true) app.innerHTML = vGate();
  else if (seltBlocked() && S.view === 'setup') app.innerHTML = vSeltLimit();
  else app.innerHTML = S.view === 'prec' ? vPresRec() : S.view === 'prev' && S.pr ? vPresReview() : S.view === 'prep' && S.pres ? vPresReport() : S.view === 'iv' ? vInterview() : S.view === 'report' && S.sum ? vReport() : vSetup();
  const slot = app.querySelector('.stage-slot'); if (slot) slot.replaceWith(stage.el);
  if (S.view === 'prec') { if (S.busy) stage.thinking(); else stage.listening(''); prTick(); }
  if (S.view === 'iv') { if (S.listening) stage.listening(S.interim); else if (S.busy) stage.thinking(); else if (!S.talking) stage.mode(S.ended ? 'happy' : 'idle'); }
  const log = $('ivLog'); if (log) log.scrollTop = log.scrollHeight;
  const inp = $('ivInput'); if (inp && S.focusInput) { S.focusInput = false; inp.focus(); }
}
function applyStatic() {
  document.documentElement.lang = ui; document.documentElement.dir = window.IV_RTL[ui] ? 'rtl' : 'ltr';
  document.title = t('title');
  document.querySelectorAll('[data-t],[data-i18n]').forEach(el => { el.textContent = t(el.dataset.t || el.dataset.i18n); });
  const sel = $('ivUi'); if (sel) { sel.innerHTML = window.IV_UI_LANGS.map(([k, n]) => `<option value="${k}" ${k === ui ? 'selected' : ''}>${n}</option>`).join(''); }
  if (window.hsAccountRelabel) window.hsAccountRelabel();
}

// ---------- events ----------
document.addEventListener('focusin', e => { if (e.target.id === 'rvText') holdReview(); });
document.addEventListener('input', e => { if (e.target.id === 'rvText') holdReview();
  if (e.target.id === 'pTitle') { S.pt = e.target.value.slice(0, 100); store.set('hs_p_title', S.pt); }
  if (e.target.id === 'pNotes') { S.pnotes = e.target.value.slice(0, 3000); store.set('hs_p_notes', S.pnotes); } if (e.target.id === 'ivJob') { S.job = e.target.value.slice(0, 60); store.set('hs_iv_job', S.job); } });
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
  if (b.hasAttribute('data-presgo')) { S.intro = false; S.mode = 'pres'; store.set('hs_iv_mode', 'pres'); S.error = ''; draw(); window.scrollTo(0, 0); return; }
  if (d.pmode) { S.mode = d.pmode; store.set('hs_iv_mode', S.mode); S.error = ''; draw(); return; }
  if (d.paud) { S.paud = d.paud; store.set('hs_p_aud', S.paud); draw(); return; }
  if (d.pmin) { S.pmin = +d.pmin; store.set('hs_p_min', S.pmin); draw(); return; }
  if (b.hasAttribute('data-pstart')) { startPres(); return; }
  if (b.hasAttribute('data-pstop')) { stopPres(); return; }
  if (b.hasAttribute('data-pcancel')) { cancelPres(); return; }
  if (b.hasAttribute('data-pfb')) { unlock(); sendPres(); return; }
  if (b.hasAttribute('data-pagain')) { S.error = ''; startPres(); return; }
  if (b.hasAttribute('data-ivgo')) { S.intro = false; draw(); window.scrollTo(0, 0); return; }
  if (b.hasAttribute('data-ivmore')) { S.more = !S.more; draw(); return; }
  if (d.who) { S.who = d.who; store.set('hs_iv_who', S.who); draw(); return; }
  if (d.kind) { S.kind = d.kind; store.set('hs_iv_kind', S.kind); draw(); return; }
  if (d.level) { S.level = d.level; store.set('hs_iv_level', S.level); draw(); return; }
  if (d.pz) { S.pause = d.pz; store.set('hs_pause', S.pause); draw(); return; }
  if (b.hasAttribute('data-signin')) { if (window.hsAccount) window.hsAccount.open(); return; }
  if (b.hasAttribute('data-start')) { unlock(); start(); return; }
  if (d.line !== undefined) { unlock(); S.paused = true; say(d.line); return; }
  if (d.say !== undefined) { unlock(); say(S.items[+d.say].line, afterLine); return; }
  if (d.tr !== undefined) { const it = S.items[+d.tr]; it.showTr = !it.showTr; draw(); return; }
  if (b.hasAttribute('data-rvsend')) { unlock(); sendReview(); return; }
  if (b.hasAttribute('data-rvagain')) { unlock(); clearTimeout(reviewT); S.review = null; listen('', true); return; }
  if (d.vote) { const it = S.items[+d.vi]; if (it && !it.vote) { it.vote = d.vote; track(d.vote === 'up' ? 'iv_tip_up' : 'iv_tip_down'); draw(); } return; }
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
document.addEventListener('visibilitychange', () => { if (document.hidden && S.view === 'iv') { holdReview(); hush(); stopListening(); S.paused = true; draw(); } });

// ---------- access (private beta, same list as Harlo Chats) ----------
let checking = 0;
async function checkAccess() {
  const n = ++checking; let on = false;
  try {
    const r = await fetch('/.netlify/functions/chat', { method: 'POST', headers: await headers(), body: JSON.stringify(S.kind === 'selt' ? { action: 'access', scene: 'interview', itype: 'selt' } : { action: 'access' }) });
    const j = r.ok ? await r.json() : {};
    on = !!j.ok; S.selt = j.selt || null;
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
