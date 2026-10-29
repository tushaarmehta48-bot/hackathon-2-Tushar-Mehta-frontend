import { ContactPageContent } from "@/components/marketing/ContactPageContent";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";
import { PublicNav } from "@/components/marketing/PublicNav";

export const metadata = {
  title: "Contact · EventPulse",
  description:
    "Contact EventPulse for organizer onboarding, guest support, partnerships, and press — we respond within one business day.",
};

export default function ContactPage() {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <PublicNav />
      <main className="flex-1">
        <ContactPageContent />
      </main>
      <MarketingFooter />
    </div>
  );
}
