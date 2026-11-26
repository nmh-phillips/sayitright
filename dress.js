// Harley Says: Harley's shop. Spend the XP you've earned (fx.js) on hats, glasses, neckwear and hairstyles for
// Harley and Lilou, or on treats (a streak freeze, a biscuit). What they wear shows on every drawing of them in the app.
// API: HSDress(svg, who)        add the outfit of 'harley' | 'lilou' to one of the 300×300 face drawings
//      HSDress.layer(who)       the outfit on its own (an SVG <g>), for drawings that place it themselves (talkhead.js)
//      HSShop.open()            open the shop
// Stored: hs_shop = { spent, owned: [ids], wear: { harley: { hat, eyes, neck, hair }, lilou: {...} }, biscuits }
(function () {
'use strict';
const get = (k, d) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } };
const put = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} };
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

// ---------- the items (drawn on the 300×300 face: head centre ~150,148, eyes at y≈138, chin ≈ y 240) ----------
const ITEMS = {
  // hats
  party: { slot: 'hat', price: 100, svg: '<g><path d="M118 74 L150 4 L182 74 Z" fill="#FF8A3D"/><path d="M127 54 L173 54 L168 64 L132 64 Z M138 30 L162 30 L159 38 L141 38 Z" fill="#FFD166"/><circle cx="150" cy="6" r="10" fill="#E0457B"/><path d="M114 74 h72" stroke="#E0457B" stroke-width="7" stroke-linecap="round"/></g>' },
  beanie: { slot: 'hat', price: 150, svg: '<g><path d="M86 82 Q150 -4 214 82 Z" fill="#3346C8"/><rect x="80" y="70" width="140" height="22" rx="11" fill="#6C7BFF"/><path d="M96 74 v14 M112 74 v14 M128 74 v14 M144 74 v14 M160 74 v14 M176 74 v14 M192 74 v14 M206 76 v12" stroke="#3346C8" stroke-width="3" opacity=".5"/><circle cx="150" cy="22" r="16" fill="#FFD166"/></g>' },
  cap: { slot: 'hat', price: 150, svg: '<g><path d="M92 84 Q150 6 208 84 Z" fill="#DC2626"/><path d="M150 26 v56" stroke="#991b1b" stroke-width="3"/><path d="M180 80 Q236 74 252 92 Q214 98 180 92 Z" fill="#991b1b"/><circle cx="150" cy="28" r="6" fill="#991b1b"/></g>' },
  crown: { slot: 'hat', price: 400, svg: '<g><path d="M100 82 L96 30 L124 56 L150 18 L176 56 L204 30 L200 82 Z" fill="#FFC531" stroke="#D99A00" stroke-width="4" stroke-linejoin="round"/><circle cx="150" cy="62" r="8" fill="#E0457B"/><circle cx="120" cy="68" r="6" fill="#38BDF8"/><circle cx="180" cy="68" r="6" fill="#22C55E"/><circle cx="96" cy="28" r="6" fill="#FFC531"/><circle cx="150" cy="16" r="6" fill="#FFC531"/><circle cx="204" cy="28" r="6" fill="#FFC531"/></g>' },
  chef: { slot: 'hat', price: 200, svg: '<g><rect x="108" y="54" width="84" height="30" rx="6" fill="#fff" stroke="#d6dae8" stroke-width="3"/><circle cx="118" cy="40" r="24" fill="#fff" stroke="#d6dae8" stroke-width="3"/><circle cx="182" cy="40" r="24" fill="#fff" stroke="#d6dae8" stroke-width="3"/><circle cx="150" cy="26" r="30" fill="#fff" stroke="#d6dae8" stroke-width="3"/><rect x="110" y="50" width="80" height="20" fill="#fff"/></g>' },
  grad: { slot: 'hat', price: 300, svg: '<g><path d="M112 58 Q150 92 188 58 L188 80 Q150 100 112 80 Z" fill="#1C2563"/><path d="M150 18 L234 46 L150 74 L66 46 Z" fill="#1C2563"/><circle cx="150" cy="46" r="6" fill="#FFC531"/><path d="M150 46 L216 56 L218 92" stroke="#FFC531" stroke-width="4" fill="none"/><rect x="212" y="90" width="12" height="18" rx="3" fill="#FFC531"/></g>' },
  cowboy: { slot: 'hat', price: 250, svg: '<g><path d="M106 70 Q104 18 132 22 Q150 34 168 22 Q196 18 194 70 Z" fill="#A16207"/><path d="M106 60 h88" stroke="#713F12" stroke-width="8"/><path d="M52 72 Q150 104 248 72 Q240 92 150 94 Q60 92 52 72 Z" fill="#854D0E"/></g>' },
  flower: { slot: 'hat', price: 120, svg: '<g transform="translate(206 76)"><circle cx="0" cy="-16" r="12" fill="#FF8FB1"/><circle cx="15" cy="-5" r="12" fill="#FF8FB1"/><circle cx="9" cy="13" r="12" fill="#FF8FB1"/><circle cx="-9" cy="13" r="12" fill="#FF8FB1"/><circle cx="-15" cy="-5" r="12" fill="#FF8FB1"/><circle r="9" fill="#FFD166"/></g>' },
  // glasses
  shades: { slot: 'eyes', price: 120, svg: '<g><path d="M98 126 h48 q2 26 -22 26 q-26 0 -26 -26 Z M154 126 h48 q0 26 -26 26 q-24 0 -22 -26 Z" fill="#111827"/><path d="M146 130 h8 M98 128 l-14 -6 M202 128 l14 -6" stroke="#111827" stroke-width="5" stroke-linecap="round"/><path d="M106 132 l10 0" stroke="#fff" stroke-width="3" opacity=".5" stroke-linecap="round"/></g>' },
  round: { slot: 'eyes', price: 150, svg: '<g fill="none" stroke="#7C2D12" stroke-width="5"><circle cx="124" cy="139" r="21"/><circle cx="176" cy="139" r="21"/><path d="M145 136 q5 -5 10 0 M103 134 l-16 -6 M197 134 l16 -6" stroke-linecap="round"/></g>' },
  stars: { slot: 'eyes', price: 250, svg: '<g><path d="M124 116 l7 15 16 2 -12 11 3 16 -14 -8 -14 8 3 -16 -12 -11 16 -2 Z M176 116 l7 15 16 2 -12 11 3 16 -14 -8 -14 8 3 -16 -12 -11 16 -2 Z" fill="#E0457B" opacity=".92"/><path d="M144 138 h12" stroke="#E0457B" stroke-width="5" stroke-linecap="round"/></g>' },
  hearts: { slot: 'eyes', price: 250, svg: '<g fill="#DC2626" opacity=".92"><path d="M124 158 C92 138 100 112 116 116 C120 117 123 120 124 124 C125 120 128 117 132 116 C148 112 156 138 124 158 Z"/><path d="M176 158 C144 138 152 112 168 116 C172 117 175 120 176 124 C177 120 180 117 184 116 C200 112 208 138 176 158 Z"/><path d="M144 132 h12" stroke="#DC2626" stroke-width="5" stroke-linecap="round"/></g>' },
  // neck
  bowtie: { slot: 'neck', price: 80, svg: '<g transform="translate(150 246)"><path d="M0 0 L-34 -18 Q-40 0 -34 18 Z M0 0 L34 -18 Q40 0 34 18 Z" fill="#DC2626"/><rect x="-9" y="-9" width="18" height="18" rx="5" fill="#991b1b"/></g>' },
  scarf: { slot: 'neck', price: 150, svg: '<g><path d="M80 226 Q150 262 220 226 L224 248 Q150 284 76 248 Z" fill="#22C55E"/><path d="M96 236 l6 20 M120 244 l4 20 M144 248 l2 20 M168 246 l-2 20 M192 240 l-4 20" stroke="#FFD166" stroke-width="6"/><path d="M184 248 l12 46 l22 -6 l-8 -44 Z" fill="#16A34A"/></g>' },
  bandana: { slot: 'neck', price: 120, svg: '<g><path d="M84 228 Q150 250 216 228 L150 290 Z" fill="#E0457B"/><circle cx="130" cy="248" r="4" fill="#fff"/><circle cx="160" cy="258" r="4" fill="#fff"/><circle cx="148" cy="272" r="4" fill="#fff"/><circle cx="176" cy="244" r="4" fill="#fff"/><circle cx="112" cy="238" r="4" fill="#fff"/></g>' },
  bell: { slot: 'neck', price: 100, svg: '<g><path d="M86 230 Q150 258 214 230" stroke="#3346C8" stroke-width="12" fill="none" stroke-linecap="round"/><circle cx="150" cy="262" r="15" fill="#FFC531" stroke="#D99A00" stroke-width="3"/><path d="M140 262 h20" stroke="#D99A00" stroke-width="3"/><circle cx="150" cy="270" r="3" fill="#7c5a00"/></g>' },
  medal: { slot: 'neck', price: 300, svg: '<g><path d="M118 226 L142 270 L158 270 L182 226" stroke="#3346C8" stroke-width="12" fill="none"/><circle cx="150" cy="272" r="20" fill="#FFC531" stroke="#D99A00" stroke-width="4"/><path d="M150 260 l4 8 9 1 -7 6 2 9 -8 -5 -8 5 2 -9 -7 -6 9 -1 Z" fill="#fff"/></g>' },
  // hair
  topknot: { slot: 'hair', price: 150, svg: '<g><circle cx="150" cy="40" r="20" fill="#fff" stroke="#E4E7F5" stroke-width="3"/><circle cx="138" cy="30" r="12" fill="#fff"/><circle cx="162" cy="30" r="12" fill="#fff"/><rect x="134" y="54" width="32" height="10" rx="5" fill="#38BDF8"/></g>' },
  fluffy: { slot: 'hair', price: 200, svg: '<g fill="#fff"><circle cx="112" cy="58" r="24"/><circle cx="150" cy="46" r="28"/><circle cx="188" cy="58" r="24"/><circle cx="84" cy="88" r="20"/><circle cx="216" cy="88" r="20"/></g>' },
  curl: { slot: 'hair', price: 120, svg: '<g fill="none" stroke="#fff" stroke-width="10" stroke-linecap="round"><path d="M150 64 q-4 -30 18 -30 q18 2 10 18 q-8 10 -16 0"/></g>' },
  mohawk: { slot: 'hair', price: 250, svg: '<g><path d="M120 66 L128 20 L138 58 L150 10 L162 58 L172 20 L180 66 Z" fill="#E0457B"/><path d="M128 66 L136 34 L146 60 L150 30 L154 60 L164 34 L172 66 Z" fill="#FF8FB1"/></g>' }
};
const SLOTS = ['hat', 'eyes', 'neck', 'hair'];
const TABS = [['hat', '🎩'], ['eyes', '🕶️'], ['neck', '🎀'], ['hair', '💇'], ['treat', '🍪']];
const TREATS = { freeze: { price: 150, ic: '❄️' }, biscuit: { price: 20, ic: '🍪' } };

