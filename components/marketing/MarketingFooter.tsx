"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faInstagram,
  faLinkedin,
  faXTwitter,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";
import { EventPulseLogo } from "@/components/brand/EventPulseLogo";

const SOCIAL = [
  {
    href: "https://instagram.com",
    label: "Instagram",
    icon: faInstagram,
  },
  {
    href: "https://facebook.com",
    label: "Facebook",
    icon: faFacebook,
  },
  {
    href: "https://x.com",
    label: "X (Twitter)",
    icon: faXTwitter,
  },
  {
    href: "https://linkedin.com",
    label: "LinkedIn",
    icon: faLinkedin,
  },
  {
    href: "https://youtube.com",
    label: "YouTube",
    icon: faYoutube,
  },
] as const;

export function MarketingFooter() {
  const reduceMotion = useReducedMotion();

  return (
    <footer className="mt-auto border-t border-border bg-surface text-ink">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <EventPulseLogo variant="footer" href="/" />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink-muted">
              EventPulse connects discovery, secure QR ticketing, organizer
              dashboards, and gate check-in — so every night runs in sync.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {SOCIAL.map((item) => (
                <motion.a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={item.label}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-bg-milk text-ink transition-colors hover:border-primary/40 hover:bg-primary/10 hover:text-primary"
                  whileHover={reduceMotion ? undefined : { y: -2, scale: 1.05 }}
                  whileTap={reduceMotion ? undefined : { scale: 0.96 }}
                >
                  <FontAwesomeIcon icon={item.icon} className="h-4 w-4" />
                </motion.a>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2">
            <p className="text-sm font-bold text-ink">Explore</p>
            <ul className="mt-4 space-y-2.5 text-sm text-ink-muted">
              <li>
                <Link href="/events" className="hover:text-primary">
                  All events
                </Link>
              </li>
              <li>
                <Link href="/#faq" className="hover:text-primary">
                  Q&amp;A
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-primary">
                  About us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-primary">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <p className="text-sm font-bold text-ink">Accounts</p>
            <ul className="mt-4 space-y-2.5 text-sm text-ink-muted">
              <li>
                <Link href="/login" className="hover:text-primary">
                  Attendee sign in
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-primary">
                  Organizer portal
                </Link>
              </li>
              <li>
                <Link href="/gatekeeper" className="hover:text-primary">
                  Gatekeeper portal
                </Link>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-4">
            <p className="text-sm font-bold text-ink">Stay in the loop</p>
            <p className="mt-3 text-sm leading-relaxed text-ink-muted">
              Get early access to featured drops, festival guides, and product
              updates. No spam — unsubscribe anytime.
            </p>
            <form
              className="mt-4 flex flex-col gap-2 sm:flex-row"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="email"
                placeholder="you@email.com"
                aria-label="Email for updates"
                className="min-h-11 flex-1 rounded-xl border border-border bg-bg-milk px-4 text-sm text-ink outline-none ring-primary/30 focus:ring-2"
              />
              <button
                type="submit"
                className="btn-primary-gradient min-h-11 rounded-xl px-5 text-sm font-semibold text-on-primary shadow-md"
              >
                Subscribe
              </button>
            </form>
            <p className="mt-4 text-xs text-ink-subtle">
              By subscribing you agree to receive EventPulse updates. See{" "}
              <Link href="/contact" className="underline hover:text-primary">
                Contact
              </Link>{" "}
              for privacy questions.
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-border/80 bg-bg-milk/80">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 py-5 text-xs text-ink-subtle sm:flex-row">
          <p>© EventPulse · Your ticketing platform</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/contact" className="hover:text-ink">
              Privacy
            </Link>
            <Link href="/contact" className="hover:text-ink">
              Terms
            </Link>
            <Link href="/contact" className="hover:text-ink">
              Support
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
