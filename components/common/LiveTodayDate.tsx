"use client";

import { useEffect, useState } from "react";
import {
  getTodayDisplayParts,
  type TodayDisplayParts,
} from "@/lib/format/datetime";

type LiveTodayDateProps = {
  variant?: "hero" | "surface";
  className?: string;
};

export function LiveTodayDate({
  variant = "surface",
  className = "",
}: LiveTodayDateProps) {
  const [parts, setParts] = useState<TodayDisplayParts | null>(null);

  useEffect(() => {
    function tick() {
      setParts(getTodayDisplayParts());
    }
    tick();
    const id = window.setInterval(tick, 60_000);
    return () => window.clearInterval(id);
  }, []);

  const hero = variant === "hero";

  if (!parts) {
    return (
      <div
        className={[
          "flex min-w-0 items-stretch gap-3 sm:gap-4",
          className,
        ].join(" ")}
        aria-hidden
      >
        <div
          className={[
            "h-[4.5rem] w-[4.5rem] shrink-0 animate-pulse rounded-2xl sm:h-[5rem] sm:w-[5rem]",
            hero ? "bg-white/15" : "bg-surface-muted",
          ].join(" ")}
        />
        <div className="flex flex-1 flex-col justify-center gap-2 py-1">
          <div
            className={[
              "h-3 w-16 animate-pulse rounded",
              hero ? "bg-white/20" : "bg-surface-muted",
            ].join(" ")}
          />
          <div
            className={[
              "h-6 w-40 max-w-full animate-pulse rounded",
              hero ? "bg-white/25" : "bg-surface-muted",
            ].join(" ")}
          />
          <div
            className={[
              "h-4 w-52 max-w-full animate-pulse rounded",
              hero ? "bg-white/15" : "bg-surface-muted",
            ].join(" ")}
          />
        </div>
      </div>
    );
  }

  return (
    <div
      className={[
        "flex min-w-0 items-stretch gap-3 sm:gap-4",
        className,
      ].join(" ")}
      aria-live="polite"
      aria-atomic="true"
    >
      <div
        className={[
          "flex shrink-0 flex-col items-center justify-center rounded-2xl px-3 py-2 text-center shadow-sm sm:px-4 sm:py-2.5",
          hero
            ? "border border-white/25 bg-white/12 text-white backdrop-blur-md"
            : "border border-primary/20 bg-primary/5 text-primary",
        ].join(" ")}
      >
        <span
          className={[
            "text-[10px] font-bold uppercase tracking-[0.2em]",
            hero ? "text-accent-gold" : "text-primary/80",
          ].join(" ")}
        >
          {parts.weekdayShort}
        </span>
        <span
          className={[
            "font-display text-2xl leading-none sm:text-3xl",
            hero ? "text-white" : "text-ink",
          ].join(" ")}
        >
          {parts.day}
        </span>
        <span
          className={[
            "mt-0.5 text-[10px] font-semibold uppercase tracking-wide",
            hero ? "text-white/75" : "text-ink-muted",
          ].join(" ")}
        >
          {parts.monthShort}
        </span>
      </div>
      <div className="flex min-w-0 flex-col justify-center py-0.5">
        <p
          className={[
            "text-[11px] font-bold uppercase tracking-[0.18em]",
            hero ? "text-accent-gold/95" : "text-primary",
          ].join(" ")}
        >
          Today
        </p>
        <p
          className={[
            "font-display text-lg leading-snug sm:text-xl",
            hero ? "text-white" : "text-ink",
          ].join(" ")}
        >
          {parts.weekday}
        </p>
        <p
          className={[
            "mt-0.5 text-sm sm:text-base",
            hero ? "text-white/80" : "text-ink-muted",
          ].join(" ")}
        >
          {parts.dateSubline}
        </p>
      </div>
    </div>
  );
}
