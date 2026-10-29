import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import {
  faBasketball,
  faChampagneGlasses,
  faCompactDisc,
  faHandshake,
  faLaptop,
  faMicrophoneLines,
  faMusic,
  faScrewdriverWrench,
} from "@fortawesome/free-solid-svg-icons";

export const EVENT_CATEGORIES = [
  { id: "conference", label: "Conferences", icon: faMicrophoneLines },
  { id: "workshop", label: "Workshops", icon: faScrewdriverWrench },
  { id: "festival", label: "Festivals", icon: faChampagneGlasses },
  { id: "networking", label: "Networking", icon: faHandshake },
  { id: "webinar", label: "Webinars", icon: faLaptop },
  { id: "concert", label: "Concerts", icon: faMusic },
  { id: "music", label: "Music", icon: faCompactDisc },
  { id: "sports", label: "Sports", icon: faBasketball },
] as const satisfies ReadonlyArray<{
  id: string;
  label: string;
  icon: IconDefinition;
}>;

/** Crowd dancing under concert lights (Unsplash). */
export const HERO_IMAGE =
  "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=2400&q=85";

export const HERO_IMAGE_ALT =
  "Silhouettes of people dancing at a live event under colorful stage lights";
