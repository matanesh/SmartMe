import test from "node:test";
import assert from "node:assert/strict";
import { progressStore, STORAGE_KEY } from "../src/lib/local-storage";

test("blocked storage falls back to memory and recovers when writes work again", () => {
  const original = Object.getOwnPropertyDescriptor(globalThis, "window");
  const fakeWindow: { localStorage: Pick<Storage, "getItem" | "setItem"> } = {
    localStorage: {
      getItem: (): string | null => {
        throw new Error("storage blocked");
      },
      setItem: (): void => {
        throw new Error("quota exceeded");
      },
    },
  };
  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: fakeWindow,
  });
  try {
    assert.equal(progressStore.getSnapshot().storageAvailable, false);
    progressStore.update((progress) => ({
      ...progress,
      savedIds: ["brain-shortcuts"],
    }));
    assert.deepEqual(progressStore.getSnapshot().progress.savedIds, [
      "brain-shortcuts",
    ]);
    assert.equal(progressStore.getSnapshot().storageAvailable, false);
    const written = new Map<string, string>();
    fakeWindow.localStorage.setItem = (key, value) => {
      written.set(key, value);
    };
    progressStore.update((progress) => ({
      ...progress,
      likedIds: ["brain-shortcuts"],
    }));
    assert.equal(progressStore.getSnapshot().storageAvailable, true);
    assert.deepEqual(JSON.parse(written.get(STORAGE_KEY)!).savedIds, [
      "brain-shortcuts",
    ]);
  } finally {
    if (original) Object.defineProperty(globalThis, "window", original);
    else Reflect.deleteProperty(globalThis, "window");
  }
});
