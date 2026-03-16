import { startBot } from "./bot/start-bot";
import { startMemberSyncWorker } from "./workers/member-sync-worker";
import { startQuotaWorker } from "./workers/quota-worker";
import { logger } from "./lib/logger";
import "./config/env";

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