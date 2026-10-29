"use client";

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  categoryGradient,
  categoryIcon,
} from "@/lib/events/category-art";

type EventHeroImageProps = {
  src: string;
  category: string;
};

export function EventHeroImage({ src, category }: EventHeroImageProps) {
  const [failed, setFailed] = useState(false);
  const icon = categoryIcon(category);

  if (failed) {
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
        src={src}
        alt=""
        className="absolute inset-0 h-full w-full object-cover object-center"
        onError={() => setFailed(true)}
      />
      <div className="absolute inset-0 bg-ink/45" />
    </>
  );
}
