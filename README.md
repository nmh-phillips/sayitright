# SayItRight

Pronunciation practice web app. Pick a language (English, Spanish, French, Italian, German, Portuguese), listen to a phrase, say it, and get a score with word-by-word feedback.

- Single static page: `index.html` (no build step)
- Uses the browser's built-in speech recognition and text-to-speech
- Works in Chrome, Edge and Safari (incl. iPhone); must be served over https
- Scores are stored locally on the device (localStorage)

## Deploy
Netlify → Add new site → Import from Git → this repo. Build command: none. Publish directory: `/`.
