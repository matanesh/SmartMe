# SmartMe / רגע — state summary for a new session

- Updated: 2026-09-13 10:47 Asia/Jerusalem
- Branch: `codex/hebrew-knowledge-prototype`
- Release: [smartme-rega.vercel.app](https://smartme-rega.vercel.app)

## Mission and outcome

The weekend mission turned the Hebrew micro-learning prototype **רגע** into a verified mobile-first release candidate for user testing. The bounded product scope is complete: interaction reliability, an isolated Vercel release, mobile RTL/accessibility improvements, an evidence-backed content audit and correction pass, a marketing-readiness package, and six local screenshot candidates.

The project remains intentionally simple: a static Next.js export with local fixtures and device-local progress. There is no backend, account system, analytics collection, payment flow, recommendation model, or real user data.

## What is delivered

- 40 Hebrew cards across eight topics and ten formats, with source links where claims depend on external evidence.
- Discover, topic filters, load-more, Saved, Interesting, sharing, acknowledgments, quizzes, reveals, direct idea links, and browser history.
- Three resumable five-card sessions and three clearly labelled silent audio demonstrations with a persistent mini-player.
- Mobile RTL layouts at 320 px and 390 px, 44 px targets for the audited controls, reduced-motion behavior, keyboard skip/focus handling, and accessible Share-dialog dismissal.
- `CONTENT_AUDIT.md`: a 40/40 editorial and source review, including the completed correction batches.
- `MARKETING_READINESS.md`: positioning, launch/store copy, FAQ/privacy language, screenshot plan, demo script, and a measurable eight-person pilot.
- Six 390×844 screenshot candidates plus full-page sources and a contact sheet under ignored local `test-results/marketing-screenshots/`. These assets were not published or committed.

## Evidence matrix

| Area                   | Verified evidence                                                                                                                    | Current status                               |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------- |
| Unit/content contracts | 19 explicitly numbered Node tests passed in the last source-changing release gate                                                    | Passing at release commit                    |
| Type and lint          | Strict TypeScript and ESLint passed in the last source-changing release gate                                                         | Passing at release commit                    |
| Production build       | Next.js 16.3.4 static export completed in the last source-changing release gate                                                      | Passing at release commit                    |
| Browser journeys       | 4 explicitly numbered Playwright E2E tests passed locally, on Preview, and on Production in the last source-changing release gate    | Passing at release commit                    |
| Mobile layout          | 320/390 px RTL, overflow, targets, dialog focus, Sessions, Audio, and mini-player checks                                             | Passing for tested flows                     |
| Content                | 40/40 audit; seven bounded card/source corrections completed with contract tests                                                     | Ready for a second native-Hebrew review      |
| Marketing              | Hebrew copy, privacy/FAQ, demo, launch stages, and pilot thresholds documented                                                       | Ready for internal review; not published     |
| Screenshot candidates  | Six exact states; all crop images are 390×844; manifest reports RTL, exact state, no overflow, and no browser errors                 | Present locally only                         |
| Live local preview     | `serve out --listen 3000` owned by this project; root returned HTTP 200 and 47,688 bytes at this checkpoint                          | Healthy                                      |
| Vercel Production      | Canonical root returned HTTP 200 and 47,688 bytes; Vercel reported Production deployment `dpl_FxFBELrvzGhC45UqbNaupx4t2Uaj` as Ready | Healthy                                      |
| Git                    | Local HEAD, upstream, and remote branch matched `8cdb453ef8782575038e9a1d9b1a295575d13d07` before this handoff edit                  | Clean and synchronized before handoff commit |

The detailed commands, browser flows, limits, and historical evidence are in `QA.md` and `PROGRESS.md`. This handoff does not combine free-form browser contracts with the numbered Node or E2E test totals.

## Human gates and known limits

These are not unfinished implementation defects:

1. A second native-Hebrew reader should review all 40 cards before corpus expansion or broad publication.
2. Physical iOS and Android checks remain for VoiceOver/TalkBack, text-only enlargement, browser source-link behavior, and native OS sharing.
3. Audio is deliberately silent. A rights-cleared Hebrew MP3 is required before testing real decoding, interruptions, background playback, or retention.
4. The marketing package and screenshots are preparation artifacts only. No outreach, public campaign, app-store submission, custom domain, or DNS change has occurred.
5. Device-local state does not sync between origins or devices; this is an explicit prototype trade-off, not hidden personalization.

## Exact next actions

1. Run the eight-person pilot in `MARKETING_READINESS.md` only after obtaining participant consent and choosing private research storage outside this public repository.
2. Complete the second native-Hebrew editorial/source review; correct weak items before adding new cards.
3. Perform the physical-device accessibility/share checks above and record device/browser/OS evidence separately.
4. Apply the ordered Continue / Narrow / Pivot / Stop rule from the pilot before adding backend, analytics, sync, notifications, or more content.

Do not repeat unchanged build or screenshot checks merely to produce activity. Re-run the relevant gate only after source changes, deployment changes, a failed check, or new user feedback.

## Read these files first

1. `PRODUCT.md` — product truth and explicit exclusions.
2. `PROGRESS.md` — chronological implementation and deployment ledger.
3. `QA.md` — exact automated, browser, mobile, content, and release evidence.
4. `CONTENT_AUDIT.md` — source/editorial findings and publication gate.
5. `MARKETING_READINESS.md` — approved preparation package and pilot contract.
6. `TODO.md` — evidence-driven follow-ups rather than scheduled features.
7. `ARCHITECTURE.md` and `CONTENT_MODEL.md` — technical and editorial boundaries.

## Constraints to preserve

- Work on `codex/hebrew-knowledge-prototype`; do not merge the default branch without an explicit request.
- The GitHub repository is public: never commit credentials, personal data, participant responses, private infrastructure details, or local mission logs.
- Preserve Hebrew, RTL, calm non-gamified UX, honest non-personalized wording, stable content IDs, and the static/local-first architecture until product evidence justifies change.
- Do not create backend/auth/analytics/payment infrastructure speculatively.
- Do not publish, contact users, purchase services, change custom domains/DNS, or alter unrelated Vercel projects without explicit authorization.
- Inspect live Git, process, and deployment state before trusting this handoff.

## Copy-paste prompt for a fresh session

> Continue SmartMe / רגע from `STATE_SUMMARY_FOR_NEW_SESSION.md` on branch `codex/hebrew-knowledge-prototype`. First inspect live Git, process, deployment, `PRODUCT.md`, `PROGRESS.md`, `QA.md`, `CONTENT_AUDIT.md`, and `MARKETING_READINESS.md`. Select only the highest-priority evidence-backed next slice. Preserve the public-repository privacy boundaries and static/local-first architecture. Use root-cause investigation and test-first changes, verify real behavior, and do not publish, contact users, merge, alter DNS, or touch unrelated projects without explicit approval.
