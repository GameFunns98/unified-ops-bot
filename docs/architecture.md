# Bot Architecture

## Responsibilities
- sync Discord roles
- sync nicknames
- process queued jobs
- emit notifications
- scheduled checks

## Discord sync execution flow
1. Bot logs into Discord.
2. Worker polls PostgreSQL for `QUEUED` Discord sync jobs.
3. Worker atomically claims one job (`IN_PROGRESS`).
4. Worker executes nickname/role operation against Discord API.
5. Worker writes `COMPLETED` + `result` or `FAILED` + error metadata.
