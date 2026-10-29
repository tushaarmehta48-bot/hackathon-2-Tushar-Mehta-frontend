"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  newPackageDraft,
  type PackageDraftUi,
} from "@/components/admin/package-draft-utils";

type PackageDraftEditorProps = {
  drafts: PackageDraftUi[];
  onChange: (drafts: PackageDraftUi[]) => void;
  minRows?: number;
  showDescription?: boolean;
};

export function PackageDraftEditor({
  drafts,
  onChange,
  minRows = 1,
  showDescription = false,
}: PackageDraftEditorProps) {
  function updateRow(key: string, patch: Partial<PackageDraftUi>) {
    onChange(drafts.map((d) => (d.key === key ? { ...d, ...patch } : d)));
  }

  function removeRow(key: string) {
    if (drafts.length <= minRows) return;
    onChange(drafts.filter((d) => d.key !== key));
  }

  function addRow() {
    onChange([...drafts, newPackageDraft()]);
  }

  return (
    <div className="space-y-4">
      {drafts.length === 0 ? (
        <p className="text-sm text-ink-muted">
          No packages yet — add one or more ticket types below.
        </p>
      ) : null}
      {drafts.map((draft, index) => (
        <div
          key={draft.key}
          className="rounded-2xl border border-border bg-bg-milk p-4"
        >
          <div className="mb-3 flex items-center justify-between gap-2">
            <p className="text-sm font-semibold text-ink">
              Package {index + 1}
            </p>
            {drafts.length > minRows ? (
              <button
                type="button"
                aria-label={`Remove package ${index + 1}`}
                className="flex h-9 w-9 items-center justify-center rounded-full text-danger transition hover:bg-danger/10"
                onClick={() => removeRow(draft.key)}
              >
                <FontAwesomeIcon icon={faTrashCan} className="h-3.5 w-3.5" />
              </button>
            ) : null}
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Name"
              required
              value={draft.name}
              onChange={(e) => updateRow(draft.key, { name: e.target.value })}
            />
            <Input
              label="Price (₹ rupees)"
              type="number"
              min={0}
              step={0.01}
              required
              hint="Enter amount in rupees, e.g. 499 for ₹499"
              value={draft.priceRupees}
              onChange={(e) =>
                updateRow(draft.key, { priceRupees: e.target.value })
              }
            />
            <Input
              label="Quantity available"
              type="number"
              min={0}
              required
              value={draft.quantityTotal}
              onChange={(e) =>
                updateRow(draft.key, {
                  quantityTotal: Number(e.target.value),
                })
              }
            />
            <Input
              label="Admissions per ticket"
              type="number"
              min={1}
              required
              value={draft.admissionCount}
              onChange={(e) =>
                updateRow(draft.key, {
                  admissionCount: Number(e.target.value),
                })
              }
            />
            {showDescription ? (
              <label className="flex flex-col gap-1.5 sm:col-span-2">
                <span className="text-sm font-medium text-ink-muted">
                  Description (optional)
                </span>
                <textarea
                  className="min-h-20 w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm"
                  value={draft.description}
                  onChange={(e) =>
                    updateRow(draft.key, { description: e.target.value })
                  }
                />
              </label>
            ) : null}
          </div>
        </div>
      ))}

      <Button type="button" variant="secondary" onClick={addRow}>
        <FontAwesomeIcon icon={faPlus} className="mr-2 h-3.5 w-3.5" />
        Add another package
      </Button>
    </div>
  );
}
