"use client";

import { useCallback, useRef, useState } from "react";
import { ApiError } from "@/lib/api-client";
import { postCheckIn } from "@/lib/api/gatekeeper";
import type { CheckInResponse } from "@/lib/types/gatekeeper";
import { CheckInResultBanner } from "@/components/staff/CheckInResultBanner";
import { QrCameraScanner } from "@/components/staff/QrCameraScanner";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";

type ScanPhase = "idle" | "scanning" | "held";

type StaffCheckInPanelProps = {
  eventTitle?: string;
  gateId?: string;
};

export function StaffCheckInPanel({
  eventTitle,
  gateId: defaultGateId,
}: StaffCheckInPanelProps) {
  const [token, setToken] = useState("");
  const [lastToken, setLastToken] = useState("");
  const [gateId, setGateId] = useState(defaultGateId ?? "");
  const [result, setResult] = useState<CheckInResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [phase, setPhase] = useState<ScanPhase>("idle");
  const scanLockedRef = useRef(false);

  const held = phase === "held";
  const scanning = phase === "scanning";

  const submitToken = useCallback(
    async (qrToken: string, forceAdmitAll = false) => {
      if (scanLockedRef.current || (held && !forceAdmitAll)) {
        return;
      }
      const trimmed = qrToken.trim();
      if (trimmed.length < 8) {
        setError("Token too short.");
        return;
      }
      scanLockedRef.current = true;
      setLastToken(trimmed);
      setError(null);
      if (forceAdmitAll) {
        setActionLoading(true);
      } else {
        setLoading(true);
      }
      try {
        const response = await postCheckIn({
          qrToken: trimmed,
          gateId: gateId.trim() || undefined,
          admitAll: forceAdmitAll,
        });
        setResult(response);
        setPhase("held");
        if (response.result === "success") {
          setToken("");
        }
      } catch (err) {
        setResult({
          result: "invalid",
          message:
            err instanceof ApiError ? err.message : "Check-in could not be completed.",
        });
        setPhase("held");
      } finally {
        setLoading(false);
        setActionLoading(false);
        scanLockedRef.current = false;
      }
    },
    [gateId, held],
  );

  const handleScanAtOnce = useCallback(() => {
    if (lastToken) {
      void submitToken(lastToken, true);
    }
  }, [lastToken, submitToken]);

  function onManualSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (held) {
      return;
    }
    void submitToken(token);
  }

  function startScan() {
    setResult(null);
    setError(null);
    scanLockedRef.current = false;
    setPhase("scanning");
  }

  function checkNextGuest() {
    setResult(null);
    setError(null);
    setToken("");
    setLastToken("");
    scanLockedRef.current = false;
    setPhase("idle");
  }

  function onCameraScan(text: string) {
    if (scanLockedRef.current || loading) {
      return;
    }
    setToken(text);
    void submitToken(text);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold tracking-tight">
          Scan tickets
        </h1>
        {eventTitle ? (
          <p className="mt-2 text-ink-muted">{eventTitle}</p>
        ) : (
          <p className="mt-2 text-ink-muted">
            Start scanning when a guest is ready at the gate.
          </p>
        )}
      </div>

      <Card title="Camera check-in">
        <div className="space-y-4">
          {held ? (
            <CheckInResultBanner
              response={result}
              onScanAtOnce={handleScanAtOnce}
              isScanningAtOnce={actionLoading}
            />
          ) : scanning ? (
            <>
              <p className="text-sm text-ink-muted">
                Point the camera at the guest&apos;s QR code. Scanning stops after
                one read.
              </p>
              <QrCameraScanner active={!loading && scanning} onScan={onCameraScan} />
              {loading ? (
                <p className="text-center text-sm text-ink-muted">Verifying ticket…</p>
              ) : null}
            </>
          ) : (
            <p className="text-sm text-ink-muted">
              Press start when the guest is ready. You will see success or failure
              before scanning the next person.
            </p>
          )}

          <div className="flex flex-col gap-2 sm:flex-row">
            {held ? (
              <Button
                type="button"
                className="min-h-12 flex-1 text-base"
                onClick={checkNextGuest}
              >
                Check next guest
              </Button>
            ) : scanning ? (
              <Button
                type="button"
                variant="secondary"
                className="min-h-12 flex-1"
                onClick={() => setPhase("idle")}
                disabled={loading}
              >
                Cancel scan
              </Button>
            ) : (
              <Button
                type="button"
                className="min-h-12 flex-1 text-base"
                onClick={startScan}
              >
                Start scan
              </Button>
            )}
          </div>
        </div>
      </Card>

      {!held ? (
        <Card title="Manual entry">
          <form className="space-y-4" onSubmit={onManualSubmit}>
            {!defaultGateId ? (
              <Input
                label="Gate ID (optional)"
                name="gateId"
                value={gateId}
                onChange={(e) => setGateId(e.target.value)}
                hint="Must match your assignment if set by admin."
                disabled={scanning && loading}
              />
            ) : null}
            <Input
              label="QR token"
              name="qrToken"
              autoComplete="off"
              required
              minLength={8}
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="font-mono text-base"
              disabled={scanning && loading}
            />
            {error ? (
              <p className="text-sm text-danger" role="alert">
                {error}
              </p>
            ) : null}
            <Button
              type="submit"
              className="min-h-12 w-full text-base"
              loading={loading}
              disabled={scanning && !token.trim()}
            >
              Check in
            </Button>
          </form>
        </Card>
      ) : null}

    </div>
  );
}
