# רגע / SmartMe

A mobile-first Hebrew knowledge prototype: **turn mindless scrolling into interesting learning**. The working product name is **רגע**. This is a knowledge feed, not a book-summary library.

## Run locally

Requires Node.js 20.9 or newer (developed with Node 22) and npm.

```sh
npm ci
npm run dev
```

Open [localhost:3000](http://localhost:3000). No account, environment variables, API key, or backend is needed. For a phone on the same network, use the computer's LAN address and port 3000; the local firewall must permit it. Clipboard and native sharing depend on browser support and secure context; a manual copy fallback is provided.

To preview the optimized static build, stop the development server first:

```sh
npm run build
npm start
```

The `out/` directory contains the complete static app. `npm start` serves these files on port 3000. Nothing is deployed by these commands.

## Remote preview

The verified production release is [smartme-rega.vercel.app](https://smartme-rega.vercel.app). The release is hosted in the isolated Vercel project `smartme-rega`; it does not depend on the development computer remaining online and needs no backend or runtime secrets.

Vercel previews use generated deployment URLs. The release gate checks the exact Preview first, then promotes that verified build to Production. The hosted origin has its own localStorage, so saved ideas from localhost or another Preview do not transfer automatically. `.vercelignore` keeps local mission notes and obsolete hosting metadata out of deployment inputs.

## What works

- 40 original Hebrew mock cards, five in each of eight topics, covering ten formats.
- Discover feed with immediate topic switching, eight-card batches, quizzes, reveals, linked sources, save, interesting, and share actions.
- Saved ideas, likes, unique daily learning acknowledgments, and session progress stored in localStorage.
- Three five-card learning sessions with previous/next navigation, resume, completion, and replay.
- Three audio episodes with a mini-player that persists across views: play/pause, seek, skip 15 seconds, speed, and close.
- Native RTL layout, local Heebo fonts, mobile bottom navigation, responsive desktop rails, focus states, reduced motion, and empty/error states.
- Shareable hash links to individual ideas. Browser Back works between views.

**Audio is deliberately silent in this prototype.** Every demo is labelled `הדגמה · ללא קול`. Supplying an episode's `audioUrl` switches the player to a real HTML audio element. No audio is generated or fetched from a service.

## Useful links in the app

| View            | URL fragment            |
| --------------- | ----------------------- |
| Discover        | `#discover`             |
| Saved           | `#saved`                |
| Short sessions  | `#sessions`             |
| Brain session   | `#sessions/brain`       |
| Audio           | `#audio`                |
| Individual idea | `#idea/brain-shortcuts` |

## Edit content and audio

Content lives in `src/data/knowledge.ts` and `src/data/more-knowledge.ts`; episodes and sessions live in `src/data/collections.ts`. TypeScript objects are intentionally plain and JSON-compatible. Stable IDs link records together.

For a real recording, place an MP3 in `public/audio/`, then add `audioUrl: "/audio/atomic-habits.mp3"` to its episode. Update the description and nominal duration to match the actual recording. The player reads real metadata, handles media errors, and uses real media time. Review audio rights and content before distributing it. The upload interface and generation pipeline are future work.

The local storage key is `rega.progress.v1`. Removing just that key in your browser resets this prototype's saved ideas and progress. Nothing syncs between devices. If storage is blocked or full, the app keeps current interactions in memory and explains the limitation.

## Checks

```sh
npm run typecheck
npm test
npm run lint
npm run build
```

The browser interaction gate expects the static app to be running on port 3000. Install Chromium once, then run it in a second terminal:

```sh
npx playwright install chromium
npm start
# In another terminal:
npm run test:e2e
```

Set `E2E_BASE_URL=https://example.vercel.app` to verify an HTTPS deployment instead of localhost. The E2E gate uses a 390 px viewport and covers Save feedback/persistence, topic filtering, load-more, Sessions navigation, page errors, and horizontal overflow.

`npm run format` formats authored code and documentation. Tests cover content integrity, session references, corrupt storage, blocked storage, daily deduplication, date boundaries, and the bounded history. Browser verification is recorded in `QA.md`.

## Product and implementation notes

- [PRODUCT.md](PRODUCT.md): assumptions, intended experience, current tradeoffs.
- [ARCHITECTURE.md](ARCHITECTURE.md): component boundaries and eventual Supabase path.
- [CONTENT_MODEL.md](CONTENT_MODEL.md): schema, formats, sourcing, and editorial rules.
- [CONTENT_AUDIT.md](CONTENT_AUDIT.md): evidence-backed 40-card editorial and source audit.
- [MARKETING_READINESS.md](MARKETING_READINESS.md): Hebrew positioning, launch copy, FAQ/privacy language, screenshot and demo plans, and a measurable pilot.
- [TODO.md](TODO.md): focused next product experiments.

The cover illustration is an original AI-generated asset, served locally as a 67 KB WebP. Heebo is distributed by `@fontsource/heebo`; Lucide supplies the icons. Framework-generated `AGENTS.md` and `CLAUDE.md` retain the installed Next.js development guidance.
