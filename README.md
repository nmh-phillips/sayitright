# Twangly

Pronunciation practice web app. Pick a language (English, Spanish, French, Italian, German, Portuguese), listen to a phrase, say it, and get a score with word-by-word feedback.

- Single static page: `index.html` (no build step)
- Uses the browser's built-in speech recognition and text-to-speech
- Works in Chrome, Edge and Safari (incl. iPhone); must be served over https
- Scores are stored locally on the device (localStorage)

## Deploy
Netlify → Add new site → Import from Git → this repo. Build command: none. Publish directory: `/`.

## Phrases
`phrases.js` holds the free library: 20 phrases × 4 sections × 6 languages. Keep the first five of each section unchanged (saved scores are keyed on phrase text).

## Translation ("My phrase" tab)
`netlify/functions/translate.mjs` translates the user's own phrase. Set ONE of these in Netlify → Project configuration → Environment variables, then redeploy:
- `ANTHROPIC_API_KEY` (optional `ANTHROPIC_MODEL`, default `claude-haiku-5-5`)

## Assess me (free for now)
Tab with three modes, giving an indicative 0–100 score and CEFR level (A1 0–20, A2 21–40, B1 41–60, B2 61–75, C1 76–90, C2 91–100):
- **Read a text**: scored in the browser (accuracy against the passage, pace, recognition confidence). Works with no setup.
- **Speak freely** (30 s – 5 min) and **Write** (50+ words): sent to `netlify/functions/assess.mjs`, which asks Claude to assess. Needs `ANTHROPIC_API_KEY` in Netlify (optional `ASSESS_MODEL`, default `claude-sonnet-5-5`). Without it the app says the mode isn't switched on yet.

## Sound-by-sound scoring
"🔬 Check each sound" on every phrase records 16 kHz WAV in the browser and sends it to `netlify/functions/pronounce.mjs`, which calls Azure AI Speech Pronunciation Assessment (phoneme level). Shows overall, accuracy, fluency, completeness, per-word and per-sound scores.
Needs `AZURE_SPEECH_KEY` and `AZURE_SPEECH_REGION` in Netlify. Free users: `PRON_FREE_LIMIT` checks per device per day (default 3). Assess me "Read a text" streams the whole passage to Azure in one take via the Speech SDK (vendor/speech-sdk-1.53.0.min.js, MIT; 10-minute token from netlify/functions/speech-token.mjs, so the key never reaches the browser). If streaming fails it falls back to reading in 3 parts of under 30 seconds each (pronounce.mjs). Both share with its own allowance `ASSESS_PRON_LIMIT` (default 9 parts = 3 assessments a day). Without Azure it falls back to a stricter quick estimate (capped at 85, shown as a level range). The main "Tap and say it" button also uses Azure (kind:"say", `SAY_FREE_LIMIT` default 25 a day per device, `SAY_IP_LIMIT` default 150), stopping automatically when the speaker pauses; after the allowance it falls back to the browser quick check.

