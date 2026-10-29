import { ApiError } from "@/lib/api-client";
import {
  serverAdminGetAnalytics,
  serverAdminListEvents,
} from "@/lib/api/admin-server";
import type { EventAnalyticsRow } from "@/lib/types/admin";
import { AdminOverviewClient } from "@/components/admin/AdminOverviewClient";
import { analyticsRows } from "@/components/admin/admin-analytics-utils";

export async function AdminDashboardContent() {
  let rows: EventAnalyticsRow[] = [];
  let events: Awaited<ReturnType<typeof serverAdminListEvents>>["events"] = [];
  let error: string | null = null;

  try {
    const [analyticsData, eventsData] = await Promise.all([
      serverAdminGetAnalytics(),
      serverAdminListEvents(),
    ]);
    rows = analyticsRows(analyticsData.analytics);
    events = eventsData.events;
  } catch (err) {
    error =
      err instanceof ApiError ? err.message : "Could not load analytics.";
  }

  if (error) {
    return <p className="text-sm text-danger">{error}</p>;
  }

  return <AdminOverviewClient events={events} rows={rows} />;
}
