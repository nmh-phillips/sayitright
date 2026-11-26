// Harley Says: friends. Invite friends with a link, see a friends-only leaderboard of this week's XP, share your streak.
// Needs sign-in (account.js → hsSupabase). Database: supabase/friends.sql (hs_me, hs_set_name, hs_accept,
// hs_remove_friend, hs_push_xp, hs_board). Only friends you've accepted (both ways) see your name and weekly XP.
// Invite link: https://harleysays.com/?invite=CODE (kept in hs_invite until you're signed in).
(function () {
'use strict';
const get = (k, d) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } };
const put = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} };
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const K = ['title', 'week', 'signIn', 'signInP', 'signBtn', 'nameH', 'nameP', 'namePh', 'save', 'invite', 'inviteText', 'copied', 'code', 'codePh', 'add', 'you', 'empty', 'remove', 'sure', 'added', 'badCode', 'ownCode', 'share', 'shareText', 'close', 'invited', 'err'];
const T = {
  en: ['Friends', "This week's XP", 'Sign in to add friends', 'Friends see each other’s name and weekly XP, and nothing else. Sign in so your friends can find you.', 'Sign in', 'Pick a name', 'This is the only thing your friends see, with your weekly XP.', 'e.g. Neil', 'Save', 'Invite a friend', 'Practise languages with me on Harley Says 🐶 Tap to be friends:', 'Link copied', 'Got a friend code?', 'Friend code', 'Add', 'you', 'Invite a friend and see who earns the most XP this week!', 'Remove', 'Tap again to remove', '🎉 You and {name} are now friends!', "That code didn't work", "That's your own code", 'Share my streak', "🔥 I'm on a {n}-day streak practising on Harley Says! harleysays.com", 'Close', 'A friend invited you! Sign in to accept.', 'Something went wrong. Please try again.'],
  es: ['Amigos', 'XP de esta semana', 'Inicia sesión para añadir amigos', 'Los amigos solo ven el nombre y los XP semanales del otro. Inicia sesión para que tus amigos te encuentren.', 'Iniciar sesión', 'Elige un nombre', 'Es lo único que ven tus amigos, junto con tus XP semanales.', 'p. ej. Ana', 'Guardar', 'Invitar a un amigo', 'Practica idiomas conmigo en Harley Says 🐶 Toca para ser amigos:', 'Enlace copiado', '¿Tienes un código de amigo?', 'Código de amigo', 'Añadir', 'tú', '¡Invita a un amigo y mira quién gana más XP esta semana!', 'Quitar', 'Toca otra vez para quitar', '🎉 ¡Tú y {name} ya sois amigos!', 'Ese código no funciona', 'Es tu propio código', 'Compartir mi racha', '🔥 ¡Llevo una racha de {n} días practicando en Harley Says! harleysays.com', 'Cerrar', '¡Un amigo te ha invitado! Inicia sesión para aceptar.', 'Algo ha fallado. Inténtalo de nuevo.'],
  fr: ['Amis', 'XP de la semaine', 'Connecte-toi pour ajouter des amis', 'Tes amis voient seulement ton nom et tes XP de la semaine. Connecte-toi pour qu’ils te trouvent.', 'Se connecter', 'Choisis un nom', 'C’est tout ce que tes amis voient, avec tes XP de la semaine.', 'ex. Marie', 'Enregistrer', 'Inviter un ami', 'Entraîne-toi aux langues avec moi sur Harley Says 🐶 Touche pour être amis :', 'Lien copié', 'Tu as un code ami ?', 'Code ami', 'Ajouter', 'toi', 'Invite un ami et voyez qui gagne le plus d’XP cette semaine !', 'Retirer', 'Touche encore pour retirer', '🎉 {name} et toi êtes maintenant amis !', 'Ce code ne marche pas', 'C’est ton propre code', 'Partager ma série', '🔥 Je suis sur une série de {n} jours sur Harley Says ! harleysays.com', 'Fermer', 'Un ami t’a invité ! Connecte-toi pour accepter.', 'Une erreur est survenue. Réessaie.'],
  it: ['Amici', 'XP della settimana', 'Accedi per aggiungere amici', 'Gli amici vedono solo il nome e gli XP settimanali. Accedi così i tuoi amici possono trovarti.', 'Accedi', 'Scegli un nome', 'È l’unica cosa che vedono i tuoi amici, insieme agli XP settimanali.', 'es. Luca', 'Salva', 'Invita un amico', 'Esercitati con le lingue con me su Harley Says 🐶 Tocca per diventare amici:', 'Link copiato', 'Hai un codice amico?', 'Codice amico', 'Aggiungi', 'tu', 'Invita un amico e guardate chi guadagna più XP questa settimana!', 'Rimuovi', 'Tocca di nuovo per rimuovere', '🎉 Tu e {name} ora siete amici!', 'Quel codice non funziona', 'È il tuo codice', 'Condividi la mia serie', '🔥 Sono a una serie di {n} giorni su Harley Says! harleysays.com', 'Chiudi', 'Un amico ti ha invitato! Accedi per accettare.', 'Qualcosa è andato storto. Riprova.'],
  de: ['Freunde', 'XP dieser Woche', 'Melde dich an, um Freunde hinzuzufügen', 'Freunde sehen nur deinen Namen und deine Wochen-XP. Melde dich an, damit deine Freunde dich finden.', 'Anmelden', 'Wähle einen Namen', 'Das ist alles, was deine Freunde sehen, zusammen mit deinen Wochen-XP.', 'z. B. Lena', 'Speichern', 'Freund einladen', 'Übe mit mir Sprachen auf Harley Says 🐶 Tippe, um Freunde zu werden:', 'Link kopiert', 'Hast du einen Freundescode?', 'Freundescode', 'Hinzufügen', 'du', 'Lade einen Freund ein und seht, wer diese Woche die meisten XP holt!', 'Entfernen', 'Nochmal tippen zum Entfernen', '🎉 Du und {name} seid jetzt Freunde!', 'Der Code hat nicht funktioniert', 'Das ist dein eigener Code', 'Meine Serie teilen', '🔥 Ich bin seit {n} Tagen am Stück auf Harley Says! harleysays.com', 'Schließen', 'Ein Freund hat dich eingeladen! Melde dich an, um anzunehmen.', 'Etwas ist schiefgelaufen. Bitte versuch es nochmal.'],
  pt: ['Amigos', 'XP desta semana', 'Inicia sessão para adicionar amigos', 'Os amigos só veem o nome e os XP semanais. Inicia sessão para os teus amigos te encontrarem.', 'Iniciar sessão', 'Escolhe um nome', 'É a única coisa que os teus amigos veem, com os teus XP semanais.', 'ex. Rita', 'Guardar', 'Convidar um amigo', 'Pratica línguas comigo no Harley Says 🐶 Toca para sermos amigos:', 'Link copiado', 'Tens um código de amigo?', 'Código de amigo', 'Adicionar', 'tu', 'Convida um amigo e vejam quem ganha mais XP esta semana!', 'Remover', 'Toca outra vez para remover', '🎉 Tu e {name} já são amigos!', 'Esse código não funcionou', 'É o teu próprio código', 'Partilhar a minha sequência', '🔥 Estou numa sequência de {n} dias no Harley Says! harleysays.com', 'Fechar', 'Um amigo convidou-te! Inicia sessão para aceitar.', 'Algo correu mal. Tenta outra vez.'],
  pl: ['Znajomi', 'XP w tym tygodniu', 'Zaloguj się, aby dodać znajomych', 'Znajomi widzą tylko imię i tygodniowe XP. Zaloguj się, aby znajomi mogli cię znaleźć.', 'Zaloguj się', 'Wybierz imię', 'Tylko to widzą twoi znajomi, razem z tygodniowym XP.', 'np. Ola', 'Zapisz', 'Zaproś znajomego', 'Ćwicz ze mną języki w Harley Says 🐶 Dotknij, by zostać znajomymi:', 'Link skopiowany', 'Masz kod znajomego?', 'Kod znajomego', 'Dodaj', 'ty', 'Zaproś znajomego i sprawdźcie, kto zdobędzie więcej XP w tym tygodniu!', 'Usuń', 'Dotknij ponownie, by usunąć', '🎉 Ty i {name} jesteście teraz znajomymi!', 'Ten kod nie działa', 'To twój własny kod', 'Udostępnij serię', '🔥 Mam serię {n} dni w Harley Says! harleysays.com', 'Zamknij', 'Znajomy cię zaprosił! Zaloguj się, by przyjąć.', 'Coś poszło nie tak. Spróbuj ponownie.'],
  ro: ['Prieteni', 'XP săptămâna asta', 'Conectează-te ca să adaugi prieteni', 'Prietenii văd doar numele și XP-ul săptămânal. Conectează-te ca prietenii să te găsească.', 'Conectare', 'Alege un nume', 'E singurul lucru pe care îl văd prietenii, împreună cu XP-ul săptămânal.', 'ex. Ana', 'Salvează', 'Invită un prieten', 'Exersează limbi străine cu mine pe Harley Says 🐶 Atinge ca să fim prieteni:', 'Link copiat', 'Ai un cod de prieten?', 'Cod de prieten', 'Adaugă', 'tu', 'Invită un prieten și vedeți cine câștigă mai mult XP săptămâna asta!', 'Elimină', 'Atinge din nou ca să elimini', '🎉 Tu și {name} sunteți acum prieteni!', 'Codul nu a funcționat', 'Este codul tău', 'Distribuie seria', '🔥 Am o serie de {n} zile pe Harley Says! harleysays.com', 'Închide', 'Un prieten te-a invitat! Conectează-te ca să accepți.', 'Ceva n-a mers. Încearcă din nou.'],
  uk: ['Друзі', 'XP цього тижня', 'Увійди, щоб додати друзів', 'Друзі бачать лише ім’я та XP за тиждень. Увійди, щоб друзі могли тебе знайти.', 'Увійти', 'Обери ім’я', 'Це єдине, що бачать друзі, разом із твоїм XP за тиждень.', 'напр. Оля', 'Зберегти', 'Запросити друга', 'Вчи мови зі мною в Harley Says 🐶 Торкнися, щоб стати друзями:', 'Посилання скопійовано', 'Маєш код друга?', 'Код друга', 'Додати', 'ти', 'Запроси друга й подивіться, хто набере більше XP цього тижня!', 'Видалити', 'Торкнися ще раз, щоб видалити', '🎉 Ти і {name} тепер друзі!', 'Цей код не спрацював', 'Це твій власний код', 'Поділитися серією', '🔥 У мене серія {n} днів у Harley Says! harleysays.com', 'Закрити', 'Друг тебе запросив! Увійди, щоб прийняти.', 'Щось пішло не так. Спробуй ще раз.'],
  zh: ['好友', '本周经验值', '登录后添加好友', '好友之间只能看到名字和本周经验值。登录后好友才能找到你。', '登录', '选个名字', '好友只能看到这个名字和你的本周经验值。', '例如：小明', '保存', '邀请好友', '来 Harley Says 和我一起练语言吧 🐶 点击成为好友：', '链接已复制', '有好友码吗？', '好友码', '添加', '你', '邀请好友，看看本周谁赚的经验值最多！', '删除', '再点一次删除', '🎉 你和 {name} 成为好友了！', '这个好友码无效', '这是你自己的好友码', '分享我的连胜', '🔥 我在 Harley Says 已经连续练习 {n} 天了！harleysays.com', '关闭', '有好友邀请你！登录即可接受。', '出错了，请重试。'],
  ar: ['الأصدقاء', 'نقاط هذا الأسبوع', 'سجّل الدخول لإضافة أصدقاء', 'يرى الأصدقاء الاسم ونقاط الأسبوع فقط. سجّل الدخول ليجدك أصدقاؤك.', 'تسجيل الدخول', 'اختر اسمًا', 'هذا كل ما يراه أصدقاؤك، مع نقاطك الأسبوعية.', 'مثلًا: سارة', 'حفظ', 'ادعُ صديقًا', 'تدرّب على اللغات معي في Harley Says 🐶 اضغط لنصبح أصدقاء:', 'تم نسخ الرابط', 'لديك رمز صديق؟', 'رمز الصديق', 'إضافة', 'أنت', 'ادعُ صديقًا وشاهدوا من يجمع أكثر النقاط هذا الأسبوع!', 'إزالة', 'اضغط مرة أخرى للإزالة', '🎉 أنت و{name} أصبحتما صديقين!', 'هذا الرمز لم ينجح', 'هذا رمزك أنت', 'شارك سلسلتي', '🔥 لديّ سلسلة {n} أيام على Harley Says! harleysays.com', 'إغلاق', 'دعاك صديق! سجّل الدخول للقبول.', 'حدث خطأ. حاول مرة أخرى.'],
  nl: ['Vrienden', 'XP deze week', 'Log in om vrienden toe te voegen', 'Vrienden zien alleen elkaars naam en week-XP. Log in zodat je vrienden je kunnen vinden.', 'Inloggen', 'Kies een naam', 'Dit is het enige wat je vrienden zien, met je week-XP.', 'bijv. Sanne', 'Opslaan', 'Nodig een vriend uit', 'Oefen talen met mij op Harley Says 🐶 Tik om vrienden te worden:', 'Link gekopieerd', 'Heb je een vriendcode?', 'Vriendcode', 'Toevoegen', 'jij', 'Nodig een vriend uit en kijk wie deze week de meeste XP haalt!', 'Verwijderen', 'Tik nogmaals om te verwijderen', '🎉 Jij en {name} zijn nu vrienden!', 'Die code werkte niet', 'Dat is je eigen code', 'Deel mijn reeks', '🔥 Ik zit op een reeks van {n} dagen op Harley Says! harleysays.com', 'Sluiten', 'Een vriend heeft je uitgenodigd! Log in om te accepteren.', 'Er ging iets mis. Probeer het opnieuw.'],
  tr: ['Arkadaşlar', 'Bu haftanın XP’si', 'Arkadaş eklemek için giriş yap', 'Arkadaşlar yalnızca adını ve haftalık XP’ni görür. Arkadaşların seni bulsun diye giriş yap.', 'Giriş yap', 'Bir ad seç', 'Arkadaşlarının gördüğü tek şey bu, haftalık XP’nle birlikte.', 'ör. Ayşe', 'Kaydet', 'Arkadaş davet et', 'Harley Says’te benimle dil çalış 🐶 Arkadaş olmak için dokun:', 'Bağlantı kopyalandı', 'Arkadaş kodun var mı?', 'Arkadaş kodu', 'Ekle', 'sen', 'Bir arkadaşını davet et, bu hafta kim daha çok XP kazanacak görün!', 'Kaldır', 'Kaldırmak için tekrar dokun', '🎉 Sen ve {name} artık arkadaşsınız!', 'Bu kod çalışmadı', 'Bu senin kendi kodun', 'Serimi paylaş', '🔥 Harley Says’te {n} günlük serideyim! harleysays.com', 'Kapat', 'Bir arkadaşın seni davet etti! Kabul etmek için giriş yap.', 'Bir şeyler ters gitti. Tekrar dene.'],
  ja: ['フレンド', '今週のXP', 'フレンド追加にはログイン', 'フレンド同士で見えるのは名前と今週のXPだけです。ログインするとフレンドが見つけられます。', 'ログイン', '名前を決めよう', 'フレンドに見えるのはこの名前と今週のXPだけです。', '例：ゆき', '保存', 'フレンドを招待', 'Harley Says で一緒に語学を練習しよう 🐶 タップでフレンドに：', 'リンクをコピーしました', 'フレンドコードを持っていますか？', 'フレンドコード', '追加', 'あなた', 'フレンドを招待して、今週いちばんXPを稼ぐのは誰か競おう！', '削除', 'もう一度タップで削除', '🎉 {name} とフレンドになりました！', 'そのコードは使えません', '自分のコードです', '連続記録をシェア', '🔥 Harley Says で{n}日連続練習中！harleysays.com', '閉じる', 'フレンドから招待されました！ログインして承認してください。', 'エラーが発生しました。もう一度お試しください。'],
  ko: ['친구', '이번 주 XP', '친구를 추가하려면 로그인하세요', '친구끼리는 이름과 이번 주 XP만 볼 수 있어요. 로그인하면 친구가 나를 찾을 수 있어요.', '로그인', '이름 정하기', '친구에게 보이는 건 이 이름과 이번 주 XP뿐이에요.', '예: 민지', '저장', '친구 초대', 'Harley Says에서 같이 언어 공부해요 🐶 눌러서 친구 되기:', '링크를 복사했어요', '친구 코드가 있나요?', '친구 코드', '추가', '나', '친구를 초대해 이번 주 누가 XP를 더 모으는지 겨뤄 보세요!', '삭제', '한 번 더 누르면 삭제', '🎉 {name}님과 친구가 되었어요!', '코드가 맞지 않아요', '내 코드예요', '연속 기록 공유', '🔥 Harley Says에서 {n}일 연속 연습 중! harleysays.com', '닫기', '친구가 초대했어요! 로그인해서 수락하세요.', '문제가 생겼어요. 다시 시도해 주세요.'],
  vi: ['Bạn bè', 'XP tuần này', 'Đăng nhập để thêm bạn', 'Bạn bè chỉ thấy tên và XP tuần của nhau. Đăng nhập để bạn bè tìm thấy bạn.', 'Đăng nhập', 'Chọn một cái tên', 'Đây là điều duy nhất bạn bè thấy, cùng XP tuần của bạn.', 'vd: Lan', 'Lưu', 'Mời bạn', 'Luyện ngôn ngữ cùng mình trên Harley Says 🐶 Chạm để kết bạn:', 'Đã sao chép liên kết', 'Có mã bạn bè?', 'Mã bạn bè', 'Thêm', 'bạn', 'Mời bạn bè và xem ai kiếm nhiều XP nhất tuần này!', 'Xóa', 'Chạm lần nữa để xóa', '🎉 Bạn và {name} đã là bạn bè!', 'Mã không hợp lệ', 'Đây là mã của bạn', 'Chia sẻ chuỗi', '🔥 Mình đang có chuỗi {n} ngày trên Harley Says! harleysays.com', 'Đóng', 'Một người bạn đã mời bạn! Đăng nhập để chấp nhận.', 'Có lỗi xảy ra. Hãy thử lại.']
};
function t(k, vars) {
  const ui = get('sir_ui', null) || 'en';
  const row = T[ui] || T.en; let v = row[K.indexOf(k)] || T.en[K.indexOf(k)] || k;
  if (vars) for (const a in vars) v = v.split('{' + a + '}').join(vars[a]);
  return v;
}

