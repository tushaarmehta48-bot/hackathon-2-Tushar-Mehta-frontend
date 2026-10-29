import { Suspense } from "react";
import { AdminEventDetailContent } from "@/components/admin/AdminEventDetailContent";
import { PortalLoading } from "@/components/auth/PortalLoading";

export default function AdminEventDetailPage({
  params,
}: PageProps<"/admin/events/[id]">) {
  return (
    <Suspense fallback={<PortalLoading />}>
      <AdminEventDetailContent params={params} />
    </Suspense>
  );
}
