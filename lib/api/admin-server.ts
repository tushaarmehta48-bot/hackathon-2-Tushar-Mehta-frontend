import { serverApiClient } from "@/lib/api/server-client";
import type {
  AdminEvent,
  AdminGatekeeperAssignmentRow,
  CheckInReportRow,
  EventAnalyticsRow,
} from "@/lib/types/admin";
import type { EventAvailability } from "@/lib/types/event";
import type { SafeUser } from "@/lib/types/user";

export async function serverAdminListEvents() {
  return serverApiClient<{ events: AdminEvent[] }>("/admin/events");
}

export async function serverAdminGetEvent(id: string) {
  return serverApiClient<{ event: AdminEvent }>(`/admin/events/${id}`);
}

export async function serverAdminGetInventory(eventId: string) {
  return serverApiClient<{ availability: EventAvailability }>(
    `/admin/events/${eventId}/inventory`,
  );
}

export async function serverAdminGetAnalytics(eventId?: string) {
  const qs = eventId ? `?eventId=${encodeURIComponent(eventId)}` : "";
  return serverApiClient<{ analytics: EventAnalyticsRow | EventAnalyticsRow[] }>(
    `/admin/analytics${qs}`,
  );
}

export async function serverAdminListGatekeepers() {
  return serverApiClient<{ gatekeepers: SafeUser[] }>("/admin/gatekeepers");
}

export async function serverAdminListGatekeeperAssignments() {
  return serverApiClient<{ assignments: AdminGatekeeperAssignmentRow[] }>(
    "/admin/gatekeepers/assignments",
  );
}

export async function serverAdminListCheckIns(eventId?: string) {
  const qs = eventId ? `?eventId=${encodeURIComponent(eventId)}` : "";
  return serverApiClient<{ checkIns: CheckInReportRow[] }>(
    `/admin/check-ins${qs}`,
  );
}
