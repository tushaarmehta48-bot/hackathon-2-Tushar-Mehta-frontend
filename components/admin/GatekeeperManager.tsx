"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ApiError } from "@/lib/api-client";
import {
  adminAssignGatekeeper,
  adminCreateGatekeeper,
} from "@/lib/api/admin";
import type {
  AdminEvent,
  AdminGatekeeperAssignmentRow,
} from "@/lib/types/admin";
import type { SafeUser } from "@/lib/types/user";
import { GatekeeperAssignmentsList } from "@/components/admin/GatekeeperAssignmentsList";
import { AdminResetGatekeeperPasswordButton } from "@/components/admin/AdminResetGatekeeperPasswordButton";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";

type GatekeeperManagerProps = {
  gatekeepers: SafeUser[];
  events: AdminEvent[];
  assignments: AdminGatekeeperAssignmentRow[];
};

export function GatekeeperManager({
  gatekeepers,
  events,
  assignments,
}: GatekeeperManagerProps) {
  const router = useRouter();
  const [createForm, setCreateForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [assignForm, setAssignForm] = useState({
    gatekeeperId: gatekeepers[0]?.id ?? "",
    eventId: events[0]?.id ?? "",
    gateId: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<"create" | "assign" | null>(null);

  async function onCreate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading("create");
    try {
      await adminCreateGatekeeper(createForm);
      setCreateForm({ name: "", email: "", password: "" });
      window.alert("Gatekeeper account created successfully!");
      router.refresh();
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "Create failed.";
      setError(msg);
      window.alert(`Error: ${msg}`);
    } finally {
      setLoading(null);
    }
  }

  async function onAssign(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading("assign");
    try {
      await adminAssignGatekeeper(assignForm.gatekeeperId, {
        eventId: assignForm.eventId,
        gateId: assignForm.gateId.trim() || undefined,
      });
      window.alert("Gatekeeper assigned to event successfully!");
      router.refresh();
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "Assignment failed.";
      setError(msg);
      window.alert(`Error: ${msg}`);
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="space-y-8">
      <GatekeeperAssignmentsList assignments={assignments} />

      <Card title="Staff accounts">
        <ul className="mb-4 space-y-3">
          {gatekeepers.length === 0 ? (
            <li className="text-sm text-ink-muted">No gatekeepers yet.</li>
          ) : (
            gatekeepers.map((g) => (
              <li
                key={g.id}
                className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"
              >
                <span className="text-sm">
                  <span className="font-semibold">{g.name}</span> · {g.email}
                </span>
                <AdminResetGatekeeperPasswordButton
                  gatekeeperId={g.id}
                  gatekeeperName={g.name}
                  variant="compact"
                />
              </li>
            ))
          )}
        </ul>
        <form className="grid gap-3 sm:grid-cols-2" onSubmit={onCreate}>
          <Input
            label="Name"
            required
            value={createForm.name}
            onChange={(e) =>
              setCreateForm((f) => ({ ...f, name: e.target.value }))
            }
          />
          <Input
            label="Email"
            type="email"
            required
            value={createForm.email}
            onChange={(e) =>
              setCreateForm((f) => ({ ...f, email: e.target.value }))
            }
          />
          <Input
            label="Temporary password"
            type="password"
            required
            minLength={8}
            className="sm:col-span-2"
            value={createForm.password}
            onChange={(e) =>
              setCreateForm((f) => ({ ...f, password: e.target.value }))
            }
          />
          <div className="sm:col-span-2">
            <Button type="submit" loading={loading === "create"}>
              Create gatekeeper
            </Button>
          </div>
        </form>
      </Card>

      <Card title="Assign to event">
        <form className="grid gap-3 sm:grid-cols-2" onSubmit={onAssign}>
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium text-ink-muted">Gatekeeper</span>
            <select
              className="min-h-11 rounded-xl border border-border bg-surface px-3"
              value={assignForm.gatekeeperId}
              onChange={(e) =>
                setAssignForm((f) => ({ ...f, gatekeeperId: e.target.value }))
              }
            >
              {gatekeepers.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium text-ink-muted">Event</span>
            <select
              className="min-h-11 rounded-xl border border-border bg-surface px-3"
              value={assignForm.eventId}
              onChange={(e) =>
                setAssignForm((f) => ({ ...f, eventId: e.target.value }))
              }
            >
              {events.map((ev) => (
                <option key={ev.id} value={ev.id}>
                  {ev.title}
                </option>
              ))}
            </select>
          </label>
          <Input
            label="Gate label (optional)"
            value={assignForm.gateId}
            onChange={(e) =>
              setAssignForm((f) => ({ ...f, gateId: e.target.value }))
            }
          />
          <div className="flex items-end">
            <Button
              type="submit"
              className="w-full"
              loading={loading === "assign"}
              disabled={!assignForm.gatekeeperId || !assignForm.eventId}
            >
              Assign
            </Button>
          </div>
        </form>
      </Card>

      {error ? (
        <p className="text-sm text-danger" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
