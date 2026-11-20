// Harley Says: "Assess me". Uses globals from index.html (lang, ui, t, LN, DATA, Rec, tokens, align, store, HARLEY, $).
const ASSESS_PASSAGES = {
  en: "Last summer, my sister and I took the train to the coast. The journey was longer than we expected, but the views were beautiful. When we arrived, the weather was warm and the beach was quiet. We walked along the sand, bought ice cream and watched the boats coming back to the harbour. In the evening, we found a small restaurant near the station. The fish was fresh and the staff were very friendly. It was a simple trip, but it is one of my favourite memories.",
  enus: "Last summer, my sister and I took the train to the coast. The trip was longer than we expected, but the views were beautiful. When we arrived, the weather was warm and the beach was quiet. We walked along the sand, bought ice cream and watched the boats coming back to the harbor. In the evening, we found a small restaurant near the station. The fish was fresh and the staff was very friendly. It was a simple trip, but it is one of my favorite memories.",
  es: "El verano pasado, mi hermana y yo fuimos en tren a la costa. El viaje fue más largo de lo que esperábamos, pero las vistas eran preciosas. Cuando llegamos, hacía calor y la playa estaba tranquila. Paseamos por la arena, compramos un helado y miramos los barcos que volvían al puerto. Por la noche, encontramos un pequeño restaurante cerca de la estación. El pescado estaba fresco y los camareros fueron muy amables. Fue un viaje sencillo, pero es uno de mis recuerdos favoritos.",
  esmx: "El verano pasado, mi hermana y yo fuimos en tren a la costa. El viaje fue más largo de lo que esperábamos, pero las vistas eran preciosas. Cuando llegamos, hacía calor y la playa estaba tranquila. Caminamos por la arena, compramos un helado y miramos los barcos que regresaban al puerto. En la noche, encontramos un restaurante pequeño cerca de la estación. El pescado estaba fresco y los meseros fueron muy amables. Fue un viaje sencillo, pero es uno de mis recuerdos favoritos.",
  fr: "L'été dernier, ma sœur et moi avons pris le train pour aller à la mer. Le voyage a été plus long que prévu, mais les paysages étaient magnifiques. Quand nous sommes arrivés, il faisait chaud et la plage était calme. Nous avons marché sur le sable, acheté une glace et regardé les bateaux rentrer au port. Le soir, nous avons trouvé un petit restaurant près de la gare. Le poisson était frais et le personnel très sympathique. C'était un voyage simple, mais c'est l'un de mes plus beaux souvenirs.",
  it: "L'estate scorsa, io e mia sorella abbiamo preso il treno per andare al mare. Il viaggio è stato più lungo del previsto, ma il paesaggio era bellissimo. Quando siamo arrivati, faceva caldo e la spiaggia era tranquilla. Abbiamo camminato sulla sabbia, comprato un gelato e guardato le barche tornare al porto. La sera abbiamo trovato un piccolo ristorante vicino alla stazione. Il pesce era fresco e il personale molto gentile. È stato un viaggio semplice, ma è uno dei miei ricordi più belli.",
  de: "Letzten Sommer sind meine Schwester und ich mit dem Zug ans Meer gefahren. Die Reise war länger als erwartet, aber die Landschaft war wunderschön. Als wir ankamen, war es warm und der Strand war ruhig. Wir sind am Strand entlanggelaufen, haben ein Eis gekauft und den Booten zugesehen, die in den Hafen zurückkamen. Am Abend haben wir ein kleines Restaurant in der Nähe des Bahnhofs gefunden. Der Fisch war frisch und das Personal sehr freundlich. Es war eine einfache Reise, aber sie ist eine meiner schönsten Erinnerungen.",
  pt: "No verão passado, eu e a minha irmã fomos de comboio até à praia. A viagem foi mais longa do que esperávamos, mas a paisagem era linda. Quando chegámos, estava calor e a praia estava calma. Caminhámos pela areia, comprámos um gelado e vimos os barcos a voltar ao porto. À noite, encontrámos um pequeno restaurante perto da estação. O peixe estava fresco e o pessoal foi muito simpático. Foi uma viagem simples, mas é uma das minhas melhores memórias."
};
const ASSESS_MAX = { read: 180, speak: 300 };
const ASSESS_MIN_SPEAK_SEC = 30, ASSESS_MIN_WORDS = 40, ASSESS_MIN_WRITE = 50;
const CEFR_BANDS = [[20,'A1'],[40,'A2'],[60,'B1'],[75,'B2'],[90,'C1'],[100,'C2']];
const cefrFor = s => CEFR_BANDS.find(([m]) => s <= m)[1];
const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const wc = s => (s.trim().match(/\S+/g) || []).length;

