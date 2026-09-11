# Progress and session handoff

Updated: 2026-09-11. Branch: `codex/hebrew-knowledge-prototype`.

## Current Status

The complete early prototype is implemented under the working Hebrew brand **רגע**. It includes 40 knowledge cards across eight topics and ten formats, topic filtering, saved/interesting/share actions, local daily acknowledgments, three five-card learning sessions, and three clearly labelled silent audio demos with a persistent mini-player.

The production static build, strict TypeScript check, ESLint, and all 11 targeted tests pass. Browser QA has verified mobile RTL at 390 px and 320 px, zero horizontal overflow at 320 px, save/like/read persistence after reload, quiz feedback, five-step completion, session resume after reload, audio pause, seek-to-end, 15-second skip, speed changes, and player persistence across views.

**The requested prototype is complete.** README, PRODUCT, ARCHITECTURE, CONTENT_MODEL, TODO, and the browser/automated verification record in `QA.md` are complete. Development preview is running at `http://localhost:3000` in the current environment; a new session should check the URL before launching another server.

Final browser checks also passed for topic switching, load-more from eight to sixteen cards, unsaving into an empty collection, audio replay from zero and close, direct idea navigation, browser Back, explicit clipboard sharing (including the exact idea link), manual copy availability, and Escape dismissal of the share dialog. The final desktop DOM check at 1440 px confirms desktop rails and no horizontal overflow. The preview is back on Discover with viewport overrides cleared. No captured application warnings/errors remained. The final production build passes after the sharing refinement.

## Architectural Decisions

- Next.js App Router + strict TypeScript + Tailwind v4, exported as static files in `out/`. No backend, authentication, database, API keys, or deployed infrastructure.
- Single client shell with hash navigation (`#discover`, `#saved`, `#sessions`, `#sessions/brain`, `#audio`, `#idea/<id>`); this supports static hosting, browser history, and idea links without extra routing infrastructure.
- Local content behind `contentRepository`; progress behind a versioned storage adapter and `useSyncExternalStore`. Future Supabase work should replace these boundaries and introduce deliberate async handling, not rewrite the card UI.
- Storage key `rega.progress.v1`; saved/liked IDs, unique reads per local calendar date, session positions. Corrupt data recovers safely; blocked storage falls back to memory. History is bounded to 30 dates.
- No fake engagement counts. Learning acknowledgments require a user action and deduplicate per idea/day.
- Audio without `audioUrl` is a labelled silent simulation. Adding a real MP3 URL switches to an HTML audio element. Real recordings are not part of this prototype.
- Sharing uses a native HTML dialog with copy, an optional OS-share action, and expandable text for manual copying. This provides explicit feedback even when the preview/browser cannot open the OS share sheet reliably. The dialog supplies modal focus handling and Escape dismissal.
- Local Heebo fonts, a 67 KB original glass-brain WebP, native RTL spacing, mobile bottom navigation, and desktop discovery rails.

## Modified Files

- `src/app/`: layout, static entry point, metadata, RTL, design system, responsive styling.
- `src/components/`: shared card, navigation, sidebar, session reader, audio library, mini-player, application shell.
- `src/hooks/`: progress, hash routing, and audio state.
- `src/data/`: 40 Hebrew fixtures and session/audio collections.
- `src/lib/`: models, content repository, progress rules, storage boundary.
- `tests/`: content integrity, persistence, local date handling, blocked/corrupt storage.
- `public/`: favicon and optimized original editorial image.
- Package/config files, formatter configuration, and framework-generated agent guidance.
- `README.md`, `PRODUCT.md`, `ARCHITECTURE.md`, `CONTENT_MODEL.md`, `TODO.md`, `QA.md`, and this handoff.

## Blockers / Pending Issues

No implementation blockers or unfinished requested features. The following are documented limits of this prototype, not requirements to build production infrastructure: real MP3 playback, physical iOS/Android QA, 200% text enlargement, a full screen-reader audit, and native OS share-sheet delivery remain follow-ups. The final 1440 px screenshot capture was unavailable in the preview tool; desktop DOM/overflow was checked and the earlier desktop composition was visually inspected.

The prototype is local. Localhost share URLs are not public URLs. Source-based cards have citations and original prose, but a publication-level Hebrew/source review remains a product experiment.

## Next Steps

1. Fetch the latest `codex/hebrew-knowledge-prototype` branch from origin and inspect working-tree state before continuing in another environment. The initial complete checkpoint was successfully pushed at `2b3a013`; this completion handoff must be pushed immediately as instructed below.
2. Use `npm ci` if dependencies are absent. Check `http://localhost:3000` before starting `npm run dev`; this session leaves its preview running.
3. Read `PRODUCT.md`, `TODO.md`, and `QA.md`. The next product step is a short trial with native Hebrew readers, followed by one real Hebrew MP3 when the user wants to test audio content.
4. For new feature requests, keep local fixtures and adapter boundaries until product evidence calls for persistence or identity. Do not introduce backend/auth infrastructure merely to continue this prototype.
5. Continue maintaining and pushing this handoff file at significant milestones. No default-branch merge or deployment has been requested.

## Persistent user instruction

At significant milestones, completion, or before context/rate limits: update this file with current status, decisions, changed files, pending issues, and exact next steps. After verifying consistency, commit it (including relevant task changes) with `docs: update PROGRESS.md for session handoff` and run `git push origin HEAD`. Verify that the push succeeds. The user explicitly authorized this GitHub synchronization on 2026-09-11. Do not merge to the default branch without a request.
