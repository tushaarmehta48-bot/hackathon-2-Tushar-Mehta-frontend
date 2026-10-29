type DatePartsOptions = {
  timeZone?: string;
};

function dateParts(d: Date, opts?: DatePartsOptions) {
  const base: Intl.DateTimeFormatOptions = opts?.timeZone
    ? { timeZone: opts.timeZone }
    : {};
  const weekday = d.toLocaleDateString(undefined, {
    ...base,
    weekday: "long",
  });
  const weekdayShort = d.toLocaleDateString(undefined, {
    ...base,
    weekday: "short",
  });
  const monthShort = d.toLocaleDateString(undefined, {
    ...base,
    month: "short",
  });
  const monthLong = d.toLocaleDateString(undefined, {
    ...base,
    month: "long",
  });
  const day = d.toLocaleDateString(undefined, { ...base, day: "numeric" });
  const year = d.toLocaleDateString(undefined, { ...base, year: "numeric" });
  const time = d.toLocaleTimeString(undefined, {
    ...base,
    timeStyle: "short",
  });
  return { weekday, weekdayShort, monthShort, monthLong, day, year, time };
}

export type EventScheduleParts = {
  sameDay: boolean;
  start: ReturnType<typeof dateParts>;
  end: ReturnType<typeof dateParts>;
  timeLine: string;
  headline: string;
  subline: string;
};

export function getEventScheduleParts(
  startAt: string,
  endAt: string,
  timezone?: string,
): EventScheduleParts {
  const start = new Date(startAt);
  const end = new Date(endAt);
  const tzOpt = timezone ? { timeZone: timezone } : undefined;
  const startParts = dateParts(start, tzOpt);
  const endParts = dateParts(end, tzOpt);

  const sameDay =
    start.toLocaleDateString(undefined, {
      ...tzOpt,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }) ===
    end.toLocaleDateString(undefined, {
      ...tzOpt,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });

  const timeLine = sameDay
    ? `${startParts.time} – ${endParts.time}`
    : `${startParts.time} → ${endParts.time}`;

  const headline = sameDay
    ? `${startParts.weekday}, ${startParts.monthLong} ${startParts.day}, ${startParts.year}`
    : `${startParts.weekday}, ${startParts.monthShort} ${startParts.day} – ${endParts.weekday}, ${endParts.monthShort} ${endParts.day}`;

  const subline = sameDay
    ? timeLine
    : `${startParts.year}${startParts.year !== endParts.year ? ` – ${endParts.year}` : ""} · ${timeLine}`;

  return {
    sameDay,
    start: startParts,
    end: endParts,
    timeLine,
    headline,
    subline,
  };
}

export type TodayDisplayParts = {
  weekday: string;
  weekdayShort: string;
  day: string;
  monthShort: string;
  dateLine: string;
  dateSubline: string;
  isoDate: string;
};

export function getTodayDisplayParts(now = new Date()): TodayDisplayParts {
  const weekday = now.toLocaleDateString(undefined, { weekday: "long" });
  const weekdayShort = now.toLocaleDateString(undefined, { weekday: "short" });
  const day = now.toLocaleDateString(undefined, { day: "numeric" });
  const monthShort = now.toLocaleDateString(undefined, { month: "short" });
  const dateLine = now.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const dateSubline = now.toLocaleDateString(undefined, {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return {
    weekday,
    weekdayShort,
    day,
    monthShort,
    dateLine,
    dateSubline,
    isoDate: `${y}-${m}-${d}`,
  };
}

export function formatEventRange(
  startAt: string,
  endAt: string,
  timezone?: string,
): string {
  const start = new Date(startAt);
  const end = new Date(endAt);
  const opts: Intl.DateTimeFormatOptions = {
    dateStyle: "medium",
    timeStyle: "short",
    ...(timezone ? { timeZone: timezone } : {}),
  };
  const sameDay = start.toDateString() === end.toDateString();
  if (sameDay) {
    const date = start.toLocaleDateString(undefined, {
      dateStyle: "full",
      ...(timezone ? { timeZone: timezone } : {}),
    });
    const tStart = start.toLocaleTimeString(undefined, {
      timeStyle: "short",
      ...(timezone ? { timeZone: timezone } : {}),
    });
    const tEnd = end.toLocaleTimeString(undefined, {
      timeStyle: "short",
      ...(timezone ? { timeZone: timezone } : {}),
    });
    return `${date} · ${tStart} – ${tEnd}`;
  }
  return `${start.toLocaleString(undefined, opts)} – ${end.toLocaleString(undefined, opts)}`;
}
