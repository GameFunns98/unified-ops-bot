import type { Client } from "discord.js";
import { env } from "../config/env";
import { logger } from "../lib/logger";
import { executeDiscordSyncJob } from "../sync-jobs/executor";
import {
  claimNextQueuedDiscordSyncJob,
  markDiscordSyncJobCompleted,
  markDiscordSyncJobFailed
} from "../sync-jobs/repository";
import { validateDiscordSyncJob } from "../sync-jobs/validation";

export function startMemberSyncWorker(client: Client) {
  let inFlight = false;

  const poll = async () => {
    if (inFlight) {
      return;
    }

    inFlight = true;

    try {
      logger.info("Polling for queued Discord sync jobs");
      const job = await claimNextQueuedDiscordSyncJob();
      if (!job) {
        return;
      }

      logger.info("Picked Discord sync job", { id: job.id, type: job.type });

      try {
        const validatedPayload = validateDiscordSyncJob(job);
        const result = await executeDiscordSyncJob(client, job.type, validatedPayload);
        await markDiscordSyncJobCompleted(job.id, result);
        logger.info("Completed Discord sync job", { id: job.id, type: job.type });
      } catch (error) {
        const normalizedError = toError(error);
        await markDiscordSyncJobFailed(job.id, normalizedError, serializeError(error));
        logger.error("Failed Discord sync job", { id: job.id, type: job.type, error: normalizedError.message });
      }
    } catch (error) {
      logger.error("Failed while polling Discord sync jobs", error);
    } finally {
      inFlight = false;
    }
  };

  const timer = setInterval(() => {
    void poll();
  }, env.DISCORD_SYNC_POLL_INTERVAL_MS);

  void poll();

  logger.info("Member sync worker started", {
    pollIntervalMs: env.DISCORD_SYNC_POLL_INTERVAL_MS,
    table: env.DISCORD_SYNC_JOB_TABLE
  });

  return {
    stop: () => clearInterval(timer)
  };
}

function serializeError(error: unknown) {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack
    };
  }

  return { message: String(error) };
}

function toError(error: unknown) {
  if (error instanceof Error) {
    return error;
  }

  return new Error(String(error));
}
