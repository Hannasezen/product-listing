import { ItemCard } from "@/components/ui/ItemCard";
import type { ProductWithCategory } from "@org/shared-types";

type ProductGridProps = {
  products: ProductWithCategory[];
  emptyMessage?: string;
};

export function ProductGrid({
  products,
  emptyMessage = "No products are available right now.",
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
          slug={product.slug}
          title={product.name}
          description={
            product.description ?? "A reliable choice for everyday use."
          }
          category={product.category.name}
          price={product.price}
          imageUrl={product.imageUrl}
          stock="In stock"
        />
      ))}
    </div>
  );
}
