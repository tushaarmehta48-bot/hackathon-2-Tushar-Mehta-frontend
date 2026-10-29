import Link from "next/link";
import type { SafeUser } from "@/lib/types/user";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { LogoutButton } from "@/components/auth/LogoutButton";

type AttendeeAlreadySignedInProps = {
  user: SafeUser;
  returnTo?: string | null;
};

export function AttendeeAlreadySignedIn({
  user,
  returnTo,
}: AttendeeAlreadySignedInProps) {
  const continueHref = returnTo?.startsWith("/") ? returnTo : "/bookings";

  return (
    <Card className="space-y-4 p-6">
      <div>
        <p className="font-display text-xl text-ink">You&apos;re signed in</p>
        <p className="mt-2 text-sm leading-relaxed text-ink-muted">
          Signed in as{" "}
          <span className="font-semibold text-ink">{user.name}</span> (
          {user.email}).
        </p>
      </div>
      <div className="flex flex-col gap-2 sm:flex-row">
        <Link href="/" className="flex-1">
          <Button type="button" variant="secondary" className="w-full">
            Home
          </Button>
        </Link>
        <Link href={continueHref} className="flex-1">
          <Button type="button" className="w-full">
            Continue
          </Button>
        </Link>
      </div>
      <LogoutButton redirectTo="/login" variant="ghost" className="w-full" />
    </Card>
  );
}
