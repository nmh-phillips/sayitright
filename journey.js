// Harley Says: "A day out" — a journey map through a day in a city where your language is spoken.
// Eight stops (café in the morning … a party in the evening). Each stop is one lesson round of 10 phrases from a
// matching topic, plus that place's conversation in Harley Chats when Chats is available. Finishing a stop unlocks the next.
// Uses globals from index.html: lang, set, idx, render, store, DATA, coachFace, CHATS. Hooks: lesson.js fires 'hs-round'
// ({ set, round, stars }) and exposes hsStartRound(name, r); chat.js fires 'hs-chat-done' ({ scene }) and exposes hsChatScene(scene).
// Stored: hs_journey = { [lang]: { day, done: { stopId: stars }, chat: { stopId: true } } }
(function () {
'use strict';
const STOPS = [
  { id: 'cafe', ic: '☕', set: 'Café & restaurant', r: 0, chat: 'cafe' },
  { id: 'way', ic: '🗺️', set: 'Travel', r: 0, chat: 'directions' },
  { id: 'shop', ic: '🛍️', set: 'Basics', r: 1, chat: 'shop' },
  { id: 'lunch', ic: '🍝', set: 'Café & restaurant', r: 1, chat: 'restaurant' },
  { id: 'pharmacy', ic: '💊', set: 'Basics', r: 2, chat: 'pharmacy' },
  { id: 'station', ic: '🚉', set: 'Travel', r: 1, chat: '' },
  { id: 'hotel', ic: '🏨', set: 'Travel', r: 2, chat: 'hotel' },
  { id: 'party', ic: '🎉', set: 'Basics', r: 3, chat: 'party' }
];
const CITY = { en: 'London', enus: 'New York', es: 'Madrid', esmx: 'Mexico City', fr: 'Paris', it: 'Rome', de: 'Berlin', pt: 'Lisbon', nl: 'Amsterdam' };
const get = (k, d) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } };
const put = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} };
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

