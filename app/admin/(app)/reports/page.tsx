import { Suspense } from "react";
import { AdminReportsContent } from "@/components/admin/AdminReportsContent";
import { PortalLoading } from "@/components/auth/PortalLoading";

export const metadata = { title: "Reports · EventPulse" };

export default function AdminReportsPage() {
  return (
    <Suspense fallback={<PortalLoading />}>
      <AdminReportsContent />
    </Suspense>
  );
}
