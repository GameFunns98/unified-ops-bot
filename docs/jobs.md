# Jobs

## Discord sync worker
The bot executes Discord sync jobs from PostgreSQL.

### Table contract
Default table name: `discord_sync_jobs` (override with `DISCORD_SYNC_JOB_TABLE`).

Expected columns:
- `id` (uuid/text/integer)
- `job_type` (`NICKNAME_UPDATE` | `ROLE_SYNC`)
- `payload` (jsonb)
- `status` (`QUEUED` | `IN_PROGRESS` | `COMPLETED` | `FAILED`)
- `attempts` (integer, nullable)
- `result` (jsonb, nullable)
- `error_message` (text, nullable)
- `error_details` (jsonb, nullable)
- `created_at` (timestamp)
- `updated_at` (timestamp)
- `started_at` (timestamp, nullable)
- `completed_at` (timestamp, nullable)

The worker claims jobs using `FOR UPDATE SKIP LOCKED`, marks them `IN_PROGRESS`, executes the Discord action, then persists success/failure metadata.

### Supported job payloads
#### `NICKNAME_UPDATE`
```json
{
  "guildId": "123",
  "userId": "456",
  "nickname": "Officer Jane",
  "reason": "Sync from roster"
}
```

#### `ROLE_SYNC`
```json
{
  "guildId": "123",
  "userId": "456",
  "addRoleIds": ["roleA"],
  "removeRoleIds": ["roleB"],
  "reason": "Sync from roster"
}
```

or full set mode:

```json
{
  "guildId": "123",
  "userId": "456",
  "setRoleIds": ["roleA", "roleC"],
  "reason": "Sync from roster"
}
```