const A = { mode:'read', state:'idle', result:null, error:'', finals:[], confs:[], interim:'', start:0, timer:null, rec:null, writeText:'',
  az:null, quick:false, offerQuick:false, part:0, st:[], res:[], jobs:[], secs:[], wav:null };
// Azure's scores bunch up near the top (learners often get 85-95), so stretch them before showing a level.
// 98 → ~95 (C2), 95 → ~87 (C1), 90 → ~75 (B2), 80 → ~52 (B1), 70 → ~33 (A2). Tweak AZ_CURVE to make it stricter or kinder.
const AZ_FLOOR = 40, AZ_CURVE = 1.6;
const azCurve = v => Math.round(100*Math.pow(Math.max(0, Math.min(100, Number(v)||0) - AZ_FLOOR)/(100-AZ_FLOOR), AZ_CURVE));
const PART_COUNT = 3, PART_MAX = 28; // Azure scores up to 30 s of audio per request, so the passage is read in 3 parts

// ---- detailed (Azure) read-aloud scoring, in short parts ----
function passageParts(){
  const txt = ASSESS_PASSAGES[lang], sents = (txt.match(/[^.!?]+[.!?]+/g) || [txt]).map(x => x.trim());
  const target = txt.length/PART_COUNT, parts = []; let done = 0, cur = '';
  for (const x of sents){
    if (cur && parts.length < PART_COUNT-1 && done + cur.length + x.length/2 > target*(parts.length+1)){ parts.push(cur); done += cur.length; cur = ''; }
    cur = (cur + ' ' + x).trim();
  }
  if (cur) parts.push(cur);
  return parts;
}
// ---- streaming (Speech SDK): whole passage in one take, no 30-second limit ----
const SDK_SRC = '/vendor/speech-sdk-1.53.0.min.js';
const AZ_LOC = { en:'en-GB', enus:'en-US', es:'es-ES', esmx:'es-MX', fr:'fr-FR', it:'it-IT', de:'de-DE', pt:'pt-PT' };
function loadSDK(){
  if (window.SpeechSDK) return Promise.resolve();
  if (!A.sdkP) A.sdkP = new Promise((res, rej) => {
    const sc = document.createElement('script'); sc.src = SDK_SRC; sc.async = true;
    sc.onload = () => window.SpeechSDK ? res() : rej(new Error('sdk'));
    sc.onerror = () => { A.sdkP = null; rej(new Error('sdk')); };
    document.head.appendChild(sc);
  });
  return A.sdkP;
}
function streamFallback(){ // anything goes wrong with streaming → use the 3-part upload method instead
  if (A.sr){ try{ A.sr.close(); }catch(e){} A.sr = null; }
  clearInterval(A.timer); A.noStream = true; A.state = 'idle'; A.error = ''; renderAssess();
}
async function startStream(){
  A.state = 'preparing'; A.error = ''; A.result = null; A.finals = []; A.interim = ''; A.segs = []; renderAssess();
  let tok;
  try {
    const [r] = await Promise.all([
      fetch('/.netlify/functions/speech-token', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ device: DEVICE_ID }) }),
      loadSDK()
    ]);
    tok = await r.json().catch(()=>({}));
    if (r.status === 429 || tok.error === 'limit'){ A.state='idle'; A.error=t('a_limitA'); track('limit'); A.offerQuick=true; renderAssess(); return; }
    if (r.status === 503){ A.az = false; A.state='idle'; renderAssess(); return; }
    if (!r.ok || !tok.token) return streamFallback();
  } catch(e){ return streamFallback(); }
  try {
    const S = window.SpeechSDK;
    const cfg = S.SpeechConfig.fromAuthorizationToken(tok.token, tok.region);
    cfg.speechRecognitionLanguage = AZ_LOC[lang] || 'en-GB';
    const pa = new S.PronunciationAssessmentConfig(ASSESS_PASSAGES[lang], S.PronunciationAssessmentGradingSystem.HundredMark, S.PronunciationAssessmentGranularity.Word, false);
    const rec = new S.SpeechRecognizer(cfg, S.AudioConfig.fromDefaultMicrophoneInput());
    pa.applyTo(rec);
    rec.recognizing = (s, e) => { A.interim = e.result.text || ''; updateLive(); };
    rec.recognized = (s, e) => {
      if (e.result.reason !== S.ResultReason.RecognizedSpeech) return;
      try { A.segs.push(JSON.parse(e.result.properties.getProperty(S.PropertyId.SpeechServiceResponse_JsonResult))); } catch(err){}
      A.finals.push(e.result.text || ''); A.interim = ''; updateLive();
    };
    rec.canceled = (s, e) => {
      if (e.reason !== S.CancellationReason.Error) return;
      if (A.state === 'recording' && A.segs.length) stopStream();
      else if (A.state === 'recording' || A.state === 'preparing') streamFallback();
    };
    A.sr = rec;
    rec.startContinuousRecognitionAsync(() => {
      A.state = 'recording'; A.start = Date.now();
      clearInterval(A.timer);
      A.timer = setInterval(() => { updateLive(); if (elapsed() >= ASSESS_MAX.read) stopStream(); }, 300);
      renderAssess();
    }, () => streamFallback());
  } catch(e){ streamFallback(); }
}
function stopStream(){
  if (!A.sr || A.state !== 'recording') return;
  clearInterval(A.timer);
  A.streamSecs = elapsed(); A.state = 'finishing'; renderAssess();
  const rec = A.sr; A.sr = null;
  let done = false;
  const fin = () => { if (done) return; done = true; try{ rec.close(); }catch(e){} setTimeout(combineStream, 400); };
  rec.stopContinuousRecognitionAsync(fin, fin);
  setTimeout(fin, 5000);
}
function mapLCS(a, b){ // target index -> heard index (or -1)
  const m=a.length, n=b.length, dp=Array.from({length:m+1},()=>new Uint16Array(n+1));
  for(let i=m-1;i>=0;i--) for(let j=n-1;j>=0;j--) dp[i][j] = a[i]===b[j] ? dp[i+1][j+1]+1 : Math.max(dp[i+1][j], dp[i][j+1]);
  const map = new Array(m).fill(-1); let i=0, j=0;
  while(i<m && j<n){ if(a[i]===b[j]){ map[i]=j; i++; j++; } else if(dp[i+1][j] >= dp[i][j+1]) i++; else j++; }
  return map;
}
function combineStream(){
  const heard = []; let flu = 0, dur = 0;
  for (const seg of A.segs || []){
    const nb = seg.NBest && seg.NBest[0]; if (!nb) continue;
    const pa = nb.PronunciationAssessment || nb, d = Number(seg.Duration) || 1;
    flu += (Number(pa.FluencyScore) || 0) * d; dur += d;
    for (const w of nb.Words || []){
      const wp = w.PronunciationAssessment || w;
      for (const piece of tokens(String(w.Word || ''))) heard.push({ w: normTok(piece), raw: piece, acc: Number(wp.AccuracyScore) || 0, err: wp.ErrorType || 'None' });
    }
  }
  const target = tokens(ASSESS_PASSAGES[lang]);
  if (!heard.length){ A.state='idle'; A.error=t('a_noMatch'); renderAssess(); return; }
  const map = mapLCS(target.map(normTok), heard.map(h => h.w));
  const matched = map.filter(j => j >= 0);
  const completeness = 100 * matched.length / target.length;
  if (completeness < 30){ A.state='idle'; A.error=t('a_readShort'); renderAssess(); return; }
  const accuracy = matched.reduce((s,j) => s + heard[j].acc, 0) / matched.length;
  const fluency = dur ? flu / dur : 0;
  const ca = azCurve(accuracy), cf = azCurve(fluency), cc = azCurve(completeness);
  const score = Math.round(0.5*ca + 0.3*cf + 0.2*cc);
  const weak = [];
  map.forEach((j,i) => { if (j >= 0 && (heard[j].acc < 60 || heard[j].err === 'Mispronunciation') && !weak.includes(target[i])) weak.push(target[i]); });
  map.forEach((j,i) => { if (j < 0 && weak.length < 10 && !weak.includes(target[i])) weak.push(target[i]); });
  const cw = map.map((j,i) => ({ w: target[i], score: j >= 0 ? Math.round(heard[j].acc) : 0, error: j < 0 ? 'Omission' : heard[j].err })).sort((a,b) => a.score - b.score).slice(0, 15);
  finishResult({ kind:'read', score, cefr:cefrFor(score), subs:[['a_sub_accuracy',ca],['a_sub_fluency',cf],['p_completeness',cc]], missed: weak.slice(0,10), wpm: A.streamSecs ? heard.length/(A.streamSecs/60) : 0, cw });
}

