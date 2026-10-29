"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ApiError } from "@/lib/api-client";
import { listEvents } from "@/lib/api/events";
import type { PublicEvent } from "@/lib/types/event";
import { EventCard } from "@/components/events/EventCard";
import { SectionHeading } from "@/components/marketing/SectionHeading";
import { Button } from "@/components/ui/Button";
import { LoadingState } from "@/components/ui/LoadingState";

export function HomeFeaturedEvents() {
  const [events, setEvents] = useState<PublicEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiOffline, setApiOffline] = useState(false);

  useEffect(() => {
    let cancelled = false;
    listEvents()
      .then(({ events: list }) => {
        if (!cancelled) {
          setEvents(list.slice(0, 6));
          setApiOffline(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setEvents([]);
          setApiOffline(
            err instanceof ApiError ? err.status === 0 : true,
          );
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <section className="bg-bg-milk py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-6">
          <LoadingState label="Loading events…" />
        </div>
      </section>
    );
  }

  const featured = events;

  return (
    <section className="bg-bg-milk py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            eyebrow="Featured"
            title="Happening soon"
            description="Hand-picked from published events with up-to-the-minute ticket inventory."
          />
          <Link href="/events" className="shrink-0 pb-1">
            <Button variant="secondary" type="button" className="rounded-full">
              See all events
            </Button>
          </Link>
        </div>

        <div className="mt-12">
          {apiOffline ? (
            <p className="rounded-2xl border border-amber-500/30 bg-amber-500/10 px-5 py-4 text-sm text-ink shadow-soft">
              Events are temporarily unavailable. Wait a moment and refresh, or
              open{" "}
              <Link href="/events" className="font-semibold text-primary">
                all events
              </Link>
              .
            </p>
          ) : featured.length === 0 ? (
            <p className="rounded-2xl border border-border bg-surface px-5 py-8 text-center text-ink-muted shadow-soft">
              No published events yet — organizers can publish from the admin
              dashboard.
            </p>
          ) : (
            <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((event, index) => (
                <li key={event.id}>
                  <EventCard event={event} animateIn={index < 6} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
