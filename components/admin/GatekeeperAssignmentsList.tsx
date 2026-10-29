"use client";

import Link from "next/link";
import type { AdminGatekeeperAssignmentRow } from "@/lib/types/admin";
import { formatEventRange } from "@/lib/format/datetime";
import { Card } from "@/components/ui/Card";
import { AdminResetGatekeeperPasswordButton } from "@/components/admin/AdminResetGatekeeperPasswordButton";

type GatekeeperAssignmentsListProps = {
  assignments: AdminGatekeeperAssignmentRow[];
};

export function GatekeeperAssignmentsList({
  assignments,
}: GatekeeperAssignmentsListProps) {
  return (
    <Card title="Active assignments">
      {assignments.length === 0 ? (
        <p className="text-sm text-ink-muted">
          No event assignments yet. Assign a gatekeeper below.
        </p>
      ) : (
        <ul className="divide-y divide-border">
          {assignments.map((row) => {
            const g = row.gatekeeper;
            const ev = row.event;
            return (
              <li
                key={row.id}
                className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-start sm:justify-between"
              >
                <div className="min-w-0 space-y-1">
                  <p className="text-sm font-semibold text-ink">
                    {g?.name ?? "Unknown staff"}
                    {g?.email ? (
                      <span className="font-normal text-ink-muted">
                        {" "}
                        · {g.email}
                      </span>
                    ) : null}
                  </p>
                  {ev ? (
                    <>
                      <p className="text-sm">
                        <Link
                          href={`/admin/events/${ev.id}`}
                          className="font-medium text-brand hover:underline"
                        >
                          {ev.title}
                        </Link>
                        {ev.status ? (
                          <span className="ml-2 text-xs uppercase tracking-wide text-ink-muted">
                            {ev.status}
                          </span>
                        ) : null}
                      </p>
                      <p className="text-sm text-ink-muted" suppressHydrationWarning>
                        {formatEventRange(ev.startAt, ev.endAt, ev.timezone)}
                        {ev.venue ? ` · ${ev.venue}` : ""}
                      </p>
                    </>
                  ) : (
                    <p className="text-sm text-ink-muted">Event unavailable</p>
                  )}
                  {row.gateId ? (
                    <p className="text-xs text-ink-muted">
                      Gate: {row.gateId}
                    </p>
                  ) : null}
                </div>
                {g?.id ? (
                  <div className="shrink-0">
                    <AdminResetGatekeeperPasswordButton
                      gatekeeperId={g.id}
                      gatekeeperName={g.name}
                      variant="compact"
                    />
                  </div>
                ) : null}
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}
