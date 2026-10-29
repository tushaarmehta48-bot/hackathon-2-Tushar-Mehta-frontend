import Link from "next/link";
import { notFound } from "next/navigation";
import { CancelBookingButton } from "@/components/bookings/CancelBookingButton";
import { TicketQrGrid } from "@/components/bookings/TicketQrGrid";
import { ApiError } from "@/lib/api-client";
import { getEvent } from "@/lib/api/events";
import { serverApiClient } from "@/lib/api/server-client";
import { formatMinor } from "@/lib/format/currency";
import type { BookingSummary, TicketPublic } from "@/lib/types/booking";
import type { PublicEvent } from "@/lib/types/event";
import { Card } from "@/components/ui/Card";

type BookingDetailContentProps = {
  params: Promise<{ id: string }>;
};

export async function BookingDetailContent({
  params,
}: BookingDetailContentProps) {
  const { id } = await params;

  let booking: BookingSummary;
  let tickets: TicketPublic[];

  try {
    const [bookingRes, ticketsRes] = await Promise.all([
      serverApiClient<{ booking: BookingSummary }>(`/bookings/${id}`),
      serverApiClient<{ tickets: TicketPublic[] }>(`/bookings/${id}/tickets`),
    ]);
    booking = bookingRes.booking;
    tickets = ticketsRes.tickets;
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) {
      notFound();
    }
    throw err;
  }

  let event: PublicEvent | null = null;
  try {
    ({ event } = await getEvent(booking.eventId));
  } catch {
    event = null;
  }
  const eventTitle = event?.title ?? null;

  const canCancel = booking.status === "confirmed";

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-10">
      <Link
        href="/bookings"
        className="text-sm font-medium text-primary hover:underline"
      >
        ← All bookings
      </Link>

      <div className="mt-4 space-y-2">
        <h1 className="font-display text-3xl font-semibold tracking-tight">
          {eventTitle ?? "Booking"}
        </h1>
        <p className="font-mono text-sm text-ink-muted">{booking.reference}</p>
        <p className="text-sm capitalize text-ink-muted">
          Status: {booking.status} · Total {formatMinor(booking.totalMinor)}
        </p>
      </div>

      <section className="mt-8 space-y-4">
        <h2 className="font-display text-xl font-semibold">Order</h2>
        <Card className="p-0">
          <ul className="divide-y divide-border">
            {booking.items.map((item) => (
              <li
                key={item.packageId}
                className="flex justify-between px-4 py-3 text-sm"
              >
                <span>
                  {item.packageName} × {item.quantity}
                </span>
                <span>{formatMinor(item.lineTotalMinor)}</span>
              </li>
            ))}
          </ul>
        </Card>
      </section>

      <section className="mt-10 space-y-4">
        <h2 className="font-display text-xl font-semibold">Your tickets</h2>
        <p className="text-sm text-ink-muted">
          One QR per package line — scan it once for each guest in your group.
          Staff only read the secure ticket token, not your personal data.
        </p>
        {event ? (
          <TicketQrGrid
            tickets={tickets}
            event={event}
            bookingReference={booking.reference}
            items={booking.items}
          />
        ) : (
          <p className="text-sm text-ink-muted">
            Event details unavailable — refresh or open tickets again later.
          </p>
        )}
      </section>

      {canCancel ? (
        <section className="mt-10 border-t border-border pt-8">
          <CancelBookingButton bookingId={booking.id} />
        </section>
      ) : null}

      {eventTitle ? (
        <p className="mt-8">
          <Link
            href={`/events/${booking.eventId}`}
            className="text-sm font-medium text-primary hover:underline"
          >
            View event details
          </Link>
        </p>
      ) : null}
    </main>
  );
}
