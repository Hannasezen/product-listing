import { redirect } from "next/navigation";
import { auth, signOut } from "@/auth";
import { Button } from "@/components/ui/Button";
import { Heading } from "@/components/ui/Heading";

function getFirstName(name?: string | null, email?: string | null): string {
  if (name?.trim()) return name.trim().split(/\s+/)[0];
  return email?.split("@")[0] ?? "there";
}

export default async function MyAccountPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/sign-in?callbackUrl=/my-account");
  }

  const firstName = getFirstName(session.user.name, session.user.email);

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
    </div>
  );
}
