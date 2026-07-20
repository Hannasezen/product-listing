import type { DefaultSession, NextAuthConfig } from "next-auth";
import type { JWT } from "next-auth/jwt";
import { SignJWT, jwtVerify } from "jose";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "admin" | "user";
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: "admin" | "user";
  }
}

function getAdminEmails(): string[] {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

function getSecretKey(secret: string | string[]): Uint8Array {
  const value = Array.isArray(secret) ? secret[0] : secret;
  return new TextEncoder().encode(value);
}

const DEFAULT_MAX_AGE_SECONDS = 30 * 24 * 60 * 60;

// Auth.js encrypts session JWTs by default (JWE, via an HKDF-derived key) — fine
// within Next.js, but NestJS's SessionGuard also needs to verify this token using
// only the shared NEXTAUTH_SECRET (see TECHNICAL.md), without replicating Auth.js's
// internal key derivation. Overriding encode/decode here to a plain HS256-signed
// JWT makes that a standard jose.jwtVerify() call on the NestJS side.
const jwt = {
  async encode({ token, secret, maxAge }) {
    const key = getSecretKey(secret);
    const expiresInSeconds = maxAge ?? DEFAULT_MAX_AGE_SECONDS;
    return new SignJWT(token ?? {})
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime(Math.floor(Date.now() / 1000) + expiresInSeconds)
      .sign(key);
  },
  async decode({ token, secret }): Promise<JWT | null> {
    if (!token) return null;
    const key = getSecretKey(secret);
    const { payload } = await jwtVerify(token, key);
    return payload as JWT;
  },
} satisfies NextAuthConfig["jwt"];

// Providers and adapter are added by the full config in apps/web/src/auth.ts —
// this base config stays free of Node-only code so apps/web/src/middleware.ts
// can safely import it into the Edge runtime.
export const authConfig = {
  pages: {
    signIn: "/sign-in",
  },
  // Adapter presence defaults Auth.js to database sessions; this app is JWT-only
  // (see TECHNICAL.md) and the adapter config deliberately omits sessionsTable.
  session: {
    strategy: "jwt",
  },
  jwt,
  providers: [],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id as string;
        token.role = getAdminEmails().includes((user.email ?? "").toLowerCase())
          ? "admin"
          : "user";
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = token.id;
      session.user.role = token.role;
      return session;
    },
    authorized({ auth, request }) {
      const isAdminRoute = request.nextUrl.pathname.startsWith("/admin");
      if (isAdminRoute) {
        return auth?.user?.role === "admin";
      }
      return true;
    },
  },
} satisfies NextAuthConfig;
