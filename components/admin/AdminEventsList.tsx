"use client";

import Link from "next/link";
import Image from "next/image";
import { formatEventRange } from "@/lib/format/datetime";
import { getEventCardImages } from "@/lib/events/card-images";
import type { AdminEvent } from "@/lib/types/admin";
import { AdminEventPhaseBadge } from "@/components/admin/AdminEventPhaseBadge";
import { AdminDeleteEventButton } from "@/components/admin/AdminDeleteEventButton";
import { Card } from "@/components/ui/Card";

type AdminEventsListProps = {
  events: AdminEvent[];
};

export function AdminEventsList({ events }: AdminEventsListProps) {
  return (
    <ul className="space-y-3">
      {events.map((event) => {
        const thumbs = getEventCardImages(event);
        const cover = thumbs[0];
        return (
          <li key={event.id}>
            <Card className="overflow-hidden p-0 hover:border-primary/40">
              <div className="flex flex-col gap-3 p-3 sm:flex-row sm:items-center">
                <Link
                  href={`/admin/events/${event.id}`}
                  className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:items-center"
                >
                  {cover ? (
                    <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden rounded-xl border border-border sm:w-40">
                      <Image
                        src={cover}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="160px"
                        unoptimized={cover.startsWith("http://localhost")}
                      />
                      {thumbs.length > 1 ? (
                        <span className="absolute bottom-2 right-2 rounded-full bg-ink/75 px-2 py-0.5 text-[10px] font-bold text-white">
                          +{thumbs.length - 1}
                        </span>
                      ) : null}
                    </div>
                  ) : (
                    <div className="flex aspect-[16/10] w-full items-center justify-center rounded-xl border border-dashed border-border bg-surface-muted text-xs font-semibold text-ink-subtle sm:w-40">
                      No card image
                    </div>
                  )}
                  <div className="flex flex-1 flex-wrap justify-between gap-2 px-1 pb-1 sm:py-2">
                    <div>
                      <p className="font-semibold">{event.title}</p>
                      <p className="text-sm text-ink-muted">
                        {formatEventRange(
                          event.startAt,
                          event.endAt,
                          event.timezone,
                        )}
                      </p>
                    </div>
                    <AdminEventPhaseBadge
                      status={event.status}
                      startAt={event.startAt}
                      endAt={event.endAt}
                      listingBadge={event.listingBadge}
                    />
                  </div>
                </Link>
                <AdminDeleteEventButton
                  eventId={event.id}
                  eventTitle={event.title}
                  className="shrink-0 self-end sm:self-center"
                />
              </div>
            </Card>
          </li>
        );
      })}
    </ul>
  );
}
