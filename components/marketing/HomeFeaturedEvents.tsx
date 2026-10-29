import Link from "next/link";
import { ApiError } from "@/lib/api-client";
import { listEvents } from "@/lib/api/events";
import { EventCard } from "@/components/events/EventCard";
import { SectionHeading } from "@/components/marketing/SectionHeading";
import { Button } from "@/components/ui/Button";

export async function HomeFeaturedEvents() {
  let events: Awaited<ReturnType<typeof listEvents>>["events"] = [];

  let apiOffline = false;
  try {
    ({ events } = await listEvents());
  } catch (err) {
    if (err instanceof ApiError && err.status === 0) {
      apiOffline = true;
    } else if (!(err instanceof ApiError)) {
      throw err;
    }
  }

  const featured = events.slice(0, 6);

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
              API is offline. Run{" "}
              <code className="rounded bg-white/60 px-1.5 py-0.5 text-xs">
                npm run start:dev
              </code>{" "}
              in{" "}
              <code className="rounded bg-white/60 px-1.5 py-0.5 text-xs">
                backend/
              </code>
              , then refresh.
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
