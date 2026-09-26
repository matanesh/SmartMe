# מפרט pipeline לפודקאסט — SmartMe / רגע

**גרסה:** 1.0 · **עודכן:** 26.09.2026 UTC
**מטרה:** להפוך רעיון לפרק טיוטה בר־בדיקה בלי לפרסם, להפיק מדיה או להפעיל ספק לא מורשה בטעות.

## 1. גבולות המערכת

ה־pipeline הוא מנוע עריכתי ותפעולי נפרד משכבת ה־UI הסטטית של Next.js. האפליקציה בנויה כרגע עם `output: "export"`; לפי מדריך Next.js המקומי, לייצוא סטטי אין Server Actions או Route Handlers דינמיים. לכן:

- המימוש הנוכחי הוא domain model + runner מקומי ודטרמיניסטי.
- קבצי input לדוגמה ניתנים למעקב ב־Git; תוצאות ריצה נשמרות תחת `.hermes/` ומוחרגות מ־Git.
- בעתיד worker מאובטח יכול להשתמש באותו חוזה נתונים, בלי להטמיע מפתח API בדפדפן או ב־bundle.
- אין חיבור אוטומטי לקטלוג האפליקציה. רק job שעבר QA, אישור ו־publication transaction רשאי ליצור/לעדכן רשומת קטלוג.

## 2. הזרימה ומכונת המצבים

```text
new
  → researching
  → source_ready
  → script_ready
  → generation_blocked | generating
  → media_ready
  → qa_failed | draft_ready
  → approved
  → published
```

ה־prototype מדלג על `researching` רק כאשר מוזן source packet שכבר כולל retrieval וזכויות. כל מעבר נשמר ב־`events` עם זמן וסיבה. מצב אינו שווה הצלחה: `generation_blocked` ו־`qa_failed` הם תוצאות צפויות, נראות וניתנות לחידוש.

### תנאי מעבר

| מעבר                                | תנאי קשיח                                                                                                        |
| ----------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `new → source_ready`                | לפחות שני מקורות HTTPS, התאמה ל־idea, retrieval timestamp, publisher, rights status, adaptation decision והערות  |
| `source_ready → script_ready`       | narration מדויק, source IDs קיימים, גילוי קול AI, משך יעד ואישור generation                                      |
| `script_ready → generating`         | adapter רשמי ומופעל + timestamp של בדיקת authorization                                                           |
| `script_ready → generation_blocked` | provider כבוי/לא מורשה; נשמר blocker, לא נוצר קובץ דמה                                                           |
| `generating → media_ready`          | path, format, duration חיובי, SHA-256 ותמליל                                                                     |
| `media_ready → draft_ready`         | format, duration, non-silence, transcript comparison, facts/names, provenance, browser playback ו־seek עברו כולם |
| `draft_ready → approved`            | gate אנושי לפרקים האוטומטיים הראשונים                                                                            |
| `approved → published`              | transaction מפורש לעדכון storage/catalog; אינו ממומש ב־prototype                                                 |

כל ניסיון לעקוף מצב זורק שגיאה. אין מסלול ישיר מ־`generated` או `media_ready` לפרסום.

## 3. idempotency וחידוש ריצה

`createPodcastJob` מחשב SHA-256 דטרמיניסטי מ־`ideaId`, כותרת, brief ושפה. זמן הבקשה אינו חלק מהמפתח, ולכן retry של אותו רעיון מחזיר אותו `jobId`. worker עתידי חייב לבצע upsert לפי `idempotencyKey`, ולא ליצור episode נוסף.

מומלץ לשמור בנפרד:

- job JSON הנוכחי;
- event log append-only;
- media candidate עם checksum;
- transcript, source packet ו־exact narration;
- provider/model/revision ו־timestamps;
- publication revision ו־catalog ID רק אחרי אישור.

Retry ממשיך מהשלב שנכשל. אסור לבצע generation נוסף אם כבר קיימת candidate media עם אותו idempotency key ו־checksum, אלא אם נפתחה revision חדשה במפורש.

## 4. חוזה תוכן וזכויות

לכל מקור נשמרים `sourceId`, כותרת, URL קנוני, publisher, retrieval date, כתובת retrieval evidence כשנדרש adapter חלופי, rights status, license אם קיימת, adaptation decision והערות. הסטטוסים:

- `public-domain`
- `open-license`
- `directly-licensed`
- `original`
- `reference-only` — מותר להסתמך על עובדות/רעיונות ולנסח מקורית; אסור להעתיק ביטוי מוגן
- `blocked`

