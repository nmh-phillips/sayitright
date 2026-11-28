// Harlo Games word lists.
// Word topics, one row per word:
//   en | English definition | es | fr | it | de | pt | nl | pl | ro | uk | zh | ar | tr | ja | ko | vi
//   (es…nl are the words to learn AND the meaning shown to speakers of those languages;
//    pl…vi are meanings only, for those interface languages.)
// Verb-form topics (present, past), one row per verb:
//   en answer | English clue | es | fr | it | de | pt | nl | English meaning | pl | ro | uk | zh | ar | tr | ja | ko | vi
//   where each learning-language field is "infinitive>answer" or "infinitive>answer>frame" (frame overrides the topic default).
// Words with spaces, hyphens or apostrophes are only used in Match pairs. AI-translated: get native speakers to check.
window.HG_TOPICS = [
  { id: 'animals', ic: '🐾' },
  { id: 'food', ic: '🍎' },
  { id: 'town', ic: '🏙️' },
  { id: 'home', ic: '🏠' },
  { id: 'body', ic: '💪' },
  { id: 'clothes', ic: '👕' },
  { id: 'family', ic: '👪' },
  { id: 'nature', ic: '🌦️' },
  { id: 'verbs', ic: '🏃' },
  { id: 'present', ic: '▶️', form: true, frames: { fr: 'elle ___', de: 'sie ___', nl: 'ze ___' }, pre: { es: 'ella ', it: 'lei ', pt: 'ela ' } },
  { id: 'past', ic: '⏪', form: true, frames: { fr: "j'ai ___", it: 'ho ___', de: 'ich habe ___', nl: 'ik heb ___' }, pre: {} }
];

