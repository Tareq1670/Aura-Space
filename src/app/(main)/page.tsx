import dynamic from "next/dynamic";
import Hero from "@/Components/Public/hero";

const FeaturedSpaces = dynamic(() => import("@/Components/Public/FeaturedSpaces"), { ssr: true });
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