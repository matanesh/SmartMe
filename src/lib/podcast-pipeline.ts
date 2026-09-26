import { createHash } from "node:crypto";

export const PODCAST_STATES = [
  "new",
  "researching",
  "source_ready",
  "script_ready",
  "generation_blocked",
  "generating",
  "media_ready",
  "qa_failed",
  "draft_ready",
  "approved",
  "published",
] as const;

export type PodcastState = (typeof PODCAST_STATES)[number];
export type RightsStatus =
  | "public-domain"
  | "open-license"
  | "directly-licensed"
  | "original"
  | "reference-only"
  | "blocked";

export interface PodcastIdea {
  ideaId: string;
  title: string;
  brief: string;
  language: "he-IL";
  requestedAt: string;
}

export interface PodcastSource {
  sourceId: string;
  title: string;
  url: string;
  publisher: string;
  retrievedAt: string;
  retrievalEvidenceUrl?: string;
  rightsStatus: RightsStatus;
  license?: string;
  adaptationAllowed: boolean;
  notes: string;
}

export interface SourcePacket {
  packetId: string;
  ideaId: string;
  sources: PodcastSource[];
  factCheckNotes: string[];
  rightsReviewedAt: string;
}

export interface PodcastScript {
  scriptId: string;
  title: string;
  language: "he-IL";
  exactNarration: string;
  sourceIds: string[];
  aiDisclosure: string;
  targetDurationSeconds: number;
  approvedForGeneration: boolean;
}

export interface ProviderConfig {
  provider: "google-cloud-gemini-tts" | "gemini-notebook-enterprise";
  model: string;
  enabled: boolean;
  officialDocumentationUrl: string;
  authorizationCheckedAt?: string;
}

export interface MediaEvidence {
  path: string;
  sha256: string;
  format: "mp3" | "wav" | "ogg";
  durationSeconds: number;
  meanVolumeDb: number;
  transcriptPath: string;
  browserPlaybackPassed: boolean;
  seekPassed: boolean;
}

export interface QaReport {
  checkedAt: string;
  mediaDecodable: boolean;
  durationPassed: boolean;
  nonSilent: boolean;
  transcriptCompared: boolean;
  factsAndNamesPassed: boolean;
  provenanceComplete: boolean;
  browserPlaybackPassed: boolean;
  seekPassed: boolean;
  passed: boolean;
  failures: string[];
}

export interface PipelineEvent {
  at: string;
  from: PodcastState | null;
  to: PodcastState;
  reason: string;
}

export interface PodcastJob {
  schemaVersion: 1;
  jobId: string;
  idempotencyKey: string;
  state: PodcastState;
  idea: PodcastIdea;
  sourcePacket?: SourcePacket;
  script?: PodcastScript;
  provider?: ProviderConfig;
  media?: MediaEvidence;
  qa?: QaReport;
  blocker?: string;
  events: PipelineEvent[];
}

const stableHash = (value: unknown) =>
  createHash("sha256").update(JSON.stringify(value)).digest("hex");

const assertHttpsUrl = (url: string) => {
  const parsed = new URL(url);
  if (parsed.protocol !== "https:")
    throw new Error(`source must use HTTPS: ${url}`);
};

const assertTimestamp = (value: string, label: string) => {
  if (!value || Number.isNaN(Date.parse(value)))
    throw new Error(`${label} must be an ISO-compatible timestamp`);
};

const transition = (
  job: PodcastJob,
  to: PodcastState,
  reason: string,
  at: string,
): PodcastJob => ({
  ...job,
  state: to,
  events: [...job.events, { at, from: job.state, to, reason }],
});

export function createPodcastJob(idea: PodcastIdea): PodcastJob {
  if (!idea.title.trim() || !idea.brief.trim())
    throw new Error("idea title and brief are required");
  assertTimestamp(idea.requestedAt, "idea requestedAt");
  const idempotencyKey = stableHash({
    ideaId: idea.ideaId,
    title: idea.title.trim(),
    brief: idea.brief.trim(),
    language: idea.language,
  });
  return {
    schemaVersion: 1,
    jobId: `podcast-${idempotencyKey.slice(0, 16)}`,
    idempotencyKey,
    state: "new",
    idea,
    events: [
      {
        at: idea.requestedAt,
        from: null,
        to: "new",
        reason: "idea accepted with deterministic idempotency key",
      },
    ],
  };
}

