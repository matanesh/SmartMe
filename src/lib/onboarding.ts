import { TOPICS, type Topic } from "./models";

export const ONBOARDING_STORAGE_KEY = "rega.onboarding.v1";
export type ContentFormat = "read" | "listen" | "both";
export interface OnboardingPreferences {
  topics: Topic[];
  format: ContentFormat;
}

export function parseOnboardingPreferences(
  raw: string | null,
): OnboardingPreferences | null {
  try {
    const value: unknown = raw ? JSON.parse(raw) : null;
    if (!value || typeof value !== "object") return null;
    const candidate = value as { topics?: unknown; format?: unknown };
    if (!Array.isArray(candidate.topics)) return null;
    if (!["read", "listen", "both"].includes(String(candidate.format)))
      return null;
    return {
      topics: candidate.topics.filter((topic): topic is Topic =>
        TOPICS.includes(topic as Topic),
      ),
      format: candidate.format as ContentFormat,
    };
  } catch {
    return null;
  }
}
