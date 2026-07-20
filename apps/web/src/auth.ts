import NextAuth, { type NextAuthResult } from "next-auth";
import Google from "next-auth/providers/google";
import Resend from "next-auth/providers/resend";
import { authAdapter } from "@org/db/auth-adapter";
import { authConfig } from "@org/auth/auth.config";

export const { handlers, auth, signIn, signOut }: NextAuthResult = NextAuth({
  ...authConfig,
  adapter: authAdapter,
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Resend({
      apiKey: process.env.RESEND_API_KEY,
      from: process.env.EMAIL_FROM,
    }),
  ],
});
