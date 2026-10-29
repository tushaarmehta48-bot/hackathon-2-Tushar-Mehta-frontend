import { ApiError } from "@/lib/api-client";
import {
  serverAdminGetAnalytics,
  serverAdminListCheckIns,
  serverAdminListEvents,
} from "@/lib/api/admin-server";
import type { EventAnalyticsRow } from "@/lib/types/admin";
import { AdminReportsClient } from "@/components/admin/AdminReportsClient";
import { analyticsRows } from "@/components/admin/admin-analytics-utils";

export async function AdminReportsContent() {
  let analytics: EventAnalyticsRow[] = [];
  let events: Awaited<ReturnType<typeof serverAdminListEvents>>["events"] = [];
  let checkIns: Awaited<
    ReturnType<typeof serverAdminListCheckIns>
  >["checkIns"] = [];
  let error: string | null = null;

  try {
    const [a, e, c] = await Promise.all([
      serverAdminGetAnalytics(),
      serverAdminListEvents(),
      serverAdminListCheckIns(),
    ]);
    analytics = analyticsRows(a.analytics);
    events = e.events;
    checkIns = c.checkIns.slice(0, 100);
  } catch (err) {
    error = err instanceof ApiError ? err.message : "Reports unavailable.";
  }

  if (error) {
    return <p className="text-sm text-danger">{error}</p>;
  }

  return (
    <AdminReportsClient
      events={events}
      analytics={analytics}
      initialCheckIns={checkIns}
    />
  );
}
