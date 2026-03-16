import { Worker } from "bullmq";
import { redis } from "../queue/connection";
import { logger } from "../lib/logger";

export function startMemberSyncWorker() {
  const worker = new Worker(
    "member-sync",
    async (job) => {
      logger.info("Processing member sync job", job.id, job.data);
      return { ok: true };
    },
    { connection: redis }
  );

  worker.on("completed", (job) => {
    logger.info("Member sync job completed", job.id);
  });

  worker.on("failed", (job, error) => {
    logger.error("Member sync job failed", job?.id, error);
  });

  return worker;
}