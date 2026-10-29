"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { Button } from "@/components/ui/Button";
import { CategoryFilterDropdown } from "@/components/marketing/CategoryFilterDropdown";
import {
  SearchFilterDropdown,
  SearchFilterDropdownFooter,
  SearchFilterDropdownOption,
  SearchFilterDropdownScroll,
} from "@/components/marketing/SearchFilterDropdown";
import {
  formatFilterDate,
  getDatePresets,
  type DatePreset,
} from "@/lib/search-filters";

type EventSearchBarProps = {
  variant?: "hero" | "inline";
  defaultQuery?: string;
  defaultCategory?: string;
  defaultFrom?: string;
};

export function EventSearchBar({
  variant = "hero",
  defaultQuery = "",
  defaultCategory = "",
  defaultFrom = "",
}: EventSearchBarProps) {
  const router = useRouter();
  const [category, setCategory] = useState(defaultCategory);
  const [fromDate, setFromDate] = useState(defaultFrom);

  const [datePresets, setDatePresets] = useState<DatePreset[]>([
    { id: "any", label: "Any date", hint: "No date filter", value: "" },
  ]);

  useEffect(() => {
    function refreshPresets() {
      setDatePresets(getDatePresets(new Date()));
    }
    refreshPresets();
    const id = window.setInterval(refreshPresets, 60_000);
    return () => window.clearInterval(id);
  }, []);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const q = String(data.get("q") ?? "").trim();
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (category) params.set("category", category);
    if (fromDate) params.set("from", fromDate);
    router.push(`/events${params.toString() ? `?${params}` : ""}`);
  }

  const isHero = variant === "hero";

  const shell = isHero
    ? "relative z-30 w-full min-w-0 overflow-visible rounded-2xl bg-white/95 shadow-elevated ring-1 ring-white/40 backdrop-blur-xl"
    : "relative z-50 w-full min-w-0 overflow-visible rounded-2xl border border-border bg-surface p-1 shadow-soft";

  const fieldClass = isHero
    ? "w-full border-0 bg-transparent py-3.5 text-sm text-ink outline-none placeholder:text-ink-subtle"
    : "w-full rounded-xl border-0 bg-surface-muted py-3 pl-10 pr-3 text-sm outline-none ring-primary/30 focus:ring-2";

  return (
    <motion.form
      className={shell}
      onSubmit={onSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.5 }}
    >
      <input type="hidden" name="category" value={category} />
      <input type="hidden" name="from" value={fromDate} />

      <div
        className={
          isHero
            ? "flex min-w-0 flex-col lg:flex-row lg:items-stretch lg:divide-x lg:divide-border/80"
            : "flex min-w-0 flex-col gap-2 p-2 lg:flex-row lg:items-center"
        }
      >
        <label
          className={[
            "relative flex flex-1 items-center",
            isHero ? "px-4 lg:min-w-0 lg:flex-[1.4]" : "",
          ].join(" ")}
        >
          {!isHero ? (
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              className="pointer-events-none absolute left-3 h-4 w-4 text-ink-subtle"
            />
          ) : (
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              className="mr-3 h-4 w-4 shrink-0 text-primary"
            />
          )}
          <input
            name="q"
            defaultValue={defaultQuery}
            placeholder="Search events, cities, venues…"
            className={isHero ? fieldClass : fieldClass + " pl-10"}
          />
        </label>

        <div
          className={
            isHero
              ? "flex min-w-0 flex-col gap-0 border-t border-border/80 sm:flex-row sm:divide-x sm:divide-border/80 lg:min-w-[17rem] lg:flex-[0_0_auto] lg:border-t-0"
              : "contents"
          }
        >
          <SearchFilterDropdown
            label="Date"
            valueLabel={formatFilterDate(fromDate)}
            panelTitle="When"
            isHero={isHero}
            className={isHero ? "min-w-0 flex-1 sm:min-w-[8.5rem]" : ""}
          >
            <SearchFilterDropdownScroll>
              {datePresets.map((preset) => (
                <SearchFilterDropdownOption
                  key={preset.id}
                  selected={fromDate === preset.value}
                  hint={preset.hint}
                  onSelect={() => setFromDate(preset.value)}
                >
                  {preset.label}
                </SearchFilterDropdownOption>
              ))}
            </SearchFilterDropdownScroll>
            <SearchFilterDropdownFooter>
              <label className="text-[11px] font-bold uppercase tracking-[0.14em] text-ink-subtle">
                Pick a date
              </label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-border bg-bg-milk px-3 py-2 text-sm text-ink outline-none ring-primary/30 focus:ring-2"
                aria-label="Custom from date"
              />
            </SearchFilterDropdownFooter>
          </SearchFilterDropdown>

          <CategoryFilterDropdown
            value={category}
            onChange={setCategory}
            isHero={isHero}
            className={isHero ? "min-w-0 flex-1 sm:min-w-[8.5rem]" : ""}
          />
        </div>

        <div
          className={
            isHero
              ? "flex gap-2 border-t border-border/80 p-3 lg:border-t-0 lg:border-l lg:border-border/80 lg:p-3"
              : "flex gap-2"
          }
        >
          <Button
            type="submit"
            className="min-h-11 w-full rounded-full lg:w-auto lg:px-8"
          >
            Search
          </Button>
        </div>
      </div>
    </motion.form>
  );
}
