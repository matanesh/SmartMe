import type { Topic } from "@/lib/models";

export type RightsStatus = "public-domain-source" | "open-license" | "original";

export interface QuickReadSource {
  label: string;
  url: string;
  role: "source-edition" | "rights-policy" | "legal-context";
}

export interface QuickRead {
  id: string;
  title: string;
  dek: string;
  topic: Topic;
  sourceWork: string;
  sourceCreator: string;
  estimatedMinutes: number;
  sections: Array<{ heading: string; body: string }>;
  action: string;
  editorialDisclosure: string;
  rights: {
    status: RightsStatus;
    basis: string;
    jurisdictionsReviewed: string[];
    reviewedAt: string;
    method: string;
  };
  sources: QuickReadSource[];
}

export const quickReads: QuickRead[] = [
  {
    id: "meditations-circle-of-control",
    title: "מה בשליטתך — ומה רק תופס לך את כל תשומת הלב?",
    dek: "שלוש דקות על ההפרדה בין מה שקרה, הסיפור שאנחנו מספרים עליו, והצעד הקטן שעוד אפשר לבחור.",
    topic: "פסיכולוגיה",
    sourceWork: "Thoughts of Marcus Aurelius Antoninus",
    sourceCreator: "מרקוס אורליוס · מהדורת George Long",
    estimatedMinutes: 3,
    sections: [
      {
        heading: "אירוע ושיפוט אינם אותו דבר",
        body: "מייל שלא נענה, תוכנית שהשתבשה או ביקורת שקיבלנו הם אירועים. כמעט מיד מצטרף אליהם פירוש: מתעלמים ממני, הכול נהרס, אני לא מספיק טוב. ההבחנה אינה מבטלת את הקושי; היא רק פותחת מרווח. את האירוע אולי אי אפשר לשנות, אבל אפשר לבדוק אם הפירוש היחיד שנתנו לו הוא גם הפירוש המדויק ביותר.",
      },
      {
        heading: "להחזיר מאמץ למקום שבו יש לו אחיזה",
        body: "אנחנו לא שולטים בתגובה של אדם אחר, במזג האוויר או בהחלטה שכבר התקבלה. כן אפשר לבחור אם לשאול שאלה נוספת, להכין חלופה, לבקש משוב או לעצור לפני תגובה חדה. זו לא הבטחה שהכול יסתדר; זו דרך להפסיק להשקיע את כל האנרגיה בתוצאה שאינה בידינו ולהעביר חלק ממנה לפעולה שכן אפשר לבצע.",
      },
      {
        heading: "לא אדישות — אחריות מדויקת",
        body: "הפרדה בין נשלט ללא־נשלט עלולה להישמע כמו ויתור. בפועל היא יכולה לחדד אחריות: אם אין לנו שליטה מלאה בתוצאה, עדיין יש לנו אחריות לאיכות המעשה, לאופן שבו נדבר ולמידע שנבדוק. השאלה המועילה אינה רק ״מה יקרה?״ אלא גם ״איך אני רוצה לפעול בתוך מה שקורה?״.",
      },
    ],
    action:
      "חלקו דף לשתי עמודות: ״לא בידי״ ו״הצעד הבא שבידי״. כתבו אירוע אחד שמעסיק אתכם, ואז פעולה אחת שאפשר להשלים בעשר דקות — בלי לדרוש מהעולם לשתף פעולה קודם.",
    editorialDisclosure:
      "עיבוד עברי מקורי של מערכת רגע לרעיונות כלליים מן היצירה; לא תרגום, לא ציטוט ולא תחליף לטקסט המקורי.",
    rights: {
      status: "public-domain-source",
      basis:
        "המקור העתיק ומהדורת George Long (1800–1879) עברו את מסנן נחלת הכלל המתועד; דף המהדורה מסומן Public domain in the USA.",
      jurisdictionsReviewed: ["ארה״ב", "ישראל — מסנן ראשוני"],
      reviewedAt: "2026-09-26",
      method:
        "סינתזה חדשה ללא תרגום משפט־למשפט וללא שימוש בעטיפה, איור או אודיו מן המהדורה.",
    },
    sources: [
      {
        label: "Project Gutenberg · מהדורת George Long",
        url: "https://www.gutenberg.org/ebooks/15877",
        role: "source-edition",
      },
      {
        label: "Project Gutenberg · תנאי שימוש וסימן מסחר",
        url: "https://www.gutenberg.org/policy/license.html",
        role: "rights-policy",
      },
      {
        label: "משרד המשפטים · מדריך זכויות יוצרים",
        url: "https://www.gov.il/he/pages/instructions-copyright",
        role: "legal-context",
      },
    ],
  },
];
