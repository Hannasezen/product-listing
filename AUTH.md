# Auth implementation notes

Working notes from the session that implemented Phase 4 (Auth) end-to-end. Read this
before touching anything auth-related — several pieces here exist for non-obvious
reasons and look like they could be simplified when they can't be.

## Status

Phase 4 is functionally complete and tested locally: Google OAuth and Resend
magic-link both work, session/role claims are correct, and both NestJS guards exist
and typecheck. As of Phase 7 (favorites), `SessionGuard` has its first real consumer
(`FavoritesController`) and `apps/web` forwards the session token to it — see
"Web → API token forwarding" below. `AdminGuard` still has no consumer (see "What's
not built yet").

**All of this is still uncommitted.** Run `git status` in `product-listing/` before
doing anything else — check the diff, then commit or ask before building further on
top of it.

## Architecture, and why it's shaped this way

### Two-file config split: `libs/auth/src/auth.config.ts` vs `apps/web/src/auth.ts`
`auth.config.ts` is the edge-safe base (providers, callbacks, JWT encode/decode, session
strategy) with **no adapter and no DB import**. `apps/web/src/auth.ts` layers the
`DrizzleAdapter` and the actual provider list (Google, Resend) on top of it.

Why: `apps/web/src/middleware.ts` runs on the Edge runtime, which can't use the
`pg`-based `DrizzleAdapter` (no raw TCP sockets on Edge). Middleware imports only
`@org/auth/auth.config`, never `apps/web/src/auth.ts`. If you add a new provider or
adapter-dependent option, it goes in `apps/web/src/auth.ts`, not the shared config.

### Custom JWT encode/decode (`libs/auth/src/auth.config.ts`)
Auth.js encrypts session tokens by default (JWE, key derived via HKDF from
`NEXTAUTH_SECRET`). We override `jwt.encode`/`jwt.decode` to issue a **plain
HS256-signed JWT** via `jose`'s `SignJWT`/`jwtVerify` instead.

Why: `SessionGuard` (NestJS side) needs to verify the token using only the shared
`NEXTAUTH_SECRET`, per TECHNICAL.md. Replicating Auth.js's internal JWE/HKDF scheme in
a separate codebase is fragile across Auth.js versions; a plain signed JWT is a
one-line `jwtVerify` call on the NestJS side. If this override is ever removed,
`SessionGuard` breaks silently (tokens just fail to verify).

### `session: { strategy: "jwt" }` is required, not optional
Auth.js defaults to **database** session strategy whenever an adapter is configured.
We want JWT strategy (see TECHNICAL.md — "no session table in the database"), so this
must be set explicitly in `authConfig`. **This bit us today**: without it, Auth.js
tried to `INSERT INTO "session"` on every sign-in and failed with `42P01: relation
"session" does not exist` (the adapter config deliberately omits `sessionsTable` — see
below — so it fell back to a guessed table name that doesn't match our schema's
`sessions`, plural). If session-related errors show up again, check this line first.

### `libs/db/src/auth-adapter.ts` omits `sessionsTable`
Intentional — JWT strategy never touches the `sessions` table. Also, the `sessions`
table's `sessionToken` column is `.unique()`, not `.primaryKey()`, which doesn't match
`@auth/drizzle-adapter`'s expected shape anyway (a real type error if you try to wire
it in as-is).

### Subpath package exports: `@org/db/auth-adapter`, `@org/auth/auth.config`
`apps/web` imports these specific subpaths, never the bare `@org/db` or `@org/auth`
barrels. The barrels also re-export NestJS-decorated files (`db.module.ts`,
`session.guard.ts`, `admin.guard.ts`) — Next.js's bundler can't parse Nest decorator
syntax, so pulling in the barrel breaks the web build. `apps/api` (NestJS) is fine
importing the plain `@org/db` / `@org/auth` barrels since Nest expects decorators.

### `apps/web` is forced onto webpack, not Turbopack
`apps/web/project.json` overrides the `build`/`dev` targets to
`next build --webpack` / `next dev --webpack`. `next.config.js` sets
`transpilePackages` and `experimental.extensionAlias`.

