// Harlo Travel (harlolearn.com/travel/): survival phrases for a trip, ready to use, even offline.
// Pick where you're going (and when): a countdown, five phrases a day until you leave, a phrasebook by situation with
// "Show" (big text to show someone), listening, a quick "Say it" check, emergencies with the local number.
// Phrases come from the main phrase library (phrases.js: Basics, Travel, Café & restaurant are in the same order in
// every language) plus the emergency phrases below. Meanings are in English, as in the main app.
// Stored: hs_trip = { lang, date, learned: { [lang]: [phrase] }, day: { d, ids } }
(function () {
'use strict';
const D = window.SIR_DATA;
const $ = id => document.getElementById(id);
const app = $('app');
const get = (k, d) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } };
const put = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} };
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const fx = (k, xp) => { if (window.HSFX) { HSFX.sound(k); if (xp) HSFX.xp(xp); } };
function track(e, l) { try { if (location.protocol === 'file:') return; fetch('/.netlify/functions/track', { method: 'POST', keepalive: true, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ e, l: l || '', u: ui }) }).catch(() => {}); } catch (err) {} }

// ---------- where ----------
const DEST = [
  ['es', '🇪🇸', 'Spain', '112'], ['fr', '🇫🇷', 'France', '112'], ['it', '🇮🇹', 'Italy', '112'], ['pt', '🇵🇹', 'Portugal', '112'],
  ['de', '🇩🇪', 'Germany', '112'], ['nl', '🇳🇱', 'Netherlands', '112'], ['esmx', '🇲🇽', 'Mexico', '911'], ['en', '🇬🇧', 'United Kingdom', '999'], ['enus', '🇺🇸', 'United States', '911']
];
const SOS = {
  en: ['Help!', 'Call an ambulance!', 'Call the police!', 'I need a doctor', "It's an emergency", 'Where is the hospital?', "I've lost my passport", 'My bag has been stolen', "I don't feel well", 'Please call this number'],
  enus: ['Help!', 'Call an ambulance!', 'Call the police!', 'I need a doctor', "It's an emergency", "Where's the hospital?", 'I lost my passport', 'My bag was stolen', "I don't feel well", 'Please call this number'],
  es: ['¡Ayuda!', '¡Llame a una ambulancia!', '¡Llame a la policía!', 'Necesito un médico', 'Es una emergencia', '¿Dónde está el hospital?', 'He perdido mi pasaporte', 'Me han robado el bolso', 'No me encuentro bien', 'Por favor, llame a este número'],
  esmx: ['¡Ayuda!', '¡Llame a una ambulancia!', '¡Llame a la policía!', 'Necesito un médico', 'Es una emergencia', '¿Dónde está el hospital?', 'Perdí mi pasaporte', 'Me robaron la bolsa', 'No me siento bien', 'Por favor, llame a este número'],
  fr: ['Au secours !', 'Appelez une ambulance !', 'Appelez la police !', "J'ai besoin d'un médecin", "C'est une urgence", "Où est l'hôpital ?", "J'ai perdu mon passeport", "On m'a volé mon sac", 'Je ne me sens pas bien', "Appelez ce numéro, s'il vous plaît"],
  it: ['Aiuto!', "Chiami un'ambulanza!", 'Chiami la polizia!', 'Ho bisogno di un medico', "È un'emergenza", "Dov'è l'ospedale?", 'Ho perso il passaporto', 'Mi hanno rubato la borsa', 'Non mi sento bene', 'Per favore, chiami questo numero'],
  de: ['Hilfe!', 'Rufen Sie einen Krankenwagen!', 'Rufen Sie die Polizei!', 'Ich brauche einen Arzt', 'Es ist ein Notfall', 'Wo ist das Krankenhaus?', 'Ich habe meinen Reisepass verloren', 'Meine Tasche wurde gestohlen', 'Mir geht es nicht gut', 'Bitte rufen Sie diese Nummer an'],
  pt: ['Socorro!', 'Chame uma ambulância!', 'Chame a polícia!', 'Preciso de um médico', 'É uma emergência', 'Onde fica o hospital?', 'Perdi o meu passaporte', 'Roubaram-me a mala', 'Não me sinto bem', 'Por favor, ligue para este número'],
  nl: ['Help!', 'Bel een ambulance!', 'Bel de politie!', 'Ik heb een dokter nodig', 'Het is een noodgeval', 'Waar is het ziekenhuis?', 'Ik ben mijn paspoort kwijt', 'Mijn tas is gestolen', 'Ik voel me niet goed', 'Wilt u dit nummer bellen?']
};
const SOS_EN = SOS.en;
// situations: [id, icon, topics to take phrases from, what the English meaning must match, how many at most]
// Phrases are picked by their English meaning (the phrase itself for English, the meaning for other languages),
// because the topics are translated in roughly, not exactly, the same order.
const CATS = [
  ['essentials', '👋', ['Basics'], /^(hello|hi\b|nice to meet|pleased to meet|thank|sorry, i don|i don.t (understand|speak|know)|could you (say|repeat|speak more slowly|write)|can you repeat|good (morning|afternoon|evening)|goodbye|excuse me|you.re welcome|just a moment|do you speak|how do you say)/i, 14],
  ['around', '🚆', ['Travel'], /(station|train|taxi|lost|ticket|platform|bus|far from|turn left|straight ahead|airport|seat taken|delayed|connection|map|walk there|stop here|how long|get there)/i, 16],
  ['food', '🍽️', ['Café & restaurant'], /(table for|menu|glass of water|vegetarian|nuts|peanut|allerg|recommend|delicious|the bill|i.ll have|toilet|two coffees|take away|ready to order|spicy|without)/i, 14],
  ['hotel', '🏨', ['Travel'], /(booked a room|room|breakfast|wi-?fi|air conditioning|luggage|suitcase|passport control|here for)/i, 10],
  ['money', '💶', ['Travel', 'Café & restaurant'], /(how much|cost|cash|by card|the bill|split|change|service included)/i, 8],
  ['numbers', '🔢', null, null, 0],
  ['sos', '🆘', ['Travel', 'Café & restaurant'], /(chemist|pharmacy|doctor|help me|allergic)/i, 4]
];
const DEST_LANG = { es: 'es-ES', esmx: 'es-MX', fr: 'fr-FR', it: 'it-IT', de: 'de-DE', pt: 'pt-PT', nl: 'nl-NL', en: 'en-GB', enus: 'en-US' };

