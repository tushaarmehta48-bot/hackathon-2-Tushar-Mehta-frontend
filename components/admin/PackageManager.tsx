"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faXmark } from "@fortawesome/free-solid-svg-icons";
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
import { Input } from "@/components/ui/Input";

type PackageManagerProps = {
  eventId: string;
  packages: PackageAvailability[];
};

type EditPackageState = {
  id: string;
  name: string;
  priceRupees: string;
  quantityTotal: number;
  quantitySold: number;
  admissionCount: number;
  active: boolean;
};

export function PackageManager({ eventId, packages }: PackageManagerProps) {
  const router = useRouter();
  const [drafts, setDrafts] = useState(() => [newPackageDraft()]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Edit package state
  const [editPackage, setEditPackage] = useState<EditPackageState | null>(null);
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  function startEdit(pkg: PackageAvailability) {
    setEditPackage({
      id: pkg.id,
      name: pkg.name,
      priceRupees: (pkg.priceMinor / 100).toString(),
      quantityTotal: pkg.quantityTotal,
      quantitySold: pkg.quantitySold,
      admissionCount: pkg.admissionCount ?? 1,
      active: pkg.active,
    });
    setEditError(null);
  }

  async function onSaveEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editPackage) return;
    setEditError(null);

    const trimmedName = editPackage.name.trim();
    if (!trimmedName) {
      const msg = "Package name cannot be empty.";
      setEditError(msg);
      window.alert(msg);
      return;
    }

    const priceNum = parseFloat(editPackage.priceRupees);
    if (isNaN(priceNum) || priceNum < 0) {
      const msg = "Please enter a valid price in rupees (0 or greater).";
      setEditError(msg);
      window.alert(msg);
      return;
    }

    if (editPackage.quantityTotal < editPackage.quantitySold) {
      const msg = `Total quantity cannot be less than tickets already sold (${editPackage.quantitySold}).`;
      setEditError(msg);
      window.alert(msg);
      return;
    }

    if (editPackage.quantityTotal < 1) {
      const msg = "Total quantity must be at least 1.";
      setEditError(msg);
      window.alert(msg);
      return;
    }

    setEditLoading(true);
    try {
      await adminUpdatePackage(editPackage.id, {
        name: trimmedName,
        priceMinor: Math.round(priceNum * 100),
        quantityTotal: editPackage.quantityTotal,
        admissionCount: editPackage.admissionCount || 1,
        active: editPackage.active,
      });
      setEditPackage(null);
      window.alert("Ticket package updated successfully!");
      router.refresh();
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "Update failed.";
      setEditError(msg);
      window.alert(`Error: ${msg}`);
    } finally {
      setEditLoading(false);
    }
  }

  async function onCreateAll(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const bodies = drafts
      .map(draftToCreateBody)
      .filter((b): b is NonNullable<typeof b> => b !== null);
    if (bodies.length === 0) {
      const msg = "Add at least one package with a name and valid price in rupees.";
      setError(msg);
      window.alert(msg);
      return;
    }
    if (bodies.length !== drafts.length) {
      const msg = "Fix invalid rows — each package needs a name, price (₹), and quantity.";
      setError(msg);
      window.alert(msg);
      return;
    }

    setLoading(true);
    try {
      for (const body of bodies) {
        await adminCreatePackage(eventId, body);
      }
      setDrafts([newPackageDraft()]);
      const successMsg =
        bodies.length > 1
          ? "All ticket packages created successfully!"
          : "Ticket package created successfully!";
      window.alert(successMsg);
      router.refresh();
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "Could not add packages.";
      setError(msg);
      window.alert(`Error: ${msg}`);
    } finally {
      setLoading(false);
    }
  }

  async function toggleActive(pkg: PackageAvailability) {
    setError(null);
    try {
      await adminUpdatePackage(pkg.id, { active: !pkg.active });
      const msg = pkg.active
        ? `Package "${pkg.name}" is now inactive.`
        : `Package "${pkg.name}" is now active and on sale!`;
      window.alert(msg);
      router.refresh();
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "Update failed.";
      setError(msg);
      window.alert(`Error: ${msg}`);
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
                    {pkg.admissionCount > 1 ? ` · Admits ${pkg.admissionCount} guests` : ""}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="secondary"
                    className="min-h-8 px-3 py-1 text-xs"
                    onClick={() => startEdit(pkg)}
                  >
                    <FontAwesomeIcon icon={faPen} className="mr-1.5 h-3 w-3" />
                    Edit
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    className="min-h-8 px-3 py-1 text-xs"
                    onClick={() => toggleActive(pkg)}
                  >
                    {pkg.active ? "Deactivate" : "Activate"}
                  </Button>
                </div>
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

      {/* Edit Package Modal */}
      {editPackage ? (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-ink/50 p-4 backdrop-blur-sm sm:items-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby="edit-package-title"
        >
          <div className="w-full max-w-lg rounded-3xl border border-border bg-surface p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-border/80 pb-3">
              <h2
                id="edit-package-title"
                className="font-display text-xl font-semibold text-ink"
              >
                Edit ticket package
              </h2>
              <button
                type="button"
                onClick={() => setEditPackage(null)}
                className="rounded-full p-1.5 text-ink-muted transition hover:bg-surface-muted hover:text-ink"
                aria-label="Close modal"
              >
                <FontAwesomeIcon icon={faXmark} className="h-5 w-5" />
              </button>
            </div>

            <form className="mt-4 space-y-4" onSubmit={onSaveEdit}>
              <Input
                label="Package name"
                required
                value={editPackage.name}
                onChange={(e) =>
                  setEditPackage((prev) =>
                    prev ? { ...prev, name: e.target.value } : null,
                  )
                }
              />

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Input
                  label="Price (₹)"
                  type="number"
                  min={0}
                  step={0.01}
                  required
                  value={editPackage.priceRupees}
                  onChange={(e) =>
                    setEditPackage((prev) =>
                      prev ? { ...prev, priceRupees: e.target.value } : null,
                    )
                  }
                />
                <Input
                  label="Total quantity"
                  type="number"
                  min={editPackage.quantitySold || 1}
                  required
                  value={editPackage.quantityTotal}
                  hint={
                    editPackage.quantitySold > 0
                      ? `Already sold: ${editPackage.quantitySold}`
                      : undefined
                  }
                  onChange={(e) =>
                    setEditPackage((prev) =>
                      prev
                        ? {
                            ...prev,
                            quantityTotal: parseInt(e.target.value, 10) || 0,
                          }
                        : null,
                    )
                  }
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Input
                  label="Admissions per ticket"
                  type="number"
                  min={1}
                  value={editPackage.admissionCount}
                  onChange={(e) =>
                    setEditPackage((prev) =>
                      prev
                        ? {
                            ...prev,
                            admissionCount: parseInt(e.target.value, 10) || 1,
                          }
                        : null,
                    )
                  }
                />
                <div className="flex flex-col justify-end">
                  <label className="flex cursor-pointer items-center gap-2 pb-2 text-sm font-medium text-ink">
                    <input
                      type="checkbox"
                      checked={editPackage.active}
                      onChange={(e) =>
                        setEditPackage((prev) =>
                          prev ? { ...prev, active: e.target.checked } : null,
                        )
                      }
                      className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                    />
                    <span>Active and on sale</span>
                  </label>
                </div>
              </div>

              {editError ? (
                <p className="text-sm text-danger" role="alert">
                  {editError}
                </p>
              ) : null}

              <div className="flex flex-wrap justify-end gap-2 border-t border-border/80 pt-3">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setEditPackage(null)}
                >
                  Cancel
                </Button>
                <Button type="submit" loading={editLoading}>
                  Save changes
                </Button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}
