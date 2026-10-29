import Link from "next/link";
import { ApiError } from "@/lib/api-client";
import { serverAdminListEvents } from "@/lib/api/admin-server";
import { AdminEventsList } from "@/components/admin/AdminEventsList";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";

export async function AdminEventsContent() {
  let events: Awaited<ReturnType<typeof serverAdminListEvents>>["events"] = [];
  let error: string | null = null;

  try {
    ({ events } = await serverAdminListEvents());
  } catch (err) {
    error = err instanceof ApiError ? err.message : "Could not load events.";
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Catalog"
        title="Events"
        description="Draft → packages → publish. Add a card image on create or edit."
        actions={
          <Link
            href="/admin/events/new"
            className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-ink shadow-md"
          >
            New event
          </Link>
        }
      />

      {error ? <p className="text-sm text-danger">{error}</p> : null}

      {events.length === 0 && !error ? (
        <p className="text-sm text-ink-muted">No events yet.</p>
      ) : (
        <AdminEventsList events={events} />
      )}
    </div>
  );
}
