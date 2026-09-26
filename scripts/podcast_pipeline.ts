#!/usr/bin/env tsx
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { basename, resolve } from "node:path";
import {
  attachScript,
  attachSourcePacket,
  createPodcastJob,
  requestGeneration,
  type PodcastIdea,
  type PodcastScript,
  type SourcePacket,
} from "../src/lib/podcast-pipeline";

interface PipelineInput {
  idea: PodcastIdea;
  sourcePacket: SourcePacket;
  script: PodcastScript;
}

async function main() {
  const inputPath = resolve(
    process.argv[2] ?? "podcast-pilot/pipeline-examples/sample-biases-he.json",
  );
  const outputDirectory = resolve(
    process.argv[3] ?? ".hermes/podcast-pipeline/runs",
  );
  const raw = JSON.parse(await readFile(inputPath, "utf8")) as PipelineInput;

  let job = createPodcastJob(raw.idea);
  job = attachSourcePacket(
    job,
    raw.sourcePacket,
    raw.sourcePacket.rightsReviewedAt,
  );
  job = attachScript(job, raw.script, raw.sourcePacket.rightsReviewedAt);
  job = requestGeneration(
    job,
    {
      provider: "google-cloud-gemini-tts",
      model: "gemini-2.5-flash-tts",
      enabled: false,
      officialDocumentationUrl:
        "https://docs.cloud.google.com/text-to-speech/docs/gemini-tts",
    },
    new Date().toISOString(),
  );

  await mkdir(outputDirectory, { recursive: true });
  const outputPath = resolve(outputDirectory, `${job.jobId}.json`);
  await writeFile(outputPath, `${JSON.stringify(job, null, 2)}\n`, "utf8");
  console.log(
    JSON.stringify({
      input: basename(inputPath),
      output: outputPath,
      jobId: job.jobId,
      state: job.state,
      blocker: job.blocker,
      generatedMedia: false,
      published: false,
    }),
  );
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
