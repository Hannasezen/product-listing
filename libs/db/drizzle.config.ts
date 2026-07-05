/// <reference types="node" />

import { defineConfig } from 'drizzle-kit';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  schema: join(__dirname, 'src/schema.ts'),
  out: join(__dirname, 'src/migrations'),
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL || '',
  },
});