window.HG_RAW = {
animals: `
dog|Pet that barks|perro|chien|cane|Hund|cão|hond|pies|câine|собака|狗|كلب|köpek|犬|개|chó
cat|Pet that purrs|gato|chat|gatto|Katze|gato|kat|kot|pisică|кіт|猫|قطة|kedi|猫|고양이|mèo
horse|Large animal you can ride|caballo|cheval|cavallo|Pferd|cavalo|paard|koń|cal|кінь|马|حصان|at|馬|말|ngựa
bird|Animal with feathers that can fly|pájaro|oiseau|uccello|Vogel|pássaro|vogel|ptak|pasăre|птах|鸟|طائر|kuş|鳥|새|chim
fish|Animal that swims and lives in water|pez|poisson|pesce|Fisch|peixe|vis|ryba|pește|риба|鱼|سمكة|balık|魚|물고기|cá
cow|Farm animal that gives us milk|vaca|vache|mucca|Kuh|vaca|koe|krowa|vacă|корова|奶牛|بقرة|inek|牛|소|bò
pig|Pink farm animal that says oink|cerdo|cochon|maiale|Schwein|porco|varken|świnia|porc|свиня|猪|خنزير|domuz|豚|돼지|lợn
sheep|Farm animal that gives us wool|oveja|mouton|pecora|Schaf|ovelha|schaap|owca|oaie|вівця|绵羊|خروف|koyun|羊|양|cừu
rabbit|Small animal with long ears|conejo|lapin|coniglio|Kaninchen|coelho|konijn|królik|iepure|кролик|兔子|أرنب|tavşan|うさぎ|토끼|thỏ
mouse|Small animal that loves cheese|ratón|souris|topo|Maus|rato|muis|mysz|șoarece|миша|老鼠|فأر|fare|ねずみ|쥐|chuột
duck|Bird that swims and says quack|pato|canard|anatra|Ente|pato|eend|kaczka|rață|качка|鸭子|بطة|ördek|アヒル|오리|vịt
hen|Female chicken that lays eggs|gallina|poule|gallina|Huhn|galinha|kip|kura|găină|курка|母鸡|دجاجة|tavuk|めんどり|암탉|gà mái
lion|Big wild cat with a mane|león|lion|leone|Löwe|leão|leeuw|lew|leu|лев|狮子|أسد|aslan|ライオン|사자|sư tử
tiger|Big orange cat with black stripes|tigre|tigre|tigre|Tiger|tigre|tijger|tygrys|tigru|тигр|老虎|نمر|kaplan|トラ|호랑이|hổ
elephant|Huge grey animal with a trunk|elefante|éléphant|elefante|Elefant|elefante|olifant|słoń|elefant|слон|大象|فيل|fil|ゾウ|코끼리|voi
monkey|Animal that climbs trees and loves bananas|mono|singe|scimmia|Affe|macaco|aap|małpa|maimuță|мавпа|猴子|قرد|maymun|サル|원숭이|khỉ
bear|Big furry animal that loves honey|oso|ours|orso|Bär|urso|beer|niedźwiedź|urs|ведмідь|熊|دب|ayı|クマ|곰|gấu
wolf|Wild animal like a dog that howls|lobo|loup|lupo|Wolf|lobo|wolf|wilk|lup|вовк|狼|ذئب|kurt|オオカミ|늑대|chó sói
fox|Clever wild animal with a bushy red tail|zorro|renard|volpe|Fuchs|raposa|vos|lis|vulpe|лисиця|狐狸|ثعلب|tilki|キツネ|여우|cáo
snake|Long animal with no legs|serpiente|serpent|serpente|Schlange|cobra|slang|wąż|șarpe|змія|蛇|ثعبان|yılan|ヘビ|뱀|rắn
frog|Green animal that jumps and croaks|rana|grenouille|rana|Frosch|rã|kikker|żaba|broască|жаба|青蛙|ضفدع|kurbağa|カエル|개구리|ếch
bee|Insect that makes honey|abeja|abeille|ape|Biene|abelha|bij|pszczoła|albină|бджола|蜜蜂|نحلة|arı|ハチ|벌|ong
butterfly|Insect with big colourful wings|mariposa|papillon|farfalla|Schmetterling|borboleta|vlinder|motyl|fluture|метелик|蝴蝶|فراشة|kelebek|チョウ|나비|bướm
spider|Small animal with eight legs|araña|araignée|ragno|Spinne|aranha|spin|pająk|păianjen|павук|蜘蛛|عنكبوت|örümcek|クモ|거미|nhện
goat|Farm animal with horns that eats almost anything|cabra|chèvre|capra|Ziege|cabra|geit|koza|capră|коза|山羊|ماعز|keçi|ヤギ|염소|dê
donkey|Animal like a small horse with long ears|burro|âne|asino|Esel|burro|ezel|osioł|măgar|осел|驴|حمار|eşek|ロバ|당나귀|lừa
whale|Very big animal that lives in the sea|ballena|baleine|balena|Wal|baleia|walvis|wieloryb|balenă|кит|鲸鱼|حوت|balina|クジラ|고래|cá voi
shark|Dangerous fish with sharp teeth|tiburón|requin|squalo|Hai|tubarão|haai|rekin|rechin|акула|鲨鱼|قرش|köpekbalığı|サメ|상어|cá mập
owl|Bird that hoots at night|búho|hibou|gufo|Eule|coruja|uil|sowa|bufniță|сова|猫头鹰|بومة|baykuş|フクロウ|부엉이|cú mèo
camel|Desert animal with a hump|camello|chameau|cammello|Kamel|camelo|kameel|wielbłąd|cămilă|верблюд|骆驼|جمل|deve|ラクダ|낙타|lạc đà`,
food: `
bread|You make toast and sandwiches with it|pan|pain|pane|Brot|pão|brood|chleb|pâine|хліб|面包|خبز|ekmek|パン|빵|bánh mì
cheese|Food made from milk; mice love it|queso|fromage|formaggio|Käse|queijo|kaas|ser|brânză|сир|奶酪|جبن|peynir|チーズ|치즈|phô mai
water|Clear drink that comes from the tap|agua|eau|acqua|Wasser|água|water|woda|apă|вода|水|ماء|su|水|물|nước
milk|White drink that comes from cows|leche|lait|latte|Milch|leite|melk|mleko|lapte|молоко|牛奶|حليب|süt|牛乳|우유|sữa
apple|Round fruit, red or green|manzana|pomme|mela|Apfel|maçã|appel|jabłko|măr|яблуко|苹果|تفاحة|elma|りんご|사과|táo
egg|A hen lays it|huevo|œuf|uovo|Ei|ovo|ei|jajko|ou|яйце|鸡蛋|بيضة|yumurta|卵|달걀|trứng
rice|Small white grains, cooked in water|arroz|riz|riso|Reis|arroz|rijst|ryż|orez|рис|米饭|أرز|pirinç|ご飯|쌀|gạo
coffee|Hot drink made from roasted beans|café|café|caffè|Kaffee|café|koffie|kawa|cafea|кава|咖啡|قهوة|kahve|コーヒー|커피|cà phê
tea|Hot drink made with leaves|té|thé|tè|Tee|chá|thee|herbata|ceai|чай|茶|شاي|çay|お茶|차|trà
sugar|Sweet white stuff you can add to tea|azúcar|sucre|zucchero|Zucker|açúcar|suiker|cukier|zahăr|цукор|糖|سكر|şeker|砂糖|설탕|đường
salt|White stuff that makes food salty|sal|sel|sale|Salz|sal|zout|sól|sare|сіль|盐|ملح|tuz|塩|소금|muối
butter|Yellow spread for bread|mantequilla|beurre|burro|Butter|manteiga|boter|masło|unt|масло|黄油|زبدة|tereyağı|バター|버터|bơ
banana|Long yellow fruit|plátano|banane|banana|Banane|banana|banaan|banan|banană|банан|香蕉|موز|muz|バナナ|바나나|chuối
orange|Round orange fruit full of juice|naranja|orange|arancia|Orange|laranja|sinaasappel|pomarańcza|portocală|апельсин|橙子|برتقال|portakal|オレンジ|오렌지|quả cam
lemon|Sour yellow fruit|limón|citron|limone|Zitrone|limão|citroen|cytryna|lămâie|лимон|柠檬|ليمون|limon|レモン|레몬|chanh
tomato|Red fruit used in salads and sauces|tomate|tomate|pomodoro|Tomate|tomate|tomaat|pomidor|roșie|помідор|西红柿|طماطم|domates|トマト|토마토|cà chua
carrot|Long orange vegetable|zanahoria|carotte|carota|Karotte|cenoura|wortel|marchewka|morcov|морква|胡萝卜|جزر|havuç|にんじん|당근|cà rốt
onion|Vegetable that makes you cry when you cut it|cebolla|oignon|cipolla|Zwiebel|cebola|ui|cebula|ceapă|цибуля|洋葱|بصل|soğan|玉ねぎ|양파|hành tây
meat|Food from animals, like beef or pork|carne|viande|carne|Fleisch|carne|vlees|mięso|carne|м'ясо|肉|لحم|et|肉|고기|thịt
chicken|Meat from a hen|pollo|poulet|pollo|Hähnchen|frango|kip|kurczak|pui|курятина|鸡肉|دجاج|tavuk eti|鶏肉|닭고기|thịt gà
soup|Hot liquid food you eat with a spoon|sopa|soupe|zuppa|Suppe|sopa|soep|zupa|supă|суп|汤|حساء|çorba|スープ|수프|súp
cake|Sweet food for birthdays|tarta|gâteau|torta|Kuchen|bolo|taart|ciasto|tort|торт|蛋糕|كعكة|pasta|ケーキ|케이크|bánh ngọt
honey|Sweet food made by bees|miel|miel|miele|Honig|mel|honing|miód|miere|мед|蜂蜜|عسل|bal|はちみつ|꿀|mật ong
oil|You fry food in it|aceite|huile|olio|Öl|óleo|olie|olej|ulei|олія|油|زيت|yağ|油|기름|dầu ăn
pepper|Black spice you put on food with salt|pimienta|poivre|pepe|Pfeffer|pimenta|peper|pieprz|piper|перець|胡椒|فلفل أسود|karabiber|こしょう|후추|hạt tiêu
juice|Drink made from fruit|zumo|jus|succo|Saft|sumo|sap|sok|suc|сік|果汁|عصير|meyve suyu|ジュース|주스|nước ép
wine|Drink made from grapes|vino|vin|vino|Wein|vinho|wijn|wino|vin|вино|葡萄酒|نبيذ|şarap|ワイン|와인|rượu vang
beer|Drink made with hops, popular in pubs|cerveza|bière|birra|Bier|cerveja|bier|piwo|bere|пиво|啤酒|بيرة|bira|ビール|맥주|bia
pasta|Italian food like spaghetti|pasta|pâtes|pasta|Nudeln|massa|pasta|makaron|paste|макарони|意大利面|معكرونة|makarna|パスタ|파스타|mì Ý
strawberry|Small red fruit with seeds on the outside|fresa|fraise|fragola|Erdbeere|morango|aardbei|truskawka|căpșună|полуниця|草莓|فراولة|çilek|いちご|딸기|dâu tây`,
town: `
street|Road in a town with houses and shops|calle|rue|strada|Straße|rua|straat|ulica|stradă|вулиця|街道|شارع|sokak|通り|거리|đường phố
station|Where you catch a train|estación|gare|stazione|Bahnhof|estação|station|dworzec|gară|вокзал|车站|محطة|istasyon|駅|역|nhà ga
airport|Where planes take off and land|aeropuerto|aéroport|aeroporto|Flughafen|aeroporto|vliegveld|lotnisko|aeroport|аеропорт|机场|مطار|havalimanı|空港|공항|sân bay
bridge|It takes a road over a river|puente|pont|ponte|Brücke|ponte|brug|most|pod|міст|桥|جسر|köprü|橋|다리|cây cầu
church|Building where Christians pray|iglesia|église|chiesa|Kirche|igreja|kerk|kościół|biserică|церква|教堂|كنيسة|kilise|教会|교회|nhà thờ
market|Place with stalls selling fresh food|mercado|marché|mercato|Markt|mercado|markt|targ|piață|ринок|市场|سوق|pazar|市場|시장|chợ
museum|Building where you see old and famous things|museo|musée|museo|Museum|museu|museum|muzeum|muzeu|музей|博物馆|متحف|müze|博物館|박물관|bảo tàng
hospital|Where doctors look after sick people|hospital|hôpital|ospedale|Krankenhaus|hospital|ziekenhuis|szpital|spital|лікарня|医院|مستشفى|hastane|病院|병원|bệnh viện
park|Green public space with grass and trees|parque|parc|parco|Park|parque|park|park|parc|парк|公园|حديقة عامة|park|公園|공원|công viên
shop|Place where you buy things|tienda|magasin|negozio|Laden|loja|winkel|sklep|magazin|магазин|商店|متجر|dükkân|店|가게|cửa hàng
bank|Where you keep your money|banco|banque|banca|Bank|banco|bank|bank|bancă|банк|银行|بنك|banka|銀行|은행|ngân hàng
square|Open public space in a town centre|plaza|place|piazza|Platz|praça|plein|plac|piață centrală|площа|广场|ساحة|meydan|広場|광장|quảng trường
school|Where children go to learn|escuela|école|scuola|Schule|escola|school|szkoła|școală|школа|学校|مدرسة|okul|学校|학교|trường học
library|Building where you borrow books|biblioteca|bibliothèque|biblioteca|Bibliothek|biblioteca|bibliotheek|biblioteka|bibliotecă|бібліотека|图书馆|مكتبة|kütüphane|図書館|도서관|thư viện
pharmacy|Shop that sells medicine|farmacia|pharmacie|farmacia|Apotheke|farmácia|apotheek|apteka|farmacie|аптека|药店|صيدلية|eczane|薬局|약국|hiệu thuốc
bakery|Shop that sells bread|panadería|boulangerie|panetteria|Bäckerei|padaria|bakkerij|piekarnia|brutărie|пекарня|面包店|مخبز|fırın|パン屋|빵집|tiệm bánh
restaurant|Place where you pay to eat a meal|restaurante|restaurant|ristorante|Restaurant|restaurante|restaurant|restauracja|restaurant|ресторан|餐厅|مطعم|restoran|レストラン|식당|nhà hàng
hotel|Place where you stay when travelling|hotel|hôtel|albergo|Hotel|hotel|hotel|hotel|hotel|готель|酒店|فندق|otel|ホテル|호텔|khách sạn
cinema|Where you watch films on a big screen|cine|cinéma|cinema|Kino|cinema|bioscoop|kino|cinema|кінотеатр|电影院|سينما|sinema|映画館|영화관|rạp chiếu phim
theatre|Where you watch plays|teatro|théâtre|teatro|Theater|teatro|theater|teatr|teatru|театр|剧院|مسرح|tiyatro|劇場|극장|nhà hát
beach|Sandy place next to the sea|playa|plage|spiaggia|Strand|praia|strand|plaża|plajă|пляж|海滩|شاطئ|plaj|ビーチ|해변|bãi biển
bus|Big vehicle that carries many passengers|autobús|bus|autobus|Bus|autocarro|bus|autobus|autobuz|автобус|公共汽车|حافلة|otobüs|バス|버스|xe buýt
train|It runs on rails between stations|tren|train|treno|Zug|comboio|trein|pociąg|tren|поїзд|火车|قطار|tren|電車|기차|tàu hỏa
taxi|Car you pay to take you somewhere|taxi|taxi|taxi|Taxi|táxi|taxi|taksówka|taxi|таксі|出租车|سيارة أجرة|taksi|タクシー|택시|taxi
ticket|You buy it to travel or see a show|billete|billet|biglietto|Fahrkarte|bilhete|kaartje|bilet|bilet|квиток|票|تذكرة|bilet|切符|표|vé
map|Drawing that shows you where places are|mapa|carte|mappa|Karte|mapa|kaart|mapa|hartă|карта|地图|خريطة|harita|地図|지도|bản đồ
police|People who make sure everyone obeys the law|policía|police|polizia|Polizei|polícia|politie|policja|poliție|поліція|警察|شرطة|polis|警察|경찰|cảnh sát
castle|Big old stone building where kings lived|castillo|château|castello|Burg|castelo|kasteel|zamek|castel|замок|城堡|قلعة|kale|城|성|lâu đài
tower|Very tall, narrow building|torre|tour|torre|Turm|torre|toren|wieża|turn|вежа|塔|برج|kule|塔|탑|tháp
zoo|Place where you can see wild animals|zoo|zoo|zoo|Zoo|zoo|dierentuin|zoo|grădină zoologică|зоопарк|动物园|حديقة حيوانات|hayvanat bahçesi|動物園|동물원|sở thú`,
home: `
house|Building where a family lives|casa|maison|casa|Haus|casa|huis|dom|casă|будинок|房子|بيت|ev|家|집|ngôi nhà
door|You open it to go into a room|puerta|porte|porta|Tür|porta|deur|drzwi|ușă|двері|门|باب|kapı|ドア|문|cửa
window|Glass in a wall that lets light in|ventana|fenêtre|finestra|Fenster|janela|raam|okno|fereastră|вікно|窗户|نافذة|pencere|窓|창문|cửa sổ
table|You eat your meals at it|mesa|table|tavolo|Tisch|mesa|tafel|stół|masă|стіл|桌子|طاولة|masa|テーブル|탁자|cái bàn
chair|Something you sit on|silla|chaise|sedia|Stuhl|cadeira|stoel|krzesło|scaun|стілець|椅子|كرسي|sandalye|椅子|의자|cái ghế
bed|You sleep in it|cama|lit|letto|Bett|cama|bed|łóżko|pat|ліжко|床|سرير|yatak|ベッド|침대|giường
kitchen|Room where you cook|cocina|cuisine|cucina|Küche|cozinha|keuken|kuchnia|bucătărie|кухня|厨房|مطبخ|mutfak|台所|부엌|nhà bếp
bathroom|Room with a shower or a bath|baño|salle de bains|bagno|Badezimmer|casa de banho|badkamer|łazienka|baie|ванна кімната|浴室|حمام|banyo|浴室|욕실|phòng tắm
bedroom|Room where you sleep|dormitorio|chambre|camera|Schlafzimmer|quarto|slaapkamer|sypialnia|dormitor|спальня|卧室|غرفة نوم|yatak odası|寝室|침실|phòng ngủ
garden|Outdoor space with grass and flowers|jardín|jardin|giardino|Garten|jardim|tuin|ogród|grădină|сад|花园|حديقة|bahçe|庭|정원|khu vườn
key|You use it to lock and unlock a door|llave|clé|chiave|Schlüssel|chave|sleutel|klucz|cheie|ключ|钥匙|مفتاح|anahtar|鍵|열쇠|chìa khóa
lamp|It gives light in a room|lámpara|lampe|lampada|Lampe|candeeiro|lamp|lampa|lampă|лампа|灯|مصباح|lamba|ランプ|램프|đèn
sofa|Long soft seat for two or more people|sofá|canapé|divano|Sofa|sofá|bank|kanapa|canapea|диван|沙发|أريكة|kanepe|ソファ|소파|ghế sofa
mirror|Glass where you see yourself|espejo|miroir|specchio|Spiegel|espelho|spiegel|lustro|oglindă|дзеркало|镜子|مرآة|ayna|鏡|거울|gương
floor|The part of a room you walk on|suelo|sol|pavimento|Boden|chão|vloer|podłoga|podea|підлога|地板|أرضية|zemin|床（ゆか）|바닥|sàn nhà
wall|One of the sides of a room|pared|mur|parete|Wand|parede|muur|ściana|perete|стіна|墙|جدار|duvar|壁|벽|bức tường
roof|The top of a house|tejado|toit|tetto|Dach|telhado|dak|dach|acoperiș|дах|屋顶|سقف|çatı|屋根|지붕|mái nhà
stairs|Steps that take you up to the next floor|escalera|escalier|scala|Treppe|escada|trap|schody|scări|сходи|楼梯|درج|merdiven|階段|계단|cầu thang
fridge|Cold box that keeps food fresh|nevera|frigo|frigorifero|Kühlschrank|frigorífico|koelkast|lodówka|frigider|холодильник|冰箱|ثلاجة|buzdolabı|冷蔵庫|냉장고|tủ lạnh
oven|Hot box you bake food in|horno|four|forno|Ofen|forno|oven|piekarnik|cuptor|духовка|烤箱|فرن|fırın|オーブン|오븐|lò nướng
cup|You drink tea from it|taza|tasse|tazza|Tasse|chávena|kopje|filiżanka|ceașcă|чашка|杯子|فنجان|fincan|カップ|컵|cái cốc
plate|Flat dish you eat from|plato|assiette|piatto|Teller|prato|bord|talerz|farfurie|тарілка|盘子|طبق|tabak|皿|접시|cái đĩa
spoon|You eat soup with it|cuchara|cuillère|cucchiaio|Löffel|colher|lepel|łyżka|lingură|ложка|勺子|ملعقة|kaşık|スプーン|숟가락|cái thìa
knife|You cut food with it|cuchillo|couteau|coltello|Messer|faca|mes|nóż|cuțit|ніж|刀|سكين|bıçak|ナイフ|칼|con dao`,
body: `
head|The top part of your body|cabeza|tête|testa|Kopf|cabeça|hoofd|głowa|cap|голова|头|رأس|baş|頭|머리|đầu
hair|It grows on your head|pelo|cheveux|capelli|Haare|cabelo|haar|włosy|păr|волосся|头发|شعر|saç|髪|머리카락|tóc
face|The front of your head|cara|visage|viso|Gesicht|cara|gezicht|twarz|față|обличчя|脸|وجه|yüz|顔|얼굴|khuôn mặt
eye|You see with it|ojo|œil|occhio|Auge|olho|oog|oko|ochi|око|眼睛|عين|göz|目|눈|mắt
ear|You hear with it|oreja|oreille|orecchio|Ohr|orelha|oor|ucho|ureche|вухо|耳朵|أذن|kulak|耳|귀|tai
nose|You smell with it|nariz|nez|naso|Nase|nariz|neus|nos|nas|ніс|鼻子|أنف|burun|鼻|코|mũi
mouth|You eat and speak with it|boca|bouche|bocca|Mund|boca|mond|usta|gură|рот|嘴|فم|ağız|口|입|miệng
tooth|Small, white and hard, in your mouth|diente|dent|dente|Zahn|dente|tand|ząb|dinte|зуб|牙齿|سن|diş|歯|이|răng
tongue|Pink part in your mouth that tastes food|lengua|langue|lingua|Zunge|língua|tong|język|limbă|язик|舌头|لسان|dil|舌|혀|lưỡi
neck|It joins your head to your body|cuello|cou|collo|Hals|pescoço|nek|szyja|gât|шия|脖子|رقبة|boyun|首|목|cổ
shoulder|Where your arm joins your body|hombro|épaule|spalla|Schulter|ombro|schouder|bark|umăr|плече|肩膀|كتف|omuz|肩|어깨|vai
arm|Part of the body between shoulder and hand|brazo|bras|braccio|Arm|braço|arm|ramię|braț|рука|手臂|ذراع|kol|腕|팔|cánh tay
hand|It has five fingers|mano|main|mano|Hand|mão|hand|dłoń|mână|кисть|手|يد|el|手|손|bàn tay
finger|You have five on each hand|dedo|doigt|dito|Finger|dedo|vinger|palec|deget|палець|手指|إصبع|parmak|指|손가락|ngón tay
leg|You walk on it|pierna|jambe|gamba|Bein|perna|been|noga|picior|нога|腿|ساق|bacak|脚|다리|chân
foot|The part at the end of your leg|pie|pied|piede|Fuß|pé|voet|stopa|laba piciorului|стопа|脚掌|قدم|ayak|足|발|bàn chân
knee|Joint in the middle of your leg|rodilla|genou|ginocchio|Knie|joelho|knie|kolano|genunchi|коліно|膝盖|ركبة|diz|膝|무릎|đầu gối
back|The part of your body behind you|espalda|dos|schiena|Rücken|costas|rug|plecy|spate|спина|背|ظهر|sırt|背中|등|lưng
stomach|Where food goes after you swallow it|estómago|estomac|stomaco|Magen|estômago|maag|żołądek|stomac|шлунок|胃|معدة|mide|胃|위|dạ dày
heart|It pumps blood round your body|corazón|cœur|cuore|Herz|coração|hart|serce|inimă|серце|心脏|قلب|kalp|心臓|심장|tim
skin|It covers your whole body|piel|peau|pelle|Haut|pele|huid|skóra|piele|шкіра|皮肤|جلد|deri|肌|피부|da
bone|Hard white part inside your body|hueso|os|osso|Knochen|osso|bot|kość|os|кістка|骨头|عظم|kemik|骨|뼈|xương
blood|Red liquid inside your body|sangre|sang|sangue|Blut|sangue|bloed|krew|sânge|кров|血|دم|kan|血|피|máu
lip|Soft edge of your mouth|labio|lèvre|labbro|Lippe|lábio|lip|warga|buză|губа|嘴唇|شفة|dudak|唇|입술|môi`,
clothes: `
shirt|Top with buttons and a collar|camisa|chemise|camicia|Hemd|camisa|overhemd|koszula|cămașă|сорочка|衬衫|قميص|gömlek|シャツ|셔츠|áo sơ mi
trousers|You wear them on your legs|pantalones|pantalon|pantaloni|Hose|calças|broek|spodnie|pantaloni|штани|裤子|بنطال|pantolon|ズボン|바지|quần dài
dress|One piece of clothing from the shoulders to the knees or lower|vestido|robe|vestito|Kleid|vestido|jurk|sukienka|rochie|сукня|连衣裙|فستان|elbise|ワンピース|원피스|váy liền
skirt|It hangs from the waist|falda|jupe|gonna|Rock|saia|rok|spódnica|fustă|спідниця|裙子|تنورة|etek|スカート|치마|chân váy
shoe|You wear it on your foot|zapato|chaussure|scarpa|Schuh|sapato|schoen|but|pantof|черевик|鞋|حذاء|ayakkabı|靴|신발|giày
sock|You wear it under your shoe|calcetín|chaussette|calzino|Socke|meia|sok|skarpeta|șosetă|шкарпетка|袜子|جورب|çorap|靴下|양말|tất
hat|You wear it on your head|sombrero|chapeau|cappello|Hut|chapéu|hoed|kapelusz|pălărie|капелюх|帽子|قبعة|şapka|帽子|모자|mũ
coat|Long warm thing you wear outside in winter|abrigo|manteau|cappotto|Mantel|casaco|jas|płaszcz|palton|пальто|大衣|معطف|palto|コート|코트|áo khoác dài
jacket|A short coat|chaqueta|veste|giacca|Jacke|blusão|jack|kurtka|geacă|куртка|夹克|سترة|ceket|ジャケット|재킷|áo khoác
jumper|Warm knitted top|jersey|pull|maglione|Pullover|camisola|trui|sweter|pulover|светр|毛衣|كنزة|kazak|セーター|스웨터|áo len
belt|You wear it round your waist|cinturón|ceinture|cintura|Gürtel|cinto|riem|pasek|curea|ремінь|腰带|حزام|kemer|ベルト|벨트|thắt lưng
glove|You wear it on your hand|guante|gant|guanto|Handschuh|luva|handschoen|rękawiczka|mănușă|рукавиця|手套|قفاز|eldiven|手袋|장갑|găng tay
scarf|You wear it round your neck when it's cold|bufanda|écharpe|sciarpa|Schal|cachecol|sjaal|szalik|fular|шарф|围巾|وشاح|atkı|マフラー|목도리|khăn quàng cổ
boot|Shoe that covers your ankle|bota|botte|stivale|Stiefel|bota|laars|trzewik|cizmă|чобіт|靴子|جزمة|bot|ブーツ|부츠|ủng
pocket|Small bag sewn into clothes|bolsillo|poche|tasca|Tasche|bolso|zak|kieszeń|buzunar|кишеня|口袋|جيب|cep|ポケット|주머니|túi áo
button|Small round thing that keeps a shirt closed|botón|bouton|bottone|Knopf|botão|knoop|guzik|nasture|ґудзик|纽扣|زر|düğme|ボタン|단추|cúc áo
ring|Jewellery you wear on your finger|anillo|bague|anello|Ring|anel|ring|pierścionek|inel|каблучка|戒指|خاتم|yüzük|指輪|반지|nhẫn
watch|You wear it on your wrist to tell the time|reloj|montre|orologio|Uhr|relógio|horloge|zegarek|ceas|годинник|手表|ساعة|saat|腕時計|손목시계|đồng hồ
umbrella|You hold it over your head when it rains|paraguas|parapluie|ombrello|Regenschirm|guarda-chuva|paraplu|parasol|umbrelă|парасолька|雨伞|مظلة|şemsiye|傘|우산|ô
pyjamas|Clothes you wear in bed|pijama|pyjama|pigiama|Schlafanzug|pijama|pyjama|piżama|pijama|піжама|睡衣|بيجامة|pijama|パジャマ|잠옷|đồ ngủ`,
family: `
mother|Your female parent|madre|mère|madre|Mutter|mãe|moeder|matka|mamă|мати|母亲|أم|anne|母|어머니|mẹ
father|Your male parent|padre|père|padre|Vater|pai|vader|ojciec|tată|батько|父亲|أب|baba|父|아버지|bố
brother|A boy or man with the same parents as you|hermano|frère|fratello|Bruder|irmão|broer|brat|frate|брат|兄弟|أخ|erkek kardeş|兄弟|형제|anh em trai
sister|A girl or woman with the same parents as you|hermana|sœur|sorella|Schwester|irmã|zus|siostra|soră|сестра|姐妹|أخت|kız kardeş|姉妹|자매|chị em gái
son|Your male child|hijo|fils|figlio|Sohn|filho|zoon|syn|fiu|син|儿子|ابن|oğul|息子|아들|con trai
daughter|Your female child|hija|fille|figlia|Tochter|filha|dochter|córka|fiică|донька|女儿|ابنة|kız evlat|娘|딸|con gái
grandmother|Your mother's or father's mother|abuela|grand-mère|nonna|Großmutter|avó|oma|babcia|bunică|бабуся|奶奶|جدة|büyükanne|祖母|할머니|bà
grandfather|Your mother's or father's father|abuelo|grand-père|nonno|Großvater|avô|opa|dziadek|bunic|дідусь|爷爷|جد|büyükbaba|祖父|할아버지|ông
uncle|Your mother's or father's brother|tío|oncle|zio|Onkel|tio|oom|wujek|unchi|дядько|叔叔|عم|amca|おじ|삼촌|chú
aunt|Your mother's or father's sister|tía|tante|zia|Tante|tia|tante|ciocia|mătușă|тітка|阿姨|عمة|teyze|おば|이모|cô
cousin|The child of your uncle or aunt|primo|cousin|cugino|Cousin|primo|neef|kuzyn|văr|двоюрідний брат|表兄弟|ابن عم|kuzen|いとこ|사촌|anh họ
baby|A very young child|bebé|bébé|bebè|Baby|bebé|baby|niemowlę|bebeluș|немовля|婴儿|طفل رضيع|bebek|赤ちゃん|아기|em bé
child|A young person, not an adult|niño|enfant|bambino|Kind|criança|kind|dziecko|copil|дитина|孩子|طفل|çocuk|子ども|아이|đứa trẻ
friend|Someone you like and trust|amigo|ami|amico|Freund|amigo|vriend|przyjaciel|prieten|друг|朋友|صديق|arkadaş|友達|친구|bạn
husband|The man you are married to|marido|mari|marito|Ehemann|marido|echtgenoot|mąż|soț|чоловік|丈夫|زوج|koca|夫|남편|chồng
wife|The woman you are married to|esposa|épouse|moglie|Ehefrau|esposa|echtgenote|żona|soție|дружина|妻子|زوجة|eş|妻|아내|vợ
man|An adult male|hombre|homme|uomo|Mann|homem|man|mężczyzna|bărbat|чоловік|男人|رجل|adam|男性|남자|đàn ông
woman|An adult female|mujer|femme|donna|Frau|mulher|vrouw|kobieta|femeie|жінка|女人|امرأة|kadın|女性|여자|phụ nữ
boy|A young male|chico|garçon|ragazzo|Junge|rapaz|jongen|chłopiec|băiat|хлопчик|男孩|ولد|erkek çocuk|男の子|소년|cậu bé
girl|A young female|chica|fillette|ragazza|Mädchen|rapariga|meisje|dziewczynka|fată|дівчинка|女孩|بنت|kız|女の子|소녀|cô bé`,
nature: `
sun|Bright star that gives us daylight|sol|soleil|sole|Sonne|sol|zon|słońce|soare|сонце|太阳|شمس|güneş|太陽|해|mặt trời
moon|It shines in the sky at night|luna|lune|luna|Mond|lua|maan|księżyc|lună|місяць|月亮|قمر|ay|月|달|mặt trăng
star|Small bright light in the night sky|estrella|étoile|stella|Stern|estrela|ster|gwiazda|stea|зірка|星星|نجمة|yıldız|星|별|ngôi sao
sky|The blue space above you|cielo|ciel|cielo|Himmel|céu|lucht|niebo|cer|небо|天空|سماء|gökyüzü|空|하늘|bầu trời
cloud|White or grey shape in the sky|nube|nuage|nuvola|Wolke|nuvem|wolk|chmura|nor|хмара|云|سحابة|bulut|雲|구름|mây
rain|Water that falls from clouds|lluvia|pluie|pioggia|Regen|chuva|regen|deszcz|ploaie|дощ|雨|مطر|yağmur|雨|비|mưa
snow|Cold white flakes that fall in winter|nieve|neige|neve|Schnee|neve|sneeuw|śnieg|zăpadă|сніг|雪|ثلج|kar|雪|눈|tuyết
wind|Moving air|viento|vent|vento|Wind|vento|wind|wiatr|vânt|вітер|风|رياح|rüzgâr|風|바람|gió
storm|Bad weather with strong wind and rain|tormenta|orage|tempesta|Sturm|tempestade|storm|burza|furtună|буря|暴风雨|عاصفة|fırtına|嵐|폭풍|bão
fog|Thick cloud near the ground|niebla|brouillard|nebbia|Nebel|nevoeiro|mist|mgła|ceață|туман|雾|ضباب|sis|霧|안개|sương mù
tree|Tall plant with a trunk and leaves|árbol|arbre|albero|Baum|árvore|boom|drzewo|copac|дерево|树|شجرة|ağaç|木|나무|cây
flower|Colourful part of a plant|flor|fleur|fiore|Blume|flor|bloem|kwiat|floare|квітка|花|زهرة|çiçek|花|꽃|hoa
grass|Green plants that cover a lawn|hierba|herbe|erba|Gras|relva|gras|trawa|iarbă|трава|草|عشب|çimen|草|풀|cỏ
leaf|Flat green part of a tree|hoja|feuille|foglia|Blatt|folha|blad|liść|frunză|листок|叶子|ورقة شجر|yaprak|葉|잎|lá cây
river|Water that flows to the sea|río|rivière|fiume|Fluss|rio|rivier|rzeka|râu|річка|河|نهر|nehir|川|강|sông
sea|Large area of salt water|mar|mer|mare|Meer|mar|zee|morze|mare|море|海|بحر|deniz|海|바다|biển
lake|Big area of water with land all round it|lago|lac|lago|See|lago|meer|jezioro|lac|озеро|湖|بحيرة|göl|湖|호수|hồ
mountain|A very high hill|montaña|montagne|montagna|Berg|montanha|berg|góra|munte|гора|山|جبل|dağ|山|산|núi
forest|Large area with lots of trees|bosque|forêt|foresta|Wald|floresta|bos|las|pădure|ліс|森林|غابة|orman|森|숲|rừng
island|Land with water all around it|isla|île|isola|Insel|ilha|eiland|wyspa|insulă|острів|岛|جزيرة|ada|島|섬|hòn đảo
stone|Small hard piece of rock|piedra|pierre|pietra|Stein|pedra|steen|kamień|piatră|камінь|石头|حجر|taş|石|돌|hòn đá
fire|Hot flames that burn|fuego|feu|fuoco|Feuer|fogo|vuur|ogień|foc|вогонь|火|نار|ateş|火|불|lửa
ice|Frozen water|hielo|glace|ghiaccio|Eis|gelo|ijs|lód|gheață|лід|冰|جليد|buz|氷|얼음|băng
rainbow|Colourful arc in the sky after rain|arcoíris|arc-en-ciel|arcobaleno|Regenbogen|arco-íris|regenboog|tęcza|curcubeu|веселка|彩虹|قوس قزح|gökkuşağı|虹|무지개|cầu vồng`,
verbs: `
eat|To put food in your mouth and swallow it|comer|manger|mangiare|essen|comer|eten|jeść|a mânca|їсти|吃|يأكل|yemek|食べる|먹다|ăn
drink|To swallow water, juice or tea|beber|boire|bere|trinken|beber|drinken|pić|a bea|пити|喝|يشرب|içmek|飲む|마시다|uống
sleep|What you do in bed at night|dormir|dormir|dormire|schlafen|dormir|slapen|spać|a dormi|спати|睡觉|ينام|uyumak|寝る|자다|ngủ
walk|To move on foot|caminar|marcher|camminare|laufen|caminhar|lopen|chodzić|a merge pe jos|ходити пішки|走路|يمشي|yürümek|歩く|걷다|đi bộ
speak|To say words out loud|hablar|parler|parlare|sprechen|falar|spreken|mówić|a vorbi|говорити|说话|يتكلم|konuşmak|話す|말하다|nói
read|What you do with a book|leer|lire|leggere|lesen|ler|lezen|czytać|a citi|читати|读|يقرأ|okumak|読む|읽다|đọc
write|To put words on paper with a pen|escribir|écrire|scrivere|schreiben|escrever|schrijven|pisać|a scrie|писати|写|يكتب|yazmak|書く|쓰다|viết
buy|To get something by paying for it|comprar|acheter|comprare|kaufen|comprar|kopen|kupować|a cumpăra|купувати|买|يشتري|satın almak|買う|사다|mua
open|The opposite of close|abrir|ouvrir|aprire|öffnen|abrir|openen|otwierać|a deschide|відкривати|打开|يفتح|açmak|開ける|열다|mở
close|The opposite of open|cerrar|fermer|chiudere|schließen|fechar|sluiten|zamykać|a închide|закривати|关上|يغلق|kapatmak|閉める|닫다|đóng
sing|To make music with your voice|cantar|chanter|cantare|singen|cantar|zingen|śpiewać|a cânta|співати|唱歌|يغني|şarkı söylemek|歌う|노래하다|hát
dance|To move your body to music|bailar|danser|ballare|tanzen|dançar|dansen|tańczyć|a dansa|танцювати|跳舞|يرقص|dans etmek|踊る|춤추다|nhảy múa
run|To move very fast on foot|correr|courir|correre|rennen|correr|rennen|biegać|a alerga|бігати|跑|يركض|koşmak|走る|달리다|chạy
swim|To move through water|nadar|nager|nuotare|schwimmen|nadar|zwemmen|pływać|a înota|плавати|游泳|يسبح|yüzmek|泳ぐ|수영하다|bơi
cook|To make food hot and ready to eat|cocinar|cuisiner|cucinare|kochen|cozinhar|koken|gotować|a găti|готувати|做饭|يطبخ|yemek pişirmek|料理する|요리하다|nấu ăn
work|To do a job|trabajar|travailler|lavorare|arbeiten|trabalhar|werken|pracować|a lucra|працювати|工作|يعمل|çalışmak|働く|일하다|làm việc
play|To have fun with a game|jugar|jouer|giocare|spielen|jogar|spelen|grać|a se juca|грати|玩|يلعب|oynamak|遊ぶ|놀다|chơi
listen|To pay attention to a sound|escuchar|écouter|ascoltare|zuhören|ouvir|luisteren|słuchać|a asculta|слухати|听|يستمع|dinlemek|聞く|듣다|nghe
see|What you do with your eyes|ver|voir|vedere|sehen|ver|zien|widzieć|a vedea|бачити|看见|يرى|görmek|見る|보다|nhìn thấy
think|To use your mind|pensar|penser|pensare|denken|pensar|denken|myśleć|a gândi|думати|想|يفكر|düşünmek|考える|생각하다|nghĩ
learn|To get new knowledge or skills|aprender|apprendre|imparare|lernen|aprender|leren|uczyć się|a învăța|вчитися|学习|يتعلم|öğrenmek|学ぶ|배우다|học
help|To make things easier for someone|ayudar|aider|aiutare|helfen|ajudar|helpen|pomagać|a ajuta|допомагати|帮助|يساعد|yardım etmek|手伝う|돕다|giúp đỡ
wait|To stay until something happens|esperar|attendre|aspettare|warten|esperar|wachten|czekać|a aștepta|чекати|等|ينتظر|beklemek|待つ|기다리다|chờ
travel|To go to other places|viajar|voyager|viaggiare|reisen|viajar|reizen|podróżować|a călători|подорожувати|旅行|يسافر|seyahat etmek|旅行する|여행하다|du lịch
live|To have your home somewhere|vivir|habiter|abitare|wohnen|viver|wonen|mieszkać|a locui|жити|住|يسكن|yaşamak|住む|살다|sống
love|To like someone very, very much|amar|aimer|amare|lieben|amar|liefhebben|kochać|a iubi|кохати|爱|يحب|sevmek|愛する|사랑하다|yêu
want|To wish for something|querer|vouloir|volere|wollen|querer|willen|chcieć|a vrea|хотіти|想要|يريد|istemek|欲しい|원하다|muốn
know|To have information in your head|saber|savoir|sapere|wissen|saber|weten|wiedzieć|a ști|знати|知道|يعرف|bilmek|知る|알다|biết
give|To hand something to someone|dar|donner|dare|geben|dar|geven|dawać|a da|давати|给|يعطي|vermek|あげる|주다|cho
drive|To make a car go|conducir|conduire|guidare|fahren|conduzir|rijden|prowadzić|a conduce|водити|开车|يقود|araba sürmek|運転する|운전하다|lái xe`,
present: `
eats|She ___ breakfast at eight. (eat)|comer>come|manger>mange|mangiare>mangia|essen>isst|comer>come|eten>eet|she eats|ona je|ea mănâncă|вона їсть|她吃|هي تأكل|o yer|彼女は食べる|그녀는 먹어요|cô ấy ăn
drinks|She ___ coffee every morning. (drink)|beber>bebe|boire>boit|bere>beve|trinken>trinkt|beber>bebe|drinken>drinkt|she drinks|ona pije|ea bea|вона п'є|她喝|هي تشرب|o içer|彼女は飲む|그녀는 마셔요|cô ấy uống
sleeps|She ___ eight hours a night. (sleep)|dormir>duerme|dormir>dort|dormire>dorme|schlafen>schläft|dormir>dorme|slapen>slaapt|she sleeps|ona śpi|ea doarme|вона спить|她睡觉|هي تنام|o uyur|彼女は寝る|그녀는 자요|cô ấy ngủ
walks|She ___ to work. (walk)|caminar>camina|marcher>marche|camminare>cammina|laufen>läuft|caminhar>caminha|lopen>loopt|she walks|ona chodzi|ea merge pe jos|вона ходить пішки|她走路|هي تمشي|o yürür|彼女は歩く|그녀는 걸어요|cô ấy đi bộ
speaks|She ___ three languages. (speak)|hablar>habla|parler>parle|parlare>parla|sprechen>spricht|falar>fala|spreken>spreekt|she speaks|ona mówi|ea vorbește|вона говорить|她说|هي تتكلم|o konuşur|彼女は話す|그녀는 말해요|cô ấy nói
reads|She ___ a book every week. (read)|leer>lee|lire>lit|leggere>legge|lesen>liest|ler>lê|lezen>leest|she reads|ona czyta|ea citește|вона читає|她读|هي تقرأ|o okur|彼女は読む|그녀는 읽어요|cô ấy đọc
writes|She ___ emails all day. (write)|escribir>escribe|écrire>écrit|scrivere>scrive|schreiben>schreibt|escrever>escreve|schrijven>schrijft|she writes|ona pisze|ea scrie|вона пише|她写|هي تكتب|o yazar|彼女は書く|그녀는 써요|cô ấy viết
buys|She ___ bread at the bakery. (buy)|comprar>compra|acheter>achète|comprare>compra|kaufen>kauft|comprar>compra|kopen>koopt|she buys|ona kupuje|ea cumpără|вона купує|她买|هي تشتري|o satın alır|彼女は買う|그녀는 사요|cô ấy mua
goes|She ___ to school by bus. (go)|ir>va|aller>va|andare>va|gehen>geht|ir>vai|gaan>gaat|she goes|ona idzie|ea merge|вона йде|她去|هي تذهب|o gider|彼女は行く|그녀는 가요|cô ấy đi
has|She ___ two brothers. (have)|tener>tiene|avoir>a|avere>ha|haben>hat|ter>tem|hebben>heeft|she has|ona ma|ea are|вона має|她有|لديها|onun var|彼女は持っている|그녀는 가지고 있어요|cô ấy có
comes|She ___ home at six. (come)|venir>viene|venir>vient|venire>viene|kommen>kommt|vir>vem|komen>komt|she comes|ona przychodzi|ea vine|вона приходить|她来|هي تأتي|o gelir|彼女は来る|그녀는 와요|cô ấy đến
makes|She ___ a cake for the party. (make)|hacer>hace|faire>fait|fare>fa|machen>macht|fazer>faz|maken>maakt|she makes|ona robi|ea face|вона робить|她做|هي تصنع|o yapar|彼女は作る|그녀는 만들어요|cô ấy làm
sees|She ___ her friends on Fridays. (see)|ver>ve|voir>voit|vedere>vede|sehen>sieht|ver>vê|zien>ziet|she sees|ona widzi|ea vede|вона бачить|她见|هي ترى|o görür|彼女は会う|그녀는 만나요|cô ấy gặp
wants|She ___ a new phone. (want)|querer>quiere|vouloir>veut|volere>vuole|wollen>will|querer>quer|willen>wil|she wants|ona chce|ea vrea|вона хоче|她想要|هي تريد|o ister|彼女は欲しがっている|그녀는 원해요|cô ấy muốn
knows|She ___ the answer. (know)|saber>sabe|savoir>sait|sapere>sa|wissen>weiß|saber>sabe|weten>weet|she knows|ona wie|ea știe|вона знає|她知道|هي تعرف|o bilir|彼女は知っている|그녀는 알아요|cô ấy biết
thinks|She ___ it's a good idea. (think)|pensar>piensa|penser>pense|pensare>pensa|denken>denkt|pensar>pensa|denken>denkt|she thinks|ona myśli|ea crede|вона думає|她认为|هي تعتقد|o düşünür|彼女は思う|그녀는 생각해요|cô ấy nghĩ
works|She ___ in a bank. (work)|trabajar>trabaja|travailler>travaille|lavorare>lavora|arbeiten>arbeitet|trabalhar>trabalha|werken>werkt|she works|ona pracuje|ea lucrează|вона працює|她工作|هي تعمل|o çalışır|彼女は働く|그녀는 일해요|cô ấy làm việc
lives|She ___ in London. (live)|vivir>vive|habiter>habite|abitare>abita|wohnen>wohnt|viver>vive|wonen>woont|she lives|ona mieszka|ea locuiește|вона живе|她住|هي تسكن|o yaşar|彼女は住んでいる|그녀는 살아요|cô ấy sống
cooks|She ___ dinner every evening. (cook)|cocinar>cocina|cuisiner>cuisine|cucinare>cucina|kochen>kocht|cozinhar>cozinha|koken>kookt|she cooks|ona gotuje|ea gătește|вона готує|她做饭|هي تطبخ|o yemek pişirir|彼女は料理する|그녀는 요리해요|cô ấy nấu ăn
runs|She ___ in the park. (run)|correr>corre|courir>court|correre>corre|rennen>rennt|correr>corre|rennen>rent|she runs|ona biega|ea aleargă|вона бігає|她跑步|هي تركض|o koşar|彼女は走る|그녀는 달려요|cô ấy chạy
swims|She ___ every morning. (swim)|nadar>nada|nager>nage|nuotare>nuota|schwimmen>schwimmt|nadar>nada|zwemmen>zwemt|she swims|ona pływa|ea înoată|вона плаває|她游泳|هي تسبح|o yüzer|彼女は泳ぐ|그녀는 수영해요|cô ấy bơi
sings|She ___ in a choir. (sing)|cantar>canta|chanter>chante|cantare>canta|singen>singt|cantar>canta|zingen>zingt|she sings|ona śpiewa|ea cântă|вона співає|她唱歌|هي تغني|o şarkı söyler|彼女は歌う|그녀는 노래해요|cô ấy hát
opens|She ___ the window. (open)|abrir>abre|ouvrir>ouvre|aprire>apre|öffnen>öffnet|abrir>abre|openen>opent|she opens|ona otwiera|ea deschide|вона відкриває|她打开|هي تفتح|o açar|彼女は開ける|그녀는 열어요|cô ấy mở
learns|She ___ Spanish online. (learn)|aprender>aprende|apprendre>apprend|imparare>impara|lernen>lernt|aprender>aprende|leren>leert|she learns|ona się uczy|ea învață|вона вчиться|她学|هي تتعلم|o öğrenir|彼女は学ぶ|그녀는 배워요|cô ấy học`,
past: `
ate|Past tense of 'eat'|comer>comí|manger>mangé|mangiare>mangiato|essen>gegessen|comer>comi|eten>gegeten|I ate|jadłem/jadłam|am mâncat|я їв/їла|我吃了|أكلتُ|yedim|食べた|먹었어요|tôi đã ăn
drank|Past tense of 'drink'|beber>bebí|boire>bu|bere>bevuto|trinken>getrunken|beber>bebi|drinken>gedronken|I drank|piłem/piłam|am băut|я пив/пила|我喝了|شربتُ|içtim|飲んだ|마셨어요|tôi đã uống
slept|Past tense of 'sleep'|dormir>dormí|dormir>dormi|dormire>dormito|schlafen>geschlafen|dormir>dormi|slapen>geslapen|I slept|spałem/spałam|am dormit|я спав/спала|我睡了|نمتُ|uyudum|寝た|잤어요|tôi đã ngủ
walked|Past tense of 'walk'|caminar>caminé|marcher>marché|camminare>camminato|laufen>gelaufen>ich bin ___|caminhar>caminhei|lopen>gelopen|I walked|chodziłem/chodziłam|am mers pe jos|я ходив/ходила пішки|我走了路|مشيتُ|yürüdüm|歩いた|걸었어요|tôi đã đi bộ
spoke|Past tense of 'speak'|hablar>hablé|parler>parlé|parlare>parlato|sprechen>gesprochen|falar>falei|spreken>gesproken|I spoke|mówiłem/mówiłam|am vorbit|я говорив/говорила|我说了|تكلمتُ|konuştum|話した|말했어요|tôi đã nói
wrote|Past tense of 'write'|escribir>escribí|écrire>écrit|scrivere>scritto|schreiben>geschrieben|escrever>escrevi|schrijven>geschreven|I wrote|pisałem/pisałam|am scris|я писав/писала|我写了|كتبتُ|yazdım|書いた|썼어요|tôi đã viết
bought|Past tense of 'buy'|comprar>compré|acheter>acheté|comprare>comprato|kaufen>gekauft|comprar>comprei|kopen>gekocht|I bought|kupiłem/kupiłam|am cumpărat|я купив/купила|我买了|اشتريتُ|satın aldım|買った|샀어요|tôi đã mua
went|Past tense of 'go'|ir>fui|aller>allé>je suis ___|andare>andato>sono ___|gehen>gegangen>ich bin ___|ir>fui|gaan>gegaan>ik ben ___|I went|poszedłem/poszłam|am mers|я пішов/пішла|我去了|ذهبتُ|gittim|行った|갔어요|tôi đã đi
saw|Past tense of 'see'|ver>vi|voir>vu|vedere>visto|sehen>gesehen|ver>vi|zien>gezien|I saw|widziałem/widziałam|am văzut|я бачив/бачила|我看见了|رأيتُ|gördüm|見た|봤어요|tôi đã thấy
sang|Past tense of 'sing'|cantar>canté|chanter>chanté|cantare>cantato|singen>gesungen|cantar>cantei|zingen>gezongen|I sang|śpiewałem/śpiewałam|am cântat|я співав/співала|我唱了|غنّيتُ|şarkı söyledim|歌った|노래했어요|tôi đã hát
danced|Past tense of 'dance'|bailar>bailé|danser>dansé|ballare>ballato|tanzen>getanzt|dançar>dancei|dansen>gedanst|I danced|tańczyłem/tańczyłam|am dansat|я танцював/танцювала|我跳了舞|رقصتُ|dans ettim|踊った|춤췄어요|tôi đã nhảy múa
opened|Past tense of 'open'|abrir>abrí|ouvrir>ouvert|aprire>aperto|öffnen>geöffnet|abrir>abri|openen>geopend|I opened|otworzyłem/otworzyłam|am deschis|я відкрив/відкрила|我打开了|فتحتُ|açtım|開けた|열었어요|tôi đã mở
ran|Past tense of 'run'|correr>corrí|courir>couru|correre>corso|rennen>gerannt>ich bin ___|correr>corri|rennen>gerend|I ran|biegłem/biegłam|am alergat|я біг/бігла|我跑了|ركضتُ|koştum|走った|달렸어요|tôi đã chạy
swam|Past tense of 'swim'|nadar>nadé|nager>nagé|nuotare>nuotato|schwimmen>geschwommen>ich bin ___|nadar>nadei|zwemmen>gezwommen|I swam|pływałem/pływałam|am înotat|я плавав/плавала|我游了泳|سبحتُ|yüzdüm|泳いだ|수영했어요|tôi đã bơi
cooked|Past tense of 'cook'|cocinar>cociné|cuisiner>cuisiné|cucinare>cucinato|kochen>gekocht|cozinhar>cozinhei|koken>gekookt|I cooked|gotowałem/gotowałam|am gătit|я готував/готувала|我做了饭|طبختُ|yemek pişirdim|料理した|요리했어요|tôi đã nấu ăn
worked|Past tense of 'work'|trabajar>trabajé|travailler>travaillé|lavorare>lavorato|arbeiten>gearbeitet|trabalhar>trabalhei|werken>gewerkt|I worked|pracowałem/pracowałam|am lucrat|я працював/працювала|我工作了|عملتُ|çalıştım|働いた|일했어요|tôi đã làm việc
played|Past tense of 'play'|jugar>jugué|jouer>joué|giocare>giocato|spielen>gespielt|jogar>joguei|spelen>gespeeld|I played|grałem/grałam|m-am jucat|я грав/грала|我玩了|لعبتُ|oynadım|遊んだ|놀았어요|tôi đã chơi
listened|Past tense of 'listen'|escuchar>escuché|écouter>écouté|ascoltare>ascoltato|zuhören>zugehört|ouvir>ouvi|luisteren>geluisterd|I listened|słuchałem/słuchałam|am ascultat|я слухав/слухала|我听了|استمعتُ|dinledim|聞いた|들었어요|tôi đã nghe
learned|Past tense of 'learn'|aprender>aprendí|apprendre>appris|imparare>imparato|lernen>gelernt|aprender>aprendi|leren>geleerd|I learned|uczyłem/uczyłam się|am învățat|я вчився/вчилася|我学了|تعلمتُ|öğrendim|学んだ|배웠어요|tôi đã học
helped|Past tense of 'help'|ayudar>ayudé|aider>aidé|aiutare>aiutato|helfen>geholfen|ajudar>ajudei|helpen>geholpen|I helped|pomogłem/pomogłam|am ajutat|я допоміг/допомогла|我帮了|ساعدتُ|yardım ettim|手伝った|도왔어요|tôi đã giúp
waited|Past tense of 'wait'|esperar>esperé|attendre>attendu|aspettare>aspettato|warten>gewartet|esperar>esperei|wachten>gewacht|I waited|czekałem/czekałam|am așteptat|я чекав/чекала|我等了|انتظرتُ|bekledim|待った|기다렸어요|tôi đã chờ
travelled|Past tense of 'travel'|viajar>viajé|voyager>voyagé|viaggiare>viaggiato|reisen>gereist>ich bin ___|viajar>viajei|reizen>gereisd|I travelled|podróżowałem/podróżowałam|am călătorit|я подорожував/подорожувала|我旅行了|سافرتُ|seyahat ettim|旅行した|여행했어요|tôi đã đi du lịch
lived|Past tense of 'live'|vivir>viví|habiter>habité|abitare>abitato|wohnen>gewohnt|viver>vivi|wonen>gewoond|I lived|mieszkałem/mieszkałam|am locuit|я жив/жила|我住过|سكنتُ|yaşadım|住んだ|살았어요|tôi đã sống
made|Past tense of 'make'|hacer>hice|faire>fait|fare>fatto|machen>gemacht|fazer>fiz|maken>gemaakt|I made|zrobiłem/zrobiłam|am făcut|я зробив/зробила|我做了|صنعتُ|yaptım|作った|만들었어요|tôi đã làm
gave|Past tense of 'give'|dar>di|donner>donné|dare>dato|geben>gegeben|dar>dei|geven>gegeven|I gave|dałem/dałam|am dat|я дав/дала|我给了|أعطيتُ|verdim|あげた|줬어요|tôi đã cho
came|Past tense of 'come'|venir>vine|venir>venu>je suis ___|venire>venuto>sono ___|kommen>gekommen>ich bin ___|vir>vim|komen>gekomen>ik ben ___|I came|przyszedłem/przyszłam|am venit|я прийшов/прийшла|我来了|جئتُ|geldim|来た|왔어요|tôi đã đến
took|Past tense of 'take'|tomar>tomé|prendre>pris|prendere>preso|nehmen>genommen|tomar>tomei|nemen>genomen|I took|wziąłem/wzięłam|am luat|я взяв/взяла|我拿了|أخذتُ|aldım|取った|가져갔어요|tôi đã lấy
thought|Past tense of 'think'|pensar>pensé|penser>pensé|pensare>pensato|denken>gedacht|pensar>pensei|denken>gedacht|I thought|myślałem/myślałam|m-am gândit|я думав/думала|我想了|فكرتُ|düşündüm|思った|생각했어요|tôi đã nghĩ
knew|Past tense of 'know'|saber>supe|savoir>su|sapere>saputo|wissen>gewusst|saber>soube|weten>geweten|I knew|wiedziałem/wiedziałam|am știut|я знав/знала|我知道了|عرفتُ|bildim|知っていた|알았어요|tôi đã biết
drove|Past tense of 'drive'|conducir>conduje|conduire>conduit|guidare>guidato|fahren>gefahren>ich bin ___|conduzir>conduzi|rijden>gereden>ik heb ___|I drove|prowadziłem/prowadziłam|am condus|я керував/керувала|我开了车|قدتُ|araba sürdüm|運転した|운전했어요|tôi đã lái xe`
};

