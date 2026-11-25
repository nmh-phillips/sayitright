// Harley Says: "Harley Chats" — spoken role-play conversations with Harley (or Lilou).
// Hands-free by default: Harley speaks, the mic opens by itself, a short pause sends the reply, and the tips are saved for the end.
// Uses globals from index.html (lang, ui, t, LN, DATA, Rec, store, set, custom, idx, render, coachId, coachFace, DEVICE_ID, track, speak, $, CUSTOM, CHATS, els)
// and pron.js (harleySay for single words). Backend: netlify/functions/chat.mjs (+ tts.mjs kind 'line'). Strings ch_* live in i18n.js.
(function(){
const SCENES = [['cafe','☕'],['restaurant','🍝'],['directions','🗺️'],['shop','👕'],['hotel','🏨'],['pharmacy','💊'],['neighbour','🏠'],['party','🎉']];
const LEVELS = ['easy','normal','hard'];
const MAX_TURNS = 8;          // matches CHAT_TURNS on the server (the server has the final say)
const PAUSE_BASE = 1400;      // hands-free: this much quiet after speaking sends the reply (× the person's pause setting)
const WAIT_MS = 9000;         // hands-free: stop listening if nothing is said for this long
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
const pauseMs = () => PAUSE_BASE * (PAUSES[S.pause] || 1);
const today = () => new Date().toISOString().slice(0,10);
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const coachName = () => coachId() === 'lilou' ? 'Lilou' : 'Harley';
const card = () => document.getElementById('chatCard');

const S = { view:'pick', scene:null, level: store.get('hs_chat_level','normal'), history:[], items:[], hint:'', busy:false, error:'', ended:false, sum:null,
  typing: !Rec, interim:'', listening:false, talking:false, paused:false,
  auto: !!Rec && store.get('hs_chat_auto', true), live: store.get('hs_chat_live', false), pause: store.get('hs_pause', 'normal'),
  showTr: store.get('hs_chat_tr', false),
  autoBlocked: false }; // autoBlocked: this phone won't let the mic open by itself (iPhone), so we ask for a tap instead
if (!LEVELS.includes(S.level)) S.level = 'normal';
function leftToday(){ const v = store.get('hs_chat_left', null); return v && v.day === today() ? v.n : null; }
const inChat = () => S.view === 'chat' && set === CHATS;

// «word» → tappable word read in the learnt language
function rich(text){
  return esc(text).replace(/«([^»]+)»/g, (m, w) => `<button class="ch-w" data-chw="${w}">${w}</button>`);
}

// ---------- Harley's voice and face (talkhead.js: big animated head, mouth moves with the words) ----------
const stage = HSTalk({ persona: () => coachId(), code: () => DATA[lang].code });
function unlock(){ stage.unlock(); if (window.haUnlock) haUnlock(); } // inside a tap (iPhone)
// Say a line; done() runs when he has finished (not if he was interrupted). b64: his voice, sent with the line.
function say(text, done, b64){
  stopListening(); S.talking = true; draw();
  const it = S.items.filter(x => x.r === 'c' && x.line === text).pop();
  stage.say(text, { b64, translation: S.showTr && it ? it.translation : '' }).then(ok => {
    S.talking = stage.talking; draw();
    if (ok && done) done();
  });
}
function hush(){ stage.hush(); S.talking = false; }
// After Harley's line: hands-free opens the mic; at the end of the scene, go straight to the summary.
function afterLine(){
  if (!inChat()) return;
  if (S.ended) return finish();
  if (S.auto && !S.typing && !S.paused && !S.autoBlocked) setTimeout(() => { if (inChat() && !S.busy && !S.talking && !S.listening && !S.ended) listen(false); }, 250);
}

// ---------- views ----------
function renderPick(c){
  const left = leftToday();
  let h = `<div class="a-head"><h2>💬 ${esc(t('ch_title'))}</h2></div>
    <div class="ch-intro"><div class="ch-face" aria-hidden="true">${coachFace('happy')}</div><p>${esc(t('ch_intro',{lang:LN(lang), name:coachName()}))}</p></div>
    <div class="ch-lvl" role="group" aria-label="${esc(t('ch_level'))}"><span>${esc(t('ch_level'))}</span>${LEVELS.map(l => `<button data-chlvl="${l}" class="${S.level===l?'on':''}" aria-pressed="${S.level===l}">${esc(t('ch_'+l))}</button>`).join('')}</div>
    <div class="ch-opts">
      ${Rec ? `<label><input type="checkbox" data-chopt="auto" ${S.auto?'checked':''}> ${esc(t('ch_auto',{name:coachName()}))}</label>` : ''}
      <label><input type="checkbox" data-chopt="live" ${S.live?'checked':''}> ${esc(t('ch_tipsLive'))}</label>
    </div>
    ${Rec ? `<div class="ch-lvl" role="group" aria-label="${esc(t('ch_pauseL'))}"><span>${esc(t('ch_pauseL'))}</span>${Object.keys(PAUSES).map(k => `<button data-chpz="${k}" class="${S.pause===k?'on':''}" aria-pressed="${S.pause===k}">${esc(t('ch_pz_'+k))}</button>`).join('')}</div>` : ''}
    <h3 class="ch-h3">${esc(t('ch_pick'))}</h3>
    <div class="ch-scenes">${SCENES.map(([id,ic]) => `<button class="ch-scene" data-chscene="${id}"><span class="ic" aria-hidden="true">${ic}</span><b>${esc(t('ch_s_'+id))}</b><small>${esc(t('ch_d_'+id))}</small></button>`).join('')}</div>`;
  h += `<a class="ch-iv" href="/interview/">💼 <b>${esc(t('ch_ivLink'))}</b><span>${esc(t('ch_ivSub'))}</span></a>`;
  if (left !== null) h += `<p class="a-meta">${esc(t('ch_left',{n:left}))}</p>`;
  if (!Rec) h += `<p class="a-meta">${esc(t('ch_noMic'))}</p>`;
  if (S.error) h += `<p class="ch-err">${S.error}</p>`;
  c.innerHTML = h;
}
function fbHtml(f){
  return `<span class="ch-badge">${esc(t('ch_'+f.rating))}</span> ${rich(f.note)}
    ${f.better ? `<div class="ch-better"><span>${esc(t('ch_better'))}</span> <button class="ch-w" data-chline="${esc(f.better)}">🔊 ${esc(f.better)}</button></div>` : ''}`;
}
function renderChat(c){
  const [, ic] = SCENES.find(s => s[0] === S.scene) || ['', '💬'];
  const learnerTurns = S.history.filter(h => h.r === 'l').length;
  let h = `<div class="ch-top"><b>${ic} ${esc(t('ch_s_'+S.scene))}</b><span class="a-meta">${esc(t('ch_turns',{n:Math.min(learnerTurns+(S.ended?0:1),MAX_TURNS),m:MAX_TURNS}))}</span><button class="linkbtn" data-chquit aria-label="${esc(t('ch_other'))}">✕</button></div><div class="ch-stage-slot"></div>
    <div class="ch-trrow"><label><input type="checkbox" data-chopt="tr" ${S.showTr?'checked':''}> ${esc(t('ch_showTr'))}</label></div><div class="ch-log" id="chLog">`;
  S.items.forEach((it, i) => {
    if (it.r === 'c') {
      h += `<div class="ch-row c"><div class="ch-face sm${S.talking && i === S.items.length-1 ? ' talk' : ''}" aria-hidden="true">${coachFace('happy')}</div><div class="ch-bub c"><div class="ch-line">${esc(it.line)}</div>
        ${it.showTr && it.translation ? `<div class="ch-tr">${esc(it.translation)}</div>` : ''}
        <div class="ch-tools"><button class="linkbtn" data-chsay="${i}">🔊</button>${it.translation ? `<button class="linkbtn" data-chtr="${i}">${esc(t(it.showTr?'ch_hideTr':'ch_showTr'))}</button>` : ''}</div></div></div>`;
    } else {
      h += `<div class="ch-row l"><div class="ch-bub l">${esc(it.text)}</div></div>`;
      if (it.fb && S.live) h += `<div class="ch-fb ${it.fb.rating}">${fbHtml(it.fb)}</div>`;
    }
  });
  h += `</div>`;
  if (S.error) h += `<p class="ch-err">${S.error}</p>`;
  if (S.ended && !S.busy && !S.talking) {
    h += `<div class="row"><button class="btn primary" data-chend>${esc(t('ch_seeSum'))}</button></div>`;
  } else if (S.items.length && !S.busy && !S.ended) {
    if (S.hint) h += `<div class="ch-hint"><span>${esc(t('ch_try'))}</span> <button class="ch-w" data-chline="${esc(S.hint)}">🔊 ${esc(S.hint)}</button></div>`;
    if (S.typing) {
      h += `<form class="ch-type" data-chform><input id="chInput" autocomplete="off" maxlength="300" placeholder="${esc(t('ch_placeholder',{lang:LN(lang)}))}" lang="${esc(DATA[lang].code)}"><button class="btn primary" type="submit">${esc(t('ch_send'))}</button></form>`;
      h += `<div class="ch-ctl">${Rec ? `<button class="linkbtn" data-chmode>${esc(t('ch_speak'))}</button>` : ''}`;
    } else if (S.auto) {
      const st = S.listening ? ['on', t('ch_yourTurn')] : S.talking ? ['', t('ch_speaking',{name:coachName()})] : ['tap', t('ch_tapTalk')];
      h += `<button class="ch-status ${st[0]}" data-chmic>${S.listening ? '<span class="ch-pulse"></span>' : S.talking ? '🔊' : '🎙️'} ${esc(st[1])}</button>`;
      h += `<div class="ch-ctl">${S.listening || S.talking ? `<button class="linkbtn" data-chpause>${esc(t('ch_pause'))}</button>` : ''}<button class="linkbtn" data-chmode>${esc(t('ch_type'))}</button>`;
    } else {
      h += `<button class="btn mic${S.listening?' rec':''}" data-chmic>${esc(S.listening ? t('ch_listening') : t('ch_tap'))}</button>`;
      h += `<div class="ch-ctl"><button class="linkbtn" data-chmode>${esc(t('ch_type'))}</button>`;
    }
    if (learnerTurns) h += `<button class="linkbtn" data-chend>${esc(t('ch_finish'))}</button>`;
    h += `</div>`;
  }
  c.innerHTML = h;
  const slot = c.querySelector('.ch-stage-slot'); if (slot) slot.replaceWith(stage.el);
  if (S.listening) stage.listening(S.interim);
  else if (S.busy) stage.thinking();
  else if (!S.talking) stage.mode(S.ended ? 'happy' : 'idle');
  const log = document.getElementById('chLog'); if (log) log.scrollTop = log.scrollHeight;
  const inp = document.getElementById('chInput'); if (inp && S.focusInput){ S.focusInput = false; inp.focus(); }
}
function renderSum(c){
  const s = S.sum, band = s.score >= 85 ? 'top' : s.score >= 65 ? 'good' : s.score >= 40 ? 'mid' : 'low';
  const look = {top:['celebrate','jump'], good:['happy','wag'], mid:['puzzled','tilt'], low:['happy','bob']}[band];
  const stars = band==='top'?3:band==='good'?2:band==='mid'?1:0;
  let h = `<div class="sum-set">💬 ${esc(t('ch_s_'+S.scene))} · ${esc(t('ch_sumTitle'))}</div>
    <div class="sum-dog anim-${look[1]}" aria-hidden="true">${coachFace(look[0])}</div>
    <div class="a-num">${s.score}<small>/100</small></div><div class="sum-stars" aria-label="${stars}/3">${'★'.repeat(stars)}${'☆'.repeat(3-stars)}</div>
    <p class="sum-msg">${rich(s.summary)}</p>`;
  if (s.practise.length) h += `<h3>${esc(t('ch_practise'))}</h3><div class="ch-prac">${s.practise.map((x,i) => `<div class="ch-p"><button class="ch-w" data-chline="${esc(x.p)}">🔊 ${esc(x.p)}</button><small>${esc(x.m)}</small><button class="btn" data-chprac="${i}">${esc(t('ch_practiseBtn'))}</button></div>`).join('')}</div>`;
  const turns = S.items.filter(it => it.r === 'l' && it.fb);
  if (turns.length) h += `<h3>${esc(t('ch_review'))}</h3><div class="ch-rev">${turns.map(it => `<div class="ch-revi"><div class="ch-said">“${esc(it.text)}”</div><div class="ch-fb ${it.fb.rating}">${fbHtml(it.fb)}</div></div>`).join('')}</div>`;
  h += `<div class="row"><button class="btn" data-chagain>${esc(t('ch_again'))}</button><button class="btn primary" data-chquit>${esc(t('ch_other'))}</button></div>`;
  c.innerHTML = h;
}
function draw(){
  const c = card(); if (!c) return;
  if (S.view === 'chat') renderChat(c); else if (S.view === 'sum' && S.sum) renderSum(c); else renderPick(c);
}
window.renderChat = () => { if (set !== CHATS) { hush(); stopListening(); } draw(); };
function reset(view){ hush(); stopListening(); Object.assign(S, { view: view || 'pick', history:[], items:[], hint:'', busy:false, error:'', ended:false, sum:null, paused:false }); }
window.chatLangChanged = () => reset();

// ---------- talking to the server ----------
function errMsg(status, j){
  if (status === 429 || j.error === 'limit'){ store.set('hs_chat_left', {day:today(), n:0}); track('limit'); return esc(t('ch_limit')) + ` <button class="linkbtn" data-prem>${esc(t('getNotified'))}</button>`; }
  if (/not configured/i.test(j.error || '')) return esc(t('ch_off'));
  return esc(t('ch_err')) + ` <button class="linkbtn" data-chretry>${esc(t('ch_retry'))}</button>`;
}
async function headers(){
  const h = {'Content-Type':'application/json'};
  const tok = window.hsAuthToken ? await window.hsAuthToken() : null;
  if (tok) h.Authorization = 'Bearer ' + tok;
  return h;
}
async function call(action){
  const r = await fetch('/.netlify/functions/chat', { method:'POST', headers: await headers(),
    body: JSON.stringify({ action, device: DEVICE_ID, lang, ui, scene: S.scene, level: S.level, persona: coachId(), history: S.history, tips: S.live ? 'live' : 'end', voice: action !== 'end' }) });
  const j = await r.json().catch(() => ({}));
  if (!r.ok || j.error) { const e = new Error(j.error || 'HTTP ' + r.status); e.status = r.status; e.j = j; throw e; }
  return j;
}
let pending = null; // what to retry
async function start(scene){
  reset('chat'); S.scene = scene; S.busy = true;
  pending = () => start(scene);
  draw(); card().scrollIntoView({behavior:'smooth', block:'start'});
  try {
    const j = await call('start');
    S.history.push({ r:'c', t:j.line }); S.items.push({ r:'c', line:j.line, translation:j.translation });
    S.hint = j.hint || '';
    if (typeof j.remaining === 'number') store.set('hs_chat_left', j.remaining < 50 ? {day:today(), n:j.remaining} : null);
    track('chat_start'); stage.prefetchAcks();
    S.busy = false; say(j.line, afterLine, j.audio);
  } catch(e){
    S.error = errMsg(e.status, e.j || {});
    if (!S.items.length) S.view = 'pick';
    S.busy = false;
  }
  draw();
}
async function reply(text){
  text = String(text || '').replace(/\s+/g, ' ').trim().slice(0, 300);
  if (!text || S.busy || S.ended) return;
  S.history.push({ r:'l', t:text }); const item = { r:'l', text }; S.items.push(item);
  S.busy = true; S.error = ''; S.hint = ''; S.interim = '';
  pending = () => { S.history.pop(); S.items.pop(); reply(text); };
  draw();
  const ack = stage.ack(); // a quick "mm-hm" while Harley thinks
  try {
    const j = await call('reply');
    if (j.feedback) item.fb = j.feedback;
    S.history.push({ r:'c', t:j.line }); S.items.push({ r:'c', line:j.line, translation:j.translation });
    S.hint = j.hint || ''; S.ended = !!j.end;
    track('chat_turn');
    await Promise.race([ack, new Promise(r => setTimeout(r, 1500))]);
    S.busy = false; if (inChat()) say(j.line, afterLine, j.audio);
  } catch(e){ S.error = errMsg(e.status, e.j || {}); S.busy = false; }
  draw();
}
async function finish(){
  if (S.busy || S.view !== 'chat') return;
  hush(); stopListening();
  S.busy = true; S.error = ''; pending = finish; draw();
  try {
    const j = await call('end');
    // tips for each reply come with the report (unless they were shown during the chat)
    let k = 0; S.items.forEach(it => { if (it.r === 'l') { if (!it.fb && j.turns && j.turns[k]) it.fb = j.turns[k]; k++; } });
    S.sum = j; S.view = 'sum'; track('chat_done');
    // keep the phrases for later practice (Daily 5)
    const rev = store.get('hs_chat_review', []).filter(x => !j.practise.some(p => p.p === x.p));
    store.set('hs_chat_review', j.practise.map(p => ({ ...p, lang, day: today() })).concat(rev).slice(0, 30));
    if (window.harleySay) harleySay('clip', j.score >= 85 ? 'yay' : j.score >= 65 ? 'woof' : 'aww');
  } catch(e){ S.error = errMsg(e.status, e.j || {}); }
  S.busy = false; draw();
  if (S.view === 'sum') card().scrollIntoView({behavior:'smooth', block:'start'});
}

// ---------- listening ----------
// Hands-free: keep listening while the learner talks and send after PAUSE_MS of quiet; give up after WAIT_MS of nothing.
let rec = null, quietT = null, waitT = null;
function clearTimers(){ clearTimeout(quietT); clearTimeout(waitT); quietT = waitT = null; }
function stopListening(){ clearTimers(); if (rec) { const r = rec; rec = null; try { r.onend = null; r.abort(); } catch(e){} } S.listening = false; S.interim = ''; }
function listen(tap){
  if (S.listening) { if (rec) rec.stop(); return; }
  if (!Rec) { S.typing = true; draw(); return; }
  hush();
  const r = rec = new Rec(); r.lang = DATA[lang].code; r.interimResults = true; r.continuous = !!S.auto; r.maxAlternatives = 1;
  let heard = '', failed = '';
  r.onstart = () => {
    if (rec !== r) return;
    S.listening = true; S.interim = ''; S.error = ''; S.paused = false; draw();
    if (S.auto) waitT = setTimeout(() => { if (rec === r && !heard) { failed = 'quiet'; r.stop(); } }, WAIT_MS);
  };
  r.onresult = e => {
    if (rec !== r) return;
    heard = joinResults(e.results); S.interim = heard;
    stage.listening(heard);
    if (S.auto) { clearTimeout(waitT); clearTimeout(quietT); quietT = setTimeout(() => { if (rec === r) r.stop(); }, pauseMs()); }
  };
  r.onerror = e => { failed = e.error || 'error'; };
  r.onend = () => {
    if (rec !== r) return;
    clearTimers(); rec = null; S.listening = false; S.interim = '';
    const said = heard.trim();
    if (said) return reply(said);
    if ((failed === 'not-allowed' || failed === 'service-not-allowed') && !tap) { S.autoBlocked = true; S.paused = true; } // the phone wants a tap: ask for one, no error
    else if (failed === 'not-allowed' || failed === 'service-not-allowed') { S.error = esc(t('micBlocked')); S.paused = true; }
    else if (S.auto) S.paused = true;           // nothing said: wait for a tap rather than listening for ever
    else S.error = esc(t('ch_noCatch'));
    draw();
  };
  try { r.start(); } catch(err){ rec = null; S.listening = false; S.paused = true; if (!tap) S.autoBlocked = true; draw(); }
}

// ---------- clicks ----------
document.addEventListener('change', e => {
  const o = e.target.closest('#chatCard [data-chopt]'); if (!o) return;
  if (o.dataset.chopt === 'tr') { S.showTr = o.checked; store.set('hs_chat_tr', S.showTr); return; }
  if (o.dataset.chopt === 'auto') { S.auto = o.checked; store.set('hs_chat_auto', S.auto); }
  else { S.live = o.checked; store.set('hs_chat_live', S.live); }
});
document.addEventListener('click', e => {
  const b = e.target.closest('#chatCard button'); if (!b) return;
  const d = b.dataset;
  if (d.chlvl){ S.level = d.chlvl; store.set('hs_chat_level', S.level); draw(); return; }
  if (d.chpz){ S.pause = d.chpz; store.set('hs_pause', S.pause); draw(); return; }
  if (d.chscene){ unlock(); start(d.chscene); return; }
  if (d.chw !== undefined){ if (window.harleySay) harleySay('word', d.chw, () => speak(d.chw, 0.8), coachId()); else speak(d.chw, 0.8); return; }
  if (d.chline !== undefined){ unlock(); S.paused = true; say(d.chline); return; }
  if (d.chsay !== undefined){ unlock(); say(S.items[+d.chsay].line, afterLine); return; }
  if (d.chtr !== undefined){ const it = S.items[+d.chtr]; it.showTr = !it.showTr; draw(); return; }
  if (b.hasAttribute('data-chmic')){ unlock(); if (S.talking) { hush(); } S.paused = false; listen(true); return; }
  if (b.hasAttribute('data-chpause')){ hush(); stopListening(); S.paused = true; draw(); return; }
  if (b.hasAttribute('data-chmode')){ hush(); stopListening(); S.typing = !S.typing; S.focusInput = S.typing; if (!S.typing) S.paused = false; draw(); if (!S.typing && S.auto) listen(true); return; }
  if (b.hasAttribute('data-chend')){ unlock(); finish(); return; }
  if (b.hasAttribute('data-chretry')){ S.error = ''; if (pending) pending(); return; }
  if (b.hasAttribute('data-chagain')){ unlock(); start(S.scene); return; }
  if (b.hasAttribute('data-chquit')){ reset(); draw(); return; }
  if (d.chprac !== undefined){
    const p = S.sum.practise[+d.chprac];
    set = CUSTOM; custom = [p.p, p.m]; idx = 0; render();
    els.practice.scrollIntoView({behavior:'smooth'}); speak(p.p, 0.95);
  }
});
document.addEventListener('submit', e => {
  if (!e.target.closest('#chatCard [data-chform]')) return;
  e.preventDefault(); unlock();
  const inp = document.getElementById('chInput'); const v = inp ? inp.value : ''; S.focusInput = true; reply(v);
});
// Leaving the page or switching tab: stop the mic and Harley.
document.addEventListener('visibilitychange', () => { if (document.hidden && S.view === 'chat') { hush(); stopListening(); S.paused = true; draw(); } });

// ---------- styles ----------
const css = `
#chatCard .ch-intro{display:flex;gap:12px;align-items:center;margin:4px 0 12px}
#chatCard .ch-intro p{margin:0;color:var(--muted);line-height:1.45}
#chatCard .ch-face{width:56px;height:56px;flex:0 0 auto} #chatCard .ch-face.sm{width:34px;height:34px}
#chatCard .ch-face svg{width:100%;height:100%;display:block}
#chatCard .ch-face.talk{animation:chBob .5s ease-in-out infinite alternate}
@keyframes chBob{from{transform:translateY(0)}to{transform:translateY(-4px) rotate(-3deg)}}
#chatCard .ch-lvl{display:flex;flex-wrap:wrap;gap:6px;align-items:center;margin-bottom:10px}
#chatCard .ch-lvl span{font-weight:600;font-size:14px;margin-right:4px}
#chatCard .ch-lvl button{border:1px solid var(--line);background:#fff;border-radius:999px;padding:6px 12px;font:600 13px Inter,sans-serif;cursor:pointer}
#chatCard .ch-lvl button.on{background:#3346C8;border-color:#3346C8;color:#fff}
#chatCard .ch-opts{display:flex;flex-direction:column;gap:6px;margin-bottom:12px;font-size:14px}
#chatCard .ch-opts label{display:flex;gap:8px;align-items:center;cursor:pointer} #chatCard .ch-opts input{width:18px;height:18px;accent-color:#3346C8}
#chatCard .ch-h3{margin:6px 0 8px;font-size:16px}
#chatCard .ch-scenes{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:8px}
#chatCard .ch-scene{display:flex;flex-direction:column;align-items:flex-start;gap:3px;text-align:left;padding:12px;border-radius:14px;border:1px solid #c7d0fb;background:#f3f5ff;cursor:pointer;font:inherit;color:inherit}
#chatCard .ch-scene:hover{border-color:#3346C8}
#chatCard .ch-scene .ic{font-size:24px} #chatCard .ch-scene small{color:var(--muted);line-height:1.35}
#chatCard .ch-top{display:flex;align-items:center;gap:10px;margin-bottom:8px} #chatCard .ch-top b{flex:1}
#chatCard .ch-trrow{display:flex;justify-content:flex-end;font-size:13px;margin:-4px 0 6px} #chatCard .ch-trrow label{display:flex;gap:6px;align-items:center;cursor:pointer;color:var(--muted)}
#chatCard .ch-log{max-height:30vh;overflow-y:auto;display:flex;flex-direction:column;gap:8px;padding:4px 2px 8px}
#chatCard .ch-row{display:flex;gap:8px;align-items:flex-end} #chatCard .ch-row.l{justify-content:flex-end}
#chatCard .ch-bub{max-width:82%;padding:10px 12px;border-radius:16px;line-height:1.45}
#chatCard .ch-bub.c{background:#eef1ff;border-bottom-left-radius:4px}
#chatCard .ch-bub.l{background:#3346C8;color:#fff;border-bottom-right-radius:4px}
#chatCard .ch-bub.ch-live{background:#5d6ee0;min-width:60px}
#chatCard .ch-dots i{display:inline-block;width:7px;height:7px;margin:0 2px;border-radius:50%;background:#fff;animation:chDot 1s infinite}
#chatCard .ch-dots i:nth-child(2){animation-delay:.15s} #chatCard .ch-dots i:nth-child(3){animation-delay:.3s}
@keyframes chDot{0%,60%,100%{opacity:.3}30%{opacity:1}}
#chatCard .ch-line{font-size:17px;font-weight:600}
#chatCard .ch-tr{color:var(--muted);font-size:14px;margin-top:4px}
#chatCard .ch-tools{display:flex;gap:10px;margin-top:4px;font-size:13px}
#chatCard .ch-wait{color:var(--muted);font-style:italic}
#chatCard .ch-fb{max-width:88%;font-size:14px;line-height:1.45;padding:8px 10px;border-radius:12px;border:1px solid var(--line);background:#fff}
#chatCard .ch-log .ch-fb{align-self:flex-end}
#chatCard .ch-fb.great{border-color:#b7e4cc;background:#f1fbf5} #chatCard .ch-fb.good{border-color:#f3dfa0;background:#fffbea} #chatCard .ch-fb.fix{border-color:#f5c2c7;background:#fff5f6}
#chatCard .ch-badge{font-weight:700}
#chatCard .ch-better,#chatCard .ch-hint{margin-top:6px;font-size:14px} #chatCard .ch-better span,#chatCard .ch-hint span{color:var(--muted)}
#chatCard .ch-hint{margin:8px 0}
#chatCard .ch-w{border:0;background:none;padding:0;font:inherit;color:#3346C8;font-weight:600;cursor:pointer;text-align:left;text-decoration:underline dotted}
#chatCard .ch-type{display:flex;gap:8px;margin:8px 0} #chatCard .ch-type input{flex:1;min-width:0;padding:12px;border:1px solid var(--line);border-radius:12px;font:16px Inter,sans-serif}
#chatCard .ch-status{display:flex;align-items:center;justify-content:center;gap:10px;width:100%;padding:16px;margin:8px 0 4px;border-radius:16px;border:2px dashed #c7d0fb;background:#f3f5ff;color:#2a3aa8;font:700 16px Inter,sans-serif;cursor:pointer}
#chatCard .ch-status.tap{border-style:solid;border-color:#3346C8;animation:chNudge 1.6s ease-in-out infinite}
@keyframes chNudge{0%,100%{transform:scale(1)}50%{transform:scale(1.02)}}
#chatCard .ch-status.on{border-style:solid;border-color:#3346C8;background:#3346C8;color:#fff}
#chatCard .ch-pulse{width:12px;height:12px;border-radius:50%;background:#ff5a5f;box-shadow:0 0 0 0 rgba(255,90,95,.7);animation:chPulse 1.2s infinite}
@keyframes chPulse{70%{box-shadow:0 0 0 12px rgba(255,90,95,0)}100%{box-shadow:0 0 0 0 rgba(255,90,95,0)}}
#chatCard .ch-ctl{display:flex;flex-wrap:wrap;justify-content:center;gap:16px;margin-top:6px}
#chatCard .ch-err{color:#a4262c;margin:8px 0}
#chatCard .ch-prac,#chatCard .ch-rev{display:flex;flex-direction:column;gap:8px;margin-bottom:12px;text-align:left}
#chatCard .ch-p{display:flex;flex-wrap:wrap;align-items:center;gap:4px 10px;padding:10px;border:1px solid var(--line);border-radius:12px}
#chatCard .ch-p small{flex:1 1 100%;color:var(--muted)} #chatCard .ch-p .btn{margin-left:auto}
#chatCard .ch-iv{display:grid;grid-template-columns:auto 1fr;gap:0 10px;align-items:center;margin-top:10px;padding:12px;border-radius:14px;background:#1C2563;color:#fff;text-decoration:none;font-size:20px}
#chatCard .ch-iv b{font-size:15px} #chatCard .ch-iv span{grid-column:2;font-size:13px;opacity:.85}
#chatCard .ch-said{font-style:italic;margin-bottom:4px} #chatCard .ch-rev .ch-fb{max-width:none}
`;
const st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

// Chats is in a private beta: only show it to accounts the server allows (CHAT_BETA_EMAILS).
let checking = 0;
async function checkAccess(){
  const n = ++checking; let on = false;
  try {
    const r = await fetch('/.netlify/functions/chat', { method:'POST', headers: await headers(), body: JSON.stringify({ action:'access' }) });
    on = r.ok && !!(await r.json()).ok;
  } catch(e){}
  if (n !== checking || on === !!window.hsChatsOn) return;
  window.hsChatsOn = on;
  if (!on && set === CHATS){ reset(); set = Object.keys(DATA[lang].sets)[0]; idx = 0; }
  render();
}
window.addEventListener('hs-auth', checkAccess);
if (location.protocol !== 'file:') checkAccess();
})();
