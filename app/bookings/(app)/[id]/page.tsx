import { Suspense } from "react";
import { PortalLoading } from "@/components/auth/PortalLoading";
import { BookingDetailContent } from "@/components/bookings/BookingDetailContent";

type BookingDetailPageProps = PageProps<"/bookings/[id]">;

export default function BookingDetailPage({ params }: BookingDetailPageProps) {
  return (
    <Suspense fallback={<PortalLoading />}>
      <BookingDetailContent params={params} />
    </Suspense>
  );
}
