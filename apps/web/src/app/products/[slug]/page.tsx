import Link from "next/link";
import { notFound } from "next/navigation";
import { AddFavoriteButton } from "@/components/product/AddFavoriteButton";
import { Button } from "@/components/ui/Button";
import { Heading } from "@/components/ui/Heading";
import { ShoppingBagIcon } from "@/components/ui/icons";
import { ProductImage } from "@/components/ui/ProductImage";
import { fetchJson } from "@/lib/api";
import { addFavorite, removeFavorite } from "@/lib/favorites-actions";
import { getFavoritedProductIds } from "@/lib/favorites";
import { productDetailApiPath } from "@/lib/routes";
import type { ProductWithCategory } from "@org/shared-types";

export const dynamic = "force-dynamic";

async function getProduct(slug: string) {
  try {
    return await fetchJson<ProductWithCategory>(productDetailApiPath(slug));
  } catch {
    return null;
  }
}

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  const favoritedProductIds = await getFavoritedProductIds();
  const callbackUrl = `/products/${slug}`;

  return (
    <div className="min-h-full bg-[radial-gradient(circle_at_top_left,_rgba(15,23,42,0.06),_transparent_32%)] text-slate-900">
      <main className="mx-auto flex min-h-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <nav aria-label="Breadcrumb" className="text-sm text-slate-500">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href="/" className="transition hover:text-slate-900">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-slate-600">
              <Link
                href={`/categories/${product.category.slug}`}
                className="transition hover:text-slate-900"
              >
                {product.category.name}
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="font-medium text-slate-900" aria-current="page">
              {product.name}
            </li>
          </ol>
        </nav>

        <section className="grid gap-8 rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8 md:grid-cols-2 md:items-start">
          <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-slate-100">
            {product.imageUrl ? (
              <ProductImage
                src={product.imageUrl}
                alt={product.name}
                sizes="(min-width: 768px) 40vw, 90vw"
                priority
              />
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-slate-400">
                No image
              </div>
            )}
          </div>

          <div>
            <span className="inline-flex rounded-full bg-slate-900 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-white">
              {product.category.name}
            </span>

            <Heading as="h1" className="mt-4">
              {product.name}
            </Heading>

            <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
              {product.description ?? "A reliable choice for everyday use."}
            </p>

            <p className="mt-6 text-3xl font-semibold text-slate-900">
              ${product.price.toFixed(2)}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button size="lg" className="cursor-pointer gap-2">
                <ShoppingBagIcon className="h-4 w-4" />
                Buy now
              </Button>
              <AddFavoriteButton
                productId={product.id}
                addFavorite={addFavorite.bind(null, callbackUrl)}
                removeFavorite={removeFavorite.bind(null, callbackUrl)}
                initialIsFavorited={favoritedProductIds.has(product.id)}
              />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
