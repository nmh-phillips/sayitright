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
