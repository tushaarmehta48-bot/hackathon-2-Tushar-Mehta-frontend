import { Suspense } from "react";
import { AdminDashboardContent } from "@/components/admin/AdminDashboardContent";
import { PortalLoading } from "@/components/auth/PortalLoading";

export const metadata = { title: "Admin overview · EventPulse" };

export default function AdminOverviewPage() {
  return (
    <Suspense fallback={<PortalLoading />}>
      <AdminDashboardContent />
    </Suspense>
  );
}
