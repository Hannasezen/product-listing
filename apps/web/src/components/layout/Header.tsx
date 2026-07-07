import { fetchJson } from "@/lib/api";
import type { Category } from "@org/shared-types";
import { HeaderClient } from "./HeaderClient";

async function getCategories() {
  try {
    return await fetchJson<Category[]>("/api/categories");
  } catch {
    return [];
  }
}

export async function Header() {
  const categories = await getCategories();

  return <HeaderClient categories={categories} />;
}
