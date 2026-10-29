"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { SectionHeading } from "@/components/marketing/SectionHeading";

const FAQ_ITEMS = [
  {
    q: "Do I need an account to browse events?",
    a: "No — anyone can explore published events and check live availability. You only need a free attendee account when you book tickets.",
  },
  {
    q: "How do QR tickets work?",
    a: "After checkout, each ticket gets a unique code. Show it on your phone at the gate; gatekeepers scan it once. Re-scan attempts show as already used so entry stays secure.",
  },
  {
    q: "Can organizers sell multiple ticket types?",
    a: "Yes. Admins create events, add packages (early bird, VIP, etc.), and publish when ready. Inventory and sold-out status sync across the site and admin reports.",
  },
  {
    q: "Who can use the gatekeeper portal?",
    a: "Only staff accounts created by an organizer. Sign in at /gatekeeper, open the scanner, and check in guests for assigned events and gates.",
  },
  {
    q: "How does the voice assistant work?",
    a: "EventPulse uses ElevenLabs Conversational AI. Open the floating “Talk to Pulse” widget on any page to start a voice or chat session with our hosted agent.",
  },
  {
    q: "Is my payment information stored on EventPulse?",
    a: "This MVP focuses on ticketing flow and check-in. Payment integration depends on your deployment; booking records and ticket status are always stored securely on the platform backend.",
  },
  {
    q: "How do I contact support?",
    a: "Visit the Contact page for email and links to the right portal — attendee, admin, or gatekeeper — so you reach the team quickly.",
  },
] as const;

function FaqItem({
  question,
  answer,
  open,
  onToggle,
  onHoverOpen,
  onHoverClose,
}: {
  question: string;
  answer: string;
  open: boolean;
  onToggle: () => void;
  onHoverOpen: () => void;
  onHoverClose: () => void;
}) {
  const reduceMotion = useReducedMotion();
  const panelId = question.replace(/\s+/g, "-").slice(0, 40);

  return (
    <div
      className={[
        "rounded-2xl border border-transparent px-2 transition-colors duration-200",
        open ? "border-border/80 bg-surface shadow-soft" : "hover:bg-surface/80",
      ].join(" ")}
      onMouseEnter={onHoverOpen}
      onMouseLeave={onHoverClose}
    >
      <button
        type="button"
        className="flex w-full items-start justify-between gap-4 px-3 py-5 text-left"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={`faq-${panelId}`}
      >
        <span className="font-semibold text-ink">{question}</span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.22 }}
          className="mt-1 shrink-0 text-primary"
        >
          <FontAwesomeIcon icon={faChevronDown} className="h-4 w-4" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            id={`faq-${panelId}`}
            role="region"
            initial={reduceMotion ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            className="overflow-hidden px-3"
          >
            <p className="pb-5 text-sm leading-relaxed text-ink-muted">{answer}</p>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

export function HomeFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function hoverOpen(index: number) {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
    setOpenIndex(index);
  }

  function hoverClose() {
    closeTimer.current = setTimeout(() => {
      setOpenIndex(null);
    }, 180);
  }

  return (
    <section id="faq" className="scroll-mt-24 bg-surface py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <SectionHeading
              eyebrow="Q&A"
              title="Questions before you go"
              description="Hover a question to reveal the answer, or tap on mobile. Still stuck? We’re one click away."
            />
            <p className="mt-6 text-sm text-ink-muted">
              <Link
                href="/contact"
                className="font-semibold text-ink underline decoration-primary/40 underline-offset-4 hover:text-primary"
              >
                Contact the team →
              </Link>
            </p>
          </div>
          <div className="space-y-1 rounded-[1.75rem] border border-border/80 bg-bg-milk p-3 shadow-soft sm:p-4">
            {FAQ_ITEMS.map((item, index) => (
              <FaqItem
                key={item.q}
                question={item.q}
                answer={item.a}
                open={openIndex === index}
                onToggle={() =>
                  setOpenIndex((prev) => (prev === index ? null : index))
                }
                onHoverOpen={() => hoverOpen(index)}
                onHoverClose={hoverClose}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
