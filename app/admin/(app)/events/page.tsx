import { Suspense } from "react";
import { AdminEventsContent } from "@/components/admin/AdminEventsContent";
import { PortalLoading } from "@/components/auth/PortalLoading";

export const metadata = { title: "Admin events · EventPulse" };

export default function AdminEventsPage() {
  return (
    <Suspense fallback={<PortalLoading />}>
      <AdminEventsContent />
    </Suspense>
  );
}
