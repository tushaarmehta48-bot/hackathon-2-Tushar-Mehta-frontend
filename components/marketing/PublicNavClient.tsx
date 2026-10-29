"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { fetchOptionalSessionUser } from "@/lib/api/session";
import type { SafeUser } from "@/lib/types/user";
import { NavProfileHoverMenu } from "@/components/marketing/NavProfileHoverMenu";
import { getUserInitials } from "@/lib/user-initials";
import { logout } from "@/lib/auth/api";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faChevronDown,
  faTicket,
  faUserShield,
  faUserTie,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { EventPulseLogo } from "@/components/brand/EventPulseLogo";
import { Button } from "@/components/ui/Button";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/events", label: "Events" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

const SIGN_IN_LINKS = [
  { href: "/login", label: "Attendee", icon: faTicket, hint: "Book tickets" },
  { href: "/admin", label: "Organizer", icon: faUserTie, hint: "Admin dashboard" },
  {
    href: "/gatekeeper",
    label: "Gatekeeper",
    icon: faUserShield,
    hint: "Scan & check-in",
  },
] as const;

export type PublicNavClientProps = {
  variant?: "default" | "overlay";
};

function NavItem({
  href,
  label,
  overlay,
  pathname,
  onNavigate,
}: {
  href: string;
  label: string;
  overlay: boolean;
  pathname: string;
  onNavigate?: () => void;
}) {
  const active =
    pathname === href || (href !== "/" && pathname.startsWith(href));
  const reduceMotion = useReducedMotion();

  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={[
        "relative rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
        overlay
          ? active
            ? "bg-white/15 text-white"
            : "text-white/85 hover:bg-white/10 hover:text-white"
          : active
            ? "bg-primary/10 text-primary"
            : "text-ink-muted hover:bg-surface-muted hover:text-ink",
      ].join(" ")}
    >
      {label}
      {active && !reduceMotion ? (
        <motion.span
          layoutId="public-nav-pill"
          className={[
            "absolute inset-0 -z-10 rounded-full",
            overlay ? "bg-white/15" : "bg-primary/10",
          ].join(" ")}
          transition={{ type: "spring", stiffness: 380, damping: 30 }}
        />
      ) : null}
    </Link>
  );
}

function SignInHoverMenu({ overlay }: { overlay: boolean }) {
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reduceMotion = useReducedMotion();

  function openMenu() {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
    setOpen(true);
  }

  function scheduleClose() {
    closeTimer.current = setTimeout(() => setOpen(false), 120);
  }

  return (
    <div
      className="relative hidden sm:block"
      onMouseEnter={openMenu}
      onMouseLeave={scheduleClose}
    >
      <Button
        type="button"
        variant="ghost"
        className={[
          "rounded-full gap-1.5",
          overlay
            ? "text-white hover:bg-white/10 focus-visible:ring-white/40"
            : "",
        ].join(" ")}
        aria-expanded={open}
        aria-haspopup="true"
      >
        Sign in
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.2 }}
        >
          <FontAwesomeIcon icon={faChevronDown} className="h-3 w-3 opacity-70" />
        </motion.span>
      </Button>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            className="absolute right-0 top-[calc(100%+0.35rem)] z-[60] min-w-[15rem]"
            onMouseEnter={openMenu}
            onMouseLeave={scheduleClose}
          >
            <div className="overflow-hidden rounded-2xl border border-border/80 bg-surface py-1.5 shadow-elevated ring-1 ring-ink/5">
              <p className="px-4 py-2 text-[11px] font-bold uppercase tracking-[0.16em] text-ink-subtle">
                Choose portal
              </p>
              {SIGN_IN_LINKS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-start gap-3 px-4 py-2.5 transition hover:bg-surface-muted"
                >
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <FontAwesomeIcon icon={item.icon} className="h-3.5 w-3.5" />
                  </span>
                  <span>
                    <span className="block text-sm font-semibold text-ink">
                      {item.label}
                    </span>
                    <span className="block text-xs text-ink-muted">
                      {item.hint}
                    </span>
                  </span>
                </Link>
              ))}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

