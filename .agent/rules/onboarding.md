---
trigger: always_on
---

# Onboarding Summary: Unithrift Turborepo

## Project Overview

This is a Turborepo monorepo for "Unithrift", a preloved/thrifting application. It uses the T3 Stack (Next.js, tRPC, Tailwind CSS) adapted for a monorepo structure with shared packages and multiple apps (Web and Mobile).

## Directory Structure

### Apps

- **`apps/nextjs`**: The web application built with Next.js 15, React 19, and Tailwind CSS v4. It serves as the main web interface and also hosts the tRPC API.
- **`apps/expo`**: The mobile application built with Expo SDK 54 and React Native 0.81. It uses Expo Router for navigation and NativeWind v5 for styling.

### Packages

- **`packages/api`**: Contains the tRPC v11 router definitions. It is consumed by both the Next.js and Expo apps.
- **`packages/auth`**: Handles authentication using `better-auth`.
- **`packages/db`**: Database configuration and schema using Drizzle ORM and Supabase (Postgres).
- **`packages/ui`**: Shared UI components library based on `shadcn/ui`.
- **`packages/validators`**: Shared Zod validation schemas used by both frontend and backend.

### Tooling

- **`tooling/eslint`**: Shared ESLint configurations.
- **`tooling/prettier`**: Shared Prettier configuration.
- **`tooling/tailwind`**: Shared Tailwind CSS theme and configuration.
- **`tooling/typescript`**: Shared TypeScript configurations (`tsconfig`).

## Key Workflows & Scripts

### Setup

1.  **Install Dependencies**: `pnpm i`
2.  **Environment Variables**: Copy `.env.example` to `.env` and configure `POSTGRES_URL`, `AUTH_SECRET`, etc.
3.  **Database Push**: `pnpm db:push` - Pushes the Drizzle schema to the connected database.
4.  **Auth Schema Generation**: `pnpm auth:generate` - Generates the `better-auth` schema into `packages/db`.

### Development

- **Start Dev Servers**: `pnpm dev` - Starts both Next.js and Expo development servers.
- **Next.js Only**: `pnpm dev:next` - Starts only the Next.js app.
- **Database Studio**: `pnpm db:studio` - Opens Drizzle Studio to inspect the database.

### Maintenance

- **Add UI Component**: `pnpm ui-add` - Interactive CLI to add `shadcn/ui` components to `packages/ui`.
- **Linting**: `pnpm lint` / `pnpm lint:fix`
- **Formatting**: `pnpm format` / `pnpm format:fix`
- **Typecheck**: `pnpm typecheck`

## Technology Stack

- **Frameworks**: Next.js 15, Expo SDK 54, React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4, NativeWind v5
- **API**: tRPC v11
- **Database**: Postgres (Supabase), Drizzle ORM
- **Auth**: Better Auth
- **Package Manager**: pnpm

## Important Notes

- The `db` package is configured for edge runtime (Vercel Postgres).
- `packages/auth/script/auth-cli.ts` is used for generating auth schemas and should not be imported in application code.
- The `api` package is a production dependency for Next.js but a dev dependency for Expo (to prevent leaking backend code).
