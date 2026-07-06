import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { DRIZZLE, eq, products, type Database } from "@org/db";
import type { ProductWithCategory } from "@org/shared-types";
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
}

function toProductDto(row: ProductRow): ProductWithCategory {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    price: Number(row.price),
    categoryId: row.categoryId,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
    category: {
      id: row.category.id,
      name: row.category.name,
      description: row.category.description,
      createdAt: row.category.createdAt.toISOString(),
    },
  };
}
