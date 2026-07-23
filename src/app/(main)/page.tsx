import type { Metadata } from "next";
import dynamic from "next/dynamic";
import Hero from "@/Components/Public/hero";

export const metadata: Metadata = {
  title: "Home",
  description: "Discover and book premium event spaces, venues, and properties for every occasion with AuraSpace.",
};

const FeaturedSpaces = dynamic(() => import("@/Components/Public/FeaturedSpaces"), { ssr: true });

const AIRecommendations = dynamic(() => import("@/Components/Public/AIRecommendations"));
const BrandPartners = dynamic(() => import("@/Components/Public/BrandPartners"), { ssr: true });
const OurServices = dynamic(() => import("@/Components/Public/OurServices"), { ssr: true });
const HowItWorks = dynamic(() => import("@/Components/Public/HowItWorks"), { ssr: true });
const Statistics = dynamic(() => import("@/Components/Public/Statistics"), { ssr: true });
const PopularDestinations = dynamic(() => import("@/Components/Public/PopularDestinations"), { ssr: true });
const Testimonials = dynamic(() => import("@/Components/Public/Testimonials"), { ssr: true });
const FAQSection = dynamic(() => import("@/Components/Public/FAQSection"), { ssr: true });
const NewsletterSubscribe = dynamic(() => import("@/Components/Public/NewsletterSubscribe"), { ssr: true });

export default function Home() {
  return (
    <div>
      <Hero />
      <FeaturedSpaces />
      <AIRecommendations />
      <BrandPartners />
      <OurServices />
      <HowItWorks />
      <Statistics />
      <PopularDestinations />
      <Testimonials />
      <FAQSection />
      <NewsletterSubscribe />
    </div>
  );
}