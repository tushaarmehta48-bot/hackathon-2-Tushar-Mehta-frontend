import Image from "next/image";
import type { ReactNode } from "react";

type EmptyStateProps = {
  title: string;
  description: string;
  illustration?: "tickets" | "events";
  action?: ReactNode;
};

const illustrations = {
  tickets: "/illustrations/tickets-empty.svg",
  events: "/illustrations/tickets-empty.svg",
};

export function EmptyState({
  title,
  description,
  illustration = "events",
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-border bg-surface px-6 py-10 text-center">
      <Image
        src={illustrations[illustration]}
        alt=""
        width={200}
        height={133}
        className="mb-6 opacity-90"
        priority={false}
      />
      <h2 className="font-display text-xl font-semibold text-ink">{title}</h2>
      <p className="mt-2 max-w-sm text-sm text-ink-muted">{description}</p>
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}
