"use client";

import { useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import {
  SearchFilterDropdown,
  useCloseSearchFilterDropdown,
} from "@/components/marketing/SearchFilterDropdown";
import {
  categoryLabel,
  EVENT_CATEGORIES,
  type CategoryFilterOption,
} from "@/lib/search-filters";

type CategoryFilterDropdownProps = {
  value: string;
  onChange: (value: string) => void;
  isHero?: boolean;
  className?: string;
};

function CategoryChip({
  item,
  selected,
  onSelect,
}: {
  item: CategoryFilterOption;
  selected: boolean;
  onSelect: () => void;
}) {
  const closeMenu = useCloseSearchFilterDropdown();

  return (
    <button
      type="button"
      role="option"
      aria-selected={selected}
      className={[
        "flex min-h-[2.75rem] items-center gap-2 rounded-xl px-2.5 py-2 text-left text-xs font-semibold transition sm:text-[13px]",
        selected
          ? "bg-primary text-on-primary shadow-sm"
          : "bg-bg-milk text-ink hover:bg-surface-muted",
      ].join(" ")}
      onClick={() => {
        onSelect();
        closeMenu();
      }}
    >
      {item.icon ? (
        <span
          className={[
            "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg",
            selected ? "bg-white/20" : "bg-primary/10 text-primary",
          ].join(" ")}
          aria-hidden
        >
          <FontAwesomeIcon icon={item.icon} className="h-3.5 w-3.5" />
        </span>
      ) : null}
      <span className="line-clamp-2 leading-tight">{item.label}</span>
    </button>
  );
}

export function CategoryFilterDropdown({
  value,
  onChange,
  isHero = true,
  className = "",
}: CategoryFilterDropdownProps) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return EVENT_CATEGORIES;
    return EVENT_CATEGORIES.filter((c) =>
      c.label.toLowerCase().includes(q),
    );
  }, [query]);

  const anyCategory = EVENT_CATEGORIES[0];
  const rest = filtered.filter((c) => c.value !== "");

  return (
    <SearchFilterDropdown
      label="Category"
      valueLabel={categoryLabel(value)}
      panelTitle="Event type"
      isHero={isHero}
      className={className}
      menuWidthClass="w-[min(100%,22rem)] min-w-[13rem]"
      align="left"
    >
      <div className="border-b border-border/70 px-3 py-2.5">
        <label className="relative block">
          <FontAwesomeIcon
            icon={faMagnifyingGlass}
            className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink-subtle"
            aria-hidden
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search categories…"
            className="w-full rounded-xl border border-border bg-bg-milk py-2 pl-9 pr-3 text-sm text-ink outline-none ring-primary/30 placeholder:text-ink-subtle focus:ring-2"
            aria-label="Filter categories"
          />
        </label>
      </div>

      <div className="filter-dropdown-scroll max-h-[min(16rem,48vh)] overflow-y-auto overscroll-contain px-2 py-2">
        {anyCategory && (query === "" || anyCategory.label.toLowerCase().includes(query.toLowerCase())) ? (
          <div className="mb-2 px-0.5">
            <CategoryChip
              item={anyCategory}
              selected={value === ""}
              onSelect={() => onChange("")}
            />
          </div>
        ) : null}

        {rest.length > 0 ? (
          <div
            className="grid grid-cols-2 gap-1.5"
            role="listbox"
            aria-label="Categories"
          >
            {rest.map((item) => (
              <CategoryChip
                key={item.value}
                item={item}
                selected={value === item.value}
                onSelect={() => onChange(item.value)}
              />
            ))}
          </div>
        ) : (
          <p className="px-2 py-6 text-center text-sm text-ink-muted">
            No categories match “{query.trim()}”.
          </p>
        )}
      </div>
    </SearchFilterDropdown>
  );
}
