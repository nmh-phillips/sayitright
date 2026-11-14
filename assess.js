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

const A = { mode:'read', state:'idle', result:null, error:'', finals:[], confs:[], interim:'', start:0, timer:null, rec:null, writeText:'' };

function fluencyFrom(wpm, conf){
  let f = wpm < 60 ? (wpm/60)*0.6 : wpm <= 170 ? Math.min(1, 0.6 + (wpm-60)/60*0.4) : Math.max(0.6, 1-(wpm-170)/120);
  return Math.round(100*(0.75*f + 0.25*conf));
}
function avgConf(){ const c = A.confs.filter(x => x > 0); return c.length ? c.reduce((a,b)=>a+b,0)/c.length : 0.85; }
function heardText(){ return (A.finals.join(' ') + ' ' + A.interim).trim(); }
function elapsed(){ return A.start ? (Date.now()-A.start)/1000 : 0; }
function fmt(sec){ sec=Math.max(0,Math.round(sec)); return Math.floor(sec/60)+':'+String(sec%60).padStart(2,'0'); }

function setMode(m){ if(A.state==='recording') return; A.mode=m; A.state='idle'; A.result=null; A.error=''; renderAssess(); }

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
  const tl = $('aTime'); if(tl) tl.textContent = t('a_timeLeft',{t:fmt(ASSESS_MAX[A.mode]-elapsed())}) + ' · ' + t('a_words',{n:wc(heardText())});
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
    const score = Math.round(100*(0.65*acc + 0.2*(flu/100) + 0.15*conf));
    const missed = [...new Set(target.filter((w,i)=>!hits[i]))].slice(0,10);
    finishResult({ kind:'read', score, cefr:cefrFor(score), subs:[['a_sub_accuracy',acc*100],['a_sub_fluency',flu],['a_sub_clarity',conf*100]], missed, wpm });
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
    const r = await fetch('/.netlify/functions/assess',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...payload, lang, ui})});
    const j = await r.json().catch(()=>({}));
    if(r.status===503 || /not configured/i.test(j.error||'')) throw new Error('__off');
    if(!r.ok || typeof j.score!=='number') throw new Error(j.error || ('HTTP '+r.status));
    finishResult(toResult(j));
  }catch(err){
    A.state='idle';
    A.error = err.message==='__off' ? t('a_off') : t('a_fail')+err.message;
    renderAssess();
  }
}
function finishResult(res){
  res.date = new Date().toISOString(); res.lang = lang;
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
        <div class="a-level"><b>${esc(r.cefr)}</b> ${esc(t('lvl_'+r.cefr))}${r.kind==='read'?' · '+esc(t('a_pronLevel')):''}</div></div></div>
      <div class="a-subs">${r.subs.map(([k,v])=>`<div class="a-sub"><span>${esc(t(k))}</span><span class="a-bar"><i style="width:${Math.round(v)}%"></i></span><b>${Math.round(v)}</b></div>`).join('')}</div>`;
    if(r.summary) h += `<p class="a-summary">${esc(r.summary)}</p>`;
    if(r.strengths && r.strengths.length) h += `<h3>${esc(t('a_strengths'))}</h3><ul>${r.strengths.map(s=>`<li>${esc(s)}</li>`).join('')}</ul>`;
    if(r.improve && r.improve.length) h += `<h3>${esc(t('a_improve'))}</h3><ul>${r.improve.map(s=>`<li>${esc(s)}</li>`).join('')}</ul>`;
    if(r.missed && r.missed.length) h += `<p class="a-meta">${esc(t('a_missed',{w:r.missed.join(', ')}))}</p>`;
    if(r.wpm) h += `<p class="a-meta">${esc(t('a_pace',{n:Math.round(r.wpm)}))}</p>`;
    h += `<p class="a-disclaimer">${esc(t('a_indicative'))}</p>
      <button class="btn primary" data-aagain>${esc(t('a_again'))}</button></div>`;
  } else if(A.mode==='write'){
    h += `<p class="a-how">${esc(t('a_writeHow'))}</p>
      <textarea id="aWrite" rows="8" placeholder="${esc(t('a_writePh'))}">${esc(A.writeText)}</textarea>
      <div class="a-row"><span class="a-meta" id="aWc">${esc(t('a_words',{n:wc(A.writeText)}))}</span>
      <button class="btn primary" data-awrite ${A.state==='assessing'?'disabled':''}>${esc(A.state==='assessing'?t('a_assessing'):t('a_assessWrite'))}</button></div>`;
  } else {
    h += `<p class="a-how">${esc(t(A.mode==='read'?'a_readHow':'a_speakHow'))}</p>`;
    if(A.mode==='read') h += `<blockquote class="a-passage" lang="${esc(DATA[lang].code)}">${esc(ASSESS_PASSAGES[lang])}</blockquote>`;
    if(A.state==='recording'){
      h += `<button class="btn mic rec" data-astop>${esc(t('a_finish'))}</button>
        <p class="a-meta" id="aTime"></p><p class="a-live" id="aLive" aria-live="polite"></p>`;
    } else if(A.state==='finishing' || A.state==='assessing'){
      h += `<p class="a-wait">${esc(t('a_assessing'))}</p>`;
    } else {
      h += `<button class="btn mic" data-astart>${esc(t('a_start'))}</button>`;
    }
  }
  if(A.error) h += `<p class="a-error" role="alert">${esc(A.error)}</p>`;
  card.innerHTML = h;
  updateLive();
  const ta = $('aWrite'); if(ta) ta.oninput = () => { A.writeText = ta.value; const w=$('aWc'); if(w) w.textContent=t('a_words',{n:wc(ta.value)}); };
}
document.addEventListener('click', e => {
  const b = e.target.closest('#assessCard [data-amode],#assessCard [data-astart],#assessCard [data-astop],#assessCard [data-awrite],#assessCard [data-aagain]');
  if(!b) return;
  if(b.dataset.amode) setMode(b.dataset.amode);
  else if(b.hasAttribute('data-astart')) startRec();
  else if(b.hasAttribute('data-astop')) finishRec();
  else if(b.hasAttribute('data-awrite')) assessWriting();
  else if(b.hasAttribute('data-aagain')){ A.state='idle'; A.result=null; renderAssess(); }
});
window.renderAssess = renderAssess;
window.assessLangChanged = () => { if(A.state==='recording'){ clearInterval(A.timer); A.state='idle'; try{A.rec.stop();}catch(e){} } A.result=null; A.error=''; A.state='idle'; };
if(typeof render==='function') render();
