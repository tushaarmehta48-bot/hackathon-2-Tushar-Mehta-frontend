import type { Transition, Variants } from "framer-motion";

/** Shared motion presets; callers should still respect reduced motion in components. */
export const motionTransition: Transition = {
  type: "spring",
  stiffness: 420,
  damping: 28,
};

export const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 },
};

export const pressableVariants: Variants = {
  rest: { scale: 1, y: 0, rotate: 0 },
  hover: { scale: 1.04, y: -2, rotate: -0.3 },
  tap: { scale: 0.96, y: 0, rotate: 0 },
};

export const cardHoverVariants: Variants = {
  rest: { y: 0, boxShadow: "0 1px 2px rgb(44 24 12 / 0.06)" },
  hover: { y: -2, boxShadow: "0 8px 24px rgb(44 24 12 / 0.1)" },
};
