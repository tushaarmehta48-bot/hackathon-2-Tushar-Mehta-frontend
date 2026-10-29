import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminDeleteEventButton } from "@/components/admin/AdminDeleteEventButton";
import { EventForm } from "@/components/admin/EventForm";
import { EventStatusActions } from "@/components/admin/EventStatusActions";
import { PackageManager } from "@/components/admin/PackageManager";
import { ApiError } from "@/lib/api-client";
import {
  serverAdminGetEvent,
  serverAdminGetInventory,
} from "@/lib/api/admin-server";
import { Card } from "@/components/ui/Card";

type AdminEventDetailContentProps = {
  params: Promise<{ id: string }>;
};

export async function AdminEventDetailContent({
  params,
}: AdminEventDetailContentProps) {
  const { id } = await params;

  let event;
  let packages;
  let availability;

  try {
    const [eventRes, inventoryRes] = await Promise.all([
      serverAdminGetEvent(id),
      serverAdminGetInventory(id),
    ]);
    event = eventRes.event;
    availability = inventoryRes.availability;
    packages = availability.packages;
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) {
      notFound();
    }
    throw err;
  }

  const editable = event.status === "draft" || event.status === "published";

  return (
    <div className="space-y-8">
      <div>
        <Link href="/admin/events" className="text-sm font-medium text-primary">
          ← Events
        </Link>
        <div className="mt-2 flex flex-wrap items-start justify-between gap-3">
          <h1 className="font-display text-3xl font-semibold">{event.title}</h1>
          <AdminDeleteEventButton eventId={event.id} eventTitle={event.title} />
        </div>
        <div className="mt-3">
          <EventStatusActions eventId={event.id} status={event.status} />
        </div>
      </div>

      {editable ? (
        <EventForm mode="edit" event={event} />
      ) : (
        <Card title="Event locked">
          <p className="text-sm text-ink-muted">
            Events in “{event.status}” status cannot be edited.
          </p>
        </Card>
      )}

      <PackageManager eventId={event.id} packages={packages} />

      <Card title="Inventory summary">
        <p className="text-sm text-ink-muted">
          {availability.summary.ticketsRemaining} tickets remaining ·{" "}
          {availability.summary.isSoldOut ? "sold out" : "on sale"}
        </p>
      </Card>
    </div>
  );
}
