import { env } from "../config/env";

if (!env.REDIS_URL) {
  throw new Error("REDIS_URL is required to use BullMQ queue components");
}

export const redisConnection = {
  url: env.REDIS_URL,
  maxRetriesPerRequest: null
};
