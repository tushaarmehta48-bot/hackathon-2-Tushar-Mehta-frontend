"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ApiError } from "@/lib/api-client";
import { adminUpdateEventStatus } from "@/lib/api/admin";
import { Button } from "@/components/ui/Button";

const NEXT_STATUS: Record<string, { label: string; status: string }[]> = {
  draft: [
    { label: "Publish", status: "published" },
    { label: "Cancel", status: "cancelled" },
  ],
  published: [
    { label: "Mark completed", status: "completed" },
    { label: "Cancel", status: "cancelled" },
  ],
  sold_out: [
    { label: "Mark completed", status: "completed" },
    { label: "Cancel", status: "cancelled" },
  ],
  completed: [{ label: "Reopen (publish)", status: "published" }],
};

type EventStatusActionsProps = {
  eventId: string;
  status: string;
};

export function EventStatusActions({ eventId, status }: EventStatusActionsProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<string | null>(null);

  const actions = NEXT_STATUS[status] ?? [];

  async function transition(next: string) {
    setError(null);
    setLoading(next);
    try {
      await adminUpdateEventStatus(eventId, next);
      window.alert(`Event status updated to "${next.replace("_", " ")}" successfully!`);
      router.refresh();
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "Status update failed.";
      setError(msg);
      window.alert(`Error: ${msg}`);
    } finally {
      setLoading(null);
    }
  }

  if (actions.length === 0) {
    return (
      <p className="text-sm capitalize text-ink-muted">Status: {status.replace("_", " ")}</p>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm capitalize text-ink-muted">
        Status: {status.replace("_", " ")}
      </span>
      {actions.map((action) => (
        <Button
          key={action.status}
          type="button"
          variant={action.status === "cancelled" ? "ghost" : "secondary"}
          loading={loading === action.status}
          onClick={() => transition(action.status)}
        >
          {action.label}
        </Button>
      ))}
      {error ? (
        <p className="w-full text-sm text-danger" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
