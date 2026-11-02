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
      <section className="relative isolate overflow-hidden border-b border-border/80 bg-ink">
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={EVENTS_PAGE_HERO_IMAGE}
            alt=""
            className="h-full w-full scale-105 object-cover object-center opacity-75"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-ink/90 via-ink/65 to-ink/35" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/95 via-transparent to-ink/30" />
          <div className="absolute -right-20 top-10 h-64 w-64 rounded-full bg-accent-gold/20 blur-3xl" />
          <div className="absolute -left-16 bottom-0 h-56 w-56 rounded-full bg-primary/25 blur-3xl" />
        </div>
        <span className="sr-only">{EVENTS_PAGE_HERO_ALT}</span>
        <div className="relative z-10 mx-auto max-w-7xl overflow-visible px-6 py-12 md:py-16">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl space-y-3">
              <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-accent-gold">
                <span className="h-1.5 w-1.5 rounded-full bg-accent-gold shadow-[0_0_8px_rgba(212,188,106,0.9)]" />
                EventPulse · Explore
              </p>
              <h1 className="font-display text-4xl font-semibold tracking-tight text-white md:text-5xl">
                {EVENTS_PAGE_HEADING}
              </h1>
              <p className="text-base leading-relaxed text-white/85 md:text-lg">
                {EVENTS_PAGE_SUBHEADING}
              </p>
            </div>
            <LiveTodayDate variant="hero" className="lg:max-w-sm lg:shrink-0" />
          </div>
          <div className="relative z-50 mt-8 overflow-visible">
            <EventSearchBar
              variant="hero"
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
