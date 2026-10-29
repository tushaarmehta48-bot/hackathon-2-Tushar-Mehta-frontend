"use client";

import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion";
import type { ReactNode } from "react";
import { motionTransition, pressableVariants } from "@/lib/motion";

type ButtonVariant = "primary" | "secondary" | "ghost";

export type ButtonProps = Omit<
  HTMLMotionProps<"button">,
  "children"
> & {
  variant?: ButtonVariant;
  children: ReactNode;
  loading?: boolean;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "btn-primary-gradient border-0 text-on-primary shadow-md hover:shadow-lg focus-visible:ring-primary",
  secondary:
    "bg-surface text-ink border border-border shadow-sm hover:bg-surface-muted hover:shadow-md focus-visible:ring-primary",
  ghost:
    "bg-transparent text-ink border border-transparent hover:bg-surface-muted focus-visible:ring-primary",
};

export function Button({
  variant = "primary",
  className = "",
  disabled,
  loading,
  children,
  type = "button",
  ...rest
}: ButtonProps) {
  const reduceMotion = useReducedMotion();
  const isDisabled = disabled || loading;
  const isPrimary = variant === "primary";

  return (
    <motion.button
      type={type}
      disabled={isDisabled}
      variants={reduceMotion ? undefined : pressableVariants}
      initial="rest"
      whileHover={isDisabled || reduceMotion ? undefined : "hover"}
      whileTap={isDisabled || reduceMotion ? undefined : "tap"}
      transition={motionTransition}
      className={[
        "relative inline-flex min-h-11 items-center justify-center gap-2 overflow-hidden rounded-xl px-5 py-2.5 text-sm font-semibold",
        "transition-[box-shadow,filter] duration-300",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-milk",
        "disabled:cursor-not-allowed disabled:opacity-55",
        variantClasses[variant],
        className,
      ].join(" ")}
      {...rest}
    >
      {isPrimary && !isDisabled && !reduceMotion ? (
        <motion.span
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
          initial={{ x: "-120%" }}
          whileHover={{ x: "120%" }}
          transition={{ duration: 0.55, ease: "easeInOut" }}
        />
      ) : null}
      <span className="relative z-[1]">{loading ? "…" : children}</span>
    </motion.button>
  );
}
