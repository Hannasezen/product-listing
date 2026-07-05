/// <reference types="node" />

import { defineConfig } from 'drizzle-kit';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

const rawDatabaseUrl = process.env.DATABASE_URL || '';
const databaseUrl = (() => {
  if (!rawDatabaseUrl) return '';

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

export default defineConfig({
  schema: join(__dirname, 'src/schema.ts'),
  out: join(__dirname, 'src/migrations'),
  dialect: 'postgresql',
  dbCredentials: {
    url: databaseUrl,
  },
});