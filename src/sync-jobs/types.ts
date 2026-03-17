export const syncJobStatuses = {
  QUEUED: "QUEUED",
  IN_PROGRESS: "IN_PROGRESS",
  COMPLETED: "COMPLETED",
  FAILED: "FAILED"
} as const;

export type SyncJobStatus = (typeof syncJobStatuses)[keyof typeof syncJobStatuses];

export const discordSyncJobTypes = {
  NICKNAME_UPDATE: "NICKNAME_UPDATE",
  ROLE_SYNC: "ROLE_SYNC"
} as const;

export type DiscordSyncJobType = (typeof discordSyncJobTypes)[keyof typeof discordSyncJobTypes];

export type NicknameUpdatePayload = {
  guildId: string;
  userId: string;
  nickname: string | null;
  reason?: string;
};

export type RoleSyncPayload = {
  guildId: string;
  userId: string;
  addRoleIds?: string[];
  removeRoleIds?: string[];
  setRoleIds?: string[];
  reason?: string;
};

export type DiscordSyncPayload = NicknameUpdatePayload | RoleSyncPayload;

export type DiscordSyncJob = {
  id: string;
  type: DiscordSyncJobType;
  payload: DiscordSyncPayload;
};
