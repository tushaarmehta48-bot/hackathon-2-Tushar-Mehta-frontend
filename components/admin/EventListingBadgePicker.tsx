"use client";

type ListingBadgeValue = "" | "live" | "upcoming";

type EventListingBadgePickerProps = {
  value: ListingBadgeValue;
  onChange: (value: ListingBadgeValue) => void;
};

const OPTIONS: { value: ListingBadgeValue; label: string; hint: string }[] = [
  { value: "", label: "No badge", hint: "Only Completed / Sold out show automatically" },
  { value: "live", label: "Live", hint: "Green chip on cards & event page" },
  { value: "upcoming", label: "Upcoming", hint: "Blue chip for scheduled events" },
];

export function EventListingBadgePicker({
  value,
  onChange,
}: EventListingBadgePickerProps) {
  return (
    <fieldset className="space-y-2">
      <legend className="text-sm font-medium text-ink-muted">
        Public listing badge
      </legend>
      <p className="text-xs text-ink-subtle">
        You choose Live or Upcoming — not based on dates. Completed and Sold out
        still come from event status.
      </p>
      <div className="grid gap-2 sm:grid-cols-3">
        {OPTIONS.map((opt) => {
          const selected = value === opt.value;
          return (
            <button
              key={opt.value || "none"}
              type="button"
              onClick={() => onChange(opt.value)}
              className={[
                "flex flex-col items-start rounded-xl border px-3 py-2.5 text-left text-sm transition",
                selected
                  ? "border-primary bg-primary/10 ring-1 ring-primary/30"
                  : "border-border bg-surface hover:border-primary/40",
              ].join(" ")}
            >
              <span className="font-semibold text-ink">{opt.label}</span>
              <span className="mt-0.5 text-xs text-ink-muted">{opt.hint}</span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

export function listingBadgeToFormValue(
  badge?: "live" | "upcoming" | null,
): ListingBadgeValue {
  if (badge === "live" || badge === "upcoming") return badge;
  return "";
}

export function formValueToListingBadge(
  value: ListingBadgeValue,
): "live" | "upcoming" | null {
  if (value === "live" || value === "upcoming") return value;
  return null;
}
