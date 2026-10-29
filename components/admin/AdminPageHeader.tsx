import type { ReactNode } from "react";

type AdminPageHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
};

export function AdminPageHeader({
  eyebrow = "Admin",
  title,
  description,
  actions,
}: AdminPageHeaderProps) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-gradient-to-br from-ink via-ink/95 to-primary/40 px-6 py-8 text-white shadow-elevated md:px-8">
      <div
        className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-accent-gold/20 blur-3xl"
        aria-hidden
      />
      <div className="relative flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-white/55">
            {eyebrow}
          </p>
          <h1 className="mt-2 font-display text-3xl font-normal tracking-tight md:text-4xl">
            {title}
          </h1>
          {description ? (
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/75">
              {description}
            </p>
          ) : null}
        </div>
        {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
      </div>
    </div>
  );
}
