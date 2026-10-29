"use client";

import { motion, useReducedMotion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faQrcode,
  faTicket,
  faWaveSquare,
} from "@fortawesome/free-solid-svg-icons";
import { SectionHeading } from "@/components/marketing/SectionHeading";

const steps = [
  {
    icon: faMagnifyingGlass,
    title: "Discover",
    body: "Search by city, date, or category. Inventory updates in real time so you never checkout on a sold-out tier.",
  },
  {
    icon: faTicket,
    title: "Book securely",
    body: "Pick a package, pay once, and get QR tickets in your account — ready to share or add to your wallet.",
  },
  {
    icon: faQrcode,
    title: "Check in fast",
    body: "Gatekeepers scan at the door. Organizers see live check-in counts on the admin dashboard.",
  },
  {
    icon: faWaveSquare,
    title: "Talk to Pulse",
    body: "Use the ElevenLabs voice widget to ask about events, dates, and bookings in natural conversation.",
  },
] as const;

export function HomeHowItWorks() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="border-b border-border/80 bg-bg-milk py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          eyebrow="How it works"
          title="From browse to door in minutes"
          description="EventPulse ties together public discovery, attendee bookings, organizer tools, and gate check-in."
          align="center"
        />
        <ol className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <motion.li
              key={step.title}
              className="relative rounded-[1.75rem] border border-border/80 bg-surface p-6 shadow-soft"
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: index * 0.06, duration: 0.45 }}
            >
              <span className="absolute -top-3 left-6 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-on-primary shadow-md">
                {index + 1}
              </span>
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <FontAwesomeIcon icon={step.icon} className="h-5 w-5" />
              </span>
              <h3 className="mt-4 font-display text-xl text-ink">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                {step.body}
              </p>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
