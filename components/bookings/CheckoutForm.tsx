"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { ApiError } from "@/lib/api-client";
import { createBooking, quoteBooking } from "@/lib/api/bookings";
import { formatMinor } from "@/lib/format/currency";
import type { PackageAvailability, PublicEvent } from "@/lib/types/event";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

type CheckoutFormProps = {
  event: PublicEvent;
  packages: PackageAvailability[];
};

export function CheckoutForm({ event, packages }: CheckoutFormProps) {
  const router = useRouter();
  const onSale = packages.filter((p) => p.onSale);

  const [quantities, setQuantities] = useState<Record<string, number>>(() =>
    Object.fromEntries(onSale.map((p) => [p.id, 0])),
  );
  const [quoteTotal, setQuoteTotal] = useState<number | null>(null);
  const [quoteLines, setQuoteLines] = useState<
    Array<{ packageName: string; quantity: number; lineTotalMinor: number }>
  >([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<"quote" | "book" | null>(null);

  const items = useMemo(
    () =>
      Object.entries(quantities)
        .filter(([, qty]) => qty > 0)
        .map(([packageId, quantity]) => ({ packageId, quantity })),
    [quantities],
  );

  function setQty(packageId: string, value: number, max: number) {
    const next = Math.max(0, Math.min(max, value));
    setQuantities((prev) => ({ ...prev, [packageId]: next }));
    setQuoteTotal(null);
    setQuoteLines([]);
  }

  async function onQuote() {
    if (items.length === 0) {
      setError("Choose at least one ticket.");
      return;
    }
    setError(null);
    setLoading("quote");
    try {
      const { quote } = await quoteBooking({ eventId: event.id, items });
      setQuoteTotal(quote.totalMinor);
      setQuoteLines(
        quote.items.map((i) => ({
          packageName: i.packageName,
          quantity: i.quantity,
          lineTotalMinor: i.lineTotalMinor,
        })),
      );
    } catch (err) {
      setQuoteTotal(null);
      setQuoteLines([]);
      setError(err instanceof ApiError ? err.message : "Quote failed.");
    } finally {
      setLoading(null);
    }
  }

  async function onBook() {
    if (quoteTotal === null) {
      await onQuote();
      return;
    }
    setError(null);
    setLoading("book");
    try {
      const { booking } = await createBooking({ eventId: event.id, items });
      router.push(`/bookings/${booking.id}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Booking failed.");
      setQuoteTotal(null);
    } finally {
      setLoading(null);
    }
  }

  if (onSale.length === 0) {
    return (
      <Card title="Tickets">
        <p className="text-sm text-ink-muted">
          This event has no packages on sale right now.
        </p>
      </Card>
    );
  }

  const limit = event.perUserTicketLimit;

  return (
    <Card title="Choose tickets" subtitle={`Up to ${limit} tickets per person`}>
      <div className="space-y-4">
        {onSale.map((pkg) => {
          const max = Math.min(pkg.quantityRemaining, limit);
          const qty = quantities[pkg.id] ?? 0;
          return (
            <div
              key={pkg.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border px-4 py-3"
            >
              <div>
                <p className="font-semibold">{pkg.name}</p>
                <p className="text-sm text-ink-muted">
                  {formatMinor(pkg.priceMinor)} · {pkg.quantityRemaining}{" "}
                  available
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  className="min-h-9 px-3"
                  disabled={qty <= 0}
                  onClick={() => setQty(pkg.id, qty - 1, max)}
                >
                  −
                </Button>
                <span className="w-8 text-center font-semibold">{qty}</span>
                <Button
                  type="button"
                  variant="secondary"
                  className="min-h-9 px-3"
                  disabled={qty >= max}
                  onClick={() => setQty(pkg.id, qty + 1, max)}
                >
                  +
                </Button>
              </div>
            </div>
          );
        })}

        {quoteLines.length > 0 ? (
          <div className="rounded-xl bg-surface-muted p-4 text-sm">
            {quoteLines.map((line) => (
              <div
                key={line.packageName}
                className="flex justify-between py-1 text-ink-muted"
              >
                <span>
                  {line.packageName} × {line.quantity}
                </span>
                <span>{formatMinor(line.lineTotalMinor)}</span>
              </div>
            ))}
            <div className="mt-2 flex justify-between border-t border-border pt-2 font-semibold text-ink">
              <span>Total</span>
              <span>{formatMinor(quoteTotal ?? 0)}</span>
            </div>
          </div>
        ) : null}

        {error ? (
          <p className="text-sm text-danger" role="alert">
            {error}
          </p>
        ) : null}

        <div className="flex flex-wrap gap-3">
          <Button
            type="button"
            variant="secondary"
            loading={loading === "quote"}
            onClick={onQuote}
          >
            Refresh quote
          </Button>
          <Button
            type="button"
            loading={loading === "book"}
            onClick={onBook}
            disabled={items.length === 0}
          >
            Confirm booking
          </Button>
        </div>
      </div>
    </Card>
  );
}
