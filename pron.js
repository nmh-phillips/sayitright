// Harley Says: sound-by-sound scoring. Uses globals from index.html (lang, t, current, store, DEVICE_ID, speak, $, HARLEY).
const PRON_MAX_SEC = 12;
const P = { state:'idle', result:null, error:'', rec:null, sel:-1, phrase:null };

// ---- record 16 kHz mono WAV in the browser ----
async function pronRecord(){
  const stream = await navigator.mediaDevices.getUserMedia({ audio:{ channelCount:1, echoCancellation:true, noiseSuppression:true } });
  const Ctx = window.AudioContext || window.webkitAudioContext;
  const ctx = new Ctx();
  if (ctx.state === 'suspended') await ctx.resume();
  const src = ctx.createMediaStreamSource(stream);
  const node = ctx.createScriptProcessor(4096, 1, 1);
  const chunks = [];
  node.onaudioprocess = e => chunks.push(new Float32Array(e.inputBuffer.getChannelData(0)));
  src.connect(node); node.connect(ctx.destination);
  return {
    stop: async () => {
      node.disconnect(); src.disconnect(); stream.getTracks().forEach(tr => tr.stop());
      const rate = ctx.sampleRate; await ctx.close();
      return pronWav(chunks, rate);
    },
    cancel: () => { try{ node.disconnect(); src.disconnect(); }catch(e){} stream.getTracks().forEach(tr => tr.stop()); ctx.close(); }
  };
}
function pronWav(chunks, inRate){
  const len = chunks.reduce((n,c)=>n+c.length,0), all = new Float32Array(len);
  let o = 0; for (const c of chunks){ all.set(c,o); o += c.length; }
  const ratio = inRate/16000, outLen = Math.floor(len/ratio), pcm = new Int16Array(outLen);
  for (let i=0;i<outLen;i++){
    const s = Math.floor(i*ratio), e = Math.min(len, Math.floor((i+1)*ratio)); let sum = 0;
    for (let k=s;k<e;k++) sum += all[k];
    const v = Math.max(-1, Math.min(1, sum/Math.max(1,e-s)));
    pcm[i] = v < 0 ? v*0x8000 : v*0x7fff;
  }
  const buf = new ArrayBuffer(44 + pcm.length*2), dv = new DataView(buf);
  const w = (p,s) => { for (let i=0;i<s.length;i++) dv.setUint8(p+i, s.charCodeAt(i)); };
  w(0,'RIFF'); dv.setUint32(4,36+pcm.length*2,true); w(8,'WAVE'); w(12,'fmt '); dv.setUint32(16,16,true);
  dv.setUint16(20,1,true); dv.setUint16(22,1,true); dv.setUint32(24,16000,true); dv.setUint32(28,32000,true);
  dv.setUint16(32,2,true); dv.setUint16(34,16,true); w(36,'data'); dv.setUint32(40,pcm.length*2,true);
  new Int16Array(buf, 44).set(pcm);
  let bin = ''; const bytes = new Uint8Array(buf);
  for (let i=0;i<bytes.length;i+=0x8000) bin += String.fromCharCode.apply(null, bytes.subarray(i, i+0x8000));
  return { b64: btoa(bin), seconds: pcm.length/16000 };
}

