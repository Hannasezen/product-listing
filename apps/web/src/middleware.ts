import NextAuth, { type NextAuthResult } from "next-auth";
import { authConfig } from "@org/auth/auth.config";

// Edge runtime — imports only the adapter-free base config, never apps/web/src/auth.ts.
const { auth }: NextAuthResult = NextAuth(authConfig);

export default auth;

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