// ---------- text ----------
const K = ['card', 'title', 'day', 'stops', 's_cafe', 's_way', 's_shop', 's_lunch', 's_pharmacy', 's_station', 's_hotel', 's_party', 'practise', 'chat', 'locked', 'done', 'next', 'finish', 'newDay', 'close', 'again', 'tap'];
const T = {
  en: ['Your day out', 'A day out in {city}', 'Day {n}', '{n} of {m} stops', 'Morning coffee', 'Asking the way', 'Shopping', 'Lunch', 'At the pharmacy', 'At the station', 'Checking in', 'Evening party', 'Practise 10 phrases', 'Have the conversation', 'Finish the stop before to unlock this one', 'Stop complete!', 'Next stop: {s}', 'You finished your day out in {city}! 🎉', 'Start day {n}', 'Close', 'Practise again', 'Tap a stop to start'],
  es: ['Tu día fuera', 'Un día en {city}', 'Día {n}', '{n} de {m} paradas', 'Café de la mañana', 'Preguntar el camino', 'De compras', 'Comida', 'En la farmacia', 'En la estación', 'En el hotel', 'Fiesta por la noche', 'Practica 10 frases', 'Haz la conversación', 'Termina la parada anterior para desbloquear esta', '¡Parada completada!', 'Siguiente parada: {s}', '¡Terminaste tu día en {city}! 🎉', 'Empezar el día {n}', 'Cerrar', 'Practicar de nuevo', 'Toca una parada para empezar'],
  fr: ['Ta journée', 'Une journée à {city}', 'Jour {n}', '{n} étapes sur {m}', 'Café du matin', 'Demander son chemin', 'Shopping', 'Déjeuner', 'À la pharmacie', 'À la gare', "À l'hôtel", 'Soirée', 'Entraîne-toi sur 10 phrases', 'Faire la conversation', "Termine l'étape précédente pour débloquer celle-ci", 'Étape terminée !', 'Prochaine étape : {s}', 'Tu as fini ta journée à {city} ! 🎉', 'Commencer le jour {n}', 'Fermer', "S'entraîner encore", 'Touche une étape pour commencer'],
  it: ['La tua giornata', 'Una giornata a {city}', 'Giorno {n}', '{n} di {m} tappe', 'Caffè del mattino', 'Chiedere la strada', 'Shopping', 'Pranzo', 'In farmacia', 'In stazione', 'In hotel', 'Festa la sera', 'Esercitati con 10 frasi', 'Fai la conversazione', 'Completa la tappa precedente per sbloccare questa', 'Tappa completata!', 'Prossima tappa: {s}', 'Hai finito la tua giornata a {city}! 🎉', 'Inizia il giorno {n}', 'Chiudi', 'Esercitati di nuovo', 'Tocca una tappa per iniziare'],
  de: ['Dein Tagesausflug', 'Ein Tag in {city}', 'Tag {n}', '{n} von {m} Stationen', 'Morgenkaffee', 'Nach dem Weg fragen', 'Einkaufen', 'Mittagessen', 'In der Apotheke', 'Am Bahnhof', 'Im Hotel', 'Party am Abend', 'Übe 10 Sätze', 'Führe das Gespräch', 'Schließe erst die Station davor ab', 'Station geschafft!', 'Nächste Station: {s}', 'Du hast deinen Tag in {city} geschafft! 🎉', 'Tag {n} starten', 'Schließen', 'Nochmal üben', 'Tippe auf eine Station, um zu starten'],
  pt: ['O teu dia fora', 'Um dia em {city}', 'Dia {n}', '{n} de {m} paragens', 'Café da manhã', 'Perguntar o caminho', 'Compras', 'Almoço', 'Na farmácia', 'Na estação', 'No hotel', 'Festa à noite', 'Pratica 10 frases', 'Faz a conversa', 'Termina a paragem anterior para desbloquear esta', 'Paragem concluída!', 'Próxima paragem: {s}', 'Terminaste o teu dia em {city}! 🎉', 'Começar o dia {n}', 'Fechar', 'Praticar outra vez', 'Toca numa paragem para começar'],
  pl: ['Twój dzień w mieście', 'Dzień w {city}', 'Dzień {n}', '{n} z {m} przystanków', 'Poranna kawa', 'Pytanie o drogę', 'Zakupy', 'Obiad', 'W aptece', 'Na dworcu', 'W hotelu', 'Wieczorna impreza', 'Poćwicz 10 zwrotów', 'Przeprowadź rozmowę', 'Ukończ poprzedni przystanek, by odblokować ten', 'Przystanek zaliczony!', 'Następny przystanek: {s}', 'Ukończyłeś swój dzień w {city}! 🎉', 'Zacznij dzień {n}', 'Zamknij', 'Ćwicz ponownie', 'Dotknij przystanku, aby zacząć'],
  ro: ['Ziua ta în oraș', 'O zi în {city}', 'Ziua {n}', '{n} din {m} opriri', 'Cafeaua de dimineață', 'Întrebi drumul', 'La cumpărături', 'Prânzul', 'La farmacie', 'La gară', 'La hotel', 'Petrecere seara', 'Exersează 10 fraze', 'Poartă conversația', 'Termină oprirea anterioară ca s-o deblochezi', 'Oprire terminată!', 'Următoarea oprire: {s}', 'Ai terminat ziua în {city}! 🎉', 'Începe ziua {n}', 'Închide', 'Exersează din nou', 'Atinge o oprire ca să începi'],
  uk: ['Твій день у місті', 'День у {city}', 'День {n}', '{n} з {m} зупинок', 'Ранкова кава', 'Запитати дорогу', 'Покупки', 'Обід', 'В аптеці', 'На вокзалі', 'У готелі', 'Вечірка', 'Потренуй 10 фраз', 'Проведи розмову', 'Заверши попередню зупинку, щоб відкрити цю', 'Зупинку пройдено!', 'Наступна зупинка: {s}', 'Ти завершив свій день у {city}! 🎉', 'Почати день {n}', 'Закрити', 'Ще раз', 'Торкнися зупинки, щоб почати'],
  zh: ['你的一日游', '在 {city} 的一天', '第 {n} 天', '{m} 站中的第 {n} 站', '早晨咖啡', '问路', '购物', '午餐', '在药店', '在车站', '入住酒店', '晚间派对', '练习 10 个短语', '进行对话', '先完成上一站才能解锁', '完成这一站！', '下一站：{s}', '你完成了在 {city} 的一天！🎉', '开始第 {n} 天', '关闭', '再练一次', '点一站开始'],
  ar: ['يومك في المدينة', 'يوم في {city}', 'اليوم {n}', '{n} من {m} محطات', 'قهوة الصباح', 'السؤال عن الطريق', 'التسوّق', 'الغداء', 'في الصيدلية', 'في المحطة', 'في الفندق', 'حفلة المساء', 'تدرّب على 10 عبارات', 'أجرِ المحادثة', 'أكمل المحطة السابقة لفتح هذه', 'اكتملت المحطة!', 'المحطة التالية: {s}', 'أنهيت يومك في {city}! 🎉', 'ابدأ اليوم {n}', 'إغلاق', 'تدرّب مجددًا', 'اضغط على محطة لتبدأ'],
  nl: ['Jouw dagje uit', 'Een dag in {city}', 'Dag {n}', '{n} van {m} stops', 'Ochtendkoffie', 'De weg vragen', 'Winkelen', 'Lunch', 'Bij de apotheek', 'Op het station', 'In het hotel', 'Avondfeest', 'Oefen 10 zinnen', 'Voer het gesprek', 'Rond eerst de vorige stop af', 'Stop voltooid!', 'Volgende stop: {s}', 'Je hebt je dag in {city} voltooid! 🎉', 'Begin dag {n}', 'Sluiten', 'Opnieuw oefenen', 'Tik op een stop om te beginnen'],
  tr: ['Şehirde bir günün', '{city} şehrinde bir gün', '{n}. gün', '{m} duraktan {n}', 'Sabah kahvesi', 'Yol sormak', 'Alışveriş', 'Öğle yemeği', 'Eczanede', 'İstasyonda', 'Otelde', 'Akşam partisi', '10 ifade çalış', 'Konuşmayı yap', 'Bunu açmak için önceki durağı bitir', 'Durak tamam!', 'Sonraki durak: {s}', '{city} gününü tamamladın! 🎉', '{n}. günü başlat', 'Kapat', 'Tekrar çalış', 'Başlamak için bir durağa dokun'],
  ja: ['お出かけの一日', '{city}での一日', '{n}日目', '{m}か所中{n}か所', '朝のコーヒー', '道を聞く', '買い物', 'ランチ', '薬局で', '駅で', 'ホテルで', '夜のパーティー', 'フレーズを10個練習', '会話をする', '前の場所をクリアすると解放されます', 'クリア！', '次は：{s}', '{city}での一日を完走！🎉', '{n}日目を始める', '閉じる', 'もう一度練習', '場所をタップしてスタート'],
  ko: ['나의 하루 나들이', '{city}에서의 하루', '{n}일차', '{m}곳 중 {n}곳', '아침 커피', '길 묻기', '쇼핑', '점심', '약국에서', '역에서', '호텔 체크인', '저녁 파티', '문장 10개 연습', '대화하기', '이전 장소를 끝내야 열려요', '완료!', '다음 장소: {s}', '{city}에서의 하루를 마쳤어요! 🎉', '{n}일차 시작', '닫기', '다시 연습', '장소를 눌러 시작하세요'],
  vi: ['Một ngày dạo phố', 'Một ngày ở {city}', 'Ngày {n}', '{n}/{m} điểm dừng', 'Cà phê buổi sáng', 'Hỏi đường', 'Mua sắm', 'Bữa trưa', 'Ở hiệu thuốc', 'Ở nhà ga', 'Nhận phòng khách sạn', 'Tiệc buổi tối', 'Luyện 10 câu', 'Thực hiện hội thoại', 'Hoàn thành điểm trước để mở điểm này', 'Hoàn thành điểm dừng!', 'Điểm tiếp theo: {s}', 'Bạn đã hoàn thành một ngày ở {city}! 🎉', 'Bắt đầu ngày {n}', 'Đóng', 'Luyện lại', 'Chạm vào một điểm để bắt đầu']
};
function t(k, vars) {
  const ui = get('sir_ui', null) || 'en';
  const row = T[ui] || T.en; let v = row[K.indexOf(k)] || T.en[K.indexOf(k)] || k;
  if (vars) for (const a in vars) v = v.split('{' + a + '}').join(vars[a]);
  return v;
}

