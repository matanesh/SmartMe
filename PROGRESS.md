# Progress and session handoff

Updated: 2026-09-12 22:06 Asia/Jerusalem. Branch: `codex/hebrew-knowledge-prototype`.

## Current Status

The complete early prototype is implemented under the working Hebrew brand **רגע**. It includes 40 knowledge cards across eight topics and ten formats, topic filtering, saved/interesting/share actions, local daily acknowledgments, three five-card learning sessions, and three clearly labelled silent audio demos with a persistent mini-player.

The production static build, strict TypeScript check, ESLint, and all 11 targeted tests pass. Browser QA has verified mobile RTL at 390 px and 320 px, zero horizontal overflow at 320 px, save/like/read persistence after reload, quiz feedback, five-step completion, session resume after reload, audio pause, seek-to-end, 15-second skip, speed changes, and player persistence across views.

**The requested prototype is complete and has a verified Vercel release.** README, PRODUCT, ARCHITECTURE, CONTENT_MODEL, TODO, and the browser/automated verification record in `QA.md` are complete. Production is available at `https://smartme-rega.vercel.app`. A new session should still inspect live local process state before launching another server.

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

The first complete editorial/source audit is documented in `CONTENT_AUDIT.md`. Its first four-card correction batch and the three restricted-link replacements are complete. A second native-Hebrew reader remains the publication-level follow-up before expanding the corpus.

## Earlier remote preview checkpoint — 2026-09-11 (superseded)

- A Cloudflare Quick Tunnel was rejected by automatic policy review and was never started.
- A private Sites registration was explored but not completed as the release path. `.openai/hosting.json` remains a historical configuration artifact.
- The active verified release path is now the isolated Vercel project documented below. Do not create another Vercel project or resume the obsolete Sites publication workflow without a new product reason.

## Next Steps

1. Fetch the latest `codex/hebrew-knowledge-prototype` branch and inspect live worktree/process state before continuing.
2. Use `npm ci` if dependencies are absent. Check port 3000 before launching a local server.
3. Continue the weekend mission with the marketing-readiness package while the second native-Hebrew reading remains a human follow-up. Do not expand the corpus until that reading satisfies the audit gate.
4. For new feature requests, keep local fixtures and adapter boundaries until product evidence calls for persistence or identity. Do not introduce backend/auth infrastructure merely to continue this prototype.
5. Continue maintaining and pushing this handoff file at significant milestones. Do not merge the default branch without a request.

## Weekend mission cycle 1 — interaction reliability

- Verified live state rather than the older handoff claim: port 3000 is already serving the static `out/` build via `serve`, not `next dev`; root and all referenced CSS/JS assets returned HTTP 200.
- Investigated the reported non-working controls. Client hydration and normal `useState` navigation worked. Temporary progress-store diagnostics confirmed one active subscriber and one notification per write, then were removed. A deterministic Playwright browser at 390 px confirmed Save UI feedback, reload persistence, topic filtering, load-more, Sessions navigation, zero page errors, and zero horizontal overflow.
- Added `tests/interaction.e2e.mjs`, `npm run test:e2e`, and a direct Playwright dev dependency so this critical path is repeatable instead of relying on a manual browser claim.
- Verified: 11 Node tests pass; strict typecheck passes; ESLint passes; Prettier check passes; Next.js 16.3.4 static production build passes; 1 Playwright E2E test passes; `git diff --check` passes.
- No application behavior was changed because the deterministic browser test did not reproduce an application fault. Earlier accessibility-driver clicks were inconsistent and are not accepted as product evidence. The remaining user-environment check belongs on the authorized HTTPS Vercel Preview.
- Exact next action: create a new or safely isolated Vercel Preview from this verified branch, record its URL/project identity without secrets, then run the same E2E test and HTTP checks against that URL before any Production promotion.

## Weekend mission cycle 2 — verified Vercel release