// ---------- text ----------
const K = ['title', 'hero', 'heroP', 'where', 'when', 'start', 'days', 'tomorrow', 'today', 'back', 'change', 'today5', 'learned', 'book', 'c_essentials', 'c_around', 'c_food', 'c_hotel', 'c_money', 'c_numbers', 'c_sos', 'sosNum', 'listen', 'slow', 'say', 'great', 'again', 'show', 'tapClose', 'offline', 'practise', 'done5', 'got', 'noMic', 'listening'];
const T = {
  en: ['Harlo Travel', 'Survival phrases for your trip', "The phrases you'll really need, ready to use, even offline.", 'Where are you going?', 'When do you leave? (optional)', "Let's go", '{n} days to go', 'You leave tomorrow!', 'Have a great trip! 🎉', 'Welcome back', 'Change trip', "Today's 5 for your trip", '{n} of {m} phrases learned', 'Phrasebook', 'Essentials', 'Getting around', 'Eating out', 'Hotel', 'Shopping & money', 'Numbers', 'Emergencies', 'Emergency number: {n}', 'Listen', 'Slow', 'Say it', 'Great! ✓', 'Not quite, try again', 'Show', 'Tap anywhere to close', '✓ Works offline on this device', 'Practise with scoring in Harlo', 'Done for today! 🎉 Come back tomorrow for 5 more.', 'Got it', 'Speech recognition needs Chrome, Edge or Safari.', 'Listening…'],
  es: ['Harlo Viajes', 'Frases de supervivencia para tu viaje', 'Las frases que de verdad vas a necesitar, listas para usar, incluso sin conexión.', '¿Adónde vas?', '¿Cuándo sales? (opcional)', '¡Vamos!', 'Faltan {n} días', '¡Sales mañana!', '¡Buen viaje! 🎉', 'Bienvenido de nuevo', 'Cambiar viaje', 'Tus 5 de hoy para el viaje', '{n} de {m} frases aprendidas', 'Guía de frases', 'Lo básico', 'Moverse', 'Comer fuera', 'Hotel', 'Compras y dinero', 'Números', 'Emergencias', 'Número de emergencias: {n}', 'Escuchar', 'Despacio', 'Dilo', '¡Genial! ✓', 'Casi, inténtalo otra vez', 'Mostrar', 'Toca para cerrar', '✓ Funciona sin conexión en este dispositivo', 'Practica con puntuación en Harlo', '¡Hecho por hoy! 🎉 Vuelve mañana para 5 más.', 'Aprendida', 'El reconocimiento de voz necesita Chrome, Edge o Safari.', 'Escuchando…'],
  fr: ['Harlo Voyage', 'Les phrases de survie pour ton voyage', 'Les phrases dont tu auras vraiment besoin, prêtes à l’emploi, même hors ligne.', 'Où pars-tu ?', 'Quand pars-tu ? (facultatif)', "C'est parti", 'Plus que {n} jours', 'Tu pars demain !', 'Bon voyage ! 🎉', 'Bon retour', 'Changer de voyage', 'Tes 5 phrases du jour pour le voyage', '{n} phrases apprises sur {m}', 'Guide de conversation', "L'essentiel", 'Se déplacer', 'Au restaurant', 'Hôtel', 'Achats et argent', 'Nombres', 'Urgences', "Numéro d'urgence : {n}", 'Écouter', 'Lentement', 'Dis-le', 'Bravo ! ✓', 'Presque, réessaie', 'Montrer', 'Touche pour fermer', '✓ Fonctionne hors ligne sur cet appareil', 'Entraîne-toi avec un score dans Harlo', 'Fini pour aujourd’hui ! 🎉 Reviens demain pour 5 de plus.', 'Je sais', 'La reconnaissance vocale nécessite Chrome, Edge ou Safari.', 'J’écoute…'],
  it: ['Harlo Viaggi', 'Frasi di sopravvivenza per il tuo viaggio', 'Le frasi che ti serviranno davvero, pronte all’uso, anche offline.', 'Dove vai?', 'Quando parti? (facoltativo)', 'Andiamo!', 'Mancano {n} giorni', 'Parti domani!', 'Buon viaggio! 🎉', 'Bentornato', 'Cambia viaggio', 'Le tue 5 frasi di oggi per il viaggio', '{n} di {m} frasi imparate', 'Frasario', 'Essenziali', 'Spostarsi', 'Mangiare fuori', 'Hotel', 'Acquisti e soldi', 'Numeri', 'Emergenze', "Numero d'emergenza: {n}", 'Ascolta', 'Piano', 'Dillo', 'Ottimo! ✓', 'Quasi, riprova', 'Mostra', 'Tocca per chiudere', '✓ Funziona offline su questo dispositivo', 'Esercitati con il punteggio in Harlo', 'Fatto per oggi! 🎉 Torna domani per altre 5.', 'Imparata', 'Il riconoscimento vocale richiede Chrome, Edge o Safari.', 'Ascolto…'],
  de: ['Harlo Reisen', 'Überlebenssätze für deine Reise', 'Die Sätze, die du wirklich brauchst, sofort einsatzbereit, auch offline.', 'Wohin reist du?', 'Wann geht es los? (optional)', "Los geht's", 'Noch {n} Tage', 'Morgen geht es los!', 'Gute Reise! 🎉', 'Willkommen zurück', 'Reise ändern', 'Deine 5 Sätze für heute', '{n} von {m} Sätzen gelernt', 'Sprachführer', 'Das Wichtigste', 'Unterwegs', 'Essen gehen', 'Hotel', 'Einkaufen & Geld', 'Zahlen', 'Notfälle', 'Notrufnummer: {n}', 'Anhören', 'Langsam', 'Sag es', 'Super! ✓', 'Fast, versuch es nochmal', 'Zeigen', 'Zum Schließen tippen', '✓ Funktioniert offline auf diesem Gerät', 'Mit Bewertung in Harlo üben', 'Fertig für heute! 🎉 Morgen gibt es 5 neue.', 'Kann ich', 'Spracherkennung braucht Chrome, Edge oder Safari.', 'Ich höre zu…'],
  pt: ['Harlo Viagem', 'Frases de sobrevivência para a tua viagem', 'As frases de que vais mesmo precisar, prontas a usar, mesmo offline.', 'Para onde vais?', 'Quando partes? (opcional)', 'Vamos!', 'Faltam {n} dias', 'Partes amanhã!', 'Boa viagem! 🎉', 'Bem-vindo de volta', 'Mudar viagem', 'As tuas 5 frases de hoje', '{n} de {m} frases aprendidas', 'Guia de frases', 'O essencial', 'Deslocações', 'Comer fora', 'Hotel', 'Compras e dinheiro', 'Números', 'Emergências', 'Número de emergência: {n}', 'Ouvir', 'Devagar', 'Diz', 'Boa! ✓', 'Quase, tenta outra vez', 'Mostrar', 'Toca para fechar', '✓ Funciona offline neste dispositivo', 'Pratica com pontuação no Harlo', 'Feito por hoje! 🎉 Volta amanhã para mais 5.', 'Já sei', 'O reconhecimento de voz precisa do Chrome, Edge ou Safari.', 'A ouvir…'],
  pl: ['Harlo Podróże', 'Zwroty na przetrwanie w podróży', 'Zwroty, których naprawdę będziesz potrzebować, gotowe do użycia, także offline.', 'Dokąd jedziesz?', 'Kiedy wyjeżdżasz? (opcjonalnie)', 'Ruszamy', 'Zostało {n} dni', 'Wyjeżdżasz jutro!', 'Udanej podróży! 🎉', 'Witaj z powrotem', 'Zmień podróż', 'Twoje 5 zwrotów na dziś', '{n} z {m} zwrotów opanowanych', 'Rozmówki', 'Podstawy', 'Poruszanie się', 'Jedzenie na mieście', 'Hotel', 'Zakupy i pieniądze', 'Liczby', 'Nagłe wypadki', 'Numer alarmowy: {n}', 'Posłuchaj', 'Wolno', 'Powiedz', 'Świetnie! ✓', 'Prawie, spróbuj jeszcze raz', 'Pokaż', 'Dotknij, aby zamknąć', '✓ Działa offline na tym urządzeniu', 'Ćwicz z oceną w Harlo', 'Na dziś gotowe! 🎉 Wróć jutro po 5 kolejnych.', 'Umiem', 'Rozpoznawanie mowy wymaga Chrome, Edge lub Safari.', 'Słucham…'],
  ro: ['Harlo Călătorii', 'Fraze de supraviețuire pentru călătoria ta', 'Frazele de care chiar vei avea nevoie, gata de folosit, chiar și offline.', 'Unde mergi?', 'Când pleci? (opțional)', 'Hai!', 'Mai sunt {n} zile', 'Pleci mâine!', 'Călătorie plăcută! 🎉', 'Bine ai revenit', 'Schimbă călătoria', 'Cele 5 fraze de azi', '{n} din {m} fraze învățate', 'Ghid de conversație', 'Esențiale', 'Transport', 'La restaurant', 'Hotel', 'Cumpărături și bani', 'Numere', 'Urgențe', 'Număr de urgență: {n}', 'Ascultă', 'Încet', 'Spune', 'Super! ✓', 'Aproape, mai încearcă', 'Arată', 'Atinge pentru a închide', '✓ Funcționează offline pe acest dispozitiv', 'Exersează cu scor în Harlo', 'Gata pe azi! 🎉 Revino mâine pentru încă 5.', 'Știu', 'Recunoașterea vocală necesită Chrome, Edge sau Safari.', 'Ascult…'],
  uk: ['Harlo Подорожі', 'Фрази для виживання в подорожі', 'Фрази, які справді знадобляться, готові до використання навіть офлайн.', 'Куди ти їдеш?', 'Коли виїжджаєш? (необов’язково)', 'Поїхали', 'Залишилось {n} дн.', 'Виїжджаєш завтра!', 'Гарної подорожі! 🎉', 'З поверненням', 'Змінити подорож', 'Твої 5 фраз на сьогодні', 'Вивчено {n} з {m} фраз', 'Розмовник', 'Основне', 'Пересування', 'У ресторані', 'Готель', 'Покупки й гроші', 'Числа', 'Надзвичайні ситуації', 'Екстрений номер: {n}', 'Слухати', 'Повільно', 'Скажи', 'Чудово! ✓', 'Майже, спробуй ще', 'Показати', 'Торкнися, щоб закрити', '✓ Працює офлайн на цьому пристрої', 'Тренуйся з оцінкою в Harlo', 'На сьогодні все! 🎉 Повертайся завтра по ще 5.', 'Знаю', 'Розпізнавання мовлення потребує Chrome, Edge або Safari.', 'Слухаю…'],
  zh: ['Harlo 旅行', '旅行必备短语', '真正用得上的短语，随时可用，离线也行。', '你要去哪里？', '什么时候出发？（可选）', '出发', '还有 {n} 天', '明天出发！', '旅途愉快！🎉', '欢迎回来', '更改行程', '今日旅行 5 句', '已学会 {n}/{m} 句', '短语手册', '基本用语', '出行交通', '外出就餐', '酒店', '购物与付款', '数字', '紧急情况', '紧急电话：{n}', '听', '慢速', '说一说', '很好！✓', '差一点，再试一次', '展示', '点击任意处关闭', '✓ 本设备可离线使用', '在 Harlo 中练习并评分', '今天完成！🎉 明天再来学 5 句。', '已掌握', '语音识别需要 Chrome、Edge 或 Safari。', '正在听…'],
  ar: ['Harlo للسفر', 'عبارات أساسية لرحلتك', 'العبارات التي ستحتاجها فعلًا، جاهزة للاستخدام حتى دون إنترنت.', 'إلى أين تسافر؟', 'متى تغادر؟ (اختياري)', 'هيا بنا', 'باقٍ {n} يومًا', 'تسافر غدًا!', 'رحلة سعيدة! 🎉', 'مرحبًا بعودتك', 'تغيير الرحلة', 'عباراتك الخمس لليوم', 'تعلّمت {n} من {m} عبارة', 'دليل العبارات', 'الأساسيات', 'التنقل', 'تناول الطعام', 'الفندق', 'التسوق والمال', 'الأرقام', 'الطوارئ', 'رقم الطوارئ: {n}', 'استمع', 'ببطء', 'قلها', 'رائع! ✓', 'قريب، حاول مجددًا', 'اعرض', 'اضغط للإغلاق', '✓ يعمل دون إنترنت على هذا الجهاز', 'تدرّب مع التقييم في Harlo', 'انتهيت لليوم! 🎉 عُد غدًا لخمس أخرى.', 'تعلّمتها', 'التعرّف على الكلام يتطلب Chrome أو Edge أو Safari.', 'أستمع…'],
  nl: ['Harlo Reizen', 'Overlevingszinnen voor je reis', 'De zinnen die je echt nodig hebt, klaar voor gebruik, ook offline.', 'Waar ga je naartoe?', 'Wanneer vertrek je? (optioneel)', 'Aan de slag', 'Nog {n} dagen', 'Morgen vertrek je!', 'Goede reis! 🎉', 'Welkom terug', 'Reis wijzigen', 'Je 5 zinnen voor vandaag', '{n} van {m} zinnen geleerd', 'Taalgids', 'De basis', 'Onderweg', 'Uit eten', 'Hotel', 'Winkelen & geld', 'Getallen', 'Noodgevallen', 'Alarmnummer: {n}', 'Luister', 'Langzaam', 'Zeg het', 'Super! ✓', 'Bijna, probeer opnieuw', 'Tonen', 'Tik om te sluiten', '✓ Werkt offline op dit apparaat', 'Oefen met score in Harlo', 'Klaar voor vandaag! 🎉 Kom morgen terug voor 5 nieuwe.', 'Ken ik', 'Spraakherkenning werkt in Chrome, Edge of Safari.', 'Ik luister…'],
  tr: ['Harlo Seyahat', 'Seyahatin için hayatta kalma ifadeleri', 'Gerçekten ihtiyacın olacak ifadeler, kullanıma hazır, çevrimdışı bile.', 'Nereye gidiyorsun?', 'Ne zaman gidiyorsun? (isteğe bağlı)', 'Hadi', '{n} gün kaldı', 'Yarın gidiyorsun!', 'İyi yolculuklar! 🎉', 'Tekrar hoş geldin', 'Seyahati değiştir', 'Bugünün 5 ifadesi', '{m} ifadeden {n} tanesi öğrenildi', 'Konuşma kılavuzu', 'Temel ifadeler', 'Ulaşım', 'Dışarıda yemek', 'Otel', 'Alışveriş ve para', 'Sayılar', 'Acil durumlar', 'Acil numara: {n}', 'Dinle', 'Yavaş', 'Söyle', 'Harika! ✓', 'Az kaldı, tekrar dene', 'Göster', 'Kapatmak için dokun', '✓ Bu cihazda çevrimdışı çalışır', 'Harlo’te puanla çalış', 'Bugünlük bitti! 🎉 Yarın 5 tane daha için gel.', 'Öğrendim', 'Konuşma tanıma için Chrome, Edge veya Safari gerekir.', 'Dinliyorum…'],
  ja: ['Harlo 旅行', '旅行で使えるサバイバルフレーズ', '本当に必要なフレーズを、オフラインでもすぐ使えます。', 'どこへ行きますか？', '出発日は？（任意）', '始めよう', 'あと {n} 日', '明日出発！', 'よい旅を！🎉', 'おかえりなさい', '旅行を変更', '今日の旅行フレーズ5つ', '{m} 個中 {n} 個習得', 'フレーズ集', '基本', '移動', '外食', 'ホテル', '買い物とお金', '数字', '緊急時', '緊急番号：{n}', '聞く', 'ゆっくり', '言ってみる', 'すごい！✓', 'おしい、もう一度', '見せる', 'タップして閉じる', '✓ この端末ではオフラインで使えます', 'Harlo で採点しながら練習', '今日はここまで！🎉 明日また5つ。', '覚えた', '音声認識には Chrome、Edge、Safari が必要です。', '聞いています…'],
  ko: ['Harlo 여행', '여행 필수 생존 표현', '꼭 필요한 표현을 오프라인에서도 바로 쓸 수 있어요.', '어디로 가세요?', '언제 출발하세요? (선택)', '시작', '{n}일 남음', '내일 출발!', '즐거운 여행 되세요! 🎉', '다시 오신 걸 환영해요', '여행 변경', '오늘의 여행 표현 5개', '{m}개 중 {n}개 익힘', '표현집', '기본 표현', '이동', '외식', '호텔', '쇼핑과 돈', '숫자', '응급 상황', '긴급 번호: {n}', '듣기', '천천히', '말하기', '잘했어요! ✓', '아깝네요, 다시 해 봐요', '보여주기', '눌러서 닫기', '✓ 이 기기에서 오프라인으로 사용 가능', 'Harlo에서 점수와 함께 연습', '오늘은 끝! 🎉 내일 5개 더 해요.', '익혔어요', '음성 인식은 Chrome, Edge, Safari가 필요해요.', '듣는 중…'],
  vi: ['Harlo Du lịch', 'Câu sinh tồn cho chuyến đi', 'Những câu bạn thật sự cần, dùng được ngay, kể cả khi không có mạng.', 'Bạn sẽ đi đâu?', 'Khi nào bạn đi? (không bắt buộc)', 'Bắt đầu', 'Còn {n} ngày', 'Mai bạn đi rồi!', 'Chúc chuyến đi vui vẻ! 🎉', 'Chào mừng trở lại', 'Đổi chuyến đi', '5 câu hôm nay cho chuyến đi', 'Đã học {n}/{m} câu', 'Sổ tay câu', 'Cơ bản', 'Đi lại', 'Ăn uống', 'Khách sạn', 'Mua sắm & tiền', 'Số đếm', 'Khẩn cấp', 'Số khẩn cấp: {n}', 'Nghe', 'Chậm', 'Nói', 'Tuyệt! ✓', 'Gần đúng, thử lại', 'Hiện', 'Chạm để đóng', '✓ Dùng được ngoại tuyến trên thiết bị này', 'Luyện có chấm điểm trong Harlo', 'Xong hôm nay! 🎉 Mai quay lại học thêm 5 câu.', 'Đã thuộc', 'Nhận dạng giọng nói cần Chrome, Edge hoặc Safari.', 'Đang nghe…']
};
let ui = (() => { const v = get('sir_ui', null); if (T[v]) return v; const b = (navigator.language || 'en').slice(0, 2).toLowerCase(); return T[b] ? b : 'en'; })();
function t(k, vars) { const row = T[ui] || T.en; let v = row[K.indexOf(k)] || T.en[K.indexOf(k)] || k; if (vars) for (const a in vars) v = v.split('{' + a + '}').join(vars[a]); return v; }

