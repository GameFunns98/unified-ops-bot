import "./config/env";
import { startBot } from "./bot/start-bot";
import { postgres } from "./db/postgres";
import { logger } from "./lib/logger";
import { startMemberSyncWorker } from "./workers/member-sync-worker";
import { startQuotaWorker } from "./workers/quota-worker";

async function bootstrap() {
  logger.info("Starting unified-ops-bot");

  const client = await startBot();
  const memberSyncWorker = startMemberSyncWorker(client);
  startQuotaWorker();

  const shutdown = async (signal: string) => {
    logger.info(`Received ${signal}, shutting down`);
    memberSyncWorker.stop();
    await client.destroy();
    await postgres.end();
    process.exit(0);
  };

  process.once("SIGINT", () => void shutdown("SIGINT"));
  process.once("SIGTERM", () => void shutdown("SIGTERM"));

  logger.info("Unified Ops Bot is running");
}

bootstrap().catch((error) => {
  logger.error("Fatal startup error", error);
  process.exit(1);
});
