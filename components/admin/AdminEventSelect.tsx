"use client";

import type { AdminEvent } from "@/lib/types/admin";

type AdminEventSelectProps = {
  events: AdminEvent[];
  value: string;
  onChange: (eventId: string) => void;
  label?: string;
  allowAll?: boolean;
};

export function AdminEventSelect({
  events,
  value,
  onChange,
  label = "Event",
  allowAll = true,
}: AdminEventSelectProps) {
  return (
    <label className="flex min-w-[min(100%,20rem)] flex-col gap-1.5">
      <span className="text-xs font-bold uppercase tracking-[0.12em] text-ink-subtle">
        {label}
      </span>
      <select
        className="rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm font-medium text-ink shadow-soft outline-none ring-primary/30 focus:ring-2"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {allowAll ? <option value="">All events</option> : null}
        {events.map((ev) => (
          <option key={ev.id} value={ev.id}>
            {ev.title} ({ev.status})
          </option>
        ))}
      </select>
    </label>
  );
}
