import "./config/env";
import { logger } from "./lib/logger";
import { startBot } from "./bot/start-bot";
import { startMemberSyncWorker } from "./workers/member-sync-worker";
import { startQuotaWorker } from "./workers/quota-worker";

async function bootstrap() {
  logger.info("Starting unified-ops-bot");

  startMemberSyncWorker();
  startQuotaWorker();

  await startBot();

  logger.info("Unified Ops Bot is running");
}

bootstrap().catch((error) => {
  logger.error("Fatal startup error", error);
  process.exit(1);
});