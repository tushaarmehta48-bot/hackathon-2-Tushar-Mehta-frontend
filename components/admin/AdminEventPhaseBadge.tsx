import {
  badgeToneClass,
  getPublicEventBadge,
  type EventBadgeKind,
} from "@/lib/events/event-lifecycle";

type AdminEventPhaseBadgeProps = {
  status: string;
  startAt: string;
  endAt: string;
  listingBadge?: "live" | "upcoming" | null;
};

export function AdminEventPhaseBadge({
  status,
  startAt,
  endAt,
  listingBadge,
}: AdminEventPhaseBadgeProps) {
  const badge = getPublicEventBadge({
    status,
    startAt,
    endAt,
    listingBadge,
  });
  if (badge) {
    const { kind, label } = badge;
    return (
      <span
        className={[
          "inline-flex shrink-0 rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide",
          badgeToneClass(kind as EventBadgeKind),
        ].join(" ")}
      >
        {label}
      </span>
    );
  }
  return (
    <span className="text-sm capitalize text-ink-subtle">
      {status.replace("_", " ")}
    </span>
  );
}
