// Harlo Says home screen: tapping Phrases opens a full-screen topic picker (free topics, Premium topics locked,
// Start lesson button), and a row of small tiles links to the other Harlo apps. Loaded after lesson.js.
(function () {
'use strict';
if (typeof render !== 'function' || typeof DATA === 'undefined') return;
const $ = id => document.getElementById(id);
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

// "Choose a topic" in the 16 interface languages
const PICK = { en:'Choose a topic', es:'Elige un tema', fr:'Choisissez un thème', it:'Scegli un argomento', de:'Wähle ein Thema', pt:'Escolhe um tema', pl:'Wybierz temat', ro:'Alege o temă', uk:'Обери тему', zh:'选择一个主题', ar:'اختر موضوعًا', nl:'Kies een onderwerp', tr:'Bir konu seç', ja:'トピックを選ぼう', ko:'주제를 골라요', vi:'Chọn một chủ đề' };
const pickT = () => PICK[ui] || PICK.en;

const ICONS = { 'Work: Care':'🧓', 'Work: Nursing':'🩺', 'Work: Hospitality':'🍽️', 'Work: Shop':'🛒', 'Work: Warehouse':'📦', 'Work: Cleaning':'🧽', 'Work: Phone':'📞', 'Work: Building':'🏗️', 'Basics':'👋', 'Café & restaurant':'☕', 'Travel':'🚆', 'Tricky sounds':'👅', 'Business & work':'💼', 'Shopping':'🛍️', 'Health & emergencies':'🏥', 'Social & small talk':'🗣️', 'Numbers, dates & time':'🔢' };
const COLS = [['#3346C8','#6C7BFF'],['#E8603C','#FFB25B'],['#0F9B8E','#3FD8A0'],['#7B2FD0','#D06CF0'],['#D93A7A','#FF8FB1'],['#1D4ED8','#60A5FA']];

const css = `
body.ph-home #tabs,body.ph-home #lsHome{display:none!important}
body.ph-home #groups .g-phrases.on{box-shadow:none}
.app-row{margin:4px 0 14px}
.app-row h3{margin:0 0 8px;font-size:15px;color:var(--ink);display:flex;align-items:center;gap:6px}
.app-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:9px}
.app-t{position:relative;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;min-height:84px;padding:10px 6px;border-radius:18px;color:#fff;text-decoration:none;text-align:center;
  font:800 13px/1.15 Inter,sans-serif;background:linear-gradient(150deg,var(--c1),var(--c2));box-shadow:0 4px 0 rgba(0,0,0,.14),0 8px 18px rgba(28,37,99,.10);
  transition:transform .12s;animation:apIn .4s cubic-bezier(.2,.8,.2,1) both;animation-delay:calc(var(--i)*45ms)}
.app-t:active{transform:translateY(2px) scale(.97)}
.app-t .ai{width:38px;height:38px;border-radius:50%;display:grid;place-items:center;font-size:21px;background:rgba(255,255,255,.25)}
.app-t.all{background:#fff;color:var(--ink);border:2px dashed #C9CEF5;box-shadow:none}
.app-t.all .ai{background:#EEF0FF}
@keyframes apIn{from{opacity:0;transform:translateY(8px) scale(.96)}to{opacity:1;transform:none}}
#phScreen{display:none;position:fixed;inset:0;z-index:58;overflow-y:auto;-webkit-overflow-scrolling:touch;background:linear-gradient(165deg,#3346C8 0%,#6C7BFF 55%,#9B8CFF 100%);
  padding:calc(env(safe-area-inset-top) + 12px) 14px calc(env(safe-area-inset-bottom) + 110px)}
#phScreen.show{display:block;animation:phIn .3s cubic-bezier(.2,.8,.2,1)}
@keyframes phIn{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}
body.ph-open{overflow:hidden}
#phScreen .ph-in{max-width:560px;margin:0 auto}
#phScreen .ph-top{display:flex;align-items:center;gap:10px;color:#fff}
#phScreen .ph-x{flex:none;width:40px;height:40px;border-radius:50%;border:0;background:rgba(255,255,255,.22);color:#fff;font-size:18px;cursor:pointer}
#phScreen h2{margin:0;font-size:22px;color:#fff}
#phScreen .ph-sub{margin:2px 0 0;font-size:13.5px;opacity:.9}
#phScreen .ph-dog{width:84px;height:84px;margin:6px auto 2px;filter:drop-shadow(0 8px 16px rgba(0,0,0,.2))}
#phScreen .ph-dog svg{width:100%;height:100%;display:block;animation:hbob 2.4s ease-in-out infinite}
#phScreen .ph-grid{display:grid;grid-template-columns:1fr 1fr;gap:11px;margin-top:10px}
#phScreen .ph-t{position:relative;display:flex;flex-direction:column;align-items:flex-start;gap:6px;min-height:128px;padding:13px;border:3px solid transparent;border-radius:20px;cursor:pointer;text-align:left;color:#fff;
  font:inherit;background:linear-gradient(150deg,var(--c1),var(--c2));box-shadow:0 5px 0 rgba(0,0,0,.16),0 10px 22px rgba(0,0,0,.14);transition:transform .12s,border-color .15s;
  animation:apIn .4s cubic-bezier(.2,.8,.2,1) both;animation-delay:calc(var(--i)*50ms)}
#phScreen .ph-t:active{transform:translateY(2px) scale(.98)}
#phScreen .ph-t.on{border-color:#fff;box-shadow:0 0 0 4px rgba(255,255,255,.35),0 5px 0 rgba(0,0,0,.16)}
#phScreen .ph-t.on::after{content:'✓';position:absolute;top:9px;right:10px;width:26px;height:26px;border-radius:50%;background:#fff;color:var(--c1);display:grid;place-items:center;font-weight:900;font-size:15px}
#phScreen .ph-t .pi{width:44px;height:44px;border-radius:14px;display:grid;place-items:center;font-size:24px;background:rgba(255,255,255,.25)}
#phScreen .ph-t b{font-size:16px;line-height:1.15}
#phScreen .ph-t small{font-size:12px;opacity:.92;margin-top:auto}
#phScreen .ph-t .pb{width:100%;height:6px;border-radius:6px;background:rgba(255,255,255,.3);overflow:hidden}
#phScreen .ph-t .pb i{display:block;height:100%;background:#fff;border-radius:6px}
#phScreen .ph-t.locked{background:linear-gradient(150deg,#4B5280,#6B7199);opacity:.92}
#phScreen .ph-t.locked .lk{position:absolute;top:9px;right:9px;font-size:11px;font-weight:800;background:#FFD166;color:#3a2a00;border-radius:999px;padding:3px 8px}
#phScreen .ph-h{color:#fff;font-weight:800;font-size:14px;margin:18px 2px 0;opacity:.9}
#phScreen .ph-go{position:fixed;left:0;right:0;bottom:0;padding:12px 14px calc(env(safe-area-inset-bottom) + 14px);background:linear-gradient(0deg,rgba(51,70,200,.96),rgba(51,70,200,0))}
#phScreen .ph-go button{display:block;width:100%;max-width:560px;margin:0 auto;border:0;border-radius:16px;padding:17px;font:800 18px Inter,sans-serif;background:#fff;color:var(--ink);cursor:pointer;box-shadow:0 5px 0 rgba(0,0,0,.18)}
#phScreen .ph-go button:active{transform:translateY(2px);box-shadow:0 3px 0 rgba(0,0,0,.18)}
#phScreen .ph-go button span{display:inline-block;animation:lhNudge 1.6s ease-in-out infinite}
#phScreen.work{background:linear-gradient(165deg,#6D28D9 0%,#8B5CF6 55%,#C4B5FD 100%)}
#phScreen.work .ph-go{background:linear-gradient(0deg,rgba(109,40,217,.96),rgba(109,40,217,0))}
#phScreen .ph-iv{display:block;margin:14px 0 0;text-align:center;font-weight:800;color:#fff;text-decoration:none;padding:13px;border:2px dashed rgba(255,255,255,.6);border-radius:16px;background:rgba(255,255,255,.12)}
body.sec-open{overflow:hidden}
#secScreen{display:none;position:fixed;inset:0;z-index:55;overflow-y:auto;-webkit-overflow-scrolling:touch;background:linear-gradient(165deg,var(--c1) 0%,var(--c2) 70%,#fff 140%);
  padding:calc(env(safe-area-inset-top) + 12px) 14px calc(env(safe-area-inset-bottom) + 30px)}
#secScreen.show{display:block;animation:phIn .3s cubic-bezier(.2,.8,.2,1)}
#secScreen .sc-bar{display:flex;align-items:center;gap:10px;max-width:560px;margin:0 auto 12px;color:#fff}
#secScreen .sc-bar .ph-x{flex:none;width:40px;height:40px;border-radius:50%;border:0;background:rgba(255,255,255,.22);color:#fff;font-size:18px;cursor:pointer}
#secScreen h2{margin:0;font-size:22px;color:#fff}
#secScreen .sc-body{max-width:560px;margin:0 auto}
#secScreen .sc-body > .card{margin:0;border:0;border-radius:24px;box-shadow:0 14px 40px rgba(0,0,0,.18);animation:apIn .35s cubic-bezier(.2,.8,.2,1)}
/* My phrase: brighter, bubblier */
#customCard .mine-stage{margin-bottom:12px}
#customCard > .heard{font-size:15px;color:var(--ink);font-weight:600}
#customCard .mine-from{background:linear-gradient(135deg,#FFF0F5,#FFE3EE);border:2px solid #FFC9DC;border-radius:18px;padding:10px 12px;gap:10px;box-shadow:0 3px 0 #FFC9DC}
#customCard .mine-from select{border:0;background:#fff;border-radius:12px;font-weight:800;padding:9px 10px;box-shadow:0 2px 0 #FFC9DC}
#customCard #dictate{border:0;border-radius:14px;background:linear-gradient(135deg,#FF8A3D,#FF5E7E);color:#fff;font-weight:800;box-shadow:0 3px 0 #c9483a;padding:10px 14px}
#customCard textarea{border:3px solid #FFB3CC;border-radius:20px;padding:14px 16px;font-size:17px;min-height:110px;background:#fff;box-shadow:inset 0 2px 6px rgba(224,69,123,.08)}
#customCard textarea:focus{outline:none;border-color:#E0457B;box-shadow:0 0 0 4px rgba(224,69,123,.18)}
#customCard .mine-acts{display:grid;grid-template-columns:1fr;gap:8px}
#customCard .mine-go{padding:16px!important;font-size:17px;border-radius:18px!important}
#customCard #useCustom{border:2px solid #FFC9DC;background:#FFF5F9;color:#B4235A;font-weight:800;border-radius:16px;padding:12px}
@media (prefers-reduced-motion:reduce){.app-t,#phScreen,#phScreen *,#secScreen,#secScreen *{animation:none!important}}
`;
document.head.insertAdjacentHTML('beforeend', '<style id="hubCss">' + css + '</style>');

// ---------- app tiles ----------
const row = document.createElement('section'); row.className = 'app-row'; row.id = 'appTiles';
const prog = $('progCard'); if (prog) prog.parentNode.insertBefore(row, prog);
function renderApps() {
  if (!window.HS_APPS) return;
  const sig = ui; if (row.dataset.sig === sig) return; row.dataset.sig = sig;
  const A = HS_APPS.list(ui), pick = ['games', 'iv', 'citizen', 'travel'];
  let h = `<h3>✨ ${esc(HS_APPS.t('more', ui))}</h3><div class="app-grid">`;
  pick.map(id => A.find(a => a.id === id)).forEach((a, i) => {
    h += `<a class="app-t" href="${esc(a.href)}" style="--c1:${a.c1};--c2:${a.c2};--i:${i}"><span class="ai" aria-hidden="true">${a.ic}</span>${esc(a.name)}</a>`;
  });
  h += `<a class="app-t all" href="/products/" style="--i:${pick.length}"><span class="ai" aria-hidden="true">➕</span>${esc(HS_APPS.t('seeAll', ui))}</a></div>`;
  row.innerHTML = h;
}

// ---------- Phrases topic picker ----------
const scr = document.createElement('section'); scr.id = 'phScreen'; scr.setAttribute('role', 'dialog'); scr.setAttribute('aria-modal', 'true');
document.body.appendChild(scr);
let open = false, pushed = false, chosen = null, mode = 'phrases';
const phraseSets = () => Object.keys(DATA[lang].sets).filter(n => !FOCUS_SETS.includes(n) && !(typeof isWork === 'function' && isWork(n)));
const workSets = () => (window.HS_WORK && HS_WORK.on(lang)) ? HS_WORK.sets.filter(n => DATA[lang].sets[n]) : [];
const freeSets = () => mode === 'work' ? workSets() : phraseSets();
function tileHtml(name, i, locked) {
  const [c1, c2] = COLS[i % COLS.length];
  if (locked) return `<button type="button" class="ph-t locked" data-lock style="--c1:${c1};--c2:${c2};--i:${i}"><span class="pi" aria-hidden="true">${ICONS[name] || '⭐'}</span><b>${esc(setName(name))}</b><span class="lk">🔒 Premium</span><small>${esc(PREMIUM_PER_TOPIC)} ${esc(t('g_phrases').toLowerCase())}</small></button>`;
  const L = DATA[lang].sets[name] || [], done = L.filter(p => (scores[lang + '|' + p[0]] || 0) >= 80).length;
  return `<button type="button" class="ph-t${name === chosen ? ' on' : ''}" data-set="${esc(name)}" aria-pressed="${name === chosen}" style="--c1:${c1};--c2:${c2};--i:${i}"><span class="pi" aria-hidden="true">${ICONS[name] || '📚'}</span><b>${esc(setName(name))}</b><small>${esc(t('s_mastered', { n: done, m: L.length }))}</small><span class="pb"><i style="width:${L.length ? Math.round(done / L.length * 100) : 0}%"></i></span></button>`;
}
function draw() {
  const free = freeSets();
  const last = mode === 'work' ? lastWorkSet : lastPhraseSet, work = mode === 'work';
  if (!free.includes(chosen)) chosen = free.includes(set) ? set : (free.includes(last) ? last : free[0]);
  scr.classList.toggle('work', work);
  let h = `<div class="ph-in"><div class="ph-top"><button type="button" class="ph-x" data-close aria-label="${esc(t('ls_close'))}">✕</button>
    <div><h2>${work ? '💼 ' + esc(HS_WORK.label()) : '📚 ' + esc(t('g_phrases'))}</h2><p class="ph-sub">${esc(FLAGS[lang] || '')} ${esc(LN(lang))} · ${esc(pickT())}</p></div></div>
    <div class="ph-dog" aria-hidden="true">${coachFace('happy')}</div><div class="ph-grid">`;
  free.forEach((n, i) => { h += tileHtml(n, i); });
  h += '</div>';
  if (work) h += `<a class="ph-iv" data-iv href="/interview/?kind=customer&job=${encodeURIComponent(HS_WORK.job(chosen))}">💼 ${esc(HS_WORK.interview())} →</a>`;
  else { h += `<div class="ph-h">⭐ ${esc(t('g_premium'))}</div><div class="ph-grid">`; PREMIUM_TOPICS.forEach((n, i) => { h += tileHtml(n, i + free.length, true); }); h += '</div>'; }
  h += `</div><div class="ph-go"><button type="button" data-start><span>▶</span> ${esc(t('ls_start'))}</button></div>`;
  scr.innerHTML = h;
}
function show(m) {
  mode = m || 'phrases'; chosen = null; draw(); open = true; scr.classList.add('show'); document.body.classList.add('ph-open'); scr.scrollTop = 0;
  if (!pushed) { try { history.pushState({ ph: 1 }, ''); pushed = true; } catch (e) {} }
  const s = scr.querySelector('[data-start]'); if (s) s.focus({ preventScroll: true });
}
function hide(viaHistory) {
  if (!open) return;
  open = false; scr.classList.remove('show'); document.body.classList.remove('ph-open');
  if (pushed && !viaHistory) { pushed = false; try { history.back(); } catch (e) {} } else pushed = false;
}
window.addEventListener('popstate', () => { if (open) hide(true); });
document.addEventListener('keydown', e => { if (e.key === 'Escape' && open) hide(); });
scr.addEventListener('click', e => {
  if (e.target.closest('[data-close]')) return hide();
  const tile = e.target.closest('[data-set]');
  if (tile) { chosen = tile.dataset.set; scr.querySelectorAll('[data-set]').forEach(b => { const on = b === tile; b.classList.toggle('on', on); b.setAttribute('aria-pressed', on); });
    const iv = scr.querySelector('[data-iv]'); if (iv && window.HS_WORK) iv.href = '/interview/?kind=customer&job=' + encodeURIComponent(HS_WORK.job(chosen)); if (window.HSFX) try { HSFX.sound('tap'); } catch (err) {} return; }
  if (e.target.closest('[data-lock]')) { hide(); if (typeof goPremium === 'function') goPremium(); return; }
  if (e.target.closest('[data-start]')) {
    const name = chosen; open = false; scr.classList.remove('show'); document.body.classList.remove('ph-open'); pushed = false; // the lesson takes over this history entry
    set = name; idx = 0; render();
    if (window.hsStartLesson) window.hsStartLesson();
  }
});
// The Phrases button on the home screen opens the picker instead of showing topics underneath.
document.addEventListener('click', e => {
  const b = e.target.closest('#groups button'); if (!b) return;
  const id = (b.className.match(/\bg-(\w+)/) || [])[1]; if (!id) return;
  if (id === 'phrases' || id === 'work') {
    e.preventDefault(); e.stopImmediatePropagation();
    mode = id; const free = freeSets(), last = id === 'work' ? lastWorkSet : lastPhraseSet;
    if (groupOf(set) !== id) { set = free.includes(last) ? last : free[0]; idx = 0; render(); }
    return show(id);
  }
  if (SECT[id]) { e.preventDefault(); e.stopImmediatePropagation(); openSec(id); }
}, true);

// ---------- Chats, My phrase, Focus packs, Assess me, Premium: each on its own full screen ----------
const SECT = {
  chats:   { card: 'chatCard',   ic: '💬', label: () => t('g_chats'),   col: ['#DB2777', '#F472B6'], go: () => { set = CHATS; } },
  mine:    { card: 'customCard', ic: '✏️', label: () => t('g_mine'),    col: ['#E0457B', '#FF8FB1'], go: () => { set = CUSTOM; } },
  focus:   { card: 'focusCard',  ic: '🎯', label: () => t('g_focus'),   col: ['#7B2FD0', '#D06CF0'], go: () => { set = FOCUS; } },
  assess:  { card: 'assessCard', ic: '📊', label: () => t('g_assess'),  col: ['#0F9B6E', '#4ADE80'], go: () => { set = ASSESS; } },
  premium: { card: 'premiumCard', ic: '⭐', label: () => t('g_premium'), col: ['#F59E0B', '#FBBF24'], go: () => { premOpen = true; } }
};
const sec = document.createElement('section'); sec.id = 'secScreen'; sec.setAttribute('role', 'dialog'); sec.setAttribute('aria-modal', 'true');
sec.innerHTML = '<div class="sc-bar"><button type="button" class="ph-x" data-sclose>✕</button><h2 id="scTitle"></h2></div><div class="sc-body" id="scBody"></div>';
document.body.appendChild(sec);
let secId = null, secPushed = false, holder = null;
function openSec(id) {
  const S = SECT[id], card = $(S.card); if (!card) return;
  if (secId) closeSec(false, true);
  secId = id; S.go(); idx = 0; premOpen = id === 'premium';
  holder = document.createComment('sec'); card.parentNode.insertBefore(holder, card); $('scBody').appendChild(card);
  sec.style.setProperty('--c1', S.col[0]); sec.style.setProperty('--c2', S.col[1]);
  $('scTitle').textContent = S.ic + ' ' + S.label(); sec.querySelector('[data-sclose]').setAttribute('aria-label', t('ls_close'));
  sec.className = 'show s-' + id; document.body.classList.add('sec-open');
  render(); sec.scrollTop = 0;
  if (id === 'premium') { card.style.display = 'block'; }
  if (!secPushed) { try { history.pushState({ sec: 1 }, ''); secPushed = true; } catch (e) {} }
  if (window.HSFX) try { HSFX.sound('tap'); } catch (err) {}
}
function closeSec(viaHistory, keepState) {
  if (!secId) return;
  const card = $(SECT[secId].card);
  if (holder && card) { holder.parentNode.insertBefore(card, holder); holder.remove(); holder = null; }
  secId = null; sec.className = ''; document.body.classList.remove('sec-open'); premOpen = false;
  if (secPushed && !viaHistory && !keepState) { secPushed = false; try { history.back(); } catch (e) {} } else if (!keepState) secPushed = false;
  if (!keepState) { const free = phraseSets(); set = free.includes(lastPhraseSet) ? lastPhraseSet : free[0]; idx = 0; summaryOn = false; render(); }
}
sec.addEventListener('click', e => { if (e.target.closest('[data-sclose]')) closeSec(); });
let lessonJustEnded = 0;
window.addEventListener('popstate', () => { if (secId && !document.body.classList.contains('lesson-on') && Date.now() - lessonJustEnded > 600) closeSec(true); });
document.addEventListener('keydown', e => { if (e.key === 'Escape' && secId && !document.body.classList.contains('lesson-on')) closeSec(); });
// After a Focus pack's lesson ends, come back to the Focus packs screen
let wasLesson = false;
new MutationObserver(() => {
  const on = document.body.classList.contains('lesson-on');
  if (wasLesson && !on) lessonJustEnded = Date.now();
  if (wasLesson && !on && secId === 'focus' && FOCUS_SETS.includes(set)) { set = FOCUS; idx = 0; render(); }
  wasLesson = on;
}).observe(document.body, { attributes: true, attributeFilter: ['class'] });
// Premium buttons anywhere open the Premium screen
goPremium = function () { openSec('premium'); setTimeout(() => { const e = $('wlEmail'); if (e && e.offsetParent) e.focus({ preventScroll: true }); }, 400); }; // eslint-disable-line no-global-assign
$('premBtn').onclick = goPremium; if ($('lockedCta')) $('lockedCta').onclick = goPremium;

// ---------- hook into render ----------
const baseRender = render;
render = function () { // eslint-disable-line no-global-assign
  baseRender.apply(this, arguments);
  if (secId === 'premium') { const c = $('premiumCard'); if (c) c.style.display = 'block'; }
  document.body.classList.toggle('ph-home', groupOf(set) === 'phrases' && !document.body.classList.contains('lesson-on'));
  renderApps();
  if (open) draw();
};
render();
})();
