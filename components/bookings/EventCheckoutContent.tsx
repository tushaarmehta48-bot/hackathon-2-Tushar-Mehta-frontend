import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckoutForm } from "@/components/bookings/CheckoutForm";
import { ApiError } from "@/lib/api-client";
import { getEvent, getEventPackages } from "@/lib/api/events";
import { requireAttendeeForBooking } from "@/lib/auth/require-attendee-booking";
type EventCheckoutContentProps = {
  params: Promise<{ id: string }>;
};

export async function EventCheckoutContent({
  params,
}: EventCheckoutContentProps) {
  const { id } = await params;
  await requireAttendeeForBooking(`/events/${id}/book`);

  let event;
  let packages;

  try {
    [{ event }, { packages }] = await Promise.all([
      getEvent(id),
      getEventPackages(id),
    ]);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) {
      notFound();
    }
    throw err;
  }

  return (
    <div className="space-y-6">
      <div>
        <Link
          href={`/events/${id}`}
          className="text-sm font-medium text-primary"
        >
          ← Back to event
        </Link>
        <h1 className="mt-2 font-display text-3xl font-semibold">
          Checkout · {event.title}
        </h1>
      </div>
      <CheckoutForm event={event} packages={packages} />
    </div>
  );
}
