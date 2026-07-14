// app/page.tsx
import { Suspense } from "react";
import BrandPartners from "@/Components/Public/BrandPartners";
import FAQSection from "@/Components/Public/FAQSection";
import Hero from "@/Components/Public/hero";
import HowItWorks from "@/Components/Public/HowItWorks";
import NewsletterSubscribe from "@/Components/Public/NewsletterSubscribe";
import OurServices from "@/Components/Public/OurServices";
import Statistics from "@/Components/Public/Statistics";
import Testimonials from "@/Components/Public/Testimonials";
import HomePageSkeleton from "@/Components/Public/HomePageSkeleton";

export default function Home() {
  return (
    <Suspense fallback={<HomePageSkeleton />}>
      <div>
        <Hero />
        <BrandPartners />
        <OurServices />
        <HowItWorks />
        <Statistics />
        <Testimonials />
        <FAQSection />
        <NewsletterSubscribe />
      </div>
    </Suspense>
  );
}