async function azOn(){
  if (A.az !== null) return A.az;
  try { const r = await fetch('/.netlify/functions/pronounce'); const j = await r.json(); A.az = !!j.enabled; } catch(e){ A.az = false; }
  return A.az;
}
function resetParts(){ if(A.sr){ try{ A.sr.stopContinuousRecognitionAsync(()=>{},()=>{}); A.sr.close(); }catch(e){} A.sr=null; } A.part=0; A.st=[]; A.res=[]; A.jobs=[]; A.secs=[]; if(A.wav){ try{A.wav.cancel();}catch(e){} A.wav=null; } }
async function startAssess(){
  A.error=''; A.offerQuick=false;
  if (A.mode !== 'read' || A.quick || !navigator.mediaDevices || !(await azOn())) return startRec();
  if (!A.noStream) return startStream();
  if (typeof pronRecord !== 'function') return startRec();
  try { A.wav = await pronRecord(); } catch(e){ A.error = t('p_mic'); renderAssess(); return; }
  A.result=null; A.state='recording'; A.start=Date.now();
  clearInterval(A.timer);
  A.timer = setInterval(() => { updateLive(); if (elapsed() >= PART_MAX) stopPart(); }, 300);
  renderAssess();
}
async function stopPart(){
  if (A.state !== 'recording' || !A.wav) return;
  clearInterval(A.timer);
  const i = A.part, rec = A.wav; A.wav = null;
  A.state = 'finishing'; renderAssess();
  const wav = await rec.stop();
  if (wav.seconds < 1){ A.state='idle'; A.error=t('a_partFail',{n:i+1}); renderAssess(); return; }
  A.secs[i] = wav.seconds; A.st[i] = 'pending';
  A.jobs[i] = sendPart(i, wav);
  const next = [...Array(PART_COUNT).keys()].find(j => !A.st[j]);
  if (next !== undefined){ A.part = next; A.state = 'idle'; renderAssess(); return; }
  A.state = 'assessing'; renderAssess();
  await Promise.all(A.jobs);
  const failed = [...Array(PART_COUNT).keys()].filter(j => A.st[j] !== 'ok');
  if (failed.length){
    const lim = failed.find(j => A.st[j] === 'limit') !== undefined;
    failed.forEach(j => { A.st[j] = undefined; });
    A.part = failed[0]; A.state = 'idle';
    if (lim){ A.error = t('a_limitA'); track('limit'); A.offerQuick = true; resetParts(); }
    else A.error = A.st.__off ? t('p_off') : t('a_partFail',{n:failed[0]+1});
    renderAssess(); return;
  }
  combineParts();
}
async function sendPart(i, wav){
  const text = passageParts()[i];
  try {
    const r = await fetch('/.netlify/functions/pronounce', { method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ audio: wav.b64, text, lang, device: DEVICE_ID, kind:'assess' }) });
    const j = await r.json().catch(()=>({}));
    if (r.status === 429 || j.error === 'limit'){
      A.st[i] = 'limit';
      if (A.state !== 'assessing'){ clearInterval(A.timer); resetParts(); A.state='idle'; A.error=t('a_limitA'); track('limit'); A.offerQuick=true; renderAssess(); }
      return;
    }
    if (r.status === 503){ A.az = false; A.st.__off = true; A.st[i] = 'fail'; return; }
    if (!r.ok || typeof j.score !== 'number'){ A.st[i] = 'fail'; return; }
    A.res[i] = j; A.st[i] = 'ok';
  } catch(e){ A.st[i] = 'fail'; }
}
function combineParts(){
  const parts = passageParts(), wts = parts.map(p => wc(p)), tot = wts.reduce((a,b)=>a+b,0);
  const avg = k => A.res.reduce((s,r,i) => s + (Number(r[k])||0)*wts[i], 0) / tot;
  const ca = azCurve(avg('accuracy')), cf = azCurve(avg('fluency')), cc = azCurve(avg('completeness'));
  const score = Math.round(0.5*ca + 0.3*cf + 0.2*cc);
  const weak = [];
  A.res.forEach(r => r.words.forEach(w => { if ((w.error === 'Omission' || w.error === 'Mispronunciation' || w.score < 60) && w.error !== 'Insertion'){ const x = String(w.word).toLowerCase(); if (!weak.includes(x)) weak.push(x); } }));
  const secs = A.secs.reduce((a,b)=>a+(b||0),0);
  const subs = [['a_sub_accuracy',ca],['a_sub_fluency',cf],['p_completeness',cc]];
  const cw = A.res.flatMap(r => r.words).filter(w => w.error !== 'Insertion').map(w => ({ w: w.word, score: Math.round(w.score), error: w.error })).sort((a,b) => a.score - b.score).slice(0, 15);
  resetParts();
  finishResult({ kind:'read', score, cefr:cefrFor(score), subs, missed:weak.slice(0,10), wpm: secs ? tot/(secs/60) : 0, cw });
}