// ---------- state ----------
const L = () => (typeof lang !== 'undefined' ? lang : 'en');
function state() { const all = get('hs_journey', {}); const s = all[L()] || { day: 1, done: {}, chat: {} }; s.done = s.done || {}; s.chat = s.chat || {}; return s; }
function save(s) { const all = get('hs_journey', {}); all[L()] = s; put('hs_journey', all); }
const city = () => CITY[L()] || 'London';
const doneCount = s => STOPS.filter(x => s.done[x.id]).length;
const unlocked = (s, i) => i === 0 || !!s.done[STOPS[i - 1].id];
const current = s => { const i = STOPS.findIndex(x => !s.done[x.id]); return i < 0 ? STOPS.length - 1 : i; };
const hasSet = x => typeof DATA !== 'undefined' && DATA[L()] && DATA[L()].sets[x.set] && DATA[L()].sets[x.set].length > x.r * 10;
let pending = null; // the stop being practised from the map

// ---------- home card ----------
function card() {
  const el = document.getElementById('jCard'); if (!el) return;
  const s = state(), n = doneCount(s), i = current(s), st = STOPS[i];
  el.innerHTML = `<span class="jc-ic">${st.ic}</span><span class="jc-t"><b>🗺️ ${esc(t('title', { city: city() }))}</b><span>${esc(t('day', { n: s.day }))} · ${esc(t('stops', { n, m: STOPS.length }))} · ${esc(n >= STOPS.length ? '🎉' : t('next', { s: t('s_' + st.id) }))}</span></span>
    <span class="jc-dots">${STOPS.map(x => `<i class="${s.done[x.id] ? 'd' : x === st ? 'c' : ''}"></i>`).join('')}</span>`;
}

