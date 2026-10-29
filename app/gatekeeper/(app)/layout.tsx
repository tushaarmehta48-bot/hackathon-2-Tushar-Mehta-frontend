import { Suspense, type ReactNode } from "react";
import { GatekeeperProtectedLayout } from "@/components/staff/GatekeeperProtectedLayout";
import { PortalLoading } from "@/components/auth/PortalLoading";

export default function GatekeeperAppLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <Suspense fallback={<PortalLoading />}>
      <GatekeeperProtectedLayout>{children}</GatekeeperProtectedLayout>
    </Suspense>
  );
}
