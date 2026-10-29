"use client";

import type { PublicEvent } from "@/lib/types/event";
import type { BookingLineItem, TicketPublic } from "@/lib/types/booking";
import { EventTicketCard } from "@/components/bookings/EventTicketCard";

type TicketQrGridProps = {
  tickets: TicketPublic[];
  event: PublicEvent;
  bookingReference: string;
  items: BookingLineItem[];
  guestName?: string;
};

export function TicketQrGrid({
  tickets,
  event,
  bookingReference,
  items,
  guestName,
}: TicketQrGridProps) {
  if (tickets.length === 0) {
    return (
      <p className="text-sm text-ink-muted">No tickets for this booking.</p>
    );
  }

  const packageNameById = new Map(items.map((i) => [i.packageId, i.packageName]));

  return (
    <ul className="grid gap-6 lg:grid-cols-2">
      {tickets.map((ticket) => (
        <li key={ticket.id}>
          <EventTicketCard
            event={event}
            ticket={ticket}
            bookingReference={bookingReference}
            packageName={
              packageNameById.get(ticket.packageId) ?? "General admission"
            }
            guestName={guestName}
          />
        </li>
      ))}
    </ul>
  );
}
