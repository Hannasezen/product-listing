import { headers } from "next/headers";
import { getToken } from "next-auth/jwt";

// Raw bearer token to forward to NestJS's SessionGuard (Authorization: Bearer <token>).
// Safe to call `raw: true` without a secret since it only reads the cookie value —
// the encode override in libs/auth/src/auth.config.ts makes that value itself the
// plain signed JWT SessionGuard verifies, no decoding needed here.
export async function getSessionToken(): Promise<string | null> {
  const secureCookie =
    process.env.NEXTAUTH_URL?.startsWith("https://") ?? false;
  const token = await getToken({
    req: { headers: await headers() },
    secureCookie,
    raw: true,
  });
  return token ?? null;
}
