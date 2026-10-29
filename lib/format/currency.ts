const defaultCurrency = "INR";

export function formatMinor(amountMinor: number, currency = defaultCurrency): string {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amountMinor / 100);
}

/** Convert rupees (₹) to minor units (paise) for the API. */
export function rupeesToMinor(rupees: number): number {
  if (!Number.isFinite(rupees) || rupees < 0) {
    return 0;
  }
  return Math.round(rupees * 100);
}

export function minorToRupees(minor: number): number {
  return minor / 100;
}

export function parseRupeesInput(value: string): number {
  const cleaned = value.replace(/,/g, "").trim();
  if (!cleaned) return NaN;
  return Number.parseFloat(cleaned);
}
