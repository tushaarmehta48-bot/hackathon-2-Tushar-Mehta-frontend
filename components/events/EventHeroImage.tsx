"use client";

import { useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  categoryGradient,
  categoryIcon,
} from "@/lib/events/category-art";

type EventHeroImageProps = {
  src: string;
  fallbackSrcs?: string[];
  category: string;
};

export function EventHeroImage({
  src,
  fallbackSrcs = [],
  category,
}: EventHeroImageProps) {
  const [failedUrls, setFailedUrls] = useState<Set<string>>(() => new Set());
  const icon = categoryIcon(category);

  const candidates = useMemo(() => {
    const list = [src, ...fallbackSrcs].filter(Boolean);
    return [...new Set(list)];
  }, [src, fallbackSrcs]);

  const activeSrc = candidates.find((u) => !failedUrls.has(u));

  if (!activeSrc) {
    return (
      <div
        className={[
          "absolute inset-0 bg-gradient-to-br",
          categoryGradient(category),
        ].join(" ")}
      >
        <div className="absolute inset-0 flex items-center justify-center opacity-40">
          <FontAwesomeIcon icon={icon} className="h-32 w-32 text-white/30" />
        </div>
      </div>
    );
  }

  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        key={activeSrc}
        src={activeSrc}
        alt=""
        className="absolute inset-0 h-full w-full object-cover object-center"
        onError={() => {
          setFailedUrls((prev) => {
            if (prev.has(activeSrc)) return prev;
            const next = new Set(prev);
            next.add(activeSrc);
            return next;
          });
        }}
      />
      <div className="absolute inset-0 bg-ink/45" />
    </>
  );
}
