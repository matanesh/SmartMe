# מחקר אוטומציית פודקאסט — SmartMe / רגע

**נבדק:** 25.09.2026 (UTC)

**סטטוס:** מחקר Cycle 1; אין כאן טענה שנוצר פרק חדש או שחובר חשבון Google.

**הכרעה קצרה:** קיימים מסלולי Google רשמיים, אבל נכון לבדיקה זו אף אחד מהם אינו מסלול הפקה אוטונומי זמין ומאושר לפרויקט: API הפודקאסט העצמאי הוצא משימוש ואינו מקבל לקוחות חדשים; API ה־Audio Overview הרשמי הוא Preview של Gemini Notebook Enterprise ודורש הקמת Enterprise/רישוי; ממשק NotebookLM הצרכני דורש כניסה ולא הוכח לו API צרכני מתועד. לכן אסור לאוטומציה להשתמש ב־endpoints לא מתועדים או ב־browser bot. ה־vertical slice הבא צריך להיות pipeline בטוח עם adapter כבוי כברירת מחדל, ורק אחר כך ספק Google רשמי שכבר מורשה בחשבון.

## 1. מצב המוצר החי בריפו

- ענף העבודה: `codex/hebrew-knowledge-prototype`; בעת הבדיקה `HEAD` ו־`origin` היו זהים ב־`48f49ae` וה־working tree היה נקי.
- קיימים שני פרקי MP3 המחוברים לקטלוג האפליקציה:
  - `public/audio/atomic-he.mp3` — MP3, ‏140.304 שניות, 561,453 בתים; עוצמה ממוצעת `-17.2 dB`, שיא `-0.6 dB`.
  - `public/audio/biases-he.mp3` — MP3, ‏151.944 שניות, 608,013 בתים; עוצמה ממוצעת `-16.0 dB`, שיא `0.0 dB`.
- עותקי ההפקה תחת `podcast-pilot/episodes/*/` זהים לקובצי האפליקציה לפי SHA-256. לכל אחד קיימים תמליל, מקורות וערכת Notebook ידנית.
- ערכות `NOTEBOOK_PROMPT.txt` / `UPLOAD_TO_NOTEBOOK.md` הן ערכות ידניות בלבד; הן אינן pipeline אוטונומי ואינן נספרות כפרק חדש.
- עשרת צילומי Deepstash נמצאים רק תחת `.hermes/inspiration/deepstash-2026-09-14/` (כ־1.6MB), וכל `.hermes/` מוחרגת מ־Git. הם חומר השראה פרטי בלבד.
- שתי המדיות הקיימות עברו בסבב זה בדיקות format/duration/non-silence. לא בוצעה בסבב זה בדיקת browser playback חדשה, ולכן אין כאן ספירה חדשה מעבר לשני הפרקים שכבר תועדו והוטמעו קודם.

## 2. מסלולי Google הרשמיים

### א. Gemini Notebook Enterprise — Audio Overview API

