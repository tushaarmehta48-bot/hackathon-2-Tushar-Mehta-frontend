"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowUpRightFromSquare,
  faChartLine,
  faCirclePlus,
  faGaugeHigh,
  faHouse,
  faLifeRing,
  faUsers,
  faCalendarDays,
} from "@fortawesome/free-solid-svg-icons";
import type { SafeUser } from "@/lib/types/user";

const mainLinks = [
  { href: "/admin/overview", label: "Overview", icon: faGaugeHigh },
  { href: "/admin/events", label: "Events", icon: faCalendarDays },
  { href: "/admin/gatekeepers", label: "Gatekeepers", icon: faUsers },
  { href: "/admin/reports", label: "Reports", icon: faChartLine },
] as const;

type AdminSidebarNavProps = {
  user: SafeUser;
};

export function AdminSidebarNav({ user }: AdminSidebarNavProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop: left rail, expands on hover */}
      <aside
        className="group/sidebar fixed bottom-0 left-0 top-14 z-40 hidden w-[4.5rem] border-r border-white/10 bg-ink shadow-2xl transition-[width] duration-300 ease-out hover:w-64 lg:flex lg:flex-col"
        aria-label="Admin navigation"
      >
        <div className="flex h-full flex-col overflow-hidden p-2">
          <p className="mb-2 px-2 pt-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white/0 transition-colors duration-300 group-hover/sidebar:text-white/45">
            Console
          </p>

          <nav className="flex flex-1 flex-col gap-1">
            {mainLinks.map((link) => {
              const active =
                link.href === "/admin/overview"
                  ? pathname === "/admin/overview"
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  title={link.label}
                  className={[
                    "flex min-h-11 items-center gap-3 overflow-hidden rounded-xl px-2.5 text-sm font-semibold transition-colors",
                    active
                      ? "bg-primary text-on-primary shadow-md"
                      : "text-white/70 hover:bg-white/10 hover:text-white",
                  ].join(" ")}
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center">
                    <FontAwesomeIcon icon={link.icon} className="h-4 w-4" />
                  </span>
                  <span className="whitespace-nowrap opacity-0 transition-opacity duration-200 group-hover/sidebar:opacity-100">
                    {link.label}
                  </span>
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto space-y-1 border-t border-white/10 pt-3 opacity-0 transition-opacity duration-300 group-hover/sidebar:opacity-100">
            <p className="px-2 text-[10px] font-bold uppercase tracking-wider text-white/40">
              Shortcuts
            </p>
            <Link
              href="/admin/events/new"
              className="flex min-h-10 items-center gap-3 overflow-hidden rounded-xl px-2.5 text-sm font-medium text-white/75 hover:bg-white/10 hover:text-white"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center text-accent-gold">
                <FontAwesomeIcon icon={faCirclePlus} className="h-4 w-4" />
              </span>
              <span className="whitespace-nowrap">New event</span>
            </Link>
            <Link
              href="/"
              className="flex min-h-10 items-center gap-3 overflow-hidden rounded-xl px-2.5 text-sm font-medium text-white/75 hover:bg-white/10 hover:text-white"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center">
                <FontAwesomeIcon icon={faHouse} className="h-4 w-4" />
              </span>
              <span className="whitespace-nowrap">Public site</span>
            </Link>
            <Link
              href="/contact"
              className="flex min-h-10 items-center gap-3 overflow-hidden rounded-xl px-2.5 text-sm font-medium text-white/75 hover:bg-white/10 hover:text-white"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center">
                <FontAwesomeIcon icon={faLifeRing} className="h-4 w-4" />
              </span>
              <span className="whitespace-nowrap">Support</span>
            </Link>
          </div>

          <div className="mt-3 hidden overflow-hidden rounded-xl bg-white/5 p-3 opacity-0 transition-opacity duration-300 group-hover/sidebar:block group-hover/sidebar:opacity-100">
            <p className="truncate text-xs font-semibold text-white">{user.name}</p>
            <p className="truncate text-[11px] text-white/50">{user.email}</p>
            <p className="mt-2 flex items-center gap-1 text-[10px] text-white/40">
              <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="h-2.5 w-2.5" />
              Hover rail to expand
            </p>
          </div>
        </div>
      </aside>

      {/* Mobile / tablet: bottom bar */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-40 flex border-t border-border bg-ink px-2 py-2 lg:hidden"
        aria-label="Admin navigation mobile"
      >
        {mainLinks.map((link) => {
          const active =
            link.href === "/admin/overview"
              ? pathname === "/admin/overview"
              : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={[
                "flex flex-1 flex-col items-center gap-0.5 rounded-lg py-2 text-[10px] font-semibold",
                active ? "text-accent-gold" : "text-white/60",
              ].join(" ")}
            >
              <FontAwesomeIcon icon={link.icon} className="h-4 w-4" />
              {link.label}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
