// Harlo: build your own dog. Choose a name, coat, ears, colours and a voice; your dog can then be your tutor
// (in place of Harley or Lilou) and wear outfits from Harley's shop (dress.js, wardrobe 'mydog').
// The voice still comes from Harley's or Lilou's voice (cfg.voice), so the server needs nothing new.
// API: HSDog.active()  your dog is switched on as the tutor
//      HSDog.cfg()     the saved design (or null)
//      HSDog.face(m)   small 300×300 drawing ('happy' | 'puzzled' | 'celebrate'), same layout as Harley's
//      HSDog.name()    its name
//      HSDog.open()    the builder
// Stored: hs_mydog = { name, coat, ears, fur, earc, patch, bg, voice, on }
(function () {
'use strict';
const get = (k, d) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } };
const put = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} };
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const FURS = ['#FFFFFF', '#FFF1DC', '#F6C68B', '#E3A04F', '#B7793F', '#6B4226', '#3A3A3A', '#B9BEC9'];
const BGS = ['#3346C8', '#B9478A', '#0E9F9A', '#E0457B', '#FF8A3D', '#16A34A', '#7B2FD0', '#1C2563'];
const COATS = ['fluffy', 'smooth', 'curly'], EARS = ['floppy', 'pointy', 'long'], PATCHES = ['none', 'eye', 'spots'];
const DEF = { name: '', coat: 'fluffy', ears: 'floppy', fur: '#F6C68B', earc: '#B7793F', patch: 'none', bg: '#0E9F9A', voice: 'harley', on: false };
const cfg = () => { const c = get('hs_mydog', null); return c && c.name ? Object.assign({}, DEF, c) : null; };
const active = () => { const c = cfg(); return !!(c && c.on); };

