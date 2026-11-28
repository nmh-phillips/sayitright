// Harley's Games interface translations, in the same 16 interface languages as Harlo.
// HG_UI: screen text. Word meanings live in games/words.js. AI-translated: get native speakers to check.
window.HG_UI_LANGS = [['en', 'English'], ['es', 'Español'], ['fr', 'Français'], ['it', 'Italiano'], ['de', 'Deutsch'], ['pt', 'Português'], ['pl', 'Polski'], ['ro', 'Română'], ['uk', 'Українська'], ['zh', '中文（简体）'], ['ar', 'العربية'], ['nl', 'Nederlands'], ['tr', 'Türkçe'], ['ja', '日本語'], ['ko', '한국어'], ['vi', 'Tiếng Việt']];
window.HG_RTL = { ar: true };
window.HG_LEARN_NAMES = { en: 'English (UK)', enus: 'English (US)', es: 'Español (España)', esmx: 'Español (Latinoamérica)', fr: 'Français', it: 'Italiano', de: 'Deutsch', pt: 'Português', nl: 'Nederlands' };

window.HG_UI = {
  en: {
    iSpeak: 'I speak', learning: "I'm learning", pron: '🎙️ Pronunciation', title: "Harley's Games — fun ways to learn vocabulary and verbs",
    heroH: 'Fun ways to learn vocabulary and verbs', heroP: 'Word searches, crosswords and quick puzzles in 9 languages. Free, no sign-up.',
    t_animals: 'Animals', t_food: 'Food & drink', t_town: 'Around town', t_verbs: 'Everyday verbs', t_past: 'Past tense',
    g_wordsearch: 'Word search', d_wordsearch: 'Find the hidden words in the grid.', g_crossword: 'Crossword', d_crossword: 'Fill the grid from the clues.',
    g_match: 'Match pairs', d_match: 'Pair each word with its meaning.', g_unscramble: 'Unscramble', d_unscramble: 'Put the letters in the right order.',
    played: '✓ Played {n}×', promoH: 'Can you say them too?', promoP: 'Harlo listens to you and scores your pronunciation, sound by sound.', promoGo: 'Try Harlo →',
    aboutH: 'How it works', about1: "Pick the language you're learning and a topic, then choose a game. Tap any word you've found to hear it said out loud.",
    about2: "Verbs come as infinitives (\"to eat\") and in the past tense, so you practise the forms you'll actually use.",
    h_wordsearch: 'Drag across the letters (or tap the first and last letter) to find each word.', h_crossword: 'Tap a square or a clue, then type. Accents are optional: "e" counts for "é".',
    h_match: 'Tap a word, then its meaning.', h_unscramble: 'Tap the letters in the right order. Tap a placed letter to take it back.',
    found: '{n} of {m} found', across: 'Across', down: 'Down', check: 'Check', reveal: 'Reveal', toFix: 'Letters to fix (in red): {n}', toGo: 'Squares to go: {n}',
    revealed: 'Answers revealed. Tap a clue to hear the word.', noCw: "Couldn't build a crossword for this topic. Try another one.", wordOf: 'Word {n} of {m}', hint: '💡 Hint', skip: 'Skip',
    time: 'Time: {s} s · Mistakes: {m}', done3: 'Woof woof! Perfect!', done2: 'Woof! Great job!', done1: 'Woof! You did it!', again: 'Play again', other: 'Other games',
    promo2H: 'Now say them out loud', promo2P: "Practise your pronunciation with Harlo. He'll tell you how you sounded.", pronLink: 'Harlo pronunciation', privacy: 'Privacy', terms: 'Terms', adults: 'For adults aged 18 and over.', back: 'All games', listen: 'Listen'
  },
  es: {
    iSpeak: 'Hablo', learning: 'Estoy aprendiendo', pron: '🎙️ Pronunciación', title: 'Los juegos de Harley: formas divertidas de aprender vocabulario y verbos',
    heroH: 'Formas divertidas de aprender vocabulario y verbos', heroP: 'Sopas de letras, crucigramas y pasatiempos rápidos en 9 idiomas. Gratis y sin registro.',
    t_animals: 'Animales', t_food: 'Comida y bebida', t_town: 'Por la ciudad', t_verbs: 'Verbos cotidianos', t_past: 'Pasado',
    g_wordsearch: 'Sopa de letras', d_wordsearch: 'Encuentra las palabras escondidas.', g_crossword: 'Crucigrama', d_crossword: 'Rellena la cuadrícula con las pistas.',
    g_match: 'Parejas', d_match: 'Une cada palabra con su significado.', g_unscramble: 'Desordenadas', d_unscramble: 'Pon las letras en el orden correcto.',
    played: '✓ Jugado {n}×', promoH: '¿Sabes decirlas también?', promoP: 'Harlo te escucha y puntúa tu pronunciación, sonido a sonido.', promoGo: 'Prueba Harlo →',
    aboutH: 'Cómo funciona', about1: 'Elige el idioma que aprendes y un tema, y después un juego. Toca cualquier palabra encontrada para oírla en voz alta.',
    about2: 'Los verbos aparecen en infinitivo y en pasado, para que practiques las formas que de verdad usarás.',
    h_wordsearch: 'Arrastra por las letras (o toca la primera y la última) para encontrar cada palabra.', h_crossword: 'Toca una casilla o una pista y escribe. Las tildes son opcionales: «e» vale por «é».',
    h_match: 'Toca una palabra y luego su significado.', h_unscramble: 'Toca las letras en el orden correcto. Toca una letra colocada para quitarla.',
    found: '{n} de {m} encontradas', across: 'Horizontales', down: 'Verticales', check: 'Comprobar', reveal: 'Ver respuestas', toFix: 'Letras por corregir (en rojo): {n}', toGo: 'Casillas por rellenar: {n}',
    revealed: 'Respuestas mostradas. Toca una pista para oír la palabra.', noCw: 'No se pudo crear un crucigrama para este tema. Prueba otro.', wordOf: 'Palabra {n} de {m}', hint: '💡 Pista', skip: 'Saltar',
    time: 'Tiempo: {s} s · Errores: {m}', done3: '¡Guau guau! ¡Perfecto!', done2: '¡Guau! ¡Muy bien!', done1: '¡Guau! ¡Lo lograste!', again: 'Jugar otra vez', other: 'Otros juegos',
    promo2H: 'Ahora dilas en voz alta', promo2P: 'Practica tu pronunciación con Harlo. Te dirá cómo has sonado.', pronLink: 'Pronunciación con Harlo', privacy: 'Privacidad', terms: 'Condiciones', adults: 'Para mayores de 18 años.', back: 'Todos los juegos', listen: 'Escuchar'
  },
  fr: {
    iSpeak: 'Je parle', learning: "J'apprends", pron: '🎙️ Prononciation', title: 'Les jeux de Harley : des façons amusantes d\'apprendre le vocabulaire et les verbes',
    heroH: "Des façons amusantes d'apprendre le vocabulaire et les verbes", heroP: 'Mots mêlés, mots croisés et petits jeux en 9 langues. Gratuit, sans inscription.',
    t_animals: 'Animaux', t_food: 'Nourriture et boissons', t_town: 'En ville', t_verbs: 'Verbes du quotidien', t_past: 'Passé',
    g_wordsearch: 'Mots mêlés', d_wordsearch: 'Trouvez les mots cachés dans la grille.', g_crossword: 'Mots croisés', d_crossword: 'Remplissez la grille grâce aux indices.',
    g_match: 'Paires', d_match: 'Associez chaque mot à son sens.', g_unscramble: 'Lettres mélangées', d_unscramble: 'Remettez les lettres dans le bon ordre.',
    played: '✓ Joué {n}×', promoH: 'Savez-vous aussi les dire ?', promoP: 'Harlo vous écoute et note votre prononciation, son par son.', promoGo: 'Essayer Harlo →',
    aboutH: 'Comment ça marche', about1: "Choisissez la langue que vous apprenez et un thème, puis un jeu. Touchez un mot trouvé pour l'entendre.",
    about2: "Les verbes sont à l'infinitif et au passé, pour pratiquer les formes que vous utiliserez vraiment.",
    h_wordsearch: 'Glissez sur les lettres (ou touchez la première et la dernière) pour trouver chaque mot.', h_crossword: "Touchez une case ou un indice, puis tapez. Les accents sont facultatifs : « e » vaut « é ».",
    h_match: 'Touchez un mot, puis son sens.', h_unscramble: "Touchez les lettres dans le bon ordre. Touchez une lettre placée pour l'enlever.",
    found: '{n} sur {m} trouvés', across: 'Horizontalement', down: 'Verticalement', check: 'Vérifier', reveal: 'Voir les réponses', toFix: 'Lettres à corriger (en rouge) : {n}', toGo: 'Cases restantes : {n}',
    revealed: 'Réponses affichées. Touchez un indice pour entendre le mot.', noCw: 'Impossible de créer des mots croisés pour ce thème. Essayez-en un autre.', wordOf: 'Mot {n} sur {m}', hint: '💡 Indice', skip: 'Passer',
    time: 'Temps : {s} s · Erreurs : {m}', done3: 'Ouaf ouaf ! Parfait !', done2: 'Ouaf ! Bravo !', done1: 'Ouaf ! Réussi !', again: 'Rejouer', other: 'Autres jeux',
    promo2H: 'Maintenant, dites-les à voix haute', promo2P: 'Travaillez votre prononciation avec Harlo. Il vous dira comment vous avez prononcé.', pronLink: 'Prononciation Harlo', privacy: 'Confidentialité', terms: 'Conditions', adults: 'Réservé aux adultes de 18 ans et plus.', back: 'Tous les jeux', listen: 'Écouter'
  },
  it: {
    iSpeak: 'Parlo', learning: 'Sto imparando', pron: '🎙️ Pronuncia', title: 'I giochi di Harley: modi divertenti per imparare vocaboli e verbi',
    heroH: 'Modi divertenti per imparare vocaboli e verbi', heroP: 'Crucipuzzle, cruciverba e giochi veloci in 9 lingue. Gratis, senza registrazione.',
    t_animals: 'Animali', t_food: 'Cibo e bevande', t_town: 'In città', t_verbs: 'Verbi di tutti i giorni', t_past: 'Passato',
    g_wordsearch: 'Crucipuzzle', d_wordsearch: 'Trova le parole nascoste nella griglia.', g_crossword: 'Cruciverba', d_crossword: 'Riempi la griglia con le definizioni.',
    g_match: 'Coppie', d_match: 'Abbina ogni parola al suo significato.', g_unscramble: 'Anagrammi', d_unscramble: "Metti le lettere nell'ordine giusto.",
    played: '✓ Giocato {n}×', promoH: 'Sai anche pronunciarle?', promoP: 'Harlo ti ascolta e valuta la tua pronuncia, suono per suono.', promoGo: 'Prova Harlo →',
    aboutH: 'Come funziona', about1: 'Scegli la lingua che stai imparando e un argomento, poi un gioco. Tocca una parola trovata per sentirla.',
    about2: "I verbi sono all'infinito e al passato, così pratichi le forme che userai davvero.",
    h_wordsearch: "Trascina sulle lettere (o tocca la prima e l'ultima) per trovare ogni parola.", h_crossword: 'Tocca una casella o una definizione e scrivi. Gli accenti sono facoltativi: «e» vale «è».',
    h_match: 'Tocca una parola, poi il suo significato.', h_unscramble: "Tocca le lettere nell'ordine giusto. Tocca una lettera inserita per toglierla.",
    found: '{n} di {m} trovate', across: 'Orizzontali', down: 'Verticali', check: 'Controlla', reveal: 'Mostra soluzioni', toFix: 'Lettere da correggere (in rosso): {n}', toGo: 'Caselle mancanti: {n}',
    revealed: 'Soluzioni mostrate. Tocca una definizione per sentire la parola.', noCw: 'Impossibile creare un cruciverba per questo argomento. Provane un altro.', wordOf: 'Parola {n} di {m}', hint: '💡 Aiuto', skip: 'Salta',
    time: 'Tempo: {s} s · Errori: {m}', done3: 'Bau bau! Perfetto!', done2: 'Bau! Ottimo lavoro!', done1: 'Bau! Ce l\'hai fatta!', again: 'Gioca ancora', other: 'Altri giochi',
    promo2H: 'Ora dille ad alta voce', promo2P: 'Esercita la pronuncia con Harlo. Ti dirà come hai pronunciato.', pronLink: 'Pronuncia con Harlo', privacy: 'Privacy', terms: 'Termini', adults: 'Per adulti dai 18 anni in su.', back: 'Tutti i giochi', listen: 'Ascolta'
  },
  de: {
    iSpeak: 'Ich spreche', learning: 'Ich lerne', pron: '🎙️ Aussprache', title: 'Harleys Spiele – Wörter und Verben spielerisch lernen',
    heroH: 'Wörter und Verben spielerisch lernen', heroP: 'Suchrätsel, Kreuzworträtsel und kurze Spiele in 9 Sprachen. Kostenlos, ohne Anmeldung.',
    t_animals: 'Tiere', t_food: 'Essen & Trinken', t_town: 'In der Stadt', t_verbs: 'Alltagsverben', t_past: 'Vergangenheit',
    g_wordsearch: 'Suchrätsel', d_wordsearch: 'Finde die versteckten Wörter im Gitter.', g_crossword: 'Kreuzworträtsel', d_crossword: 'Fülle das Gitter mit Hilfe der Hinweise.',
    g_match: 'Paare finden', d_match: 'Ordne jedem Wort seine Bedeutung zu.', g_unscramble: 'Buchstabensalat', d_unscramble: 'Bring die Buchstaben in die richtige Reihenfolge.',
    played: '✓ {n}× gespielt', promoH: 'Kannst du sie auch aussprechen?', promoP: 'Harlo hört dir zu und bewertet deine Aussprache, Laut für Laut.', promoGo: 'Harlo testen →',
    aboutH: "So funktioniert's", about1: 'Wähle die Sprache, die du lernst, und ein Thema, dann ein Spiel. Tippe auf ein gefundenes Wort, um es zu hören.',
    about2: 'Verben gibt es im Infinitiv und in der Vergangenheit, damit du die Formen übst, die du wirklich brauchst.',
    h_wordsearch: 'Wische über die Buchstaben (oder tippe auf den ersten und letzten), um jedes Wort zu finden.', h_crossword: 'Tippe auf ein Feld oder einen Hinweis und schreib los. Akzente sind optional: „e“ zählt für „é“.',
    h_match: 'Tippe auf ein Wort, dann auf seine Bedeutung.', h_unscramble: 'Tippe die Buchstaben in der richtigen Reihenfolge an. Tippe auf einen gesetzten Buchstaben, um ihn zurückzunehmen.',
    found: '{n} von {m} gefunden', across: 'Waagerecht', down: 'Senkrecht', check: 'Prüfen', reveal: 'Lösung zeigen', toFix: 'Zu korrigierende Buchstaben (rot): {n}', toGo: 'Fehlende Felder: {n}',
    revealed: 'Lösung angezeigt. Tippe auf einen Hinweis, um das Wort zu hören.', noCw: 'Für dieses Thema konnte kein Kreuzworträtsel erstellt werden. Probier ein anderes.', wordOf: 'Wort {n} von {m}', hint: '💡 Tipp', skip: 'Überspringen',
    time: 'Zeit: {s} s · Fehler: {m}', done3: 'Wuff wuff! Perfekt!', done2: 'Wuff! Super gemacht!', done1: 'Wuff! Geschafft!', again: 'Nochmal spielen', other: 'Andere Spiele',
    promo2H: 'Jetzt sag sie laut', promo2P: 'Übe deine Aussprache mit Harlo. Er sagt dir, wie du geklungen hast.', pronLink: 'Aussprache mit Harlo', privacy: 'Datenschutz', terms: 'Nutzungsbedingungen', adults: 'Für Erwachsene ab 18 Jahren.', back: 'Alle Spiele', listen: 'Anhören'
  },
  pt: {
    iSpeak: 'Falo', learning: 'Quero aprender', pron: '🎙️ Pronúncia', title: 'Os jogos do Harley: formas divertidas de aprender vocabulário e verbos',
    heroH: 'Formas divertidas de aprender vocabulário e verbos', heroP: 'Sopas de letras, palavras cruzadas e jogos rápidos em 9 línguas. Grátis, sem registo.',
    t_animals: 'Animais', t_food: 'Comida e bebida', t_town: 'Pela cidade', t_verbs: 'Verbos do dia a dia', t_past: 'Passado',
    g_wordsearch: 'Sopa de letras', d_wordsearch: 'Encontre as palavras escondidas na grelha.', g_crossword: 'Palavras cruzadas', d_crossword: 'Preencha a grelha com as pistas.',
    g_match: 'Pares', d_match: 'Junte cada palavra ao seu significado.', g_unscramble: 'Letras baralhadas', d_unscramble: 'Ponha as letras pela ordem certa.',
    played: '✓ Jogado {n}×', promoH: 'Também as sabe dizer?', promoP: 'O Harlo ouve-o e avalia a sua pronúncia, som a som.', promoGo: 'Experimentar o Harlo →',
    aboutH: 'Como funciona', about1: 'Escolha a língua que está a aprender e um tema, depois um jogo. Toque numa palavra encontrada para a ouvir.',
    about2: 'Os verbos aparecem no infinitivo e no passado, para praticar as formas que vai mesmo usar.',
    h_wordsearch: 'Arraste pelas letras (ou toque na primeira e na última) para encontrar cada palavra.', h_crossword: 'Toque numa casa ou numa pista e escreva. Os acentos são opcionais: «e» conta como «é».',
    h_match: 'Toque numa palavra e depois no seu significado.', h_unscramble: 'Toque nas letras pela ordem certa. Toque numa letra colocada para a retirar.',
    found: '{n} de {m} encontradas', across: 'Horizontais', down: 'Verticais', check: 'Verificar', reveal: 'Ver respostas', toFix: 'Letras a corrigir (a vermelho): {n}', toGo: 'Casas por preencher: {n}',
    revealed: 'Respostas mostradas. Toque numa pista para ouvir a palavra.', noCw: 'Não foi possível criar palavras cruzadas para este tema. Experimente outro.', wordOf: 'Palavra {n} de {m}', hint: '💡 Dica', skip: 'Saltar',
    time: 'Tempo: {s} s · Erros: {m}', done3: 'Ão ão! Perfeito!', done2: 'Ão! Muito bem!', done1: 'Ão! Conseguiu!', again: 'Jogar outra vez', other: 'Outros jogos',
    promo2H: 'Agora diga-as em voz alta', promo2P: 'Pratique a pronúncia com o Harlo. Ele diz-lhe como soou.', pronLink: 'Pronúncia com o Harlo', privacy: 'Privacidade', terms: 'Termos', adults: 'Para adultos com 18 anos ou mais.', back: 'Todos os jogos', listen: 'Ouvir'
  },
  pl: {
    iSpeak: 'Mówię po', learning: 'Uczę się', pron: '🎙️ Wymowa', title: 'Gry Harleya – zabawne sposoby nauki słówek i czasowników',
    heroH: 'Zabawne sposoby nauki słówek i czasowników', heroP: 'Wykreślanki, krzyżówki i szybkie łamigłówki w 9 językach. Za darmo, bez rejestracji.',
    t_animals: 'Zwierzęta', t_food: 'Jedzenie i picie', t_town: 'W mieście', t_verbs: 'Codzienne czasowniki', t_past: 'Czas przeszły',
    g_wordsearch: 'Wykreślanka', d_wordsearch: 'Znajdź ukryte słowa w diagramie.', g_crossword: 'Krzyżówka', d_crossword: 'Wypełnij diagram na podstawie wskazówek.',
    g_match: 'Pary', d_match: 'Połącz każde słowo z jego znaczeniem.', g_unscramble: 'Rozsypanka', d_unscramble: 'Ułóż litery we właściwej kolejności.',
    played: '✓ Zagrano {n}×', promoH: 'Umiesz je też wymówić?', promoP: 'Harlo słucha cię i ocenia twoją wymowę, dźwięk po dźwięku.', promoGo: 'Wypróbuj Harlo →',
    aboutH: 'Jak to działa', about1: 'Wybierz język, którego się uczysz, i temat, a potem grę. Dotknij znalezionego słowa, aby je usłyszeć.',
    about2: 'Czasowniki występują w bezokoliczniku i w czasie przeszłym, więc ćwiczysz formy, których naprawdę użyjesz.',
    h_wordsearch: 'Przeciągnij po literach (albo dotknij pierwszej i ostatniej), aby znaleźć każde słowo.', h_crossword: 'Dotknij pola lub wskazówki i pisz. Akcenty są opcjonalne: „e” liczy się jako „é”.',
    h_match: 'Dotknij słowa, a potem jego znaczenia.', h_unscramble: 'Dotykaj liter we właściwej kolejności. Dotknij ułożonej litery, aby ją cofnąć.',
    found: 'Znaleziono {n} z {m}', across: 'Poziomo', down: 'Pionowo', check: 'Sprawdź', reveal: 'Pokaż odpowiedzi', toFix: 'Litery do poprawy (na czerwono): {n}', toGo: 'Pozostałe pola: {n}',
    revealed: 'Odpowiedzi pokazane. Dotknij wskazówki, aby usłyszeć słowo.', noCw: 'Nie udało się ułożyć krzyżówki dla tego tematu. Spróbuj innego.', wordOf: 'Słowo {n} z {m}', hint: '💡 Podpowiedź', skip: 'Pomiń',
    time: 'Czas: {s} s · Błędy: {m}', done3: 'Hau hau! Idealnie!', done2: 'Hau! Świetna robota!', done1: 'Hau! Udało się!', again: 'Zagraj ponownie', other: 'Inne gry',
    promo2H: 'Teraz powiedz je na głos', promo2P: 'Ćwicz wymowę z Harlo. Powie ci, jak brzmiałeś.', pronLink: 'Wymowa z Harlo', privacy: 'Prywatność', terms: 'Regulamin', adults: 'Dla dorosłych od 18 lat.', back: 'Wszystkie gry', listen: 'Posłuchaj'
  },
  ro: {
    iSpeak: 'Vorbesc', learning: 'Învăț', pron: '🎙️ Pronunție', title: 'Jocurile lui Harley – moduri distractive de a învăța vocabular și verbe',
    heroH: 'Moduri distractive de a învăța vocabular și verbe', heroP: 'Cuvinte ascunse, rebusuri și jocuri rapide în 9 limbi. Gratuit, fără cont.',
    t_animals: 'Animale', t_food: 'Mâncare și băutură', t_town: 'Prin oraș', t_verbs: 'Verbe uzuale', t_past: 'Trecut',
    g_wordsearch: 'Cuvinte ascunse', d_wordsearch: 'Găsește cuvintele ascunse în grilă.', g_crossword: 'Rebus', d_crossword: 'Completează grila cu ajutorul indiciilor.',
    g_match: 'Perechi', d_match: 'Potrivește fiecare cuvânt cu sensul lui.', g_unscramble: 'Litere amestecate', d_unscramble: 'Pune literele în ordinea corectă.',
    played: '✓ Jucat de {n}×', promoH: 'Știi să le și pronunți?', promoP: 'Harlo te ascultă și îți notează pronunția, sunet cu sunet.', promoGo: 'Încearcă Harlo →',
    aboutH: 'Cum funcționează', about1: 'Alege limba pe care o înveți și o temă, apoi un joc. Atinge un cuvânt găsit ca să-l auzi.',
    about2: 'Verbele apar la infinitiv și la trecut, ca să exersezi formele pe care chiar le vei folosi.',
    h_wordsearch: 'Trage peste litere (sau atinge prima și ultima literă) ca să găsești fiecare cuvânt.', h_crossword: 'Atinge un pătrat sau un indiciu, apoi scrie. Accentele sunt opționale: „e” contează ca „é”.',
    h_match: 'Atinge un cuvânt, apoi sensul lui.', h_unscramble: 'Atinge literele în ordinea corectă. Atinge o literă pusă ca s-o iei înapoi.',
    found: '{n} din {m} găsite', across: 'Orizontal', down: 'Vertical', check: 'Verifică', reveal: 'Arată răspunsurile', toFix: 'Litere de corectat (cu roșu): {n}', toGo: 'Pătrate rămase: {n}',
    revealed: 'Răspunsuri afișate. Atinge un indiciu ca să auzi cuvântul.', noCw: 'Nu s-a putut crea un rebus pentru această temă. Încearcă alta.', wordOf: 'Cuvântul {n} din {m}', hint: '💡 Indiciu', skip: 'Sari peste',
    time: 'Timp: {s} s · Greșeli: {m}', done3: 'Ham ham! Perfect!', done2: 'Ham! Foarte bine!', done1: 'Ham! Ai reușit!', again: 'Joacă din nou', other: 'Alte jocuri',
    promo2H: 'Acum spune-le cu voce tare', promo2P: 'Exersează-ți pronunția cu Harlo. Îți spune cum ai sunat.', pronLink: 'Pronunție cu Harlo', privacy: 'Confidențialitate', terms: 'Termeni', adults: 'Pentru adulți de peste 18 ani.', back: 'Toate jocurile', listen: 'Ascultă'
  },
  uk: {
    iSpeak: 'Я розмовляю', learning: 'Я вивчаю', pron: '🎙️ Вимова', title: 'Ігри Гарлі — веселі способи вчити слова й дієслова',
    heroH: 'Веселі способи вчити слова й дієслова', heroP: 'Пошук слів, кросворди та швидкі головоломки 9 мовами. Безкоштовно, без реєстрації.',
    t_animals: 'Тварини', t_food: 'Їжа та напої', t_town: 'У місті', t_verbs: 'Щоденні дієслова', t_past: 'Минулий час',
    g_wordsearch: 'Пошук слів', d_wordsearch: 'Знайди сховані слова в сітці.', g_crossword: 'Кросворд', d_crossword: 'Заповни сітку за підказками.',
    g_match: 'Пари', d_match: 'Поєднай кожне слово з його значенням.', g_unscramble: 'Анаграми', d_unscramble: 'Розстав літери в правильному порядку.',
    played: '✓ Зіграно {n}×', promoH: 'А вимовити їх зможеш?', promoP: 'Harlo слухає тебе й оцінює вимову звук за звуком.', promoGo: 'Спробувати Harlo →',
    aboutH: 'Як це працює', about1: 'Обери мову, яку вивчаєш, і тему, а потім гру. Торкнись знайденого слова, щоб його почути.',
    about2: 'Дієслова подано в інфінітиві та в минулому часі, щоб ти тренував форми, які справді знадобляться.',
    h_wordsearch: 'Проведи по літерах (або торкнись першої й останньої), щоб знайти кожне слово.', h_crossword: 'Торкнись клітинки або підказки й пиши. Наголоси необов’язкові: «e» зараховується як «é».',
    h_match: 'Торкнись слова, а потім його значення.', h_unscramble: 'Торкайся літер у правильному порядку. Торкнись поставленої літери, щоб її забрати.',
    found: 'Знайдено {n} з {m}', across: 'По горизонталі', down: 'По вертикалі', check: 'Перевірити', reveal: 'Показати відповіді', toFix: 'Літер виправити (червоним): {n}', toGo: 'Клітинок залишилось: {n}',
    revealed: 'Відповіді показано. Торкнись підказки, щоб почути слово.', noCw: 'Не вдалося скласти кросворд для цієї теми. Спробуй іншу.', wordOf: 'Слово {n} з {m}', hint: '💡 Підказка', skip: 'Пропустити',
    time: 'Час: {s} с · Помилки: {m}', done3: 'Гав-гав! Ідеально!', done2: 'Гав! Чудово!', done1: 'Гав! Вийшло!', again: 'Грати знову', other: 'Інші ігри',
    promo2H: 'Тепер скажи їх уголос', promo2P: 'Тренуй вимову з Harlo. Він скаже, як ти прозвучав.', pronLink: 'Вимова з Harlo', privacy: 'Конфіденційність', terms: 'Умови', adults: 'Для дорослих від 18 років.', back: 'Усі ігри', listen: 'Слухати'
  },
  zh: {
    iSpeak: '我说', learning: '我在学', pron: '🎙️ 发音练习', title: 'Harley 的游戏——轻松有趣地学词汇和动词',
    heroH: '轻松有趣地学词汇和动词', heroP: '找词游戏、填字游戏和小谜题，支持 9 种语言。免费，无需注册。',
    t_animals: '动物', t_food: '食物和饮料', t_town: '城市里', t_verbs: '常用动词', t_past: '过去时',
    g_wordsearch: '找词游戏', d_wordsearch: '在字母方格里找出隐藏的单词。', g_crossword: '填字游戏', d_crossword: '根据提示填满方格。',
    g_match: '配对', d_match: '把每个单词和它的意思配对。', g_unscramble: '字母重组', d_unscramble: '把字母排成正确的顺序。',
    played: '✓ 已玩 {n} 次', promoH: '你也会说吗？', promoP: 'Harlo 会听你说，并逐个音给你的发音打分。', promoGo: '试试 Harlo →',
    aboutH: '怎么玩', about1: '选择你在学的语言和一个主题，然后选一个游戏。点一下找到的单词就能听到读音。',
    about2: '动词有原形和过去时两种形式，让你练习真正用得上的形式。',
    h_wordsearch: '在字母上滑动（或点第一个和最后一个字母）来找出每个单词。', h_crossword: '点一个方格或一条提示，然后输入。重音符号可省略：“e”也算“é”。',
    h_match: '先点一个单词，再点它的意思。', h_unscramble: '按正确顺序点字母。点已放好的字母可以撤回。',
    found: '已找到 {n}/{m}', across: '横向', down: '纵向', check: '检查', reveal: '显示答案', toFix: '需要改正的字母（红色）：{n}', toGo: '还剩方格：{n}',
    revealed: '已显示答案。点一条提示可以听单词。', noCw: '这个主题无法生成填字游戏，请换一个试试。', wordOf: '第 {n}/{m} 个单词', hint: '💡 提示', skip: '跳过',
    time: '用时：{s} 秒 · 错误：{m}', done3: '汪汪！太完美了！', done2: '汪！做得好！', done1: '汪！完成了！', again: '再玩一次', other: '其他游戏',
    promo2H: '现在大声说出来', promo2P: '用 Harlo 练习发音，它会告诉你说得怎么样。', pronLink: 'Harlo 发音练习', privacy: '隐私', terms: '条款', adults: '仅限 18 岁及以上成人使用。', back: '所有游戏', listen: '听'
  },
  ar: {
    iSpeak: 'أتحدث', learning: 'أتعلم', pron: '🎙️ النطق', title: 'ألعاب هارلي — طرق ممتعة لتعلّم المفردات والأفعال',
    heroH: 'طرق ممتعة لتعلّم المفردات والأفعال', heroP: 'البحث عن الكلمات والكلمات المتقاطعة وألغاز سريعة بـ 9 لغات. مجانًا ومن دون تسجيل.',
    t_animals: 'الحيوانات', t_food: 'الطعام والشراب', t_town: 'في المدينة', t_verbs: 'أفعال يومية', t_past: 'الماضي',
    g_wordsearch: 'البحث عن الكلمات', d_wordsearch: 'اعثر على الكلمات المخفية في الشبكة.', g_crossword: 'الكلمات المتقاطعة', d_crossword: 'املأ الشبكة باستخدام التلميحات.',
    g_match: 'الأزواج', d_match: 'طابق كل كلمة مع معناها.', g_unscramble: 'ترتيب الحروف', d_unscramble: 'رتّب الحروف بالترتيب الصحيح.',
    played: '✓ لُعبت {n} مرة', promoH: 'هل تستطيع نطقها أيضًا؟', promoP: 'يستمع إليك Harlo ويقيّم نطقك صوتًا بصوت.', promoGo: '← جرّب Harlo',
    aboutH: 'كيف تعمل', about1: 'اختر اللغة التي تتعلمها وموضوعًا، ثم اختر لعبة. المس أي كلمة وجدتها لتسمعها.',
    about2: 'تأتي الأفعال في صيغة المصدر وفي الماضي، لتتدرّب على الصيغ التي ستستخدمها فعلًا.',
    h_wordsearch: 'اسحب على الحروف (أو المس الحرف الأول والأخير) للعثور على كل كلمة.', h_crossword: 'المس مربعًا أو تلميحًا ثم اكتب. علامات الحروف اختيارية: «e» تُحسب «é».',
    h_match: 'المس كلمة ثم معناها.', h_unscramble: 'المس الحروف بالترتيب الصحيح. المس حرفًا موضوعًا لإزالته.',
    found: 'وُجدت {n} من {m}', across: 'أفقيًا', down: 'عموديًا', check: 'تحقّق', reveal: 'اعرض الإجابات', toFix: 'حروف تحتاج إلى تصحيح (بالأحمر): {n}', toGo: 'مربعات متبقية: {n}',
    revealed: 'تم عرض الإجابات. المس تلميحًا لسماع الكلمة.', noCw: 'تعذّر إنشاء كلمات متقاطعة لهذا الموضوع. جرّب موضوعًا آخر.', wordOf: 'الكلمة {n} من {m}', hint: '💡 تلميح', skip: 'تخطَّ',
    time: 'الوقت: {s} ث · الأخطاء: {m}', done3: 'هاو هاو! ممتاز!', done2: 'هاو! أحسنت!', done1: 'هاو! لقد نجحت!', again: 'العب مجددًا', other: 'ألعاب أخرى',
    promo2H: 'والآن قلها بصوت عالٍ', promo2P: 'تدرّب على النطق مع Harlo، وسيخبرك كيف بدا نطقك.', pronLink: 'النطق مع Harlo', privacy: 'الخصوصية', terms: 'الشروط', adults: 'للبالغين من عمر 18 عامًا فما فوق.', back: 'كل الألعاب', listen: 'استمع'
  },
  nl: {
    iSpeak: 'Ik spreek', learning: 'Ik leer', pron: '🎙️ Uitspraak', title: 'Harley’s spelletjes – leuke manieren om woorden en werkwoorden te leren',
    heroH: 'Leuke manieren om woorden en werkwoorden te leren', heroP: 'Woordzoekers, kruiswoordpuzzels en korte puzzels in 9 talen. Gratis, zonder account.',
    t_animals: 'Dieren', t_food: 'Eten en drinken', t_town: 'In de stad', t_verbs: 'Alledaagse werkwoorden', t_past: 'Verleden tijd',
    g_wordsearch: 'Woordzoeker', d_wordsearch: 'Vind de verborgen woorden in het rooster.', g_crossword: 'Kruiswoordpuzzel', d_crossword: 'Vul het rooster in met de hints.',
    g_match: 'Paren', d_match: 'Koppel elk woord aan de betekenis.', g_unscramble: 'Letterhusselaar', d_unscramble: 'Zet de letters in de goede volgorde.',
    played: '✓ {n}× gespeeld', promoH: 'Kun je ze ook uitspreken?', promoP: 'Harlo luistert naar je en beoordeelt je uitspraak, klank voor klank.', promoGo: 'Probeer Harlo →',
    aboutH: 'Zo werkt het', about1: 'Kies de taal die je leert en een onderwerp, en dan een spel. Tik op een gevonden woord om het te horen.',
    about2: 'Werkwoorden staan in de infinitief en de verleden tijd, zodat je de vormen oefent die je echt gebruikt.',
    h_wordsearch: 'Veeg over de letters (of tik op de eerste en laatste letter) om elk woord te vinden.', h_crossword: 'Tik op een vakje of een hint en typ. Accenten zijn optioneel: "e" telt als "é".',
    h_match: 'Tik op een woord en dan op de betekenis.', h_unscramble: 'Tik de letters in de goede volgorde aan. Tik op een geplaatste letter om hem terug te halen.',
    found: '{n} van {m} gevonden', across: 'Horizontaal', down: 'Verticaal', check: 'Controleren', reveal: 'Antwoorden tonen', toFix: 'Letters te verbeteren (rood): {n}', toGo: 'Vakjes te gaan: {n}',
    revealed: 'Antwoorden getoond. Tik op een hint om het woord te horen.', noCw: 'Voor dit onderwerp kon geen kruiswoordpuzzel worden gemaakt. Probeer een ander.', wordOf: 'Woord {n} van {m}', hint: '💡 Hint', skip: 'Overslaan',
    time: 'Tijd: {s} s · Fouten: {m}', done3: 'Woef woef! Perfect!', done2: 'Woef! Goed gedaan!', done1: 'Woef! Gelukt!', again: 'Opnieuw spelen', other: 'Andere spellen',
    promo2H: 'Zeg ze nu hardop', promo2P: 'Oefen je uitspraak met Harlo. Hij vertelt je hoe je klonk.', pronLink: 'Uitspraak met Harlo', privacy: 'Privacy', terms: 'Voorwaarden', adults: 'Voor volwassenen vanaf 18 jaar.', back: 'Alle spellen', listen: 'Luisteren'
  },
  tr: {
    iSpeak: 'Konuştuğum dil', learning: 'Öğrendiğim dil', pron: '🎙️ Telaffuz', title: 'Harley’nin Oyunları – kelime ve fiil öğrenmenin eğlenceli yolları',
    heroH: 'Kelime ve fiil öğrenmenin eğlenceli yolları', heroP: '9 dilde kelime avı, bulmaca ve hızlı oyunlar. Ücretsiz, üyelik yok.',
    t_animals: 'Hayvanlar', t_food: 'Yiyecek ve içecek', t_town: 'Şehirde', t_verbs: 'Günlük fiiller', t_past: 'Geçmiş zaman',
    g_wordsearch: 'Kelime avı', d_wordsearch: 'Tablodaki gizli kelimeleri bul.', g_crossword: 'Bulmaca', d_crossword: 'İpuçlarıyla tabloyu doldur.',
    g_match: 'Eşleştirme', d_match: 'Her kelimeyi anlamıyla eşleştir.', g_unscramble: 'Karışık harfler', d_unscramble: 'Harfleri doğru sıraya koy.',
    played: '✓ {n} kez oynandı', promoH: 'Peki söyleyebiliyor musun?', promoP: 'Harlo seni dinler ve telaffuzunu ses ses puanlar.', promoGo: 'Harlo’i dene →',
    aboutH: 'Nasıl çalışır', about1: 'Öğrendiğin dili ve bir konu seç, sonra bir oyun seç. Bulduğun bir kelimeye dokunarak sesli dinle.',
    about2: 'Fiiller mastar ve geçmiş zaman hâliyle gelir; böylece gerçekten kullanacağın biçimleri çalışırsın.',
    h_wordsearch: 'Her kelimeyi bulmak için harflerin üzerinde kaydır (ya da ilk ve son harfe dokun).', h_crossword: 'Bir kareye ya da ipucuna dokun, sonra yaz. Aksanlar isteğe bağlı: "e", "é" yerine sayılır.',
    h_match: 'Önce bir kelimeye, sonra anlamına dokun.', h_unscramble: 'Harflere doğru sırayla dokun. Geri almak için yerleştirilen harfe dokun.',
    found: '{m} kelimeden {n} tanesi bulundu', across: 'Soldan sağa', down: 'Yukarıdan aşağıya', check: 'Kontrol et', reveal: 'Cevapları göster', toFix: 'Düzeltilecek harf (kırmızı): {n}', toGo: 'Kalan kare: {n}',
    revealed: 'Cevaplar gösterildi. Kelimeyi duymak için bir ipucuna dokun.', noCw: 'Bu konu için bulmaca oluşturulamadı. Başka bir konu dene.', wordOf: 'Kelime {n}/{m}', hint: '💡 İpucu', skip: 'Geç',
    time: 'Süre: {s} sn · Hata: {m}', done3: 'Hav hav! Mükemmel!', done2: 'Hav! Harika iş!', done1: 'Hav! Başardın!', again: 'Tekrar oyna', other: 'Diğer oyunlar',
    promo2H: 'Şimdi yüksek sesle söyle', promo2P: 'Harlo ile telaffuzunu çalış. Sana nasıl söylediğini anlatır.', pronLink: 'Harlo ile telaffuz', privacy: 'Gizlilik', terms: 'Koşullar', adults: '18 yaş ve üzeri yetişkinler içindir.', back: 'Tüm oyunlar', listen: 'Dinle'
  },
  ja: {
    iSpeak: '私の言語', learning: '学習中', pron: '🎙️ 発音練習', title: 'ハーレーのゲーム ― 単語と動詞を楽しく覚えよう',
    heroH: '単語と動詞を楽しく覚えよう', heroP: '単語探し、クロスワード、ミニパズルを9か国語で。無料・登録不要。',
    t_animals: '動物', t_food: '食べ物と飲み物', t_town: '街で', t_verbs: 'よく使う動詞', t_past: '過去形',
    g_wordsearch: '単語探し', d_wordsearch: 'マスの中に隠れた単語を見つけよう。', g_crossword: 'クロスワード', d_crossword: 'ヒントを見てマスを埋めよう。',
    g_match: 'ペア合わせ', d_match: '単語と意味を組み合わせよう。', g_unscramble: '並べ替え', d_unscramble: '文字を正しい順番に並べよう。',
    played: '✓ {n}回プレイ', promoH: '声に出して言えますか？', promoP: 'Harlo があなたの声を聞いて、発音を一音ずつ採点します。', promoGo: 'Harlo を試す →',
    aboutH: '遊び方', about1: '学んでいる言語とテーマを選んでから、ゲームを選びます。見つけた単語をタップすると読み上げます。',
    about2: '動詞は原形と過去形の両方が出てくるので、実際に使う形を練習できます。',
    h_wordsearch: '文字の上をなぞって（または最初と最後の文字をタップして）単語を見つけよう。', h_crossword: 'マスかヒントをタップして入力します。アクセント記号は省略可：「e」は「é」として扱います。',
    h_match: '単語をタップしてから、その意味をタップします。', h_unscramble: '文字を正しい順にタップします。置いた文字をタップすると戻せます。',
    found: '{m}個中{n}個見つけた', across: 'ヨコ', down: 'タテ', check: 'チェック', reveal: '答えを見る', toFix: '直す文字（赤）：{n}', toGo: '残りのマス：{n}',
    revealed: '答えを表示しました。ヒントをタップすると単語を読み上げます。', noCw: 'このテーマではクロスワードを作れませんでした。別のテーマを試してください。', wordOf: '{m}語中{n}語目', hint: '💡 ヒント', skip: 'スキップ',
    time: 'タイム：{s}秒 · ミス：{m}', done3: 'ワンワン！パーフェクト！', done2: 'ワン！よくできました！', done1: 'ワン！クリア！', again: 'もう一度', other: 'ほかのゲーム',
    promo2H: '声に出して言ってみよう', promo2P: 'Harlo で発音を練習しよう。どう聞こえたか教えてくれます。', pronLink: 'Harlo 発音練習', privacy: 'プライバシー', terms: '利用規約', adults: '18歳以上の方を対象としています。', back: 'すべてのゲーム', listen: '聞く'
  },
  ko: {
    iSpeak: '내 언어', learning: '학습 언어', pron: '🎙️ 발음 연습', title: '할리의 게임 – 어휘와 동사를 재미있게 배우기',
    heroH: '어휘와 동사를 재미있게 배우기', heroP: '9개 언어로 즐기는 단어 찾기, 십자말풀이, 짧은 퍼즐. 무료, 가입 필요 없음.',
    t_animals: '동물', t_food: '음식과 음료', t_town: '시내에서', t_verbs: '일상 동사', t_past: '과거형',
    g_wordsearch: '단어 찾기', d_wordsearch: '격자 속에 숨은 단어를 찾으세요.', g_crossword: '십자말풀이', d_crossword: '힌트를 보고 칸을 채우세요.',
    g_match: '짝 맞추기', d_match: '단어와 뜻을 짝지으세요.', g_unscramble: '글자 맞추기', d_unscramble: '글자를 올바른 순서로 놓으세요.',
    played: '✓ {n}번 플레이', promoH: '소리 내어 말할 수도 있나요?', promoP: 'Harlo가 듣고 발음을 소리 하나하나 채점해 줘요.', promoGo: 'Harlo 해 보기 →',
    aboutH: '이용 방법', about1: '배우는 언어와 주제를 고른 다음 게임을 선택하세요. 찾은 단어를 누르면 발음을 들을 수 있어요.',
    about2: '동사는 기본형과 과거형으로 나와서 실제로 쓰는 형태를 연습할 수 있어요.',
    h_wordsearch: '글자 위를 드래그하거나 첫 글자와 마지막 글자를 눌러 단어를 찾으세요.', h_crossword: '칸이나 힌트를 누른 다음 입력하세요. 악센트는 생략해도 돼요: "e"는 "é"로 인정돼요.',
    h_match: '단어를 누른 다음 그 뜻을 누르세요.', h_unscramble: '글자를 올바른 순서로 누르세요. 놓은 글자를 누르면 되돌릴 수 있어요.',
    found: '{m}개 중 {n}개 찾음', across: '가로', down: '세로', check: '확인', reveal: '정답 보기', toFix: '고칠 글자(빨간색): {n}', toGo: '남은 칸: {n}',
    revealed: '정답을 보여 드렸어요. 힌트를 누르면 단어를 들을 수 있어요.', noCw: '이 주제로는 십자말풀이를 만들 수 없었어요. 다른 주제를 골라 보세요.', wordOf: '{m}개 중 {n}번째 단어', hint: '💡 힌트', skip: '건너뛰기',
    time: '시간: {s}초 · 실수: {m}', done3: '멍멍! 완벽해요!', done2: '멍! 잘했어요!', done1: '멍! 해냈어요!', again: '다시 하기', other: '다른 게임',
    promo2H: '이제 소리 내어 말해 보세요', promo2P: 'Harlo로 발음을 연습하세요. 어떻게 들렸는지 알려 줘요.', pronLink: 'Harlo 발음 연습', privacy: '개인정보', terms: '이용약관', adults: '만 18세 이상 성인용입니다.', back: '모든 게임', listen: '듣기'
  },
  vi: {
    iSpeak: 'Tôi nói', learning: 'Tôi đang học', pron: '🎙️ Phát âm', title: 'Trò chơi của Harley – cách vui để học từ vựng và động từ',
    heroH: 'Cách vui để học từ vựng và động từ', heroP: 'Tìm từ, ô chữ và câu đố nhanh bằng 9 ngôn ngữ. Miễn phí, không cần đăng ký.',
    t_animals: 'Động vật', t_food: 'Đồ ăn và thức uống', t_town: 'Trong thành phố', t_verbs: 'Động từ hằng ngày', t_past: 'Thì quá khứ',
    g_wordsearch: 'Tìm từ', d_wordsearch: 'Tìm các từ ẩn trong bảng chữ.', g_crossword: 'Ô chữ', d_crossword: 'Điền vào ô theo gợi ý.',
    g_match: 'Ghép cặp', d_match: 'Ghép mỗi từ với nghĩa của nó.', g_unscramble: 'Xếp chữ', d_unscramble: 'Xếp các chữ cái theo đúng thứ tự.',
    played: '✓ Đã chơi {n} lần', promoH: 'Bạn có nói được không?', promoP: 'Harlo lắng nghe và chấm điểm phát âm của bạn theo từng âm.', promoGo: 'Thử Harlo →',
    aboutH: 'Cách chơi', about1: 'Chọn ngôn ngữ bạn đang học và một chủ đề, rồi chọn trò chơi. Chạm vào từ đã tìm được để nghe đọc to.',
    about2: 'Động từ có ở dạng nguyên mẫu và thì quá khứ, để bạn luyện những dạng sẽ thực sự dùng.',
    h_wordsearch: 'Kéo qua các chữ cái (hoặc chạm chữ đầu và chữ cuối) để tìm từng từ.', h_crossword: 'Chạm vào một ô hoặc một gợi ý rồi gõ. Dấu là tùy chọn: "e" được tính là "é".',
    h_match: 'Chạm vào một từ, rồi chạm vào nghĩa của nó.', h_unscramble: 'Chạm các chữ cái theo đúng thứ tự. Chạm chữ đã đặt để lấy lại.',
    found: 'Đã tìm {n}/{m}', across: 'Hàng ngang', down: 'Hàng dọc', check: 'Kiểm tra', reveal: 'Xem đáp án', toFix: 'Chữ cần sửa (màu đỏ): {n}', toGo: 'Ô còn lại: {n}',
    revealed: 'Đã hiện đáp án. Chạm vào gợi ý để nghe từ.', noCw: 'Không tạo được ô chữ cho chủ đề này. Hãy thử chủ đề khác.', wordOf: 'Từ {n}/{m}', hint: '💡 Gợi ý', skip: 'Bỏ qua',
    time: 'Thời gian: {s} giây · Lỗi: {m}', done3: 'Gâu gâu! Hoàn hảo!', done2: 'Gâu! Giỏi lắm!', done1: 'Gâu! Bạn làm được rồi!', again: 'Chơi lại', other: 'Trò chơi khác',
    promo2H: 'Giờ hãy nói to lên', promo2P: 'Luyện phát âm với Harlo. Harley sẽ cho bạn biết bạn nói thế nào.', pronLink: 'Phát âm với Harlo', privacy: 'Quyền riêng tư', terms: 'Điều khoản', adults: 'Dành cho người lớn từ 18 tuổi trở lên.', back: 'Tất cả trò chơi', listen: 'Nghe'
  }
};


