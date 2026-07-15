"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
    motion,
    useInView,
    useReducedMotion,
    useScroll,
    useTransform,
    AnimatePresence,
    type Variants,
} from "framer-motion";
import {
    HiOutlineSearch,
    HiOutlineCalendar,
    HiOutlineCreditCard,
    HiOutlineKey,
    HiOutlineSparkles,
    HiOutlineStar,
    HiOutlineShieldCheck,
    HiOutlineClock,
    HiOutlineHeart,
    HiOutlineGlobe,
    HiOutlineLightningBolt,
    HiOutlineUsers,
    HiOutlineArrowRight,
    HiOutlineChevronDown,
    HiOutlineCheckCircle,
    HiOutlineHome,
    HiOutlineTrendingUp,
    HiOutlineBadgeCheck,
    HiOutlinePlay,
    HiOutlineLocationMarker,
} from "react-icons/hi";

const HERO_IMAGE =
    "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=2000&q=80";

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1, delayChildren: 0.06 },
    },
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 22, filter: "blur(8px)" },
    visible: {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        transition: {
            duration: 0.7,
            ease: [0.16, 1, 0.3, 1],
            type: "tween",
        },
    },
};

interface Step {
    number: string;
    title: string;
    description: string;
    icon: React.ReactNode;
    accent: string;
    features: string[];
    image: string;
}

interface Benefit {
    title: string;
    description: string;
    icon: React.ReactNode;
    stat: string;
    statLabel: string;
}

interface PersonaStep {
    title: string;
    description: string;
}

interface Persona {
    id: string;
    label: string;
    title: string;
    description: string;
    icon: React.ReactNode;
    steps: PersonaStep[];
}

interface Testimonial {
    quote: string;
    name: string;
    role: string;
    avatar: string;
    rating: number;
}

interface Faq {
    q: string;
    a: string;
    category: string;
}

const steps: Step[] = [
    {
        number: "01",
        title: "Discover Your Space",
        description:
            "Browse thousands of curated stays, event venues, and unique properties across Bangladesh — filtered by your preferences.",
        icon: <HiOutlineSearch className="h-6 w-6" />,
        accent: "from-indigo-500 to-violet-600",
        features: [
            "Smart location-based search",
            "Advanced filters & amenities",
            "Verified premium listings",
        ],
        image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80",
    },
    {
        number: "02",
        title: "Compare & Choose",
        description:
            "Read verified guest reviews, explore high-resolution photo galleries, and compare properties side-by-side to find your perfect match.",
        icon: <HiOutlineLocationMarker className="h-6 w-6" />,
        accent: "from-violet-500 to-fuchsia-600",
        features: [
            "Verified reviews & ratings",
            "HD photo galleries",
            "Real-time availability",
        ],
        image: "https://images.unsplash.com/photo-1522199755839-a2bacb67c546?auto=format&fit=crop&w=1200&q=80",
    },
    {
        number: "03",
        title: "Book Instantly",
        description:
            "Select your dates, choose add-on services like decoration or catering, and confirm your booking in under 60 seconds.",
        icon: <HiOutlineCalendar className="h-6 w-6" />,
        accent: "from-fuchsia-500 to-pink-600",
        features: [
            "Instant confirmation",
            "Flexible date selection",
            "Premium add-on services",
        ],
        image: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=1200&q=80",
    },
    {
        number: "04",
        title: "Secure Payment",
        description:
            "Pay safely with bKash, Nagad, cards, or bank transfer. Your payment is protected until you check in.",
        icon: <HiOutlineCreditCard className="h-6 w-6" />,
        accent: "from-pink-500 to-rose-600",
        features: [
            "Multiple payment methods",
            "Bank-grade encryption",
            "Buyer protection",
        ],
        image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1200&q=80",
    },
    {
        number: "05",
        title: "Arrive & Enjoy",
        description:
            "Get seamless check-in details, direct host contact, and 24/7 concierge support throughout your entire stay.",
        icon: <HiOutlineKey className="h-6 w-6" />,
        accent: "from-rose-500 to-orange-500",
        features: [
            "Digital check-in guide",
            "24/7 concierge support",
            "Direct host messaging",
        ],
        image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
    },
    {
        number: "06",
        title: "Share Your Story",
        description:
            "Rate your experience and help fellow travelers discover extraordinary spaces. Earn rewards with every review.",
        icon: <HiOutlineSparkles className="h-6 w-6" />,
        accent: "from-orange-500 to-amber-500",
        features: [
            "Earn loyalty rewards",
            "Help the community grow",
            "Unlock exclusive perks",
        ],
        image: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1200&q=80",
    },
];

