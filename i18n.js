// Harley Says interface translations. UI languages: en, es, fr, it, de, pt.
window.SIR_UI_LANGS = [['en','English'],['es','Español'],['fr','Français'],['it','Italiano'],['de','Deutsch'],['pt','Português']];
// Extra interface languages, loaded on demand from i18n/<code>.js. They can also be typed in "My phrase" and translated.
window.SIR_EXTRA = {
  pl:{name:'Polski',code:'pl-PL'}, ro:{name:'Română',code:'ro-RO'}, uk:{name:'Українська',code:'uk-UA'},
  zh:{name:'中文（简体）',code:'zh-CN'}, ar:{name:'العربية',code:'ar-SA',rtl:true}, nl:{name:'Nederlands',code:'nl-NL'},
  tr:{name:'Türkçe',code:'tr-TR'}, ja:{name:'日本語',code:'ja-JP'}, ko:{name:'한국어',code:'ko-KR'}, vi:{name:'Tiếng Việt',code:'vi-VN'}
};
Object.entries(window.SIR_EXTRA).forEach(([k,v])=>window.SIR_UI_LANGS.push([k,v.name]));
window.SIR_MEANINGS = window.SIR_MEANINGS || {};

window.SIR_LANG_NAMES = {
  en:{en:'English (UK)',enus:'English (US)',es:'Spanish (Spain)',esmx:'Spanish (Latin America)',fr:'French',it:'Italian',de:'German',pt:'Portuguese'},
  es:{en:'Inglés (Reino Unido)',enus:'Inglés (EE. UU.)',es:'Español (España)',esmx:'Español (Latinoamérica)',fr:'Francés',it:'Italiano',de:'Alemán',pt:'Portugués'},
  fr:{en:'Anglais (Royaume-Uni)',enus:'Anglais (États-Unis)',es:'Espagnol (Espagne)',esmx:'Espagnol (Amérique latine)',fr:'Français',it:'Italien',de:'Allemand',pt:'Portugais'},
  it:{en:'Inglese (Regno Unito)',enus:'Inglese (USA)',es:'Spagnolo (Spagna)',esmx:'Spagnolo (America Latina)',fr:'Francese',it:'Italiano',de:'Tedesco',pt:'Portoghese'},
  de:{en:'Englisch (UK)',enus:'Englisch (USA)',es:'Spanisch (Spanien)',esmx:'Spanisch (Lateinamerika)',fr:'Französisch',it:'Italienisch',de:'Deutsch',pt:'Portugiesisch'},
  pt:{en:'Inglês (Reino Unido)',enus:'Inglês (EUA)',es:'Espanhol (Espanha)',esmx:'Espanhol (América Latina)',fr:'Francês',it:'Italiano',de:'Alemão',pt:'Português'}
};

window.SIR_UI = {
en:{
  iSpeak:'I speak', learning:"I'm learning", premium:'Premium', tagline:'pronunciation',
  listen:'🔊 Listen', slowly:'🐢 Slowly', tapSay:'🎙️ Tap and say it', listening:'⏹ Listening… tap to stop',
  back:'← Back', next:'Next →', weHeard:'We heard:', best:'Best: {n}%',
  progress:'{lang}: {done} of {total} phrases mastered (80%+)',
  noCatch:"We didn't catch anything. Try again, a little closer to the mic.",
  errNotAllowed:'Microphone access was blocked. Allow the mic for this site in your browser settings and reload.',
  errService:"Speech recognition isn't available here. Try Chrome or Safari.",
  errNoSpeech:"We didn't hear anything. Try again.", errNetwork:'Speech recognition needs an internet connection.',
  errLang:"Your browser doesn't support speech recognition for {lang}.", errStart:"Couldn't start the microphone: ", errOther:'Speech error: ',
  tipGreat:'Excellent! That was clear and natural.',
  tipAll:'All the words came through. Say it a little more crisply and confidently to lift the score.',
  missed1:"1 word didn't come through (in red). Tap it to hear it, then try again.",
  missedN:"{n} words didn't come through (in red). Tap a red word to hear it, then try again.",
  typeBelow:'Type a phrase below to begin.',
  ownTitle:'Your own phrase', ownSub:'Type or say something, translate it, then practise it.', writingIn:"I'm writing in",
  sayIt:'🎙️ Say it', listeningShort:'⏹ Listening…', placeholder:'e.g. Could you recommend a good restaurant nearby?',
  translateTo:'🌍 Translate to {lang} & practise', asWritten:'Practise as written', translating:'Translating…',
  trFirst:'Type or say a phrase first.', trLong:'Please keep it under 300 characters.', trOff:"Translation isn't switched on yet.",
  trFail:'Translation failed: ', voiceNeeds:'Voice input needs Chrome, Edge or Safari.', micBlocked:'Microphone access was blocked.', cantHear:"Couldn't hear that. Try again.",
  sets:{'Basics':'Basics','Café & restaurant':'Café & restaurant','Travel':'Travel','Tricky sounds':'Tricky sounds','My phrase':'My phrase','Business & work':'Business & work','Shopping':'Shopping','Health & emergencies':'Health & emergencies','Social & small talk':'Social & small talk','Numbers, dates & time':'Numbers, dates & time'},
  lockedText:'{n} phrases with sound-by-sound scoring ({lang}). Part of Harley Says Premium, coming soon.',
  lockedCta:'⭐ Get notified when it launches', upsell:"🎉 That's all {n} free phrases in {set}. Premium adds {m} more.", getNotified:'Get notified',
  comingSoon:'Coming soon', premTitle:'⭐ Harley Says Premium',
  feats:[['200 phrases per topic',', five times the free library'],['5 extra topics',': business, shopping, health, social life and numbers'],['Sound-by-sound scoring',' that shows exactly which sounds to fix'],['Unlimited translations',' of your own phrases'],['Progress synced',' across your phone and computer']],
  notifyLabel:'Get notified when Premium launches', notifyBtn:'Notify me',
  fine:"We'll only email you about the Premium launch. No spam, unsubscribe any time.",
  wlErr:"Sorry, that didn't go through. Please try again.", wlDone:"✓ You're on the list. We'll let you know when Premium launches.",
  storyH:'Why we built Harley Says',
  story1:"My wife lives in the UK and is always looking for ways to practise her pronunciation. Classes help, but in between it's hard to find someone patient enough to listen, say it back properly, and tell you honestly how you sounded.",
  story2:'So we built the tool we wished existed: free, no sign-up, and ready whenever you are.',
  whyH:'Why Harley?', cap1:'In full flight', cap2:'Ready to play',
  story3:"The app is named after Harley, our much-loved bichon frise. In the app, he's learning to talk too, so every time you practise, you're practising together.",
  howH:'How it works & tips',
  how1:"Tap Listen to hear the phrase, then tap the mic and say it. Words we recognised turn green; words we didn't catch turn red. Tap any word to hear it on its own.",
  how2:"The score is based on how closely the speech engine's transcript matches the phrase, weighted by its confidence. It's a good guide to how clearly you're understood, not a phonetics lab. A native speaker is still the gold standard.",
  how3:"Works best in Chrome, Edge or Safari (including iPhone). Firefox doesn't support speech recognition. Use a quiet room and speak at a natural pace.",
  footer:"Your voice is processed by your browser's built-in speech service. Your scores stay on this device. If you join the Premium waitlist, we keep your email only to tell you about the launch.",
  noRec:"Your browser doesn't support speech recognition, so you can listen but not be scored. Open this page in Chrome, Edge or Safari.",
  fileWarn:'Opened as a local file, so the microphone may not work.'
},
es:{
  iSpeak:'Hablo', learning:'Estoy aprendiendo', premium:'Premium', tagline:'pronunciación',
  listen:'🔊 Escuchar', slowly:'🐢 Despacio', tapSay:'🎙️ Toca y dilo', listening:'⏹ Escuchando… toca para parar',
  back:'← Atrás', next:'Siguiente →', weHeard:'Hemos oído:', best:'Mejor: {n}%',
  progress:'{lang}: {done} de {total} frases dominadas (80%+)',
  noCatch:'No hemos oído nada. Inténtalo de nuevo, un poco más cerca del micrófono.',
  errNotAllowed:'Se ha bloqueado el micrófono. Permítelo para este sitio en los ajustes del navegador y recarga la página.',
  errService:'El reconocimiento de voz no está disponible aquí. Prueba con Chrome o Safari.',
  errNoSpeech:'No hemos oído nada. Inténtalo de nuevo.', errNetwork:'El reconocimiento de voz necesita conexión a internet.',
  errLang:'Tu navegador no admite el reconocimiento de voz para: {lang}.', errStart:'No se ha podido iniciar el micrófono: ', errOther:'Error de voz: ',
  tipGreat:'¡Excelente! Ha sonado claro y natural.',
  tipAll:'Se han entendido todas las palabras. Dilo con un poco más de claridad y seguridad para subir la puntuación.',
  missed1:'1 palabra no se ha entendido (en rojo). Tócala para oírla y vuelve a intentarlo.',
  missedN:'{n} palabras no se han entendido (en rojo). Toca una palabra roja para oírla y vuelve a intentarlo.',
  typeBelow:'Escribe una frase abajo para empezar.',
  ownTitle:'Tu propia frase', ownSub:'Escribe o di algo, tradúcelo y practícalo.', writingIn:'Escribo en',
  sayIt:'🎙️ Dilo', listeningShort:'⏹ Escuchando…', placeholder:'p. ej. ¿Me recomienda un buen restaurante cerca?',
  translateTo:'🌍 Traducir a {lang} y practicar', asWritten:'Practicar tal cual', translating:'Traduciendo…',
  trFirst:'Primero escribe o di una frase.', trLong:'Máximo 300 caracteres, por favor.', trOff:'La traducción aún no está activada.',
  trFail:'Error de traducción: ', voiceNeeds:'La entrada por voz necesita Chrome, Edge o Safari.', micBlocked:'Se ha bloqueado el micrófono.', cantHear:'No se ha oído bien. Inténtalo de nuevo.',
  sets:{'Basics':'Básico','Café & restaurant':'Café y restaurante','Travel':'Viajes','Tricky sounds':'Sonidos difíciles','My phrase':'Mi frase','Business & work':'Negocios y trabajo','Shopping':'Compras','Health & emergencies':'Salud y emergencias','Social & small talk':'Vida social','Numbers, dates & time':'Números, fechas y horas'},
  lockedText:'{n} frases con puntuación sonido a sonido ({lang}). Parte de Harley Says Premium, muy pronto.',
  lockedCta:'⭐ Avísame cuando salga', upsell:'🎉 Ya has hecho las {n} frases gratis de {set}. Premium añade {m} más.', getNotified:'Avísame',
  comingSoon:'Muy pronto', premTitle:'⭐ Harley Says Premium',
  feats:[['200 frases por tema',', cinco veces la biblioteca gratuita'],['5 temas extra',': negocios, compras, salud, vida social y números'],['Puntuación sonido a sonido',' que te muestra exactamente qué sonidos mejorar'],['Traducciones ilimitadas',' de tus propias frases'],['Progreso sincronizado',' entre tu móvil y tu ordenador']],
  notifyLabel:'Avísame cuando salga Premium', notifyBtn:'Avísame',
  fine:'Solo te escribiremos sobre el lanzamiento de Premium. Sin spam; puedes darte de baja cuando quieras.',
  wlErr:'Lo sentimos, no se ha enviado. Inténtalo de nuevo.', wlDone:'✓ Estás en la lista. Te avisaremos cuando salga Premium.',
  storyH:'Por qué creamos Harley Says',
  story1:'Mi mujer vive en el Reino Unido y siempre busca formas de practicar su pronunciación. Las clases ayudan, pero entre una y otra es difícil encontrar a alguien con la paciencia de escuchar, repetirlo bien y decirte con sinceridad cómo has sonado.',
  story2:'Así que creamos la herramienta que nos habría gustado tener: gratis, sin registro y lista cuando tú quieras.',
  whyH:'¿Por qué Harley?', cap1:'A toda velocidad', cap2:'Listo para jugar',
  story3:'La app lleva el nombre de Harley, nuestro querido bichón frisé. En la app, él también está aprendiendo a hablar, así que cada vez que practicas, practicáis juntos.',
  howH:'Cómo funciona y consejos',
  how1:'Toca Escuchar para oír la frase y luego toca el micrófono y dila. Las palabras que reconocemos se ponen en verde; las que no, en rojo. Toca cualquier palabra para oírla sola.',
  how2:'La puntuación se basa en cuánto coincide la transcripción del reconocimiento de voz con la frase, ponderada por su confianza. Es una buena guía de lo bien que se te entiende, no un laboratorio de fonética. Un hablante nativo sigue siendo la mejor referencia.',
  how3:'Funciona mejor en Chrome, Edge o Safari (también en iPhone). Firefox no admite el reconocimiento de voz. Busca un lugar tranquilo y habla a un ritmo natural.',
  footer:'Tu voz la procesa el servicio de voz integrado de tu navegador. Tus puntuaciones se quedan en este dispositivo. Si te apuntas a la lista de Premium, solo guardamos tu correo para avisarte del lanzamiento.',
  noRec:'Tu navegador no admite el reconocimiento de voz: puedes escuchar, pero no recibir puntuación. Abre esta página en Chrome, Edge o Safari.',
  fileWarn:'Se ha abierto como archivo local, así que puede que el micrófono no funcione.'
},
fr:{
  iSpeak:'Je parle', learning:"J'apprends", premium:'Premium', tagline:'prononciation',
  listen:'🔊 Écouter', slowly:'🐢 Lentement', tapSay:'🎙️ Touchez et dites-le', listening:"⏹ À l'écoute… touchez pour arrêter",
  back:'← Retour', next:'Suivant →', weHeard:'Nous avons entendu :', best:'Meilleur : {n} %',
  progress:'{lang} : {done} sur {total} phrases maîtrisées (80 %+)',
  noCatch:"Nous n'avons rien entendu. Réessayez, un peu plus près du micro.",
  errNotAllowed:"L'accès au micro a été bloqué. Autorisez le micro pour ce site dans les réglages du navigateur, puis rechargez la page.",
  errService:"La reconnaissance vocale n'est pas disponible ici. Essayez Chrome ou Safari.",
  errNoSpeech:"Nous n'avons rien entendu. Réessayez.", errNetwork:'La reconnaissance vocale nécessite une connexion internet.',
  errLang:'Votre navigateur ne prend pas en charge la reconnaissance vocale pour : {lang}.', errStart:'Impossible de démarrer le micro : ', errOther:'Erreur vocale : ',
  tipGreat:"Excellent ! C'était clair et naturel.",
  tipAll:'Tous les mots ont été compris. Articulez un peu plus, avec assurance, pour améliorer le score.',
  missed1:"1 mot n'a pas été compris (en rouge). Touchez-le pour l'écouter, puis réessayez.",
  missedN:"{n} mots n'ont pas été compris (en rouge). Touchez un mot rouge pour l'écouter, puis réessayez.",
  typeBelow:'Saisissez une phrase ci-dessous pour commencer.',
  ownTitle:'Votre propre phrase', ownSub:'Écrivez ou dites quelque chose, traduisez-le, puis entraînez-vous.', writingIn:"J'écris en",
  sayIt:'🎙️ Dites-le', listeningShort:"⏹ À l'écoute…", placeholder:"ex. Pouvez-vous me conseiller un bon restaurant près d'ici ?",
  translateTo:'🌍 Traduire ({lang}) et pratiquer', asWritten:'Pratiquer tel quel', translating:'Traduction…',
  trFirst:"Écrivez ou dites d'abord une phrase.", trLong:'300 caractères maximum, s’il vous plaît.', trOff:"La traduction n'est pas encore activée.",
  trFail:'Échec de la traduction : ', voiceNeeds:'La saisie vocale nécessite Chrome, Edge ou Safari.', micBlocked:"L'accès au micro a été bloqué.", cantHear:'Pas bien entendu. Réessayez.',
  sets:{'Basics':'Les bases','Café & restaurant':'Café et restaurant','Travel':'Voyage','Tricky sounds':'Sons difficiles','My phrase':'Ma phrase','Business & work':'Affaires et travail','Shopping':'Shopping','Health & emergencies':'Santé et urgences','Social & small talk':'Vie sociale','Numbers, dates & time':'Chiffres, dates et heures'},
  lockedText:'{n} phrases avec un score son par son ({lang}). Inclus dans Harley Says Premium, bientôt disponible.',
  lockedCta:'⭐ Me prévenir au lancement', upsell:'🎉 Vous avez fait les {n} phrases gratuites de « {set} ». Premium en ajoute {m}.', getNotified:'Me prévenir',
  comingSoon:'Bientôt', premTitle:'⭐ Harley Says Premium',
  feats:[['200 phrases par thème',', cinq fois la bibliothèque gratuite'],['5 thèmes en plus',' : affaires, shopping, santé, vie sociale et chiffres'],['Score son par son',' pour voir exactement quels sons travailler'],['Traductions illimitées',' de vos propres phrases'],['Progression synchronisée',' entre votre téléphone et votre ordinateur']],
  notifyLabel:'Être prévenu du lancement de Premium', notifyBtn:'Me prévenir',
  fine:'Nous vous écrirons uniquement pour le lancement de Premium. Pas de spam, désinscription à tout moment.',
  wlErr:"Désolé, l'envoi a échoué. Réessayez.", wlDone:'✓ Vous êtes sur la liste. Nous vous préviendrons au lancement de Premium.',
  storyH:'Pourquoi nous avons créé Harley Says',
  story1:"Ma femme vit au Royaume-Uni et cherche toujours des moyens de travailler sa prononciation. Les cours aident, mais entre deux, c'est difficile de trouver quelqu'un d'assez patient pour écouter, répéter correctement et vous dire honnêtement comment vous avez prononcé.",
  story2:"Alors nous avons créé l'outil que nous aurions aimé avoir : gratuit, sans inscription et prêt quand vous l'êtes.",
  whyH:'Pourquoi Harley ?', cap1:'À toute allure', cap2:'Prêt à jouer',
  story3:"L'appli porte le nom de Harley, notre bichon frisé adoré. Dans l'appli, lui aussi apprend à parler : chaque fois que vous pratiquez, vous pratiquez ensemble.",
  howH:'Mode d’emploi et conseils',
  how1:"Touchez Écouter pour entendre la phrase, puis touchez le micro et dites-la. Les mots reconnus passent en vert, les autres en rouge. Touchez un mot pour l'écouter seul.",
  how2:"Le score dépend de la correspondance entre la transcription de la reconnaissance vocale et la phrase, pondérée par sa fiabilité. C'est un bon indicateur de votre clarté, pas un laboratoire de phonétique. Un locuteur natif reste la référence.",
  how3:'Fonctionne mieux dans Chrome, Edge ou Safari (y compris sur iPhone). Firefox ne prend pas en charge la reconnaissance vocale. Choisissez un endroit calme et parlez à un rythme naturel.',
  footer:'Votre voix est traitée par le service vocal intégré à votre navigateur. Vos scores restent sur cet appareil. Si vous rejoignez la liste Premium, nous gardons votre e-mail uniquement pour vous prévenir du lancement.',
  noRec:'Votre navigateur ne prend pas en charge la reconnaissance vocale : vous pouvez écouter, mais pas obtenir de score. Ouvrez cette page dans Chrome, Edge ou Safari.',
  fileWarn:'Ouvert en fichier local : le micro risque de ne pas fonctionner.'
},
it:{
  iSpeak:'Parlo', learning:'Sto imparando', premium:'Premium', tagline:'pronuncia',
  listen:'🔊 Ascolta', slowly:'🐢 Lentamente', tapSay:'🎙️ Tocca e dillo', listening:'⏹ In ascolto… tocca per fermare',
  back:'← Indietro', next:'Avanti →', weHeard:'Abbiamo sentito:', best:'Migliore: {n}%',
  progress:'{lang}: {done} di {total} frasi padroneggiate (80%+)',
  noCatch:'Non abbiamo sentito nulla. Riprova, un po’ più vicino al microfono.',
  errNotAllowed:"L'accesso al microfono è stato bloccato. Consenti il microfono per questo sito nelle impostazioni del browser e ricarica.",
  errService:'Il riconoscimento vocale non è disponibile qui. Prova Chrome o Safari.',
  errNoSpeech:'Non abbiamo sentito nulla. Riprova.', errNetwork:'Il riconoscimento vocale richiede una connessione internet.',
  errLang:'Il tuo browser non supporta il riconoscimento vocale per: {lang}.', errStart:'Impossibile avviare il microfono: ', errOther:'Errore vocale: ',
  tipGreat:'Ottimo! Chiaro e naturale.',
  tipAll:'Tutte le parole sono state capite. Pronuncia con un po’ più di nitidezza e sicurezza per migliorare il punteggio.',
  missed1:'1 parola non è stata capita (in rosso). Toccala per ascoltarla, poi riprova.',
  missedN:'{n} parole non sono state capite (in rosso). Tocca una parola rossa per ascoltarla, poi riprova.',
  typeBelow:'Scrivi una frase qui sotto per iniziare.',
  ownTitle:'La tua frase', ownSub:'Scrivi o pronuncia qualcosa, traducilo e poi esercitati.', writingIn:'Scrivo in',
  sayIt:'🎙️ Dillo', listeningShort:'⏹ In ascolto…', placeholder:'es. Mi consiglia un buon ristorante qui vicino?',
  translateTo:'🌍 Traduci ({lang}) ed esercitati', asWritten:'Esercitati così com’è', translating:'Traduzione in corso…',
  trFirst:'Prima scrivi o pronuncia una frase.', trLong:'Massimo 300 caratteri, per favore.', trOff:'La traduzione non è ancora attiva.',
  trFail:'Traduzione non riuscita: ', voiceNeeds:"L'input vocale richiede Chrome, Edge o Safari.", micBlocked:"L'accesso al microfono è stato bloccato.", cantHear:'Non si è sentito bene. Riprova.',
  sets:{'Basics':'Base','Café & restaurant':'Bar e ristorante','Travel':'Viaggi','Tricky sounds':'Suoni difficili','My phrase':'La mia frase','Business & work':'Affari e lavoro','Shopping':'Shopping','Health & emergencies':'Salute ed emergenze','Social & small talk':'Vita sociale','Numbers, dates & time':'Numeri, date e orari'},
  lockedText:'{n} frasi con punteggio suono per suono ({lang}). Parte di Harley Says Premium, in arrivo.',
  lockedCta:'⭐ Avvisami al lancio', upsell:'🎉 Hai fatto tutte le {n} frasi gratuite di «{set}». Premium ne aggiunge altre {m}.', getNotified:'Avvisami',
  comingSoon:'In arrivo', premTitle:'⭐ Harley Says Premium',
  feats:[['200 frasi per argomento',', cinque volte la libreria gratuita'],['5 argomenti in più',': affari, shopping, salute, vita sociale e numeri'],['Punteggio suono per suono',' che mostra esattamente quali suoni migliorare'],['Traduzioni illimitate',' delle tue frasi'],['Progressi sincronizzati',' tra telefono e computer']],
  notifyLabel:'Avvisami quando esce Premium', notifyBtn:'Avvisami',
  fine:'Ti scriveremo solo per il lancio di Premium. Niente spam, puoi annullare l’iscrizione quando vuoi.',
  wlErr:'Spiacenti, invio non riuscito. Riprova.', wlDone:'✓ Sei in lista. Ti avviseremo quando esce Premium.',
  storyH:'Perché abbiamo creato Harley Says',
  story1:'Mia moglie vive nel Regno Unito ed è sempre alla ricerca di modi per esercitare la pronuncia. Le lezioni aiutano, ma tra una e l’altra è difficile trovare qualcuno abbastanza paziente da ascoltare, ripetere correttamente e dirti con sincerità come hai pronunciato.',
  story2:'Così abbiamo creato lo strumento che avremmo voluto avere: gratuito, senza registrazione e pronto quando lo sei tu.',
  whyH:'Perché Harley?', cap1:'A tutta velocità', cap2:'Pronto a giocare',
  story3:"L'app prende il nome da Harley, il nostro amato bichon frisé. Nell'app anche lui sta imparando a parlare: ogni volta che ti eserciti, vi esercitate insieme.",
  howH:'Come funziona e consigli',
  how1:'Tocca Ascolta per sentire la frase, poi tocca il microfono e ripetila. Le parole riconosciute diventano verdi, quelle non capite rosse. Tocca una parola per ascoltarla da sola.',
  how2:'Il punteggio si basa su quanto la trascrizione del riconoscimento vocale corrisponde alla frase, ponderata per la sua affidabilità. È una buona guida a quanto vieni capito, non un laboratorio di fonetica. Un madrelingua resta il riferimento migliore.',
  how3:'Funziona meglio su Chrome, Edge o Safari (anche su iPhone). Firefox non supporta il riconoscimento vocale. Scegli un ambiente tranquillo e parla a un ritmo naturale.',
  footer:'La tua voce viene elaborata dal servizio vocale integrato del browser. I tuoi punteggi restano su questo dispositivo. Se ti iscrivi alla lista Premium, conserviamo la tua email solo per avvisarti del lancio.',
  noRec:'Il tuo browser non supporta il riconoscimento vocale: puoi ascoltare, ma non ricevere un punteggio. Apri questa pagina in Chrome, Edge o Safari.',
  fileWarn:'Aperto come file locale: il microfono potrebbe non funzionare.'
},
de:{
  iSpeak:'Ich spreche', learning:'Ich lerne', premium:'Premium', tagline:'Aussprache',
  listen:'🔊 Anhören', slowly:'🐢 Langsam', tapSay:'🎙️ Tippen und sprechen', listening:'⏹ Ich höre zu… zum Stoppen tippen',
  back:'← Zurück', next:'Weiter →', weHeard:'Wir haben gehört:', best:'Bestwert: {n} %',
  progress:'{lang}: {done} von {total} Sätzen gemeistert (80 %+)',
  noCatch:'Wir haben nichts gehört. Versuch es noch einmal, etwas näher am Mikrofon.',
  errNotAllowed:'Der Mikrofonzugriff wurde blockiert. Erlaube das Mikrofon für diese Seite in den Browsereinstellungen und lade neu.',
  errService:'Spracherkennung ist hier nicht verfügbar. Versuch es mit Chrome oder Safari.',
  errNoSpeech:'Wir haben nichts gehört. Versuch es noch einmal.', errNetwork:'Die Spracherkennung braucht eine Internetverbindung.',
  errLang:'Dein Browser unterstützt keine Spracherkennung für: {lang}.', errStart:'Das Mikrofon konnte nicht gestartet werden: ', errOther:'Sprachfehler: ',
  tipGreat:'Ausgezeichnet! Klar und natürlich.',
  tipAll:'Alle Wörter wurden erkannt. Sprich etwas deutlicher und selbstbewusster, um die Punktzahl zu verbessern.',
  missed1:'1 Wort wurde nicht erkannt (rot). Tippe darauf, um es anzuhören, und versuch es dann noch einmal.',
  missedN:'{n} Wörter wurden nicht erkannt (rot). Tippe auf ein rotes Wort, um es anzuhören, und versuch es dann noch einmal.',
  typeBelow:'Gib unten einen Satz ein, um zu beginnen.',
  ownTitle:'Dein eigener Satz', ownSub:'Schreib oder sag etwas, übersetze es und übe es dann.', writingIn:'Ich schreibe auf',
  sayIt:'🎙️ Sprechen', listeningShort:'⏹ Ich höre zu…', placeholder:'z. B. Können Sie mir ein gutes Restaurant in der Nähe empfehlen?',
  translateTo:'🌍 Übersetzen ({lang}) und üben', asWritten:'So üben, wie geschrieben', translating:'Wird übersetzt…',
  trFirst:'Schreib oder sag zuerst einen Satz.', trLong:'Bitte höchstens 300 Zeichen.', trOff:'Die Übersetzung ist noch nicht eingeschaltet.',
  trFail:'Übersetzung fehlgeschlagen: ', voiceNeeds:'Spracheingabe braucht Chrome, Edge oder Safari.', micBlocked:'Der Mikrofonzugriff wurde blockiert.', cantHear:'Nicht gut verstanden. Versuch es noch einmal.',
  sets:{'Basics':'Grundlagen','Café & restaurant':'Café und Restaurant','Travel':'Reisen','Tricky sounds':'Schwierige Laute','My phrase':'Mein Satz','Business & work':'Geschäft und Arbeit','Shopping':'Einkaufen','Health & emergencies':'Gesundheit und Notfälle','Social & small talk':'Smalltalk','Numbers, dates & time':'Zahlen, Daten und Uhrzeit'},
  lockedText:'{n} Sätze mit Bewertung Laut für Laut ({lang}). Teil von Harley Says Premium, bald verfügbar.',
  lockedCta:'⭐ Beim Start benachrichtigen', upsell:'🎉 Das waren alle {n} kostenlosen Sätze in „{set}“. Premium bietet {m} weitere.', getNotified:'Benachrichtigen',
  comingSoon:'Bald verfügbar', premTitle:'⭐ Harley Says Premium',
  feats:[['200 Sätze pro Thema',', fünfmal so viel wie kostenlos'],['5 zusätzliche Themen',': Arbeit, Einkaufen, Gesundheit, Smalltalk und Zahlen'],['Bewertung Laut für Laut',', die genau zeigt, welche Laute du verbessern solltest'],['Unbegrenzte Übersetzungen',' deiner eigenen Sätze'],['Synchronisierter Fortschritt',' auf Handy und Computer']],
  notifyLabel:'Benachrichtige mich zum Start von Premium', notifyBtn:'Benachrichtigen',
  fine:'Wir schreiben dir nur zum Start von Premium. Kein Spam, jederzeit abbestellbar.',
  wlErr:'Das hat leider nicht geklappt. Bitte versuch es noch einmal.', wlDone:'✓ Du stehst auf der Liste. Wir melden uns, wenn Premium startet.',
  storyH:'Warum wir Harley Says gebaut haben',
  story1:'Meine Frau lebt in Großbritannien und sucht immer nach Möglichkeiten, ihre Aussprache zu üben. Unterricht hilft, aber dazwischen ist es schwer, jemanden zu finden, der geduldig zuhört, es richtig vorspricht und ehrlich sagt, wie man geklungen hat.',
  story2:'Also haben wir das Tool gebaut, das wir uns gewünscht hätten: kostenlos, ohne Anmeldung und jederzeit bereit.',
  whyH:'Warum Harley?', cap1:'Mit voller Geschwindigkeit', cap2:'Bereit zum Spielen',
  story3:'Die App ist nach Harley benannt, unserem geliebten Bichon Frisé. In der App lernt auch er sprechen: Jedes Mal, wenn du übst, übt ihr zusammen.',
  howH:'So funktioniert’s und Tipps',
  how1:'Tippe auf Anhören, um den Satz zu hören, dann tippe auf das Mikrofon und sprich ihn nach. Erkannte Wörter werden grün, nicht erkannte rot. Tippe auf ein Wort, um es einzeln zu hören.',
  how2:'Die Punktzahl beruht darauf, wie gut die Transkription der Spracherkennung zum Satz passt, gewichtet nach ihrer Sicherheit. Sie zeigt gut, wie verständlich du bist, ist aber kein Phonetiklabor. Ein Muttersprachler bleibt der beste Maßstab.',
  how3:'Funktioniert am besten in Chrome, Edge oder Safari (auch auf dem iPhone). Firefox unterstützt keine Spracherkennung. Nutze einen ruhigen Raum und sprich in natürlichem Tempo.',
  footer:'Deine Stimme wird vom integrierten Sprachdienst deines Browsers verarbeitet. Deine Ergebnisse bleiben auf diesem Gerät. Wenn du dich für die Premium-Warteliste einträgst, speichern wir deine E-Mail nur, um dich über den Start zu informieren.',
  noRec:'Dein Browser unterstützt keine Spracherkennung: Du kannst zuhören, bekommst aber keine Bewertung. Öffne diese Seite in Chrome, Edge oder Safari.',
  fileWarn:'Als lokale Datei geöffnet: Das Mikrofon funktioniert möglicherweise nicht.'
},
pt:{
  iSpeak:'Falo', learning:'Quero aprender', premium:'Premium', tagline:'pronúncia',
  listen:'🔊 Ouvir', slowly:'🐢 Devagar', tapSay:'🎙️ Toque e diga', listening:'⏹ Microfone ligado… toque para parar',
  back:'← Voltar', next:'Próxima →', weHeard:'Ouvimos:', best:'Melhor: {n}%',
  progress:'{lang}: {done} de {total} frases dominadas (80%+)',
  noCatch:'Não ouvimos nada. Tente outra vez, um pouco mais perto do microfone.',
  errNotAllowed:'O acesso ao microfone foi bloqueado. Permita o microfone para este site nas definições do navegador e recarregue a página.',
  errService:'O reconhecimento de voz não está disponível aqui. Experimente o Chrome ou o Safari.',
  errNoSpeech:'Não ouvimos nada. Tente outra vez.', errNetwork:'O reconhecimento de voz precisa de ligação à internet.',
  errLang:'O seu navegador não suporta reconhecimento de voz para: {lang}.', errStart:'Não foi possível ligar o microfone: ', errOther:'Erro de voz: ',
  tipGreat:'Excelente! Claro e natural.',
  tipAll:'Todas as palavras foram entendidas. Diga com um pouco mais de clareza e confiança para subir a pontuação.',
  missed1:'1 palavra não foi entendida (a vermelho). Toque nela para a ouvir e tente outra vez.',
  missedN:'{n} palavras não foram entendidas (a vermelho). Toque numa palavra vermelha para a ouvir e tente outra vez.',
  typeBelow:'Escreva uma frase abaixo para começar.',
  ownTitle:'A sua frase', ownSub:'Escreva ou diga algo, traduza e depois pratique.', writingIn:'Escrevo em',
  sayIt:'🎙️ Dizer', listeningShort:'⏹ Microfone ligado…', placeholder:'ex. Pode recomendar um bom restaurante aqui perto?',
  translateTo:'🌍 Traduzir ({lang}) e praticar', asWritten:'Praticar como está', translating:'A traduzir…',
  trFirst:'Primeiro escreva ou diga uma frase.', trLong:'No máximo 300 caracteres, por favor.', trOff:'A tradução ainda não está ativada.',
  trFail:'A tradução falhou: ', voiceNeeds:'A entrada por voz precisa do Chrome, Edge ou Safari.', micBlocked:'O acesso ao microfone foi bloqueado.', cantHear:'Não se ouviu bem. Tente outra vez.',
  sets:{'Basics':'Básico','Café & restaurant':'Café e restaurante','Travel':'Viagens','Tricky sounds':'Sons difíceis','My phrase':'A minha frase','Business & work':'Negócios e trabalho','Shopping':'Compras','Health & emergencies':'Saúde e emergências','Social & small talk':'Vida social','Numbers, dates & time':'Números, datas e horas'},
  lockedText:'{n} frases com pontuação som a som ({lang}). Faz parte do Harley Says Premium, em breve.',
  lockedCta:'⭐ Avise-me no lançamento', upsell:'🎉 Fez todas as {n} frases grátis de «{set}». O Premium acrescenta mais {m}.', getNotified:'Avise-me',
  comingSoon:'Em breve', premTitle:'⭐ Harley Says Premium',
  feats:[['200 frases por tema',', cinco vezes a biblioteca grátis'],['5 temas extra',': negócios, compras, saúde, vida social e números'],['Pontuação som a som',' que mostra exatamente que sons melhorar'],['Traduções ilimitadas',' das suas frases'],['Progresso sincronizado',' entre o telefone e o computador']],
  notifyLabel:'Avise-me quando o Premium for lançado', notifyBtn:'Avise-me',
  fine:'Só enviaremos emails sobre o lançamento do Premium. Sem spam, pode cancelar quando quiser.',
  wlErr:'Desculpe, não foi enviado. Tente outra vez.', wlDone:'✓ Está na lista. Avisamos quando o Premium for lançado.',
  storyH:'A história do Harley Says',
  story1:'A minha mulher vive no Reino Unido e está sempre à procura de formas de praticar a pronúncia. As aulas ajudam, mas entre elas é difícil encontrar alguém com paciência para ouvir, repetir corretamente e dizer com honestidade como soou.',
  story2:'Por isso, fizemos a ferramenta que gostaríamos de ter: gratuita, sem criar conta e pronta sempre que quiser.',
  whyH:'Quem é o Harley?', cap1:'A toda a velocidade', cap2:'Pronto para brincar',
  story3:'A app tem o nome do Harley, o nosso querido bichon frisé. Na app, ele também aprende a falar: sempre que pratica, praticam juntos.',
  howH:'Como funciona e dicas',
  how1:'Toque em Ouvir para escutar a frase e depois toque no microfone e diga-a. As palavras reconhecidas ficam verdes; as outras, vermelhas. Toque numa palavra para a ouvir sozinha.',
  how2:'A pontuação baseia-se em quanto a transcrição do reconhecimento de voz corresponde à frase, ponderada pela confiança. É um bom guia de quão bem é entendido, não um laboratório de fonética. Um falante nativo continua a ser a melhor referência.',
  how3:'Funciona melhor no Chrome, Edge ou Safari (incluindo no iPhone). O Firefox não suporta reconhecimento de voz. Escolha um sítio tranquilo e fale a um ritmo natural.',
  footer:'A sua voz é processada pelo serviço de voz integrado do navegador. As suas pontuações ficam neste dispositivo. Se entrar na lista do Premium, guardamos o seu email apenas para avisar do lançamento.',
  noRec:'O seu navegador não suporta reconhecimento de voz: pode ouvir, mas não receber pontuação. Abra esta página no Chrome, Edge ou Safari.',
  fileWarn:'Aberto como ficheiro local: o microfone pode não funcionar.'
}};