// a little darker, for shading
function shade(hex, k) {
  const n = parseInt(hex.slice(1), 16), f = 1 - (k || 0.12);
  const r = Math.round(((n >> 16) & 255) * f), g = Math.round(((n >> 8) & 255) * f), b = Math.round((n & 255) * f);
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}
const ink = c => { const n = parseInt(c.fur.slice(1), 16), l = (((n >> 16) & 255) * 299 + ((n >> 8) & 255) * 587 + (n & 255) * 114) / 1000; return l < 90 ? '#F5F5F5' : '#1C2563'; };
// ring of puffs around a centre
function puffs(cx, cy, R, r, n, fill, off) { let s = ''; for (let i = 0; i < n; i++) { const a = (i / n) * Math.PI * 2 + (off || 0); s += `<circle cx="${(cx + R * Math.cos(a)).toFixed(1)}" cy="${(cy + R * Math.sin(a)).toFixed(1)}" r="${r}" fill="${fill}"/>`; } return s; }
// the head (no background): shared by the small face and the shop previews
function headParts(c, cy) {
  cy = cy || 148; const fur = c.fur, ec = c.earc, sh = shade(fur);
  const E = {
    floppy: [`<ellipse cx="74" cy="${cy + 22}" rx="30" ry="46" fill="${ec}" transform="rotate(18 74 ${cy + 22})"/>`, `<ellipse cx="226" cy="${cy + 22}" rx="30" ry="46" fill="${ec}" transform="rotate(-18 226 ${cy + 22})"/>`],
    pointy: [`<path d="M86 ${cy - 30} L80 ${cy - 112} L140 ${cy - 62} Z" fill="${ec}"/><path d="M96 ${cy - 44} L92 ${cy - 92} L128 ${cy - 62} Z" fill="#F7B8C4" opacity=".7"/>`, `<path d="M214 ${cy - 30} L220 ${cy - 112} L160 ${cy - 62} Z" fill="${ec}"/><path d="M204 ${cy - 44} L208 ${cy - 92} L172 ${cy - 62} Z" fill="#F7B8C4" opacity=".7"/>`],
    long: [`<ellipse cx="70" cy="${cy + 52}" rx="26" ry="66" fill="${ec}"/>`, `<ellipse cx="230" cy="${cy + 52}" rx="26" ry="66" fill="${ec}"/>`]
  }[c.ears] || ['', ''];
  const ears = E[0] + E[1];
  const coat = c.coat === 'smooth' ? `<circle cx="150" cy="${cy}" r="92" fill="${fur}"/>`
    : c.coat === 'curly' ? puffs(150, cy, 76, 24, 16, sh) + puffs(150, cy - 2, 72, 23, 16, fur, 0.2) + `<circle cx="150" cy="${cy}" r="74" fill="${fur}"/>`
    : puffs(150, cy, 62, 33, 10, fur) + `<circle cx="150" cy="${cy}" r="70" fill="${fur}"/>`;
  const patch = c.patch === 'eye' ? `<ellipse cx="124" cy="${cy - 10}" rx="24" ry="22" fill="${ec}"/>`
    : c.patch === 'spots' ? `<circle cx="196" cy="${cy - 38}" r="14" fill="${ec}"/><circle cx="104" cy="${cy + 30}" r="10" fill="${ec}"/><circle cx="182" cy="${cy + 44}" r="8" fill="${ec}"/>` : '';
  return { ears, earL: E[0], earR: E[1], coat, patch };
}
function face(m, c) {
  c = c || cfg() || DEF; m = m || 'happy';
  const { ears, coat, patch } = headParts(c), k = ink(c);
  const muzzle = c.fur === '#FFFFFF' ? '' : `<ellipse cx="150" cy="170" rx="34" ry="24" fill="#FFFFFF" opacity=".4"/>`;
  let featuresHappy = `<circle cx="125" cy="138" r="9" fill="${k === '#1C2563' ? '#1C2563' : '#111'}"/><circle cx="175" cy="138" r="9" fill="${k === '#1C2563' ? '#1C2563' : '#111'}"/><circle cx="128" cy="135" r="3" fill="#fff"/><circle cx="178" cy="135" r="3" fill="#fff"/><ellipse cx="150" cy="163" rx="13" ry="9" fill="#1C2563"/><path d="M143 180 q7 16 14 0 z" fill="#F07C92"/><path d="M150 171 q-10 14 -22 4 M150 171 q10 14 22 4" fill="none" stroke="${k}" stroke-width="4" stroke-linecap="round"/>`;
  if (m === 'celebrate') featuresHappy = `<path d="M114 140 q11 -14 22 0 M164 140 q11 -14 22 0" fill="none" stroke="${k}" stroke-width="5" stroke-linecap="round"/><circle cx="108" cy="168" r="10" fill="#F7B8C4" opacity="0.8"/><circle cx="192" cy="168" r="10" fill="#F7B8C4" opacity="0.8"/><ellipse cx="150" cy="160" rx="13" ry="9" fill="#1C2563"/><path d="M126 174 q24 34 48 0 z" fill="#1C2563"/><path d="M138 186 q12 16 24 0 z" fill="#F07C92"/>`;
  const head = `${ears}${coat}${patch}${muzzle}${featuresHappy}`;
  const body = m === 'puzzled' ? `<text x="238" y="86" text-anchor="middle" font-family="Arial, sans-serif" font-weight="700" font-size="54" fill="#fff">?</text><g transform="rotate(14 150 148)">${head}</g>` : head;
  return `<svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg"><rect x="10" y="10" width="280" height="280" rx="64" fill="${c.bg}"/><path d="M92 228 l-26 40 l52 -24 z" fill="#fff"/>${body}</svg>`;
}
// For the animated talking head (talkhead.js): colours and shapes in its own layout (head centre 150,150).
function talkParts(c) {
  const { earL, earR, coat, patch } = headParts(c, 150);
  return { fur: c.fur, shade: shade(c.fur), earL, earR, coat, patch, ink: ink(c) };
}