function fluencyFrom(wpm, conf){
  let f = wpm < 60 ? (wpm/60)*0.6 : wpm <= 170 ? Math.min(1, 0.6 + (wpm-60)/60*0.4) : Math.max(0.6, 1-(wpm-170)/120);
  return Math.round(100*(0.75*f + 0.25*conf));
}
function avgConf(){ const c = A.confs.filter(x => x > 0); return c.length ? c.reduce((a,b)=>a+b,0)/c.length : 0.7; }
function heardText(){ return (A.finals.join(' ') + ' ' + A.interim).trim(); }
function elapsed(){ return A.start ? (Date.now()-A.start)/1000 : 0; }
function fmt(sec){ sec=Math.max(0,Math.round(sec)); return Math.floor(sec/60)+':'+String(sec%60).padStart(2,'0'); }

function setMode(m){ if(A.state==='recording') return; A.mode=m; A.state='idle'; A.result=null; A.error=''; A.offerQuick=false; renderAssess(); }

function startRec(){
  if(!Rec){ A.error=t('voiceNeeds'); renderAssess(); return; }
  A.finals=[]; A.confs=[]; A.interim=''; A.result=null; A.error=''; A.state='recording'; A.start=Date.now();
  const begin = () => {
    const r = new Rec(); A.rec = r;
    r.lang = DATA[lang].code; r.continuous = true; r.interimResults = true; r.maxAlternatives = 1;
    r.onresult = e => {
      let interim = '';
      for(let i=e.resultIndex;i<e.results.length;i++){
        const res = e.results[i];
        if(res.isFinal){ A.finals.push(res[0].transcript.trim()); A.confs.push(res[0].confidence||0); }
        else interim += res[0].transcript;
      }
      A.interim = interim; updateLive();
    };
    r.onerror = e => { if(e.error==='not-allowed'||e.error==='service-not-allowed'){ A.state='idle'; A.error=t('errNotAllowed'); clearInterval(A.timer); renderAssess(); } };
    r.onend = () => { if(A.state==='recording' && elapsed() < ASSESS_MAX[A.mode]) { try{ begin(); }catch(err){} } };
    try{ r.start(); }catch(err){ A.state='idle'; A.error=t('errStart')+err.message; renderAssess(); }
  };
  begin();
  clearInterval(A.timer);
  A.timer = setInterval(() => { updateLive(); if(elapsed() >= ASSESS_MAX[A.mode]) finishRec(); }, 300);
  renderAssess();
}
function updateLive(){
  const tl = $('aTime'); if(tl) tl.textContent = A.wav ? t('a_timeLeft',{t:fmt(PART_MAX-elapsed())}) : t('a_timeLeft',{t:fmt(ASSESS_MAX[A.mode]-elapsed())}) + ' · ' + t('a_words',{n:wc(heardText())});
  const lv = $('aLive'); if(lv) lv.textContent = heardText();
}
function finishRec(){
  if(A.state!=='recording') return;
  clearInterval(A.timer);
  const dur = elapsed();
  A.state='finishing';
  try{ A.rec && A.rec.stop(); }catch(e){}
  renderAssess();
  setTimeout(() => evaluateSpeech(dur), 900);
}