// Meanings of the English (UK and US) phrases in the learner's own language: [es, fr, it, de, pt].
// Tricky sounds keep their sound labels (TH, V vs W...), which work in any language.
(function(){
const M = {
"Hello, how are you?":["Hola, ¿cómo estás?","Bonjour, comment ça va ?","Ciao, come stai?","Hallo, wie geht's?","Olá, como está?"],
"Hi, how are you doing?":["Hola, ¿qué tal?","Salut, ça va ?","Ciao, come va?","Hallo, wie geht's?","Olá, tudo bem?"],
"Nice to meet you":["Encantado de conocerte","Enchanté","Piacere di conoscerti","Freut mich","Muito prazer"],
"Thank you very much":["Muchas gracias","Merci beaucoup","Grazie mille","Vielen Dank","Muito obrigado"],
"Thank you so much":["Muchísimas gracias","Merci beaucoup","Grazie mille","Vielen Dank","Muito obrigado"],
"Sorry, I don't understand":["Lo siento, no entiendo","Désolé, je ne comprends pas","Scusa, non capisco","Entschuldigung, ich verstehe nicht","Desculpe, não entendo"],
"Could you say that again, please?":["¿Puede repetirlo, por favor?","Pouvez-vous répéter, s'il vous plaît ?","Può ripetere, per favore?","Können Sie das bitte wiederholen?","Pode repetir, por favor?"],
"Good morning":["Buenos días","Bonjour","Buongiorno","Guten Morgen","Bom dia"],
"Good evening":["Buenas tardes / buenas noches","Bonsoir","Buonasera","Guten Abend","Boa noite"],
"Goodbye, see you soon":["Adiós, hasta pronto","Au revoir, à bientôt","Arrivederci, a presto","Auf Wiedersehen, bis bald","Adeus, até breve"],
"Bye, see you soon":["Adiós, hasta pronto","Salut, à bientôt","Ciao, a presto","Tschüss, bis bald","Tchau, até breve"],
"My name is Anna":["Me llamo Anna","Je m'appelle Anna","Mi chiamo Anna","Ich heiße Anna","O meu nome é Anna"],
"What's your name?":["¿Cómo te llamas?","Comment tu t'appelles ?","Come ti chiami?","Wie heißt du?","Como se chama?"],
"Where are you from?":["¿De dónde eres?","D'où viens-tu ?","Di dove sei?","Woher kommst du?","De onde é?"],
"I'm from Spain":["Soy de España","Je viens d'Espagne","Vengo dalla Spagna","Ich komme aus Spanien","Sou de Espanha"],
"I'm from Mexico":["Soy de México","Je viens du Mexique","Vengo dal Messico","Ich komme aus Mexiko","Sou do México"],
"Do you speak Spanish?":["¿Hablas español?","Parlez-vous espagnol ?","Parli spagnolo?","Sprechen Sie Spanisch?","Fala espanhol?"],
"I'm learning English":["Estoy aprendiendo inglés","J'apprends l'anglais","Sto imparando l'inglese","Ich lerne Englisch","Estou a aprender inglês"],
"Could you speak more slowly, please?":["¿Puede hablar más despacio, por favor?","Pouvez-vous parler plus lentement, s'il vous plaît ?","Può parlare più lentamente, per favore?","Können Sie bitte langsamer sprechen?","Pode falar mais devagar, por favor?"],
"What does this word mean?":["¿Qué significa esta palabra?","Que veut dire ce mot ?","Cosa significa questa parola?","Was bedeutet dieses Wort?","O que significa esta palavra?"],
"How do you say this in English?":["¿Cómo se dice esto en inglés?","Comment dit-on ça en anglais ?","Come si dice in inglese?","Wie sagt man das auf Englisch?","Como se diz isto em inglês?"],
"Excuse me":["Perdone / disculpe","Excusez-moi","Mi scusi","Entschuldigung","Com licença"],
"You're welcome":["De nada","De rien","Prego","Gern geschehen","De nada"],
"Have a nice day":["Que tenga un buen día","Bonne journée","Buona giornata","Schönen Tag noch","Tenha um bom dia"],
"Could I have a cup of tea, please?":["¿Me pone un té, por favor?","Je pourrais avoir un thé, s'il vous plaît ?","Posso avere un tè, per favore?","Könnte ich bitte einen Tee haben?","Pode trazer-me um chá, por favor?"],
"Could I get a coffee, please?":["¿Me da un café, por favor?","Je pourrais avoir un café, s'il vous plaît ?","Posso avere un caffè, per favore?","Könnte ich bitte einen Kaffee haben?","Pode dar-me um café, por favor?"],
"Can I have the bill, please?":["¿Me trae la cuenta, por favor?","L'addition, s'il vous plaît","Il conto, per favore","Die Rechnung, bitte","A conta, por favor"],
"Can I get the check, please?":["¿Me trae la cuenta, por favor?","L'addition, s'il vous plaît","Il conto, per favore","Die Rechnung, bitte","A conta, por favor"],
"I've booked a table for two":["He reservado una mesa para dos","J'ai réservé une table pour deux","Ho prenotato un tavolo per due","Ich habe einen Tisch für zwei reserviert","Reservei uma mesa para dois"],
"I have a reservation for two":["Tengo una reserva para dos","J'ai une réservation pour deux","Ho una prenotazione per due","Ich habe eine Reservierung für zwei","Tenho uma reserva para dois"],
"What would you recommend?":["¿Qué me recomienda?","Qu'est-ce que vous recommandez ?","Cosa mi consiglia?","Was würden Sie empfehlen?","O que me recomenda?"],
"That was delicious":["Estaba delicioso","C'était délicieux","Era buonissimo","Das war köstlich","Estava delicioso"],
"A table for two, please":["Una mesa para dos, por favor","Une table pour deux, s'il vous plaît","Un tavolo per due, per favore","Einen Tisch für zwei, bitte","Uma mesa para dois, por favor"],
"Could I see the menu, please?":["¿Puedo ver la carta, por favor?","Je peux voir la carte, s'il vous plaît ?","Posso vedere il menù, per favore?","Könnte ich bitte die Speisekarte sehen?","Posso ver o menu, por favor?"],
"Can I see the menu, please?":["¿Puedo ver la carta, por favor?","Je peux voir la carte, s'il vous plaît ?","Posso vedere il menù, per favore?","Kann ich bitte die Speisekarte sehen?","Posso ver o menu, por favor?"],
"Could I have a glass of water?":["¿Me trae un vaso de agua?","Je pourrais avoir un verre d'eau ?","Posso avere un bicchiere d'acqua?","Könnte ich ein Glas Wasser haben?","Pode trazer-me um copo de água?"],
"Could I get a glass of water?":["¿Me trae un vaso de agua?","Je pourrais avoir un verre d'eau ?","Posso avere un bicchiere d'acqua?","Könnte ich ein Glas Wasser haben?","Pode trazer-me um copo de água?"],
"A bottle of red wine, please":["Una botella de vino tinto, por favor","Une bouteille de vin rouge, s'il vous plaît","Una bottiglia di vino rosso, per favore","Eine Flasche Rotwein, bitte","Uma garrafa de vinho tinto, por favor"],
"I'm vegetarian":["Soy vegetariano/a","Je suis végétarien(ne)","Sono vegetariano/a","Ich bin Vegetarier(in)","Sou vegetariano/a"],
"Does this contain nuts?":["¿Esto lleva frutos secos?","Est-ce que ça contient des noix ?","Contiene frutta a guscio?","Sind da Nüsse drin?","Isto tem frutos secos?"],
"Does this have nuts in it?":["¿Esto lleva frutos secos?","Est-ce que ça contient des noix ?","Contiene frutta a guscio?","Sind da Nüsse drin?","Isto tem frutos secos?"],
"I'll have the fish, please":["Para mí, el pescado, por favor","Je vais prendre le poisson, s'il vous plaît","Per me il pesce, per favore","Ich nehme den Fisch, bitte","Para mim, o peixe, por favor"],
"I'll have the salmon, please":["Para mí, el salmón, por favor","Je vais prendre le saumon, s'il vous plaît","Per me il salmone, per favore","Ich nehme den Lachs, bitte","Para mim, o salmão, por favor"],
"Can I pay by card?":["¿Puedo pagar con tarjeta?","Je peux payer par carte ?","Posso pagare con la carta?","Kann ich mit Karte zahlen?","Posso pagar com cartão?"],
"Can I pay with a card?":["¿Puedo pagar con tarjeta?","Je peux payer par carte ?","Posso pagare con la carta?","Kann ich mit Karte zahlen?","Posso pagar com cartão?"],
"Could we have some more bread?":["¿Nos trae más pan?","On pourrait avoir encore du pain ?","Potremmo avere ancora un po' di pane?","Könnten wir noch etwas Brot haben?","Pode trazer mais pão?"],
"Could we get some more bread?":["¿Nos trae más pan?","On pourrait avoir encore du pain ?","Potremmo avere ancora un po' di pane?","Könnten wir noch etwas Brot haben?","Pode trazer mais pão?"],
"Is service included?":["¿El servicio está incluido?","Le service est compris ?","Il servizio è incluso?","Ist die Bedienung inklusive?","O serviço está incluído?"],
"Is the tip included?":["¿La propina está incluida?","Le pourboire est compris ?","La mancia è inclusa?","Ist das Trinkgeld inklusive?","A gorjeta está incluída?"],
"A pint of beer, please":["Una pinta de cerveza, por favor","Une pinte de bière, s'il vous plaît","Una pinta di birra, per favore","Ein Pint Bier, bitte","Uma caneca de cerveja, por favor"],
"Can I get a beer, please?":["¿Me da una cerveza, por favor?","Une bière, s'il vous plaît","Una birra, per favore","Ein Bier, bitte","Uma cerveja, por favor"],
"Two coffees, please":["Dos cafés, por favor","Deux cafés, s'il vous plaît","Due caffè, per favore","Zwei Kaffee, bitte","Dois cafés, por favor"],
"No ice, thank you":["Sin hielo, gracias","Sans glaçons, merci","Senza ghiaccio, grazie","Ohne Eis, danke","Sem gelo, obrigado"],
"No ice, thanks":["Sin hielo, gracias","Sans glaçons, merci","Senza ghiaccio, grazie","Ohne Eis, danke","Sem gelo, obrigado"],
"The same for me, please":["Lo mismo para mí, por favor","La même chose pour moi, s'il vous plaît","Lo stesso per me, per favore","Für mich das Gleiche, bitte","O mesmo para mim, por favor"],
"I'll have the same":["Yo tomaré lo mismo","Je prendrai la même chose","Prendo lo stesso","Ich nehme das Gleiche","Vou querer o mesmo"],
"Can I get this to take away?":["¿Me lo pone para llevar?","C'est possible à emporter ?","Posso averlo da portare via?","Kann ich das zum Mitnehmen haben?","Pode ser para levar?"],
"Can I get this to go?":["¿Me lo pone para llevar?","C'est possible à emporter ?","Posso averlo da portare via?","Kann ich das zum Mitnehmen haben?","Pode ser para levar?"],
"Where is the nearest station?":["¿Dónde está la estación más cercana?","Où est la gare la plus proche ?","Dov'è la stazione più vicina?","Wo ist der nächste Bahnhof?","Onde fica a estação mais próxima?"],
"Where's the nearest subway station?":["¿Dónde está la estación de metro más cercana?","Où est la station de métro la plus proche ?","Dov'è la stazione della metro più vicina?","Wo ist die nächste U-Bahn-Station?","Onde fica a estação de metro mais próxima?"],
"How much does this cost?":["¿Cuánto cuesta esto?","Combien ça coûte ?","Quanto costa questo?","Wie viel kostet das?","Quanto custa isto?"],
"What time does the train leave?":["¿A qué hora sale el tren?","À quelle heure part le train ?","A che ora parte il treno?","Wann fährt der Zug ab?","A que horas sai o comboio?"],
"I need a taxi":["Necesito un taxi","J'ai besoin d'un taxi","Ho bisogno di un taxi","Ich brauche ein Taxi","Preciso de um táxi"],
"I need a cab":["Necesito un taxi","J'ai besoin d'un taxi","Ho bisogno di un taxi","Ich brauche ein Taxi","Preciso de um táxi"],
"I think I'm lost":["Creo que me he perdido","Je crois que je suis perdu","Credo di essermi perso","Ich glaube, ich habe mich verlaufen","Acho que estou perdido"],
"A return ticket, please":["Un billete de ida y vuelta, por favor","Un aller-retour, s'il vous plaît","Un biglietto di andata e ritorno, per favore","Eine Rückfahrkarte, bitte","Um bilhete de ida e volta, por favor"],
"A round-trip ticket, please":["Un billete de ida y vuelta, por favor","Un aller-retour, s'il vous plaît","Un biglietto di andata e ritorno, per favore","Eine Rückfahrkarte, bitte","Um bilhete de ida e volta, por favor"],
"Which platform is it?":["¿Qué andén es?","C'est quel quai ?","Qual è il binario?","Welches Gleis ist es?","Qual é a plataforma?"],
"Which track is it?":["¿Qué andén es?","C'est quel quai ?","Qual è il binario?","Welches Gleis ist es?","Qual é a plataforma?"],
"Where is the bus stop?":["¿Dónde está la parada de autobús?","Où est l'arrêt de bus ?","Dov'è la fermata dell'autobus?","Wo ist die Bushaltestelle?","Onde é a paragem do autocarro?"],
"Where's the bus stop?":["¿Dónde está la parada de autobús?","Où est l'arrêt de bus ?","Dov'è la fermata dell'autobus?","Wo ist die Bushaltestelle?","Onde é a paragem do autocarro?"],
"Is it far from here?":["¿Está lejos de aquí?","C'est loin d'ici ?","È lontano da qui?","Ist es weit von hier?","Fica longe daqui?"],
"Turn left at the corner":["Gire a la izquierda en la esquina","Tournez à gauche au coin","Giri a sinistra all'angolo","Biegen Sie an der Ecke links ab","Vire à esquerda na esquina"],
"Take a left at the corner":["Gire a la izquierda en la esquina","Tournez à gauche au coin","Giri a sinistra all'angolo","Biegen Sie an der Ecke links ab","Vire à esquerda na esquina"],
"Go straight ahead":["Siga todo recto","Allez tout droit","Vada sempre dritto","Gehen Sie geradeaus","Siga em frente"],
"I've booked a room for three nights":["He reservado una habitación para tres noches","J'ai réservé une chambre pour trois nuits","Ho prenotato una camera per tre notti","Ich habe ein Zimmer für drei Nächte gebucht","Reservei um quarto para três noites"],
"I have a room booked for three nights":["Tengo una habitación reservada para tres noches","J'ai une chambre réservée pour trois nuits","Ho una camera prenotata per tre notti","Ich habe ein Zimmer für drei Nächte gebucht","Tenho um quarto reservado para três noites"],
"What time do we need to leave the room?":["¿A qué hora tenemos que dejar la habitación?","À quelle heure faut-il libérer la chambre ?","A che ora dobbiamo lasciare la camera?","Wann müssen wir das Zimmer verlassen?","A que horas temos de deixar o quarto?"],
"Where is the nearest chemist?":["¿Dónde está la farmacia más cercana?","Où est la pharmacie la plus proche ?","Dov'è la farmacia più vicina?","Wo ist die nächste Apotheke?","Onde fica a farmácia mais próxima?"],
"Where's the nearest pharmacy?":["¿Dónde está la farmacia más cercana?","Où est la pharmacie la plus proche ?","Dov'è la farmacia più vicina?","Wo ist die nächste Apotheke?","Onde fica a farmácia mais próxima?"],
"Could you help me, please?":["¿Me puede ayudar, por favor?","Pouvez-vous m'aider, s'il vous plaît ?","Mi può aiutare, per favore?","Können Sie mir bitte helfen?","Pode ajudar-me, por favor?"],
"I need to see a doctor":["Necesito ver a un médico","J'ai besoin de voir un médecin","Ho bisogno di vedere un medico","Ich muss zum Arzt","Preciso de ver um médico"],
"Where can I buy a ticket?":["¿Dónde puedo comprar un billete?","Où puis-je acheter un billet ?","Dove posso comprare un biglietto?","Wo kann ich eine Fahrkarte kaufen?","Onde posso comprar um bilhete?"],
"What time does the museum open?":["¿A qué hora abre el museo?","À quelle heure ouvre le musée ?","A che ora apre il museo?","Wann öffnet das Museum?","A que horas abre o museu?"],
"Can I pay in cash?":["¿Puedo pagar en efectivo?","Je peux payer en espèces ?","Posso pagare in contanti?","Kann ich bar bezahlen?","Posso pagar em dinheiro?"],
"To the airport, please":["Al aeropuerto, por favor","À l'aéroport, s'il vous plaît","All'aeroporto, per favore","Zum Flughafen, bitte","Para o aeroporto, por favor"]
};
const idx = {es:0,fr:1,it:2,de:3,pt:4};
window.SIR_EN_MEANING = (phrase, ui) => (M[phrase] && idx[ui]!==undefined) ? M[phrase][idx[ui]] : ((window.SIR_MEANINGS[ui]||{})[phrase] || null);
})();

