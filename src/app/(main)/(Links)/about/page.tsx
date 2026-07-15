"use client";

import React, { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useTransform,
  type Variants,
} from "framer-motion";

const stats = [
  { value: "1,200+", label: "Stays & Venues" },
  { value: "25,000+", label: "Happy Guests" },
  { value: "450+", label: "Active Hosts" },
  { value: "1,800+", label: "Successful Events" },
];

const missionPoints = [
  "Verified premium listings",
  "Local Bangladeshi hosts",
  "Event venue customization",
  "Transparent pricing model",
  "Secure booking payments",
  "24/7 dedicated support",
];

const values = [
  {
    title: "Trust & Verification",
    description:
      "Every property, venue, and host is manually verified before being listed. We personally check photos, amenities, pricing, and quality to ensure guests always get exactly what they book.",
    icon: (
      <svg
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
        />
      </svg>
    ),
  },
  {
    title: "Premium Experience",
    description:
      "From luxury resorts to boutique homestays and elegant event venues — we curate only the finest spaces to deliver refined, memorable, and truly premium guest experiences.",
    icon: (
      <svg
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
        />
      </svg>
    ),
  },
  {
    title: "Secure Payments",
    description:
      "Our secure checkout process ensures your payment information is protected with modern encryption standards, giving you complete peace of mind on every transaction.",
    icon: (
      <svg
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 15v2m-6 4h12a2 2 0 002-2V9a2 2 0 00-2-2h-1V5a5 5 0 00-10 0v2H6a2 2 0 00-2 2v10a2 2 0 002 2z"
        />
      </svg>
    ),
  },
  {
    title: "Complete Customization",
    description:
      "Add curated event add-ons like decorations, catering, and floral setups directly at checkout. AuraSpace is more than booking — it&apos;s effortless event planning.",
    icon: (
      <svg
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.898 20.572L16.5 21.75l-.398-1.178a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.179-.398a2.25 2.25 0 001.423-1.423l.398-1.178.398 1.178a2.25 2.25 0 001.423 1.423l1.179.398-1.179.398a2.25 2.25 0 00-1.423 1.423z"
        />
      </svg>
    ),
  },
];

const offerings = [
  {
    category: "Stays",
    title: "Premium Places to Stay",
    description:
      "Book luxury hotels, boutique resorts, cozy homestays, and premium flats across Bangladesh with verified quality standards.",
    items: ["Luxury Hotels", "Premium Resorts", "Cozy Homestays", "Modern Flats"],
    icon: (
      <svg
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
        />
      </svg>
    ),
  },
  {
    category: "Events",
    title: "Exclusive Event Venues",
    description:
      "Reserve premium venues for weddings, birthdays, anniversaries, corporate meetings, and celebrations of every scale.",
    items: [
      "Birthday Party Halls",
      "Marriage & Anniversary Lawns",
      "Conference Rooms",
      "Corporate Event Spots",
    ],
    icon: (
      <svg
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0l-3-3m3 3l3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
        />
      </svg>
    ),
  },
  {
    category: "Add-Ons",
    title: "Customized Event Add-Ons",
    description:
      "Enhance your stay or event with curated services — decoration, catering, floral setup, and photography — all bookable in one place.",
    items: [
      "Special Day Decoration",
      "Catering Services",
      "Floral Setup",
      "Photography Packages",
    ],
    icon: (
      <svg
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1114.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
        />
      </svg>
    ),
  },
];

const differentiators = [
  {
    title: "Stays + Event Venues in One Platform",
    description:
      "Unlike Airbnb or Booking.com, AuraSpace lets you book both a place to stay AND premium event venues in a single, unified experience.",
  },
  {
    title: "Special Day Customization",
    description:
      "Add balloon decorations for birthdays, floral setups for anniversaries, or catering for corporate events — all directly during checkout.",
  },
  {
    title: "Verified Local Hosts",
    description:
      "Our host network is carefully verified — trusted Bangladeshi property owners and venue managers committed to premium hospitality.",
  },
  {
    title: "Flexible Host Category Controls",
    description:
      "Hosts choose exactly how to list their space — as a Homestay, Hotel, Event Venue, or Multi-Purpose Property with tailored pricing.",
  },
  {
    title: "Transparent Local Pricing",
    description:
      "Bangladeshi Taka pricing with no hidden fees. See total booking cost including add-ons, taxes, and service charges upfront.",
  },
  {
    title: "Curated Premium Standards",
    description:
      "Every listing goes through a strict quality check — from photos to pricing to amenities — ensuring premium consistency across the platform.",
  },
];

