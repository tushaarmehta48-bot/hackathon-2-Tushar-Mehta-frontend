import type { ReactNode } from "react";
import { PortalShell } from "@/components/auth/PortalShell";
import { requireRole } from "@/lib/auth/require-role";
import type { UserRole } from "@/lib/types/user";

type ProtectedPortalProps = {
  role: UserRole;
  loginPath: string;
  portalLabel: string;
  children: ReactNode;
};

export async function ProtectedPortal({
  role,
  loginPath,
  portalLabel,
  children,
}: ProtectedPortalProps) {
  const user = await requireRole(role, loginPath);

  return (
    <PortalShell user={user} portalLabel={portalLabel} loginPath={loginPath}>
      {children}
    </PortalShell>
  );
}
