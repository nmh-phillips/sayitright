// Harlo: talking heads for Harley and Lilou (Harlo Chats and Interview Coach).
// HSTalk({ persona: () => 'harley'|'lilou', code: () => 'es-ES' }) makes a "stage": a big animated head plus a caption,
// and plays Harley's lines with the mouth moving in time with the words (timed from the text and the audio's progress),
// blinking, and different looks for listening (ears up, nodding) and thinking (head tilt).
// It also owns the audio: Harley's voice from the server (base64 from chat.mjs, or /.netlify/functions/tts), the phone's
// voice as a fallback, and short "mm-hm" acknowledgements so a pause feels like listening.
(function () {
'use strict';
const NS = 'http://www.w3.org/2000/svg';
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

// ---------- the drawing ----------
// Head fluff: a ring of puffs around a big circle (same family as the app icon), ears hanging at the sides.
function puffs(cx, cy, R, r, n, fill, extra) {
  let s = '';
  for (let i = 0; i < n; i++) { const a = (i / n) * Math.PI * 2; s += `<circle cx="${(cx + Math.cos(a) * R).toFixed(1)}" cy="${(cy + Math.sin(a) * R).toFixed(1)}" r="${r}" fill="${fill}"${extra || ''}/>`; }
  return s;
}
// Human interviewers (Interview Coach): illustrated, based on the founders' photo. Same class names as the dogs so the
// same animation drives them: .hd (whole head), .eye (blink), .brows, .open/.teeth/.tongue (mouth), .smile.
const HUMAN = { man: 1, woman: 1 };
function humanSvg(who) {
  const ink = '#1C2563';
  if (who === 'man') {
    const skin = '#F0C2A2', skin2 = '#DFA787', hair = '#6B472F', hairHi = '#93694A';
    return `<svg viewBox="0 0 300 300" xmlns="${NS}" aria-hidden="true">
  <defs><clipPath id="hsFaceM"><ellipse cx="150" cy="142" rx="60" ry="71"/></clipPath></defs>
  <path d="M34 300 C40 246 88 228 120 224 L180 224 C212 228 260 246 266 300 Z" fill="#283044"/>
  <path d="M128 192 L128 228 Q150 242 172 228 L172 192 Z" fill="${skin2}"/>
  <path d="M120 224 Q150 252 180 224" fill="none" stroke="#1B2131" stroke-width="5"/>
  <g class="hd">
    <ellipse class="ear l" cx="91" cy="150" rx="11" ry="17" fill="${skin}"/><ellipse class="ear r" cx="209" cy="150" rx="11" ry="17" fill="${skin}"/>
    <ellipse cx="150" cy="142" rx="60" ry="71" fill="${skin}"/>
    <g clip-path="url(#hsFaceM)">
      <path d="M86 150 C100 168 122 174 150 172 C178 174 200 168 214 150 L214 230 L86 230 Z" fill="#9C8474" opacity=".42"/>
      <path d="M112 196 C128 212 172 212 188 196 L190 230 L110 230 Z" fill="#B7A79C" opacity=".35"/>
    </g>
    <path d="M124 177 Q150 165 176 177 Q150 172 124 177 Z" fill="#7F6656" opacity=".75"/>
    <path d="M88 142 C82 92 104 62 150 58 C198 58 218 90 212 140 C208 116 200 102 190 96 C172 86 138 84 118 94 C102 102 94 118 88 142 Z" fill="${hair}"/>
    <path d="M102 100 C122 70 182 66 204 98 C184 82 150 80 128 90 C118 94 110 97 102 100 Z" fill="${hairHi}"/>
    <path d="M130 76 C150 68 176 70 192 80" stroke="#A97F5E" stroke-width="3" fill="none" stroke-linecap="round" opacity=".7"/>
    <g class="brows"><path d="M115 121 q13 -7 26 -1" stroke="#5A3C2A" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M159 120 q13 -6 26 1" stroke="#5A3C2A" stroke-width="5" fill="none" stroke-linecap="round"/></g>
    <g class="eye l"><ellipse cx="129" cy="140" rx="9.5" ry="6" fill="#fff"/><circle cx="130" cy="140" r="4.8" fill="#6C9BD2"/><circle cx="130" cy="140" r="2.2" fill="${ink}"/><circle cx="131.5" cy="138.5" r="1.2" fill="#fff"/></g>
    <g class="eye r"><ellipse cx="171" cy="140" rx="9.5" ry="6" fill="#fff"/><circle cx="170" cy="140" r="4.8" fill="#6C9BD2"/><circle cx="170" cy="140" r="2.2" fill="${ink}"/><circle cx="171.5" cy="138.5" r="1.2" fill="#fff"/></g>
    <path d="M112 145 q-5 4 -9 2 M188 145 q5 4 9 2" stroke="${skin2}" stroke-width="2.2" fill="none" stroke-linecap="round"/>
    <path d="M150 142 Q147 160 141 165 Q150 170 159 165" stroke="#C48A6C" stroke-width="3" fill="none" stroke-linecap="round"/>
    <circle cx="116" cy="166" r="9" fill="#F29C94" opacity=".28"/><circle cx="184" cy="166" r="9" fill="#F29C94" opacity=".28"/>
    <g class="mouth"><ellipse class="open" cx="150" cy="185" rx="13" ry="1" fill="#6B2B2B"/><ellipse class="teeth" cx="150" cy="182" rx="10" ry="0" fill="#fff"/><ellipse class="tongue" cx="150" cy="190" rx="8" ry="0" fill="#E0757F"/></g>
    <path class="smile" d="M132 182 Q150 195 168 182" fill="none" stroke="#8A4B3E" stroke-width="4" stroke-linecap="round"/>
  </g></svg>`;
  }
  const skin = '#ECBC9A', skin2 = '#D9A27E', hair = '#2E1A15', hairHi = '#4A2B22';
  const curls = [[74, 196, 24], [226, 196, 24], [70, 228, 20], [230, 228, 20], [84, 252, 16], [216, 252, 16], [84, 160, 22], [216, 160, 22]]
    .map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${hair}"/>`).join('');
  return `<svg viewBox="0 0 300 300" xmlns="${NS}" aria-hidden="true">
  <g class="hd">
    <path d="M84 150 C70 84 108 50 150 50 C192 50 230 84 216 150 C226 190 236 220 226 246 L74 246 C64 220 74 190 84 150 Z" fill="${hair}"/>${curls}
    <path d="M86 200 q8 14 0 28 M214 200 q-8 14 0 28" stroke="${hairHi}" stroke-width="3" fill="none"/>
  </g>
  <path d="M42 300 C48 252 92 232 122 228 L178 228 C208 232 252 252 258 300 Z" fill="#17171F"/>
  <path d="M131 188 L131 230 Q150 240 169 230 L169 188 Z" fill="${skin2}"/>
  <g class="hd">
    <ellipse cx="150" cy="140" rx="52" ry="64" fill="${skin}"/>
    <path d="M150 70 C118 70 96 96 96 142 C104 112 122 90 150 84 Z" fill="${hair}"/><path d="M150 70 C182 70 204 96 204 142 C196 112 178 90 150 84 Z" fill="${hair}"/>
    <path d="M101 116 C86 150 86 190 100 222 C106 196 104 166 112 136 Z" fill="${hair}"/><path d="M199 116 C214 150 214 190 200 222 C194 196 196 166 188 136 Z" fill="${hair}"/>
    <path d="M128 78 Q140 72 150 72" stroke="${hairHi}" stroke-width="3" fill="none" stroke-linecap="round"/>
    <circle cx="103" cy="170" r="5" fill="none" stroke="#C9CCD6" stroke-width="2.5"/><circle cx="197" cy="170" r="5" fill="none" stroke="#C9CCD6" stroke-width="2.5"/>
    <g class="brows"><path d="M118 119 q12 -7 24 -2" stroke="${hair}" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M158 117 q12 -5 24 2" stroke="${hair}" stroke-width="4" fill="none" stroke-linecap="round"/></g>
    <g class="eye l"><ellipse cx="130" cy="137" rx="9" ry="6.2" fill="#fff"/><circle cx="131" cy="137" r="4.8" fill="#5B3A26"/><circle cx="131" cy="137" r="2.2" fill="#1a0f0b"/><circle cx="132.5" cy="135.5" r="1.2" fill="#fff"/><path d="M121 132 l-4 -3 M124 130 l-2 -4" stroke="${hair}" stroke-width="2" stroke-linecap="round"/></g>
    <g class="eye r"><ellipse cx="170" cy="137" rx="9" ry="6.2" fill="#fff"/><circle cx="169" cy="137" r="4.8" fill="#5B3A26"/><circle cx="169" cy="137" r="2.2" fill="#1a0f0b"/><circle cx="170.5" cy="135.5" r="1.2" fill="#fff"/><path d="M179 132 l4 -3 M176 130 l2 -4" stroke="${hair}" stroke-width="2" stroke-linecap="round"/></g>
    <path d="M150 140 Q148 155 143 160 Q150 164 157 160" stroke="#C28562" stroke-width="2.6" fill="none" stroke-linecap="round"/>
    <circle cx="121" cy="161" r="10" fill="#F28CA0" opacity=".32"/><circle cx="179" cy="161" r="10" fill="#F28CA0" opacity=".32"/>
    <g class="mouth"><ellipse class="open" cx="150" cy="180" rx="13" ry="1" fill="#6B2B3B" stroke="#E0478F" stroke-width="3.5"/><ellipse class="teeth" cx="150" cy="177" rx="10" ry="0" fill="#fff"/><ellipse class="tongue" cx="150" cy="185" rx="8" ry="0" fill="#E0757F"/></g>
    <g class="smile"><path d="M128 174 Q150 200 172 174 Q150 180 128 174 Z" fill="#E0478F"/><path d="M133 176.5 Q150 190 167 176.5 Q150 180 133 176.5 Z" fill="#fff"/></g>
  </g></svg>`;
}
const MOUTH_Y = { man: 185, woman: 180 };

function svg(persona) {
  if (HUMAN[persona]) return humanSvg(persona);
  const my = window.HSDog && window.HSDog.active() ? window.HSDog.talkParts(window.HSDog.cfg()) : null; // your own dog (dog.js)
  const lilou = persona === 'lilou' && !my;
  const fur = my ? my.fur : lilou ? '#FFF8F0' : '#FFFFFF', shade = my ? my.shade : lilou ? '#F1E2D3' : '#E4E7F5', ink = '#1C2563';
  const ear = side => {
    const x = side < 0 ? 56 : 244;
    return `<g class="ear ${side < 0 ? 'l' : 'r'}">${puffs(x, 188, 22, 22, 7, shade)}${puffs(x, 186, 16, 20, 7, fur)}<circle cx="${x}" cy="186" r="24" fill="${fur}"/></g>`;
  };
  const lashes = lilou ? `<path d="M112 128 l-7 -6 M116 125 l-4 -8 M188 128 l7 -6 M184 125 l4 -8" stroke="${ink}" stroke-width="3" stroke-linecap="round"/>` : '';
  const bow = lilou ? `<g class="bow" transform="translate(205 82) rotate(-14)"><path d="M0 0 L-30 -18 Q-36 0 -30 18 Z" fill="#FF8CC2"/><path d="M0 0 L30 -18 Q36 0 30 18 Z" fill="#FF8CC2"/><circle r="9" fill="#FF4F9A"/></g>` : '';
  return `<svg viewBox="0 0 300 300" xmlns="${NS}" aria-hidden="true">
  <g class="hd">
    ${my ? `<g class="ear l">${my.earL}</g><g class="ear r">${my.earR}</g>` : ear(-1) + ear(1)}
    <g class="fluff">${my ? my.coat + my.patch : `${puffs(150, 150, 66, 34, 12, shade)}${puffs(150, 146, 62, 33, 12, fur)}<circle cx="150" cy="150" r="74" fill="${fur}"/>`}</g>
    <circle cx="112" cy="176" r="12" fill="#FF9DB5" opacity="${lilou ? .55 : .35}"/><circle cx="188" cy="176" r="12" fill="#FF9DB5" opacity="${lilou ? .55 : .35}"/>
    <g class="brows"><path d="M112 118 q12 -8 24 0" stroke="${shade}" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M164 118 q12 -8 24 0" stroke="${shade}" stroke-width="6" fill="none" stroke-linecap="round"/></g>
    <g class="eye l"><circle cx="124" cy="140" r="11" fill="${ink}"/><circle cx="127.5" cy="136.5" r="3.8" fill="#fff"/></g>
    <g class="eye r"><circle cx="176" cy="140" r="11" fill="${ink}"/><circle cx="179.5" cy="136.5" r="3.8" fill="#fff"/></g>
    ${lashes}
    <ellipse cx="150" cy="163" rx="${lilou ? 11 : 13}" ry="${lilou ? 8 : 9}" fill="${ink}"/><ellipse cx="146" cy="160" rx="3.5" ry="2" fill="#fff" opacity=".6"/>
    <g class="mouth">
      <ellipse class="open" cx="150" cy="188" rx="14" ry="1" fill="#5A2140"/>
      <ellipse class="tongue" cx="150" cy="192" rx="9" ry="0" fill="#F07C92"/>
    </g>
    <path class="smile" d="M150 172 q-10 13 -21 4 M150 172 q10 13 21 4" fill="none" stroke="${ink}" stroke-width="4" stroke-linecap="round"/>
    ${bow}
    ${window.HSDress ? window.HSDress.layer(my ? 'mydog' : persona) : ''}
  </g></svg>`;
}

// ---------- timing: when the mouth is open, from the words ----------
const VOWELS = /[aeiouyáéíóúàèìòùâêîôûäëïöüãõœæåøą̨ęıāēīōū]+/gi;
function timeline(text) {
  const words = String(text).split(/\s+/).filter(Boolean);
  const segs = [], wordAt = []; let u = 0;
  words.forEach((w, wi) => {
    const v = w.match(VOWELS) || ['a'];
    wordAt.push(u);
    v.forEach(g => {
      const c = g[0].toLowerCase();
      const amp = /[aáàâäãoóòôöõ]/.test(c) ? 1 : /[eéèêëuúùûü]/.test(c) ? .75 : .55;
      segs.push({ s: u, e: u + 1, amp }); u += 1;
    });
    u += /[.!?…]$/.test(w) ? 2.2 : /[,;:]$/.test(w) ? 1.2 : 0.35;
  });
  return { segs, wordAt, total: Math.max(u, 1), words };
}

// ---------- the stage ----------
window.HSTalk = function (opts) {
  const persona = opts.persona, code = opts.code;
  const el = document.createElement('div'); el.className = 'hs-stage';
  el.innerHTML = `<div class="hs-head"></div><div class="hs-cap" aria-live="polite"></div>`;
  const headBox = el.querySelector('.hs-head'), cap = el.querySelector('.hs-cap');
  let drawnFor = null, parts = null;
  window.addEventListener('hs-dress', () => { drawnFor = null; // and a new or changed own dog
    try { build(); } catch (e) {} }); // new outfit from the shop
  function build() {
    const p = persona();
    if (drawnFor === p) return;
    drawnFor = p; headBox.innerHTML = svg(p);
    const q = s => headBox.querySelector(s);
    parts = { human: !!HUMAN[p], my: MOUTH_Y[p] || 184, hds: headBox.querySelectorAll('.hd'), teeth: q('.teeth'), hd: q('.hd'), open: q('.open'), tongue: q('.tongue'), eyes: headBox.querySelectorAll('.eye'), earL: q('.ear.l'), earR: q('.ear.r'), brows: q('.brows'), smile: q('.smile') };
  }
  build();

  // animation state
  let mode = 'idle', open = 0, target = 0, tl = null, playing = null, words = [], wordIdx = -1;
  let blinkAt = performance.now() + 1500, blinkT = 0, t0 = performance.now();
  function setMode(m) { mode = m; el.dataset.mode = m; }
  setMode('idle');

  function frame(now) {
    if (!el.isConnected) { requestAnimationFrame(frame); return; }
    build();
    const t = (now - t0) / 1000;
    // mouth: follow the words while a line is playing
    target = 0;
    if (playing && tl) {
      const f = playing.progress();
      if (f >= 0 && f <= 1) {
        const u = f * tl.total;
        const seg = tl.segs.find(sg => u >= sg.s && u < sg.e);
        if (seg) target = seg.amp * Math.pow(Math.sin(Math.PI * (u - seg.s)), .7);
        // current word, for the caption
        let wi = 0; for (let i = 0; i < tl.wordAt.length; i++) if (u >= tl.wordAt[i]) wi = i;
        if (wi !== wordIdx) { wordIdx = wi; highlight(wi); }
      }
    }
    open += (target - open) * .45;
    if (parts.human) {
      const ry = 1 + open * 11, my = parts.my;
      parts.open.setAttribute('ry', ry.toFixed(2)); parts.open.setAttribute('rx', (12 + open * 3).toFixed(2)); parts.open.setAttribute('cy', (my + open * 3).toFixed(2));
      parts.teeth.setAttribute('ry', (open * 3.2).toFixed(2)); parts.teeth.setAttribute('cy', (my + open * 3 - ry + 3).toFixed(2));
      parts.tongue.setAttribute('ry', (open * 4).toFixed(2)); parts.tongue.setAttribute('cy', (my + open * 3 + ry - 3).toFixed(2));
      parts.smile.style.opacity = open > .18 ? 0 : 1;
    } else {
      parts.open.setAttribute('ry', (1 + open * 18).toFixed(2));
      parts.open.setAttribute('rx', (14 + open * 3).toFixed(2));
      parts.open.setAttribute('cy', (184 + open * 8).toFixed(2));
      parts.tongue.setAttribute('ry', (open * 6).toFixed(2));
      parts.tongue.setAttribute('cy', (186 + open * 17).toFixed(2));
    }
    // blink every few seconds
    if (now > blinkAt) { blinkT = now; blinkAt = now + 2200 + Math.random() * 3200; }
    const b = now - blinkT < 140 ? .12 : 1;
    const ey = parts.human ? (parts.my === 180 ? 137 : 140) : 140;
    parts.eyes.forEach(e => e.setAttribute('transform', `translate(0 ${(ey * (1 - b)).toFixed(1)}) scale(1 ${b})`));
    // head and ears by mode
    let rot = Math.sin(t * .9) * 1.5, dy = Math.sin(t * 1.6) * 2, earL = 0, earR = 0, brow = 0;
    if (mode === 'talk') { dy += open * -3; rot += Math.sin(t * 2.3) * 2; earL = -4 - open * 4; earR = 4 + open * 4; brow = -2 - open * 2; }
    if (mode === 'listen') { rot = Math.sin(t * .8) * 2; dy = Math.max(0, Math.sin(t * 2.4)) * 5; earL = -16; earR = 16; brow = -5; }
    if (mode === 'think') { rot = -9 + Math.sin(t * 1.2) * 1.5; earL = 6; earR = -2; brow = -3; }
    if (mode === 'happy') { dy = -Math.abs(Math.sin(t * 5)) * 8; earL = -12 + Math.sin(t * 10) * 6; earR = 12 - Math.sin(t * 10) * 6; brow = -6; }
    if (parts.human) { rot *= .6; dy *= .6; earL = earR = 0; } // people move less than dogs, and their ears stay put
    parts.hds.forEach(g => g.setAttribute('transform', `translate(0 ${dy.toFixed(1)}) rotate(${rot.toFixed(1)} 150 ${parts.human ? 200 : 160})`));
    if (!parts.human) {
      parts.earL.setAttribute('transform', `rotate(${earL.toFixed(1)} 84 140)`);
      parts.earR.setAttribute('transform', `rotate(${earR.toFixed(1)} 216 140)`);
    }
    parts.brows.setAttribute('transform', `translate(0 ${brow.toFixed(1)})`);
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  // ---------- caption ----------
  function caption(kind, text, extra) {
    cap.dataset.kind = kind;
    if (kind === 'coach') {
      words = String(text).split(/\s+/).filter(Boolean);
      cap.innerHTML = `<div class="hs-line">${words.map((w, i) => `<span data-i="${i}">${esc(w)}</span>`).join(' ')}</div>${extra ? `<div class="hs-tr">${esc(extra)}</div>` : ''}`;
      wordIdx = -1;
    } else if (kind === 'you') {
      cap.innerHTML = `<div class="hs-you">${text ? esc(text) : '<span class="hs-dots"><i></i><i></i><i></i></span>'}</div>`;
    } else if (kind === 'think') {
      cap.innerHTML = `<div class="hs-think"><span class="hs-dots dark"><i></i><i></i><i></i></span></div>`;
    } else cap.innerHTML = text ? `<div class="hs-note">${esc(text)}</div>` : '';
  }
  function highlight(i) {
    cap.querySelectorAll('.hs-line span').forEach(s => s.classList.toggle('on', +s.dataset.i === i));
  }
  let capKey = '';
  function show(kind, text, extra) { const k = kind + '|' + text + '|' + (extra || ''); if (k === capKey && kind !== 'you') return; capKey = k; caption(kind, text, extra); }

  // ---------- audio ----------
  const AU = new Audio(); AU.preload = 'auto';
  const SILENT = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=';
  const cache = {};
  let id = 0, resolveCur = null;
  const stage = {
    el,
    talking: false,
    unlock() { try { if (!stage.talking) { AU.src = SILENT; const p = AU.play(); if (p) p.catch(() => {}); } } catch (e) {} },
    // Play a line with the mouth moving. Resolves true when finished, false if interrupted.
    say(text, o) {
      o = o || {};
      stage.hush();
      const my = ++id;
      return new Promise(resolve => {
        resolveCur = resolve;
        stage.talking = true; setMode('talk');
        tl = timeline(text);
        show(o.caption === false ? 'none' : 'coach', o.caption === false ? '' : text, o.translation);
        const done = ok => { if (my !== id) return; id++; playing = null; stage.talking = false; setMode(o.after || 'idle'); resolveCur = null; resolve(ok); };
        const viaPhone = () => {
          if (my !== id) return;
          if (!('speechSynthesis' in window)) { setTimeout(() => done(true), 600); return; }
          speechSynthesis.cancel();
          const u = new SpeechSynthesisUtterance(text); u.lang = code(); u.rate = .95;
          const v = speechSynthesis.getVoices().find(x => x.lang.replace('_', '-') === code()); if (v) u.voice = v;
          const est = Math.max(900, tl.total * 170); let start = performance.now(), base = 0;
          playing = { progress: () => Math.min(1, base + (performance.now() - start) / est) };
          u.onboundary = e => { if (e.name && e.name !== 'word') return; const wi = text.slice(0, e.charIndex).split(/\s+/).filter(Boolean).length; base = (tl.wordAt[wi] || 0) / tl.total; start = performance.now(); };
          let fin = false; const end = () => { if (!fin) { fin = true; done(true); } };
          u.onend = end; u.onerror = end; setTimeout(end, 2000 + est * 1.6);
          speechSynthesis.speak(u);
        };
        const playUrl = url => {
          if (my !== id) return;
          AU.onended = () => done(true); AU.onerror = viaPhone;
          AU.src = url; AU.currentTime = 0;
          playing = { progress: () => { const d = AU.duration; return isFinite(d) && d > 0 ? AU.currentTime / d : AU.currentTime / Math.max(1, tl.total * .17); } };
          const p = AU.play(); if (p) p.catch(viaPhone);
        };
        const k = (o.persona || persona()) + '|' + code() + '|' + (o.kind || 'line') + '|' + text;
        if (o.b64) { try { const bin = atob(o.b64), arr = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i); cache[k] = URL.createObjectURL(new Blob([arr], { type: 'audio/mpeg' })); } catch (e) {} }
        if (cache[k]) return playUrl(cache[k]);
        if (o.noFetch) return viaPhone();
        fetch('/.netlify/functions/tts', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ kind: o.kind || 'line', text, target: code(), persona: persona() }) })
          .then(r => (r.ok && (r.headers.get('content-type') || '').includes('audio')) ? r.blob() : Promise.reject())
          .then(b => { cache[k] = URL.createObjectURL(b); playUrl(cache[k]); })
          .catch(viaPhone);
      });
    },
    hush() {
      if (resolveCur) { const r = resolveCur; resolveCur = null; r(false); }
      id++; playing = null; stage.talking = false;
      try { AU.pause(); } catch (e) {}
      if ('speechSynthesis' in window) speechSynthesis.cancel();
      if (mode === 'talk') setMode('idle');
    },
    // Looks: 'idle' | 'listen' | 'think' | 'happy'
    mode(m) { if (!stage.talking) setMode(m); },
    listening(text) { if (!stage.talking) { setMode('listen'); show('you', text || ''); } },
    thinking() { if (!stage.talking) { setMode('think'); show('think', ''); } },
    note(text) { show('note', text); },
    // A quick "mm-hm" in the learnt language (only if already downloaded, so it never adds a wait).
    ack() {
      const list = (ACKS[code()] || ACKS['en-GB']).filter(a => cache[persona() + '|' + code() + '|word|' + a]);
      if (!list.length || Math.random() < .25) { stage.thinking(); return Promise.resolve(true); }
      const a = list[Math.floor(Math.random() * list.length)];
      return stage.say(a, { kind: 'word', caption: false, noFetch: true, after: 'think' }).then(ok => { if (ok) stage.thinking(); return ok; });
    },
    prefetchAcks() {
      (ACKS[code()] || ACKS['en-GB']).forEach(a => {
        const k = persona() + '|' + code() + '|word|' + a;
        if (cache[k]) return;
        fetch('/.netlify/functions/tts', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ kind: 'word', text: a, target: code(), persona: persona() }) })
          .then(r => (r.ok && (r.headers.get('content-type') || '').includes('audio')) ? r.blob() : null)
          .then(b => { if (b) cache[k] = URL.createObjectURL(b); }).catch(() => {});
      });
    }
  };
  return stage;
};
// Short, neutral acknowledgements in each language (fine for a café chat and for a job interview).
const ACKS = {
  'en-GB': ['Mm-hm.', 'I see.', 'Right.'], 'en-US': ['Mm-hm.', 'I see.', 'Okay.'],
  'es-ES': ['Ajá.', 'Vale.', 'Entiendo.'], 'es-MX': ['Ajá.', 'Okey.', 'Entiendo.'],
  'fr-FR': ['Mmh.', "D'accord.", 'Je vois.'], 'it-IT': ['Mh-mh.', 'Certo.', 'Capisco.'],
  'de-DE': ['Mhm.', 'Okay.', 'Verstehe.'], 'pt-PT': ['Hum-hum.', 'Certo.', 'Percebo.'], 'nl-NL': ['Hm-hm.', 'Oké.', 'Ik snap het.']
};

