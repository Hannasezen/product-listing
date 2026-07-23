import { Heading } from '@/components/ui/Heading';
import { ProductGrid } from '@/components/ui/ProductGrid';
import { fetchJson } from '@/lib/api';
import { addFavorite, removeFavorite } from '@/lib/favorites-actions';
import { getFavoritedProductIds } from '@/lib/favorites';
import { PRODUCT_LIST_API_PATH } from '@/lib/routes';
import type { ProductWithCategory } from '@org/shared-types';

export const dynamic = 'force-dynamic';

async function getProducts() {
  try {
    return await fetchJson<ProductWithCategory[]>(PRODUCT_LIST_API_PATH);
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const [products, favoritedProductIds] = await Promise.all([
    getProducts(),
    getFavoritedProductIds(),
  ]);

  return (
    <div className="min-h-full bg-[radial-gradient(circle_at_top_left,_rgba(15,23,42,0.06),_transparent_32%)] text-slate-900">
      <main className="mx-auto flex min-h-full max-w-7xl flex-col gap-10 px-4 py-8 sm:px-6 lg:px-8 lg:py-12">

        <section className="space-y-4">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Product list</p>
              <Heading as="h2">Popular products</Heading>
            </div>
            <p className="text-sm text-slate-500">{products.length} items</p>
          </div>

          <ProductGrid
            products={products}
            favoritedProductIds={favoritedProductIds}
            addFavorite={addFavorite.bind(null, "/")}
            removeFavorite={removeFavorite.bind(null, "/")}
          />
        </section>
      </main>
    </div>
  );
}
