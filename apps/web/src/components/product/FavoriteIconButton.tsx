"use client";

import { HeartIcon } from "@/components/ui/icons";
import { useFavoriteToggle } from "@/components/product/useFavoriteToggle";

type FavoriteActionResult = { ok: boolean; error?: string };

type FavoriteIconButtonProps = {
  productId: string;
  addFavorite: (productId: string) => Promise<FavoriteActionResult>;
  removeFavorite: (productId: string) => Promise<FavoriteActionResult>;
  initialIsFavorited?: boolean;
  className?: string;
};

export function FavoriteIconButton({
  productId,
  addFavorite,
  removeFavorite,
  initialIsFavorited = false,
  className = "",
}: FavoriteIconButtonProps) {
  const { isFavorited, isPending, toggle } = useFavoriteToggle({
    productId,
    addFavorite,
    removeFavorite,
    initialIsFavorited,
  });

  return (
    <button
      type="button"
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        toggle();
      }}
      disabled={isPending}
      aria-label={
        isFavorited ? "Remove from favourites" : "Add to favourites"
      }
      aria-pressed={isFavorited}
      className={`inline-flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-white/90 text-slate-900 shadow-sm backdrop-blur transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-70 ${className}`}
    >
      <HeartIcon
        className={`h-6 w-6 ${isFavorited ? "text-orange-400" : ""}`}
        filled={isFavorited}
      />
    </button>
  );
}
