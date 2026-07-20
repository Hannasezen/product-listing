import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "./client.js";
import { users, accounts, verificationTokens } from "./schema.js";

// sessionsTable is intentionally omitted — session strategy is JWT (see TECHNICAL.md),
// so the adapter never reads/writes the `sessions` table.
export const authAdapter = DrizzleAdapter(db, {
  usersTable: users,
  accountsTable: accounts,
  verificationTokensTable: verificationTokens,
});
