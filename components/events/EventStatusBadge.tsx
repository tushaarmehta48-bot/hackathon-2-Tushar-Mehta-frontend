import {
  badgeToneClass,
  getPublicEventBadge,
  type EventBadgeKind,
} from "@/lib/events/event-lifecycle";

type EventStatusBadgeProps = {
  status: string;
  startAt: string;
  endAt: string;
  listingBadge?: "live" | "upcoming" | null;
  className?: string;
};

export function EventStatusBadge({
  status,
  startAt,
  endAt,
  listingBadge,
  className = "",
}: EventStatusBadgeProps) {
  const badge = getPublicEventBadge({ status, startAt, endAt, listingBadge });
  if (!badge) {
    return null;
  }
  const { kind, label } = badge;
  return (
    <span
      className={[
        "rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide backdrop-blur-sm",
        badgeToneClass(kind as EventBadgeKind),
        className,
      ].join(" ")}
    >
      {label}
    </span>
  );
}