// ---------- text ----------
const K = ['title', 'toSpend', 'buy', 'wear', 'off', 'need', 'hat', 'eyes', 'neck', 'hair', 'treat', 'freeze', 'freezeMax', 'biscuit', 'yum', 'close', 'wearing', 'tip'];
const T = {
  en: ["Harley's shop", '{n} XP to spend', 'Buy', 'Wear', 'Take off', 'Not enough XP yet', 'Hats', 'Glasses', 'Neck', 'Hair', 'Treats', 'Streak freeze', 'You already have 2', 'Biscuit for {name}', 'Yum! {name} loved it 🐶', 'Close', 'Wearing', 'Earn XP by practising, then dress up Harley and Lilou. They wear it everywhere in the app.'],
  es: ['La tienda de Harley', '{n} XP para gastar', 'Comprar', 'Poner', 'Quitar', 'Aún no tienes XP suficiente', 'Sombreros', 'Gafas', 'Cuello', 'Pelo', 'Premios', 'Protector de racha', 'Ya tienes 2', 'Galleta para {name}', '¡Ñam! A {name} le ha encantado 🐶', 'Cerrar', 'Puesto', 'Gana XP practicando y viste a Harley y Lilou. Lo llevan en toda la app.'],
  fr: ['La boutique de Harley', '{n} XP à dépenser', 'Acheter', 'Mettre', 'Enlever', "Pas encore assez d'XP", 'Chapeaux', 'Lunettes', 'Cou', 'Coiffure', 'Friandises', 'Gel de série', 'Tu en as déjà 2', 'Biscuit pour {name}', 'Miam ! {name} a adoré 🐶', 'Fermer', 'Porté', "Gagne des XP en t'entraînant, puis habille Harley et Lilou. Ils le portent partout dans l'app."],
  it: ['Il negozio di Harley', '{n} XP da spendere', 'Compra', 'Indossa', 'Togli', 'Non hai ancora abbastanza XP', 'Cappelli', 'Occhiali', 'Collo', 'Pelo', 'Premi', 'Salva-serie', 'Ne hai già 2', 'Biscotto per {name}', 'Gnam! A {name} è piaciuto 🐶', 'Chiudi', 'Indossato', "Guadagna XP esercitandoti, poi vesti Harley e Lilou. Lo indossano in tutta l'app."],
  de: ['Harleys Laden', '{n} XP zum Ausgeben', 'Kaufen', 'Anziehen', 'Ausziehen', 'Noch nicht genug XP', 'Hüte', 'Brillen', 'Hals', 'Frisur', 'Leckerlis', 'Serienschutz', 'Du hast schon 2', 'Keks für {name}', 'Mjam! {name} hat es geliebt 🐶', 'Schließen', 'An', 'Sammle XP beim Üben und zieh Harley und Lilou an. Sie tragen es überall in der App.'],
  pt: ['A loja do Harley', '{n} XP para gastar', 'Comprar', 'Vestir', 'Tirar', 'Ainda não tens XP suficiente', 'Chapéus', 'Óculos', 'Pescoço', 'Pelo', 'Guloseimas', 'Proteção de sequência', 'Já tens 2', 'Biscoito para o {name}', 'Hum! O {name} adorou 🐶', 'Fechar', 'A usar', 'Ganha XP a praticar e veste o Harley e a Lilou. Usam-no em toda a app.'],
  pl: ['Sklep Harleya', '{n} XP do wydania', 'Kup', 'Załóż', 'Zdejmij', 'Jeszcze za mało XP', 'Czapki', 'Okulary', 'Szyja', 'Fryzura', 'Smakołyki', 'Ochrona serii', 'Masz już 2', 'Ciastko dla {name}', 'Mniam! {name} jest zachwycony 🐶', 'Zamknij', 'Założone', 'Zdobywaj XP, ćwicząc, i ubieraj Harleya i Lilou. Noszą to w całej aplikacji.'],
  ro: ['Magazinul lui Harley', '{n} XP de cheltuit', 'Cumpără', 'Poartă', 'Scoate', 'Încă nu ai destui XP', 'Pălării', 'Ochelari', 'Gât', 'Păr', 'Recompense', 'Protecție de serie', 'Ai deja 2', 'Biscuit pentru {name}', 'Mmm! Lui {name} i-a plăcut 🐶', 'Închide', 'Purtat', 'Câștigă XP exersând, apoi îmbracă-i pe Harley și Lilou. Le poartă peste tot în aplicație.'],
  uk: ['Крамниця Harley', '{n} XP на витрати', 'Купити', 'Одягнути', 'Зняти', 'Поки замало XP', 'Капелюхи', 'Окуляри', 'Шия', 'Зачіска', 'Смаколики', 'Захист серії', 'У тебе вже 2', 'Печиво для {name}', 'Ням! {name} у захваті 🐶', 'Закрити', 'Одягнено', 'Заробляй XP, тренуючись, і вдягай Harley та Lilou. Вони носять це в усьому застосунку.'],
  zh: ['Harley 的商店', '可用 {n} XP', '购买', '穿戴', '取下', 'XP 还不够', '帽子', '眼镜', '颈饰', '发型', '零食', '连胜保护卡', '你已经有 2 张了', '给 {name} 的饼干', '好吃！{name} 很喜欢 🐶', '关闭', '已穿戴', '练习赚取 XP，给 Harley 和 Lilou 打扮。它们会在整个应用里穿戴。'],
  ar: ['متجر Harley', '{n} نقطة للإنفاق', 'شراء', 'ارتداء', 'خلع', 'لا تملك نقاطًا كافية بعد', 'قبعات', 'نظارات', 'الرقبة', 'الشعر', 'مكافآت', 'حماية السلسلة', 'لديك 2 بالفعل', 'بسكويت لـ {name}', 'لذيذ! أحبّه {name} 🐶', 'إغلاق', 'مرتدى', 'اكسب النقاط بالتدريب ثم ألبِس Harley وLilou. سيرتديانها في كل التطبيق.'],
  nl: ['Harleys winkel', '{n} XP te besteden', 'Kopen', 'Aandoen', 'Afdoen', 'Nog niet genoeg XP', 'Hoeden', 'Brillen', 'Nek', 'Kapsel', 'Snoepjes', 'Reeksbeschermer', 'Je hebt er al 2', 'Koekje voor {name}', 'Mmm! {name} vond het heerlijk 🐶', 'Sluiten', 'Aan', 'Verdien XP door te oefenen en kleed Harley en Lilou aan. Ze dragen het overal in de app.'],
  tr: ["Harley'nin dükkânı", 'Harcanacak {n} XP', 'Satın al', 'Giy', 'Çıkar', 'Henüz yeterli XP yok', 'Şapkalar', 'Gözlükler', 'Boyun', 'Saç', 'Ödüller', 'Seri koruyucu', 'Zaten 2 tane var', "{name} için kurabiye", 'Hım! {name} bayıldı 🐶', 'Kapat', 'Giyili', "Çalışarak XP kazan, sonra Harley ve Lilou'yu giydir. Uygulamanın her yerinde takarlar."],
  ja: ['Harley のショップ', '使える XP：{n}', '買う', 'つける', '外す', 'XP が足りません', '帽子', 'メガネ', '首まわり', 'ヘア', 'おやつ', '連続記録の保護', 'すでに2つ持っています', '{name} にビスケット', 'おいしい！{name} は大喜び 🐶', '閉じる', '着用中', '練習で XP をためて、Harley と Lilou をおしゃれに。アプリのどこでも身につけます。'],
  ko: ['Harley 상점', '사용 가능 {n} XP', '구매', '착용', '벗기', '아직 XP가 부족해요', '모자', '안경', '목', '헤어', '간식', '연속 기록 보호권', '이미 2개 있어요', '{name}에게 비스킷', '냠! {name}가 정말 좋아해요 🐶', '닫기', '착용 중', '연습으로 XP를 모아 Harley와 Lilou를 꾸며 보세요. 앱 어디서나 착용해요.'],
  vi: ['Cửa hàng của Harley', '{n} XP để tiêu', 'Mua', 'Mặc', 'Bỏ ra', 'Chưa đủ XP', 'Mũ', 'Kính', 'Cổ', 'Tóc', 'Phần thưởng', 'Thẻ bảo vệ chuỗi', 'Bạn đã có 2 thẻ', 'Bánh quy cho {name}', 'Ngon quá! {name} rất thích 🐶', 'Đóng', 'Đang mặc', 'Luyện tập để kiếm XP rồi trang điểm cho Harley và Lilou. Chúng sẽ mặc ở khắp ứng dụng.']
};
function t(k, vars) {
  const ui = get('sir_ui', null) || (navigator.language || 'en').slice(0, 2).toLowerCase();
  const row = T[ui] || T.en; let v = row[K.indexOf(k)] || T.en[K.indexOf(k)] || k;
  if (vars) for (const a in vars) v = v.split('{' + a + '}').join(vars[a]);
  return v;
}

