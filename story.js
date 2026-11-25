// "Why we built Harley Says": five swipeable slides, ending with the real photos of Harley and Lilou.
(function () {
  'use strict';
  const UI = window.SIR_UI || {};
  const ui = UI[window.STORY_UI] ? window.STORY_UI : 'en';
  const t = k => (UI[ui] && UI[ui][k]) || (UI.en && UI.en[k]) || '';
  const $ = id => document.getElementById(id);
  document.documentElement.lang = ui;
  if (window.SIR_EXTRA && window.SIR_EXTRA[ui] && window.SIR_EXTRA[ui].rtl) document.documentElement.dir = 'rtl';
  document.title = t('storyH');
  document.querySelectorAll('[data-k]').forEach(el => { el.textContent = t(el.dataset.k); });
  $('hint').textContent = t('st_swipe');

  // Harley and Lilou, drawn
  const face = p => (window.HSTalk && HSTalk.face) ? HSTalk.face(p) : '';
  ['h1', 'h3', 'h4a'].forEach(id => { $(id).innerHTML = face('harley'); });
  $('h4b').innerHTML = face('lilou');

  // "Hello" in the app's languages floating up on the first slide; hearts on the third
  const hellos = ['Hello!', '¡Hola!', 'Bonjour !', 'Ciao!', 'Hallo!', 'Olá!', 'Hoi!', 'Hello!', '¡Hola!', 'Bonjour !'];
  $('bubbles').innerHTML = hellos.map((w, i) => `<span style="left:${i % 2 ? 72 + (i * 7) % 16 : 2 + (i * 5) % 12}%;animation-duration:${9 + (i % 4) * 2}s;animation-delay:${-i * 1.7}s">${w}</span>`).join('');
  $('hearts').innerHTML = Array.from({ length: 10 }, (_, i) => `<span style="left:${(i * 29) % 90 + 4}%;animation-duration:${7 + (i % 3) * 2}s;animation-delay:${-i * 1.3}s">${['🐾', '💙', '🦴', '💛'][i % 4]}</span>`).join('');

  // slides, dots, buttons
  const track = $('track'), slides = [...document.querySelectorAll('.slide')];
  $('dots').innerHTML = slides.map(() => '<i></i>').join('');
  const dots = [...$('dots').children];
  let cur = 0;
  const go = i => { i = Math.max(0, Math.min(slides.length - 1, i)); slides[i].scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' }); };
  function setCur(i) {
    cur = i;
    dots.forEach((d, k) => d.classList.toggle('on', k === i));
    slides[i].classList.add('in');
    $('prev').disabled = i === 0;
    $('next').disabled = i === slides.length - 1;
    $('hint').style.visibility = i === 0 ? 'visible' : 'hidden';
  }
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting && e.intersectionRatio > 0.6) setCur(slides.indexOf(e.target)); }), { root: track, threshold: [0.6] });
  slides.forEach(s => io.observe(s));
  const rtl = document.documentElement.dir === 'rtl';
  $('prev').onclick = () => go(cur - 1);
  $('next').onclick = () => go(cur + 1);
  if (rtl) { $('prev').textContent = '→'; $('next').textContent = '←'; }
  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') go(cur + (rtl ? -1 : 1));
    if (e.key === 'ArrowLeft') go(cur + (rtl ? 1 : -1));
  });
  setCur(0);
  try { if (typeof fetch === 'function') fetch('/.netlify/functions/track', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ e: 'story', u: ui }) }).catch(() => {}); } catch (e) {}
})();