// ---------- trip state ----------
const trip = () => get('hs_trip', null);
const saveTrip = v => put('hs_trip', v);
const dest = l => DEST.find(d => d[0] === l) || DEST[0];
function phrases(lang, cat) {
  const c = CATS.find(x => x[0] === cat), L = D[lang], en = lang === 'en' || lang === 'enus';
  if (cat === 'numbers') return Object.entries(L.nums || {}).map(([n, w]) => [w, n]);
  const out = [], seen = new Set();
  if (cat === 'sos') SOS[lang].forEach((p, i) => { out.push([p, SOS_EN[i]]); seen.add(p); });
  for (const s of c[2]) for (const p of (L.sets[s] || [])) {
    if (out.length >= (cat === 'sos' ? SOS[lang].length : 0) + c[4]) break;
    if (!seen.has(p[0]) && c[3].test(en ? p[0] : p[1])) { seen.add(p[0]); out.push(en ? [p[0], p[1]] : p); }
  }
  return out;
}
function allPhrases(lang) { const out = [], seen = new Set(); for (const c of CATS) if (c[0] !== 'numbers') for (const p of phrases(lang, c[0])) if (!seen.has(p[0])) { seen.add(p[0]); out.push(p); } return out; }
const learnedOf = tr => (tr.learned && tr.learned[tr.lang]) || [];
const pad = n => String(n).padStart(2, '0');
const dayKey = () => { const d = new Date(); return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); };
function daysLeft(tr) { if (!tr.date) return null; return Math.round((new Date(tr.date + 'T12:00:00') - new Date(dayKey() + 'T12:00:00')) / 864e5); }
function todays(tr) {
  const all = allPhrases(tr.lang), learned = new Set(learnedOf(tr));
  if (tr.day && tr.day.d === dayKey() && tr.day.l === tr.lang) return tr.day.ids.map(i => all[i]).filter(Boolean);
  // the five most useful phrases not learned yet, in the order of the phrasebook (essentials first)
  const ids = all.map((p, i) => i).filter(i => !learned.has(all[i][0])).slice(0, 5);
  tr.day = { d: dayKey(), l: tr.lang, ids }; saveTrip(tr);
  return ids.map(i => all[i]);
}