- Created the isolated Vercel project `smartme-rega`; the two unrelated existing projects were inventoried and left unchanged.
- Reproduced an initial platform 404 and traced it to the project's automatically selected `Other` framework preset, not application behavior. Corrected only this project to the `Next.js` preset with automatic build/output detection.
- Added `.vercelignore` after a dry run proved local mission and legacy hosting metadata would otherwise be uploaded. The final dry run reported framework `nextjs`, 88 inputs (including `.vercelignore` itself), and no `.hermes/` or `.openai/` files.
- Verified Preview: `https://smartme-rega-ed1ukixb1-mataneshs-projects.vercel.app`. Root plus all eight CSS/JavaScript assets returned HTTP 200; the 390 px Playwright interaction test passed.
- Promoted that verified build. Production: `https://smartme-rega.vercel.app`. Root plus all eight assets returned HTTP 200; the same 390 px Playwright interaction test passed with zero failures.
- No custom domain, DNS, unrelated deployment, backend, secret, or user data was changed.
- Exact next action: begin the mobile RTL/accessibility workstream with a focused 320/390 px audit, including 200% text and keyboard/focus evidence; avoid repeating the unchanged deployment gate.

## Weekend mission cycle 3 — mobile targets and dialog focus

- Reproduced two concrete accessibility defects against the live production export before changing code: visible topic controls were 40 px high, card actions were 42 px high, and closing Share by its close button left focus on `body`.
- Added a regression suite first and observed 2/2 expected failures. The implementation now gives discover controls a 44 px minimum target, closes Share through the native dialog lifecycle so focus returns to its trigger, and extends the visible focus ring to textarea/disclosure controls.
- `npm run test:e2e` now discovers all E2E files. It passes 3/3 tests across the existing critical journey and new 320/390 px RTL, overflow, reduced-motion, touch-target, skip-link, initial-dialog-focus, and focus-restoration checks.
- The 320 px reflow result is equivalent to a 640 px CSS-width layout viewed at 200% browser zoom. Physical-device text-only enlargement and VoiceOver/TalkBack remain explicitly unverified.
- Fresh verification passed: 11 Node tests, strict typecheck, ESLint, changed-file Prettier, static Next.js build, 3 E2E tests, browser console/page-error audit, and HTTP 200 from the restarted static server. Screenshot evidence remains local under ignored `test-results/mobile-accessibility/`.
- Exact next action: continue the bounded mobile accessibility audit through Sessions, Audio, the active mini-player, and the expanded Share sheet at 320/390 px; test their target sizes, scrollability, focus behavior, and overflow before broader visual polish.

## Weekend mission cycle 4 — Sessions, Audio, player, and Share accessibility

- Extended the deterministic mobile gate through the Sessions list/reader, expanded Share dialog, Audio library, related-idea disclosure, and active mini-player at both 320 px and 390 px.
- TDD RED isolated explicit source constraints rather than a generic layout fault: session back controls were 42 px high; episode play controls were 42 px; episode/share disclosures were 30 px or below the 44 px target; and mobile player controls were narrowed to 27–38 px with a 42 px rate control.
- The minimal CSS correction preserves native disclosure markers, makes the affected controls at least 44×44 px, and gives the player title its own row so five enlarged controls fit without overlap on a 320 px viewport.
- The new E2E journey proves no document overflow or horizontally escaped controls; 44 px targets; forced short-viewport Share scrolling; visible textarea recovery; Escape and backdrop dismissal with focus restoration; player/title/control non-overlap; and separation between the fixed player and bottom navigation.
- Verified: 11/11 Node tests, strict TypeScript, ESLint, Prettier, `git diff --check`, a fresh Next.js 16.3.4 static build, and 4/4 Playwright E2E tests. Local root remained HTTP 200. The 320 px player screenshot was visually inspected with no clipping or player/navigation collision; ignored evidence is in `test-results/mobile-accessibility/audio-player-{320,390}.png`.
- Independent review found and prompted correction of overbroad test wording, an unproven backdrop point, loss of the native disclosure marker, and a weak dialog-scroll assertion. The final review passed with no security or logic blockers.
- Exact next action: audit the 40-card corpus for Hebrew quality, duplication, source fidelity, citation validity, and weak hooks; preserve source URLs and write an evidence-backed editorial verdict before expanding content.

## Weekend mission cycle 5 — 40-card editorial and source audit

