import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type AdminStatCardProps = {
  label: string;
  value: string | number;
  hint?: string;
  icon: IconDefinition;
  tone?: "default" | "success" | "primary" | "gold";
  onClick?: () => void;
  actionLabel?: string;
};

const toneClass: Record<NonNullable<AdminStatCardProps["tone"]>, string> = {
  default: "border-border bg-surface",
  success: "border-success/35 bg-success/8",
  primary: "border-primary/30 bg-primary/8",
  gold: "border-accent-gold/40 bg-accent-gold/10",
};

const iconTone: Record<NonNullable<AdminStatCardProps["tone"]>, string> = {
  default: "bg-surface-muted text-ink-muted",
  success: "bg-success/15 text-success",
  primary: "bg-primary/15 text-primary",
  gold: "bg-accent-gold/20 text-ink",
};

export function AdminStatCard({
  label,
  value,
  hint,
  icon,
  tone = "default",
  onClick,
  actionLabel,
}: AdminStatCardProps) {
  const isClickable = typeof onClick === "function";

  return (
    <li
      onClick={onClick}
      role={isClickable ? "button" : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onKeyDown={
        isClickable
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
      className={[
        "rounded-2xl border p-5 shadow-soft transition",
        isClickable
          ? "cursor-pointer hover:border-primary/60 hover:shadow-lg active:scale-[0.99] group"
          : "hover:shadow-md",
        toneClass[tone],
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-ink-subtle">
            {label}
          </p>
          <p className="mt-2 font-display text-3xl tabular-nums tracking-tight text-ink">
            {value}
          </p>
          {hint ? (
            <p className="mt-1 text-xs text-ink-muted">{hint}</p>
          ) : null}
          {actionLabel ? (
            <p className="mt-2.5 inline-flex items-center gap-1 text-xs font-semibold text-primary group-hover:underline">
              {actionLabel}
            </p>
          ) : null}
        </div>
        <span
          className={[
            "flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl transition group-hover:scale-105",
            iconTone[tone],
          ].join(" ")}
          aria-hidden
        >
          <FontAwesomeIcon icon={icon} className="h-4 w-4" />
        </span>
      </div>
    </li>
  );
}
