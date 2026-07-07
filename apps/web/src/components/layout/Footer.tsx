export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50/70">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-8 text-sm text-slate-600 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <p>© 2026 Northstar Store. Crafted for modern product experiences.</p>
        <div className="flex flex-wrap gap-4">
          <a href="/" className="transition hover:text-slate-900">
            Privacy
          </a>
          <a href="/" className="transition hover:text-slate-900">
            Terms
          </a>
          <a href="/" className="transition hover:text-slate-900">
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}
