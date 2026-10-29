/** Calendar phase from event start/end (published events). */
export type EventCalendarPhase = "upcoming" | "live" | "ended";

export function getEventCalendarPhase(
  startAt: string,
  endAt: string,
  nowMs: number = Date.now(),
): EventCalendarPhase {
  const start = new Date(startAt).getTime();
  const end = new Date(endAt).getTime();
  if (Number.isNaN(start) || Number.isNaN(end)) {
    return "upcoming";
  }
  if (nowMs > end) {
    return "ended";
  }
  if (nowMs >= start) {
    return "live";
  }
  return "upcoming";
}

export function isBookingOpenBySchedule(
  startAt: string,
  endAt: string,
  nowMs: number = Date.now(),
): boolean {
  return getEventCalendarPhase(startAt, endAt, nowMs) === "live";
}

export type EventBadgeKind =
  | "draft"
  | "published"
  | "sold_out"
  | "completed"
  | "cancelled"
  | "upcoming"
  | "live"
  | "ended";

/** Public/admin listing badges — only terminal or inventory states (no Live/Upcoming). */
export function getPublicEventBadge(input: {
  status: string;
  startAt: string;
  endAt: string;
  listingBadge?: "live" | "upcoming" | null;
}): { kind: EventBadgeKind; label: string } | null {
  const { status, listingBadge } = input;

  if (status === "completed") {
    return { kind: "completed", label: "Completed" };
  }
  if (status === "sold_out") {
    return { kind: "sold_out", label: "Sold out" };
  }
  if (status === "cancelled") {
    return { kind: "cancelled", label: "Cancelled" };
  }
  if (status === "draft") {
    return { kind: "draft", label: "Draft" };
  }

  if (listingBadge === "live") {
    return { kind: "live", label: "Live" };
  }
  if (listingBadge === "upcoming") {
    return { kind: "upcoming", label: "Upcoming" };
  }

  return null;
}

export function badgeToneClass(kind: EventBadgeKind): string {
  switch (kind) {
    case "live":
      return "bg-emerald-600 text-white shadow-md shadow-emerald-900/25";
    case "upcoming":
      return "bg-sky-600 text-white shadow-md shadow-sky-900/20";
    case "sold_out":
    case "completed":
    case "ended":
    case "cancelled":
      return "bg-ink/85 text-white";
    case "draft":
      return "bg-amber-600/90 text-white";
    default:
      return "bg-primary text-on-primary shadow-lg shadow-primary/30";
  }
}
