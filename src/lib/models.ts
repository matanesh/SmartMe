export const TOPICS = [
  "פסיכולוגיה",
  "כסף",
  "קריירה",
  "AI וטכנולוגיה",
  "יחסים",
  "מדע",
  "היסטוריה",
  "הרגלים",
] as const;
export type Topic = (typeof TOPICS)[number];
export type KnowledgeType =
  | "insight"
  | "fact"
  | "tip"
  | "quote"
  | "story"
  | "did-you-know"
  | "reveal"
  | "quiz"
  | "book"
  | "research";
export interface KnowledgeItem {
  id: string;
  type: KnowledgeType;
  title: string;
  content: string;
  topic: Topic;
  source: string;
  sourceUrl?: string;
  author?: string;
  tags: string[];
  estimatedReadSeconds: number;
  audioUrl?: string;
  image?: string;
  relatedItems?: string[];
  takeaway?: string;
  quote?: string;
  quiz?: { options: string[]; correctIndex: number; explanation: string };
  accent?: "peach" | "sage" | "lavender" | "ink" | "cream";
}
export interface AudioEpisode {
  id: string;
  title: string;
  description: string;
  topic: Topic;
  durationSeconds: number;
  audioUrl?: string;
  relatedItems: string[];
  accent: "peach" | "sage" | "lavender";
}
export interface LearningSession {
  id: string;
  title: string;
  description: string;
  estimatedMinutes: number;
  itemIds: string[];
  accent: "peach" | "sage" | "lavender";
}
