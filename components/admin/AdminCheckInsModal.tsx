"use client";

import { useEffect, useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTimes,
  faFileExcel,
  faFileCsv,
  faSearch,
  faUserCheck,
  faUser,
  faUserShield,
  faBuilding,
  faSpinner,
  faCheckCircle,
  faTimesCircle,
} from "@fortawesome/free-solid-svg-icons";
import { adminListCheckIns } from "@/lib/api/admin";
import { ApiError } from "@/lib/api-client";
import type { CheckInReportRow } from "@/lib/types/admin";
import {
  exportCheckInsToExcel,
  exportCheckInsToCsv,
} from "@/lib/export/excel-export";
import { Button } from "@/components/ui/Button";

type AdminCheckInsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  eventId?: string;
  eventTitle?: string;
};

export function AdminCheckInsModal({
  isOpen,
  onClose,
  eventId,
  eventTitle,
}: AdminCheckInsModalProps) {
  const [checkIns, setCheckIns] = useState<CheckInReportRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [resultFilter, setResultFilter] = useState<"all" | "success" | "issues">("all");

  useEffect(() => {
    if (!isOpen) return;

    let cancelled = false;
    setLoading(true);
    setError(null);

    void (async () => {
      try {
        const res = await adminListCheckIns({
          eventId: eventId || undefined,
        });
        if (!cancelled) {
          setCheckIns(res.checkIns || []);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof ApiError ? err.message : "Failed to load check-ins.",
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

  const filteredCheckIns = useMemo(() => {
    let list = checkIns;

    if (resultFilter === "success") {
      list = list.filter((c) => c.result === "success");
    } else if (resultFilter === "issues") {
      list = list.filter((c) => c.result !== "success");
    }

    const q = search.trim().toLowerCase();
    if (!q) return list;

    return list.filter(
      (c) =>
        (c.userName && c.userName.toLowerCase().includes(q)) ||
        (c.userEmail && c.userEmail.toLowerCase().includes(q)) ||
        (c.ticketCode && c.ticketCode.toLowerCase().includes(q)) ||
        (c.bookingReference && c.bookingReference.toLowerCase().includes(q)) ||
        (c.gatekeeperName && c.gatekeeperName.toLowerCase().includes(q)) ||
        (c.gateId && c.gateId.toLowerCase().includes(q)) ||
        (c.eventTitle && c.eventTitle.toLowerCase().includes(q)) ||
        c.result.toLowerCase().includes(q),
    );
  }, [checkIns, search, resultFilter]);

  const successCount = useMemo(
    () => checkIns.filter((c) => c.result === "success").length,
    [checkIns],
  );

  const issueCount = useMemo(
    () => checkIns.filter((c) => c.result !== "success").length,
    [checkIns],
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
        second: "2-digit",
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
      aria-labelledby="check-ins-modal-title"
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
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-success/15 text-success shadow-inner">
              <FontAwesomeIcon icon={faUserCheck} className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2
                  id="check-ins-modal-title"
                  className="font-display text-2xl font-bold tracking-tight text-ink"
                >
                  Attendee Check-Ins
                </h2>
                <span className="rounded-md border border-success/30 bg-success/10 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-success">
                  EventPulse
                </span>
              </div>
              <p className="mt-0.5 text-xs text-ink-muted">
                {eventTitle
                  ? `Showing scan history for "${eventTitle}"`
                  : "Showing scan history across all events"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => exportCheckInsToExcel(filteredCheckIns, eventTitle)}
              disabled={loading || filteredCheckIns.length === 0}
              className="gap-2 border-emerald-600/40 text-emerald-700 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-950/40 py-2 px-3 text-xs"
            >
              <FontAwesomeIcon icon={faFileExcel} className="h-4 w-4 text-emerald-600" />
              Download Excel
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => exportCheckInsToCsv(filteredCheckIns, eventTitle)}
              disabled={loading || filteredCheckIns.length === 0}
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

        {/* Summary Bar */}
        <div className="grid grid-cols-2 gap-3 border-b border-border/80 bg-surface px-6 py-4 sm:grid-cols-4">
          <div className="rounded-xl border border-border/70 bg-surface-muted/30 p-3">
            <span className="block text-[11px] font-bold uppercase tracking-wider text-ink-muted">
              Total Scans
            </span>
            <span className="mt-0.5 block font-display text-2xl font-black text-ink">
              {checkIns.length}
            </span>
          </div>

          <div className="rounded-xl border border-border/70 bg-surface-muted/30 p-3">
            <span className="block text-[11px] font-bold uppercase tracking-wider text-ink-muted">
              Successful Entries
            </span>
            <span className="mt-0.5 flex items-center gap-1.5 font-display text-2xl font-black text-emerald-600 dark:text-emerald-400">
              <FontAwesomeIcon icon={faCheckCircle} className="h-4 w-4 opacity-75" />
              {successCount}
            </span>
          </div>

          <div className="rounded-xl border border-border/70 bg-surface-muted/30 p-3">
            <span className="block text-[11px] font-bold uppercase tracking-wider text-ink-muted">
              Failed / Denied
            </span>
            <span className="mt-0.5 flex items-center gap-1.5 font-display text-2xl font-black text-danger">
              <FontAwesomeIcon icon={faTimesCircle} className="h-4 w-4 opacity-75" />
              {issueCount}
            </span>
          </div>

          <div className="rounded-xl border border-border/70 bg-surface-muted/30 p-3">
            <span className="block text-[11px] font-bold uppercase tracking-wider text-ink-muted">
              Status Filter
            </span>
            <div className="mt-1 flex items-center gap-1">
              <button
                type="button"
                onClick={() => setResultFilter("all")}
                className={`rounded px-2 py-0.5 text-xs font-bold transition ${
                  resultFilter === "all"
                    ? "bg-primary text-white"
                    : "bg-surface-muted text-ink-muted hover:text-ink"
                }`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setResultFilter("success")}
                className={`rounded px-2 py-0.5 text-xs font-bold transition ${
                  resultFilter === "success"
                    ? "bg-emerald-600 text-white"
                    : "bg-surface-muted text-ink-muted hover:text-ink"
                }`}
              >
                Success
              </button>
              <button
                type="button"
                onClick={() => setResultFilter("issues")}
                className={`rounded px-2 py-0.5 text-xs font-bold transition ${
                  resultFilter === "issues"
                    ? "bg-danger text-white"
                    : "bg-surface-muted text-ink-muted hover:text-ink"
                }`}
              >
                Issues
              </button>
            </div>
          </div>
        </div>

        {/* Search Input */}
        <div className="border-b border-border/60 bg-surface px-6 py-3">
          <div className="relative">
            <FontAwesomeIcon
              icon={faSearch}
              className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted"
            />
            <input
              type="text"
              placeholder="Search by guest name, ticket code, gatekeeper name, gate ID, event title, or booking reference..."
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
              <p className="mt-3 text-sm font-medium">Loading check-in records…</p>
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
                  adminListCheckIns({
                    eventId: eventId || undefined,
                  })
                    .then((res) => setCheckIns(res.checkIns || []))
                    .catch((err) =>
                      setError(
                        err instanceof ApiError
                          ? err.message
                          : "Failed to load check-ins.",
                      ),
                    )
                    .finally(() => setLoading(false));
                }}
              >
                Try again
              </Button>
            </div>
          ) : filteredCheckIns.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border p-12 text-center text-ink-muted">
              <FontAwesomeIcon icon={faUserCheck} className="h-10 w-10 text-ink-muted/50" />
              <p className="mt-3 font-display text-lg font-bold text-ink">
                No check-in records found
              </p>
              <p className="mt-1 text-sm">
                {search
                  ? "No check-ins match your search filter."
                  : "No check-in attempts have been made yet."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-border shadow-sm">
              <table className="w-full min-w-[880px] text-left text-sm">
                <thead>
                  <tr className="border-b border-border bg-surface-muted/60 text-xs font-bold uppercase tracking-wider text-ink-muted">
                    <th className="py-3.5 pl-4 pr-3">#</th>
                    <th className="py-3.5 px-3">Guest Name</th>
                    <th className="py-3.5 px-3">Ticket / Ref</th>
                    <th className="py-3.5 px-3">Event</th>
                    <th className="py-3.5 px-3">Gatekeeper</th>
                    <th className="py-3.5 px-3">Gate</th>
                    <th className="py-3.5 px-3">Admissions</th>
                    <th className="py-3.5 px-3">Check-in Time</th>
                    <th className="py-3.5 pl-3 pr-4 text-center">Result</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60 bg-surface">
                  {filteredCheckIns.map((c, idx) => {
                    const isSuccess = c.result === "success";
                    const admissionsStr =
                      c.admissionsTotal != null
                        ? `${c.admissionsUsed ?? 1}/${c.admissionsTotal}`
                        : "1/1";

                    return (
                      <tr
                        key={c.id}
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
                                {c.userName || "Guest Attendee"}
                              </p>
                              {c.userEmail ? (
                                <p className="text-xs text-ink-muted">{c.userEmail}</p>
                              ) : null}
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-3">
                          <p className="font-mono text-xs font-bold text-ink">
                            {c.ticketCode || "—"}
                          </p>
                          {c.bookingReference ? (
                            <p className="font-mono text-[11px] text-ink-muted">
                              Ref: {c.bookingReference}
                            </p>
                          ) : null}
                        </td>
                        <td className="py-3.5 px-3">
                          <span className="flex items-center gap-1.5 text-xs font-semibold text-ink line-clamp-1 max-w-[160px]" title={c.eventTitle}>
                            <FontAwesomeIcon icon={faBuilding} className="h-3 w-3 text-ink-muted" />
                            {c.eventTitle || "—"}
                          </span>
                        </td>
                        <td className="py-3.5 px-3">
                          <span className="flex items-center gap-1.5 text-xs text-ink">
                            <FontAwesomeIcon icon={faUserShield} className="h-3 w-3 text-ink-muted" />
                            {c.gatekeeperName || "Gatekeeper"}
                          </span>
                        </td>
                        <td className="py-3.5 px-3">
                          <span className="rounded bg-surface-muted px-2 py-0.5 text-xs font-semibold text-ink-muted">
                            {c.gateId || "Default"}
                          </span>
                        </td>
                        <td className="py-3.5 px-3 font-mono text-xs font-semibold text-ink">
                          {admissionsStr}
                        </td>
                        <td className="py-3.5 px-3 text-xs font-medium text-ink">
                          {formatDate(c.timestamp)}
                        </td>
                        <td className="py-3.5 pl-3 pr-4 text-center">
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider ${
                              isSuccess
                                ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                                : "bg-danger/15 text-danger"
                            }`}
                          >
                            {c.result.replace("_", " ")}
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
            EventPulse official check-in export · Includes guest names, ticket codes, gatekeepers, and exact timestamps.
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
              onClick={() => exportCheckInsToExcel(filteredCheckIns, eventTitle)}
              disabled={loading || filteredCheckIns.length === 0}
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
