import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { Card } from "@/components/ui/Card";
import { EventCardImageCarousel } from "@/components/events/EventCardImageCarousel";
import { EventScheduleBlock } from "@/components/events/EventScheduleBlock";
import { formatEventRange } from "@/lib/format/datetime";
import { getEventCardImages } from "@/lib/events/card-images";
import { categoryLabel } from "@/lib/events/category-art";
import { EventStatusBadge } from "@/components/events/EventStatusBadge";
import type { PublicEvent } from "@/lib/types/event";

type EventCardProps = {
  event: PublicEvent;
  animateIn?: boolean;
  featured?: boolean;
};

export function EventCard({
  event,
  animateIn,
  featured = false,
}: EventCardProps) {
  const images = getEventCardImages(event);

  return (
    <div className="group block h-full">
      <Card
        animateIn={animateIn}
        className={[
          "flex h-full flex-col overflow-hidden border-border/70 p-0 shadow-soft transition duration-300",
          "group-hover:-translate-y-0.5 group-hover:border-primary/30 group-hover:shadow-elevated",
        ].join(" ")}
      >
        <div
          className={[
            "relative aspect-[16/10] max-h-[190px] overflow-hidden bg-surface-muted sm:max-h-[220px] lg:max-h-[240px]",
            featured ? "lg:max-h-[260px]" : "",
          ].join(" ")}
        >
          <EventCardImageCarousel
            eventId={event.id}
            images={images}
            category={event.category}
            title={event.title}
          />

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/92 via-ink/40 to-ink/15" />

          <div className="pointer-events-none absolute left-3 right-3 top-3 z-20 flex flex-wrap items-start justify-between gap-2 sm:left-4 sm:right-4 sm:top-4">
            <span className="rounded-full border border-white/25 bg-ink/70 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-white shadow-sm backdrop-blur-sm sm:px-3 sm:text-[11px]">
              {categoryLabel(event.category)}
            </span>
            <EventStatusBadge
              status={event.status}
              startAt={event.startAt}
              endAt={event.endAt}
              listingBadge={event.listingBadge}
            />
          </div>

          <div className="pointer-events-none absolute bottom-3 left-3 right-3 z-20 flex flex-col gap-2 sm:bottom-4 sm:left-4 sm:right-4 sm:flex-row sm:items-end sm:justify-between sm:gap-3">
            <div className="min-w-0 flex-1">
              <h2
                className={[
                  "font-display leading-tight text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)]",
                  featured ? "text-xl sm:text-2xl" : "text-lg sm:text-xl",
                ].join(" ")}
              >
                {event.title}
              </h2>
              <p className="mt-2 flex items-start gap-2 text-sm text-white/85">
                <FontAwesomeIcon
                  icon={faLocationDot}
                  className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent-gold"
                />
                <span className="line-clamp-2">{event.venue}</span>
              </p>
            </div>
            <div className="shrink-0">
              <EventScheduleBlock
                startAt={event.startAt}
                endAt={event.endAt}
                timezone={event.timezone}
                size="card"
              />
            </div>
          </div>
        </div>

        <Link
          href={`/events/${event.id}`}
          className="flex flex-1 flex-col gap-1.5 border-t border-border/60 bg-surface px-4 py-3 sm:px-5 sm:py-4"
        >
          <p className="text-sm text-ink-muted" suppressHydrationWarning>
            {formatEventRange(event.startAt, event.endAt, event.timezone)}
          </p>
          <p className="line-clamp-2 text-sm leading-relaxed text-ink-subtle">
            {event.description}
          </p>
          <span className="mt-auto inline-flex items-center gap-2 pt-2 text-sm font-semibold text-primary">
            View event
            <FontAwesomeIcon
              icon={faArrowRight}
              className="h-3.5 w-3.5 transition group-hover:translate-x-0.5"
            />
          </span>
        </Link>
      </Card>
    </div>
  );
}
