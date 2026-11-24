// Harley's Games word lists. Format: [word, clue]. Clues are in English.
// For English the clue is a simple definition (it's the language being learnt);
// for other languages it's the English meaning. Past tense: Spanish and Portuguese use
// the simple past ("I ate"); French, Italian, German and Dutch use the past participle
// shown inside its usual phrase ("j'ai ___").
// Words shorter than 3 letters are only used in Match pairs.
window.HG_TOPICS = [
  { id: 'animals', name: 'Animals', ic: '🐾' },
  { id: 'food', name: 'Food & drink', ic: '🍎' },
  { id: 'town', name: 'Around town', ic: '🏙️' },
  { id: 'verbs', name: 'Everyday verbs', ic: '🏃' },
  { id: 'past', name: 'Past tense', ic: '⏪' }
];

window.HG_WORDS = {
  en: {
    animals: [['dog', 'Pet that barks'], ['cat', 'Pet that purrs'], ['horse', 'Large animal you can ride'], ['bird', 'Animal with feathers that can fly'], ['fish', 'Animal that swims and lives in water'], ['cow', 'Farm animal that gives us milk'], ['pig', 'Pink farm animal that says oink'], ['sheep', 'Farm animal that gives us wool'], ['rabbit', 'Small animal with long ears'], ['mouse', 'Small animal that loves cheese'], ['duck', 'Bird that swims and says quack'], ['hen', 'Female chicken that lays eggs']],
    food: [['bread', 'You make toast and sandwiches with it'], ['cheese', 'Food made from milk; mice love it'], ['water', 'Clear drink that comes from the tap'], ['milk', 'White drink that comes from cows'], ['apple', 'Round fruit, red or green'], ['egg', 'A hen lays it'], ['rice', 'Small white grains, cooked in water'], ['coffee', 'Hot drink made from roasted beans'], ['tea', 'Hot drink made with leaves'], ['sugar', 'Sweet white stuff you can add to tea'], ['salt', 'White stuff that makes food salty'], ['butter', 'Yellow spread for bread']],
    town: [['street', 'Road in a town with houses and shops'], ['station', 'Where you catch a train'], ['airport', 'Where planes take off and land'], ['bridge', 'It takes a road over a river'], ['church', 'Building where Christians pray'], ['market', 'Place with stalls selling fresh food'], ['museum', 'Building where you see old and famous things'], ['hospital', 'Where doctors look after sick people'], ['park', 'Green public space with grass and trees'], ['shop', 'Place where you buy things'], ['bank', 'Where you keep your money'], ['square', 'Open public space in a town centre']],
    verbs: [['eat', 'To put food in your mouth and swallow it'], ['drink', 'To swallow water, juice or tea'], ['sleep', 'What you do in bed at night'], ['walk', 'To move on foot'], ['speak', 'To say words out loud'], ['read', 'What you do with a book'], ['write', 'To put words on paper with a pen'], ['buy', 'To get something by paying for it'], ['open', 'The opposite of close'], ['close', 'The opposite of open'], ['sing', 'To make music with your voice'], ['dance', 'To move your body to music']],
    past: [['ate', "Past tense of 'eat'"], ['drank', "Past tense of 'drink'"], ['slept', "Past tense of 'sleep'"], ['walked', "Past tense of 'walk'"], ['spoke', "Past tense of 'speak'"], ['wrote', "Past tense of 'write'"], ['bought', "Past tense of 'buy'"], ['went', "Past tense of 'go'"], ['saw', "Past tense of 'see'"], ['sang', "Past tense of 'sing'"], ['danced', "Past tense of 'dance'"], ['opened', "Past tense of 'open'"]]
  },
  es: {
    animals: [['perro', 'dog'], ['gato', 'cat'], ['caballo', 'horse'], ['pájaro', 'bird'], ['pez', 'fish'], ['vaca', 'cow'], ['cerdo', 'pig'], ['oveja', 'sheep'], ['conejo', 'rabbit'], ['ratón', 'mouse'], ['pato', 'duck'], ['gallina', 'hen']],
    food: [['pan', 'bread'], ['queso', 'cheese'], ['agua', 'water'], ['leche', 'milk'], ['manzana', 'apple'], ['huevo', 'egg'], ['arroz', 'rice'], ['café', 'coffee'], ['té', 'tea'], ['azúcar', 'sugar'], ['sal', 'salt'], ['mantequilla', 'butter']],
    town: [['calle', 'street'], ['estación', 'station'], ['aeropuerto', 'airport'], ['puente', 'bridge'], ['iglesia', 'church'], ['mercado', 'market'], ['museo', 'museum'], ['hospital', 'hospital'], ['parque', 'park'], ['tienda', 'shop'], ['banco', 'bank'], ['plaza', 'square']],
    verbs: [['comer', 'to eat'], ['beber', 'to drink'], ['dormir', 'to sleep'], ['caminar', 'to walk'], ['hablar', 'to speak'], ['leer', 'to read'], ['escribir', 'to write'], ['comprar', 'to buy'], ['abrir', 'to open'], ['cerrar', 'to close'], ['cantar', 'to sing'], ['bailar', 'to dance']],
    past: [['comí', 'comer → I ate'], ['bebí', 'beber → I drank'], ['dormí', 'dormir → I slept'], ['caminé', 'caminar → I walked'], ['hablé', 'hablar → I spoke'], ['escribí', 'escribir → I wrote'], ['compré', 'comprar → I bought'], ['fui', 'ir → I went'], ['vi', 'ver → I saw'], ['canté', 'cantar → I sang'], ['bailé', 'bailar → I danced'], ['abrí', 'abrir → I opened']]
  },
  fr: {
    animals: [['chien', 'dog'], ['chat', 'cat'], ['cheval', 'horse'], ['oiseau', 'bird'], ['poisson', 'fish'], ['vache', 'cow'], ['cochon', 'pig'], ['mouton', 'sheep'], ['lapin', 'rabbit'], ['souris', 'mouse'], ['canard', 'duck'], ['poule', 'hen']],
    food: [['pain', 'bread'], ['fromage', 'cheese'], ['eau', 'water'], ['lait', 'milk'], ['pomme', 'apple'], ['œuf', 'egg'], ['riz', 'rice'], ['café', 'coffee'], ['thé', 'tea'], ['sucre', 'sugar'], ['sel', 'salt'], ['beurre', 'butter']],
    town: [['rue', 'street'], ['gare', 'station'], ['aéroport', 'airport'], ['pont', 'bridge'], ['église', 'church'], ['marché', 'market'], ['musée', 'museum'], ['hôpital', 'hospital'], ['parc', 'park'], ['magasin', 'shop'], ['banque', 'bank'], ['place', 'square']],
    verbs: [['manger', 'to eat'], ['boire', 'to drink'], ['dormir', 'to sleep'], ['marcher', 'to walk'], ['parler', 'to speak'], ['lire', 'to read'], ['écrire', 'to write'], ['acheter', 'to buy'], ['ouvrir', 'to open'], ['fermer', 'to close'], ['chanter', 'to sing'], ['danser', 'to dance']],
    past: [['mangé', "manger → j'ai ___ (I ate)"], ['bu', "boire → j'ai ___ (I drank)"], ['dormi', "dormir → j'ai ___ (I slept)"], ['marché', "marcher → j'ai ___ (I walked)"], ['parlé', "parler → j'ai ___ (I spoke)"], ['écrit', "écrire → j'ai ___ (I wrote)"], ['acheté', "acheter → j'ai ___ (I bought)"], ['allé', 'aller → je suis ___ (I went)'], ['vu', "voir → j'ai ___ (I saw)"], ['chanté', "chanter → j'ai ___ (I sang)"], ['dansé', "danser → j'ai ___ (I danced)"], ['ouvert', "ouvrir → j'ai ___ (I opened)"]]
  },
  it: {
    animals: [['cane', 'dog'], ['gatto', 'cat'], ['cavallo', 'horse'], ['uccello', 'bird'], ['pesce', 'fish'], ['mucca', 'cow'], ['maiale', 'pig'], ['pecora', 'sheep'], ['coniglio', 'rabbit'], ['topo', 'mouse'], ['anatra', 'duck'], ['gallina', 'hen']],
    food: [['pane', 'bread'], ['formaggio', 'cheese'], ['acqua', 'water'], ['latte', 'milk'], ['mela', 'apple'], ['uovo', 'egg'], ['riso', 'rice'], ['caffè', 'coffee'], ['tè', 'tea'], ['zucchero', 'sugar'], ['sale', 'salt'], ['burro', 'butter']],
    town: [['strada', 'street'], ['stazione', 'station'], ['aeroporto', 'airport'], ['ponte', 'bridge'], ['chiesa', 'church'], ['mercato', 'market'], ['museo', 'museum'], ['ospedale', 'hospital'], ['parco', 'park'], ['negozio', 'shop'], ['banca', 'bank'], ['piazza', 'square']],
    verbs: [['mangiare', 'to eat'], ['bere', 'to drink'], ['dormire', 'to sleep'], ['camminare', 'to walk'], ['parlare', 'to speak'], ['leggere', 'to read'], ['scrivere', 'to write'], ['comprare', 'to buy'], ['aprire', 'to open'], ['chiudere', 'to close'], ['cantare', 'to sing'], ['ballare', 'to dance']],
    past: [['mangiato', 'mangiare → ho ___ (I ate)'], ['bevuto', 'bere → ho ___ (I drank)'], ['dormito', 'dormire → ho ___ (I slept)'], ['camminato', 'camminare → ho ___ (I walked)'], ['parlato', 'parlare → ho ___ (I spoke)'], ['scritto', 'scrivere → ho ___ (I wrote)'], ['comprato', 'comprare → ho ___ (I bought)'], ['andato', 'andare → sono ___ (I went)'], ['visto', 'vedere → ho ___ (I saw)'], ['cantato', 'cantare → ho ___ (I sang)'], ['ballato', 'ballare → ho ___ (I danced)'], ['aperto', 'aprire → ho ___ (I opened)']]
  },
  de: {
    animals: [['Hund', 'dog'], ['Katze', 'cat'], ['Pferd', 'horse'], ['Vogel', 'bird'], ['Fisch', 'fish'], ['Kuh', 'cow'], ['Schwein', 'pig'], ['Schaf', 'sheep'], ['Kaninchen', 'rabbit'], ['Maus', 'mouse'], ['Ente', 'duck'], ['Huhn', 'hen']],
    food: [['Brot', 'bread'], ['Käse', 'cheese'], ['Wasser', 'water'], ['Milch', 'milk'], ['Apfel', 'apple'], ['Ei', 'egg'], ['Reis', 'rice'], ['Kaffee', 'coffee'], ['Tee', 'tea'], ['Zucker', 'sugar'], ['Salz', 'salt'], ['Butter', 'butter']],
    town: [['Straße', 'street'], ['Bahnhof', 'station'], ['Flughafen', 'airport'], ['Brücke', 'bridge'], ['Kirche', 'church'], ['Markt', 'market'], ['Museum', 'museum'], ['Krankenhaus', 'hospital'], ['Park', 'park'], ['Laden', 'shop'], ['Bank', 'bank'], ['Platz', 'square']],
    verbs: [['essen', 'to eat'], ['trinken', 'to drink'], ['schlafen', 'to sleep'], ['laufen', 'to walk'], ['sprechen', 'to speak'], ['lesen', 'to read'], ['schreiben', 'to write'], ['kaufen', 'to buy'], ['öffnen', 'to open'], ['schließen', 'to close'], ['singen', 'to sing'], ['tanzen', 'to dance']],
    past: [['gegessen', 'essen → ich habe ___ (I ate)'], ['getrunken', 'trinken → ich habe ___ (I drank)'], ['geschlafen', 'schlafen → ich habe ___ (I slept)'], ['gelaufen', 'laufen → ich bin ___ (I walked)'], ['gesprochen', 'sprechen → ich habe ___ (I spoke)'], ['geschrieben', 'schreiben → ich habe ___ (I wrote)'], ['gekauft', 'kaufen → ich habe ___ (I bought)'], ['gegangen', 'gehen → ich bin ___ (I went)'], ['gesehen', 'sehen → ich habe ___ (I saw)'], ['gesungen', 'singen → ich habe ___ (I sang)'], ['getanzt', 'tanzen → ich habe ___ (I danced)'], ['geöffnet', 'öffnen → ich habe ___ (I opened)']]
  },
  pt: {
    animals: [['cão', 'dog'], ['gato', 'cat'], ['cavalo', 'horse'], ['pássaro', 'bird'], ['peixe', 'fish'], ['vaca', 'cow'], ['porco', 'pig'], ['ovelha', 'sheep'], ['coelho', 'rabbit'], ['rato', 'mouse'], ['pato', 'duck'], ['galinha', 'hen']],
    food: [['pão', 'bread'], ['queijo', 'cheese'], ['água', 'water'], ['leite', 'milk'], ['maçã', 'apple'], ['ovo', 'egg'], ['arroz', 'rice'], ['café', 'coffee'], ['chá', 'tea'], ['açúcar', 'sugar'], ['sal', 'salt'], ['manteiga', 'butter']],
    town: [['rua', 'street'], ['estação', 'station'], ['aeroporto', 'airport'], ['ponte', 'bridge'], ['igreja', 'church'], ['mercado', 'market'], ['museu', 'museum'], ['hospital', 'hospital'], ['parque', 'park'], ['loja', 'shop'], ['banco', 'bank'], ['praça', 'square']],
    verbs: [['comer', 'to eat'], ['beber', 'to drink'], ['dormir', 'to sleep'], ['caminhar', 'to walk'], ['falar', 'to speak'], ['ler', 'to read'], ['escrever', 'to write'], ['comprar', 'to buy'], ['abrir', 'to open'], ['fechar', 'to close'], ['cantar', 'to sing'], ['dançar', 'to dance']],
    past: [['comi', 'comer → I ate'], ['bebi', 'beber → I drank'], ['dormi', 'dormir → I slept'], ['caminhei', 'caminhar → I walked'], ['falei', 'falar → I spoke'], ['escrevi', 'escrever → I wrote'], ['comprei', 'comprar → I bought'], ['fui', 'ir → I went'], ['vi', 'ver → I saw'], ['cantei', 'cantar → I sang'], ['dancei', 'dançar → I danced'], ['abri', 'abrir → I opened']]
  },
  nl: {
    animals: [['hond', 'dog'], ['kat', 'cat'], ['paard', 'horse'], ['vogel', 'bird'], ['vis', 'fish'], ['koe', 'cow'], ['varken', 'pig'], ['schaap', 'sheep'], ['konijn', 'rabbit'], ['muis', 'mouse'], ['eend', 'duck'], ['kip', 'hen']],
    food: [['brood', 'bread'], ['kaas', 'cheese'], ['water', 'water'], ['melk', 'milk'], ['appel', 'apple'], ['ei', 'egg'], ['rijst', 'rice'], ['koffie', 'coffee'], ['thee', 'tea'], ['suiker', 'sugar'], ['zout', 'salt'], ['boter', 'butter']],
    town: [['straat', 'street'], ['station', 'station'], ['vliegveld', 'airport'], ['brug', 'bridge'], ['kerk', 'church'], ['markt', 'market'], ['museum', 'museum'], ['ziekenhuis', 'hospital'], ['park', 'park'], ['winkel', 'shop'], ['bank', 'bank'], ['plein', 'square']],
    verbs: [['eten', 'to eat'], ['drinken', 'to drink'], ['slapen', 'to sleep'], ['lopen', 'to walk'], ['spreken', 'to speak'], ['lezen', 'to read'], ['schrijven', 'to write'], ['kopen', 'to buy'], ['openen', 'to open'], ['sluiten', 'to close'], ['zingen', 'to sing'], ['dansen', 'to dance']],
    past: [['gegeten', 'eten → ik heb ___ (I ate)'], ['gedronken', 'drinken → ik heb ___ (I drank)'], ['geslapen', 'slapen → ik heb ___ (I slept)'], ['gelopen', 'lopen → ik heb ___ (I walked)'], ['gesproken', 'spreken → ik heb ___ (I spoke)'], ['geschreven', 'schrijven → ik heb ___ (I wrote)'], ['gekocht', 'kopen → ik heb ___ (I bought)'], ['gegaan', 'gaan → ik ben ___ (I went)'], ['gezien', 'zien → ik heb ___ (I saw)'], ['gezongen', 'zingen → ik heb ___ (I sang)'], ['gedanst', 'dansen → ik heb ___ (I danced)'], ['geopend', 'openen → ik heb ___ (I opened)']]
  }
};

// Variants share a base list, with a few local words swapped in.
(function () {
  const W = window.HG_WORDS;
  const swap = (list, from, to) => list.map(p => (p[0] === from ? [to, p[1]] : p));
  W.enus = JSON.parse(JSON.stringify(W.en));
  W.enus.town = swap(W.enus.town, 'shop', 'store');
  W.enus.town = W.enus.town.map(p => (p[0] === 'square' ? ['square', 'Open public space in a town center'] : p));
  W.esmx = JSON.parse(JSON.stringify(W.es));
})();

window.HG_LANGS = {
  en: { name: 'English (UK)', code: 'en-GB' },
  enus: { name: 'English (US)', code: 'en-US' },
  es: { name: 'Spanish (Spain)', code: 'es-ES' },
  esmx: { name: 'Spanish (Latin America)', code: 'es-MX' },
  fr: { name: 'French', code: 'fr-FR' },
  it: { name: 'Italian', code: 'it-IT' },
  de: { name: 'German', code: 'de-DE' },
  pt: { name: 'Portuguese', code: 'pt-PT' },
  nl: { name: 'Dutch', code: 'nl-NL' }
};
