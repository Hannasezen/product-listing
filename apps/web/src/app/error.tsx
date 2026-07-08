"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Heading } from "@/components/ui/Heading";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-full items-center justify-center bg-[radial-gradient(circle_at_top_left,_rgba(15,23,42,0.06),_transparent_32%)] px-4 py-24">
      <div className="max-w-md text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
          Error
        </p>
        <Heading as="h1" className="mt-2">
          Something went wrong
        </Heading>
        <p className="mt-3 text-base leading-7 text-slate-600">
          We couldn't load this page. Please try again.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Button onClick={() => reset()}>Try again</Button>
          <Button variant="secondary" onClick={() => router.push("/")}>
            Go home
          </Button>
        </div>
      </div>
    </div>
  );
}
