"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import type { AdminGatekeeperAssignmentRow } from "@/lib/types/admin";
import { formatEventRange } from "@/lib/format/datetime";
import { ApiError } from "@/lib/api-client";
import { adminDeleteGatekeeperAssignment } from "@/lib/api/admin";
import { Card } from "@/components/ui/Card";
import { AdminResetGatekeeperPasswordButton } from "@/components/admin/AdminResetGatekeeperPasswordButton";

type GatekeeperAssignmentsListProps = {
  assignments: AdminGatekeeperAssignmentRow[];
};

export function GatekeeperAssignmentsList({
  assignments,
}: GatekeeperAssignmentsListProps) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleDelete(
    assignmentId: string,
    gatekeeperName?: string,
    eventTitle?: string,
  ) {
    const target = gatekeeperName
      ? `"${gatekeeperName}"${eventTitle ? ` from "${eventTitle}"` : ""}`
      : "this gatekeeper assignment";

    const ok = window.confirm(
      `Remove assignment for ${target}?\n\nThis gatekeeper will no longer be able to scan tickets for this event.`,
    );
    if (!ok) return;

    setDeletingId(assignmentId);
    try {
      await adminDeleteGatekeeperAssignment(assignmentId);
      window.alert("Gatekeeper assignment removed successfully!");
      router.refresh();
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "Failed to remove assignment.";
      window.alert(`Error: ${msg}`);
    } finally {
      setDeletingId(null);
    }
  }

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
            const isDeleting = deletingId === row.id;

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
                <div className="flex items-center gap-2 shrink-0">
                  {g?.id ? (
                    <AdminResetGatekeeperPasswordButton
                      gatekeeperId={g.id}
                      gatekeeperName={g.name}
                      variant="compact"
                    />
                  ) : null}
                  <button
                    type="button"
                    disabled={isDeleting}
                    aria-label={`Delete assignment for ${g?.name ?? "gatekeeper"}`}
                    title="Delete assigned gatekeeper"
                    className="flex h-9 w-9 items-center justify-center rounded-full text-danger transition hover:bg-danger/10 disabled:opacity-50"
                    onClick={() => void handleDelete(row.id, g?.name, ev?.title)}
                  >
                    <FontAwesomeIcon icon={faTrashCan} className="h-4 w-4" />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}