- Audited the live 40-card TypeScript corpus before changing any content. The inventory proves eight balanced five-card topics, all ten formats, 21 externally sourced cards, 19 explicitly editorial cards, and 18 unique source URLs.
- Checked all 18 unique URLs with redirects: 12 returned HTTP 200 and six reached a valid destination that restricted the automated client with HTTP 403. All six DOI records were independently resolved through Crossref; publisher restrictions were not mislabeled as broken links.
- Preserved claim-level evidence for key sources including the Tversky/Kahneman abstracts, NIST PDF, NASA Venus/Sun/Moon pages, CERN, and St Andrews. The audit explicitly separates verified source support from metadata-only or human-browser follow-up.
- Added `CONTENT_AUDIT.md` (40/40 card matrix, quantitative balance, duplicate analysis, source availability, verdict, and ordered acceptance gate) and linked it from README.
- Verdict: continue, but do not expand yet. First correct the overly broad `ai-training` citation, manually inspect Smithsonian/British Museum/USGS, replace the overlapping `history-web` and weak `habit-quote` cards, and sharpen the `career-decisions` hook.
- Verification: deterministic inventory represented all 40 IDs exactly; 52.5% external-source coverage; no repeated exact eight-word sequence across cards; 11/11 existing Node tests passed; Prettier and `git diff --check` passed; the unchanged local static app remained HTTP 200. No production code, Vercel project, or deployment was changed.
- Review scope: documentation-only, so the independent code-review gate is not applicable. The complete diff was reviewed for unsupported claims, public-repository privacy, secrets, and accidental scope expansion.
- Exact next action: use TDD to correct only the first evidence-backed editorial batch (`ai-training`, `history-web`, `habit-quote`, `career-decisions`), preserving stable IDs and adding content-contract assertions before copy changes; keep the three restricted institutional sources as a separate human-browser verification task.

## Weekend mission cycle 6 — first editorial correction batch

- Verified current source evidence before editing: Hugging Face documents external retrieval and index updates without model retraining; NASA documents Apollo 11's launch date and free-return trajectory. Both pages returned HTTP 200.
- TDD RED/GREEN covered four audited records. The app keeps all stable IDs and 40 cards while replacing the broad `ai-training` source, duplicate CERN story, repetitive `habit-quote`, and vague `career-decisions` hook.
- The static production export was rebuilt and restarted on port 3000. A dedicated 390 px browser journey rendered all four revised cards, asserted both source destinations, found no horizontal overflow or escaped card, and captured no console/page errors.
- Verified: 15/15 Node tests, strict TypeScript, ESLint, Prettier, `git diff --check`, a fresh Next.js 16.3.4 static build, and 4/4 Playwright E2E tests. Local screenshot evidence is ignored at `test-results/mobile-accessibility/editorial-history-390.png`.
- Exact next action: manually open and verify the Smithsonian octopus, British Museum Rosetta Stone, and USGS map-projection claims in a real browser; replace only a source that cannot support its exact claim. Do not expand the corpus yet.

## Weekend mission cycle 7 — accessible sources for three verified claims

- Reproduced the access issue in a real browser before changing data: Smithsonian Ocean and British Museum required Cloudflare verification, while the USGS landing page returned a CloudFront 403.
- Replaced only the reader-facing source labels and URLs. Natural History Museum supports the octopus anatomy claim; World History Encyclopedia supports the Rosetta Stone decree/three-script claim; the accessible USGS Professional Paper 1395 landing page links the authoritative manual supporting projection distortion, conformality/local angles, and Mercator. Card text, stable IDs, count, sessions, and audio references are unchanged.
- TDD RED/GREEN added three source contracts: 3/3 failed on the old restricted URLs, then 3/3 passed after the minimal replacements.
- The rebuilt static app passed a dedicated 390×844 browser journey for all three exact source links, RTL metadata, no overflow, and no console/page errors. The history-map card was also visually inspected without clipping, overlap, broken labels, or obvious layout regression.
- Verified: 18/18 Node tests, strict TypeScript, ESLint, Prettier, `git diff --check`, a fresh Next.js 16.3.4 static build, 4/4 Playwright E2E tests, and local HTTP 200 (47,688 bytes).
- Exact next action: prepare the bounded marketing-readiness package (positioning, launch copy, FAQ/privacy, screenshot/demo plan, organic launch plan, measurable pilot) without publishing or contacting users. Keep corpus expansion blocked on a second native-Hebrew reading.

## Persistent user instruction

At significant milestones, completion, or before context/rate limits: update this file with current status, decisions, changed files, pending issues, and exact next steps. After verifying consistency, commit it (including relevant task changes) with `docs: update PROGRESS.md for session handoff` and run `git push origin HEAD`. Verify that the push succeeds. The user explicitly authorized this GitHub synchronization on 2026-09-11. Do not merge to the default branch without a request.