const benefits: Benefit[] = [
    {
        title: "Verified Quality",
        description:
            "Every listing is personally inspected and verified by our quality team before going live.",
        icon: <HiOutlineShieldCheck className="h-6 w-6" />,
        stat: "100%",
        statLabel: "Verified Stays",
    },
    {
        title: "Instant Booking",
        description:
            "No waiting for host approval. Confirm your stay in seconds with our instant booking system.",
        icon: <HiOutlineLightningBolt className="h-6 w-6" />,
        stat: "60s",
        statLabel: "Avg. Booking Time",
    },
    {
        title: "24/7 Support",
        description:
            "Round-the-clock human support in Bengali and English, whenever you need us.",
        icon: <HiOutlineHeart className="h-6 w-6" />,
        stat: "24/7",
        statLabel: "Live Support",
    },
    {
        title: "Best Price Guarantee",
        description:
            "Found it cheaper elsewhere? We'll match the price and give you 10% off your next stay.",
        icon: <HiOutlineBadgeCheck className="h-6 w-6" />,
        stat: "10%",
        statLabel: "Price Match Bonus",
    },
    {
        title: "Local Expertise",
        description:
            "Deep knowledge of every city in Bangladesh, from Dhaka rooftops to Sylhet tea gardens.",
        icon: <HiOutlineGlobe className="h-6 w-6" />,
        stat: "64",
        statLabel: "Districts Covered",
    },
    {
        title: "Growing Community",
        description:
            "Join a trusted community of travelers, hosts, and event organizers across Bangladesh.",
        icon: <HiOutlineUsers className="h-6 w-6" />,
        stat: "50K+",
        statLabel: "Happy Users",
    },
];

const personas: Persona[] = [
    {
        id: "guest",
        label: "For Guests",
        title: "Book premium stays effortlessly",
        description:
            "From weekend getaways to extended stays, discover spaces that feel like home — anywhere in Bangladesh.",
        icon: <HiOutlineHome className="h-4 w-4" />,
        steps: [
            {
                title: "Search & Filter",
                description:
                    "Find stays by location, dates, guests, and amenities.",
            },
            {
                title: "Book Instantly",
                description: "Secure your dates with instant confirmation.",
            },
            {
                title: "Check-In & Enjoy",
                description:
                    "Get self-check-in details and start your journey.",
            },
            {
                title: "Rate & Review",
                description: "Share your experience and earn loyalty points.",
            },
        ],
    },
    {
        id: "host",
        label: "For Hosts",
        title: "Turn your property into income",
        description:
            "List your property, set your rules, and let our platform handle bookings, payments, and guest support.",
        icon: <HiOutlineTrendingUp className="h-4 w-4" />,
        steps: [
            {
                title: "List Your Space",
                description:
                    "Upload photos, set pricing, and describe your property.",
            },
            {
                title: "Get Verified",
                description:
                    "Our team reviews and approves listings in 2–3 days.",
            },
            {
                title: "Welcome Guests",
                description: "Manage bookings from your host dashboard.",
            },
            {
                title: "Get Paid Fast",
                description: "Automatic payouts within 24 hours of check-in.",
            },
        ],
    },
    {
        id: "event",
        label: "For Events",
        title: "Plan unforgettable events",
        description:
            "Book curated venues with decoration, catering, floral, and photography add-ons — all in one place.",
        icon: <HiOutlineSparkles className="h-4 w-4" />,
        steps: [
            {
                title: "Choose Your Venue",
                description:
                    "Browse rooftops, banquet halls, and outdoor spaces.",
            },
            {
                title: "Add Services",
                description: "Bundle decoration, catering, and photography.",
            },
            {
                title: "Confirm & Customize",
                description:
                    "Work with our event planners for the perfect setup.",
            },
            {
                title: "Celebrate",
                description: "Show up and enjoy — we handle everything else.",
            },
        ],
    },
];

const testimonials: Testimonial[] = [
    {
        quote: "Booking our anniversary dinner at a rooftop venue took less than a minute. Every detail was handled perfectly.",
        name: "Ayesha Rahman",
        role: "Guest, Dhaka",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
        rating: 5,
    },
    {
        quote: "I listed my Gulshan apartment and got my first booking within 48 hours. The dashboard is incredibly intuitive.",
        name: "Tanvir Ahmed",
        role: "Host, Dhaka",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
        rating: 5,
    },
    {
        quote: "Planned my sister's mehendi with AuraSpace — venue, decor, catering, everything seamless. Absolute lifesaver.",
        name: "Nafisa Islam",
        role: "Event Organizer",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80",
        rating: 5,
    },
];

const faqs: Faq[] = [
    {
        q: "How do I book a property on AuraSpace?",
        a: "Simply search for your destination, select your dates, and browse verified listings. Once you find your perfect stay, click 'Book Now' and complete payment. You'll receive instant confirmation and check-in details.",
        category: "Booking",
    },
    {
        q: "What payment methods do you accept?",
        a: "We accept bKash, Nagad, Rocket, all major credit and debit cards, and direct bank transfers. All transactions are secured with bank-grade encryption and buyer protection.",
        category: "Payment",
    },
    {
        q: "Is my booking secure?",
        a: "Absolutely. Every payment is held securely until 24 hours after check-in. If anything goes wrong, our support team resolves issues within hours or provides a full refund.",
        category: "Security",
    },
    {
        q: "Can I cancel or modify my booking?",
        a: "Yes. Most bookings offer free cancellation up to 48 hours before check-in. Modification policies vary by property and are clearly displayed before you confirm your booking.",
        category: "Booking",
    },
    {
        q: "How do I become a host?",
        a: "Click 'Become a Host' from your dashboard, upload your property photos, set your pricing, and submit for review. Our team approves quality listings within 2–3 business days.",
        category: "Hosting",
    },
    {
        q: "Do you offer event planning services?",
        a: "Yes! Beyond venue booking, we offer decoration, catering, floral arrangements, and photography as premium add-ons. Our event coordinators help you customize every detail.",
        category: "Events",
    },
];

