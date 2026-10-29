import { Suspense, type ReactNode } from "react";
import { PortalLoading } from "@/components/auth/PortalLoading";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { requireAttendeeForBooking } from "@/lib/auth/require-attendee-booking";

async function BookingsAuth({ children }: { children: ReactNode }) {
  await requireAttendeeForBooking("/bookings");
  return children;
}

export default function BookingsLayout({
  children,
}: LayoutProps<"/bookings">) {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <Suspense
        fallback={
          <header className="h-[73px] border-b border-border bg-surface" />
        }
      >
        <SiteHeader />
      </Suspense>
      <Suspense fallback={<PortalLoading />}>
        <BookingsAuth>{children}</BookingsAuth>
      </Suspense>
    </div>
  );
}
