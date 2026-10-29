"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { SectionHeading } from "@/components/marketing/SectionHeading";
import { Button } from "@/components/ui/Button";
import { MARKETING_IMAGES } from "@/lib/constants/marketing-images";

const beliefs = [
  {
    image: MARKETING_IMAGES.aboutCrowd,
    alt: "Crowd cheering under stage lights",
    title: "Moments deserve a smooth path",
    body: "The best nights are not spent refreshing a cart or arguing at the door. Guests should feel welcomed from the first search to the last encore.",
  },
  {
    image: MARKETING_IMAGES.aboutWorkshop,
    alt: "Speaker addressing an engaged workshop room",
    title: "Organizers stay in control",
    body: "You set the capacity, the tiers, and the story. We help you publish with confidence and read the room as people arrive — without losing the human touch.",
  },
  {
    image: MARKETING_IMAGES.aboutCommunity,
    alt: "Friends laughing together at an outdoor gathering",
    title: "Community over clutter",
    body: "EventPulse is built for people who gather — not for endless menus and fine print. Clear listings, honest availability, and tickets that feel personal.",
  },
] as const;

const chapters = [
  {
    image: MARKETING_IMAGES.aboutFestival,
    alt: "Festival crowd with colorful lights",
    label: "For guests",
    title: "Find what moves you",
    body: "Browse by mood, city, or date. Save the plans that stick, book when you are ready, and walk in with a ticket that is unmistakably yours.",
  },
  {
    image: MARKETING_IMAGES.aboutVenue,
    alt: "Professional event hall prepared for guests",
    label: "For venues & hosts",
    title: "Open the doors with calm",
    body: "Whether you run a 200-seat salon or a multi-day festival, you deserve tools that respect your brand and your staff at the entrance.",
  },
  {
    image: MARKETING_IMAGES.aboutNightOut,
    alt: "City nightlife with warm street lighting",
    label: "For cities",
    title: "Keep local culture visible",
    body: "Independent shows, pop-ups, and neighborhood traditions deserve the same spotlight as arena tours. We help curious locals discover what is on tonight.",
  },
  {
    image: MARKETING_IMAGES.aboutCommunity,
    alt: "Group celebrating at a table",
    label: "For teams",
    title: "One place to align",
    body: "Marketing, operations, and front-of-house can share the same live picture — so nobody is surprised when the room fills up.",
  },
] as const;

function CoverPhoto({
  image,
  alt,
  className = "",
  priority = false,
}: {
  image: string;
  alt: string;
  className?: string;
  priority?: boolean;
}) {
  return (
    <div
      className={[
        "relative min-h-[12rem] overflow-hidden bg-surface-muted",
        className,
      ].join(" ")}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={image}
        alt={alt}
        className="absolute inset-0 h-full w-full object-cover object-center transition duration-700 ease-out hover:scale-[1.03]"
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        referrerPolicy="no-referrer"
      />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/30 via-transparent to-transparent"
        aria-hidden
      />
    </div>
  );
}

