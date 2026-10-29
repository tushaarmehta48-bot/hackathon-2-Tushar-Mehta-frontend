"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { EventPulseLogo } from "@/components/brand/EventPulseLogo";

type AuthShellProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
  imageUrl: string;
  imageAlt: string;
};

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
  imageUrl,
  imageAlt,
}: AuthShellProps) {
  const reduceMotion = useReducedMotion();

  return (
    <div className="flex min-h-full flex-1 flex-col lg:grid lg:grid-cols-2">
      <div className="relative min-h-[220px] overflow-hidden sm:min-h-[280px] lg:min-h-full">
        {/* Direct load avoids optimizer 404s on some Unsplash IDs */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt={imageAlt}
          className="absolute inset-0 h-full w-full object-cover"
          loading="eager"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/40 to-ink/20" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_20%_80%,rgba(216,92,65,0.35),transparent)]" />
        <motion.div
          className="absolute bottom-10 left-10 right-10 text-white"
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <p className="font-display text-3xl leading-tight">
            Events that stay in sync
          </p>
          <p className="mt-2 max-w-md text-sm text-white/80">
            Secure tickets, live check-in, and one place to run the show.
          </p>
        </motion.div>
      </div>

      <div className="flex flex-1 flex-col">
        <header className="border-b border-border/80 bg-surface/95 px-6 py-4 backdrop-blur-sm">
          <motion.div
            whileHover={reduceMotion ? undefined : { scale: 1.02 }}
            whileTap={reduceMotion ? undefined : { scale: 0.98 }}
          >
            <EventPulseLogo variant="nav" href="/" />
          </motion.div>
        </header>

        <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-6 py-10">
          <motion.div
            className="mb-8 space-y-2 text-center lg:text-left"
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="font-display text-3xl font-normal tracking-tight text-ink">
              {title}
            </h1>
            <p className="text-sm leading-relaxed text-ink-muted">{subtitle}</p>
          </motion.div>
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
          >
            {children}
          </motion.div>
          {footer ? (
            <div className="mt-8 text-center text-sm text-ink-muted lg:text-left">
              {footer}
            </div>
          ) : null}
        </main>
      </div>
    </div>
  );
}
