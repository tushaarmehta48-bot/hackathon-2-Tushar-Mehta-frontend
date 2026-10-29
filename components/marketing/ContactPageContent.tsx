"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClock,
  faEnvelope,
  faHandshake,
  faHeadset,
  faLocationDot,
  faBullhorn,
  faTicket,
} from "@fortawesome/free-solid-svg-icons";
import { SectionHeading } from "@/components/marketing/SectionHeading";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { MARKETING_IMAGES } from "@/lib/constants/marketing-images";
import {
  isContactEmailConfigured,
  sendContactEmail,
} from "@/lib/emailjs/contact";

const channels = [
  {
    icon: faTicket,
    title: "Organizer onboarding",
    email: "organizers@eventpulse.app",
    blurb:
      "First event or migrating from spreadsheets? We will walk through listings, packages, and gate staffing with you.",
  },
  {
    icon: faHeadset,
    title: "Guest support",
    email: "help@eventpulse.app",
    blurb:
      "Questions about a booking, refund policy, or ticket in your wallet — our support team replies with clear next steps.",
  },
  {
    icon: faHandshake,
    title: "Partnerships",
    email: "partners@eventpulse.app",
    blurb:
      "Venues, promoters, and city programs exploring co-branded discovery or seasonal calendars.",
  },
  {
    icon: faBullhorn,
    title: "Press & media",
    email: "press@eventpulse.app",
    blurb:
      "Interview requests, brand assets, and stories about the people behind the events we power.",
  },
] as const;

const hours = [
  { day: "Monday – Friday", time: "9:00 – 18:00 IST" },
  { day: "Saturday", time: "10:00 – 14:00 IST" },
  { day: "Sunday & show nights", time: "Email — we monitor urgent door issues" },
] as const;

