import type { Client } from "discord.js";
import { logger } from "../lib/logger";

export function registerBotEvents(client: Client) {
  client.once("ready", () => {
    logger.info("Bot is ready as", client.user?.tag);
  });

  client.on("guildCreate", (guild) => {
    logger.info("Joined guild", guild.name);
  });
}