"use client";

import { useEffect, useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowTrendUp,
  faCircleCheck,
  faTicket,
  faUserCheck,
  faUserShield,
  faWallet,
} from "@fortawesome/free-solid-svg-icons";
import { adminListCheckIns } from "@/lib/api/admin";
import { ApiError } from "@/lib/api-client";
import { formatMinor } from "@/lib/format/currency";
import type { AdminEvent, CheckInReportRow, EventAnalyticsRow } from "@/lib/types/admin";
import { AdminEventSelect } from "@/components/admin/AdminEventSelect";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminStatCard } from "@/components/admin/AdminStatCard";
import { metricsFromRow } from "@/components/admin/admin-analytics-utils";
import { Card } from "@/components/ui/Card";

type AdminReportsClientProps = {
  events: AdminEvent[];
  analytics: EventAnalyticsRow[];
  initialCheckIns: CheckInReportRow[];
};

export function AdminReportsClient({
  events,
  analytics,
  initialCheckIns,
}: AdminReportsClientProps) {
  const [eventId, setEventId] = useState("");
  const [checkIns, setCheckIns] = useState(initialCheckIns);
  const [loadingCheckIns, setLoadingCheckIns] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const row = useMemo(
    () => (eventId ? analytics.find((a) => a.eventId === eventId) : undefined),
    [analytics, eventId],
  );

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      await Promise.resolve();
      if (cancelled) return;
      setLoadingCheckIns(true);
      setError(null);
      try {
        const res = await adminListCheckIns(eventId ? { eventId } : undefined);
        if (!cancelled) setCheckIns(res.checkIns.slice(0, 100));
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof ApiError ? err.message : "Could not load check-ins.",
          );
        }
      } finally {
        if (!cancelled) setLoadingCheckIns(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [eventId]);

  const metrics = row
    ? metricsFromRow(row)
    : null;

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Insights"
        title="Reports"
        description="Select an event for focused analytics and a live check-in timeline."
      />

      <div className="rounded-2xl border border-border bg-surface p-4 shadow-soft">
        <AdminEventSelect
          events={events}
          value={eventId}
          onChange={setEventId}
          allowAll
          label="Report for"
        />
      </div>

      {eventId && !row ? (
        <p className="text-sm text-ink-muted">No analytics for this event yet.</p>
      ) : null}

      {metrics ? (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <AdminStatCard
            label="Tickets sold"
            value={`${metrics.sold}/${metrics.total || metrics.sold}`}
            icon={faTicket}
            tone="primary"
          />
          <AdminStatCard
            label="Check-ins"
            value={metrics.checkedIn}
            hint={`${(metrics.checkInRate * 100).toFixed(1)}% rate`}
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
            label="Bookings"
            value={metrics.bookings}
            icon={faArrowTrendUp}
          />
        </ul>
      ) : !eventId ? (
        <Card title="All events summary">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-border text-ink-muted">
                  <th className="py-2 pr-4">Event</th>
                  <th className="py-2 pr-4">Sold</th>
                  <th className="py-2 pr-4">Check-ins</th>
                  <th className="py-2 pr-4">Rate</th>
                  <th className="py-2">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {analytics.map((r) => (
                  <tr key={r.eventId} className="border-b border-border/60">
                    <td className="py-3 pr-4 font-medium">{r.title}</td>
                    <td className="py-3 pr-4">
                      {r.ticketsSold}/{r.ticketsSold + r.ticketsRemaining}
                    </td>
                    <td className="py-3 pr-4">{r.admissionsCheckedIn}</td>
                    <td className="py-3 pr-4">
                      {(r.checkInRate * 100).toFixed(1)}%
                    </td>
                    <td className="py-3 font-semibold text-primary">
                      {formatMinor(r.revenueMinor)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      ) : null}

      {error ? <p className="text-sm text-danger">{error}</p> : null}

      <Card
        title={eventId ? "Check-ins for this event" : "Recent check-ins"}
        subtitle={
          loadingCheckIns ? "Refreshing…" : `${checkIns.length} entries shown`
        }
      >
        {checkIns.length === 0 ? (
          <p className="text-sm text-ink-muted">No check-ins recorded yet.</p>
        ) : (
          <ul className="space-y-2">
            {checkIns.map((entry) => (
              <li
                key={entry.id}
                className="flex flex-wrap items-center gap-3 rounded-xl border border-border/70 bg-bg-milk px-3 py-3"
              >
                <span
                  className={[
                    "flex h-9 w-9 items-center justify-center rounded-full text-sm",
                    entry.result === "success"
                      ? "bg-success/15 text-success"
                      : "bg-surface-muted text-ink-muted",
                  ].join(" ")}
                >
                  <FontAwesomeIcon icon={faCircleCheck} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold capitalize text-ink">
                      {entry.result.replace("_", " ")}
                    </p>
                    {entry.gatekeeperName ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                        <FontAwesomeIcon icon={faUserShield} className="h-3 w-3" />
                        Gatekeeper: {entry.gatekeeperName}
                      </span>
                    ) : null}
                  </div>
                  <p className="text-xs text-ink-muted">
                    {new Date(entry.timestamp).toLocaleString()}
                    {entry.ticketCode ? ` · ${entry.ticketCode}` : ""}
                    {entry.gateId ? ` · Gate: ${entry.gateId}` : ""}
                  </p>
                </div>
                {entry.bookingReference ? (
                  <span className="rounded-lg bg-surface px-2 py-1 font-mono text-xs text-ink-muted">
                    {entry.bookingReference}
                  </span>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
