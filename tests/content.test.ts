import test from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { knowledgeItems } from "../src/data/knowledge";
import { learningSessions, audioEpisodes } from "../src/data/collections";
import { quickReads } from "../src/data/quick-reads";
import { TOPICS } from "../src/lib/models";
import {
  ONBOARDING_STORAGE_KEY,
  parseOnboardingPreferences,
} from "../src/lib/onboarding";

const ids = new Set(knowledgeItems.map((item) => item.id));
const expectedCatalogIds = [
  "brain-shortcuts",
  "habit-two-minutes",
  "venus-day",
  "money-sunk-cost",
  "career-feedback",
  "ai-confidence",
  "relations-listen",
  "history-web",
  "brain-anchor",
  "brain-frame",
  "brain-spotlight",
  "brain-confirm",
  "habit-environment",
  "habit-stack",
  "habit-reset",
  "habit-quote",
  "money-discount",
  "money-time",
  "money-unit",
  "money-opportunity",
  "career-next-step",
  "career-done",
  "career-question",
  "career-decisions",
  "ai-brief",
  "ai-token",
  "ai-compare",
  "ai-training",
  "ai-live-voice",
  "relations-specific",
  "relations-story",
  "relations-boundary",
  "relations-curious",
  "science-sun",
  "science-octopus",
  "science-moon",
  "science-correlation",
  "history-web-free",
  "history-stone",
  "history-zero",
  "history-map",
];
const itemById = (id: string) => {
  const item = knowledgeItems.find((candidate) => candidate.id === id);
  assert.ok(item, `missing editorial item: ${id}`);
  return item;
};

test("ai-training cites retrieval documentation that supports current external knowledge", () => {
  const item = itemById("ai-training");
  assert.equal(
    item.sourceUrl,
    "https://huggingface.co/docs/transformers/model_doc/rag",
  );
  assert.match(item.source, /Hugging Face · RAG/);
  assert.match(item.content, /משקלי מודל/);
  assert.match(item.content, /אינו מתעדכן/);
  assert.match(item.content, /מקור חיצוני/);
  assert.match(item.content, /חיפוש או אחזור/);
  assert.match(item.content, /שכבה נפרדת/);
});

test("history-web keeps its stable id while replacing the duplicate CERN story", () => {
  const item = itemById("history-web");
  assert.match(item.title, /אפולו 11/);
  assert.equal(
    item.sourceUrl,
    "https://www.nasa.gov/history/apollo-11-mission-overview/",
  );
  assert.match(item.content, /16 ביולי 1969/);
  assert.match(item.content, /מסלול חזרה חופשית/);
  assert.match(item.content, /בלי להפעיל מנוע/);
  assert.match(item.content, /משימת אפולו האחרונה/);
  assert.doesNotMatch(item.content, /CERN|רשת/);
});

test("habit-quote offers tracking rather than another small-start message", () => {
  const item = itemById("habit-quote");
  assert.ok(item.tags.includes("מעקב"));
  assert.match(item.content, /סימון/);
  assert.doesNotMatch(item.content, /גרסה הקטנה|חמש דקות/);
});

test("career-decisions uses a concrete decision-journal hook", () => {
  assert.match(itemById("career-decisions").title, /מה ישנה את דעתכם/);
});

test("science-octopus cites a browser-accessible museum source for its anatomy", () => {
  const item = itemById("science-octopus");
  assert.equal(
    item.sourceUrl,
    "https://www.nhm.ac.uk/discover/octopuses-keep-surprising-us-here-are-eight-examples-how.html",
  );
  assert.match(item.source, /Natural History Museum/);
  assert.match(item.content, /שלושה לבבות|שני לבבות/);
  assert.match(item.content, /המוציאנין/);
});

test("history-stone cites a browser-accessible source for all three scripts", () => {
  const item = itemById("history-stone");
  assert.equal(item.sourceUrl, "https://www.worldhistory.org/Rosetta_Stone/");
  assert.match(item.source, /World History Encyclopedia/);
  assert.match(item.content, /הירוגליפים/);
  assert.match(item.content, /דמוטית/);
  assert.match(item.content, /יוונית/);
});

test("history-map links to the accessible USGS projection manual page", () => {
  const item = itemById("history-map");
  assert.equal(item.sourceUrl, "https://pubs.usgs.gov/publication/pp1395");
  assert.match(item.source, /USGS/);
  assert.match(item.content, /מרקטור/);
  assert.match(item.content, /זוויות/);
  assert.match(item.content, /קטבים/);
});

test("AI news discovery becomes an original primary-source-backed card", () => {
  const item = itemById("ai-live-voice") as (typeof knowledgeItems)[number] & {
    discoveredVia?: { name: string; postUrl: string };
  };
  assert.equal(
    item.sourceUrl,
    "https://developers.openai.com/api/docs/models/gpt-live-1",
  );
  assert.match(item.source, /OpenAI Developers/);
  assert.match(item.content, /להאזין ולדבר באותו זמן/);
  assert.match(item.content, /סוכן אחורי/);
  assert.deepEqual(item.discoveredVia, {
    name: "חדשות טכנולוגיה",
    postUrl: "https://t.me/TechNewsHeb/11069",
  });
  assert.notEqual(item.sourceUrl, item.discoveredVia?.postUrl);
});

