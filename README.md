# Brian Shayne Onyoni — Portfolio

Personal portfolio site, built with React + Vite. Themed around traceroute
and circuit-board routing as a nod to a background in network engineering.

## Running locally

```bash
npm install
npm run dev
```

Open the printed local URL (usually http://localhost:5173).

## Editing content

Almost everything lives in `src/App.jsx`:

- `TRACE_ROWS` — the traceroute-style nav in the hero
- `SKILLS` — the "routing table" skills section
- `PROJECTS` — project cards (update links/status as you ship real projects)
- `LOG_ENTRIES` — work experience
- `CERTS` — certifications
- Contact details near the bottom (email, phone, GitHub, location)

Colors, fonts, and spacing live in `src/index.css` (see the `:root`
variables at the top for the palette).

## Deploying (free)

### Option A: Vercel
1. Push this folder to a new GitHub repository.
2. Go to https://vercel.com, sign in with GitHub, and click "New Project".
3. Select the repo. Vercel auto-detects Vite — leave the default build
   settings (`npm run build`, output directory `dist`).
4. Click Deploy. You'll get a live `*.vercel.app` URL.

### Option B: Netlify
1. Push this folder to a new GitHub repository.
2. Go to https://netlify.com, sign in with GitHub, and click "Add new site"
   then "Import an existing project".
3. Select the repo. Build command: `npm run build`. Publish directory: `dist`.
4. Click Deploy. You'll get a live `*.netlify.app` URL.

### Option C: Drag-and-drop (no GitHub needed)
1. Run `npm run build` locally — this creates a `dist/` folder.
2. Go to https://app.netlify.com/drop and drag the `dist/` folder in.

Once live, add the URL to your CV and to the "This portfolio" project card
in `src/App.jsx`.
