import { fetchJsonWithToken } from "@/lib/api";
import { FAVORITES_API_PATH } from "@/lib/routes";
import { getSessionToken } from "@/lib/session-token";
import type { FavoriteProduct } from "@org/shared-types";

export async function getFavoritedProductIds(): Promise<Set<string>> {
  const token = await getSessionToken();
  if (!token) return new Set();
  try {
    const favorites = await fetchJsonWithToken<FavoriteProduct[]>(
      FAVORITES_API_PATH,
      token,
    );
    return new Set(favorites.map((favorite) => favorite.id));
  } catch {
    return new Set();
  }
}