function evaluateSpeech(dur){
  const text = heardText(); A.interim='';
  const words = wc(text);
  const wpm = dur > 0 ? words/(dur/60) : 0;
  const conf = avgConf();
  if(A.mode==='read'){
    const target = tokens(ASSESS_PASSAGES[lang]);
    if(words < target.length*0.3){ A.state='idle'; A.error=t('a_readShort'); renderAssess(); return; }
    const hits = align(target, tokens(text));
    const acc = hits.filter(Boolean).length/target.length;
    if(acc < 0.15){ A.state='idle'; A.error=t('a_noMatch'); renderAssess(); return; }
    const flu = fluencyFrom(wpm, conf);
    // Browser recognition guesses the expected words even when speech is unclear, so this quick estimate is stricter and capped.
    const score = Math.min(85, Math.round(100*(0.55*acc + 0.25*(flu/100) + 0.2*conf)));
    const missed = [...new Set(target.filter((w,i)=>!hits[i]))].slice(0,10);
    finishResult({ kind:'read', quick:true, score, cefr:cefrFor(score), subs:[['a_sub_accuracy',acc*100],['a_sub_fluency',flu],['a_sub_clarity',conf*100]], missed, wpm, cw: missed.map(w => ({ w, score: 0, error: 'Omission' })) });
    return;
  }
  if(dur < ASSESS_MIN_SPEAK_SEC || words < ASSESS_MIN_WORDS){ A.state='idle'; A.error=t('a_tooShort'); renderAssess(); return; }
  callAI({ mode:'speak', text, durationSec:dur, wpm, confidence:conf }, ai => {
    const flu = fluencyFrom(wpm, conf);
    const score = Math.round(0.8*ai.score + 0.2*flu);
    return { kind:'speak', score, cefr:cefrFor(score), subs:[['a_sub_range',ai.subscores.range],['a_sub_grammar',ai.subscores.grammar],['a_sub_coherence',ai.subscores.coherence],['a_sub_fluency',flu]], strengths:ai.strengths, improve:ai.improve, summary:ai.summary, wpm };
  });
}
function assessWriting(){
  const text = A.writeText.trim();
  if(wc(text) < ASSESS_MIN_WRITE){ A.error=t('a_writeShort'); renderAssess(); return; }
  callAI({ mode:'write', text }, ai => ({ kind:'write', score:ai.score, cefr:cefrFor(ai.score), subs:[['a_sub_range',ai.subscores.range],['a_sub_grammar',ai.subscores.grammar],['a_sub_coherence',ai.subscores.coherence]], strengths:ai.strengths, improve:ai.improve, summary:ai.summary }));
}
async function callAI(payload, toResult){
  A.state='assessing'; A.error=''; renderAssess();
  try{
    const r = await fetch('/.netlify/functions/assess',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...payload, lang, ui, device: DEVICE_ID})});
    const j = await r.json().catch(()=>({}));
    if(r.status===503 || /not configured/i.test(j.error||'')) throw new Error('__off');
    if(r.status===429 || j.error==='limit') throw new Error('__limit');
    if(!r.ok || typeof j.score!=='number') throw new Error(j.error || ('HTTP '+r.status));
    finishResult(toResult(j));
  }catch(err){
    A.state='idle';
    A.error = err.message==='__off' ? t('a_off') : err.message==='__limit' ? (track('limit'), t('a_limitA')) : t('a_fail')+err.message;
    renderAssess();
  }
}
function finishResult(res){
  res.date = new Date().toISOString(); res.lang = lang;
  if (typeof track === 'function') track(A.mode);
  A.result = res; A.state='done';
  const hist = store.get('sir_assess',[]); hist.unshift({date:res.date,lang,kind:res.kind,score:res.score,cefr:res.cefr}); store.set('sir_assess',hist.slice(0,10));
  renderAssess();
  const c=$('assessCard'); if(c) c.scrollIntoView({behavior:'smooth',block:'start'});
}

