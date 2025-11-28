<!--
This document guides AI coding assistants (Copilot, GPT agents, etc.) to be productive in this repository.
Keep it short, actionable and concrete. Refer to files & code patterns in the workspace.
-->

# Copilot & AI Agent Instructions — unithrift monorepo

Purpose

- Focused, actionable guidance for AI coding agents working across this Turbo/PNP monorepo.

Quick summary

- Monorepo: turborepo + pnpm
- Apps: `apps/nextjs` (Next.js 16 — web + server-driven tRPC API), `apps/expo` (Expo mobile app)
- Packages (shared): `@unithrift/api` (tRPC routers & server context), `@unithrift/auth` (Better Auth runtime + CLI), `@unithrift/db` (Drizzle schema + client), `@unithrift/ui` (shadcn + Radix UI + exports)

When editing code

- Preserve `script/*` files as CLI-only (example: `packages/auth/script/auth-cli.ts`). DO NOT import these in runtime code.
- Auth changes: update `packages/auth/src/index.ts` (runtime) and `packages/auth/script/auth-cli.ts` (CLI-only). If you change auth fields or providers, run:
  - `pnpm auth:generate` — creates `packages/db/src/auth-schema.ts` via Better Auth CLI
  - `pnpm db:push` — apply DB changes
- DB schema changes: edit `packages/db/src/schema.ts` (use enums/tables in `drizzle-orm`), then run `pnpm db:push` (drizzle-kit push). Local env is loaded via `with-env` helper (dotenv)

Local dev & common commands

- Install and configure:
  - `pnpm i`
  - `cp .env.example .env` and fill secrets (POSTGRES*URL, AUTH*\* secrets, etc.)
- Full monorepo dev (all apps + watch):
  - `pnpm dev` — starts `turbo watch` across workspaces
- Single app/package dev
  - `pnpm -F @unithrift/nextjs dev` or `pnpm --filter @unithrift/nextjs dev` (Next.js dev server: `pnpm with-env next dev`)
  - `pnpm -F @unithrift/expo dev` or `pnpm --filter @unithrift/expo dev` (Expo dev client)
- DB & auth
  - `pnpm auth:generate` — regenerate auth schema from `packages/auth/script/auth-cli.ts`
  - `pnpm db:push` — drizzle-kit push (apply schema changes)
  - `pnpm db:studio` — drizzle-kit studio (local DB GUI)
- Utility scripts:
  - `pnpm lint`, `pnpm lint:ws` — eslint
  - `pnpm format`, `pnpm format:fix`
  - `pnpm typecheck` — tsc workspace typecheck
  - `pnpm ui-add` — `shadcn/ui` based UI generation flow
  - `pnpm build` — `turbo run build`
  - `pnpm clean` — monorepo cleanup

Key conventions & patterns

- Environment loading: packages that run local CLIs use `with-env` script that wraps commands in `dotenv -e ../../.env --` to load root env file for CLI/subprocess invocation.
- CLI-only files: `packages/*/script/*` (e.g., `packages/auth/script/auth-cli.ts`) are intentionally CLI-only configuration. DO NOT import them in runtime code.
- tRPC: Build routers with `createTRPCRouter()` and choose procedures from `publicProcedure`, `protectedProcedure`, `adminProcedure` (see `packages/api/src/trpc.ts`). Example: `listingRouter` in `packages/api/src/router/listing.ts`.
- DB (drizzle): Use `pgTable`, `pgEnum` and `relations()` in `packages/db/src/schema.ts`. After schema edits run: `pnpm db:push` and `pnpm db:studio` for local visualization.
- Auth (Better Auth): `packages/auth/src/index.ts` initializes `better-auth` (runtime) and includes `oAuthProxy()` plugin that routes OAuth through Next.js preview deploys — local Expo + OAuth requires correct `AUTH_REDIRECT`/`baseUrl` or preview URL. If you change auth config, run `pnpm auth:generate` (this outputs into `packages/db/src/auth-schema.ts`) then `pnpm db:push`.
- UI components: `packages/ui` uses `@unithrift/ui/components.json` (shadcn settings), `index.ts` exports shared helpers (`cn`), and `package.json` uses explicit `exports`. When adding new components export them from `src/index` and update `package.json` `exports` if required.
- Naming pattern in `db`: enums are `snake_case` in database via `casing` config in client — keep that in mind when writing migrations and raw SQL.

