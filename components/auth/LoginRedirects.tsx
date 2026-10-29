import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth/session";
import { UserRole } from "@/lib/types/user";

/** @deprecated Attendee login uses AttendeeLoginSection instead of redirecting away. */
export async function AttendeeLoginRedirect() {
  return null;
}

export async function AdminLoginRedirect() {
  const user = await getSessionUser();
  if (user?.role === UserRole.Admin) {
    redirect("/admin/overview");
  }
  return null;
}

export async function GatekeeperLoginRedirect() {
  const user = await getSessionUser();
  if (user?.role === UserRole.Gatekeeper) {
    redirect("/gatekeeper/overview");
  }
  return null;
}

/** @deprecated Use GatekeeperLoginRedirect */
export async function StaffLoginRedirect() {
  return GatekeeperLoginRedirect();
}
