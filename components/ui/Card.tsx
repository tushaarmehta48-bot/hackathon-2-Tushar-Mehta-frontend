"use client";

import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion";
import type { ReactNode } from "react";
import { cardHoverVariants, fadeUpVariants, motionTransition } from "@/lib/motion";

export type CardProps = Omit<HTMLMotionProps<"div">, "children"> & {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  animateIn?: boolean;
};

export function Card({
  children,
  title,
  subtitle,
  animateIn = false,
  className = "",
  ...rest
}: CardProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      variants={
        reduceMotion
          ? undefined
          : animateIn
            ? fadeUpVariants
            : cardHoverVariants
      }
      initial={animateIn && !reduceMotion ? "hidden" : "rest"}
      whileInView={animateIn && !reduceMotion ? "visible" : undefined}
      whileHover={!animateIn && !reduceMotion ? "hover" : undefined}
      viewport={animateIn ? { once: true, margin: "-40px" } : undefined}
      transition={motionTransition}
      className={[
        "rounded-2xl border border-border bg-surface p-6 shadow-sm",
        className,
      ].join(" ")}
      {...rest}
    >
      {(title || subtitle) && (
        <header className="mb-4 space-y-1">
          {title ? (
            <h2 className="font-display text-xl font-semibold tracking-tight text-ink">
              {title}
            </h2>
          ) : null}
          {subtitle ? (
            <p className="text-sm text-ink-muted">{subtitle}</p>
          ) : null}
        </header>
      )}
      {children}
    </motion.div>
  );
}