test("editorial catalog keeps exactly the contracted 41 stable ids", () => {
  assert.equal(knowledgeItems.length, 41);
  assert.equal(ids.size, knowledgeItems.length);
  assert.deepEqual([...ids].sort(), [...expectedCatalogIds].sort());
  for (const topic of TOPICS)
    assert.ok(
      knowledgeItems.filter((item) => item.topic === topic).length >= 4,
      topic,
    );
  assert.equal(new Set(knowledgeItems.map((item) => item.type)).size, 10);
  for (const item of knowledgeItems) {
    assert.match(item.title, /[א-ת]/);
    assert.match(item.content, /[א-ת]/);
    assert.ok(item.source && item.tags.length);
    assert.ok(
      item.estimatedReadSeconds >= 15 && item.estimatedReadSeconds <= 45,
    );
    if (item.sourceUrl)
      assert.equal(new URL(item.sourceUrl).protocol, "https:");
    for (const related of item.relatedItems ?? [])
      assert.ok(ids.has(related), related);
  }
});
test("every quiz has one in-range correct answer and an explanation", () => {
  for (const item of knowledgeItems.filter((item) => item.type === "quiz")) {
    assert.ok(item.quiz);
    assert.ok(
      item.quiz.correctIndex >= 0 &&
        item.quiz.correctIndex < item.quiz.options.length,
    );
    assert.equal(new Set(item.quiz.options).size, item.quiz.options.length);
    assert.ok(item.quiz.explanation.length > 30);
  }
});
test("sessions have exactly five distinct, resolvable ideas", () => {
  assert.ok(learningSessions.length >= 1);
  for (const session of learningSessions) {
    assert.equal(session.itemIds.length, 5);
    assert.equal(new Set(session.itemIds).size, 5);
    for (const id of session.itemIds) assert.ok(ids.has(id), id);
  }
});
test("audio catalog exposes only verified recordings with trust metadata", () => {
  assert.equal(audioEpisodes.length, 4);
  const realEpisodeUrls = new Map([
    ["atomic", "/audio/atomic-he.mp3"],
    ["biases", "/audio/biases-he.mp3"],
    ["meditations-control", "/audio/meditations-control-he.m4a"],
    ["pride-first-impression", "/audio/pride-first-impression-he.m4a"],
  ]);
  for (const episode of audioEpisodes) {
    assert.ok(episode.durationSeconds > 0);
    assert.match(episode.publishedAt, /^\d{4}-\d{2}-\d{2}$/);
    assert.match(episode.reviewedAt, /^\d{4}-\d{2}-\d{2}$/);
    assert.match(episode.checksumSha256, /^[a-f0-9]{64}$/);
    assert.ok(episode.transcript.length >= 5);
    assert.ok(episode.sources.length >= 3);
    assert.ok(episode.voiceDisclosure.length > 20);
    assert.ok(episode.editorialDisclosure.length > 20);
    assert.ok(episode.relatedItems.length > 0);
    for (const id of episode.relatedItems) assert.ok(ids.has(id), id);
    assert.equal(episode.audioUrl, realEpisodeUrls.get(episode.id));
    assert.ok(
      existsSync(resolve(process.cwd(), "public", episode.audioUrl.slice(1))),
      `missing static audio asset: ${episode.audioUrl}`,
    );
    for (const source of episode.sources)
      assert.equal(new URL(source.url).protocol, "https:");
  }
});

test("quick reads expose edition-level rights evidence and original Hebrew provenance", () => {
  assert.ok(quickReads.length >= 1);
  for (const quickRead of quickReads) {
    assert.match(quickRead.title, /[א-ת]/);
    assert.ok(
      quickRead.estimatedMinutes >= 2 && quickRead.estimatedMinutes <= 10,
    );
    assert.ok(quickRead.sections.length >= 3);
    assert.match(quickRead.editorialDisclosure, /עיבוד עברי מקורי/);
    assert.match(quickRead.editorialDisclosure, /לא תרגום/);
    assert.equal(quickRead.rights.status, "public-domain-source");
    assert.match(quickRead.rights.reviewedAt, /^\d{4}-\d{2}-\d{2}$/);
    assert.ok(quickRead.rights.jurisdictionsReviewed.length >= 2);
    assert.ok(
      quickRead.sources.some((source) => source.role === "source-edition"),
    );
    assert.ok(
      quickRead.sources.some((source) => source.role === "rights-policy"),
    );
    for (const source of quickRead.sources)
      assert.equal(new URL(source.url).protocol, "https:");
  }
});

test("onboarding preferences persist only valid topics and listening choices", () => {
  assert.equal(ONBOARDING_STORAGE_KEY, "rega.onboarding.v1");
  assert.deepEqual(
    parseOnboardingPreferences(
      JSON.stringify({ topics: ["מדע", "כסף", "לא נושא"], format: "listen" }),
    ),
    { topics: ["מדע", "כסף"], format: "listen" },
  );
  assert.equal(parseOnboardingPreferences("broken"), null);
});
