"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { HERO_IMAGE, HERO_IMAGE_ALT } from "@/lib/constants/categories";
import { LiveTodayDate } from "@/components/common/LiveTodayDate";
import { EventSearchBar } from "@/components/marketing/EventSearchBar";
import { HeroAnimatedTitle } from "@/components/marketing/HeroAnimatedTitle";

const stats = [
  { value: "Live", label: "Inventory sync" },
  { value: "QR", label: "Secure tickets" },
  { value: "AI", label: "Voice guide" },
];

export function HeroSection() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative min-h-[88vh] w-full max-w-full">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <motion.div
          className="absolute inset-0 bg-cover bg-center will-change-transform"
          style={{ backgroundImage: `url(${HERO_IMAGE})` }}
          initial={{ scale: 1 }}
          animate={{ scale: reduceMotion ? 1 : 1.07 }}
          transition={
            reduceMotion
              ? undefined
              : {
                  duration: 22,
                  ease: "linear",
                  repeat: Infinity,
                  repeatType: "reverse",
                }
          }
        />
        <div className="absolute inset-0 bg-gradient-to-br from-ink/85 via-ink/55 to-primary/35" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(212,188,106,0.18),transparent_55%)]" />
        <div className="bg-grain absolute inset-0 opacity-60" />
      </div>

      <div className="relative mx-auto flex min-h-[88vh] w-full max-w-6xl flex-col justify-end px-4 pb-14 pt-28 sm:px-6 md:pb-20 md:pt-36">
        <motion.div
          className="mb-6 md:mb-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.45 }}
        >
          <LiveTodayDate variant="hero" />
        </motion.div>

        <motion.p
          className="inline-flex w-fit max-w-full items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-white/90 backdrop-blur-sm"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-accent-gold shadow-[0_0_8px_rgba(212,188,106,0.9)]" />
          Live events · Real tickets
        </motion.p>

        <div className="max-w-full overflow-hidden">
          <HeroAnimatedTitle />
        </div>

        <motion.p
          className="mt-5 max-w-xl text-lg leading-relaxed text-white/85 md:text-xl"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.5 }}
        >
          From festivals under the lights to intimate workshops — search, book,
          and check in with confidence.
        </motion.p>

        <ul className="mt-8 flex flex-wrap gap-3 md:gap-6">
          {stats.map((item, i) => (
            <motion.li
              key={item.label}
              className="rounded-2xl border border-white/15 bg-white/8 px-4 py-3 backdrop-blur-md"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + i * 0.05 }}
            >
              <span className="block font-display text-xl text-accent-gold">
                {item.value}
              </span>
              <span className="text-xs font-medium text-white/75">
                {item.label}
              </span>
            </motion.li>
          ))}
        </ul>

        <div className="relative z-30 mt-10 w-full min-w-0 max-w-4xl pb-2">
          <EventSearchBar variant="hero" />
        </div>

        <motion.p
          className="mt-5 text-sm text-white/70"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.75 }}
        >
          <Link
            href="/events"
            className="font-medium text-white underline decoration-white/30 underline-offset-4 transition hover:decoration-white"
          >
            Browse all events
          </Link>
          <span className="mx-2 text-white/35">·</span>
          Use the voice widget to talk with our ElevenLabs assistant
        </motion.p>
      </div>

      <span className="sr-only">{HERO_IMAGE_ALT}</span>
    </section>
  );
}
