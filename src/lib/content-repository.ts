import { knowledgeItems } from "@/data/knowledge";
import { audioEpisodes, learningSessions } from "@/data/collections";
import type { KnowledgeItem, Topic } from "./models";

// The UI asks this repository for content. A remote adapter can replace it later.
export const contentRepository = {
  getItems: (topic?: Topic): KnowledgeItem[] =>
    topic
      ? knowledgeItems.filter((item) => item.topic === topic)
      : knowledgeItems,
  getItem: (id: string) => knowledgeItems.find((item) => item.id === id),
  getSessions: () => learningSessions,
  getSession: (id: string) =>
    learningSessions.find((session) => session.id === id),
  getEpisodes: () => audioEpisodes,
};
