# SmartMe content radar

## Purpose

Find promising ideas in public editorial feeds, follow each item to its original source, and publish only an independently written, source-backed SmartMe card. Discovery feeds are leads, not evidence.

## Active discovery sources

| Source          | Public URL                 | Scope                                     | Status |
| --------------- | -------------------------- | ----------------------------------------- | ------ |
| חדשות טכנולוגיה | https://t.me/s/TechNewsHeb | AI, technology, science and unusual ideas | Active |

The corresponding WhatsApp channel is not accessed or automated. The public Telegram mirror is sufficient.

## Publication gate

A candidate may enter the application only when all conditions pass:

1. The Telegram post is newer than the durable local cursor and has not already been processed.
2. The idea has durable learning value for SmartMe; a press-release headline alone is not enough.
3. An original or authoritative source is available and actually supports the card's exact claims.
4. Extraordinary, disputed, safety-sensitive or promotional claims receive stronger corroboration or are skipped.
5. The Hebrew title and body are written independently for SmartMe. Do not copy the discovery post's phrasing or structure.
6. The card names the primary factual source in `source`/`sourceUrl`; the Telegram post is preserved separately in `discoveredVia` for provenance and possible future credit.
7. The item is not a duplicate of an existing card or source URL and fits the current 15–45 second reading contract.
8. Tests are written first, then the full test/type/lint/build/browser gates pass.
9. At most two cards are published in one daily run. Every other post is retained as processed/skipped evidence, not silently forgotten.
10. Only verified work is committed, pushed, and deployed to the isolated `smartme-rega` Vercel project.

If the source page is unavailable, ambiguous, paywalled without sufficient accessible evidence, or materially contradicts the post, skip publication and record the reason. Never invent missing details.

## Attribution

The current UI shows the primary factual source. Discovery provenance is stored in the content model but is not displayed yet. A later bounded UX decision can add wording such as “התגלה דרך חדשות טכנולוגיה” after confirming the desired credit style with the channel owner or using an accurate public attribution that does not imply partnership.

## Adding more discovery feeds

Additional public feeds are welcome when they add a distinct idea domain. Add them one at a time with:

- public and stable access;
- clear identity and URL;
- useful source links rather than mostly unsourced reposts;
- low duplication with existing feeds;
- a recorded scope and quality review;
- the same primary-source, originality and deduplication gates above.

Good future categories include science, behavioral research, history, economics, design, health literacy and practical technology. Popularity alone is not a quality signal.
