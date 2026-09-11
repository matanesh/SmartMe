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
