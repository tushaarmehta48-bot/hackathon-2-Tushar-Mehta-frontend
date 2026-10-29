import { Suspense } from "react";
import { PortalLoading } from "@/components/auth/PortalLoading";
import { EventCheckoutContent } from "@/components/bookings/EventCheckoutContent";

type BookEventPageProps = PageProps<"/events/[id]/book">;

export default function BookEventPage({ params }: BookEventPageProps) {
  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-10">
      <Suspense fallback={<PortalLoading />}>
        <EventCheckoutContent params={params} />
      </Suspense>
    </main>
  );
}
