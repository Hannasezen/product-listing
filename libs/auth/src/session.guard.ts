import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import type { Request } from "express";
import { jwtVerify } from "jose";

export interface SessionUser {
  id: string;
  role: "admin" | "user";
}

declare module "express" {
  interface Request {
    user?: SessionUser;
  }
}

function extractBearerToken(header: string | undefined): string | null {
  if (!header?.startsWith("Bearer ")) return null;
  return header.slice("Bearer ".length).trim() || null;
}

// Verifies the plain HS256 JWT issued by apps/web's Auth.js config (see the
// custom jwt.encode/decode in libs/auth/src/auth.config.ts) using the secret
// shared between web and api — no adapter/DB access needed here.
@Injectable()
export class SessionGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = extractBearerToken(request.headers.authorization);
    if (!token) {
      throw new UnauthorizedException("Missing session token");
    }

    const secret = process.env.NEXTAUTH_SECRET;
    if (!secret) {
      throw new UnauthorizedException("Server is missing NEXTAUTH_SECRET");
    }

    try {
      const { payload } = await jwtVerify(
        token,
        new TextEncoder().encode(secret),
      );
      request.user = {
        id: payload.id as string,
        role: payload.role as "admin" | "user",
      };
      return true;
    } catch {
      throw new UnauthorizedException("Invalid session token");
    }
  }
}
