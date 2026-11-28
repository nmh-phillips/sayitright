// Harlo Games: word search, crossword, match pairs and unscramble.
// Plain JS, no build step. Uses games/words.js. Shares the learning language
// (localStorage 'sir_lang') with the Harlo pronunciation app.
(function () {
  'use strict';
  const W = window.HG_WORDS, LANGS = window.HG_LANGS, TOPICS = window.HG_TOPICS, UI = window.HG_UI, GLOSS = window.HG_GLOSS;
  const $ = id => document.getElementById(id);
  const app = $('app');
  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  };
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  // Random numbers: normal play uses Math.random; the daily puzzle uses a seeded generator so everyone gets the same one.
  let R = Math.random;
  const seeded = str => { let h = 1779033703 ^ str.length; for (let i = 0; i < str.length; i++) { h = Math.imul(h ^ str.charCodeAt(i), 3432918353); h = (h << 13) | (h >>> 19); } let a = h >>> 0; return () => { a |= 0; a = (a + 0x6D2B79F5) | 0; let x = Math.imul(a ^ (a >>> 15), 1 | a); x = (x + Math.imul(x ^ (x >>> 7), 61 | x)) ^ x; return ((x ^ (x >>> 14)) >>> 0) / 4294967296; }; };
  const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(R() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const rnd = a => a[Math.floor(R() * a.length)];

  // Letters: one grid cell per character; German ß becomes capital ẞ so it stays one cell.
  const up = ch => (ch === 'ß' ? 'ẞ' : ch.toUpperCase());
  const letters = w => Array.from(w.normalize('NFC')).map(up);
  // Typing comparison ignores accents, so "e" fills an "É" cell.
  const plain = ch => ch.normalize('NFD').replace(/[̀-ͯ]/g, '').replace('ẞ', 'S').replace('Œ', 'O').toUpperCase();
  const isLetter = ch => /\p{L}/u.test(ch);

  // ---------- Settings ----------
  function defaultLang() {
    const nav = ((navigator.languages && navigator.languages[0]) || navigator.language || 'en').toLowerCase();
    return nav.startsWith('en') ? 'es' : 'en';
  }
  let lang = store.get('sir_lang', null);
  if (!W[lang]) lang = defaultLang();
  // pick = what the player chose (a topic id, 'random' or 'mix'); topic = what is being played now.
  const okPick = v => v === 'random' || v === 'mix' || TOPICS.some(x => x.id === v);
  let pick = store.get('hs_games_topic', 'animals');
  if (!okPick(pick)) pick = 'animals';
  let topic = pick === 'random' ? 'animals' : pick;
  window.store = store; // account.js saves to the account whenever these change
  const prog = store.get('hs_games', { done: {} });
  const LEVELS = ['easy', 'medium', 'hard'];
  let level = store.get('hs_games_level', 'medium');
  if (!LEVELS.includes(level)) level = 'medium';
  // Daily puzzle: one per day per learning language, same for everyone; game type rotates, topic picked by the date.
  let daily = false;
  const dayKey = (d = new Date()) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  const dayNum = () => Math.floor(Date.UTC(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()) / 864e5);
  const dailyPlan = () => { const pick = seeded('topic|' + dayKey() + '|' + lang); return { game: ['crossword', 'wordsearch', 'unscramble', 'match'][dayNum() % 4], topic: window.HG_TOPICS[Math.floor(pick() * window.HG_TOPICS.length)].id }; };
  const streakInfo = () => {
    const d = store.get('hs_daily', { last: '', streak: 0, best: 0 });
    const y = new Date(); y.setDate(y.getDate() - 1);
    const alive = d.last === dayKey() || d.last === dayKey(y);
    return { last: d.last, streak: alive ? d.streak : 0, best: d.best || 0, today: d.last === dayKey() };
  };
  function recordDaily() {
    const s = streakInfo();
    if (s.today) return s;
    const n = { last: dayKey(), streak: s.streak + 1, best: Math.max(s.best, s.streak + 1) };
    store.set('hs_daily', n); track('daily_done');
    return Object.assign(n, { today: true });
  }
  const L3 = (e, m, h) => (level === 'easy' ? e : level === 'hard' ? h : m);
  // Interface language: shared with Harlo ('sir_ui').
  let ui = (() => { const v = store.get('sir_ui', null); if (UI[v]) return v; const b = ((navigator.languages && navigator.languages[0]) || navigator.language || 'en').toLowerCase().split('-')[0]; return UI[b] ? b : 'en'; })();
  const ACC = window.HG_ACC || {};
  function t(k, vars) { let v = (UI[ui] && UI[ui][k] !== undefined) ? UI[ui][k] : UI.en[k] !== undefined ? UI.en[k] : (ACC[ui] && ACC[ui][k] !== undefined) ? ACC[ui][k] : (ACC.en || {})[k]; if (vars) for (const [a, b] of Object.entries(vars)) v = v.split('{' + a + '}').join(b); return v; }
  const learnName = () => window.HG_LEARN_NAMES[lang] || LANGS[lang].name;
  window.t = (k, v) => t(k, v); // sign-in text (account.js)
  function applyStatic() {
    document.documentElement.lang = ui;
    document.documentElement.dir = window.HG_RTL[ui] ? 'rtl' : 'ltr';
    document.querySelectorAll('[data-t],[data-i18n]').forEach(el => { el.textContent = t(el.dataset.t || el.dataset.i18n); });
    if (window.hsAccountRelabel) window.hsAccountRelabel();
  }

  function track(e) {
    try {
      if (location.protocol === 'file:') return;
      fetch('/.netlify/functions/track', { method: 'POST', keepalive: true, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ e, l: lang, u: ui }) }).catch(() => {});
    } catch (err) {}
  }

  // ---------- Speech ----------
  let voices = [];
  if ('speechSynthesis' in window) { voices = speechSynthesis.getVoices(); speechSynthesis.onvoiceschanged = () => { voices = speechSynthesis.getVoices(); }; }
  function say(text) {
    if (!('speechSynthesis' in window)) return;
    const code = LANGS[lang].code, base = code.split('-')[0];
    const u = new SpeechSynthesisUtterance(text);
    u.lang = code; u.rate = 0.9;
    const v = voices.find(v => v.lang && v.lang.replace('_', '-') === code) || voices.find(v => v.lang && v.lang.toLowerCase().startsWith(base));
    if (v) u.voice = v;
    speechSynthesis.cancel(); speechSynthesis.speak(u);
  }

  // Clues: English learners get the meaning in their own language plus a short English definition.
  // Everyone else gets the meaning in their interface language, unless that's the language being learnt.
  // 'mix' combines every vocabulary topic (verb-form topics stay separate: their clues work differently).
  function words() {
    if (topic === 'mix') return [].concat(...TOPICS.filter(x => !x.form).map(x => wordsFor(x.id)));
    return wordsFor(topic);
  }
  function wordsFor(topic) {
    const en = lang === 'en' || lang === 'enus', base = lang === 'esmx' ? 'es' : lang, form = TOPICS.find(x => x.id === topic).form;
    const G = GLOSS[ui] && GLOSS[ui][topic], E = GLOSS.en[topic];
    return W[lang][topic].map(([w, c], i) => {
      let clue = c, tr = '';
      if (en) { if (ui !== 'en' && G) { tr = G[i]; clue = `${tr} · ${c}`; } }
      else if (ui !== 'en' && ui !== base && G) clue = form ? c.replace(E[i], G[i]) : G[i];
      return { w: w.normalize('NFC'), clue, tr, L: letters(w) };
    });
  }
  const topicName = () => t('t_' + topic);
  const pickName = p => t('t_' + p);

  const GAMES = [{ id: 'wordsearch', ic: '🔎' }, { id: 'crossword', ic: '✏️' }, { id: 'match', ic: '🧩' }, { id: 'unscramble', ic: '🔤' },
    { id: 'sayit', ic: '🎙️' }, { id: 'listen', ic: '👂' }, { id: 'hangman', ic: '🍪' }, { id: 'wordday', ic: '🟩', noSetup: true }, { id: 'fill', ic: '🧱', noTopic: true }];
  GAMES.forEach(g => { Object.defineProperty(g, 'name', { get: () => t('g_' + g.id) }); Object.defineProperty(g, 'desc', { get: () => t('d_' + g.id) }); });

  // ---------- Harley ----------
  const HARLEY = '<svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><rect x="10" y="10" width="280" height="280" rx="64" fill="#FF8A3D"/><path d="M92 228 l-26 40 l52 -24 z" fill="#fff"/><circle cx="212" cy="148" r="33" fill="#fff"/><circle cx="200" cy="184" r="33" fill="#fff"/><circle cx="169" cy="207" r="33" fill="#fff"/><circle cx="131" cy="207" r="33" fill="#fff"/><circle cx="100" cy="184" r="33" fill="#fff"/><circle cx="88" cy="148" r="33" fill="#fff"/><circle cx="100" cy="112" r="33" fill="#fff"/><circle cx="131" cy="89" r="33" fill="#fff"/><circle cx="169" cy="89" r="33" fill="#fff"/><circle cx="200" cy="112" r="33" fill="#fff"/><circle cx="150" cy="148" r="70" fill="#fff"/><circle cx="125" cy="138" r="9" fill="#1C2563"/><circle cx="175" cy="138" r="9" fill="#1C2563"/><circle cx="128" cy="135" r="3" fill="#fff"/><circle cx="178" cy="135" r="3" fill="#fff"/><ellipse cx="150" cy="163" rx="13" ry="9" fill="#1C2563"/><path d="M143 180 q7 16 14 0 z" fill="#F07C92"/><path d="M150 171 q-10 14 -22 4 M150 171 q10 14 22 4" fill="none" stroke="#1C2563" stroke-width="4" stroke-linecap="round"/></svg>';

  const dressed = () => window.HSDog && HSDog.active() ? (window.HSDress ? HSDress(HSDog.face('happy'), 'mydog') : HSDog.face('happy')) : window.HSDress ? HSDress(HARLEY, 'harley') : HARLEY;

  // ---------- Hub ----------
  function hub() {
    document.title = t('title');
    const langOpts = Object.keys(LANGS).map(k => `<option value="${k}"${k === lang ? ' selected' : ''}>${esc(window.HG_LEARN_NAMES[k])}</option>`).join('');
    const uiOpts = window.HG_UI_LANGS.map(([k, n]) => `<option value="${k}"${k === ui ? ' selected' : ''}>${esc(n)}</option>`).join('');
    app.innerHTML = `
      <section class="hero">
        <div class="hero-dog">${dressed()}</div>
        <div><h2>${esc(t('heroH'))}</h2>
        <p>${esc(t('heroP'))}</p></div>
      </section>
      <div class="bar hs-pick"><label><span>${esc(t('iSpeak'))}</span><select id="hgUi">${uiOpts}</select></label><label><span>${esc(t('learning'))}</span><select id="hgLang">${langOpts}</select></label></div>
      ${dailyCard()}
      <h3 class="pick-h">${esc(t('g_pick'))}</h3>
      <div class="cards${hub.introDone ? '' : ' intro'}">${GAMES.map((g, i) => {
        const n = prog.done[g.id] || 0;
        return `<a class="game g-${g.id}" style="--i:${i}" href="#${g.id}"><span class="ic">${g.ic}</span><b>${esc(g.name)}</b><span class="d">${esc(g.desc)}</span>${n ? `<span class="n">${esc(t('played', { n }))}</span>` : ''}</a>`;
      }).join('')}</div>
      ${crossPromo(t('promoH'), t('promoP'))}
      <section class="card about"><h3>${esc(t('aboutH'))}</h3>
        <p>${esc(t('about1'))}</p>
        <p>${esc(t('about2'))}</p></section>`;
    hub.introDone = true;
    $('hgLang').onchange = e => { lang = e.target.value; store.set('sir_lang', lang); const dc = $('dailyCard'); if (dc) dc.outerHTML = dailyCard(); };
    $('hgUi').onchange = e => { ui = e.target.value; store.set('sir_ui', ui); applyStatic(); hub(); };
  }

  // ---------- Game setup: pick topic and level inside the chosen game, then Play ----------
  function setup(game) {
    document.title = `${game.name} · Harlo Games`;
    const n = prog.done[game.id] || 0;
    const chip = (id, ic, label, extra) => `<button type="button" data-pick="${id}" class="${extra || ''}${id === pick ? ' on' : ''}"><span>${ic}</span> ${esc(label)}</button>`;
    app.innerHTML = `
      <section class="setup g-${game.id}">
        <div class="su-top"><a href="#" class="su-back" aria-label="${esc(t('back'))}">${window.HG_RTL[ui] ? '→' : '←'}</a><span class="su-ic">${game.ic}</span></div>
        <h2>${esc(game.name)}</h2>
        <p>${esc(game.desc)}${n ? ` · ${esc(t('played', { n }))}` : ''}</p>
        <div class="su-dog">${dressed()}</div>
      </section>
      <section class="card su-card su-in" style="--d:1"${game.noTopic ? ' hidden' : ''}>
        <h4>${esc(t('g_topic'))}</h4>
        <nav class="chips su-chips">${chip('random', '🎲', t('t_random'), 'special') + chip('mix', '🌈', t('t_mix'), 'special')}${TOPICS.map(x => chip(x.id, x.ic, t('t_' + x.id))).join('')}</nav>
      </section>
      <section class="card su-card su-in" style="--d:2">
        <h4>${esc(t('level'))}</h4>
        <div class="su-lvl" role="group" aria-label="${esc(t('level'))}">${LEVELS.map((l, i) => `<button type="button" data-level="${l}" class="${l === level ? 'on' : ''}"><span>${'●'.repeat(i + 1)}</span>${esc(t(l))}</button>`).join('')}</div>
      </section>
      <button type="button" class="su-play g-${game.id} su-in" style="--d:3" id="suPlay">${esc(t('g_play'))}</button>`;
    app.querySelectorAll('[data-pick]').forEach(b => b.onclick = () => {
      pick = b.dataset.pick; store.set('hs_games_topic', pick);
      app.querySelectorAll('[data-pick]').forEach(x => x.classList.toggle('on', x === b));
    });
    app.querySelectorAll('[data-level]').forEach(b => b.onclick = () => {
      level = b.dataset.level; store.set('hs_games_level', level);
      app.querySelectorAll('[data-level]').forEach(x => x.classList.toggle('on', x === b));
    });
    $('suPlay').onclick = () => { location.hash = game.id + '/go'; };
  }

  function dailyCard() {
    const plan = dailyPlan(), g = GAMES.find(x => x.id === plan.game), s = streakInfo();
    const date = new Date().toLocaleDateString(ui === 'zh' ? 'zh-CN' : ui === 'en' ? 'en-GB' : ui, { weekday: 'long', day: 'numeric', month: 'long' });
    return `<a class="daily${s.today ? ' done-today' : ''}" id="dailyCard" href="#daily">
      <span class="dl-top"><b>📅 ${esc(t('dTitle'))}</b><span>${esc(date)}</span></span>
      <span class="dl-what">${g.ic} ${esc(g.name)} · ${esc(t('t_' + plan.topic))}</span>
      <span class="dl-streak">${s.streak ? esc(t('dStreak', { n: s.streak })) : esc(t('dStart'))}${s.best > 1 ? ` · ${esc(t('dBest', { n: s.best }))}` : ''}</span>
      <span class="dl-go">${esc(s.today ? t('dDone') : t('dPlay'))}</span></a>`;
  }

  function crossPromo(h, p) {
    return `<a class="promo" href="/?from=games"><span class="pic">🎙️</span><span><b>${esc(h)}</b><span>${esc(p)}</span></span><span class="go">${esc(t('promoGo'))}</span></a>`;
  }

  // ---------- Sounds, XP (fx.js), timer and personal bests ----------
  const fx = k => { if (window.HSFX) { HSFX.sound(k); if (k === 'pop' || k === 'good') HSFX.buzz(15); } };
  let gameT0 = 0, tick = null;
  const mmss = sec => Math.floor(sec / 60) + ':' + String(Math.floor(sec % 60)).padStart(2, '0');
  function startTimer() {
    clearInterval(tick); gameT0 = Date.now();
    tick = setInterval(() => { const el = $('gTimer'); if (!el) return clearInterval(tick); el.textContent = '⏱ ' + mmss((Date.now() - gameT0) / 1000); }, 1000);
  }
  function frame(game, inner) {
    document.title = `${game.name} · ${topicName()} · Harlo Games`;
    app.innerHTML = `
      <div class="ghead"><a href="#${daily ? '' : game.id}" class="back" aria-label="${esc(t('back'))}">${window.HG_RTL[ui] ? '→' : '←'}</a>
        <span class="gtimer" id="gTimer" aria-hidden="true">⏱ 0:00</span><div><h2>${game.ic} ${esc(game.name)}</h2><p class="sub">${daily ? `📅 ${esc(t('dTitle'))} · ` : ''}${esc(learnName())}${game.noSetup ? ` · 📅 ${esc(dayKey())}` : `${game.noTopic ? '' : ` · ${pick === 'random' && !daily ? '🎲 ' : ''}${esc(topicName())}`}${daily ? '' : ` · ${esc(t(level))}`}`}</p></div></div>
      <p class="help">${esc(t('h_' + game.id))}</p>
      <div id="game">${inner}</div>`;
  }

  // ---------- Finish screen ----------
  function finish(game, list, mistakes, extra) {
    const stars = mistakes === 0 ? 3 : mistakes <= 2 ? 2 : 1;
    prog.done[game.id] = (prog.done[game.id] || 0) + 1; store.set('hs_games', prog);
    track('game_done');
    clearInterval(tick);
    const secs = Math.max(1, Math.round((Date.now() - gameT0) / 1000)), bk = `${game.id}|${daily ? 'daily' : level}`, bests = store.get('hs_games_best', {});
    const isBest = !bests[bk] || secs < bests[bk];
    if (isBest) { bests[bk] = secs; store.set('hs_games_best', bests); }
    const timeLine = `<p class="g-time${isBest && prog.done[game.id] > 1 ? ' best' : ''}">⏱ ${mmss(secs)} · ${isBest && prog.done[game.id] > 1 ? '🏅 ' + esc(t('g_newBest')) : esc(t('g_best', { t: mmss(bests[bk]) }))}</p>`;
    fx('win'); if (window.HSFX) { if (stars === 3) HSFX.confetti(); HSFX.xp(10 + 5 * stars + (daily ? 10 : 0)); }
    const msg = t('done' + stars);
    let dailyBox = '';
    if (daily) {
      const st = recordDaily();
      const shareTxt = `${t('dShareText')} 📅 ${dayKey()}\n${'⭐'.repeat(stars)} · ${t('dStreak', { n: st.streak })}\nhttps://harlolearn.com/games/`;
      dailyBox = `<div class="dl-res"><b>${esc(t('dStreak', { n: st.streak }))}</b><span>${esc(t('dBack'))}</span>
        <button type="button" class="btn" id="dShare" data-txt="${esc(shareTxt)}">📤 ${esc(t('dShare'))}</button>
        ${window.hsAccount && window.hsAccount.ready() && !window.hsAccount.signedIn() ? `<button type="button" class="btn" id="dSave">👤 ${esc(t('acc_title'))}</button>` : ''}</div>`;
    }
    $('game').innerHTML = `
      <section class="card done">
        <div class="done-dog">${dressed()}</div>
        <h3>${msg}</h3>
        <div class="stars" aria-label="${stars} out of 3 stars">${'★'.repeat(stars)}<span>${'★'.repeat(3 - stars)}</span></div>
        ${timeLine}${extra ? `<p class="sub">${extra}</p>` : ''}
        ${dailyBox}
        <div class="review">${list.map(x => `<button type="button" class="rw" data-say="${esc(x.w)}"><b>${esc(x.w)}</b><span dir="auto">${esc(x.tr || x.clue)}</span><i>🔊</i></button>`).join('')}</div>
        <div class="row"><button type="button" class="btn primary" id="again">${esc(t('again'))}</button><a class="btn" href="#">${esc(t('other'))}</a></div>
      </section>
      ${crossPromo(t('promo2H'), t('promo2P'))}`;
    bindSay($('game'));
    $('again').onclick = () => route(true);
    const sv = $('dSave');
    if (sv) sv.onclick = () => window.hsAccount.open();
    const sh = $('dShare');
    if (sh) sh.onclick = async () => {
      const txt = sh.dataset.txt;
      try { if (navigator.share) { await navigator.share({ text: txt }); return; } } catch (e) { return; }
      try { await navigator.clipboard.writeText(txt); sh.textContent = '✓ ' + t('dCopied'); } catch (e) {}
    };
  }
  function bindSay(root) { root.querySelectorAll('[data-say]').forEach(b => b.addEventListener('click', () => say(b.dataset.say))); }

  // ---------- Word search ----------
  function wordsearch(game) {
    const maxLen = L3(9, 11, 13);
    const pool = shuffle(words().filter(x => x.L.length >= 3 && x.L.length <= maxLen && x.L.every(isLetter))).slice(0, L3(6, 8, 10));
    const size = Math.max(L3(9, 10, 12), ...pool.map(x => x.L.length));
    const grid = Array.from({ length: size }, () => Array(size).fill(''));
    const FWD = [[0, 1], [1, 0], [1, 1], [-1, 1]];
    const DIRS = L3([[0, 1], [1, 0]], FWD, FWD.concat(FWD.map(([a, b]) => [-a, -b])));
    const placed = [];
    for (const x of pool) {
      let ok = false;
      for (let t = 0; t < 300 && !ok; t++) {
        const [dr, dc] = rnd(DIRS), n = x.L.length;
        const r0 = Math.floor(R() * size), c0 = Math.floor(R() * size);
        const r1 = r0 + dr * (n - 1), c1 = c0 + dc * (n - 1);
        if (r1 < 0 || r1 >= size || c1 < 0 || c1 >= size) continue;
        let fit = true;
        for (let i = 0; i < n; i++) { const g = grid[r0 + dr * i][c0 + dc * i]; if (g && g !== x.L[i]) { fit = false; break; } }
        if (!fit) continue;
        for (let i = 0; i < n; i++) grid[r0 + dr * i][c0 + dc * i] = x.L[i];
        placed.push(Object.assign({}, x, { found: false })); ok = true;
      }
    }
    // Fill with A–Z plus this language's own letters, so accents don't give words away.
    const alpha = new Set('ABCDEFGHIJKLMNOPRSTUVWY'.split(''));
    W[lang] && Object.values(W[lang]).forEach(l => l.forEach(([w]) => letters(w).forEach(ch => { if (isLetter(ch)) alpha.add(ch); })));
    const basic = 'ABCDEFGHIJKLMNOPRSTUVWY'.split('');
    const A = basic.concat(basic, basic, basic, [...alpha].filter(ch => !basic.includes(ch))); // accented letters appear, but less often
    for (let r = 0; r < size; r++) for (let c = 0; c < size; c++) if (!grid[r][c]) grid[r][c] = rnd(A);

    frame(game, `
      <div class="ws" id="ws" style="grid-template-columns:repeat(${size},1fr);font-size:${size > 10 ? 'clamp(13px,3.6vw,20px)' : 'clamp(14px,4vw,22px)'}">
        ${grid.map((row, r) => row.map((ch, c) => `<div class="c" data-r="${r}" data-c="${c}">${esc(ch)}</div>`).join('')).join('')}
      </div>
      <p class="count" id="wsCount"></p>
      <ul class="wl" id="wl">${placed.map((x, i) => `<li data-i="${i}"><b>${esc(x.w)}</b> <span><bdi>${esc(x.clue)}</bdi></span></li>`).join('')}</ul>`);

    const ws = $('ws'), cells = [...ws.children], cell = (r, c) => cells[r * size + c];
    let start = null, pending = null, cur = [], mistakes = 0, colour = 0;
    const count = () => { $('wsCount').textContent = t('found', { n: placed.filter(x => x.found).length, m: placed.length }); };
    count();
    const at = e => { const el = document.elementFromPoint(e.clientX, e.clientY); return el && el.parentNode === ws ? { r: +el.dataset.r, c: +el.dataset.c } : null; };
    function line(a, b) {
      const dr = b.r - a.r, dc = b.c - a.c, n = Math.max(Math.abs(dr), Math.abs(dc));
      if (n === 0) return [a];
      if (dr && dc && Math.abs(dr) !== Math.abs(dc)) return null;
      const sr = Math.sign(dr), sc = Math.sign(dc), out = [];
      for (let i = 0; i <= n; i++) out.push({ r: a.r + sr * i, c: a.c + sc * i });
      return out;
    }
    function show(path) { cur.forEach(p => cell(p.r, p.c).classList.remove('sel')); cur = path || []; cur.forEach(p => cell(p.r, p.c).classList.add('sel')); }
    function check(path) {
      if (!path || path.length < 2) return false;
      const s = path.map(p => grid[p.r][p.c]).join(''), rev = [...s].reverse().join('');
      const i = placed.findIndex(x => !x.found && (x.L.join('') === s || x.L.join('') === rev));
      if (i < 0) return false;
      placed[i].found = true; colour = (colour % 6) + 1; fx('pop');
      path.forEach(p => cell(p.r, p.c).classList.add('f', 'k' + colour));
      const li = $('wl').querySelector(`[data-i="${i}"]`); li.classList.add('got'); li.innerHTML += ` <button type="button" class="spk" aria-label="${esc(t('listen'))}">🔊</button>`;
      li.querySelector('.spk').onclick = () => say(placed[i].w);
      say(placed[i].w); count();
      if (placed.every(x => x.found)) setTimeout(() => finish(game, placed, mistakes), 700);
      return true;
    }
    ws.addEventListener('pointerdown', e => {
      const p = at(e); if (!p) return; e.preventDefault();
      start = pending || p; show(line(start, p));
      try { ws.setPointerCapture(e.pointerId); } catch (err) {}
    });
    ws.addEventListener('pointermove', e => { if (!start) return; const p = at(e); if (p) { const l = line(start, p); if (l) show(l); } });
    const end = e => {
      if (!start) return;
      const p = at(e) || (cur.length ? cur[cur.length - 1] : start);
      if (!pending && p.r === start.r && p.c === start.c) { pending = start; start = null; show([pending]); return; }
      const path = line(start, p); start = null; pending = null;
      if (!check(path) && path && path.length > 1) { mistakes++; fx('try'); ws.classList.add('shake'); setTimeout(() => ws.classList.remove('shake'), 350); }
      show([]);
    };
    ws.addEventListener('pointerup', end);
    ws.addEventListener('pointercancel', () => { start = null; show(pending ? [pending] : []); });
  }

  // ---------- Crossword ----------
  function buildCrossword(list, maxWords) {
    const key = (r, c) => r + ',' + c;
    let best = null;
    for (let attempt = 0; attempt < 150; attempt++) {
      const order = attempt === 0 ? list.slice().sort((a, b) => b.L.length - a.L.length) : shuffle(list);
      const grid = new Map(), placed = [];
      const get = (r, c) => grid.get(key(r, c));
      const fits = (L, r, c, d) => {
        const dr = d === 'd' ? 1 : 0, dc = d === 'a' ? 1 : 0, n = L.length;
        if (get(r - dr, c - dc) || get(r + dr * n, c + dc * n)) return -1;
        let inter = 0;
        for (let i = 0; i < n; i++) {
          const rr = r + dr * i, cc = c + dc * i, g = get(rr, cc);
          if (g) { if (g.ch !== L[i] || g[d]) return -1; inter++; }
          else if (get(rr + dc, cc + dr) || get(rr - dc, cc - dr)) return -1;
        }
        return inter;
      };
      const put = (x, r, c, d) => {
        const dr = d === 'd' ? 1 : 0, dc = d === 'a' ? 1 : 0;
        x.L.forEach((ch, i) => { const k = key(r + dr * i, c + dc * i), g = grid.get(k) || { ch }; g[d] = true; grid.set(k, g); });
        placed.push({ x, r, c, d });
      };
      put(order[0], 0, 0, 'a');
      for (const x of order.slice(1)) {
        if (placed.length >= maxWords) break;
        const opts = [];
        for (const [k, g] of grid) {
          const [gr, gc] = k.split(',').map(Number);
          x.L.forEach((ch, i) => {
            if (ch !== g.ch) return;
            for (const d of ['a', 'd']) {
              if (g[d]) continue;
              const r = d === 'd' ? gr - i : gr, c = d === 'a' ? gc - i : gc;
              const n = fits(x.L, r, c, d);
              if (n > 0) opts.push({ r, c, d, n });
            }
          });
        }
        if (opts.length) { const top = Math.max(...opts.map(o => o.n)); const o = rnd(opts.filter(o => o.n === top)); put(x, o.r, o.c, o.d); }
      }
      const rs = [...grid.keys()].map(k => +k.split(',')[0]), cs = [...grid.keys()].map(k => +k.split(',')[1]);
      const h = Math.max(...rs) - Math.min(...rs) + 1, w = Math.max(...cs) - Math.min(...cs) + 1;
      const score = placed.length * 1000 - h * w - Math.abs(h - w) * 5 - (Math.max(h, w) > 13 ? 5000 : 0);
      if (Math.max(h, w) <= 16 && (!best || score > best.score)) best = { score, grid, placed, minR: Math.min(...rs), minC: Math.min(...cs), h, w };
    }
    return best;
  }

  function crossword(game) {
    const list = shuffle(words().filter(x => x.L.length >= 3 && x.L.length <= L3(9, 11, 12) && x.L.every(isLetter)));
    let cw = null;
    for (let m = L3(6, 8, 11); !cw && m >= 4; m -= 2) cw = buildCrossword(list, m);
    const showLen = level !== 'hard', strict = level === 'hard', givens = level === 'easy';
    if (!cw) { frame(game, `<p class="count">${esc(t('noCw'))}</p>`); return; }
    const { minR, minC, h, w } = cw;
    const words2 = cw.placed.map(p => ({ x: p.x, r: p.r - minR, c: p.c - minC, d: p.d }));
    // Numbering, top-left to bottom-right.
    const starts = [...new Set(words2.map(p => p.r * 100 + p.c))].sort((a, b) => a - b);
    words2.forEach(p => { p.num = starts.indexOf(p.r * 100 + p.c) + 1; p.cells = p.x.L.map((_, i) => [p.r + (p.d === 'd' ? i : 0), p.c + (p.d === 'a' ? i : 0)]); });
    const ans = {}, num = {};
    words2.forEach(p => { p.cells.forEach(([r, c], i) => { ans[r + ',' + c] = p.x.L[i]; }); num[p.r + ',' + p.c] = p.num; });
    const clues = d => words2.filter(p => p.d === d).sort((a, b) => a.num - b.num)
      .map(p => `<li data-w="${words2.indexOf(p)}"><b>${p.num}</b> <bdi>${esc(p.x.clue)}</bdi>${showLen ? ` <span class="len">(${p.x.L.length})</span>` : ''}</li>`).join('');
    const given = {};
    if (givens) words2.forEach(p => { given[p.cells[0].join(',')] = true; });
    let html = `<div class="cw" id="cw" style="grid-template-columns:repeat(${w},1fr);max-width:${Math.min(w * 44, 560)}px">`;
    for (let r = 0; r < h; r++) for (let c = 0; c < w; c++) {
      const k = r + ',' + c;
      html += ans[k] ? `<div class="cc">${num[k] ? `<span class="no">${num[k]}</span>` : ''}<input data-k="${k}" maxlength="2" autocomplete="off" autocapitalize="characters" spellcheck="false" aria-label="Row ${r + 1}, column ${c + 1}"${given[k] ? ` value="${esc(ans[k])}" readonly class="given"` : ''}></div>` : '<div class="cc x"></div>';
    }
    html += `</div>
      <div class="row"><button type="button" class="btn primary" id="cwCheck">${esc(t('check'))}</button><button type="button" class="btn" id="cwReveal">${esc(t('reveal'))}</button></div>
      <p class="count" id="cwMsg"></p>
      <div class="clues"><div><h4>${esc(t('across'))}</h4><ol id="cwA">${clues('a')}</ol></div><div><h4>${esc(t('down'))}</h4><ol id="cwD">${clues('d')}</ol></div></div>`;
    frame(game, html);

    const inp = k => $('cw').querySelector(`[data-k="${k}"]`);
    let active = null, checks = 0;
    const wordsAt = k => words2.filter(p => p.cells.some(([r, c]) => r + ',' + c === k));
    function setActive(p, focusK) {
      active = p;
      $('cw').querySelectorAll('input').forEach(i => i.parentNode.classList.remove('hl'));
      p.cells.forEach(([r, c]) => inp(r + ',' + c).parentNode.classList.add('hl'));
      app.querySelectorAll('.clues li').forEach(li => li.classList.toggle('on', +li.dataset.w === words2.indexOf(p)));
      if (focusK) inp(focusK).focus();
    }
    $('cw').querySelectorAll('input').forEach(el => {
      const k = el.dataset.k;
      el.addEventListener('focus', () => { if (!active || !active.cells.some(([r, c]) => r + ',' + c === k)) { const ws = wordsAt(k); setActive(ws.find(p => p.d === 'a') || ws[0]); } });
      el.addEventListener('click', () => {
        const ws = wordsAt(k);
        if (ws.length > 1 && active && document.activeElement === el && el.dataset.tapped) setActive(ws.find(p => p !== active));
        el.dataset.tapped = '1'; setTimeout(() => { delete el.dataset.tapped; }, 1500);
      });
      el.addEventListener('input', () => {
        const ch = Array.from(el.value).filter(isLetter).pop();
        el.value = ch ? up(ch) : '';
        el.parentNode.classList.remove('bad', 'ok');
        if (ch && active) {
          const i = active.cells.findIndex(([r, c]) => r + ',' + c === k);
          const nx = active.cells.slice(i + 1).find(([r, c]) => !inp(r + ',' + c).readOnly);
          if (nx) inp(nx[0] + ',' + nx[1]).focus();
        }
      });
      el.addEventListener('keydown', e => {
        if (e.key === 'Backspace' && !el.value && active) {
          const i = active.cells.findIndex(([r, c]) => r + ',' + c === k), pv = active.cells.slice(0, i).reverse().find(([r, c]) => !inp(r + ',' + c).readOnly);
          if (pv) { e.preventDefault(); const p = inp(pv[0] + ',' + pv[1]); p.value = ''; p.focus(); }
        }
      });
    });
    app.querySelectorAll('.clues li').forEach(li => li.onclick = () => { const p = words2[+li.dataset.w]; setActive(p, p.cells[0].join(',')); });

    $('cwCheck').onclick = () => {
      checks++;
      let right = 0, total = 0, wrong = 0;
      for (const k in ans) {
        total++; const el = inp(k), v = el.value;
        if (!v) continue;
        const okL = plain(v) === plain(ans[k]); // accents optional at every level
        if (okL) { right++; if (!strict) { el.value = ans[k]; el.parentNode.classList.add('ok'); } }
        else { wrong++; if (!strict) el.parentNode.classList.add('bad'); }
      }
      if (right === total) {
        $('cw').querySelectorAll('input').forEach(el => { el.value = ans[el.dataset.k]; el.parentNode.classList.add('ok'); });
        setTimeout(() => finish(game, words2.map(p => p.x), Math.max(0, checks - 1)), 600);
      } else { if (wrong) fx('try'); else fx('tick'); } if (right !== total) $('cwMsg').textContent = wrong ? t(strict ? 'wrongHard' : 'toFix', { n: wrong }) : t('toGo', { n: total - right });
    };
    $('cwReveal').onclick = () => {
      for (const k in ans) { const el = inp(k); el.value = ans[k]; el.parentNode.classList.remove('bad'); el.parentNode.classList.add('rev'); }
      $('cwMsg').textContent = t('revealed');
      app.querySelectorAll('.clues li').forEach(li => li.addEventListener('click', () => say(words2[+li.dataset.w].x.w)));
    };
  }

  // ---------- Match pairs ----------
  function match(game) {
    const pool = shuffle(words()).slice(0, L3(5, 6, 8));
    const left = shuffle(pool.map((x, i) => ({ i, t: x.w }))), right = shuffle(pool.map((x, i) => ({ i, t: x.clue })));
    frame(game, `
      <div class="mp"><div id="mpL">${left.map(o => `<button type="button" data-i="${o.i}" class="mw">${esc(o.t)}</button>`).join('')}</div>
      <div id="mpR">${right.map(o => `<button type="button" data-i="${o.i}" class="mm" dir="auto">${esc(o.t)}</button>`).join('')}</div></div>
      <p class="count" id="mpMsg"></p>`);
    let selL = null, selR = null, done = 0, mistakes = 0;
    const t0 = Date.now();
    const tryPair = () => {
      if (!selL || !selR) return;
      const a = selL, b = selR; selL = selR = null;
      if (a.dataset.i === b.dataset.i) {
        [a, b].forEach(x => { x.classList.remove('sel'); x.classList.add('ok'); x.disabled = true; });
        done++; fx('pop');
        if (done === pool.length) { const s = Math.round((Date.now() - t0) / 1000); setTimeout(() => finish(game, pool, mistakes, t('time', { s, m: mistakes })), 500); }
      } else {
        mistakes++; fx('try');
        [a, b].forEach(x => { x.classList.remove('sel'); x.classList.add('no'); setTimeout(() => x.classList.remove('no'), 400); });
      }
    };
    app.querySelectorAll('.mw').forEach(b => b.onclick = () => { app.querySelectorAll('.mw').forEach(x => x.classList.remove('sel')); selL = b; b.classList.add('sel'); say(pool[+b.dataset.i].w); tryPair(); });
    app.querySelectorAll('.mm').forEach(b => b.onclick = () => { app.querySelectorAll('.mm').forEach(x => x.classList.remove('sel')); selR = b; b.classList.add('sel'); tryPair(); });
  }

  // ---------- Unscramble ----------
  function unscramble(game) {
    const pool = shuffle(words().filter(x => x.L.length >= 3 && x.L.length <= L3(8, 10, 12) && x.L.every(isLetter))).slice(0, L3(6, 8, 10));
    const all = [...new Set(pool.flatMap(x => x.L))];
    let n = 0, mistakes = 0;
    frame(game, '<div id="us"></div>');
    function round() {
      const x = pool[n];
      let tiles = x.L.map((ch, i) => ({ ch, id: i }));
      if (level === 'hard') for (let d = 0; d < 2; d++) tiles.push({ ch: rnd(all), id: 100 + d }); // two decoy letters
      for (let t = 0; t < 10; t++) { tiles = shuffle(tiles); if (tiles.map(o => o.ch).join('') !== x.L.join('')) break; }
      const slots = Array(x.L.length).fill(null);
      $('us').innerHTML = `
        <p class="count">${esc(t('wordOf', { n: n + 1, m: pool.length }))}</p>
        <div class="uclue" dir="auto">${esc(x.clue)}</div>
        <div class="slots" id="slots"></div>
        <div class="tiles" id="tiles"></div>
        <div class="row">${level === 'hard' ? '' : `<button type="button" class="btn" id="usHint">${esc(t('hint'))}</button>`}<button type="button" class="btn" id="usSkip">${esc(t('skip'))}</button></div>`;
      const draw = () => {
        $('slots').innerHTML = slots.map((s, i) => `<button type="button" class="slot${s ? ' full' : ''}" data-i="${i}">${s ? esc(s.ch) : ''}</button>`).join('');
        $('tiles').innerHTML = tiles.map(o => `<button type="button" class="tile" data-id="${o.id}"${slots.includes(o) ? ' disabled' : ''}>${esc(o.ch)}</button>`).join('');
        $('slots').querySelectorAll('.slot').forEach(b => b.onclick = () => { const i = +b.dataset.i; if (slots[i] && !slots[i].locked) { slots[i] = null; draw(); } });
        $('tiles').querySelectorAll('.tile').forEach(b => b.onclick = () => {
          const o = tiles.find(t => t.id === +b.dataset.id), i = slots.indexOf(null);
          if (i < 0) return; slots[i] = o; draw();
          if (!slots.includes(null)) {
            if (slots.map(s => s.ch).join('') === x.L.join('')) { $('slots').classList.add('win'); fx('good'); say(x.w); setTimeout(next, 900); }
            else { mistakes++; fx('try'); $('slots').classList.add('shake'); setTimeout(() => $('slots') && $('slots').classList.remove('shake'), 350); }
          }
        });
      };
      if (level === 'easy') { const o = tiles.find(t => t.ch === x.L[0]); o.locked = true; slots[0] = o; }
      draw();
      if ($('usHint')) $('usHint').onclick = () => {
        mistakes++;
        const k = slots.findIndex((s, i) => !s || s.ch !== x.L[i]);
        if (k < 0) return;
        for (let i = k; i < slots.length; i++) if (slots[i] && !slots[i].locked) slots[i] = null;
        const o = tiles.find(t => t.ch === x.L[k] && !slots.includes(t));
        o.locked = true; slots[k] = o; draw();
      };
      $('usSkip').onclick = () => {
        mistakes += 2;
        $('slots').innerHTML = x.L.map(ch => `<span class="slot full rev">${esc(ch)}</span>`).join('');
        say(x.w); setTimeout(next, 1400);
      };
    }
    function next() { n++; if (n >= pool.length) finish(game, pool, mistakes); else round(); }
    round();
  }

  // ---------- Routing ----------

  // ================= New games =================
  const onlyLetters = x => /^[\p{L}]+$/u.test(x.w);
  const speakable = () => 'speechSynthesis' in window;

  // ---------- Say it to win: say each word before the time runs out (the phone's speech recognition) ----------
  function sayit(game) {
    const Rec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Rec) { frame(game, `<section class="card"><p>${esc(t('n_noMic'))}</p><a class="btn" href="#">${esc(t('other'))}</a></section>`); return; }
    const pool = shuffle(words()).slice(0, L3(6, 8, 10)), secs = L3(10, 7, 5);
    let n = 0, mistakes = 0, rec = null, timer = null, left = 0, got = false;
    frame(game, `<section class="card sy"><div class="sy-bar"><i id="syBar"></i></div>
      <p class="sy-n" id="syN"></p><div class="sy-word" id="syWord"></div><p class="sy-clue" id="syClue" dir="auto"></p>
      <button type="button" class="sy-mic" id="syMic">🎙️</button><p class="sy-msg" id="syMsg">${esc(t('n_tapSay'))}</p>
      <div class="row"><button type="button" class="btn" id="syHear">🔊 ${esc(t('listen'))}</button><button type="button" class="btn" id="sySkip">${esc(t('n_skip'))}</button></div></section>`);
    const norm = x => plain(String(x)).replace(/[^\p{L}\p{N} ]/gu, ' ').replace(/\s+/g, ' ').trim();
    const stopRec = () => { if (rec) { try { rec.abort(); } catch (e) {} rec = null; } $('syMic') && $('syMic').classList.remove('on'); };
    function round() {
      const x = pool[n]; got = false; left = secs * 10;
      $('syN').textContent = `${n + 1} / ${pool.length}`; $('syWord').textContent = x.w; $('syClue').textContent = x.clue; $('syMsg').textContent = t('n_tapSay'); $('syMsg').className = 'sy-msg';
      $('syWord').classList.remove('win', 'pop'); void $('syWord').offsetWidth; $('syWord').classList.add('pop');
      clearInterval(timer);
      timer = setInterval(() => { left--; const b = $('syBar'); if (!b) return clearInterval(timer); b.style.width = (100 * left / (secs * 10)) + '%'; b.classList.toggle('low', left < secs * 3); if (left <= 0) miss(); }, 100);
    }
    function miss() { clearInterval(timer); stopRec(); if (got) return; mistakes++; fx('try'); $('syMsg').textContent = '⏰ ' + t('n_timeUp'); $('syMsg').className = 'sy-msg bad'; say(pool[n].w); setTimeout(next, 1600); }
    function win() { got = true; clearInterval(timer); stopRec(); fx('good'); $('syWord').classList.add('win'); $('syMsg').textContent = '✓ ' + t('n_great'); $('syMsg').className = 'sy-msg good'; setTimeout(next, 900); }
    function next() { if ($('syWord') == null) return; n++; if (n >= pool.length) finish(game, pool, mistakes); else round(); }
    $('syMic').onclick = () => {
      if (rec || got || left <= 0) return;
      const target = norm(pool[n].w);
      const r = rec = new Rec(); r.lang = LANGS[lang].code; r.interimResults = true; r.maxAlternatives = 3;
      $('syMic').classList.add('on'); $('syMsg').textContent = t('n_listening');
      r.onresult = e => {
        const alts = []; for (const res of e.results) for (const a of res) alts.push(norm(a.transcript));
        if (alts.some(a => (' ' + a + ' ').includes(' ' + target + ' '))) win();
        else { const last = e.results[e.results.length - 1]; if (last.isFinal) $('syMsg').textContent = t('n_heard', { w: last[0].transcript }); }
      };
      r.onend = () => { if (rec === r) { rec = null; $('syMic') && $('syMic').classList.remove('on'); } };
      try { r.start(); } catch (e) { rec = null; }
    };
    $('syHear').onclick = () => say(pool[n].w);
    $('sySkip').onclick = () => { if (!got) { left = 0; miss(); } };
    round();
  }

  // ---------- Listen and pick: Harley says a word, tap the one you heard ----------
  function listen(game) {
    const all = words(), pool = shuffle(all).slice(0, L3(6, 8, 10)), nOpt = L3(3, 4, 4);
    let n = 0, mistakes = 0, wrongThis = false;
    frame(game, `<section class="card ls"><p class="sy-n" id="lsN"></p>
      <button type="button" class="ls-play" id="lsPlay" aria-label="${esc(t('listen'))}">🔊</button>
      <p class="sy-msg" id="lsMsg">${esc(speakable() ? t('n_whichWord') : t('n_noVoice'))}</p>
      <div class="ls-opts" id="lsOpts"></div></section>`);
    // distractors: words that look most alike (same first letter, similar length) on hard; random otherwise
    const like = (x, y) => (plain(x.w[0]) === plain(y.w[0]) ? 2 : 0) + (Math.abs(x.w.length - y.w.length) <= 1 ? 1 : 0);
    function round() {
      const x = pool[n]; wrongThis = false;
      const others = shuffle(all.filter(y => y.w !== x.w));
      if (level !== 'easy') others.sort((a, b) => like(b, x) - like(a, x));
      const opts = shuffle([x].concat(others.slice(0, nOpt - 1)));
      $('lsN').textContent = `${n + 1} / ${pool.length}`;
      $('lsOpts').innerHTML = opts.map(o => `<button type="button" class="ls-o" data-w="${esc(o.w)}"><b>${esc(o.w)}</b>${level === 'easy' ? `<small dir="auto">${esc(o.clue)}</small>` : ''}</button>`).join('');
      $('lsOpts').querySelectorAll('.ls-o').forEach(b => b.onclick = () => {
        if (b.dataset.w === x.w) { fx('pop'); b.classList.add('ok'); $('lsOpts').querySelectorAll('.ls-o').forEach(o => o.disabled = true); setTimeout(next, 700); }
        else { if (!wrongThis) mistakes++; wrongThis = true; fx('try'); b.classList.add('no'); b.disabled = true; say(x.w); }
      });
      setTimeout(() => say(x.w), 350);
    }
    function next() { if (!$('lsOpts')) return; n++; if (n >= pool.length) finish(game, pool, mistakes); else round(); }
    $('lsPlay').onclick = () => { const b = $('lsPlay'); b.classList.remove('pulse'); void b.offsetWidth; b.classList.add('pulse'); say(pool[n].w); };
    round();
  }

  // ---------- Harley's biscuits (hangman): guess the letters before Harley eats all his biscuits ----------
  function keyboardFor(extra) {
    const set = new Set();
    for (const tp of TOPICS) for (const [w] of W[lang][tp.id] || []) for (const ch of Array.from(w)) { const p = plain(ch); if (/\p{L}/u.test(p)) set.add(p); }
    for (const ch of extra) set.add(plain(ch));
    return [...set].sort((a, b) => a.localeCompare(b, LANGS[lang].code));
  }
  function hangman(game) {
    const pool = shuffle(words().filter(onlyLetters).filter(x => x.L.length >= 3)).slice(0, 3), lives = L3(8, 6, 5);
    let n = 0, mistakes = 0;
    frame(game, `<section class="card hm"><p class="sy-n" id="hmN"></p><div class="hm-dog"><div class="hm-face">${dressed()}</div><div class="hm-bis" id="hmBis"></div></div>
      <p class="sy-clue" id="hmClue" dir="auto"></p><div class="hm-word" id="hmWord" dir="ltr"></div><div class="kb" id="hmKb" dir="ltr"></div></section>`);
    function round() {
      const x = pool[n], target = x.L.map(plain), guessed = new Set(); let left = lives;
      if (level === 'easy') guessed.add(target[0]);
      $('hmN').textContent = `${n + 1} / ${pool.length}`; $('hmClue').textContent = x.clue;
      const kb = keyboardFor(target);
      const draw = () => {
        $('hmWord').innerHTML = x.L.map((ch, i) => `<span class="${guessed.has(target[i]) ? 'on' : ''}">${guessed.has(target[i]) ? esc(ch) : ''}</span>`).join('');
        $('hmBis').innerHTML = Array.from({ length: lives }, (_, i) => `<i class="${i < left ? '' : 'gone'}">🍪</i>`).join('');
      };
      $('hmKb').innerHTML = kb.map(k => `<button type="button" data-k="${esc(k)}"${guessed.has(k) ? ' disabled' : ''}>${esc(k)}</button>`).join('');
      $('hmKb').querySelectorAll('button').forEach(b => b.onclick = () => {
        const k = b.dataset.k; b.disabled = true; guessed.add(k);
        if (target.includes(k)) { b.classList.add('ok'); fx('pop'); }
        else { b.classList.add('no'); left--; mistakes++; fx('try'); const f = app.querySelector('.hm-face'); f.classList.remove('munch'); void f.offsetWidth; f.classList.add('munch'); }
        draw();
        const won = target.every(c => guessed.has(c));
        if (won || left <= 0) {
          $('hmKb').querySelectorAll('button').forEach(o => o.disabled = true);
          if (!won) { target.forEach(c => guessed.add(c)); draw(); $('hmWord').classList.add('lost'); } else { fx('good'); $('hmWord').classList.add('won'); }
          say(x.w); setTimeout(() => { $('hmWord') && $('hmWord').classList.remove('won', 'lost'); n++; if (n >= pool.length) finish(game, pool, Math.round(mistakes / 2)); else round(); }, won ? 1400 : 2200);
        }
      });
      draw();
    }
    round();
  }

  // ---------- Word of the day: guess the 5-letter word in 6 tries (same word for everyone today) ----------
  function wordday(game) {
    const all = [].concat(...TOPICS.map(x => wordsFor(x.id))).filter(onlyLetters);
    let cands = all.filter(x => x.L.length === 5); if (cands.length < 5) cands = all.filter(x => x.L.length >= 4 && x.L.length <= 6);
    const pr = seeded('wordday|' + dayKey() + '|' + lang);
    const x = cands[Math.floor(pr() * cands.length)], target = x.L.map(plain), len = target.length, tries = 6;
    const key = 'hs_wordday', st = store.get(key, {}), id = dayKey() + '|' + lang;
    const rec = st[id] || { g: [] }; st[id] = rec;
    let cur = [];
    frame(game, `<section class="card wd"><p class="sy-clue" dir="auto">💡 ${esc(x.clue)}</p><div class="wd-grid" id="wdGrid" dir="ltr" style="--n:${len}"></div>
      <p class="sy-msg" id="wdMsg"></p><div class="kb wd-kb" id="wdKb" dir="ltr"></div><div id="wdEnd"></div></section>`);
    const score = g => { // 2 = right place, 1 = in the word, 0 = not in it (repeated letters counted properly)
      const res = Array(len).fill(0), rest = {};
      target.forEach((c, i) => { if (g[i] === c) res[i] = 2; else rest[c] = (rest[c] || 0) + 1; });
      g.forEach((c, i) => { if (res[i] !== 2 && rest[c]) { res[i] = 1; rest[c]--; } });
      return res;
    };
    const kb = keyboardFor(target);
    const done = () => rec.g.length && (rec.g[rec.g.length - 1].join('') === target.join('') || rec.g.length >= tries);
    function draw(flipRow) {
      const rows = [];
      for (let r = 0; r < tries; r++) {
        const g = rec.g[r], sc = g ? score(g) : null, live = !g && r === rec.g.length && !done();
        rows.push(`<div class="wd-row${live && cur.length === len ? ' full' : ''}">${Array.from({ length: len }, (_, i) => {
          const ch = g ? g[i] : live ? (cur[i] || '') : '';
          return `<span class="${sc ? 's' + sc[i] : ch ? 'f' : ''}${r === flipRow ? ' flip' : ''}" style="--i:${i}">${esc(ch)}</span>`;
        }).join('')}</div>`);
      }
      $('wdGrid').innerHTML = rows.join('');
      const best = {}; rec.g.forEach(g => score(g).forEach((v, i) => { best[g[i]] = Math.max(best[g[i]] ?? -1, v); }));
      $('wdKb').innerHTML = kb.map(k => `<button type="button" data-k="${esc(k)}" class="${best[k] === 2 ? 's2' : best[k] === 1 ? 's1' : best[k] === 0 ? 's0' : ''}">${esc(k)}</button>`).join('') +
        `<button type="button" data-k="DEL" class="wide">⌫</button><button type="button" data-k="ENTER" class="wide enter">✓</button>`;
      $('wdKb').querySelectorAll('button').forEach(b => b.onclick = () => press(b.dataset.k));
      if (done()) end();
    }
    function press(k) {
      if (done()) return;
      if (k === 'DEL') { cur.pop(); fx('tick'); }
      else if (k === 'ENTER') {
        if (cur.length < len) { $('wdMsg').textContent = t('n_letters', { n: len }); const row = app.querySelectorAll('.wd-row')[rec.g.length]; row && row.classList.add('shake'); setTimeout(() => row && row.classList.remove('shake'), 350); return; }
        rec.g.push(cur); cur = []; store.set(key, st); $('wdMsg').textContent = '';
        const ok = rec.g[rec.g.length - 1].join('') === target.join('');
        fx(ok ? 'good' : 'pop'); draw(rec.g.length - 1);
        return;
      } else if (cur.length < len) { cur.push(k); fx('tick'); }
      draw();
    }
    let ended = false;
    function end() {
      if (ended) return; ended = true;
      const won = rec.g[rec.g.length - 1].join('') === target.join('');
      const grid = rec.g.map(g => score(g).map(v => v === 2 ? '🟩' : v === 1 ? '🟨' : '⬜').join('')).join('\n');
      const shareTxt = `${t('g_wordday')} 📅 ${dayKey()} ${won ? rec.g.length : 'X'}/${tries}\n${grid}\nhttps://harlolearn.com/games/`;
      $('wdKb').innerHTML = '';
      $('wdEnd').innerHTML = `<div class="wd-end ${won ? 'won' : ''}"><b>${won ? '🎉 ' + esc(t('n_great')) : esc(t('n_wordWas'))}</b>
        <button type="button" class="w big" data-say="${esc(x.w)}">🔊 ${esc(x.w)}</button><span dir="auto">${esc(x.clue)}</span>
        <p>${esc(t('n_tomorrow'))}</p><div class="row"><button type="button" class="btn primary" id="wdShare">📤 ${esc(t('dShare'))}</button><a class="btn" href="#">${esc(t('other'))}</a></div></div>`;
      bindSay($('wdEnd'));
      $('wdShare').onclick = async () => { try { if (navigator.share) { await navigator.share({ text: shareTxt }); return; } } catch (e) { return; } try { await navigator.clipboard.writeText(shareTxt); $('wdShare').textContent = '✓ ' + t('dCopied'); } catch (e) {} };
      if (!rec.counted) {
        rec.counted = true; store.set(key, st);
        prog.done.wordday = (prog.done.wordday || 0) + 1; store.set('hs_games', prog); track('game_done'); clearInterval(tick);
        if (won) { fx('win'); if (window.HSFX) { HSFX.confetti(); HSFX.xp(10 + (tries - rec.g.length) * 5); } } else if (window.HSFX) HSFX.xp(5);
      }
    }
    document.onkeydown = e => {
      if (!$('wdGrid')) { document.onkeydown = null; return; }
      if (e.key === 'Enter') press('ENTER'); else if (e.key === 'Backspace') press('DEL');
      else if (e.key.length === 1 && kb.includes(plain(e.key))) press(plain(e.key));
    };
    draw();
  }

  // ---------- Fill the gap: phrases from Harlo with one word missing ----------
  let phrasesP = null;
  const loadPhrases = () => phrasesP || (phrasesP = new Promise((res, rej) => { if (window.SIR_DATA) return res(); const sc = document.createElement('script'); sc.src = '/phrases.js'; sc.onload = res; sc.onerror = () => { phrasesP = null; rej(); }; document.head.appendChild(sc); }));
  function fill(game) {
    frame(game, `<section class="card"><p class="sy-msg">…</p></section>`);
    loadPhrases().then(() => fillPlay(game)).catch(() => { $('game').innerHTML = `<section class="card"><p>${esc(t('n_err'))}</p></section>`; });
  }
  function fillPlay(game) {
    const D = window.SIR_DATA && (window.SIR_DATA[lang] || window.SIR_DATA[lang === 'esmx' ? 'es' : lang === 'enus' ? 'en' : lang]);
    if (!D) { $('game').innerHTML = `<section class="card"><p>${esc(t('n_err'))}</p></section>`; return; }
    const tok = p => p.split(/(\s+)/);
    const isWord = w => /^[\p{L}'’-]{2,}$/u.test(w.replace(/[.,!?¿¡;:"«»]/g, ''));
    const all = [].concat(...Object.values(D.sets)).filter(p => tok(p[0]).filter(w => w.trim()).length >= 3);
    const vocab = [...new Set([].concat(...all.map(p => p[0].split(/\s+/).map(w => w.replace(/[.,!?¿¡;:"«»]/g, '')).filter(isWord))))];
    const pool = shuffle(all).slice(0, L3(6, 8, 10)), nOpt = L3(3, 4, 4);
    let n = 0, mistakes = 0, wrongThis = false;
    $('game').innerHTML = `<section class="card fl"><p class="sy-n" id="flN"></p><p class="fl-p" id="flP" dir="auto"></p><p class="sy-clue" id="flM" dir="auto"></p><div class="ls-opts" id="flO"></div></section>`;
    function round() {
      const [ph, mean] = pool[n]; wrongThis = false;
      const parts = tok(ph), idxs = parts.map((w, i) => i).filter(i => isWord(parts[i]));
      // the gap: a longer word on medium/hard, any word on easy
      idxs.sort((a, b) => parts[b].length - parts[a].length);
      const gi = level === 'easy' ? idxs[Math.floor(R() * idxs.length)] : idxs[Math.floor(R() * Math.min(2, idxs.length))];
      const raw = parts[gi], m = raw.match(/^([¿¡"«]*)(.*?)([.,!?;:"»]*)$/u), ans = m[2];
      const lower = w => w.toLocaleLowerCase();
      const others = shuffle(vocab.filter(v => lower(v) !== lower(ans)));
      if (level === 'hard') others.sort((a, b) => Math.abs(a.length - ans.length) - Math.abs(b.length - ans.length));
      const opts = shuffle([ans].concat(others.slice(0, nOpt - 1)));
      $('flN').textContent = `${n + 1} / ${pool.length}`;
      $('flP').innerHTML = parts.map((w, i) => i === gi ? `${esc(m[1])}<span class="gap" id="flGap">____</span>${esc(m[3])}` : esc(w)).join('');
      $('flM').textContent = mean ? '💡 ' + mean : '';
      $('flO').innerHTML = opts.map(o => `<button type="button" class="ls-o" data-w="${esc(o)}"><b>${esc(o)}</b></button>`).join('');
      $('flO').querySelectorAll('.ls-o').forEach(b => b.onclick = () => {
        if (b.dataset.w === ans) { fx('pop'); b.classList.add('ok'); $('flGap').textContent = ans; $('flGap').classList.add('ok'); $('flO').querySelectorAll('.ls-o').forEach(o => o.disabled = true); say(ph); setTimeout(next, 1300); }
        else { if (!wrongThis) mistakes++; wrongThis = true; fx('try'); b.classList.add('no'); b.disabled = true; }
      });
    }
    function next() { if (!$('flO')) return; n++; if (n >= pool.length) finish(game, pool.map(p => ({ w: p[0], clue: p[1] })), mistakes); else round(); }
    round();
  }

  const RUN = { wordsearch, crossword, match, unscramble, sayit, listen, hangman, wordday, fill };
  function route(again) {
    let [id, go] = location.hash.slice(1).split('/');
    if ('speechSynthesis' in window) speechSynthesis.cancel();
    document.onkeydown = null;
    daily = id === 'daily'; R = Math.random;
    pick = store.get('hs_games_topic', 'animals'); if (!okPick(pick)) pick = 'animals';
    topic = pick === 'random' ? rnd(TOPICS).id : pick;
    level = store.get('hs_games_level', 'medium'); if (!LEVELS.includes(level)) level = 'medium';
    if (daily) { const plan = dailyPlan(); id = plan.game; topic = plan.topic; level = 'medium'; R = seeded('daily|' + dayKey() + '|' + lang); }
    const game = GAMES.find(g => g.id === id);
    if (!game) { hub(); window.scrollTo(0, 0); return; }
    if (!daily && go !== 'go' && !game.noSetup) { setup(game); window.scrollTo(0, 0); return; }
    if (!again) window.scrollTo(0, 0);
    track(daily ? 'daily_start' : 'game_start');
    RUN[id](game);
    startTimer();
  }
  window.addEventListener('hashchange', () => route());
  applyStatic();
  route();
  try { if (!sessionStorage.getItem('hs_games_seen')) { sessionStorage.setItem('hs_games_seen', '1'); track('games'); } } catch (e) {}
})();