// ---------- the map ----------
const css = `
#jCard{display:flex;align-items:center;gap:12px;flex-wrap:wrap;margin:0 0 12px;padding:14px;border-radius:18px;color:#fff;cursor:pointer;background:linear-gradient(135deg,#0369A1,#38BDF8 55%,#FBBF24);box-shadow:0 4px 0 #024a73,0 10px 22px rgba(28,37,99,.14);position:relative;overflow:hidden;animation:jIn .5s cubic-bezier(.2,.9,.3,1.3)}
#jCard .jc-ic{display:grid;place-items:center;width:46px;height:46px;border-radius:50%;background:rgba(255,255,255,.25);font-size:24px;animation:jBob 2.6s ease-in-out infinite}
#jCard .jc-t{flex:1 1 180px;display:flex;flex-direction:column;gap:2px} #jCard .jc-t span{font-size:13px;opacity:.95}
#jCard .jc-dots{display:flex;gap:4px;width:100%} #jCard .jc-dots i{flex:1;height:6px;border-radius:4px;background:rgba(255,255,255,.3)} #jCard .jc-dots i.d{background:#fff} #jCard .jc-dots i.c{background:#FFD166;animation:jPulse 1.4s ease-in-out infinite}
.jmap{position:fixed;inset:0;z-index:900;display:flex;flex-direction:column;background:linear-gradient(180deg,#BAE6FD 0%,#FDE68A 30%,#FDBA74 55%,#C084FC 78%,#312E81 100%);font-family:Inter,system-ui,sans-serif;color:#1C2563;animation:jFade .3s ease}
.jm-top{display:flex;align-items:center;gap:10px;padding:12px 14px;background:rgba(255,255,255,.75);backdrop-filter:blur(6px)}
.jm-top h3{margin:0;font-size:17px;flex:1} .jm-top small{display:block;font-weight:600;color:#4b5590;font-size:12px}
.jm-x{width:40px;height:40px;border-radius:12px;border:0;background:#1C2563;color:#fff;font-size:18px;cursor:pointer}
.jm-scroll{flex:1;overflow-y:auto;position:relative}
.jm-road{position:relative;margin:0 auto;max-width:420px;height:${STOPS.length * 120 + 80}px}
.jm-road svg.path{position:absolute;inset:0;width:100%;height:100%}
.jm-sun{position:absolute;top:18px;right:18px;font-size:34px;animation:jBob 4s ease-in-out infinite}
.jm-moon{position:absolute;bottom:22px;left:22px;font-size:28px}
.jm-deco{position:absolute;font-size:22px;opacity:.8}
.jm-stop{position:absolute;transform:translate(-50%,-50%);width:76px;height:76px;border-radius:50%;border:4px solid #fff;background:#fff;font-size:32px;display:grid;place-items:center;cursor:pointer;box-shadow:0 5px 0 rgba(0,0,0,.18),0 10px 20px rgba(0,0,0,.12);transition:transform .2s;animation:jIn .45s cubic-bezier(.2,.9,.3,1.3) backwards;animation-delay:calc(var(--i) * 70ms)}
.jm-stop.done{background:#22C55E;border-color:#BBF7D0}
.jm-stop.cur{background:#FF8A3D;border-color:#FFE2CC;animation:jIn .45s cubic-bezier(.2,.9,.3,1.3) backwards,jPulseS 1.6s ease-in-out .6s infinite}
.jm-stop.lock{background:#DDE1EC;filter:grayscale(1)}
.jm-stop .lk{position:absolute;bottom:-6px;right:-6px;font-size:16px;background:#fff;border-radius:50%;width:26px;height:26px;display:grid;place-items:center}
.jm-lbl{position:absolute;transform:translate(-50%,0);text-align:center;font-weight:800;font-size:13px;white-space:nowrap;background:rgba(255,255,255,.85);padding:3px 9px;border-radius:999px}
.jm-lbl .st{display:block;font-size:11px;color:#B45309;letter-spacing:1px}
.jm-dog{position:absolute;width:62px;height:62px;transform:translate(-50%,-100%);transition:left .9s cubic-bezier(.4,1.4,.5,1),top .9s cubic-bezier(.4,1.4,.5,1);pointer-events:none;z-index:2}
.jm-dog svg{width:100%;height:100%;display:block;animation:jBob 1.8s ease-in-out infinite;filter:drop-shadow(0 4px 6px rgba(0,0,0,.25))}
.jm-sheet{position:absolute;left:0;right:0;bottom:0;background:#fff;border-radius:22px 22px 0 0;padding:16px 16px 22px;box-shadow:0 -10px 30px rgba(0,0,0,.2);animation:jUp .3s cubic-bezier(.2,.9,.3,1.2);z-index:3}
.jm-sheet h4{margin:0 0 4px;font-size:19px} .jm-sheet p{margin:0 0 12px;color:#667}
.jm-sheet button{display:block;width:100%;border:0;border-radius:14px;padding:13px;margin-top:8px;font:800 16px Inter,system-ui,sans-serif;cursor:pointer}
.jm-sheet .go{background:#FF8A3D;color:#fff;box-shadow:0 3px 0 #d96a22} .jm-sheet .ch{background:#0E9F9A;color:#fff;box-shadow:0 3px 0 #0a7370} .jm-sheet .cl{background:#eef0f8;color:#1C2563}
.jm-fin{position:absolute;left:50%;top:40%;transform:translate(-50%,-50%);width:min(86vw,360px);background:#fff;border-radius:22px;padding:20px;text-align:center;box-shadow:0 20px 50px rgba(0,0,0,.3);z-index:4;animation:jIn .5s cubic-bezier(.2,.9,.3,1.3)}
.jm-fin h4{margin:6px 0 12px;font-size:20px}
.jm-fin button{border:0;border-radius:14px;padding:13px 18px;font:800 16px Inter,system-ui,sans-serif;background:#FF8A3D;color:#fff;cursor:pointer}
@keyframes jIn{from{opacity:0;transform:translate(-50%,-50%) scale(.6)}to{opacity:1}}
#jCard{animation-name:jCardIn}@keyframes jCardIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}
@keyframes jBob{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}
@keyframes jPulse{50%{opacity:.4}}
@keyframes jPulseS{0%,100%{box-shadow:0 5px 0 rgba(0,0,0,.18),0 0 0 0 rgba(255,138,61,.6)}50%{box-shadow:0 5px 0 rgba(0,0,0,.18),0 0 0 14px rgba(255,138,61,0)}}
@keyframes jFade{from{opacity:0}}
@keyframes jUp{from{transform:translateY(100%)}}
@media (prefers-reduced-motion:reduce){.jmap *,#jCard *{animation:none!important}}`;
function addCss() { if (document.getElementById('jCss')) return; const s = document.createElement('style'); s.id = 'jCss'; s.textContent = css; document.head.appendChild(s); }
// zig-zag positions (percent across, px down)
const pos = i => ({ x: [26, 70, 34, 74, 28, 66, 30, 70][i % 8], y: 90 + i * 120 });
let mapEl = null;
function openMap(moveFrom) {
  addCss();
  const s = state(), cur = current(s), finished = doneCount(s) >= STOPS.length;
  if (!mapEl) { mapEl = document.createElement('div'); mapEl.className = 'jmap'; mapEl.setAttribute('role', 'dialog'); document.body.appendChild(mapEl); mapEl.addEventListener('click', onMap); }
  mapEl.dir = get('sir_ui', '') === 'ar' ? 'rtl' : 'ltr';
  const H = STOPS.length * 120 + 80;
  const pts = STOPS.map((x, i) => pos(i));
  const d = pts.map((p, i) => (i ? `S ${(pts[i - 1].x + p.x) / 2 + (i % 2 ? 18 : -18)} ${p.y - 60} ${p.x} ${p.y}` : `M ${p.x} ${p.y}`)).join(' ');
  const deco = ['🌳', '🏠', '🌷', '🏪', '🌳', '⛲', '🌲', '🏛️', '🌳', '🎡'].map((e, i) => `<span class="jm-deco" style="left:${i % 2 ? 6 + (i * 7) % 12 : 82 + (i * 5) % 10}%;top:${60 + i * 92}px">${e}</span>`).join('');
  const dogAt = pos(moveFrom != null ? moveFrom : cur);
  mapEl.innerHTML = `<div class="jm-top"><h3>🗺️ ${esc(t('title', { city: city() }))}<small>${esc(t('day', { n: s.day }))} · ${esc(t('stops', { n: doneCount(s), m: STOPS.length }))} · ${esc(t('tap'))}</small></h3><button class="jm-x" data-jclose aria-label="${esc(t('close'))}">✕</button></div>
    <div class="jm-scroll"><div class="jm-road" style="height:${H}px">
      <svg class="path" viewBox="0 0 100 ${H}" preserveAspectRatio="none"><path d="${d}" fill="none" stroke="#fff" stroke-width="9" stroke-linecap="round" vector-effect="non-scaling-stroke" opacity=".9"/><path d="${d}" fill="none" stroke="#94A3B8" stroke-width="3" stroke-dasharray="10 10" vector-effect="non-scaling-stroke"/></svg>
      <span class="jm-sun">☀️</span><span class="jm-moon">🌙</span>${deco}
      ${STOPS.map((x, i) => { const p = pts[i], dn = s.done[x.id], lk = !unlocked(s, i);
        return `<button class="jm-stop${dn ? ' done' : lk ? ' lock' : i === cur ? ' cur' : ''}" style="left:${p.x}%;top:${p.y}px;--i:${i}" data-stop="${i}" aria-label="${esc(t('s_' + x.id))}">${x.ic}${lk ? '<span class="lk">🔒</span>' : ''}</button>
        <span class="jm-lbl" style="left:${p.x}%;top:${p.y + 44}px">${esc(t('s_' + x.id))}${dn ? `<span class="st">${'★'.repeat(Math.min(3, dn))}${s.chat[x.id] ? ' 💬' : ''}</span>` : ''}</span>`; }).join('')}
      <div class="jm-dog" id="jDog" style="left:${dogAt.x}%;top:${dogAt.y - 34}px">${typeof coachFace === 'function' ? coachFace(finished ? 'celebrate' : 'happy') : ''}</div>
    </div></div>
    ${finished ? `<div class="jm-fin"><div style="font-size:46px">🎉</div><h4>${esc(t('finish', { city: city() }))}</h4><button data-newday>${esc(t('newDay', { n: s.day + 1 }))}</button></div>` : ''}`;
  mapEl.style.display = 'flex'; document.body.style.overflow = 'hidden';
  const sc = mapEl.querySelector('.jm-scroll'); sc.scrollTop = Math.max(0, dogAt.y - sc.clientHeight / 2);
  if (moveFrom != null && moveFrom !== cur) setTimeout(() => {
    const p = pos(cur), dog = document.getElementById('jDog'); if (!dog) return;
    dog.style.left = p.x + '%'; dog.style.top = (p.y - 34) + 'px';
    sc.scrollTo({ top: Math.max(0, p.y - sc.clientHeight / 2), behavior: 'smooth' });
    if (window.HSFX) HSFX.sound('pop');
  }, 700);
  if (finished && window.HSFX) { HSFX.sound('win'); HSFX.confetti(); }
}
function closeMap() { if (mapEl) { mapEl.style.display = 'none'; mapEl.innerHTML = ''; } document.body.style.overflow = ''; card(); }
function sheet(i) {
  const s = state(), x = STOPS[i], old = mapEl.querySelector('.jm-sheet'); if (old) old.remove();
  const div = document.createElement('div'); div.className = 'jm-sheet';
  if (!unlocked(s, i)) div.innerHTML = `<h4>${x.ic} ${esc(t('s_' + x.id))}</h4><p>🔒 ${esc(t('locked'))}</p><button class="cl" data-jsheetx>${esc(t('close'))}</button>`;
  else div.innerHTML = `<h4>${x.ic} ${esc(t('s_' + x.id))}${s.done[x.id] ? ' ✅' : ''}</h4>
    ${hasSet(x) ? `<button class="go" data-jgo="${i}">▶ ${esc(s.done[x.id] ? t('again') : t('practise'))}</button>` : ''}
    ${x.chat && window.hsChatsOn && window.hsChatScene ? `<button class="ch" data-jchat="${i}">💬 ${esc(t('chat'))}${s.chat[x.id] ? ' ✅' : ''}</button>` : ''}
    <button class="cl" data-jsheetx>${esc(t('close'))}</button>`;
  mapEl.appendChild(div);
  if (window.HSFX) HSFX.sound('tick');
}
function onMap(e) {
  const b = e.target.closest('button'); if (!b) { const sh = mapEl.querySelector('.jm-sheet'); if (sh && !e.target.closest('.jm-sheet')) sh.remove(); return; }
  const d = b.dataset;
  if (d.jclose !== undefined) return closeMap();
  if (d.jsheetx !== undefined) { b.closest('.jm-sheet').remove(); return; }
  if (d.stop !== undefined) return sheet(+d.stop);
  if (d.jgo !== undefined) {
    const x = STOPS[+d.jgo]; pending = { i: +d.jgo, from: current(state()) };
    closeMap();
    if (window.hsStartRound) window.hsStartRound(x.set, x.r);
    return;
  }
  if (d.jchat !== undefined) { const x = STOPS[+d.jchat]; pending = { i: +d.jchat, from: current(state()), chat: true }; closeMap(); window.hsChatScene(x.chat); return; }
  if (d.newday !== undefined) { const s = state(); s.day++; s.done = {}; s.chat = {}; save(s); if (window.HSFX) HSFX.sound('good'); openMap(); }
}

