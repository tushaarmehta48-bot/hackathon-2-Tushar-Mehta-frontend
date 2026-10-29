import { GatekeeperManager } from "@/components/admin/GatekeeperManager";
import { ApiError } from "@/lib/api-client";
import {
  serverAdminListEvents,
  serverAdminListGatekeeperAssignments,
  serverAdminListGatekeepers,
} from "@/lib/api/admin-server";
import type { AdminGatekeeperAssignmentRow } from "@/lib/types/admin";

export async function AdminGatekeepersContent() {
  let gatekeepers: Awaited<
    ReturnType<typeof serverAdminListGatekeepers>
  >["gatekeepers"] = [];
  let events: Awaited<ReturnType<typeof serverAdminListEvents>>["events"] = [];
  let assignments: AdminGatekeeperAssignmentRow[] = [];
  let error: string | null = null;

  try {
    const [g, e, a] = await Promise.all([
      serverAdminListGatekeepers(),
      serverAdminListEvents(),
      serverAdminListGatekeeperAssignments(),
    ]);
    gatekeepers = g.gatekeepers;
    events = e.events;
    assignments = a.assignments;
  } catch (err) {
    error = err instanceof ApiError ? err.message : "Could not load data.";
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold">Gatekeepers</h1>
        <p className="text-ink-muted">
          Create staff logins and assign them to events.
        </p>
      </div>
      {error ? (
        <p className="text-sm text-danger">{error}</p>
      ) : (
        <GatekeeperManager
          gatekeepers={gatekeepers}
          events={events}
          assignments={assignments}
        />
      )}
    </div>
  );
}