// ---------- speech ----------
let voices = [];
if ('speechSynthesis' in window) { voices = speechSynthesis.getVoices(); speechSynthesis.onvoiceschanged = () => { voices = speechSynthesis.getVoices(); }; }
function speak(text, rate) {
  if (!('speechSynthesis' in window)) return;
  const code = DEST_LANG[trip().lang], u = new SpeechSynthesisUtterance(text);
  u.lang = code; u.rate = rate || 0.92;
  const v = (window.bestVoice && window.bestVoice(code)) || voices.find(x => x.lang && x.lang.replace('_', '-') === code) || voices.find(x => x.lang && x.lang.slice(0, 2) === code.slice(0, 2));
  if (v) u.voice = v;
  speechSynthesis.cancel(); speechSynthesis.speak(u);
}
const Rec = window.SpeechRecognition || window.webkitSpeechRecognition;
const norm = s => String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^\p{L}\p{N} ]/gu, ' ').replace(/\s+/g, ' ').trim();
function sayCheck(btn, text, onOk) {
  if (!Rec) { btn.textContent = t('noMic'); return; }
  const r = new Rec(); r.lang = DEST_LANG[trip().lang]; r.interimResults = false; r.maxAlternatives = 3;
  const old = btn.innerHTML; btn.classList.add('on'); btn.textContent = t('listening');
  r.onresult = e => {
    const want = norm(text).split(' '), alts = [...e.results[0]].map(a => norm(a.transcript).split(' '));
    const best = Math.max(...alts.map(h => want.filter(w => h.includes(w)).length / want.length));
    btn.classList.remove('on');
    if (best >= 0.75) { btn.textContent = t('great'); btn.classList.add('ok'); fx('good', 5); if (onOk) onOk(); }
    else { btn.textContent = t('again'); fx('try'); setTimeout(() => { btn.innerHTML = old; }, 1800); }
  };
  r.onerror = () => { btn.classList.remove('on'); btn.innerHTML = old; };
  r.onend = () => btn.classList.remove('on');
  try { r.start(); } catch (e) { btn.innerHTML = old; }
}

// ---------- journeys, stops, emergency guide ----------
// More emergency phrases for the guide: [do you speak English?, I don't speak <language>, I'm at…, there's been an accident, there's a fire]
const SOS2 = {
  en: ['I need an interpreter', "I don't speak English well", "I'm at…", "There's been an accident", "There's a fire"],
  enus: ['I need an interpreter', "I don't speak English well", "I'm at…", "There's been an accident", "There's a fire"],
  es: ['¿Habla inglés?', 'No hablo español', 'Estoy en…', 'Ha habido un accidente', 'Hay un incendio'],
  esmx: ['¿Habla inglés?', 'No hablo español', 'Estoy en…', 'Hubo un accidente', 'Hay un incendio'],
  fr: ['Parlez-vous anglais ?', 'Je ne parle pas français', 'Je suis à…', 'Il y a eu un accident', 'Il y a un incendie'],
  it: ['Parla inglese?', 'Non parlo italiano', 'Mi trovo a…', "C'è stato un incidente", "C'è un incendio"],
  de: ['Sprechen Sie Englisch?', 'Ich spreche kein Deutsch', 'Ich bin in…', 'Es gab einen Unfall', 'Es brennt'],
  pt: ['Fala inglês?', 'Não falo português', 'Estou em…', 'Houve um acidente', 'Há um incêndio'],
  nl: ['Spreekt u Engels?', 'Ik spreek geen Nederlands', 'Ik ben bij…', 'Er is een ongeluk gebeurd', 'Er is brand']
};
const LANG_EN = { es: 'Spanish', esmx: 'Spanish', fr: 'French', it: 'Italian', de: 'German', pt: 'Portuguese', nl: 'Dutch' };
const sos2 = l => { const P = SOS2[l] || SOS2.en, en = l === 'en' || l === 'enus';
  return P.map((p, i) => [p, en ? p : ["Do you speak English?", "I don't speak " + LANG_EN[l], "I'm at…", "There's been an accident", "There's a fire"][i]]); };
const sos1 = l => (SOS[l] || SOS.en).map((p, i) => [p, SOS_EN[i]]);

