import { auth, signOut } from "@/auth";
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

async function signOutAction() {
  "use server";
  await signOut({ redirectTo: "/" });
}

export async function Header() {
  const [categories, session] = await Promise.all([getCategories(), auth()]);

  return (
    <HeaderClient
      categories={categories}
      user={session?.user ?? null}
      onSignOut={signOutAction}
    />
  );
}