// "Assess me" strings
(function(){
const S = {
en:{a_tab:'📊 Assess me',a_title:'Assess my level',a_free:'Free for now',a_intro:'Get an indicative score out of 100 and a CEFR level (A1–C2) for your {lang}.',
 a_last:'Last result: {score}/100 ({level}), {date}',a_modeRead:'📖 Read a text',a_modeSpeak:'🗣️ Speak freely',a_modeWrite:'✍️ Write',
 a_readHow:'Tap Start and read the text aloud at a natural pace, then tap Finish.',a_speakHow:'Tap Start and talk about anything for up to 5 minutes: yourself, your work, your last holiday. Speak for at least 30 seconds.',
 a_writeHow:'Write about yourself, your work or your plans in the language you are learning (at least 50 words).',a_writePh:'Start writing here…',
 a_start:'🎙️ Start',a_finish:'⏹ Finish',a_assessWrite:'Assess my writing',a_words:'{n} words',a_timeLeft:'{t} left',
 a_tooShort:'Too short to assess. Speak for at least 30 seconds.',a_readShort:'We only heard part of the text. Try reading the whole passage.',a_noMatch:"That didn't match the text. Check you're reading the passage in the language you're learning.",
 a_writeShort:'Please write at least 50 words.',a_assessing:'Harley is assessing…',a_off:"This part isn't switched on yet. Try Read a text, which works now.",a_fail:'Assessment failed: ',
 a_pronLevel:'pronunciation',a_indicative:'Indicative only. This is not a certified exam result.',a_strengths:'What went well',a_improve:'To work on',
 a_sub_accuracy:'Accuracy',a_sub_fluency:'Fluency',a_sub_clarity:'Clarity',a_sub_range:'Vocabulary',a_sub_grammar:'Grammar',a_sub_coherence:'Coherence',
 a_again:'Try again',a_missed:'Words to practise: {w}',a_pace:'Pace: {n} words per minute',
 lvl_A1:'Beginner',lvl_A2:'Elementary',lvl_B1:'Intermediate',lvl_B2:'Upper intermediate',lvl_C1:'Advanced',lvl_C2:'Proficient'},
es:{a_tab:'📊 Evalúame',a_title:'Evalúa mi nivel',a_free:'Gratis por ahora',a_intro:'Obtén una puntuación orientativa sobre 100 y un nivel MCER (A1–C2) de tu {lang}.',
 a_last:'Último resultado: {score}/100 ({level}), {date}',a_modeRead:'📖 Leer un texto',a_modeSpeak:'🗣️ Hablar libremente',a_modeWrite:'✍️ Escribir',
 a_readHow:'Toca Empezar y lee el texto en voz alta a un ritmo natural; luego toca Terminar.',a_speakHow:'Toca Empezar y habla de lo que quieras hasta 5 minutos: de ti, de tu trabajo, de tus últimas vacaciones. Habla al menos 30 segundos.',
 a_writeHow:'Escribe sobre ti, tu trabajo o tus planes en el idioma que estás aprendiendo (mínimo 50 palabras).',a_writePh:'Empieza a escribir aquí…',
 a_start:'🎙️ Empezar',a_finish:'⏹ Terminar',a_assessWrite:'Evaluar mi texto',a_words:'{n} palabras',a_timeLeft:'quedan {t}',
 a_tooShort:'Demasiado corto para evaluar. Habla al menos 30 segundos.',a_readShort:'Solo hemos oído parte del texto. Intenta leerlo entero.',a_noMatch:'No coincide con el texto. Comprueba que lo lees en el idioma que estás aprendiendo.',
 a_writeShort:'Escribe al menos 50 palabras.',a_assessing:'Harley está evaluando…',a_off:'Esta parte aún no está activada. Prueba Leer un texto, que ya funciona.',a_fail:'Error en la evaluación: ',
 a_pronLevel:'pronunciación',a_indicative:'Solo orientativo. No es el resultado de un examen oficial.',a_strengths:'Lo que ha ido bien',a_improve:'A mejorar',
 a_sub_accuracy:'Precisión',a_sub_fluency:'Fluidez',a_sub_clarity:'Claridad',a_sub_range:'Vocabulario',a_sub_grammar:'Gramática',a_sub_coherence:'Coherencia',
 a_again:'Repetir',a_missed:'Palabras para practicar: {w}',a_pace:'Ritmo: {n} palabras por minuto',
 lvl_A1:'Principiante',lvl_A2:'Elemental',lvl_B1:'Intermedio',lvl_B2:'Intermedio alto',lvl_C1:'Avanzado',lvl_C2:'Maestría'},
fr:{a_tab:'📊 Évaluez-moi',a_title:'Évaluer mon niveau',a_free:'Gratuit pour le moment',a_intro:'Obtenez un score indicatif sur 100 et un niveau CECRL (A1–C2) en {lang}.',
 a_last:'Dernier résultat : {score}/100 ({level}), {date}',a_modeRead:'📖 Lire un texte',a_modeSpeak:'🗣️ Parler librement',a_modeWrite:'✍️ Écrire',
 a_readHow:'Touchez Commencer et lisez le texte à voix haute à un rythme naturel, puis touchez Terminer.',a_speakHow:'Touchez Commencer et parlez de ce que vous voulez pendant 5 minutes maximum : vous, votre travail, vos dernières vacances. Parlez au moins 30 secondes.',
 a_writeHow:'Écrivez sur vous, votre travail ou vos projets dans la langue que vous apprenez (au moins 50 mots).',a_writePh:'Commencez à écrire ici…',
 a_start:'🎙️ Commencer',a_finish:'⏹ Terminer',a_assessWrite:'Évaluer mon texte',a_words:'{n} mots',a_timeLeft:'encore {t}',
 a_tooShort:'Trop court pour être évalué. Parlez au moins 30 secondes.',a_readShort:"Nous n'avons entendu qu'une partie du texte. Essayez de le lire en entier.",a_noMatch:"Cela ne correspond pas au texte. Vérifiez que vous le lisez dans la langue que vous apprenez.",
 a_writeShort:'Écrivez au moins 50 mots.',a_assessing:'Harley évalue…',a_off:"Cette partie n'est pas encore activée. Essayez Lire un texte, qui fonctionne déjà.",a_fail:"Échec de l'évaluation : ",
 a_pronLevel:'prononciation',a_indicative:"À titre indicatif. Ce n'est pas le résultat d'un examen certifié.",a_strengths:'Points forts',a_improve:'À travailler',
 a_sub_accuracy:'Exactitude',a_sub_fluency:'Aisance',a_sub_clarity:'Clarté',a_sub_range:'Vocabulaire',a_sub_grammar:'Grammaire',a_sub_coherence:'Cohérence',
 a_again:'Recommencer',a_missed:'Mots à travailler : {w}',a_pace:'Rythme : {n} mots par minute',
 lvl_A1:'Débutant',lvl_A2:'Élémentaire',lvl_B1:'Intermédiaire',lvl_B2:'Intermédiaire avancé',lvl_C1:'Avancé',lvl_C2:'Maîtrise'},
it:{a_tab:'📊 Valutami',a_title:'Valuta il mio livello',a_free:'Gratis per ora',a_intro:'Ottieni un punteggio indicativo su 100 e un livello QCER (A1–C2) per il tuo {lang}.',
 a_last:'Ultimo risultato: {score}/100 ({level}), {date}',a_modeRead:'📖 Leggi un testo',a_modeSpeak:'🗣️ Parla liberamente',a_modeWrite:'✍️ Scrivi',
 a_readHow:'Tocca Inizia e leggi il testo ad alta voce a un ritmo naturale, poi tocca Fine.',a_speakHow:'Tocca Inizia e parla di quello che vuoi fino a 5 minuti: di te, del tuo lavoro, delle tue ultime vacanze. Parla almeno 30 secondi.',
 a_writeHow:'Scrivi di te, del tuo lavoro o dei tuoi progetti nella lingua che stai imparando (almeno 50 parole).',a_writePh:'Inizia a scrivere qui…',
 a_start:'🎙️ Inizia',a_finish:'⏹ Fine',a_assessWrite:'Valuta il mio testo',a_words:'{n} parole',a_timeLeft:'mancano {t}',
 a_tooShort:'Troppo breve per la valutazione. Parla almeno 30 secondi.',a_readShort:'Abbiamo sentito solo una parte del testo. Prova a leggerlo tutto.',a_noMatch:'Non corrisponde al testo. Controlla di leggerlo nella lingua che stai imparando.',
 a_writeShort:'Scrivi almeno 50 parole.',a_assessing:'Harley sta valutando…',a_off:'Questa parte non è ancora attiva. Prova Leggi un testo, che funziona già.',a_fail:'Valutazione non riuscita: ',
 a_pronLevel:'pronuncia',a_indicative:"Solo indicativo. Non è il risultato di un esame certificato.",a_strengths:'Cosa è andato bene',a_improve:'Da migliorare',
 a_sub_accuracy:'Precisione',a_sub_fluency:'Scorrevolezza',a_sub_clarity:'Chiarezza',a_sub_range:'Vocabolario',a_sub_grammar:'Grammatica',a_sub_coherence:'Coerenza',
 a_again:'Riprova',a_missed:'Parole da esercitare: {w}',a_pace:'Ritmo: {n} parole al minuto',
 lvl_A1:'Principiante',lvl_A2:'Elementare',lvl_B1:'Intermedio',lvl_B2:'Intermedio superiore',lvl_C1:'Avanzato',lvl_C2:'Padronanza'},
de:{a_tab:'📊 Teste mich',a_title:'Mein Niveau testen',a_free:'Vorerst kostenlos',a_intro:'Erhalte eine Richtpunktzahl von 100 und ein GER-Niveau (A1–C2) für dein {lang}.',
 a_last:'Letztes Ergebnis: {score}/100 ({level}), {date}',a_modeRead:'📖 Text vorlesen',a_modeSpeak:'🗣️ Frei sprechen',a_modeWrite:'✍️ Schreiben',
 a_readHow:'Tippe auf Start und lies den Text in natürlichem Tempo laut vor, dann tippe auf Fertig.',a_speakHow:'Tippe auf Start und sprich bis zu 5 Minuten über ein beliebiges Thema: über dich, deine Arbeit, deinen letzten Urlaub. Sprich mindestens 30 Sekunden.',
 a_writeHow:'Schreib über dich, deine Arbeit oder deine Pläne in der Sprache, die du lernst (mindestens 50 Wörter).',a_writePh:'Hier mit dem Schreiben beginnen…',
 a_start:'🎙️ Start',a_finish:'⏹ Fertig',a_assessWrite:'Meinen Text bewerten',a_words:'{n} Wörter',a_timeLeft:'noch {t}',
 a_tooShort:'Zu kurz für eine Bewertung. Sprich mindestens 30 Sekunden.',a_readShort:'Wir haben nur einen Teil des Textes gehört. Versuch, den ganzen Text vorzulesen.',a_noMatch:'Das passt nicht zum Text. Lies ihn bitte in der Sprache, die du lernst.',
 a_writeShort:'Bitte schreib mindestens 50 Wörter.',a_assessing:'Harley bewertet…',a_off:'Dieser Teil ist noch nicht eingeschaltet. Versuch es mit Text vorlesen, das funktioniert schon.',a_fail:'Bewertung fehlgeschlagen: ',
 a_pronLevel:'Aussprache',a_indicative:'Nur ein Richtwert. Kein zertifiziertes Prüfungsergebnis.',a_strengths:'Das lief gut',a_improve:'Daran arbeiten',
 a_sub_accuracy:'Genauigkeit',a_sub_fluency:'Flüssigkeit',a_sub_clarity:'Deutlichkeit',a_sub_range:'Wortschatz',a_sub_grammar:'Grammatik',a_sub_coherence:'Zusammenhang',
 a_again:'Noch einmal',a_missed:'Wörter zum Üben: {w}',a_pace:'Tempo: {n} Wörter pro Minute',
 lvl_A1:'Anfänger',lvl_A2:'Grundkenntnisse',lvl_B1:'Mittelstufe',lvl_B2:'Gute Mittelstufe',lvl_C1:'Fortgeschritten',lvl_C2:'Kompetent'},
pt:{a_tab:'📊 Avalie-me',a_title:'Avaliar o meu nível',a_free:'Grátis por agora',a_intro:'Obtenha uma pontuação indicativa em 100 e um nível QECR (A1–C2) para o seu {lang}.',
 a_last:'Último resultado: {score}/100 ({level}), {date}',a_modeRead:'📖 Ler um texto',a_modeSpeak:'🗣️ Falar livremente',a_modeWrite:'✍️ Escrever',
 a_readHow:'Toque em Começar e leia o texto em voz alta a um ritmo natural; depois toque em Terminar.',a_speakHow:'Toque em Começar e fale sobre o que quiser até 5 minutos: sobre si, o seu trabalho, as suas últimas férias. Fale pelo menos 30 segundos.',
 a_writeHow:'Escreva sobre si, o seu trabalho ou os seus planos na língua que está a aprender (pelo menos 50 palavras).',a_writePh:'Comece a escrever aqui…',
 a_start:'🎙️ Começar',a_finish:'⏹ Terminar',a_assessWrite:'Avaliar o meu texto',a_words:'{n} palavras',a_timeLeft:'faltam {t}',
 a_tooShort:'Demasiado curto para avaliar. Fale pelo menos 30 segundos.',a_readShort:'Só ouvimos parte do texto. Tente lê-lo todo.',a_noMatch:'Não corresponde ao texto. Confirme que o está a ler na língua que está a aprender.',
 a_writeShort:'Escreva pelo menos 50 palavras.',a_assessing:'O Harley está a avaliar…',a_off:'Esta parte ainda não está ativada. Experimente Ler um texto, que já funciona.',a_fail:'A avaliação falhou: ',
 a_pronLevel:'pronúncia',a_indicative:'Apenas indicativo. Não é o resultado de um exame certificado.',a_strengths:'O que correu bem',a_improve:'A melhorar',
 a_sub_accuracy:'Precisão',a_sub_fluency:'Fluência',a_sub_clarity:'Clareza',a_sub_range:'Vocabulário',a_sub_grammar:'Gramática',a_sub_coherence:'Coerência',
 a_again:'Tentar outra vez',a_missed:'Palavras para praticar: {w}',a_pace:'Ritmo: {n} palavras por minuto',
 lvl_A1:'Iniciante',lvl_A2:'Elementar',lvl_B1:'Intermédio',lvl_B2:'Intermédio superior',lvl_C1:'Avançado',lvl_C2:'Proficiente'}
};
for (const k in S) Object.assign(window.SIR_UI[k], S[k]);
})();