const K2 = ['choose', 'grand', 'grandD', 'stops', 'stop', 'next', 'stopDone', 'jDone', 'emerg', 'sosT', 's1', 's1p', 's2', 's2p', 's2en', 's3', 's4', 's4p', 's5', 'more', 'start5', 'map', 'when2'];
const T2 = {
  en: ['Choose your journey', 'Grand tour', 'Everything, from hello to help', '{n} of {m} stops', 'Stop {n}', 'Next', 'Stop complete! 🎉', 'Journey complete! 🎉', 'Emergency', 'Emergency help', 'Call {n}', 'Tap to call the emergency number.', 'Ask for English', 'Say this first. Many emergency operators can switch to English or bring in an interpreter.', 'Ask for an interpreter', 'Say what you need', 'Say where you are', 'Give the street, a landmark or the name of your hotel. Your phone’s map app can show where you are.', 'Stay on the line and do what they tell you.', 'More emergency phrases', "Start today's 5", 'Back to the map', 'When do you leave?'],
  es: ['Elige tu ruta', 'La gran ruta', 'Todo, desde hola hasta ayuda', '{n} de {m} paradas', 'Parada {n}', 'Siguiente', '¡Parada completada! 🎉', '¡Ruta completada! 🎉', 'Emergencia', 'Ayuda en una emergencia', 'Llama al {n}', 'Toca para llamar al número de emergencias.', 'Pide inglés', 'Di esto primero. Muchos operadores de emergencias pueden pasar al inglés o buscar un intérprete.', 'Pide un intérprete', 'Di lo que necesitas', 'Di dónde estás', 'Da la calle, un lugar conocido o el nombre de tu hotel. La app de mapas del móvil puede mostrar dónde estás.', 'No cuelgues y haz lo que te digan.', 'Más frases de emergencia', 'Empezar las 5 de hoy', 'Volver al mapa', '¿Cuándo sales?'],
  fr: ['Choisis ton parcours', 'Le grand tour', 'Tout, de bonjour à au secours', '{n} étapes sur {m}', 'Étape {n}', 'Suivant', 'Étape terminée ! 🎉', 'Parcours terminé ! 🎉', 'Urgence', 'Aide en cas d’urgence', 'Appelle le {n}', 'Touche pour appeler le numéro d’urgence.', 'Demande l’anglais', 'Dis ceci en premier. Beaucoup d’opérateurs d’urgence peuvent passer à l’anglais ou trouver un interprète.', 'Demande un interprète', 'Dis ce dont tu as besoin', 'Dis où tu es', 'Donne la rue, un lieu connu ou le nom de ton hôtel. L’appli de cartes du téléphone peut montrer où tu es.', 'Reste en ligne et suis leurs consignes.', 'Autres phrases d’urgence', 'Commencer les 5 du jour', 'Retour à la carte', 'Quand pars-tu ?'],
  it: ['Scegli il tuo percorso', 'Il grande giro', 'Tutto, da ciao ad aiuto', '{n} di {m} tappe', 'Tappa {n}', 'Avanti', 'Tappa completata! 🎉', 'Percorso completato! 🎉', 'Emergenza', 'Aiuto in emergenza', 'Chiama il {n}', 'Tocca per chiamare il numero di emergenza.', 'Chiedi l’inglese', 'Dillo per primo. Molti operatori di emergenza possono passare all’inglese o trovare un interprete.', 'Chiedi un interprete', 'Di’ di cosa hai bisogno', 'Di’ dove ti trovi', 'Indica la via, un luogo noto o il nome dell’hotel. L’app delle mappe del telefono può mostrarti dove sei.', 'Resta in linea e fai quello che ti dicono.', 'Altre frasi di emergenza', 'Inizia le 5 di oggi', 'Torna alla mappa', 'Quando parti?'],
  de: ['Wähle deine Route', 'Die große Tour', 'Alles, von Hallo bis Hilfe', '{n} von {m} Stationen', 'Station {n}', 'Weiter', 'Station geschafft! 🎉', 'Route geschafft! 🎉', 'Notfall', 'Hilfe im Notfall', '{n} anrufen', 'Tippe, um die Notrufnummer anzurufen.', 'Nach Englisch fragen', 'Sag das zuerst. Viele Notrufzentralen können auf Englisch wechseln oder einen Dolmetscher holen.', 'Nach einem Dolmetscher fragen', 'Sag, was du brauchst', 'Sag, wo du bist', 'Nenne die Straße, einen bekannten Ort oder den Namen deines Hotels. Die Karten-App deines Handys zeigt, wo du bist.', 'Bleib in der Leitung und tu, was man dir sagt.', 'Weitere Notfallsätze', 'Die 5 von heute starten', 'Zurück zur Karte', 'Wann geht es los?'],
  pt: ['Escolhe o teu percurso', 'A grande volta', 'Tudo, de olá a socorro', '{n} de {m} paragens', 'Paragem {n}', 'Seguinte', 'Paragem concluída! 🎉', 'Percurso concluído! 🎉', 'Emergência', 'Ajuda em emergência', 'Liga {n}', 'Toca para ligar para o número de emergência.', 'Pede inglês', 'Diz isto primeiro. Muitos operadores de emergência podem mudar para inglês ou arranjar um intérprete.', 'Pede um intérprete', 'Diz o que precisas', 'Diz onde estás', 'Dá a rua, um sítio conhecido ou o nome do hotel. A app de mapas do telemóvel mostra onde estás.', 'Não desligues e faz o que te disserem.', 'Mais frases de emergência', 'Começar as 5 de hoje', 'Voltar ao mapa', 'Quando partes?'],
  pl: ['Wybierz trasę', 'Wielka wycieczka', 'Wszystko, od cześć do pomocy', '{n} z {m} przystanków', 'Przystanek {n}', 'Dalej', 'Przystanek zaliczony! 🎉', 'Trasa ukończona! 🎉', 'Nagły wypadek', 'Pomoc w nagłym wypadku', 'Zadzwoń pod {n}', 'Dotknij, aby zadzwonić pod numer alarmowy.', 'Poproś o angielski', 'Powiedz to najpierw. Wielu dyspozytorów może przejść na angielski lub wezwać tłumacza.', 'Poproś o tłumacza', 'Powiedz, czego potrzebujesz', 'Powiedz, gdzie jesteś', 'Podaj ulicę, znane miejsce albo nazwę hotelu. Aplikacja z mapami w telefonie pokaże, gdzie jesteś.', 'Nie rozłączaj się i rób, co ci mówią.', 'Więcej zwrotów alarmowych', 'Zacznij dzisiejszą piątkę', 'Wróć do mapy', 'Kiedy wyjeżdżasz?'],
  ro: ['Alege-ți traseul', 'Marele tur', 'Totul, de la salut la ajutor', '{n} din {m} opriri', 'Oprirea {n}', 'Următorul', 'Oprire terminată! 🎉', 'Traseu terminat! 🎉', 'Urgență', 'Ajutor în caz de urgență', 'Sună la {n}', 'Atinge ca să suni la numărul de urgență.', 'Cere engleză', 'Spune asta mai întâi. Mulți operatori de urgență pot trece la engleză sau pot aduce un interpret.', 'Cere un interpret', 'Spune de ce ai nevoie', 'Spune unde ești', 'Spune strada, un loc cunoscut sau numele hotelului. Aplicația de hărți din telefon îți arată unde ești.', 'Rămâi pe linie și fă ce ți se spune.', 'Mai multe fraze de urgență', 'Începe cele 5 de azi', 'Înapoi la hartă', 'Când pleci?'],
  uk: ['Обери маршрут', 'Великий тур', 'Усе — від «привіт» до «допоможіть»', '{n} з {m} зупинок', 'Зупинка {n}', 'Далі', 'Зупинку пройдено! 🎉', 'Маршрут пройдено! 🎉', 'Екстрена допомога', 'Допомога в надзвичайній ситуації', 'Дзвони {n}', 'Торкнися, щоб подзвонити на екстрений номер.', 'Попроси англійську', 'Скажи це першим. Багато операторів можуть перейти на англійську або залучити перекладача.', 'Попроси перекладача', 'Скажи, що тобі потрібно', 'Скажи, де ти', 'Назви вулицю, відоме місце або назву готелю. Додаток карт на телефоні покаже, де ти.', 'Не клади слухавку й роби, що кажуть.', 'Більше екстрених фраз', 'Почати 5 на сьогодні', 'Назад до карти', 'Коли виїжджаєш?'],
  zh: ['选择你的路线', '环游全程', '从你好到救命，全都有', '{m} 站中已完成 {n} 站', '第 {n} 站', '下一个', '这一站完成！🎉', '路线完成！🎉', '紧急情况', '紧急求助', '拨打 {n}', '点击拨打紧急电话。', '要求说英语', '先说这句。很多紧急接线员可以换成英语或找翻译。', '要求翻译', '说出你需要什么', '说出你在哪里', '说出街道、地标或酒店名称。手机地图可以显示你的位置。', '不要挂断，按照他们说的做。', '更多紧急短语', '开始今天的 5 句', '返回地图', '什么时候出发？'],
  ar: ['اختر رحلتك', 'الجولة الكبرى', 'كل شيء، من مرحبًا إلى النجدة', '{n} من {m} محطات', 'المحطة {n}', 'التالي', 'اكتملت المحطة! 🎉', 'اكتملت الرحلة! 🎉', 'طوارئ', 'المساعدة في الطوارئ', 'اتصل بـ {n}', 'اضغط للاتصال برقم الطوارئ.', 'اطلب الإنجليزية', 'قل هذا أولًا. يستطيع كثير من موظفي الطوارئ التحدث بالإنجليزية أو إحضار مترجم.', 'اطلب مترجمًا', 'قل ما تحتاجه', 'قل أين أنت', 'اذكر الشارع أو معلمًا قريبًا أو اسم الفندق. تطبيق الخرائط في هاتفك يُظهر مكانك.', 'ابقَ على الخط واتبع التعليمات.', 'المزيد من عبارات الطوارئ', 'ابدأ عبارات اليوم الخمس', 'العودة إلى الخريطة', 'متى تسافر؟'],
  nl: ['Kies je route', 'De grote tour', 'Alles, van hallo tot help', '{n} van {m} stops', 'Stop {n}', 'Volgende', 'Stop klaar! 🎉', 'Route klaar! 🎉', 'Noodgeval', 'Hulp bij een noodgeval', 'Bel {n}', 'Tik om het alarmnummer te bellen.', 'Vraag om Engels', 'Zeg dit eerst. Veel meldkamers kunnen overschakelen op Engels of een tolk inschakelen.', 'Vraag om een tolk', 'Zeg wat je nodig hebt', 'Zeg waar je bent', 'Noem de straat, een bekend punt of de naam van je hotel. De kaarten-app op je telefoon laat zien waar je bent.', 'Blijf aan de lijn en doe wat ze zeggen.', 'Meer noodzinnen', 'Start de 5 van vandaag', 'Terug naar de kaart', 'Wanneer vertrek je?'],
  tr: ['Rotanı seç', 'Büyük tur', 'Merhabadan imdada her şey', '{m} duraktan {n}', '{n}. durak', 'Sonraki', 'Durak tamam! 🎉', 'Rota tamam! 🎉', 'Acil durum', 'Acil durumda yardım', '{n} ara', 'Acil numarayı aramak için dokun.', 'İngilizce iste', 'Önce bunu söyle. Birçok acil operatörü İngilizceye geçebilir ya da tercüman bulabilir.', 'Tercüman iste', 'Neye ihtiyacın olduğunu söyle', 'Nerede olduğunu söyle', 'Sokağı, bilinen bir yeri ya da otelinin adını söyle. Telefonundaki harita uygulaması nerede olduğunu gösterir.', 'Hattan ayrılma ve söylenenleri yap.', 'Daha fazla acil durum ifadesi', 'Bugünün 5’ini başlat', 'Haritaya dön', 'Ne zaman gidiyorsun?'],
  ja: ['ルートを選ぼう', 'グランドツアー', 'こんにちはから助けてまで全部', '{m}か所中{n}か所', 'ストップ {n}', '次へ', 'ストップ完了！🎉', 'ルート完了！🎉', '緊急', '緊急時のサポート', '{n} に電話', 'タップして緊急番号に電話。', '英語をお願いする', 'まずこれを言いましょう。多くの緊急オペレーターは英語に切り替えたり通訳を手配したりできます。', '通訳をお願いする', '必要なことを伝える', '居場所を伝える', '通りの名前、目印、ホテル名を伝えましょう。スマホの地図アプリで現在地がわかります。', '電話を切らずに指示に従いましょう。', 'ほかの緊急フレーズ', '今日の5つを始める', '地図に戻る', '出発日は？'],
  ko: ['여정을 골라요', '그랜드 투어', '안녕부터 도와주세요까지 전부', '{m}곳 중 {n}곳', '{n}번째 정류장', '다음', '정류장 완료! 🎉', '여정 완료! 🎉', '긴급', '긴급 도움', '{n}에 전화', '눌러서 긴급 번호로 전화하세요.', '영어를 요청하기', '먼저 이렇게 말하세요. 많은 긴급 상담원이 영어로 바꾸거나 통역을 연결해 줄 수 있어요.', '통역을 요청하기', '필요한 것을 말하기', '위치를 말하기', '거리 이름, 주변 명소, 호텔 이름을 말하세요. 휴대폰 지도 앱에서 현재 위치를 볼 수 있어요.', '전화를 끊지 말고 안내를 따르세요.', '긴급 표현 더 보기', '오늘의 5개 시작', '지도로 돌아가기', '언제 출발하세요?'],
  vi: ['Chọn hành trình', 'Chuyến đi trọn vẹn', 'Mọi thứ, từ xin chào đến cứu với', '{n}/{m} điểm dừng', 'Điểm dừng {n}', 'Tiếp', 'Xong điểm dừng! 🎉', 'Xong hành trình! 🎉', 'Khẩn cấp', 'Trợ giúp khẩn cấp', 'Gọi {n}', 'Chạm để gọi số khẩn cấp.', 'Xin nói tiếng Anh', 'Nói câu này trước. Nhiều tổng đài khẩn cấp có thể chuyển sang tiếng Anh hoặc gọi phiên dịch.', 'Xin phiên dịch', 'Nói bạn cần gì', 'Nói bạn đang ở đâu', 'Nói tên đường, địa điểm nổi bật hoặc tên khách sạn. Ứng dụng bản đồ trên điện thoại cho biết bạn đang ở đâu.', 'Giữ máy và làm theo hướng dẫn.', 'Thêm câu khẩn cấp', 'Bắt đầu 5 câu hôm nay', 'Về bản đồ', 'Khi nào bạn đi?']
};
function t2(k, vars) { const row = T2[ui] || T2.en; let v = row[K2.indexOf(k)] || T2.en[K2.indexOf(k)] || k; if (vars) for (const a in vars) v = v.split('{' + a + '}').join(vars[a]); return v; }

