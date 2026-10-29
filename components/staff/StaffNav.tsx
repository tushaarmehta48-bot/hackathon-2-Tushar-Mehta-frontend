"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQrcode, faClipboardList } from "@fortawesome/free-solid-svg-icons";

const links = [
  { href: "/gatekeeper/overview", label: "Assignments", icon: faClipboardList },
  { href: "/gatekeeper/scan", label: "Scan tickets", icon: faQrcode },
] as const;

export function StaffNav() {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();

  return (
    <nav className="flex flex-col gap-1">
      <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.2em] text-ink-subtle lg:mb-3">
        Gatekeeper
      </p>
      {links.map((link) => {
        const active =
          link.href === "/gatekeeper/overview"
            ? pathname === "/gatekeeper/overview"
            : pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={[
              "relative flex min-h-11 items-center gap-3 rounded-xl px-4 text-sm font-semibold transition-colors",
              active
                ? "bg-primary text-on-primary shadow-md"
                : "bg-surface-muted text-ink-muted hover:text-ink lg:bg-transparent lg:hover:bg-surface-muted",
            ].join(" ")}
          >
            {active && !reduceMotion ? (
              <motion.span
                layoutId="gatekeeper-nav-active"
                className="absolute inset-0 rounded-xl bg-primary"
                transition={{ type: "spring", stiffness: 400, damping: 32 }}
                style={{ zIndex: 0 }}
              />
            ) : null}
            <FontAwesomeIcon icon={link.icon} className="relative z-[1] h-4 w-4" />
            <span className="relative z-[1]">{link.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
