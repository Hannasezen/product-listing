import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema.js";

const rawDatabaseUrl = process.env.DATABASE_URL || "";
const databaseUrl = (() => {
  if (!rawDatabaseUrl) return "";

  try {
    const url = new URL(rawDatabaseUrl);
    if (!url.searchParams.has("sslmode")) {
      url.searchParams.set("sslmode", "require");
    }
    return url.toString();
  } catch {
    return rawDatabaseUrl;
  }
})();

const pool = new Pool({
  connectionString: databaseUrl,
  ssl: databaseUrl ? { rejectUnauthorized: false } : false,
});

export const db = drizzle(pool, { schema });
export type Database = typeof db;