const JOURNEYS = ['grand', 'essentials', 'around', 'food', 'hotel', 'money', 'numbers', 'sos'];
const JIC = { grand: '🌍', essentials: '👋', around: '🚆', food: '🍽️', hotel: '🏨', money: '💶', numbers: '🔢', sos: '🆘' };
const JCOL = { grand: ['#F59E0B', '#F97316'], essentials: ['#3346C8', '#6C7BFF'], around: ['#0369A1', '#38BDF8'], food: ['#C2410C', '#FB923C'], hotel: ['#7B2FD0', '#B66CF0'], money: ['#16A34A', '#4ADE80'], numbers: ['#475569', '#94A3B8'], sos: ['#DC2626', '#F87171'] };
const STOP_IC = { essentials: ['👋', '🙏', '❓', '😊', '🤝', '💬'], around: ['🚉', '🚕', '🗺️', '🚌', '✈️', '🎫'], food: ['🥐', '☕', '🍝', '🍷', '🧾', '🍰'], hotel: ['🛎️', '🛏️', '🍳', '🧳', '📶'], money: ['💳', '🏧', '🧾', '💶'], numbers: ['1️⃣', '5️⃣', '🔟', '💯'], sos: ['🚑', '🏥', '💊', '🚓', '📞'] };
function stopsOf(jid) {
  const l = trip().lang;
  if (jid === 'grand') return CATS.map(c => ({ ic: c[1], name: t('c_' + c[0]), list: (c[0] === 'sos' ? sos1(l).slice(0, 4) : phrases(l, c[0]).slice(0, c[0] === 'numbers' ? 5 : 4)) })).filter(s => s.list.length);
  const all = jid === 'sos' ? [...sos1(l), ...sos2(l).slice(2)] : phrases(l, jid), n = jid === 'numbers' ? 5 : 4, out = [];
  for (let i = 0; i < all.length; i += n) out.push({ ic: (STOP_IC[jid] || ['📍'])[out.length % (STOP_IC[jid] || ['📍']).length], name: t2('stop', { n: out.length + 1 }), list: all.slice(i, i + n) });
  if (out.length > 1 && out[out.length - 1].list.length < 2) { const last = out.pop(); out[out.length - 1].list.push(...last.list); }
  return out;
}
const isGot = p => learnedOf(trip()).includes(p[0]);
const stopDone = s => s.list.every(isGot);
function learn(p) { if (!isGot(p)) markGot(p[0], null); }

// The map of one journey: stops along a winding road; finish one to unlock the next.
const jpos = i => ({ x: [26, 70, 34, 74, 28, 66, 30, 70][i % 8], y: 90 + i * 120 });
let mapEl = null, curJ = null;
function openJourney(jid, moveFrom) {
  curJ = jid; fx('tick');
  const S = stopsOf(jid), [c1, c2] = JCOL[jid], H = S.length * 120 + 80, pts = S.map((x, i) => jpos(i));
  const doneN = S.filter(stopDone).length, cur = Math.min(S.length - 1, S.findIndex(s => !stopDone(s)) < 0 ? S.length - 1 : S.findIndex(s => !stopDone(s)));
  const unlocked = i => i === 0 || stopDone(S[i - 1]);
  const d = pts.map((p, i) => (i ? `S ${(pts[i - 1].x + p.x) / 2 + (i % 2 ? 18 : -18)} ${p.y - 60} ${p.x} ${p.y}` : `M ${p.x} ${p.y}`)).join(' ');
  if (!mapEl) { mapEl = document.createElement('div'); mapEl.className = 'tj-map'; mapEl.setAttribute('role', 'dialog'); document.body.appendChild(mapEl); mapEl.addEventListener('click', onMap); }
  const [, flag, country] = dest(trip().lang), finished = doneN >= S.length;
  const deco = ['🌴', '🏠', '🌷', '⛪', '🌳', '⛲', '🏖️', '🏛️', '🌳', '🎡', '🌲', '🏰'].map((e, i) => `<span class="tj-deco" style="left:${i % 2 ? 4 + (i * 7) % 12 : 84 + (i * 5) % 9}%;top:${60 + i * 96}px">${e}</span>`).join('');
  const at = jpos(moveFrom != null ? moveFrom : cur);
  mapEl.style.setProperty('--c1', c1); mapEl.style.setProperty('--c2', c2);
  mapEl.innerHTML = `<div class="tj-top"><button class="tj-x" data-jclose aria-label="${esc(t('back'))}">✕</button><h3>${JIC[jid]} ${esc(jid === 'grand' ? t2('grand') : t('c_' + jid))}<small>${flag} ${esc(country)} · ${esc(t2('stops', { n: doneN, m: S.length }))}</small></h3></div>
    <div class="tj-scroll"><div class="tj-road" style="height:${H}px">
    <svg class="tj-path" viewBox="0 0 100 ${H}" preserveAspectRatio="none"><path d="${d}" fill="none" stroke="#fff" stroke-width="10" stroke-linecap="round" vector-effect="non-scaling-stroke" opacity=".9"/><path d="${d}" fill="none" stroke="${c1}" stroke-width="3" stroke-dasharray="10 10" vector-effect="non-scaling-stroke" opacity=".7"/></svg>
    ${deco}
    ${S.map((s, i) => { const p = pts[i], dn = stopDone(s), lk = !unlocked(i), got = s.list.filter(isGot).length;
      return `<button class="tj-stop${dn ? ' done' : lk ? ' lock' : i === cur ? ' cur' : ''}" style="left:${p.x}%;top:${p.y}px;--i:${i}" data-stop="${i}" aria-label="${esc(s.name)}">${dn ? '✓' : s.ic}${lk ? '<span class="lk">🔒</span>' : ''}</button>
      <span class="tj-lbl" style="left:${p.x}%;top:${p.y + 44}px">${esc(s.name)}<small>${got}/${s.list.length}</small></span>`; }).join('')}
    <div class="tj-me" id="tjMe" style="left:${at.x}%;top:${at.y - 30}px">🧳</div>
    </div></div>
    ${finished ? `<div class="tj-fin"><div style="font-size:46px">🎉</div><h4>${esc(t2('jDone'))}</h4><button data-jclose>${esc(t('back'))}</button></div>` : ''}`;
  mapEl.style.display = 'flex'; document.body.style.overflow = 'hidden';
  const sc = mapEl.querySelector('.tj-scroll'); sc.scrollTop = Math.max(0, at.y - sc.clientHeight / 2);
  if (moveFrom != null && moveFrom !== cur) setTimeout(() => { const p = jpos(cur), me = $('tjMe'); if (!me) return; me.style.left = p.x + '%'; me.style.top = (p.y - 30) + 'px'; sc.scrollTo({ top: Math.max(0, p.y - sc.clientHeight / 2), behavior: 'smooth' }); fx('pop'); }, 600);
  if (finished && moveFrom != null && window.HSFX) { HSFX.sound('win'); HSFX.confetti(); }
}
function closeJourney() { if (mapEl) { mapEl.style.display = 'none'; mapEl.innerHTML = ''; } document.body.style.overflow = ''; curJ = null; home(); }
function onMap(e) {
  if (e.target.closest('[data-jclose]')) return closeJourney();
  const b = e.target.closest('[data-stop]'); if (!b) return;
  if (b.classList.contains('lock')) { b.animate([{ transform: 'translate(-50%,-50%) rotate(0)' }, { transform: 'translate(-50%,-50%) rotate(-8deg)' }, { transform: 'translate(-50%,-50%) rotate(8deg)' }, { transform: 'translate(-50%,-50%) rotate(0)' }], { duration: 350 }); fx('try'); return; }
  const i = +b.dataset.stop, S = stopsOf(curJ);
  runner(S[i].list, { title: S[i].ic + ' ' + S[i].name, col: JCOL[curJ], done: () => openJourney(curJ, i) });
}