Why: this workspace's libs use TypeScript's `nodenext` convention — relative imports
end in `.js` but point at sibling `.ts` files (e.g. `export * from "./client.js"`).
That's required for `tsc`/`tsx` to run these files directly (NestJS's build, seed/
migrate scripts). Turbopack (Next 16's default bundler) cannot resolve `.js`-suffixed
specifiers against `.ts` files and has no equivalent to webpack's
`resolve.extensionAlias`. Don't try switching this back to Turbopack without solving
that resolution gap first — it will break the instant any real (non-type-only)
cross-lib import happens (which auth needs, since `authAdapter`/`authConfig` are
actual runtime imports, not just types).

### `declare module "next-auth"` / `"next-auth/jwt"` augmentations
Add `id`/`role` to the `Session`/`JWT` types. Note the `import type { JWT } from
"next-auth/jwt"` at the top of `auth.config.ts` isn't decorative — without a real
(even type-only) import of that module somewhere in the file, TypeScript's module
augmentation silently fails to resolve `next-auth/jwt` under `nodenext` +
`isolatedModules`, and you get `TS2664: Invalid module name in augmentation`.

### `NextAuthResult` type annotations in `apps/web/src/auth.ts` / `middleware.ts`
The destructured `auth` export needs an explicit `: NextAuthResult` annotation.
Without it, TS throws `TS2742`/`TS2883` ("inferred type cannot be named") because the
inferred type reaches into `next-auth/lib/types`' internal `AppRouteHandlerFn`, which
isn't part of the public API surface. This only shows up because `composite: true` in
`tsconfig.base.json` triggers declaration-emit-style checks even under `noEmit`.

## Known gotcha already hit once: seed script vs. OAuth account linking

`libs/db/src/seed.ts` inserts a placeholder `users` row for the admin email
(`hanna.sezen.ua@gmail.com`) with no linked `accounts` row. Signing in with Google
using that same email throws `OAuthAccountNotLinked` (Auth.js refuses to
auto-link an OAuth sign-in to a pre-existing user row, by design). We deleted that
row directly from Neon to fix it once. **If you re-run `seed.ts`, it will recreate
that row and the same error will come back** — either delete the row again after
seeding, or (better, not yet done) remove that `users` insert from `seed.ts` now that
admin status is derived entirely from `ADMIN_EMAILS`, not a DB row
(PRODUCT.md: "Admin access is granted by configuration, not by user registration").

## Env vars (already filled in locally — see `apps/web/.env.local`, `apps/api/.env`)

- `NEXTAUTH_SECRET` — generated once, synced between `apps/web/.env.local` and
  `apps/api/.env` (must match — `SessionGuard` verifies with it directly)
- `DATABASE_URL` — also added to `apps/web/.env.local` (not just `apps/api/.env`),
  since the DrizzleAdapter runs inside Next.js's own Node-runtime route handler
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` — from Google Cloud Console; authorized
  redirect URI is `http://localhost:3000/api/auth/callback/google`
- `RESEND_API_KEY` — from resend.com dashboard
- `EMAIL_FROM=onboarding@resend.dev` — Resend's no-verification-needed sandbox
  sender, fine for dev; switch to a verified domain address for staging/production
- `ADMIN_EMAILS` — comma-separated, checked in the `jwt` callback to set `role`

## What's not built yet

1. **`AdminGuard` still has no consumer.** `SessionGuard` now does (see below);
   `AdminGuard` is still built and typechecks but nothing calls it. Lands with
   Phase 6 (admin CRUD) per PLAN.md.

## Web → API token forwarding (built in Phase 7, favorites)

`apps/web/src/lib/session-token.ts` exports `getSessionToken()`, which reads the raw
bearer token via `next-auth/jwt`'s `getToken({ raw: true })` against the request
headers (`next/headers`'s `headers()`). Because of the plain-JWT encode override
above, the cookie value **is** the token — `raw: true` just extracts it, no `secret`
needed. Server Actions call this, then forward the token as
`Authorization: Bearer <token>` via `postJsonWithToken`/`fetchJsonWithToken` in
`apps/web/src/lib/api.ts`.

`SessionGuard`'s first real consumer is `FavoritesController` (`apps/api/src/favorites`),
guarding all of `GET/POST/DELETE /api/favorites`. The product page's "Add to
favourites" button (`AddFavoriteButton.tsx`) and `/my-account`'s favourites list both
go through this path.

One gotcha: `getSessionToken()` derives `secureCookie` from whether `NEXTAUTH_URL`
starts with `https://`, to match Auth.js's own cookie-name prefixing
(`authjs.session-token` vs. `__Secure-authjs.session-token`). Only tested against the
local `http://localhost:3000` setup — verify this still resolves correctly once a
production `NEXTAUTH_URL` exists.

## UI pieces built alongside the backend work

- `apps/web/src/app/sign-in/page.tsx` — Google button + email magic-link form.
  Respects `?callbackUrl=` (validated to same-site relative paths only, to avoid open
  redirect) so users land back where they clicked "Sign in" from.
- `apps/web/src/app/my-account/page.tsx` — redirects to `/sign-in` if not
  authenticated; otherwise shows "Welcome, {first name}" and a sign-out button.
- Header (`Header.tsx` + `HeaderClient.tsx`) is session-aware: shows initials avatar
  (links to `/my-account`) when signed in, "Sign in" link (with `callbackUrl`) when
  not. Desktop avatar navigates to the account page; the mobile menu's sign-out
  button still signs out directly — that asymmetry is intentional from today's scope,
  not a bug, but worth reconciling later.

## Docs map

- `PRODUCT.md` / `TECHNICAL.md` / `PLAN.md` — one level up, at the repo root
  (`../PRODUCT.md` etc. from here). `PLAN.md` is *not* inside this git repo.
- `README.md` — general project setup/getting-started
- `FLY_SETUP.md` — Fly.io deployment notes