function renderAssess(){
  const card = $('assessCard'); if(!card) return;
  const last = store.get('sir_assess',[]).find(h => h.lang===lang);
  const modes = [['read','a_modeRead'],['speak','a_modeSpeak'],['write','a_modeWrite']];
  let h = `<div class="a-head"><h2>${esc(t('a_title'))}</h2><span class="a-free">${esc(t('a_free'))}</span></div>
  <p class="a-intro">${esc(t('a_intro',{lang:LN(lang)}))}</p>`;
  if(last) h += `<p class="a-last">${esc(t('a_last',{score:last.score,level:last.cefr,date:new Date(last.date).toLocaleDateString(ui==='en' ? (IN_AMERICAS?'en-US':'en-GB') : ui)}))}</p>`;
  h += `<div class="a-modes" role="tablist">${modes.map(([m,k])=>`<button class="btn${A.mode===m?' on':''}" data-amode="${m}" role="tab" aria-selected="${A.mode===m}">${esc(t(k))}</button>`).join('')}</div>`;

  if(A.state==='done' && A.result){
    const r = A.result, mood = r.score>=76?'celebrate':r.score>=41?'happy':'puzzled';
    h += `<div class="a-result">
      <div class="a-score"><span class="a-mood" aria-hidden="true">${HARLEY[mood]}</span>
        <div><div class="a-num">${r.score}<small>/100</small></div>
        <div class="a-level"><b>${esc(r.quick ? cefrRange(r.score) : r.cefr)}</b> ${r.quick ? '' : esc(t('lvl_'+r.cefr))}${r.kind==='read'?' · '+esc(t('a_pronLevel')):''}</div></div></div>
      <div class="a-subs">${r.subs.map(([k,v])=>`<div class="a-sub"><span>${esc(t(k))}</span><span class="a-bar"><i style="width:${Math.round(v)}%"></i></span><b>${Math.round(v)}</b></div>`).join('')}</div>`;
    if(r.summary) h += `<p class="a-summary">${esc(r.summary)}</p>`;
    if(r.strengths && r.strengths.length) h += `<h3>${esc(t('a_strengths'))}</h3><ul>${r.strengths.map(s=>`<li>${esc(s)}</li>`).join('')}</ul>`;
    if(r.improve && r.improve.length) h += `<h3>${esc(t('a_improve'))}</h3><ul>${r.improve.map(s=>`<li>${esc(s)}</li>`).join('')}</ul>`;
    if(r.missed && r.missed.length) h += `<p class="a-meta">${esc(t('a_missed',{w:r.missed.join(', ')}))}</p>`;
    if(r.kind==='read' && r.cw) h += `<div id="aCoach" class="coach"></div>`;
    if(r.wpm) h += `<p class="a-meta">${esc(t('a_pace',{n:Math.round(r.wpm)}))}</p>`;
    if(r.quick) h += `<p class="a-meta">${esc(t('a_quickNote'))}</p>`;
    h += `<p class="a-disclaimer">${esc(t('a_indicative'))}</p>
      <button class="btn primary" data-aagain>${esc(t('a_again'))}</button></div>`;
  } else if(A.mode==='write'){
    h += `<p class="a-how">${esc(t('a_writeHow'))}</p>
      <textarea id="aWrite" rows="8" placeholder="${esc(t('a_writePh'))}">${esc(A.writeText)}</textarea>
      <div class="a-row"><span class="a-meta" id="aWc">${esc(t('a_words',{n:wc(A.writeText)}))}</span>
      <button class="btn primary" data-awrite ${A.state==='assessing'?'disabled':''}>${esc(A.state==='assessing'?t('a_assessing'):t('a_assessWrite'))}</button></div>`;
  } else {
    const parted = A.mode==='read' && A.az && !A.quick && A.noStream;
    h += `<p class="a-how">${esc(parted ? t('a_readHowParts',{m:PART_COUNT}) : t(A.mode==='read'?'a_readHow':'a_speakHow'))}</p>`;
    if(parted) h += `<blockquote class="a-passage" lang="${esc(DATA[lang].code)}">${passageParts().map((p,i)=>`<span class="pt${i===A.part?' cur':A.st[i]?' done':''}">${esc(p)}</span>`).join(' ')}</blockquote>`;
    else if(A.mode==='read') h += `<blockquote class="a-passage" lang="${esc(DATA[lang].code)}">${esc(ASSESS_PASSAGES[lang])}</blockquote>`;
    if(parted && A.state==='recording'){
      h += `<button class="btn mic rec" data-astop>${esc(t('a_partStop',{n:A.part+1}))}</button><p class="a-meta" id="aTime"></p>`;
    } else if(parted && A.state==='idle'){
      h += `<button class="btn mic" data-astart>${esc(t('a_partBtn',{n:A.part+1,m:PART_COUNT}))}</button>`;
    } else if(A.state==='recording'){
      h += `<button class="btn mic rec" data-astop>${esc(t('a_finish'))}</button>
        <p class="a-meta" id="aTime"></p><p class="a-live" id="aLive" aria-live="polite"></p>`;
    } else if(A.state==='preparing'){
      h += `<p class="a-wait">⏳</p>`;
    } else if(A.state==='finishing' || A.state==='assessing'){
      h += `<p class="a-wait">${esc(t('a_assessing'))}</p>`;
    } else {
      h += `<button class="btn mic" data-astart>${esc(t('a_start'))}</button>`;
    }
    if(A.mode==='read' && A.state==='idle') h += `<div class="a-more"><b>⭐ ${esc(t('a_moreTitle'))}</b><p>${esc(t('a_moreText'))}</p>
      <ul>${['a_story1','a_story2','a_story3'].map(k=>`<li>🔒 ${esc(t(k))}</li>`).join('')}<li class="a-more-n">${esc(t('a_storyMore'))}</li></ul>
      <button class="linkbtn" data-prem>${esc(t('getNotified'))}</button></div>`;
  }
  if(A.error) h += `<p class="a-error" role="alert">${esc(A.error)}</p>`;
  if(A.offerQuick && A.state==='idle' && !A.result) h += `<button class="linkbtn" data-aquick>${esc(t('a_quickBtn'))}</button>`;
  card.innerHTML = h;
  updateLive();
  if (A.result && A.result.cw && $('aCoach')) aCoachRender();
  if (A.az && A.mode==='read' && !A.noStream && card.offsetParent !== null) loadSDK().catch(()=>{}); // fetch the speech script only once Assess me is open
  const ta = $('aWrite'); if(ta) ta.oninput = () => { A.writeText = ta.value; const w=$('aWc'); if(w) w.textContent=t('a_words',{n:wc(ta.value)}); };
}
document.addEventListener('click', e => {
  const b = e.target.closest('#assessCard [data-amode],#assessCard [data-astart],#assessCard [data-astop],#assessCard [data-awrite],#assessCard [data-aagain],#assessCard [data-aquick]');
  if(!b) return;
  if(b.dataset.amode) setMode(b.dataset.amode);
  else if(b.hasAttribute('data-astart')) startAssess();
  else if(b.hasAttribute('data-astop')) { if(A.sr) stopStream(); else if(A.wav) stopPart(); else finishRec(); }
  else if(b.hasAttribute('data-aquick')){ A.quick=true; A.offerQuick=false; A.error=''; renderAssess(); }
  else if(b.hasAttribute('data-awrite')) assessWriting();
  else if(b.hasAttribute('data-aagain')){ A.state='idle'; A.result=null; A.quick=false; resetParts(); renderAssess(); }
});
window.renderAssess = renderAssess;
// ---- "Harley explains" for the read-aloud result (shares the 2-a-day allowance) ----
const AC = { state:'idle', tip:'', key:'', err:'' };
function aCoachRender(){
  const box = $('aCoach'); if (!box) return;
  const r = A.result; if (AC.key !== r.date){ AC.key = r.date; AC.state = 'idle'; AC.tip = ''; }
  const v = store.get('sir_coach_left', null), left = (v && v.day === new Date().toISOString().slice(0,10)) ? v.n : null;
  let h = '';
  if (AC.state === 'loading') h = `<p class="a-wait">${esc(t('c_wait'))}</p>`;
  else if (AC.state === 'done') h = `<div class="ccard"><div class="dog" aria-hidden="true">${HARLEY.happy}</div><div><p class="ctext">${esc(AC.tip).replace(/«([^»]+)»/g,(m,w)=>`<b data-acsay="${w}">${w}</b>`)}</p><div class="cact"><button class="btn" data-acreplay>${esc(t('c_replay'))}</button></div></div></div>`;
  else if (AC.state === 'limit' || left === 0) h = `<div class="ccard"><div class="dog" aria-hidden="true">${HARLEY.puzzled}</div><div><p class="ctext">${esc(t('c_used'))}</p><div class="cact"><button class="btn primary" data-prem>${esc(t('getNotified'))}</button></div></div></div>`;
  else h = (AC.state === 'error' ? `<p class="a-error">${esc(AC.err)}</p>` : '') + `<button class="btn cbtn" data-acoach>${esc(t('c_btn'))} <small>· ${esc(left === null ? t('c_free',{n:2}) : t('c_left',{n:left}))}</small></button>`;
  box.innerHTML = h;
}
function aCoachSpeak(text){ if (window.harleySay) harleySay('tip', text, () => { if (typeof coachSpeakBrowser === 'function') coachSpeakBrowser(text); }); }
async function aCoachAsk(){
  const r = A.result; if (!r || AC.state === 'loading') return;
  AC.state = 'loading'; aCoachRender();
  const sub = k => { const s = (r.subs || []).find(x => x[0] === k); return s ? Math.round(s[1]) : null; };
  try {
    const res = await fetch('/.netlify/functions/coach', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({
      mode:'passage', device: DEVICE_ID, lang, ui, phrase: ASSESS_PASSAGES[lang], score: r.score, quick: !!r.quick,
      accuracy: sub('a_sub_accuracy'), fluency: sub('a_sub_fluency'), completeness: sub('p_completeness'), wpm: Math.round(r.wpm || 0),
      words: r.cw.map(w => ({ w: w.w, score: w.score, error: w.error, sounds: [] })) }) });
    const j = await res.json().catch(() => ({}));
    if (res.status === 429 || j.error === 'limit'){ store.set('sir_coach_left', { day: new Date().toISOString().slice(0,10), n: 0 }); AC.state = 'limit'; track('limit'); aCoachRender(); return; }
    if (res.status === 503) throw new Error(t('c_off'));
    if (!res.ok || !j.tip) throw new Error(t('c_fail') + ' (' + (j.error || res.status) + ')');
    if (typeof j.remaining === 'number') store.set('sir_coach_left', { day: new Date().toISOString().slice(0,10), n: j.remaining });
    AC.tip = j.tip; AC.state = 'done'; track('coach'); aCoachRender(); aCoachSpeak(AC.tip);
  } catch(e){ AC.state = 'error'; AC.err = e.message; aCoachRender(); }
}
document.addEventListener('click', e => {
  if (e.target.closest('#aCoach [data-acoach]')){ if (window.haUnlock) haUnlock(); return aCoachAsk(); }
  if (e.target.closest('#aCoach [data-acreplay]')) return aCoachSpeak(AC.tip);
  const w = e.target.closest('#aCoach [data-acsay]');
  if (w && window.harleySay) harleySay('word', w.dataset.acsay, () => {});
});

window.assessLangChanged = () => { if(A.state==='recording'){ clearInterval(A.timer); A.state='idle'; try{A.rec.stop();}catch(e){} } resetParts(); A.result=null; A.error=''; A.state='idle'; A.offerQuick=false; };
function cefrRange(s){ const a = cefrFor(Math.max(0,s-8)), b = cefrFor(Math.min(100,s+8)); return a===b ? a : a+'–'+b; }
azOn().then(() => { if (A.mode==='read' && A.state==='idle' && !A.result) renderAssess(); });
if(typeof render==='function') render();
