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

## Harley's Interview Coach (/interview/)
- Spoken mock job interviews: Harley (or Lilou) plays a hiring manager and asks 6 questions (`INTERVIEW_TURNS`) for the job the person types, in one of three styles: General, Competency (STAR) or Customer-facing, at Beginner/Intermediate/Advanced language level, in any of the 9 learning languages (default English).
- Same hands-free loop as Harley Chats (mic opens after each question; 2.5 s pause sends the answer; 12 s of nothing waits for a tap; typing allowed). Answers up to 2,200 characters (about 3 minutes of speech); if the phone stops listening by itself mid-answer, it carries on listening and keeps what was said. Feedback is on content (examples, STAR, relevance) and language; tips are kept for the end by default.
- Report: score /100, summary, strongest answer, the one thing to work on, every question with the answer given, its tip and a stronger version (tap to hear), and useful phrases.
- Files: `interview/index.html`, `interview/interview.js`, `interview/i18n.js` (16 interface languages, AI-translated). Sign-in uses `/account.js` with the text in `/games/acc-i18n.js`. Back end: `chat.mjs` scene `interview` with `job` and `itype`; the end-of-chat report (Chats and Interview Coach) uses `CHAT_REPORT_MODEL` (default `claude-sonnet-5-5`).
- Private beta: same `CHAT_BETA_EMAILS` list as Chats. The page has `noindex` while in beta: remove it at launch. Chats links to it; interview.harleysays.com redirects to it (add the subdomain in Netlify → Domain management, like games.harleysays.com).
- Stats events: `interview`, `iv_start`, `iv_answer`, `iv_done`.

## Free limits (Chats and Interview Coach)
- Free: **1 chat and 1 interview per person per day** (`CHAT_FREE_LIMIT`, `INTERVIEW_FREE_LIMIT`; set either to another number in Netlify). Counted per signed-in account and per device (both, so signing out or switching device doesn't reset it), with a backstop of `CHAT_IP_SESSIONS` (default 6) new sessions per connection per day.
- `CHAT_NOLIMIT_EMAILS` (default `neil@harleysays.com`): accounts with no daily limit, for testing now and Premium later.

## Daily 5 (daily5.js)
- Banner above the sections: five phrases a day, picked in this order: phrases from Harley Chats summaries not yet mastered (`hs_chat_review`, up to 3), phrases tried but under 80%, then new phrases from the free topics. Same five all day per language (`hs_d5`); new ones tomorrow.
- Practice uses the normal phrase card (set `DAILY5`), with the usual end-of-set summary. Done = all five tried today; streak = days in a row done (`hs_d5_streak`, kept on the device, not yet synced to accounts).
- Strings `d5_*` in en/es/fr/it/de/pt (others show English). Stats events `d5_start`, `d5_done`.

## Hands-free listening: pause setting and iPhone
- "Pause before sending": Short / Normal / Long (`hs_pause`, shared by Chats and Interview Coach) = 0.65× / 1× / 1.6× of the base pause (Chats 1.8 s, interviews 2.5 s).
- iPhone Safari often repeats the sentence so far in each new speech result; `joinResults` keeps the latest version instead of adding repeats.
- If the phone won't let the mic open by itself (no recent tap), there's no error: the button changes to a gently pulsing "Tap to answer" for the rest of that chat or interview.

## Talking heads and faster turns (Chats and Interview Coach)
- `talkhead.js` (`HSTalk`): a big animated Harley or Lilou head at the top of a chat or interview. The mouth moves in time with the words (timed from the text and the audio's progress, so no audio analysis is needed), the current word is highlighted in the caption, he blinks, and he looks different when listening (ears up, nodding), thinking (head tilt) and at the end (happy bounce). It also plays the audio: his voice from the server, the phone's voice as a fallback (synced with word events where the phone gives them), and short "mm-hm" acknowledgements in the learnt language (`ACKS`, fetched once per chat, cached) so a pause feels like listening.
- Faster turns: with tips at the end (the default), `chat.mjs` gets `tips: 'end'` and only writes Harley's next line (no feedback, max 500 tokens); the tips for every reply come in the end report (`turns`). `voice: true` makes `chat.mjs` send Harley's voice (base64 mp3) with the line, saving a second request. Default pauses are shorter: Chats 1.4 s, interviews 2.1 s (× the Short/Normal/Long setting).
- Voice code is shared in `netlify/lib/voice.mjs` (used by `tts.mjs` and `chat.mjs`); the audio requests are byte-for-byte the same as before, so the cache still works.
- Note: `TTS_DAILY_CHARS` (default 15,000 across everyone) also covers Chats and interviews, about 1,000-1,500 characters each. When it runs out, Harley falls back to the phone's voice for the rest of the day.

## Interview Coach: human interviewers
- The interviewer is a person, not Harley: an illustrated **man** or **woman** (picked on the setup screen, `hs_iv_who`, default man), drawn as SVG in `talkhead.js` (`humanSvg`) from the founders' photo. The photo itself is not in the repo. Same animation as the dogs (mouth with teeth and tongue, blinking, nodding), with calmer movement.
- Voices: `M` = Andrew, `W` = Emma (Azure multilingual, natural pitch) in `netlify/lib/voice.mjs`; change with `MAN_VOICE` / `WOMAN_VOICE` (any preset key).
- `chat.mjs` gets `persona: 'man'|'woman'`: the prompt plays a male or female hiring manager (a matching first name if they give one). The report is still written by Harley the coach.
