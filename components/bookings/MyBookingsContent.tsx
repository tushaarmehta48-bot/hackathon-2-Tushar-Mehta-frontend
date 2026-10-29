import Link from "next/link";
import { ApiError } from "@/lib/api-client";
import { serverApiClient } from "@/lib/api/server-client";
import { formatMinor } from "@/lib/format/currency";
import type { BookingSummary } from "@/lib/types/booking";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export async function MyBookingsContent() {
  let bookings: BookingSummary[] = [];
  let error: string | null = null;

  try {
    const data = await serverApiClient<{ bookings: BookingSummary[] }>(
      "/bookings/me",
    );
    bookings = data.bookings;
  } catch (err) {
    error =
      err instanceof ApiError ? err.message : "Could not load your bookings.";
  }

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-10">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight">
            My bookings
          </h1>
          <p className="mt-2 text-ink-muted">
            References, totals, and QR tickets for check-in.
          </p>
        </div>
        <Link
          href="/events"
          className="text-sm font-semibold text-primary hover:underline"
        >
          Browse events
        </Link>
      </div>

      {error ? (
        <p className="text-sm text-danger" role="alert">
          {error}
        </p>
      ) : null}

      {bookings.length === 0 && !error ? (
        <EmptyState
          illustration="tickets"
          title="No bookings yet"
          description="Your confirmed tickets and QR codes will appear here after you book an event."
          action={
            <Link href="/events">
              <Button type="button">Browse events</Button>
            </Link>
          }
        />
      ) : (
        <ul className="space-y-4">
          {bookings.map((booking) => (
            <li key={booking.id}>
              <Link href={`/bookings/${booking.id}`}>
                <Card className="transition-colors hover:border-primary/40">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-mono text-sm font-semibold text-ink">
                        {booking.reference}
                      </p>
                      <p className="text-sm capitalize text-ink-muted" suppressHydrationWarning>
                        {booking.status} ·{" "}
                        <span suppressHydrationWarning>
                          {new Date(booking.createdAt).toLocaleString()}
                        </span>
                      </p>
                    </div>
                    <p className="font-display text-lg font-semibold text-primary">
                      {formatMinor(booking.totalMinor)}
                    </p>
                  </div>
                </Card>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
