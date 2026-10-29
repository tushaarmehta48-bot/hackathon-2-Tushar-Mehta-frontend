import type { CreatePackageBody } from "@/lib/api/admin";
import { parseRupeesInput, rupeesToMinor } from "@/lib/format/currency";

export type PackageDraftUi = {
  key: string;
  name: string;
  priceRupees: string;
  quantityTotal: number;
  admissionCount: number;
  description: string;
};

let draftKey = 0;
export function newPackageDraft(
  partial?: Partial<Omit<PackageDraftUi, "key">>,
): PackageDraftUi {
  draftKey += 1;
  return {
    key: `pkg-${draftKey}`,
    name: partial?.name ?? "General admission",
    priceRupees: partial?.priceRupees ?? "500",
    quantityTotal: partial?.quantityTotal ?? 100,
    admissionCount: partial?.admissionCount ?? 1,
    description: partial?.description ?? "",
  };
}

export function draftToCreateBody(draft: PackageDraftUi): CreatePackageBody | null {
  const name = draft.name.trim();
  const rupees = parseRupeesInput(draft.priceRupees);
  if (!name || !Number.isFinite(rupees) || rupees < 0) {
    return null;
  }
  if (draft.quantityTotal < 0 || draft.admissionCount < 1) {
    return null;
  }
  return {
    name,
    priceMinor: rupeesToMinor(rupees),
    quantityTotal: Math.floor(draft.quantityTotal),
    admissionCount: Math.floor(draft.admissionCount),
    description: draft.description.trim() || undefined,
    active: true,
  };
}

export function packageToDraftUi(pkg: {
  name: string;
  priceMinor: number;
  quantityTotal: number;
  admissionCount: number;
  description?: string | null;
}): PackageDraftUi {
  return newPackageDraft({
    name: pkg.name,
    priceRupees: String(pkg.priceMinor / 100),
    quantityTotal: pkg.quantityTotal,
    admissionCount: pkg.admissionCount,
    description: pkg.description ?? "",
  });
}
