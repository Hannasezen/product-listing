import { Inject, Injectable } from "@nestjs/common";
import { DRIZZLE, type Database } from "@org/db";
import type { Category } from "@org/shared-types";

@Injectable()
export class CategoriesService {
  constructor(@Inject(DRIZZLE) private readonly db: Database) {}

  async findAll(): Promise<Category[]> {
    const rows = await this.db.query.categories.findMany({
      orderBy: (c, { asc }) => [asc(c.name)],
    });
    return rows.map((row) => ({
      id: row.id,
      name: row.name,
      description: row.description,
      createdAt: row.createdAt.toISOString(),
    }));
  }
}
