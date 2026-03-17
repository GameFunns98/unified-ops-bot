import { z } from "zod";
import {
  discordSyncJobTypes,
  type DiscordSyncJob,
  type DiscordSyncPayload,
  type NicknameUpdatePayload,
  type RoleSyncPayload
} from "./types";

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

export function validateDiscordSyncJob(job: DiscordSyncJob): DiscordSyncPayload {
  if (job.type === discordSyncJobTypes.NICKNAME_UPDATE) {
    return nicknameUpdatePayloadSchema.parse(job.payload) as NicknameUpdatePayload;
  }

  if (job.type === discordSyncJobTypes.ROLE_SYNC) {
    return roleSyncPayloadSchema.parse(job.payload) as RoleSyncPayload;
  }

  throw new Error(`Unsupported discord sync job type: ${job.type}`);
}