`blocked` או `adaptationAllowed: false` עוצרים את ה־pipeline. הסימון אינו חוות דעת משפטית; הוא ledger של החלטת המערכת וראיותיה. קובץ הדוגמה משתמש בשני מאמרים כ־`reference-only`, בתסריט עברי מקורי וללא העתקת פרוזה.

## 5. adapter לספק

המימוש מגדיר כרגע שני מזהי ספק בלבד:

- `gemini-notebook-enterprise`
- `google-cloud-gemini-tts`

כל adapter מתחיל `enabled: false`. הפעלה דורשת:

1. endpoint מתועד ורשמי שאינו חסום ללקוח;
2. פרויקט/חשבון שכבר מורשה במסגרת המשימה;
3. API מופעל, billing קיים והרשאות IAM מתאימות;
4. credentials דרך מנגנון server-side תקני — לעולם לא בקוד/JSON/log;
5. שפה ומודל מדויקים מאומתים;
6. תנאים, פרטיות, מחיר, מכסה ואפשרות שמירת output שנבדקו;
7. destination פרטי ל־candidate, לא פרסום אוטומטי.

### מצב Google שנבדק ב־26.09.2026

המסמך הרשמי של Cloud Text-to-Speech ל־Gemini-TTS, שעודכן ב־18.09.2026, מציג single/multi-speaker, MP3/OGG/LINEAR16, את `gemini-2.5-flash-tts`, ועברית `he-IL` ב־Preview. אותו דף דורש project, billing, הפעלת Cloud TTS, authentication והרשאת `aiplatform.endpoints.predict`. בסביבת המשימה לא נמצאו `gcloud`, משתני Google/Gemini או פרויקט מורשה. לכן adapter נשאר כבוי ולא בוצעה קריאת generation.

מקור: https://docs.cloud.google.com/text-to-speech/docs/gemini-tts

Notebook Enterprise נשאר מסלול נפרד ותלוי notebook/license. אין להשתמש ב־consumer NotebookLM endpoints לא מתועדים.

## 6. QA למדיה ולתוכן

פרק נספר רק כאשר קיימת מדיה אמיתית וכל הבדיקות עברו:

1. `ffprobe`: format, codec, duration, channels, sample rate ו־decodability.
2. `ffmpeg volumedetect`: לא silence; normalization/re-encode לפי הצורך.
3. SHA-256 וקובץ לא ריק.
4. תמלול חוזר מול narration: omissions, שינויי מספרים ושמות.
5. בדיקת facts, pronunciation ו־source links.
6. browser playback אמיתי ב־390px וב־320px, כולל play/pause, seek, speed, error state ו־labels.
7. בדיקת URL delivery: HTTP 200/206, range requests, cache headers ו־stable URL.
8. transcript, sources, תאריך וגילוי AI מוצגים למשתמש.

ב־prototype `evaluateQa` אוסף שמונה gates. כל כשל מוביל ל־`qa_failed`; בפרט, file תקין ללא browser playback ו־seek אינו טיוטה מוכנה.

## 7. publish ו־rollback

פרסום עתידי צריך להיות transaction קטן:

1. העלאת media candidate ל־draft/private namespace.
2. בדיקת checksum ו־range מה־URL הסופי.
3. כתיבת catalog record במצב draft.
4. preview/browser QA.
5. אישור אנושי ראשוני.
6. החלפת status ל־published.

Rollback מבטל את רשומת הקטלוג או מחזיר revision קודם; binary נשמר זמנית לצורך audit ואז נמחק לפי retention policy. תיקון יוצר revision חדשה עם checksum ותמליל חדשים — לא החלפה שקטה.

## 8. ה־vertical slice הממומש

קבצים:

- `src/lib/podcast-pipeline.ts` — types, transitions, idempotency ו־QA.
- `scripts/podcast_pipeline.ts` — runner מקומי fail-closed.
- `podcast-pilot/pipeline-examples/sample-biases-he.json` — idea + source packet + exact script.
- `tests/podcast-pipeline.test.ts` — idempotency, rights rejection, provider block ו־QA/publish gates.

הרצה:

```bash
npm run podcast:sample
```

התוצאה נכתבת ל־`.hermes/podcast-pipeline/runs/<jobId>.json`. התוצאה הצפויה כרגע היא `generation_blocked`, `generatedMedia: false`, `published: false`. זו הצלחה בטיחותית של ה־pipeline, לא פרק.

## 9. שער היציאה מה־prototype

השלב הבא רשאי להפעיל generation רק אם נמצא project מורשה קיים וכל שבעת שערי ה־adapter עברו. אחרת יש להשאיר את ה־job חסום ולהמשיך ל־rights-safe quick-reading work; אין ליצור credentials, billing או רכישה, ואין להחליף זאת ב־endpoint לא מתועד.
