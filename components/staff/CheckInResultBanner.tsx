"use client";

import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faCircleExclamation,
  faUsers,
  faBolt,
} from "@fortawesome/free-solid-svg-icons";
import type { CheckInResponse } from "@/lib/types/gatekeeper";

const styles: Record<string, string> = {
  success: "border-success/50 bg-success text-white shadow-lg shadow-success/25",
  already_used: "border-danger/50 bg-danger text-white shadow-lg shadow-danger/20",
  invalid: "border-danger/50 bg-danger text-white shadow-lg shadow-danger/20",
  cancelled: "border-danger/50 bg-danger text-white shadow-lg shadow-danger/20",
  wrong_event: "border-danger/50 bg-danger text-white shadow-lg shadow-danger/20",
  unauthorised: "border-danger/50 bg-danger text-white shadow-lg shadow-danger/20",
};

function headline(result: CheckInResponse["result"]): string {
  if (result === "success") {
    return "Checked in successfully";
  }
  return "Check-in unsuccessful";
}

type CheckInResultBannerProps = {
  response: CheckInResponse | null;
  onScanAtOnce?: () => void;
  isScanningAtOnce?: boolean;
};

export function CheckInResultBanner({
  response,
  onScanAtOnce,
  isScanningAtOnce,
}: CheckInResultBannerProps) {
  const isMultiGuest =
    response?.ticket?.admissionsTotal != null &&
    response.ticket.admissionsTotal > 1;

  return (
    <AnimatePresence mode="wait">
      {response ? (
        <motion.div
          key={response.result + (response.ticket?.ticketCode ?? "") + response.message}
          initial={{ opacity: 0, scale: 0.92, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ type: "spring", stiffness: 380, damping: 28 }}
          className={`rounded-2xl border px-4 py-6 ${styles[response.result] ?? styles.invalid}`}
          role="status"
          aria-live="polite"
        >
          {response.result === "success" ? (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 500 }}
              className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-white/20"
            >
              <FontAwesomeIcon icon={faCheck} className="h-8 w-8" />
            </motion.div>
          ) : (
            <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-white/20">
              <FontAwesomeIcon icon={faCircleExclamation} className="h-8 w-8" />
            </div>
          )}
          <p className="text-center text-xl font-semibold">{headline(response.result)}</p>
          <p className="mt-2 text-center text-sm text-white/90">{response.message}</p>

          {/* Rectangular box for tickets booked for more than 1 guest */}
          {isMultiGuest && response.ticket ? (
            <div className="mx-auto mt-4 max-w-sm rounded-xl border-2 border-white/45 bg-black/30 p-4 shadow-md backdrop-blur-sm">
              <div className="flex items-center justify-between border-b border-white/20 pb-2.5">
                <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-white/90">
                  <FontAwesomeIcon icon={faUsers} className="h-3.5 w-3.5" />
                  Group Ticket
                </span>
                <span className="flex items-center gap-1 rounded border border-white/60 bg-white/20 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-white">
                  <FontAwesomeIcon icon={faBolt} className="h-2.5 w-2.5 text-amber-300" />
                  Scan at once
                </span>
              </div>

              {/* Guest No. in Rectangular Box */}
              <div className="my-3 flex items-center justify-center">
                <div className="w-full rounded-lg border-2 border-white/70 bg-white/20 px-6 py-3 text-center shadow-inner">
                  <span className="block text-xs font-bold uppercase tracking-wider text-white/85">
                    Guest No.
                  </span>
                  <span className="font-mono text-3xl font-black tracking-tight text-white">
                    {response.ticket.admissionsTotal}
                  </span>
                  <span className="mt-0.5 block text-[11px] text-white/75">
                    Total guests on this ticket
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-around border-t border-white/15 pt-2.5 text-xs text-white/90">
                <span>
                  Admitted: <strong className="font-mono text-sm">{response.ticket.admissionsUsed}</strong>
                </span>
                <span>
                  Remaining: <strong className="font-mono text-sm">{response.ticket.admissionsRemaining}</strong>
                </span>
              </div>

              {response.admittedCount && response.admittedCount > 1 ? (
                <div className="mt-3 rounded-lg bg-white/25 py-1.5 text-center text-xs font-semibold text-white shadow-sm">
                  ✓ Scanned at once: All {response.admittedCount} guests admitted
                </div>
              ) : null}

              {/* Scan at once action if guests are still remaining */}
              {onScanAtOnce && (response.ticket.admissionsRemaining ?? 0) > 0 ? (
                <button
                  type="button"
                  onClick={onScanAtOnce}
                  disabled={isScanningAtOnce}
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-white/40 bg-white px-4 py-2.5 text-sm font-bold text-ink shadow-md transition hover:bg-white/95 active:scale-[0.98] disabled:opacity-60"
                >
                  <FontAwesomeIcon icon={faBolt} className="text-amber-500" />
                  {isScanningAtOnce
                    ? "Admitting all remaining..."
                    : `Scan at once (${response.ticket.admissionsRemaining} remaining)`}
                </button>
              ) : null}
            </div>
          ) : null}

          {response.ticket ? (
            <p className="mt-4 text-center font-mono text-base font-semibold text-white">
              {response.ticket.ticketCode}
              {!isMultiGuest &&
              response.ticket.admissionsTotal != null &&
              response.ticket.admissionsUsed != null ? (
                <span className="mt-1 block font-sans text-xs font-normal text-white/80">
                  {response.ticket.admissionsUsed} of {response.ticket.admissionsTotal}{" "}
                  admission used on this QR
                </span>
              ) : null}
            </p>
          ) : null}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