// ---- flow ----
async function pronStart(){
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia){ P.error = t('voiceNeeds'); pronRender(); return; }
  try {
    P.rec = await pronRecord(); P.state = 'recording'; P.error = ''; P.result = null; pronRender();
    P.timer = setTimeout(pronStop, PRON_MAX_SEC*1000);
  } catch(e){ P.state='idle'; P.error = t('p_mic'); pronRender(); }
}
async function pronStop(){
  if (P.state !== 'recording') return;
  clearTimeout(P.timer); P.state = 'analysing'; pronRender();
  const p = current(); const wav = await P.rec.stop(); P.rec = null;
  if (wav.seconds < 0.6){ P.state='idle'; P.error = t('p_nomatch'); pronRender(); return; }
  try {
    const r = await fetch('/.netlify/functions/pronounce', { method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ audio: wav.b64, text: p[0], lang, device: DEVICE_ID }) });
    const j = await r.json().catch(()=>({}));
    if (r.status === 503 || /not configured/i.test(j.error||'')) throw new Error('__off');
    if (r.status === 429 || j.error === 'limit') throw new Error('__limit:'+(j.limit||3));
    if (j.error === 'nomatch') throw new Error('__nomatch');
    if (!r.ok || typeof j.score !== 'number') throw new Error(j.error || ('HTTP '+r.status));
    P.result = j; P.state = 'done'; P.sel = pronWorstWord(j);
    store.set('sir_pron_left', { day: new Date().toISOString().slice(0,10), n: j.remaining });
  } catch(e){
    P.state = 'idle';
    const m = e.message;
    P.error = m==='__off' ? t('p_off') : m.startsWith('__limit') ? '__limit' : m==='__nomatch' ? t('p_nomatch') : t('p_fail')+m;
    if (m.startsWith('__limit')) { P.limit = Number(m.split(':')[1]); store.set('sir_pron_left', { day:new Date().toISOString().slice(0,10), n:0 }); }
  }
  pronRender();
}
function pronWorstWord(j){ let worst=-1, s=101; j.words.forEach((w,i)=>{ if(w.score<s){ s=w.score; worst=i; } }); return worst; }
function pronLeft(){ const v = store.get('sir_pron_left', null); return (v && v.day === new Date().toISOString().slice(0,10)) ? v.n : null; }
const pc = s => s>=80 ? 'ok' : s>=60 ? 'mid' : 'bad';
const pesc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));


// Azure only names sounds for US English, so label each sound with the letters that spell it.
const PH_UNITS = ['sch','eau','tch','igh','dge','ção','ão','ões','sh','ch','th','ph','wh','ck','ng','qu','gu','gn','gl','gh','nh','lh','sc','ll','rr','ss','tt','nn','mm','pp','ff','dd','bb','cc','zz','ee','oo','ea','ai','ay','oa','ou','ow','oi','oy','au','aw','ie','ei','eu','äu','ue','ui','ey','ew','on','an','en','in','un'];
function phLabels(word, n){
  const src = String(word||'').replace(/[^\p{L}]/gu,'');
  if (!n) return [];
  if (!src) return Array(n).fill('·');
  const low = src.toLowerCase(); let u = [], i = 0;
  while (i < src.length){
    const m = PH_UNITS.find(d => low.startsWith(d, i));
    const len = m ? m.length : 1; u.push(src.slice(i, i+len)); i += len;
  }
  while (u.length > n){
    if (u.length > 1 && /^e$/i.test(u[u.length-1])) { const e = u.pop(); u[u.length-1] += e; continue; }
    let best = 0; for (let k = 1; k < u.length-1; k++) if (u[k].length+u[k+1].length < u[best].length+u[best+1].length) best = k;
    u.splice(best, 2, u[best]+u[best+1]);
  }
  while (u.length < n){
    let k = -1; u.forEach((x,j) => { if (x.length > 1 && (k < 0 || x.length > u[k].length)) k = j; });
    if (k < 0) break;
    u.splice(k, 1, u[k].slice(0,1), u[k].slice(1));
  }
  while (u.length < n) u.push(u[u.length-1]);
  return u;
}
const phName = (ph, lab) => ph.p ? `${lab} /${ph.p}/` : lab;

