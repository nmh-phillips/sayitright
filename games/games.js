// Harley's Games: word search, crossword, match pairs and unscramble.
// Plain JS, no build step. Uses games/words.js. Shares the learning language
// (localStorage 'sir_lang') with the Harley Says pronunciation app.
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
  const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const rnd = a => a[Math.floor(Math.random() * a.length)];

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
  let topic = store.get('hs_games_topic', 'animals');
  if (!TOPICS.some(t => t.id === topic)) topic = 'animals';
  const prog = store.get('hs_games', { done: {} });
  const LEVELS = ['easy', 'medium', 'hard'];
  let level = store.get('hs_games_level', 'medium');
  if (!LEVELS.includes(level)) level = 'medium';
  const L3 = (e, m, h) => (level === 'easy' ? e : level === 'hard' ? h : m);
  // Interface language: shared with Harley Says ('sir_ui').
  let ui = (() => { const v = store.get('sir_ui', null); if (UI[v]) return v; const b = ((navigator.languages && navigator.languages[0]) || navigator.language || 'en').toLowerCase().split('-')[0]; return UI[b] ? b : 'en'; })();
  function t(k, vars) { let v = (UI[ui] && UI[ui][k] !== undefined) ? UI[ui][k] : UI.en[k]; if (vars) for (const [a, b] of Object.entries(vars)) v = v.split('{' + a + '}').join(b); return v; }
  const learnName = () => window.HG_LEARN_NAMES[lang] || LANGS[lang].name;
  function applyStatic() {
    document.documentElement.lang = ui;
    document.documentElement.dir = window.HG_RTL[ui] ? 'rtl' : 'ltr';
    document.querySelectorAll('[data-t]').forEach(el => { el.textContent = t(el.dataset.t); });
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
  function words() {
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

  const GAMES = [{ id: 'wordsearch', ic: '🔎' }, { id: 'crossword', ic: '✏️' }, { id: 'match', ic: '🧩' }, { id: 'unscramble', ic: '🔤' }];
  GAMES.forEach(g => { Object.defineProperty(g, 'name', { get: () => t('g_' + g.id) }); Object.defineProperty(g, 'desc', { get: () => t('d_' + g.id) }); });

  // ---------- Harley ----------
  const HARLEY = '<svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><rect x="10" y="10" width="280" height="280" rx="64" fill="#FF8A3D"/><path d="M92 228 l-26 40 l52 -24 z" fill="#fff"/><circle cx="212" cy="148" r="33" fill="#fff"/><circle cx="200" cy="184" r="33" fill="#fff"/><circle cx="169" cy="207" r="33" fill="#fff"/><circle cx="131" cy="207" r="33" fill="#fff"/><circle cx="100" cy="184" r="33" fill="#fff"/><circle cx="88" cy="148" r="33" fill="#fff"/><circle cx="100" cy="112" r="33" fill="#fff"/><circle cx="131" cy="89" r="33" fill="#fff"/><circle cx="169" cy="89" r="33" fill="#fff"/><circle cx="200" cy="112" r="33" fill="#fff"/><circle cx="150" cy="148" r="70" fill="#fff"/><circle cx="125" cy="138" r="9" fill="#1C2563"/><circle cx="175" cy="138" r="9" fill="#1C2563"/><circle cx="128" cy="135" r="3" fill="#fff"/><circle cx="178" cy="135" r="3" fill="#fff"/><ellipse cx="150" cy="163" rx="13" ry="9" fill="#1C2563"/><path d="M143 180 q7 16 14 0 z" fill="#F07C92"/><path d="M150 171 q-10 14 -22 4 M150 171 q10 14 22 4" fill="none" stroke="#1C2563" stroke-width="4" stroke-linecap="round"/></svg>';

  // ---------- Hub ----------
  function hub() {
    document.title = t('title');
    const langOpts = Object.keys(LANGS).map(k => `<option value="${k}"${k === lang ? ' selected' : ''}>${esc(window.HG_LEARN_NAMES[k])}</option>`).join('');
    const uiOpts = window.HG_UI_LANGS.map(([k, n]) => `<option value="${k}"${k === ui ? ' selected' : ''}>${esc(n)}</option>`).join('');
    app.innerHTML = `
      <section class="hero">
        <div class="hero-dog">${HARLEY}</div>
        <div><h2>${esc(t('heroH'))}</h2>
        <p>${esc(t('heroP'))}</p></div>
      </section>
      <div class="bar"><label>${esc(t('iSpeak'))} <select id="hgUi">${uiOpts}</select></label><label>${esc(t('learning'))} <select id="hgLang">${langOpts}</select></label></div>
      <nav class="chips">${TOPICS.map(x => `<button type="button" data-topic="${x.id}" class="${x.id === topic ? 'on' : ''}"><span>${x.ic}</span> ${esc(t('t_' + x.id))}</button>`).join('')}</nav>
      <div class="lvl" role="group" aria-label="${esc(t('level'))}"><span>${esc(t('level'))}</span>${LEVELS.map(l => `<button type="button" data-level="${l}" class="${l === level ? 'on' : ''}">${esc(t(l))}</button>`).join('')}</div>
      <div class="cards">${GAMES.map(g => {
        const n = prog.done[g.id] || 0;
        return `<a class="game" href="#${g.id}"><span class="ic">${g.ic}</span><b>${esc(g.name)}</b><span class="d">${esc(g.desc)}</span>${n ? `<span class="n">${esc(t('played', { n }))}</span>` : ''}</a>`;
      }).join('')}</div>
      ${crossPromo(t('promoH'), t('promoP'))}
      <section class="card about"><h3>${esc(t('aboutH'))}</h3>
        <p>${esc(t('about1'))}</p>
        <p>${esc(t('about2'))}</p></section>`;
    $('hgLang').onchange = e => { lang = e.target.value; store.set('sir_lang', lang); };
    app.querySelectorAll('[data-level]').forEach(b => b.onclick = () => {
      level = b.dataset.level; store.set('hs_games_level', level);
      app.querySelectorAll('[data-level]').forEach(x => x.classList.toggle('on', x === b));
    });
    $('hgUi').onchange = e => { ui = e.target.value; store.set('sir_ui', ui); applyStatic(); hub(); };
    app.querySelectorAll('[data-topic]').forEach(b => b.onclick = () => {
      topic = b.dataset.topic; store.set('hs_games_topic', topic);
      app.querySelectorAll('[data-topic]').forEach(x => x.classList.toggle('on', x === b));
    });
  }

  function crossPromo(h, p) {
    return `<a class="promo" href="/?from=games"><span class="pic">🎙️</span><span><b>${esc(h)}</b><span>${esc(p)}</span></span><span class="go">${esc(t('promoGo'))}</span></a>`;
  }

  function frame(game, inner) {
    document.title = `${game.name} · ${topicName()} · Harley's Games`;
    app.innerHTML = `
      <div class="ghead"><a href="#" class="back" aria-label="${esc(t('back'))}">${window.HG_RTL[ui] ? '→' : '←'}</a>
        <div><h2>${game.ic} ${esc(game.name)}</h2><p class="sub">${esc(learnName())} · ${esc(topicName())} · ${esc(t(level))}</p></div></div>
      <p class="help">${esc(t('h_' + game.id))}</p>
      <div id="game">${inner}</div>`;
  }

  // ---------- Finish screen ----------
  function finish(game, list, mistakes, extra) {
    const stars = mistakes === 0 ? 3 : mistakes <= 2 ? 2 : 1;
    prog.done[game.id] = (prog.done[game.id] || 0) + 1; store.set('hs_games', prog);
    track('game_done');
    const msg = t('done' + stars);
    $('game').innerHTML = `
      <section class="card done">
        <div class="done-dog">${HARLEY}</div>
        <h3>${msg}</h3>
        <div class="stars" aria-label="${stars} out of 3 stars">${'★'.repeat(stars)}<span>${'★'.repeat(3 - stars)}</span></div>
        ${extra ? `<p class="sub">${extra}</p>` : ''}
        <div class="review">${list.map(x => `<button type="button" class="rw" data-say="${esc(x.w)}"><b>${esc(x.w)}</b><span dir="auto">${esc(x.tr || x.clue)}</span><i>🔊</i></button>`).join('')}</div>
        <div class="row"><button type="button" class="btn primary" id="again">${esc(t('again'))}</button><a class="btn" href="#">${esc(t('other'))}</a></div>
      </section>
      ${crossPromo(t('promo2H'), t('promo2P'))}`;
    bindSay($('game'));
    $('again').onclick = () => route(true);
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
        const r0 = Math.floor(Math.random() * size), c0 = Math.floor(Math.random() * size);
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
      placed[i].found = true; colour = (colour % 6) + 1;
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
      if (!check(path) && path && path.length > 1) { mistakes++; ws.classList.add('shake'); setTimeout(() => ws.classList.remove('shake'), 350); }
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
      } else $('cwMsg').textContent = wrong ? t(strict ? 'wrongHard' : 'toFix', { n: wrong }) : t('toGo', { n: total - right });
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
        done++;
        if (done === pool.length) { const s = Math.round((Date.now() - t0) / 1000); setTimeout(() => finish(game, pool, mistakes, t('time', { s, m: mistakes })), 500); }
      } else {
        mistakes++;
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
            if (slots.map(s => s.ch).join('') === x.L.join('')) { $('slots').classList.add('win'); say(x.w); setTimeout(next, 900); }
            else { mistakes++; $('slots').classList.add('shake'); setTimeout(() => $('slots') && $('slots').classList.remove('shake'), 350); }
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
  const RUN = { wordsearch, crossword, match, unscramble };
  function route(again) {
    const id = location.hash.slice(1), game = GAMES.find(g => g.id === id);
    if ('speechSynthesis' in window) speechSynthesis.cancel();
    if (!game) { hub(); window.scrollTo(0, 0); return; }
    if (!again) window.scrollTo(0, 0);
    track('game_start');
    RUN[id](game);
  }
  window.addEventListener('hashchange', () => route());
  applyStatic();
  route();
  try { if (!sessionStorage.getItem('hs_games_seen')) { sessionStorage.setItem('hs_games_seen', '1'); track('games'); } } catch (e) {}
})();
