"use client";
import { useSyncExternalStore } from "react";

function subscribe(listener: () => void) {
  window.addEventListener("hashchange", listener);
  return () => window.removeEventListener("hashchange", listener);
}
const snapshot = () => window.location.hash.slice(1) || "discover";
const serverSnapshot = () => "discover";
export function useRoute() {
  const route = useSyncExternalStore(subscribe, snapshot, serverSnapshot);
  return {
    route,
    navigate: (next: string) => {
      window.location.hash = next;
      window.scrollTo({ top: 0, behavior: "instant" });
    },
  };
}