function pronRender(){
  const box = $('pronBox'); if (!box) return;
  const p = current();
  if (!p){ box.innerHTML=''; return; }
  const left = pronLeft();
  let h = '';
  if (P.state === 'recording') h += `<button class="btn pron-btn rec" data-pstop>${pesc(t('p_rec'))}</button>`;
  else if (P.state === 'analysing') h += `<p class="a-wait">${pesc(t('p_wait'))}</p>`;
  else h += `<button class="btn pron-btn" data-pstart>${pesc(t('p_btn'))}${left!==null && P.state!=='done' ? ' <span class="pron-left">'+pesc(t('p_left',{n:left}))+'</span>' : ''}</button>`;
  if (P.error === '__limit'){
    h += `<p class="a-error">${pesc(t('p_limit',{n:P.limit||3}))} <button class="linkbtn" data-prem>${pesc(t('getNotified'))}</button></p>`;
  } else if (P.error) h += `<p class="a-error">${pesc(P.error)}</p>`;
  if (P.state === 'done' && P.result){
    const r = P.result;
    h += `<div class="pron-res"><div class="pron-head"><span class="pron-mood" aria-hidden="true">${HARLEY[r.score>=85?'celebrate':r.score>=60?'happy':'puzzled']}</span>
      <div><div class="a-num">${r.score}<small>/100</small></div><div class="a-meta">${pesc(t('p_title'))}${typeof r.remaining==='number'?' · '+pesc(t('p_left',{n:r.remaining})):''}</div></div></div>
      <div class="a-subs">${[['a_sub_accuracy',r.accuracy],['a_sub_fluency',r.fluency],['p_completeness',r.completeness]].map(([k,v])=>`<div class="a-sub"><span>${pesc(t(k))}</span><span class="a-bar"><i style="width:${v}%"></i></span><b>${v}</b></div>`).join('')}</div>
      <p class="a-meta">${pesc(t('p_tapWord'))}</p>
      <div class="pron-words">${r.words.map((w,i)=>`<button class="pw ${w.error==='Omission'?'bad':pc(w.score)}${i===P.sel?' sel':''}" data-pword="${i}">${pesc(w.word)}</button>`).join('')}</div>`;
    const w = r.words[P.sel];
    if (w){
      h += `<div class="pron-detail"><div class="a-row"><b>${pesc(t('p_sounds',{w:w.word}))}</b><button class="btn" data-phear="${P.sel}">${pesc(t('listen'))}</button></div>`;
      if (w.error === 'Omission') h += `<p class="a-meta">${pesc(t('p_omitted'))}</p>`;
      if (w.phonemes.length){ const L = phLabels(w.word, w.phonemes.length); h += `<div class="pron-ph">${w.phonemes.map((ph,j)=>`<span class="ph ${pc(ph.score)}"${ph.p?` title="/${pesc(ph.p)}/"`:''}><b>${pesc(L[j])}</b><small>${ph.score}</small></span>`).join('')}</div>`; }
      h += `</div>`;
    }
    const worst = [];
    r.words.forEach(w => { const L = phLabels(w.word, w.phonemes.length); w.phonemes.forEach((ph,j) => { if (ph.score < 60) worst.push(`“${phName(ph, L[j])}” in ${w.word}`); }); });
    h += `<p class="pron-tip">${pesc(worst.length ? t('p_focus',{s:worst.slice(0,3).join(', ')}) : t('p_good'))}</p></div>`;
  }
  box.innerHTML = h;
}
document.addEventListener('click', e => {
  const b = e.target.closest('#pronBox [data-pstart],#pronBox [data-pstop],#pronBox [data-pword],#pronBox [data-phear]');
  if (!b) return;
  if (b.hasAttribute('data-pstart')) pronStart();
  else if (b.hasAttribute('data-pstop')) pronStop();
  else if (b.dataset.pword !== undefined){ P.sel = Number(b.dataset.pword); pronRender(); }
  else if (b.dataset.phear !== undefined){ const w = P.result.words[Number(b.dataset.phear)]; if (w) speak(w.word, 0.7); }
});
window.pronReset = () => {
  const p = current(); const k = p ? lang+'|'+p[0] : null;
  if (k !== P.phrase){ if (P.rec){ P.rec.cancel(); P.rec=null; clearTimeout(P.timer); } P.state='idle'; P.result=null; P.error=''; P.sel=-1; P.phrase=k; }
  pronRender();
};
if (typeof render === 'function') render();
