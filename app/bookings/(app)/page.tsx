import { Suspense } from "react";
import { PortalLoading } from "@/components/auth/PortalLoading";
import { MyBookingsContent } from "@/components/bookings/MyBookingsContent";

export const metadata = {
  title: "My bookings · EventPulse",
};

export default function MyBookingsPage() {
  return (
    <Suspense fallback={<PortalLoading />}>
      <MyBookingsContent />
    </Suspense>
  );
}
