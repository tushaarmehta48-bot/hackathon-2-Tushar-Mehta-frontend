import Link from "next/link";
import { EventPulseLogo } from "@/components/brand/EventPulseLogo";
import { getSessionUser } from "@/lib/auth/session";
import { UserRole } from "@/lib/types/user";
import { Button } from "@/components/ui/Button";

export async function SiteHeader() {
  const user = await getSessionUser();

  return (
    <header className="border-b border-border bg-surface/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-4">
        <EventPulseLogo variant="nav" href="/" />
        <nav className="flex items-center gap-2">
          <Link href="/events">
            <Button variant="ghost" type="button">
              Events
            </Button>
          </Link>
          {user?.role === UserRole.Attendee ? (
            <Link href="/bookings">
              <Button variant="secondary" type="button">
                My bookings
              </Button>
            </Link>
          ) : user ? (
            <Link
              href={
                user.role === UserRole.Admin
                  ? "/admin/overview"
                  : "/gatekeeper/overview"
              }
            >
              <Button variant="secondary" type="button">
                {user.role === UserRole.Admin ? "Admin" : "Gatekeeper"}
              </Button>
            </Link>
          ) : (
            <Link href="/login">
              <Button variant="secondary" type="button">
                Sign in
              </Button>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
