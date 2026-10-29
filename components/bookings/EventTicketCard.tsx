"use client";

import { QRCodeSVG } from "qrcode.react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarDays,
  faLocationDot,
  faTicket,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { formatEventRange } from "@/lib/format/datetime";
import { getEventCardImages } from "@/lib/events/card-images";
import type { PublicEvent } from "@/lib/types/event";
import type { TicketPublic } from "@/lib/types/booking";

type EventTicketCardProps = {
  event: PublicEvent;
  ticket: TicketPublic;
  bookingReference: string;
  packageName: string;
  guestName?: string;
};

export function EventTicketCard({
  event,
  ticket,
  bookingReference,
  packageName,
  guestName,
}: EventTicketCardProps) {
  const total = ticket.admissionsTotal ?? 1;
  const used = ticket.admissionsUsed ?? 0;
  const remaining = ticket.admissionsRemaining ?? Math.max(0, total - used);
  const fullyUsed = ticket.status === "checked_in" || remaining === 0;
  const coverImage = getEventCardImages(event)[0];

  return (
    <article
      className={[
        "relative overflow-hidden rounded-3xl border shadow-elevated transition",
        fullyUsed
          ? "border-ink/20 opacity-90"
          : "border-primary/25 hover:shadow-2xl",
      ].join(" ")}
    >
      {coverImage ? (
        <div
          className="h-28 bg-cover bg-center"
          style={{ backgroundImage: `url(${coverImage})` }}
        />
      ) : (
        <div className="h-28 bg-gradient-to-br from-primary via-primary/80 to-accent-gold/80" />
      )}

      <div className="relative bg-gradient-to-b from-ink to-ink/95 px-5 pb-5 pt-4 text-white">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(-45deg, #fff 0, #fff 1px, transparent 0, transparent 50%)",
            backgroundSize: "12px 12px",
          }}
          aria-hidden
        />

        <div className="relative flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-accent-gold">
              EventPulse · Official entry
            </p>
            <h3 className="mt-1 font-display text-xl leading-tight">{event.title}</h3>
            <p className="mt-1 text-xs capitalize text-white/65">{event.category}</p>
          </div>
          <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 font-mono text-[11px]">
            {ticket.ticketCode}
          </span>
        </div>

        <ul className="relative mt-4 space-y-2 text-sm text-white/85">
          <li className="flex items-start gap-2">
            <FontAwesomeIcon icon={faCalendarDays} className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent-gold" />
            {formatEventRange(event.startAt, event.endAt, event.timezone)}
          </li>
          <li className="flex items-start gap-2">
            <FontAwesomeIcon icon={faLocationDot} className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent-gold" />
            <span>
              {event.venue}
              <span className="block text-xs text-white/60">{event.address}</span>
            </span>
          </li>
          <li className="flex items-center gap-2">
            <FontAwesomeIcon icon={faTicket} className="h-3.5 w-3.5 text-accent-gold" />
            {packageName}
          </li>
          <li className="flex items-center gap-2">
            <FontAwesomeIcon icon={faUsers} className="h-3.5 w-3.5 text-accent-gold" />
            Admits {total} {total === 1 ? "guest" : "guests"} · {remaining} scan
            {remaining === 1 ? "" : "s"} left
          </li>
        </ul>

        <div className="relative mt-5 flex flex-col items-center gap-3 rounded-2xl bg-white p-4">
          <QRCodeSVG
            value={ticket.qrToken}
            size={168}
            level="H"
            includeMargin={false}
            fgColor="#0f1419"
            bgColor="#ffffff"
          />
          <p className="text-center text-[11px] font-medium text-ink-muted">
            Show this QR at the gate — same code for each guest in your group
          </p>
        </div>

        <div className="relative mt-4 flex flex-wrap justify-between gap-2 border-t border-white/15 pt-3 text-[11px] text-white/55">
          <span>Ref {bookingReference}</span>
          {guestName ? <span>{guestName}</span> : null}
          <span className="capitalize">{ticket.status.replace("_", " ")}</span>
        </div>
      </div>
    </article>
  );
}
