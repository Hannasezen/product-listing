"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { deleteWithToken, postJsonWithToken } from "@/lib/api";
import { FAVORITES_API_PATH, favoriteApiPath } from "@/lib/routes";
import { getSessionToken } from "@/lib/session-token";

export type FavoriteActionResult = { ok: boolean; error?: string };

async function requireSessionToken(callbackUrl: string): Promise<string> {
  const session = await auth();
  if (!session?.user) {
    redirect(`/sign-in?callbackUrl=${encodeURIComponent(callbackUrl)}`);
  }

  const token = await getSessionToken();
  if (!token) {
    redirect(`/sign-in?callbackUrl=${encodeURIComponent(callbackUrl)}`);
  }

  return token;
}

export async function addFavorite(
  callbackUrl: string,
  productId: string,
): Promise<FavoriteActionResult> {
  const token = await requireSessionToken(callbackUrl);

  const response = await postJsonWithToken(FAVORITES_API_PATH, token, {
    productId,
  });

  if (!response.ok) {
    return {
      ok: false,
      error: "Couldn't add to favourites. Please try again.",
    };
  }

  revalidatePath("/", "layout");
  return { ok: true };
}

export async function removeFavorite(
  callbackUrl: string,
  productId: string,
): Promise<FavoriteActionResult> {
  const token = await requireSessionToken(callbackUrl);

  const response = await deleteWithToken(favoriteApiPath(productId), token);

  if (!response.ok) {
    return {
      ok: false,
      error: "Couldn't remove from favourites. Please try again.",
    };
  }

  revalidatePath("/", "layout");
  return { ok: true };
}
