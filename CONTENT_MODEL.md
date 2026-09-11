# Content model

The authoritative TypeScript definitions are in `src/lib/models.ts`. Fixtures are plain objects with no methods, dates, or storage-specific fields, so they can be serialized as JSON later.

## KnowledgeItem

| Field                  | Type          | Meaning                                                           |
| ---------------------- | ------------- | ----------------------------------------------------------------- |
| `id`                   | string        | Stable slug; referenced by saved state and collections            |
| `type`                 | KnowledgeType | Presentation format listed below                                  |
| `title`                | string        | Brief Hebrew hook; optional intentional newline                   |
| `content`              | string        | Original concise Hebrew explanation                               |
| `topic`                | Topic         | One primary topic from the shared vocabulary                      |
| `source`               | string        | Human-readable attribution, including editorial originals         |
| `sourceUrl?`           | string        | HTTPS primary-source link when externally sourced                 |
| `author?`              | string        | Actual author or editorial attribution; never fabricated          |
| `tags`                 | string[]      | Secondary concepts; not used for ranking yet                      |
| `estimatedReadSeconds` | number        | Editorial estimate, generally 15–45 seconds including reveal/quiz |
| `audioUrl?`            | string        | Reserved optional per-item audio; not used by the current card UI |
| `image?`               | string        | Local cover path; currently used by the featured card             |
| `relatedItems?`        | string[]      | IDs of connected ideas                                            |
| `takeaway?`            | string        | A practical prompt or final thought                               |
| `quote?`               | string        | Exact quoted text, explicitly attributed                          |
| `quiz?`                | object        | `options`, zero-based `correctIndex`, and `explanation`           |
| `accent?`              | enum          | `peach`, `sage`, `lavender`, `ink`, or `cream`                    |

The topic vocabulary is: פסיכולוגיה, כסף, קריירה, AI וטכנולוגיה, יחסים, מדע, היסטוריה, הרגלים. Each has five fixture items.

| Type           | Hebrew label   | Behavior                                            |
| -------------- | -------------- | --------------------------------------------------- |
| `insight`      | רגע של תובנה   | Explanation with optional takeaway                  |
| `fact`         | עובדה מפתיעה   | A concrete, sourced observation                     |
| `tip`          | משהו לנסות     | A small practical experiment                        |
| `quote`        | מילים למחשבה   | Large quotation plus explanation                    |
| `story`        | סיפור קטן      | Short narrative; invented examples are labelled     |
| `did-you-know` | הידעת?         | A curiosity-led explanation                         |
| `reveal`       | רגע, מה דעתך?  | Explanation appears after an explicit reveal        |
| `quiz`         | שאלה קטנה      | One answer, correct/incorrect feedback, explanation |
| `book`         | רעיון מתוך ספר | One idea from a book, not a book summary            |
| `research`     | מבט מהמחקר     | Research finding with careful qualification         |

## AudioEpisode

`id`, `title`, `description`, `topic`, `durationSeconds`, optional `audioUrl`, `relatedItems`, and `accent` (`peach`, `sage`, or `lavender`).

`durationSeconds` is the proposed duration for a silent demo. Real media metadata takes precedence during actual playback. The absence of a URL is the explicit demo contract; do not point to a missing MP3 and pretend it is playable. The current catalog has three demos, not three finished recordings.

## LearningSession

`id`, `title`, `description`, `estimatedMinutes`, `itemIds`, and `accent` (`peach`, `sage`, or `lavender`). The ordered `itemIds` array contains exactly five distinct existing records. A stored step from 0 to 4 identifies the current idea; 5 identifies completion. A session references ideas rather than duplicating their text.

## Editorial rules

1. Open with a hook that the body actually supports. Avoid exaggerated promises and universal psychological claims.
2. Write natural Hebrew directly. Use short paragraphs, familiar examples, and a clear takeaway when helpful.
3. Use original paraphrases, not copied book excerpts. The two current quote cards are original editorial phrases, explicitly attributed to מערכת רגע.
4. Add a primary source for external factual claims. Suggestions and fictional scenarios must be labelled as editorial, not dressed as studies.
5. Separate a study's result from an inference or practical experiment. A source link is not proof that every extension has been tested.
6. Check the exact source, uncertainty, terminology, and the publication's current accessibility before broader distribution. Some journal links lead to abstracts or paywalls.
7. Keep stable IDs when editing copy. Check related-item references and collection order after changing records.

## Examples of sources checked

- Availability and anchoring: [Tversky & Kahneman, Science (1974)](https://doi.org/10.1126/science.185.4157.1124).
- Habit beginnings: [James Clear's two-minute rule](https://jamesclear.com/how-to-stop-procrastinating).
- Venus rotation and orbital periods: [NASA Venus Facts](https://science.nasa.gov/venus/venus-facts/). The quiz distinguishes a sidereal rotation from the interval between sunrises.
- Web origins and release: [CERN, The birth of the Web](https://home.cern/science/computing/the-birth-of-the-web/).
- Cephalopod circulation: [Smithsonian Ocean](https://ocean.si.edu/ocean-life/invertebrates/octopuses-squids-and-relatives).

Tests validate coverage, unique IDs, all ten formats, quiz bounds, HTTPS source URLs, and session/audio references. They cannot verify scientific truth, translation quality, or real reading time.
