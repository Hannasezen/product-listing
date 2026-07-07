"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import {
  ChevronDownIcon,
  MenuIcon,
  ShoppingBagIcon,
  XIcon,
} from "@/components/ui/icons";
import type { Category } from "@org/shared-types";

const navItems = ["Home", "Shop", "About"];

type HeaderClientProps = {
  categories: Category[];
};

export function HeaderClient({ categories }: HeaderClientProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);

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
          <div className="group relative z-50">
            <button className="flex items-center gap-2 rounded-full border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700">
              Categories
              <ChevronDownIcon className="h-4 w-4" />
            </button>
            <div className="absolute right-0 z-[60] mt-2 hidden min-w-44 rounded-2xl border border-slate-200 bg-white p-2 shadow-lg group-hover:block">
              {categories.length === 0 ? (
                <p className="px-3 py-2 text-sm text-slate-500">
                  No categories yet
                </p>
              ) : (
                categories.map((category) => (
                  <Link
                    key={category.id}
                    href="/"
                    className="block rounded-xl px-3 py-2 text-sm text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
                  >
                    {category.name}
                  </Link>
                ))
              )}
            </div>
          </div>
        </nav>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="hidden sm:inline-flex">
            Sign in
          </Button>
          <button
            className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-700 md:hidden"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            onClick={() => setIsMenuOpen((open) => !open)}
          >
            {isMenuOpen ? <XIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {isMenuOpen ? (
        <div id="mobile-menu" className="border-t border-slate-200 bg-white px-4 py-4 md:hidden">
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
                <ChevronDownIcon className={`h-4 w-4 transition ${isCategoriesOpen ? "rotate-180" : ""}`} />
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
                        href="/"
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

            <Button variant="secondary" className="w-full justify-center">
              Sign in
            </Button>
          </div>
        </div>
      ) : null}
    </header>
  );
}
