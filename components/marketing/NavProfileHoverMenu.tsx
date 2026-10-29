"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRightFromBracket,
  faCalendarDays,
  faChevronDown,
  faGauge,
  faHouse,
  faQrcode,
  faTicket,
} from "@fortawesome/free-solid-svg-icons";
import { logout } from "@/lib/auth/api";
import { getUserInitials } from "@/lib/user-initials";
import type { SafeUser } from "@/lib/types/user";
import { UserRole } from "@/lib/types/user";

type NavProfileHoverMenuProps = {
  user: SafeUser;
  overlay?: boolean;
  onNavigate?: () => void;
};

type MenuItem = {
  href: string;
  label: string;
  hint?: string;
  icon: typeof faTicket;
};

function menuItemsForRole(role: UserRole | string): MenuItem[] {
  if (role === UserRole.Admin) {
    return [
      {
        href: "/admin/overview",
        label: "Admin dashboard",
        hint: "Events & reports",
        icon: faGauge,
      },
    ];
  }
  if (role === UserRole.Gatekeeper) {
    return [
      {
        href: "/gatekeeper/scan",
        label: "Scan tickets",
        hint: "Gate check-in",
        icon: faQrcode,
      },
      {
        href: "/gatekeeper/overview",
        label: "Gate overview",
        icon: faGauge,
      },
    ];
  }
  return [
    {
      href: "/bookings",
      label: "My bookings",
      hint: "Tickets & QR codes",
      icon: faTicket,
    },
    {
      href: "/events",
      label: "Browse events",
      icon: faCalendarDays,
    },
    {
      href: "/",
      label: "Home",
      icon: faHouse,
    },
  ];
}

export function NavProfileHoverMenu({
  user,
  overlay = false,
  onNavigate,
}: NavProfileHoverMenuProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reduceMotion = useReducedMotion();
  const initials = getUserInitials(user.name);
  const items = menuItemsForRole(user.role);

  function openMenu() {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
    setOpen(true);
  }

  function scheduleClose() {
    closeTimer.current = setTimeout(() => setOpen(false), 140);
  }

  async function onSignOut() {
    setSigningOut(true);
    try {
      await logout();
    } catch {
      /* session may already be gone */
    } finally {
      onNavigate?.();
      router.push("/");
      router.refresh();
      setSigningOut(false);
    }
  }

  return (
    <div
      className="relative hidden sm:block"
      onMouseEnter={openMenu}
      onMouseLeave={scheduleClose}
    >
      <button
        type="button"
        className={[
          "flex items-center gap-1.5 rounded-full p-0.5 transition-colors",
          overlay
            ? "ring-2 ring-white/30 hover:ring-white/50"
            : "ring-2 ring-primary/20 hover:ring-primary/40",
        ].join(" ")}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={`Account menu for ${user.name}`}
        onClick={() => setOpen((v) => !v)}
      >
        <span
          className={[
            "flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold",
            overlay
              ? "bg-white text-ink"
              : "btn-primary-gradient text-on-primary",
          ].join(" ")}
        >
          {initials}
        </span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.2 }}
          className={overlay ? "pr-1 text-white/85" : "pr-1 text-ink-muted"}
          aria-hidden
        >
          <FontAwesomeIcon icon={faChevronDown} className="h-3 w-3" />
        </motion.span>
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            className="absolute right-0 top-[calc(100%+0.35rem)] z-[60] min-w-[16rem]"
            onMouseEnter={openMenu}
            onMouseLeave={scheduleClose}
          >
            <div className="overflow-hidden rounded-2xl border border-border/80 bg-surface py-1.5 shadow-elevated ring-1 ring-ink/5">
              <div className="border-b border-border/70 px-4 py-3">
                <p className="text-sm font-semibold text-ink">{user.name}</p>
                <p className="mt-0.5 truncate text-xs text-ink-muted">
                  {user.email}
                </p>
              </div>
              {items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => {
                    onNavigate?.();
                    setOpen(false);
                  }}
                  className="flex items-start gap-3 px-4 py-2.5 transition hover:bg-surface-muted"
                >
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <FontAwesomeIcon icon={item.icon} className="h-3.5 w-3.5" />
                  </span>
                  <span>
                    <span className="block text-sm font-semibold text-ink">
                      {item.label}
                    </span>
                    {item.hint ? (
                      <span className="block text-xs text-ink-muted">
                        {item.hint}
                      </span>
                    ) : null}
                  </span>
                </Link>
              ))}
              <div className="mt-1 border-t border-border/70 px-2 pt-1">
                <button
                  type="button"
                  disabled={signingOut}
                  onClick={() => void onSignOut()}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-ink transition hover:bg-surface-muted disabled:opacity-60"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-surface-muted text-ink-muted">
                    <FontAwesomeIcon
                      icon={faArrowRightFromBracket}
                      className="h-3.5 w-3.5"
                    />
                  </span>
                  {signingOut ? "Signing out…" : "Sign out"}
                </button>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
