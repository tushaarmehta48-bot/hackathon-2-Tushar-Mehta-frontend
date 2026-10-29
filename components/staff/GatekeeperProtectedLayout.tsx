import type { ReactNode } from "react";
import { StaffLayoutFrame } from "@/components/staff/StaffLayoutFrame";
import { PortalShell } from "@/components/auth/PortalShell";
import { requireRole } from "@/lib/auth/require-role";
import { UserRole } from "@/lib/types/user";

export async function GatekeeperProtectedLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await requireRole(UserRole.Gatekeeper, "/gatekeeper");

  return (
    <PortalShell
      user={user}
      portalLabel="Gatekeeper"
      loginPath="/gatekeeper"
    >
      <StaffLayoutFrame>{children}</StaffLayoutFrame>
    </PortalShell>
  );
}
