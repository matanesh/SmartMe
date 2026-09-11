"use client";
import { useSyncExternalStore } from "react";
import { progressStore } from "@/lib/local-storage";
import { localDay, markItemRead, toggleId } from "@/lib/progress";

function subscribeDay(listener: () => void) {
  const interval = window.setInterval(listener, 60_000);
  document.addEventListener("visibilitychange", listener);
  return () => {
    clearInterval(interval);
    document.removeEventListener("visibilitychange", listener);
  };
}
const getDay = () => localDay();
const getServerDay = () => "";
export function useProgress() {
  const { progress, storageAvailable } = useSyncExternalStore(
    progressStore.subscribe,
    progressStore.getSnapshot,
    progressStore.getServerSnapshot,
  );
  const day = useSyncExternalStore(subscribeDay, getDay, getServerDay);
  return {
    progress,
    storageAvailable,
    todayReads: progress.readsByDay[day] ?? [],
    toggleSaved: (id: string) =>
      progressStore.update((p) => ({
        ...p,
        savedIds: toggleId(p.savedIds, id),
      })),
    toggleLiked: (id: string) =>
      progressStore.update((p) => ({
        ...p,
        likedIds: toggleId(p.likedIds, id),
      })),
    markRead: (id: string) => progressStore.update((p) => markItemRead(p, id)),
    setSessionProgress: (id: string, step: number) =>
      progressStore.update((p) => ({
        ...p,
        sessionProgress: { ...p.sessionProgress, [id]: step },
      })),
  };
}
export type ProgressActions = ReturnType<typeof useProgress>;
