import crypto from 'node:crypto';
import fs from 'node:fs';
import { Pool } from 'pg';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

const rawDatabaseUrl = process.env.DATABASE_URL || '';
if (!rawDatabaseUrl) {
  console.error('ERROR: DATABASE_URL is not set');
  process.exit(1);
}

const databaseUrl = (() => {
  try {
    const url = new URL(rawDatabaseUrl);
    if (!url.searchParams.has('sslmode')) {
      url.searchParams.set('sslmode', 'require');
    }
    return url.toString();
  } catch {
    return rawDatabaseUrl;
  }
})();

const migrationsFolder = join(__dirname, 'migrations');
const journal = JSON.parse(
  fs.readFileSync(join(migrationsFolder, 'meta/_journal.json')).toString(),
);

const pool = new Pool({
  connectionString: databaseUrl,
  ssl: { rejectUnauthorized: false },
});

try {
  const { rows: existing } = await pool.query(
    `select to_regclass('public.accounts') as reg`,
  );
  if (!existing[0]?.reg) {
    console.error(
      'ERROR: "accounts" table does not exist in this database - nothing to baseline. ' +
        'Run the normal migrate script instead.',
    );
    process.exit(1);
  }

  await pool.query(`CREATE SCHEMA IF NOT EXISTS "drizzle"`);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS "drizzle"."__drizzle_migrations" (
      id SERIAL PRIMARY KEY,
      hash text NOT NULL,
      created_at bigint
    )
  `);

  const { rows: already } = await pool.query(
    `select count(*)::int as count from "drizzle"."__drizzle_migrations"`,
  );
  if (already[0].count > 0) {
    console.log(
      'Migrations table is not empty - already baselined or has real history. Nothing to do.',
    );
    process.exit(0);
  }

  for (const entry of journal.entries) {
    const sqlText = fs
      .readFileSync(join(migrationsFolder, `${entry.tag}.sql`))
      .toString();
    const hash = crypto.createHash('sha256').update(sqlText).digest('hex');
    await pool.query(
      `insert into "drizzle"."__drizzle_migrations" ("hash", "created_at") values ($1, $2)`,
      [hash, entry.when],
    );
    console.log(`Baselined migration ${entry.tag} (hash ${hash})`);
  }

  console.log('Baseline complete.');
} finally {
  await pool.end();
}
