"use client";

import { useEffect, useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTimes,
  faFileExcel,
  faFileCsv,
  faSearch,
  faTicket,
  faUser,
  faWallet,
  faCalendarCheck,
  faCalendarDays,
  faSpinner,
  faBuilding,
} from "@fortawesome/free-solid-svg-icons";
import { adminListBookings } from "@/lib/api/admin";
import { ApiError } from "@/lib/api-client";
import { formatMinor } from "@/lib/format/currency";
import type { AdminBookingReportRow } from "@/lib/types/admin";
import {
  exportBookingsToExcel,
  exportBookingsToCsv,
} from "@/lib/export/excel-export";
import { Button } from "@/components/ui/Button";

type AdminConfirmedBookingsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  eventId?: string;
  eventTitle?: string;
};

export function AdminConfirmedBookingsModal({
  isOpen,
  onClose,
  eventId,
  eventTitle,
}: AdminConfirmedBookingsModalProps) {
  const [bookings, setBookings] = useState<AdminBookingReportRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!isOpen) return;

    let cancelled = false;
    setLoading(true);
    setError(null);

    void (async () => {
      try {
        const res = await adminListBookings({
          eventId: eventId || undefined,
          status: "confirmed",
        });
        if (!cancelled) {
          setBookings(res.bookings || []);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof ApiError ? err.message : "Failed to load confirmed bookings.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isOpen, eventId]);

  // ESC key listener to close modal
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const filteredBookings = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return bookings;
    return bookings.filter(
      (b) =>
        b.userName.toLowerCase().includes(q) ||
        b.userEmail.toLowerCase().includes(q) ||
        b.reference.toLowerCase().includes(q) ||
        b.eventTitle.toLowerCase().includes(q) ||
        (b.items || []).some((i) => i.packageName.toLowerCase().includes(q)),
    );
  }, [bookings, search]);

  const totalTickets = useMemo(
    () => filteredBookings.reduce((sum, b) => sum + (b.ticketsCount || 1), 0),
    [filteredBookings],
  );

  const totalRevenueMinor = useMemo(
    () => filteredBookings.reduce((sum, b) => sum + (b.totalMinor || 0), 0),
    [filteredBookings],
  );

  function formatDate(iso: string) {
    try {
      const d = new Date(iso);
      return d.toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    } catch {
      return iso;
    }
  }

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirmed-bookings-modal-title"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative z-10 flex max-h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-3xl border border-border bg-surface shadow-2xl">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border bg-surface-muted/40 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-inner">
              <FontAwesomeIcon icon={faCalendarCheck} className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2
                  id="confirmed-bookings-modal-title"
                  className="font-display text-2xl font-bold tracking-tight text-ink"
                >
                  Confirmed Bookings
                </h2>
                <span className="rounded-md border border-primary/30 bg-primary/10 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-primary">
                  EventPulse
                </span>
              </div>
              <p className="mt-0.5 text-xs text-ink-muted">
                {eventTitle
                  ? `Showing bookings for "${eventTitle}"`
                  : "Showing confirmed bookings across all events"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => exportBookingsToExcel(filteredBookings, eventTitle)}
              disabled={loading || filteredBookings.length === 0}
              className="gap-2 border-emerald-600/40 text-emerald-700 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-950/40 py-2 px-3 text-xs"
            >
              <FontAwesomeIcon icon={faFileExcel} className="h-4 w-4 text-emerald-600" />
              Download Excel
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => exportBookingsToCsv(filteredBookings, eventTitle)}
              disabled={loading || filteredBookings.length === 0}
              className="gap-2 py-2 px-3 text-xs"
            >
              <FontAwesomeIcon icon={faFileCsv} className="h-4 w-4 text-ink-muted" />
              Download CSV
            </Button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close modal"
              className="ml-2 flex h-10 w-10 items-center justify-center rounded-full text-ink-muted transition hover:bg-surface-muted hover:text-ink active:scale-95"
            >
              <FontAwesomeIcon icon={faTimes} className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Top Summary Bar */}
        <div className="grid grid-cols-2 gap-3 border-b border-border/80 bg-surface px-6 py-4 sm:grid-cols-4">
          <div className="rounded-xl border border-border/70 bg-surface-muted/30 p-3">
            <span className="block text-[11px] font-bold uppercase tracking-wider text-ink-muted">
              Total Bookings
            </span>
            <span className="mt-0.5 block font-display text-2xl font-black text-ink">
              {filteredBookings.length}
            </span>
          </div>

          <div className="rounded-xl border border-border/70 bg-surface-muted/30 p-3">
            <span className="block text-[11px] font-bold uppercase tracking-wider text-ink-muted">
              Tickets Booked
            </span>
            <span className="mt-0.5 flex items-center gap-1.5 font-display text-2xl font-black text-primary">
              <FontAwesomeIcon icon={faTicket} className="h-4 w-4 opacity-75" />
              {totalTickets}
            </span>
          </div>

          <div className="rounded-xl border border-border/70 bg-surface-muted/30 p-3">
            <span className="block text-[11px] font-bold uppercase tracking-wider text-ink-muted">
              Total Revenue
            </span>
            <span className="mt-0.5 flex items-center gap-1.5 font-display text-2xl font-black text-emerald-600 dark:text-emerald-400">
              <FontAwesomeIcon icon={faWallet} className="h-4 w-4 opacity-75" />
              {formatMinor(totalRevenueMinor)}
            </span>
          </div>

          <div className="rounded-xl border border-border/70 bg-surface-muted/30 p-3">
            <span className="block text-[11px] font-bold uppercase tracking-wider text-ink-muted">
              Status Filter
            </span>
            <span className="mt-1 inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
              ✓ Confirmed Only
            </span>
          </div>
        </div>

        {/* Search Filter */}
        <div className="border-b border-border/60 bg-surface px-6 py-3">
          <div className="relative">
            <FontAwesomeIcon
              icon={faSearch}
              className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted"
            />
            <input
              type="text"
              placeholder="Search by customer name, email, booking reference, or event title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-border bg-bg-milk/60 py-2.5 pl-10 pr-4 text-sm text-ink placeholder:text-ink-muted/70 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition"
            />
          </div>
        </div>

        {/* Table Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-ink-muted">
              <FontAwesomeIcon icon={faSpinner} spin className="h-8 w-8 text-primary" />
              <p className="mt-3 text-sm font-medium">Loading confirmed bookings…</p>
            </div>
          ) : error ? (
            <div className="rounded-2xl border border-danger/30 bg-danger/10 p-6 text-center text-danger">
              <p className="font-semibold">{error}</p>
              <Button
                type="button"
                variant="secondary"
                className="mt-3 py-1.5 px-3 text-xs"
                onClick={() => {
                  setLoading(true);
                  setError(null);
                  adminListBookings({
                    eventId: eventId || undefined,
                    status: "confirmed",
                  })
                    .then((res) => setBookings(res.bookings || []))
                    .catch((err) =>
                      setError(
                        err instanceof ApiError
                          ? err.message
                          : "Failed to load confirmed bookings.",
                      ),
                    )
                    .finally(() => setLoading(false));
                }}
              >
                Try again
              </Button>
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border p-12 text-center text-ink-muted">
              <FontAwesomeIcon icon={faCalendarCheck} className="h-10 w-10 text-ink-muted/50" />
              <p className="mt-3 font-display text-lg font-bold text-ink">
                No confirmed bookings found
              </p>
              <p className="mt-1 text-sm">
                {search
                  ? "No bookings match your search query."
                  : "No confirmed bookings have been recorded yet."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-border shadow-sm">
              <table className="w-full min-w-[840px] text-left text-sm">
                <thead>
                  <tr className="border-b border-border bg-surface-muted/60 text-xs font-bold uppercase tracking-wider text-ink-muted">
                    <th className="py-3.5 pl-4 pr-3">#</th>
                    <th className="py-3.5 px-3">Customer Name</th>
                    <th className="py-3.5 px-3">Tickets (Qty)</th>
                    <th className="py-3.5 px-3">Price Paid</th>
                    <th className="py-3.5 px-3">Attendance Date</th>
                    <th className="py-3.5 px-3">Booked At</th>
                    <th className="py-3.5 px-3">Event</th>
                    <th className="py-3.5 px-3">Reference</th>
                    <th className="py-3.5 pl-3 pr-4 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60 bg-surface">
                  {filteredBookings.map((b, idx) => {
                    const packageNames = (b.items || [])
                      .map((i) => `${i.packageName} (x${i.quantity})`)
                      .join(", ");

                    return (
                      <tr
                        key={b.id}
                        className="transition hover:bg-surface-muted/30"
                      >
                        <td className="py-3.5 pl-4 pr-3 font-mono text-xs text-ink-muted">
                          {idx + 1}
                        </td>
                        <td className="py-3.5 px-3">
                          <div className="flex items-center gap-2.5">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                              <FontAwesomeIcon icon={faUser} className="h-3.5 w-3.5" />
                            </div>
                            <div>
                              <p className="font-semibold text-ink leading-tight">
                                {b.userName}
                              </p>
                              <p className="text-xs text-ink-muted">{b.userEmail}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-3">
                          <span className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface-muted/50 px-2.5 py-1 font-semibold text-ink">
                            <FontAwesomeIcon icon={faTicket} className="h-3 w-3 text-primary" />
                            {b.ticketsCount} ticket{b.ticketsCount === 1 ? "" : "s"}
                          </span>
                          {packageNames ? (
                            <p className="mt-1 text-[11px] text-ink-muted line-clamp-1 max-w-[200px]" title={packageNames}>
                              {packageNames}
                            </p>
                          ) : null}
                        </td>
                        <td className="py-3.5 px-3">
                          <span className="font-mono text-base font-bold text-emerald-600 dark:text-emerald-400">
                            {formatMinor(b.totalMinor)}
                          </span>
                        </td>
                        <td className="py-3.5 px-3">
                          {b.bookingDate ? (
                            <span className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                              <FontAwesomeIcon icon={faCalendarDays} className="h-2.5 w-2.5" />
                              {b.bookingDate}
                            </span>
                          ) : (
                            <span className="text-xs text-ink-muted">Event Date</span>
                          )}
                        </td>
                        <td className="py-3.5 px-3">
                          <span className="text-xs font-medium text-ink">
                            {formatDate(b.createdAt)}
                          </span>
                        </td>
                        <td className="py-3.5 px-3">
                          <span className="flex items-center gap-1.5 text-xs font-semibold text-ink line-clamp-1 max-w-[180px]" title={b.eventTitle}>
                            <FontAwesomeIcon icon={faBuilding} className="h-3 w-3 text-ink-muted" />
                            {b.eventTitle}
                          </span>
                        </td>
                        <td className="py-3.5 px-3">
                          <span className="font-mono text-xs font-bold tracking-wider text-ink-subtle bg-surface-muted px-2 py-0.5 rounded border border-border">
                            {b.reference}
                          </span>
                        </td>
                        <td className="py-3.5 pl-3 pr-4 text-center">
                          <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                            Confirmed
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border bg-surface-muted/30 px-6 py-4">
          <p className="text-xs text-ink-muted">
            EventPulse official export · Includes full customer names, ticket counts, price, and timestamps.
          </p>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              className="min-w-24"
            >
              Close
            </Button>
            <Button
              type="button"
              onClick={() => exportBookingsToExcel(filteredBookings, eventTitle)}
              disabled={loading || filteredBookings.length === 0}
              className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              <FontAwesomeIcon icon={faFileExcel} className="h-4 w-4" />
              Export to Excel (.xls)
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
