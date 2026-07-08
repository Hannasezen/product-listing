import Image from "next/image";
import Link from "next/link";
import { productDetailPagePath } from "@/lib/routes";

type ItemCardProps = {
  slug: string;
  title: string;
  description: string;
  category: string;
  price: number;
  imageUrl?: string | null;
  stock?: string | number;
};

export function ItemCard({
  slug,
  title,
  description,
  category,
  price,
  imageUrl,
  stock = "In stock",
}: ItemCardProps) {
  const stockLabel = typeof stock === "number" ? `Stock ${stock}` : stock;

  return (
    <Link
      href={productDetailPagePath(slug)}
      className="block rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm cursor-pointer"
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-slate-100">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={title}
            fill
            sizes="(min-width: 1280px) 360px, (min-width: 768px) 45vw, 90vw"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-slate-400">
            No image
          </div>
        )}
      </div>

      <div className="mt-4 flex items-start justify-between gap-3">
        <span className="inline-flex rounded-full bg-slate-900 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-white">
          {category}
        </span>
        <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
          {stockLabel}
        </span>
      </div>

      <div className="mt-5 space-y-3">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
        </div>

        <div className="flex items-center justify-between border-t border-slate-100 pt-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
              Price
            </p>
            <p className="mt-1 text-lg font-semibold text-slate-900">
              ${price.toFixed(2)}
            </p>
          </div>
          <span className="text-sm font-medium text-slate-500">View</span>
        </div>
      </div>
    </Link>
  );
}