Common integration points / pitfalls

- Auth + DB: Changing `better-auth` configuration often requires regenerating the auth schema and pushing DB changes: `pnpm auth:generate` → `pnpm db:push`.
- TRPC consumers and type updates: When altering API types in `packages/api`, consumer apps (Next.js, Expo) receive the types via workspace linking but you may need to `pnpm build` or run `pnpm dev` after changes for watchers to pick up new types.
- tRPC & clients: RSC/server includes `x-trpc-source` header to help distinguish internal vs client requests. Keep new clients consistent by setting the header where appropriate (see `apps/nextjs/src/trpc` and `apps/expo/src/utils/api.tsx`).
- OAuth & Expo: `oAuthProxy()` adds a proxying mechanism that forwards OAuth flow to Next.js in preview/prod. For local testing either provide a preview URL or set up `AUTH_REDIRECT` and proper `baseUrl` in `.env`.

CI & Build strategies

- CI workflow: `.github/workflows/ci.yml` runs lint, format, and typecheck. It uses `tooling/github/setup` composite action that installs pnpm/turbo and runs `pnpm install`.
- Turbo remote caching: `TURBO_TOKEN` / `TURBO_TEAM` (org variables/secrets) are referenced; CI uses them to speed builds.

Where to look first (useful entry points)

- `packages/api/src/trpc.ts` (context, procedures, middleware, superjson, zod error formatting). This file is the central place for server context and the exported `publicProcedure`, `protectedProcedure`, `adminProcedure`.
- `apps/nextjs/src/trpc/*` (server & react clients) — how tRPC is wired into the Next.js app and the server route.
- `packages/auth/src/index.ts` & `packages/auth/script/auth-cli.ts` — runtime auth vs CLI auth schema generator (CLI uses dummy values for schema generation).
- `packages/db/src/schema.ts` & `packages/db/src/client.ts` — DB table structure, relations, and client `casing`/config.
- `apps/expo/src/utils/api.tsx` — expo tRPC client & cookies header usage (how mobile calls the API).
- `packages/ui/src/*` — review examples like `button.tsx` and `index.ts` to see a canonical pattern for components: `cn` helper and `class-variance-authority` usage.
- `packages/auth/script/auth-cli.ts` — how CLI generation uses `initAuth` for schema generation (CLI-only config)

If you change (or add) a package

- Use `pnpm turbo gen init` to scaffold a new workspace package; update workspace package exports and `@unithrift/*` links in package.json as workspace dependencies.
- Update `pnpm` workspace references and ensure consumers reference the workspace package (e.g., `@unithrift/*`).

Diagnostics / Debugging

- tRPC errors and timing logs: middleware logs `[TRPC] <path> took <ms>` in `packages/api/src/trpc.ts`. Check server route in `apps/nextjs/src/app/api/trpc/[trpc]/route.ts` for onError handler.
- DB mismatches: run `pnpm db:push` and check `drizzle-kit` logs and `drizzle` types in `packages/db/dist` (run `pnpm -F @unithrift/db dev` or `pnpm db:studio` locally).
- UI issues: dev runs `pnpm -F @unithrift/nextjs dev` and `pnpm -F @unithrift/expo dev` — use the Expo dev client and Next dev server for component test cases.
- Debugging tips:
  - When changing types in `packages/api`, re-run `pnpm dev` (or `pnpm build`) so the other workspaces rebuild and consume new types.
  - If you see trpc auth issues, check session retrieval in `packages/api/src/trpc.ts` (createTRPCContext) to ensure headers are forwarded.

Ask the reviewer / author for the following if you are blocked

- Production values for secrets (POSTGRES_URL & OAuth client/secret) — never hardcode or guess secrets
- Any staging/preview URLs or preview deployment for Expo OAuth flows (or a dev URL with proxying).

Feedback

- Please review the architecture snapshot above and confirm anything I missed (e.g., package responsibilities, CI expectations, or local env subtleties). If you'd like, I can add a small contributor guide/example PR checklist (lint, format, typecheck, run local dev).

— End
