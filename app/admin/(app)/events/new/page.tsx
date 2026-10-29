import { EventForm } from "@/components/admin/EventForm";

export const metadata = { title: "New event · EventPulse" };

export default function AdminNewEventPage() {
  return (
    <div className="space-y-4">
      <h1 className="font-display text-3xl font-semibold">Create event</h1>
      <EventForm mode="create" />
    </div>
  );
}
