import { ApiError } from "@/lib/api-client";
import { listEvents } from "@/lib/api/events";
import Link from "next/link";
import { EventCard } from "@/components/events/EventCard";
import { LiveTodayDate } from "@/components/common/LiveTodayDate";
import { EventSearchBar } from "@/components/marketing/EventSearchBar";
import {
  EVENTS_PAGE_HEADING,
  EVENTS_PAGE_HERO_ALT,
  EVENTS_PAGE_HERO_IMAGE,
  EVENTS_PAGE_SUBHEADING,
} from "@/lib/constants/events-page";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import type { PublicEvent } from "@/lib/types/event";

type EventsBrowseContentProps = {
  q?: string;
  category?: string;
  from?: string;
};

function filterEvents(events: PublicEvent[], q?: string): PublicEvent[] {
  if (!q?.trim()) {
    return events;
  }
  const needle = q.trim().toLowerCase();
  return events.filter(
    (e) =>
      e.title.toLowerCase().includes(needle) ||
      e.venue.toLowerCase().includes(needle) ||
      e.address.toLowerCase().includes(needle) ||
      e.category.toLowerCase().includes(needle),
  );
}

export async function EventsBrowseContent({
  q,
  category,
  from,
}: EventsBrowseContentProps) {
  let events: PublicEvent[] = [];
  let error: string | null = null;

  try {
    const query: { category?: string; from?: string } = {};
    if (category) query.category = category;
    if (from) query.from = new Date(from).toISOString();

    ({ events } = await listEvents(query));
    events = filterEvents(events, q);
  } catch (err) {
    error =
      err instanceof ApiError
        ? err.message
        : "Could not load events. Is the API running?";
  }

  return (
    <>
      <section className="relative isolate border-b border-border/80">
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={EVENTS_PAGE_HERO_IMAGE}
            alt=""
            className="h-full w-full scale-105 object-cover object-center opacity-45"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-bg-milk/92 via-bg-milk/78 to-primary/25" />
          <div className="absolute -right-20 top-10 h-56 w-56 rounded-full bg-accent-gold/25 blur-3xl" />
          <div className="absolute -left-16 bottom-0 h-48 w-48 rounded-full bg-primary/20 blur-3xl" />
        </div>
        <span className="sr-only">{EVENTS_PAGE_HERO_ALT}</span>
        <div className="relative z-10 mx-auto max-w-7xl overflow-visible px-6 py-12 md:py-16">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl space-y-3">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
                EventPulse · Explore
              </p>
              <h1 className="font-display text-4xl font-semibold tracking-tight text-ink md:text-5xl">
                {EVENTS_PAGE_HEADING}
              </h1>
              <p className="text-base leading-relaxed text-ink-muted md:text-lg">
                {EVENTS_PAGE_SUBHEADING}
              </p>
            </div>
            <LiveTodayDate variant="surface" className="lg:max-w-sm lg:shrink-0" />
          </div>
          <div className="relative z-50 mt-8 overflow-visible">
            <EventSearchBar
              variant="inline"
              defaultQuery={q ?? ""}
              defaultCategory={category ?? ""}
              defaultFrom={from ?? ""}
            />
          </div>
        </div>
      </section>

      <main className="mx-auto w-full max-w-7xl flex-1 px-6 py-12 md:py-16">
        {error ? (
          <p className="rounded-xl border border-danger/30 bg-surface px-4 py-3 text-sm text-danger">
            {error}
          </p>
        ) : null}

        {events.length === 0 && !error ? (
          <EmptyState
            illustration="events"
            title="No matching events"
            description="Try another keyword or category, or check back when new events are published."
            action={
              <Link href="/">
                <Button type="button" variant="secondary">
                  Back to home
                </Button>
              </Link>
            }
          />
        ) : (
          <ul className="grid grid-cols-2 items-stretch gap-5 md:gap-6 lg:grid-cols-3">
            {events.map((event, index) => (
              <li key={event.id} className="min-w-0">
                <EventCard event={event} animateIn={index < 16} />
              </li>
            ))}
          </ul>
        )}
      </main>
    </>
  );
}
