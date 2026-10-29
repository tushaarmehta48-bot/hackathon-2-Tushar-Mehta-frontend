import Link from "next/link";
import { Button } from "@/components/ui/Button";

export function HomeOrganizerCta() {
  return (
    <section className="relative overflow-hidden border-t border-border/80 bg-ink py-16 text-white md:py-20">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_80%_at_100%_0%,rgba(216,92,65,0.45),transparent_50%)]"
        aria-hidden
      />
      <div className="relative mx-auto max-w-6xl px-6">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <header className="max-w-xl">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-accent-gold">
              Organizers
            </p>
            <h2 className="mt-2 font-display text-3xl font-normal tracking-tight md:text-4xl">
              Run the room with live data
            </h2>
            <p className="mt-3 text-base leading-relaxed text-white/80 md:text-lg">
              Publish events, manage packages, assign gatekeepers, and watch
              check-ins roll in on the admin overview — powered by real-time
              updates.
            </p>
          </header>
          <Link href="/events" className="shrink-0">
            <Button
              type="button"
              variant="secondary"
              className="w-full rounded-full border-white/25 bg-white px-8 text-ink shadow-lg hover:bg-white/95 sm:w-auto"
            >
              Browse public events
            </Button>
          </Link>
        </div>
        <ul className="mt-10 grid gap-4 text-sm text-white/80 sm:grid-cols-3">
          <li className="rounded-2xl border border-white/15 bg-white/5 px-4 py-3 backdrop-blur-sm">
            <strong className="block text-white">Live inventory</strong>
            Sold-out and remaining counts stay accurate for buyers.
          </li>
          <li className="rounded-2xl border border-white/15 bg-white/5 px-4 py-3 backdrop-blur-sm">
            <strong className="block text-white">Gatekeeper tools</strong>
            QR scan flow with clear success and error states.
          </li>
          <li className="rounded-2xl border border-white/15 bg-white/5 px-4 py-3 backdrop-blur-sm">
            <strong className="block text-white">Reports</strong>
            Analytics and check-in history when you need the full picture.
          </li>
        </ul>
      </div>
    </section>
  );
}