const milestones = [
  {
    year: "2024",
    title: "The Beginning",
    description:
      "AuraSpace was founded in Dhaka, Bangladesh with a clear vision — to build a premium platform where guests could book stays and event venues seamlessly with customization options.",
  },
  {
    year: "2024",
    title: "First Milestones",
    description:
      "Onboarded the first 450+ verified hosts across major Bangladeshi cities. Launched core stay booking with premium event venue support and add-on customization features.",
  },
  {
    year: "2025",
    title: "Growing Community",
    description:
      "Reached 25,000+ happy guests and 1,800+ successfully hosted events. Introduced enhanced host tools, guest reviews, and improved search experience.",
  },
  {
    year: "Future",
    title: "Global Vision",
    description:
      "Committed to expanding beyond Bangladesh, introducing AI-powered recommendations, virtual venue tours, and reaching global premium travelers and event organizers.",
  },
];

const howItWorks = [
  {
    step: "01",
    title: "Discover",
    description:
      "Browse verified stays and event venues across Bangladesh with smart filters for location, dates, and price.",
  },
  {
    step: "02",
    title: "Customize",
    description:
      "Choose your booking and add optional services — decoration, catering, or floral setup for events.",
  },
  {
    step: "03",
    title: "Book Securely",
    description:
      "Confirm your booking with real-time availability and secure Bangladeshi payment methods.",
  },
  {
    step: "04",
    title: "Enjoy",
    description:
      "Arrive and enjoy your premium stay or event with dedicated host support and full customization.",
  },
];

const guarantees = [
  {
    title: "Verified Quality",
    text: "Every stay, venue, and host manually reviewed to premium standards.",
  },
  {
    title: "Transparent Pricing",
    text: "No hidden charges. See total booking price with add-ons upfront.",
  },
  {
    title: "Secure Transactions",
    text: "Modern encryption and trusted payment gateways for every booking.",
  },
  {
    title: "Instant Confirmation",
    text: "Real-time booking confirmation with full stay and host details.",
  },
];

const testimonials = [
  {
    quote:
      "AuraSpace made booking our wedding venue effortless. The decoration add-on saved us so much planning time — everything was premium and organized.",
    name: "Nadia Rahman",
    role: "Event Organizer, Dhaka",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=faces&auto=format&q=80",
  },
  {
    quote:
      "As a host, AuraSpace gave me tools to list both my homestay and event lawn. My bookings and guest quality both improved significantly.",
    name: "Karim Hasan",
    role: "Verified Host, Sylhet",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=faces&auto=format&q=80",
  },
  {
    quote:
      "Booked a birthday hall with balloon decorations and catering — everything through one platform. Truly a premium experience for my family.",
    name: "Priya Ahmed",
    role: "Corporate Traveler, Chittagong",
    image:
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200&h=200&fit=crop&crop=faces&auto=format&q=80",
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.06,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 28, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.75,
      ease: [0.16, 1, 0.3, 1],
      type: "tween",
    },
  },
};

