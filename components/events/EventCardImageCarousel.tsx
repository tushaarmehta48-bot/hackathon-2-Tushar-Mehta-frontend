"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import {
  categoryGradient,
  categoryIcon,
} from "@/lib/events/category-art";

type EventCardImageCarouselProps = {
  eventId: string;
  images: string[];
  category: string;
  title: string;
};

export function EventCardImageCarousel({
  eventId,
  images,
  category,
  title,
}: EventCardImageCarouselProps) {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const hasImages = images.length > 0;
  const multiple = images.length > 1;
  const safeIndex = hasImages ? index % images.length : 0;
  const icon = categoryIcon(category);

  const goDetail = useCallback(() => {
    router.push(`/events/${eventId}`);
  }, [eventId, router]);

  function prev(e: React.MouseEvent) {
    e.stopPropagation();
    e.preventDefault();
    setIndex((i) => (i - 1 + images.length) % images.length);
  }

  function next(e: React.MouseEvent) {
    e.stopPropagation();
    e.preventDefault();
    setIndex((i) => (i + 1) % images.length);
  }

  return (
    <div
      className="relative h-full w-full cursor-pointer"
      role="link"
      tabIndex={0}
      onClick={goDetail}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          goDetail();
        }
      }}
      aria-label={`View ${title}`}
    >
      {hasImages ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={images[safeIndex]}
          src={images[safeIndex]}
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-center transition duration-500 ease-out group-hover:scale-[1.02]"
          loading="lazy"
          decoding="async"
        />
      ) : (
        <div
          className={[
            "absolute inset-0 bg-gradient-to-br",
            categoryGradient(category),
          ].join(" ")}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="flex h-20 w-20 items-center justify-center rounded-full border border-white/25 bg-white/10 text-3xl text-white/90 backdrop-blur-sm sm:h-24 sm:w-24">
              <FontAwesomeIcon icon={icon} className="h-9 w-9 sm:h-10 sm:w-10" />
            </span>
          </div>
        </div>
      )}

      {multiple ? (
        <>
          <button
            type="button"
            aria-label="Previous image"
            className="absolute left-2 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-ink/55 text-white shadow-md backdrop-blur-sm transition hover:bg-ink/75 sm:h-10 sm:w-10"
            onClick={prev}
          >
            <FontAwesomeIcon icon={faChevronLeft} className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            aria-label="Next image"
            className="absolute right-2 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-ink/55 text-white shadow-md backdrop-blur-sm transition hover:bg-ink/75 sm:h-10 sm:w-10"
            onClick={next}
          >
            <FontAwesomeIcon icon={faChevronRight} className="h-3.5 w-3.5" />
          </button>
          <div className="absolute right-14 top-14 z-20 flex gap-1.5 sm:top-16">
            {images.map((_, i) => (
              <span
                key={i}
                className={[
                  "h-1.5 rounded-full transition-all",
                  i === safeIndex ? "w-5 bg-white" : "w-1.5 bg-white/45",
                ].join(" ")}
                aria-hidden
              />
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}
