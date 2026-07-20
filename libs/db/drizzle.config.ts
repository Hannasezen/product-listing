/// <reference types="node" />

import { defineConfig } from "drizzle-kit";
import { fileURLToPath } from "url";
import { dirname, join, relative } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));

// drizzle-kit mishandles absolute `schema`/`out` paths (it naively prefixes
// them with "./", producing a broken path like ".//Users/..."). Resolving
// to a path relative to the invocation cwd sidesteps that, regardless of
// where the command is run from (repo root, libs/db, or via nx).
const relativeToCwd = (absolutePath: string) =>
  relative(process.cwd(), absolutePath);

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

export default defineConfig({
  schema: relativeToCwd(join(__dirname, "src/schema.ts")),
  out: relativeToCwd(join(__dirname, "src/migrations")),
  dialect: "postgresql",
  dbCredentials: {
    url: databaseUrl,
  },
});