// One phrase at a time, big and colourful: listen, say it, show it, got it.
let runEl = null;
function runner(list, o) {
  if (!runEl) { runEl = document.createElement('div'); runEl.className = 'tj-run'; runEl.setAttribute('role', 'dialog'); document.body.appendChild(runEl); }
  let i = Math.max(0, list.findIndex(p => !isGot(p)));
  runEl.style.setProperty('--c1', o.col[0]); runEl.style.setProperty('--c2', o.col[1]);
  document.body.style.overflow = 'hidden'; runEl.style.display = 'block';
  function draw(dir) {
    if (i >= list.length) return finish();
    const p = list[i];
    runEl.innerHTML = `<div class="tr-in"><div class="tr-bar"><button class="tj-x" data-rx aria-label="${esc(t('back'))}">✕</button><div class="tr-prog">${list.map((q, k) => `<i class="${k === i ? 'cur' : isGot(q) ? 'ok' : ''}"></i>`).join('')}</div><span class="tr-n">${i + 1}/${list.length}</span></div>
      <div class="tr-title">${esc(o.title)}</div>
      <div class="tr-panel ${dir || 'in'}"><div class="tr-p" dir="auto">${esc(p[0])}</div><div class="tr-m">${esc(p[1])}</div>
        <div class="tr-btns"><button data-say><span>🔊</span>${esc(t('listen'))}</button><button data-slow><span>🐢</span>${esc(t('slow'))}</button><button data-rec><span>🎙️</span>${esc(t('say'))}</button><button data-show><span>📣</span>${esc(t('show'))}</button></div>
        <button class="tr-got${isGot(p) ? ' on' : ''}" data-got>✓ ${esc(t('got'))}</button>
        <div class="tr-nav"><button data-prev ${i ? '' : 'disabled'}>←</button><button data-next>${esc(t2('next'))} →</button></div></div></div>`;
    speak(p[0]);
  }
  function finish() {
    fx('win', 10); if (window.HSFX) HSFX.confetti();
    runEl.innerHTML = `<div class="tr-in"><div class="tr-panel in tr-end"><div style="font-size:56px">🎉</div><h3>${esc(t2('stopDone'))}</h3><p>${list.filter(isGot).length}/${list.length} ✓</p><button class="tr-got on" data-rx>${esc(o.back || t2('map'))} →</button></div></div>`;
  }
  function close() { runEl.style.display = 'none'; runEl.innerHTML = ''; runEl.onclick = null; document.body.style.overflow = ''; if (o.done) o.done(); }
  runEl.onclick = e => {
    const b = e.target.closest('button'); if (!b) return; const p = list[i];
    if (b.hasAttribute('data-rx')) return close();
    if (b.hasAttribute('data-say')) return speak(p[0]);
    if (b.hasAttribute('data-slow')) return speak(p[0], 0.6);
    if (b.hasAttribute('data-show')) return show(p[0], p[1]);
    if (b.hasAttribute('data-rec')) return sayCheck(b, p[0], () => { learn(p); setTimeout(() => { i++; draw('in'); }, 700); });
    if (b.hasAttribute('data-got')) { learn(p); i++; return draw('in'); }
    if (b.hasAttribute('data-next')) { i++; return draw('in'); }
    if (b.hasAttribute('data-prev')) { i = Math.max(0, i - 1); return draw('back'); }
  };
  draw();
}

// Emergency guide: call, ask for English, say what you need, say where you are.
function sosGuide() {
  const tr = trip(), [l, , , num] = dest(tr.lang), A = sos1(l), B = sos2(l), en = l === 'en' || l === 'enus';
  const row = p => `<div class="sg-p"><div><b dir="auto">${esc(p[0])}</b>${p[1] !== p[0] ? `<small>${esc(p[1])}</small>` : ''}</div><button data-sp="${esc(p[0])}" aria-label="${esc(t('listen'))}">🔊</button><button data-sh="${esc(p[0])}" data-m="${esc(p[1])}" aria-label="${esc(t('show'))}">📣</button></div>`;
  app.innerHTML = `<div class="tv-top"><button class="tv-back" data-home aria-label="${esc(t('back'))}">←</button><h2>🆘 ${esc(t2('sosT'))}</h2></div>
    <ol class="sg">
      <li><h3>${esc(t2('s1', { n: num }))}</h3><a class="tv-sos" href="tel:${num}">📞 ${esc(num)}</a><p>${esc(t2('s1p'))}</p></li>
      <li><h3>${esc(en ? t2('s2en') : t2('s2'))}</h3><p>${esc(t2('s2p'))}</p>${row(B[0])}${row(B[1])}</li>
      <li><h3>${esc(t2('s3'))}</h3>${row(A[1])}${row(A[2])}${row(B[4])}${row(B[3])}${row(A[3])}</li>
      <li><h3>${esc(t2('s4'))}</h3><p>${esc(t2('s4p'))}</p>${row(B[2])}${row(A[5])}</li>
      <li><h3>${esc(t2('s5'))}</h3></li>
    </ol>
    <h3 class="tv-h">${esc(t2('more'))}</h3>${[A[0], A[4], A[6], A[7], A[8], A[9]].map(row).join('')}`;
  app.querySelectorAll('[data-sp]').forEach(b => b.onclick = () => speak(b.dataset.sp));
  app.querySelectorAll('[data-sh]').forEach(b => b.onclick = () => show(b.dataset.sh, b.dataset.m));
  app.querySelectorAll('[data-home]').forEach(b => b.onclick = home);
  window.scrollTo(0, 0);
}

