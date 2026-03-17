import { z } from "zod";

const envSchema = z.object({
  DISCORD_BOT_TOKEN: z.string().min(1),
  DISCORD_CLIENT_ID: z.string().min(1),
  DISCORD_GUILD_ID: z.string().min(1),
  REDIS_URL: z.string().min(1),
  DATABASE_URL: z.string().min(1),
  BOT_LOG_LEVEL: z.string().default("info"),
  DISCORD_SYNC_JOB_TABLE: z.string().default("discord_sync_jobs"),
  DISCORD_SYNC_POLL_INTERVAL_MS: z.coerce.number().int().positive().default(2000)
});

export const env = envSchema.parse({
  DISCORD_BOT_TOKEN: process.env.DISCORD_BOT_TOKEN,
  DISCORD_CLIENT_ID: process.env.DISCORD_CLIENT_ID,
  DISCORD_GUILD_ID: process.env.DISCORD_GUILD_ID,
  REDIS_URL: process.env.REDIS_URL,
  DATABASE_URL: process.env.DATABASE_URL,
  BOT_LOG_LEVEL: process.env.BOT_LOG_LEVEL ?? "info",
  DISCORD_SYNC_JOB_TABLE: process.env.DISCORD_SYNC_JOB_TABLE,
  DISCORD_SYNC_POLL_INTERVAL_MS: process.env.DISCORD_SYNC_POLL_INTERVAL_MS
});