// ---------- styles ----------
const css = `
.hs-stage{display:flex;flex-direction:column;align-items:center;gap:6px;padding:14px 12px 12px;margin:0 0 10px;border-radius:20px;background:radial-gradient(circle at 50% 38%,#5B6BE0 0,#3346C8 55%,#26359E 100%);color:#fff;position:relative;overflow:hidden}
.hs-stage[data-mode="listen"]{background:radial-gradient(circle at 50% 38%,#6C7CF0 0,#3E52D8 55%,#2C3BB0 100%)}
.hs-head{width:min(190px,48vw);aspect-ratio:1;filter:drop-shadow(0 6px 10px rgba(10,15,60,.35))}
.hs-head svg{width:100%;height:100%;display:block;overflow:visible}
.hs-stage[data-mode="listen"] .hs-head::after{content:'';position:absolute}
.hs-cap{min-height:56px;width:100%;text-align:center;display:flex;flex-direction:column;align-items:center;justify-content:center}
.hs-line{font-size:19px;font-weight:700;line-height:1.4;max-width:34em}
.hs-line span{transition:color .12s,background .12s;border-radius:6px;padding:0 1px}
.hs-line span.on{background:#FFD45C;color:#1C2563}
.hs-tr{font-size:14px;opacity:.8;margin-top:4px}
.hs-you{font-size:17px;font-style:italic;opacity:.95;max-width:34em}
.hs-note{font-size:15px;opacity:.9}
.hs-dots i{display:inline-block;width:8px;height:8px;margin:0 3px;border-radius:50%;background:#fff;animation:hsDot 1s infinite}
.hs-dots i:nth-child(2){animation-delay:.15s}.hs-dots i:nth-child(3){animation-delay:.3s}
@keyframes hsDot{0%,60%,100%{opacity:.3;transform:translateY(0)}30%{opacity:1;transform:translateY(-3px)}}
@media (prefers-reduced-motion: reduce){.hs-dots i{animation:none}}
`;
const st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
window.HSTalk.timeline = timeline;
window.HSTalk.face = svg; // still picture, e.g. for the small avatars in the transcript
})();
