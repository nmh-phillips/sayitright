// Harley Says: sounds, vibration, XP with a daily goal ring, and an overall streak with streak freezes.
// Shared by the main app, Harley's Games and the Interview Coach (same localStorage, so XP and the streak are shared).
// API: HSFX.result(pct)  a phrase attempt: sound + buzz + XP by score
//      HSFX.xp(n)        add XP (shows "+n XP", fills the ring, may complete the daily goal)
//      HSFX.sound(name)  'great' | 'good' | 'try' | 'pop' | 'win' | 'tick'
//      HSFX.buzz(ms)     vibrate where the phone allows it (Android; iPhone web apps can't)
//      HSFX.confetti()   a burst of confetti
// The ring is added to the page header (.hdr-r) by itself; tapping it opens the goal / streak / sounds panel.
(function () {
'use strict';
const get = (k, d) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } };
const put = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} };
const pad = n => String(n).padStart(2, '0');
const dayKey = d => { d = d || new Date(); return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); };
const daysBetween = (a, b) => Math.round((new Date(b + 'T12:00:00') - new Date(a + 'T12:00:00')) / 864e5);
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

// ---------- text ----------
const K = ['today', 'goal', 'g20', 'g50', 'g100', 'streak', 'best', 'freezes', 'freezeInfo', 'saved', 'earned', 'goalDone', 'sounds', 'total', 'start', 'close'];
const T = {
  en: ['Today', 'Daily goal', 'Casual', 'Regular', 'Serious', '{n}-day streak', 'Best: {n} days', 'Streak freezes', 'A freeze saves your streak if you miss a day. You earn one for every 7 days in a row (up to 2).', '❄️ A streak freeze saved your {n}-day streak!', '❄️ You earned a streak freeze!', '🎉 Daily goal reached!', 'Sounds and vibration', 'Total XP', 'Reach your daily goal to start a streak', 'Close'],
  es: ['Hoy', 'Meta diaria', 'Tranqui', 'Normal', 'Intensa', 'Racha de {n} días', 'Mejor: {n} días', 'Protectores de racha', 'Un protector salva tu racha si un día no practicas. Ganas uno cada 7 días seguidos (máx. 2).', '❄️ ¡Un protector salvó tu racha de {n} días!', '❄️ ¡Has ganado un protector de racha!', '🎉 ¡Meta diaria conseguida!', 'Sonidos y vibración', 'XP total', 'Cumple tu meta diaria para empezar una racha', 'Cerrar'],
  fr: ["Aujourd'hui", 'Objectif du jour', 'Détente', 'Régulier', 'Intense', 'Série de {n} jours', 'Record : {n} jours', 'Gels de série', 'Un gel protège ta série si tu rates un jour. Tu en gagnes un tous les 7 jours d’affilée (2 max).', '❄️ Un gel a sauvé ta série de {n} jours !', '❄️ Tu as gagné un gel de série !', '🎉 Objectif du jour atteint !', 'Sons et vibrations', 'XP total', 'Atteins ton objectif du jour pour lancer une série', 'Fermer'],
  it: ['Oggi', 'Obiettivo giornaliero', 'Rilassato', 'Regolare', 'Intenso', 'Serie di {n} giorni', 'Record: {n} giorni', 'Salva-serie', 'Un salva-serie protegge la tua serie se salti un giorno. Ne guadagni uno ogni 7 giorni di fila (max 2).', '❄️ Un salva-serie ha protetto la tua serie di {n} giorni!', '❄️ Hai guadagnato un salva-serie!', '🎉 Obiettivo raggiunto!', 'Suoni e vibrazione', 'XP totali', 'Raggiungi l’obiettivo giornaliero per iniziare una serie', 'Chiudi'],
  de: ['Heute', 'Tagesziel', 'Locker', 'Normal', 'Ehrgeizig', '{n}-Tage-Serie', 'Rekord: {n} Tage', 'Serienschutz', 'Ein Serienschutz rettet deine Serie, wenn du einen Tag verpasst. Du bekommst einen für je 7 Tage am Stück (max. 2).', '❄️ Ein Serienschutz hat deine {n}-Tage-Serie gerettet!', '❄️ Du hast einen Serienschutz verdient!', '🎉 Tagesziel erreicht!', 'Töne und Vibration', 'XP gesamt', 'Erreiche dein Tagesziel, um eine Serie zu starten', 'Schließen'],
  pt: ['Hoje', 'Meta diária', 'Calma', 'Regular', 'Intensa', 'Sequência de {n} dias', 'Melhor: {n} dias', 'Proteções de sequência', 'Uma proteção salva a tua sequência se falhares um dia. Ganhas uma a cada 7 dias seguidos (máx. 2).', '❄️ Uma proteção salvou a tua sequência de {n} dias!', '❄️ Ganhaste uma proteção de sequência!', '🎉 Meta diária cumprida!', 'Sons e vibração', 'XP total', 'Cumpre a meta diária para começar uma sequência', 'Fechar'],
  pl: ['Dziś', 'Cel dzienny', 'Luźno', 'Regularnie', 'Ambitnie', 'Seria: {n} dni', 'Rekord: {n} dni', 'Ochrony serii', 'Ochrona ratuje serię, gdy opuścisz dzień. Dostajesz jedną za każde 7 dni z rzędu (maks. 2).', '❄️ Ochrona uratowała twoją serię {n} dni!', '❄️ Zdobywasz ochronę serii!', '🎉 Cel dzienny osiągnięty!', 'Dźwięki i wibracje', 'Łącznie XP', 'Osiągnij cel dzienny, by zacząć serię', 'Zamknij'],
  ro: ['Azi', 'Obiectiv zilnic', 'Lejer', 'Normal', 'Intens', 'Serie de {n} zile', 'Record: {n} zile', 'Protecții de serie', 'O protecție îți salvează seria dacă ratezi o zi. Primești una la fiecare 7 zile la rând (max. 2).', '❄️ O protecție ți-a salvat seria de {n} zile!', '❄️ Ai câștigat o protecție de serie!', '🎉 Obiectiv zilnic atins!', 'Sunete și vibrații', 'XP total', 'Atinge obiectivul zilnic ca să începi o serie', 'Închide'],
  uk: ['Сьогодні', 'Денна мета', 'Легко', 'Звично', 'Серйозно', 'Серія: {n} дн.', 'Рекорд: {n} дн.', 'Захисти серії', 'Захист рятує серію, якщо пропустиш день. Отримуєш один за кожні 7 днів поспіль (макс. 2).', '❄️ Захист урятував твою серію з {n} дн.!', '❄️ Ти отримав захист серії!', '🎉 Денну мету досягнуто!', 'Звуки та вібрація', 'Усього XP', 'Досягни денної мети, щоб почати серію', 'Закрити'],
  zh: ['今天', '每日目标', '轻松', '常规', '认真', '连续 {n} 天', '最佳：{n} 天', '连胜保护', '如果某天没练习，保护卡会保住你的连胜。每连续 7 天获得一张（最多 2 张）。', '❄️ 保护卡保住了你 {n} 天的连胜！', '❄️ 你获得了一张连胜保护卡！', '🎉 完成每日目标！', '声音和振动', '总经验值', '完成每日目标即可开始连胜', '关闭'],
  ar: ['اليوم', 'الهدف اليومي', 'خفيف', 'منتظم', 'جاد', 'سلسلة {n} أيام', 'الأفضل: {n} أيام', 'حماية السلسلة', 'تحمي سلسلتك إذا فاتك يوم. تحصل على واحدة كل 7 أيام متتالية (بحد أقصى 2).', '❄️ حماية السلسلة أنقذت سلسلتك البالغة {n} أيام!', '❄️ حصلت على حماية للسلسلة!', '🎉 حققت هدفك اليومي!', 'الأصوات والاهتزاز', 'مجموع النقاط', 'حقق هدفك اليومي لتبدأ سلسلة', 'إغلاق'],
  nl: ['Vandaag', 'Dagdoel', 'Rustig', 'Normaal', 'Serieus', 'Reeks van {n} dagen', 'Record: {n} dagen', 'Reeksbeschermers', 'Een beschermer redt je reeks als je een dag mist. Je verdient er één per 7 dagen op rij (max. 2).', '❄️ Een beschermer redde je reeks van {n} dagen!', '❄️ Je hebt een reeksbeschermer verdiend!', '🎉 Dagdoel gehaald!', 'Geluid en trillen', 'Totaal XP', 'Haal je dagdoel om een reeks te starten', 'Sluiten'],
  tr: ['Bugün', 'Günlük hedef', 'Rahat', 'Düzenli', 'Ciddi', '{n} günlük seri', 'En iyi: {n} gün', 'Seri koruyucular', 'Bir gün kaçırırsan koruyucu serini kurtarır. Arka arkaya her 7 günde bir kazanırsın (en fazla 2).', '❄️ Koruyucu {n} günlük serini kurtardı!', '❄️ Bir seri koruyucu kazandın!', '🎉 Günlük hedefe ulaştın!', 'Ses ve titreşim', 'Toplam XP', 'Seri başlatmak için günlük hedefine ulaş', 'Kapat'],
  ja: ['今日', '1日の目標', 'ゆるく', 'ふつう', 'しっかり', '{n}日連続', '最高：{n}日', '連続記録の保護', '1日休んでも保護で連続記録が守られます。7日連続ごとに1つ獲得（最大2つ）。', '❄️ 保護が{n}日の連続記録を守りました！', '❄️ 連続記録の保護を獲得！', '🎉 今日の目標達成！', '効果音と振動', '合計XP', '1日の目標を達成して連続記録をスタート', '閉じる'],
  ko: ['오늘', '일일 목표', '가볍게', '보통', '열심히', '{n}일 연속', '최고: {n}일', '연속 기록 보호', '하루를 놓쳐도 보호권이 연속 기록을 지켜줘요. 7일 연속마다 하나씩 받아요(최대 2개).', '❄️ 보호권이 {n}일 연속 기록을 지켰어요!', '❄️ 연속 기록 보호권을 받았어요!', '🎉 일일 목표 달성!', '소리와 진동', '총 XP', '일일 목표를 달성해 연속 기록을 시작하세요', '닫기'],
  vi: ['Hôm nay', 'Mục tiêu ngày', 'Nhẹ nhàng', 'Đều đặn', 'Nghiêm túc', 'Chuỗi {n} ngày', 'Kỷ lục: {n} ngày', 'Bảo vệ chuỗi', 'Thẻ bảo vệ giữ chuỗi nếu bạn bỏ lỡ một ngày. Nhận một thẻ sau mỗi 7 ngày liên tiếp (tối đa 2).', '❄️ Thẻ bảo vệ đã cứu chuỗi {n} ngày của bạn!', '❄️ Bạn nhận được một thẻ bảo vệ chuỗi!', '🎉 Đạt mục tiêu ngày!', 'Âm thanh và rung', 'Tổng XP', 'Đạt mục tiêu ngày để bắt đầu chuỗi', 'Đóng']
};
function t(k, vars) {
  const ui = get('sir_ui', null) || (navigator.language || 'en').slice(0, 2).toLowerCase();
  const row = T[ui] || T.en; let v = row[K.indexOf(k)] || T.en[K.indexOf(k)] || k;
  if (vars) for (const a in vars) v = v.split('{' + a + '}').join(vars[a]);
  return v;
}
const rtl = () => ['ar'].includes(get('sir_ui', ''));