// ---------- text ----------
const K = ['title', 'name', 'namePh', 'voice', 'v_harley', 'v_lilou', 'coat', 'c_fluffy', 'c_smooth', 'c_curly', 'ears', 'e_floppy', 'e_pointy', 'e_long', 'fur', 'earc', 'patch', 'p_none', 'p_eye', 'p_spots', 'bg', 'use', 'save', 'saved', 'needName', 'make', 'cancel'];
const T = {
  en: ['Make your own dog', 'Name', "Your dog's name", 'Voice', 'Like Harley', 'Like Lilou', 'Coat', 'Fluffy', 'Smooth', 'Curly', 'Ears', 'Floppy', 'Pointy', 'Long', 'Fur colour', 'Ear colour', 'Markings', 'None', 'Eye patch', 'Spots', 'Background', 'Use as my tutor (instead of Harley)', 'Save', 'Saved! {name} is ready 🐶', 'Give your dog a name', 'Your own dog', 'Cancel'],
  es: ['Crea tu propio perro', 'Nombre', 'El nombre de tu perro', 'Voz', 'Como Harley', 'Como Lilou', 'Pelaje', 'Esponjoso', 'Liso', 'Rizado', 'Orejas', 'Caídas', 'Puntiagudas', 'Largas', 'Color del pelo', 'Color de las orejas', 'Manchas', 'Ninguna', 'Parche en el ojo', 'Lunares', 'Fondo', 'Usarlo como mi tutor (en lugar de Harley)', 'Guardar', '¡Guardado! {name} está listo 🐶', 'Ponle un nombre a tu perro', 'Tu propio perro', 'Cancelar'],
  fr: ['Crée ton propre chien', 'Nom', 'Le nom de ton chien', 'Voix', 'Comme Harley', 'Comme Lilou', 'Pelage', 'Duveteux', 'Lisse', 'Bouclé', 'Oreilles', 'Tombantes', 'Pointues', 'Longues', 'Couleur du pelage', 'Couleur des oreilles', 'Taches', 'Aucune', 'Tache sur l’œil', 'Points', 'Fond', 'En faire mon coach (à la place de Harley)', 'Enregistrer', 'Enregistré ! {name} est prêt 🐶', 'Donne un nom à ton chien', 'Ton propre chien', 'Annuler'],
  it: ['Crea il tuo cane', 'Nome', 'Il nome del tuo cane', 'Voce', 'Come Harley', 'Come Lilou', 'Pelo', 'Soffice', 'Liscio', 'Riccio', 'Orecchie', 'Cadenti', 'A punta', 'Lunghe', 'Colore del pelo', 'Colore delle orecchie', 'Macchie', 'Nessuna', "Macchia sull'occhio", 'Puntini', 'Sfondo', 'Usalo come mio coach (al posto di Harley)', 'Salva', 'Salvato! {name} è pronto 🐶', 'Dai un nome al tuo cane', 'Il tuo cane', 'Annulla'],
  de: ['Gestalte deinen eigenen Hund', 'Name', 'Name deines Hundes', 'Stimme', 'Wie Harley', 'Wie Lilou', 'Fell', 'Flauschig', 'Glatt', 'Lockig', 'Ohren', 'Hängeohren', 'Spitz', 'Lang', 'Fellfarbe', 'Ohrenfarbe', 'Zeichnung', 'Keine', 'Augenfleck', 'Punkte', 'Hintergrund', 'Als meinen Coach nutzen (statt Harley)', 'Speichern', 'Gespeichert! {name} ist bereit 🐶', 'Gib deinem Hund einen Namen', 'Dein eigener Hund', 'Abbrechen'],
  pt: ['Cria o teu próprio cão', 'Nome', 'O nome do teu cão', 'Voz', 'Como o Harley', 'Como a Lilou', 'Pelo', 'Fofo', 'Liso', 'Encaracolado', 'Orelhas', 'Caídas', 'Pontiagudas', 'Compridas', 'Cor do pelo', 'Cor das orelhas', 'Manchas', 'Nenhuma', 'Mancha no olho', 'Pintas', 'Fundo', 'Usar como o meu tutor (em vez do Harley)', 'Guardar', 'Guardado! {name} está pronto 🐶', 'Dá um nome ao teu cão', 'O teu próprio cão', 'Cancelar'],
  pl: ['Stwórz własnego psa', 'Imię', 'Imię twojego psa', 'Głos', 'Jak Harley', 'Jak Lilou', 'Sierść', 'Puszysta', 'Gładka', 'Kręcona', 'Uszy', 'Klapnięte', 'Spiczaste', 'Długie', 'Kolor sierści', 'Kolor uszu', 'Łaty', 'Brak', 'Łata na oku', 'Kropki', 'Tło', 'Ustaw jako mojego nauczyciela (zamiast Harleya)', 'Zapisz', 'Zapisano! {name} jest gotowy 🐶', 'Nadaj psu imię', 'Twój własny pies', 'Anuluj'],
  ro: ['Creează-ți propriul câine', 'Nume', 'Numele câinelui tău', 'Voce', 'Ca Harley', 'Ca Lilou', 'Blană', 'Pufoasă', 'Netedă', 'Creață', 'Urechi', 'Clăpăuge', 'Ascuțite', 'Lungi', 'Culoarea blănii', 'Culoarea urechilor', 'Pete', 'Fără', 'Pată pe ochi', 'Buline', 'Fundal', 'Folosește-l ca tutore (în locul lui Harley)', 'Salvează', 'Salvat! {name} e gata 🐶', 'Dă-i un nume câinelui', 'Câinele tău', 'Anulează'],
  uk: ['Створи власного песика', 'Ім’я', 'Ім’я твого песика', 'Голос', 'Як Harley', 'Як Lilou', 'Шерсть', 'Пухнаста', 'Гладка', 'Кучерява', 'Вуха', 'Висячі', 'Гострі', 'Довгі', 'Колір шерсті', 'Колір вух', 'Плями', 'Немає', 'Пляма на оці', 'Цятки', 'Фон', 'Зробити моїм тренером (замість Harley)', 'Зберегти', 'Збережено! {name} готовий 🐶', 'Дай песикові ім’я', 'Твій власний песик', 'Скасувати'],
  zh: ['创建你自己的狗狗', '名字', '狗狗的名字', '声音', '像 Harley', '像 Lilou', '毛发', '蓬松', '顺滑', '卷毛', '耳朵', '垂耳', '尖耳', '长耳', '毛色', '耳朵颜色', '斑纹', '无', '眼罩斑', '斑点', '背景', '设为我的老师（替代 Harley）', '保存', '已保存！{name} 准备好了 🐶', '给狗狗起个名字', '你的狗狗', '取消'],
  ar: ['اصنع كلبك الخاص', 'الاسم', 'اسم كلبك', 'الصوت', 'مثل Harley', 'مثل Lilou', 'الفرو', 'منفوش', 'ناعم', 'مجعد', 'الأذنان', 'متدليتان', 'مدببتان', 'طويلتان', 'لون الفرو', 'لون الأذنين', 'العلامات', 'لا شيء', 'بقعة حول العين', 'بقع', 'الخلفية', 'اجعله مدرّبي (بدلًا من Harley)', 'حفظ', 'تم الحفظ! {name} جاهز 🐶', 'اختر اسمًا لكلبك', 'كلبك الخاص', 'إلغاء'],
  nl: ['Maak je eigen hond', 'Naam', 'Naam van je hond', 'Stem', 'Zoals Harley', 'Zoals Lilou', 'Vacht', 'Pluizig', 'Glad', 'Krullend', 'Oren', 'Hangend', 'Puntig', 'Lang', 'Vachtkleur', 'Oorkleur', 'Vlekken', 'Geen', 'Oogvlek', 'Stippen', 'Achtergrond', 'Gebruik als mijn coach (in plaats van Harley)', 'Opslaan', 'Opgeslagen! {name} is klaar 🐶', 'Geef je hond een naam', 'Je eigen hond', 'Annuleren'],
  tr: ['Kendi köpeğini yap', 'Ad', 'Köpeğinin adı', 'Ses', 'Harley gibi', 'Lilou gibi', 'Tüy', 'Kabarık', 'Düz', 'Kıvırcık', 'Kulaklar', 'Sarkık', 'Sivri', 'Uzun', 'Tüy rengi', 'Kulak rengi', 'Desen', 'Yok', 'Göz lekesi', 'Benekler', 'Arka plan', 'Öğretmenim yap (Harley yerine)', 'Kaydet', 'Kaydedildi! {name} hazır 🐶', 'Köpeğine bir ad ver', 'Kendi köpeğin', 'İptal'],
  ja: ['自分の犬を作ろう', '名前', '犬の名前', '声', 'Harley 風', 'Lilou 風', '毛並み', 'ふわふわ', 'なめらか', 'くるくる', '耳', 'たれ耳', '立ち耳', '長い耳', '毛の色', '耳の色', '模様', 'なし', '目のまわり', '水玉', '背景', '先生にする（Harley の代わりに）', '保存', '保存しました！{name} の準備OK 🐶', '犬に名前をつけてください', 'あなたの犬', 'キャンセル'],
  ko: ['나만의 강아지 만들기', '이름', '강아지 이름', '목소리', 'Harley처럼', 'Lilou처럼', '털', '복슬복슬', '매끈', '곱슬', '귀', '처진 귀', '뾰족 귀', '긴 귀', '털 색', '귀 색', '무늬', '없음', '눈 반점', '점박이', '배경', '내 선생님으로 사용 (Harley 대신)', '저장', '저장했어요! {name} 준비 완료 🐶', '강아지 이름을 지어 주세요', '나만의 강아지', '취소'],
  vi: ['Tạo chú chó của riêng bạn', 'Tên', 'Tên chú chó', 'Giọng', 'Giống Harley', 'Giống Lilou', 'Lông', 'Bông xù', 'Mượt', 'Xoăn', 'Tai', 'Cụp', 'Nhọn', 'Dài', 'Màu lông', 'Màu tai', 'Đốm', 'Không', 'Đốm quanh mắt', 'Chấm', 'Nền', 'Dùng làm gia sư của tôi (thay Harley)', 'Lưu', 'Đã lưu! {name} đã sẵn sàng 🐶', 'Hãy đặt tên cho chú chó', 'Chú chó của bạn', 'Hủy']
};
function t(k, vars) {
  const ui = get('sir_ui', null) || (navigator.language || 'en').slice(0, 2).toLowerCase();
  const row = T[ui] || T.en; let v = row[K.indexOf(k)] || T.en[K.indexOf(k)] || k;
  if (vars) for (const a in vars) v = v.split('{' + a + '}').join(vars[a]);
  return v;
}

