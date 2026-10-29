"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { EVENT_CATEGORIES } from "@/lib/constants/categories";

export function CategoryPills() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {EVENT_CATEGORIES.map((cat, index) => (
        <motion.div
          key={cat.id}
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-20px" }}
          transition={{ delay: index * 0.05, duration: 0.4 }}
        >
          <Link
            href={`/events?category=${encodeURIComponent(cat.id)}`}
            className="group flex items-center gap-4 rounded-2xl border border-border/80 bg-surface p-4 shadow-soft transition duration-300 hover:-translate-y-0.5 hover:border-primary/35 hover:shadow-card"
          >
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition group-hover:bg-primary group-hover:text-on-primary">
              <FontAwesomeIcon icon={cat.icon} className="h-5 w-5" />
            </span>
            <span>
              <span className="block font-semibold text-ink">{cat.label}</span>
              <span className="text-xs text-ink-subtle">View listings →</span>
            </span>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
