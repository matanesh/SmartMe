import type { AudioEpisode, LearningSession } from "@/lib/models";

export const learningSessions: LearningSession[] = [
  {
    id: "brain",
    title: "5 דברים שהמוח שלך עושה בלי שתשים לב",
    description:
      "לגלות את קיצורי הדרך שמעצבים את הבחירות שלנו — ולתפוס אותם בזמן.",
    estimatedMinutes: 5,
    itemIds: [
      "brain-shortcuts",
      "brain-anchor",
      "brain-frame",
      "brain-spotlight",
      "brain-confirm",
    ],
    accent: "sage",
  },
  {
    id: "small-habits",
    title: "שינוי גדול מתחיל ממש בקטן",
    description:
      "חמישה רעיונות שיעזרו להפוך כוונה טובה לצעד קטן שאפשר לעשות היום.",
    estimatedMinutes: 5,
    itemIds: [
      "habit-two-minutes",
      "habit-environment",
      "habit-stack",
      "habit-reset",
      "habit-quote",
    ],
    accent: "peach",
  },
  {
    id: "better-talks",
    title: "חמש דרכים לפתוח שיחה אחרת",
    description:
      "קצת יותר הקשבה, קצת פחות הנחות. כלים קטנים לקשרים של היומיום.",
    estimatedMinutes: 5,
    itemIds: [
      "relations-listen",
      "relations-specific",
      "relations-story",
      "relations-boundary",
      "relations-curious",
    ],
    accent: "lavender",
  },
];
export const audioEpisodes: AudioEpisode[] = [
  {
    id: "atomic",
    title: "5 רעיונות מ־Atomic Habits",
    description: "על התחלות קטנות, סביבה תומכת והדרך חזרה אחרי יום שפוספס.",
    topic: "הרגלים",
    durationSeconds: 140,
    audioUrl: "/audio/atomic-he.mp3",
    relatedItems: ["habit-two-minutes", "habit-environment", "habit-stack"],
    accent: "peach",
  },
  {
    id: "procrastination",
    title: "למה אנחנו דוחים דברים?",
    description: "ממשימה מעורפלת לצעד ראשון: רעיונות להקל על ההתחלה.",
    topic: "פסיכולוגיה",
    durationSeconds: 420,
    relatedItems: ["career-next-step", "habit-two-minutes"],
    accent: "sage",
  },
  {
    id: "biases",
    title: "5 הטיות שמשפיעות על ההחלטות שלנו",
    description: "מהעוגן הראשון ועד למידע שמאשר לנו את מה שרצינו לשמוע.",
    topic: "פסיכולוגיה",
    durationSeconds: 152,
    audioUrl: "/audio/biases-he.mp3",
    relatedItems: [
      "brain-shortcuts",
      "brain-anchor",
      "brain-frame",
      "brain-confirm",
      "money-sunk-cost",
    ],
    accent: "lavender",
  },
];
