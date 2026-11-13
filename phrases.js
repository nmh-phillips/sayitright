// SayItRight phrase library (free tier: 20 per section).
// Format: [phrase, meaning / hint]. Keep the first five of each section stable — saved scores are keyed on the phrase text.
window.SIR_DATA = {
  en:{code:'en-GB',name:'English (UK)',nums:{0:'zero',1:'one',2:'two',3:'three',4:'four',5:'five',6:'six',7:'seven',8:'eight',9:'nine',10:'ten'},
    sets:{
      'Basics':[
        ['Hello, how are you?','Greeting'],['Nice to meet you','Meeting someone new'],['Thank you very much','Saying thanks'],['Sorry, I don\'t understand','When you\'re stuck'],['Could you say that again, please?','Asking someone to repeat'],
        ['Good morning','Greeting'],['Good evening','Greeting'],['Goodbye, see you soon','Saying goodbye'],['My name is Anna','Introducing yourself'],['What\'s your name?','Asking a name'],
        ['Where are you from?','Small talk'],['I\'m from Spain','Small talk'],['Do you speak Spanish?','Checking a language'],['I\'m learning English','Talking about yourself'],['Could you speak more slowly, please?','When it\'s too fast'],
        ['What does this word mean?','Asking for a meaning'],['How do you say this in English?','Asking for a word'],['Excuse me','Getting attention'],['You\'re welcome','Replying to thanks'],['Have a nice day','Saying goodbye']],
      'Café & restaurant':[
        ['Could I have a cup of tea, please?','Ordering politely'],['Can I have the bill, please?','Asking to pay'],['I\'ve booked a table for two','Arriving at a restaurant'],['What would you recommend?','Asking for advice'],['That was delicious','Paying a compliment'],
        ['A table for two, please','Arriving'],['Could I see the menu, please?','Ordering'],['Could I have a glass of water?','Ordering'],['A bottle of red wine, please','Ordering'],['I\'m vegetarian','Dietary needs'],
        ['Does this contain nuts?','Dietary needs'],['I\'ll have the fish, please','Ordering food'],['Can I pay by card?','Paying'],['Could we have some more bread?','Asking for more'],['Is service included?','Paying'],
        ['A pint of beer, please','At the pub'],['Two coffees, please','Ordering'],['No ice, thank you','Drinks'],['The same for me, please','Ordering'],['Can I get this to take away?','Takeaway']],
      'Travel':[
        ['Where is the nearest station?','Asking directions'],['How much does this cost?','Asking the price'],['What time does the train leave?','Checking times'],['I need a taxi','Getting around'],['I think I\'m lost','Asking for help'],
        ['A return ticket, please','Buying tickets'],['Which platform is it?','At the station'],['Where is the bus stop?','Getting around'],['Is it far from here?','Directions'],['Turn left at the corner','Directions'],
        ['Go straight ahead','Directions'],['I\'ve booked a room for three nights','At the hotel'],['What time do we need to leave the room?','At the hotel'],['Where is the nearest chemist?','Finding a pharmacy'],['Could you help me, please?','Asking for help'],
        ['I need to see a doctor','Emergencies'],['Where can I buy a ticket?','Getting around'],['What time does the museum open?','Sightseeing'],['Can I pay in cash?','Paying'],['To the airport, please','In a taxi']],
      'Tricky sounds':[
        ['I think three things are worth thanking','TH sound'],['The weather is better than yesterday','TH and W'],['Light and right are different words','L vs R'],['The ship carried a sheep','Short I vs long EE'],['Very well, we will visit Wales','V vs W'],
        ['Three free throws','TH vs F'],['This, that, these and those','Voiced TH'],['Walk to work in the wind','W'],['A vet with a van','V'],['Red lorry, yellow lorry','R and L (tongue twister)'],
        ['She sells seashells','S vs SH'],['Fill the bowl full','FILL vs FULL'],['Bit and beat','Short I vs long EE'],['The cat sat on the hat','Short A'],['Hungry hippos hurry home','H'],
        ['Think about the thing','NK vs NG'],['A bat and a bet','A vs E'],['World and word','R and L endings'],['Thank you for thinking of me','TH'],['Light the lamp on the right','L vs R']]
    }},

  enus:{code:'en-US',name:'English (US)',nums:{0:'zero',1:'one',2:'two',3:'three',4:'four',5:'five',6:'six',7:'seven',8:'eight',9:'nine',10:'ten'},
    sets:{
      'Basics':[
        ['Hi, how are you doing?','Greeting'],['Nice to meet you','Meeting someone new'],['Thank you so much','Saying thanks'],['Sorry, I don\'t understand','When you\'re stuck'],['Could you say that again, please?','Asking someone to repeat'],
        ['Good morning','Greeting'],['Good evening','Greeting'],['Bye, see you soon','Saying goodbye'],['My name is Anna','Introducing yourself'],['What\'s your name?','Asking a name'],
        ['Where are you from?','Small talk'],['I\'m from Mexico','Small talk'],['Do you speak Spanish?','Checking a language'],['I\'m learning English','Talking about yourself'],['Could you speak more slowly, please?','When it\'s too fast'],
        ['What does this word mean?','Asking for a meaning'],['How do you say this in English?','Asking for a word'],['Excuse me','Getting attention'],['You\'re welcome','Replying to thanks'],['Have a nice day','Saying goodbye']],
      'Café & restaurant':[
        ['Could I get a coffee, please?','Ordering'],['Can I get the check, please?','Asking to pay'],['I have a reservation for two','Arriving at a restaurant'],['What would you recommend?','Asking for advice'],['That was delicious','Paying a compliment'],
        ['A table for two, please','Arriving'],['Can I see the menu, please?','Ordering'],['Could I get a glass of water?','Ordering'],['A bottle of red wine, please','Ordering'],['I\'m vegetarian','Dietary needs'],
        ['Does this have nuts in it?','Dietary needs'],['I\'ll have the salmon, please','Ordering food'],['Can I pay with a card?','Paying'],['Could we get some more bread?','Asking for more'],['Is the tip included?','Paying'],
        ['Can I get a beer, please?','At the bar'],['Two coffees, please','Ordering'],['No ice, thanks','Drinks'],['I\'ll have the same','Ordering'],['Can I get this to go?','Takeout']],
      'Travel':[
        ['Where\'s the nearest subway station?','Asking directions'],['How much does this cost?','Asking the price'],['What time does the train leave?','Checking times'],['I need a cab','Getting around'],['I think I\'m lost','Asking for help'],
        ['A round-trip ticket, please','Buying tickets'],['Which track is it?','At the station'],['Where\'s the bus stop?','Getting around'],['Is it far from here?','Directions'],['Take a left at the corner','Directions'],
        ['Go straight ahead','Directions'],['I have a room booked for three nights','At the hotel'],['What time do we need to leave the room?','At the hotel'],['Where\'s the nearest pharmacy?','Finding a pharmacy'],['Could you help me, please?','Asking for help'],
        ['I need to see a doctor','Emergencies'],['Where can I buy a ticket?','Getting around'],['What time does the museum open?','Sightseeing'],['Can I pay in cash?','Paying'],['To the airport, please','In a cab']],
      'Tricky sounds':[
        ['I think three things are worth thanking','TH sound'],['Water, butter and better','Flap T (a quick, soft D)'],['Red leather, yellow leather','R and L (tongue twister)'],['The ship carried a sheep','Short I vs long EE'],['Very well, we will visit Washington','V vs W'],
        ['Three free throws','TH vs F'],['This, that, these and those','Voiced TH'],['Walk to work in the wind','W'],['A vet with a van','V'],['Her bird heard the word','American R vowels (ER / IR / UR)'],
        ['She sells seashells','S vs SH'],['Fill the bowl full','FILL vs FULL'],['Bit and beat','Short I vs long EE'],['The cat sat on the hat','Short A'],['Hungry hippos hurry home','H'],
        ['Think about the thing','NK vs NG'],['A bat and a bet','A vs E'],['World and word','R and L endings'],['Got a lot of hot coffee','American short O'],['Light the lamp on the right','L vs R']]
    }},

  esmx:{code:'es-MX',name:'Spanish (Latin America)',nums:{0:'cero',1:'uno',2:'dos',3:'tres',4:'cuatro',5:'cinco',6:'seis',7:'siete',8:'ocho',9:'nueve',10:'diez'},
    sets:{
      'Basics':[
        ['¡Hola! ¿Cómo estás?','Hi! How are you?'],['Buenos días','Good morning'],['Mucho gusto','Nice to meet you'],['No hablo mucho español','I don\'t speak much Spanish'],['¿Me lo puede repetir, por favor?','Can you repeat it, please?'],
        ['Buenas tardes','Good afternoon'],['Buenas noches','Good evening / good night'],['Adiós, nos vemos pronto','Bye, see you soon'],['Me llamo Ana','My name is Ana'],['¿Cómo te llamas?','What\'s your name?'],
        ['¿De dónde eres?','Where are you from?'],['Soy de Estados Unidos','I\'m from the United States'],['¿Habla inglés?','Do you speak English?'],['Estoy aprendiendo español','I\'m learning Spanish'],['¿Puede hablar más despacio, por favor?','Can you speak more slowly, please?'],
        ['¿Qué significa esto?','What does this mean?'],['¿Cómo se dice esto en español?','How do you say this in Spanish?'],['Disculpe','Excuse me'],['De nada','You\'re welcome'],['Que le vaya bien','Take care / all the best']],
      'Café & restaurant':[
        ['Me da un café, por favor','Can I have a coffee, please?'],['La cuenta, por favor','The check, please'],['Tengo una reservación para dos personas','I have a reservation for two'],['¿Qué me recomienda?','What do you recommend?'],['Estuvo muy rico','It was delicious'],
        ['Una mesa para dos, por favor','A table for two, please'],['¿Me trae el menú, por favor?','Can I see the menu, please?'],['Un vaso de agua, por favor','A glass of water, please'],['Una botella de vino tinto, por favor','A bottle of red wine, please'],['Soy vegetariano','I\'m vegetarian'],
        ['¿Esto tiene nueces?','Does this have nuts?'],['Para mí, el pescado, por favor','The fish for me, please'],['¿Puedo pagar con tarjeta?','Can I pay by card?'],['¿Nos trae más tortillas, por favor?','Could we have more tortillas, please?'],['¿La propina está incluida?','Is the tip included?'],
        ['Una cerveza, por favor','A beer, please'],['Dos cafés, por favor','Two coffees, please'],['Sin hielo, por favor','No ice, please'],['Lo mismo para mí','The same for me'],['Es para llevar','It\'s to go']],
      'Travel':[
        ['¿Dónde está el baño?','Where is the restroom?'],['¿Cuánto cuesta?','How much is it?'],['¿A qué hora sale el autobús?','What time does the bus leave?'],['Necesito un taxi','I need a taxi'],['Estoy perdido','I\'m lost'],
        ['Un boleto de ida y vuelta, por favor','A round-trip ticket, please'],['¿De qué andén sale?','Which platform does it leave from?'],['¿Dónde está la parada del camión?','Where is the bus stop? (Mexico)'],['¿Está lejos de aquí?','Is it far from here?'],['Dé vuelta a la izquierda en la esquina','Turn left at the corner'],
        ['Siga derecho','Go straight ahead'],['Tengo un cuarto reservado para tres noches','I have a room booked for three nights'],['¿A qué hora hay que dejar el cuarto?','What time is checkout?'],['¿Dónde está la farmacia más cercana?','Where is the nearest pharmacy?'],['¿Me puede ayudar, por favor?','Can you help me, please?'],
        ['Necesito un doctor','I need a doctor'],['¿Dónde puedo comprar un boleto?','Where can I buy a ticket?'],['¿A qué hora abre el museo?','What time does the museum open?'],['¿Puedo pagar en efectivo?','Can I pay in cash?'],['Al aeropuerto, por favor','To the airport, please']],
      'Tricky sounds':[
        ['El perro de Roberto corre rápido','Roberto\'s dog runs fast (rolled R)'],['Llueve en la calle','It\'s raining in the street (LL)'],['Mañana voy a México','Tomorrow I\'m going to Mexico (Ñ, X)'],['Jorge juega en el jardín','Jorge plays in the garden (J)'],['Cerveza y jugo de naranja','Beer and orange juice (Z sounds like S)'],
        ['Erre con erre, cigarro','R with R, cigar (tongue twister)'],['El ferrocarril corre rápido','The railroad runs fast (RR)'],['Tres tristes tigres','Three sad tigers (TR)'],['Yo llamo a mi amiga','I call my friend (Y / LL)'],['El niño come piña','The boy eats pineapple (Ñ)'],
        ['Gente generosa en Guadalajara','Generous people in Guadalajara (soft G)'],['Guerra y guitarra','War and guitar (hard GU)'],['Hace calor en verano','It\'s hot in summer (silent H, C as S)'],['Vamos a ver la boda','Let\'s go and see the wedding (B and V)'],['Pero el perro ladra','But the dog barks (R vs RR)'],
        ['Quiero queso','I want cheese (QU)'],['Xochimilco y Oaxaca','Place names (X as S and J)'],['Me gusta el pollo','I like chicken (LL)'],['Cinco zapatos azules','Five blue shoes (Z and C as S)'],['Huevos y hielo','Eggs and ice (HUE / HIE)']]
    }},

  es:{code:'es-ES',name:'Spanish (Spain)',nums:{0:'cero',1:'uno',2:'dos',3:'tres',4:'cuatro',5:'cinco',6:'seis',7:'siete',8:'ocho',9:'nueve',10:'diez'},
    sets:{
      'Basics':[
        ['Hola, ¿qué tal?','Hi, how are you?'],['Buenos días','Good morning'],['Mucho gusto','Nice to meet you'],['No hablo mucho español','I don\'t speak much Spanish'],['¿Puede repetirlo, por favor?','Can you repeat that, please?'],
        ['Buenas tardes','Good afternoon'],['Buenas noches','Good evening / good night'],['Adiós, hasta pronto','Goodbye, see you soon'],['Me llamo Ana','My name is Ana'],['¿Cómo te llamas?','What\'s your name?'],
        ['¿De dónde eres?','Where are you from?'],['Soy de Inglaterra','I\'m from England'],['¿Habla inglés?','Do you speak English?'],['Estoy aprendiendo español','I\'m learning Spanish'],['¿Puede hablar más despacio, por favor?','Can you speak more slowly, please?'],
        ['¿Qué significa esto?','What does this mean?'],['¿Cómo se dice esto en español?','How do you say this in Spanish?'],['Perdone','Excuse me'],['De nada','You\'re welcome'],['Que tenga un buen día','Have a nice day']],
      'Café & restaurant':[
        ['Quisiera un café con leche, por favor','I\'d like a white coffee, please'],['La cuenta, por favor','The bill, please'],['Tengo una reserva para dos personas','I have a reservation for two'],['¿Qué me recomienda?','What do you recommend?'],['Está muy rico','It\'s delicious'],
        ['Una mesa para dos, por favor','A table for two, please'],['¿Me trae la carta, por favor?','Can I see the menu, please?'],['Un vaso de agua, por favor','A glass of water, please'],['Una botella de vino tinto, por favor','A bottle of red wine, please'],['Soy vegetariano','I\'m vegetarian'],
        ['¿Esto lleva frutos secos?','Does this contain nuts?'],['Para mí, el pescado, por favor','The fish for me, please'],['¿Se puede pagar con tarjeta?','Can we pay by card?'],['¿Nos trae más pan, por favor?','Could we have more bread, please?'],['¿El servicio está incluido?','Is service included?'],
        ['Una cerveza, por favor','A beer, please'],['Dos cafés, por favor','Two coffees, please'],['Sin hielo, por favor','Without ice, please'],['Lo mismo para mí','The same for me'],['¿Me lo pone para llevar?','Can I have it to take away?']],
      'Travel':[
        ['¿Dónde está el baño?','Where is the toilet?'],['¿Cuánto cuesta?','How much is it?'],['¿A qué hora sale el tren?','What time does the train leave?'],['Necesito un taxi','I need a taxi'],['Estoy perdido','I\'m lost'],
        ['Un billete de ida y vuelta, por favor','A return ticket, please'],['¿De qué andén sale?','Which platform does it leave from?'],['¿Dónde está la parada de autobús?','Where is the bus stop?'],['¿Está lejos de aquí?','Is it far from here?'],['Gire a la izquierda en la esquina','Turn left at the corner'],
        ['Siga todo recto','Go straight ahead'],['Tengo una habitación reservada para tres noches','I have a room booked for three nights'],['¿A qué hora hay que dejar la habitación?','What time is check-out?'],['¿Dónde está la farmacia más cercana?','Where is the nearest pharmacy?'],['¿Me puede ayudar, por favor?','Can you help me, please?'],
        ['Necesito un médico','I need a doctor'],['¿Dónde puedo comprar un billete?','Where can I buy a ticket?'],['¿A qué hora abre el museo?','What time does the museum open?'],['¿Puedo pagar en efectivo?','Can I pay in cash?'],['Al aeropuerto, por favor','To the airport, please']],
      'Tricky sounds':[
        ['El perro de Roberto corre rápido','Roberto\'s dog runs fast (rolled R)'],['Llueve en la calle','It\'s raining in the street (LL)'],['Mañana voy a España','Tomorrow I\'m going to Spain (Ñ)'],['Jorge juega en el jardín','Jorge plays in the garden (J)'],['Cerveza y zumo de naranja','Beer and orange juice (Z/C)'],
        ['Erre con erre, cigarro','R with R, cigar (tongue twister)'],['El ferrocarril corre rápido','The railway runs fast (RR)'],['Tres tristes tigres','Three sad tigers (TR)'],['Yo llamo a mi amiga','I call my friend (Y / LL)'],['El niño come piña','The boy eats pineapple (Ñ)'],
        ['Gente generosa en Gijón','Generous people in Gijón (soft G)'],['Guerra y guitarra','War and guitar (hard GU)'],['Hace calor en verano','It\'s hot in summer (silent H)'],['Vamos a ver la boda','Let\'s go and see the wedding (B and V)'],['Pero el perro ladra','But the dog barks (R vs RR)'],
        ['Quiero queso','I want cheese (QU)'],['Madrid, ciudad y verdad','Madrid, city and truth (soft final D)'],['Me gusta la paella','I like paella (LL)'],['Cinco zapatos azules','Five blue shoes (Z / C)'],['Huevos y hielo','Eggs and ice (HUE / HIE)']]
    }},

  fr:{code:'fr-FR',name:'French',nums:{0:'zéro',1:'un',2:'deux',3:'trois',4:'quatre',5:'cinq',6:'six',7:'sept',8:'huit',9:'neuf',10:'dix'},
    sets:{
      'Basics':[
        ['Bonjour, comment allez-vous ?','Hello, how are you?'],['Merci beaucoup','Thank you very much'],['Enchanté','Nice to meet you'],['Je ne parle pas bien français','I don\'t speak French well'],['Pouvez-vous répéter, s\'il vous plaît ?','Can you repeat, please?'],
        ['Bonsoir','Good evening'],['Bonne nuit','Good night'],['Au revoir, à bientôt','Goodbye, see you soon'],['Je m\'appelle Anne','My name is Anne'],['Comment vous appelez-vous ?','What\'s your name?'],
        ['D\'où venez-vous ?','Where are you from?'],['Je viens d\'Angleterre','I\'m from England'],['Vous parlez anglais ?','Do you speak English?'],['J\'apprends le français','I\'m learning French'],['Pouvez-vous parler plus lentement ?','Can you speak more slowly?'],
        ['Qu\'est-ce que ça veut dire ?','What does that mean?'],['Comment dit-on ça en français ?','How do you say that in French?'],['Excusez-moi','Excuse me'],['De rien','You\'re welcome'],['Bonne journée','Have a nice day']],
      'Café & restaurant':[
        ['Je voudrais un croissant, s\'il vous plaît','I\'d like a croissant, please'],['L\'addition, s\'il vous plaît','The bill, please'],['J\'ai une réservation pour deux personnes','I have a reservation for two'],['Qu\'est-ce que vous recommandez ?','What do you recommend?'],['C\'était délicieux','It was delicious'],
        ['Une table pour deux, s\'il vous plaît','A table for two, please'],['La carte, s\'il vous plaît','The menu, please'],['Une carafe d\'eau, s\'il vous plaît','A jug of tap water, please'],['Une bouteille de vin rouge, s\'il vous plaît','A bottle of red wine, please'],['Je suis végétarien','I\'m vegetarian'],
        ['Est-ce qu\'il y a des noix dedans ?','Are there nuts in it?'],['Je vais prendre le poisson','I\'ll have the fish'],['On peut payer par carte ?','Can we pay by card?'],['Encore un peu de pain, s\'il vous plaît','A little more bread, please'],['Le service est compris ?','Is service included?'],
        ['Une bière, s\'il vous plaît','A beer, please'],['Deux cafés, s\'il vous plaît','Two coffees, please'],['Sans glaçons, s\'il vous plaît','Without ice, please'],['La même chose pour moi','The same for me'],['C\'est à emporter','It\'s to take away']],
      'Travel':[
        ['Où est la gare ?','Where is the station?'],['Combien ça coûte ?','How much does it cost?'],['À quelle heure part le train ?','What time does the train leave?'],['J\'ai besoin d\'un taxi','I need a taxi'],['Je suis perdu','I\'m lost'],
        ['Un aller-retour, s\'il vous plaît','A return ticket, please'],['C\'est quel quai ?','Which platform is it?'],['Où est l\'arrêt de bus ?','Where is the bus stop?'],['C\'est loin d\'ici ?','Is it far from here?'],['Tournez à gauche au coin','Turn left at the corner'],
        ['Allez tout droit','Go straight ahead'],['J\'ai réservé une chambre pour trois nuits','I\'ve booked a room for three nights'],['À quelle heure faut-il libérer la chambre ?','What time is check-out?'],['Où est la pharmacie la plus proche ?','Where is the nearest pharmacy?'],['Pouvez-vous m\'aider, s\'il vous plaît ?','Can you help me, please?'],
        ['J\'ai besoin d\'un médecin','I need a doctor'],['Où est-ce que je peux acheter un billet ?','Where can I buy a ticket?'],['À quelle heure ouvre le musée ?','What time does the museum open?'],['Je peux payer en espèces ?','Can I pay in cash?'],['À l\'aéroport, s\'il vous plaît','To the airport, please']],
      'Tricky sounds':[
        ['Un bon vin blanc','A good white wine (nasal vowels)'],['La rue est très jolie','The street is very pretty (U vs OU)'],['Il fait beau aujourd\'hui','The weather is nice today'],['Je regarde la grenouille','I\'m looking at the frog (R)'],['Les enfants ont faim','The children are hungry (liaison)'],
        ['Les chaussettes de l\'archiduchesse','The archduchess\'s socks (CH / S twister)'],['Un chasseur sachant chasser','A hunter who knows how to hunt (CH / S)'],['Tout le monde est sur la route','Everyone is on the road (OU vs U)'],['Il a vu le loup','He saw the wolf (U vs OU)'],['Un grand pain blanc','A big white loaf (nasals)'],
        ['Le train arrive à quatre heures','The train arrives at four (R)'],['Je veux deux œufs','I want two eggs (EU)'],['Mon fils est grand','My son is tall (silent letters)'],['Elle habite à Paris','She lives in Paris (silent H)'],['Vous avez des amis','You have friends (liaison Z)'],
        ['Le soleil brille','The sun shines (-ILLE)'],['Une fenêtre ouverte','An open window (silent E)'],['Bonne année','Happy New Year (nasal vs non-nasal)'],['Ils sont gentils','They are kind (silent endings)'],['La grenouille rouge','The red frog (R / OU)']]
    }},

  it:{code:'it-IT',name:'Italian',nums:{0:'zero',1:'uno',2:'due',3:'tre',4:'quattro',5:'cinque',6:'sei',7:'sette',8:'otto',9:'nove',10:'dieci'},
    sets:{
      'Basics':[
        ['Buongiorno, come sta?','Good morning, how are you?'],['Grazie mille','Thanks a lot'],['Piacere di conoscerla','Nice to meet you'],['Non parlo bene l\'italiano','I don\'t speak Italian well'],['Può ripetere, per favore?','Can you repeat, please?'],
        ['Buonasera','Good evening'],['Buonanotte','Good night'],['Arrivederci, a presto','Goodbye, see you soon'],['Mi chiamo Anna','My name is Anna'],['Come si chiama?','What\'s your name? (formal)'],
        ['Di dov\'è?','Where are you from?'],['Sono inglese','I\'m English'],['Parla inglese?','Do you speak English?'],['Sto imparando l\'italiano','I\'m learning Italian'],['Può parlare più lentamente?','Can you speak more slowly?'],
        ['Che cosa vuol dire?','What does it mean?'],['Come si dice in italiano?','How do you say it in Italian?'],['Mi scusi','Excuse me'],['Prego','You\'re welcome'],['Buona giornata','Have a nice day']],
      'Café & restaurant':[
        ['Vorrei un caffè, per favore','I\'d like a coffee, please'],['Il conto, per favore','The bill, please'],['Ho una prenotazione per due persone','I have a reservation for two'],['Che cosa mi consiglia?','What do you recommend?'],['Era buonissimo','It was delicious'],
        ['Un tavolo per due, per favore','A table for two, please'],['Posso vedere il menù?','Can I see the menu?'],['Una bottiglia d\'acqua naturale','A bottle of still water'],['Una bottiglia di vino rosso','A bottle of red wine'],['Sono vegetariano','I\'m vegetarian'],
        ['Ci sono noci in questo piatto?','Are there nuts in this dish?'],['Per me il pesce, grazie','The fish for me, thanks'],['Posso pagare con la carta?','Can I pay by card?'],['Ancora un po\' di pane, per favore','A little more bread, please'],['Il servizio è incluso?','Is service included?'],
        ['Una birra, per favore','A beer, please'],['Due cappuccini, per favore','Two cappuccinos, please'],['Senza ghiaccio, per favore','Without ice, please'],['Lo stesso per me','The same for me'],['È da portare via','It\'s to take away']],
      'Travel':[
        ['Dov\'è la stazione?','Where is the station?'],['Quanto costa?','How much is it?'],['A che ora parte il treno?','What time does the train leave?'],['Ho bisogno di un taxi','I need a taxi'],['Mi sono perso','I\'m lost'],
        ['Un biglietto di andata e ritorno','A return ticket'],['Da quale binario parte?','Which platform does it leave from?'],['Dov\'è la fermata dell\'autobus?','Where is the bus stop?'],['È lontano da qui?','Is it far from here?'],['Giri a sinistra all\'angolo','Turn left at the corner'],
        ['Vada sempre dritto','Go straight on'],['Ho prenotato una camera per tre notti','I\'ve booked a room for three nights'],['A che ora bisogna lasciare la camera?','What time is check-out?'],['Dov\'è la farmacia più vicina?','Where is the nearest pharmacy?'],['Mi può aiutare, per favore?','Can you help me, please?'],
        ['Ho bisogno di un medico','I need a doctor'],['Dove posso comprare un biglietto?','Where can I buy a ticket?'],['A che ora apre il museo?','What time does the museum open?'],['Posso pagare in contanti?','Can I pay in cash?'],['All\'aeroporto, per favore','To the airport, please']],
      'Tricky sounds':[
        ['Gli gnocchi sono buoni','The gnocchi are good (GLI / GN)'],['Ho fatto una bella passeggiata','I had a nice walk (double consonants)'],['Ciao, ci vediamo domani','Bye, see you tomorrow (CI)'],['Che bella giornata!','What a lovely day! (CHE / GI)'],['Il ragazzo mangia la pizza','The boy eats the pizza (ZZ)'],
        ['Sopra la panca la capra campa','On the bench the goat lives (tongue twister)'],['Il cane abbaia','The dog barks (double B)'],['Caro e carro','Dear and cart (R vs RR)'],['Pala e palla','Shovel and ball (L vs LL)'],['La figlia sbaglia','The daughter makes a mistake (GLI)'],
        ['Il signore guadagna','The gentleman earns (GN)'],['Cena con gli amici','Dinner with friends (CE / GLI)'],['Ghiaccio e chiave','Ice and key (GHI / CHI)'],['Lo sciopero è finito','The strike is over (SCI)'],['Pesce fresco','Fresh fish (SC)'],
        ['Zucchero e pizza','Sugar and pizza (Z / ZZ)'],['Gelato al cioccolato','Chocolate ice cream (GE / CIO)'],['Rosso, rapido, raro','Red, fast, rare (rolled R)'],['Nonno e nono','Grandad and ninth (N vs NN)'],['Bagno e campagna','Bathroom and countryside (GN)']]
    }},

  de:{code:'de-DE',name:'German',nums:{0:'null',1:'ein',2:'zwei',3:'drei',4:'vier',5:'fünf',6:'sechs',7:'sieben',8:'acht',9:'neun',10:'zehn'},
    sets:{
      'Basics':[
        ['Guten Morgen, wie geht es Ihnen?','Good morning, how are you?'],['Vielen Dank','Thank you very much'],['Freut mich','Nice to meet you'],['Ich spreche nicht gut Deutsch','I don\'t speak German well'],['Können Sie das bitte wiederholen?','Can you repeat that, please?'],
        ['Guten Abend','Good evening'],['Gute Nacht','Good night'],['Auf Wiedersehen, bis bald','Goodbye, see you soon'],['Ich heiße Anna','My name is Anna'],['Wie heißen Sie?','What\'s your name?'],
        ['Woher kommen Sie?','Where are you from?'],['Ich komme aus England','I\'m from England'],['Sprechen Sie Englisch?','Do you speak English?'],['Ich lerne Deutsch','I\'m learning German'],['Können Sie bitte langsamer sprechen?','Can you speak more slowly, please?'],
        ['Was bedeutet das?','What does that mean?'],['Wie sagt man das auf Deutsch?','How do you say that in German?'],['Entschuldigung','Excuse me'],['Gern geschehen','You\'re welcome'],['Schönen Tag noch','Have a nice day']],
      'Café & restaurant':[
        ['Ich hätte gern einen Kaffee, bitte','I\'d like a coffee, please'],['Die Rechnung, bitte','The bill, please'],['Ich habe eine Reservierung für zwei Personen','I have a reservation for two'],['Was empfehlen Sie?','What do you recommend?'],['Das war sehr lecker','That was very tasty'],
        ['Einen Tisch für zwei, bitte','A table for two, please'],['Die Speisekarte, bitte','The menu, please'],['Ein Glas Wasser, bitte','A glass of water, please'],['Eine Flasche Rotwein, bitte','A bottle of red wine, please'],['Ich bin Vegetarier','I\'m vegetarian'],
        ['Sind da Nüsse drin?','Are there nuts in it?'],['Ich nehme den Fisch','I\'ll have the fish'],['Kann ich mit Karte zahlen?','Can I pay by card?'],['Noch etwas Brot, bitte','Some more bread, please'],['Ist die Bedienung inklusive?','Is service included?'],
        ['Ein Bier, bitte','A beer, please'],['Zwei Kaffee, bitte','Two coffees, please'],['Ohne Eis, bitte','Without ice, please'],['Für mich das Gleiche','The same for me'],['Zum Mitnehmen, bitte','To take away, please']],
      'Travel':[
        ['Wo ist der Bahnhof?','Where is the station?'],['Wie viel kostet das?','How much does it cost?'],['Wann fährt der Zug ab?','When does the train leave?'],['Ich brauche ein Taxi','I need a taxi'],['Ich habe mich verlaufen','I\'m lost'],
        ['Eine Rückfahrkarte, bitte','A return ticket, please'],['Von welchem Gleis fährt der Zug?','Which platform does the train leave from?'],['Wo ist die Bushaltestelle?','Where is the bus stop?'],['Ist es weit von hier?','Is it far from here?'],['Biegen Sie an der Ecke links ab','Turn left at the corner'],
        ['Gehen Sie geradeaus','Go straight ahead'],['Ich habe ein Zimmer für drei Nächte gebucht','I\'ve booked a room for three nights'],['Wann muss ich auschecken?','When do I have to check out?'],['Wo ist die nächste Apotheke?','Where is the nearest pharmacy?'],['Können Sie mir bitte helfen?','Can you help me, please?'],
        ['Ich brauche einen Arzt','I need a doctor'],['Wo kann ich eine Fahrkarte kaufen?','Where can I buy a ticket?'],['Wann öffnet das Museum?','When does the museum open?'],['Kann ich bar bezahlen?','Can I pay in cash?'],['Zum Flughafen, bitte','To the airport, please']],
      'Tricky sounds':[
        ['Ich möchte ein Brötchen','I\'d like a bread roll (Ö / CH)'],['Die Tür ist grün','The door is green (Ü)'],['Acht Nächte in München','Eight nights in Munich (ACH / ICH)'],['Zwei zahme Ziegen','Two tame goats (Z)'],['Das Eichhörnchen ist schnell','The squirrel is fast'],
        ['Fischers Fritz fischt frische Fische','Fisherman Fritz fishes fresh fish (twister)'],['Schöne Grüße aus Köln','Best wishes from Cologne (Ö / Ü)'],['Ich spreche nicht schnell','I don\'t speak fast (ICH / SCH)'],['Der Bach ist nicht weit','The stream isn\'t far (ACH / W)'],['Wir wohnen in Wien','We live in Vienna (W)'],
        ['Vater und Vogel','Father and bird (V = F)'],['Das Mädchen lächelt','The girl smiles (Ä / CHEN)'],['Straße und Stein','Street and stone (ST / ß)'],['Zehn Ziegen ziehen Zucker','Ten goats pull sugar (Z)'],['Die Brücke über den Fluss','The bridge over the river (Ü)'],
        ['Hören und sehen','Hearing and seeing (Ö)'],['Ein schönes Wochenende','A nice weekend'],['Der Rhein ist lang','The Rhine is long (R / EI)'],['Die Leute freuen sich','People are happy (EU)'],['Pfeffer und Apfel','Pepper and apple (PF)']]
    }},

  pt:{code:'pt-PT',name:'Portuguese',nums:{0:'zero',1:'um',2:'duas',3:'três',4:'quatro',5:'cinco',6:'seis',7:'sete',8:'oito',9:'nove',10:'dez'},
    sets:{
      'Basics':[
        ['Bom dia, como está?','Good morning, how are you?'],['Muito obrigado','Thank you very much'],['Muito prazer','Nice to meet you'],['Não falo bem português','I don\'t speak Portuguese well'],['Pode repetir, por favor?','Can you repeat, please?'],
        ['Boa tarde','Good afternoon'],['Boa noite','Good evening / good night'],['Adeus, até breve','Goodbye, see you soon'],['Chamo-me Ana','My name is Ana'],['Como se chama?','What\'s your name?'],
        ['De onde é?','Where are you from?'],['Sou de Inglaterra','I\'m from England'],['Fala inglês?','Do you speak English?'],['Estou a aprender português','I\'m learning Portuguese'],['Pode falar mais devagar?','Can you speak more slowly?'],
        ['O que quer dizer isto?','What does this mean?'],['Como se diz isto em português?','How do you say this in Portuguese?'],['Com licença','Excuse me'],['De nada','You\'re welcome'],['Tenha um bom dia','Have a nice day']],
      'Café & restaurant':[
        ['Queria um café, por favor','I\'d like a coffee, please'],['A conta, por favor','The bill, please'],['Tenho uma reserva para duas pessoas','I have a reservation for two'],['O que me recomenda?','What do you recommend?'],['Estava delicioso','It was delicious'],
        ['Uma mesa para dois, por favor','A table for two, please'],['Pode trazer a ementa?','Can you bring the menu?'],['Um copo de água, por favor','A glass of water, please'],['Uma garrafa de vinho tinto','A bottle of red wine'],['Sou vegetariano','I\'m vegetarian'],
        ['Isto tem frutos secos?','Does this have nuts?'],['Para mim, o peixe','The fish for me'],['Posso pagar com cartão?','Can I pay by card?'],['Mais pão, por favor','More bread, please'],['O serviço está incluído?','Is service included?'],
        ['Uma imperial, por favor','A small draught beer, please'],['Dois cafés, por favor','Two coffees, please'],['Sem gelo, por favor','Without ice, please'],['O mesmo para mim','The same for me'],['É para levar','It\'s to take away']],
      'Travel':[
        ['Onde fica a estação?','Where is the station?'],['Quanto custa?','How much is it?'],['A que horas parte o comboio?','What time does the train leave?'],['Preciso de um táxi','I need a taxi'],['Estou perdido','I\'m lost'],
        ['Um bilhete de ida e volta, por favor','A return ticket, please'],['De que linha parte?','Which platform does it leave from?'],['Onde é a paragem do autocarro?','Where is the bus stop?'],['Fica longe daqui?','Is it far from here?'],['Vire à esquerda na esquina','Turn left at the corner'],
        ['Siga sempre em frente','Go straight ahead'],['Tenho um quarto reservado para três noites','I have a room booked for three nights'],['A que horas tenho de deixar o quarto?','What time do I have to leave the room?'],['Onde fica a farmácia mais próxima?','Where is the nearest pharmacy?'],['Pode ajudar-me, por favor?','Can you help me, please?'],
        ['Preciso de um médico','I need a doctor'],['Onde posso comprar um bilhete?','Where can I buy a ticket?'],['A que horas abre o museu?','What time does the museum open?'],['Posso pagar em dinheiro?','Can I pay in cash?'],['Para o aeroporto, por favor','To the airport, please']],
      'Tricky sounds':[
        ['O pão está quente','The bread is hot (nasal ÃO)'],['Vamos à praia amanhã','Let\'s go to the beach tomorrow'],['Lisboa é linda','Lisbon is beautiful'],['O coelho come a cenoura','The rabbit eats the carrot (LH)'],['Ninguém sabe','Nobody knows (nasal EM)'],
        ['O rato roeu a rolha','The rat gnawed the cork (R)'],['Mãe e pai','Mum and dad (nasal ÃE)'],['Os cães e os pães','The dogs and the loaves (ÃES)'],['O filho trabalha muito','The son works a lot (LH)'],['Amanhã de manhã','Tomorrow morning (NH / Ã)'],
        ['Ele vive em Lisboa','He lives in Lisbon (S sounds)'],['Coração e emoção','Heart and emotion (-ÇÃO)'],['Três tristes tigres','Three sad tigers (TR)'],['Chá e chocolate','Tea and chocolate (CH)'],['A janela está aberta','The window is open (J)'],
        ['Obrigada pela ajuda','Thanks for the help (feminine)'],['O carro é caro','The car is expensive (RR vs R)'],['Bom e bem','Good and well (nasal OM / EM)'],['Os ovos estão frescos','The eggs are fresh (open / closed O)'],['Pêssego e queijo','Peach and cheese (Ê / EI)']]
    }}
};