// Translation allowance strings
(function(){
const S={
 en:{trLeft:'{n} free translations left today',trLimit:"You've used today's {n} free translations. Unlimited translations are part of Premium."},
 es:{trLeft:'Te quedan {n} traducciones gratis hoy',trLimit:'Ya has usado las {n} traducciones gratis de hoy. Las traducciones ilimitadas son parte de Premium.'},
 fr:{trLeft:'Encore {n} traductions gratuites aujourd’hui',trLimit:'Vous avez utilisé vos {n} traductions gratuites du jour. Les traductions illimitées font partie de Premium.'},
 it:{trLeft:'Ti restano {n} traduzioni gratuite oggi',trLimit:'Hai usato le {n} traduzioni gratuite di oggi. Le traduzioni illimitate fanno parte di Premium.'},
 de:{trLeft:'Heute noch {n} kostenlose Übersetzungen',trLimit:'Du hast deine {n} kostenlosen Übersetzungen für heute verbraucht. Unbegrenzte Übersetzungen gibt es mit Premium.'},
 pt:{trLeft:'Restam {n} traduções grátis hoje',trLimit:'Já usou as {n} traduções grátis de hoje. As traduções ilimitadas fazem parte do Premium.'}
};
for (const k in S) Object.assign(window.SIR_UI[k], S[k]);
})();

// Sound-by-sound strings
(function(){
const S={
 en:{p_btn:'🔬 Check each sound',p_left:'{n} free today',p_rec:'⏹ Recording… tap when done',p_wait:'Harley is checking every sound…',p_off:"Sound-by-sound scoring isn't switched on yet.",p_limit:"You've used today's {n} free sound checks. Unlimited checks are part of Premium.",p_fail:'Sound check failed: ',p_nomatch:"We couldn't hear the phrase clearly. Try again in a quieter spot.",p_mic:'Microphone access was blocked.',p_title:'Sound-by-sound score',p_completeness:'Completeness',p_tapWord:'Tap a word to see each sound.',p_sounds:'Sounds in “{w}”',p_omitted:'This word was missed.',p_focus:'Focus on: {s}',p_good:'Every sound was clear. Great work!'},
 es:{p_btn:'🔬 Revisar cada sonido',p_left:'{n} gratis hoy',p_rec:'⏹ Grabando… toca al terminar',p_wait:'Harley está revisando cada sonido…',p_off:'La puntuación sonido a sonido aún no está activada.',p_limit:'Ya has usado las {n} revisiones de sonido gratis de hoy. Las revisiones ilimitadas son parte de Premium.',p_fail:'Error en la revisión: ',p_nomatch:'No hemos oído bien la frase. Inténtalo en un lugar más tranquilo.',p_mic:'Se ha bloqueado el micrófono.',p_title:'Puntuación sonido a sonido',p_completeness:'Integridad',p_tapWord:'Toca una palabra para ver cada sonido.',p_sounds:'Sonidos de «{w}»',p_omitted:'Esta palabra no se ha dicho.',p_focus:'Practica: {s}',p_good:'Todos los sonidos han sido claros. ¡Muy bien!'},
 fr:{p_btn:'🔬 Vérifier chaque son',p_left:'{n} gratuits aujourd’hui',p_rec:'⏹ Enregistrement… touchez pour finir',p_wait:'Harley vérifie chaque son…',p_off:"Le score son par son n'est pas encore activé.",p_limit:'Vous avez utilisé vos {n} vérifications gratuites du jour. Les vérifications illimitées font partie de Premium.',p_fail:'Échec de la vérification : ',p_nomatch:"Nous n'avons pas bien entendu la phrase. Réessayez dans un endroit plus calme.",p_mic:"L'accès au micro a été bloqué.",p_title:'Score son par son',p_completeness:'Complétude',p_tapWord:'Touchez un mot pour voir chaque son.',p_sounds:'Sons de « {w} »',p_omitted:"Ce mot n'a pas été prononcé.",p_focus:'À travailler : {s}',p_good:'Tous les sons étaient clairs. Bravo !'},
 it:{p_btn:'🔬 Controlla ogni suono',p_left:'{n} gratis oggi',p_rec:'⏹ Registrazione… tocca alla fine',p_wait:'Harley sta controllando ogni suono…',p_off:'Il punteggio suono per suono non è ancora attivo.',p_limit:'Hai usato i {n} controlli gratuiti di oggi. I controlli illimitati fanno parte di Premium.',p_fail:'Controllo non riuscito: ',p_nomatch:'Non abbiamo sentito bene la frase. Riprova in un posto più tranquillo.',p_mic:"L'accesso al microfono è stato bloccato.",p_title:'Punteggio suono per suono',p_completeness:'Completezza',p_tapWord:'Tocca una parola per vedere ogni suono.',p_sounds:'Suoni di «{w}»',p_omitted:'Questa parola non è stata detta.',p_focus:'Da esercitare: {s}',p_good:'Tutti i suoni erano chiari. Ottimo lavoro!'},
 de:{p_btn:'🔬 Jeden Laut prüfen',p_left:'heute {n} kostenlos',p_rec:'⏹ Aufnahme… zum Beenden tippen',p_wait:'Harley prüft jeden Laut…',p_off:'Die Bewertung Laut für Laut ist noch nicht eingeschaltet.',p_limit:'Du hast deine {n} kostenlosen Lautprüfungen für heute verbraucht. Unbegrenzte Prüfungen gibt es mit Premium.',p_fail:'Prüfung fehlgeschlagen: ',p_nomatch:'Wir konnten den Satz nicht gut hören. Versuch es an einem ruhigeren Ort.',p_mic:'Der Mikrofonzugriff wurde blockiert.',p_title:'Bewertung Laut für Laut',p_completeness:'Vollständigkeit',p_tapWord:'Tippe auf ein Wort, um jeden Laut zu sehen.',p_sounds:'Laute in „{w}“',p_omitted:'Dieses Wort fehlte.',p_focus:'Übe: {s}',p_good:'Alle Laute waren klar. Super!'},
 pt:{p_btn:'🔬 Verificar cada som',p_left:'{n} grátis hoje',p_rec:'⏹ A gravar… toque no fim',p_wait:'O Harley está a verificar cada som…',p_off:'A pontuação som a som ainda não está ativada.',p_limit:'Já usou as {n} verificações grátis de hoje. As verificações ilimitadas fazem parte do Premium.',p_fail:'A verificação falhou: ',p_nomatch:'Não ouvimos bem a frase. Tente num sítio mais calmo.',p_mic:'O acesso ao microfone foi bloqueado.',p_title:'Pontuação som a som',p_completeness:'Completude',p_tapWord:'Toque numa palavra para ver cada som.',p_sounds:'Sons de «{w}»',p_omitted:'Esta palavra não foi dita.',p_focus:'Pratique: {s}',p_good:'Todos os sons foram claros. Muito bem!'}
};
for (const k in S) Object.assign(window.SIR_UI[k], S[k]);
})();

// Assess me: Premium stories teaser
(function(){
const S={
 en:{a_moreTitle:'50 more stories with Premium',a_moreText:'Longer passages at every level, from A1 to C2, on everyday topics.',a_story1:'A job interview',a_story2:'Lost at the airport',a_story3:'Dinner with friends',a_storyMore:'+ 47 more',f:['50 reading stories',' for Assess me, at every level']},
 es:{a_moreTitle:'50 historias más con Premium',a_moreText:'Textos más largos para todos los niveles, de A1 a C2, sobre temas cotidianos.',a_story1:'Una entrevista de trabajo',a_story2:'Perdido en el aeropuerto',a_story3:'Cena con amigos',a_storyMore:'+ 47 más',f:['50 historias de lectura',' para Evalúame, de todos los niveles']},
 fr:{a_moreTitle:'50 histoires de plus avec Premium',a_moreText:'Des textes plus longs pour tous les niveaux, de A1 à C2, sur des sujets du quotidien.',a_story1:'Un entretien d’embauche',a_story2:'Perdu à l’aéroport',a_story3:'Dîner entre amis',a_storyMore:'+ 47 autres',f:['50 histoires à lire',' pour Évaluez-moi, à tous les niveaux']},
 it:{a_moreTitle:'50 storie in più con Premium',a_moreText:'Testi più lunghi per ogni livello, da A1 a C2, su temi di tutti i giorni.',a_story1:'Un colloquio di lavoro',a_story2:'Perso in aeroporto',a_story3:'Cena con gli amici',a_storyMore:'+ altre 47',f:['50 storie da leggere',' per Valutami, per ogni livello']},
 de:{a_moreTitle:'50 weitere Geschichten mit Premium',a_moreText:'Längere Texte für jedes Niveau von A1 bis C2 zu Alltagsthemen.',a_story1:'Ein Vorstellungsgespräch',a_story2:'Verloren am Flughafen',a_story3:'Abendessen mit Freunden',a_storyMore:'+ 47 weitere',f:['50 Lesegeschichten',' für Teste mich, auf jedem Niveau']},
 pt:{a_moreTitle:'50 histórias extra com o Premium',a_moreText:'Textos mais longos para todos os níveis, do A1 ao C2, sobre temas do dia a dia.',a_story1:'Uma entrevista de emprego',a_story2:'Perdido no aeroporto',a_story3:'Jantar com amigos',a_storyMore:'+ mais 47',f:['50 histórias para ler',' no Avalie-me, para todos os níveis']}
};
for (const k in S){ const {f,...rest}=S[k]; Object.assign(window.SIR_UI[k], rest); window.SIR_UI[k].feats = window.SIR_UI[k].feats.concat([f]); }
})();

// Focus packs strings
(function(){
const S={
 en:{set:'Past tense',f_tab:'🎯 Focus packs',f_title:'Focus packs',f_intro:'Practise speaking with phrases built around one grammar point or topic.',f_free:'Free',f_pack:'Focus pack',f_back:'← All focus packs',f_pastD:'{n} everyday phrases using common past forms',
  f_future:'Future',f_futureD:'Plans, predictions and promises',f_irregular:'Irregular verbs',f_irregularD:'The verbs that break the rules',f_questions:'Asking questions',f_questionsD:'Who, what, where, when, why and how',f_numbers:'Numbers, dates & time',f_numbersD:'Prices, times, dates and phone numbers',f_polite:'Polite requests',f_politeD:'Could you…, would you mind…, I’d like…',f_vocab:'Everyday vocabulary',f_vocabD:'Food, work, home and travel words in context',
  f_weakTitle:'Practise my weak spots',f_weakText:'Take an Assess me test and Harley builds a pack from your own mistakes, so you drill exactly what you got wrong.',feat:['All focus packs',' plus practice built from your own mistakes']},
 es:{set:'Pasado',f_tab:'🎯 Packs temáticos',f_title:'Packs temáticos',f_intro:'Practica hablando con frases centradas en un punto de gramática o un tema.',f_free:'Gratis',f_pack:'Pack',f_back:'← Todos los packs',f_pastD:'{n} frases cotidianas con formas de pasado frecuentes',
  f_future:'Futuro',f_futureD:'Planes, predicciones y promesas',f_irregular:'Verbos irregulares',f_irregularD:'Los verbos que se saltan las reglas',f_questions:'Hacer preguntas',f_questionsD:'Quién, qué, dónde, cuándo, por qué y cómo',f_numbers:'Números, fechas y horas',f_numbersD:'Precios, horas, fechas y teléfonos',f_polite:'Peticiones educadas',f_politeD:'¿Podría…?, ¿le importaría…?, quisiera…',f_vocab:'Vocabulario cotidiano',f_vocabD:'Comida, trabajo, casa y viajes en contexto',
  f_weakTitle:'Practicar mis puntos débiles',f_weakText:'Haz una prueba de Evalúame y Harley creará un pack con tus propios errores, para que practiques justo lo que fallaste.',feat:['Todos los packs temáticos',' y práctica creada a partir de tus errores']},
 fr:{set:'Passé',f_tab:'🎯 Packs thématiques',f_title:'Packs thématiques',f_intro:'Entraînez-vous à parler avec des phrases centrées sur un point de grammaire ou un thème.',f_free:'Gratuit',f_pack:'Pack',f_back:'← Tous les packs',f_pastD:'{n} phrases courantes avec des formes du passé fréquentes',
  f_future:'Futur',f_futureD:'Projets, prévisions et promesses',f_irregular:'Verbes irréguliers',f_irregularD:'Les verbes qui ne suivent pas les règles',f_questions:'Poser des questions',f_questionsD:'Qui, quoi, où, quand, pourquoi et comment',f_numbers:'Chiffres, dates et heures',f_numbersD:'Prix, heures, dates et numéros de téléphone',f_polite:'Demandes polies',f_politeD:'Pourriez-vous…, cela vous dérangerait…, je voudrais…',f_vocab:'Vocabulaire courant',f_vocabD:'Repas, travail, maison et voyage en contexte',
  f_weakTitle:'Travailler mes points faibles',f_weakText:'Passez un test Évaluez-moi et Harley crée un pack à partir de vos propres erreurs, pour travailler exactement ce qui n’allait pas.',feat:['Tous les packs thématiques',' et des exercices créés à partir de vos erreurs']},
 it:{set:'Passato',f_tab:'🎯 Pacchetti a tema',f_title:'Pacchetti a tema',f_intro:'Esercitati a parlare con frasi costruite su un punto di grammatica o un argomento.',f_free:'Gratis',f_pack:'Pacchetto',f_back:'← Tutti i pacchetti',f_pastD:'{n} frasi quotidiane con forme del passato frequenti',
  f_future:'Futuro',f_futureD:'Piani, previsioni e promesse',f_irregular:'Verbi irregolari',f_irregularD:'I verbi che non seguono le regole',f_questions:'Fare domande',f_questionsD:'Chi, cosa, dove, quando, perché e come',f_numbers:'Numeri, date e orari',f_numbersD:'Prezzi, orari, date e numeri di telefono',f_polite:'Richieste gentili',f_politeD:'Potrebbe…, le dispiacerebbe…, vorrei…',f_vocab:'Vocabolario quotidiano',f_vocabD:'Cibo, lavoro, casa e viaggi nel contesto',
  f_weakTitle:'Esercita i miei punti deboli',f_weakText:'Fai un test Valutami e Harley crea un pacchetto dai tuoi errori, così ti eserciti proprio su ciò che hai sbagliato.',feat:['Tutti i pacchetti a tema',' più esercizi creati dai tuoi errori']},
 de:{set:'Vergangenheit',f_tab:'🎯 Themenpakete',f_title:'Themenpakete',f_intro:'Übe das Sprechen mit Sätzen rund um einen Grammatikpunkt oder ein Thema.',f_free:'Kostenlos',f_pack:'Paket',f_back:'← Alle Pakete',f_pastD:'{n} Alltagssätze mit häufigen Vergangenheitsformen',
  f_future:'Zukunft',f_futureD:'Pläne, Vorhersagen und Versprechen',f_irregular:'Unregelmäßige Verben',f_irregularD:'Die Verben, die sich nicht an Regeln halten',f_questions:'Fragen stellen',f_questionsD:'Wer, was, wo, wann, warum und wie',f_numbers:'Zahlen, Daten und Uhrzeit',f_numbersD:'Preise, Uhrzeiten, Daten und Telefonnummern',f_polite:'Höfliche Bitten',f_politeD:'Könnten Sie…, würde es Ihnen etwas ausmachen…, ich hätte gern…',f_vocab:'Alltagswortschatz',f_vocabD:'Essen, Arbeit, Zuhause und Reisen im Zusammenhang',
  f_weakTitle:'Meine Schwächen üben',f_weakText:'Mach einen Test bei Teste mich, und Harley erstellt ein Paket aus deinen eigenen Fehlern, damit du genau das übst, was nicht geklappt hat.',feat:['Alle Themenpakete',' plus Übungen aus deinen eigenen Fehlern']},
 pt:{set:'Passado',f_tab:'🎯 Pacotes temáticos',f_title:'Pacotes temáticos',f_intro:'Pratique a falar com frases construídas à volta de um ponto de gramática ou tema.',f_free:'Grátis',f_pack:'Pacote',f_back:'← Todos os pacotes',f_pastD:'{n} frases do dia a dia com formas comuns do passado',
  f_future:'Futuro',f_futureD:'Planos, previsões e promessas',f_irregular:'Verbos irregulares',f_irregularD:'Os verbos que não seguem as regras',f_questions:'Fazer perguntas',f_questionsD:'Quem, o quê, onde, quando, porquê e como',f_numbers:'Números, datas e horas',f_numbersD:'Preços, horas, datas e números de telefone',f_polite:'Pedidos educados',f_politeD:'Podia…, importa-se de…, queria…',f_vocab:'Vocabulário do dia a dia',f_vocabD:'Comida, trabalho, casa e viagens em contexto',
  f_weakTitle:'Praticar os meus pontos fracos',f_weakText:'Faça um teste no Avalie-me e o Harley cria um pacote com os seus próprios erros, para praticar exatamente o que correu mal.',feat:['Todos os pacotes temáticos',' e prática criada a partir dos seus erros']}
};
for (const k in S){ const {set,feat,...rest}=S[k]; Object.assign(window.SIR_UI[k], rest); window.SIR_UI[k].sets['Past tense']=set; window.SIR_UI[k].feats=window.SIR_UI[k].feats.concat([feat]); }
})();

// Assess me: detailed read-aloud scoring in short parts
(function(){
const S={
 en:{a_readHowParts:'Read the text aloud in {m} short parts at a natural pace. Tap the button to start each part, and tap again when you finish it.',a_partBtn:'🎙️ Read part {n} of {m}',a_partStop:'⏹ Done with part {n}',a_partFail:"We couldn't hear part {n} clearly. Please read it again in a quieter spot.",a_limitA:"You've used today's free detailed level checks. Unlimited checks are part of Premium.",a_quickBtn:'Get a quick estimate instead',a_quickNote:"Quick estimate: detailed sound scoring wasn't used, so this is less precise."},
 es:{a_readHowParts:'Lee el texto en voz alta en {m} partes cortas, a un ritmo natural. Toca el botón para empezar cada parte y vuelve a tocarlo al terminarla.',a_partBtn:'🎙️ Leer la parte {n} de {m}',a_partStop:'⏹ He terminado la parte {n}',a_partFail:'No hemos oído bien la parte {n}. Léela otra vez en un lugar más tranquilo.',a_limitA:'Ya has usado las evaluaciones detalladas gratis de hoy. Las evaluaciones ilimitadas son parte de Premium.',a_quickBtn:'Obtener una estimación rápida',a_quickNote:'Estimación rápida: no se ha usado la puntuación sonido a sonido, así que es menos precisa.'},
 fr:{a_readHowParts:'Lisez le texte à voix haute en {m} courtes parties, à un rythme naturel. Touchez le bouton pour commencer chaque partie, puis touchez-le à nouveau à la fin.',a_partBtn:'🎙️ Lire la partie {n} sur {m}',a_partStop:"⏹ J'ai fini la partie {n}",a_partFail:"Nous n'avons pas bien entendu la partie {n}. Relisez-la dans un endroit plus calme.",a_limitA:'Vous avez utilisé vos évaluations détaillées gratuites du jour. Les évaluations illimitées font partie de Premium.',a_quickBtn:'Obtenir une estimation rapide',a_quickNote:"Estimation rapide : le score son par son n'a pas été utilisé, elle est donc moins précise."},
 it:{a_readHowParts:'Leggi il testo ad alta voce in {m} brevi parti, a un ritmo naturale. Tocca il pulsante per iniziare ogni parte e toccalo di nuovo quando la finisci.',a_partBtn:'🎙️ Leggi la parte {n} di {m}',a_partStop:'⏹ Ho finito la parte {n}',a_partFail:'Non abbiamo sentito bene la parte {n}. Rileggila in un posto più tranquillo.',a_limitA:'Hai usato le valutazioni dettagliate gratuite di oggi. Le valutazioni illimitate fanno parte di Premium.',a_quickBtn:'Ottieni una stima rapida',a_quickNote:'Stima rapida: il punteggio suono per suono non è stato usato, quindi è meno precisa.'},
 de:{a_readHowParts:'Lies den Text in {m} kurzen Teilen in natürlichem Tempo laut vor. Tippe auf die Taste, um jeden Teil zu beginnen, und tippe erneut, wenn du fertig bist.',a_partBtn:'🎙️ Teil {n} von {m} lesen',a_partStop:'⏹ Teil {n} fertig',a_partFail:'Wir konnten Teil {n} nicht gut hören. Lies ihn bitte an einem ruhigeren Ort noch einmal.',a_limitA:'Du hast deine kostenlosen ausführlichen Einstufungen für heute verbraucht. Unbegrenzte Einstufungen gibt es mit Premium.',a_quickBtn:'Stattdessen schnelle Schätzung',a_quickNote:'Schnelle Schätzung: Die Bewertung Laut für Laut wurde nicht verwendet, daher ist sie weniger genau.'},
 pt:{a_readHowParts:'Leia o texto em voz alta em {m} partes curtas, a um ritmo natural. Toque no botão para começar cada parte e toque de novo quando a terminar.',a_partBtn:'🎙️ Ler a parte {n} de {m}',a_partStop:'⏹ Terminei a parte {n}',a_partFail:'Não ouvimos bem a parte {n}. Leia-a de novo num sítio mais calmo.',a_limitA:'Já usou as avaliações detalhadas grátis de hoje. As avaliações ilimitadas fazem parte do Premium.',a_quickBtn:'Obter uma estimativa rápida',a_quickNote:'Estimativa rápida: não foi usada a pontuação som a som, por isso é menos precisa.'}
};
for (const k in S) Object.assign(window.SIR_UI[k], S[k]);
})();

