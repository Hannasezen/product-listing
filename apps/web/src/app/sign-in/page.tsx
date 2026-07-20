import { signIn } from "@/auth";
import { Button } from "@/components/ui/Button";
import { Heading } from "@/components/ui/Heading";

function safeRedirectTarget(callbackUrl?: string): string {
  if (callbackUrl?.startsWith("/") && !callbackUrl.startsWith("//")) {
    return callbackUrl;
  }
  return "/";
}

type SignInPageProps = {
  searchParams: Promise<{ callbackUrl?: string }>;
};

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const { callbackUrl } = await searchParams;
  const redirectTo = safeRedirectTarget(callbackUrl);

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center gap-6 px-4 text-center">
      <Heading as="h1">Sign in</Heading>
      <p className="text-sm text-slate-500">
        Sign in to save favorites and manage your cart.
      </p>
      <form
        action={async () => {
          "use server";
          await signIn("google", { redirectTo });
        }}
        className="w-full"
      >
        <Button type="submit" size="lg" className="w-full">
          Sign in with Google
        </Button>
      </form>

      <div className="flex w-full items-center gap-3 text-xs font-medium uppercase tracking-wide text-slate-400">
        <span className="h-px flex-1 bg-slate-200" />
        or
        <span className="h-px flex-1 bg-slate-200" />
      </div>

      <form
        action={async (formData) => {
          "use server";
          await signIn("resend", formData);
        }}
        className="w-full space-y-3"
      >
        <input type="hidden" name="redirectTo" value={redirectTo} />
        <input
          type="email"
          name="email"
          required
          placeholder="you@example.com"
          className="w-full rounded-full border border-slate-200 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none"
        />
        <Button type="submit" variant="secondary" size="lg" className="w-full">
          Send magic link
        </Button>
      </form>
    </div>
  );
}
