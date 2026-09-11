# Progress and session handoff

Updated: 2026-09-11. Branch: `codex/hebrew-knowledge-prototype`.

## Current Status

The complete early prototype is implemented under the working Hebrew brand **רגע**. It includes 40 knowledge cards across eight topics and ten formats, topic filtering, saved/interesting/share actions, local daily acknowledgments, three five-card learning sessions, and three clearly labelled silent audio demos with a persistent mini-player.

The production static build, strict TypeScript check, ESLint, and all 11 targeted tests pass. Browser QA has verified mobile RTL at 390 px and 320 px, zero horizontal overflow at 320 px, save/like/read persistence after reload, quiz feedback, five-step completion, session resume after reload, audio pause, seek-to-end, 15-second skip, speed changes, and player persistence across views.

The required README, PRODUCT, ARCHITECTURE, CONTENT_MODEL, and TODO documents are written. Final browser checks and a QA record remain before the final handoff. Development preview is running at `http://localhost:3000` in the current environment; a new session should check the URL before launching another server.

## Architectural Decisions

- Next.js App Router + strict TypeScript + Tailwind v4, exported as static files in `out/`. No backend, authentication, database, API keys, or deployed infrastructure.
- Single client shell with hash navigation (`#discover`, `#saved`, `#sessions`, `#sessions/brain`, `#audio`, `#idea/<id>`); this supports static hosting, browser history, and idea links without extra routing infrastructure.
- Local content behind `contentRepository`; progress behind a versioned storage adapter and `useSyncExternalStore`. Future Supabase work should replace these boundaries and introduce deliberate async handling, not rewrite the card UI.
- Storage key `rega.progress.v1`; saved/liked IDs, unique reads per local calendar date, session positions. Corrupt data recovers safely; blocked storage falls back to memory. History is bounded to 30 dates.
- No fake engagement counts. Learning acknowledgments require a user action and deduplicate per idea/day.
- Audio without `audioUrl` is a labelled silent simulation. Adding a real MP3 URL switches to an HTML audio element. Real recordings are not part of this prototype.
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
- `README.md`, `PRODUCT.md`, `ARCHITECTURE.md`, `CONTENT_MODEL.md`, `TODO.md`, and this handoff.

## Blockers / Pending Issues

No implementation blocker. Final browser verification still needs: demo restart/close, sharing fallback, topic switching and load-more, empty Saved after unsave, and final desktop screenshot/console check. Do not claim real MP3 playback, physical iOS/Android QA, or a full screen-reader audit has been completed. Native share-sheet delivery is outside the current test scope.

The prototype is local. Localhost share URLs are not public URLs. Source-based cards have citations and original prose, but a publication-level Hebrew/source review remains a product experiment.

## Next Steps

1. Continue the remaining browser checks against the existing local preview. Use browser UI tools for interactions, and keep the current player demo visibly labelled.
2. Fix only issues found; rerun checks if implementation changes.
3. Write `QA.md` with actual verified flows and limits. Restore preview to Discover and clear temporary viewport overrides.
4. Update this file to completed status, commit with `docs: update PROGRESS.md for session handoff`, and immediately push `origin HEAD` again.
5. Verify the remote branch matches local HEAD, then provide the user the local preview, branch link, concise feature summary, and audio limitation.

## Persistent user instruction

At significant milestones, completion, or before context/rate limits: update this file with current status, decisions, changed files, pending issues, and exact next steps. After verifying consistency, commit it (including relevant task changes) with `docs: update PROGRESS.md for session handoff` and run `git push origin HEAD`. Verify that the push succeeds. The user explicitly authorized this GitHub synchronization on 2026-09-11. Do not merge to the default branch without a request.
