# פודקאסט AI יומי קצר — Spotify ו־RSS

**נבדק:** 14.09.2026 · לא נפתח חשבון, לא פורסם פרק ולא בוצעה אינטגרציה.

## מסקנה

אפשר לבנות פרק AI יומי של כ־3 דקות, אבל אין בתיעוד הציבורי של Spotify Web API endpoint להעלאה או פרסום אוטומטי של פרקי פודקאסט. המסלול המתועד לאוטומציה הוא:

`מקורות מאומתים → תסריט מקורי → TTS → בקרת איכות → API של מארח פודקאסטים → RSS → Spotify`

## שתי דרכים

| דרך                      | אוטומציה                                            | מתאים לפיילוט?               |
| ------------------------ | --------------------------------------------------- | ---------------------------- |
| **Spotify for Creators** | העלאה ותזמון בממשק Web/Mobile, לא API ציבורי להעלאה | כן, לפרק ידני/פיילוט         |
| **מארח חיצוני + RSS**    | תלוי במארח; RSS נשלח/נדרש פעם אחת ב־Spotify         | כן, לשלב אוטומטי             |
| **מארח עם API**          | אפשר להעלות קובץ ומטא־דאטה מתוך pipeline            | הנתיב המתאים לפרק יומי בעתיד |

Spreaker הוא דוגמה למארח שמפרסם API רשמי, כולל endpoint ליצירת פרק. אין לבחור ספק או להירשם לפני השוואת עלות/תנאים כשנגיע לשלב זה.

## תהליך מומלץ ל־SmartMe

### פיילוט ידני

1. לבחור 3–5 מקורות ראשוניים שעברו אימות.
2. ליצור תסריט מקורי קצר, בלי להעתיק כתבות או פוסטים.
3. להפיק MP3 ולהאזין במלואו.
4. להעלות ידנית ל־Spotify for Creators או למארח חיצוני.
5. למדוד אם אנשים מאזינים עד הסוף וחוזרים.

### אוטומציה רק לאחר פיילוט

1. ה־collector הזול מוצא מועמדים; מודל חזק מופעל רק למועמדים מאומתים.
2. לשמור מקור, תמליל, זמן איסוף ואישור QA לכל פרק.
3. אישור אנושי קצר לפני פרסום — במיוחד לחדשות, משפטים מיוחסים וטענות מספריות.
4. לשלוח את ה־MP3 והמטא־דאטה ל־API של מארח פודקאסטים.
5. ה־RSS מתעדכן; Spotify קולטת את הפרק. זמן הופעה בפלטפורמות עלול לקחת שעות ועד כ־24 שעות.

## זכויות ו־AI

- עובדות ורעיונות אפשר לסכם במילים מקוריות; אין להעתיק ניסוח, הקלטה, מוזיקה או וידאו של צד ג׳.
- היוצר אחראי לזכויות/רישיונות לכל תוכן, מוזיקה, תמונה וקול.
- אין להשתמש בחיקוי של קול מזוהה, מוזיקת רקע או ג׳ינגל ללא רישיון/הסכמה.
- לבדוק שהרישיון המסחרי של ספק ה־TTS מכסה פרסום פומבי ומוניטיזציה לפני השקה.
- לא להשתמש ב־browser-bot כדי לעקוף ממשק העלאה ידני של Spotify.

## מקורות רשמיים

- Spotify for Creators — העלאה/תזמון/סוגי קבצים: https://support.spotify.com/us/creators/article/publishing-audio-episodes/
- Spotify for Creators — claim של RSS חיצוני: https://support.spotify.com/us/creators/article/claiming-your-podcast-on-spotify-for-creators/
- Spotify for Creators — הפצת תוכנית ל־Spotify: https://support.spotify.com/us/creators/article/getting-your-show-on-spotify/
- Spotify Web API: https://developer.spotify.com/documentation/web-api
- תנאי Spotify for Creators: https://www.spotify.com/legal/spotify-for-creators-terms/
- מדיניות קניין רוחני: https://www.spotify.com/legal/intellectual-property-policy/
- כללי משתמשים: https://www.spotify.com/legal/user-guidelines/
- Spreaker API: https://developers.spreaker.com/api/
