"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarDays,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";
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

function toDateInputValue(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatDisplayDate(dateStr: string): string {
  try {
    const [y, m, d] = dateStr.split("-").map(Number);
    if (!y || !m || !d) return dateStr;
    const date = new Date(y, m - 1, d);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

export function CheckoutForm({ event, packages }: CheckoutFormProps) {
  const router = useRouter();
  const onSale = packages.filter((p) => p.onSale);

  const defaultDateStr = useMemo(() => {
    try {
      const start = new Date(event.startAt);
      if (!isNaN(start.getTime())) {
        return toDateInputValue(start);
      }
    } catch {
      // fallback
    }
    return toDateInputValue(new Date());
  }, [event.startAt]);

  const minDateStr = useMemo(() => {
    try {
      const start = new Date(event.startAt);
      if (!isNaN(start.getTime())) {
        return toDateInputValue(start);
      }
    } catch {
      // fallback
    }
    return toDateInputValue(new Date());
  }, [event.startAt]);

  const maxDateStr = useMemo(() => {
    try {
      const end = new Date(event.endAt);
      if (!isNaN(end.getTime())) {
        return toDateInputValue(end);
      }
    } catch {
      // fallback
    }
    return undefined;
  }, [event.endAt]);

  const availableDates = useMemo(() => {
    try {
      const start = new Date(event.startAt);
      const end = new Date(event.endAt);
      if (isNaN(start.getTime()) || isNaN(end.getTime())) return [];

      const dates: { dateStr: string; label: string; dayName: string }[] = [];
      const cur = new Date(start.getFullYear(), start.getMonth(), start.getDate());
      const last = new Date(end.getFullYear(), end.getMonth(), end.getDate());

      let count = 0;
      while (cur <= last && count < 30) {
        const dateStr = toDateInputValue(cur);
        dates.push({
          dateStr,
          label: cur.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
          dayName: cur.toLocaleDateString("en-US", { weekday: "short" }),
        });
        cur.setDate(cur.getDate() + 1);
        count++;
      }
      return dates;
    } catch {
      return [];
    }
  }, [event.startAt, event.endAt]);

  const [selectedDate, setSelectedDate] = useState<string>(defaultDateStr);
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
      const { quote } = await quoteBooking({
        eventId: event.id,
        items,
        bookingDate: selectedDate || undefined,
      });
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
      const { booking } = await createBooking({
        eventId: event.id,
        items,
        bookingDate: selectedDate || undefined,
      });
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
  const isMultiDay = availableDates.length > 1;

  return (
    <Card title="Book Tickets" subtitle={`Up to ${limit} tickets per person`}>
      <div className="space-y-6">
        {/* Choose Attendance Date Section (Only for multi-day events) */}
        {isMultiDay ? (
          <div className="rounded-2xl border border-border bg-surface-muted/30 p-4 sm:p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <FontAwesomeIcon icon={faCalendarDays} className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-ink">Choose Attendance Date</h3>
                  <p className="text-xs text-ink-muted">Select the date of your visit</p>
                </div>
              </div>
              {selectedDate && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                  <FontAwesomeIcon icon={faCheckCircle} className="h-3 w-3" />
                  {formatDisplayDate(selectedDate)}
                </span>
              )}
            </div>

            {/* Quick Date Selector Pills */}
            <div className="mt-3.5 flex flex-wrap gap-2">
              {availableDates.map((d) => {
                const isSelected = selectedDate === d.dateStr;
                return (
                  <button
                    key={d.dateStr}
                    type="button"
                    onClick={() => setSelectedDate(d.dateStr)}
                    className={`flex flex-col items-center justify-center rounded-xl border px-3.5 py-1.5 text-xs transition ${
                      isSelected
                        ? "border-primary bg-primary text-white font-semibold shadow-sm"
                        : "border-border bg-surface hover:bg-surface-muted text-ink"
                    }`}
                  >
                    <span
                      className={
                        isSelected
                          ? "text-white/80 text-[10px] uppercase font-bold"
                          : "text-ink-muted text-[10px] uppercase font-bold"
                      }
                    >
                      {d.dayName}
                    </span>
                    <span className="text-xs font-medium">{d.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Date Picker Input */}
            <div className="mt-3.5 flex flex-wrap items-center gap-3">
              <label
                htmlFor="attendance-date"
                className="text-xs font-medium text-ink-muted whitespace-nowrap"
              >
                Choose date:
              </label>
              <input
                id="attendance-date"
                type="date"
                value={selectedDate}
                min={minDateStr}
                max={maxDateStr}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="rounded-lg border border-border bg-surface px-3 py-1.5 text-sm font-medium text-ink focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>
        ) : null}

        {/* Packages Selection Section */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-ink">Select Packages</h3>
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
        </div>

        {/* Quote / Summary Details */}
        {quoteLines.length > 0 ? (
          <div className="rounded-xl bg-surface-muted p-4 text-sm">
            {isMultiDay && selectedDate ? (
              <div className="flex justify-between border-b border-border/60 pb-2 mb-2 text-xs text-ink-muted">
                <span>Attendance Date</span>
                <span className="font-semibold text-ink">
                  {formatDisplayDate(selectedDate)}
                </span>
              </div>
            ) : null}
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

