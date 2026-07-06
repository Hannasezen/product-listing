import { Global, Module } from "@nestjs/common";
import { db } from "./client.js";

export const DRIZZLE = Symbol("DRIZZLE_CLIENT");

@Global()
@Module({
  providers: [{ provide: DRIZZLE, useValue: db }],
  exports: [DRIZZLE],
})
export class DbModule {}
