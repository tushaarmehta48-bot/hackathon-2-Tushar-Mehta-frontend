"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo, useState } from "react";
import {
  faCalendarCheck,
  faChartLine,
  faTicket,
  faUserCheck,
  faUsers,
  faWallet,
} from "@fortawesome/free-solid-svg-icons";
import { formatMinor } from "@/lib/format/currency";
import { getEventCardImages } from "@/lib/events/card-images";
import type { AdminEvent, EventAnalyticsRow } from "@/lib/types/admin";
import { AdminEventSelect } from "@/components/admin/AdminEventSelect";
import { AdminLiveFeed } from "@/components/admin/AdminLiveFeed";
import { AdminOverviewInsights } from "@/components/admin/AdminOverviewInsights";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminStatCard } from "@/components/admin/AdminStatCard";
import {
  aggregateAnalytics,
  metricsFromRow,
} from "@/components/admin/admin-analytics-utils";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

type AdminOverviewClientProps = {
  events: AdminEvent[];
  rows: EventAnalyticsRow[];
};

export function AdminOverviewClient({ events, rows }: AdminOverviewClientProps) {
  const [eventId, setEventId] = useState("");

  const selectedEvent = events.find((e) => e.id === eventId);
  const filteredRows = eventId
    ? rows.filter((r) => r.eventId === eventId)
    : rows;

  const metrics = useMemo(() => {
    if (eventId && filteredRows[0]) {
      return metricsFromRow(filteredRows[0]);
    }
    const agg = aggregateAnalytics(rows);
    const checkInRate =
      agg.sold > 0 ? agg.checkedIn / agg.sold : 0;
    return {
      sold: agg.sold,
      remaining: agg.remaining,
      total: agg.sold + agg.remaining,
      checkedIn: agg.checkedIn,
      checkInRate,
      revenue: agg.revenue,
      bookings: agg.bookings,
      capacity: agg.capacity,
      status: "all",
      title: "All events",
    };
  }, [eventId, filteredRows, rows]);

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Dashboard"
        title="Overview"
        description="Pick an event to focus sales, check-ins, and revenue — or view totals across everything."
        actions={
          <>
            <Link href="/admin/events/new">
              <Button type="button" className="rounded-full">
                New event
              </Button>
            </Link>
            <Link href="/admin/reports">
              <Button type="button" variant="secondary" className="rounded-full">
                Reports
              </Button>
            </Link>
          </>
        }
      />

      <div className="flex flex-wrap items-end justify-between gap-4 rounded-2xl border border-border bg-surface p-4 shadow-soft">
        <AdminEventSelect events={events} value={eventId} onChange={setEventId} />
        {selectedEvent ? (
          <p className="text-sm text-ink-muted">
            <span className="font-semibold capitalize text-ink">
              {selectedEvent.status.replace("_", " ")}
            </span>
            {" · "}
            {selectedEvent.venue}
          </p>
        ) : null}
      </div>

      {selectedEvent && getEventCardImages(selectedEvent)[0] ? (
        <div className="flex flex-col gap-2 sm:max-w-md">
          <p className="text-[10px] font-bold uppercase tracking-wider text-ink-muted">
            Listing card image
            {getEventCardImages(selectedEvent).length > 1
              ? ` · ${getEventCardImages(selectedEvent).length} total`
              : ""}
          </p>
          <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-border shadow-soft">
            <Image
              src={getEventCardImages(selectedEvent)[0]!}
              alt=""
              fill
              className="object-cover"
              sizes="400px"
              unoptimized={true}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-transparent to-transparent" />
            <p className="absolute bottom-3 left-3 right-3 font-display text-lg text-white drop-shadow-sm">
              {selectedEvent.title}
            </p>
          </div>
        </div>
      ) : null}

      {rows.length > 0 ? (
        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <AdminStatCard
            label="Tickets sold"
            value={metrics.sold}
            hint={
              metrics.total
                ? `${metrics.remaining} remaining of ${metrics.total}`
                : undefined
            }
            icon={faTicket}
            tone="primary"
          />
          <AdminStatCard
            label="Checked in"
            value={metrics.checkedIn}
            hint={`${(metrics.checkInRate * 100).toFixed(1)}% of sold`}
            icon={faUserCheck}
            tone="success"
          />
          <AdminStatCard
            label="Revenue"
            value={formatMinor(metrics.revenue)}
            icon={faWallet}
            tone="gold"
          />
          <AdminStatCard
            label="Confirmed bookings"
            value={metrics.bookings}
            icon={faCalendarCheck}
          />
          <AdminStatCard
            label="Venue capacity"
            value={metrics.capacity}
            icon={faUsers}
          />
          <AdminStatCard
            label="Fill rate"
            value={
              metrics.capacity
                ? `${Math.min(100, Math.round((metrics.sold / metrics.capacity) * 100))}%`
                : "—"
            }
            hint="Sold vs event capacity"
            icon={faChartLine}
          />
        </ul>
      ) : (
        <Card title="No analytics yet">
          <p className="text-sm text-ink-muted">
            Create and publish an event with ticket packages to see live numbers here.
          </p>
        </Card>
      )}

      <AdminOverviewInsights events={events} rows={rows} />

      <div className="grid gap-6 xl:grid-cols-2">
        <AdminLiveFeed />
        <Card title="Event breakdown" subtitle="Quick links to manage each event">
        {rows.length === 0 ? (
          <p className="text-sm text-ink-muted">No events yet.</p>
        ) : (
          <ul className="divide-y divide-border">
            {(eventId ? filteredRows : rows).map((row) => (
              <li
                key={row.eventId}
                className="flex flex-wrap items-center justify-between gap-3 py-3"
              >
                <div>
                  <Link
                    href={`/admin/events/${row.eventId}`}
                    className="font-semibold text-ink hover:text-primary"
                  >
                    {row.title}
                  </Link>
                  <p className="text-xs capitalize text-ink-muted">
                    {row.status} · {row.ticketsSold} sold ·{" "}
                    {row.admissionsCheckedIn} checked in
                  </p>
                </div>
                <span className="font-semibold text-primary">
                  {formatMinor(row.revenueMinor)}
                </span>
              </li>
            ))}
          </ul>
        )}
        </Card>
      </div>
    </div>
  );
}
