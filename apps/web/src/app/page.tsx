import { Heading } from '@/components/ui/Heading';
import { ItemCard } from '@/components/ui/ItemCard';
import { fetchJson } from '@/lib/api';
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
  const products = await getProducts();

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

          {products.length === 0 ? (
            <div className="rounded-[1.5rem] border border-dashed border-slate-300 bg-white/70 p-8 text-center text-slate-600">
              No products are available right now. The API connection can be checked next.
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {products.map((product) => (
                <ItemCard
                  key={product.id}
                  slug={product.slug}
                  title={product.name}
                  description={product.description ?? 'A reliable choice for everyday use.'}
                  category={product.category.name}
                  price={product.price}
                  stock="In stock"
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
