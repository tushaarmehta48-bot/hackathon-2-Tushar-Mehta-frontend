import { formatMinor } from "@/lib/format/currency";
import type { PackageAvailability } from "@/lib/types/event";

type PackageListProps = {
  packages: PackageAvailability[];
};

export function PackageList({ packages }: PackageListProps) {
  if (packages.length === 0) {
    return (
      <p className="text-sm text-ink-muted">No ticket packages available.</p>
    );
  }

  return (
    <ul className="divide-y divide-border rounded-2xl border border-border bg-surface">
      {packages.map((pkg) => (
        <li
          key={pkg.id}
          className="flex flex-wrap items-center justify-between gap-3 px-4 py-4"
        >
          <div>
            <p className="font-semibold text-ink">{pkg.name}</p>
            <p className="text-sm text-ink-muted">
              {formatMinor(pkg.priceMinor)} · {pkg.admissionCount} admission
              {pkg.admissionCount === 1 ? "" : "s"} per ticket
            </p>
          </div>
          <div className="text-right text-sm">
            {pkg.onSale ? (
              <span className="font-medium text-success">
                {pkg.quantityRemaining} left
              </span>
            ) : (
              <span className="text-ink-subtle">Not on sale</span>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
