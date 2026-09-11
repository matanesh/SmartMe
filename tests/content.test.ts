import test from "node:test";
import assert from "node:assert/strict";
import { knowledgeItems } from "../src/data/knowledge";
import { learningSessions, audioEpisodes } from "../src/data/collections";
import { TOPICS } from "../src/lib/models";

const ids = new Set(knowledgeItems.map((item) => item.id));
test("editorial catalog has at least 35 unique Hebrew cards across all eight topics", () => {
  assert.ok(knowledgeItems.length >= 35);
  assert.equal(ids.size, knowledgeItems.length);
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
test("audio episodes reference real ideas and use explicit demo mode without a URL", () => {
  assert.ok(audioEpisodes.length >= 3);
  for (const episode of audioEpisodes) {
    assert.ok(episode.durationSeconds > 0);
    assert.ok(episode.relatedItems.length > 0);
    for (const id of episode.relatedItems) assert.ok(ids.has(id), id);
    assert.equal(episode.audioUrl, undefined);
  }
});
