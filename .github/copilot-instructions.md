<!--
This document guides AI coding assistants (Copilot, GPT agents, etc.) to be productive in this repository.
Keep it short, actionable and concrete. Refer to files & code patterns in the workspace.
-->

# Copilot & AI Agent Instructions — unithrift monorepo

Purpose
- Provide focused, actionable guidance for modifying, debugging, and extending this Turbo/PnP monorepo.

Quick summary
- Monorepo: turborepo + pnpm
- Apps: `apps/nextjs` (Next.js 16, server-driven tRPC API), `apps/expo` (Expo mobile app)
- Packages (shared): `@unithrift/api` (tRPC routers), `@unithrift/auth` (better-auth config & CLI), `@unithrift/db` (Drizzle schema + client), `@unithrift/ui` (shadcn + Radix UI)

When editing code
- Preserve `script/*` files as CLI-only (example: `packages/auth/script/auth-cli.ts`). Do NOT import or use those files in runtime.
- If you change authentication config in `packages/auth/src/index.ts`, update the CLI schema config if needed and re-run `pnpm auth:generate`.
- If you change the DB schema, update `packages/db/src/schema.ts`, then run `pnpm db:push` (pushes with drizzle-kit using `.env`).

Local dev & common commands
- Install and configure:
  - `pnpm i`
  - `cp .env.example .env` and fill secrets (POSTGRES_URL, AUTH_* secrets, etc.)
- Generate auth schema (after editing `packages/auth` config):
  - `pnpm auth:generate`
- Push db schema (drizzle):
  - `pnpm db:push`
- Start development (root):
  - `pnpm dev` (starts turbo watch across workspaces)
- Start a single package / app:
  - `pnpm -F @unithrift/nextjs dev` or `pnpm --filter @unithrift/nextjs dev`
  - `pnpm -F @unithrift/expo dev` (or `pnpm --filter` equivalent)
- Utility scripts:
  - `pnpm lint`, `pnpm lint:ws` — linters across packages (`lint:ws` runs a workspace check)
  - `pnpm typecheck` — runs tsc across workspace
  - `pnpm ui-add` — uses `shadcn/ui` interactive CLI to add UI components
  - `pnpm build` — `turbo run build`

Key conventions & patterns
- `with-env` scripts: Many packages use `dotenv -e ../../.env --` (e.g., Next.js and DB package) to load the root `.env` for CLI commands — replicate this pattern when creating new package scripts that need env.
- Exports in `@unithrift/ui`: `package.json` uses explicit `exports` entries for components — follow this pattern when adding new components.
- TRPC: Use `publicProcedure`, `protectedProcedure`, and `adminProcedure` from `packages/api/src/trpc.ts` for consistent access control. Server-side / RSC usage is via `apps/nextjs/src/trpc/server.tsx`; browser client via `apps/nextjs/src/trpc/react.tsx` and `apps/expo/src/utils/api.tsx`.
- `auth` vs `auth-cli`: Runtime auth is defined in `packages/auth/src`, CLI config for better-auth schema generation is `packages/auth/script/auth-cli.ts`.
- DB: The `db` package uses `drizzle` with `@vercel/postgres`. Watch the `casing: 'snake_case'` setup in `packages/db/src/client.ts` and enums/relations patterns in `packages/db/src/schema.ts`.

Common integration points / pitfalls
- Always run `pnpm auth:generate` when editing `packages/auth` options that affect schema. Then run `pnpm db:push` to update DB schema.
- When changing types in `packages/api` routers, the consumer apps automatically get type-safety via package linking, but you must `pnpm build` (or `pnpm dev` with watch) to rebuild generated types where applicable.
- tRPC headers: RSC/server side includes `x-trpc-source` headers (see `apps/nextjs/src/trpc/server.tsx` & `apps/expo/src/utils/api.tsx`) — set this header for new clients to help debugging.
- When working with expo & OAuth, `@unithrift/auth` includes `oAuthProxy()` which routes via Next.js for preview/deploy environments; local auth setup needs proper `AUTH_REDIRECT`/`baseUrl` or an exposed preview URL.

CI & Build strategies
- CI workflow: `.github/workflows/ci.yml` (runs `pnpm lint`, `pnpm format`, `pnpm typecheck`). There is a shared `tooling/github/setup` composite action that installs pnpm/turbo and runs `pnpm install`.
- Turbo remote caching: the repo expects `TURBO_TOKEN`/`TURBO_TEAM` if using Vercel remote caching — CI references these in the workflow.

Where to look first (useful entry points)
- `packages/api/src/trpc.ts` (context, procedures, middleware, superjson, zod error formatting)
- `apps/nextjs/src/trpc` (server & react clients) — how tRPC is wired into server and client
- `packages/auth/src/index.ts` & `packages/auth/script/auth-cli.ts` — runtime auth vs CLI auth schema generator
- `packages/db/src/schema.ts` & `packages/db/src/client.ts` — DB table structure, relations, enums
- `apps/expo/src/utils/api.tsx` — expo tRPC client & cookie header usage
- `README.md` — project overview and quick start

If you change (or add) a package
- Use `pnpm turbo gen init` to scaffold a new workspace package; update workspace package exports and `@unithrift/*` links in package.json as workspace dependencies.

Diagnostics / Debugging
- For tRPC issues: check `trpc.ts` middleware logs (`[TRPC]` timing middleware) and `onError` handlers (see `apps/nextjs/src/app/api/trpc/[trpc]/route.ts`).
- For DB type/schema mismatches: run `pnpm db:push` and check `drizzle-kit` logs (local `.turbo` logs show commands used).

Ask the reviewer / author for the following if you are blocked
- Actual environment values for `POSTGRES_URL` & OAuth providers (don’t guess secrets)
- If you need a public dev URL for Expo auth flows, ask for a running Next.js preview deployment or use an ngrok/preview URL setup.

Feedback
- If anything above is missing or unclear, leave a comment in PR or reply to the author with which part needs clarification and a file reference if applicable.

— End
