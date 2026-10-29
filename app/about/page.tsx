import { AboutPageContent } from "@/components/marketing/AboutPageContent";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";
import { PublicNav } from "@/components/marketing/PublicNav";

export const metadata = {
  title: "About · EventPulse",
  description:
    "Learn why EventPulse exists — hospitality-first ticketing and discovery for organizers and guests who care about live experiences.",
};

export default function AboutPage() {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <PublicNav />
      <main className="flex-1">
        <AboutPageContent />
      </main>
      <MarketingFooter />
    </div>
  );
}
