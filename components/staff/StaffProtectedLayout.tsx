import type { ReactNode } from "react";
import { StaffLayoutFrame } from "@/components/staff/StaffLayoutFrame";
import { PortalShell } from "@/components/auth/PortalShell";
import { requireRole } from "@/lib/auth/require-role";
import { UserRole } from "@/lib/types/user";

export async function StaffProtectedLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await requireRole(UserRole.Gatekeeper, "/staff/login");

  return (
    <PortalShell
      user={user}
      portalLabel="Staff / Gatekeeper"
      loginPath="/staff/login"
    >
      <StaffLayoutFrame>{children}</StaffLayoutFrame>
    </PortalShell>
  );
}