// End-of-section summary
(function(){
const S={
 en:{s_see:'🏁 See my results',s_title:'Section complete',s_top:'Brilliant! Harley is over the moon.',s_good:"Great work! A little more practice and you'll nail it.",s_mid:"Good effort. This section needs a bit more practice, and you'll hear the difference.",s_low:"Let's keep practising together. Every try helps!",s_none:'Try a few phrases first, then come back for your score.',s_mastered:'{n} of {m} phrases at 80% or more',s_tried:'you tried {n} of {m}',s_again:'Practise these again',s_notTried:'not tried',s_restart:'↺ Start again',s_nextTopic:'Next topic →'},
 es:{s_see:'🏁 Ver mis resultados',s_title:'Sección completada',s_top:'¡Genial! Harley está feliz.',s_good:'¡Muy bien! Con un poco más de práctica lo dominarás.',s_mid:'Buen esfuerzo. Esta sección necesita un poco más de práctica y notarás la diferencia.',s_low:'Sigamos practicando juntos. ¡Cada intento cuenta!',s_none:'Prueba primero algunas frases y luego vuelve para ver tu puntuación.',s_mastered:'{n} de {m} frases con 80 % o más',s_tried:'has probado {n} de {m}',s_again:'Practica estas otra vez',s_notTried:'sin probar',s_restart:'↺ Empezar de nuevo',s_nextTopic:'Siguiente tema →'},
 fr:{s_see:'🏁 Voir mes résultats',s_title:'Section terminée',s_top:'Bravo ! Harley est aux anges.',s_good:'Très bien ! Encore un peu de pratique et ce sera parfait.',s_mid:'Bel effort. Cette section demande encore un peu de pratique, et vous entendrez la différence.',s_low:'Continuons à pratiquer ensemble. Chaque essai compte !',s_none:'Essayez d’abord quelques phrases, puis revenez voir votre score.',s_mastered:'{n} phrases sur {m} à 80 % ou plus',s_tried:'vous en avez essayé {n} sur {m}',s_again:'Pratiquez encore celles-ci',s_notTried:'pas essayée',s_restart:'↺ Recommencer',s_nextTopic:'Thème suivant →'},
 it:{s_see:'🏁 Vedi i miei risultati',s_title:'Sezione completata',s_top:'Fantastico! Harley è al settimo cielo.',s_good:'Ottimo lavoro! Ancora un po’ di pratica e sarà perfetto.',s_mid:'Bel tentativo. Questa sezione ha bisogno di un po’ più di pratica e sentirai la differenza.',s_low:'Continuiamo a esercitarci insieme. Ogni tentativo aiuta!',s_none:'Prova prima qualche frase, poi torna a vedere il tuo punteggio.',s_mastered:'{n} frasi su {m} all’80% o più',s_tried:'ne hai provate {n} su {m}',s_again:'Esercitati ancora su queste',s_notTried:'non provata',s_restart:'↺ Ricomincia',s_nextTopic:'Argomento successivo →'},
 de:{s_see:'🏁 Meine Ergebnisse',s_title:'Abschnitt geschafft',s_top:'Klasse! Harley ist überglücklich.',s_good:'Sehr gut! Noch ein bisschen Übung, dann sitzt es.',s_mid:'Gute Arbeit. Dieser Abschnitt braucht noch etwas Übung, dann hörst du den Unterschied.',s_low:'Lass uns zusammen weiterüben. Jeder Versuch hilft!',s_none:'Probiere zuerst ein paar Sätze, dann komm zurück für deine Punktzahl.',s_mastered:'{n} von {m} Sätzen mit 80 % oder mehr',s_tried:'{n} von {m} ausprobiert',s_again:'Diese nochmal üben',s_notTried:'nicht probiert',s_restart:'↺ Von vorn',s_nextTopic:'Nächstes Thema →'},
 pt:{s_see:'🏁 Ver os meus resultados',s_title:'Secção concluída',s_top:'Fantástico! O Harley está radiante.',s_good:'Muito bem! Com mais um pouco de prática vai dominar.',s_mid:'Bom esforço. Esta secção precisa de um pouco mais de prática e vai notar a diferença.',s_low:'Vamos continuar a praticar juntos. Cada tentativa ajuda!',s_none:'Experimente primeiro algumas frases e depois volte para ver a sua pontuação.',s_mastered:'{n} de {m} frases com 80% ou mais',s_tried:'experimentou {n} de {m}',s_again:'Pratique estas outra vez',s_notTried:'não experimentada',s_restart:'↺ Recomeçar',s_nextTopic:'Próximo tema →'}
};
for (const k in S) Object.assign(window.SIR_UI[k], S[k]);
})();

// Precise (Azure) scoring on the main "Tap and say it" button
(function(){
const S={
 en:{say_used:"You've used today's precise checks. Tap again for a quick check, or get unlimited precise checks with Premium.",say_tapAgain:'Tap again to try.',say_left:'{n} precise checks left today',say_tipClose:'Every word was clear. Look at the sounds below to polish it further.',say_miss1:'1 word needs work (in red). Tap it to hear it, then try again.',say_missN:'{n} words need work (in red). Tap a red word to hear it, then try again.'},
 es:{say_used:'Ya has usado las comprobaciones precisas de hoy. Toca otra vez para una comprobación rápida, o consigue comprobaciones precisas ilimitadas con Premium.',say_tapAgain:'Toca otra vez para intentarlo.',say_left:'Te quedan {n} comprobaciones precisas hoy',say_tipClose:'Todas las palabras se entendieron bien. Mira los sonidos de abajo para pulirlo más.',say_miss1:'1 palabra necesita práctica (en rojo). Tócala para oírla y vuelve a intentarlo.',say_missN:'{n} palabras necesitan práctica (en rojo). Toca una palabra roja para oírla y vuelve a intentarlo.'},
 fr:{say_used:'Vous avez utilisé vos vérifications précises du jour. Touchez à nouveau pour une vérification rapide, ou passez à Premium pour des vérifications précises illimitées.',say_tapAgain:'Touchez à nouveau pour réessayer.',say_left:'Encore {n} vérifications précises aujourd’hui',say_tipClose:'Tous les mots étaient clairs. Regardez les sons ci-dessous pour peaufiner.',say_miss1:'1 mot est à travailler (en rouge). Touchez-le pour l’écouter, puis réessayez.',say_missN:'{n} mots sont à travailler (en rouge). Touchez un mot rouge pour l’écouter, puis réessayez.'},
 it:{say_used:'Hai usato le verifiche precise di oggi. Tocca di nuovo per una verifica rapida, oppure passa a Premium per verifiche precise illimitate.',say_tapAgain:'Tocca di nuovo per riprovare.',say_left:'Ancora {n} verifiche precise oggi',say_tipClose:'Tutte le parole erano chiare. Guarda i suoni qui sotto per perfezionarla.',say_miss1:'1 parola va migliorata (in rosso). Toccala per ascoltarla, poi riprova.',say_missN:'{n} parole vanno migliorate (in rosso). Tocca una parola rossa per ascoltarla, poi riprova.'},
 de:{say_used:'Du hast die genauen Prüfungen für heute verbraucht. Tippe erneut für eine schnelle Prüfung, oder hol dir mit Premium unbegrenzte genaue Prüfungen.',say_tapAgain:'Tippe erneut, um es zu versuchen.',say_left:'Noch {n} genaue Prüfungen heute',say_tipClose:'Alle Wörter waren klar. Sieh dir unten die Laute an, um noch feiner zu werden.',say_miss1:'1 Wort braucht Übung (rot). Tippe darauf, um es zu hören, und versuch es noch einmal.',say_missN:'{n} Wörter brauchen Übung (rot). Tippe auf ein rotes Wort, um es zu hören, und versuch es noch einmal.'},
 pt:{say_used:'Já usou as verificações precisas de hoje. Toque de novo para uma verificação rápida, ou tenha verificações precisas ilimitadas com o Premium.',say_tapAgain:'Toque de novo para tentar.',say_left:'Restam {n} verificações precisas hoje',say_tipClose:'Todas as palavras ficaram claras. Veja os sons abaixo para aperfeiçoar.',say_miss1:'1 palavra precisa de prática (a vermelho). Toque nela para a ouvir e tente outra vez.',say_missN:'{n} palavras precisam de prática (a vermelho). Toque numa palavra vermelha para a ouvir e tente outra vez.'}
};
for (const k in S) Object.assign(window.SIR_UI[k], S[k]);
})();

// Launch: privacy footer, feedback form, install banner
(function(){
const S={
 en:{footer:"To score your pronunciation, your recording is sent securely to Microsoft Azure; Assess me texts and translations go to Anthropic (Claude). The quick check uses your browser's speech service. Harley Says doesn't keep your recordings, and your scores stay on this device. If you join the waitlist or send feedback, we keep your email only to reply or tell you about Premium.",fbLink:'💬 Send feedback',fbTitle:'Tell us what you think',fbMsgL:"What worked, what didn't, what you'd like to see?",fbEmailL:"Your email (optional, if you'd like a reply)",fbCancel:'Cancel',fbSend:'Send',fbThanks:'Thank you! Harley has passed it on.',fbClose:'Close',fbErr:"Sorry, that didn't send. Please try again.",inst_title:'Add Harley Says to your home screen',inst_sub:'Open it like an app, in one tap.',inst_ios:'On iPhone: tap Share ⬆️, then “Add to Home Screen”.',inst_btn:'Install',inst_close:'Not now'},
 es:{footer:'Para puntuar tu pronunciación, tu grabación se envía de forma segura a Microsoft Azure; los textos de Evalúame y las traducciones van a Anthropic (Claude). La comprobación rápida usa el servicio de voz de tu navegador. Harley Says no guarda tus grabaciones y tus puntuaciones se quedan en este dispositivo. Si te apuntas a la lista o envías comentarios, guardamos tu email solo para responderte o avisarte de Premium.',fbLink:'💬 Enviar comentarios',fbTitle:'Cuéntanos qué te parece',fbMsgL:'¿Qué ha funcionado, qué no y qué te gustaría ver?',fbEmailL:'Tu email (opcional, si quieres respuesta)',fbCancel:'Cancelar',fbSend:'Enviar',fbThanks:'¡Gracias! Harley ya lo ha pasado.',fbClose:'Cerrar',fbErr:'No se ha podido enviar. Inténtalo de nuevo.',inst_title:'Añade Harley Says a tu pantalla de inicio',inst_sub:'Ábrelo como una app, con un toque.',inst_ios:'En iPhone: toca Compartir ⬆️ y luego «Añadir a pantalla de inicio».',inst_btn:'Instalar',inst_close:'Ahora no'},
 fr:{footer:"Pour noter votre prononciation, votre enregistrement est envoyé de façon sécurisée à Microsoft Azure ; les textes d'Évaluez-moi et les traductions vont à Anthropic (Claude). La vérification rapide utilise le service vocal de votre navigateur. Harley Says ne conserve pas vos enregistrements et vos scores restent sur cet appareil. Si vous rejoignez la liste ou envoyez un avis, nous gardons votre email uniquement pour vous répondre ou vous informer de Premium.",fbLink:'💬 Donner mon avis',fbTitle:"Dites-nous ce que vous en pensez",fbMsgL:"Ce qui a marché, ce qui n'a pas marché, ce que vous aimeriez voir ?",fbEmailL:'Votre email (facultatif, pour une réponse)',fbCancel:'Annuler',fbSend:'Envoyer',fbThanks:'Merci ! Harley a transmis le message.',fbClose:'Fermer',fbErr:"Désolé, l'envoi a échoué. Réessayez.",inst_title:"Ajoutez Harley Says à votre écran d'accueil",inst_sub:"Ouvrez-le comme une app, d'un seul geste.",inst_ios:"Sur iPhone : touchez Partager ⬆️, puis « Sur l'écran d'accueil ».",inst_btn:'Installer',inst_close:'Plus tard'},
 it:{footer:"Per valutare la tua pronuncia, la registrazione viene inviata in modo sicuro a Microsoft Azure; i testi di Valutami e le traduzioni vanno ad Anthropic (Claude). La verifica rapida usa il servizio vocale del browser. Harley Says non conserva le tue registrazioni e i tuoi punteggi restano su questo dispositivo. Se ti iscrivi alla lista o invii un commento, conserviamo la tua email solo per risponderti o avvisarti di Premium.",fbLink:'💬 Invia un commento',fbTitle:'Dicci cosa ne pensi',fbMsgL:'Cosa ha funzionato, cosa no, cosa vorresti vedere?',fbEmailL:'La tua email (facoltativa, se vuoi una risposta)',fbCancel:'Annulla',fbSend:'Invia',fbThanks:"Grazie! Harley l'ha già passato.",fbClose:'Chiudi',fbErr:'Invio non riuscito. Riprova.',inst_title:'Aggiungi Harley Says alla schermata Home',inst_sub:"Aprilo come un'app, con un tocco.",inst_ios:'Su iPhone: tocca Condividi ⬆️, poi «Aggiungi alla schermata Home».',inst_btn:'Installa',inst_close:'Non ora'},
 de:{footer:'Zur Bewertung deiner Aussprache wird deine Aufnahme sicher an Microsoft Azure gesendet; Texte aus „Teste mich“ und Übersetzungen gehen an Anthropic (Claude). Die Schnellprüfung nutzt den Sprachdienst deines Browsers. Harley Says speichert deine Aufnahmen nicht, und deine Ergebnisse bleiben auf diesem Gerät. Wenn du dich für die Warteliste einträgst oder Feedback sendest, nutzen wir deine E-Mail nur für eine Antwort oder Infos zu Premium.',fbLink:'💬 Feedback senden',fbTitle:'Sag uns deine Meinung',fbMsgL:'Was hat geklappt, was nicht, was wünschst du dir?',fbEmailL:'Deine E-Mail (optional, falls du eine Antwort möchtest)',fbCancel:'Abbrechen',fbSend:'Senden',fbThanks:'Danke! Harley hat es weitergegeben.',fbClose:'Schließen',fbErr:'Senden fehlgeschlagen. Bitte versuch es noch einmal.',inst_title:'Harley Says zum Startbildschirm hinzufügen',inst_sub:'Öffne es wie eine App, mit einem Tipp.',inst_ios:'Auf dem iPhone: Tippe auf Teilen ⬆️, dann „Zum Home-Bildschirm“.',inst_btn:'Installieren',inst_close:'Nicht jetzt'},
 pt:{footer:'Para avaliar a sua pronúncia, a gravação é enviada em segurança para a Microsoft Azure; os textos do Avalie-me e as traduções vão para a Anthropic (Claude). A verificação rápida usa o serviço de voz do seu navegador. O Harley Says não guarda as suas gravações e as suas pontuações ficam neste dispositivo. Se entrar na lista ou enviar comentários, guardamos o seu email apenas para responder ou avisar sobre o Premium.',fbLink:'💬 Enviar comentários',fbTitle:'Diga-nos o que acha',fbMsgL:'O que funcionou, o que não funcionou, o que gostaria de ver?',fbEmailL:'O seu email (opcional, se quiser resposta)',fbCancel:'Cancelar',fbSend:'Enviar',fbThanks:'Obrigado! O Harley já passou a mensagem.',fbClose:'Fechar',fbErr:'Não foi possível enviar. Tente outra vez.',inst_title:'Adicione o Harley Says ao ecrã principal',inst_sub:'Abra-o como uma app, com um toque.',inst_ios:'No iPhone: toque em Partilhar ⬆️ e depois em «Adicionar ao ecrã principal».',inst_btn:'Instalar',inst_close:'Agora não'}
};
for (const k in S) Object.assign(window.SIR_UI[k], S[k]);
})();

// "Harley explains" coach
(function(){
const S={
 en:{c_btn:'🐶 Harley explains',c_free:'{n} free today',c_left:'{n} left today',c_wait:'Harley is thinking… 🐾',c_replay:'🔊 Hear it again',c_used:"You've used today's free tips from Harley. Unlimited coaching is coming with Premium.",c_off:'Harley’s coaching is not switched on yet.',c_fail:"Harley couldn't answer just now. Please try again."},
 es:{c_btn:'🐶 Harley te lo explica',c_free:'{n} gratis hoy',c_left:'quedan {n} hoy',c_wait:'Harley está pensando… 🐾',c_replay:'🔊 Escuchar otra vez',c_used:'Ya has usado los consejos gratis de Harley de hoy. Las explicaciones ilimitadas llegarán con Premium.',c_off:'Los consejos de Harley aún no están activados.',c_fail:'Harley no ha podido responder ahora. Inténtalo de nuevo.'},
 fr:{c_btn:'🐶 Harley vous explique',c_free:"{n} gratuits aujourd'hui",c_left:"encore {n} aujourd'hui",c_wait:'Harley réfléchit… 🐾',c_replay:'🔊 Réécouter',c_used:"Vous avez utilisé les conseils gratuits de Harley pour aujourd'hui. Le coaching illimité arrive avec Premium.",c_off:"Le coaching de Harley n'est pas encore activé.",c_fail:"Harley n'a pas pu répondre. Réessayez."},
 it:{c_btn:'🐶 Harley ti spiega',c_free:'{n} gratis oggi',c_left:'ancora {n} oggi',c_wait:'Harley sta pensando… 🐾',c_replay:'🔊 Riascolta',c_used:'Hai usato i consigli gratuiti di Harley di oggi. Il coaching illimitato arriva con Premium.',c_off:'Il coaching di Harley non è ancora attivo.',c_fail:'Harley non è riuscito a rispondere. Riprova.'},
 de:{c_btn:'🐶 Harley erklärt',c_free:'heute {n} gratis',c_left:'heute noch {n}',c_wait:'Harley denkt nach… 🐾',c_replay:'🔊 Nochmal hören',c_used:'Du hast Harleys kostenlose Tipps für heute verbraucht. Unbegrenztes Coaching kommt mit Premium.',c_off:'Harleys Coaching ist noch nicht eingeschaltet.',c_fail:'Harley konnte gerade nicht antworten. Bitte versuch es noch einmal.'},
 pt:{c_btn:'🐶 O Harley explica',c_free:'{n} grátis hoje',c_left:'restam {n} hoje',c_wait:'O Harley está a pensar… 🐾',c_replay:'🔊 Ouvir outra vez',c_used:'Já usou as dicas grátis do Harley de hoje. O coaching ilimitado chega com o Premium.',c_off:'O coaching do Harley ainda não está ativo.',c_fail:'O Harley não conseguiu responder agora. Tente outra vez.'}
};
for (const k in S) Object.assign(window.SIR_UI[k], S[k]);
})();

// Collapsible sound-by-sound details
(function(){
const S={en:{p_show:'🔬 Each sound',p_hide:'Hide details ▴'},es:{p_show:'🔬 Cada sonido',p_hide:'Ocultar detalles ▴'},fr:{p_show:'🔬 Chaque son',p_hide:'Masquer les détails ▴'},it:{p_show:'🔬 Ogni suono',p_hide:'Nascondi dettagli ▴'},de:{p_show:'🔬 Jeder Laut',p_hide:'Details ausblenden ▴'},pt:{p_show:'🔬 Cada som',p_hide:'Ocultar detalhes ▴'}};
for (const k in S) Object.assign(window.SIR_UI[k], S[k]);
})();

// Section buttons (two-level menu)
(function(){
const S={
 en:{g_phrases:'Phrases',g_mine:'My phrase',g_focus:'Focus packs',g_assess:'Assess me',g_premium:'Premium'},
 es:{g_phrases:'Frases',g_mine:'Mi frase',g_focus:'Packs',g_assess:'Evalúame',g_premium:'Premium'},
 fr:{g_phrases:'Phrases',g_mine:'Ma phrase',g_focus:'Packs',g_assess:'Évaluez-moi',g_premium:'Premium'},
 it:{g_phrases:'Frasi',g_mine:'La mia frase',g_focus:'Pacchetti',g_assess:'Valutami',g_premium:'Premium'},
 de:{g_phrases:'Sätze',g_mine:'Mein Satz',g_focus:'Pakete',g_assess:'Teste mich',g_premium:'Premium'},
 pt:{g_phrases:'Frases',g_mine:'A minha frase',g_focus:'Pacotes',g_assess:'Avalie-me',g_premium:'Premium'}
};
for (const k in S) Object.assign(window.SIR_UI[k], S[k]);
})();

// Quick check label
(function(){
const S={en:{q_label:'Quick check (less strict):'},es:{q_label:'Comprobación rápida (menos estricta):'},fr:{q_label:'Vérification rapide (moins stricte) :'},it:{q_label:'Verifica rapida (meno severa):'},de:{q_label:'Schnellprüfung (weniger streng):'},pt:{q_label:'Verificação rápida (menos rigorosa):'}};
for (const k in S) Object.assign(window.SIR_UI[k], S[k]);
})();