export default function AboutPage() {
  const reduceMotion = !!useReducedMotion();
  const heroRef = useRef<HTMLElement>(null);
  const missionRef = useRef<HTMLElement>(null);
  const offeringsRef = useRef<HTMLElement>(null);
  const valuesRef = useRef<HTMLElement>(null);
  const differentiatorsRef = useRef<HTMLElement>(null);
  const howRef = useRef<HTMLElement>(null);
  const storyRef = useRef<HTMLElement>(null);
  const guaranteeRef = useRef<HTMLElement>(null);
  const testimonialRef = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLElement>(null);

  const isMissionInView = useInView(missionRef, { once: true, margin: "-80px" });
  const isOfferingsInView = useInView(offeringsRef, { once: true, margin: "-80px" });
  const isValuesInView = useInView(valuesRef, { once: true, margin: "-80px" });
  const isDifferentiatorsInView = useInView(differentiatorsRef, { once: true, margin: "-80px" });
  const isHowInView = useInView(howRef, { once: true, margin: "-80px" });
  const isStoryInView = useInView(storyRef, { once: true, margin: "-80px" });
  const isGuaranteeInView = useInView(guaranteeRef, { once: true, margin: "-80px" });
  const isTestimonialInView = useInView(testimonialRef, { once: true, margin: "-80px" });
  const isCtaInView = useInView(ctaRef, { once: true, margin: "-80px" });

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.3]);

  return (
    <main className="w-full bg-white">
      <section
        ref={heroRef}
        className="relative w-full overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 py-20 sm:py-24 lg:py-32"
      >
        <motion.div
          className="absolute inset-0"
          style={{ y: heroY, opacity: heroOpacity }}
        >
          <div className="absolute -left-24 top-10 h-[400px] w-[400px] rounded-full bg-indigo-500/15 blur-3xl" />
          <div className="absolute -right-24 bottom-10 h-[400px] w-[400px] rounded-full bg-violet-500/15 blur-3xl" />
          <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/5 blur-3xl" />
        </motion.div>

        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.5) 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
        />

        <div className="container relative mx-auto w-full px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="mx-auto max-w-3xl text-center"
          >
            

            <motion.h1
              variants={itemVariants}
              className="text-[32px] font-black leading-[1.05] tracking-[-0.035em] text-white sm:text-5xl md:text-[56px] lg:text-6xl"
            >
              Where Premium Stays Meet{" "}
              <span className="bg-gradient-to-r from-indigo-300 via-violet-300 to-indigo-200 bg-clip-text text-transparent">
                Unforgettable Events
              </span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="mx-auto mt-6 max-w-2xl text-base leading-[1.8] text-white/60 sm:text-lg"
            >
              AuraSpace is a Bangladesh-based premium booking platform where
              travelers, families, and event organizers discover verified
              stays, book exclusive event venues, and add custom services —
              all in one seamless experience.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
            >
              <motion.div
                whileHover={
                  reduceMotion
                    ? undefined
                    : {
                        scale: 1.04,
                        boxShadow: "0 12px 32px rgba(99,102,241,0.30)",
                      }
                }
                whileTap={reduceMotion ? undefined : { scale: 0.97 }}
              >
                <Link
                  href="/listings"
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-500 to-violet-600 px-7 py-3 text-[11px] font-extrabold uppercase tracking-[0.16em] text-white shadow-[0_12px_30px_rgba(99,102,241,0.25)] transition-all duration-300 hover:from-indigo-600 hover:to-violet-700"
                >
                  Explore Listings
                  <svg
                    className="h-3.5 w-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </Link>
              </motion.div>

              <motion.div
                whileHover={reduceMotion ? undefined : { scale: 1.04 }}
                whileTap={reduceMotion ? undefined : { scale: 0.97 }}
              >
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-7 py-3 text-[11px] font-extrabold uppercase tracking-[0.16em] text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/[0.12]"
                >
                  Get in Touch
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto mt-16 grid max-w-4xl grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4"
          >
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  delay: 0.6 + i * 0.08,
                  ease: [0.16, 1, 0.3, 1],
                }}
                whileHover={reduceMotion ? undefined : { y: -4, scale: 1.02 }}
                className="rounded-2xl border border-white/10 bg-white/[0.06] p-4 text-center backdrop-blur-sm transition-all duration-300 hover:border-indigo-400/30 hover:bg-white/[0.10] sm:p-5"
              >
                <div className="text-2xl font-black tracking-tight text-white sm:text-3xl">
                  <span className="bg-gradient-to-r from-indigo-300 to-violet-300 bg-clip-text text-transparent">
                    {stat.value}
                  </span>
                </div>
                <div className="mt-1 text-[10px] font-bold uppercase tracking-[0.14em] text-white/50 sm:text-[11px]">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section
        ref={missionRef}
        className="relative w-full overflow-hidden bg-white py-16 sm:py-20 lg:py-24"
      >
        <div className="absolute inset-0">
          <div className="absolute -left-24 top-10 h-[300px] w-[300px] rounded-full bg-indigo-50/80 blur-3xl" />
          <div className="absolute -right-24 bottom-10 h-[300px] w-[300px] rounded-full bg-violet-50/80 blur-3xl" />
        </div>

        <div className="container relative mx-auto w-full px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            animate={isMissionInView ? "visible" : "hidden"}
            variants={containerVariants}
            className="grid gap-10 lg:grid-cols-2 lg:gap-14 lg:items-center"
          >
            <motion.div variants={itemVariants}>

              <h2 className="mt-5 text-3xl font-black leading-[1.1] tracking-[-0.03em] text-slate-950 sm:text-4xl md:text-[42px]">
                Redefining Premium Hospitality in{" "}
                <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 bg-clip-text text-transparent">
                  Bangladesh
                </span>
              </h2>

              <p className="mt-5 text-[15px] leading-[1.85] text-slate-500">
                At AuraSpace, we believe booking should be more than just
                reserving a room — it should be an experience. Our mission is
                to connect Bangladeshi travelers, families, and event
                organizers with the country&apos;s most trusted stays and
                venues, all with the option to customize every detail.
              </p>

              <p className="mt-4 text-[15px] leading-[1.85] text-slate-500">
                Whether you&apos;re booking a luxury resort in Cox&apos;s
                Bazar, planning a wedding at a garden venue, or organizing a
                corporate meeting in Dhaka — AuraSpace makes every step
                effortless, transparent, and genuinely premium.
              </p>

              <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {missionPoints.map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                  >
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 shadow-sm">
                      <svg
                        className="h-3 w-3 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2.5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M4.5 12.75l6 6 9-13.5"
                        />
                      </svg>
                    </div>
                    <span className="text-sm font-semibold text-slate-700">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="relative">
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[28px] border border-slate-200 shadow-[0_24px_60px_rgba(15,23,42,0.10)]">
                <Image
                  src="https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=1000&fit=crop&auto=format&q=80"
                  alt="AuraSpace premium property"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />

                <div className="absolute bottom-6 left-6 right-6">
                  <div className="rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-xl">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-md">
                        <svg
                          className="h-5 w-5 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                          />
                        </svg>
                      </div>
                      <div>
                        <div className="text-sm font-black text-white">
                          Based in Dhaka
                        </div>
                        <div className="text-xs text-white/70">
                          Serving all of Bangladesh
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <motion.div
                animate={reduceMotion ? undefined : { y: [0, -8, 0] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  type: "tween",
                }}
                className="absolute -right-4 -top-4 hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-xl sm:block"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-md">
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                      />
                    </svg>
                  </div>
                  <div>
                    <div className="text-xl font-black text-slate-950">4.9★</div>
                    <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                      Guest Rating
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section
        ref={offeringsRef}
        className="relative w-full overflow-hidden bg-gradient-to-b from-white via-slate-50/40 to-white py-16 sm:py-20 lg:py-24"
      >
        <div className="container relative mx-auto w-full px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            animate={isOfferingsInView ? "visible" : "hidden"}
            variants={containerVariants}
            className="mx-auto mb-12 max-w-2xl text-center sm:mb-14"
          >


            <motion.h2
              variants={itemVariants}
              className="mt-5 text-3xl font-black leading-[1.1] tracking-[-0.03em] text-slate-950 sm:text-4xl md:text-[42px]"
            >
              Two Core Services,{" "}
              <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 bg-clip-text text-transparent">
                One Premium Platform
              </span>
            </motion.h2>

            <motion.p
              variants={itemVariants}
              className="mt-4 text-sm leading-relaxed text-slate-500 sm:text-[15px]"
            >
              Book premium stays and exclusive event venues — with the option
              to add custom services and make every occasion unforgettable.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            animate={isOfferingsInView ? "visible" : "hidden"}
            variants={containerVariants}
            className="grid grid-cols-1 gap-5 sm:gap-6 lg:grid-cols-3"
          >
            {offerings.map((offering, i) => (
              <motion.div
                key={offering.title}
                variants={itemVariants}
                whileHover={
                  reduceMotion
                    ? undefined
                    : {
                        y: -6,
                        transition: {
                          type: "spring",
                          stiffness: 260,
                          damping: 22,
                        },
                      }
                }
                className="group relative flex h-full flex-col overflow-hidden rounded-[24px] border border-slate-200 bg-white p-6 shadow-[0_1px_3px_rgba(15,23,42,0.04)] transition-all duration-500 hover:border-indigo-200 hover:shadow-[0_20px_50px_rgba(99,102,241,0.08)]"
              >
                <div className="flex items-center gap-3">
                  <motion.div
                    whileHover={
                      reduceMotion
                        ? undefined
                        : {
                            scale: 1.06,
                            rotate: 3,
                            transition: {
                              type: "spring",
                              stiffness: 360,
                              damping: 18,
                            },
                          }
                    }
                    className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-md shadow-indigo-500/20"
                  >
                    {!reduceMotion && (
                      <motion.span
                        className="absolute inset-0 rounded-2xl border border-white/25"
                        animate={{ scale: [1, 1.15], opacity: [0.4, 0] }}
                        transition={{
                          duration: 2.2,
                          repeat: Infinity,
                          ease: "easeOut",
                          type: "tween",
                          delay: i * 0.2,
                        }}
                      />
                    )}
                    {offering.icon}
                  </motion.div>

                  <div className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1">
                    <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-indigo-700">
                      {offering.category}
                    </span>
                  </div>
                </div>

                <h3 className="mt-5 text-lg font-black leading-tight tracking-[-0.02em] text-slate-950 sm:text-xl">
                  {offering.title}
                </h3>

                <p className="mt-3 text-[13px] leading-[1.75] text-slate-500">
                  {offering.description}
                </p>

                <ul className="mt-5 space-y-2 border-t border-slate-100 pt-4">
                  {offering.items.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-[13px] text-slate-600">
                      <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-indigo-50">
                        <svg
                          className="h-2.5 w-2.5 text-indigo-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="3"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M4.5 12.75l6 6 9-13.5"
                          />
                        </svg>
                      </div>
                      <span className="font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section
        ref={differentiatorsRef}
        className="relative w-full overflow-hidden bg-white py-16 sm:py-20 lg:py-24"
      >
        <div className="container relative mx-auto w-full px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            animate={isDifferentiatorsInView ? "visible" : "hidden"}
            variants={containerVariants}
            className="mx-auto mb-12 max-w-2xl text-center sm:mb-14"
          >

            <motion.h2
              variants={itemVariants}
              className="mt-5 text-3xl font-black leading-[1.1] tracking-[-0.03em] text-slate-950 sm:text-4xl md:text-[42px]"
            >
              What Makes Us{" "}
              <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 bg-clip-text text-transparent">
                Different
              </span>
            </motion.h2>

            <motion.p
              variants={itemVariants}
              className="mt-4 text-sm leading-relaxed text-slate-500 sm:text-[15px]"
            >
              We&apos;re not just another booking site. Here&apos;s what sets
              AuraSpace apart from Airbnb, Booking.com, and traditional hotel
              platforms.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            animate={isDifferentiatorsInView ? "visible" : "hidden"}
            variants={containerVariants}
            className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3"
          >
            {differentiators.map((item, i) => (
              <motion.div
                key={item.title}
                variants={itemVariants}
                whileHover={
                  reduceMotion
                    ? undefined
                    : {
                        y: -6,
                        transition: {
                          type: "spring",
                          stiffness: 260,
                          damping: 22,
                        },
                      }
                }
                className="group relative flex h-full flex-col overflow-hidden rounded-[24px] border border-slate-200 bg-white p-6 shadow-[0_1px_3px_rgba(15,23,42,0.04)] transition-all duration-500 hover:border-indigo-200 hover:shadow-[0_20px_50px_rgba(99,102,241,0.08)]"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-md shadow-indigo-500/20">
                    <span className="text-xs font-black">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <h3 className="text-base font-black leading-tight tracking-[-0.02em] text-slate-950 sm:text-[17px]">
                    {item.title}
                  </h3>
                </div>

                <p className="mt-4 flex-1 text-[13px] leading-[1.75] text-slate-500">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section
        ref={valuesRef}
        className="relative w-full overflow-hidden bg-gradient-to-b from-white via-slate-50/40 to-white py-16 sm:py-20 lg:py-24"
      >
        <div className="container relative mx-auto w-full px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            animate={isValuesInView ? "visible" : "hidden"}
            variants={containerVariants}
            className="mx-auto mb-12 max-w-2xl text-center sm:mb-14"
          >


            <motion.h2
              variants={itemVariants}
              className="mt-5 text-3xl font-black leading-[1.1] tracking-[-0.03em] text-slate-950 sm:text-4xl md:text-[42px]"
            >
              What We{" "}
              <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 bg-clip-text text-transparent">
                Stand For
              </span>
            </motion.h2>

            <motion.p
              variants={itemVariants}
              className="mt-4 text-sm leading-relaxed text-slate-500 sm:text-[15px]"
            >
              The principles that guide every listing, every booking, and
              every experience on AuraSpace.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            animate={isValuesInView ? "visible" : "hidden"}
            variants={containerVariants}
            className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4"
          >
            {values.map((value, i) => (
              <motion.div
                key={value.title}
                variants={itemVariants}
                whileHover={
                  reduceMotion
                    ? undefined
                    : {
                        y: -6,
                        transition: {
                          type: "spring",
                          stiffness: 260,
                          damping: 22,
                        },
                      }
                }
                className="group relative flex h-full flex-col overflow-hidden rounded-[24px] border border-slate-200 bg-white p-6 shadow-[0_1px_3px_rgba(15,23,42,0.04)] transition-all duration-500 hover:border-indigo-200 hover:shadow-[0_20px_50px_rgba(99,102,241,0.08)]"
              >
                <motion.div
                  whileHover={
                    reduceMotion
                      ? undefined
                      : {
                          scale: 1.06,
                          rotate: 3,
                          transition: {
                            type: "spring",
                            stiffness: 360,
                            damping: 18,
                          },
                        }
                  }
                  className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-md shadow-indigo-500/20"
                >
                  {!reduceMotion && (
                    <motion.span
                      className="absolute inset-0 rounded-2xl border border-white/25"
                      animate={{ scale: [1, 1.15], opacity: [0.4, 0] }}
                      transition={{
                        duration: 2.2,
                        repeat: Infinity,
                        ease: "easeOut",
                        type: "tween",
                        delay: i * 0.2,
                      }}
                    />
                  )}
                  {value.icon}
                </motion.div>

                <h3 className="mt-5 text-lg font-black leading-tight tracking-[-0.02em] text-slate-950">
                  {value.title}
                </h3>

                <p className="mt-2.5 flex-1 text-[13px] leading-[1.75] text-slate-500">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section
        ref={howRef}
        className="relative w-full overflow-hidden bg-white py-16 sm:py-20 lg:py-24"
      >
        <div className="container relative mx-auto w-full px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            animate={isHowInView ? "visible" : "hidden"}
            variants={containerVariants}
            className="mx-auto mb-12 max-w-2xl text-center sm:mb-14"
          >


            <motion.h2
              variants={itemVariants}
              className="mt-5 text-3xl font-black leading-[1.1] tracking-[-0.03em] text-slate-950 sm:text-4xl md:text-[42px]"
            >
              Booking Made{" "}
              <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 bg-clip-text text-transparent">
                Effortless
              </span>
            </motion.h2>

            <motion.p
              variants={itemVariants}
              className="mt-4 text-sm leading-relaxed text-slate-500 sm:text-[15px]"
            >
              From discovery to check-in, everything happens in four simple
              steps.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            animate={isHowInView ? "visible" : "hidden"}
            variants={containerVariants}
            className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4"
          >
            {howItWorks.map((step) => (
              <motion.div
                key={step.step}
                variants={itemVariants}
                whileHover={reduceMotion ? undefined : { y: -6 }}
                className="group relative flex h-full flex-col overflow-hidden rounded-[24px] border border-slate-200 bg-white p-6 shadow-[0_1px_3px_rgba(15,23,42,0.04)] transition-all duration-500 hover:border-indigo-200 hover:shadow-[0_20px_50px_rgba(99,102,241,0.08)]"
              >
                <span className="bg-gradient-to-br from-indigo-500 to-violet-500 bg-clip-text text-[48px] font-black leading-none tracking-[-0.06em] text-transparent opacity-15 transition-opacity duration-500 group-hover:opacity-30">
                  {step.step}
                </span>

                <h3 className="mt-4 text-lg font-black leading-tight tracking-[-0.02em] text-slate-950">
                  {step.title}
                </h3>

                <p className="mt-2.5 flex-1 text-[13px] leading-[1.75] text-slate-500">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section
        ref={storyRef}
        className="relative w-full overflow-hidden bg-gradient-to-b from-white via-slate-50/40 to-white py-16 sm:py-20 lg:py-24"
      >
        <div className="container relative mx-auto w-full px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            animate={isStoryInView ? "visible" : "hidden"}
            variants={containerVariants}
            className="mx-auto mb-12 max-w-2xl text-center sm:mb-14"
          >


            <motion.h2
              variants={itemVariants}
              className="mt-5 text-3xl font-black leading-[1.1] tracking-[-0.03em] text-slate-950 sm:text-4xl md:text-[42px]"
            >
              The AuraSpace{" "}
              <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 bg-clip-text text-transparent">
                Story
              </span>
            </motion.h2>

            <motion.p
              variants={itemVariants}
              className="mt-4 text-sm leading-relaxed text-slate-500 sm:text-[15px]"
            >
              From a simple idea in Dhaka to a trusted premium booking
              platform serving thousands of guests and hosts across Bangladesh.
            </motion.p>
          </motion.div>

          <div className="relative">
            <div className="absolute left-6 top-0 hidden h-full w-px bg-gradient-to-b from-indigo-200 via-violet-200 to-indigo-200 lg:block lg:left-1/2 lg:-translate-x-1/2" />

            <motion.div
              initial="hidden"
              animate={isStoryInView ? "visible" : "hidden"}
              variants={containerVariants}
              className="space-y-6 lg:space-y-10"
            >
              {milestones.map((milestone, i) => (
                <motion.div
                  key={i}
                  variants={itemVariants}
                  className={`relative flex gap-5 lg:gap-8 ${
                    i % 2 === 0
                      ? "lg:flex-row"
                      : "lg:flex-row-reverse lg:text-right"
                  }`}
                >
                  <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-500/25 lg:absolute lg:left-1/2 lg:top-0 lg:-translate-x-1/2">
                    <span className="text-xs font-black">{i + 1}</span>
                  </div>

                  <div className="flex-1 lg:max-w-[calc(50%-2rem)]">
                    <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-[0_12px_30px_rgba(15,23,42,0.05)] transition-all duration-300 hover:border-indigo-200 hover:shadow-[0_20px_50px_rgba(99,102,241,0.08)]">
                      <div
                        className={`mb-3 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 ${
                          i % 2 !== 0 ? "lg:ml-auto" : ""
                        }`}
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-indigo-700">
                          {milestone.year}
                        </span>
                      </div>
                      <h3 className="text-lg font-black leading-tight tracking-[-0.02em] text-slate-950 sm:text-xl">
                        {milestone.title}
                      </h3>
                      <p className="mt-2.5 text-[13px] leading-[1.75] text-slate-500 sm:text-sm">
                        {milestone.description}
                      </p>
                    </div>
                  </div>

                  <div className="hidden flex-1 lg:block" />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      <section
        ref={guaranteeRef}
        className="relative w-full overflow-hidden bg-white py-16 sm:py-20 lg:py-24"
      >
        <div className="container relative mx-auto w-full px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            animate={isGuaranteeInView ? "visible" : "hidden"}
            variants={containerVariants}
            className="mx-auto mb-12 max-w-2xl text-center sm:mb-14"
          >

            <motion.h2
              variants={itemVariants}
              className="mt-5 text-3xl font-black leading-[1.1] tracking-[-0.03em] text-slate-950 sm:text-4xl md:text-[42px]"
            >
              The AuraSpace{" "}
              <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 bg-clip-text text-transparent">
                Guarantee
              </span>
            </motion.h2>

            <motion.p
              variants={itemVariants}
              className="mt-4 text-sm leading-relaxed text-slate-500 sm:text-[15px]"
            >
              We back every booking with commitments that protect your
              experience, your payment, and your peace of mind.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            animate={isGuaranteeInView ? "visible" : "hidden"}
            variants={containerVariants}
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
          >
            {guarantees.map((item) => (
              <motion.div
                key={item.title}
                variants={itemVariants}
                whileHover={reduceMotion ? undefined : { y: -4 }}
                className="group flex h-full flex-col rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:border-indigo-200 hover:shadow-md"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-sm">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.5 12.75l6 6 9-13.5"
                    />
                  </svg>
                </div>
                <h4 className="text-base font-black leading-tight tracking-[-0.02em] text-slate-950">
                  {item.title}
                </h4>
                <p className="mt-2 flex-1 text-[13px] leading-relaxed text-slate-500">
                  {item.text}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>



      <section
        ref={testimonialRef}
        className="relative w-full overflow-hidden bg-white py-16 sm:py-20 lg:py-24"
      >
        <div className="container relative mx-auto w-full px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            animate={isTestimonialInView ? "visible" : "hidden"}
            variants={containerVariants}
            className="mx-auto mb-12 max-w-2xl text-center sm:mb-14"
          >


            <motion.h2
              variants={itemVariants}
              className="mt-5 text-3xl font-black leading-[1.1] tracking-[-0.03em] text-slate-950 sm:text-4xl md:text-[42px]"
            >
              What Our{" "}
              <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 bg-clip-text text-transparent">
                Guests & Hosts Say
              </span>
            </motion.h2>

            <motion.p
              variants={itemVariants}
              className="mt-4 text-sm leading-relaxed text-slate-500 sm:text-[15px]"
            >
              Real stories from guests, hosts, and event organizers across
              Bangladesh.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            animate={isTestimonialInView ? "visible" : "hidden"}
            variants={containerVariants}
            className="grid grid-cols-1 gap-5 sm:gap-6 lg:grid-cols-3"
          >
            {testimonials.map((t) => (
              <motion.div
                key={t.name}
                variants={itemVariants}
                whileHover={reduceMotion ? undefined : { y: -6 }}
                className="flex h-full flex-col rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm transition-all duration-500 hover:border-indigo-200 hover:shadow-[0_20px_50px_rgba(99,102,241,0.08)]"
              >
                <svg
                  className="h-8 w-8 text-indigo-500/40"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z" />
                </svg>

                <p className="mt-4 flex-1 text-[14px] leading-[1.8] text-slate-600">
                  “{t.quote}”
                </p>

                <div className="mt-6 flex items-center gap-3 border-t border-slate-100 pt-5">
                  <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full border-2 border-white shadow-sm ring-1 ring-slate-200/60">
                    <Image
                      src={t.image}
                      alt={t.name}
                      fill
                      sizes="44px"
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <div className="text-sm font-black text-slate-950">
                      {t.name}
                    </div>
                    <div className="text-[11px] font-bold uppercase tracking-[0.12em] text-indigo-600">
                      {t.role}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section
        ref={ctaRef}
        className="relative w-full overflow-hidden bg-white py-16 sm:py-20 lg:py-24"
      >
        <div className="container relative mx-auto w-full px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={isCtaInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
            transition={{
              duration: 0.75,
              ease: [0.16, 1, 0.3, 1],
              type: "tween",
            }}
            className="relative overflow-hidden rounded-[28px] border border-white/10 bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 shadow-[0_28px_80px_rgba(15,23,42,0.16)]"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.06] via-transparent to-transparent" />
            <div className="absolute -left-16 top-10 h-[300px] w-[300px] rounded-full bg-indigo-500/15 blur-3xl" />
            <div className="absolute -right-16 bottom-10 h-[300px] w-[300px] rounded-full bg-violet-500/15 blur-3xl" />

            <div className="relative z-10 flex flex-col items-center gap-6 p-8 text-center sm:p-10 lg:p-14">
              <motion.div
                animate={reduceMotion ? undefined : { y: [0, -5, 0] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  type: "tween",
                }}
                className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/[0.08] ring-1 ring-white/[0.12] backdrop-blur-sm"
              >
                <svg
                  className="h-7 w-7 text-indigo-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"
                  />
                </svg>
              </motion.div>

              <div className="max-w-2xl">
                <h3 className="text-2xl font-black leading-tight tracking-[-0.02em] text-white sm:text-3xl lg:text-4xl">
                  Ready to experience{" "}
                  <span className="bg-gradient-to-r from-indigo-300 via-violet-300 to-indigo-200 bg-clip-text text-transparent">
                    AuraSpace
                  </span>
                  ?
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-white/60 sm:text-[15px]">
                  Join thousands of guests and hosts across Bangladesh who
                  trust AuraSpace for premium stays, exclusive event venues,
                  and customized booking experiences.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <motion.div
                  whileHover={
                    reduceMotion
                      ? undefined
                      : {
                          scale: 1.04,
                          boxShadow: "0 12px 32px rgba(99,102,241,0.30)",
                        }
                  }
                  whileTap={reduceMotion ? undefined : { scale: 0.97 }}
                >
                  <Link
                    href="/listings"
                    className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3 text-[11px] font-extrabold uppercase tracking-[0.16em] text-slate-950 shadow-lg transition-colors duration-300 hover:bg-indigo-50"
                  >
                    Browse Properties
                    <svg
                      className="h-3.5 w-3.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </Link>
                </motion.div>

                <motion.div
                  whileHover={reduceMotion ? undefined : { scale: 1.04 }}
                  whileTap={reduceMotion ? undefined : { scale: 0.97 }}
                >
                  <Link
                    href="/dashboard/properties/add"
                    className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.07] px-7 py-3 text-[11px] font-extrabold uppercase tracking-[0.16em] text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/[0.12]"
                  >
                    Become a Host
                  </Link>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}