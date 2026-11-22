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
- `DEEPL_API_KEY` (DeepL API Free works; key ends in `:fx`)
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
- **Spend safety net:** `AI_ASSESS_GLOBAL_LIMIT` (default 300 a day across everyone) on Claude assessments. Azure Free F0 and DeepL Free stop at their quotas rather than charging; if Azure stops, the main button falls back to the quick browser check.
- **Installable:** `manifest.webmanifest`, `sw.js`, `icons/` (Harley icons + `og-image.png` link preview). An install banner appears after 3 practised phrases (Android button, iPhone instructions).
- **Feedback:** footer "Send feedback" → Netlify form `feedback` (needs Forms detection on, like `waitlist`).
- **Harley explains (coach):** button under each result → `netlify/functions/coach.mjs` (Claude) writes a short tip in the interface language, with words in the learnt language wrapped in «» so the page reads them in the right accent (browser voices). `COACH_FREE_LIMIT` default 2 a day per device, `COACH_GLOBAL_LIMIT` default 1000 a day, optional `COACH_MODEL`.
- **Harley's voice:** `netlify/functions/tts.mjs` (Azure neural voices, same key as pronunciation). Coaching tips start with a "Woof woof!", tapped words and end-of-section barks ("Woof woof woof!" / "Woof woof!" / "Awww…") use the same voice; falls back to the phone's voices if Azure can't play. Pick the voice at `/voice.html`, then set `HARLEY_VOICE` (A–D, default A). Budget `TTS_DAILY_CHARS` (default 15000 a day), `TTS_IP_LIMIT` (default 200).
- **Lilou (coach option):** Harley's little cousin. Tap the little face next to the coach button to switch coach (saved per device). She has her own look (built from Harley's drawings: smaller, rose background, pink bow), personality (coach.mjs `persona: 'lilou'`) and voice (tts.mjs `LILOU_VOICE` L1–L4, default L1; "Yip yip!").
