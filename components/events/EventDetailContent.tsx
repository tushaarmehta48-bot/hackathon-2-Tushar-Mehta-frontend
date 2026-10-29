import Link from "next/link";
import { notFound } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { ApiError } from "@/lib/api-client";
import {
  getEvent,
  getEventAvailability,
  getEventPackages,
} from "@/lib/api/events";
import { PackageList } from "@/components/events/PackageList";
import { EventScheduleBlock } from "@/components/events/EventScheduleBlock";
import {
  categoryGradient,
  categoryIcon,
  categoryLabel,
} from "@/lib/events/category-art";
import { getEventDetailHeroUrl } from "@/lib/events/card-images";
import { getSessionUser } from "@/lib/auth/session";
import { UserRole } from "@/lib/types/user";
import { EventHeroImage } from "@/components/events/EventHeroImage";
import { EventStatusBadge } from "@/components/events/EventStatusBadge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

type EventDetailContentProps = {
  params: Promise<{ id: string }>;
};

export async function EventDetailContent({ params }: EventDetailContentProps) {
  const { id } = await params;

  let event;
  let packages;
  let availability;

  try {
    [{ event }, { packages }, { availability }] = await Promise.all([
      getEvent(id),
      getEventPackages(id),
      getEventAvailability(id),
    ]);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) {
      notFound();
    }
    throw err;
  }

  const user = await getSessionUser();
  const isStaff =
    user?.role === UserRole.Admin || user?.role === UserRole.Gatekeeper;

  const inventoryAvailable =
    event.status === "published" &&
    !availability.summary.isSoldOut &&
    packages.some((p) => p.onSale);

  const canBook = inventoryAvailable && !isStaff;
  const icon = categoryIcon(event.category);
  const heroImage = getEventDetailHeroUrl(event);

  return (
    <>
      <section className="relative overflow-hidden border-b border-border/80">
        <div className="relative min-h-[280px] w-full sm:min-h-[320px] md:min-h-[360px]">
          {heroImage ? (
            <EventHeroImage src={heroImage} category={event.category} />
          ) : (
            <div
              className={[
                "absolute inset-0 bg-gradient-to-br",
                categoryGradient(event.category),
              ].join(" ")}
            >
              <div className="absolute inset-0 flex items-center justify-center opacity-40">
                <FontAwesomeIcon icon={icon} className="h-32 w-32 text-white/30" />
              </div>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/55 to-ink/25" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_100%,rgba(216,92,65,0.25),transparent_55%)]" />

          <div className="relative mx-auto flex min-h-[320px] max-w-6xl flex-col justify-end px-6 pb-10 pt-24 sm:min-h-[380px] sm:pb-14 md:min-h-[420px]">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-white/25 bg-ink/70 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-white backdrop-blur-sm">
                {categoryLabel(event.category)}
              </span>
              <EventStatusBadge
                status={event.status}
                startAt={event.startAt}
                endAt={event.endAt}
                listingBadge={event.listingBadge}
              />
            </div>
            <h1 className="mt-4 max-w-4xl font-display text-4xl font-semibold leading-tight tracking-tight text-white drop-shadow-sm sm:text-5xl md:text-6xl">
              {event.title}
            </h1>
            <p className="mt-4 flex max-w-2xl items-start gap-2 text-base text-white/90 sm:text-lg">
              <FontAwesomeIcon
                icon={faLocationDot}
                className="mt-1 h-4 w-4 shrink-0 text-accent-gold"
              />
              <span>
                {event.venue}
                <span className="block text-sm text-white/75 sm:inline sm:before:content-['·_']">
                  {event.address}
                </span>
              </span>
            </p>
          </div>
        </div>
      </section>

      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10 md:py-12">
        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-10">
          <div className="space-y-6">
            <EventScheduleBlock
              startAt={event.startAt}
              endAt={event.endAt}
              timezone={event.timezone}
              size="detail"
            />
            <Card title="About">
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-ink-muted md:text-base">
                {event.description}
              </p>
            </Card>
            {event.instructions ? (
              <Card title="Instructions">
                <p className="text-sm text-ink-muted">{event.instructions}</p>
              </Card>
            ) : null}
          </div>

          <div className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            <Card title="Tickets">
              <PackageList packages={packages} />
              <div className="mt-6">
                {isStaff ? (
                  <p className="rounded-xl bg-surface-muted px-3 py-3 text-sm text-ink-muted">
                    {user?.role === UserRole.Admin
                      ? "You’re signed in as an organizer. Use the admin console to manage events — attendee booking is disabled for admin accounts."
                      : "You’re signed in as gate staff. Ticket booking is for guest accounts only — use your gatekeeper portal to scan tickets."}
                  </p>
                ) : canBook ? (
                  <Link href={`/events/${event.id}/book`}>
                    <Button type="button" className="w-full">
                      Book tickets
                    </Button>
                  </Link>
                ) : (
                  <p className="text-sm text-ink-muted">
                    {event.status === "completed"
                      ? "This event is completed."
                      : event.status === "sold_out" || availability.summary.isSoldOut
                        ? "This event is sold out."
                        : "Booking is not available for this event."}
                  </p>
                )}
              </div>
            </Card>
            {event.cancellationPolicy ? (
              <Card title="Cancellation">
                <p className="text-sm text-ink-muted">
                  {event.cancellationPolicy}
                </p>
              </Card>
            ) : null}
          </div>
        </div>
      </main>
    </>
  );
}