// ---------- sound and vibration ----------
let ac = null, idleT = null;
const soundOn = () => get('hs_sound', true) !== false;
// The audio is only switched on while a sound plays, then suspended again: an always-running Web Audio context can
// stop the microphone / speech recognition from hearing anything (especially on iPhone).
function ctx() {
  if (!ac) { const A = window.AudioContext || window.webkitAudioContext; if (!A) return null; try { ac = new A(); } catch (e) { return null; } }
  if (ac.state === 'suspended') ac.resume().catch(() => {});
  return ac;
}
function idle(ms) { clearTimeout(idleT); idleT = setTimeout(() => { if (ac && ac.state === 'running') ac.suspend().catch(() => {}); }, ms); }
// iPhone only allows sound once the page has been tapped: unlock the audio on the first tap, then suspend it straight away.
['pointerdown', 'keydown'].forEach(ev => window.addEventListener(ev, () => { if (soundOn() && !ac) { ctx(); idle(300); } }, { once: true, capture: true }));
function note(c, f, at, len, vol, type) {
  const o = c.createOscillator(), g = c.createGain();
  o.type = type || 'sine'; o.frequency.setValueAtTime(f, at);
  g.gain.setValueAtTime(0.0001, at); g.gain.exponentialRampToValueAtTime(vol, at + 0.015); g.gain.exponentialRampToValueAtTime(0.0001, at + len);
  o.connect(g); g.connect(c.destination); o.start(at); o.stop(at + len + 0.05);
}
const TUNES = {
  great: [[784, 0, .14], [988, .09, .14], [1319, .18, .32]],
  good: [[659, 0, .12], [880, .09, .24]],
  try: [[440, 0, .14, .05], [392, .1, .22, .05]],
  pop: [[1047, 0, .08, .08]],
  tick: [[1568, 0, .04, .04]],
  win: [[523, 0, .14], [659, .1, .14], [784, .2, .14], [1047, .3, .4], [1319, .42, .45, .06]],
  xp: [[1319, 0, .07, .05], [1760, .06, .12, .05]]
};
function sound(name) {
  if (!soundOn()) return; const c = ctx(); if (!c) return;
  const now = c.currentTime + 0.02, tune = TUNES[name] || [];
  for (const [f, d, len, vol] of tune) note(c, f, now + d, len, vol || 0.09, name === 'try' ? 'triangle' : 'sine');
  const end = tune.reduce((m, x) => Math.max(m, x[1] + x[2]), 0);
  idle(Math.round(end * 1000) + 400);
}
function buzz(ms) { if (soundOn() && navigator.vibrate) try { navigator.vibrate(ms); } catch (e) {} }