export function attachSourcePacket(
  job: PodcastJob,
  packet: SourcePacket,
  at: string,
): PodcastJob {
  if (packet.ideaId !== job.idea.ideaId)
    throw new Error("source packet does not belong to this idea");
  if (packet.sources.length < 2)
    throw new Error("at least two sources are required");
  if (!packet.factCheckNotes.length)
    throw new Error("source packet requires fact-check notes");
  assertTimestamp(packet.rightsReviewedAt, "rightsReviewedAt");
  const sourceIds = new Set<string>();
  for (const source of packet.sources) {
    if (!source.sourceId.trim() || sourceIds.has(source.sourceId))
      throw new Error(
        `source IDs must be non-empty and unique: ${source.sourceId}`,
      );
    sourceIds.add(source.sourceId);
    assertHttpsUrl(source.url);
    if (source.retrievalEvidenceUrl)
      assertHttpsUrl(source.retrievalEvidenceUrl);
    assertTimestamp(source.retrievedAt, `retrievedAt for ${source.sourceId}`);
    if (!source.publisher.trim() || !source.notes.trim())
      throw new Error(`source provenance is incomplete: ${source.sourceId}`);
    if (source.rightsStatus === "blocked" || !source.adaptationAllowed)
      throw new Error(
        `source is not cleared for adaptation: ${source.sourceId}`,
      );
  }
  return transition(
    { ...job, sourcePacket: packet, blocker: undefined },
    "source_ready",
    "source URLs retrieved and rights review recorded",
    at,
  );
}

export function attachScript(
  job: PodcastJob,
  script: PodcastScript,
  at: string,
): PodcastJob {
  if (!job.sourcePacket || job.state !== "source_ready")
    throw new Error("a cleared source packet is required before a script");
  const packetSourceIds = new Set(
    job.sourcePacket.sources.map((source) => source.sourceId),
  );
  if (
    !script.sourceIds.length ||
    !script.sourceIds.every((id) => packetSourceIds.has(id))
  )
    throw new Error("script references an unknown source");
  if (!script.exactNarration.trim() || !script.aiDisclosure.trim())
    throw new Error("exact narration and AI disclosure are required");
  if (script.targetDurationSeconds <= 0)
    throw new Error("target duration must be positive");
  if (!script.approvedForGeneration)
    throw new Error("script must be approved for generation");
  return transition(
    { ...job, script, blocker: undefined },
    "script_ready",
    "exact source-linked narration approved for generation",
    at,
  );
}

export function requestGeneration(
  job: PodcastJob,
  provider: ProviderConfig,
  at: string,
): PodcastJob {
  if (job.state !== "script_ready" || !job.script)
    throw new Error("an approved script is required before generation");
  assertHttpsUrl(provider.officialDocumentationUrl);
  if (!provider.enabled) {
    const blocker =
      "Provider disabled: no verified authorized Google Cloud project, billing, API enablement, or application credentials.";
    return transition(
      { ...job, provider, blocker },
      "generation_blocked",
      blocker,
      at,
    );
  }
  if (!provider.authorizationCheckedAt)
    throw new Error(
      "enabled provider requires an authorization check timestamp",
    );
  return transition(
    { ...job, provider, blocker: undefined },
    "generating",
    "authorized official provider accepted the generation request",
    at,
  );
}

export function attachMedia(
  job: PodcastJob,
  media: MediaEvidence,
  at: string,
): PodcastJob {
  if (job.state !== "generating")
    throw new Error("media can only be attached to a generating job");
  if (
    !media.sha256 ||
    media.durationSeconds <= 0 ||
    !media.transcriptPath.trim()
  )
    throw new Error(
      "media checksum, positive duration, and transcript path are required",
    );
  return transition(
    { ...job, media, blocker: undefined },
    "media_ready",
    "candidate media persisted with technical evidence",
    at,
  );
}

export function evaluateQa(
  job: PodcastJob,
  factsAndNamesPassed: boolean,
  transcriptCompared: boolean,
  provenanceComplete: boolean,
  at: string,
): PodcastJob {
  if (job.state !== "media_ready" || !job.media || !job.script)
    throw new Error("candidate media and script are required for QA");
  const checks = {
    mediaDecodable: ["mp3", "wav", "ogg"].includes(job.media.format),
    durationPassed:
      job.media.durationSeconds >= job.script.targetDurationSeconds * 0.75 &&
      job.media.durationSeconds <= job.script.targetDurationSeconds * 1.35,
    nonSilent:
      Number.isFinite(job.media.meanVolumeDb) && job.media.meanVolumeDb > -50,
    transcriptCompared,
    factsAndNamesPassed,
    provenanceComplete,
    browserPlaybackPassed: job.media.browserPlaybackPassed,
    seekPassed: job.media.seekPassed,
  };
  const failures = Object.entries(checks)
    .filter(([, passed]) => !passed)
    .map(([name]) => name);
  const report: QaReport = {
    checkedAt: at,
    ...checks,
    passed: failures.length === 0,
    failures,
  };
  return transition(
    { ...job, qa: report, blocker: failures.join(", ") || undefined },
    report.passed ? "draft_ready" : "qa_failed",
    report.passed
      ? "all media, content, provenance, and browser gates passed"
      : `QA failed: ${failures.join(", ")}`,
    at,
  );
}

export function approveDraft(job: PodcastJob, at: string): PodcastJob {
  if (job.state !== "draft_ready" || !job.qa?.passed)
    throw new Error("only a fully passing draft can be approved");
  return transition(job, "approved", "first-episode approval gate passed", at);
}

export function publishEpisode(job: PodcastJob, at: string): PodcastJob {
  if (job.state !== "approved")
    throw new Error("only an approved episode can be published");
  return transition(job, "published", "catalog publication completed", at);
}