interface StepCardProps {
    step: Step;
    index: number;
    reduceMotion: boolean;
}

interface FaqAccordionProps {
    faq: Faq;
    index: number;
    isOpen: boolean;
    onToggle: () => void;
}

function StepCard({ step, index, reduceMotion }: StepCardProps) {
    const isEven = index % 2 === 0;
    const cardRef = useRef(null);
    const isInView = useInView(cardRef, { once: true, margin: "-100px" });

    return (
        <motion.div
            ref={cardRef}
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{
                duration: 0.8,
                ease: [0.16, 1, 0.3, 1],
                type: "tween",
            }}
            className={`grid gap-8 lg:grid-cols-2 lg:gap-12 ${isEven ? "" : "lg:[&>*:first-child]:order-2"}`}
        >
            <div className="relative flex flex-col justify-center">
                <div className="mb-4 flex items-center gap-3">
                    <div
                        className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${step.accent} text-white shadow-lg shadow-indigo-500/25`}
                    >
                        {step.icon}
                    </div>
                    <div className="text-[11px] font-black uppercase tracking-[0.24em] text-slate-400">
                        Step {step.number}
                    </div>
                </div>

                <h3 className="text-2xl font-black leading-tight tracking-[-0.025em] text-slate-950 sm:text-3xl md:text-[34px]">
                    {step.title}
                </h3>

                <p className="mt-4 text-[15px] leading-[1.75] text-slate-500 sm:text-base">
                    {step.description}
                </p>

                <ul className="mt-6 space-y-3">
                    {step.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-3">
                            <div
                                className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${step.accent} text-white`}
                            >
                                <HiOutlineCheckCircle className="h-3.5 w-3.5" />
                            </div>
                            <span className="text-sm font-semibold text-slate-700">
                                {feature}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>

            <motion.div
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
                className="relative"
            >
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[28px] border border-slate-200 bg-slate-100 shadow-[0_20px_60px_rgba(15,23,42,0.10)]">
                    <Image
                        src={step.image}
                        alt={step.title}
                        fill
                        sizes="(min-width: 1024px) 50vw, 100vw"
                        className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent" />
                    <div className="absolute left-5 top-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/30 bg-white/20 text-white backdrop-blur-xl">
                        <span className="text-lg font-black">
                            {step.number}
                        </span>
                    </div>
                    <div
                        className={`absolute -bottom-4 -right-4 h-24 w-24 rounded-full bg-gradient-to-br ${step.accent} opacity-30 blur-2xl`}
                    />
                </div>
            </motion.div>
        </motion.div>
    );
}

function FaqAccordion({ faq, index, isOpen, onToggle }: FaqAccordionProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{
                duration: 0.6,
                delay: index * 0.05,
                ease: [0.16, 1, 0.3, 1],
                type: "tween",
            }}
            className={`overflow-hidden rounded-2xl border transition-all duration-300 ${isOpen ? "border-indigo-200 bg-indigo-50/40 shadow-[0_8px_24px_rgba(99,102,241,0.08)]" : "border-slate-200 bg-white hover:border-slate-300"}`}
        >
            <button
                type="button"
                onClick={onToggle}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left sm:px-6"
            >
                <div className="flex items-start gap-3 sm:gap-4">
                    <div
                        className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[10px] font-black transition-colors duration-300 ${isOpen ? "bg-gradient-to-br from-indigo-500 to-violet-600 text-white" : "bg-slate-100 text-slate-500"}`}
                    >
                        {String(index + 1).padStart(2, "0")}
                    </div>
                    <div className="flex-1">
                        <div
                            className={`mb-1 text-[9px] font-black uppercase tracking-[0.2em] transition-colors duration-300 ${isOpen ? "text-indigo-600" : "text-slate-400"}`}
                        >
                            {faq.category}
                        </div>
                        <h4 className="text-[15px] font-black leading-snug tracking-[-0.01em] text-slate-950 sm:text-base">
                            {faq.q}
                        </h4>
                    </div>
                </div>

                <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-all duration-300 ${isOpen ? "rotate-180 bg-indigo-100 text-indigo-600" : "bg-slate-100 text-slate-500"}`}
                >
                    <HiOutlineChevronDown className="h-4 w-4" />
                </div>
            </button>

            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{
                            duration: 0.35,
                            ease: [0.16, 1, 0.3, 1],
                            type: "tween",
                        }}
                        className="overflow-hidden"
                    >
                        <div className="px-5 pb-5 pl-16 sm:px-6 sm:pb-6 sm:pl-[74px]">
                            <p className="text-sm leading-[1.75] text-slate-600">
                                {faq.a}
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

