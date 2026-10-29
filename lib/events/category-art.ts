import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { faCalendarDays } from "@fortawesome/free-solid-svg-icons";
import { EVENT_CATEGORIES } from "@/lib/constants/categories";

const gradients: Record<string, string> = {
  conference: "from-[#1e3a5f] via-[#2d5a87] to-primary/90",
  workshop: "from-ink via-[#3d4a3a] to-accent-gold/70",
  festival: "from-[#5c2d6e] via-primary to-[#e85d4c]",
  networking: "from-brand-teal via-[#006d77] to-[#4a6670]",
  webinar: "from-[#2a2d3a] via-[#4b5563] to-primary/80",
  concert: "from-ink via-[#4a1942] to-primary",
  music: "from-[#2d1b4e] via-[#5b2a86] to-primary/90",
  sports: "from-[#0d3b2e] via-brand-teal to-[#1a5c45]",
};

export function categoryGradient(category: string): string {
  return gradients[category] ?? "from-ink via-primary/80 to-accent-gold/80";
}

export function categoryIcon(category: string): IconDefinition {
  const found = EVENT_CATEGORIES.find((c) => c.id === category);
  return found?.icon ?? faCalendarDays;
}

export function categoryLabel(category: string): string {
  const found = EVENT_CATEGORIES.find((c) => c.id === category);
  if (found) return found.label;
  return category.charAt(0).toUpperCase() + category.slice(1);
}
