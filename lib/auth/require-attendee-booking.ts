import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth/session";
import { UserRole, type SafeUser } from "@/lib/types/user";

/** Attendee-only flows (checkout, my bookings). Staff roles are sent to their portals. */
export async function requireAttendeeForBooking(
  returnPath: string,
): Promise<SafeUser> {
  const user = await getSessionUser();
  if (!user) {
    redirect(`/login?returnTo=${encodeURIComponent(returnPath)}`);
  }
  if (user.role === UserRole.Admin) {
    redirect("/admin/overview");
  }
  if (user.role === UserRole.Gatekeeper) {
    redirect("/gatekeeper/overview");
  }
  if (user.role !== UserRole.Attendee) {
    redirect("/login");
  }
  return user as SafeUser;
}

export function canUserBookTickets(role: string | undefined): boolean {
  return role === UserRole.Attendee || role === undefined;
}
