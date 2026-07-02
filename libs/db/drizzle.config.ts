import { defineConfig } from 'drizzle-kit';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));

dotenv.config();
export default defineConfig({
  schema: join(__dirname, 'src/schema.ts'),
  out: join(__dirname, 'src/migrations'),
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL || '',
  },
});