// Lilou, Harley's little cousin (coach option)
(function(){
const S={
 en:{c_btn_lilou:'🎀 Lilou explains',c_wait_lilou:'Lilou is thinking… 🎀',c_used_lilou:"You've used today's free tips. Unlimited coaching from Lilou and Harley is coming with Premium.",c_switch:'Switch coach to {name}'},
 es:{c_btn_lilou:'🎀 Lilou te lo explica',c_wait_lilou:'Lilou está pensando… 🎀',c_used_lilou:'Ya has usado los consejos gratis de hoy. Las explicaciones ilimitadas de Lilou y Harley llegarán con Premium.',c_switch:'Cambiar a {name}'},
 fr:{c_btn_lilou:'🎀 Lilou vous explique',c_wait_lilou:'Lilou réfléchit… 🎀',c_used_lilou:"Vous avez utilisé les conseils gratuits du jour. Le coaching illimité de Lilou et Harley arrive avec Premium.",c_switch:'Passer à {name}'},
 it:{c_btn_lilou:'🎀 Lilou ti spiega',c_wait_lilou:'Lilou sta pensando… 🎀',c_used_lilou:'Hai usato i consigli gratuiti di oggi. Il coaching illimitato di Lilou e Harley arriva con Premium.',c_switch:'Passa a {name}'},
 de:{c_btn_lilou:'🎀 Lilou erklärt',c_wait_lilou:'Lilou denkt nach… 🎀',c_used_lilou:'Du hast die kostenlosen Tipps für heute verbraucht. Unbegrenztes Coaching von Lilou und Harley kommt mit Premium.',c_switch:'Zu {name} wechseln'},
 pt:{c_btn_lilou:'🎀 A Lilou explica',c_wait_lilou:'A Lilou está a pensar… 🎀',c_used_lilou:'Já usou as dicas grátis de hoje. O coaching ilimitado da Lilou e do Harley chega com o Premium.',c_switch:'Mudar para {name}'}
};
for (const k in S) Object.assign(window.SIR_UI[k], S[k]);
})();

// Story: Lilou
(function(){
const S={
 en:{cap3:'Harley and his little cousin Lilou',story4:"Harley's little cousin Lilou helps out too. Pick her as your coach and she'll explain your mistakes in her own voice."},
 es:{cap3:'Harley y su primita Lilou',story4:'Lilou, la primita de Harley, también ayuda. Elígela como tu coach y te explicará tus errores con su propia voz.'},
 fr:{cap3:'Harley et sa petite cousine Lilou',story4:'Lilou, la petite cousine de Harley, donne aussi un coup de patte. Choisissez-la comme coach et elle vous expliquera vos erreurs avec sa propre voix.'},
 it:{cap3:'Harley e la sua cuginetta Lilou',story4:'Anche Lilou, la cuginetta di Harley, dà una zampa. Sceglila come coach e ti spiegherà i tuoi errori con la sua voce.'},
 de:{cap3:'Harley und seine kleine Cousine Lilou',story4:'Harleys kleine Cousine Lilou hilft auch mit. Wähle sie als Coach, und sie erklärt dir deine Fehler mit ihrer eigenen Stimme.'},
 pt:{cap3:'O Harley e a priminha Lilou',story4:'A Lilou, priminha do Harley, também ajuda. Escolha-a como coach e ela explica os seus erros com a sua própria voz.'}
};
for (const k in S) Object.assign(window.SIR_UI[k], S[k]);
})();

// Names of the extra languages (for the "I'm writing in" list) in the original six interface languages
(function(){
const N={
 en:{pl:'Polish',ro:'Romanian',uk:'Ukrainian',zh:'Chinese',ar:'Arabic',nl:'Dutch',tr:'Turkish',ja:'Japanese',ko:'Korean',vi:'Vietnamese'},
 es:{pl:'Polaco',ro:'Rumano',uk:'Ucraniano',zh:'Chino',ar:'Árabe',nl:'Neerlandés',tr:'Turco',ja:'Japonés',ko:'Coreano',vi:'Vietnamita'},
 fr:{pl:'Polonais',ro:'Roumain',uk:'Ukrainien',zh:'Chinois',ar:'Arabe',nl:'Néerlandais',tr:'Turc',ja:'Japonais',ko:'Coréen',vi:'Vietnamien'},
 it:{pl:'Polacco',ro:'Rumeno',uk:'Ucraino',zh:'Cinese',ar:'Arabo',nl:'Olandese',tr:'Turco',ja:'Giapponese',ko:'Coreano',vi:'Vietnamita'},
 de:{pl:'Polnisch',ro:'Rumänisch',uk:'Ukrainisch',zh:'Chinesisch',ar:'Arabisch',nl:'Niederländisch',tr:'Türkisch',ja:'Japanisch',ko:'Koreanisch',vi:'Vietnamesisch'},
 pt:{pl:'Polaco',ro:'Romeno',uk:'Ucraniano',zh:'Chinês',ar:'Árabe',nl:'Neerlandês',tr:'Turco',ja:'Japonês',ko:'Coreano',vi:'Vietnamita'}
};
for (const k in N) Object.assign(window.SIR_LANG_NAMES[k], N[k]);
})();

// Footer: privacy and terms links, adults-only line
(function(){
const S={
 en:{lg_priv:"Privacy",lg_terms:"Terms",lg_adult:"For adults aged 18 and over."},
 es:{lg_priv:"Privacidad",lg_terms:"Condiciones",lg_adult:"Para adultos a partir de 18 años."},
 fr:{lg_priv:"Confidentialité",lg_terms:"Conditions",lg_adult:"Pour les adultes de 18 ans et plus."},
 it:{lg_priv:"Privacy",lg_terms:"Termini",lg_adult:"Per adulti dai 18 anni in su."},
 de:{lg_priv:"Datenschutz",lg_terms:"Nutzungsbedingungen",lg_adult:"Für Erwachsene ab 18 Jahren."},
 pt:{lg_priv:"Privacidade",lg_terms:"Termos",lg_adult:"Para adultos com 18 anos ou mais."}
};
for (const k in S) Object.assign(window.SIR_UI[k], S[k]);
})();

// Optional sign-in (account.js)
(function(){
const S={
 en:{acc_signin:"Sign in",acc_title:"Save your progress",acc_intro:"Sign in with your email to keep your scores on all your devices. No password needed. It's optional and free.",acc_emailL:"Your email",acc_send:"Send code",acc_sent:"We've emailed a code to {e}. Enter it below, or tap the link in the email on this device.",acc_codeL:"Code from the email",acc_back:"Change email",acc_verify:"Sign in",acc_badcode:"That code didn't work. Check it and try again.",acc_bademail:"Please enter a valid email address.",acc_err:"Something went wrong. Please try again.",acc_wait:"Too many tries. Please wait a minute and try again.",acc_in:"Signed in as {e}",acc_synced:"Your progress is saved to your account and follows you to any device.",acc_out:"Sign out",acc_del:"Delete my account",acc_delq:"Delete your account and the progress saved to it? This can't be undone. Scores on this device stay here.",acc_delyes:"Delete",acc_deleted:"Your account has been deleted."},
 es:{acc_signin:"Entrar",acc_title:"Guarda tu progreso",acc_intro:"Entra con tu email para tener tus puntuaciones en todos tus dispositivos. Sin contraseña. Es opcional y gratis.",acc_emailL:"Tu email",acc_send:"Enviar código",acc_sent:"Hemos enviado un código a {e}. Escríbelo abajo o toca el enlace del email en este dispositivo.",acc_codeL:"Código del email",acc_back:"Cambiar email",acc_verify:"Entrar",acc_badcode:"Ese código no ha funcionado. Revísalo e inténtalo de nuevo.",acc_bademail:"Escribe un email válido.",acc_err:"Algo ha fallado. Inténtalo de nuevo.",acc_wait:"Demasiados intentos. Espera un minuto e inténtalo de nuevo.",acc_in:"Has entrado como {e}",acc_synced:"Tu progreso se guarda en tu cuenta y te sigue a cualquier dispositivo.",acc_out:"Salir",acc_del:"Eliminar mi cuenta",acc_delq:"¿Eliminar tu cuenta y el progreso guardado en ella? No se puede deshacer. Las puntuaciones de este dispositivo se quedan aquí.",acc_delyes:"Eliminar",acc_deleted:"Tu cuenta se ha eliminado."},
 fr:{acc_signin:"Se connecter",acc_title:"Sauvegardez vos progrès",acc_intro:"Connectez-vous avec votre e-mail pour retrouver vos scores sur tous vos appareils. Sans mot de passe. C'est facultatif et gratuit.",acc_emailL:"Votre e-mail",acc_send:"Envoyer le code",acc_sent:"Nous avons envoyé un code à {e}. Saisissez-le ci-dessous ou touchez le lien de l'e-mail sur cet appareil.",acc_codeL:"Code reçu par e-mail",acc_back:"Changer d'e-mail",acc_verify:"Se connecter",acc_badcode:"Ce code n'a pas fonctionné. Vérifiez-le et réessayez.",acc_bademail:"Saisissez une adresse e-mail valide.",acc_err:"Un problème est survenu. Veuillez réessayer.",acc_wait:"Trop d'essais. Attendez une minute et réessayez.",acc_in:"Connecté en tant que {e}",acc_synced:"Vos progrès sont enregistrés sur votre compte et vous suivent sur tous vos appareils.",acc_out:"Se déconnecter",acc_del:"Supprimer mon compte",acc_delq:"Supprimer votre compte et les progrès enregistrés ? C'est définitif. Les scores de cet appareil restent ici.",acc_delyes:"Supprimer",acc_deleted:"Votre compte a été supprimé."},
 it:{acc_signin:"Accedi",acc_title:"Salva i tuoi progressi",acc_intro:"Accedi con la tua email per avere i tuoi punteggi su tutti i dispositivi. Nessuna password. È facoltativo e gratuito.",acc_emailL:"La tua email",acc_send:"Invia codice",acc_sent:"Abbiamo inviato un codice a {e}. Inseriscilo qui sotto o tocca il link nell'email su questo dispositivo.",acc_codeL:"Codice dell'email",acc_back:"Cambia email",acc_verify:"Accedi",acc_badcode:"Il codice non ha funzionato. Controllalo e riprova.",acc_bademail:"Inserisci un indirizzo email valido.",acc_err:"Qualcosa è andato storto. Riprova.",acc_wait:"Troppi tentativi. Aspetta un minuto e riprova.",acc_in:"Accesso come {e}",acc_synced:"I tuoi progressi sono salvati nel tuo account e ti seguono su ogni dispositivo.",acc_out:"Esci",acc_del:"Elimina il mio account",acc_delq:"Eliminare il tuo account e i progressi salvati? Non si può annullare. I punteggi su questo dispositivo restano qui.",acc_delyes:"Elimina",acc_deleted:"Il tuo account è stato eliminato."},
 de:{acc_signin:"Anmelden",acc_title:"Fortschritt speichern",acc_intro:"Melde dich mit deiner E-Mail an, um deine Ergebnisse auf allen Geräten zu haben. Ohne Passwort. Freiwillig und kostenlos.",acc_emailL:"Deine E-Mail",acc_send:"Code senden",acc_sent:"Wir haben einen Code an {e} geschickt. Gib ihn unten ein oder tippe auf diesem Gerät auf den Link in der E-Mail.",acc_codeL:"Code aus der E-Mail",acc_back:"E-Mail ändern",acc_verify:"Anmelden",acc_badcode:"Der Code hat nicht funktioniert. Prüfe ihn und versuche es noch einmal.",acc_bademail:"Bitte gib eine gültige E-Mail-Adresse ein.",acc_err:"Etwas ist schiefgelaufen. Bitte versuche es noch einmal.",acc_wait:"Zu viele Versuche. Warte eine Minute und versuche es dann erneut.",acc_in:"Angemeldet als {e}",acc_synced:"Dein Fortschritt ist in deinem Konto gespeichert und begleitet dich auf jedes Gerät.",acc_out:"Abmelden",acc_del:"Mein Konto löschen",acc_delq:"Dein Konto und den darin gespeicherten Fortschritt löschen? Das lässt sich nicht rückgängig machen. Die Ergebnisse auf diesem Gerät bleiben erhalten.",acc_delyes:"Löschen",acc_deleted:"Dein Konto wurde gelöscht."},
 pt:{acc_signin:"Entrar",acc_title:"Guarde o seu progresso",acc_intro:"Entre com o seu email para ter as suas pontuações em todos os dispositivos. Sem palavra-passe. É opcional e gratuito.",acc_emailL:"O seu email",acc_send:"Enviar código",acc_sent:"Enviámos um código para {e}. Escreva-o abaixo ou toque no link do email neste dispositivo.",acc_codeL:"Código do email",acc_back:"Mudar email",acc_verify:"Entrar",acc_badcode:"Esse código não funcionou. Verifique-o e tente outra vez.",acc_bademail:"Escreva um email válido.",acc_err:"Algo correu mal. Tente outra vez.",acc_wait:"Demasiadas tentativas. Aguarde um minuto e tente outra vez.",acc_in:"Sessão iniciada como {e}",acc_synced:"O seu progresso fica guardado na sua conta e acompanha-o em qualquer dispositivo.",acc_out:"Sair",acc_del:"Eliminar a minha conta",acc_delq:"Eliminar a sua conta e o progresso guardado? Não é possível anular. As pontuações neste dispositivo ficam aqui.",acc_delyes:"Eliminar",acc_deleted:"A sua conta foi eliminada."}
};
for (const k in S) Object.assign(window.SIR_UI[k], S[k]);
})();

