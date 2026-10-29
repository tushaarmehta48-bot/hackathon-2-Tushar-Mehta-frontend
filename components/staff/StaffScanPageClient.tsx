"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { StaffCheckInPanel } from "@/components/staff/StaffCheckInPanel";

function StaffScanInner() {
  const searchParams = useSearchParams();
  const title = searchParams.get("title") ?? undefined;
  const gateId = searchParams.get("gateId") ?? undefined;

  return <StaffCheckInPanel eventTitle={title} gateId={gateId} />;
}

export function StaffScanPageClient() {
  return (
    <Suspense
      fallback={
        <p className="text-sm text-ink-muted">Loading scan tools…</p>
      }
    >
      <StaffScanInner />
    </Suspense>
  );
}
