"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ApiError } from "@/lib/api-client";
import { adminResetGatekeeperPassword } from "@/lib/api/admin";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

type AdminResetGatekeeperPasswordButtonProps = {
  gatekeeperId: string;
  gatekeeperName: string;
  variant?: "inline" | "compact";
};

export function AdminResetGatekeeperPasswordButton({
  gatekeeperId,
  gatekeeperName,
  variant = "inline",
}: AdminResetGatekeeperPasswordButtonProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function close() {
    setOpen(false);
    setPassword("");
    setError(null);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await adminResetGatekeeperPassword(gatekeeperId, password);
      close();
      router.refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Reset failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Button
        type="button"
        variant={variant === "compact" ? "ghost" : "secondary"}
        className={variant === "compact" ? "min-h-9 px-3 py-1.5 text-xs" : undefined}
        onClick={() => setOpen(true)}
      >
        Reset password
      </Button>
      {open ? (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 p-4 sm:items-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby="reset-gk-password-title"
        >
          <div className="w-full max-w-md rounded-2xl border border-border bg-surface p-5 shadow-lg">
            <h2
              id="reset-gk-password-title"
              className="font-display text-lg font-semibold"
            >
              Reset password
            </h2>
            <p className="mt-1 text-sm text-ink-muted">
              Set a new password for {gatekeeperName}. Share it securely with
              staff.
            </p>
            <form className="mt-4 space-y-3" onSubmit={onSubmit}>
              <Input
                label="New password"
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {error ? (
                <p className="text-sm text-danger" role="alert">
                  {error}
                </p>
              ) : null}
              <div className="flex flex-wrap gap-2 pt-1">
                <Button type="submit" loading={loading}>
                  Save password
                </Button>
                <Button type="button" variant="ghost" onClick={close}>
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}
