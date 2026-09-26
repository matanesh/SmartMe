import test from "node:test";
import assert from "node:assert/strict";
import {
  approveDraft,
  attachMedia,
  attachScript,
  attachSourcePacket,
  createPodcastJob,
  evaluateQa,
  publishEpisode,
  requestGeneration,
  type PodcastIdea,
  type PodcastScript,
  type SourcePacket,
} from "../src/lib/podcast-pipeline";

const idea: PodcastIdea = {
  ideaId: "sample-biases-he",
  title: "איך מסגור ועיגון משפיעים על בחירות",
  brief: "פרק קצר ומקורי שמחבר בין שני מחקרים קלאסיים.",
  language: "he-IL",
  requestedAt: "2026-09-26T00:00:00.000Z",
};
const packet: SourcePacket = {
  packetId: "packet-sample-biases-he-v1",
  ideaId: idea.ideaId,
  rightsReviewedAt: "2026-09-26T00:01:00.000Z",
  factCheckNotes: ["No source prose is copied; claims are paraphrased."],
  sources: [
    {
      sourceId: "tversky-kahneman-1974",
      title: "Judgment under Uncertainty: Heuristics and Biases",
      url: "https://doi.org/10.1126/science.185.4157.1124",
      publisher: "Science",
      retrievedAt: "2026-09-26T00:01:00.000Z",
      rightsStatus: "reference-only",
      adaptationAllowed: true,
      notes: "Facts used as reference; protected prose is not reproduced.",
    },
    {
      sourceId: "tversky-kahneman-1981",
      title: "The Framing of Decisions and the Psychology of Choice",
      url: "https://doi.org/10.1126/science.7455683",
      publisher: "Science",
      retrievedAt: "2026-09-26T00:01:00.000Z",
      rightsStatus: "reference-only",
      adaptationAllowed: true,
      notes: "Facts used as reference; protected prose is not reproduced.",
    },
  ],
};
const script: PodcastScript = {
  scriptId: "script-sample-biases-he-v1",
  title: idea.title,
  language: "he-IL",
  exactNarration: "זהו תסריט מקורי לדוגמת pipeline, ולא פרק שפורסם.",
  sourceIds: packet.sources.map((source) => source.sourceId),
  aiDisclosure: "הקול, אם יופק, יהיה קול AI.",
  targetDurationSeconds: 180,
  approvedForGeneration: true,
};

test("the same idea creates the same idempotency key and job id", () => {
  const first = createPodcastJob(idea);
  const second = createPodcastJob({
    ...idea,
    requestedAt: "2027-01-01T00:00:00Z",
  });
  assert.equal(first.idempotencyKey, second.idempotencyKey);
  assert.equal(first.jobId, second.jobId);
});

test("a source packet fails closed on uncleared sources", () => {
  const blocked = structuredClone(packet);
  blocked.sources[0].adaptationAllowed = false;
  assert.throws(
    () => attachSourcePacket(createPodcastJob(idea), blocked, idea.requestedAt),
    /not cleared for adaptation/,
  );
});

test("the official provider remains blocked without verified authorization", () => {
  let job = createPodcastJob(idea);
  job = attachSourcePacket(job, packet, "2026-09-26T00:02:00Z");
  job = attachScript(job, script, "2026-09-26T00:03:00Z");
  job = requestGeneration(
    job,
    {
      provider: "google-cloud-gemini-tts",
      model: "gemini-2.5-flash-tts",
      enabled: false,
      officialDocumentationUrl:
        "https://docs.cloud.google.com/text-to-speech/docs/gemini-tts",
    },
    "2026-09-26T00:04:00Z",
  );
  assert.equal(job.state, "generation_blocked");
  assert.match(
    job.blocker ?? "",
    /no verified authorized Google Cloud project/,
  );
  assert.equal(job.media, undefined);
});

test("publishing is impossible until every media and browser QA gate passes", () => {
  let job = createPodcastJob(idea);
  job = attachSourcePacket(job, packet, "2026-09-26T00:02:00Z");
  job = attachScript(job, script, "2026-09-26T00:03:00Z");
  job = requestGeneration(
    job,
    {
      provider: "google-cloud-gemini-tts",
      model: "gemini-2.5-flash-tts",
      enabled: true,
      authorizationCheckedAt: "2026-09-26T00:04:00Z",
      officialDocumentationUrl:
        "https://docs.cloud.google.com/text-to-speech/docs/gemini-tts",
    },
    "2026-09-26T00:04:01Z",
  );
  job = attachMedia(
    job,
    {
      path: "candidate.mp3",
      sha256: "a".repeat(64),
      format: "mp3",
      durationSeconds: 180,
      meanVolumeDb: -18,
      transcriptPath: "candidate.txt",
      browserPlaybackPassed: false,
      seekPassed: false,
    },
    "2026-09-26T00:05:00Z",
  );
  job = evaluateQa(job, true, true, true, "2026-09-26T00:06:00Z");
  assert.equal(job.state, "qa_failed");
  assert.deepEqual(job.qa?.failures, ["browserPlaybackPassed", "seekPassed"]);
  assert.throws(() => approveDraft(job, "2026-09-26T00:07:00Z"));
  assert.throws(() => publishEpisode(job, "2026-09-26T00:08:00Z"));
});
