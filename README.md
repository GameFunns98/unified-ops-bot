# Unified Ops Bot (MVP)

Local Discord sync executor that polls PostgreSQL `DiscordSyncJob` records and executes Discord updates.

## MVP scope
- Login a Discord bot client
- Poll PostgreSQL for queued sync jobs
- Atomically claim jobs (`QUEUED` -> `IN_PROGRESS`)
- Execute nickname update and role sync operations
- Persist `COMPLETED`/`FAILED` status and result/error payloads

## Local setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy env and fill secrets:
   ```bash
   cp .env.example .env
   ```
3. Generate Prisma client:
   ```bash
   npm run prisma:generate
   ```
4. Run typecheck/build:
   ```bash
   npm run typecheck
   npm run build
   ```
5. Start bot:
   ```bash
   npm run dev
   ```

## Notes
- PostgreSQL is the source of truth for jobs.
- BullMQ files remain in the repo but are not started by default for MVP execution.