// ---------- views ----------
const DCOL = [['#E11D48','#FB923C'],['#2563EB','#60A5FA'],['#16A34A','#86EFAC'],['#B91C1C','#F59E0B'],['#334155','#F59E0B'],['#EA580C','#FDBA74'],['#15803D','#DC2626'],['#1E3A8A','#DC2626'],['#1D4ED8','#EF4444']];
function setup(change) {
  const tr = trip() || {};
  app.innerHTML = `<section class="tv-hero"><div class="tv-plane">✈️</div><h1>${esc(t('hero'))}</h1><p>${esc(t('heroP'))}</p></section>
    <h3 class="tv-h tv-q">🧭 ${esc(t('where'))}</h3><div class="tv-dest">${DEST.map(([l, f, n], i) => `<button class="tv-d${tr.lang === l ? ' on' : ''}" data-dest="${l}" style="--i:${i};--c1:${DCOL[i][0]};--c2:${DCOL[i][1]}"><span>${f}</span>${esc(n)}</button>`).join('')}</div>
    <label class="tv-when"><span class="w-ic">📅</span><span class="w-t"><b>${esc(t('when'))}</b><input type="date" id="tvDate" value="${esc(tr.date || '')}" min="${dayKey()}"></span></label>
    <button class="tv-go" id="tvGo" ${tr.lang ? '' : 'disabled'}>✈️ ${esc(t('start'))}</button>${change ? `<button class="btn big tv-cancel" data-home>${esc(t('back'))}</button>` : ''}`;
  let pick = tr.lang || null;
  app.querySelectorAll('[data-dest]').forEach(b => b.onclick = () => { pick = b.dataset.dest; app.querySelectorAll('[data-dest]').forEach(x => x.classList.toggle('on', x === b)); $('tvGo').disabled = false; fx('tick'); });
  $('tvGo').onclick = () => { const n = Object.assign({}, trip() || {}, { lang: pick, date: $('tvDate').value || '' }); n.learned = n.learned || {}; n.day = null; saveTrip(n); track('trip_set', pick); fx('good'); home(); };
  app.querySelectorAll('[data-home]').forEach(b => b.onclick = home);
}
function home() {
  const tr = trip(); if (!tr || !D[tr.lang]) return setup();
  const [l, flag, country, sos] = dest(tr.lang), left = daysLeft(tr), all = allPhrases(l), learned = learnedOf(tr).filter(p => all.some(x => x[0] === p)).length;
  const five = todays(tr), got = p => learnedOf(tr).includes(p[0]), got5 = five.filter(got).length, done5 = five.length === 0 || got5 >= five.length;
  const when = left === null ? '' : left > 1 ? t('days', { n: left }) : left === 1 ? t('tomorrow') : left === 0 || left > -21 ? t('today') : '';
  const tile = (jid, i) => { const S = stopsOf(jid), dn = S.filter(stopDone).length, [c1, c2] = JCOL[jid];
    return `<button class="tj-t${jid === 'grand' || jid === 'sos' ? ' wide' : ''}" data-j="${jid}" style="--c1:${c1};--c2:${c2};--i:${i}"><span class="ji">${JIC[jid]}</span><b>${esc(jid === 'grand' ? t2('grand') : t('c_' + jid))}</b>${jid === 'grand' ? `<small class="jd">${esc(t2('grandD'))}</small>` : ''}<small>${esc(t2('stops', { n: dn, m: S.length }))}</small><span class="jb"><i style="width:${S.length ? Math.round(100 * dn / S.length) : 0}%"></i></span></button>`; };
  app.innerHTML = `<section class="tv-trip"><span class="tv-flag">${flag}</span><div><h2>${esc(country)}</h2><p>${esc(when)}</p></div><button class="tv-ch" data-change>${esc(t('change'))}</button>
      <div class="tv-meter"><i style="width:${Math.round(100 * learned / all.length)}%"></i></div><small>${esc(t('learned', { n: learned, m: all.length }))}</small></section>
    <button class="tv-sosq" data-sos><span class="q-ic">🆘</span><b>${esc(t2('emerg'))}</b><span class="q-n">📞 ${esc(sos)}</span></button>
    <button class="tv-five${done5 ? ' done' : ''}" data-five ${five.length ? '' : 'disabled'}><span class="f-ic">⭐</span><span class="f-t"><b>${esc(t('today5'))}</b><small>${esc(done5 ? t('done5') : t2('start5'))}</small></span><span class="f-dots">${five.map(p => `<i class="${got(p) ? 'ok' : ''}"></i>`).join('')}</span><span class="f-go">${done5 ? '✓' : '▶'}</span></button>
    <h3 class="tv-h">🗺️ ${esc(t2('choose'))}</h3>
    <div class="tj-grid">${JOURNEYS.map(tile).join('')}</div>
    <a class="tv-prac" href="/?lang=${l}&set=Travel&lesson=1">🎙️ ${esc(t('practise'))} →</a>
    <p class="fine tv-off" id="tvOff"></p>`;
  app.querySelector('[data-change]').onclick = () => setup(true);
  app.querySelector('[data-sos]').onclick = () => { fx('tick'); sosGuide(); };
  app.querySelector('[data-five]').onclick = () => runner(five, { title: '⭐ ' + t('today5'), col: ['#FF7A2F', '#FFB547'], back: t('back'), done: home });
  app.querySelectorAll('[data-j]').forEach(b => b.onclick = () => openJourney(b.dataset.j));
  offlineNote();
}
function card(p, i, daily) {
  const tr = trip(), got = learnedOf(tr).includes(p[0]);
  return `<div class="tv-card${got ? ' got' : ''}" style="--i:${i}" data-p="${esc(p[0])}"><div class="tv-p" dir="auto">${esc(p[0])}</div><div class="tv-m">${esc(p[1])}</div>
    <div class="tv-btns"><button data-say>🔊 ${esc(t('listen'))}</button><button data-slow>🐢 ${esc(t('slow'))}</button><button data-rec>🎙️ ${esc(t('say'))}</button><button data-show>📣 ${esc(t('show'))}</button>${daily || !got ? `<button data-got class="${got ? 'on' : ''}">${got ? '✓' : '☆'} ${esc(t('got'))}</button>` : ''}</div></div>`;
}
function category(id) {
  const tr = trip(), [, , , sos] = dest(tr.lang), list = phrases(tr.lang, id);
  app.innerHTML = `<div class="tv-top"><button class="tv-back" data-home aria-label="${esc(t('back'))}">←</button><h2>${CATS.find(c => c[0] === id)[1]} ${esc(t('c_' + id))}</h2></div>
    ${id === 'sos' ? `<a class="tv-sos" href="tel:${sos}">📞 ${esc(t('sosNum', { n: sos }))}</a>` : ''}
    <div class="tv-list">${list.map((p, i) => card(p, i, false)).join('')}</div>`;
  bind(); window.scrollTo(0, 0);
}
function markGot(p, el) {
  const tr = trip(); tr.learned = tr.learned || {}; const L = tr.learned[tr.lang] = tr.learned[tr.lang] || [];
  const i = L.indexOf(p);
  if (i < 0) { L.push(p); fx('pop', 3); } else L.splice(i, 1);
  saveTrip(tr);
  if (el) { el.classList.toggle('got', i < 0); const b = el.querySelector('[data-got]'); if (b) { b.classList.toggle('on', i < 0); b.textContent = (i < 0 ? '✓ ' : '☆ ') + t('got'); } }
  const five = todays(tr); if (i < 0 && five.every(x => learnedOf(tr).includes(x[0])) && window.HSFX) { HSFX.sound('win'); HSFX.confetti(); HSFX.xp(15); track('trip_day', tr.lang); }
}
function bind() {
  app.querySelectorAll('.tv-card').forEach(c => {
    const p = c.dataset.p;
    c.querySelector('[data-say]').onclick = () => speak(p);
    c.querySelector('[data-slow]').onclick = () => speak(p, 0.6);
    c.querySelector('[data-rec]').onclick = e => sayCheck(e.currentTarget, p, () => { if (!learnedOf(trip()).includes(p)) markGot(p, c); });
    c.querySelector('[data-show]').onclick = () => show(p, c.querySelector('.tv-m').textContent);
    const g = c.querySelector('[data-got]'); if (g) g.onclick = () => markGot(p, c);
  });
  app.querySelectorAll('[data-cat]').forEach(b => b.onclick = () => { fx('tick'); category(b.dataset.cat); });
  app.querySelectorAll('[data-home]').forEach(b => b.onclick = home);
  const ch = app.querySelector('[data-change]'); if (ch) ch.onclick = () => setup(true);
}
// Big text to show someone (a waiter, a taxi driver, a pharmacist)
function show(p, m) {
  const o = document.createElement('div'); o.className = 'tv-show';
  o.innerHTML = `<div class="tv-sp" dir="auto">${esc(p)}</div><div class="tv-sm">${esc(m)}</div><button class="tv-sl">🔊</button><p>${esc(t('tapClose'))}</p>`;
  o.onclick = e => { if (e.target.closest('.tv-sl')) { speak(p); return; } o.remove(); };
  document.body.appendChild(o); speak(p);
}
async function offlineNote() {
  const el = $('tvOff'); if (!el || !('caches' in window)) return;
  try { const hit = await caches.match('/travel/'); if (hit && navigator.serviceWorker && navigator.serviceWorker.controller) el.textContent = t('offline'); } catch (e) {}
}

if ('serviceWorker' in navigator && location.protocol === 'https:') navigator.serviceWorker.register('/sw.js').catch(() => {});
document.title = t('title');
document.querySelectorAll('[data-tt]').forEach(el => { el.textContent = t(el.dataset.tt); });
document.documentElement.dir = ui === 'ar' ? 'rtl' : 'ltr'; document.documentElement.lang = ui;
home();
track('travel');
})();
