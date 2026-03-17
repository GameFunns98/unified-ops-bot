import type { PoolClient } from "pg";
import { env } from "../config/env";
import { postgres } from "../db/postgres";
import type { DiscordSyncJob } from "./types";

const VALID_IDENTIFIER = /^[a-zA-Z_][a-zA-Z0-9_]*$/;

function getTableName() {
  if (!VALID_IDENTIFIER.test(env.DISCORD_SYNC_JOB_TABLE)) {
    throw new Error(`Invalid DISCORD_SYNC_JOB_TABLE value: ${env.DISCORD_SYNC_JOB_TABLE}`);
  }

  return env.DISCORD_SYNC_JOB_TABLE;
}

export async function claimNextQueuedDiscordSyncJob(): Promise<DiscordSyncJob | null> {
  const client = await postgres.connect();
  const table = getTableName();

  try {
    await client.query("BEGIN");

    const query = `
      WITH next_job AS (
        SELECT id
        FROM "${table}"
        WHERE status = 'QUEUED'
        ORDER BY created_at ASC
        FOR UPDATE SKIP LOCKED
        LIMIT 1
      )
      UPDATE "${table}" jobs
      SET
        status = 'IN_PROGRESS',
        started_at = NOW(),
        updated_at = NOW(),
        attempts = COALESCE(jobs.attempts, 0) + 1
      FROM next_job
      WHERE jobs.id = next_job.id
      RETURNING jobs.id::text, jobs.job_type::text, jobs.payload;
    `;

    const result = await client.query(query);
    await client.query("COMMIT");

    const row = result.rows[0];
    if (!row) {
      return null;
    }

    return {
      id: row.id,
      type: row.job_type,
      payload: row.payload
    };
  } catch (error) {
    await rollbackSafely(client);
    throw error;
  } finally {
    client.release();
  }
}

export async function markDiscordSyncJobCompleted(jobId: string, result: unknown) {
  const table = getTableName();

  await postgres.query(
    `
      UPDATE "${table}"
      SET
        status = 'COMPLETED',
        result = $2::jsonb,
        error_message = NULL,
        error_details = NULL,
        completed_at = NOW(),
        updated_at = NOW()
      WHERE id = $1;
    `,
    [jobId, JSON.stringify(result)]
  );
}

export async function markDiscordSyncJobFailed(jobId: string, error: Error, details: unknown) {
  const table = getTableName();

  await postgres.query(
    `
      UPDATE "${table}"
      SET
        status = 'FAILED',
        error_message = $2,
        error_details = $3::jsonb,
        completed_at = NOW(),
        updated_at = NOW()
      WHERE id = $1;
    `,
    [jobId, error.message, JSON.stringify(details)]
  );
}

async function rollbackSafely(client: PoolClient) {
  try {
    await client.query("ROLLBACK");
  } catch {
    // noop
  }
}
