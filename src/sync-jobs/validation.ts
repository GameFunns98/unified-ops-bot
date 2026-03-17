import { z } from "zod";
import { discordSyncJobTypes, type DiscordSyncJob } from "./types";

const nicknameUpdatePayloadSchema = z.object({
  guildId: z.string().min(1),
  userId: z.string().min(1),
  nickname: z.string().nullable(),
  reason: z.string().optional()
});

const roleSyncPayloadSchema = z.object({
  guildId: z.string().min(1),
  userId: z.string().min(1),
  addRoleIds: z.array(z.string()).optional(),
  removeRoleIds: z.array(z.string()).optional(),
  setRoleIds: z.array(z.string()).optional(),
  reason: z.string().optional()
});

export function validateDiscordSyncJob(job: DiscordSyncJob) {
  if (job.type === discordSyncJobTypes.NICKNAME_UPDATE) {
    nicknameUpdatePayloadSchema.parse(job.payload);
    return;
  }

  if (job.type === discordSyncJobTypes.ROLE_SYNC) {
    roleSyncPayloadSchema.parse(job.payload);
    return;
  }

  throw new Error(`Unsupported discord sync job type: ${job.type}`);
}