// ---------- XP, daily goal, streak ----------
const GOALS = [20, 50, 100];
const goal = () => { const g = get('hs_goal', 50); return GOALS.includes(g) ? g : 50; };
function xpState() { const x = get('hs_xp', { total: 0, days: {} }); if (!x.days) x.days = {}; return x; }
const todayXp = () => xpState().days[dayKey()] || 0;
function streakState() { return get('hs_streak', { n: 0, last: '', best: 0, freezes: 0 }); }
// Missed days are covered by freezes, if there are enough; otherwise the streak goes back to 0.
function checkStreak() {
  const s = streakState(), today = dayKey();
  if (!s.last || s.n === 0) return s;
  const gap = daysBetween(s.last, today);
  if (gap <= 1) return s;
  const missed = gap - 1;
  if (missed <= (s.freezes || 0)) {
    s.freezes -= missed; const y = new Date(); y.setDate(y.getDate() - 1); s.last = dayKey(y);
    put('hs_streak', s); setTimeout(() => toast(t('saved', { n: s.n }), 'ice'), 1200);
  } else { s.n = 0; put('hs_streak', s); }
  return s;
}
function goalReached() {
  const s = checkStreak(), today = dayKey();
  if (s.last === today) return;
  const y = new Date(); y.setDate(y.getDate() - 1);
  s.n = s.last === dayKey(y) ? s.n + 1 : 1; s.last = today; s.best = Math.max(s.best || 0, s.n);
  let earned = false;
  if (s.n % 7 === 0 && (s.freezes || 0) < 2) { s.freezes = (s.freezes || 0) + 1; earned = true; }
  put('hs_streak', s);
  sound('win'); buzz([40, 60, 40]); confetti(); toast(t('goalDone') + ' 🔥 ' + t('streak', { n: s.n }), 'goal');
  if (earned) setTimeout(() => toast(t('earned'), 'ice'), 2200);
}
function xp(n) {
  n = Math.max(0, Math.round(n || 0)); if (!n) return;
  const x = xpState(), k = dayKey(), before = x.days[k] || 0;
  x.days[k] = before + n; x.total = (x.total || 0) + n;
  // keep 60 days of history
  const keys = Object.keys(x.days).sort(); while (keys.length > 60) delete x.days[keys.shift()];
  put('hs_xp', x);
  float('+' + n + ' XP');
  paint(true);
  if (before < goal() && x.days[k] >= goal()) setTimeout(goalReached, 500);
  window.dispatchEvent(new CustomEvent('hs-xp', { detail: { n, today: x.days[k] } }));
}
// A phrase attempt: sound, buzz and XP by score.
function result(pct) {
  if (pct >= 80) { sound('great'); buzz(30); xp(10); }
  else if (pct >= 60) { sound('good'); buzz(15); xp(5); }
  else { sound('try'); xp(2); }
}

