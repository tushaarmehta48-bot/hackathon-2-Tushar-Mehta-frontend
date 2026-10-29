import type { ReactNode } from "react";
import { AdminPortalShell } from "@/components/admin/AdminPortalShell";
import { requireRole } from "@/lib/auth/require-role";
import { UserRole } from "@/lib/types/user";

export async function AdminProtectedLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await requireRole(UserRole.Admin, "/admin");

  return <AdminPortalShell user={user}>{children}</AdminPortalShell>;
}
