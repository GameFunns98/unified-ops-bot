import { env } from "../config/env";
import { logger } from "../lib/logger";
import { createBotClient } from "./client";
import { registerBotEvents } from "./register-events";

export async function startBot() {
  const client = createBotClient();
  registerBotEvents(client);

  await client.login(env.DISCORD_BOT_TOKEN);
  logger.info("Discord login initialized");

  return client;
}