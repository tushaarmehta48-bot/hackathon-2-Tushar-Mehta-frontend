import Link from "next/link";

const VARIANTS = {
  nav: {
    className: "h-9 w-auto sm:h-10",
    showTagline: false,
  },
  hero: {
    className: "h-14 w-auto sm:h-16",
    showTagline: true,
  },
  footer: {
    className: "h-11 w-auto sm:h-12",
    showTagline: true,
  },
} as const;

type EventPulseLogoProps = {
  variant?: keyof typeof VARIANTS;
  href?: string | null;
  className?: string;
  /** Light wordmark on dark backgrounds (hero nav overlay) */
  onDark?: boolean;
};

function LogoSvg({
  className,
  showTagline,
  onDark,
}: {
  className: string;
  showTagline: boolean;
  onDark?: boolean;
}) {
  const eventFill = onDark ? "#ffffff" : "#006D77";
  const tagFill = onDark ? "rgba(255,255,255,0.75)" : "#5c6358";

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={showTagline ? "0 0 360 88" : "0 0 360 58"}
      fill="none"
      className={className}
      role="img"
      aria-hidden={false}
    >
      <title>EventPulse — Your ticketing platform</title>
      <defs>
        <linearGradient id="ep-teal" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#006D77" />
          <stop offset="100%" stopColor="#0a9396" />
        </linearGradient>
        <linearGradient id="ep-pulse" x1="0%" y1="50%" x2="100%" y2="50%">
          <stop offset="0%" stopColor="#7b4bb9" />
          <stop offset="50%" stopColor="#d85c41" />
          <stop offset="100%" stopColor="#e85d4c" />
        </linearGradient>
        <linearGradient id="ep-ticket" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#e85d4c" />
          <stop offset="100%" stopColor="#f4a261" />
        </linearGradient>
      </defs>
      <g transform="translate(4 8)">
        <path
          d="M8 36C8 20 22 8 38 8c10 0 18 4 24 12"
          stroke="url(#ep-teal)"
          strokeWidth="5"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M28 44h8l6-14 8 28 6-18h10"
          stroke="url(#ep-pulse)"
          strokeWidth="4.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <path
          d="M72 22h28c6 0 10 4 10 10v20c0 6-4 10-10 10H72V22z"
          fill="url(#ep-ticket)"
        />
        <circle cx="78" cy="32" r="2.5" fill="#fff" opacity="0.9" />
        <circle cx="78" cy="42" r="2.5" fill="#fff" opacity="0.9" />
        <circle cx="78" cy="52" r="2.5" fill="#fff" opacity="0.9" />
      </g>
      <text
        x="118"
        y="46"
        fontFamily="var(--font-dm-serif), Georgia, serif"
        fontSize="34"
        fill={eventFill}
      >
        Event
      </text>
      <text
        x="208"
        y="46"
        fontFamily="var(--font-dm-serif), Georgia, serif"
        fontSize="34"
        fill="url(#ep-ticket)"
      >
        Pulse
      </text>
      {showTagline ? (
        <text
          x="120"
          y="68"
          fontFamily="var(--font-manrope), system-ui, sans-serif"
          fontSize="9.5"
          fontWeight="600"
          letterSpacing="0.22em"
          fill={tagFill}
        >
          YOUR TICKETING PLATFORM
        </text>
      ) : null}
    </svg>
  );
}

export function EventPulseLogo({
  variant = "nav",
  href = "/",
  className = "",
  onDark = false,
}: EventPulseLogoProps) {
  const spec = VARIANTS[variant];

  const logo = (
    <LogoSvg
      className={[spec.className, className].join(" ")}
      showTagline={spec.showTagline}
      onDark={onDark}
    />
  );

  if (href) {
    return (
      <Link
        href={href}
        className="inline-flex shrink-0 items-center transition-opacity hover:opacity-90"
      >
        {logo}
      </Link>
    );
  }

  return logo;
}
