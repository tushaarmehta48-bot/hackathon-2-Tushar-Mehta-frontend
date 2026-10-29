import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock } from "@fortawesome/free-solid-svg-icons";
import { getEventScheduleParts, type EventScheduleParts } from "@/lib/format/datetime";

type DayParts = EventScheduleParts["start"];

type EventScheduleBlockProps = {
  startAt: string;
  endAt: string;
  timezone?: string;
  size?: "card" | "detail";
};

function CalendarTile({
  day,
  size,
  showYear,
}: {
  day: DayParts;
  size: "card" | "detail";
  showYear?: boolean;
}) {
  const compact = size === "card";
  return (
    <div
      className={[
        "flex shrink-0 flex-col items-center justify-center rounded-2xl border text-center shadow-soft",
        compact
          ? "border-white/30 bg-white/95 px-2.5 py-2 text-ink"
          : "border-primary/25 bg-gradient-to-b from-surface to-primary/5 px-4 py-3 text-ink",
      ].join(" ")}
    >
      <span
        className={[
          "font-bold uppercase tracking-[0.16em] text-primary",
          compact ? "text-[9px]" : "text-[10px]",
        ].join(" ")}
      >
        {day.weekdayShort}
      </span>
      <span
        className={[
          "font-display leading-none text-ink",
          compact ? "text-xl" : "text-4xl",
        ].join(" ")}
      >
        {day.day}
      </span>
      <span
        className={[
          "font-semibold uppercase tracking-wide text-ink-muted",
          compact ? "text-[9px]" : "text-xs",
        ].join(" ")}
      >
        {day.monthShort}
        {showYear ? (
          <span className="block text-[10px] normal-case">{day.year}</span>
        ) : null}
      </span>
    </div>
  );
}

export function EventScheduleBlock({
  startAt,
  endAt,
  timezone,
  size = "detail",
}: EventScheduleBlockProps) {
  const schedule = getEventScheduleParts(startAt, endAt, timezone);
  const compact = size === "card";

  if (compact) {
    return (
      <div className="flex items-center gap-3">
        <CalendarTile day={schedule.start} size="card" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
            {schedule.start.weekday}
          </p>
          <p className="truncate text-xs text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)]">
            {schedule.start.monthLong} {schedule.start.day}
            {!schedule.sameDay
              ? ` – ${schedule.end.monthShort} ${schedule.end.day}`
              : null}
          </p>
          <p className="mt-0.5 flex items-center gap-1.5 text-[11px] text-white/95 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
            <FontAwesomeIcon icon={faClock} className="h-3 w-3 shrink-0" />
            {schedule.timeLine}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border/80 bg-surface p-4 shadow-soft sm:p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <CalendarTile
          day={schedule.start}
          size="detail"
          showYear={!schedule.sameDay && schedule.start.year !== schedule.end.year}
        />
        {!schedule.sameDay ? (
          <>
            <span className="hidden text-2xl text-ink-subtle sm:block" aria-hidden>
              →
            </span>
            <CalendarTile
              day={schedule.end}
              size="detail"
              showYear={schedule.start.year !== schedule.end.year}
            />
          </>
        ) : null}
        <div className="min-w-0 flex-1 space-y-2">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-primary">
            Date & time
          </p>
          <p className="font-display text-xl leading-snug text-ink sm:text-2xl">
            {schedule.headline}
          </p>
          <p className="flex flex-wrap items-center gap-2 text-sm text-ink-muted">
            <FontAwesomeIcon icon={faClock} className="h-3.5 w-3.5 text-primary/80" />
            <span>{schedule.timeLine}</span>
            {timezone ? (
              <span className="rounded-full bg-surface-muted px-2 py-0.5 text-xs">
                {timezone.replace(/_/g, " ")}
              </span>
            ) : null}
          </p>
        </div>
      </div>
    </div>
  );
}