// Topics and difficulty levels added later.
(function () {
  const K = ["t_home", "t_body", "t_clothes", "t_family", "t_nature", "t_present", "level", "easy", "medium", "hard", "wrongHard"];
  const S = {
    en: ["At home", "Body", "Clothes", "Family & people", "Weather & nature", "Present tense", "Difficulty", "Easy", "Medium", "Hard", "Not quite: {n} letters are still wrong."],
    es: ["En casa", "El cuerpo", "Ropa", "Familia y personas", "Tiempo y naturaleza", "Presente", "Dificultad", "Fácil", "Medio", "Difícil", "Casi: aún hay {n} letras mal."],
    fr: ["À la maison", "Le corps", "Vêtements", "Famille et personnes", "Météo et nature", "Présent", "Difficulté", "Facile", "Moyen", "Difficile", "Presque : il reste {n} lettres fausses."],
    it: ["In casa", "Il corpo", "Vestiti", "Famiglia e persone", "Meteo e natura", "Presente", "Difficoltà", "Facile", "Medio", "Difficile", "Quasi: ci sono ancora {n} lettere sbagliate."],
    de: ["Zu Hause", "Der Körper", "Kleidung", "Familie & Menschen", "Wetter & Natur", "Gegenwart", "Schwierigkeit", "Leicht", "Mittel", "Schwer", "Fast: Noch {n} Buchstaben sind falsch."],
    pt: ["Em casa", "O corpo", "Roupa", "Família e pessoas", "Tempo e natureza", "Presente", "Dificuldade", "Fácil", "Médio", "Difícil", "Quase: ainda há {n} letras erradas."],
    pl: ["W domu", "Ciało", "Ubrania", "Rodzina i ludzie", "Pogoda i przyroda", "Czas teraźniejszy", "Poziom", "Łatwy", "Średni", "Trudny", "Prawie: wciąż błędne litery: {n}."],
    ro: ["Acasă", "Corpul", "Haine", "Familie și oameni", "Vreme și natură", "Prezent", "Dificultate", "Ușor", "Mediu", "Greu", "Aproape: mai sunt {n} litere greșite."],
    uk: ["Удома", "Тіло", "Одяг", "Родина й люди", "Погода й природа", "Теперішній час", "Складність", "Легко", "Середньо", "Складно", "Майже: ще неправильних літер: {n}."],
    zh: ["家里", "身体", "衣服", "家人和人物", "天气和自然", "现在时", "难度", "简单", "中等", "困难", "差一点：还有 {n} 个字母不对。"],
    ar: ["في البيت", "الجسم", "الملابس", "العائلة والناس", "الطقس والطبيعة", "المضارع", "الصعوبة", "سهل", "متوسط", "صعب", "اقتربت: ما زالت هناك {n} حروف خاطئة."],
    nl: ["Thuis", "Lichaam", "Kleding", "Familie en mensen", "Weer en natuur", "Tegenwoordige tijd", "Moeilijkheid", "Makkelijk", "Gemiddeld", "Moeilijk", "Bijna: nog {n} letters fout."],
    tr: ["Evde", "Vücut", "Giysiler", "Aile ve insanlar", "Hava ve doğa", "Geniş zaman", "Zorluk", "Kolay", "Orta", "Zor", "Az kaldı: hâlâ {n} harf yanlış."],
    ja: ["家の中", "体", "服", "家族と人", "天気と自然", "現在形", "難易度", "かんたん", "ふつう", "むずかしい", "おしい！まだ{n}文字まちがっています。"],
    ko: ["집에서", "몸", "옷", "가족과 사람", "날씨와 자연", "현재형", "난이도", "쉬움", "보통", "어려움", "아쉬워요! 아직 {n}글자가 틀렸어요."],
    vi: ["Trong nhà", "Cơ thể", "Quần áo", "Gia đình và con người", "Thời tiết và thiên nhiên", "Thì hiện tại", "Độ khó", "Dễ", "Vừa", "Khó", "Gần đúng: vẫn còn {n} chữ sai."]
  };
  for (const l in S) K.forEach((k, i) => { window.HG_UI[l][k] = S[l][i]; });
})();

