"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { ApiError } from "@/lib/api-client";
import { adminDeleteEvent } from "@/lib/api/admin";

type AdminDeleteEventButtonProps = {
  eventId: string;
  eventTitle: string;
  /** After delete, navigate here (default /admin/events). */
  redirectTo?: string;
  className?: string;
};

export function AdminDeleteEventButton({
  eventId,
  eventTitle,
  redirectTo = "/admin/events",
  className = "",
}: AdminDeleteEventButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onDelete() {
    const ok = window.confirm(
      `Delete “${eventTitle}”?\n\nThis will permanently delete this event, along with all associated packages, tickets, and bookings. This action cannot be undone.`,
    );
    if (!ok) return;

    setLoading(true);
    setError(null);
    try {
      await adminDeleteEvent(eventId);
      window.alert(`Event “${eventTitle}” deleted successfully.`);
      router.push(redirectTo);
      router.refresh();
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "Delete failed.";
      setError(msg);
      window.alert(`Error: ${msg}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={className}>
      <button
        type="button"
        aria-label={`Delete event ${eventTitle}`}
        disabled={loading}
        title="Delete event"
        className="flex h-10 w-10 items-center justify-center rounded-full text-danger transition hover:bg-danger/10 disabled:opacity-50"
        onClick={() => void onDelete()}
      >
        <FontAwesomeIcon icon={faTrashCan} className="h-4 w-4" />
      </button>
      {error ? (
        <p className="mt-1 max-w-xs text-xs text-danger" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
