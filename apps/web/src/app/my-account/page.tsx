import Link from "next/link";
import { redirect } from "next/navigation";
import { auth, signOut } from "@/auth";
import { Button } from "@/components/ui/Button";
import { Heading } from "@/components/ui/Heading";
import { fetchJsonWithToken } from "@/lib/api";
import { FAVORITES_API_PATH, productDetailPagePath } from "@/lib/routes";
import { getSessionToken } from "@/lib/session-token";
import type { FavoriteProduct } from "@org/shared-types";

function getFirstName(name?: string | null, email?: string | null): string {
  if (name?.trim()) return name.trim().split(/\s+/)[0];
  return email?.split("@")[0] ?? "there";
}

async function getFavorites(): Promise<FavoriteProduct[]> {
  const token = await getSessionToken();
  if (!token) return [];
  try {
    return await fetchJsonWithToken<FavoriteProduct[]>(FAVORITES_API_PATH, token);
  } catch {
    return [];
  }
}

export default async function MyAccountPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/sign-in?callbackUrl=/my-account");
  }

  const firstName = getFirstName(session.user.name, session.user.email);
  const favorites = await getFavorites();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <Heading as="h1">Welcome, {firstName}</Heading>
      <form
        action={async () => {
          "use server";
          await signOut({ redirectTo: "/" });
        }}
        className="mt-6"
      >
        <Button type="submit" variant="secondary">
          Sign out
        </Button>
      </form>

      <section className="mt-10">
        <Heading as="h2">Favourites</Heading>
        {favorites.length === 0 ? (
          <p className="mt-3 text-sm text-slate-500">
            You haven't added any products to your favourites yet.
          </p>
        ) : (
          <ul className="mt-3 divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white">
            {favorites.map((product) => (
              <li key={product.id}>
                <Link
                  href={productDetailPagePath(product.slug)}
                  className="block px-4 py-3 text-sm font-medium text-slate-900 transition hover:bg-slate-50"
                >
                  {product.name}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