// Daily puzzle.
(function () {
  const K = ["dTitle", "dPlay", "dDone", "dStreak", "dStart", "dBest", "dShare", "dCopied", "dShareText", "dBack"];
  const S = {
    en: ["Daily puzzle", "Play today's →", "Done ✓", "🔥 {n}-day streak", "Play every day to build a streak", "best {n}", "Share", "Copied", "I solved today's Harley's Games puzzle!", "New puzzle tomorrow. See you then!"],
    es: ["Reto del día", "Jugar el de hoy →", "Hecho ✓", "🔥 Racha de {n} días", "Juega cada día para hacer una racha", "récord {n}", "Compartir", "Copiado", "¡He resuelto el reto de hoy de Harley's Games!", "Mañana hay uno nuevo. ¡Hasta mañana!"],
    fr: ["Défi du jour", "Jouer au défi →", "Terminé ✓", "🔥 Série de {n} jours", "Jouez chaque jour pour lancer une série", "record {n}", "Partager", "Copié", "J'ai résolu le défi du jour de Harley's Games !", "Nouveau défi demain. À demain !"],
    it: ["Sfida del giorno", "Gioca quella di oggi →", "Fatto ✓", "🔥 Serie di {n} giorni", "Gioca ogni giorno per fare una serie", "record {n}", "Condividi", "Copiato", "Ho risolto la sfida di oggi di Harley's Games!", "Domani una nuova sfida. A domani!"],
    de: ["Tagesrätsel", "Heutiges spielen →", "Erledigt ✓", "🔥 {n} Tage in Folge", "Spiel jeden Tag für eine Serie", "Rekord {n}", "Teilen", "Kopiert", "Ich habe das heutige Rätsel von Harley's Games gelöst!", "Morgen gibt's ein neues. Bis morgen!"],
    pt: ["Desafio do dia", "Jogar o de hoje →", "Feito ✓", "🔥 {n} dias seguidos", "Jogue todos os dias para fazer uma sequência", "recorde {n}", "Partilhar", "Copiado", "Resolvi o desafio de hoje do Harley's Games!", "Amanhã há um novo. Até amanhã!"],
    pl: ["Zagadka dnia", "Zagraj w dzisiejszą →", "Gotowe ✓", "🔥 Seria: {n} dni", "Graj codziennie, by zbudować serię", "rekord {n}", "Udostępnij", "Skopiowano", "Rozwiązałem dzisiejszą zagadkę Harley's Games!", "Jutro nowa zagadka. Do jutra!"],
    ro: ["Provocarea zilei", "Joacă provocarea de azi →", "Gata ✓", "🔥 {n} zile la rând", "Joacă zilnic ca să faci o serie", "record {n}", "Distribuie", "Copiat", "Am rezolvat provocarea de azi din Harley's Games!", "Mâine vine una nouă. Pe mâine!"],
    uk: ["Завдання дня", "Грати сьогоднішнє →", "Готово ✓", "🔥 {n} днів поспіль", "Грай щодня, щоб почати серію", "рекорд {n}", "Поділитися", "Скопійовано", "Я розв'язав сьогоднішнє завдання Harley's Games!", "Завтра буде нове. До завтра!"],
    zh: ["每日一题", "玩今天的 →", "已完成 ✓", "🔥 连续 {n} 天", "每天玩一次，累积连续天数", "最佳 {n}", "分享", "已复制", "我完成了今天的 Harley's Games 每日一题！", "明天有新题，明天见！"],
    ar: ["لغز اليوم", "العب لغز اليوم ←", "تم ✓", "🔥 {n} أيام متتالية", "العب كل يوم لتبدأ سلسلة", "الأفضل {n}", "مشاركة", "تم النسخ", "حللت لغز اليوم في Harley's Games!", "لغز جديد غدًا. نراك غدًا!"],
    nl: ["Puzzel van de dag", "Speel die van vandaag →", "Klaar ✓", "🔥 {n} dagen op rij", "Speel elke dag voor een reeks", "record {n}", "Delen", "Gekopieerd", "Ik heb de puzzel van vandaag van Harley's Games opgelost!", "Morgen een nieuwe. Tot morgen!"],
    tr: ["Günün bulmacası", "Bugünküyü oyna →", "Tamam ✓", "🔥 {n} günlük seri", "Seri yapmak için her gün oyna", "en iyi {n}", "Paylaş", "Kopyalandı", "Harley's Games'in bugünkü bulmacasını çözdüm!", "Yarın yeni bulmaca var. Yarın görüşürüz!"],
    ja: ["今日のパズル", "今日のパズルで遊ぶ →", "クリア ✓", "🔥 {n}日連続", "毎日遊んで連続記録を作ろう", "最高 {n}", "シェア", "コピーしました", "Harley's Games の今日のパズルを解きました！", "また明日、新しいパズルで会おう！"],
    ko: ["오늘의 퍼즐", "오늘 퍼즐 하기 →", "완료 ✓", "🔥 {n}일 연속", "매일 해서 연속 기록을 만드세요", "최고 {n}", "공유", "복사됨", "Harley's Games 오늘의 퍼즐을 풀었어요!", "내일 새 퍼즐이 나와요. 내일 만나요!"],
    vi: ["Câu đố hôm nay", "Chơi câu đố hôm nay →", "Xong ✓", "🔥 Chuỗi {n} ngày", "Chơi mỗi ngày để tạo chuỗi", "cao nhất {n}", "Chia sẻ", "Đã sao chép", "Mình đã giải câu đố hôm nay của Harley's Games!", "Mai có câu đố mới. Hẹn gặp lại!"]
  };
  for (const l in S) K.forEach((k, i) => { window.HG_UI[l][k] = S[l][i]; });
})();

