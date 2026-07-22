"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { HeartIcon } from "@/components/ui/icons";

type AddFavoriteResult = { ok: boolean; error?: string };

type AddFavoriteButtonProps = {
  productId: string;
  addFavorite: (productId: string) => Promise<AddFavoriteResult>;
};

export function AddFavoriteButton({
  productId,
  addFavorite,
}: AddFavoriteButtonProps) {
  const [status, setStatus] = useState<"idle" | "pending" | "added" | "error">(
    "idle",
  );
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    setStatus("pending");
    setError(null);
    const result = await addFavorite(productId);
    if (result.ok) {
      setStatus("added");
    } else {
      setStatus("error");
      setError(result.error ?? "Something went wrong. Please try again.");
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <Button
        variant="secondary"
        size="lg"
        className="gap-2"
        onClick={handleClick}
        disabled={status === "pending" || status === "added"}
      >
        <HeartIcon className="h-4 w-4" />
        {status === "added" ? "Added to favourites" : "Add to favourites"}
      </Button>
      {status === "error" ? (
        <p className="text-sm text-red-600">{error}</p>
      ) : null}
    </div>
  );
}
