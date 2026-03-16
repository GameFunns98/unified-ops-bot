$ErrorActionPreference = "Stop"

# =========================
# CONFIG
# =========================
$RepoName = "unified-ops-bot"
$GitHubUsername = "GameFunns98"

# =========================
# HELPERS
# =========================
function New-Dir {
    param([string]$Path)
    if (-not (Test-Path $Path)) {
        New-Item -ItemType Directory -Path $Path -Force | Out-Null
    }
}

function Write-FileUtf8 {
    param(
        [string]$Path,
        [string]$Content
    )
    $parent = Split-Path -Parent $Path
    if ($parent -and -not (Test-Path $parent)) {
        New-Item -ItemType Directory -Path $parent -Force | Out-Null
    }
    [System.IO.File]::WriteAllText($Path, $Content, [System.Text.UTF8Encoding]::new($false))
}

# =========================
# CREATE DIRECTORIES
# =========================
@(
    ".github",
    ".github\ISSUE_TEMPLATE",
    ".github\workflows",
    "src",
    "src\bot",
    "src\bot\events",
    "src\bot\commands",
    "src\workers",
    "src\queue",
    "src\lib",
    "src\config",
    "docs"
) | ForEach-Object { New-Dir $_ }

# =========================
# .gitignore
# =========================
Write-FileUtf8 ".gitignore" @'
node_modules/
dist/
coverage/
.env
.env.local
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
.DS_Store
Thumbs.db
'@

# =========================
# README.md
# =========================
Write-FileUtf8 "README.md" @'
# Unified Ops Bot

Discord bot a worker vrstva pro Unified Ops.

## Scope
- Discord sync
- worker jobs
- queue processing
- scheduled checks
- notifications

## Stack
- Node.js
- TypeScript
- discord.js
- BullMQ
- Redis

## Local setup
1. `npm install`
2. zkopiruj `.env.example` na `.env`
3. `npm run dev`

## Docs
- `docs/architecture.md`
- `docs/deployment.md`
- `docs/jobs.md`
'@

# =========================
# .env.example
# =========================
Write-FileUtf8 ".env.example" @'
DISCORD_BOT_TOKEN=""
DISCORD_CLIENT_ID=""
DISCORD_GUILD_ID=""
REDIS_URL="redis://localhost:6379"
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/unified_ops?schema=public"
BOT_LOG_LEVEL="info"
'@

# =========================
# docs
# =========================
Write-FileUtf8 "docs\architecture.md" @'
# Bot Architecture

## Responsibilities
- sync Discord roles
- sync nicknames
- process queued jobs
- emit notifications
- handle scheduled checks

## Core parts
- bot client
- job workers
- queue producers
- config layer
'@

Write-FileUtf8 "docs\deployment.md" @'
# Deployment

Bot nema bezet na Vercelu.
Pouzij Railway, Fly.io, Render paid, nebo VPS.

## Minimal requirements
- Node.js runtime
- Redis
- env variables
- process manager nebo container
'@

Write-FileUtf8 "docs\jobs.md" @'
# Jobs

## Planned jobs
- member sync
- quota checks
- certification expiry checks
- discipline escalation
- notification dispatch
'@

# =========================
# GitHub issue templates
# =========================
Write-FileUtf8 ".github\ISSUE_TEMPLATE\bug_report.yml" @'
name: Bug report
description: Nahlasit chybu
title: "[Bug]: "
labels: ["bug"]
body:
  - type: textarea
    id: summary
    attributes:
      label: Popis
    validations:
      required: true

  - type: textarea
    id: steps
    attributes:
      label: Kroky k reprodukci
    validations:
      required: true

  - type: textarea
    id: expected
    attributes:
      label: Ocekavane chovani
    validations:
      required: true
'@

Write-FileUtf8 ".github\ISSUE_TEMPLATE\feature_request.yml" @'
name: Feature request
description: Navrh nove funkce
title: "[Feature]: "
labels: ["feature"]
body:
  - type: input
    id: module
    attributes:
      label: Modul
      placeholder: bot / worker / queue / config / infra
    validations:
      required: true

  - type: textarea
    id: problem
    attributes:
      label: Problem
    validations:
      required: true

  - type: textarea
    id: solution
    attributes:
      label: Reseni
    validations:
      required: true
'@