// Game setup screen: pick a game first, then topic and level inside it.
(function () {
  const K = ['g_pick', 'g_topic', 'g_play', 't_random', 't_mix'];
  const S = {
    en: ["Pick a game", "Topic", "▶ Play", "Surprise me", "Mix of everything"],
    es: ["Elige un juego", "Tema", "▶ Jugar", "Sorpréndeme", "Un poco de todo"],
    fr: ["Choisis un jeu", "Thème", "▶ Jouer", "Surprends-moi", "Un peu de tout"],
    it: ["Scegli un gioco", "Argomento", "▶ Gioca", "Sorprendimi", "Un po' di tutto"],
    de: ["Wähle ein Spiel", "Thema", "▶ Spielen", "Überrasch mich", "Alles gemischt"],
    pt: ["Escolhe um jogo", "Tema", "▶ Jogar", "Surpreende-me", "Um pouco de tudo"],
    pl: ["Wybierz grę", "Temat", "▶ Graj", "Zaskocz mnie", "Wszystkiego po trochu"],
    ro: ["Alege un joc", "Temă", "▶ Joacă", "Surprinde-mă", "Câte puțin din toate"],
    uk: ["Обери гру", "Тема", "▶ Грати", "Здивуй мене", "Усього потроху"],
    zh: ["选择游戏", "主题", "▶ 开始", "随机", "混合所有主题"],
    ar: ["اختر لعبة", "الموضوع", "▶ العب", "فاجئني", "مزيج من كل شيء"],
    nl: ["Kies een spel", "Onderwerp", "▶ Spelen", "Verras me", "Van alles wat"],
    tr: ["Bir oyun seç", "Konu", "▶ Oyna", "Şaşırt beni", "Hepsinden biraz"],
    ja: ["ゲームを選ぶ", "テーマ", "▶ プレイ", "おまかせ", "全部ミックス"],
    ko: ["게임 선택", "주제", "▶ 시작", "랜덤", "모두 섞기"],
    vi: ["Chọn trò chơi", "Chủ đề", "▶ Chơi", "Ngẫu nhiên", "Trộn tất cả"]
  };
  for (const l in S) K.forEach((k, i) => { window.HG_UI[l][k] = S[l][i]; });
  const A = {"en": "Choose a game, then pick a topic and how hard you want it. Tap any word you've found to hear it said out loud.", "es": "Elige un juego y luego un tema y la dificultad. Toca cualquier palabra que encuentres para oírla en voz alta.", "fr": "Choisis un jeu, puis un thème et la difficulté. Touche un mot trouvé pour l'entendre à voix haute.", "it": "Scegli un gioco, poi un argomento e la difficoltà. Tocca una parola trovata per sentirla pronunciare.", "de": "Wähle ein Spiel, dann ein Thema und den Schwierigkeitsgrad. Tippe auf ein gefundenes Wort, um es zu hören.", "pt": "Escolhe um jogo e depois um tema e a dificuldade. Toca numa palavra encontrada para a ouvir em voz alta.", "pl": "Wybierz grę, potem temat i poziom trudności. Dotknij znalezionego słowa, aby je usłyszeć.", "ro": "Alege un joc, apoi o temă și dificultatea. Atinge orice cuvânt găsit ca să-l auzi pronunțat.", "uk": "Обери гру, потім тему й складність. Торкнися знайденого слова, щоб почути його вимову.", "zh": "先选择游戏，再选择主题和难度。点击找到的单词即可听到发音。", "ar": "اختر لعبة، ثم موضوعًا ومستوى الصعوبة. اضغط على أي كلمة وجدتها لتسمع نطقها.", "nl": "Kies een spel en daarna een onderwerp en de moeilijkheid. Tik op een gevonden woord om het te horen.", "tr": "Bir oyun seç, sonra konu ve zorluk seviyesini belirle. Bulduğun bir kelimeye dokunarak sesli dinle.", "ja": "ゲームを選んでから、テーマと難しさを選びます。見つけた単語をタップすると発音が聞けます。", "ko": "게임을 고른 다음 주제와 난이도를 선택하세요. 찾은 단어를 누르면 발음을 들을 수 있어요.", "vi": "Chọn trò chơi, rồi chọn chủ đề và độ khó. Chạm vào từ bạn tìm được để nghe phát âm."};
  for (const l in A) window.HG_UI[l].about1 = A[l];
})();

