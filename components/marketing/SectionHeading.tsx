type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
}: SectionHeadingProps) {
  const centered = align === "center";

  return (
    <header
      className={[
        "max-w-2xl",
        centered ? "mx-auto text-center" : "",
      ].join(" ")}
    >
      {eyebrow ? (
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">
          {eyebrow}
        </p>
      ) : null}
      <h2
        className={[
          "font-display text-3xl font-normal tracking-tight text-ink md:text-4xl",
          eyebrow ? "mt-2" : "",
        ].join(" ")}
      >
        {title}
      </h2>
      {description ? (
        <p
          className={[
            "mt-3 text-base leading-relaxed text-ink-muted md:text-lg",
            centered ? "mx-auto" : "",
          ].join(" ")}
        >
          {description}
        </p>
      ) : null}
    </header>
  );
}