## Launch kit
- **Usage stats:** `netlify/functions/track.mjs` counts daily totals per event (no cookies, no personal data). View at `/stats.html` after setting `STATS_KEY` in Netlify.
- **Spend safety net:** `AI_ASSESS_GLOBAL_LIMIT` (default 300 a day across everyone) on Claude assessments. Azure Free F0 stops at its quota rather than charging; if Azure stops, the main button falls back to the quick browser check.
- **Installable:** `manifest.webmanifest`, `sw.js`, `icons/` (Harley icons + `og-image.png` link preview). An install banner appears after 3 practised phrases (Android button, iPhone instructions).
- **Feedback:** footer "Send feedback" → Netlify form `feedback` (needs Forms detection on, like `waitlist`).
- **Harley explains (coach):** button under each result → `netlify/functions/coach.mjs` (Claude) writes a short tip in the interface language, with words in the learnt language wrapped in «» so the page reads them in the right accent (browser voices). `COACH_FREE_LIMIT` default 2 a day per device, `COACH_GLOBAL_LIMIT` default 1000 a day, optional `COACH_MODEL`.
- **Harley's voice:** `netlify/functions/tts.mjs` (Azure neural voices, same key as pronunciation). Coaching tips start with a "Woof woof!", tapped words and end-of-section barks ("Woof woof woof!" / "Woof woof!" / "Awww…") use the same voice; falls back to the phone's voices if Azure can't play. Pick the voice at `/voice.html`, then set `HARLEY_VOICE` (A–D, default A). Budget `TTS_DAILY_CHARS` (default 15000 a day), `TTS_IP_LIMIT` (default 200).
- **Lilou (coach option):** Harley's little cousin. Tap the little face next to the coach button to switch coach (saved per device). She has her own look (built from Harley's drawings: smaller, rose background, pink bow), personality (coach.mjs `persona: 'lilou'`) and voice (tts.mjs `LILOU_VOICE` L1–L4, default L1; "Yip yip!").
- **Dutch to learn:** 100 phrases + Past tense pack (phrases.js `nl`), Assess me passage, Azure nl-NL scoring and voices.
- **Extra interface languages:** Polish, Romanian, Ukrainian, Chinese (Simplified), Arabic (right-to-left), Dutch, Turkish, Japanese, Korean, Vietnamese — one file each in `i18n/`, loaded only when chosen (or when it's the browser language). Each has the full interface, meanings for the English phrases, and can be typed in "My phrase" (translated by Claude). AI-translated: get native speakers to check.

## Privacy, terms and data retention
- `privacy.html` and `terms.html` (styled by `legal.css`), linked in the footer with an "adults 18+" line (keys `lg_priv`, `lg_terms`, `lg_adult` in all 16 interface languages). The pages themselves are English only.
- The Inter font is self-hosted in `fonts/` (SIL OFL), so no visitor data goes to Google Fonts.
- `netlify/functions/cleanup.mjs` is a daily scheduled function that deletes daily-allowance counters (hashed device and IP codes) older than 7 days, as the privacy policy says.
- If you change the Azure region from the UK, or add a new provider, update the table in `privacy.html`.

## Optional sign-in (progress across devices)
- `account.js` adds a "👤 Sign in" button in the header. People sign in with their email and a 6-digit code (or the link in the email). No password. The app still works fully without signing in.
- Synced: best scores, Assess me history, and settings (languages, coach). Not synced: device ID and daily allowances. On sign-in the device and the account are merged (best score wins).
- Backend: Supabase (Auth + one `progress` table with row-level security). Run `supabase/setup.sql` once in the Supabase SQL editor.
- Netlify environment variables: `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY` (public by design), and `SUPABASE_SECRET_KEY` (mark as secret; used only by `delete-account.mjs` and the stats count). The button stays hidden until the first two are set.
- In Supabase → Authentication → Emails, the "Magic link" template must include `{{ .Token }}` so people get a code. Set custom SMTP (e.g. Google Workspace) because Supabase's built-in email sender is heavily rate-limited.
- `delete-account.mjs` lets people delete their account (and saved progress) from the sign-in panel. The stats page shows the number of accounts.
- Library: `vendor/supabase-2.119.2.min.js` (MIT), loaded only when someone signs in or is signed in.

## Free library: 40 phrases per topic
- All 9 learning languages now have 40 phrases in each free topic (Basics, Café & restaurant, Travel, Tricky sounds) and in the Past tense pack. The second 20 are appended at the end of `phrases.js`.
- Meanings for the new English Basics/Café/Travel phrases are in all 15 other interface languages (`SIR_MEANINGS`, appended to `i18n.js` and `i18n/*.js`).
- French, Italian, German, Portuguese and Dutch also have 40 per topic (second batch appended after the first).
- Premium copy now says "five times the free library".

## Lesson mode
- `lesson.js`: tapping a topic or focus pack opens a full-screen, colour-coded lesson (one phrase at a time, big animated Harley/Lilou, progress bar, swipe left/right or Next/Back). It reuses the normal practice card, so scoring, coaching and "Each sound" are unchanged.
- Every 10 phrases a round summary shows that round's score (this session's attempts), stars, Harley's reaction and the weakest phrases, with Continue / Practise again. After the last round the full topic summary appears.
- Close with ✕, Esc or the phone's Back button. "▶ Start lesson" on the normal card re-enters. Stats events: `lesson`, `lesson_round`. Strings `ls_*` in all 16 languages.

## Harley's Games (`/games/`)
- Word games at `harleysays.com/games/`, a separate front door with its own look, same repo and same Netlify site. `games.harleysays.com` redirects there (see `netlify.toml`).
- `games/index.html` (page and styles), `games/games.js` (Word search, Crossword, Match pairs, Unscramble), `games/words.js` (11 topics, 20–30 words each, 286 in all: one row per word with all learning languages and the meanings for every interface language; present and past tense rows use `infinitive>answer[>frame]`). `HG_SWAP` holds Latin American Spanish and US English swaps.
- Difficulty (`hs_games_level`): Easy / Medium / Hard.
  - Word search: 6 / 8 / 10 words; across and down only / plus diagonals / plus backwards.
  - Crossword: 6 / 8 / 11 words; Easy shows each word's first letter; Hard hides word lengths and doesn't mark letters red (just says how many are wrong).
  - Match pairs: 5 / 6 / 8 pairs. Unscramble: 6 / 8 / 10 words; Easy gives the first letter; Hard adds 2 decoy letters and has no hint.
