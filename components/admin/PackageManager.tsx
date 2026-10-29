"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ApiError } from "@/lib/api-client";
import {
  adminCreatePackage,
  adminUpdatePackage,
} from "@/lib/api/admin";
import { formatMinor } from "@/lib/format/currency";
import type { PackageAvailability } from "@/lib/types/event";
import { PackageDraftEditor } from "@/components/admin/PackageDraftEditor";
import {
  draftToCreateBody,
  newPackageDraft,
} from "@/components/admin/package-draft-utils";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

type PackageManagerProps = {
  eventId: string;
  packages: PackageAvailability[];
};

export function PackageManager({ eventId, packages }: PackageManagerProps) {
  const router = useRouter();
  const [drafts, setDrafts] = useState(() => [newPackageDraft()]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onCreateAll(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const bodies = drafts
      .map(draftToCreateBody)
      .filter((b): b is NonNullable<typeof b> => b !== null);
    if (bodies.length === 0) {
      setError("Add at least one package with a name and valid price in rupees.");
      return;
    }
    if (bodies.length !== drafts.length) {
      setError("Fix invalid rows — each package needs a name, price (₹), and quantity.");
      return;
    }

    setLoading(true);
    try {
      for (const body of bodies) {
        await adminCreatePackage(eventId, body);
      }
      setDrafts([newPackageDraft()]);
      router.refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not add packages.");
    } finally {
      setLoading(false);
    }
  }

  async function toggleActive(pkg: PackageAvailability) {
    setError(null);
    try {
      await adminUpdatePackage(pkg.id, { active: !pkg.active });
      router.refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Update failed.");
    }
  }

  return (
    <div className="space-y-6">
      <Card title="Ticket packages">
        {packages.length === 0 ? (
          <p className="text-sm text-ink-muted">No packages yet — add below.</p>
        ) : (
          <ul className="divide-y divide-border">
            {packages.map((pkg) => (
              <li
                key={pkg.id}
                className="flex flex-wrap items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
              >
                <div>
                  <p className="font-semibold text-ink">
                    {pkg.name}{" "}
                    {!pkg.active ? (
                      <span className="text-xs text-ink-subtle">(inactive)</span>
                    ) : null}
                  </p>
                  <p className="text-sm text-ink-muted">
                    {formatMinor(pkg.priceMinor)} · sold {pkg.quantitySold} /{" "}
                    {pkg.quantityTotal}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => toggleActive(pkg)}
                >
                  {pkg.active ? "Deactivate" : "Activate"}
                </Button>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Card title="Add packages">
        <form className="space-y-4" onSubmit={onCreateAll}>
          <PackageDraftEditor drafts={drafts} onChange={setDrafts} />
          {error ? (
            <p className="text-sm text-danger" role="alert">
              {error}
            </p>
          ) : null}
          <Button type="submit" loading={loading}>
            {drafts.length > 1 ? "Create all packages" : "Create package"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
