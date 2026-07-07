type ItemCardProps = {
  title: string;
  description: string;
  category: string;
  price: number;
  stock?: string | number;
};

export function ItemCard({
  title,
  description,
  category,
  price,
  stock = "In stock",
}: ItemCardProps) {
  const stockLabel = typeof stock === "number" ? `Stock ${stock}` : stock;

  return (
    <article className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
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
    </article>
  );
}
