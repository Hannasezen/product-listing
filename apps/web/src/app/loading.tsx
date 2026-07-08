export default function Loading() {
  return (
    <div className="flex min-h-full items-center justify-center bg-[radial-gradient(circle_at_top_left,_rgba(15,23,42,0.06),_transparent_32%)] px-4 py-24">
      <div className="flex flex-col items-center gap-4 text-slate-500">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900" />
        <p className="text-sm font-medium">Loading...</p>
      </div>
    </div>
  );
}
