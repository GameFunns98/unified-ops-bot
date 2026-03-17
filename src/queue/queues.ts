import { Queue } from "bullmq";
import { redisConnection } from "./connection";

export const memberSyncQueue = new Queue("member-sync", {
  connection: redisConnection
});

export const quotaQueue = new Queue("quota-check", {
  connection: redisConnection
});
