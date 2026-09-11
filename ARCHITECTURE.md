# Architecture

## Runtime

Next.js App Router, React, strict TypeScript, and Tailwind CSS v4. The app exports static HTML/CSS/JavaScript through `output: "export"`. It has no application server, API routes, authentication, or runtime secrets. Next runs a development server locally; the built artifact can be served as static files.

The layout declares `lang="he"` and `dir="rtl"`, metadata, bundled fonts, and the global design tokens. A single client `AppShell` owns the current view, feed controls, transient feedback, and audio state. Hash navigation deliberately avoids a routing/deployment layer while supporting share links, reloads, and browser Back. Hash views share one metadata title and do not provide per-idea SEO pages.

## Boundaries

| Area                              | Responsibility                                                     |
| --------------------------------- | ------------------------------------------------------------------ |
| `src/lib/models.ts`               | Content and collection types, topic vocabulary                     |
| `src/data/`                       | Local, JSON-compatible editorial fixtures                          |
| `src/lib/content-repository.ts`   | Content lookup boundary used by views                              |
| `src/lib/progress.ts`             | Pure parsing, toggling, daily deduplication, retention rules       |
| `src/lib/local-storage.ts`        | Storage adapter and observable progress store                      |
| `src/hooks/use-progress.ts`       | React subscription and progress actions                            |
| `src/hooks/use-route.ts`          | Hash observation and navigation                                    |
| `src/hooks/use-audio-player.ts`   | Playback, demo clock, media synchronization                        |
| `KnowledgeCard`                   | Shared reading surface, format-specific reveal/quiz state, actions |
| `SessionView`                     | Collection selection, ordered progress, completion                 |
| `AudioView` / `MiniPlayer`        | Episode discovery and persistent player controls                   |
| `Navigation` / `DiscoverySidebar` | Responsive navigation and discovery entry points                   |

## Device-local state

One versioned record, `rega.progress.v1`, contains saved IDs, liked IDs, read IDs per local date, and session positions. The store uses `useSyncExternalStore` with a stable empty server snapshot so browser storage is not accessed during prerendering. Storage events refresh other tabs. The app validates restored shapes, removes duplicate IDs, ignores invalid session offsets, and retains only 30 calendar dates of learning acknowledgments.

Read counts refresh at minute intervals and when visibility changes, so a long-lived tab rolls over to the current local date. Every write computes today's date independently. Storage errors are caught; in-memory interaction remains usable with a visible notice. Unknown saved content IDs remain in storage but are omitted from the collection until corresponding content exists.

This small store uses last-write-wins across tabs, not conflict resolution. Quiz selections, reveal state, topic selection, toast state, and audio position are ephemeral. Session position is persistent; its answers are intentionally not an assessment record. Closing and reopening the app resets audio.

## Audio boundary

An absent `audioUrl` means a visibly labelled, silent clock simulation. A supplied URL uses an actual HTML audio element: `loadedmetadata`, `timeupdate`, `ended`, and error events update the UI. Play rejection is handled, and controls support seek, skips, speed, and close. A single player hook above the views keeps playback alive during in-app navigation. There is no auto-play on page load.

The MP3 integration path is a static file under `public/audio/` or an accessible HTTPS media URL. Uploading and generating recordings are separate future concerns; there is no invented service integration in this version.

## Future Supabase path

Keep stable IDs and the existing content types. Replace `contentRepository` with an asynchronous adapter and add one loading/error boundary around content loading. Replace the progress store's persistence boundary with an async repository; keep the card props and actions unchanged. These adapters are synchronous today, so this migration includes deliberate async state handling rather than being a one-line configuration switch.

Only introduce identity, row-level access rules, migration scripts, and cross-device conflict policy when syncing personal collections becomes a validated need. Do not put a service-role credential in a client bundle. No Supabase packages or schema are installed preemptively.

## Styling and assets

Tailwind's theme defines the font and principal colors; semantic classes in `globals.css` carry the editorial card treatments and responsive composition. Logical inline spacing supports RTL. Audio time and numeric controls explicitly use LTR. Responsive breakpoints collapse the discovery sidebar and replace the navigation rail with bottom navigation. Reduced-motion preferences disable transitions. The cover is a local WebP; fonts are local WOFF/WOFF2 assets supplied by Fontsource.

## Verification scope

Unit tests target the data graph and persistence failure boundaries. Browser QA covers the actual product flows and responsive layout. Type checking, lint, and a static production build provide implementation checks. Real recording playback, iOS/Safari behavior, and screen-reader review on physical devices remain targeted follow-ups.
