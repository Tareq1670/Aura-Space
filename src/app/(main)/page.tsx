import BrandPartners from "@/Components/Public/BrandPartners";
import FAQSection from "@/Components/Public/FAQSection";
import Hero from "@/Components/Public/hero";
import HowItWorks from "@/Components/Public/HowItWorks";
import NewsletterSubscribe from "@/Components/Public/NewsletterSubscribe";
import OurServices from "@/Components/Public/OurServices";
import Statistics from "@/Components/Public/Statistics";
import Testimonials from "@/Components/Public/Testimonials";


export default function Home() {
  return (
   <div>
      <Hero/>
      <BrandPartners/>
      <OurServices/>
      <HowItWorks/>
      <Statistics/>
      <Testimonials/>
      <FAQSection/>
      <NewsletterSubscribe/>
   </div>
  );
}
