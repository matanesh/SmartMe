import test from "node:test";
import assert from "node:assert/strict";
import { getDailyProgressLabel } from "../src/lib/progress-label";

test("daily progress label describes interaction without claiming learning", () => {
  assert.equal(getDailyProgressLabel(0), "כל רעיון הוא התחלה");
  assert.equal(getDailyProgressLabel(1), "עצרת היום על רעיון אחד");
  assert.equal(getDailyProgressLabel(3), "עצרת היום על 3 רעיונות");

  for (const count of [0, 1, 3]) {
    assert.doesNotMatch(getDailyProgressLabel(count), /למדת|הבנת|השגת/);
  }
});