// Meanings for the extra English phrases (Basics, Café & restaurant, Travel)
(function(){
const X={"es": {"See you tomorrow": "Hasta mañana", "How's it going?": "¿Qué tal te va?", "I'm fine, thanks. And you?": "Bien, gracias. ¿Y tú?", "Pleased to meet you too": "Encantado de conocerte también", "Sorry I'm late": "Perdón por llegar tarde", "No problem at all": "No pasa nada", "Could you write it down, please?": "¿Me lo puede escribir, por favor?", "How do you spell that?": "¿Cómo se escribe?", "I live with my family": "Vivo con mi familia", "I work in an office": "Trabajo en una oficina", "I'm here on holiday": "Estoy aquí de vacaciones", "I'm here on vacation": "Estoy aquí de vacaciones", "What do you do for a living?": "¿A qué te dedicas?", "Can I ask you a question?": "¿Le puedo hacer una pregunta?", "I don't know": "No lo sé", "That's a good idea": "Es una buena idea", "I'm not sure": "No estoy seguro", "Just a moment, please": "Un momento, por favor", "What time is it?": "¿Qué hora es?", "Happy birthday!": "¡Feliz cumpleaños!", "Take care": "Cuídate", "Is this table free?": "¿Está libre esta mesa?", "Is this table taken?": "¿Está libre esta mesa?", "Could we sit outside?": "¿Podemos sentarnos fuera?", "We're ready to order": "Ya podemos pedir", "I'd like the soup of the day": "Quisiera la sopa del día", "What's in this dish?": "¿Qué lleva este plato?", "Is it very spicy?": "¿Pica mucho?", "Could I have it without onions?": "¿Me lo puede poner sin cebolla?", "Can I get it without onions?": "¿Me lo puede poner sin cebolla?", "I'm allergic to peanuts": "Soy alérgico a los cacahuetes", "Could I have a black coffee?": "¿Me pone un café solo?", "Could I get a black coffee?": "¿Me pone un café solo?", "A cappuccino with oat milk, please": "Un capuchino con leche de avena, por favor", "Sparkling water, please": "Agua con gas, por favor", "Could we have the dessert menu?": "¿Nos trae la carta de postres?", "Could we see the dessert menu?": "¿Nos trae la carta de postres?", "Could we split the bill?": "¿Podemos pagar por separado?", "Could we split the check?": "¿Podemos pagar por separado?", "Keep the change": "Quédese con el cambio", "Excuse me, this is cold": "Perdone, esto está frío", "Could I have a clean fork, please?": "¿Me trae un tenedor limpio, por favor?", "Could I get a clean fork, please?": "¿Me trae un tenedor limpio, por favor?", "Where are the toilets?": "¿Dónde están los servicios?", "Where's the restroom?": "¿Dónde están los servicios?", "Everything was lovely, thank you": "Todo estaba buenísimo, gracias", "Everything was great, thank you": "Todo estaba buenísimo, gracias", "We'd like to book a table for Saturday": "Queríamos reservar una mesa para el sábado", "We'd like to make a reservation for Saturday": "Queríamos reservar una mesa para el sábado", "Do you have a children's menu?": "¿Tienen menú infantil?", "Do you have a kids' menu?": "¿Tienen menú infantil?", "A single ticket, please": "Un billete de ida, por favor", "A one-way ticket, please": "Un billete de ida, por favor", "Does this train go to the airport?": "¿Este tren va al aeropuerto?", "Is this seat taken?": "¿Está ocupado este asiento?", "The train is delayed": "El tren lleva retraso", "I've missed my connection": "He perdido el enlace", "I missed my connection": "He perdido el enlace", "Where can I leave my luggage?": "¿Dónde puedo dejar el equipaje?", "Where can I store my bags?": "¿Dónde puedo dejar el equipaje?", "My suitcase hasn't arrived": "Mi maleta no ha llegado", "My suitcase didn't arrive": "Mi maleta no ha llegado", "Where is passport control?": "¿Dónde está el control de pasaportes?", "Where is immigration?": "¿Dónde está el control de pasaportes?", "I'm here for two weeks": "Estoy aquí dos semanas", "Can I have a window seat?": "¿Me da un asiento de ventanilla?", "Can I get a window seat?": "¿Me da un asiento de ventanilla?", "How long does it take to get there?": "¿Cuánto se tarda en llegar?", "Could you show me on the map?": "¿Me lo puede enseñar en el mapa?", "It's on the left, next to the bank": "Está a la izquierda, al lado del banco", "Can I walk there?": "¿Se puede ir andando?", "Could you call me a taxi?": "¿Me puede pedir un taxi?", "Could you call me a cab?": "¿Me puede pedir un taxi?", "Please stop here": "Pare aquí, por favor", "You can drop me off here": "Pare aquí, por favor", "Is breakfast included?": "¿El desayuno está incluido?", "The air conditioning isn't working": "El aire acondicionado no funciona", "Could I have the Wi-Fi password?": "¿Cuál es la contraseña del wifi?", "What's the Wi-Fi password?": "¿Cuál es la contraseña del wifi?", "I'd like to hire a car": "Quería alquilar un coche", "I'd like to rent a car": "Quería alquilar un coche"}, "fr": {"See you tomorrow": "À demain", "How's it going?": "Comment ça va ?", "I'm fine, thanks. And you?": "Bien, merci. Et toi ?", "Pleased to meet you too": "Enchanté également", "Sorry I'm late": "Désolé d'être en retard", "No problem at all": "Pas de problème", "Could you write it down, please?": "Vous pouvez me l'écrire, s'il vous plaît ?", "How do you spell that?": "Ça s'écrit comment ?", "I live with my family": "J'habite avec ma famille", "I work in an office": "Je travaille dans un bureau", "I'm here on holiday": "Je suis ici en vacances", "I'm here on vacation": "Je suis ici en vacances", "What do you do for a living?": "Qu'est-ce que tu fais dans la vie ?", "Can I ask you a question?": "Je peux vous poser une question ?", "I don't know": "Je ne sais pas", "That's a good idea": "C'est une bonne idée", "I'm not sure": "Je ne suis pas sûr", "Just a moment, please": "Un instant, s'il vous plaît", "What time is it?": "Quelle heure est-il ?", "Happy birthday!": "Joyeux anniversaire !", "Take care": "Prends soin de toi", "Is this table free?": "Cette table est libre ?", "Is this table taken?": "Cette table est libre ?", "Could we sit outside?": "On peut s'asseoir dehors ?", "We're ready to order": "Nous sommes prêts à commander", "I'd like the soup of the day": "Je voudrais la soupe du jour", "What's in this dish?": "Qu'y a-t-il dans ce plat ?", "Is it very spicy?": "C'est très épicé ?", "Could I have it without onions?": "Je peux l'avoir sans oignons ?", "Can I get it without onions?": "Je peux l'avoir sans oignons ?", "I'm allergic to peanuts": "Je suis allergique aux cacahuètes", "Could I have a black coffee?": "Je pourrais avoir un café noir ?", "Could I get a black coffee?": "Je pourrais avoir un café noir ?", "A cappuccino with oat milk, please": "Un cappuccino au lait d'avoine, s'il vous plaît", "Sparkling water, please": "De l'eau gazeuse, s'il vous plaît", "Could we have the dessert menu?": "On peut avoir la carte des desserts ?", "Could we see the dessert menu?": "On peut avoir la carte des desserts ?", "Could we split the bill?": "On peut payer séparément ?", "Could we split the check?": "On peut payer séparément ?", "Keep the change": "Gardez la monnaie", "Excuse me, this is cold": "Excusez-moi, c'est froid", "Could I have a clean fork, please?": "Je pourrais avoir une fourchette propre ?", "Could I get a clean fork, please?": "Je pourrais avoir une fourchette propre ?", "Where are the toilets?": "Où sont les toilettes ?", "Where's the restroom?": "Où sont les toilettes ?", "Everything was lovely, thank you": "Tout était délicieux, merci", "Everything was great, thank you": "Tout était délicieux, merci", "We'd like to book a table for Saturday": "Nous voudrions réserver une table pour samedi", "We'd like to make a reservation for Saturday": "Nous voudrions réserver une table pour samedi", "Do you have a children's menu?": "Vous avez un menu enfant ?", "Do you have a kids' menu?": "Vous avez un menu enfant ?", "A single ticket, please": "Un aller simple, s'il vous plaît", "A one-way ticket, please": "Un aller simple, s'il vous plaît", "Does this train go to the airport?": "Ce train va à l'aéroport ?", "Is this seat taken?": "Cette place est prise ?", "The train is delayed": "Le train a du retard", "I've missed my connection": "J'ai raté ma correspondance", "I missed my connection": "J'ai raté ma correspondance", "Where can I leave my luggage?": "Où puis-je laisser mes bagages ?", "Where can I store my bags?": "Où puis-je laisser mes bagages ?", "My suitcase hasn't arrived": "Ma valise n'est pas arrivée", "My suitcase didn't arrive": "Ma valise n'est pas arrivée", "Where is passport control?": "Où est le contrôle des passeports ?", "Where is immigration?": "Où est le contrôle des passeports ?", "I'm here for two weeks": "Je suis ici pour deux semaines", "Can I have a window seat?": "Je peux avoir une place côté fenêtre ?", "Can I get a window seat?": "Je peux avoir une place côté fenêtre ?", "How long does it take to get there?": "Il faut combien de temps pour y aller ?", "Could you show me on the map?": "Vous pouvez me montrer sur la carte ?", "It's on the left, next to the bank": "C'est à gauche, à côté de la banque", "Can I walk there?": "On peut y aller à pied ?", "Could you call me a taxi?": "Vous pouvez m'appeler un taxi ?", "Could you call me a cab?": "Vous pouvez m'appeler un taxi ?", "Please stop here": "Arrêtez-vous ici, s'il vous plaît", "You can drop me off here": "Arrêtez-vous ici, s'il vous plaît", "Is breakfast included?": "Le petit-déjeuner est compris ?", "The air conditioning isn't working": "La climatisation ne marche pas", "Could I have the Wi-Fi password?": "Quel est le mot de passe du wifi ?", "What's the Wi-Fi password?": "Quel est le mot de passe du wifi ?", "I'd like to hire a car": "Je voudrais louer une voiture", "I'd like to rent a car": "Je voudrais louer une voiture"}, "it": {"See you tomorrow": "A domani", "How's it going?": "Come va?", "I'm fine, thanks. And you?": "Bene, grazie. E tu?", "Pleased to meet you too": "Piacere mio", "Sorry I'm late": "Scusa il ritardo", "No problem at all": "Nessun problema", "Could you write it down, please?": "Me lo può scrivere, per favore?", "How do you spell that?": "Come si scrive?", "I live with my family": "Vivo con la mia famiglia", "I work in an office": "Lavoro in un ufficio", "I'm here on holiday": "Sono qui in vacanza", "I'm here on vacation": "Sono qui in vacanza", "What do you do for a living?": "Che lavoro fai?", "Can I ask you a question?": "Posso farle una domanda?", "I don't know": "Non lo so", "That's a good idea": "È una buona idea", "I'm not sure": "Non sono sicuro", "Just a moment, please": "Un attimo, per favore", "What time is it?": "Che ore sono?", "Happy birthday!": "Buon compleanno!", "Take care": "Stammi bene", "Is this table free?": "Questo tavolo è libero?", "Is this table taken?": "Questo tavolo è libero?", "Could we sit outside?": "Possiamo sederci fuori?", "We're ready to order": "Siamo pronti per ordinare", "I'd like the soup of the day": "Vorrei la zuppa del giorno", "What's in this dish?": "Cosa c'è in questo piatto?", "Is it very spicy?": "È molto piccante?", "Could I have it without onions?": "Me lo può fare senza cipolla?", "Can I get it without onions?": "Me lo può fare senza cipolla?", "I'm allergic to peanuts": "Sono allergico alle arachidi", "Could I have a black coffee?": "Posso avere un caffè nero?", "Could I get a black coffee?": "Posso avere un caffè nero?", "A cappuccino with oat milk, please": "Un cappuccino con latte d'avena, per favore", "Sparkling water, please": "Acqua frizzante, per favore", "Could we have the dessert menu?": "Possiamo avere il menù dei dolci?", "Could we see the dessert menu?": "Possiamo avere il menù dei dolci?", "Could we split the bill?": "Possiamo pagare separatamente?", "Could we split the check?": "Possiamo pagare separatamente?", "Keep the change": "Tenga il resto", "Excuse me, this is cold": "Scusi, questo è freddo", "Could I have a clean fork, please?": "Posso avere una forchetta pulita?", "Could I get a clean fork, please?": "Posso avere una forchetta pulita?", "Where are the toilets?": "Dove sono i bagni?", "Where's the restroom?": "Dove sono i bagni?", "Everything was lovely, thank you": "Era tutto ottimo, grazie", "Everything was great, thank you": "Era tutto ottimo, grazie", "We'd like to book a table for Saturday": "Vorremmo prenotare un tavolo per sabato", "We'd like to make a reservation for Saturday": "Vorremmo prenotare un tavolo per sabato", "Do you have a children's menu?": "Avete un menù per bambini?", "Do you have a kids' menu?": "Avete un menù per bambini?", "A single ticket, please": "Un biglietto di sola andata, per favore", "A one-way ticket, please": "Un biglietto di sola andata, per favore", "Does this train go to the airport?": "Questo treno va all'aeroporto?", "Is this seat taken?": "È occupato questo posto?", "The train is delayed": "Il treno è in ritardo", "I've missed my connection": "Ho perso la coincidenza", "I missed my connection": "Ho perso la coincidenza", "Where can I leave my luggage?": "Dove posso lasciare i bagagli?", "Where can I store my bags?": "Dove posso lasciare i bagagli?", "My suitcase hasn't arrived": "La mia valigia non è arrivata", "My suitcase didn't arrive": "La mia valigia non è arrivata", "Where is passport control?": "Dov'è il controllo passaporti?", "Where is immigration?": "Dov'è il controllo passaporti?", "I'm here for two weeks": "Resto qui due settimane", "Can I have a window seat?": "Posso avere un posto al finestrino?", "Can I get a window seat?": "Posso avere un posto al finestrino?", "How long does it take to get there?": "Quanto ci vuole per arrivarci?", "Could you show me on the map?": "Me lo può indicare sulla mappa?", "It's on the left, next to the bank": "È a sinistra, accanto alla banca", "Can I walk there?": "Ci si può arrivare a piedi?", "Could you call me a taxi?": "Mi può chiamare un taxi?", "Could you call me a cab?": "Mi può chiamare un taxi?", "Please stop here": "Si fermi qui, per favore", "You can drop me off here": "Si fermi qui, per favore", "Is breakfast included?": "La colazione è inclusa?", "The air conditioning isn't working": "L'aria condizionata non funziona", "Could I have the Wi-Fi password?": "Qual è la password del wifi?", "What's the Wi-Fi password?": "Qual è la password del wifi?", "I'd like to hire a car": "Vorrei noleggiare un'auto", "I'd like to rent a car": "Vorrei noleggiare un'auto"}, "de": {"See you tomorrow": "Bis morgen", "How's it going?": "Wie läuft's?", "I'm fine, thanks. And you?": "Gut, danke. Und dir?", "Pleased to meet you too": "Freut mich auch", "Sorry I'm late": "Entschuldigung, dass ich zu spät bin", "No problem at all": "Kein Problem", "Could you write it down, please?": "Können Sie das bitte aufschreiben?", "How do you spell that?": "Wie schreibt man das?", "I live with my family": "Ich wohne bei meiner Familie", "I work in an office": "Ich arbeite in einem Büro", "I'm here on holiday": "Ich bin hier im Urlaub", "I'm here on vacation": "Ich bin hier im Urlaub", "What do you do for a living?": "Was machst du beruflich?", "Can I ask you a question?": "Darf ich Sie etwas fragen?", "I don't know": "Ich weiß es nicht", "That's a good idea": "Das ist eine gute Idee", "I'm not sure": "Ich bin mir nicht sicher", "Just a moment, please": "Einen Moment, bitte", "What time is it?": "Wie spät ist es?", "Happy birthday!": "Alles Gute zum Geburtstag!", "Take care": "Pass auf dich auf", "Is this table free?": "Ist dieser Tisch frei?", "Is this table taken?": "Ist dieser Tisch frei?", "Could we sit outside?": "Können wir draußen sitzen?", "We're ready to order": "Wir möchten bestellen", "I'd like the soup of the day": "Ich hätte gern die Tagessuppe", "What's in this dish?": "Was ist in diesem Gericht?", "Is it very spicy?": "Ist es sehr scharf?", "Could I have it without onions?": "Kann ich das ohne Zwiebeln haben?", "Can I get it without onions?": "Kann ich das ohne Zwiebeln haben?", "I'm allergic to peanuts": "Ich bin allergisch gegen Erdnüsse", "Could I have a black coffee?": "Kann ich einen schwarzen Kaffee haben?", "Could I get a black coffee?": "Kann ich einen schwarzen Kaffee haben?", "A cappuccino with oat milk, please": "Einen Cappuccino mit Hafermilch, bitte", "Sparkling water, please": "Sprudelwasser, bitte", "Could we have the dessert menu?": "Können wir die Dessertkarte haben?", "Could we see the dessert menu?": "Können wir die Dessertkarte haben?", "Could we split the bill?": "Können wir getrennt zahlen?", "Could we split the check?": "Können wir getrennt zahlen?", "Keep the change": "Stimmt so", "Excuse me, this is cold": "Entschuldigung, das ist kalt", "Could I have a clean fork, please?": "Kann ich bitte eine saubere Gabel haben?", "Could I get a clean fork, please?": "Kann ich bitte eine saubere Gabel haben?", "Where are the toilets?": "Wo sind die Toiletten?", "Where's the restroom?": "Wo sind die Toiletten?", "Everything was lovely, thank you": "Es war alles sehr gut, danke", "Everything was great, thank you": "Es war alles sehr gut, danke", "We'd like to book a table for Saturday": "Wir möchten einen Tisch für Samstag reservieren", "We'd like to make a reservation for Saturday": "Wir möchten einen Tisch für Samstag reservieren", "Do you have a children's menu?": "Haben Sie eine Kinderkarte?", "Do you have a kids' menu?": "Haben Sie eine Kinderkarte?", "A single ticket, please": "Eine einfache Fahrkarte, bitte", "A one-way ticket, please": "Eine einfache Fahrkarte, bitte", "Does this train go to the airport?": "Fährt dieser Zug zum Flughafen?", "Is this seat taken?": "Ist dieser Platz besetzt?", "The train is delayed": "Der Zug hat Verspätung", "I've missed my connection": "Ich habe meinen Anschluss verpasst", "I missed my connection": "Ich habe meinen Anschluss verpasst", "Where can I leave my luggage?": "Wo kann ich mein Gepäck lassen?", "Where can I store my bags?": "Wo kann ich mein Gepäck lassen?", "My suitcase hasn't arrived": "Mein Koffer ist nicht angekommen", "My suitcase didn't arrive": "Mein Koffer ist nicht angekommen", "Where is passport control?": "Wo ist die Passkontrolle?", "Where is immigration?": "Wo ist die Passkontrolle?", "I'm here for two weeks": "Ich bin zwei Wochen hier", "Can I have a window seat?": "Kann ich einen Fensterplatz haben?", "Can I get a window seat?": "Kann ich einen Fensterplatz haben?", "How long does it take to get there?": "Wie lange braucht man bis dorthin?", "Could you show me on the map?": "Können Sie es mir auf der Karte zeigen?", "It's on the left, next to the bank": "Es ist links, neben der Bank", "Can I walk there?": "Kann man zu Fuß hingehen?", "Could you call me a taxi?": "Können Sie mir ein Taxi rufen?", "Could you call me a cab?": "Können Sie mir ein Taxi rufen?", "Please stop here": "Halten Sie bitte hier", "You can drop me off here": "Halten Sie bitte hier", "Is breakfast included?": "Ist das Frühstück inbegriffen?", "The air conditioning isn't working": "Die Klimaanlage funktioniert nicht", "Could I have the Wi-Fi password?": "Wie lautet das WLAN-Passwort?", "What's the Wi-Fi password?": "Wie lautet das WLAN-Passwort?", "I'd like to hire a car": "Ich möchte ein Auto mieten", "I'd like to rent a car": "Ich möchte ein Auto mieten"}, "pt": {"See you tomorrow": "Até amanhã", "How's it going?": "Como estão as coisas?", "I'm fine, thanks. And you?": "Bem, obrigado. E tu?", "Pleased to meet you too": "O prazer é meu", "Sorry I'm late": "Desculpa o atraso", "No problem at all": "Não há problema nenhum", "Could you write it down, please?": "Pode escrever-mo, por favor?", "How do you spell that?": "Como se escreve?", "I live with my family": "Vivo com a minha família", "I work in an office": "Trabalho num escritório", "I'm here on holiday": "Estou cá de férias", "I'm here on vacation": "Estou cá de férias", "What do you do for a living?": "O que fazes na vida?", "Can I ask you a question?": "Posso fazer-lhe uma pergunta?", "I don't know": "Não sei", "That's a good idea": "É uma boa ideia", "I'm not sure": "Não tenho a certeza", "Just a moment, please": "Um momento, por favor", "What time is it?": "Que horas são?", "Happy birthday!": "Parabéns!", "Take care": "Cuida-te", "Is this table free?": "Esta mesa está livre?", "Is this table taken?": "Esta mesa está livre?", "Could we sit outside?": "Podemos sentar-nos lá fora?", "We're ready to order": "Já podemos pedir", "I'd like the soup of the day": "Queria a sopa do dia", "What's in this dish?": "O que leva este prato?", "Is it very spicy?": "É muito picante?", "Could I have it without onions?": "Pode ser sem cebola?", "Can I get it without onions?": "Pode ser sem cebola?", "I'm allergic to peanuts": "Sou alérgico a amendoins", "Could I have a black coffee?": "Pode ser um café sem leite?", "Could I get a black coffee?": "Pode ser um café sem leite?", "A cappuccino with oat milk, please": "Um cappuccino com leite de aveia, por favor", "Sparkling water, please": "Água com gás, por favor", "Could we have the dessert menu?": "Pode trazer a carta de sobremesas?", "Could we see the dessert menu?": "Pode trazer a carta de sobremesas?", "Could we split the bill?": "Podemos pagar separadamente?", "Could we split the check?": "Podemos pagar separadamente?", "Keep the change": "Fique com o troco", "Excuse me, this is cold": "Desculpe, isto está frio", "Could I have a clean fork, please?": "Pode trazer um garfo limpo, por favor?", "Could I get a clean fork, please?": "Pode trazer um garfo limpo, por favor?", "Where are the toilets?": "Onde fica a casa de banho?", "Where's the restroom?": "Onde fica a casa de banho?", "Everything was lovely, thank you": "Estava tudo ótimo, obrigado", "Everything was great, thank you": "Estava tudo ótimo, obrigado", "We'd like to book a table for Saturday": "Queríamos reservar uma mesa para sábado", "We'd like to make a reservation for Saturday": "Queríamos reservar uma mesa para sábado", "Do you have a children's menu?": "Têm menu infantil?", "Do you have a kids' menu?": "Têm menu infantil?", "A single ticket, please": "Um bilhete só de ida, por favor", "A one-way ticket, please": "Um bilhete só de ida, por favor", "Does this train go to the airport?": "Este comboio vai para o aeroporto?", "Is this seat taken?": "Este lugar está ocupado?", "The train is delayed": "O comboio está atrasado", "I've missed my connection": "Perdi a ligação", "I missed my connection": "Perdi a ligação", "Where can I leave my luggage?": "Onde posso deixar a bagagem?", "Where can I store my bags?": "Onde posso deixar a bagagem?", "My suitcase hasn't arrived": "A minha mala não chegou", "My suitcase didn't arrive": "A minha mala não chegou", "Where is passport control?": "Onde é o controlo de passaportes?", "Where is immigration?": "Onde é o controlo de passaportes?", "I'm here for two weeks": "Fico cá duas semanas", "Can I have a window seat?": "Pode dar-me um lugar à janela?", "Can I get a window seat?": "Pode dar-me um lugar à janela?", "How long does it take to get there?": "Quanto tempo demora a chegar lá?", "Could you show me on the map?": "Pode mostrar-me no mapa?", "It's on the left, next to the bank": "Fica à esquerda, ao lado do banco", "Can I walk there?": "Dá para ir a pé?", "Could you call me a taxi?": "Pode chamar-me um táxi?", "Could you call me a cab?": "Pode chamar-me um táxi?", "Please stop here": "Pare aqui, por favor", "You can drop me off here": "Pare aqui, por favor", "Is breakfast included?": "O pequeno-almoço está incluído?", "The air conditioning isn't working": "O ar condicionado não funciona", "Could I have the Wi-Fi password?": "Qual é a palavra-passe do wi-fi?", "What's the Wi-Fi password?": "Qual é a palavra-passe do wi-fi?", "I'd like to hire a car": "Queria alugar um carro", "I'd like to rent a car": "Queria alugar um carro"}};
for (const k in X) window.SIR_MEANINGS[k]=Object.assign(window.SIR_MEANINGS[k]||{},X[k]);
})();

// Lesson mode (lesson.js)
(function(){
const S={
 en:{ls_start:"Start lesson",ls_round:"Round {n} of {m}",ls_done:"Round {n} done!",ls_cont:"Continue",ls_again:"Practise this round again",ls_swipe:"Swipe left for the next phrase",ls_close:"Close lesson"},
 es:{ls_start:"Empezar lección",ls_round:"Ronda {n} de {m}",ls_done:"¡Ronda {n} terminada!",ls_cont:"Continuar",ls_again:"Repetir esta ronda",ls_swipe:"Desliza a la izquierda para la siguiente frase",ls_close:"Cerrar lección"},
 fr:{ls_start:"Commencer la leçon",ls_round:"Manche {n} sur {m}",ls_done:"Manche {n} terminée !",ls_cont:"Continuer",ls_again:"Refaire cette manche",ls_swipe:"Glissez vers la gauche pour la phrase suivante",ls_close:"Fermer la leçon"},
 it:{ls_start:"Inizia la lezione",ls_round:"Round {n} di {m}",ls_done:"Round {n} completato!",ls_cont:"Continua",ls_again:"Ripeti questo round",ls_swipe:"Scorri a sinistra per la frase successiva",ls_close:"Chiudi la lezione"},
 de:{ls_start:"Lektion starten",ls_round:"Runde {n} von {m}",ls_done:"Runde {n} geschafft!",ls_cont:"Weiter",ls_again:"Diese Runde wiederholen",ls_swipe:"Nach links wischen für den nächsten Satz",ls_close:"Lektion schließen"},
 pt:{ls_start:"Começar a lição",ls_round:"Ronda {n} de {m}",ls_done:"Ronda {n} concluída!",ls_cont:"Continuar",ls_again:"Repetir esta ronda",ls_swipe:"Deslize para a esquerda para a frase seguinte",ls_close:"Fechar a lição"}
};
for (const k in S) Object.assign(window.SIR_UI[k], S[k]);
})();

// Harley's Games link (games/)
(function(){
const S={
 en:{gm_h:"🎮 Harley's word games",gm_p:"Learn vocabulary and verbs with word searches, crosswords and quick puzzles.",gm_btn:"Play the games →",gm_foot:"🎮 Word games"},
 es:{gm_h:"🎮 Los juegos de palabras de Harley",gm_p:"Aprende vocabulario y verbos con sopas de letras, crucigramas y pasatiempos rápidos.",gm_btn:"Jugar →",gm_foot:"🎮 Juegos de palabras"},
 fr:{gm_h:"🎮 Les jeux de mots de Harley",gm_p:"Apprenez du vocabulaire et des verbes avec des mots mêlés, des mots croisés et des petits jeux.",gm_btn:"Jouer →",gm_foot:"🎮 Jeux de mots"},
 it:{gm_h:"🎮 I giochi di parole di Harley",gm_p:"Impara vocaboli e verbi con crucipuzzle, cruciverba e giochi veloci.",gm_btn:"Gioca →",gm_foot:"🎮 Giochi di parole"},
 de:{gm_h:"🎮 Harleys Wortspiele",gm_p:"Lerne Wörter und Verben mit Suchrätseln, Kreuzworträtseln und kurzen Spielen.",gm_btn:"Jetzt spielen →",gm_foot:"🎮 Wortspiele"},
 pt:{gm_h:"🎮 Os jogos de palavras do Harley",gm_p:"Aprenda vocabulário e verbos com sopas de letras, palavras cruzadas e jogos rápidos.",gm_btn:"Jogar →",gm_foot:"🎮 Jogos de palavras"}
};
for (const k in S) Object.assign(window.SIR_UI[k], S[k]);
})();

