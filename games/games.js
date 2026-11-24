// Harley's Games: word search, crossword, match pairs and unscramble.
// Plain JS, no build step. Uses games/words.js. Shares the learning language
// (localStorage 'sir_lang') with the Harley Says pronunciation app.
(function () {
  'use strict';
  const W = window.HG_WORDS, LANGS = window.HG_LANGS, TOPICS = window.HG_TOPICS;
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

  function track(e) {
    try {
      if (location.protocol === 'file:') return;
      fetch('/.netlify/functions/track', { method: 'POST', keepalive: true, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ e, l: lang, u: 'games' }) }).catch(() => {});
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

  const words = () => W[lang][topic].map(([w, c]) => ({ w: w.normalize('NFC'), clue: c, L: letters(w) }));
  const topicName = () => (TOPICS.find(t => t.id === topic) || TOPICS[0]).name;

  const GAMES = [
    { id: 'wordsearch', name: 'Word search', ic: '🔎', desc: 'Find the hidden words in the grid.' },
    { id: 'crossword', name: 'Crossword', ic: '✏️', desc: 'Fill the grid from the clues.' },
    { id: 'match', name: 'Match pairs', ic: '🧩', desc: 'Pair each word with its meaning.' },
    { id: 'unscramble', name: 'Unscramble', ic: '🔤', desc: 'Put the letters in the right order.' }
  ];

  // ---------- Harley ----------
  const HARLEY = '<svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><rect x="10" y="10" width="280" height="280" rx="64" fill="#FF8A3D"/><path d="M92 228 l-26 40 l52 -24 z" fill="#fff"/><circle cx="212" cy="148" r="33" fill="#fff"/><circle cx="200" cy="184" r="33" fill="#fff"/><circle cx="169" cy="207" r="33" fill="#fff"/><circle cx="131" cy="207" r="33" fill="#fff"/><circle cx="100" cy="184" r="33" fill="#fff"/><circle cx="88" cy="148" r="33" fill="#fff"/><circle cx="100" cy="112" r="33" fill="#fff"/><circle cx="131" cy="89" r="33" fill="#fff"/><circle cx="169" cy="89" r="33" fill="#fff"/><circle cx="200" cy="112" r="33" fill="#fff"/><circle cx="150" cy="148" r="70" fill="#fff"/><circle cx="125" cy="138" r="9" fill="#1C2563"/><circle cx="175" cy="138" r="9" fill="#1C2563"/><circle cx="128" cy="135" r="3" fill="#fff"/><circle cx="178" cy="135" r="3" fill="#fff"/><ellipse cx="150" cy="163" rx="13" ry="9" fill="#1C2563"/><path d="M143 180 q7 16 14 0 z" fill="#F07C92"/><path d="M150 171 q-10 14 -22 4 M150 171 q10 14 22 4" fill="none" stroke="#1C2563" stroke-width="4" stroke-linecap="round"/></svg>';

  // ---------- Hub ----------
  function hub() {
    document.title = "Harley's Games — fun ways to learn vocabulary and verbs";
    const langOpts = Object.entries(LANGS).map(([k, v]) => `<option value="${k}"${k === lang ? ' selected' : ''}>${esc(v.name)}</option>`).join('');
    app.innerHTML = `
      <section class="hero">
        <div class="hero-dog">${HARLEY}</div>
        <div><h2>Fun ways to learn vocabulary and verbs</h2>
        <p>Word searches, crosswords and quick puzzles in 7 languages. Free, no sign-up.</p></div>
      </section>
      <div class="bar"><label>I'm learning <select id="hgLang">${langOpts}</select></label></div>
      <nav class="chips" aria-label="Topics">${TOPICS.map(t => `<button type="button" data-topic="${t.id}" class="${t.id === topic ? 'on' : ''}"><span>${t.ic}</span> ${esc(t.name)}</button>`).join('')}</nav>
      <div class="cards">${GAMES.map(g => {
        const n = prog.done[g.id] || 0;
        return `<a class="game" href="#${g.id}"><span class="ic">${g.ic}</span><b>${g.name}</b><span class="d">${g.desc}</span>${n ? `<span class="n">✓ Played ${n}×</span>` : ''}</a>`;
      }).join('')}</div>
      ${crossPromo('Can you say them too?', 'Harley Says listens to you and scores your pronunciation, sound by sound.')}
      <section class="card about"><h3>How it works</h3>
        <p>Pick the language you're learning and a topic, then choose a game. Tap any word you've found to hear it said out loud.</p>
        <p>Verbs come as infinitives ("to eat") and in the past tense, so you practise the forms you'll actually use.</p></section>`;
    $('hgLang').onchange = e => { lang = e.target.value; store.set('sir_lang', lang); };
    app.querySelectorAll('[data-topic]').forEach(b => b.onclick = () => {
      topic = b.dataset.topic; store.set('hs_games_topic', topic);
      app.querySelectorAll('[data-topic]').forEach(x => x.classList.toggle('on', x === b));
    });
  }

  function crossPromo(h, p) {
    return `<a class="promo" href="/?from=games"><span class="pic">🎙️</span><span><b>${esc(h)}</b><span>${esc(p)}</span></span><span class="go">Try Harley Says →</span></a>`;
  }

  function frame(game, inner, help) {
    document.title = `${game.name} · ${topicName()} · Harley's Games`;
    app.innerHTML = `
      <div class="ghead"><a href="#" class="back" aria-label="All games">←</a>
        <div><h2>${game.ic} ${game.name}</h2><p class="sub">${esc(LANGS[lang].name)} · ${esc(topicName())}</p></div></div>
      ${help ? `<p class="help">${help}</p>` : ''}
      <div id="game">${inner}</div>`;
  }

  // ---------- Finish screen ----------
  function finish(game, list, mistakes, extra) {
    const stars = mistakes === 0 ? 3 : mistakes <= 2 ? 2 : 1;
    prog.done[game.id] = (prog.done[game.id] || 0) + 1; store.set('hs_games', prog);
    track('game_done');
    const msg = stars === 3 ? 'Woof woof! Perfect!' : stars === 2 ? 'Woof! Great job!' : 'Woof! You did it!';
    $('game').innerHTML = `
      <section class="card done">
        <div class="done-dog">${HARLEY}</div>
        <h3>${msg}</h3>
        <div class="stars" aria-label="${stars} out of 3 stars">${'★'.repeat(stars)}<span>${'★'.repeat(3 - stars)}</span></div>
        ${extra ? `<p class="sub">${extra}</p>` : ''}
        <div class="review">${list.map(x => `<button type="button" class="rw" data-say="${esc(x.w)}"><b>${esc(x.w)}</b><span>${esc(x.clue)}</span><i>🔊</i></button>`).join('')}</div>
        <div class="row"><button type="button" class="btn primary" id="again">Play again</button><a class="btn" href="#">Other games</a></div>
      </section>
      ${crossPromo('Now say them out loud', "Practise your pronunciation with Harley Says. He'll tell you how you sounded.")}`;
    bindSay($('game'));
    $('again').onclick = () => route(true);
  }
  function bindSay(root) { root.querySelectorAll('[data-say]').forEach(b => b.addEventListener('click', () => say(b.dataset.say))); }

  // ---------- Word search ----------
  function wordsearch(game) {
    const pool = shuffle(words().filter(x => x.L.length >= 3)).slice(0, 8);
    const size = Math.max(10, ...pool.map(x => x.L.length));
    const grid = Array.from({ length: size }, () => Array(size).fill(''));
    const DIRS = [[0, 1], [1, 0], [1, 1], [-1, 1]];
    const placed = [];
    for (const x of pool) {
      let ok = false;
      for (let t = 0; t < 300 && !ok; t++) {
        const [dr, dc] = rnd(DIRS), n = x.L.length;
        const r0 = Math.floor(Math.random() * size), c0 = Math.floor(Math.random() * size);
        const r1 = r0 + dr * (n - 1), c1 = c0 + dc * (n - 1);
        if (r1 < 0 || r1 >= size || c1 >= size) continue;
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
      <ul class="wl" id="wl">${placed.map((x, i) => `<li data-i="${i}"><b>${esc(x.w)}</b> <span>${esc(x.clue)}</span></li>`).join('')}</ul>`,
      'Drag across the letters (or tap the first and last letter) to find each word.');

    const ws = $('ws'), cells = [...ws.children], cell = (r, c) => cells[r * size + c];
    let start = null, pending = null, cur = [], mistakes = 0, colour = 0;
    const count = () => { $('wsCount').textContent = `${placed.filter(x => x.found).length} of ${placed.length} found`; };
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
      const li = $('wl').querySelector(`[data-i="${i}"]`); li.classList.add('got'); li.innerHTML += ' <button type="button" class="spk" aria-label="Listen">🔊</button>';
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
  function buildCrossword(list) {
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
        if (placed.length >= 8) break;
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
    const list = shuffle(words().filter(x => x.L.length >= 3 && x.L.length <= 11 && x.L.every(isLetter)));
    const cw = buildCrossword(list);
    if (!cw) { frame(game, '<p class="count">Couldn\'t build a crossword for this topic. Try another one.</p>'); return; }
    const { minR, minC, h, w } = cw;
    const words2 = cw.placed.map(p => ({ x: p.x, r: p.r - minR, c: p.c - minC, d: p.d }));
    // Numbering, top-left to bottom-right.
    const starts = [...new Set(words2.map(p => p.r * 100 + p.c))].sort((a, b) => a - b);
    words2.forEach(p => { p.num = starts.indexOf(p.r * 100 + p.c) + 1; p.cells = p.x.L.map((_, i) => [p.r + (p.d === 'd' ? i : 0), p.c + (p.d === 'a' ? i : 0)]); });
    const ans = {}, num = {};
    words2.forEach(p => { p.cells.forEach(([r, c], i) => { ans[r + ',' + c] = p.x.L[i]; }); num[p.r + ',' + p.c] = p.num; });
    const clues = d => words2.filter(p => p.d === d).sort((a, b) => a.num - b.num)
      .map(p => `<li data-w="${words2.indexOf(p)}"><b>${p.num}</b> ${esc(p.x.clue)} <span class="len">(${p.x.L.length})</span></li>`).join('');
    let html = `<div class="cw" id="cw" style="grid-template-columns:repeat(${w},1fr);max-width:${Math.min(w * 44, 560)}px">`;
    for (let r = 0; r < h; r++) for (let c = 0; c < w; c++) {
      const k = r + ',' + c;
      html += ans[k] ? `<div class="cc">${num[k] ? `<span class="no">${num[k]}</span>` : ''}<input data-k="${k}" maxlength="2" autocomplete="off" autocapitalize="characters" spellcheck="false" aria-label="Row ${r + 1}, column ${c + 1}"></div>` : '<div class="cc x"></div>';
    }
    html += `</div>
      <div class="row"><button type="button" class="btn primary" id="cwCheck">Check</button><button type="button" class="btn" id="cwReveal">Reveal</button></div>
      <p class="count" id="cwMsg"></p>
      <div class="clues"><div><h4>Across</h4><ol id="cwA">${clues('a')}</ol></div><div><h4>Down</h4><ol id="cwD">${clues('d')}</ol></div></div>`;
    frame(game, html, 'Tap a square or a clue, then type. Accents are optional: "e" counts for "é".');

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
          const nx = active.cells[i + 1];
          if (nx) inp(nx[0] + ',' + nx[1]).focus();
        }
      });
      el.addEventListener('keydown', e => {
        if (e.key === 'Backspace' && !el.value && active) {
          const i = active.cells.findIndex(([r, c]) => r + ',' + c === k), pv = active.cells[i - 1];
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
        if (plain(v) === plain(ans[k])) { el.value = ans[k]; el.parentNode.classList.add('ok'); right++; }
        else { el.parentNode.classList.add('bad'); wrong++; }
      }
      if (right === total) {
        setTimeout(() => finish(game, words2.map(p => p.x), Math.max(0, checks - 1)), 600);
      } else $('cwMsg').textContent = wrong ? `${wrong} letter${wrong > 1 ? 's' : ''} to fix (in red).` : `${total - right} squares to go.`;
    };
    $('cwReveal').onclick = () => {
      for (const k in ans) { const el = inp(k); el.value = ans[k]; el.parentNode.classList.remove('bad'); el.parentNode.classList.add('rev'); }
      $('cwMsg').textContent = 'Answers revealed. Tap a clue to hear the word.';
      app.querySelectorAll('.clues li').forEach(li => li.addEventListener('click', () => say(words2[+li.dataset.w].x.w)));
    };
  }

  // ---------- Match pairs ----------
  function match(game) {
    const pool = shuffle(words()).slice(0, 6);
    const left = shuffle(pool.map((x, i) => ({ i, t: x.w }))), right = shuffle(pool.map((x, i) => ({ i, t: x.clue })));
    frame(game, `
      <div class="mp"><div id="mpL">${left.map(o => `<button type="button" data-i="${o.i}" class="mw">${esc(o.t)}</button>`).join('')}</div>
      <div id="mpR">${right.map(o => `<button type="button" data-i="${o.i}" class="mm">${esc(o.t)}</button>`).join('')}</div></div>
      <p class="count" id="mpMsg"></p>`, 'Tap a word, then its meaning.');
    let selL = null, selR = null, done = 0, mistakes = 0;
    const t0 = Date.now();
    const tryPair = () => {
      if (!selL || !selR) return;
      const a = selL, b = selR; selL = selR = null;
      if (a.dataset.i === b.dataset.i) {
        [a, b].forEach(x => { x.classList.remove('sel'); x.classList.add('ok'); x.disabled = true; });
        done++;
        if (done === pool.length) { const s = Math.round((Date.now() - t0) / 1000); setTimeout(() => finish(game, pool, mistakes, `Time: ${s} seconds · ${mistakes} mistake${mistakes === 1 ? '' : 's'}`), 500); }
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
    const pool = shuffle(words().filter(x => x.L.length >= 3 && x.L.length <= 10)).slice(0, 8);
    let n = 0, mistakes = 0;
    frame(game, '<div id="us"></div>', 'Tap the letters in the right order. Tap a placed letter to take it back.');
    function round() {
      const x = pool[n];
      let tiles = x.L.map((ch, i) => ({ ch, id: i }));
      for (let t = 0; t < 10; t++) { tiles = shuffle(tiles); if (tiles.map(o => o.ch).join('') !== x.L.join('')) break; }
      const slots = Array(x.L.length).fill(null);
      $('us').innerHTML = `
        <p class="count">Word ${n + 1} of ${pool.length}</p>
        <div class="uclue">${esc(x.clue)}</div>
        <div class="slots" id="slots"></div>
        <div class="tiles" id="tiles"></div>
        <div class="row"><button type="button" class="btn" id="usHint">💡 Hint</button><button type="button" class="btn" id="usSkip">Skip</button></div>`;
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
      draw();
      $('usHint').onclick = () => {
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
  route();
  try { if (!sessionStorage.getItem('hs_games_seen')) { sessionStorage.setItem('hs_games_seen', '1'); track('games'); } } catch (e) {}
})();
