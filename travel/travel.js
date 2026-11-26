// Harley Travel (harleysays.com/travel/): survival phrases for a trip, ready to use, even offline.
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
  en: ['Harley Travel', 'Survival phrases for your trip', "The phrases you'll really need, ready to use, even offline.", 'Where are you going?', 'When do you leave? (optional)', "Let's go", '{n} days to go', 'You leave tomorrow!', 'Have a great trip! 🎉', 'Welcome back', 'Change trip', "Today's 5 for your trip", '{n} of {m} phrases learned', 'Phrasebook', 'Essentials', 'Getting around', 'Eating out', 'Hotel', 'Shopping & money', 'Numbers', 'Emergencies', 'Emergency number: {n}', 'Listen', 'Slow', 'Say it', 'Great! ✓', 'Not quite, try again', 'Show', 'Tap anywhere to close', '✓ Works offline on this device', 'Practise with scoring in Harley Says', 'Done for today! 🎉 Come back tomorrow for 5 more.', 'Got it', 'Speech recognition needs Chrome, Edge or Safari.', 'Listening…'],
  es: ['Harley Viajes', 'Frases de supervivencia para tu viaje', 'Las frases que de verdad vas a necesitar, listas para usar, incluso sin conexión.', '¿Adónde vas?', '¿Cuándo sales? (opcional)', '¡Vamos!', 'Faltan {n} días', '¡Sales mañana!', '¡Buen viaje! 🎉', 'Bienvenido de nuevo', 'Cambiar viaje', 'Tus 5 de hoy para el viaje', '{n} de {m} frases aprendidas', 'Guía de frases', 'Lo básico', 'Moverse', 'Comer fuera', 'Hotel', 'Compras y dinero', 'Números', 'Emergencias', 'Número de emergencias: {n}', 'Escuchar', 'Despacio', 'Dilo', '¡Genial! ✓', 'Casi, inténtalo otra vez', 'Mostrar', 'Toca para cerrar', '✓ Funciona sin conexión en este dispositivo', 'Practica con puntuación en Harley Says', '¡Hecho por hoy! 🎉 Vuelve mañana para 5 más.', 'Aprendida', 'El reconocimiento de voz necesita Chrome, Edge o Safari.', 'Escuchando…'],
  fr: ['Harley Voyage', 'Les phrases de survie pour ton voyage', 'Les phrases dont tu auras vraiment besoin, prêtes à l’emploi, même hors ligne.', 'Où pars-tu ?', 'Quand pars-tu ? (facultatif)', "C'est parti", 'Plus que {n} jours', 'Tu pars demain !', 'Bon voyage ! 🎉', 'Bon retour', 'Changer de voyage', 'Tes 5 phrases du jour pour le voyage', '{n} phrases apprises sur {m}', 'Guide de conversation', "L'essentiel", 'Se déplacer', 'Au restaurant', 'Hôtel', 'Achats et argent', 'Nombres', 'Urgences', "Numéro d'urgence : {n}", 'Écouter', 'Lentement', 'Dis-le', 'Bravo ! ✓', 'Presque, réessaie', 'Montrer', 'Touche pour fermer', '✓ Fonctionne hors ligne sur cet appareil', 'Entraîne-toi avec un score dans Harley Says', 'Fini pour aujourd’hui ! 🎉 Reviens demain pour 5 de plus.', 'Je sais', 'La reconnaissance vocale nécessite Chrome, Edge ou Safari.', 'J’écoute…'],
  it: ['Harley Viaggi', 'Frasi di sopravvivenza per il tuo viaggio', 'Le frasi che ti serviranno davvero, pronte all’uso, anche offline.', 'Dove vai?', 'Quando parti? (facoltativo)', 'Andiamo!', 'Mancano {n} giorni', 'Parti domani!', 'Buon viaggio! 🎉', 'Bentornato', 'Cambia viaggio', 'Le tue 5 frasi di oggi per il viaggio', '{n} di {m} frasi imparate', 'Frasario', 'Essenziali', 'Spostarsi', 'Mangiare fuori', 'Hotel', 'Acquisti e soldi', 'Numeri', 'Emergenze', "Numero d'emergenza: {n}", 'Ascolta', 'Piano', 'Dillo', 'Ottimo! ✓', 'Quasi, riprova', 'Mostra', 'Tocca per chiudere', '✓ Funziona offline su questo dispositivo', 'Esercitati con il punteggio in Harley Says', 'Fatto per oggi! 🎉 Torna domani per altre 5.', 'Imparata', 'Il riconoscimento vocale richiede Chrome, Edge o Safari.', 'Ascolto…'],
  de: ['Harley Reisen', 'Überlebenssätze für deine Reise', 'Die Sätze, die du wirklich brauchst, sofort einsatzbereit, auch offline.', 'Wohin reist du?', 'Wann geht es los? (optional)', "Los geht's", 'Noch {n} Tage', 'Morgen geht es los!', 'Gute Reise! 🎉', 'Willkommen zurück', 'Reise ändern', 'Deine 5 Sätze für heute', '{n} von {m} Sätzen gelernt', 'Sprachführer', 'Das Wichtigste', 'Unterwegs', 'Essen gehen', 'Hotel', 'Einkaufen & Geld', 'Zahlen', 'Notfälle', 'Notrufnummer: {n}', 'Anhören', 'Langsam', 'Sag es', 'Super! ✓', 'Fast, versuch es nochmal', 'Zeigen', 'Zum Schließen tippen', '✓ Funktioniert offline auf diesem Gerät', 'Mit Bewertung in Harley Says üben', 'Fertig für heute! 🎉 Morgen gibt es 5 neue.', 'Kann ich', 'Spracherkennung braucht Chrome, Edge oder Safari.', 'Ich höre zu…'],
  pt: ['Harley Viagem', 'Frases de sobrevivência para a tua viagem', 'As frases de que vais mesmo precisar, prontas a usar, mesmo offline.', 'Para onde vais?', 'Quando partes? (opcional)', 'Vamos!', 'Faltam {n} dias', 'Partes amanhã!', 'Boa viagem! 🎉', 'Bem-vindo de volta', 'Mudar viagem', 'As tuas 5 frases de hoje', '{n} de {m} frases aprendidas', 'Guia de frases', 'O essencial', 'Deslocações', 'Comer fora', 'Hotel', 'Compras e dinheiro', 'Números', 'Emergências', 'Número de emergência: {n}', 'Ouvir', 'Devagar', 'Diz', 'Boa! ✓', 'Quase, tenta outra vez', 'Mostrar', 'Toca para fechar', '✓ Funciona offline neste dispositivo', 'Pratica com pontuação no Harley Says', 'Feito por hoje! 🎉 Volta amanhã para mais 5.', 'Já sei', 'O reconhecimento de voz precisa do Chrome, Edge ou Safari.', 'A ouvir…'],
  pl: ['Harley Podróże', 'Zwroty na przetrwanie w podróży', 'Zwroty, których naprawdę będziesz potrzebować, gotowe do użycia, także offline.', 'Dokąd jedziesz?', 'Kiedy wyjeżdżasz? (opcjonalnie)', 'Ruszamy', 'Zostało {n} dni', 'Wyjeżdżasz jutro!', 'Udanej podróży! 🎉', 'Witaj z powrotem', 'Zmień podróż', 'Twoje 5 zwrotów na dziś', '{n} z {m} zwrotów opanowanych', 'Rozmówki', 'Podstawy', 'Poruszanie się', 'Jedzenie na mieście', 'Hotel', 'Zakupy i pieniądze', 'Liczby', 'Nagłe wypadki', 'Numer alarmowy: {n}', 'Posłuchaj', 'Wolno', 'Powiedz', 'Świetnie! ✓', 'Prawie, spróbuj jeszcze raz', 'Pokaż', 'Dotknij, aby zamknąć', '✓ Działa offline na tym urządzeniu', 'Ćwicz z oceną w Harley Says', 'Na dziś gotowe! 🎉 Wróć jutro po 5 kolejnych.', 'Umiem', 'Rozpoznawanie mowy wymaga Chrome, Edge lub Safari.', 'Słucham…'],
  ro: ['Harley Călătorii', 'Fraze de supraviețuire pentru călătoria ta', 'Frazele de care chiar vei avea nevoie, gata de folosit, chiar și offline.', 'Unde mergi?', 'Când pleci? (opțional)', 'Hai!', 'Mai sunt {n} zile', 'Pleci mâine!', 'Călătorie plăcută! 🎉', 'Bine ai revenit', 'Schimbă călătoria', 'Cele 5 fraze de azi', '{n} din {m} fraze învățate', 'Ghid de conversație', 'Esențiale', 'Transport', 'La restaurant', 'Hotel', 'Cumpărături și bani', 'Numere', 'Urgențe', 'Număr de urgență: {n}', 'Ascultă', 'Încet', 'Spune', 'Super! ✓', 'Aproape, mai încearcă', 'Arată', 'Atinge pentru a închide', '✓ Funcționează offline pe acest dispozitiv', 'Exersează cu scor în Harley Says', 'Gata pe azi! 🎉 Revino mâine pentru încă 5.', 'Știu', 'Recunoașterea vocală necesită Chrome, Edge sau Safari.', 'Ascult…'],
  uk: ['Harley Подорожі', 'Фрази для виживання в подорожі', 'Фрази, які справді знадобляться, готові до використання навіть офлайн.', 'Куди ти їдеш?', 'Коли виїжджаєш? (необов’язково)', 'Поїхали', 'Залишилось {n} дн.', 'Виїжджаєш завтра!', 'Гарної подорожі! 🎉', 'З поверненням', 'Змінити подорож', 'Твої 5 фраз на сьогодні', 'Вивчено {n} з {m} фраз', 'Розмовник', 'Основне', 'Пересування', 'У ресторані', 'Готель', 'Покупки й гроші', 'Числа', 'Надзвичайні ситуації', 'Екстрений номер: {n}', 'Слухати', 'Повільно', 'Скажи', 'Чудово! ✓', 'Майже, спробуй ще', 'Показати', 'Торкнися, щоб закрити', '✓ Працює офлайн на цьому пристрої', 'Тренуйся з оцінкою в Harley Says', 'На сьогодні все! 🎉 Повертайся завтра по ще 5.', 'Знаю', 'Розпізнавання мовлення потребує Chrome, Edge або Safari.', 'Слухаю…'],
  zh: ['Harley 旅行', '旅行必备短语', '真正用得上的短语，随时可用，离线也行。', '你要去哪里？', '什么时候出发？（可选）', '出发', '还有 {n} 天', '明天出发！', '旅途愉快！🎉', '欢迎回来', '更改行程', '今日旅行 5 句', '已学会 {n}/{m} 句', '短语手册', '基本用语', '出行交通', '外出就餐', '酒店', '购物与付款', '数字', '紧急情况', '紧急电话：{n}', '听', '慢速', '说一说', '很好！✓', '差一点，再试一次', '展示', '点击任意处关闭', '✓ 本设备可离线使用', '在 Harley Says 中练习并评分', '今天完成！🎉 明天再来学 5 句。', '已掌握', '语音识别需要 Chrome、Edge 或 Safari。', '正在听…'],
  ar: ['Harley للسفر', 'عبارات أساسية لرحلتك', 'العبارات التي ستحتاجها فعلًا، جاهزة للاستخدام حتى دون إنترنت.', 'إلى أين تسافر؟', 'متى تغادر؟ (اختياري)', 'هيا بنا', 'باقٍ {n} يومًا', 'تسافر غدًا!', 'رحلة سعيدة! 🎉', 'مرحبًا بعودتك', 'تغيير الرحلة', 'عباراتك الخمس لليوم', 'تعلّمت {n} من {m} عبارة', 'دليل العبارات', 'الأساسيات', 'التنقل', 'تناول الطعام', 'الفندق', 'التسوق والمال', 'الأرقام', 'الطوارئ', 'رقم الطوارئ: {n}', 'استمع', 'ببطء', 'قلها', 'رائع! ✓', 'قريب، حاول مجددًا', 'اعرض', 'اضغط للإغلاق', '✓ يعمل دون إنترنت على هذا الجهاز', 'تدرّب مع التقييم في Harley Says', 'انتهيت لليوم! 🎉 عُد غدًا لخمس أخرى.', 'تعلّمتها', 'التعرّف على الكلام يتطلب Chrome أو Edge أو Safari.', 'أستمع…'],
  nl: ['Harley Reizen', 'Overlevingszinnen voor je reis', 'De zinnen die je echt nodig hebt, klaar voor gebruik, ook offline.', 'Waar ga je naartoe?', 'Wanneer vertrek je? (optioneel)', 'Aan de slag', 'Nog {n} dagen', 'Morgen vertrek je!', 'Goede reis! 🎉', 'Welkom terug', 'Reis wijzigen', 'Je 5 zinnen voor vandaag', '{n} van {m} zinnen geleerd', 'Taalgids', 'De basis', 'Onderweg', 'Uit eten', 'Hotel', 'Winkelen & geld', 'Getallen', 'Noodgevallen', 'Alarmnummer: {n}', 'Luister', 'Langzaam', 'Zeg het', 'Super! ✓', 'Bijna, probeer opnieuw', 'Tonen', 'Tik om te sluiten', '✓ Werkt offline op dit apparaat', 'Oefen met score in Harley Says', 'Klaar voor vandaag! 🎉 Kom morgen terug voor 5 nieuwe.', 'Ken ik', 'Spraakherkenning werkt in Chrome, Edge of Safari.', 'Ik luister…'],
  tr: ['Harley Seyahat', 'Seyahatin için hayatta kalma ifadeleri', 'Gerçekten ihtiyacın olacak ifadeler, kullanıma hazır, çevrimdışı bile.', 'Nereye gidiyorsun?', 'Ne zaman gidiyorsun? (isteğe bağlı)', 'Hadi', '{n} gün kaldı', 'Yarın gidiyorsun!', 'İyi yolculuklar! 🎉', 'Tekrar hoş geldin', 'Seyahati değiştir', 'Bugünün 5 ifadesi', '{m} ifadeden {n} tanesi öğrenildi', 'Konuşma kılavuzu', 'Temel ifadeler', 'Ulaşım', 'Dışarıda yemek', 'Otel', 'Alışveriş ve para', 'Sayılar', 'Acil durumlar', 'Acil numara: {n}', 'Dinle', 'Yavaş', 'Söyle', 'Harika! ✓', 'Az kaldı, tekrar dene', 'Göster', 'Kapatmak için dokun', '✓ Bu cihazda çevrimdışı çalışır', 'Harley Says’te puanla çalış', 'Bugünlük bitti! 🎉 Yarın 5 tane daha için gel.', 'Öğrendim', 'Konuşma tanıma için Chrome, Edge veya Safari gerekir.', 'Dinliyorum…'],
  ja: ['Harley 旅行', '旅行で使えるサバイバルフレーズ', '本当に必要なフレーズを、オフラインでもすぐ使えます。', 'どこへ行きますか？', '出発日は？（任意）', '始めよう', 'あと {n} 日', '明日出発！', 'よい旅を！🎉', 'おかえりなさい', '旅行を変更', '今日の旅行フレーズ5つ', '{m} 個中 {n} 個習得', 'フレーズ集', '基本', '移動', '外食', 'ホテル', '買い物とお金', '数字', '緊急時', '緊急番号：{n}', '聞く', 'ゆっくり', '言ってみる', 'すごい！✓', 'おしい、もう一度', '見せる', 'タップして閉じる', '✓ この端末ではオフラインで使えます', 'Harley Says で採点しながら練習', '今日はここまで！🎉 明日また5つ。', '覚えた', '音声認識には Chrome、Edge、Safari が必要です。', '聞いています…'],
  ko: ['Harley 여행', '여행 필수 생존 표현', '꼭 필요한 표현을 오프라인에서도 바로 쓸 수 있어요.', '어디로 가세요?', '언제 출발하세요? (선택)', '시작', '{n}일 남음', '내일 출발!', '즐거운 여행 되세요! 🎉', '다시 오신 걸 환영해요', '여행 변경', '오늘의 여행 표현 5개', '{m}개 중 {n}개 익힘', '표현집', '기본 표현', '이동', '외식', '호텔', '쇼핑과 돈', '숫자', '응급 상황', '긴급 번호: {n}', '듣기', '천천히', '말하기', '잘했어요! ✓', '아깝네요, 다시 해 봐요', '보여주기', '눌러서 닫기', '✓ 이 기기에서 오프라인으로 사용 가능', 'Harley Says에서 점수와 함께 연습', '오늘은 끝! 🎉 내일 5개 더 해요.', '익혔어요', '음성 인식은 Chrome, Edge, Safari가 필요해요.', '듣는 중…'],
  vi: ['Harley Du lịch', 'Câu sinh tồn cho chuyến đi', 'Những câu bạn thật sự cần, dùng được ngay, kể cả khi không có mạng.', 'Bạn sẽ đi đâu?', 'Khi nào bạn đi? (không bắt buộc)', 'Bắt đầu', 'Còn {n} ngày', 'Mai bạn đi rồi!', 'Chúc chuyến đi vui vẻ! 🎉', 'Chào mừng trở lại', 'Đổi chuyến đi', '5 câu hôm nay cho chuyến đi', 'Đã học {n}/{m} câu', 'Sổ tay câu', 'Cơ bản', 'Đi lại', 'Ăn uống', 'Khách sạn', 'Mua sắm & tiền', 'Số đếm', 'Khẩn cấp', 'Số khẩn cấp: {n}', 'Nghe', 'Chậm', 'Nói', 'Tuyệt! ✓', 'Gần đúng, thử lại', 'Hiện', 'Chạm để đóng', '✓ Dùng được ngoại tuyến trên thiết bị này', 'Luyện có chấm điểm trong Harley Says', 'Xong hôm nay! 🎉 Mai quay lại học thêm 5 câu.', 'Đã thuộc', 'Nhận dạng giọng nói cần Chrome, Edge hoặc Safari.', 'Đang nghe…']
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

