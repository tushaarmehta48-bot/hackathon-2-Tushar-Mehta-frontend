import { apiClient } from "@/lib/api-client";
import type { EventAvailability, PublicEvent } from "@/lib/types/event";
import type { PackageAvailability } from "@/lib/types/event";

export async function listEvents(query?: {
  category?: string;
  from?: string;
  to?: string;
}) {
  const params = new URLSearchParams();
  if (query?.category) params.set("category", query.category);
  if (query?.from) params.set("from", query.from);
  if (query?.to) params.set("to", query.to);
  const qs = params.toString();
  return apiClient<{ events: PublicEvent[] }>(
    `/events${qs ? `?${qs}` : ""}`,
    { cache: "no-store" },
  );
}

export async function getEvent(id: string) {
  return apiClient<{ event: PublicEvent }>(`/events/${id}`, {
    cache: "no-store",
  });
}

export async function getEventPackages(id: string) {
  return apiClient<{
    eventId: string;
    packages: PackageAvailability[];
  }>(`/events/${id}/ticket-packages`, { cache: "no-store" });
}

export async function getEventAvailability(id: string) {
  return apiClient<{ availability: EventAvailability }>(
    `/events/${id}/availability`,
    { cache: "no-store" },
  );
}