// ---------- results from lessons and chats ----------
let reopen = false;
window.addEventListener('hs-round', e => {
  if (!pending || pending.chat) return;
  const x = STOPS[pending.i], dt = e.detail || {};
  if (dt.set !== x.set || dt.round !== x.r) return;
  const s = state();
  if ((dt.stars || 0) >= 1) {
    const first = !s.done[x.id];
    s.done[x.id] = Math.max(s.done[x.id] || 0, dt.stars); save(s);
    if (first) { if (window.HSFX) { HSFX.xp(25); HSFX.toast('📍 ' + t('done') + (pending.i + 1 < STOPS.length ? ' ' + t('next', { s: t('s_' + STOPS[pending.i + 1].id) }) : ''), 'goal'); } reopen = true; }
  }
  card();
});
window.addEventListener('hs-chat-done', e => {
  if (!pending || !pending.chat) return;
  const x = STOPS[pending.i]; if ((e.detail || {}).scene !== x.chat) return;
  const s = state(); s.chat[x.id] = true; if (!s.done[x.id]) s.done[x.id] = 1; save(s); reopen = true; card();
  if (window.HSFX) HSFX.xp(15);
});
// back on the map, with the dog walking on, when the lesson closes
new MutationObserver(() => {
  if (reopen && pending && !document.body.classList.contains('lesson-on')) { const from = pending.from; reopen = false; pending = null; setTimeout(() => openMap(from), 300); }
}).observe(document.body, { attributes: true, attributeFilter: ['class'] });

function mount() {
  addCss();
  if (document.getElementById('jCard')) return card();
  const anchor = document.getElementById('d5Banner'); if (!anchor) return;
  const el = document.createElement('div'); el.id = 'jCard'; el.setAttribute('role', 'button'); el.tabIndex = 0;
  el.onclick = () => openMap(); el.onkeydown = ev => { if (ev.key === 'Enter') openMap(); };
  anchor.parentNode.insertBefore(el, anchor.nextSibling);
  card();
}
window.HSJourney = { open: openMap, refresh: card };
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount); else mount();
window.addEventListener('hs-dress', card);
document.addEventListener('change', e => { if (e.target && (e.target.id === 'lang' || e.target.id === 'learn')) setTimeout(card, 50); });
})();
