import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { DRIZZLE, eq, and, favorites, products, type Database } from "@org/db";
import type { FavoriteProduct } from "@org/shared-types";
import { toProductDto } from "../products/products.service.js";

@Injectable()
export class FavoritesService {
  constructor(@Inject(DRIZZLE) private readonly db: Database) {}

  async findAllForUser(userId: string): Promise<FavoriteProduct[]> {
    const rows = await this.db.query.favorites.findMany({
      where: eq(favorites.userId, userId),
      with: {
        product: {
          with: {
            category: true,
          },
        },
      },
    });
    return rows.map((row) => ({
      ...toProductDto(row.product),
      addedAt: row.createdAt.toISOString(),
    }));
  }

  async add(userId: string, productId: string) {
    const exists = await this.db.query.products.findFirst({
      where: eq(products.id, productId),
      columns: { id: true },
    });
    if (!exists) throw new NotFoundException(`Product ${productId} not found`);
    await this.db
      .insert(favorites)
      .values({ userId, productId })
      .onConflictDoNothing();
  }

  async remove(userId: string, productId: string) {
    await this.db
      .delete(favorites)
      .where(
        and(eq(favorites.userId, userId), eq(favorites.productId, productId)),
      );
  }
}