// Timer and personal bests
(function () {
  const S = {"en": ["Best: {t}", "New personal best!"], "es": ["Mejor: {t}", "¡Nuevo récord personal!"], "fr": ["Record : {t}", "Nouveau record perso !"], "it": ["Record: {t}", "Nuovo record personale!"], "de": ["Bestzeit: {t}", "Neue Bestzeit!"], "pt": ["Melhor: {t}", "Novo recorde pessoal!"], "pl": ["Rekord: {t}", "Nowy rekord!"], "ro": ["Record: {t}", "Nou record personal!"], "uk": ["Рекорд: {t}", "Новий особистий рекорд!"], "zh": ["最佳：{t}", "新的个人纪录！"], "ar": ["الأفضل: {t}", "رقم قياسي شخصي جديد!"], "nl": ["Record: {t}", "Nieuw persoonlijk record!"], "tr": ["En iyi: {t}", "Yeni kişisel rekor!"], "ja": ["ベスト：{t}", "自己ベスト更新！"], "ko": ["최고 기록: {t}", "개인 최고 기록 경신!"], "vi": ["Tốt nhất: {t}", "Kỷ lục cá nhân mới!"]};
  for (const l in S) { window.HG_UI[l].g_best = S[l][0]; window.HG_UI[l].g_newBest = S[l][1]; }
})();