// ---------- views ----------
function setup(change) {
  const tr = trip() || {};
  app.innerHTML = `<section class="tv-hero"><div class="tv-plane">✈️</div><h1>${esc(t('hero'))}</h1><p>${esc(t('heroP'))}</p></section>
    <section class="card"><h3>${esc(t('where'))}</h3><div class="tv-dest">${DEST.map(([l, f, n], i) => `<button class="tv-d${tr.lang === l ? ' on' : ''}" data-dest="${l}" style="--i:${i}"><span>${f}</span>${esc(n)}</button>`).join('')}</div>
    <h3>${esc(t('when'))}</h3><input type="date" id="tvDate" value="${esc(tr.date || '')}" min="${dayKey()}">
    <button class="btn primary big" id="tvGo" ${tr.lang ? '' : 'disabled'}>✈️ ${esc(t('start'))}</button>${change ? `<button class="btn big tv-cancel" data-home>${esc(t('back'))}</button>` : ''}</section>`;
  let pick = tr.lang || null;
  app.querySelectorAll('[data-dest]').forEach(b => b.onclick = () => { pick = b.dataset.dest; app.querySelectorAll('[data-dest]').forEach(x => x.classList.toggle('on', x === b)); $('tvGo').disabled = false; fx('tick'); });
  $('tvGo').onclick = () => { const n = Object.assign({}, trip() || {}, { lang: pick, date: $('tvDate').value || '' }); n.learned = n.learned || {}; n.day = null; saveTrip(n); track('trip_set', pick); fx('good'); home(); };
}
function home() {
  const tr = trip(); if (!tr || !D[tr.lang]) return setup();
  const [l, flag, country, sos] = dest(tr.lang), left = daysLeft(tr), all = allPhrases(l), learned = learnedOf(tr).filter(p => all.some(x => x[0] === p)).length;
  const five = todays(tr), done5 = five.every(p => learnedOf(tr).includes(p[0]));
  const when = left === null ? '' : left > 1 ? t('days', { n: left }) : left === 1 ? t('tomorrow') : left === 0 || left > -21 ? t('today') : '';
  app.innerHTML = `<section class="tv-trip"><span class="tv-flag">${flag}</span><div><h2>${esc(country)}</h2><p>${esc(when)}</p></div><button class="tv-ch" data-change>${esc(t('change'))}</button>
      <div class="tv-meter"><i style="width:${Math.round(100 * learned / all.length)}%"></i></div><small>${esc(t('learned', { n: learned, m: all.length }))}</small></section>
    <h3 class="tv-h">⭐ ${esc(t('today5'))}</h3>
    ${done5 ? `<p class="card tv-done">${esc(t('done5'))}</p>` : ''}
    <div class="tv-list">${five.map((p, i) => card(p, i, true)).join('')}</div>
    <h3 class="tv-h">📖 ${esc(t('book'))}</h3>
    <div class="tv-cats">${CATS.map(([id, ic], i) => `<button class="tv-cat c-${id}" data-cat="${id}" style="--i:${i}"><span>${ic}</span><b>${esc(t('c_' + id))}</b>${id === 'sos' ? `<small>${esc(t('sosNum', { n: sos }))}</small>` : ''}</button>`).join('')}</div>
    <a class="tv-prac" href="/?lang=${l}&set=Travel&lesson=1">🎙️ ${esc(t('practise'))} →</a>
    <p class="fine tv-off" id="tvOff"></p>`;
  bind(); offlineNote();
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
document.title = t('title') + ' — Harley Says';
document.querySelectorAll('[data-tt]').forEach(el => { el.textContent = t(el.dataset.tt); });
document.documentElement.dir = ui === 'ar' ? 'rtl' : 'ltr'; document.documentElement.lang = ui;
home();
track('travel');
})();
