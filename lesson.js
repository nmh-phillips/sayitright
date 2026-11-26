// Lesson mode: a full-screen, colourful flow through a topic, one phrase at a time.
// Harley (or Lilou) reacts on screen, you swipe or tap Next, and every 10 phrases a round summary
// shows your score before you continue. Reuses the normal practice card, so scoring, tips and
// "Each sound" all work as usual. Close (✕, Esc or the phone's Back button) returns to the normal screen.
(function () {
  'use strict';
  const ROUND = 10;
  const $ = id => document.getElementById(id);
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const practice = $('practice');
  if (!practice || typeof render !== 'function') return;

  // ---------- styles ----------
  const css = `
  .ls-bar,.ls-dog,.ls-title{display:none}
  .ls-home{position:relative;overflow:hidden;border:0;color:#fff;background:var(--ls-bg,linear-gradient(160deg,#3346C8,#6C7BFF));box-shadow:0 10px 26px rgba(28,37,99,.18);padding:16px;animation:lhIn .45s cubic-bezier(.2,.8,.2,1)}
  .ls-home .lh-top{display:flex;align-items:center;gap:12px}
  .ls-home .lh-dog{flex:none;width:64px;height:64px;filter:drop-shadow(0 4px 8px rgba(0,0,0,.18))}
  .ls-home .lh-dog svg{width:100%;height:100%;display:block;animation:hbob 2.4s ease-in-out infinite}
  .ls-home .lh-k{font-size:12px;font-weight:700;opacity:.85;text-transform:uppercase;letter-spacing:.04em}
  .ls-home h3{margin:2px 0 2px;font-size:22px;line-height:1.15;color:#fff}
  .ls-home p{margin:0;font-size:13.5px;opacity:.95}
  .ls-home .lh-bar{height:8px;border-radius:8px;background:rgba(255,255,255,.3);margin:12px 0 12px;overflow:hidden}
  .ls-home .lh-bar i{display:block;height:100%;background:#fff;border-radius:8px;transition:width .6s}
  .ls-home .lh-go{width:100%;border:0;border-radius:14px;padding:15px;font:800 17px Inter,sans-serif;background:#fff;color:var(--ink);cursor:pointer;box-shadow:0 4px 0 rgba(0,0,0,.15);transition:transform .12s}
  .ls-home .lh-go:active{transform:translateY(2px) scale(.98);box-shadow:0 2px 0 rgba(0,0,0,.15)}
  .ls-home .lh-go span{animation:lhNudge 1.6s ease-in-out infinite;display:inline-block}
  .ls-home .lh-sub{display:block;text-align:center;margin-top:7px;font-size:12.5px;opacity:.9}
  .ls-home::after{content:'';position:absolute;top:-40%;left:-60%;width:40%;height:180%;background:linear-gradient(90deg,transparent,rgba(255,255,255,.25),transparent);transform:rotate(18deg);animation:lhShine 5s ease-in-out 1.2s infinite;pointer-events:none}
  @keyframes lhIn{from{opacity:0;transform:translateY(12px) scale(.98)}to{opacity:1;transform:none}}
  @keyframes lhNudge{0%,100%{transform:translateX(0)}50%{transform:translateX(4px)}}
  @keyframes lhShine{0%{left:-60%}35%,100%{left:130%}}
  body.lesson-on #practice .ls-title{display:block;text-align:center;color:#fff;font-weight:800;font-size:17px;margin:2px 0 0;text-shadow:0 1px 2px rgba(0,0,0,.15)}
  .ls-start-wrap{margin:-4px 0 10px}
  .ls-start-wrap.show{display:block}
  .ls-start{width:100%;justify-content:center;font-weight:700}
  body.lesson-on{overflow:hidden}
  body.lesson-on #practice{position:fixed;inset:0;z-index:60;margin:0;border:0;border-radius:0;overflow-y:auto;-webkit-overflow-scrolling:touch;
    padding:calc(env(safe-area-inset-top) + 10px) 14px calc(env(safe-area-inset-bottom) + 24px);background:var(--ls-bg,linear-gradient(160deg,#3346C8,#6C7BFF));}
  body.lesson-on #practice .ls-bar{display:flex;align-items:center;gap:10px;max-width:560px;margin:0 auto 6px}
  body.lesson-on #practice .ls-dog{display:block;width:118px;height:118px;margin:4px auto 10px;filter:drop-shadow(0 8px 18px rgba(0,0,0,.18))}
  body.lesson-on #practice .ls-dog svg{width:100%;height:100%;display:block}
  body.lesson-on #practice .ls-panel{max-width:560px;margin:0 auto;background:#fff;border-radius:22px;padding:18px 18px 16px;box-shadow:0 14px 40px rgba(0,0,0,.18)}
  body.lesson-on #practice .ls-panel.ls-in{animation:lsIn .38s cubic-bezier(.2,.8,.2,1)}
  body.lesson-on #practice .ls-panel.ls-back{animation:lsBack .38s cubic-bezier(.2,.8,.2,1)}
  body.lesson-on #practice .phrase{font-size:30px}
  body.lesson-on #practice .mic{padding:22px;font-size:19px;border-radius:18px}
  body.lesson-on #practice .f-bar,body.lesson-on #practice .upsell,body.lesson-on #practice .ls-start-wrap{display:none!important}
  body.lesson-on #practice .ls-hint{display:block}
  .ls-hint{display:none;text-align:center;color:rgba(255,255,255,.85);font-size:13px;margin:12px 0 0}
  .ls-x{flex:none;width:38px;height:38px;border-radius:50%;border:0;background:rgba(255,255,255,.22);color:#fff;font-size:18px;cursor:pointer}
  .ls-prog{flex:1;display:flex;gap:4px}
  .ls-prog i{flex:1;height:8px;border-radius:8px;background:rgba(255,255,255,.28);transition:background .3s}
  .ls-prog i.ok{background:#7FE0C9} .ls-prog i.mid{background:#FFD166} .ls-prog i.cur{background:#fff;box-shadow:0 0 0 2px rgba(255,255,255,.5)}
  .ls-round{flex:none;color:#fff;font-weight:700;font-size:13px;white-space:nowrap}
  .ls-dog.idle svg{animation:hbob 2.4s ease-in-out infinite}
  .ls-dog.listen svg{animation:hlisten .9s ease-in-out infinite}
  .ls-dog.jump svg{animation:hjump .8s ease-in-out 3}
  .ls-dog.wag svg{animation:hwag .5s ease-in-out 4}
  .ls-dog.tilt svg{animation:htilt 1.4s ease-in-out 2}
  @keyframes lsIn{from{opacity:0;transform:translateX(60px) scale(.97)}to{opacity:1;transform:none}}
  @keyframes lsBack{from{opacity:0;transform:translateX(-60px) scale(.97)}to{opacity:1;transform:none}}
  #lsRound{display:none;position:fixed;inset:0;z-index:70;overflow-y:auto;padding:calc(env(safe-area-inset-top) + 24px) 16px 32px;background:var(--ls-bg,linear-gradient(160deg,#3346C8,#6C7BFF));color:#fff;text-align:center}
  #lsRound.show{display:block}
  #lsRound .box{max-width:520px;margin:0 auto;background:#fff;color:var(--ink);border-radius:22px;padding:22px 18px;box-shadow:0 14px 40px rgba(0,0,0,.2);animation:lsIn .4s cubic-bezier(.2,.8,.2,1);position:relative;overflow:hidden}
  #lsRound .big{font-size:56px;font-weight:800;line-height:1;margin:6px 0}
  #lsRound .big small{font-size:20px;color:var(--muted)}
  #lsRound .stars{font-size:28px;color:#F5B700;letter-spacing:4px}
  #lsRound .dog{width:130px;height:130px;margin:0 auto 6px}
  #lsRound .dog svg{width:100%;height:100%}
  #lsRound h2{margin:0 0 4px;font-size:22px}
  #lsRound .msg{margin:6px 0 12px;color:var(--muted)}
  #lsRound .list{display:grid;gap:6px;margin:8px 0 14px;text-align:left}
  #lsRound .list button{display:flex;justify-content:space-between;gap:8px;width:100%;text-align:left}
  #lsRound .list small{color:var(--muted)}
  #lsRound .acts{display:grid;gap:8px}
  #lsRound .acts .primary{padding:16px;font-size:17px}
  body.lesson-on #summaryCard{position:fixed;inset:0;z-index:65;margin:0;border:0;border-radius:0;overflow-y:auto;padding:calc(env(safe-area-inset-top) + 18px) 16px 32px;background:var(--ls-bg,linear-gradient(160deg,#3346C8,#6C7BFF))}
  body.lesson-on #summaryCard > *{max-width:520px;margin-left:auto;margin-right:auto}
  body.lesson-on #summaryCard .sum-set,body.lesson-on #summaryCard .sum-msg,body.lesson-on #summaryCard .a-num,body.lesson-on #summaryCard .a-num small,body.lesson-on #summaryCard .a-meta,body.lesson-on #summaryCard h3{color:#fff}
  @media (prefers-reduced-motion:reduce){.ls-home,.ls-home *,.ls-home::after,.ls-dog svg,#lsRound .box,body.lesson-on #practice .ls-panel{animation:none!important}}
  `;
  document.head.insertAdjacentHTML('beforeend', '<style id="lessonCss">' + css + '</style>');

  // ---------- build: top bar + big dog + white panel around the existing card contents ----------
  const bar = document.createElement('div'); bar.className = 'ls-bar';
  bar.innerHTML = '<button class="ls-x" type="button" id="lsClose">✕</button><div class="ls-prog" id="lsProg"></div><span class="ls-round" id="lsRoundLbl"></span>';
  const title = document.createElement('div'); title.className = 'ls-title'; title.id = 'lsTitle';
  const dog = document.createElement('div'); dog.className = 'ls-dog idle'; dog.id = 'lsDog'; dog.setAttribute('aria-hidden', 'true');
  const panel = document.createElement('div'); panel.className = 'ls-panel';
  const home = document.createElement('section'); home.className = 'card ls-home'; home.id = 'lsHome'; home.style.display = 'none';
  practice.parentNode.insertBefore(home, practice);
  const hint = document.createElement('p'); hint.className = 'ls-hint'; hint.id = 'lsHint';
  const meta = practice.querySelector('.meta');
  [...practice.children].filter(el => !el.classList.contains('f-bar')).forEach(el => panel.appendChild(el));
  practice.appendChild(bar); practice.appendChild(title); practice.appendChild(dog); practice.appendChild(panel); practice.appendChild(hint);
  const roundEl = document.createElement('section'); roundEl.id = 'lsRound'; roundEl.setAttribute('aria-live', 'polite');
  document.body.appendChild(roundEl);

  // ---------- state ----------
  let on = false, lastIdx = -1, lastSet = null, pushed = false;
  const session = {}; // 'lang|set|idx' -> latest score this session
  const sKey = i => lang + '|' + set + '|' + i;
  const COLOURS = [
    'linear-gradient(160deg,#3346C8,#6C7BFF)',   // Basics: Harley blue
    'linear-gradient(160deg,#E8603C,#FFB25B)',   // Café: warm orange
    'linear-gradient(160deg,#0F9B8E,#3FD8A0)',   // Travel: teal
    'linear-gradient(160deg,#7B2FD0,#D06CF0)',   // Tricky sounds: purple
    'linear-gradient(160deg,#D93A7A,#FF8FB1)'    // extra topics: pink
  ];
  const lessonable = () => set === CUSTOM ? list().length >= 1 : (set !== ASSESS && set !== FOCUS && !isLocked(set) && list().length > 1);
  function colour() {
    if (typeof DAILY5 !== 'undefined' && set === DAILY5) return 'linear-gradient(160deg,#FF7A2F,#FFB547)';
    if (set === CUSTOM) return 'linear-gradient(160deg,#E0457B,#FF8FB1)';
    if (FOCUS_SETS.includes(set)) return 'linear-gradient(160deg,#2E9E4F,#9BE15D)';
    const free = Object.keys(DATA[lang].sets).filter(n => !FOCUS_SETS.includes(n));
    const i = free.indexOf(set);
    return COLOURS[(i < 0 ? 0 : i) % COLOURS.length];
  }
  const rounds = () => Math.ceil(list().length / ROUND);
  const roundOf = i => Math.floor(i / ROUND);

  function face(m, anim) {
    dog.className = 'ls-dog ' + anim;
    dog.innerHTML = coachFace(m);
  }
  function renderBar() {
    const L = list(), r = roundOf(idx), from = r * ROUND, to = Math.min(L.length, from + ROUND);
    let h = '';
    for (let i = from; i < to; i++) {
      const s = session[sKey(i)];
      h += `<i class="${i === idx ? 'cur' : s === undefined ? '' : s >= 80 ? 'ok' : 'mid'}"></i>`;
    }
    $('lsProg').innerHTML = h;
    $('lsRoundLbl').textContent = t('ls_round', { n: r + 1, m: rounds() });
    title.textContent = (FOCUS_SETS.includes(set) ? '🎯 ' : '') + setName(set);
    $('lsClose').setAttribute('aria-label', t('ls_close'));
    hint.textContent = t('ls_swipe');
    const one = L.length <= 1; $('lsProg').style.visibility = one ? 'hidden' : ''; $('lsRoundLbl').style.visibility = one ? 'hidden' : ''; hint.style.display = one ? 'none' : '';
  }

  // ---------- enter / exit ----------
  function enter(fromStart) {
    if (!lessonable()) return;
    if (fromStart !== false) {
      // start at the first round that still has a phrase below 80%
      const L = list(); let first = L.findIndex(p => (scores[key(p)] || 0) < 80);
      if (first < 0) first = 0;
      if (idx === 0) idx = roundOf(first) * ROUND;
    }
    on = true; document.body.classList.add('lesson-on');
    if (!pushed) { try { history.pushState({ lesson: 1 }, ''); pushed = true; } catch (e) {} }
    lastIdx = -1; render(); practice.scrollTop = 0;
    if (typeof track === 'function') track('lesson');
  }
  function exit(viaHistory) {
    on = false; document.body.classList.remove('lesson-on'); roundEl.classList.remove('show');
    if (pushed && !viaHistory) { pushed = false; try { history.back(); } catch (e) {} } else pushed = false;
    render();
  }
  window.addEventListener('popstate', () => { if (on) exit(true); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && on) { if (roundEl.classList.contains('show')) roundEl.classList.remove('show'); else exit(); } });
  $('lsClose').onclick = () => exit();
  home.addEventListener('click', e => { if (e.target.closest('.lh-go')) enter(true); });
  window.hsStartLesson = () => enter(true);
  // Start a given round of a topic (journey.js: a stop on the day-out map)
  window.hsStartRound = (name, r) => { set = name; idx = r * ROUND; render(); enter(false); };

  // Home screen: no practice card until you start. A colourful card shows the topic, your progress and a Start button.
  function renderHome(can) {
    if (set === CUSTOM) { // My phrase: just the input card; practice opens as a lesson after Translate / Practise
      home.style.display = 'none';
      if (!on && !summaryOn) practice.style.display = 'none';
      const md = $('mineDog'), cid = typeof coachId === 'function' ? coachId() : 'harley'; if (md && md.dataset.c !== cid) { md.innerHTML = coachFace('happy'); md.dataset.c = cid; }
      return;
    }
    const show = !on && can && !summaryOn;
    home.style.display = show ? 'block' : 'none';
    if (!show) return;
    practice.style.display = 'none';
    const L = list(), done = L.filter(p => (scores[key(p)] || 0) >= 80).length;
    const first = L.findIndex(p => (scores[key(p)] || 0) < 80), r = first < 0 ? 0 : roundOf(first);
    const kind = (typeof DAILY5 !== 'undefined' && set === DAILY5) ? '☀️ ' + t('d5_title') : FOCUS_SETS.includes(set) ? '🎯 ' + t('g_focus') : '📚 ' + t('g_phrases');
    home.style.setProperty('--ls-bg', colour());
    const sig = [lang, set, done, ui].join('|');
    if (home.dataset.sig === sig) return; home.dataset.sig = sig;
    home.innerHTML = `<div class="lh-top"><div class="lh-dog" aria-hidden="true">${coachFace('happy')}</div>
      <div style="min-width:0"><div class="lh-k">${esc(kind.replace(/[&<>]/g, ''))}</div><h3>${esc(setName(set))}</h3><p>${esc(t('s_mastered', { n: done, m: L.length }))}</p></div></div>
      <div class="lh-bar"><i style="width:${L.length ? Math.round(done / L.length * 100) : 0}%"></i></div>
      <button class="lh-go" type="button"><span>▶</span> ${esc(t('ls_start'))}</button>
      ${r > 0 ? `<span class="lh-sub">${esc(t('ls_round', { n: r + 1, m: rounds() }))}</span>` : ''}`;
  }

  // ---------- hook into render ----------
  const baseRender = render;
  render = function () { // eslint-disable-line no-global-assign
    baseRender.apply(this, arguments);
    const can = lessonable();
    renderHome(can);
    if (on && !can && !summaryOn) { exit(); return; }
    if (!on) return;
    const bg = colour(); [practice, roundEl, $('summaryCard')].forEach(el => el.style.setProperty('--ls-bg', bg));
    if (idx !== lastIdx || set !== lastSet) {
      panel.classList.remove('ls-in', 'ls-back'); void panel.offsetWidth;
      panel.classList.add(set === lastSet && idx < lastIdx ? 'ls-back' : 'ls-in');
      face('happy', 'idle');
      lastIdx = idx; lastSet = set;
      practice.scrollTo ? practice.scrollTo({ top: 0, behavior: 'smooth' }) : (practice.scrollTop = 0);
    }
    renderBar();
  };

  // Remember this session's score for each phrase (for the progress bar and round summaries).
  ['gradeAzure', 'grade'].forEach(name => {
    const base = window[name]; if (typeof base !== 'function') return;
    window[name] = function () {
      const r = base.apply(this, arguments);
      const n = parseInt(els.pct.textContent, 10);
      if (!isNaN(n)) session[sKey(idx)] = n;
      if (on) renderBar();
      return r;
    };
  });

  // Big dog follows the small result face and the mic.
  new MutationObserver(() => {
    if (!on) return;
    const c = $('mood').className;
    if (/m-celebrate/.test(c)) face('celebrate', 'jump');
    else if (/m-happy/.test(c)) face('happy', 'wag');
    else if (/m-puzzled/.test(c)) face('puzzled', 'tilt');
  }).observe($('mood'), { attributes: true, attributeFilter: ['class'] });
  new MutationObserver(() => {
    if (!on) return;
    if (els.mic.classList.contains('rec')) face('happy', 'listen');
  }).observe(els.mic, { attributes: true, attributeFilter: ['class'] });

  // ---------- rounds of 10 ----------
  function showRound(r) {
    const L = list(), from = r * ROUND, to = Math.min(L.length, from + ROUND);
    const items = []; for (let i = from; i < to; i++) items.push({ i, p: L[i], s: session[sKey(i)], b: scores[key(L[i])] });
    const tried = items.filter(x => x.s !== undefined);
    const vals = (tried.length ? tried.map(x => x.s) : items.filter(x => x.b !== undefined).map(x => x.b));
    const avg = vals.length ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) : 0;
    const band = !vals.length ? 'low' : avg >= 85 ? 'top' : avg >= 65 ? 'good' : avg >= 40 ? 'mid' : 'low';
    const look = { top: ['celebrate', 'jump'], good: ['happy', 'wag'], mid: ['puzzled', 'tilt'], low: ['happy', 'idle'] }[band];
    const stars = { top: 3, good: 2, mid: 1, low: 0 }[band];
    const weak = items.filter(x => (x.s ?? x.b ?? -1) < 80).sort((a, b) => (a.s ?? a.b ?? -1) - (b.s ?? b.b ?? -1)).slice(0, 3);
    const last = to >= L.length;
    let h = `<div class="box"><div class="dog ls-dog ${look[1]}" style="display:block">${coachFace(look[0])}</div>
      <h2>${esc(t('ls_done', { n: r + 1 }))}</h2>`;
    if (vals.length) h += `<div class="big">${avg}<small>/100</small></div><div class="stars" aria-label="${stars}/3">${'★'.repeat(stars)}${'☆'.repeat(3 - stars)}</div>`;
    h += `<p class="msg">${esc(t(vals.length ? 's_' + band : 's_none'))}</p>`;
    if (weak.length) h += `<h3 style="margin:6px 0 0;font-size:15px">${esc(t('s_again'))}</h3><div class="list">${weak.map(x => `<button class="btn" data-lsgo="${x.i}"><span>${esc(x.p[0])}</span><small>${(x.s ?? x.b) === undefined ? esc(t('s_notTried')) : (x.s ?? x.b) + '%'}</small></button>`).join('')}</div>`;
    h += `<div class="acts"><button class="btn primary" data-lscont>${esc(last ? t('s_see') : t('ls_cont'))} →</button><button class="btn" data-lsagain>${esc(t('ls_again'))}</button></div>`;
    if (band === 'top') {
      const cols = ['#FFD166', '#7FE0C9', '#F7B8C4', '#3346C8', '#F5C542'];
      h += `<div class="confetti" aria-hidden="true">${Array.from({ length: 26 }, (_, i) => `<i style="left:${Math.random() * 100}%;background:${cols[i % 5]};animation-duration:${1.8 + Math.random() * 1.6}s;animation-delay:${Math.random() * 0.8}s"></i>`).join('')}</div>`;
    }
    h += '</div>';
    roundEl.innerHTML = h; roundEl.classList.add('show'); roundEl.scrollTop = 0;
    roundEl.dataset.round = r;
    if (window.haUnlock) haUnlock();
    if (window.harleySay && vals.length) harleySay('clip', band === 'top' ? 'yay' : band === 'good' ? 'woof' : 'aww');
    if (typeof track === 'function') track('lesson_round');
    window.dispatchEvent(new CustomEvent('hs-round', { detail: { set, round: r, stars } })); // journey.js
  }
  roundEl.addEventListener('click', e => {
    const b = e.target.closest('[data-lsgo],[data-lscont],[data-lsagain]'); if (!b) return;
    const r = Number(roundEl.dataset.round || 0), L = list();
    roundEl.classList.remove('show');
    if (b.dataset.lsgo !== undefined) { idx = Number(b.dataset.lsgo); render(); return; }
    if (b.hasAttribute('data-lsagain')) { for (let i = r * ROUND; i < Math.min(L.length, (r + 1) * ROUND); i++) delete session[sKey(i)]; idx = r * ROUND; lastIdx = -1; render(); return; }
    const next = (r + 1) * ROUND;
    if (next < L.length) { idx = next; render(); }
    else { summaryOn = lang + '|' + set; summaryBark = true; render(); } // whole topic done: the full summary
  });

  // In lesson mode, Next at the end of a round opens the round summary first.
  document.addEventListener('click', e => {
    if (!on || !e.target.closest('#next')) return;
    const L = list();
    if ((idx + 1) % ROUND === 0 || idx === L.length - 1) {
      e.stopPropagation(); e.preventDefault();
      showRound(roundOf(idx));
    }
  }, true);

  // Swipe left for next, right for back.
  let sx = null, sy = null;
  practice.addEventListener('touchstart', e => { if (!on || e.touches.length !== 1) return; sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
  practice.addEventListener('touchend', e => {
    if (!on || sx === null) return;
    const dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy; sx = null;
    if (Math.abs(dx) < 60 || Math.abs(dx) < Math.abs(dy) * 1.5) return;
    if (dx < 0 && !els.next.disabled) els.next.click();
    else if (dx > 0 && !els.prev.disabled) els.prev.click();
  }, { passive: true });

  // The Daily 5 banner is its own Start button: open it straight in lesson mode.
  document.addEventListener('click', e => {
    if (on) return;
    if (!e.target.closest('#d5Banner')) return;
    setTimeout(() => { if (lessonable()) enter(false); }, 0);
  }, true); // capture: the tab buttons are rebuilt during their own click

  // My phrase: the Translate button pulses once there's something to translate.
  const ct = $('customText');
  if (ct) { const f = () => $('customCard').classList.toggle('has-text', !!ct.value.trim()); ct.addEventListener('input', f); f(); }

  render();
})();