// Five new games
(function () {
  const K = ["g_sayit", "d_sayit", "h_sayit", "g_listen", "d_listen", "h_listen", "g_hangman", "d_hangman", "h_hangman", "g_wordday", "d_wordday", "h_wordday", "g_fill", "d_fill", "h_fill", "n_noMic", "n_tapSay", "n_skip", "n_timeUp", "n_great", "n_listening", "n_heard", "n_whichWord", "n_noVoice", "n_letters", "n_wordWas", "n_tomorrow", "n_err"];
  const S = {
    en: ["Say it to win", "Say each word before the time runs out.", "Tap the mic and say the word out loud before the bar runs out.", "Listen and pick", "Harley says a word. Which one was it?", "Listen, then tap the word you heard. Tap 🔊 to hear it again.", "Harley's biscuits", "Guess the word before Harley eats his biscuits.", "Tap letters to guess the word. Every wrong letter, Harley eats a biscuit!", "Word of the day", "One new word a day. Guess it in 6 tries.", "Type a guess. 🟩 right place, 🟨 in the word but somewhere else, ⬜ not in the word.", "Fill the gap", "Pick the missing word in real phrases.", "Tap the word that completes the phrase.", "This game needs speech recognition. Try Chrome, Edge or Safari.", "Tap the mic and say it!", "Skip", "Time's up!", "Great!", "Listening…", "I heard: {w}", "Which word did Harley say?", "Your browser can't speak words out loud. Try Chrome, Edge or Safari.", "Use all {n} letters", "The word was", "Come back tomorrow for a new word!", "Sorry, that didn't load. Please try again."],
    es: ["Dilo para ganar", "Di cada palabra antes de que se acabe el tiempo.", "Toca el micro y di la palabra en voz alta antes de que se acabe la barra.", "Escucha y elige", "Harley dice una palabra. ¿Cuál fue?", "Escucha y toca la palabra que oíste. Toca 🔊 para oírla otra vez.", "Las galletas de Harley", "Adivina la palabra antes de que Harley se coma sus galletas.", "Toca letras para adivinar la palabra. ¡Por cada letra incorrecta, Harley se come una galleta!", "Palabra del día", "Una palabra nueva cada día. Adivínala en 6 intentos.", "Escribe una palabra. 🟩 lugar correcto, 🟨 está pero en otro lugar, ⬜ no está.", "Completa el hueco", "Elige la palabra que falta en frases reales.", "Toca la palabra que completa la frase.", "Este juego necesita reconocimiento de voz. Prueba Chrome, Edge o Safari.", "¡Toca el micro y dila!", "Saltar", "¡Se acabó el tiempo!", "¡Genial!", "Escuchando…", "He oído: {w}", "¿Qué palabra dijo Harley?", "Tu navegador no puede leer palabras en voz alta. Prueba Chrome, Edge o Safari.", "Usa las {n} letras", "La palabra era", "¡Vuelve mañana para una palabra nueva!", "No se ha podido cargar. Inténtalo de nuevo."],
    fr: ["Dis-le pour gagner", "Dis chaque mot avant la fin du temps.", "Touche le micro et dis le mot à voix haute avant que la barre ne se vide.", "Écoute et choisis", "Harley dit un mot. Lequel ?", "Écoute puis touche le mot entendu. Touche 🔊 pour le réécouter.", "Les biscuits de Harley", "Trouve le mot avant que Harley ne mange ses biscuits.", "Touche des lettres pour deviner le mot. À chaque erreur, Harley mange un biscuit !", "Mot du jour", "Un nouveau mot par jour. Trouve-le en 6 essais.", "Tape un mot. 🟩 bonne place, 🟨 dans le mot mais ailleurs, ⬜ absent.", "Texte à trous", "Choisis le mot manquant dans de vraies phrases.", "Touche le mot qui complète la phrase.", "Ce jeu nécessite la reconnaissance vocale. Essaie Chrome, Edge ou Safari.", "Touche le micro et dis-le !", "Passer", "Temps écoulé !", "Bravo !", "J'écoute…", "J'ai entendu : {w}", "Quel mot Harley a-t-il dit ?", "Ton navigateur ne peut pas lire les mots à voix haute. Essaie Chrome, Edge ou Safari.", "Utilise les {n} lettres", "Le mot était", "Reviens demain pour un nouveau mot !", "Le chargement a échoué. Réessaie."],
    it: ["Dillo per vincere", "Di' ogni parola prima che scada il tempo.", "Tocca il microfono e di' la parola ad alta voce prima che la barra finisca.", "Ascolta e scegli", "Harley dice una parola. Quale?", "Ascolta, poi tocca la parola che hai sentito. Tocca 🔊 per riascoltarla.", "I biscotti di Harley", "Indovina la parola prima che Harley mangi i suoi biscotti.", "Tocca le lettere per indovinare. A ogni errore, Harley mangia un biscotto!", "Parola del giorno", "Una parola nuova al giorno. Indovinala in 6 tentativi.", "Scrivi una parola. 🟩 posto giusto, 🟨 c'è ma altrove, ⬜ non c'è.", "Riempi lo spazio", "Scegli la parola mancante in frasi vere.", "Tocca la parola che completa la frase.", "Questo gioco richiede il riconoscimento vocale. Prova Chrome, Edge o Safari.", "Tocca il microfono e dilla!", "Salta", "Tempo scaduto!", "Ottimo!", "Ascolto…", "Ho sentito: {w}", "Quale parola ha detto Harley?", "Il tuo browser non può leggere le parole ad alta voce. Prova Chrome, Edge o Safari.", "Usa tutte le {n} lettere", "La parola era", "Torna domani per una nuova parola!", "Caricamento non riuscito. Riprova."],
    de: ["Sag es und gewinn", "Sag jedes Wort, bevor die Zeit abläuft.", "Tippe aufs Mikro und sag das Wort laut, bevor der Balken leer ist.", "Hör hin und wähl", "Harley sagt ein Wort. Welches war es?", "Hör zu und tippe auf das Wort, das du gehört hast. 🔊 spielt es nochmal.", "Harleys Kekse", "Errate das Wort, bevor Harley seine Kekse isst.", "Tippe Buchstaben an. Bei jedem falschen Buchstaben isst Harley einen Keks!", "Wort des Tages", "Jeden Tag ein neues Wort. Errate es in 6 Versuchen.", "Gib ein Wort ein. 🟩 richtige Stelle, 🟨 im Wort, aber woanders, ⬜ nicht im Wort.", "Lückentext", "Wähle das fehlende Wort in echten Sätzen.", "Tippe auf das Wort, das den Satz vervollständigt.", "Dieses Spiel braucht Spracherkennung. Probiere Chrome, Edge oder Safari.", "Tippe aufs Mikro und sag es!", "Überspringen", "Zeit abgelaufen!", "Super!", "Ich höre zu…", "Gehört: {w}", "Welches Wort hat Harley gesagt?", "Dein Browser kann keine Wörter vorlesen. Probiere Chrome, Edge oder Safari.", "Nutze alle {n} Buchstaben", "Das Wort war", "Komm morgen für ein neues Wort wieder!", "Laden fehlgeschlagen. Bitte versuch es nochmal."],
    pt: ["Diz para ganhar", "Diz cada palavra antes de o tempo acabar.", "Toca no micro e diz a palavra em voz alta antes de a barra acabar.", "Ouve e escolhe", "O Harley diz uma palavra. Qual foi?", "Ouve e toca na palavra que ouviste. Toca em 🔊 para ouvir outra vez.", "Os biscoitos do Harley", "Adivinha a palavra antes de o Harley comer os biscoitos.", "Toca nas letras para adivinhar. A cada erro, o Harley come um biscoito!", "Palavra do dia", "Uma palavra nova por dia. Adivinha em 6 tentativas.", "Escreve uma palavra. 🟩 lugar certo, 🟨 está mas noutro lugar, ⬜ não está.", "Preenche o espaço", "Escolhe a palavra que falta em frases reais.", "Toca na palavra que completa a frase.", "Este jogo precisa de reconhecimento de voz. Experimenta o Chrome, Edge ou Safari.", "Toca no micro e diz!", "Saltar", "Acabou o tempo!", "Boa!", "A ouvir…", "Ouvi: {w}", "Que palavra disse o Harley?", "O teu navegador não consegue dizer palavras em voz alta. Experimenta o Chrome, Edge ou Safari.", "Usa as {n} letras", "A palavra era", "Volta amanhã para uma palavra nova!", "Não carregou. Tenta outra vez."],
    pl: ["Powiedz i wygraj", "Powiedz każde słowo, zanim skończy się czas.", "Dotknij mikrofonu i powiedz słowo na głos, zanim pasek się skończy.", "Posłuchaj i wybierz", "Harley mówi słowo. Które to było?", "Posłuchaj i dotknij usłyszanego słowa. 🔊 odtwarza je ponownie.", "Ciasteczka Harleya", "Odgadnij słowo, zanim Harley zje ciasteczka.", "Dotykaj liter, by odgadnąć słowo. Za każdą złą literę Harley zjada ciasteczko!", "Słowo dnia", "Codziennie nowe słowo. Odgadnij je w 6 próbach.", "Wpisz słowo. 🟩 dobre miejsce, 🟨 jest, ale gdzie indziej, ⬜ nie ma.", "Uzupełnij lukę", "Wybierz brakujące słowo w prawdziwych zdaniach.", "Dotknij słowa, które uzupełnia zdanie.", "Ta gra wymaga rozpoznawania mowy. Spróbuj Chrome, Edge lub Safari.", "Dotknij mikrofonu i powiedz!", "Pomiń", "Koniec czasu!", "Świetnie!", "Słucham…", "Usłyszałem: {w}", "Które słowo powiedział Harley?", "Twoja przeglądarka nie czyta słów na głos. Spróbuj Chrome, Edge lub Safari.", "Użyj wszystkich {n} liter", "Słowo to", "Wróć jutro po nowe słowo!", "Nie udało się wczytać. Spróbuj ponownie."],
    ro: ["Spune și câștigă", "Spune fiecare cuvânt înainte să expire timpul.", "Atinge microfonul și spune cuvântul cu voce tare înainte să se termine bara.", "Ascultă și alege", "Harley spune un cuvânt. Care a fost?", "Ascultă, apoi atinge cuvântul auzit. Atinge 🔊 ca să-l reauzi.", "Biscuiții lui Harley", "Ghicește cuvântul înainte ca Harley să-și mănânce biscuiții.", "Atinge litere ca să ghicești. La fiecare greșeală, Harley mănâncă un biscuit!", "Cuvântul zilei", "Un cuvânt nou pe zi. Ghicește-l din 6 încercări.", "Scrie un cuvânt. 🟩 loc corect, 🟨 e în cuvânt, dar altundeva, ⬜ nu e.", "Completează golul", "Alege cuvântul care lipsește din fraze reale.", "Atinge cuvântul care completează fraza.", "Jocul are nevoie de recunoaștere vocală. Încearcă Chrome, Edge sau Safari.", "Atinge microfonul și spune-l!", "Sari peste", "Timpul a expirat!", "Super!", "Ascult…", "Am auzit: {w}", "Ce cuvânt a spus Harley?", "Browserul tău nu poate citi cuvinte cu voce tare. Încearcă Chrome, Edge sau Safari.", "Folosește toate cele {n} litere", "Cuvântul era", "Revino mâine pentru un cuvânt nou!", "Nu s-a putut încărca. Încearcă din nou."],
    uk: ["Скажи й виграй", "Скажи кожне слово, поки не скінчився час.", "Торкнися мікрофона й скажи слово вголос, поки смужка не зникла.", "Послухай і обери", "Harley каже слово. Яке саме?", "Послухай і торкнися почутого слова. 🔊 — ще раз.", "Печиво Harley", "Вгадай слово, поки Harley не з’їв печиво.", "Торкайся літер. За кожну помилку Harley з’їдає печиво!", "Слово дня", "Щодня нове слово. Вгадай його за 6 спроб.", "Введи слово. 🟩 на місці, 🟨 є, але не там, ⬜ немає.", "Заповни пропуск", "Обери пропущене слово в справжніх фразах.", "Торкнися слова, що завершує фразу.", "Ця гра потребує розпізнавання мовлення. Спробуй Chrome, Edge або Safari.", "Торкнися мікрофона й скажи!", "Пропустити", "Час вийшов!", "Чудово!", "Слухаю…", "Я почув: {w}", "Яке слово сказав Harley?", "Твій браузер не вміє читати слова вголос. Спробуй Chrome, Edge або Safari.", "Використай усі {n} літер", "Слово було", "Повертайся завтра по нове слово!", "Не вдалося завантажити. Спробуй ще раз."],
    zh: ["说出来就赢", "在时间结束前说出每个单词。", "点击麦克风，在进度条结束前大声说出单词。", "听音选词", "Harley 说了一个词。是哪个？", "听完后点击你听到的单词。点 🔊 再听一次。", "Harley 的饼干", "在 Harley 吃完饼干前猜出单词。", "点字母来猜单词。每猜错一个，Harley 就吃掉一块饼干！", "每日一词", "每天一个新单词，6 次机会猜出来。", "输入猜测。🟩 位置正确，🟨 有但位置不对，⬜ 没有这个字母。", "填空", "在真实短语中选出缺少的词。", "点击能补全短语的单词。", "这个游戏需要语音识别。请使用 Chrome、Edge 或 Safari。", "点麦克风说出来！", "跳过", "时间到！", "太棒了！", "正在听…", "我听到：{w}", "Harley 说的是哪个词？", "你的浏览器无法朗读单词。请使用 Chrome、Edge 或 Safari。", "请用满 {n} 个字母", "这个词是", "明天再来猜新词吧！", "加载失败，请重试。"],
    ar: ["قلها لتفوز", "قل كل كلمة قبل انتهاء الوقت.", "اضغط على الميكروفون وقل الكلمة بصوت عالٍ قبل أن ينتهي الشريط.", "استمع واختر", "يقول Harley كلمة. ما هي؟", "استمع ثم اضغط على الكلمة التي سمعتها. اضغط 🔊 لسماعها مرة أخرى.", "بسكويت Harley", "خمّن الكلمة قبل أن يأكل Harley بسكويته.", "اضغط على الحروف لتخمين الكلمة. مع كل حرف خاطئ يأكل Harley قطعة بسكويت!", "كلمة اليوم", "كلمة جديدة كل يوم. خمّنها في 6 محاولات.", "اكتب تخمينًا. 🟩 مكان صحيح، 🟨 موجود في مكان آخر، ⬜ غير موجود.", "املأ الفراغ", "اختر الكلمة الناقصة في عبارات حقيقية.", "اضغط على الكلمة التي تكمل العبارة.", "تحتاج هذه اللعبة إلى التعرّف على الكلام. جرّب Chrome أو Edge أو Safari.", "اضغط على الميكروفون وقلها!", "تخطَّ", "انتهى الوقت!", "رائع!", "أستمع…", "سمعت: {w}", "ما الكلمة التي قالها Harley؟", "لا يستطيع متصفحك نطق الكلمات. جرّب Chrome أو Edge أو Safari.", "استخدم كل الحروف الـ{n}", "كانت الكلمة", "عُد غدًا لكلمة جديدة!", "تعذّر التحميل. حاول مرة أخرى."],
    nl: ["Zeg het en win", "Zeg elk woord voordat de tijd om is.", "Tik op de microfoon en zeg het woord hardop voordat de balk leeg is.", "Luister en kies", "Harley zegt een woord. Welk was het?", "Luister en tik op het woord dat je hoorde. Tik op 🔊 om het opnieuw te horen.", "Harleys koekjes", "Raad het woord voordat Harley zijn koekjes opeet.", "Tik letters aan. Bij elke foute letter eet Harley een koekje!", "Woord van de dag", "Elke dag een nieuw woord. Raad het in 6 pogingen.", "Typ een gok. 🟩 juiste plek, 🟨 zit erin maar ergens anders, ⬜ zit er niet in.", "Vul het gat", "Kies het ontbrekende woord in echte zinnen.", "Tik op het woord dat de zin afmaakt.", "Dit spel heeft spraakherkenning nodig. Probeer Chrome, Edge of Safari.", "Tik op de microfoon en zeg het!", "Overslaan", "De tijd is om!", "Super!", "Ik luister…", "Ik hoorde: {w}", "Welk woord zei Harley?", "Je browser kan geen woorden voorlezen. Probeer Chrome, Edge of Safari.", "Gebruik alle {n} letters", "Het woord was", "Kom morgen terug voor een nieuw woord!", "Laden mislukt. Probeer het opnieuw."],
    tr: ["Söyle ve kazan", "Süre bitmeden her kelimeyi söyle.", "Mikrofona dokun ve çubuk bitmeden kelimeyi sesli söyle.", "Dinle ve seç", "Harley bir kelime söylüyor. Hangisiydi?", "Dinle, sonra duyduğun kelimeye dokun. Tekrar dinlemek için 🔊.", "Harley'nin kurabiyeleri", "Harley kurabiyelerini yemeden kelimeyi bul.", "Harflere dokunarak tahmin et. Her yanlış harfte Harley bir kurabiye yer!", "Günün kelimesi", "Her gün yeni bir kelime. 6 denemede bul.", "Bir tahmin yaz. 🟩 doğru yer, 🟨 kelimede ama başka yerde, ⬜ kelimede yok.", "Boşluğu doldur", "Gerçek cümlelerdeki eksik kelimeyi seç.", "Cümleyi tamamlayan kelimeye dokun.", "Bu oyun konuşma tanıma gerektirir. Chrome, Edge veya Safari dene.", "Mikrofona dokun ve söyle!", "Geç", "Süre doldu!", "Harika!", "Dinliyorum…", "Duyduğum: {w}", "Harley hangi kelimeyi söyledi?", "Tarayıcın kelimeleri sesli okuyamıyor. Chrome, Edge veya Safari dene.", "{n} harfin hepsini kullan", "Kelime şuydu", "Yeni kelime için yarın gel!", "Yüklenemedi. Tekrar dene."],
    ja: ["言えたら勝ち", "時間切れになる前に単語を言おう。", "マイクをタップして、バーがなくなる前に単語を声に出して言おう。", "聞いて選ぶ", "Harley が単語を言います。どれだった？", "聞いて、聞こえた単語をタップ。🔊 でもう一度聞けます。", "Harley のビスケット", "Harley がビスケットを食べ終わる前に単語を当てよう。", "文字をタップして単語を当てよう。間違えるたびに Harley がビスケットを1枚食べちゃう！", "今日の単語", "毎日新しい単語。6回以内に当てよう。", "単語を入力。🟩 位置も正解、🟨 単語にあるが別の位置、⬜ 含まれない。", "穴埋め", "実際のフレーズの抜けた単語を選ぼう。", "フレーズを完成させる単語をタップ。", "このゲームには音声認識が必要です。Chrome、Edge、Safari をお試しください。", "マイクをタップして言ってみよう！", "スキップ", "時間切れ！", "すごい！", "聞いています…", "聞こえた言葉：{w}", "Harley が言ったのはどの単語？", "お使いのブラウザは単語を読み上げられません。Chrome、Edge、Safari をお試しください。", "{n} 文字すべて使ってください", "正解は", "明日また新しい単語で遊ぼう！", "読み込めませんでした。もう一度お試しください。"],
    ko: ["말하면 승리", "시간이 끝나기 전에 단어를 말하세요.", "마이크를 누르고 막대가 끝나기 전에 단어를 소리 내어 말하세요.", "듣고 고르기", "Harley가 단어를 말해요. 어떤 단어였을까요?", "듣고 들린 단어를 누르세요. 🔊 를 누르면 다시 들을 수 있어요.", "Harley의 비스킷", "Harley가 비스킷을 다 먹기 전에 단어를 맞히세요.", "글자를 눌러 단어를 맞히세요. 틀릴 때마다 Harley가 비스킷을 하나씩 먹어요!", "오늘의 단어", "매일 새 단어. 6번 안에 맞혀 보세요.", "추측을 입력하세요. 🟩 자리까지 정답, 🟨 단어에 있지만 다른 자리, ⬜ 없음.", "빈칸 채우기", "실제 문장에서 빠진 단어를 고르세요.", "문장을 완성하는 단어를 누르세요.", "이 게임은 음성 인식이 필요해요. Chrome, Edge 또는 Safari를 사용해 보세요.", "마이크를 누르고 말해 보세요!", "건너뛰기", "시간 종료!", "잘했어요!", "듣는 중…", "들린 말: {w}", "Harley가 말한 단어는?", "브라우저가 단어를 읽어 줄 수 없어요. Chrome, Edge 또는 Safari를 사용해 보세요.", "{n}글자를 모두 사용하세요", "정답은", "내일 새 단어로 다시 만나요!", "불러오지 못했어요. 다시 시도해 주세요."],
    vi: ["Nói để thắng", "Nói từng từ trước khi hết giờ.", "Chạm micro và nói to từ đó trước khi thanh thời gian hết.", "Nghe và chọn", "Harley nói một từ. Đó là từ nào?", "Nghe rồi chạm vào từ bạn nghe thấy. Chạm 🔊 để nghe lại.", "Bánh quy của Harley", "Đoán từ trước khi Harley ăn hết bánh quy.", "Chạm chữ cái để đoán. Mỗi lần sai, Harley ăn một chiếc bánh quy!", "Từ của ngày", "Mỗi ngày một từ mới. Đoán trong 6 lần.", "Nhập dự đoán. 🟩 đúng vị trí, 🟨 có trong từ nhưng sai chỗ, ⬜ không có.", "Điền vào chỗ trống", "Chọn từ còn thiếu trong câu thật.", "Chạm vào từ hoàn thành câu.", "Trò chơi này cần nhận dạng giọng nói. Hãy dùng Chrome, Edge hoặc Safari.", "Chạm micro và nói!", "Bỏ qua", "Hết giờ!", "Tuyệt!", "Đang nghe…", "Tôi nghe: {w}", "Harley đã nói từ nào?", "Trình duyệt của bạn không đọc được từ. Hãy dùng Chrome, Edge hoặc Safari.", "Dùng đủ {n} chữ cái", "Từ đó là", "Mai quay lại với từ mới nhé!", "Không tải được. Hãy thử lại."]
  };
  for (const l in S) K.forEach((k, i) => { window.HG_UI[l][k] = S[l][i]; });
})();
