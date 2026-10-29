import { Suspense } from "react";
import { AdminGatekeepersContent } from "@/components/admin/AdminGatekeepersContent";
import { PortalLoading } from "@/components/auth/PortalLoading";

export const metadata = { title: "Gatekeepers · EventPulse" };

export default function AdminGatekeepersPage() {
  return (
    <Suspense fallback={<PortalLoading />}>
      <AdminGatekeepersContent />
    </Suspense>
  );
}
