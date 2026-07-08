# product-listing

A product catalog app where visitors can browse products, and signed-in users can save favorites and build a cart. Single-admin store management, no payment processing yet.

## Stack

| Layer | Technology |
|---|---|
| Monorepo | NX |
| Frontend | Next.js (App Router), React, TypeScript, Tailwind v4 |
| Backend | NestJS |
| ORM | Drizzle ORM |
| Database | PostgreSQL on Neon |
| Auth | Auth.js v5 (Google + email magic link via Resend), JWT sessions |
| Tracing | OpenTelemetry → Honeycomb |
| Analytics | PostHog + GA4 |
| FE tests | Vitest (unit), Playwright (e2e) |

Next.js Server Components/Actions call NestJS directly, server-to-server — there's no BFF layer and auth tokens never reach the browser.

## Project structure

```
apps/
  web/                # Next.js (App Router) — :3000
  web-e2e/             # Playwright e2e tests
  api/                # NestJS — :3001

libs/
  shared/
    types/             # DTOs and interfaces used by both apps
    utils/             # Pure utility functions
  db/                  # Drizzle schema, Neon client, migrations
  auth/                # Auth.js config, NestJS session guard
  observability/       # OpenTelemetry + Honeycomb setup
  analytics/           # PostHog + GA4 setup
```

## Getting started

```sh
npm install

cp apps/web/.env.example apps/web/.env.local
cp apps/api/.env.example apps/api/.env
# fill in the values in both files
```

Run both apps in separate terminals:

```sh
npx nx run web:dev    # http://localhost:3000
npx nx run api:serve  # http://localhost:3001/api
```

## Common tasks

```sh
npx nx run-many -t typecheck   # typecheck everything
npx nx run-many -t lint        # lint everything
npx nx graph                   # visualize the project graph
```

## Environments

| Environment | Trigger | Frontend | Backend | Database |
|---|---|---|---|---|
| Local | any | `localhost:3000` | `localhost:3001` | Neon dev branch |
| Staging | push to `main` | Vercel (see note) | Fly.io staging | Neon staging branch |
| Production | push to `main` + a `v*` tag | Vercel production | Fly.io production | Neon production |

Pushing to `main` is what promotes to staging — `.github/workflows/ci-cd.yml` runs `migrate-database`, `seed-database`, and `deploy-staging` (Fly.io) on every push to `main`. Production only deploys once that same commit is also tagged `v*` (`deploy-production`). Pushing to `develop` only runs lint/test — it's not wired to any deploy job.

`apps/web/vercel.json` only builds on pushes to `main` or `develop` (its `ignoreCommand` skips everything else); whether a given push becomes a Vercel Production or Preview deployment depends on the Production Branch configured in the Vercel project settings (not tracked in this repo), so treat "Vercel (see note)" above as "check the Vercel dashboard for the actual result."
