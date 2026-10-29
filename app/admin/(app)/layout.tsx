import { Suspense, type ReactNode } from "react";
import { AdminProtectedLayout } from "@/components/admin/AdminProtectedLayout";
import { PortalLoading } from "@/components/auth/PortalLoading";

export default function AdminAppLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<PortalLoading />}>
      <AdminProtectedLayout>{children}</AdminProtectedLayout>
    </Suspense>
  );
}