Write-FileUtf8 ".github\ISSUE_TEMPLATE\task.yml" @'
name: Task
description: Technicky ukol
title: "[Task]: "
labels: ["enhancement"]
body:
  - type: input
    id: module
    attributes:
      label: Modul
      placeholder: bot / worker / queue / docs / infra
    validations:
      required: true

  - type: textarea
    id: task
    attributes:
      label: Zadani
    validations:
      required: true
'@

# =========================
# PR template
# =========================
Write-FileUtf8 ".github\pull_request_template.md" @'
## Co tenhle PR dela
- 

## Zmeneny modul
- [ ] bot
- [ ] worker
- [ ] queue
- [ ] config
- [ ] infra
- [ ] docs

## Checklist
- [ ] build prosel
- [ ] lint prosel
- [ ] typy sedi
- [ ] zadne tajne udaje v commitu
- [ ] env zmeny jsou popsane
'@

# =========================
# CODEOWNERS
# =========================
Write-FileUtf8 ".github\CODEOWNERS" @"
* @$GitHubUsername
/src/ @$GitHubUsername
/docs/ @$GitHubUsername
/.github/ @$GitHubUsername
"@

# =========================
# GitHub Actions CI
# =========================
Write-FileUtf8 ".github\workflows\ci.yml" @'
name: CI

on:
  pull_request:
  push:
    branches:
      - main
      - develop

jobs:
  ci:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Lint
        run: npm run lint --if-present

      - name: Typecheck
        run: npm run typecheck --if-present

      - name: Build
        run: npm run build --if-present
'@

# =========================
# package.json
# =========================
Write-FileUtf8 "package.json" @'
{
  "name": "unified-ops-bot",
  "version": "0.1.0",
  "private": true,
  "main": "dist/index.js",
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc -p tsconfig.json",
    "start": "node dist/index.js",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "discord.js": "^14.19.3",
    "bullmq": "^5.56.1",
    "ioredis": "^5.6.1",
    "zod": "^3.24.1"
  },
  "devDependencies": {
    "@types/node": "^22.13.10",
    "tsx": "^4.19.3",
    "typescript": "^5.8.2"
  }
}
'@

# =========================
# tsconfig.json
# =========================
Write-FileUtf8 "tsconfig.json" @'
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "outDir": "dist",
    "rootDir": "src",
    "strict": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "resolveJsonModule": true,
    "types": ["node"]
  },
  "include": ["src/**/*.ts"],
  "exclude": ["node_modules", "dist"]
}
'@

# =========================
# src/config/env.ts
# =========================
Write-FileUtf8 "src\config\env.ts" @'
import { z } from "zod";

const envSchema = z.object({
  DISCORD_BOT_TOKEN: z.string().min(1),
  DISCORD_CLIENT_ID: z.string().min(1),
  DISCORD_GUILD_ID: z.string().min(1),
  REDIS_URL: z.string().min(1),
  DATABASE_URL: z.string().min(1),
  BOT_LOG_LEVEL: z.string().default("info")
});

export const env = envSchema.parse({
  DISCORD_BOT_TOKEN: process.env.DISCORD_BOT_TOKEN,
  DISCORD_CLIENT_ID: process.env.DISCORD_CLIENT_ID,
  DISCORD_GUILD_ID: process.env.DISCORD_GUILD_ID,
  REDIS_URL: process.env.REDIS_URL,
  DATABASE_URL: process.env.DATABASE_URL,
  BOT_LOG_LEVEL: process.env.BOT_LOG_LEVEL ?? "info"
});
'@

# =========================
# src/lib/logger.ts
# =========================
Write-FileUtf8 "src\lib\logger.ts" @'
export const logger = {
  info: (...args: unknown[]) => console.log("[INFO]", ...args),
  warn: (...args: unknown[]) => console.warn("[WARN]", ...args),
  error: (...args: unknown[]) => console.error("[ERROR]", ...args)
};
'@

# =========================
# src/queue/connection.ts
# =========================
Write-FileUtf8 "src\queue\connection.ts" @'
import IORedis from "ioredis";
import { env } from "../config/env";

export const redis = new IORedis(env.REDIS_URL, {
  maxRetriesPerRequest: null
});
'@

# =========================
# src/queue/queues.ts
# =========================
Write-FileUtf8 "src\queue\queues.ts" @'
import { Queue } from "bullmq";
import { redis } from "./connection";