// Harley Chats (chat.js). Other interface languages fall back to English; Harley's feedback itself comes in all 16.
(function(){
const S={
 en:{g_chats:'Chats',ch_title:'Harley Chats',ch_intro:'Have a real conversation in {lang}. {name} plays the barista, the waiter or your new neighbour, and you answer out loud. You get a quick tip after every reply.',ch_level:'Level',ch_easy:'Easy',ch_normal:'Normal',ch_hard:'Challenging',ch_pick:'Pick a scene',
  ch_s_cafe:'At the café',ch_d_cafe:'Order a coffee and something to eat',ch_s_restaurant:'At a restaurant',ch_d_restaurant:'Get a table, order dinner, ask for the bill',ch_s_directions:'Asking the way',ch_d_directions:'You\'re lost: ask a local for directions',ch_s_shop:'Clothes shopping',ch_d_shop:'Find your size, colour and price',ch_s_hotel:'Hotel check-in',ch_d_hotel:'Check in and ask about your room',ch_s_pharmacy:'At the pharmacy',ch_d_pharmacy:'Get something for a cold',ch_s_neighbour:'Your new neighbour',ch_d_neighbour:'Friendly small talk on the stairs',ch_s_party:'At a party',ch_d_party:'Meet someone new and talk about yourself',
  ch_left:'{n} free chats left today',ch_noMic:'Your browser can\'t listen here, so you can type your answers instead.',ch_wait:'{name} is thinking… 🐾',ch_tap:'🎙️ Tap and answer',ch_listening:'👂 Listening… tap when you\'ve finished',ch_type:'⌨️ Type instead',ch_speak:'🎙️ Speak instead',ch_send:'Send',ch_placeholder:'Type your answer in {lang}',ch_try:'You could say:',ch_showTr:'Show translation',ch_hideTr:'Hide translation',
  ch_great:'Great! 🎉',ch_good:'Good 👍',ch_fix:'Try this ✏️',ch_better:'More natural:',ch_finish:'Finish chat',ch_seeSum:'See how you did →',ch_turns:'Reply {n} of {m}',ch_sumTitle:'Chat summary',ch_practise:'Phrases to practise',ch_practiseBtn:'Practise',ch_again:'Chat again',ch_other:'Another scene',
  ch_limit:'You\'ve used today\'s free chats. Unlimited chats are coming with Premium.',ch_off:'Chats aren\'t switched on yet. Check back soon!',ch_err:'Something went wrong.',ch_retry:'Try again',ch_noCatch:'I didn\'t catch that. Try again, or type your answer.'},
 es:{g_chats:'Charlar',ch_title:'Charla con Harley',ch_intro:'Ten una conversación real en {lang}. {name} hace de camarero, dependiente o tu nuevo vecino, y tú respondes en voz alta. Después de cada respuesta recibes un consejo rápido.',ch_level:'Nivel',ch_easy:'Fácil',ch_normal:'Normal',ch_hard:'Difícil',ch_pick:'Elige una escena',
  ch_s_cafe:'En la cafetería',ch_d_cafe:'Pide un café y algo de comer',ch_s_restaurant:'En el restaurante',ch_d_restaurant:'Pide mesa, la cena y la cuenta',ch_s_directions:'Preguntar el camino',ch_d_directions:'Te has perdido: pide indicaciones',ch_s_shop:'De compras',ch_d_shop:'Busca tu talla, color y precio',ch_s_hotel:'En el hotel',ch_d_hotel:'Haz el check-in y pregunta por tu habitación',ch_s_pharmacy:'En la farmacia',ch_d_pharmacy:'Pide algo para el resfriado',ch_s_neighbour:'Tu nuevo vecino',ch_d_neighbour:'Una charla amable en la escalera',ch_s_party:'En una fiesta',ch_d_party:'Conoce a alguien y habla de ti',
  ch_left:'Te quedan {n} charlas gratis hoy',ch_noMic:'Tu navegador no puede escuchar aquí, así que puedes escribir tus respuestas.',ch_wait:'{name} está pensando… 🐾',ch_tap:'🎙️ Toca y responde',ch_listening:'👂 Escuchando… toca al terminar',ch_type:'⌨️ Escribir',ch_speak:'🎙️ Hablar',ch_send:'Enviar',ch_placeholder:'Escribe tu respuesta en {lang}',ch_try:'Podrías decir:',ch_showTr:'Ver traducción',ch_hideTr:'Ocultar traducción',
  ch_great:'¡Genial! 🎉',ch_good:'Bien 👍',ch_fix:'Prueba así ✏️',ch_better:'Más natural:',ch_finish:'Terminar',ch_seeSum:'Ver cómo te ha ido →',ch_turns:'Respuesta {n} de {m}',ch_sumTitle:'Resumen',ch_practise:'Frases para practicar',ch_practiseBtn:'Practicar',ch_again:'Otra vez',ch_other:'Otra escena',
  ch_limit:'Ya has usado las charlas gratis de hoy. Las charlas ilimitadas llegarán con Premium.',ch_off:'Las charlas aún no están activadas. ¡Vuelve pronto!',ch_err:'Algo ha fallado.',ch_retry:'Reintentar',ch_noCatch:'No te he entendido. Inténtalo otra vez o escribe tu respuesta.'},
 fr:{g_chats:'Discuter',ch_title:'Discuter avec Harley',ch_intro:'Faites une vraie conversation en {lang}. {name} joue le serveur, le vendeur ou votre nouveau voisin, et vous répondez à voix haute. Un petit conseil après chaque réponse.',ch_level:'Niveau',ch_easy:'Facile',ch_normal:'Normal',ch_hard:'Difficile',ch_pick:'Choisissez une scène',
  ch_s_cafe:'Au café',ch_d_cafe:'Commandez un café et quelque chose à manger',ch_s_restaurant:'Au restaurant',ch_d_restaurant:'Une table, le dîner, puis l\'addition',ch_s_directions:'Demander son chemin',ch_d_directions:'Vous êtes perdu : demandez à un passant',ch_s_shop:'Shopping',ch_d_shop:'Trouvez la taille, la couleur et le prix',ch_s_hotel:'À l\'hôtel',ch_d_hotel:'Enregistrez-vous et posez vos questions',ch_s_pharmacy:'À la pharmacie',ch_d_pharmacy:'Demandez quelque chose contre le rhume',ch_s_neighbour:'Votre nouveau voisin',ch_d_neighbour:'Petite conversation dans l\'escalier',ch_s_party:'À une fête',ch_d_party:'Rencontrez quelqu\'un et parlez de vous',
  ch_left:'Encore {n} conversations gratuites aujourd\'hui',ch_noMic:'Votre navigateur ne peut pas écouter ici : vous pouvez écrire vos réponses.',ch_wait:'{name} réfléchit… 🐾',ch_tap:'🎙️ Touchez et répondez',ch_listening:'👂 J\'écoute… touchez quand vous avez fini',ch_type:'⌨️ Écrire',ch_speak:'🎙️ Parler',ch_send:'Envoyer',ch_placeholder:'Écrivez votre réponse en {lang}',ch_try:'Vous pourriez dire :',ch_showTr:'Voir la traduction',ch_hideTr:'Masquer la traduction',
  ch_great:'Super ! 🎉',ch_good:'Bien 👍',ch_fix:'Essayez ceci ✏️',ch_better:'Plus naturel :',ch_finish:'Terminer',ch_seeSum:'Voir le bilan →',ch_turns:'Réponse {n} sur {m}',ch_sumTitle:'Bilan',ch_practise:'Phrases à travailler',ch_practiseBtn:'S\'entraîner',ch_again:'Recommencer',ch_other:'Autre scène',
  ch_limit:'Vous avez utilisé les conversations gratuites du jour. Les conversations illimitées arrivent avec Premium.',ch_off:'Les conversations ne sont pas encore activées. Revenez bientôt !',ch_err:'Un problème est survenu.',ch_retry:'Réessayer',ch_noCatch:'Je n\'ai pas compris. Réessayez ou écrivez votre réponse.'},
 it:{g_chats:'Chiacchiera',ch_title:'Chiacchiera con Harley',ch_intro:'Fai una vera conversazione in {lang}. {name} fa il barista, il commesso o il tuo nuovo vicino, e tu rispondi ad alta voce. Dopo ogni risposta ricevi un consiglio veloce.',ch_level:'Livello',ch_easy:'Facile',ch_normal:'Normale',ch_hard:'Difficile',ch_pick:'Scegli una scena',
  ch_s_cafe:'Al bar',ch_d_cafe:'Ordina un caffè e qualcosa da mangiare',ch_s_restaurant:'Al ristorante',ch_d_restaurant:'Un tavolo, la cena e il conto',ch_s_directions:'Chiedere la strada',ch_d_directions:'Ti sei perso: chiedi indicazioni',ch_s_shop:'Fare shopping',ch_d_shop:'Trova taglia, colore e prezzo',ch_s_hotel:'In albergo',ch_d_hotel:'Fai il check-in e chiedi della camera',ch_s_pharmacy:'In farmacia',ch_d_pharmacy:'Chiedi qualcosa per il raffreddore',ch_s_neighbour:'Il tuo nuovo vicino',ch_d_neighbour:'Due chiacchiere sulle scale',ch_s_party:'A una festa',ch_d_party:'Conosci qualcuno e parla di te',
  ch_left:'Ancora {n} chiacchierate gratis oggi',ch_noMic:'Il tuo browser non può ascoltare qui: puoi scrivere le risposte.',ch_wait:'{name} sta pensando… 🐾',ch_tap:'🎙️ Tocca e rispondi',ch_listening:'👂 Ascolto… tocca quando hai finito',ch_type:'⌨️ Scrivi',ch_speak:'🎙️ Parla',ch_send:'Invia',ch_placeholder:'Scrivi la risposta in {lang}',ch_try:'Potresti dire:',ch_showTr:'Mostra traduzione',ch_hideTr:'Nascondi traduzione',
  ch_great:'Ottimo! 🎉',ch_good:'Bene 👍',ch_fix:'Prova così ✏️',ch_better:'Più naturale:',ch_finish:'Finisci',ch_seeSum:'Vedi com\'è andata →',ch_turns:'Risposta {n} di {m}',ch_sumTitle:'Riepilogo',ch_practise:'Frasi da esercitare',ch_practiseBtn:'Esercitati',ch_again:'Di nuovo',ch_other:'Altra scena',
  ch_limit:'Hai usato le chiacchierate gratuite di oggi. Quelle illimitate arrivano con Premium.',ch_off:'Le chiacchierate non sono ancora attive. Torna presto!',ch_err:'Qualcosa è andato storto.',ch_retry:'Riprova',ch_noCatch:'Non ho capito. Riprova o scrivi la risposta.'},
 de:{g_chats:'Plaudern',ch_title:'Plaudern mit Harley',ch_intro:'Führe ein echtes Gespräch auf {lang}. {name} spielt den Kellner, die Verkäuferin oder deinen neuen Nachbarn, und du antwortest laut. Nach jeder Antwort gibt es einen kurzen Tipp.',ch_level:'Niveau',ch_easy:'Leicht',ch_normal:'Normal',ch_hard:'Schwer',ch_pick:'Wähle eine Szene',
  ch_s_cafe:'Im Café',ch_d_cafe:'Bestelle einen Kaffee und etwas zu essen',ch_s_restaurant:'Im Restaurant',ch_d_restaurant:'Tisch, Abendessen und die Rechnung',ch_s_directions:'Nach dem Weg fragen',ch_d_directions:'Du hast dich verlaufen: frag nach dem Weg',ch_s_shop:'Kleidung kaufen',ch_d_shop:'Größe, Farbe und Preis finden',ch_s_hotel:'Im Hotel',ch_d_hotel:'Einchecken und Fragen zum Zimmer',ch_s_pharmacy:'In der Apotheke',ch_d_pharmacy:'Etwas gegen eine Erkältung holen',ch_s_neighbour:'Dein neuer Nachbar',ch_d_neighbour:'Smalltalk im Treppenhaus',ch_s_party:'Auf einer Party',ch_d_party:'Jemanden kennenlernen und von dir erzählen',
  ch_left:'Heute noch {n} kostenlose Gespräche',ch_noMic:'Dein Browser kann hier nicht zuhören, du kannst deine Antworten aber tippen.',ch_wait:'{name} denkt nach… 🐾',ch_tap:'🎙️ Tippen und antworten',ch_listening:'👂 Ich höre zu… tippe, wenn du fertig bist',ch_type:'⌨️ Tippen',ch_speak:'🎙️ Sprechen',ch_send:'Senden',ch_placeholder:'Schreib deine Antwort auf {lang}',ch_try:'Du könntest sagen:',ch_showTr:'Übersetzung zeigen',ch_hideTr:'Übersetzung ausblenden',
  ch_great:'Super! 🎉',ch_good:'Gut 👍',ch_fix:'Versuch es so ✏️',ch_better:'Natürlicher:',ch_finish:'Beenden',ch_seeSum:'Ergebnis ansehen →',ch_turns:'Antwort {n} von {m}',ch_sumTitle:'Zusammenfassung',ch_practise:'Sätze zum Üben',ch_practiseBtn:'Üben',ch_again:'Nochmal',ch_other:'Andere Szene',
  ch_limit:'Du hast die kostenlosen Gespräche für heute verbraucht. Unbegrenzte Gespräche kommen mit Premium.',ch_off:'Die Gespräche sind noch nicht eingeschaltet. Schau bald wieder vorbei!',ch_err:'Etwas ist schiefgelaufen.',ch_retry:'Nochmal versuchen',ch_noCatch:'Das habe ich nicht verstanden. Versuch es nochmal oder tippe deine Antwort.'},
 pt:{g_chats:'Conversar',ch_title:'Conversar com o Harley',ch_intro:'Tenha uma conversa a sério em {lang}. {name} faz de empregado de mesa, vendedor ou novo vizinho, e você responde em voz alta. Depois de cada resposta recebe uma dica rápida.',ch_level:'Nível',ch_easy:'Fácil',ch_normal:'Normal',ch_hard:'Difícil',ch_pick:'Escolha uma cena',
  ch_s_cafe:'No café',ch_d_cafe:'Peça um café e algo para comer',ch_s_restaurant:'No restaurante',ch_d_restaurant:'Mesa, jantar e a conta',ch_s_directions:'Pedir indicações',ch_d_directions:'Está perdido: peça ajuda a alguém',ch_s_shop:'Às compras',ch_d_shop:'Encontre o tamanho, a cor e o preço',ch_s_hotel:'No hotel',ch_d_hotel:'Faça o check-in e pergunte pelo quarto',ch_s_pharmacy:'Na farmácia',ch_d_pharmacy:'Peça algo para a constipação',ch_s_neighbour:'O seu novo vizinho',ch_d_neighbour:'Conversa simpática na escada',ch_s_party:'Numa festa',ch_d_party:'Conheça alguém e fale de si',
  ch_left:'Restam {n} conversas grátis hoje',ch_noMic:'O seu navegador não consegue ouvir aqui, por isso pode escrever as respostas.',ch_wait:'{name} está a pensar… 🐾',ch_tap:'🎙️ Toque e responda',ch_listening:'👂 A ouvir… toque quando terminar',ch_type:'⌨️ Escrever',ch_speak:'🎙️ Falar',ch_send:'Enviar',ch_placeholder:'Escreva a resposta em {lang}',ch_try:'Podia dizer:',ch_showTr:'Ver tradução',ch_hideTr:'Ocultar tradução',
  ch_great:'Ótimo! 🎉',ch_good:'Bem 👍',ch_fix:'Experimente assim ✏️',ch_better:'Mais natural:',ch_finish:'Terminar',ch_seeSum:'Ver como correu →',ch_turns:'Resposta {n} de {m}',ch_sumTitle:'Resumo',ch_practise:'Frases para praticar',ch_practiseBtn:'Praticar',ch_again:'Outra vez',ch_other:'Outra cena',
  ch_limit:'Já usou as conversas grátis de hoje. As conversas ilimitadas chegam com o Premium.',ch_off:'As conversas ainda não estão ativas. Volte em breve!',ch_err:'Algo correu mal.',ch_retry:'Tentar de novo',ch_noCatch:'Não percebi. Tente outra vez ou escreva a resposta.'}
};
for (const k in S) Object.assign(window.SIR_UI[k], S[k]);
})();

// Harley Chats: hands-free mode and tips at the end
(function(){
const S={
 en:{ch_intro:'Have a real conversation in {lang}. {name} plays the barista, the waiter or your new neighbour. Just talk: {name} listens when it\'s your turn, and you get your tips at the end.',ch_auto:'Hands-free: the mic opens when {name} finishes talking',ch_tipsLive:'Show tips after each reply',ch_yourTurn:'Your turn, just talk',ch_speaking:'{name} is talking…',ch_tapTalk:'Tap to talk',ch_pause:'⏸ Pause',ch_review:'Your replies'},
 es:{ch_intro:'Ten una conversación real en {lang}. {name} hace de camarero, dependiente o tu nuevo vecino. Solo habla: {name} te escucha cuando te toca, y al final recibes los consejos.',ch_auto:'Manos libres: el micro se abre cuando {name} termina de hablar',ch_tipsLive:'Ver consejos después de cada respuesta',ch_yourTurn:'Te toca, habla',ch_speaking:'{name} está hablando…',ch_tapTalk:'Toca para hablar',ch_pause:'⏸ Pausa',ch_review:'Tus respuestas'},
 fr:{ch_intro:'Faites une vraie conversation en {lang}. {name} joue le serveur, le vendeur ou votre nouveau voisin. Parlez simplement : {name} vous écoute quand c\'est votre tour, et les conseils arrivent à la fin.',ch_auto:'Mains libres : le micro s\'ouvre quand {name} a fini de parler',ch_tipsLive:'Voir les conseils après chaque réponse',ch_yourTurn:'À vous, parlez',ch_speaking:'{name} parle…',ch_tapTalk:'Touchez pour parler',ch_pause:'⏸ Pause',ch_review:'Vos réponses'},
 it:{ch_intro:'Fai una vera conversazione in {lang}. {name} fa il barista, il commesso o il tuo nuovo vicino. Parla e basta: {name} ti ascolta quando tocca a te, e i consigli arrivano alla fine.',ch_auto:'Mani libere: il microfono si apre quando {name} finisce di parlare',ch_tipsLive:'Mostra i consigli dopo ogni risposta',ch_yourTurn:'Tocca a te, parla',ch_speaking:'{name} sta parlando…',ch_tapTalk:'Tocca per parlare',ch_pause:'⏸ Pausa',ch_review:'Le tue risposte'},
 de:{ch_intro:'Führe ein echtes Gespräch auf {lang}. {name} spielt den Kellner, die Verkäuferin oder deinen neuen Nachbarn. Sprich einfach: {name} hört zu, wenn du dran bist, und die Tipps gibt es am Ende.',ch_auto:'Freihändig: das Mikro geht an, wenn {name} fertig gesprochen hat',ch_tipsLive:'Tipps nach jeder Antwort zeigen',ch_yourTurn:'Du bist dran, sprich einfach',ch_speaking:'{name} spricht…',ch_tapTalk:'Tippen zum Sprechen',ch_pause:'⏸ Pause',ch_review:'Deine Antworten'},
 pt:{ch_intro:'Tenha uma conversa a sério em {lang}. {name} faz de empregado de mesa, vendedor ou novo vizinho. Basta falar: {name} ouve quando é a sua vez, e as dicas chegam no fim.',ch_auto:'Mãos livres: o microfone abre quando {name} acaba de falar',ch_tipsLive:'Ver dicas depois de cada resposta',ch_yourTurn:'É a sua vez, fale',ch_speaking:'{name} está a falar…',ch_tapTalk:'Toque para falar',ch_pause:'⏸ Pausa',ch_review:'As suas respostas'}
};
for (const k in S) Object.assign(window.SIR_UI[k], S[k]);
})();

// Harley Chats → Interview Coach link
(function(){
const S={en:{ch_ivLink:"Harley's Interview Coach",ch_ivSub:'Practise a job interview out loud →'},es:{ch_ivLink:'Entrevistas con Harley',ch_ivSub:'Practica una entrevista de trabajo en voz alta →'},fr:{ch_ivLink:"Le coach d'entretien de Harley",ch_ivSub:"Entraînez-vous à un entretien d'embauche →"},it:{ch_ivLink:'Il coach dei colloqui di Harley',ch_ivSub:'Esercitati per un colloquio ad alta voce →'},de:{ch_ivLink:'Harleys Interview-Coach',ch_ivSub:'Übe ein Vorstellungsgespräch laut →'},pt:{ch_ivLink:'O treinador de entrevistas do Harley',ch_ivSub:'Pratique uma entrevista de emprego em voz alta →'}};
for (const k in S) Object.assign(window.SIR_UI[k], S[k]);
})();

// Daily 5 (daily5.js)
(function(){
const S={
 en:{d5_title:'Daily 5',d5_sub:'5 phrases picked for you · about 2 minutes',d5_done:'Done for today! New phrases tomorrow',d5_streak:'🔥 {n}-day streak',d5_progress:'{n} of {m} done',d5_start:'Start',d5_cont:'Continue'},
 es:{d5_title:'Tus 5 del día',d5_sub:'5 frases elegidas para ti · unos 2 minutos',d5_done:'¡Hecho por hoy! Mañana, frases nuevas',d5_streak:'🔥 Racha de {n} días',d5_progress:'{n} de {m} hechas',d5_start:'Empezar',d5_cont:'Seguir'},
 fr:{d5_title:'Les 5 du jour',d5_sub:'5 phrases choisies pour vous · environ 2 minutes',d5_done:"C'est fait pour aujourd'hui ! Nouvelles phrases demain",d5_streak:'🔥 Série de {n} jours',d5_progress:'{n} sur {m} faites',d5_start:'Commencer',d5_cont:'Continuer'},
 it:{d5_title:'Le 5 del giorno',d5_sub:'5 frasi scelte per te · circa 2 minuti',d5_done:'Fatto per oggi! Domani frasi nuove',d5_streak:'🔥 {n} giorni di fila',d5_progress:'{n} di {m} fatte',d5_start:'Inizia',d5_cont:'Continua'},
 de:{d5_title:'Deine 5 am Tag',d5_sub:'5 Sätze für dich ausgewählt · etwa 2 Minuten',d5_done:'Für heute erledigt! Morgen gibt es neue Sätze',d5_streak:'🔥 {n} Tage in Folge',d5_progress:'{n} von {m} geschafft',d5_start:'Los',d5_cont:'Weiter'},
 pt:{d5_title:'As 5 do dia',d5_sub:'5 frases escolhidas para si · cerca de 2 minutos',d5_done:'Feito por hoje! Amanhã há frases novas',d5_streak:'🔥 {n} dias seguidos',d5_progress:'{n} de {m} feitas',d5_start:'Começar',d5_cont:'Continuar'}
};
for (const k in S) Object.assign(window.SIR_UI[k], S[k]);
})();

// Harley Chats: pause setting
(function(){
const S={
 en:{ch_pauseL:'Pause before sending',ch_pz_short:'Short',ch_pz_normal:'Normal',ch_pz_long:'Long'},
 es:{ch_pauseL:'Pausa antes de enviar',ch_pz_short:'Corta',ch_pz_normal:'Normal',ch_pz_long:'Larga'},
 fr:{ch_pauseL:"Pause avant l'envoi",ch_pz_short:'Courte',ch_pz_normal:'Normale',ch_pz_long:'Longue'},
 it:{ch_pauseL:"Pausa prima dell'invio",ch_pz_short:'Breve',ch_pz_normal:'Normale',ch_pz_long:'Lunga'},
 de:{ch_pauseL:'Pause vor dem Senden',ch_pz_short:'Kurz',ch_pz_normal:'Normal',ch_pz_long:'Lang'},
 pt:{ch_pauseL:'Pausa antes de enviar',ch_pz_short:'Curta',ch_pz_normal:'Normal',ch_pz_long:'Longa'}
};
for (const k in S) Object.assign(window.SIR_UI[k], S[k]);
})();

// Assess me: test picker cards
(function(){
const S={
 en:{a_pickRead:"Read a short text aloud and get a pronunciation level",a_pickSpeak:"Talk about anything and get a speaking level",a_pickWrite:"Write a few sentences and get a writing level"},
 es:{a_pickRead:"Lee un texto corto en voz alta y obtén tu nivel de pronunciación",a_pickSpeak:"Habla de lo que quieras y obtén tu nivel oral",a_pickWrite:"Escribe unas frases y obtén tu nivel de escritura"},
 fr:{a_pickRead:"Lisez un court texte à voix haute et obtenez votre niveau de prononciation",a_pickSpeak:"Parlez de ce que vous voulez et obtenez votre niveau à l'oral",a_pickWrite:"Écrivez quelques phrases et obtenez votre niveau à l'écrit"},
 it:{a_pickRead:"Leggi ad alta voce un breve testo e scopri il tuo livello di pronuncia",a_pickSpeak:"Parla di quello che vuoi e scopri il tuo livello di espressione orale",a_pickWrite:"Scrivi qualche frase e scopri il tuo livello di scrittura"},
 de:{a_pickRead:"Lies einen kurzen Text laut vor und erhalte dein Aussprache-Niveau",a_pickSpeak:"Sprich über ein beliebiges Thema und erhalte dein Sprech-Niveau",a_pickWrite:"Schreib ein paar Sätze und erhalte dein Schreib-Niveau"},
 pt:{a_pickRead:"Leia um texto curto em voz alta e descubra o seu nível de pronúncia",a_pickSpeak:"Fale sobre o que quiser e descubra o seu nível de oralidade",a_pickWrite:"Escreva algumas frases e descubra o seu nível de escrita"}
};
for (const k in S) Object.assign(window.SIR_UI[k], S[k]);
})();