export function PublicNavClient({ variant = "default" }: PublicNavClientProps) {
  const overlay = variant === "overlay";
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<SafeUser | null>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    let cancelled = false;
    fetchOptionalSessionUser()
      .then((res) => {
        if (!cancelled) setUser(res.user);
      })
      .catch(() => {
        if (!cancelled) setUser(null);
      });
    return () => {
      cancelled = true;
    };
  }, [pathname]);

  const shellClass = [
    "mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-2.5 sm:px-5 sm:py-3",
    "rounded-[2rem] border shadow-soft backdrop-blur-xl",
    overlay
      ? "border-white/25 bg-ink/35 ring-1 ring-white/10"
      : "border-border/80 bg-surface/95 ring-1 ring-ink/[0.04]",
  ].join(" ");

  return (
    <header
      className={[
        "z-50 w-full px-4 sm:px-6",
        overlay ? "absolute inset-x-0 top-0 pt-4" : "sticky top-0 pt-3 pb-1",
      ].join(" ")}
    >
      <div className={shellClass}>
        <motion.div
          whileHover={reduceMotion ? undefined : { scale: 1.02 }}
          whileTap={reduceMotion ? undefined : { scale: 0.98 }}
          className={overlay ? "drop-shadow-[0_2px_14px_rgba(0,0,0,0.35)]" : ""}
        >
          <EventPulseLogo variant="nav" href="/" onDark={overlay} />
        </motion.div>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <NavItem
              key={link.href}
              {...link}
              overlay={overlay}
              pathname={pathname}
            />
          ))}
        </nav>

        <div className="flex items-center gap-1.5 sm:gap-2">
          {user ? (
            <NavProfileHoverMenu
              user={user}
              overlay={overlay}
              onNavigate={() => setMobileOpen(false)}
            />
          ) : (
            <>
              <SignInHoverMenu overlay={overlay} />
              <Link href="/login" className="hidden sm:block">
                <Button
                  type="button"
                  variant={overlay ? "secondary" : "primary"}
                  className={[
                    "rounded-full px-4 sm:px-5",
                    overlay
                      ? "border-white/30 bg-white text-ink shadow-md hover:bg-white/95 hover:text-ink"
                      : "shadow-md",
                  ].join(" ")}
                >
                  Get started
                </Button>
              </Link>
            </>
          )}
          <Button
            type="button"
            variant="ghost"
            className={[
              "min-h-10 rounded-2xl px-3 md:hidden",
              overlay ? "text-white hover:bg-white/10" : "",
            ].join(" ")}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            onClick={() => setMobileOpen((o) => !o)}
          >
            <FontAwesomeIcon icon={mobileOpen ? faXmark : faBars} />
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen ? (
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className={[
              "mx-auto mt-2 max-w-6xl overflow-hidden rounded-[1.75rem] border md:hidden",
              overlay
                ? "border-white/20 bg-ink/90 backdrop-blur-lg"
                : "border-border bg-surface shadow-card",
            ].join(" ")}
          >
            <div className="flex flex-col gap-1 px-4 py-4">
              {NAV_LINKS.map((link) => (
                <NavItem
                  key={link.href}
                  {...link}
                  overlay={overlay}
                  pathname={pathname}
                  onNavigate={() => setMobileOpen(false)}
                />
              ))}
              {user ? (
                <>
                  <div className="mt-3 flex items-center gap-3 rounded-xl bg-surface-muted px-3 py-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full btn-primary-gradient text-xs font-bold text-on-primary">
                      {getUserInitials(user.name)}
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-semibold text-ink">
                        {user.name}
                      </span>
                      <span className="block truncate text-xs text-ink-muted">
                        {user.email}
                      </span>
                    </span>
                  </div>
                  <Link
                    href="/bookings"
                    onClick={() => setMobileOpen(false)}
                    className="rounded-xl px-3 py-2 text-sm font-semibold hover:bg-surface-muted"
                  >
                    My bookings
                  </Link>
                  <Link
                    href="/events"
                    onClick={() => setMobileOpen(false)}
                    className="rounded-xl px-3 py-2 text-sm font-semibold hover:bg-surface-muted"
                  >
                    Browse events
                  </Link>
                  <Button
                    type="button"
                    variant="ghost"
                    className="mt-2 w-full"
                    onClick={() => {
                      void logout().finally(() => {
                        setMobileOpen(false);
                        router.push("/");
                        router.refresh();
                      });
                    }}
                  >
                    Sign out
                  </Button>
                </>
              ) : (
                <>
                  <p className="mt-3 px-3 text-[11px] font-bold uppercase tracking-[0.16em] text-ink-subtle">
                    Sign in as
                  </p>
                  {SIGN_IN_LINKS.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className="rounded-xl px-3 py-2 text-sm font-semibold hover:bg-surface-muted"
                    >
                      {item.label}
                    </Link>
                  ))}
                  <Link
                    href="/login"
                    className="mt-2"
                    onClick={() => setMobileOpen(false)}
                  >
                    <Button type="button" className="w-full rounded-full">
                      Get started
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
