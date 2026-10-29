"use client";

import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faCircleExclamation } from "@fortawesome/free-solid-svg-icons";
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
};

export function CheckInResultBanner({ response }: CheckInResultBannerProps) {
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
          {response.ticket ? (
            <p className="mt-4 text-center font-mono text-base font-semibold text-white">
              {response.ticket.ticketCode}
              {response.ticket.admissionsTotal != null &&
              response.ticket.admissionsUsed != null ? (
                <span className="mt-1 block font-sans text-xs font-normal text-white/80">
                  {response.ticket.admissionsUsed} of {response.ticket.admissionsTotal}{" "}
                  admissions used on this QR
                </span>
              ) : null}
            </p>
          ) : null}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
