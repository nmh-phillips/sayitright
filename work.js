// Harley Work: workplace English for people working in (or applying for) jobs in the UK.
// Eight phrase packs (care, nursing, hotels and restaurants, shops, warehouse and delivery, cleaning, customer service,
// building), added to the English (UK and US) phrase library and shown under a "Work" tile when learning English.
// Each pack works with everything else: lesson mode, pronunciation scoring, rounds of 10. A chip links to a job
// interview for that kind of job in the Interview Coach. Loaded after phrases.js and the interface language files.
(function () {
'use strict';
const P = {
  'Work: Care': [
    ['Good morning, how are you feeling today?', 'Greeting someone you care for'], ['Would you like a cup of tea?', 'Offering a drink'], ['Can I help you get dressed?', 'Offering help'], ['Let me help you stand up slowly.', 'Helping someone move safely'], ['Are you in any pain?', 'Checking for pain'],
    ['Have you taken your tablets this morning?', 'Checking medication'], ['Would you like a shower or a wash?', 'Personal care'], ['Please hold on to the rail.', 'Keeping someone safe'], ["I'm going to call the nurse.", 'Getting help'], ['Is the water warm enough?', 'Checking comfort'],
    ['What would you like for lunch today?', 'Asking about meals'], ['Your family is coming to visit this afternoon.', 'Talking about visitors'], ['Let me know if you need anything.', 'Being helpful'], ["I'll be back in five minutes.", 'Saying when you will return'], ['Did you sleep well last night?', 'Asking about sleep'],
    ['I need to write this in the care notes.', 'Recording care'], ['Press the call bell if you need me.', 'Explaining the call bell'], ["Let's go for a short walk.", 'Encouraging activity'], ["Take your time, there's no rush.", 'Being patient'], ['Is there anything worrying you?', 'Checking how someone feels']
  ],
  'Work: Nursing': [
    ['Can you tell me your full name and date of birth?', 'Checking a patient’s identity'], ['Where does it hurt?', 'Asking about pain'], ['On a scale of one to ten, how bad is the pain?', 'Measuring pain'], ['Do you have any allergies?', 'Asking about allergies'], ["I'm going to take your temperature.", 'Explaining a check'],
    ['I need to take a blood sample.', 'Explaining a test'], ['You might feel a sharp scratch.', 'Before an injection'], ['Please roll up your sleeve.', 'Giving an instruction'], ['The doctor will see you shortly.', 'Telling a patient to wait'], ['Have you had anything to eat or drink today?', 'Before a procedure'],
    ['Please don’t eat anything after midnight.', 'Fasting instructions'], ['Take this medicine twice a day with food.', 'Explaining medicine'], ['Let me check your dressing.', 'Wound care'], ["I'm handing over to the night shift.", 'Shift handover'], ['His blood pressure is a little high.', 'Reporting to a colleague'],
    ['Can you take a deep breath for me?', 'During an examination'], ['Is there anyone we should contact?', 'Next of kin'], ['You can go home tomorrow morning.', 'Talking about discharge'], ['Press this button if you need help.', 'Explaining the call button'], ["I'll explain everything before we start.", 'Reassuring a patient']
  ],
  'Work: Hospitality': [
    ['Good evening, do you have a reservation?', 'Welcoming guests'], ['A table for two? Follow me, please.', 'Showing guests to a table'], ['Can I get you anything to drink?', 'Taking a drinks order'], ['Are you ready to order?', 'Taking a food order'], ["Today's special is grilled salmon.", 'Recommending a dish'],
    ['Does anyone have any allergies?', 'Checking allergies'], ["I'm sorry for the wait.", 'Apologising'], ['How is everything with your meal?', 'Checking on guests'], ['Would you like to see the dessert menu?', 'Offering dessert'], ['Would you like to pay together or separately?', 'Taking payment'],
    ['Checkout is at eleven o’clock.', 'Hotel information'], ['Breakfast is served from seven until ten.', 'Hotel information'], ['Here is your room key card.', 'Checking in a guest'], ['Your room is on the third floor.', 'Giving directions'], ['Can I take your coat?', 'Being polite'],
    ["I'll let the chef know straight away.", 'Handling a request'], ['Enjoy your meal!', 'Serving food'], ['Have a lovely stay with us.', 'Welcoming a hotel guest'], ['Is there anything else I can help you with?', 'Offering more help'], ['Thank you, see you again soon.', 'Saying goodbye']
  ],
  'Work: Shop': [
    ['Hello, are you looking for anything in particular?', 'Greeting a customer'], ['What size are you looking for?', 'Asking about size'], ['The changing rooms are just over there.', 'Giving directions'], ['We have this in black and navy.', 'Talking about colours'], ["I'll check if we have any in the stockroom.", 'Checking stock'],
    ['Would you like a bag?', 'At the till'], ['Do you have a loyalty card?', 'At the till'], ['You can pay by card or contactless.', 'Payment'], ['Please enter your PIN.', 'Card payment'], ['Would you like your receipt?', 'After paying'],
    ['You can return it within thirty days.', 'Returns policy'], ['Do you have the receipt with you?', 'Handling a return'], ["I'm sorry, that item is out of stock.", 'Bad news'], ["It's on offer: buy one, get one free.", 'Special offers'], ['Let me call my manager.', 'Getting help'],
    ['We close at eight o’clock tonight.', 'Opening hours'], ['Can I help you find something?', 'Offering help'], ['That comes to twelve fifty, please.', 'Telling the price'], ['Would you like to try it on?', 'Clothes shopping'], ['Have a nice day!', 'Saying goodbye']
  ],
  'Work: Warehouse': [
    ["I've got a parcel for you.", 'Delivering'], ['Can you sign here, please?', 'Getting a signature'], ['Is this the right address?', 'Checking the address'], ['Where would you like me to put it?', 'Asking the customer'], ["I'll leave it next door.", 'Leaving a parcel'],
    ['Nobody was home, so I left a card.', 'Missed delivery'], ["I'm running about ten minutes late.", 'Calling ahead'], ['The scanner isn’t working.', 'Reporting a problem'], ['Which aisle is this item in?', 'Finding stock'], ["I've finished picking this order.", 'Order picking'],
    ['This box is damaged.', 'Reporting damage'], ['Please wear your safety boots.', 'Safety rules'], ['Mind the forklift!', 'Warning a colleague'], ["Can you help me lift this? It's heavy.", 'Asking for help'], ["I'm going on my break now.", 'Telling your supervisor'],
    ['What time does my shift finish?', 'Asking about shifts'], ['The van is fully loaded.', 'Loading'], ['Please stack the boxes on the pallet.', 'Giving instructions'], ['I need to report an accident.', 'Health and safety'], ['Can I swap shifts with you next week?', 'Asking a colleague']
  ],
  'Work: Cleaning': [
    ['Housekeeping! May I come in?', 'Knocking on a hotel room'], ['Would you like me to clean your room now?', 'Asking a guest'], ["I'll come back later.", 'If the guest is busy'], ["I've changed the sheets and towels.", 'Telling a guest'], ['Careful, the floor is wet.', 'Safety warning'],
    ['We need more cleaning supplies.', 'Asking your supervisor'], ['Which rooms need cleaning today?', 'Asking about tasks'], ["I've finished the second floor.", 'Reporting progress'], ['The bin is full.', 'Reporting a problem'], ['Please don’t mix these chemicals.', 'Safety rules'],
    ["There's a do not disturb sign on the door.", 'Telling your supervisor'], ['I found something a guest left behind.', 'Lost property'], ['The toilet is blocked.', 'Reporting a problem'], ['I need to wear gloves for this.', 'Safety'], ['Where do you keep the mop and bucket?', 'Finding equipment'],
    ["I'll start with the bathrooms.", 'Planning your work'], ['Is it OK if I open the window?', 'Asking permission'], ['The kitchen has been cleaned.', 'Reporting progress'], ['Could you move your bag, please?', 'Asking politely'], ['Everything is clean and ready.', 'Finishing a job']
  ],
  'Work: Phone': [
    ['Good morning, how can I help you?', 'Answering a call'], ['Can I take your name, please?', 'Taking details'], ['Could you spell that for me?', 'Checking spelling'], ['Could I have your account number?', 'Security checks'], ['Let me just check that for you.', 'Looking something up'],
    ['Please hold for a moment.', 'Putting someone on hold'], ['Sorry to keep you waiting.', 'After a wait'], ['I understand how frustrating that must be.', 'Showing empathy'], ["I'll transfer you to the right department.", 'Transferring a call'], ['Could you repeat that, please?', 'Asking someone to repeat'],
    ["The line is very bad, I can't hear you.", 'A bad line'], ["I'll call you back in ten minutes.", 'Promising to call back'], ['What’s the best number to reach you on?', 'Taking a phone number'], ["I'll send you an email to confirm.", 'Confirming'], ["I've made a note on your account.", 'Recording a call'],
    ["I'm afraid that's not possible.", 'Saying no politely'], ['Let me speak to my supervisor.', 'Getting help'], ["I'll sort that out for you right away.", 'Solving a problem'], ['Is there anything else I can help with?', 'Ending a call'], ['Thank you for calling.', 'Saying goodbye']
  ],
  'Work: Building': [
    ['Good morning, where do you want me to start?', 'Starting the day'], ['Can you pass me the hammer?', 'Asking for a tool'], ['Please wear your hard hat on site.', 'Safety rules'], ["This ladder isn't safe.", 'Reporting danger'], ['We need more cement.', 'Ordering materials'],
    ['How long will this job take?', 'Asking about time'], ["I'll measure it first.", 'Planning'], ['The delivery of bricks is here.', 'Deliveries'], ['Turn off the power before you start.', 'Electrical safety'], ["Watch out, it's slippery.", 'Warning someone'],
    ["We've finished for today.", 'End of the day'], ['Can you hold this steady?', 'Asking for help'], ['The drill battery is flat.', 'Reporting a problem'], ['Have you done the safety induction?', 'Site rules'], ['I need to report a near miss.', 'Health and safety'],
    ['What time do we start tomorrow?', 'Asking about hours'], ['The client wants to change the design.', 'Talking about a job'], ['Please clear up the rubbish.', 'Keeping the site tidy'], ['Is this wall load-bearing?', 'Checking before work'], ['The job is finished. Would you like to check it?', 'Finishing for a client']
  ]
};
const SETS = Object.keys(P);
const JOB = { 'Work: Care': 'Care assistant', 'Work: Nursing': 'Nurse', 'Work: Hospitality': 'Waiter or hotel receptionist', 'Work: Shop': 'Shop assistant', 'Work: Warehouse': 'Warehouse operative or delivery driver', 'Work: Cleaning': 'Cleaner or housekeeper', 'Work: Phone': 'Customer service adviser', 'Work: Building': 'Construction worker' };
const NAMES = {
  en: ['Care work', 'Nursing & health', 'Hotels & restaurants', 'Shop work', 'Warehouse & delivery', 'Cleaning', 'Customer service', 'Building & trades', 'Work', 'Job interview'],
  es: ['Cuidados', 'Enfermería y salud', 'Hoteles y restaurantes', 'Tiendas', 'Almacén y reparto', 'Limpieza', 'Atención al cliente', 'Construcción', 'Trabajo', 'Entrevista de trabajo'],
  fr: ['Aide à la personne', 'Soins infirmiers', 'Hôtellerie-restauration', 'Commerce', 'Entrepôt et livraison', 'Nettoyage', 'Service client', 'Bâtiment', 'Travail', "Entretien d'embauche"],
  it: ['Assistenza', 'Infermieristica', 'Hotel e ristoranti', 'Negozi', 'Magazzino e consegne', 'Pulizie', 'Servizio clienti', 'Edilizia', 'Lavoro', 'Colloquio di lavoro'],
  de: ['Pflege', 'Krankenpflege', 'Hotel & Gastronomie', 'Einzelhandel', 'Lager & Lieferung', 'Reinigung', 'Kundenservice', 'Bau & Handwerk', 'Arbeit', 'Vorstellungsgespräch'],
  pt: ['Cuidados', 'Enfermagem e saúde', 'Hotelaria e restauração', 'Lojas', 'Armazém e entregas', 'Limpeza', 'Apoio ao cliente', 'Construção', 'Trabalho', 'Entrevista de emprego'],
  pl: ['Opieka', 'Pielęgniarstwo', 'Hotele i restauracje', 'Praca w sklepie', 'Magazyn i dostawy', 'Sprzątanie', 'Obsługa klienta', 'Budowa', 'Praca', 'Rozmowa o pracę'],
  ro: ['Îngrijire', 'Asistență medicală', 'Hoteluri și restaurante', 'Magazin', 'Depozit și livrări', 'Curățenie', 'Relații cu clienții', 'Construcții', 'Muncă', 'Interviu de angajare'],
  uk: ['Догляд', 'Медсестринство', 'Готелі й ресторани', 'Магазин', 'Склад і доставка', 'Прибирання', 'Обслуговування клієнтів', 'Будівництво', 'Робота', 'Співбесіда'],
  zh: ['护理工作', '护士与医疗', '酒店与餐饮', '零售', '仓库与配送', '清洁', '客户服务', '建筑与工艺', '工作', '求职面试'],
  ar: ['الرعاية', 'التمريض والصحة', 'الفنادق والمطاعم', 'العمل في المتاجر', 'المستودعات والتوصيل', 'التنظيف', 'خدمة العملاء', 'البناء والحرف', 'العمل', 'مقابلة عمل'],
  nl: ['Zorg', 'Verpleging', 'Hotels en restaurants', 'Winkelwerk', 'Magazijn en bezorging', 'Schoonmaak', 'Klantenservice', 'Bouw', 'Werk', 'Sollicitatiegesprek'],
  tr: ['Bakım', 'Hemşirelik ve sağlık', 'Otel ve restoran', 'Mağaza', 'Depo ve teslimat', 'Temizlik', 'Müşteri hizmetleri', 'İnşaat', 'İş', 'İş görüşmesi'],
  ja: ['介護', '看護・医療', 'ホテル・飲食', '販売', '倉庫・配送', '清掃', 'カスタマーサービス', '建設', '仕事', '就職面接'],
  ko: ['요양 보호', '간호·의료', '호텔·식당', '매장', '창고·배송', '청소', '고객 서비스', '건설', '직장', '취업 면접'],
  vi: ['Chăm sóc', 'Điều dưỡng & y tế', 'Khách sạn & nhà hàng', 'Bán hàng', 'Kho & giao hàng', 'Dọn dẹp', 'Chăm sóc khách hàng', 'Xây dựng', 'Công việc', 'Phỏng vấn xin việc']
};
const D = window.SIR_DATA;
for (const L of ['en', 'enus']) if (D && D[L]) for (const s of SETS) D[L].sets[s] = P[s];
const curUi = () => (typeof ui !== 'undefined' ? ui : 'en');
const row = () => NAMES[curUi()] || NAMES.en;
window.HS_WORK = {
  sets: SETS,
  on: l => l === 'en' || l === 'enus',
  name: n => { const i = SETS.indexOf(n); return i < 0 ? null : row()[i]; },
  label: () => row()[8],
  interview: () => row()[9],
  job: n => JOB[n] || ''
};
})();
