import { Worker } from "bullmq";
import { redis } from "../queue/connection";
import { logger } from "../lib/logger";

export function startQuotaWorker() {
  const worker = new Worker(
    "quota-check",
    async (job) => {
      logger.info("Processing quota job", job.id, job.data);
      return { ok: true };
    },
    { connection: redis }
  );

  worker.on("completed", (job) => {
    logger.info("Quota job completed", job.id);
  });

  worker.on("failed", (job, error) => {
    logger.error("Quota job failed", job?.id, error);
  });

  return worker;
}