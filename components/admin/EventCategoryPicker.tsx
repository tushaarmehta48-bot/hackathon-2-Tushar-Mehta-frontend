"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { EVENT_CATEGORIES } from "@/lib/constants/categories";
import { categoryLabel } from "@/lib/events/category-art";

type EventCategoryPickerProps = {
  value: string;
  onChange: (categoryId: string) => void;
};

export function EventCategoryPicker({ value, onChange }: EventCategoryPickerProps) {
  const knownIds = new Set(EVENT_CATEGORIES.map((c) => c.id));
  const legacy = value && !knownIds.has(value);

  return (
    <div className="space-y-3">
      <div>
        <p className="text-sm font-medium text-ink-muted">Category</p>
        <p className="mt-0.5 text-xs text-ink-subtle">
          Same categories guests use on Explore — they can tap a category to see
          matching events.
        </p>
      </div>

      <div
        className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4"
        role="listbox"
        aria-label="Event category"
      >
        {EVENT_CATEGORIES.map((cat) => {
          const selected = value === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              role="option"
              aria-selected={selected}
              onClick={() => onChange(cat.id)}
              className={[
                "flex items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition",
                selected
                  ? "border-primary bg-primary/10 shadow-sm ring-2 ring-primary/25"
                  : "border-border bg-surface hover:border-primary/35 hover:bg-bg-milk",
              ].join(" ")}
            >
              <span
                className={[
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
                  selected
                    ? "bg-primary text-on-primary"
                    : "bg-primary/10 text-primary",
                ].join(" ")}
              >
                <FontAwesomeIcon icon={cat.icon} className="h-4 w-4" />
              </span>
              <span className="text-sm font-semibold text-ink">{cat.label}</span>
            </button>
          );
        })}
      </div>

      {legacy ? (
        <p className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-ink-muted">
          Current value{" "}
          <strong className="font-semibold text-ink">{categoryLabel(value)}</strong>{" "}
          is not in the standard list — pick a category above to align with guest
          filters.
        </p>
      ) : null}

      <input type="hidden" name="category" value={value} required readOnly />
    </div>
  );
}