// ---------- weekly XP from fx.js's daily totals (ISO week, Monday start) ----------
function isoWeek(d) {
  const x = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate())), day = x.getUTCDay() || 7;
  x.setUTCDate(x.getUTCDate() + 4 - day);
  const y = x.getUTCFullYear(), w = Math.ceil(((x - Date.UTC(y, 0, 1)) / 864e5 + 1) / 7);
  return `${y}-W${String(w).padStart(2, '0')}`;
}
const thisWeek = () => isoWeek(new Date());
function weekXp() {
  const days = (get('hs_xp', {}) || {}).days || {}, wk = thisWeek(); let n = 0;
  for (const k in days) { const [y, m, d] = k.split('-').map(Number); if (isoWeek(new Date(y, m - 1, d)) === wk) n += days[k] || 0; }
  return n;
}
const sb = () => window.hsSupabase ? window.hsSupabase() : Promise.resolve(null);
let pushT = null;
function pushSoon() { clearTimeout(pushT); pushT = setTimeout(push, 4000); }
async function push() { const c = await sb(); if (!c) return; try { await c.rpc('hs_push_xp', { wk: thisWeek(), n: weekXp() }); } catch (e) {} }

// ---------- invites ----------
(function readInvite() {
  try {
    const u = new URL(location.href), c = u.searchParams.get('invite');
    if (c && /^[a-f0-9]{6,12}$/i.test(c)) { put('hs_invite', c.toLowerCase()); u.searchParams.delete('invite'); history.replaceState(null, '', u.pathname + u.search + u.hash); }
  } catch (e) {}
})();
async function acceptPending() {
  const code = get('hs_invite', null); if (!code) return;
  const c = await sb(); if (!c) return;
  const me = await c.rpc('hs_me'); const prof = me.data && me.data[0];
  if (!prof) { open(); return; } // pick a name first; the invite is accepted after saving
  const r = await c.rpc('hs_accept', { c: code });
  put('hs_invite', null); localStorage.removeItem('hs_invite');
  if (r.error) { if (!/own code/.test(r.error.message || '')) toast(t('badCode')); return; }
  toast(t('added', { name: r.data })); if (window.HSFX) { HSFX.sound('win'); HSFX.confetti(); }
  if (dlg && dlg.open) fill();
}
const toast = m => { if (window.HSFX) HSFX.toast(m, 'goal'); };

