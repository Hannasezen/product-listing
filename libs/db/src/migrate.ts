import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
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

const pool = new Pool({
  connectionString: databaseUrl,
  ssl: { rejectUnauthorized: false },
});

try {
  await migrate(drizzle(pool), {
    migrationsFolder: join(__dirname, 'migrations'),
  });
  console.log('Migrations applied successfully');
} catch (err) {
  console.error('Migration failed:', err);
  process.exitCode = 1;
} finally {
  await pool.end();
}
