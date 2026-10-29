import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { EVENT_CATEGORIES as CATEGORY_DEFS } from "@/lib/constants/categories";

export type CategoryFilterOption = {
  value: string;
  label: string;
  icon?: IconDefinition;
};

export const EVENT_CATEGORIES: CategoryFilterOption[] = [
  { value: "", label: "Any category" },
  ...CATEGORY_DEFS.map((c) => ({
    value: c.id,
    label: c.label,
    icon: c.icon,
  })),
];

function toIsoDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function addDays(base: Date, days: number): Date {
  const d = new Date(base);
  d.setDate(d.getDate() + days);
  return d;
}

/** Saturday of the current weekend (Sat–Sun use today). */
function weekendStart(from: Date): Date {
  const d = new Date(from);
  const day = d.getDay();
  if (day === 6 || day === 0) return d;
  return addDays(d, 6 - day);
}

export type DatePreset = {
  id: string;
  label: string;
  hint?: string;
  value: string;
};

export function getDatePresets(now: Date): DatePreset[] {
  const today = toIsoDate(now);
  const tomorrow = toIsoDate(addDays(now, 1));
  const weekend = toIsoDate(weekendStart(now));
  const nextWeek = toIsoDate(addDays(now, 7));

  return [
    { id: "any", label: "Any date", hint: "No date filter", value: "" },
    { id: "today", label: "Today", value: today },
    { id: "tomorrow", label: "Tomorrow", value: tomorrow },
    {
      id: "weekend",
      label: "This weekend",
      hint: "From Saturday onward",
      value: weekend,
    },
    {
      id: "later",
      label: "In a week",
      hint: "Events from seven days out",
      value: nextWeek,
    },
  ];
}

export function formatFilterDate(iso: string): string {
  if (!iso) return "Any date";
  const d = new Date(`${iso}T12:00:00`);
  if (Number.isNaN(d.getTime())) return "Any date";
  return d.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export function categoryLabel(value: string): string {
  const found = EVENT_CATEGORIES.find((c) => c.value === value);
  return found?.label ?? "Any category";
}
