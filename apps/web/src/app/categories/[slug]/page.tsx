import Link from "next/link";
import { notFound } from "next/navigation";
import { Heading } from "@/components/ui/Heading";
import { ProductGrid } from "@/components/ui/ProductGrid";
import { fetchJson } from "@/lib/api";
import { addFavorite, removeFavorite } from "@/lib/favorites-actions";
import { getFavoritedProductIds } from "@/lib/favorites";
import { categoryDetailApiPath, productListByCategoryApiPath } from "@/lib/routes";
import type { Category, ProductWithCategory } from "@org/shared-types";

export const dynamic = "force-dynamic";

async function getCategory(slug: string) {
  try {
    return await fetchJson<Category>(categoryDetailApiPath(slug));
  } catch {
    return null;
  }
}

async function getCategoryProducts(categoryId: string) {
  try {
    return await fetchJson<ProductWithCategory[]>(
      productListByCategoryApiPath(categoryId),
    );
  } catch {
    return [];
  }
}

type CategoryPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = await getCategory(slug);

  if (!category) {
    notFound();
  }

  const [products, favoritedProductIds] = await Promise.all([
    getCategoryProducts(category.id),
    getFavoritedProductIds(),
  ]);

  const callbackUrl = `/categories/${slug}`;

  return (
    <div className="min-h-full bg-[radial-gradient(circle_at_top_left,_rgba(15,23,42,0.06),_transparent_32%)] text-slate-900">
      <main className="mx-auto flex min-h-full max-w-7xl flex-col gap-10 px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <nav aria-label="Breadcrumb" className="text-sm text-slate-500">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href="/" className="transition hover:text-slate-900">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="font-medium text-slate-900" aria-current="page">
              {category.name}
            </li>
          </ol>
        </nav>

        <section className="space-y-4">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
                Category
              </p>
              <Heading as="h1">{category.name}</Heading>
            </div>
            <p className="text-sm text-slate-500">{products.length} items</p>
          </div>

          <ProductGrid
            products={products}
            emptyMessage="No products in this category yet."
            favoritedProductIds={favoritedProductIds}
            addFavorite={addFavorite.bind(null, callbackUrl)}
            removeFavorite={removeFavorite.bind(null, callbackUrl)}
          />
        </section>
      </main>
    </div>
  );
}
