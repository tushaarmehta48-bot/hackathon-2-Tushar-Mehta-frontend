"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ApiError } from "@/lib/api-client";
import { cancelBooking } from "@/lib/api/bookings";
import { Button } from "@/components/ui/Button";

type CancelBookingButtonProps = {
  bookingId: string;
};

export function CancelBookingButton({ bookingId }: CancelBookingButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onCancel() {
    if (!window.confirm("Cancel this booking? Tickets will be invalidated.")) {
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await cancelBooking(bookingId);
      router.refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not cancel.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-2">
      <Button
        type="button"
        variant="secondary"
        loading={loading}
        onClick={onCancel}
      >
        Cancel booking
      </Button>
      {error ? (
        <p className="text-sm text-danger" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
