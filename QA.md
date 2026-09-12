# Prototype verification

Verified on 2026-09-11 in the local Windows development environment.

## Automated checks

- `npm run typecheck`: passes strict TypeScript.
- `npm test`: all 11 tests pass, including content graph integrity and corrupt/blocked storage behavior.
- `npm run lint`: passes with no warnings or errors.
- `npm run build`: produces a static `out/` export.
- `git diff --check`: no whitespace errors.

## Browser checks performed

| Flow                                       | Observed result                                                                                                                   |
| ------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------- |
| Initial Discover                           | Real Hebrew content, loaded local cover art, RTL labels, topic controls, and mobile navigation                                    |
| Save, interesting, learning acknowledgment | State changes visibly; save/like/read state survives a full page reload                                                           |
| Saved                                      | Saved card appears; unsaving the last card produces the intended empty state                                                      |
| Topic filter                               | Money filter shows exactly five money cards                                                                                       |
| Load more                                  | First eight cards expand to sixteen on request                                                                                    |
| Reveal                                     | Explanatory content appears after the reveal action                                                                               |
| Quiz                                       | Correct/incorrect options and explanatory feedback appear; choices lock after answering                                           |
| Five-card session                          | Progress advances through all five cards and reaches the completion view                                                          |
| Session resume                             | Reload on step three restores step three; repeated reads do not inflate daily counts                                              |
| Audio demo                                 | Explicit silent-demo label; play/pause, +15 seconds, 1.25× speed, seek to end, replay from zero, close                            |
| Persistent mini-player                     | Player remains present after navigating from audio to another view                                                                |
| Audio related ideas                        | An episode's related card opens at its individual hash URL                                                                        |
| Browser Back                               | Returns from an individual idea to the audio collection                                                                           |
| Share sheet                                | Opens a labelled native dialog with visible copy/native-share choices                                                             |
| Clipboard sharing                          | Copy shows success feedback and the clipboard contains the expected `#idea/brain-shortcuts` link                                  |
| Manual copy                                | Expandable text fallback is available inside the share dialog                                                                     |
| Keyboard dismissal                         | Escape dismisses the share dialog                                                                                                 |
| Narrow phone                               | At 320 px, the document has no horizontal overflow; mini-player controls wrap without escaping the viewport                       |
| Typical phone                              | 390×844 visual checks for feed and audio layout, readable Hebrew, and fixed navigation                                            |
| Desktop                                    | Initial desktop composition visually reviewed; final 1440 px DOM check confirms desktop rails and no horizontal document overflow |
| Console                                    | No captured application warnings or errors at the end of the tested flows                                                         |

Temporary viewport overrides were cleared and the preview was returned to Discover. Browser QA uses real localStorage, so the preview browser may show the five learning acknowledgments created during session testing. A new browser profile starts at zero.

## Limits and follow-up

- Audio recordings are placeholders by design. Real MP3 decoding, background playback, interruptions, and autoplay restrictions need physical-device testing after a recording is supplied.
- Native operating-system share-sheet delivery was not completed. Copy and manual-copy paths were verified; no message was sent to another person.
- No full VoiceOver/TalkBack, physical Safari/iOS/Android, or 200% text enlargement audit has been performed.
- The final 1440 px screenshot capture was unavailable in the preview tool; desktop DOM/overflow was checked and the earlier desktop composition was visually inspected.
- Broken storage is tested through the storage boundary; cross-tab concurrent writes use last-write-wins and are not a synchronization guarantee.
- External sources have linked attribution; publication-level factual and Hebrew editorial review remains a documented next experiment.

This is a functional product prototype, not a production accessibility, security, or scientific-content certification.

## Linux production interaction gate — 2026-09-11

- Added `npm run test:e2e`, a Playwright/Chromium smoke test against the already-running static production export.
- At a 390×844 viewport it physically clicks Save, verifies visible feedback and persisted state after reload, switches to the Money filter, expands the feed from 8 to 16 cards, opens Sessions, checks for page errors, and confirms `scrollWidth === clientWidth === 390`.
- The first automated run and the post-build run both passed. The post-build run completed 1 explicitly numbered E2E test with no page errors; the existing 11 Node tests, strict typecheck, ESLint, Prettier check, static build, and `git diff --check` also passed.
- Temporary storage diagnostics showed a live `useSyncExternalStore` subscriber and were removed before the final build. No application logic change was needed: deterministic Playwright clicks update both the rendered controls and local storage. Earlier accessibility-driver click results were inconsistent and are not treated as application evidence.
- The local production server remains `serve out --listen 3000`; HTTP root and every referenced client asset returned 200. User-environment verification should be repeated on the authorized HTTPS Vercel Preview, because the raw-IP HTTP preview is not a release-quality handoff.

## Vercel Preview and Production gate — 2026-09-12

- A first deployment investigation reproduced a platform-level 404. Vercel had created the new project with the `Other` preset, so the successful Next.js build was not routed as a Next.js deployment. This was isolated before changing application code.
- The project preset was corrected to `Next.js` with automatic build/output detection. A final Vercel dry run then reported the `nextjs` framework and confirmed that `.hermes/` and obsolete `.openai/` hosting metadata were absent from all 88 deployment inputs (including `.vercelignore` itself) via the new ignore rules.
- Preview `https://smartme-rega-ed1ukixb1-mataneshs-projects.vercel.app` reached Ready. Its root returned the real Hebrew app with HTTP 200; all eight referenced CSS/JavaScript assets returned HTTP 200 with non-HTML content types.
- The 390 px Playwright interaction gate passed against that exact Preview: 1 test, zero failures.
- The verified Preview was promoted to Production at `https://smartme-rega.vercel.app`. Independent root/asset checks passed there, followed by the same 390 px Playwright gate: 1 test, zero failures.
- Deployment protection is disabled only for this isolated public-demo project. No unrelated Vercel project, custom domain, or DNS record was changed.

## Mobile accessibility gate — 2026-09-12

- A deterministic baseline at 320 px and 390 px found two source-level accessibility defects: topic chips were fixed at 40 px high, card actions at 42 px, and closing the share dialog by button removed it before the browser could restore focus.
- Added `tests/mobile-accessibility.e2e.mjs` test-first. Both tests failed against the old production export for the expected target-size and focus-restoration reasons.
- The corrected export passes 3 explicitly numbered E2E tests: the existing interaction journey plus mobile target/overflow and keyboard/dialog-focus coverage.
- At both 320 px and 390 px, the tested discover controls are at least 44×44 px, the document remains exactly viewport width, `dir=rtl` and `lang=he` are present, reduced-motion rendering emits no browser errors, and the keyboard skip link moves focus to `main`.
- The share dialog initially focuses its close control and now restores focus to the originating Share button after button dismissal by using the native dialog close lifecycle. Textareas and disclosure summaries also receive the shared visible focus ring.
- Full-page evidence is generated in ignored local artifacts: `test-results/mobile-accessibility/discover-320.png` (310,920 bytes), `discover-390.png` (351,171 bytes), and `focus-restored-390.png` (59,598 bytes). The 320 px reflow check is the layout equivalent of viewing a 640 px CSS-width page at 200% browser zoom; physical-device text-only enlargement and VoiceOver/TalkBack remain separate follow-ups.
- Post-fix verification passed: 11 Node tests, strict TypeScript, ESLint, Prettier on the changed source/test files, a fresh Next.js static build, 3 E2E tests, HTTP 200 from the restarted `serve out` process, no browser console/page errors, and visual desktop inspection with no obvious clipping or layout regression.