מקור רשמי: [Manage audio overview of your notebook (API)](https://docs.cloud.google.com/gemini/enterprise/notebooklm-enterprise/docs/api-audio-overview), עודכן לפי הדף ב־24.09.2026.

מה אומת מהדף עצמו:

- זהו API מתועד ליצירת Audio Overview מתוך notebook ומקורותיו.
- המאפיין מסומן **Preview / Pre-GA**, ניתן “as is” ועלול לקבל תמיכה מוגבלת.
- בכל notebook יכול להיות Audio Overview אחד בכל רגע.
- הקריאה המתועדת היא `notebooks.audioOverviews.create`, עם `sourceIds`, ‏`episodeFocus` ו־`languageCode`.
- ההורדה המתוארת בדף נעשית מתוך Studio לאחר טעינת ה־overview; בדף שנבדק אין workflow יצוא MP3 אוטונומי מקביל ל־standalone Podcast API.

תנאי כניסה: דף הרישוי הרשמי, [Get licenses for Gemini Notebook Enterprise](https://docs.cloud.google.com/gemini/enterprise/notebooklm-enterprise/docs/set-up-licensing), קובע שמשתמש באפליקציית Enterprise צריך רישיון; מנוי כולל לפחות 15 רישיונות, עם trial של 14 יום או מנוי חודשי/שנתי, והרישיונות תלויי multi-region.

**פסק דין:** מסלול רשמי אבל לא מוכן ל־SmartMe ללא הקמת Enterprise, רישוי, IAM ואימות export אוטונומי. בגלל איסור רכישה והיעדר חשבון Enterprise מאומת, לא הופעל.

### ב. Standalone Podcast API

מקור רשמי: [Generate podcasts (API method)](https://docs.cloud.google.com/gemini/enterprise/notebooklm-enterprise/docs/podcast-api), עודכן לפי הדף ב־24.09.2026.

מה אומת מהדף עצמו:

- בראש הדף מופיע: **Deprecated; Google isn't allowlisting new customers**.
- בעבר/ללקוחות מורשים, ה־API קיבל מערך context של טקסט/תמונה/אודיו/וידאו עד 100,000 tokens והחזיר MP3.
- הוא לא דרש notebook או רישיון Gemini Notebook Enterprise, אבל כן דרש פרויקט Google Cloud, הפעלת Discovery Engine API ותפקיד IAM ‏`roles/discoveryengine.podcastApiUser`.
- ה־API תמך ב־`SHORT` (בדרך כלל 4–5 דקות) וב־`STANDARD` (בסביבות 10 דקות), `languageCode` מסוג BCP47, long-running operation והורדת MP3 מתועדת.

**פסק דין:** זה היה הנתיב הטכני הקרוב ביותר למטרה, אך הוא אינו נתיב onboarding לפרויקט חדש. אין לבנות עליו production חדש ואין לנסות לעקוף allowlisting.

### ג. NotebookLM / Gemini Notebook הצרכני

- עמוד העזרה הרשמי [Learn about Gemini Notebook](https://support.google.com/notebooklm/answer/16164461?co=GENIE.Platform%3DiOS) מתאר כלי מבוסס מקורות, Audio Overviews ותמיכה ב־80+ שפות.
- ניווט לגיטימי אל `https://notebooklm.google.com/` בסביבת הבדיקה הופנה למסך Google Sign-in. לא היה session מורשה קיים, ולא הוזנו פרטים או נעשה ניסיון לעקוף את השער.
- חיפוש מתועד בדומיינים הרשמיים לא מצא API צרכני רשמי ליצירת/הורדת Audio Overview. זו מסקנת חיפוש תחומה בזמן, לא הוכחה שאין API עתידי.

**פסק דין:** ממשק ידני בלבד עבור המשימה הנוכחית. browser automation, cookies, endpoints לא מתועדים או חילוץ credentials אסורים.

### ד. Gemini / Cloud TTS כ־fallback

- דף התמחור הרשמי [Cloud Text-to-Speech pricing](https://cloud.google.com/text-to-speech/pricing) מתאר Gemini-TTS ומציין שאין free usage ל־Gemini 2.5 Flash/Flash-Lite TTS במסלול Cloud; התמחור שמופיע בדף הוא לפי input/output tokens, כאשר audio מחושב כ־25 tokens לשנייה.
- חיפוש רשמי מצא דפי Google ל־single/multi-speaker speech, אך שליפת דף ההדרכה המלא לא הושלמה בסבב זה. לכן תמיכת עברית, מודל מדויק, מכסות וזכויות שימוש מסחריות נשארות **שער אימות** ולא טענה מאושרת.
- לא אותרו בסביבה זו credentials/פרויקט Google מאומתים שמותר להשתמש בהם, ולא הופעל billing או API.

**פסק דין:** fallback אפשרי מבחינה ארכיטקטונית בלבד. אין להפיק פרק עד שכל שערי provider, עברית, מחיר, תנאים והרשאה עוברים.

## 3. זכויות, שקיפות ותנאים

- [Google Terms of Service](https://policies.google.com/terms?hl=en-US) אומר ש־Google לא תטען לבעלות על תוכן מקורי שהמשתמש יוצר, ושזכויות המשתמש בתוכן נשארות שלו. זה **לא** מעניק זכויות בחומרי המקור ולא מבטיח שכל פלט כשיר לזכויות יוצרים.
- [Generative AI Prohibited Use Policy](https://policies.google.com/terms/generative-ai/use-policy) אוסר, בין השאר, הפרת פרטיות/קניין רוחני והצגה מטעה של מקור התוכן כאילו נוצר כולו בידי אדם.
- לכן כל פרק חייב לשמור source packet, תסריט/תמליל מקורי, קישורים ותאריך, גילוי קול AI, ואישור זכויות נפרד לכל מקור, קול, מוזיקה ואיור.

## 4. ארכיטקטורה מומלצת (ללא נעילה לספק)

```text
idea
  -> source discovery
  -> retrieved + rights-reviewed source packet
  -> fact-checked structured script
  -> provider adapter (disabled until authorized)
  -> candidate media + transcript
  -> media QA + round-trip transcript comparison
  -> human approval gate for first episodes
  -> draft catalog
  -> app/browser QA
  -> publish
```

כל adapter חייב להחזיר סטטוס מפורש (`blocked`, `submitted`, `generated`, `qa_failed`, `approved`, `published`), מזהה provider, model/version, timestamps, checksum וקישורי provenance. אסור לקדם רשומה מ־`generated` ל־`approved` רק כי קיים קובץ.

## 5. שערי Go / No-Go לפני ניסיון אודיו חדש

1. **Provider:** endpoint רשמי ומתועד שאינו deprecated ללקוח החדש.
2. **Authorization:** חשבון/פרויקט קיים ומורשה; בלי רכישה או billing חדש במסגרת משימה זו.
3. **Language:** עברית נתמכת בדגם המדויק, כולל multi-speaker אם זה הערך הנבחר.
4. **Terms:** שימוש מסחרי, שמירת output, פרטיות והצהרת AI נבדקו בדפים הרלוונטיים לספק המדויק.
5. **Source rights:** כל מקור מסומן עם license/permission/adaptation status.
6. **Media QA:** decodable, משך צפוי, non-silence, loudness, checksum, אין truncation.
7. **Content QA:** תמלול חוזר מול script; שמות, מספרים וטענות מסומנים לבדיקה.
8. **Playback:** ניגון אמיתי, seek/range, שגיאות, mobile ו־accessibility בדפדפן.

## 6. בדיקת Claude והליד “Alon Cohen”

- `claude auth status --text` החזיר `Not logged in`.
- preflight מדויק עם `--model claude-opus-5-5` הסתיים בקוד 1; אובייקט JSON דיווח `is_error: true`, ‏`result: "Not logged in · Please run /login"`, ו־`modelUsage: {}`. לכן לא בוצעה ביקורת Claude ולא הוחלף המודל בשקט.
- חיפוש IL/he בשלוש וריאציות על “Alon Cohen” מצא אנשים ותכנים שונים, אך לא מקור ראשוני שמזהה בוודאות את האדם או pipeline רלוונטי. תוצאת LinkedIn משנית הזכירה NotebookLM בסמיכות לשם, אך snippet חיפוש אינו ראיה וזהות לא הוכחה. אין לייחס לאדם מערכת או הישג ללא URL/זהות מדויקים.

## 7. מתודולוגיה ועקבות

- Search: Serper עם US/en למסמכי Google ו־IL/he לליד הישראלי.
- Retrieval: HTTP ישיר לדפי Google הרשמיים; סטטוס 200 נשמר עם title, timestamp וטקסט מחולץ.
- Browser: שימש רק לבדיקת שער הכניסה של NotebookLM; התוצאה הייתה Google Sign-in.
- עקבות מקומיים (מוחרגים מ־Git): `.hermes/podcast-books-24h/research/*.json`.
- רמת ביטחון: **גבוהה** לגבי סטטוס ה־Podcast API, דרישות Enterprise, Preview והמחיר שנקראו בדפים; **בינונית** לגבי היעדר API צרכני (מסקנת חיפוש); **נמוכה/חסומה** לגבי זהות Alon Cohen ותמיכת Gemini-TTS בעברית בדגם המדויק.

## 8. עדכון Cycle 3 — Gemini-TTS והכרעת ניסיון ההפקה (26.09.2026 UTC)

בוצע חיפוש מתועד נוסף ונשלף הדף הרשמי [Gemini-TTS | Cloud Text-to-Speech](https://docs.cloud.google.com/text-to-speech/docs/gemini-tts), שעודכן לפי הדף ב־18.09.2026. הדף מאמת:

- `gemini-2.5-flash-tts` תומך ב־single/multi-speaker ובפלט MP3, OGG_OPUS ו־LINEAR16.
- עברית ישראלית (`he-IL`) מופיעה ברשימת השפות במצב **Preview**.
- תחילת עבודה דורשת Google Cloud project, הפעלת Cloud Text-to-Speech, billing, authentication והרשאת `aiplatform.endpoints.predict` (למשל דרך `roles/aiplatform.user`).

בדיקת הסביבה לא מצאה `gcloud`, משתני `GOOGLE*`/`GEMINI*`/`GCP*` או פרויקט מורשה. בהתאם לשער authorization ולאיסור להפעיל רכישה/billing, לא נשלחה קריאת API ולא נוצר קובץ אודיו. שתי שליפות אל `ai.google.dev` נעצרו על ידי שער האבטחה המקומי בגלל מדיניות TLD ולא אושרו בהיעדר המשתמש; הן אינן משמשות ראיה. עקבות החיפוש והשליפה המוצלחת נשמרו תחת `.hermes/podcast-books-24h/research/cycle3-*.json`.

**הכרעה:** מסלול Cloud Gemini-TTS הוא fallback רשמי רלוונטי יותר מכפי שהיה ידוע ב־Cycle 1, כולל עברית ו־multi-speaker, אך הוא חסום תפעולית בפרויקט זה בגלל העדר authorization/billing מאומתים. ה־adapter ב־prototype נשאר `enabled: false` ונסגר fail-closed. אין פרק חדש לספור.