// ---------- state ----------
function state() { const s = get('hs_shop', null) || {}; s.spent = s.spent || 0; s.owned = s.owned || []; s.wear = s.wear || {}; s.wear.harley = s.wear.harley || {}; s.wear.lilou = s.wear.lilou || {}; return s; }
const total = () => { const x = get('hs_xp', { total: 0 }); return (x && x.total) || 0; };
const balance = () => Math.max(0, total() - state().spent);

// ---------- dressing a drawing ----------
// Hair goes under the hat; the order is hair, neck, eyes, hat.
function layer(who) {
  const w = state().wear[who === 'lilou' ? 'lilou' : 'harley'] || {};
  return ['hair', 'neck', 'eyes', 'hat'].map(s => w[s] && ITEMS[w[s]] ? ITEMS[w[s]].svg : '').join('');
}
function dress(svg, who) {
  if (!svg || typeof svg !== 'string') return svg;
  const l = layer(who); if (!l) return svg;
  // Lilou's small drawings are scaled down inside the frame: put her outfit in the same place
  const wrap = svg.includes('translate(24 34) scale(.84)') ? `<g transform="translate(24 34) scale(.84)">${l}</g>` : `<g class="hs-outfit">${l}</g>`;
  return svg.replace(/<\/svg>\s*$/, wrap + '</svg>');
}
dress.layer = layer;
window.HSDress = dress;

