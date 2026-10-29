"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

const LINE = "Discover nights that move you";
const ACCENT_FROM = LINE.indexOf("move");
const CHAR_DELAY_S = 0.042;
const START_DELAY_S = 0.15;
const PAUSE_AFTER_WRITE_MS = 2200;
const ERASE_STAGGER_S = 0.028;

type Phase = "write" | "pause" | "erase";

export function HeroAnimatedTitle() {
  const reduceMotion = useReducedMotion();
  const chars = useMemo(() => LINE.split(""), []);
  const [phase, setPhase] = useState<Phase>("write");
  const [cycle, setCycle] = useState(0);

  const writeDurationMs =
    (START_DELAY_S + chars.length * CHAR_DELAY_S + 0.14) * 1000;

  useEffect(() => {
    if (reduceMotion) return;

    if (phase === "write") {
      const t = window.setTimeout(() => setPhase("pause"), writeDurationMs);
      return () => window.clearTimeout(t);
    }

    if (phase === "pause") {
      const t = window.setTimeout(() => setPhase("erase"), PAUSE_AFTER_WRITE_MS);
      return () => window.clearTimeout(t);
    }

    const eraseDurationMs =
      (chars.length * ERASE_STAGGER_S + 0.12) * 1000;
    const t = window.setTimeout(() => {
      setCycle((c) => c + 1);
      setPhase("write");
    }, eraseDurationMs);
    return () => window.clearTimeout(t);
  }, [phase, cycle, chars.length, reduceMotion, writeDurationMs]);

  if (reduceMotion) {
    return (
      <h1 className="text-balance mt-6 max-w-3xl font-display text-[2.65rem] font-normal leading-[1.08] text-white md:text-6xl lg:text-[4.25rem]">
        Discover nights that{" "}
        <span className="hero-gradient-text">move you</span>
      </h1>
    );
  }

  return (
    <h1
      className="text-balance mt-6 max-w-3xl break-words font-display text-[2rem] font-normal leading-[1.08] text-white sm:text-[2.65rem] md:text-6xl lg:text-[4.25rem]"
      aria-label={LINE}
    >
      {chars.map((char, index) => {
        const isAccent = index >= ACCENT_FROM;
        const isSpace = char === " ";
        const reverseIndex = chars.length - 1 - index;

        const animate =
          phase === "erase" ? { opacity: 0 } : { opacity: 1 };

        const writeTransition = {
          delay: START_DELAY_S + index * CHAR_DELAY_S,
          duration: 0.12,
          ease: [0.22, 1, 0.36, 1] as const,
        };

        const eraseTransition = {
          delay: reverseIndex * ERASE_STAGGER_S,
          duration: 0.1,
          ease: [0.4, 0, 0.2, 1] as const,
        };

        const transition =
          phase === "erase"
            ? eraseTransition
            : phase === "pause"
              ? { duration: 0 }
              : writeTransition;

        return (
          <motion.span
            key={`${cycle}-${index}-${char}`}
            className={[
              "inline-block",
              isAccent ? "hero-gradient-text" : "",
            ].join(" ")}
            initial={{ opacity: 0 }}
            animate={animate}
            transition={transition}
            aria-hidden
          >
            {isSpace ? "\u00A0" : char}
          </motion.span>
        );
      })}
      <motion.span
        className="ml-0.5 inline-block font-light text-white/90"
        aria-hidden
        animate={{ opacity: [1, 1, 0, 0] }}
        transition={{
          duration: 0.85,
          repeat: Infinity,
          times: [0, 0.45, 0.55, 1],
        }}
      >
        |
      </motion.span>
    </h1>
  );
}
