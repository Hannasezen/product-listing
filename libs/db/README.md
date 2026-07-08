# @org/db

Drizzle ORM schema, Neon Postgres client, and migrations shared by the `api` app (NestJS, via `DbModule`) and any scripts that need direct database access.

## Layout

| File | Purpose |
|---|---|
| `src/schema.ts` | Table definitions and relations. Source of truth for the DB shape. |
| `src/client.ts` | `db` — a `drizzle-orm/node-postgres` instance used by the app at runtime (exported via `DbModule`/`DRIZZLE` token). |
| `src/db.module.ts` | NestJS global module that provides `db` under the `DRIZZLE` injection token. |
| `src/index.ts` | Public entry point (`@org/db`) — re-exports `client`, `schema`, `db.module`, and `eq`. |
| `drizzle.config.ts` | Config used by the `drizzle-kit` CLI (`generate`, `check`, etc.). |
| `src/migrate.ts` | Applies pending migrations in `src/migrations/` to the database. |
| `src/baseline.ts` | One-off tool for adopting Drizzle migrations against a database that already has the tables (see below). |
| `src/seed.ts` | Inserts/updates demo data (categories, products, admin user). Safe to re-run. |
| `src/migrations/` | Generated SQL migrations + snapshots. Don't hand-edit; regenerate via `drizzle-kit`. |

## Environment

Scripts in this package (`migrate.ts`, `baseline.ts`, `seed.ts`, `client.ts`, `drizzle.config.ts`) read `process.env.DATABASE_URL` directly — none of them load a `.env` file for you. Export it in your shell first:

```sh
set -a && source .env && set +a   # or apps/api/.env, wherever DATABASE_URL lives
```

The only place that auto-loads a `.env` file is `apps/api/src/main.ts` (via `process.loadEnvFile`), for the running API server.

## Making a schema change

1. **Edit `src/schema.ts`** — add/change a column, table, or relation.
2. **Generate a migration** (run from the repo root or from `libs/db`, doesn't matter):
   ```sh
   cd libs/db
   npx drizzle-kit generate
   ```
   This diffs your schema against `src/migrations/meta/` and writes a new `NNNN_*.sql` file.
3. **Review the generated SQL** in `src/migrations/` — make sure it's only the change you intended.
4. **Apply it**:
   ```sh
   npx tsx src/migrate.ts
   ```
5. **If the field should be exposed by the API**, wire it through:
   - Add it to `Product`/`Category` (or whichever type) in `libs/shared/types/src/lib/shared-types.ts`.
   - Map it in `toProductDto` in `apps/api/src/products/products.service.ts`.
   - Update any request DTOs in `apps/api/src/products/dto/` if it's filterable/settable.
   - Use it in the relevant `apps/web` components.
6. **Rebuild/lint** what you touched, e.g. `npx nx build api`, `npx nx build web`, `npx nx lint db`.

`npx drizzle-kit check` is a read-only way to confirm the schema and migration history agree, without generating anything.

## Seeding

```sh
npx tsx src/seed.ts
```

Categories are inserted with `onConflictDoNothing`. Products are inserted with `onConflictDoUpdate` on `slug`, so re-running the seed after editing a product's fields in `seed.ts` (e.g. its `imageUrl`) will update the existing row instead of silently no-op'ing.

## Baselining an existing database

`baseline.ts` exists for adopting Drizzle's migration tracking against a database whose tables were created some other way (e.g. an earlier manual setup) — it records the existing migrations in `drizzle.__drizzle_migrations` as already-applied, by hash, without re-running their SQL. It refuses to run if `drizzle.__drizzle_migrations` already has rows, so it's not something you need for routine schema changes — only if you're pointing this codebase at a fresh/foreign database that already has the tables but no migration history. If you *are* baselining a database that's missing some newer migrations, temporarily trim `src/migrations/meta/_journal.json` to only the entries that are already reflected in that database, run `baseline.ts`, then restore the full journal and run `migrate.ts` to apply the rest.

## Notes

- `drizzle.config.ts` resolves `schema`/`out` relative to the invoking shell's cwd (via `path.relative`) rather than passing absolute paths straight through — `drizzle-kit` has a bug where absolute `out` paths get mangled into an invalid path. Keep that resolution if you ever touch this file; it's what lets `drizzle-kit generate`/`check` work whether you run them from the repo root, `libs/db`, or via `nx`.
