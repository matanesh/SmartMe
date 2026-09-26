# SmartMe / רגע — state summary for a new session

- Updated: 2026-09-26 15:24 IDT
- Mission: 24-hour podcast automation + rights-safe quick-reading slice
- Branch: `codex/hebrew-knowledge-prototype`
- Repository: <https://github.com/matanesh/SmartMe/tree/codex/hebrew-knowledge-prototype>
- Production: <https://smartme-rega.vercel.app> — healthy, but still deployed from older commit `c475227`; the current mission work is not deployed.

## Delivered on the branch

1. **Two real Hebrew audio episodes remain app-connected.** The current catalog contains only `atomic-he.mp3` and `biases-he.mp3`, with full transcripts, source links, review dates, checksums and honest disclosure that the legacy voice provider/model is unknown.
2. **A fail-closed podcast pipeline prototype** models deterministic job IDs, source/rights gates, provider authorization, media QA, approval and publishing states. Its sample run ends at `generation_blocked`; it does not generate or publish audio.
3. **One rights-safe quick read** is implemented: an original Hebrew editorial synthesis based on the George Long edition of Marcus Aurelius, with edition-level provenance, rights basis, three content sections and an action.
4. **An eight-candidate rights ledger** distinguishes one pilot-ready edition from held or further-check candidates. It explicitly forbids treating a modern Hebrew translation, cover, illustration or recording as public domain merely because the source work is old.
5. **Original RTL product direction and integrated UX** connect discovery, quick reading and the real-audio library without copying Blinkist or Deepstash trade dress. The current branch removes the silent simulated audio item and exposes trust metadata.

## Google / NotebookLM verdict

- Consumer NotebookLM required Google sign-in and no documented consumer generation/export API was verified. It remains a manual route; no browser automation or undocumented endpoint was used.
- Gemini Notebook Enterprise Audio Overview has an official Preview API, but requires Enterprise setup, licenses and IAM; autonomous media export was not proven for this project.
- The standalone Podcast API is deprecated and is not allowlisting new customers.
- Google Cloud Gemini TTS officially lists `he-IL`, single/multi-speaker output and MP3/OGG/LINEAR16 in Preview, but this environment had no authorized Cloud project, enabled billing/API credentials or IAM. No generation request was sent.
- Result: **zero new Google/NotebookLM episodes**. Do not call the manual kits or the blocked pipeline output episodes.

## Final verification evidence

- `npm test`: 26/26 passed.
- `npm run test:e2e`: 6/6 passed against the fresh static production build; both MP3s loaded, advanced playback, sought to 30 seconds, and exposed transcripts/sources in Chromium.
- `npm run lint`: passed.
- `npm run typecheck`: passed.
- `npm run build`: passed with Next.js 16.3.4; `/` and `/_not-found` were statically generated.
- `git diff --check`: passed.
- Media: 140.304 s / 561,453 bytes and 151.944 s / 608,013 bytes; both mono MP3, 24 kHz, non-silent, and checksums match the catalog and pilot copies.
- Mobile QA: 320 px and 390 px flows, 44 px audited targets, keyboard focus, 200% zoom-equivalent reflow, real playback and zero captured browser errors passed.

## Git and deployment truth

Mission commits after `48f49ae`:

- `3111e94` — official Google automation research
- `acbffdc` — original RTL product direction
- `aa44bd4` — fail-closed podcast pipeline
- `c91dfc7` — rights-safe quick-read pilot
- `fb048cb` — trusted audio + quick-read integration

The branch was pushed and matched `origin/codex/hebrew-knowledge-prototype` at `fb048cb` before the final handoff-only cleanup commit. Vercel production is READY and returns HTTP 200, but its deployment metadata points to `c475227` from 2026-09-14. It still shows the older catalog with a silent demo episode, so it is **not evidence of the current mission UX**. No preview or production deployment of the mission branch was made.

## Blockers and limits

- No authorized Google Cloud/Notebook Enterprise setup; no autonomous Google episode.
- Claude Code was not logged in; the exact requested Opus 5.5 run failed before model use. No Claude critique occurred.
- Legacy TTS provider/model provenance cannot be reconstructed from the existing MP3 artifacts.
- No manual screen-reader or physical iOS/Android pass; no numeric contrast/forced-colors audit.
- The rights catalog is an operational filter, not legal advice; every added edition/translation/artwork/recording needs a separate gate.

## Exact next actions

1. Provision or identify an already-authorized Google Cloud project, verify billing/IAM/terms, then generate one private candidate through the official Gemini TTS route and run the complete media/transcript/browser QA ladder before approval.
2. Create a preview deployment from the current branch, run the same six E2E flows on its URL, and promote only after a human review of the quick read and trust disclosures.
3. Expand the library by one edition at a time: complete edition/asset rights evidence, obtain a second native-Hebrew editorial review, and add physical-device screen-reader/playback testing.

## Read first

1. `.hermes/podcast-books-24h/GOAL.md`
2. `.hermes/podcast-books-24h/PROGRESS.md`
3. `docs/PODCAST_AUTOMATION_RESEARCH.md`
4. `docs/PODCAST_PIPELINE_SPEC.md`
5. `docs/RIGHTS_SAFE_READING_CATALOG.md`
6. `docs/PRODUCT_DESIGN_DIRECTION_HE.md`

Do not restart the completed recurring mission, use undocumented Google endpoints, deploy the current branch without preview QA, or claim a new episode without real media passing every gate.
