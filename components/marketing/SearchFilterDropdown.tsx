"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

const CloseDropdownContext = createContext<() => void>(() => {});

export function useCloseSearchFilterDropdown() {
  return useContext(CloseDropdownContext);
}

type SearchFilterDropdownProps = {
  label: string;
  valueLabel: string;
  isHero?: boolean;
  panelTitle: string;
  children: ReactNode;
  className?: string;
  menuWidthClass?: string;
  align?: "left" | "right";
};

export function SearchFilterDropdown({
  label,
  valueLabel,
  isHero = true,
  panelTitle,
  children,
  className = "",
  menuWidthClass = "w-[min(100%,20rem)] min-w-[13rem]",
  align = "left",
}: SearchFilterDropdownProps) {
  const [open, setOpen] = useState(false);
  const [panelPos, setPanelPos] = useState<{
    top: number;
    left: number;
    minWidth: number;
  } | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reduceMotion = useReducedMotion();

  const updatePanelPosition = useCallback(() => {
    const el = triggerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setPanelPos({
      top: rect.bottom + 6,
      left: align === "right" ? rect.right : rect.left,
      minWidth: Math.max(rect.width, 208),
    });
  }, [align]);

  useLayoutEffect(() => {
    if (!open) {
      return;
    }
    updatePanelPosition();
    window.addEventListener("scroll", updatePanelPosition, true);
    window.addEventListener("resize", updatePanelPosition);
    return () => {
      window.removeEventListener("scroll", updatePanelPosition, true);
      window.removeEventListener("resize", updatePanelPosition);
    };
  }, [open, updatePanelPosition]);

  function openMenu() {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
    updatePanelPosition();
    setOpen(true);
  }

  function scheduleClose() {
    closeTimer.current = setTimeout(() => setOpen(false), 140);
  }

  function toggleOpen() {
    setOpen((prev) => {
      if (!prev) {
        updatePanelPosition();
      }
      return !prev;
    });
  }

  function closeMenu() {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
    setOpen(false);
  }

  const triggerClass = isHero
    ? "flex min-h-[3.25rem] w-full min-w-0 items-center justify-between gap-2 border-0 bg-transparent px-3 py-3.5 text-left text-sm outline-none sm:px-4"
    : "flex min-h-11 w-full min-w-0 items-center justify-between gap-2 rounded-xl border border-border bg-surface-muted px-3 py-3 text-left text-sm outline-none ring-primary/30 focus-visible:ring-2 lg:w-44";

  return (
    <div
      className={["relative", className].join(" ")}
      onMouseEnter={openMenu}
      onMouseLeave={scheduleClose}
    >
      <button
        ref={triggerRef}
        type="button"
        className={triggerClass}
        aria-expanded={open}
        aria-haspopup="listbox"
        onClick={toggleOpen}
      >
        <span className="min-w-0 flex-1">
          <span className="block text-[10px] font-bold uppercase tracking-[0.14em] text-ink-subtle">
            {label}
          </span>
          <span className="block truncate font-medium text-ink">{valueLabel}</span>
        </span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.2 }}
          className="shrink-0 text-ink-subtle"
          aria-hidden
        >
          <FontAwesomeIcon icon={faChevronDown} className="h-3 w-3" />
        </motion.span>
      </button>

      {typeof document !== "undefined" && panelPos
        ? createPortal(
            <AnimatePresence>
              {open ? (
                <motion.div
                  initial={
                    reduceMotion ? false : { opacity: 0, y: 6, scale: 0.98 }
                  }
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 4, scale: 0.98 }}
                  transition={{ duration: 0.16 }}
                  style={{
                    position: "fixed",
                    top: panelPos.top,
                    left: panelPos.left,
                    minWidth: panelPos.minWidth,
                    transform: align === "right" ? "translateX(-100%)" : undefined,
                    zIndex: 200,
                  }}
                  className={menuWidthClass}
                  onMouseEnter={openMenu}
                  onMouseLeave={scheduleClose}
                >
                  <div className="overflow-hidden rounded-2xl border border-border/80 bg-surface shadow-elevated ring-1 ring-ink/5">
                    <p className="border-b border-border/60 px-3.5 py-2 text-[11px] font-bold uppercase tracking-[0.16em] text-ink-subtle">
                      {panelTitle}
                    </p>
                    <CloseDropdownContext.Provider value={closeMenu}>
                      {children}
                    </CloseDropdownContext.Provider>
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>,
            document.body,
          )
        : null}
    </div>
  );
}

type DropdownOptionProps = {
  selected?: boolean;
  onSelect: () => void;
  children: ReactNode;
  hint?: string;
};

export function SearchFilterDropdownOption({
  selected,
  onSelect,
  children,
  hint,
}: DropdownOptionProps) {
  const closeMenu = useCloseSearchFilterDropdown();

  return (
    <button
      type="button"
      role="option"
      aria-selected={selected}
      className={[
        "flex w-full flex-col items-start px-3.5 py-2 text-left text-sm transition",
        selected
          ? "bg-primary/10 font-semibold text-primary"
          : "text-ink hover:bg-surface-muted",
      ].join(" ")}
      onClick={() => {
        onSelect();
        closeMenu();
      }}
    >
      <span>{children}</span>
      {hint ? (
        <span className="mt-0.5 text-xs font-normal text-ink-muted">{hint}</span>
      ) : null}
    </button>
  );
}

export function SearchFilterDropdownScroll({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={[
        "filter-dropdown-scroll max-h-[min(11rem,40vh)] overflow-y-auto overscroll-contain py-0.5",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}

export function SearchFilterDropdownFooter({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="border-t border-border/70 bg-surface px-3.5 py-2.5">
      {children}
    </div>
  );
}
