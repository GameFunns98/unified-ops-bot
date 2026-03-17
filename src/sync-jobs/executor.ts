import type { Client } from "discord.js";
import { discordSyncJobTypes, type DiscordSyncJob, type NicknameUpdatePayload, type RoleSyncPayload } from "./types";

export async function executeDiscordSyncJob(client: Client, job: DiscordSyncJob) {
  switch (job.type) {
    case discordSyncJobTypes.NICKNAME_UPDATE:
      return executeNicknameUpdate(client, job.payload as NicknameUpdatePayload);
    case discordSyncJobTypes.ROLE_SYNC:
      return executeRoleSync(client, job.payload as RoleSyncPayload);
    default:
      throw new Error(`Unsupported discord sync job type: ${job.type}`);
  }
}

async function executeNicknameUpdate(client: Client, payload: NicknameUpdatePayload) {
  const guild = await client.guilds.fetch(payload.guildId);
  const member = await guild.members.fetch(payload.userId);

  await member.setNickname(payload.nickname, payload.reason);

  return {
    operation: "NICKNAME_UPDATE",
    guildId: payload.guildId,
    userId: payload.userId,
    nickname: payload.nickname
  };
}

async function executeRoleSync(client: Client, payload: RoleSyncPayload) {
  const guild = await client.guilds.fetch(payload.guildId);
  const member = await guild.members.fetch(payload.userId);

  if (payload.setRoleIds) {
    await member.roles.set(payload.setRoleIds, payload.reason);
    return {
      operation: "ROLE_SYNC",
      mode: "set",
      guildId: payload.guildId,
      userId: payload.userId,
      roles: payload.setRoleIds
    };
  }

  const addRoleIds = payload.addRoleIds ?? [];
  const removeRoleIds = payload.removeRoleIds ?? [];

  if (addRoleIds.length > 0) {
    await member.roles.add(addRoleIds, payload.reason);
  }

  if (removeRoleIds.length > 0) {
    await member.roles.remove(removeRoleIds, payload.reason);
  }

  return {
    operation: "ROLE_SYNC",
    mode: "patch",
    guildId: payload.guildId,
    userId: payload.userId,
    addRoleIds,
    removeRoleIds
  };
}