// ---------- the dialog ----------
const css = `
.hsf{border:0;border-radius:24px;padding:0;width:100%;max-width:min(94vw,420px);max-height:92vh;box-shadow:0 20px 50px rgba(28,37,99,.35)}
.hsf::backdrop{background:rgba(20,26,70,.5)}
.hsf-p{font:15px/1.45 Inter,system-ui,sans-serif;color:#1C2563}
.hsf-top{background:linear-gradient(150deg,#3346C8,#0E9F9A);color:#fff;padding:16px;text-align:center}
.hsf-top h3{margin:0;font-size:20px} .hsf-top small{opacity:.9}
.hsf-b{padding:14px 16px 4px}
.hsf-row{display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:14px;background:#f6f7fc;margin-bottom:6px;animation:hsfIn .35s backwards;animation-delay:calc(var(--i) * 60ms)}
.hsf-row.me{background:#FFF1E6;outline:2px solid #FFD8B5}
.hsf-row .rk{width:28px;text-align:center;font-weight:800;font-size:18px}
.hsf-row .nm{flex:1;font-weight:700;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap} .hsf-row .nm small{font-weight:600;color:#667}
.hsf-row .bar{flex:1 1 60px;height:8px;border-radius:999px;background:#e3e6f2;overflow:hidden;max-width:90px} .hsf-row .bar i{display:block;height:100%;background:linear-gradient(90deg,#FF8A3D,#FFD166);border-radius:999px}
.hsf-row .xp{font-weight:800;min-width:56px;text-align:end}
.hsf-row .rm{border:0;background:none;color:#9aa0b8;font-size:16px;cursor:pointer;padding:2px 4px} .hsf-row .rm.sure{color:#DC2626;font-size:12px;font-weight:800}
.hsf-empty{text-align:center;color:#667;margin:6px 0 12px}
.hsf-in{width:100%;box-sizing:border-box;border:1px solid #dfe3f0;border-radius:12px;padding:11px;font:16px Inter,system-ui,sans-serif}
.hsf-code{display:flex;gap:6px;margin-top:6px} .hsf-code .hsf-in{flex:1;text-transform:lowercase}
.hsf-btn{display:block;width:100%;border:0;border-radius:14px;padding:13px;margin-top:8px;font:800 15px Inter,system-ui,sans-serif;cursor:pointer}
.hsf-btn.pri{background:#FF8A3D;color:#fff;box-shadow:0 3px 0 #d96a22} .hsf-btn.sec{background:#0E9F9A;color:#fff;box-shadow:0 3px 0 #0a7370} .hsf-btn.cl{background:#eef0f8;color:#1C2563}
.hsf-btn.sm{display:inline-block;width:auto;margin:0;padding:0 16px}
.hsf-l{display:block;font-weight:800;font-size:13px;color:#667;margin:14px 0 2px}
.hsf-msg{min-height:18px;color:#E0457B;font-weight:700;text-align:center;margin:6px 0 0}
.hsf-foot{padding:4px 16px 16px}
.hsf-home{display:flex;align-items:center;gap:12px;width:100%;text-align:left;margin:0 0 12px;padding:14px;border:0;border-radius:18px;color:#fff;cursor:pointer;font-family:inherit;background:linear-gradient(135deg,#3346C8,#0E9F9A);box-shadow:0 4px 0 #22308f,0 10px 22px rgba(28,37,99,.14)}
.hsf-home .hf-ic{display:grid;place-items:center;width:46px;height:46px;flex:0 0 46px;border-radius:50%;background:rgba(255,255,255,.22);font-size:24px;animation:hsfBob 2.8s ease-in-out infinite}
.hsf-home .hf-t{flex:1;display:flex;flex-direction:column;gap:2px}.hsf-home .hf-t b{font-size:16px}.hsf-home .hf-t span{font-size:13px;opacity:.92}
.hsf-home .hf-go{display:grid;place-items:center;width:40px;height:40px;border-radius:50%;background:#fff;font-size:18px;animation:hsfPulse 2.2s ease-in-out infinite}
.hsf-nudge{position:fixed;left:50%;bottom:20px;transform:translateX(-50%);z-index:9997;display:flex;align-items:center;gap:10px;width:min(94vw,440px);padding:12px 12px 12px 14px;border-radius:18px;background:#fff;color:#1C2563;font:600 14px/1.35 Inter,system-ui,sans-serif;box-shadow:0 14px 40px rgba(28,37,99,.3);animation:hsfUp .45s cubic-bezier(.2,.9,.3,1.3)}
.hsf-nudge .hn-ic{font-size:26px}.hsf-nudge .hn-t{flex:1}
.hsf-nudge .hn-go{border:0;border-radius:12px;padding:10px 14px;background:#FF8A3D;color:#fff;font:800 14px Inter,system-ui,sans-serif;cursor:pointer;box-shadow:0 3px 0 #d96a22}
.hsf-nudge .hn-x{border:0;background:none;color:#9aa0b8;font-size:16px;cursor:pointer}
@keyframes hsfBob{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}
@keyframes hsfPulse{0%,100%{box-shadow:0 0 0 0 rgba(255,255,255,.6)}50%{box-shadow:0 0 0 8px rgba(255,255,255,0)}}
@keyframes hsfUp{from{opacity:0;transform:translate(-50%,30px)}to{opacity:1;transform:translate(-50%,0)}}
@keyframes hsfIn{from{opacity:0;transform:translateX(-12px)}to{opacity:1;transform:none}}
@media (prefers-reduced-motion:reduce){.hsf *{animation:none!important}}`;
let dlg = null, sure = null;
function addCss() { if (document.getElementById('hsfCss')) return; const s = document.createElement('style'); s.id = 'hsfCss'; s.textContent = css; document.head.appendChild(s); }
const streakN = () => { const s = get('hs_streak', { n: 0 }); return (s && s.n) || 0; };
function frame(body) {
  dlg.dir = get('sir_ui', '') === 'ar' ? 'rtl' : 'ltr';
  dlg.innerHTML = `<div class="hsf-p"><div class="hsf-top"><h3>👥 ${esc(t('title'))}</h3><small>${esc(t('week'))}</small></div><div class="hsf-b">${body}</div>
    <div class="hsf-foot"><button class="hsf-btn sec" data-share>🔥 ${esc(t('share'))}</button><button class="hsf-btn cl" data-close>${esc(t('close'))}</button></div></div>`;
}
let code = null;
async function fill(msg) {
  if (!dlg) return;
  const c = await sb();
  if (!c) {
    frame(`${get('hs_invite', null) ? `<p class="hsf-empty">💌 ${esc(t('invited'))}</p>` : ''}<p class="hsf-empty">${esc(t('signInP'))}</p><button class="hsf-btn pri" data-signin>${esc(t('signBtn'))}</button>`);
    return;
  }
  let me = null;
  try { const r = await c.rpc('hs_me'); me = r.data && r.data[0]; } catch (e) {}
  if (!me) {
    frame(`<p class="hsf-empty"><b>${esc(t('nameH'))}</b><br>${esc(t('nameP'))}</p><input class="hsf-in" id="hsfName" maxlength="24" placeholder="${esc(t('namePh'))}" autocomplete="nickname"><button class="hsf-btn pri" data-name>${esc(t('save'))}</button><p class="hsf-msg">${esc(msg || '')}</p>`);
    return;
  }
  code = me.code;
  await push();
  let rows = [];
  try { const r = await c.rpc('hs_board', { wk: thisWeek() }); rows = r.data || []; } catch (e) {}
  const max = Math.max(1, ...rows.map(r => r.xp));
  const medal = i => ['🥇', '🥈', '🥉'][i] || String(i + 1);
  const list = rows.map((r, i) => `<div class="hsf-row${r.me ? ' me' : ''}" style="--i:${i}"><span class="rk">${medal(i)}</span><span class="nm">${esc(r.name)}${r.me ? ` <small>(${esc(t('you'))})</small>` : ''}</span><span class="bar"><i style="width:${Math.round(100 * r.xp / max)}%"></i></span><span class="xp">${r.xp} XP</span>${r.me ? '' : `<button class="rm${sure === r.id ? ' sure' : ''}" data-rm="${r.id}" aria-label="${esc(t('remove'))}">${sure === r.id ? esc(t('sure')) : '✕'}</button>`}</div>`).join('');
  frame(`${list}${rows.length <= 1 ? `<p class="hsf-empty">${esc(t('empty'))}</p>` : ''}
    <button class="hsf-btn pri" data-invite>💌 ${esc(t('invite'))}</button>
    <span class="hsf-l">${esc(t('code'))}</span><div class="hsf-code"><input class="hsf-in" id="hsfCode" maxlength="12" placeholder="${esc(t('codePh'))}"><button class="hsf-btn sec sm" data-addcode>${esc(t('add'))}</button></div>
    <p class="hsf-msg">${esc(msg || '')} ${code ? `<small style="color:#667;font-weight:600">· ${esc(t('codePh'))}: <b>${esc(code)}</b></small>` : ''}</p>`);
}
async function onClick(e) {
  if (e.target === dlg) return dlg.close();
  const b = e.target.closest('button'); if (!b) return;
  const d = b.dataset, c = await sb();
  if (d.close !== undefined) return dlg.close();
  if (d.signin !== undefined) { dlg.close(); if (window.hsAccount) hsAccount.open(); return; }
  if (d.share !== undefined) {
    const txt = t('shareText', { n: Math.max(1, streakN()) });
    try { if (navigator.share) { await navigator.share({ text: txt }); return; } } catch (err) { return; }
    try { await navigator.clipboard.writeText(txt); toast(t('copied')); } catch (err) {}
    return;
  }
  if (!c) return;
  if (d.name !== undefined) {
    const n = ($('hsfName') || {}).value || '';
    const r = await c.rpc('hs_set_name', { n });
    if (r.error) return fill(t('err'));
    if (window.HSFX) HSFX.sound('good');
    await fill();
    if (get('hs_invite', null)) acceptPending();
    return;
  }
  if (d.invite !== undefined && code) {
    const url = `https://harleysays.com/?invite=${code}`, txt = `${t('inviteText')} ${url}`;
    try { if (navigator.share) { await navigator.share({ text: txt }); return; } } catch (err) { return; }
    try { await navigator.clipboard.writeText(txt); fill(t('copied')); } catch (err) { fill(url); }
    return;
  }
  if (d.addcode !== undefined) {
    const v = (($('hsfCode') || {}).value || '').trim().toLowerCase();
    if (!v) return;
    const r = await c.rpc('hs_accept', { c: v });
    if (r.error) return fill(/own code/.test(r.error.message || '') ? t('ownCode') : t('badCode'));
    if (window.HSFX) { HSFX.sound('win'); HSFX.confetti(); }
    return fill(t('added', { name: r.data }));
  }
  if (d.rm) {
    if (sure !== d.rm) { sure = d.rm; return fill(); }
    sure = null; await c.rpc('hs_remove_friend', { fid: d.rm }); return fill();
  }
}
const $ = id => dlg && dlg.querySelector('#' + id);
function open() {
  addCss();
  if (!dlg) { dlg = document.createElement('dialog'); dlg.className = 'hsf'; document.body.appendChild(dlg); dlg.addEventListener('click', onClick); }
  sure = null; frame('<p class="hsf-empty">…</p>');
  try { if (!dlg.open) dlg.showModal(); } catch (e) { dlg.setAttribute('open', ''); }
  fill();
}