// ---------- the shop ----------
const FACE = '<svg viewBox="-10 -10 320 320" xmlns="http://www.w3.org/2000/svg"><circle cx="150" cy="150" r="150" fill="{bg}"/><path d="M92 228 l-26 40 l52 -24 z" fill="#fff"/><circle cx="212" cy="148" r="33" fill="#fff"/><circle cx="200" cy="184" r="33" fill="#fff"/><circle cx="169" cy="207" r="33" fill="#fff"/><circle cx="131" cy="207" r="33" fill="#fff"/><circle cx="100" cy="184" r="33" fill="#fff"/><circle cx="88" cy="148" r="33" fill="#fff"/><circle cx="100" cy="112" r="33" fill="#fff"/><circle cx="131" cy="89" r="33" fill="#fff"/><circle cx="169" cy="89" r="33" fill="#fff"/><circle cx="200" cy="112" r="33" fill="#fff"/><circle cx="150" cy="148" r="70" fill="#fff"/><circle cx="125" cy="138" r="9" fill="#1C2563"/><circle cx="175" cy="138" r="9" fill="#1C2563"/><circle cx="128" cy="135" r="3" fill="#fff"/><circle cx="178" cy="135" r="3" fill="#fff"/><ellipse cx="150" cy="163" rx="13" ry="9" fill="#1C2563"/><path d="M143 180 q7 16 14 0 z" fill="#F07C92"/><path d="M150 171 q-10 14 -22 4 M150 171 q10 14 22 4" fill="none" stroke="#1C2563" stroke-width="4" stroke-linecap="round"/>{bow}{items}</svg>';
const BOW = '<g transform="translate(212 78) rotate(-16)"><path d="M0 0 L-34 -20 Q-40 0 -34 20 Z" fill="#FF8CC2"/><path d="M0 0 L34 -20 Q40 0 34 20 Z" fill="#FF8CC2"/><circle r="10" fill="#FF4F9A"/></g>';
function faceWith(who, items) { return FACE.replace('{bg}', who === 'lilou' ? '#B9478A' : '#3346C8').replace('{bow}', who === 'lilou' ? BOW : '').replace('{items}', items); }
function previewFor(who, wear) { return faceWith(who, ['hair', 'neck', 'eyes', 'hat'].map(s => wear[s] && ITEMS[wear[s]] ? ITEMS[wear[s]].svg : '').join('')); }
const css = `
.hss{border:0;border-radius:24px;padding:0;width:100%;max-width:min(94vw,440px);max-height:92vh;box-shadow:0 20px 50px rgba(28,37,99,.35)}
.hss::backdrop{background:rgba(20,26,70,.5)}
.hss-p{font:15px/1.4 Inter,system-ui,sans-serif;color:#1C2563}
.hss-top{position:sticky;top:0;z-index:1;background:linear-gradient(150deg,#7B2FD0,#E0457B);color:#fff;padding:14px 16px 12px;text-align:center}
.hss-top h3{margin:0;font-size:19px}
.hss-bal{display:inline-block;margin-top:6px;background:rgba(255,255,255,.22);border-radius:999px;padding:4px 12px;font-weight:800}
.hss-bal.bump{animation:hssBump .5s cubic-bezier(.3,1.6,.5,1)}
.hss-dogs{display:flex;justify-content:center;gap:14px;margin-top:10px}
.hss-dog{border:3px solid transparent;background:none;padding:0;border-radius:50%;cursor:pointer;opacity:.65;transition:opacity .2s,transform .2s}
.hss-dog.on{opacity:1;border-color:#fff;transform:scale(1.06)}
.hss-dog svg{width:92px;height:92px;display:block}
.hss-dog.on svg{animation:hssBob 2.4s ease-in-out infinite}
.hss-dog small{display:block;font-weight:800;color:#fff;margin-top:2px}
.hss-tip{margin:10px 14px 4px;font-size:13px;color:#667;text-align:center}
.hss-tabs{display:flex;gap:6px;overflow-x:auto;padding:8px 12px;scrollbar-width:none}
.hss-tabs button{flex:0 0 auto;border:1px solid #dfe3f0;background:#fff;border-radius:999px;padding:7px 12px;font:700 14px Inter,system-ui,sans-serif;color:#1C2563;cursor:pointer}
.hss-tabs button.on{background:#1C2563;border-color:#1C2563;color:#fff}
.hss-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;padding:4px 12px 12px}
.hss-it{position:relative;border:2px solid #eef0f8;border-radius:16px;background:#fff;padding:6px 4px 8px;text-align:center;cursor:pointer;font:700 13px Inter,system-ui,sans-serif;color:#1C2563;animation:hssIn .35s backwards;animation-delay:calc(var(--i) * 35ms)}
.hss-it svg{width:72px;height:72px;display:block;margin:0 auto 4px}
.hss-it.worn{border-color:#22C55E;background:#F0FDF4}
.hss-it.worn::after{content:'✓';position:absolute;top:6px;right:8px;width:20px;height:20px;border-radius:50%;background:#22C55E;color:#fff;font-size:12px;display:grid;place-items:center}
.hss-it .pr{display:inline-block;border-radius:999px;padding:2px 8px;background:#FFF1E6;color:#B45309}
.hss-it .pr.no{background:#f1f2f7;color:#9aa0b8}
.hss-it .tr{font-size:40px;line-height:72px;display:block;height:76px}
.hss-it .nm{display:block;font-size:12px;margin-bottom:4px}
.hss-close{display:block;width:calc(100% - 24px);margin:0 12px 14px;border:0;border-radius:14px;padding:12px;background:#3346C8;color:#fff;font:800 15px Inter,system-ui,sans-serif;cursor:pointer}
.hss-msg{text-align:center;min-height:20px;font-weight:700;color:#E0457B;margin:0 12px}
@keyframes hssIn{from{opacity:0;transform:translateY(10px) scale(.92)}to{opacity:1;transform:none}}
@keyframes hssBob{0%,100%{transform:translateY(0) rotate(-3deg)}50%{transform:translateY(-5px) rotate(3deg)}}
@keyframes hssBump{40%{transform:scale(1.2)}}
@media (prefers-reduced-motion:reduce){.hss *{animation:none!important}}`;
let dlg = null, tab = 'hat', who = 'harley', changed = false;
function addCss() { if (document.getElementById('hssCss')) return; const s = document.createElement('style'); s.id = 'hssCss'; s.textContent = css; document.head.appendChild(s); }
function fill(msg, bump) {
  const s = state(), wear = s.wear[who], bal = balance();
  const fx = get('hs_streak', { freezes: 0 });
  let grid = '';
  if (tab === 'treat') {
    grid = Object.entries(TREATS).map(([id, it], i) => {
      const full = id === 'freeze' && (fx.freezes || 0) >= 2;
      return `<button type="button" class="hss-it" style="--i:${i}" data-treat="${id}"><span class="tr">${it.ic}</span><span class="nm">${esc(id === 'freeze' ? t('freeze') : t('biscuit', { name: who === 'lilou' ? 'Lilou' : 'Harley' }))}</span><span class="pr${bal < it.price || full ? ' no' : ''}">${full ? esc(t('freezeMax')) : it.price + ' XP'}</span></button>`;
    }).join('');
  } else {
    grid = Object.entries(ITEMS).filter(([, it]) => it.slot === tab).map(([id, it], i) => {
      const own = s.owned.includes(id), worn = wear[it.slot] === id;
      const w2 = Object.assign({}, wear, { [it.slot]: id });
      return `<button type="button" class="hss-it${worn ? ' worn' : ''}" style="--i:${i}" data-item="${id}">${previewFor(who, w2)}<span class="pr${own ? '' : bal < it.price ? ' no' : ''}">${own ? esc(worn ? t('off') : t('wear')) : it.price + ' XP'}</span></button>`;
    }).join('');
  }
  dlg.dir = get('sir_ui', '') === 'ar' ? 'rtl' : 'ltr';
  dlg.innerHTML = `<div class="hss-p"><div class="hss-top"><h3>🛍️ ${esc(t('title'))}</h3><span class="hss-bal${bump ? ' bump' : ''}">⭐ ${esc(t('toSpend', { n: bal.toLocaleString() }))}</span>
    <div class="hss-dogs">${['harley', 'lilou'].map(d => `<button type="button" class="hss-dog${d === who ? ' on' : ''}" data-dog="${d}">${previewFor(d, s.wear[d])}<small>${d === 'lilou' ? 'Lilou' : 'Harley'}</small></button>`).join('')}</div></div>
    <p class="hss-tip">${esc(t('tip'))}</p>
    <div class="hss-tabs">${TABS.map(([k, ic]) => `<button type="button" data-tab="${k}" class="${k === tab ? 'on' : ''}">${ic} ${esc(t(k))}</button>`).join('')}</div>
    <p class="hss-msg">${esc(msg || '')}</p>
    <div class="hss-grid">${grid}</div>
    <button type="button" class="hss-close" data-close>${esc(t('close'))}</button></div>`;
}
const sfx = (k, n) => { if (window.HSFX) { HSFX.sound(k); if (n) HSFX.buzz(n); } };
function onClick(e) {
  if (e.target === dlg) return close();
  const b = e.target.closest('button'); if (!b) return;
  const d = b.dataset, s = state();
  if (d.close !== undefined) return close();
  if (d.dog) { who = d.dog; sfx('tick'); return fill(); }
  if (d.tab) { tab = d.tab; sfx('tick'); return fill(); }
  if (d.item) {
    const it = ITEMS[d.item], wear = s.wear[who];
    if (!s.owned.includes(d.item)) {
      if (balance() < it.price) { sfx('try'); return fill(t('need')); }
      s.spent += it.price; s.owned.push(d.item); wear[it.slot] = d.item;
      put('hs_shop', s); changed = true; sfx('win', 30); if (window.HSFX) HSFX.confetti();
      return fill('', true);
    }
    wear[it.slot] = wear[it.slot] === d.item ? '' : d.item; put('hs_shop', s); changed = true; sfx(wear[it.slot] ? 'good' : 'tick');
    return fill();
  }
  if (d.treat) {
    const it = TREATS[d.treat];
    if (balance() < it.price) { sfx('try'); return fill(t('need')); }
    if (d.treat === 'freeze') {
      const st = get('hs_streak', { n: 0, last: '', best: 0, freezes: 0 });
      if ((st.freezes || 0) >= 2) return fill(t('freezeMax'));
      st.freezes = (st.freezes || 0) + 1; put('hs_streak', st); s.spent += it.price; put('hs_shop', s); sfx('win', 30);
      if (window.HSFX) HSFX.refresh();
      return fill('❄️ +1', true);
    }
    s.spent += it.price; s.biscuits = (s.biscuits || 0) + 1; put('hs_shop', s); sfx('great', 40); if (window.HSFX) HSFX.confetti();
    const name = who === 'lilou' ? 'Lilou' : 'Harley';
    fill(t('yum', { name }), true);
    const dog = dlg.querySelector('.hss-dog.on svg'); if (dog) dog.animate([{ transform: 'rotate(0)' }, { transform: 'rotate(-12deg) scale(1.1)' }, { transform: 'rotate(12deg) scale(1.1)' }, { transform: 'rotate(0)' }], { duration: 600, iterations: 2 });
  }
}
function close() { try { dlg.close(); } catch (e) { dlg.removeAttribute('open'); } if (changed) { changed = false; window.dispatchEvent(new CustomEvent('hs-dress')); } }
function open(dog) {
  addCss();
  if (!dlg) { dlg = document.createElement('dialog'); dlg.className = 'hss'; document.body.appendChild(dlg); dlg.addEventListener('click', onClick); dlg.addEventListener('close', () => { if (changed) { changed = false; window.dispatchEvent(new CustomEvent('hs-dress')); } }); }
  who = dog || (get('sir_coach', 'harley') === 'lilou' ? 'lilou' : 'harley');
  fill();
  try { dlg.showModal(); } catch (e) { dlg.setAttribute('open', ''); }
}
window.HSShop = { open, balance, title: () => t('title') };
})();