- Shares the learning language with the pronunciation app (`sir_lang`), so switching between them keeps the language. Game progress is kept on the device (`hs_games`), not synced to accounts yet.
- Cross-links both ways: games → "Try Harley Says" (`/?from=games`); app → "Harley's word games" card and footer link (strings `gm_*`, in en/es/fr/it/de/pt; other interface languages show English).
- Interface in all 16 Harley Says interface languages (`games/i18n.js`: `HG_UI` screen text, `HG_GLOSS` word meanings in words.js order). Shares the "I speak" choice with the app (`sir_ui`). Clues show the meaning in the visitor's language; English learners get the meaning in their language plus a short English definition (English only if they speak English). AI-translated: get native speakers to check. Stats events: `games`, `game_start`, `game_done`.
- To switch on `games.harleysays.com`: Netlify → Domain management → Add domain alias `games.harleysays.com`, then add the DNS record Netlify shows.
- **Daily puzzle** (`#daily`): one a day per learning language, the same for everyone (seeded from the date). The game type rotates (crossword, word search, unscramble, match pairs), the topic is picked by the date, and the level is always Medium. Streaks are kept on the device (`hs_daily`: last day, streak, best); finishing shows the streak and a Share button (phone share sheet, or copy). Stats events: `daily_start`, `daily_done`.
- **Sign-in on the games page:** the same 👤 button and email-code dialog as the app (`account.js`, text in `games/acc-i18n.js`, copied from the app's strings). Synced to the account as well as the app data: `hs_games` (games played, higher count wins), `hs_daily` (streak: most recent day wins, best is the max), `hs_games_level`, `hs_games_topic`. No database change needed. After a daily puzzle, people who aren't signed in get a "Save your progress" button.

## Harley Chats (💬 Chats section)
- **Private beta:** only signed-in accounts listed in `CHAT_BETA_EMAILS` (comma-separated; default `neil@harleysays.com`) see the Chats button and can use the function; the server checks the sign-in token with Supabase. Set `CHAT_BETA_EMAILS` to `*` to open it to everyone.
- Spoken role-play conversations: Harley (or Lilou) plays the barista, waiter, receptionist, neighbour etc.; the learner answers out loud (browser speech recognition) or types. After every reply there's a short tip (great / good / try this), a "more natural" version, and a suggested next reply. At the end: score /100, stars, a summary and up to 3 phrases to practise (the Practise button opens them in "My phrase").
- **Hands-free (default):** Harley's line plays (own audio element so we know when it ends), then the mic opens by itself; the reply is sent after 1.8 s of quiet (`PAUSE_MS`), and if nothing is said for 9 s (`WAIT_MS`) it stops and waits for a tap. Tips are kept for the end: the summary lists every reply with its tip and a more natural version. Switches on the scene list: hands-free on/off (`hs_chat_auto`) and "Show tips after each reply" (`hs_chat_live`). When the scene ends, the summary opens automatically. Switching tab stops the mic.
- Front end: `chat.js` (scenes, levels Easy/Normal/Challenging, chat log, summary; strings `ch_*` and `g_chats` in `i18n.js` for en/es/fr/it/de/pt, other interface languages show English, but Harley's feedback is written in all 16).
- Back end: `netlify/functions/chat.mjs` (Claude). Stateless: the page sends the conversation each time; scenes are fixed on the server. 8 scenes in the app (`cafe`, `restaurant`, `directions`, `shop`, `hotel`, `pharmacy`, `neighbour`, `party`) plus `interview`, kept for the coming Interview Coach (`/interview`).
- Harley speaks his lines in his Azure voice via `tts.mjs` `kind:'line'` (whole sentence in the learnt language, no bark), falling back to the phone's voices.
- Uses `ANTHROPIC_API_KEY` (already set). Optional: `CHAT_MODEL` (default `claude-haiku-5-5`, for speed), `CHAT_FREE_LIMIT` new chats per device per day (default 2), `CHAT_TURNS` replies per chat (default 8), `CHAT_IP_LIMIT` (default 120 calls), `CHAT_GLOBAL_LIMIT` (default 3000 calls a day across everyone).
- Phrases to practise are kept on the device (`hs_chat_review`, last 30) for the planned Daily 5.
- Stats events: `chat_start`, `chat_turn`, `chat_done`. Daily counters (store `chat-usage`) are deleted after 7 days by `cleanup.mjs`.