// ---------- the builder ----------
const css = `
.hsd{border:0;border-radius:24px;padding:0;width:100%;max-width:min(94vw,440px);max-height:92vh;box-shadow:0 20px 50px rgba(28,37,99,.35)}
.hsd::backdrop{background:rgba(20,26,70,.5)}
.hsd-p{font:15px/1.4 Inter,system-ui,sans-serif;color:#1C2563}
.hsd-top{position:sticky;top:0;z-index:1;background:linear-gradient(150deg,#0E9F9A,#2DD4BF);color:#fff;padding:12px 16px;text-align:center}
.hsd-top h3{margin:0 0 6px;font-size:19px}
.hsd-prev{width:130px;height:130px;margin:0 auto;animation:hsdBob 2.4s ease-in-out infinite}
.hsd-prev svg{width:100%;height:100%;display:block;filter:drop-shadow(0 6px 10px rgba(0,0,0,.18))}
.hsd-body{padding:6px 16px 4px}
.hsd-l{display:block;font-weight:800;font-size:13px;text-transform:uppercase;letter-spacing:.04em;color:#667;margin:12px 0 6px}
.hsd-in{width:100%;box-sizing:border-box;border:1px solid #dfe3f0;border-radius:12px;padding:11px;font:16px Inter,system-ui,sans-serif}
.hsd-ch{display:flex;flex-wrap:wrap;gap:6px}
.hsd-ch button{border:1px solid #dfe3f0;background:#fff;border-radius:999px;padding:8px 12px;font:700 14px Inter,system-ui,sans-serif;color:#1C2563;cursor:pointer}
.hsd-ch button.on{background:#0E9F9A;border-color:#0E9F9A;color:#fff;animation:hsdPop .35s cubic-bezier(.3,1.6,.5,1)}
.hsd-sw{display:flex;flex-wrap:wrap;gap:8px}
.hsd-sw button{width:36px;height:36px;border-radius:50%;border:3px solid #fff;box-shadow:0 0 0 1px #dfe3f0;cursor:pointer}
.hsd-sw button.on{box-shadow:0 0 0 3px #0E9F9A;transform:scale(1.1)}
.hsd-use{display:flex;align-items:center;gap:10px;margin:16px 0 4px;font-weight:700}
.hsd-use input{width:22px;height:22px;accent-color:#0E9F9A}
.hsd-msg{min-height:20px;color:#E0457B;font-weight:700;margin:6px 0 0;text-align:center}
.hsd-btns{display:flex;gap:8px;padding:10px 16px 16px}
.hsd-btns button{flex:1;border:0;border-radius:14px;padding:12px;font:800 15px Inter,system-ui,sans-serif;cursor:pointer}
.hsd-btns .sv{background:#0E9F9A;color:#fff;box-shadow:0 3px 0 #0a7370} .hsd-btns .cn{background:#eef0f8;color:#1C2563}
@keyframes hsdBob{0%,100%{transform:translateY(0) rotate(-3deg)}50%{transform:translateY(-6px) rotate(3deg)}}
@keyframes hsdPop{40%{transform:scale(1.12)}}
@media (prefers-reduced-motion:reduce){.hsd *{animation:none!important}}`;
let dlg = null, draft = null;
function addCss() { if (document.getElementById('hsdCss')) return; const s = document.createElement('style'); s.id = 'hsdCss'; s.textContent = css; document.head.appendChild(s); }
function preview() { const p = dlg && dlg.querySelector('.hsd-prev'); if (p) p.innerHTML = face('happy', draft); }
function fill(msg) {
  const ch = (key, list, label) => `<div class="hsd-ch">${list.map(v => `<button type="button" data-k="${key}" data-v="${v}" class="${draft[key] === v ? 'on' : ''}">${esc(t(label(v)))}</button>`).join('')}</div>`;
  const sw = (key, list) => `<div class="hsd-sw">${list.map(v => `<button type="button" data-k="${key}" data-v="${v}" class="${draft[key] === v ? 'on' : ''}" style="background:${v}" aria-label="${v}"></button>`).join('')}</div>`;
  dlg.dir = get('sir_ui', '') === 'ar' ? 'rtl' : 'ltr';
  dlg.innerHTML = `<div class="hsd-p"><div class="hsd-top"><h3>🐶 ${esc(t('title'))}</h3><div class="hsd-prev"></div></div>
    <div class="hsd-body">
      <label class="hsd-l" for="hsdName">${esc(t('name'))}</label><input id="hsdName" class="hsd-in" maxlength="20" value="${esc(draft.name)}" placeholder="${esc(t('namePh'))}" autocomplete="off">
      <span class="hsd-l">${esc(t('coat'))}</span>${ch('coat', COATS, v => 'c_' + v)}
      <span class="hsd-l">${esc(t('ears'))}</span>${ch('ears', EARS, v => 'e_' + v)}
      <span class="hsd-l">${esc(t('fur'))}</span>${sw('fur', FURS)}
      <span class="hsd-l">${esc(t('earc'))}</span>${sw('earc', FURS)}
      <span class="hsd-l">${esc(t('patch'))}</span>${ch('patch', PATCHES, v => 'p_' + v)}
      <span class="hsd-l">${esc(t('bg'))}</span>${sw('bg', BGS)}
      <span class="hsd-l">${esc(t('voice'))}</span>${ch('voice', ['harley', 'lilou'], v => 'v_' + v)}
      <label class="hsd-use"><input type="checkbox" id="hsdUse" ${draft.on ? 'checked' : ''}> ${esc(t('use'))}</label>
      <p class="hsd-msg">${esc(msg || '')}</p></div>
    <div class="hsd-btns"><button type="button" class="cn" data-cancel>${esc(t('cancel'))}</button><button type="button" class="sv" data-save>✓ ${esc(t('save'))}</button></div></div>`;
  preview();
}
function open() {
  addCss();
  if (!dlg) {
    dlg = document.createElement('dialog'); dlg.className = 'hsd'; document.body.appendChild(dlg);
    dlg.addEventListener('input', e => { if (e.target.id === 'hsdName') draft.name = e.target.value.slice(0, 20); if (e.target.id === 'hsdUse') draft.on = e.target.checked; });
    dlg.addEventListener('change', e => { if (e.target.id === 'hsdUse') draft.on = e.target.checked; });
    dlg.addEventListener('click', e => {
      if (e.target === dlg) return dlg.close();
      const b = e.target.closest('button'); if (!b) return;
      if (b.dataset.k) {
        draft[b.dataset.k] = b.dataset.v;
        b.parentNode.querySelectorAll('button').forEach(x => x.classList.toggle('on', x === b));
        if (window.HSFX) HSFX.sound('tick');
        preview(); return;
      }
      if (b.dataset.cancel !== undefined) return dlg.close();
      if (b.dataset.save !== undefined) {
        const nm = String(draft.name || '').trim();
        if (!nm) { const m = dlg.querySelector('.hsd-msg'); if (m) m.textContent = t('needName'); const i = dlg.querySelector('#hsdName'); if (i) i.focus(); return; }
        draft.name = nm; put('hs_mydog', draft);
        if (window.HSFX) { HSFX.sound('win'); HSFX.confetti(); HSFX.toast(t('saved', { name: nm }), 'goal'); }
        dlg.close();
        window.dispatchEvent(new CustomEvent('hs-dress'));
      }
    });
  }
  draft = Object.assign({}, DEF, cfg() || { on: true });
  fill();
  try { dlg.showModal(); } catch (e) { dlg.setAttribute('open', ''); }
}

window.HSDog = { active, cfg, face, open, talkParts, name: () => (cfg() || {}).name || '', label: () => t('make') };
})();
