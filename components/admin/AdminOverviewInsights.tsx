"use client";

import { useState } from "react";
import Link from "next/link";
import {
  faBolt,
  faClipboardList,
  faRocket,
  faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { formatMinor } from "@/lib/format/currency";
import { formatEventRange } from "@/lib/format/datetime";
import type { AdminEvent, EventAnalyticsRow } from "@/lib/types/admin";
import { Card } from "@/components/ui/Card";

type AdminOverviewInsightsProps = {
  events: AdminEvent[];
  rows: EventAnalyticsRow[];
};

export function AdminOverviewInsights({
  events,
  rows,
}: AdminOverviewInsightsProps) {
  const [nowMs] = useState(() => Date.now());
  const published = events.filter((e) => e.status === "published").length;
  const draft = events.filter((e) => e.status === "draft").length;
  const lowStock = rows.filter(
    (r) => r.ticketsRemaining > 0 && r.ticketsRemaining <= 10,
  );
  const topByRevenue = [...rows]
    .sort((a, b) => b.revenueMinor - a.revenueMinor)
    .slice(0, 5);
  const maxRevenue = topByRevenue[0]?.revenueMinor ?? 1;

  const upcoming = [...events]
    .filter((e) => new Date(e.startAt).getTime() > nowMs)
    .sort(
      (a, b) =>
        new Date(a.startAt).getTime() - new Date(b.startAt).getTime(),
    )
    .slice(0, 4);

  return (
    <div className="grid gap-6 xl:grid-cols-12">
      <div className="space-y-6 xl:col-span-4">
        <Card title="Event pipeline" subtitle="Status across your catalog">
          <ul className="grid grid-cols-3 gap-3">
            <li className="rounded-xl bg-primary/10 p-3 text-center">
              <p className="font-display text-2xl text-primary">{published}</p>
              <p className="text-[11px] font-semibold uppercase text-ink-muted">
                Live
              </p>
            </li>
            <li className="rounded-xl bg-surface-muted p-3 text-center">
              <p className="font-display text-2xl text-ink">{draft}</p>
              <p className="text-[11px] font-semibold uppercase text-ink-muted">
                Drafts
              </p>
            </li>
            <li className="rounded-xl bg-accent-gold/15 p-3 text-center">
              <p className="font-display text-2xl text-ink">{events.length}</p>
              <p className="text-[11px] font-semibold uppercase text-ink-muted">
                Total
              </p>
            </li>
          </ul>
        </Card>

        <Card title="Quick actions" subtitle="Common organizer tasks">
          <ul className="space-y-2">
            {[
              {
                href: "/admin/events/new",
                icon: faRocket,
                label: "Create a new event",
                hint: "Draft, packages, publish",
              },
              {
                href: "/admin/gatekeepers",
                icon: faClipboardList,
                label: "Manage gatekeepers",
                hint: "Assign scan access",
              },
              {
                href: "/admin/reports",
                icon: faBolt,
                label: "Open reports",
                hint: "Per-event check-ins",
              },
            ].map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="flex items-start gap-3 rounded-xl border border-border/80 bg-bg-milk px-3 py-3 transition hover:border-primary/40 hover:bg-surface"
                >
                  <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <FontAwesomeIcon icon={item.icon} className="h-4 w-4" />
                  </span>
                  <span>
                    <span className="block text-sm font-semibold text-ink">
                      {item.label}
                    </span>
                    <span className="block text-xs text-ink-muted">
                      {item.hint}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Card>

        {lowStock.length > 0 ? (
          <Card title="Low inventory" subtitle="May sell out soon">
            <ul className="space-y-2">
              {lowStock.slice(0, 4).map((row) => (
                <li
                  key={row.eventId}
                  className="flex items-center gap-2 rounded-lg bg-accent-gold/15 px-3 py-2 text-sm"
                >
                  <FontAwesomeIcon
                    icon={faTriangleExclamation}
                    className="h-3.5 w-3.5 text-accent-gold"
                  />
                  <Link
                    href={`/admin/events/${row.eventId}`}
                    className="font-medium text-ink hover:text-primary"
                  >
                    {row.title}
                  </Link>
                  <span className="ml-auto text-xs text-ink-muted">
                    {row.ticketsRemaining} left
                  </span>
                </li>
              ))}
            </ul>
          </Card>
        ) : null}
      </div>

      <div className="space-y-6 xl:col-span-4">
        <Card title="Revenue leaders" subtitle="Top events by gross sales">
          {topByRevenue.length === 0 ? (
            <p className="text-sm text-ink-muted">No sales data yet.</p>
          ) : (
            <ul className="space-y-4">
              {topByRevenue.map((row, i) => (
                <li key={row.eventId}>
                  <div className="mb-1 flex justify-between text-sm">
                    <Link
                      href={`/admin/events/${row.eventId}`}
                      className="font-semibold text-ink hover:text-primary"
                    >
                      {i + 1}. {row.title}
                    </Link>
                    <span className="font-semibold text-primary">
                      {formatMinor(row.revenueMinor)}
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-surface-muted">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-primary to-accent-gold"
                      style={{
                        width: `${Math.max(8, (row.revenueMinor / maxRevenue) * 100)}%`,
                      }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      <div className="space-y-6 xl:col-span-4">
        <Card title="Upcoming on calendar" subtitle="Next events by start date">
          {upcoming.length === 0 ? (
            <p className="text-sm text-ink-muted">No future events scheduled.</p>
          ) : (
            <ul className="divide-y divide-border">
              {upcoming.map((ev) => (
                <li key={ev.id} className="py-3 first:pt-0">
                  <Link
                    href={`/admin/events/${ev.id}`}
                    className="font-semibold text-ink hover:text-primary"
                  >
                    {ev.title}
                  </Link>
                  <p className="mt-0.5 text-xs text-ink-muted">
                    {formatEventRange(ev.startAt, ev.endAt, ev.timezone)}
                  </p>
                  <p className="text-xs capitalize text-ink-subtle">
                    {ev.status.replace("_", " ")} · {ev.venue}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card title="Organizer checklist">
          <ol className="space-y-2 text-sm text-ink-muted">
            <li className="flex gap-2">
              <span className="font-bold text-primary">1.</span>
              Create event draft with card image
            </li>
            <li className="flex gap-2">
              <span className="font-bold text-primary">2.</span>
              Add ticket packages and pricing
            </li>
            <li className="flex gap-2">
              <span className="font-bold text-primary">3.</span>
              Publish and assign gatekeepers
            </li>
            <li className="flex gap-2">
              <span className="font-bold text-primary">4.</span>
              Monitor overview & reports on event day
            </li>
          </ol>
        </Card>
      </div>
    </div>
  );
}
