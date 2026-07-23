"use client";

import { useState } from "react";

type FavoriteActionResult = { ok: boolean; error?: string };

type UseFavoriteToggleOptions = {
  productId: string;
  addFavorite: (productId: string) => Promise<FavoriteActionResult>;
  removeFavorite: (productId: string) => Promise<FavoriteActionResult>;
  initialIsFavorited?: boolean;
};

export function useFavoriteToggle({
  productId,
  addFavorite,
  removeFavorite,
  initialIsFavorited = false,
}: UseFavoriteToggleOptions) {
  const [isFavorited, setIsFavorited] = useState(initialIsFavorited);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function toggle() {
    setIsPending(true);
    setError(null);
    const result = isFavorited
      ? await removeFavorite(productId)
      : await addFavorite(productId);
    if (result.ok) {
      setIsFavorited(!isFavorited);
    } else {
      setError(
        result.error ??
          `Couldn't ${isFavorited ? "remove from" : "add to"} favourites. Please try again.`,
      );
    }
    setIsPending(false);
  }

  return { isFavorited, isPending, error, toggle };
}
