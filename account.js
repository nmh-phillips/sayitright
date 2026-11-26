// Optional sign-in (email code or link, no password) so progress follows you across devices.
// Uses Supabase. Hidden until SUPABASE_URL and SUPABASE_PUBLISHABLE_KEY are set in Netlify (see README).
// Synced: best scores, Assess me history, settings (languages, coach) and Harley's Games progress
// (games played, daily-puzzle streak, level and topic). Not synced: device ID and daily allowances.
// Used on both the app page and the games page (games/).
(function () {
  'use strict';
  const SCORE = 'sir_scores', HIST = 'sir_assess';
  const GAMES = 'hs_games', DAILY = 'hs_daily';
  const PREFS = ['sir_lang', 'sir_from', 'sir_ui', 'sir_coach', 'hs_games_level', 'hs_games_topic'];
  const SYNC_KEYS = [SCORE, HIST, GAMES, DAILY].concat(PREFS);
  const LIB = '/vendor/supabase-2.119.2.min.js';
  const AUTH_KEY = 'hs_auth';
  let cfg = null, sb = null, user = null, pushTimer = null, busy = false, email = '';

  const $ = id => document.getElementById(id);
  const T = (k, v) => (typeof t === 'function' ? t(k, v) : k);
  const lsGet = (k, d) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } };
  const lsSet = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} };

  async function getCfg() {
    try { const c = sessionStorage.getItem('hs_auth_cfg'); if (c) return JSON.parse(c); } catch (e) {}
    try {
      const r = await fetch('/.netlify/functions/auth-config');
      if (!r.ok) return null;
      const j = await r.json();
      if (!j || !j.url || !j.key) return null;
      try { sessionStorage.setItem('hs_auth_cfg', JSON.stringify(j)); } catch (e) {}
      return j;
    } catch (e) { return null; }
  }

  function loadLib() {
    return new Promise((res, rej) => {
      if (window.supabase && window.supabase.createClient) return res();
      const s = document.createElement('script'); s.src = LIB; s.onload = res; s.onerror = rej; document.head.appendChild(s);
    });
  }

  async function client() {
    if (sb) return sb;
    await loadLib();
    sb = window.supabase.createClient(cfg.url, cfg.key, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true, flowType: 'implicit', storageKey: AUTH_KEY }
    });
    sb.auth.onAuthStateChange((ev, session) => {
      const u = (session && session.user) || null;
      const was = user; user = u;
      renderBtn(); if (dlgOpen()) renderDlg();
      if (!was || !u || was.id !== u.id) window.dispatchEvent(new CustomEvent('hs-auth', { detail: { email: u ? u.email || '' : '' } }));
      if (u && (!was || was.id !== u.id)) setTimeout(() => sync(), 0);
    });
    return sb;
  }

  const hasSession = () => { try { return !!localStorage.getItem(AUTH_KEY) || /access_token=/.test(location.hash); } catch (e) { return false; } };

  // ---------- syncing ----------
  function localData() {
    const prefs = {}; PREFS.forEach(k => { const v = lsGet(k, undefined); if (v !== undefined) prefs[k] = v; });
    return { v: 1, scores: lsGet(SCORE, {}), assess: lsGet(HIST, []), prefs, games: lsGet(GAMES, { done: {} }), daily: lsGet(DAILY, null) };
  }
  // Games: keep the higher play count per game; daily streak: the most recent day wins (ties: longer streak), best is the max.
  function mergeGames(a, b) {
    const done = Object.assign({}, (b && b.done) || {});
    Object.entries((a && a.done) || {}).forEach(([k, v]) => { if (!(done[k] >= v)) done[k] = v; });
    return { done };
  }
  function mergeDaily(a, b) {
    if (!a || !a.last) return b || null;
    if (!b || !b.last) return a;
    const win = a.last > b.last ? a : b.last > a.last ? b : (a.streak >= b.streak ? a : b);
    return { last: win.last, streak: win.streak, best: Math.max(a.best || 0, b.best || 0, win.streak || 0) };
  }
  function merge(local, remote, takeRemotePrefs) {
    const scores = Object.assign({}, remote.scores || {});
    Object.entries(local.scores || {}).forEach(([k, v]) => { if (!(scores[k] >= v)) scores[k] = v; });
    const seen = new Set(), assess = [];
    (local.assess || []).concat(remote.assess || []).forEach(h => {
      const id = [h.date, h.lang, h.kind, h.score].join('|'); if (!seen.has(id)) { seen.add(id); assess.push(h); }
    });
    assess.sort((a, b) => String(b.date).localeCompare(String(a.date)));
    const prefs = takeRemotePrefs && remote.prefs && Object.keys(remote.prefs).length ? Object.assign({}, local.prefs, remote.prefs) : Object.assign({}, remote.prefs || {}, local.prefs);
    return { v: 1, scores, assess: assess.slice(0, 10), prefs, games: mergeGames(local.games, remote.games), daily: mergeDaily(local.daily, remote.daily) };
  }
  async function fetchRemote() {
    const { data, error } = await sb.from('progress').select('data').eq('user_id', user.id).maybeSingle();
    if (error) throw error;
    return (data && data.data) || {};
  }
  async function save(d) {
    const { error } = await sb.from('progress').upsert({ user_id: user.id, data: d, updated_at: new Date().toISOString() });
    if (error) throw error;
  }
  // On sign-in and on each visit: combine this device with the account, then reload if this device gained anything.
  async function sync() {
    if (!user || busy) return; busy = true;
    try {
      const firstHere = lsGet('hs_synced_uid', '') !== user.id;
      const local = localData(), merged = merge(local, await fetchRemote(), firstHere);
      await save(merged);
      lsSet('hs_synced_uid', user.id);
      const changed = JSON.stringify(merged.scores) !== JSON.stringify(local.scores) ||
        JSON.stringify(merged.assess) !== JSON.stringify(local.assess) ||
        JSON.stringify(merged.games) !== JSON.stringify(local.games) ||
        JSON.stringify(merged.daily) !== JSON.stringify(local.daily) ||
        PREFS.some(k => JSON.stringify(merged.prefs[k]) !== JSON.stringify(local.prefs[k]));
      if (changed) {
        lsSet(SCORE, merged.scores); lsSet(HIST, merged.assess); lsSet(GAMES, merged.games); if (merged.daily) lsSet(DAILY, merged.daily);
        PREFS.forEach(k => { if (merged.prefs[k] !== undefined) lsSet(k, merged.prefs[k]); });
        if (!dlgOpen()) location.reload(); else pendingReload = true;
      }
      setStatus(T('acc_synced'));
    } catch (e) { console.log('sync', e); setStatus(T('acc_err')); }
    finally { busy = false; }
  }
  let pendingReload = false;
  function schedulePush() {
    clearTimeout(pushTimer);
    pushTimer = setTimeout(async () => {
      if (!user) return;
      try { await save(merge(localData(), await fetchRemote(), false)); } catch (e) { console.log('push', e); }
    }, 2500);
  }
  // Save to the account whenever a synced setting or score changes on this device.
  if (window.store && typeof window.store.set === 'function') hook(window.store);
  else if (typeof store !== 'undefined') hook(store); // eslint-disable-line no-undef
  function hook(st) {
    const orig = st.set;
    st.set = function (k, v) { orig.call(st, k, v); if (user && SYNC_KEYS.includes(k)) schedulePush(); };
  }

  // ---------- interface ----------
  const btn = () => $('accBtn'), dlg = () => $('accDlg');
  const dlgOpen = () => { const d = dlg(); return !!(d && d.open); };
  function renderBtn() {
    const b = btn(); if (!b) return;
    b.hidden = false;
    b.innerHTML = user ? '👤<span class="t"> ✓</span>' : '👤<span class="t"> ' + T('acc_signin') + '</span>';
    b.setAttribute('aria-label', user ? T('acc_in', { e: user.email || '' }) : T('acc_signin'));
  }
  function setStatus(msg) { const s = $('accStatus'); if (s) s.textContent = msg || ''; }
  function setErr(msg) { const s = $('accErr'); if (s) s.textContent = msg || ''; }
  function step(name) { ['accStepEmail', 'accStepCode', 'accStepIn', 'accStepDel', 'accStepGone'].forEach(id => { const el = $(id); if (el) el.style.display = id === name ? '' : 'none'; }); }
  function renderDlg() {
    setErr('');
    if (user) { $('accWho').textContent = T('acc_in', { e: user.email || '' }); step('accStepIn'); }
    else if (email && $('accStepCode').style.display === '') step('accStepCode');
    else step('accStepEmail');
  }
  function openDlg() {
    const d = dlg(); if (!d) return;
    renderDlg();
    if (d.showModal) d.showModal(); else d.setAttribute('open', '');
    setTimeout(() => { const i = user ? null : ($('accStepCode').style.display === '' ? $('accCode') : $('accEmail')); if (i) i.focus(); }, 50);
  }
  function closeDlg() {
    const d = dlg(); if (!d) return;
    if (d.close) d.close(); else d.removeAttribute('open');
    if (pendingReload) { pendingReload = false; location.reload(); }
  }

  async function sendCode(ev) {
    ev.preventDefault(); setErr('');
    email = $('accEmail').value.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setErr(T('acc_bademail')); return; }
    const b = $('accSend'); b.disabled = true;
    try {
      await client();
      const { error } = await sb.auth.signInWithOtp({ email, options: { shouldCreateUser: true, emailRedirectTo: location.origin + location.pathname } });
      if (error) throw error;
      $('accSentTo').textContent = T('acc_sent', { e: email });
      $('accCode').value = ''; step('accStepCode'); setTimeout(() => $('accCode').focus(), 50);
    } catch (e) { setErr(e && e.status === 429 ? T('acc_wait') : T('acc_err')); }
    finally { b.disabled = false; }
  }
  async function verify(ev) {
    ev.preventDefault(); setErr('');
    const code = $('accCode').value.replace(/\D/g, '');
    if (code.length < 6) { setErr(T('acc_badcode')); return; }
    const b = $('accVerify'); b.disabled = true;
    try {
      await client();
      const { error } = await sb.auth.verifyOtp({ email, token: code, type: 'email' });
      if (error) throw error;
      // onAuthStateChange shows the signed-in view and syncs.
    } catch (e) { setErr(e && e.status === 429 ? T('acc_wait') : T('acc_badcode')); }
    finally { b.disabled = false; }
  }
  async function signOut() {
    try { await client(); await sb.auth.signOut(); } catch (e) {}
    user = null; email = ''; renderBtn(); step('accStepEmail'); setStatus('');
  }
  async function deleteAccount() {
    const b = $('accDelYes'); b.disabled = true; setErr('');
    try {
      await client();
      const { data } = await sb.auth.getSession();
      const token = data && data.session && data.session.access_token;
      const r = await fetch('/.netlify/functions/delete-account', { method: 'POST', headers: { Authorization: 'Bearer ' + token } });
      if (!r.ok) throw new Error('delete ' + r.status);
      try { await sb.auth.signOut({ scope: 'local' }); } catch (e) {}
      try { localStorage.removeItem('hs_synced_uid'); } catch (e) {}
      user = null; email = ''; renderBtn(); step('accStepGone');
    } catch (e) { setErr(T('acc_err')); }
    finally { b.disabled = false; }
  }

  function wire() {
    btn().onclick = openDlg;
    $('accFormEmail').onsubmit = sendCode;
    $('accFormCode').onsubmit = verify;
    $('accBack').onclick = () => { email = ''; step('accStepEmail'); setErr(''); };
    $('accOut').onclick = signOut;
    $('accDel').onclick = () => { step('accStepDel'); setErr(''); };
    $('accDelNo').onclick = () => { step('accStepIn'); setErr(''); };
    $('accDelYes').onclick = deleteAccount;
    document.querySelectorAll('#accDlg [data-acc-close]').forEach(el => { el.onclick = closeDlg; });
    dlg().addEventListener('close', () => { if (pendingReload) { pendingReload = false; location.reload(); } });
  }

  // Re-label the button when the interface language changes.
  window.hsAccountRelabel = () => { if (cfg) renderBtn(); };
  // For the games page: offer sign-in after a daily puzzle.
  window.hsAccount = { ready: () => !!cfg, signedIn: () => !!user, open: () => openDlg() };
  // The signed-in Supabase client (friends.js), or null when signed out
  window.hsSupabase = async () => { try { if (!cfg || !user) return null; return await client(); } catch (e) { return null; } };
  // Current sign-in token (or null), for features limited to some accounts (Harley Chats beta).
  window.hsAuthToken = async () => { try { if (!cfg || !hasSession()) return null; const c = await client(); const { data } = await c.auth.getSession(); return (data && data.session && data.session.access_token) || null; } catch (e) { return null; } };

  (async function init() {
    if (!btn() || !dlg()) return;
    cfg = await getCfg();
    if (!cfg) return; // accounts not set up yet: keep the button hidden
    wire(); renderBtn();
    if (hasSession()) { try { await client(); } catch (e) { console.log('auth', e); } }
  })();
})();