const HowItWorks = () => {
    const reduceMotion = !!useReducedMotion();

    const heroRef = useRef(null);
    const introRef = useRef(null);
    const stepsRef = useRef(null);
    const benefitsRef = useRef(null);
    const personaRef = useRef(null);
    const testimonialRef = useRef(null);
    const faqRef = useRef(null);
    const ctaRef = useRef(null);

    const isIntroInView = useInView(introRef, { once: true, margin: "-80px" });
    const isBenefitsInView = useInView(benefitsRef, {
        once: true,
        margin: "-80px",
    });
    const isPersonaInView = useInView(personaRef, {
        once: true,
        margin: "-80px",
    });
    const isTestimonialInView = useInView(testimonialRef, {
        once: true,
        margin: "-80px",
    });
    const isFaqInView = useInView(faqRef, { once: true, margin: "-80px" });
    const isCtaInView = useInView(ctaRef, { once: true, margin: "-80px" });

    const { scrollYProgress: heroScroll } = useScroll({
        target: heroRef,
        offset: ["start start", "end start"],
    });
    const heroImageY = useTransform(heroScroll, [0, 1], ["0%", "20%"]);
    const heroContentY = useTransform(heroScroll, [0, 1], ["0%", "12%"]);
    const heroOpacity = useTransform(heroScroll, [0, 1], [1, 0.4]);

    const { scrollYProgress: stepsScroll } = useScroll({
        target: stepsRef,
        offset: ["start end", "end start"],
    });
    const lineProgress = useTransform(stepsScroll, [0.1, 0.9], [0, 1]);

    const [activePersona, setActivePersona] = useState("guest");
    const [openFaq, setOpenFaq] = useState<number | null>(0);

    const currentPersona = personas.find((p) => p.id === activePersona);

    return (
        <main className="w-full bg-white">
            <section
                ref={heroRef}
                className="relative w-full overflow-hidden bg-slate-950 py-20 sm:py-24 lg:py-32"
            >
                <motion.div
                    className="absolute inset-0 -z-10"
                    style={{ y: heroImageY, opacity: heroOpacity }}
                >
                    <Image
                        src={HERO_IMAGE}
                        alt="How AuraSpace works"
                        fill
                        priority
                        sizes="100vw"
                        className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-950/92 via-indigo-950/88 to-slate-900/92" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-slate-950/40" />
                </motion.div>

                <div
                    className="pointer-events-none absolute inset-0 -z-10 opacity-[0.04]"
                    style={{
                        backgroundImage:
                            "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.6) 1px, transparent 0)",
                        backgroundSize: "32px 32px",
                    }}
                />

                <div className="pointer-events-none absolute inset-0 -z-10">
                    <div className="absolute -left-24 top-10 h-[400px] w-[400px] rounded-full bg-indigo-500/20 blur-3xl" />
                    <div className="absolute -right-24 bottom-10 h-[400px] w-[400px] rounded-full bg-violet-500/20 blur-3xl" />
                </div>

                <motion.div
                    style={{ y: heroContentY }}
                    className="container relative mx-auto w-full px-4 sm:px-6 lg:px-8"
                >
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={containerVariants}
                        className="mx-auto max-w-3xl text-center"
                    >
                        <motion.h1
                            variants={itemVariants}
                            className="text-[34px] font-black leading-[1.05] tracking-[-0.035em] text-white sm:text-5xl md:text-[56px] lg:text-6xl"
                        >
                            From Search to Stay in{" "}
                            <span className="text-white">Six Simple Steps</span>
                        </motion.h1>

                        <motion.p
                            variants={itemVariants}
                            className="mx-auto mt-6 max-w-2xl text-base leading-[1.8] text-white/70 sm:text-lg"
                        >
                            A seamless journey designed around you — whether
                            you&apos;re booking a premium stay, listing your
                            property, or planning an unforgettable event in
                            Bangladesh.
                        </motion.p>

                        <motion.div
                            variants={itemVariants}
                            className="mx-auto mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
                        >
                            <Link
                                href="/listings"
                                className="group inline-flex h-[54px] items-center justify-center gap-2 rounded-full bg-white px-7 text-[11px] font-extrabold uppercase tracking-[0.18em] text-slate-950 shadow-[0_10px_28px_rgba(255,255,255,0.15)] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_14px_36px_rgba(255,255,255,0.25)]"
                            >
                                Start Exploring
                                <HiOutlineArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                            </Link>

                            <button
                                type="button"
                                className="group inline-flex h-[54px] items-center justify-center gap-2 rounded-full border border-white/20 bg-white/[0.08] px-7 text-[11px] font-extrabold uppercase tracking-[0.18em] text-white backdrop-blur-md transition-all duration-300 hover:border-white/40 hover:bg-white/[0.14]"
                            >
                                <HiOutlinePlay className="h-4 w-4" />
                                Watch Demo
                            </button>
                        </motion.div>

                        <motion.div
                            variants={itemVariants}
                            className="mx-auto mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-white/60"
                        >
                            {[
                                {
                                    icon: (
                                        <HiOutlineUsers className="h-4 w-4" />
                                    ),
                                    label: "50,000+ Users",
                                },
                                {
                                    icon: <HiOutlineStar className="h-4 w-4" />,
                                    label: "4.9 Rating",
                                },
                                {
                                    icon: (
                                        <HiOutlineGlobe className="h-4 w-4" />
                                    ),
                                    label: "64 Districts",
                                },
                            ].map((item) => (
                                <div
                                    key={item.label}
                                    className="flex items-center gap-2"
                                >
                                    <div className="text-indigo-300">
                                        {item.icon}
                                    </div>
                                    <span className="text-xs font-semibold">
                                        {item.label}
                                    </span>
                                </div>
                            ))}
                        </motion.div>
                    </motion.div>
                </motion.div>
            </section>

            <section
                ref={introRef}
                className="relative w-full overflow-hidden bg-white py-16 sm:py-20 lg:py-24"
            >
                <div className="pointer-events-none absolute inset-0">
                    <div className="absolute -left-32 top-20 h-[300px] w-[300px] rounded-full bg-indigo-50/70 blur-3xl" />
                    <div className="absolute -right-32 bottom-20 h-[300px] w-[300px] rounded-full bg-violet-50/70 blur-3xl" />
                </div>

                <div className="container relative mx-auto w-full px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial="hidden"
                        animate={isIntroInView ? "visible" : "hidden"}
                        variants={containerVariants}
                        className="mx-auto max-w-4xl text-center"
                    >
                        <motion.h2
                            variants={itemVariants}
                            className="text-3xl font-black leading-[1.1] tracking-[-0.03em] text-slate-950 sm:text-4xl md:text-[46px]"
                        >
                            Built for people who value{" "}
                            <span className="text-slate-950">
                                simplicity and quality
                            </span>
                        </motion.h2>

                        <motion.p
                            variants={itemVariants}
                            className="mx-auto mt-5 max-w-2xl text-[15px] leading-[1.8] text-slate-500 sm:text-base"
                        >
                            We&apos;ve reimagined how Bangladesh discovers and
                            books extraordinary spaces. No hidden fees. No
                            endless forms. Just a beautifully crafted experience
                            from first search to final goodbye.
                        </motion.p>
                    </motion.div>

                    <motion.div
                        initial="hidden"
                        animate={isIntroInView ? "visible" : "hidden"}
                        variants={containerVariants}
                        className="mx-auto mt-14 grid max-w-5xl grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4"
                    >
                        {[
                            { value: "50K+", label: "Active Users" },
                            { value: "8,200+", label: "Verified Listings" },
                            { value: "4.9/5", label: "Guest Rating" },
                            { value: "<60s", label: "Booking Time" },
                        ].map((stat) => (
                            <motion.div
                                key={stat.label}
                                variants={itemVariants}
                                whileHover={
                                    reduceMotion ? undefined : { y: -4 }
                                }
                                className="rounded-[20px] border border-slate-200 bg-white p-5 text-center shadow-sm transition-all duration-300 hover:border-indigo-200 hover:shadow-md sm:p-6"
                            >
                                <div className="text-3xl font-black tracking-[-0.02em] text-slate-950 sm:text-4xl">
                                    {stat.value}
                                </div>
                                <div className="mt-2 text-[10px] font-black uppercase tracking-[0.16em] text-slate-500 sm:text-[11px]">
                                    {stat.label}
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            <section
                ref={stepsRef}
                className="relative w-full overflow-hidden bg-slate-50/50 py-16 sm:py-20 lg:py-28"
            >
                <div className="container relative mx-auto w-full px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-80px" }}
                        variants={containerVariants}
                        className="mx-auto mb-16 max-w-2xl text-center sm:mb-20"
                    >
                        <motion.h2
                            variants={itemVariants}
                            className="text-3xl font-black leading-[1.1] tracking-[-0.03em] text-slate-950 sm:text-4xl md:text-[42px]"
                        >
                            Your journey, thoughtfully designed
                        </motion.h2>

                        <motion.p
                            variants={itemVariants}
                            className="mt-4 text-sm leading-relaxed text-slate-500 sm:text-[15px]"
                        >
                            Six intentional steps that turn browsing into
                            unforgettable memories.
                        </motion.p>
                    </motion.div>

                    <div className="relative mx-auto max-w-6xl">
                        <div className="absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-slate-200/70 lg:block">
                            <motion.div
                                className="absolute left-0 top-0 w-full origin-top bg-gradient-to-b from-indigo-500 via-violet-500 to-fuchsia-500"
                                style={{ scaleY: lineProgress, height: "100%" }}
                            />
                        </div>

                        <div className="space-y-20 lg:space-y-32">
                            {steps.map((step, i) => (
                                <StepCard
                                    key={step.number}
                                    step={step}
                                    index={i}
                                    reduceMotion={reduceMotion}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <section
                ref={benefitsRef}
                className="relative w-full overflow-hidden bg-white py-16 sm:py-20 lg:py-24"
            >
                <div className="container relative mx-auto w-full px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial="hidden"
                        animate={isBenefitsInView ? "visible" : "hidden"}
                        variants={containerVariants}
                        className="mx-auto mb-12 max-w-2xl text-center sm:mb-16"
                    >
                        <motion.h2
                            variants={itemVariants}
                            className="text-3xl font-black leading-[1.1] tracking-[-0.03em] text-slate-950 sm:text-4xl md:text-[42px]"
                        >
                            Benefits that make the difference
                        </motion.h2>

                        <motion.p
                            variants={itemVariants}
                            className="mt-4 text-sm leading-relaxed text-slate-500 sm:text-[15px]"
                        >
                            Every feature crafted with intention. Every detail
                            obsessed over.
                        </motion.p>
                    </motion.div>

                    <motion.div
                        initial="hidden"
                        animate={isBenefitsInView ? "visible" : "hidden"}
                        variants={containerVariants}
                        className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3"
                    >
                        {benefits.map((benefit) => (
                            <motion.div
                                key={benefit.title}
                                variants={itemVariants}
                                whileHover={
                                    reduceMotion
                                        ? undefined
                                        : {
                                              y: -6,
                                              transition: {
                                                  type: "spring",
                                                  stiffness: 280,
                                                  damping: 22,
                                              },
                                          }
                                }
                                className="group relative flex h-full flex-col overflow-hidden rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm transition-all duration-500 hover:border-indigo-200 hover:shadow-[0_20px_50px_rgba(99,102,241,0.08)] sm:p-7"
                            >
                                <div className="absolute -right-16 -top-16 h-32 w-32 rounded-full bg-indigo-50 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />

                                <div className="relative flex items-start justify-between">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-md shadow-indigo-500/20">
                                        {benefit.icon}
                                    </div>

                                    <div className="text-right">
                                        <div className="text-2xl font-black tracking-[-0.02em] text-slate-950">
                                            {benefit.stat}
                                        </div>
                                        <div className="mt-0.5 text-[9px] font-black uppercase tracking-[0.16em] text-slate-400">
                                            {benefit.statLabel}
                                        </div>
                                    </div>
                                </div>

                                <h3 className="relative mt-5 text-lg font-black leading-tight tracking-[-0.02em] text-slate-950 sm:text-xl">
                                    {benefit.title}
                                </h3>

                                <p className="relative mt-3 flex-1 text-[13px] leading-[1.75] text-slate-500">
                                    {benefit.description}
                                </p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            <section
                ref={personaRef}
                className="relative w-full overflow-hidden bg-slate-50/50 py-16 sm:py-20 lg:py-24"
            >
                <div className="container relative mx-auto w-full px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial="hidden"
                        animate={isPersonaInView ? "visible" : "hidden"}
                        variants={containerVariants}
                        className="mx-auto mb-12 max-w-2xl text-center sm:mb-14"
                    >
                        <motion.h2
                            variants={itemVariants}
                            className="text-3xl font-black leading-[1.1] tracking-[-0.03em] text-slate-950 sm:text-4xl md:text-[42px]"
                        >
                            Choose your path
                        </motion.h2>

                        <motion.p
                            variants={itemVariants}
                            className="mt-4 text-sm leading-relaxed text-slate-500 sm:text-[15px]"
                        >
                            A tailored experience for guests, hosts, and event
                            planners.
                        </motion.p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={
                            isPersonaInView
                                ? { opacity: 1, y: 0 }
                                : { opacity: 0, y: 20 }
                        }
                        transition={{
                            duration: 0.6,
                            ease: [0.16, 1, 0.3, 1],
                            type: "tween",
                        }}
                        className="mx-auto mb-10 flex max-w-2xl flex-wrap items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm"
                    >
                        {personas.map((persona) => (
                            <button
                                key={persona.id}
                                type="button"
                                onClick={() => setActivePersona(persona.id)}
                                aria-pressed={activePersona === persona.id}
                                className={`relative flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-[11px] font-black uppercase tracking-[0.14em] transition-all duration-300 ${
                                    activePersona === persona.id
                                        ? "text-white"
                                        : "text-slate-500 hover:text-slate-900"
                                }`}
                            >
                                {activePersona === persona.id && (
                                    <motion.div
                                        layoutId="persona-pill"
                                        className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 shadow-md shadow-indigo-500/20"
                                        transition={{
                                            type: "spring",
                                            stiffness: 320,
                                            damping: 28,
                                        }}
                                    />
                                )}
                                <span className="relative z-10 flex items-center gap-2">
                                    {persona.icon}
                                    {persona.label}
                                </span>
                            </button>
                        ))}
                    </motion.div>

                    <div className="mx-auto max-w-5xl">
                        <AnimatePresence mode="wait">
                            {currentPersona && (
                                <motion.div
                                    key={activePersona}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{
                                        duration: 0.45,
                                        ease: [0.16, 1, 0.3, 1],
                                        type: "tween",
                                    }}
                                    className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_16px_50px_rgba(15,23,42,0.06)] sm:p-8 lg:p-10"
                                >
                                    <div className="mb-8 text-center">
                                        <h3 className="text-2xl font-black leading-tight tracking-[-0.02em] text-slate-950 sm:text-3xl">
                                            {currentPersona.title}
                                        </h3>
                                        <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-slate-500 sm:text-[15px]">
                                            {currentPersona.description}
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                        {currentPersona.steps.map((step, i) => (
                                            <motion.div
                                                key={step.title}
                                                initial={{ opacity: 0, y: 15 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{
                                                    duration: 0.5,
                                                    delay: i * 0.08,
                                                    ease: [0.16, 1, 0.3, 1],
                                                    type: "tween",
                                                }}
                                                className="relative rounded-2xl border border-slate-200 bg-slate-50/50 p-5 transition-all duration-300 hover:border-indigo-200 hover:bg-white hover:shadow-md"
                                            >
                                                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-sm">
                                                    <span className="text-xs font-black">
                                                        {String(i + 1).padStart(
                                                            2,
                                                            "0",
                                                        )}
                                                    </span>
                                                </div>

                                                <h4 className="text-sm font-black tracking-[-0.01em] text-slate-950">
                                                    {step.title}
                                                </h4>

                                                <p className="mt-2 text-xs leading-relaxed text-slate-500">
                                                    {step.description}
                                                </p>

                                                {i <
                                                    currentPersona.steps
                                                        .length -
                                                        1 && (
                                                    <div className="absolute right-0 top-1/2 hidden -translate-y-1/2 translate-x-1/2 lg:block">
                                                        <div className="flex h-6 w-6 items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm">
                                                            <HiOutlineArrowRight className="h-3 w-3 text-slate-400" />
                                                        </div>
                                                    </div>
                                                )}
                                            </motion.div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
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
                            className="text-3xl font-black leading-[1.1] tracking-[-0.03em] text-slate-950 sm:text-4xl md:text-[42px]"
                        >
                            Loved by thousands
                        </motion.h2>

                        <motion.p
                            variants={itemVariants}
                            className="mt-4 text-sm leading-relaxed text-slate-500 sm:text-[15px]"
                        >
                            Real experiences from real people using AuraSpace
                            every day.
                        </motion.p>
                    </motion.div>

                    <motion.div
                        initial="hidden"
                        animate={isTestimonialInView ? "visible" : "hidden"}
                        variants={containerVariants}
                        className="grid grid-cols-1 gap-5 sm:gap-6 lg:grid-cols-3"
                    >
                        {testimonials.map((testimonial) => (
                            <motion.div
                                key={testimonial.name}
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
                                className="group relative flex h-full flex-col rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm transition-all duration-500 hover:border-indigo-200 hover:shadow-[0_20px_50px_rgba(99,102,241,0.08)] sm:p-7"
                            >
                                <div className="mb-4 flex items-center gap-1">
                                    {Array.from({
                                        length: testimonial.rating,
                                    }).map((_, i) => (
                                        <HiOutlineStar
                                            key={i}
                                            className="h-4 w-4 fill-amber-400 text-amber-400"
                                        />
                                    ))}
                                </div>

                                <p className="flex-1 text-[15px] leading-[1.7] text-slate-700">
                                    &ldquo;{testimonial.quote}&rdquo;
                                </p>

                                <div className="mt-6 flex items-center gap-3 border-t border-slate-100 pt-5">
                                    <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full ring-2 ring-slate-100">
                                        <Image
                                            src={testimonial.avatar}
                                            alt={testimonial.name}
                                            fill
                                            sizes="44px"
                                            className="object-cover"
                                        />
                                    </div>
                                    <div>
                                        <div className="text-sm font-black text-slate-950">
                                            {testimonial.name}
                                        </div>
                                        <div className="text-xs text-slate-500">
                                            {testimonial.role}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            <section
                ref={faqRef}
                className="relative w-full overflow-hidden bg-slate-50/50 py-16 sm:py-20 lg:py-24"
            >
                <div className="container relative mx-auto w-full px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial="hidden"
                        animate={isFaqInView ? "visible" : "hidden"}
                        variants={containerVariants}
                        className="mx-auto mb-10 max-w-2xl text-center sm:mb-14"
                    >
                        <motion.h2
                            variants={itemVariants}
                            className="text-3xl font-black leading-[1.1] tracking-[-0.03em] text-slate-950 sm:text-4xl md:text-[42px]"
                        >
                            Everything you need to know
                        </motion.h2>

                        <motion.p
                            variants={itemVariants}
                            className="mt-4 text-sm leading-relaxed text-slate-500 sm:text-[15px]"
                        >
                            Answers to the most frequently asked questions about
                            how AuraSpace works.
                        </motion.p>
                    </motion.div>

                    <div className="mx-auto max-w-3xl space-y-3">
                        {faqs.map((faq, i) => (
                            <FaqAccordion
                                key={faq.q}
                                faq={faq}
                                index={i}
                                isOpen={openFaq === i}
                                onToggle={() =>
                                    setOpenFaq(openFaq === i ? null : i)
                                }
                            />
                        ))}
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={
                            isFaqInView
                                ? { opacity: 1, y: 0 }
                                : { opacity: 0, y: 20 }
                        }
                        transition={{
                            duration: 0.6,
                            delay: 0.3,
                            ease: [0.16, 1, 0.3, 1],
                            type: "tween",
                        }}
                        className="mx-auto mt-10 max-w-3xl rounded-2xl border border-indigo-200 bg-gradient-to-br from-indigo-50 to-violet-50 p-6 text-center"
                    >
                        <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-indigo-600 shadow-sm">
                            <HiOutlineHeart className="h-5 w-5" />
                        </div>
                        <h4 className="text-base font-black tracking-[-0.01em] text-slate-950 sm:text-lg">
                            Still have questions?
                        </h4>
                        <p className="mx-auto mt-2 max-w-md text-sm text-slate-600">
                            Our support team is available 24/7 to help you with
                            anything.
                        </p>
                        <Link
                            href="/contact"
                            className="mt-4 inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-2.5 text-[11px] font-extrabold uppercase tracking-[0.14em] text-white shadow-md transition-all duration-300 hover:bg-slate-800"
                        >
                            Contact Support
                            <HiOutlineArrowRight className="h-3.5 w-3.5" />
                        </Link>
                    </motion.div>
                </div>
            </section>

            <section
                ref={ctaRef}
                className="relative w-full overflow-hidden bg-slate-950 py-16 sm:py-20 lg:py-24"
            >
                <div
                    className="pointer-events-none absolute inset-0 opacity-[0.05]"
                    style={{
                        backgroundImage:
                            "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.7) 1px, transparent 0)",
                        backgroundSize: "32px 32px",
                    }}
                />

                <div className="pointer-events-none absolute inset-0">
                    <div className="absolute -left-32 top-10 h-[500px] w-[500px] rounded-full bg-indigo-500/20 blur-3xl" />
                    <div className="absolute -right-32 bottom-10 h-[500px] w-[500px] rounded-full bg-violet-500/20 blur-3xl" />
                    <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-fuchsia-500/10 blur-3xl" />
                </div>

                <div className="container relative mx-auto w-full px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial="hidden"
                        animate={isCtaInView ? "visible" : "hidden"}
                        variants={containerVariants}
                        className="mx-auto max-w-4xl text-center"
                    >
                        <motion.h2
                            variants={itemVariants}
                            className="text-3xl font-black leading-[1.05] tracking-[-0.03em] text-white sm:text-5xl md:text-[56px]"
                        >
                            Your next great experience awaits
                        </motion.h2>

                        <motion.p
                            variants={itemVariants}
                            className="mx-auto mt-6 max-w-2xl text-base leading-[1.8] text-white/70 sm:text-lg"
                        >
                            Join over 50,000 travelers, hosts, and event
                            planners who trust AuraSpace to discover
                            extraordinary spaces across Bangladesh.
                        </motion.p>

                        <motion.div
                            variants={itemVariants}
                            className="mx-auto mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
                        >
                            <Link
                                href="/listings"
                                className="group inline-flex h-[56px] items-center justify-center gap-2 rounded-full bg-white px-8 text-[11px] font-extrabold uppercase tracking-[0.18em] text-slate-950 shadow-[0_14px_36px_rgba(255,255,255,0.18)] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_18px_42px_rgba(255,255,255,0.28)]"
                            >
                                Start Booking
                                <HiOutlineArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                            </Link>

                            <Link
                                href="/dashboard/host/items/add"
                                className="group inline-flex h-[56px] items-center justify-center gap-2 rounded-full border border-white/20 bg-white/[0.08] px-8 text-[11px] font-extrabold uppercase tracking-[0.18em] text-white backdrop-blur-md transition-all duration-300 hover:border-white/40 hover:bg-white/[0.14]"
                            >
                                Become a Host
                                <HiOutlineTrendingUp className="h-4 w-4" />
                            </Link>
                        </motion.div>

                        <motion.div
                            variants={itemVariants}
                            className="mx-auto mt-12 grid max-w-3xl grid-cols-3 gap-6 border-t border-white/10 pt-10"
                        >
                            {[
                                {
                                    icon: (
                                        <HiOutlineClock className="h-5 w-5" />
                                    ),
                                    value: "60s",
                                    label: "To Book",
                                },
                                {
                                    icon: (
                                        <HiOutlineShieldCheck className="h-5 w-5" />
                                    ),
                                    value: "100%",
                                    label: "Secure",
                                },
                                {
                                    icon: <HiOutlineStar className="h-5 w-5" />,
                                    value: "4.9",
                                    label: "Rated",
                                },
                            ].map((item) => (
                                <div
                                    key={item.label}
                                    className="flex flex-col items-center gap-2"
                                >
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.06] text-indigo-300">
                                        {item.icon}
                                    </div>
                                    <div className="text-xl font-black text-white sm:text-2xl">
                                        {item.value}
                                    </div>
                                    <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/50">
                                        {item.label}
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    </motion.div>
                </div>
            </section>
        </main>
    );
};

export default HowItWorks;