// ---------- easy to find: a home-page button, and a gentle prompt after good moments (at most once a day) ----------
const X = {"en": ["👥 Invite a friend", "Practise together and compete on weekly XP", "Enjoying Harley Says? Invite a friend and see who earns more XP this week!", "Invite"], "es": ["👥 Invita a un amigo", "Practicad juntos y competid por los XP semanales", "¿Te gusta Harley Says? ¡Invita a un amigo y mirad quién gana más XP esta semana!", "Invitar"], "fr": ["👥 Invite un ami", "Entraînez-vous ensemble et comparez vos XP de la semaine", "Tu aimes Harley Says ? Invite un ami et voyez qui gagne le plus d’XP cette semaine !", "Inviter"], "it": ["👥 Invita un amico", "Esercitatevi insieme e sfidatevi sugli XP settimanali", "Ti piace Harley Says? Invita un amico e guardate chi guadagna più XP questa settimana!", "Invita"], "de": ["👥 Freund einladen", "Übt zusammen und vergleicht eure Wochen-XP", "Gefällt dir Harley Says? Lade einen Freund ein und seht, wer diese Woche mehr XP holt!", "Einladen"], "pt": ["👥 Convida um amigo", "Pratiquem juntos e comparem os XP da semana", "Gostas do Harley Says? Convida um amigo e vejam quem ganha mais XP esta semana!", "Convidar"], "pl": ["👥 Zaproś znajomego", "Ćwiczcie razem i rywalizujcie o tygodniowe XP", "Podoba ci się Harley Says? Zaproś znajomego i sprawdźcie, kto zdobędzie więcej XP!", "Zaproś"], "ro": ["👥 Invită un prieten", "Exersați împreună și concurați la XP-ul săptămânal", "Îți place Harley Says? Invită un prieten și vedeți cine câștigă mai mult XP săptămâna asta!", "Invită"], "uk": ["👥 Запроси друга", "Тренуйтеся разом і змагайтеся за тижневі XP", "Подобається Harley Says? Запроси друга й подивіться, хто набере більше XP цього тижня!", "Запросити"], "zh": ["👥 邀请好友", "一起练习，比比每周经验值", "喜欢 Harley Says 吗？邀请好友，看看本周谁的经验值更多！", "邀请"], "ar": ["👥 ادعُ صديقًا", "تدرّبوا معًا وتنافسوا على نقاط الأسبوع", "هل يعجبك Harley Says؟ ادعُ صديقًا وشاهدوا من يجمع نقاطًا أكثر هذا الأسبوع!", "دعوة"], "nl": ["👥 Nodig een vriend uit", "Oefen samen en strijd om week-XP", "Vind je Harley Says leuk? Nodig een vriend uit en kijk wie deze week de meeste XP haalt!", "Uitnodigen"], "tr": ["👥 Arkadaş davet et", "Birlikte çalışın, haftalık XP’de yarışın", "Harley Says hoşuna gitti mi? Bir arkadaşını davet et, bu hafta kim daha çok XP kazanacak görün!", "Davet et"], "ja": ["👥 フレンドを招待", "一緒に練習して今週のXPを競おう", "Harley Says を楽しんでいますか？フレンドを招待して、今週のXPを競おう！", "招待"], "ko": ["👥 친구 초대", "함께 연습하고 주간 XP로 겨뤄요", "Harley Says가 마음에 드나요? 친구를 초대해 이번 주 누가 XP를 더 모으는지 겨뤄 보세요!", "초대"], "vi": ["👥 Mời bạn bè", "Luyện tập cùng nhau và thi đua XP mỗi tuần", "Bạn thích Harley Says chứ? Mời bạn bè và xem ai kiếm nhiều XP hơn tuần này!", "Mời"]};
const x = i => (X[get('sir_ui', 'en')] || X.en)[i];
function homeBtn() {
  const anchor = document.getElementById('gamesLink'); if (!anchor || document.getElementById('inviteCard')) return;
  addCss();
  const el = document.createElement('button'); el.type = 'button'; el.id = 'inviteCard'; el.className = 'hsf-home';
  el.innerHTML = `<span class="hf-ic">👥</span><span class="hf-t"><b>${esc(x(0))}</b><span>${esc(x(1))}</span></span><span class="hf-go">💌</span>`;
  el.onclick = open; anchor.parentNode.insertBefore(el, anchor);
}
function relabel() { const el = document.getElementById('inviteCard'); if (el) { el.querySelector('b').textContent = x(0); el.querySelector('.hf-t span').textContent = x(1); } }
const today = () => new Date().toISOString().slice(0, 10);
function nudge() {
  if (get('hs_nudge', '') === today() || document.querySelector('dialog[open]') || document.querySelector('.hsf-nudge')) return;
  addCss(); put('hs_nudge', today());
  const n = document.createElement('div'); n.className = 'hsf-nudge'; n.setAttribute('role', 'status');
  n.innerHTML = `<span class="hn-ic">👥</span><span class="hn-t">${esc(x(2))}</span><button type="button" class="hn-go">${esc(x(3))}</button><button type="button" class="hn-x" aria-label="✕">✕</button>`;
  n.querySelector('.hn-go').onclick = () => { n.remove(); open(); };
  n.querySelector('.hn-x').onclick = () => n.remove();
  document.body.appendChild(n); setTimeout(() => n.remove(), 12000);
}
// good moments: confetti (perfect game, passed mock test, interview report, daily goal…), a lesson round with 2+ stars
window.addEventListener('hs-celebrate', () => setTimeout(nudge, 3500));
window.addEventListener('hs-round', e => { if ((e.detail || {}).stars >= 2) setTimeout(nudge, 3500); });
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', homeBtn); else homeBtn();
document.addEventListener('change', e => { if (e.target && e.target.id === 'ui') setTimeout(relabel, 300); });

window.HSFriends = { open, title: () => t('title') };
window.addEventListener('hs-xp', pushSoon);
window.addEventListener('hs-auth', () => { push(); acceptPending(); if (dlg && dlg.open) fill(); });
// an invite link opened while signed out: say so once the page is ready
window.addEventListener('load', () => setTimeout(() => { if (get('hs_invite', null) && !(window.hsAccount && hsAccount.signedIn())) open(); else acceptPending(); }, 1800));
})();
