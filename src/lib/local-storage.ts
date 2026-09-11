"use client";
import { EMPTY_PROGRESS, parseProgress, type UserProgress } from "./progress";

export interface ProgressStorage {
  load(): UserProgress;
  save(progress: UserProgress): void;
}
export const STORAGE_KEY = "rega.progress.v1";
export const localProgressStorage: ProgressStorage = {
  load: () => parseProgress(window.localStorage.getItem(STORAGE_KEY)),
  save: (progress) =>
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress)),
};

interface Snapshot {
  progress: UserProgress;
  storageAvailable: boolean;
}
const serverSnapshot: Snapshot = {
  progress: EMPTY_PROGRESS,
  storageAvailable: true,
};
let snapshot = serverSnapshot;
let initialized = false;
const listeners = new Set<() => void>();
function emit() {
  listeners.forEach((listener) => listener());
}
export const progressStore = {
  subscribe(listener: () => void) {
    listeners.add(listener);
    const onStorage = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY || event.key === null) {
        initialized = false;
        progressStore.getSnapshot();
        emit();
      }
    };
    window.addEventListener("storage", onStorage);
    return () => {
      listeners.delete(listener);
      window.removeEventListener("storage", onStorage);
    };
  },
  getSnapshot(): Snapshot {
    if (!initialized && typeof window !== "undefined") {
      initialized = true;
      try {
        snapshot = {
          progress: localProgressStorage.load(),
          storageAvailable: true,
        };
      } catch {
        snapshot = { progress: EMPTY_PROGRESS, storageAvailable: false };
      }
    }
    return snapshot;
  },
  getServerSnapshot: () => serverSnapshot,
  update(updater: (progress: UserProgress) => UserProgress) {
    const progress = updater(progressStore.getSnapshot().progress);
    let storageAvailable = true;
    try {
      localProgressStorage.save(progress);
    } catch {
      storageAvailable = false;
    }
    snapshot = { progress, storageAvailable };
    emit();
  },
};