export const memberSyncQueue = new Queue("member-sync", {
  connection: redis
});

export const quotaQueue = new Queue("quota-check", {
  connection: redis
});
'@

# =========================
# src/workers/member-sync-worker.ts
# =========================
Write-FileUtf8 "src\workers\member-sync-worker.ts" @'
import { Worker } from "bullmq";
import { redis } from "../queue/connection";
import { logger } from "../lib/logger";

export function startMemberSyncWorker() {
  const worker = new Worker(
    "member-sync",
    async (job) => {
      logger.info("Processing member sync job", job.id, job.data);
      return { ok: true };
    },
    { connection: redis }
  );

  worker.on("completed", (job) => {
    logger.info("Member sync job completed", job.id);
  });

  worker.on("failed", (job, error) => {
    logger.error("Member sync job failed", job?.id, error);
  });

  return worker;
}
'@

# =========================
# src/workers/quota-worker.ts
# =========================
Write-FileUtf8 "src\workers\quota-worker.ts" @'
import { Worker } from "bullmq";
import { redis } from "../queue/connection";
import { logger } from "../lib/logger";

export function startQuotaWorker() {
  const worker = new Worker(
    "quota-check",
    async (job) => {
      logger.info("Processing quota job", job.id, job.data);
      return { ok: true };
    },
    { connection: redis }
  );

  worker.on("completed", (job) => {
    logger.info("Quota job completed", job.id);
  });

  worker.on("failed", (job, error) => {
    logger.error("Quota job failed", job?.id, error);
  });

  return worker;
}
'@

# =========================
# src/bot/client.ts
# =========================
Write-FileUtf8 "src\bot\client.ts" @'
import { Client, GatewayIntentBits } from "discord.js";

export function createBotClient() {
  return new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMembers
    ]
  });
}
'@

# =========================
# src/bot/register-events.ts
# =========================
Write-FileUtf8 "src\bot\register-events.ts" @'
import type { Client } from "discord.js";
import { logger } from "../lib/logger";

export function registerBotEvents(client: Client) {
  client.once("ready", () => {
    logger.info("Bot is ready as", client.user?.tag);
  });

  client.on("guildCreate", (guild) => {
    logger.info("Joined guild", guild.name);
  });
}
'@

# =========================
# src/bot/start-bot.ts
# =========================
Write-FileUtf8 "src\bot\start-bot.ts" @'
import { env } from "../config/env";
import { logger } from "../lib/logger";
import { createBotClient } from "./client";
import { registerBotEvents } from "./register-events";

export async function startBot() {
  const client = createBotClient();
  registerBotEvents(client);

  await client.login(env.DISCORD_BOT_TOKEN);
  logger.info("Discord login initialized");

  return client;
}
'@

# =========================
# src/index.ts
# =========================
Write-FileUtf8 "src\index.ts" @'
import { startBot } from "./bot/start-bot";
import { startMemberSyncWorker } from "./workers/member-sync-worker";
import { startQuotaWorker } from "./workers/quota-worker";
import { logger } from "./lib/logger";
import "./config/env";

async function bootstrap() {
  logger.info("Starting unified-ops-bot");

  startMemberSyncWorker();
  startQuotaWorker();

  await startBot();

  logger.info("Unified Ops Bot is running");
}

bootstrap().catch((error) => {
  logger.error("Fatal startup error", error);
  process.exit(1);
});
'@

# =========================
# optional git init
# =========================
if (-not (Test-Path ".git")) {
    git init | Out-Null
    git checkout -b main | Out-Null
    git branch develop | Out-Null
}

Write-Host ""
Write-Host "Hotovo." -ForegroundColor Green
Write-Host "Repo bootstrap pro unified-ops-bot je pripraven." -ForegroundColor Green
Write-Host ""
Write-Host "Dalsi kroky:" -ForegroundColor Yellow
Write-Host "1. Dopln do skriptu GitHub jmeno misto TVE_GITHUB_JMENO" -ForegroundColor Yellow
Write-Host "2. Spust: npm install" -ForegroundColor Yellow
Write-Host "3. Spust: git add ." -ForegroundColor Yellow
Write-Host "4. Spust: git commit -m ""chore: bootstrap bot repo"" " -ForegroundColor Yellow