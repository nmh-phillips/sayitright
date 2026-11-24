// Harley Says: "Harley Chats" — spoken role-play conversations with Harley (or Lilou).
// Uses globals from index.html (lang, ui, t, LN, DATA, Rec, store, set, custom, idx, render, coachId, coachFace, DEVICE_ID, track, speak, $)
// and pron.js (harleySay, haUnlock). Backend: netlify/functions/chat.mjs. Strings ch_* live in i18n.js.
(function(){
const SCENES = [['cafe','☕'],['restaurant','🍝'],['directions','🗺️'],['shop','👕'],['hotel','🏨'],['pharmacy','💊'],['neighbour','🏠'],['party','🎉']];
const LEVELS = ['easy','normal','hard'];
const MAX_TURNS = 8; // matches CHAT_TURNS on the server (the server has the final say)
const today = () => new Date().toISOString().slice(0,10);
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const coachName = () => coachId() === 'lilou' ? 'Lilou' : 'Harley';
const card = () => document.getElementById('chatCard');

const S = { view:'pick', scene:null, level: store.get('hs_chat_level','normal'), history:[], items:[], hint:'', busy:false, error:'', ended:false, sum:null, typing: !Rec, interim:'', listening:false };
if (!LEVELS.includes(S.level)) S.level = 'normal';
function leftToday(){ const v = store.get('hs_chat_left', null); return v && v.day === today() ? v.n : null; }

// «word» → tappable word read in the learnt language
function rich(text){
  return esc(text).replace(/«([^»]+)»/g, (m, w) => `<button class="ch-w" data-chw="${w}">${w}</button>`);
}
function say(text){ if (!text) return; if (window.harleySay) harleySay('line', text, () => speak(text, 0.95), coachId()); else speak(text, 0.95); }

// ---------- views ----------
function renderPick(c){
  const left = leftToday();
  let h = `<div class="a-head"><h2>💬 ${esc(t('ch_title'))}</h2></div>
    <div class="ch-intro"><div class="ch-face" aria-hidden="true">${coachFace('happy')}</div><p>${esc(t('ch_intro',{lang:LN(lang), name:coachName()}))}</p></div>
    <div class="ch-lvl" role="group" aria-label="${esc(t('ch_level'))}"><span>${esc(t('ch_level'))}</span>${LEVELS.map(l => `<button data-chlvl="${l}" class="${S.level===l?'on':''}" aria-pressed="${S.level===l}">${esc(t('ch_'+l))}</button>`).join('')}</div>
    <h3 class="ch-h3">${esc(t('ch_pick'))}</h3>
    <div class="ch-scenes">${SCENES.map(([id,ic]) => `<button class="ch-scene" data-chscene="${id}"><span class="ic" aria-hidden="true">${ic}</span><b>${esc(t('ch_s_'+id))}</b><small>${esc(t('ch_d_'+id))}</small></button>`).join('')}</div>`;
  if (left !== null) h += `<p class="a-meta">${esc(t('ch_left',{n:left}))}</p>`;
  if (!Rec) h += `<p class="a-meta">${esc(t('ch_noMic'))}</p>`;
  if (S.error) h += `<p class="ch-err">${S.error}</p>`;
  c.innerHTML = h;
}
function renderChat(c){
  const [, ic] = SCENES.find(s => s[0] === S.scene) || ['', '💬'];
  const learnerTurns = S.history.filter(h => h.r === 'l').length;
  let h = `<div class="ch-top"><b>${ic} ${esc(t('ch_s_'+S.scene))}</b><span class="a-meta">${esc(t('ch_turns',{n:Math.min(learnerTurns+(S.ended?0:1),MAX_TURNS),m:MAX_TURNS}))}</span><button class="linkbtn" data-chquit aria-label="${esc(t('ch_other'))}">✕</button></div><div class="ch-log" id="chLog">`;
  S.items.forEach((it, i) => {
    if (it.r === 'c') {
      h += `<div class="ch-row c"><div class="ch-face sm" aria-hidden="true">${coachFace('happy')}</div><div class="ch-bub c"><div class="ch-line">${esc(it.line)}</div>
        ${it.showTr && it.translation ? `<div class="ch-tr">${esc(it.translation)}</div>` : ''}
        <div class="ch-tools"><button class="linkbtn" data-chsay="${i}">🔊</button>${it.translation ? `<button class="linkbtn" data-chtr="${i}">${esc(t(it.showTr?'ch_hideTr':'ch_showTr'))}</button>` : ''}</div></div></div>`;
    } else {
      h += `<div class="ch-row l"><div class="ch-bub l">${esc(it.text)}</div></div>`;
      if (it.fb) {
        const f = it.fb;
        h += `<div class="ch-fb ${f.rating}"><span class="ch-badge">${esc(t('ch_'+f.rating))}</span> ${rich(f.note)}
          ${f.better ? `<div class="ch-better"><span>${esc(t('ch_better'))}</span> <button class="ch-w" data-chline="${esc(f.better)}">🔊 ${esc(f.better)}</button></div>` : ''}</div>`;
      }
    }
  });
  if (S.busy) h += `<div class="ch-row c"><div class="ch-face sm" aria-hidden="true">${coachFace('puzzled')}</div><div class="ch-bub c ch-wait">${esc(t('ch_wait',{name:coachName()}))}</div></div>`;
  h += `</div>`;
  if (S.error) h += `<p class="ch-err">${S.error}</p>`;
  if (S.ended) {
    h += `<div class="row"><button class="btn primary" data-chend>${esc(t('ch_seeSum'))}</button></div>`;
  } else if (!S.busy && S.items.length) {
    if (S.hint) h += `<div class="ch-hint"><span>${esc(t('ch_try'))}</span> <button class="ch-w" data-chline="${esc(S.hint)}">🔊 ${esc(S.hint)}</button></div>`;
    if (S.typing) {
      h += `<form class="ch-type" data-chform><input id="chInput" autocomplete="off" maxlength="300" placeholder="${esc(t('ch_placeholder',{lang:LN(lang)}))}" lang="${esc(DATA[lang].code)}"><button class="btn primary" type="submit">${esc(t('ch_send'))}</button></form>`;
      if (Rec) h += `<button class="linkbtn" data-chmode>${esc(t('ch_speak'))}</button>`;
    } else {
      h += `<button class="btn mic${S.listening?' rec':''}" data-chmic>${esc(S.listening ? t('ch_listening') : t('ch_tap'))}</button>`;
      if (S.interim) h += `<p class="ch-interim">“${esc(S.interim)}”</p>`;
      h += `<button class="linkbtn" data-chmode>${esc(t('ch_type'))}</button>`;
    }
    if (learnerTurns) h += ` <button class="linkbtn" data-chend>${esc(t('ch_finish'))}</button>`;
  }
  c.innerHTML = h;
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
  h += `<div class="row"><button class="btn" data-chagain>${esc(t('ch_again'))}</button><button class="btn primary" data-chquit>${esc(t('ch_other'))}</button></div>`;
  c.innerHTML = h;
}
function draw(){
  const c = card(); if (!c) return;
  if (S.view === 'chat') renderChat(c); else if (S.view === 'sum' && S.sum) renderSum(c); else renderPick(c);
}
window.renderChat = draw;
window.chatLangChanged = () => { stopListening(); Object.assign(S, { view:'pick', history:[], items:[], hint:'', busy:false, error:'', ended:false, sum:null }); };

// ---------- talking to the server ----------
function errMsg(status, j){
  if (status === 429 || j.error === 'limit'){ store.set('hs_chat_left', {day:today(), n:0}); track('limit'); return esc(t('ch_limit')) + ` <button class="linkbtn" data-prem>${esc(t('getNotified'))}</button>`; }
  if (/not configured/i.test(j.error || '')) return esc(t('ch_off'));
  return esc(t('ch_err')) + ` <button class="linkbtn" data-chretry>${esc(t('ch_retry'))}</button>`;
}
async function call(action){
  const r = await fetch('/.netlify/functions/chat', { method:'POST', headers:{'Content-Type':'application/json'},
    body: JSON.stringify({ action, device: DEVICE_ID, lang, ui, scene: S.scene, level: S.level, persona: coachId(), history: S.history }) });
  const j = await r.json().catch(() => ({}));
  if (!r.ok || j.error) { const e = new Error(j.error || 'HTTP ' + r.status); e.status = r.status; e.j = j; throw e; }
  return j;
}
let pending = null; // what to retry
async function start(scene){
  stopListening();
  Object.assign(S, { view:'chat', scene, history:[], items:[], hint:'', busy:true, error:'', ended:false, sum:null });
  pending = () => start(scene);
  draw(); card().scrollIntoView({behavior:'smooth', block:'start'});
  try {
    const j = await call('start');
    S.history.push({ r:'c', t:j.line }); S.items.push({ r:'c', line:j.line, translation:j.translation });
    S.hint = j.hint || '';
    if (typeof j.remaining === 'number') store.set('hs_chat_left', {day:today(), n:j.remaining});
    track('chat_start'); say(j.line);
  } catch(e){
    S.error = errMsg(e.status, e.j || {});
    if (!S.items.length) { S.view = 'pick'; }
  }
  S.busy = false; draw();
}
async function reply(text){
  text = String(text || '').replace(/\s+/g, ' ').trim().slice(0, 300);
  if (!text || S.busy || S.ended) return;
  S.history.push({ r:'l', t:text }); const item = { r:'l', text }; S.items.push(item);
  S.busy = true; S.error = ''; S.hint = ''; S.interim = '';
  pending = () => { S.history.pop(); S.items.pop(); reply(text); };
  draw();
  try {
    const j = await call('reply');
    item.fb = j.feedback;
    S.history.push({ r:'c', t:j.line }); S.items.push({ r:'c', line:j.line, translation:j.translation });
    S.hint = j.hint || ''; S.ended = !!j.end;
    track('chat_turn'); say(j.line);
  } catch(e){ S.error = errMsg(e.status, e.j || {}); }
  S.busy = false; draw();
}
async function finish(){
  if (S.busy) return;
  stopListening();
  S.busy = true; S.error = ''; pending = finish; draw();
  try {
    const j = await call('end');
    S.sum = j; S.view = 'sum'; track('chat_done');
    // keep the phrases for later practice (Daily 5)
    const rev = store.get('hs_chat_review', []).filter(x => !j.practise.some(p => p.p === x.p));
    store.set('hs_chat_review', j.practise.map(p => ({ ...p, lang, day: today() })).concat(rev).slice(0, 30));
    if (window.harleySay) harleySay('clip', j.score >= 85 ? 'yay' : j.score >= 65 ? 'woof' : 'aww');
  } catch(e){ S.error = errMsg(e.status, e.j || {}); }
  S.busy = false; draw();
  card().scrollIntoView({behavior:'smooth', block:'start'});
}

// ---------- listening ----------
let rec = null;
function stopListening(){ if (rec) { try { rec.abort(); } catch(e){} rec = null; } S.listening = false; S.interim = ''; }
function listen(){
  if (S.listening) { if (rec) rec.stop(); return; }
  if (!Rec) { S.typing = true; draw(); return; }
  if ('speechSynthesis' in window) speechSynthesis.cancel();
  rec = new Rec(); rec.lang = DATA[lang].code; rec.interimResults = true; rec.continuous = false; rec.maxAlternatives = 1;
  let final = '';
  rec.onstart = () => { S.listening = true; S.interim = ''; S.error = ''; draw(); };
  rec.onresult = e => {
    let txt = ''; final = '';
    for (const r of e.results) { txt += r[0].transcript; if (r.isFinal) final += r[0].transcript; }
    S.interim = txt; const p = card().querySelector('.ch-interim');
    if (p) p.textContent = '“' + txt + '”'; else draw();
  };
  rec.onerror = e => { S.error = esc(e.error === 'not-allowed' || e.error === 'service-not-allowed' ? t('micBlocked') : t('ch_noCatch')); };
  rec.onend = () => {
    const said = (final || S.interim).trim(); rec = null; S.listening = false; S.interim = '';
    if (said) reply(said); else { if (!S.error) S.error = esc(t('ch_noCatch')); draw(); }
  };
  try { rec.start(); } catch(err){ rec = null; S.typing = true; draw(); }
}

// ---------- clicks ----------
document.addEventListener('click', e => {
  const b = e.target.closest('#chatCard button'); if (!b) return;
  const d = b.dataset;
  if (d.chlvl){ S.level = d.chlvl; store.set('hs_chat_level', S.level); draw(); return; }
  if (d.chscene){ if (window.haUnlock) haUnlock(); start(d.chscene); return; }
  if (d.chw !== undefined){ if (window.harleySay) harleySay('word', d.chw, () => speak(d.chw, 0.8), coachId()); else speak(d.chw, 0.8); return; }
  if (d.chline !== undefined){ if (window.haUnlock) haUnlock(); say(d.chline); return; }
  if (d.chsay !== undefined){ if (window.haUnlock) haUnlock(); say(S.items[+d.chsay].line); return; }
  if (d.chtr !== undefined){ const it = S.items[+d.chtr]; it.showTr = !it.showTr; draw(); return; }
  if (b.hasAttribute('data-chmic')){ if (window.haUnlock) haUnlock(); listen(); return; }
  if (b.hasAttribute('data-chmode')){ stopListening(); S.typing = !S.typing; S.focusInput = S.typing; draw(); return; }
  if (b.hasAttribute('data-chend')){ if (window.haUnlock) haUnlock(); finish(); return; }
  if (b.hasAttribute('data-chretry')){ S.error = ''; if (pending) pending(); return; }
  if (b.hasAttribute('data-chagain')){ if (window.haUnlock) haUnlock(); start(S.scene); return; }
  if (b.hasAttribute('data-chquit')){ stopListening(); Object.assign(S, { view:'pick', history:[], items:[], hint:'', busy:false, error:'', ended:false, sum:null }); draw(); return; }
  if (d.chprac !== undefined){
    const p = S.sum.practise[+d.chprac];
    set = CUSTOM; custom = [p.p, p.m]; idx = 0; render();
    els.practice.scrollIntoView({behavior:'smooth'}); speak(p.p, 0.95);
  }
});
document.addEventListener('submit', e => {
  if (!e.target.closest('#chatCard [data-chform]')) return;
  e.preventDefault(); if (window.haUnlock) haUnlock();
  const inp = document.getElementById('chInput'); const v = inp ? inp.value : ''; S.focusInput = true; reply(v);
});

// ---------- styles ----------
const css = `
#chatCard .ch-intro{display:flex;gap:12px;align-items:center;margin:4px 0 12px}
#chatCard .ch-intro p{margin:0;color:var(--muted);line-height:1.45}
#chatCard .ch-face{width:56px;height:56px;flex:0 0 auto} #chatCard .ch-face.sm{width:34px;height:34px}
#chatCard .ch-face svg{width:100%;height:100%;display:block}
#chatCard .ch-lvl{display:flex;flex-wrap:wrap;gap:6px;align-items:center;margin-bottom:12px}
#chatCard .ch-lvl span{font-weight:600;font-size:14px;margin-right:4px}
#chatCard .ch-lvl button{border:1px solid var(--line);background:#fff;border-radius:999px;padding:6px 12px;font:600 13px Inter,sans-serif;cursor:pointer}
#chatCard .ch-lvl button.on{background:#3346C8;border-color:#3346C8;color:#fff}
#chatCard .ch-h3{margin:6px 0 8px;font-size:16px}
#chatCard .ch-scenes{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:8px}
#chatCard .ch-scene{display:flex;flex-direction:column;align-items:flex-start;gap:3px;text-align:left;padding:12px;border-radius:14px;border:1px solid #c7d0fb;background:#f3f5ff;cursor:pointer;font:inherit;color:inherit}
#chatCard .ch-scene:hover{border-color:#3346C8}
#chatCard .ch-scene .ic{font-size:24px} #chatCard .ch-scene small{color:var(--muted);line-height:1.35}
#chatCard .ch-top{display:flex;align-items:center;gap:10px;margin-bottom:8px} #chatCard .ch-top b{flex:1}
#chatCard .ch-log{max-height:56vh;overflow-y:auto;display:flex;flex-direction:column;gap:8px;padding:4px 2px 8px}
#chatCard .ch-row{display:flex;gap:8px;align-items:flex-end} #chatCard .ch-row.l{justify-content:flex-end}
#chatCard .ch-bub{max-width:82%;padding:10px 12px;border-radius:16px;line-height:1.45}
#chatCard .ch-bub.c{background:#eef1ff;border-bottom-left-radius:4px}
#chatCard .ch-bub.l{background:#3346C8;color:#fff;border-bottom-right-radius:4px}
#chatCard .ch-line{font-size:17px;font-weight:600}
#chatCard .ch-tr{color:var(--muted);font-size:14px;margin-top:4px}
#chatCard .ch-tools{display:flex;gap:10px;margin-top:4px;font-size:13px}
#chatCard .ch-wait{color:var(--muted);font-style:italic}
#chatCard .ch-fb{align-self:flex-end;max-width:88%;font-size:14px;line-height:1.45;padding:8px 10px;border-radius:12px;border:1px solid var(--line);background:#fff}
#chatCard .ch-fb.great{border-color:#b7e4cc;background:#f1fbf5} #chatCard .ch-fb.good{border-color:#f3dfa0;background:#fffbea} #chatCard .ch-fb.fix{border-color:#f5c2c7;background:#fff5f6}
#chatCard .ch-badge{font-weight:700}
#chatCard .ch-better,#chatCard .ch-hint{margin-top:6px;font-size:14px} #chatCard .ch-better span,#chatCard .ch-hint span{color:var(--muted)}
#chatCard .ch-hint{margin:8px 0}
#chatCard .ch-w{border:0;background:none;padding:0;font:inherit;color:#3346C8;font-weight:600;cursor:pointer;text-align:left;text-decoration:underline dotted}
#chatCard .ch-type{display:flex;gap:8px;margin:8px 0} #chatCard .ch-type input{flex:1;min-width:0;padding:12px;border:1px solid var(--line);border-radius:12px;font:16px Inter,sans-serif}
#chatCard .ch-interim{color:var(--muted);font-style:italic;margin:6px 0}
#chatCard .ch-err{color:#a4262c;margin:8px 0}
#chatCard .ch-prac{display:flex;flex-direction:column;gap:8px;margin-bottom:12px}
#chatCard .ch-p{display:flex;flex-wrap:wrap;align-items:center;gap:4px 10px;padding:10px;border:1px solid var(--line);border-radius:12px;text-align:left}
#chatCard .ch-p small{flex:1 1 100%;color:var(--muted)} #chatCard .ch-p .btn{margin-left:auto}
`;
const st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

if (typeof set !== 'undefined' && set === CHATS) draw();
})();
