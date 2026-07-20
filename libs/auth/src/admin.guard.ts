import {
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from "@nestjs/common";
import type { Request } from "express";
import { SessionGuard } from "./session.guard.js";

// Runs SessionGuard's verification first, then additionally requires the
// role claim (set from ADMIN_EMAILS in the jwt callback) to be "admin".
@Injectable()
export class AdminGuard extends SessionGuard {
  override async canActivate(context: ExecutionContext): Promise<boolean> {
    await super.canActivate(context);

    const request = context.switchToHttp().getRequest<Request>();
    if (request.user?.role !== "admin") {
      throw new ForbiddenException("Admin access required");
    }

    return true;
  }
}
