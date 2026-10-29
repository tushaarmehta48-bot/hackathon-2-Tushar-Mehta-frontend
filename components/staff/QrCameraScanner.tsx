"use client";

import { useEffect, useId, useRef, useState } from "react";

type QrCameraScannerProps = {
  onScan: (text: string) => void;
  active: boolean;
};

export function QrCameraScanner({ onScan, active }: QrCameraScannerProps) {
  const regionId = useId().replace(/:/g, "");
  const scannerRef = useRef<{ stop: () => Promise<void> } | null>(null);
  const onScanRef = useRef(onScan);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    onScanRef.current = onScan;
  }, [onScan]);

  useEffect(() => {
    if (!active) {
      const scanner = scannerRef.current;
      scannerRef.current = null;
      if (scanner) {
        void scanner.stop().catch(() => undefined);
      }
      return;
    }

    let cancelled = false;

    async function start() {
      try {
        const { Html5Qrcode } = await import("html5-qrcode");
        if (cancelled) {
          return;
        }
        setError(null);
        const scanner = new Html5Qrcode(regionId);
        scannerRef.current = scanner;
        await scanner.start(
          { facingMode: "environment" },
          { fps: 8, qrbox: { width: 240, height: 240 } },
          (decoded) => {
            onScanRef.current(decoded.trim());
          },
          () => {
            /* scan miss — ignore */
          },
        );
      } catch {
        setError("Camera unavailable. Use manual entry below.");
      }
    }

    void start();

    return () => {
      cancelled = true;
      const scanner = scannerRef.current;
      scannerRef.current = null;
      if (scanner) {
        void scanner.stop().catch(() => undefined);
      }
    };
  }, [active, regionId]);

  if (!active) {
    return null;
  }

  return (
    <div className="space-y-3">
      <div
        id={regionId}
        className="min-h-[280px] overflow-hidden rounded-2xl border border-border bg-ink"
      />
      {error ? <p className="text-sm text-ink-muted">{error}</p> : null}
    </div>
  );
}
