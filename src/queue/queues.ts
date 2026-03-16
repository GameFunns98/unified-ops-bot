import { Queue } from "bullmq";
import { redis } from "./connection";

export const memberSyncQueue = new Queue("member-sync", {
  connection: redis
});

export const quotaQueue = new Queue("quota-check", {
  connection: redis
});