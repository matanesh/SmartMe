export interface UserProgress {
  version: 1;
  savedIds: string[];
  likedIds: string[];
  readsByDay: Record<string, string[]>;
  sessionProgress: Record<string, number>;
}
export const EMPTY_PROGRESS: UserProgress = {
  version: 1,
  savedIds: [],
  likedIds: [],
  readsByDay: {},
  sessionProgress: {},
};
export function localDay(date = new Date()): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
function stringArray(value: unknown): string[] {
  return Array.isArray(value)
    ? [
        ...new Set(
          value.filter(
            (v): v is string => typeof v === "string" && v.length < 100,
          ),
        ),
      ]
    : [];
}
export function parseProgress(raw: string | null): UserProgress {
  if (!raw) return EMPTY_PROGRESS;
  try {
    const value = JSON.parse(raw);
    if (!value || value.version !== 1) return EMPTY_PROGRESS;
    const readsByDay: Record<string, string[]> = {};
    const sessionProgress: Record<string, number> = {};
    if (value.readsByDay && typeof value.readsByDay === "object") {
      Object.entries(value.readsByDay)
        .filter(([day]) => /^\d{4}-\d{2}-\d{2}$/.test(day))
        .sort(([a], [b]) => b.localeCompare(a))
        .slice(0, 30)
        .forEach(([day, ids]) => {
          readsByDay[day] = stringArray(ids);
        });
    }
    if (value.sessionProgress && typeof value.sessionProgress === "object") {
      Object.entries(value.sessionProgress).forEach(([id, position]) => {
        if (
          /^[a-z0-9-]+$/.test(id) &&
          typeof position === "number" &&
          Number.isInteger(position) &&
          position >= 0 &&
          position <= 5
        )
          sessionProgress[id] = position;
      });
    }
    return {
      version: 1,
      savedIds: stringArray(value.savedIds),
      likedIds: stringArray(value.likedIds),
      readsByDay,
      sessionProgress,
    };
  } catch {
    return EMPTY_PROGRESS;
  }
}
export function toggleId(ids: string[], id: string): string[] {
  return ids.includes(id) ? ids.filter((value) => value !== id) : [...ids, id];
}
export function markItemRead(
  progress: UserProgress,
  id: string,
  day = localDay(),
): UserProgress {
  const today = progress.readsByDay[day] ?? [];
  if (today.includes(id)) return progress;
  const entries = Object.entries({
    ...progress.readsByDay,
    [day]: [...today, id],
  })
    .sort(([a], [b]) => b.localeCompare(a))
    .slice(0, 30);
  return { ...progress, readsByDay: Object.fromEntries(entries) };
}
