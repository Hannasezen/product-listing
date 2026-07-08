import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { categories, DRIZZLE, eq, type Database } from "@org/db";
import type { Category } from "@org/shared-types";
import { slugify } from "@org/shared-utils";

export type CategoryRow = {
  id: string;
  name: string;
  slug: string | null;
  description: string | null;
  createdAt: Date;
};

export function toCategoryDto(row: CategoryRow): Category {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug ?? slugify(row.name),
    description: row.description,
    createdAt: row.createdAt.toISOString(),
  };
}

@Injectable()
export class CategoriesService {
  constructor(@Inject(DRIZZLE) private readonly db: Database) {}

  async findAll(): Promise<Category[]> {
    const rows = await this.db.query.categories.findMany({
      orderBy: (c, { asc }) => [asc(c.name)],
    });
    return rows.map(toCategoryDto);
  }

  async findBySlug(slug: string): Promise<Category> {
    const row = await this.db.query.categories.findFirst({
      where: eq(categories.slug, slug),
    });
    if (!row) throw new NotFoundException(`Category ${slug} not found`);
    return toCategoryDto(row);
  }
}