export function ContactPageContent() {
  const reduceMotion = useReducedMotion();
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const fade = (delay = 0) =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 16 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, margin: "-40px" },
          transition: { duration: 0.45, delay },
        };

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitError(null);

    if (!isContactEmailConfigured()) {
      setSubmitError(
        "Contact form is not configured yet. Email hello@eventpulse.app directly.",
      );
      return;
    }

    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const topic = String(data.get("topic") ?? "general");
    const message = String(data.get("message") ?? "").trim();

    setSending(true);
    try {
      await sendContactEmail({ name, email, topic, message });
      setSubmitted(true);
      form.reset();
    } catch (err) {
      const detail = err instanceof Error ? err.message : "";
      const looksLikeConfig =
        /template|service|invalid|public key|not found|401|403/i.test(detail);
      setSubmitError(
        looksLikeConfig
          ? `Email could not be sent (${detail}). Check EmailJS service ID, template ID, and public key in .env.local — template ID must not be the placeholder template_xxxxx.`
          : detail
            ? `We could not send your message: ${detail}`
            : "We could not send your message. Please try again or email hello@eventpulse.app.",
      );
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      <section className="border-b border-border/80 bg-bg-milk py-14 md:py-20">
        <div className="mx-auto max-w-6xl px-6">
          <SectionHeading
            eyebrow="Contact"
            title="We are real humans who love live events"
            description="Tell us what you are planning, what went wrong, or what you wish existed — we read every message and answer with context, not copy-paste scripts."
            align="center"
          />
        </div>
      </section>

      <section className="border-b border-border/80 bg-surface py-16 md:py-20">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <motion.div
            className="overflow-hidden rounded-[1.75rem] border border-border/80 bg-surface shadow-soft"
            {...fade()}
          >
            <div className="relative aspect-[21/9] overflow-hidden sm:aspect-[2.4/1]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={MARKETING_IMAGES.contactStudio}
                alt="Team collaborating in a bright studio"
                className="h-full w-full object-cover"
                loading="eager"
                decoding="async"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/50 to-transparent" />
              <p className="absolute bottom-4 left-5 right-5 text-sm font-medium text-white/90">
                Based in India · Supporting events across time zones
              </p>
            </div>

            {submitted ? (
              <div className="p-8 md:p-10">
                <p className="font-display text-2xl text-ink">Message received</p>
                <p className="mt-3 text-sm leading-relaxed text-ink-muted md:text-base">
                  Thanks for reaching out. A member of the EventPulse team will
                  reply within one business day — often sooner for urgent show
                  questions.
                </p>
                <Button
                  type="button"
                  variant="secondary"
                  className="mt-6 rounded-full"
                  onClick={() => setSubmitted(false)}
                >
                  Send another message
                </Button>
              </div>
            ) : (
              <form
                className="space-y-5 p-8 md:p-10"
                onSubmit={onSubmit}
              >
                <p className="font-display text-xl text-ink">Send a message</p>
                <p className="text-sm text-ink-muted">
                  This form is for general inquiries. For account access, use the
                  sign-in links below — we cannot reset passwords from this page.
                </p>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Input name="name" label="Your name" required autoComplete="name" />
                  <Input
                    name="email"
                    type="email"
                    label="Email"
                    required
                    autoComplete="email"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="contact-topic" className="text-sm font-medium text-ink-muted">
                    Topic
                  </label>
                  <select
                    id="contact-topic"
                    name="topic"
                    className="min-h-11 rounded-xl border border-border bg-surface-muted px-3 text-sm text-ink outline-none ring-primary/30 focus:ring-2"
                    defaultValue="general"
                  >
                    <option value="general">General question</option>
                    <option value="organizer">I want to host an event</option>
                    <option value="booking">Help with a booking</option>
                    <option value="partnership">Partnership / venue</option>
                    <option value="press">Press</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="contact-message" className="text-sm font-medium text-ink-muted">
                    Message
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    required
                    rows={5}
                    placeholder="Share dates, city, expected guest count, or what you need help with…"
                    className="rounded-xl border border-border bg-surface-muted px-3 py-3 text-sm text-ink outline-none ring-primary/30 placeholder:text-ink-subtle focus:ring-2"
                  />
                </div>
                {submitError ? (
                  <p className="text-sm text-danger" role="alert">
                    {submitError}
                  </p>
                ) : null}
                <Button
                  type="submit"
                  className="w-full rounded-full sm:w-auto sm:px-10"
                  loading={sending}
                  disabled={sending}
                >
                  Send message
                </Button>
              </form>
            )}
          </motion.div>

          <div className="space-y-8">
            <motion.div
              className="rounded-[1.75rem] border border-border/80 bg-bg-milk p-7 shadow-soft"
              {...fade(0.08)}
            >
              <p className="flex items-center gap-2 text-sm font-semibold text-ink">
                <FontAwesomeIcon icon={faEnvelope} className="h-4 w-4 text-primary" />
                Prefer email?
              </p>
              <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                For a quick hello, write to{" "}
                <a
                  href="mailto:hello@eventpulse.app"
                  className="font-semibold text-primary hover:underline"
                >
                  hello@eventpulse.app
                </a>
                . We route messages to the right team by subject line.
              </p>
            </motion.div>

            <motion.div
              className="rounded-[1.75rem] border border-border/80 bg-surface p-7 shadow-soft"
              {...fade(0.12)}
            >
              <p className="flex items-center gap-2 text-sm font-semibold text-ink">
                <FontAwesomeIcon icon={faClock} className="h-4 w-4 text-primary" />
                Response hours
              </p>
              <ul className="mt-4 space-y-3 text-sm text-ink-muted">
                {hours.map((row) => (
                  <li
                    key={row.day}
                    className="flex flex-col gap-0.5 border-b border-border/60 pb-3 last:border-0 last:pb-0 sm:flex-row sm:justify-between"
                  >
                    <span className="font-medium text-ink">{row.day}</span>
                    <span>{row.time}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              className="rounded-[1.75rem] border border-border/80 bg-surface p-7 shadow-soft"
              {...fade(0.16)}
            >
              <p className="flex items-center gap-2 text-sm font-semibold text-ink">
                <FontAwesomeIcon icon={faLocationDot} className="h-4 w-4 text-primary" />
                Visit & mail
              </p>
              <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                EventPulse Studio
                <br />
                18 Park Lane, Koramangala
                <br />
                Bengaluru, Karnataka 560034
                <br />
                India
              </p>
              <p className="mt-4 text-xs text-ink-subtle">
                Visits by appointment so we can give you unhurried time.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="border-b border-border/80 bg-bg-milk py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-6">
          <SectionHeading
            eyebrow="Direct lines"
            title="Reach the team that fits your question"
            description="Using the right inbox helps us respond faster with the right expertise."
            align="center"
          />
          <ul className="mt-12 grid gap-6 sm:grid-cols-2">
            {channels.map((channel, index) => (
              <motion.li
                key={channel.title}
                className="rounded-[1.75rem] border border-border/80 bg-surface p-7 shadow-soft"
                {...fade(index * 0.06)}
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <FontAwesomeIcon icon={channel.icon} className="h-5 w-5" />
                </span>
                <h3 className="mt-4 font-display text-xl text-ink">{channel.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                  {channel.blurb}
                </p>
                <a
                  href={`mailto:${channel.email}`}
                  className="mt-4 inline-block text-sm font-semibold text-primary hover:underline"
                >
                  {channel.email}
                </a>
              </motion.li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-surface py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="rounded-[1.75rem] border border-border/80 bg-bg-milk p-8 md:p-10">
            <h2 className="font-display text-2xl text-ink md:text-3xl">
              Already have an account?
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-muted md:text-base">
              Attendees manage bookings after{" "}
              <Link href="/login" className="font-semibold text-primary hover:underline">
                signing in
              </Link>
              . Organizers use the{" "}
              <Link href="/admin" className="font-semibold text-primary hover:underline">
                admin portal
              </Link>
              ; gate staff check in guests from the{" "}
              <Link href="/gatekeeper" className="font-semibold text-primary hover:underline">
                gatekeeper app
              </Link>
              . Those paths are separate from this contact form so we can keep
              security tight.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/events">
                <Button type="button" variant="secondary" className="rounded-full">
                  Browse public events
                </Button>
              </Link>
              <Link href="/#faq">
                <Button type="button" className="rounded-full">
                  Read FAQs on home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