// Local words for Latin America and the US (keyed by the English row word).
window.HG_SWAP = {
  esmx: { cake: 'pastel', juice: 'jugo', floor: 'piso', roof: 'techo', fridge: 'refrigerador', ticket: 'boleto', jumper: 'suéter', drive: 'manejar', drove: 'manejar>manejé' },
  enus: { shop: ['store', 'Place where you buy things'], trousers: ['pants', 'You wear them on your legs'], jumper: ['sweater', 'Warm knitted top'], theatre: ['theater', 'Where you watch plays'], pyjamas: ['pajamas', 'Clothes you wear in bed'], travelled: ['traveled', "Past tense of 'travel'"] }
};

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

// Build HG_WORDS[learnLang][topic] = [[answer, clue]] and HG_GLOSS[uiLang][topic] = [meaning].
(function () {
  const LEARN = ['es', 'fr', 'it', 'de', 'pt', 'nl'], EXTRA = ['pl', 'ro', 'uk', 'zh', 'ar', 'tr', 'ja', 'ko', 'vi'];
  const W = {}, G = {};
  ['en', 'enus', 'es', 'esmx', 'fr', 'it', 'de', 'pt', 'nl'].forEach(l => { W[l] = {}; });
  ['en'].concat(LEARN, EXTRA).forEach(l => { G[l] = {}; });
  const usSpell = s => s.replace(/colour/g, 'color').replace(/Jewellery/g, 'Jewelry').replace(/centre/g, 'center').replace(/grey/g, 'gray').replace(/travelling/g, 'traveling');
  for (const tp of window.HG_TOPICS) {
    const rows = window.HG_RAW[tp.id].trim().split('\n').map(r => r.split('|'));
    ['en', 'enus', 'es', 'esmx', 'fr', 'it', 'de', 'pt', 'nl'].forEach(l => { W[l][tp.id] = []; });
    ['en'].concat(LEARN, EXTRA).forEach(l => { G[l][tp.id] = []; });
    for (const r of rows) {
      const key = r[0];
      // English
      W.en[tp.id].push([r[0], r[1]]);
      const us = window.HG_SWAP.enus[key];
      W.enus[tp.id].push(us ? us : [r[0], usSpell(r[1])]);
      if (!tp.form) {
        G.en[tp.id].push(r[0]);
        LEARN.forEach((l, i) => { W[l][tp.id].push([r[2 + i], r[0]]); G[l][tp.id].push(r[2 + i]); });
        W.esmx[tp.id].push([window.HG_SWAP.esmx[key] || r[2], r[0]]);
        EXTRA.forEach((l, i) => G[l][tp.id].push(r[9 + i]));
      } else {
        const en = r[8];
        G.en[tp.id].push(en);
        const build = (l, field) => {
          const [inf, ans, own] = field.split('>');
          const frame = own || tp.frames[l];
          return { ans, clue: frame ? `${inf} → ${frame} (${en})` : `${inf} → ${en}`, gloss: frame ? frame.replace('___', ans) : (tp.pre[l] || '') + ans };
        };
        LEARN.forEach((l, i) => { const b = build(l, r[2 + i]); W[l][tp.id].push([b.ans, b.clue]); G[l][tp.id].push(b.gloss); });
        const mx = build('es', window.HG_SWAP.esmx[key] || r[2]);
        W.esmx[tp.id].push([mx.ans, mx.clue]);
        EXTRA.forEach((l, i) => G[l][tp.id].push(r[9 + i]));
      }
    }
  }
  window.HG_WORDS = W; window.HG_GLOSS = G;
})();
