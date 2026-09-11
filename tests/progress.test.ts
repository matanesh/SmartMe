import test from "node:test";
import assert from "node:assert/strict";
import {
  EMPTY_PROGRESS,
  localDay,
  markItemRead,
  parseProgress,
  toggleId,
} from "../src/lib/progress";

test("corrupt, absent, and unsupported saved data recover safely", () => {
  for (const raw of [null, "{broken", "null", "[]", '{"version":2}'])
    assert.deepEqual(parseProgress(raw), EMPTY_PROGRESS);
});
test("valid parts survive malformed fields; identifiers are unique", () => {
  const result = parseProgress(
    JSON.stringify({
      version: 1,
      savedIds: ["a", "a", 4, null],
      likedIds: "bad",
      readsByDay: { "2026-09-11": ["a", "a"], oops: ["bad"] },
      sessionProgress: { brain: 3, bad: -1, overshoot: 6, float: 1.2 },
    }),
  );
  assert.deepEqual(result.savedIds, ["a"]);
  assert.deepEqual(result.likedIds, []);
  assert.deepEqual(result.readsByDay, { "2026-09-11": ["a"] });
  assert.deepEqual(result.sessionProgress, { brain: 3 });
});
test("same idea counts only once per local day and counts on a new day", () => {
  const first = markItemRead(EMPTY_PROGRESS, "brain", "2026-09-11");
  assert.equal(markItemRead(first, "brain", "2026-09-11"), first);
  assert.deepEqual(markItemRead(first, "brain", "2026-09-12").readsByDay, {
    "2026-09-11": ["brain"],
    "2026-09-12": ["brain"],
  });
  assert.deepEqual(EMPTY_PROGRESS.readsByDay, {});
});
test("read history is bounded to the latest 30 local dates", () => {
  let progress = EMPTY_PROGRESS;
  for (let d = 1; d <= 31; d++)
    progress = markItemRead(
      progress,
      "idea",
      `2026-08-${String(d).padStart(2, "0")}`,
    );
  assert.equal(Object.keys(progress.readsByDay).length, 30);
  assert.equal(progress.readsByDay["2026-08-01"], undefined);
});
test("save and unsave do not mutate previous state", () => {
  const ids = ["a"];
  assert.deepEqual(toggleId(ids, "a"), []);
  assert.deepEqual(toggleId(ids, "b"), ["a", "b"]);
  assert.deepEqual(ids, ["a"]);
});
test("local calendar date is used rather than UTC slicing", () => {
  assert.equal(localDay(new Date(2026, 8, 11, 0, 5)), "2026-09-11");
});
