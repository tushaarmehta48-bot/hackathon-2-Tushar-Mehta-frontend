import { apiClient } from "@/lib/api-client";
import { serializeEventBody } from "@/lib/api/admin-event-payload";
import type { EventAvailability } from "@/lib/types/event";
import type {
  AdminEvent,
  AdminPackage,
  CheckInReportRow,
  EventAnalyticsRow,
} from "@/lib/types/admin";
import type { SafeUser } from "@/lib/types/user";

export type CreateEventBody = {
  title: string;
  description: string;
  category: string;
  bannerUrl?: string;
  cardImageUrls?: string[];
  heroImageUrl?: string;
  listingBadge?: "live" | "upcoming" | null;
  venue: string;
  address: string;
  startAt: string;
  endAt: string;
  timezone: string;
  capacity: number;
  perUserTicketLimit?: number;
  cancellationPolicy?: string;
  refundPolicy?: string;
  instructions?: string;
};

export type CreatePackageBody = {
  name: string;
  description?: string;
  priceMinor: number;
  admissionCount: number;
  quantityTotal: number;
  saleStart?: string;
  saleEnd?: string;
  perUserLimit?: number;
  active?: boolean;
};

export async function adminListEvents() {
  return apiClient<{ events: AdminEvent[] }>("/admin/events", {
    cache: "no-store",
  });
}

export async function adminGetEvent(id: string) {
  return apiClient<{ event: AdminEvent }>(`/admin/events/${id}`, {
    cache: "no-store",
  });
}

export async function adminCreateEvent(body: CreateEventBody) {
  return apiClient<{ event: AdminEvent }>("/admin/events", {
    method: "POST",
    body: serializeEventBody(body),
  });
}

export async function adminUpdateEvent(id: string, body: Partial<CreateEventBody>) {
  return apiClient<{ event: AdminEvent }>(`/admin/events/${id}`, {
    method: "PATCH",
    body: serializeEventBody({ ...body } as CreateEventBody),
  });
}

export async function adminUpdateEventStatus(id: string, status: string) {
  return apiClient<{ event: AdminEvent }>(`/admin/events/${id}/status`, {
    method: "PATCH",
    body: { status },
  });
}

export async function adminDeleteEvent(id: string) {
  return apiClient<{ ok: true }>(`/admin/events/${id}`, {
    method: "DELETE",
  });
}

export async function adminGetInventory(eventId: string) {
  return apiClient<{ availability: EventAvailability }>(
    `/admin/events/${eventId}/inventory`,
    { cache: "no-store" },
  );
}

export async function adminCreatePackage(eventId: string, body: CreatePackageBody) {
  return apiClient<{ package: AdminPackage }>(
    `/admin/events/${eventId}/packages`,
    { method: "POST", body },
  );
}

export async function adminUpdatePackage(
  packageId: string,
  body: Partial<CreatePackageBody>,
) {
  return apiClient<{ package: AdminPackage }>(`/admin/packages/${packageId}`, {
    method: "PATCH",
    body,
  });
}

export async function adminListGatekeepers() {
  return apiClient<{ gatekeepers: SafeUser[] }>("/admin/gatekeepers", {
    cache: "no-store",
  });
}

export async function adminCreateGatekeeper(body: {
  name: string;
  email: string;
  password: string;
}) {
  return apiClient<{ user: SafeUser }>("/admin/gatekeepers", {
    method: "POST",
    body,
  });
}

export async function adminAssignGatekeeper(
  gatekeeperId: string,
  body: { eventId: string; gateId?: string },
) {
  return apiClient<{ assignment: unknown }>(
    `/admin/gatekeepers/${gatekeeperId}/assignments`,
    { method: "POST", body },
  );
}

export async function adminResetGatekeeperPassword(
  gatekeeperId: string,
  password: string,
) {
  return apiClient<{ ok: boolean }>(
    `/admin/gatekeepers/${gatekeeperId}/password`,
    { method: "PATCH", body: { password } },
  );
}

export async function adminGetAnalytics(eventId?: string) {
  const qs = eventId ? `?eventId=${encodeURIComponent(eventId)}` : "";
  return apiClient<{ analytics: EventAnalyticsRow | EventAnalyticsRow[] }>(
    `/admin/analytics${qs}`,
    { cache: "no-store" },
  );
}

export async function adminUploadEventBanner(file: File) {
  const form = new FormData();
  form.append("file", file);
  return apiClient<{ url: string }>("/admin/uploads/event-banner", {
    method: "POST",
    body: form,
    json: false,
  });
}

export async function adminDeleteUploadedEventImage(url: string) {
  return apiClient<{ ok: boolean }>("/admin/uploads/event-banner", {
    method: "DELETE",
    body: { url },
  });
}

export async function adminListCheckIns(params?: {
  eventId?: string;
  result?: string;
}) {
  const search = new URLSearchParams();
  if (params?.eventId) search.set("eventId", params.eventId);
  if (params?.result) search.set("result", params.result);
  const qs = search.toString();
  return apiClient<{ checkIns: CheckInReportRow[] }>(
    `/admin/check-ins${qs ? `?${qs}` : ""}`,
    { cache: "no-store" },
  );
}
