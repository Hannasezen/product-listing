import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { DRIZZLE, eq, products, type Database } from "@org/db";
import type { ProductWithCategory } from "@org/shared-types";
import { toCategoryDto } from "../categories/categories.service.js";
import { ListProductsQueryDto } from "./dto/list-products.dto.js";

type FindProductsConfig = NonNullable<
  Parameters<Database["query"]["products"]["findFirst"]>[0]
>;

function findProductWithCategory(
  db: Database,
  where?: FindProductsConfig["where"],
) {
  return db.query.products.findFirst({ where, with: { category: true } });
}

type ProductRow = NonNullable<
  Awaited<ReturnType<typeof findProductWithCategory>>
>;

@Injectable()
export class ProductsService {
  constructor(@Inject(DRIZZLE) private readonly db: Database) {}

  async findAll(query: ListProductsQueryDto): Promise<ProductWithCategory[]> {
    const rows = await this.db.query.products.findMany({
      where: query.categoryId
        ? eq(products.categoryId, query.categoryId)
        : undefined,
      with: { category: true },
      orderBy: (p, { asc }) => [asc(p.name)],
    });
    return rows.map(toProductDto);
  }
  async findOne(id: string): Promise<ProductWithCategory> {
    const row = await findProductWithCategory(this.db, eq(products.id, id));
    if (!row) throw new NotFoundException(`Product ${id} not found`);
    return toProductDto(row);
  }

  async findBySlug(slug: string): Promise<ProductWithCategory> {
    const row = await findProductWithCategory(this.db, eq(products.slug, slug));
    if (!row) throw new NotFoundException(`Product ${slug} not found`);
    return toProductDto(row);
  }
}

function toProductDto(row: ProductRow): ProductWithCategory {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    price: Number(row.price),
    imageUrl: row.imageUrl,
    categoryId: row.categoryId,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
    category: toCategoryDto(row.category),
  };
}
