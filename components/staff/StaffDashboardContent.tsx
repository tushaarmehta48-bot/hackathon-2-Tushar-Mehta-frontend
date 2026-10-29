import Link from "next/link";
import { ApiError } from "@/lib/api-client";
import { serverGatekeeperAssignments } from "@/lib/api/gatekeeper-server";
import { formatEventRange } from "@/lib/format/datetime";
import type { GatekeeperAssignment } from "@/lib/types/gatekeeper";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Card } from "@/components/ui/Card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQrcode } from "@fortawesome/free-solid-svg-icons";

function scanHref(assignment: GatekeeperAssignment): string {
  const params = new URLSearchParams();
  params.set("eventId", assignment.eventId);
  if (assignment.gateId) {
    params.set("gateId", assignment.gateId);
  }
  if (assignment.event?.title) {
    params.set("title", assignment.event.title);
  }
  return `/gatekeeper/scan?${params.toString()}`;
}

export async function StaffDashboardContent() {
  let assignments: GatekeeperAssignment[] = [];
  let error: string | null = null;

  try {
    const data = await serverGatekeeperAssignments();
    assignments = data.assignments;
  } catch (err) {
    error =
      err instanceof ApiError ? err.message : "Could not load assignments.";
  }

  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-surface to-accent-gold/10 p-6 shadow-soft">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
          Today
        </p>
        <h1 className="mt-2 font-display text-3xl font-normal tracking-tight">
          Your gates
        </h1>
        <p className="mt-2 text-ink-muted">
          Pick an assignment or open the scanner for manual ticket entry.
        </p>
        <Link href="/gatekeeper/scan" className="mt-5 inline-block">
          <Button type="button" className="min-h-12 rounded-full px-6">
            <FontAwesomeIcon icon={faQrcode} className="mr-2" />
            Open scanner
          </Button>
        </Link>
      </div>

      {error ? (
        <p className="text-sm text-danger" role="alert">
          {error}
        </p>
      ) : null}

      {assignments.length === 0 && !error ? (
        <EmptyState
          illustration="events"
          title="No active assignments"
          description="Ask an organizer to assign you to an event and gate. You can still scan with a ticket code."
          action={
            <Link href="/gatekeeper/scan">
              <Button type="button" variant="secondary" className="rounded-full">
                Open scanner
              </Button>
            </Link>
          }
        />
      ) : (
        <ul className="space-y-4">
          {assignments.map((assignment) => (
            <li key={assignment.id}>
              <Card className="border-border/80 shadow-soft">
                <div className="space-y-2">
                  <p className="font-display text-xl text-ink">
                    {assignment.event?.title ?? "Event"}
                  </p>
                  {assignment.event ? (
                    <p className="text-sm text-ink-muted" suppressHydrationWarning>
                      {assignment.event.venue} ·{" "}
                      {formatEventRange(
                        assignment.event.startAt,
                        assignment.event.endAt,
                      )}
                    </p>
                  ) : null}
                  {assignment.gateId ? (
                    <p className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                      Gate {assignment.gateId}
                    </p>
                  ) : null}
                </div>
                <Link href={scanHref(assignment)} className="mt-4 block">
                  <Button type="button" className="min-h-12 w-full rounded-full">
                    Scan at this gate
                  </Button>
                </Link>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
