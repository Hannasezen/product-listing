"use client";

import { Button } from "@/components/ui/Button";
import { HeartIcon } from "@/components/ui/icons";
import { useFavoriteToggle } from "@/components/product/useFavoriteToggle";

type FavoriteActionResult = { ok: boolean; error?: string };

type AddFavoriteButtonProps = {
  productId: string;
  addFavorite: (productId: string) => Promise<FavoriteActionResult>;
  removeFavorite: (productId: string) => Promise<FavoriteActionResult>;
  initialIsFavorited?: boolean;
};

export function AddFavoriteButton({
  productId,
  addFavorite,
  removeFavorite,
  initialIsFavorited = false,
}: AddFavoriteButtonProps) {
  const { isFavorited, isPending, error, toggle } = useFavoriteToggle({
    productId,
    addFavorite,
    removeFavorite,
    initialIsFavorited,
  });

  return (
    <div className="flex flex-col gap-2">
      <Button
        variant="secondary"
        size="lg"
        className="cursor-pointer gap-2"
        onClick={toggle}
        disabled={isPending}
      >
        <HeartIcon className="h-4 w-4" filled={isFavorited} />
        {isFavorited ? "Remove from favourites" : "Add to favourites"}
      </Button>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </div>
  );
}