export function AboutPageContent() {
  const reduceMotion = useReducedMotion();

  const fade = (delay = 0) =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 18 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, margin: "-48px" },
          transition: { duration: 0.5, delay },
        };

  return (
    <>
      <section className="relative overflow-hidden border-b border-border/80 bg-surface">
        <div className="absolute inset-0" aria-hidden>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={MARKETING_IMAGES.aboutHero}
            alt=""
            className="h-full w-full object-cover object-center opacity-50"
            loading="eager"
            decoding="async"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-bg-milk/95 via-bg-milk/88 to-bg-milk" />
        <div className="relative mx-auto max-w-6xl px-6 pb-16 pt-12 md:pb-24 md:pt-16">
          <SectionHeading
            eyebrow="About EventPulse"
            title="Where live experiences feel effortless"
            description="We started with a simple frustration: too many great events were hidden behind confusing pages, stale counts, and stressful entry lines. EventPulse exists so the energy stays on stage — not in your inbox."
          />
          <motion.div
            className="mt-10 max-w-3xl space-y-5 text-base leading-relaxed text-ink-muted md:text-lg"
            {...fade(0.05)}
          >
            <p>
              Our team comes from nights spent in crowded halls, sunrise
              festivals, and quiet workshop rooms where every seat mattered. We
              built EventPulse for that mix of excitement and responsibility —
              the moment the lights dim and hundreds of stories walk through
              the same door.
            </p>
            <p>
              This is not a generic ticket widget. It is a companion for
              organizers who care about craft, and for guests who want to trust
              what they see online before they dress up and head out.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="border-b border-border/80 bg-bg-milk py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <SectionHeading
            eyebrow="What we believe"
            title="Hospitality, scaled with care"
            description="These principles shape every screen we design and every conversation we have with organizers."
            align="center"
          />
          <ul className="mt-12 grid gap-8 lg:grid-cols-3">
            {beliefs.map((item, index) => (
              <motion.li
                key={item.title}
                className="flex flex-col overflow-hidden rounded-[1.75rem] border border-border/80 bg-surface shadow-soft"
                {...fade(index * 0.08)}
              >
                <CoverPhoto
                  image={item.image}
                  alt={item.alt}
                  className="aspect-[4/3] min-h-0 w-full rounded-none"
                />
                <div className="flex flex-1 flex-col p-6 md:p-7">
                  <h3 className="font-display text-2xl text-ink">{item.title}</h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-muted md:text-base">
                    {item.body}
                  </p>
                </div>
              </motion.li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-b border-border/80 bg-surface py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <motion.div {...fade()}>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">
                Our story
              </p>
              <h2 className="mt-2 font-display text-3xl tracking-tight text-ink md:text-4xl">
                Born backstage, refined at the front door
              </h2>
              <div className="mt-6 space-y-4 text-base leading-relaxed text-ink-muted">
                <p>
                  EventPulse began when a small promoter asked a honest question:
                  “Why does buying a ticket feel harder than planning the show
                  itself?” We listened to box-office volunteers, touring artists,
                  and first-time attendees — then sketched flows that respect
                  every role in the room.
                </p>
                <p>
                  Today we partner with creators who host conferences, food
                  fairs, charity galas, and late-night sets. What ties them
                  together is pride in the experience they offer. We protect
                  that pride with clear communication, live availability, and
                  entry that feels like a greeting — not an interrogation.
                </p>
                <p>
                  Pulse, powered by ElevenLabs, is our voice and chat guide —
                  warm, direct, and focused on getting you to the right event,
                  never on jargon.
                </p>
              </div>
            </motion.div>
            <motion.div
              className="grid grid-cols-2 gap-4"
              {...fade(0.1)}
            >
              <CoverPhoto
                image={MARKETING_IMAGES.aboutFestival}
                alt="Outdoor festival at golden hour"
                className="col-span-2 aspect-[16/10] rounded-[1.75rem] shadow-soft ring-1 ring-border/80"
              />
              <CoverPhoto
                image={MARKETING_IMAGES.aboutNightOut}
                alt="Evening city scene"
                className="aspect-square rounded-[1.75rem] shadow-soft ring-1 ring-border/80"
              />
              <CoverPhoto
                image={MARKETING_IMAGES.aboutWorkshop}
                alt="Intimate learning session"
                className="aspect-square rounded-[1.75rem] shadow-soft ring-1 ring-border/80"
              />
            </motion.div>
          </div>
        </div>
      </section>

      <section className="border-b border-border/80 bg-bg-milk py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <SectionHeading
            eyebrow="Who we serve"
            title="Every kind of gathering, one respectful platform"
            description="EventPulse adapts to the tone of your event — from black-tie fundraisers to grassroots open-mic nights."
            align="center"
          />
          <ul className="mt-12 grid gap-6 sm:grid-cols-2">
            {chapters.map((chapter, index) => (
              <motion.li
                key={chapter.title}
                className="group grid overflow-hidden rounded-[1.75rem] border border-border/80 bg-surface shadow-soft sm:grid-cols-[minmax(0,42%)_1fr]"
                {...fade(index * 0.06)}
              >
                <CoverPhoto
                  image={chapter.image}
                  alt={chapter.alt}
                  className="min-h-[200px] w-full sm:min-h-full sm:h-full"
                />
                <div className="flex flex-col justify-center p-6 md:p-8">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
                    {chapter.label}
                  </p>
                  <h3 className="mt-2 font-display text-xl text-ink md:text-2xl">
                    {chapter.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-ink-muted md:text-base">
                    {chapter.body}
                  </p>
                </div>
              </motion.li>
            ))}
          </ul>
        </div>
      </section>

      <section className="relative overflow-hidden bg-ink py-16 text-white md:py-20">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_70%_at_0%_100%,rgba(45,156,148,0.35),transparent_55%)]"
          aria-hidden
        />
        <div className="relative mx-auto max-w-6xl px-6 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-accent-gold">
            Our promise
          </p>
          <blockquote className="mx-auto mt-4 max-w-3xl font-display text-2xl leading-snug tracking-tight md:text-3xl">
            “We will never treat your guests like traffic — and we will never
            treat your event like a SKU.”
          </blockquote>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/80">
            That line lives on our wall. It reminds us to choose clarity over
            cleverness, and human voices over automated noise. If you are
            planning something that brings people together, we would love to
            hear what you are building.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/contact">
              <Button type="button" className="rounded-full px-8">
                Get in touch
              </Button>
            </Link>
            <Link href="/events">
              <Button
                type="button"
                variant="secondary"
                className="rounded-full border-white/25 bg-white/10 px-8 text-white hover:bg-white/20"
              >
                Explore events
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
