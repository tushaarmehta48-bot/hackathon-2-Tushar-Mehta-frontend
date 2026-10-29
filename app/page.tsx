import { CategoryPills } from "@/components/marketing/CategoryPills";
import { HeroSection } from "@/components/marketing/HeroSection";
import { HomeFAQ } from "@/components/marketing/HomeFAQ";
import { HomeFeaturedEvents } from "@/components/marketing/HomeFeaturedEvents";
import { HomeHowItWorks } from "@/components/marketing/HomeHowItWorks";
import { HomeOrganizerCta } from "@/components/marketing/HomeOrganizerCta";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";
import { PublicNav } from "@/components/marketing/PublicNav";
import { SectionHeading } from "@/components/marketing/SectionHeading";
export default function Home() {
  return (
    <div className="flex min-h-full w-full max-w-full flex-1 flex-col overflow-x-clip">
      <div className="relative w-full max-w-full">
        <PublicNav variant="overlay" />
        <HeroSection />
      </div>

      <section className="relative border-b border-border/80 bg-surface py-16 md:py-20">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,rgba(216,92,65,0.06),transparent)]" />
        <div className="relative mx-auto max-w-6xl px-6">
          <SectionHeading
            eyebrow="Categories"
            title="Find your kind of night"
            description="Jump straight into conferences, festivals, concerts, and more — all with live availability."
          />
          <div className="mt-10">
            <CategoryPills />
          </div>
        </div>
      </section>

      <HomeFeaturedEvents />

      <HomeHowItWorks />
      <HomeFAQ />
      <HomeOrganizerCta />

      <MarketingFooter />
    </div>
  );
}
