"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { Session } from "next-auth";
import {
  ChevronDownIcon,
  MenuIcon,
  ShoppingBagIcon,
  XIcon,
} from "@/components/ui/icons";
import { categoryPagePath } from "@/lib/routes";
import type { Category } from "@org/shared-types";

const navItems = ["Home", "Shop", "About"];

type SessionUser = Session["user"];

type HeaderClientProps = {
  categories: Category[];
  user: SessionUser | null;
  onSignOut: () => Promise<void>;
};

function getInitials(user: SessionUser): string {
  if (user.name?.trim()) {
    const [first, ...rest] = user.name.trim().split(/\s+/);
    const last = rest.at(-1);
    return (first[0] + (last?.[0] ?? "")).toUpperCase();
  }
  return user.email?.[0]?.toUpperCase() ?? "?";
}

export function HeaderClient({
  categories,
  user,
  onSignOut,
}: HeaderClientProps) {
  const pathname = usePathname();
  const signInHref = `/sign-in?callbackUrl=${encodeURIComponent(pathname || "/")}`;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [isDesktopCategoriesOpen, setIsDesktopCategoriesOpen] = useState(false);
  const desktopCategoriesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isDesktopCategoriesOpen) return;

    function handleClickOutside(event: MouseEvent) {
      if (
        desktopCategoriesRef.current &&
        !desktopCategoriesRef.current.contains(event.target as Node)
      ) {
        setIsDesktopCategoriesOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isDesktopCategoriesOpen]);

  return (
    <header className="border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-sm">
            <ShoppingBagIcon className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
              Northstar
            </p>
            <p className="text-base font-semibold text-slate-900">Store</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => (
            <Link
              key={item}
              href="/"
              className="text-sm font-medium text-slate-600 transition hover:text-slate-900"
            >
              {item}
            </Link>
          ))}
          <div className="relative z-50" ref={desktopCategoriesRef}>
            <button
              className="flex items-center gap-2 rounded-full border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700"
              aria-expanded={isDesktopCategoriesOpen}
              onClick={() => setIsDesktopCategoriesOpen((open) => !open)}
            >
              Categories
              <ChevronDownIcon
                className={`h-4 w-4 transition ${isDesktopCategoriesOpen ? "rotate-180" : ""}`}
              />
            </button>
            {isDesktopCategoriesOpen ? (
              <div className="absolute right-0 z-[60] mt-2 min-w-44 rounded-2xl border border-slate-200 bg-white p-2 shadow-lg">
                {categories.length === 0 ? (
                  <p className="px-3 py-2 text-sm text-slate-500">
                    No categories yet
                  </p>
                ) : (
                  categories.map((category) => (
                    <Link
                      key={category.id}
                      href={categoryPagePath(category.slug)}
                      className="block rounded-xl px-3 py-2 text-sm text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
                      onClick={() => setIsDesktopCategoriesOpen(false)}
                    >
                      {category.name}
                    </Link>
                  ))
                )}
              </div>
            ) : null}
          </div>
        </nav>

        <div className="flex items-center gap-2">
          {user ? (
            <Link
              href="/my-account"
              className="hidden h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white transition hover:bg-slate-700 sm:inline-flex"
              aria-label="My account"
              title={user.email ?? undefined}
            >
              {getInitials(user)}
            </Link>
          ) : (
            <Link
              href={signInHref}
              className="hidden items-center justify-center rounded-full border border-transparent bg-transparent px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 sm:inline-flex"
            >
              Sign in
            </Link>
          )}
          <button
            className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-700 md:hidden"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            onClick={() => setIsMenuOpen((open) => !open)}
          >
            {isMenuOpen ? (
              <XIcon className="h-5 w-5" />
            ) : (
              <MenuIcon className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {isMenuOpen ? (
        <div
          id="mobile-menu"
          className="border-t border-slate-200 bg-white px-4 py-4 md:hidden"
        >
          <div className="space-y-3">
            {navItems.map((item) => (
              <Link
                key={item}
                href="/"
                className="block rounded-xl px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-slate-900"
                onClick={() => setIsMenuOpen(false)}
              >
                {item}
              </Link>
            ))}

            <div className="rounded-2xl border border-slate-200 p-3">
              <button
                className="flex w-full items-center justify-between rounded-xl px-2 py-2 text-sm font-medium text-slate-700"
                onClick={() => setIsCategoriesOpen((open) => !open)}
              >
                <span>Categories</span>
                <ChevronDownIcon
                  className={`h-4 w-4 transition ${isCategoriesOpen ? "rotate-180" : ""}`}
                />
              </button>

              {isCategoriesOpen ? (
                <div className="mt-2 space-y-1">
                  {categories.length === 0 ? (
                    <p className="px-3 py-2 text-sm text-slate-500">
                      No categories yet
                    </p>
                  ) : (
                    categories.map((category) => (
                      <Link
                        key={category.id}
                        href={categoryPagePath(category.slug)}
                        className="block rounded-xl px-3 py-2 text-sm text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {category.name}
                      </Link>
                    ))
                  )}
                </div>
              ) : null}
            </div>

            {user ? (
              <form action={onSignOut}>
                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-full border border-transparent bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-slate-700"
                >
                  Sign out
                </button>
              </form>
            ) : (
              <Link
                href={signInHref}
                onClick={() => setIsMenuOpen(false)}
                className="flex w-full items-center justify-center rounded-full border border-transparent bg-white px-4 py-2.5 text-sm font-medium text-slate-900 transition-colors hover:bg-slate-100"
              >
                Sign in
              </Link>
            )}
          </div>
        </div>
      ) : null}
    </header>
  );
}