// ---------- the ring, toasts and confetti ----------
const css = `
.hsx-ring{position:relative;display:inline-grid;place-items:center;width:40px;height:40px;border:0;padding:0;margin:0 6px 0 0;background:none;cursor:pointer;flex:0 0 auto;vertical-align:middle}
.hsx-ring svg{position:absolute;inset:0;width:40px;height:40px;transform:rotate(-90deg)}
.hsx-ring .bg{fill:none;stroke:rgba(255,255,255,.22);stroke-width:4}
.hsx-ring .fg{fill:none;stroke:#FFB37A;stroke-width:4;stroke-linecap:round;transition:stroke-dashoffset .8s cubic-bezier(.2,.9,.3,1.2)}
.hsx-ring.done .fg{stroke:#4ADE80}
.hsx-ring b{position:relative;font:800 12px Inter,system-ui,sans-serif;color:#fff;line-height:1;display:flex;align-items:center;gap:1px}
.hsx-ring b i{font-style:normal;font-size:12px}
.hsx-ring.bump{animation:hsxBump .5s cubic-bezier(.3,1.6,.5,1)}
.hsx-light .hsx-ring .bg{stroke:#e3e6f2} .hsx-light .hsx-ring b{color:#1C2563}
@keyframes hsxBump{0%{transform:scale(1)}40%{transform:scale(1.25)}100%{transform:scale(1)}}
.hsx-float{position:fixed;z-index:9999;font:800 15px Inter,system-ui,sans-serif;color:#FF8A3D;text-shadow:0 1px 0 #fff,0 0 6px #fff;pointer-events:none;animation:hsxFloat 1.1s ease-out forwards}
@keyframes hsxFloat{from{opacity:0;transform:translate(-50%,6px) scale(.8)}20%{opacity:1;transform:translate(-50%,0) scale(1.1)}to{opacity:0;transform:translate(-50%,-34px) scale(1)}}
.hsx-toast{position:fixed;left:50%;bottom:22px;z-index:9999;transform:translateX(-50%);max-width:min(92vw,420px);background:#1C2563;color:#fff;font:700 15px/1.35 Inter,system-ui,sans-serif;padding:12px 18px;border-radius:16px;box-shadow:0 10px 30px rgba(28,37,99,.35);animation:hsxToast 3.4s ease forwards;text-align:center}
.hsx-toast.goal{background:linear-gradient(135deg,#FF8A3D,#E0457B)} .hsx-toast.ice{background:linear-gradient(135deg,#0369A1,#38BDF8)}
@keyframes hsxToast{0%{opacity:0;transform:translate(-50%,20px) scale(.9)}10%{opacity:1;transform:translate(-50%,0) scale(1.03)}15%{transform:translate(-50%,0) scale(1)}85%{opacity:1}100%{opacity:0;transform:translate(-50%,10px)}}
.hsx-conf{position:fixed;inset:0;pointer-events:none;z-index:9998;overflow:hidden}
.hsx-conf i{position:absolute;top:-12px;width:9px;height:14px;border-radius:2px;animation:hsxFall linear forwards}
@keyframes hsxFall{to{transform:translateY(110vh) rotate(720deg)}}
.hsx-dlg{border:0;border-radius:22px;padding:0;max-width:min(92vw,380px);width:100%;box-shadow:0 20px 50px rgba(28,37,99,.35)}
.hsx-dlg::backdrop{background:rgba(20,26,70,.45)}
.hsx-p{padding:18px;font:15px/1.45 Inter,system-ui,sans-serif;color:#1C2563}
.hsx-p h3{margin:0 0 10px;font-size:18px}
.hsx-top{display:flex;align-items:center;gap:14px;margin-bottom:12px}
.hsx-big{position:relative;width:86px;height:86px;flex:0 0 86px;display:grid;place-items:center}
.hsx-big svg{position:absolute;inset:0;transform:rotate(-90deg)}
.hsx-big .bg{fill:none;stroke:#eef0f8;stroke-width:8} .hsx-big .fg{fill:none;stroke:#FF8A3D;stroke-width:8;stroke-linecap:round}
.hsx-big.done .fg{stroke:#22C55E}
.hsx-big b{font-size:20px;font-weight:800;text-align:center;line-height:1.1}.hsx-big small{display:block;font-size:11px;color:#667;font-weight:600}
.hsx-st{font-size:20px;font-weight:800}.hsx-st small{display:block;font-size:13px;color:#667;font-weight:600}
.hsx-row{display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-top:1px solid #eef0f8}
.hsx-goals{display:flex;gap:6px}.hsx-goals button{border:1px solid #dfe3f0;background:#fff;border-radius:12px;padding:7px 9px;font:700 13px Inter,system-ui,sans-serif;color:#1C2563;cursor:pointer}
.hsx-goals button.on{background:#1C2563;border-color:#1C2563;color:#fff}
.hsx-ice{font-size:18px;letter-spacing:2px}
.hsx-note{font-size:13px;color:#667;margin:2px 0 8px}
.hsx-sw{position:relative;width:46px;height:26px;border-radius:999px;background:#dfe3f0;border:0;cursor:pointer;transition:background .2s}
.hsx-sw::after{content:'';position:absolute;top:3px;left:3px;width:20px;height:20px;border-radius:50%;background:#fff;transition:transform .2s;box-shadow:0 1px 3px rgba(0,0,0,.2)}
.hsx-sw.on{background:#22C55E}.hsx-sw.on::after{transform:translateX(20px)}
.hsx-shop{display:block;width:100%;margin-top:12px;border:0;border-radius:14px;padding:12px;background:linear-gradient(135deg,#7B2FD0,#E0457B);color:#fff;font:800 15px Inter,system-ui,sans-serif;cursor:pointer;box-shadow:0 3px 0 #55209a}
.hsx-fr{background:linear-gradient(135deg,#3346C8,#0E9F9A);box-shadow:0 3px 0 #22308f}
.hsx-close{display:block;width:100%;margin-top:12px;border:0;border-radius:14px;padding:12px;background:#3346C8;color:#fff;font:800 15px Inter,system-ui,sans-serif;cursor:pointer}
@media (prefers-reduced-motion:reduce){.hsx-ring.bump,.hsx-float,.hsx-conf i{animation:none!important}.hsx-conf{display:none}}`;
function addCss() { if (document.getElementById('hsxCss')) return; const s = document.createElement('style'); s.id = 'hsxCss'; s.textContent = css; document.head.appendChild(s); }
const C = 2 * Math.PI * 16;
function ringSvg(r, w, frac) { const c = 2 * Math.PI * r; return `<svg viewBox="0 0 ${2 * r + w * 2} ${2 * r + w * 2}"><circle class="bg" cx="${r + w}" cy="${r + w}" r="${r}"/><circle class="fg" cx="${r + w}" cy="${r + w}" r="${r}" stroke-dasharray="${c}" stroke-dashoffset="${c * (1 - Math.min(1, frac))}"/></svg>`; }
let ringEl = null;
function mount() {
  addCss();
  const host = document.querySelector('header .hdr-r'); if (!host || ringEl) return;
  ringEl = document.createElement('button'); ringEl.type = 'button'; ringEl.className = 'hsx-ring'; ringEl.id = 'hsXp';
  ringEl.onclick = openPanel;
  host.insertBefore(ringEl, host.firstChild);
  // light headers (white background) get dark text
  const bg = getComputedStyle(document.querySelector('header')).backgroundColor;
  const m = bg.match(/\d+/g); if (m && (+m[0] + +m[1] + +m[2]) / 3 > 180) document.querySelector('header').classList.add('hsx-light');
  paint(false);
}
function paint(bump) {
  if (!ringEl) return;
  const s = checkStreak(), today = todayXp(), g = goal(), alive = s.last === dayKey() || daysBetween(s.last || dayKey(), dayKey()) <= 1;
  const n = alive ? s.n : 0;
  ringEl.classList.toggle('done', today >= g);
  ringEl.innerHTML = `<svg viewBox="0 0 40 40"><circle class="bg" cx="20" cy="20" r="16"/><circle class="fg" cx="20" cy="20" r="16" stroke-dasharray="${C}" stroke-dashoffset="${C * (1 - Math.min(1, today / g))}"/></svg><b><i>🔥</i>${n}</b>`;
  ringEl.setAttribute('aria-label', `${t('today')}: ${today}/${g} XP · ${t('streak', { n })}`);
  if (bump) { ringEl.classList.remove('bump'); void ringEl.offsetWidth; ringEl.classList.add('bump'); }
}
function float(text) {
  addCss();
  const el = document.createElement('div'); el.className = 'hsx-float'; el.textContent = text;
  const r = ringEl && ringEl.getBoundingClientRect();
  if (r && r.width) { el.style.left = (r.left + r.width / 2) + 'px'; el.style.top = (r.bottom + 4) + 'px'; } else { el.style.left = '50%'; el.style.top = '70px'; }
  document.body.appendChild(el); setTimeout(() => el.remove(), 1200);
}
function toast(text, kind) {
  addCss();
  const el = document.createElement('div'); el.className = 'hsx-toast ' + (kind || ''); el.setAttribute('role', 'status'); el.textContent = text;
  document.body.appendChild(el); setTimeout(() => el.remove(), 3500);
}
function confetti() {
  addCss();
  window.dispatchEvent(new CustomEvent('hs-celebrate')); // friends.js may suggest inviting a friend
  if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const box = document.createElement('div'); box.className = 'hsx-conf';
  const cols = ['#FF8A3D', '#3346C8', '#22C55E', '#E0457B', '#FFD166', '#38BDF8'];
  for (let i = 0; i < 70; i++) {
    const p = document.createElement('i');
    p.style.left = Math.random() * 100 + '%'; p.style.background = cols[i % cols.length];
    p.style.animationDuration = (1.6 + Math.random() * 1.6) + 's'; p.style.animationDelay = (Math.random() * .4) + 's';
    p.style.transform = `rotate(${Math.random() * 360}deg)`;
    box.appendChild(p);
  }
  document.body.appendChild(box); setTimeout(() => box.remove(), 3800);
}
function openPanel() {
  addCss();
  let d = document.getElementById('hsxDlg');
  if (!d) { d = document.createElement('dialog'); d.id = 'hsxDlg'; d.className = 'hsx-dlg'; document.body.appendChild(d);
    d.addEventListener('click', e => {
      if (e.target === d) return d.close();
      const b = e.target.closest('button'); if (!b) return;
      if (b.dataset.goal) { put('hs_goal', +b.dataset.goal); fill(); paint(false); }
      else if (b.dataset.snd !== undefined) { put('hs_sound', !soundOn()); fill(); if (soundOn()) { ctx(); sound('pop'); } }
      else if (b.dataset.cls !== undefined) d.close();
      else if (b.dataset.shop !== undefined) { d.close(); window.HSShop.open(); }
      else if (b.dataset.friends !== undefined) { d.close(); window.HSFriends.open(); }
    });
  }
  const fill = () => {
    const s = checkStreak(), today = todayXp(), g = goal(), alive = s.last === dayKey() || daysBetween(s.last || dayKey(), dayKey()) <= 1, n = alive ? s.n : 0;
    d.dir = rtl() ? 'rtl' : 'ltr';
    d.innerHTML = `<div class="hsx-p">
      <div class="hsx-top"><div class="hsx-big${today >= g ? ' done' : ''}">${ringSvg(37, 6, today / g)}<b>${today}<small>/ ${g} XP</small></b></div>
        <div class="hsx-st">🔥 ${esc(t('streak', { n }))}<small>${n ? esc(t('best', { n: Math.max(s.best || 0, n) })) : esc(t('start'))}</small></div></div>
      <div class="hsx-row"><span>${esc(t('goal'))}</span><div class="hsx-goals">${GOALS.map((x, i) => `<button data-goal="${x}" class="${x === g ? 'on' : ''}">${esc(t(['g20', 'g50', 'g100'][i]))}</button>`).join('')}</div></div>
      <div class="hsx-row"><span>${esc(t('freezes'))}</span><span class="hsx-ice">${'❄️'.repeat(s.freezes || 0) || '–'}</span></div>
      <p class="hsx-note">${esc(t('freezeInfo'))}</p>
      <div class="hsx-row"><span>${esc(t('total'))}</span><b>${(xpState().total || 0).toLocaleString()}</b></div>
      <div class="hsx-row"><span>${esc(t('sounds'))}</span><button class="hsx-sw${soundOn() ? ' on' : ''}" data-snd role="switch" aria-checked="${soundOn()}" aria-label="${esc(t('sounds'))}"></button></div>
      ${window.HSFriends ? `<button class="hsx-shop hsx-fr" data-friends>👥 ${esc(HSFriends.title())}</button>` : ''}
      ${window.HSShop ? `<button class="hsx-shop" data-shop>🛍️ ${esc(HSShop.title())} · ${HSShop.balance().toLocaleString()} XP</button>` : ''}
      <button class="hsx-close" data-cls>${esc(t('close'))}</button></div>`;
  };
  fill();
  try { d.showModal(); } catch (e) { d.setAttribute('open', ''); }
}

window.HSFX = { result, xp, sound, buzz, confetti, toast, refresh: () => paint(false) };
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount); else mount();
window.addEventListener('storage', e => { if (e.key === 'hs_xp' || e.key === 'hs_streak' || e.key === 'hs_goal') paint(false); });
})();
