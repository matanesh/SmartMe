# SmartMe — Cloudflare מול Vercel

**נבדק:** 14.09.2026 · **החלטה:** נשארים כרגע ב־Vercel; אין מעבר או שינוי DNS.

## מצב האפליקציה היום

- `next.config.ts` משתמש ב־`output: "export"`.
- אין API routes, אימות, מסד נתונים או secrets ברuntime.
- Next.js מייצר אתר סטטי (`out/`), ולכן לפי תיעוד Next.js אפשר להגיש אותו מכל שרת קבצים סטטיים.
- שני פרקי האודיו הפעילים הם MP3 סטטיים בגודל כולל של כ־1.17MB.

## החלופות

| חלופה                           | התאמה עכשיו  | יתרון                                                                 | עלות/סיכון                                                                     |
| ------------------------------- | ------------ | --------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| **Vercel הקיים**                | **מומלצת**   | כבר מחובר ל־Git ולפרויקט `smartme-rega`; Preview + Production מאומתים | אין הגירה, אין שינוי DNS, אין provider נוסף                                    |
| **Cloudflare Pages**            | מתאימה טכנית | יכולה להגיש אתר סטטי של Next.js דרך Git                               | דורשת פרויקט, CI, בדיקת redirects/headers והעברת domain; אין יתרון מוצרי מיידי |
| **Cloudflare Workers / vinext** | לא נדרש כרגע | שימושי אם בעתיד צריך runtime, APIs או לוגיקה בקצה                     | מסלול Next.js שונה, יותר התאמות ובדיקות; לא להעביר רק בגלל ש"Cloudflare מהיר"  |
| **Cloudflare R2**               | עתידי        | אחסון Object Storage, egress חינמי; נוח לארכיון אודיו/RSS             | דורש bucket, credentials, CORS, naming ו־cache policy; מיותר לשני MP3 קטנים    |
| **Vercel Blob**                 | עתידי        | אינטגרציה טבעית עם Vercel                                             | מוסיף שירות/חיוב וניהול נכסים; אין צורך לפני שיש תוכן דינמי בכמות משמעותית     |

## המלצה מעשית

### שלב 1 — עכשיו

1. להמשיך לפרוס את האתר וה־MP3 הסטטיים מ־Git ל־Vercel.
2. לשמור את כתובת ה־Vercel הנוכחית כיעד היחיד; לא לשנות DNS.
3. להשתמש בקבצי `public/audio/` כל עוד מדובר בעשרות פרקים קצרים ולא במאגר גדול.

### שלב 2 — כשהאודיו גדל

להעריך מעבר **של נכסי אודיו בלבד** ל־Cloudflare R2 אם יש ארכיון משמעותי, RSS לפודקאסט, או תעבורה גבוהה. האתר עצמו יכול להישאר ב־Vercel. כך נמנעים מהגירה של אפליקציה שעובדת.

לפי תיעוד R2 העדכני: Standard storage עולה $0.015 ל־GB־month; ה־free tier כולל 10GB־month, מיליון פעולות Class A ועשרה מיליון Class B בחודש; egress לאינטרנט חינם. שני קבצי הפיילוט קטנים בהרבה מהמכסה.

### שלב 3 — רק אם המוצר משתנה

לבחון Cloudflare Workers רק אם נכניס בפועל API server-side, queue, auth, pipeline מבוסס Worker או צורך edge ייחודי. זו החלטת ארכיטקטורה עתידית, לא אופטימיזציית חובה של אתר סטטי.

## דומיין ו־PWA

- דומיין ו־PWA אפשריים עם Vercel וגם עם Cloudflare; הם אינם סיבה טכנית לעבור עכשיו.
- כאשר מחברים דומיין, יש לבדוק לאיזה פרויקט הוא משויך לפני פריסה ולאמת HTTPS/alias בפועל.
- אם מוסיפים domain בעתיד: לבצע זאת כשינוי נפרד, עם בדיקת Preview ואז Production, ולא יחד עם שינוי אחסון.

## מקורות רשמיים

- Next.js Static Exports: https://nextjs.org/docs/app/guides/static-exports
- Cloudflare Pages — Next.js: https://developers.cloudflare.com/pages/framework-guides/nextjs/
- Cloudflare Workers — Next.js / vinext: https://developers.cloudflare.com/workers/framework-guides/web-apps/nextjs/
- Cloudflare R2 overview: https://developers.cloudflare.com/r2/
- Cloudflare R2 pricing: https://developers.cloudflare.com/r2/pricing/
- Vercel + Next.js: https://vercel.com/docs/frameworks/nextjs
- Vercel Blob: https://vercel.com/docs/vercel-blob
- Vercel domains: https://vercel.com/docs/domains
