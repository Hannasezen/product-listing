import { ItemCard } from "@/components/ui/ItemCard";
import type { ProductWithCategory } from "@org/shared-types";

type FavoriteActionResult = { ok: boolean; error?: string };

type ProductGridProps = {
  products: ProductWithCategory[];
  emptyMessage?: string;
  favoritedProductIds: Set<string>;
  addFavorite: (productId: string) => Promise<FavoriteActionResult>;
  removeFavorite: (productId: string) => Promise<FavoriteActionResult>;
};

export function ProductGrid({
  products,
  emptyMessage = "No products are available right now.",
  favoritedProductIds,
  addFavorite,
  removeFavorite,
}: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="rounded-[1.5rem] border border-dashed border-slate-300 bg-white/70 p-8 text-center text-slate-600">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="grid gap-4 min-[480px]:grid-cols-2 min-[920px]:grid-cols-3">
      {products.map((product) => (
        <ItemCard
          key={product.id}
          productId={product.id}
          slug={product.slug}
          title={product.name}
          description={
            product.description ?? "A reliable choice for everyday use."
          }
          category={product.category.name}
          price={product.price}
          imageUrl={product.imageUrl}
          stock="In stock"
          initialIsFavorited={favoritedProductIds.has(product.id)}
          addFavorite={addFavorite}
          removeFavorite={removeFavorite}
        />
      ))}
    </div>
  );
}
