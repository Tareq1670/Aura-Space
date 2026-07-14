"use client";

import React, { useState, useMemo, useRef } from "react";
import Link from "next/link";
import {
    motion,
    useInView,
    AnimatePresence,
    type Variants,
} from "framer-motion";
import {
    HiOutlineSearch,
    HiOutlineChevronDown,
    HiOutlineChatAlt2,
    HiOutlineMail,
    HiOutlinePhone,
    HiOutlineShieldCheck,
    HiOutlineCreditCard,
    HiOutlineUserCircle,
    HiOutlineHome,
    HiOutlineQuestionMarkCircle,
    HiOutlineArrowRight,
    HiOutlineLightningBolt,
    HiOutlineGlobe,
    HiOutlineClock,
    HiOutlineCheck,
    HiOutlineX,
} from "react-icons/hi";

interface FaqItem {
    id: string;
    question: string;
    answer: string;
    category: string;
    isPopular?: boolean;
}

interface Category {
    id: string;
    label: string;
    icon: React.ReactNode;
    count: number;
}

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.08, delayChildren: 0.1 },
    },
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20, filter: "blur(8px)" },
    visible: {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        transition: {
            duration: 0.6,
            ease: [0.16, 1, 0.3, 1],
        },
    },
};

const categories: Category[] = [
    {
        id: "all",
        label: "All Questions",
        icon: <HiOutlineQuestionMarkCircle className="h-4 w-4" />,
        count: 24,
    },
    {
        id: "general",
        label: "General",
        icon: <HiOutlineHome className="h-4 w-4" />,
        count: 6,
    },
    {
        id: "account",
        label: "Account",
        icon: <HiOutlineUserCircle className="h-4 w-4" />,
        count: 5,
    },
    {
        id: "booking",
        label: "Booking",
        icon: <HiOutlineClock className="h-4 w-4" />,
        count: 7,
    },
    {
        id: "payments",
        label: "Payments",
        icon: <HiOutlineCreditCard className="h-4 w-4" />,
        count: 4,
    },
    {
        id: "security",
        label: "Security",
        icon: <HiOutlineShieldCheck className="h-4 w-4" />,
        count: 3,
    },
];

const faqData: FaqItem[] = [
    {
        id: "1",
        question: "How do I create an account on AuraSpace?",
        answer: "Creating an account is simple. Click the 'Sign Up' button in the top right corner, enter your email address or phone number, create a password, and verify your account via the confirmation link or OTP sent to you. You can also sign up using your Google or Facebook account for faster access.",
        category: "account",
        isPopular: true,
    },
    {
        id: "2",
        question: "What payment methods are accepted?",
        answer: "We accept all major payment methods including bKash, Nagad, Rocket, all major credit and debit cards (Visa, Mastercard, Amex), and bank transfers. All transactions are secured with 256-bit SSL encryption and PCI-DSS compliance.",
        category: "payments",
        isPopular: true,
    },
    {
        id: "3",
        question: "How does the booking process work?",
        answer: "Once you find a property you like, select your check-in and check-out dates, review the total price including any add-ons, and click 'Book Now'. You'll receive an instant confirmation email with your booking details and check-in instructions. For instant book properties, no host approval is needed.",
        category: "booking",
        isPopular: true,
    },
    {
        id: "4",
        question: "Is my personal information secure?",
        answer: "Absolutely. We use bank-grade encryption (AES-256) to protect your data. Your payment information is never stored on our servers - it's processed securely through our payment partners. We also offer two-factor authentication (2FA) for additional account security.",
        category: "security",
    },
    {
        id: "5",
        question: "Can I cancel my booking?",
        answer: "Yes, you can cancel your booking according to the cancellation policy set by the host. Most properties offer free cancellation up to 48 hours before check-in. Go to 'My Trips' in your dashboard, select the booking, and click 'Cancel'. Refunds are processed within 5-7 business days.",
        category: "booking",
    },
    {
        id: "6",
        question: "How do I become a host?",
        answer: "To become a host, click 'Become a Host' in the navigation menu. You'll need to verify your identity, upload photos of your property, set your availability and pricing, and submit for review. Our quality team reviews listings within 2-3 business days. Once approved, your property goes live immediately.",
        category: "general",
        isPopular: true,
    },
    {
        id: "7",
        question: "What is the service fee?",
        answer: "AuraSpace charges a modest service fee of 3-5% on bookings to maintain the platform, provide 24/7 support, and ensure secure transactions. This fee is clearly displayed before you confirm your booking, so there are no hidden charges.",
        category: "payments",
    },
    {
        id: "8",
        question: "How do I contact my host?",
        answer: "Once your booking is confirmed, you can message your host directly through our platform. Go to 'My Trips', select your booking, and click 'Message Host'. All communications are kept within our platform for your safety and to ensure we can assist if any issues arise.",
        category: "booking",
    },
    {
        id: "9",
        question: "What happens if the property doesn't match the description?",
        answer: "We take accuracy seriously. If the property significantly differs from the listing description or photos, contact our support team within 24 hours of check-in. We'll investigate immediately and offer solutions including rebooking or a full refund under our 'AuraSpace Guarantee'.",
        category: "security",
    },
    {
        id: "10",
        question: "Can I modify my reservation dates?",
        answer: "Yes, you can request date changes by going to 'My Trips' and clicking 'Modify Booking'. The host must approve the change, and price adjustments may apply based on the new dates. If the host cannot accommodate the new dates, you may need to cancel and rebook according to the cancellation policy.",
        category: "booking",
    },
    {
        id: "11",
        question: "How do I reset my password?",
        answer: "Click 'Forgot Password' on the login page, enter your registered email address, and we'll send you a secure password reset link. The link expires in 24 hours for security reasons. If you don't receive the email, check your spam folder or contact support.",
        category: "account",
    },
    {
        id: "12",
        question: "Do you offer corporate or long-term stays?",
        answer: "Yes, we offer special rates for corporate bookings and long-term stays (30+ days). For corporate accounts, please contact our B2B team at corporate@auraspace.com. Long-term stays automatically receive discounted weekly and monthly rates displayed on the listing.",
        category: "general",
    },
];

const FaqPage = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [activeCategory, setActiveCategory] = useState("all");
    const [openItems, setOpenItems] = useState<string[]>(["1"]);
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [helpfulItems, setHelpfulItems] = useState<
        Record<string, boolean | null>
    >({});

    const heroRef = useRef<HTMLElement>(null);
    const isHeroInView = useInView(heroRef, { once: true, margin: "-100px" });

    const filteredFaqs = useMemo(() => {
        return faqData.filter((faq) => {
            const matchesCategory =
                activeCategory === "all" || faq.category === activeCategory;
            const matchesSearch =
                faq.question
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [searchQuery, activeCategory]);

    const popularFaqs = useMemo(
        () => faqData.filter((faq) => faq.isPopular),
        [],
    );

    const toggleItem = (id: string) => {
        setOpenItems((prev) =>
            prev.includes(id)
                ? prev.filter((item) => item !== id)
                : [...prev, id],
        );
    };

    const markHelpful = (id: string, isHelpful: boolean) => {
        setHelpfulItems((prev) => ({ ...prev, [id]: isHelpful }));
    };

    return (
        <main className="min-h-screen w-full bg-slate-50/30">
            <section
                ref={heroRef}
                className="relative w-full overflow-hidden bg-slate-950 pb-24 pt-28 sm:pb-32 sm:pt-36 lg:pb-40 lg:pt-44"
            >
                <div className="pointer-events-none absolute inset-0 opacity-[0.03]">
                    <div
                        className="absolute inset-0"
                        style={{
                            backgroundImage:
                                "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.4) 1px, transparent 0)",
                            backgroundSize: "32px 32px",
                        }}
                    />
                </div>

                <div className="pointer-events-none absolute inset-0">
                    <div className="absolute -left-40 top-0 h-[500px] w-[500px] rounded-full bg-indigo-500/15 blur-3xl" />
                    <div className="absolute -right-40 bottom-0 h-[500px] w-[500px] rounded-full bg-violet-500/15 blur-3xl" />
                    <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-fuchsia-500/8 blur-3xl" />
                </div>

                <div className="container relative mx-auto w-full px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial="hidden"
                        animate={isHeroInView ? "visible" : "hidden"}
                        variants={containerVariants}
                        className="mx-auto max-w-4xl text-center"
                    >
                        <motion.h1
                            variants={itemVariants}
                            className="text-[36px] font-black leading-[1.05] tracking-[-0.035em] text-white sm:text-5xl md:text-[64px]"
                        >
                            How can we{" "}
                            <span className="bg-gradient-to-r from-indigo-300 via-violet-300 to-fuchsia-300 bg-clip-text text-transparent">
                                help you?
                            </span>
                        </motion.h1>

                        <motion.p
                            variants={itemVariants}
                            className="mx-auto mt-6 max-w-2xl text-base leading-[1.8] text-white/60 sm:text-lg"
                        >
                            Everything you need to know about booking, hosting,
                            and managing your stays on AuraSpace.
                        </motion.p>

                        <motion.div
                            variants={itemVariants}
                            className="mx-auto mt-12 max-w-2xl"
                        >
                            <div
                                className={`group relative flex items-center rounded-2xl border bg-white/5 backdrop-blur-xl transition-all duration-500 ${
                                    isSearchFocused
                                        ? "border-indigo-400/50 bg-white/10 shadow-[0_0_60px_rgba(99,102,241,0.25)]"
                                        : "border-white/10 hover:border-white/20 hover:bg-white/[0.08]"
                                }`}
                            >
                                <div className="pointer-events-none absolute left-6 text-white/30 transition-colors group-focus-within:text-indigo-300">
                                    <HiOutlineSearch className="h-5 w-5" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search for answers..."
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                    onFocus={() => setIsSearchFocused(true)}
                                    onBlur={() => setIsSearchFocused(false)}
                                    className="h-16 w-full rounded-2xl border-none bg-transparent pl-14 pr-32 text-sm font-medium text-white placeholder:text-white/30 focus:outline-none focus:ring-0 sm:text-base"
                                />
                                <div className="absolute right-3 flex items-center gap-2">
                                    {searchQuery && (
                                        <button
                                            onClick={() => setSearchQuery("")}
                                            className="rounded-full bg-white/10 p-2 text-white/60 transition-all hover:bg-white/20 hover:text-white"
                                        >
                                            <HiOutlineX className="h-4 w-4" />
                                        </button>
                                    )}
                                    <div className="hidden rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-[10px] font-bold text-white/40 sm:block">
                                        ⌘K
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            variants={itemVariants}
                            className="mx-auto mt-10 flex flex-wrap items-center justify-center gap-3"
                        >
                            <span className="text-xs text-white/30">
                                Popular searches:
                            </span>
                            {[
                                "Instant Booking",
                                "Refund Policy",
                                "Host Verification",
                            ].map((tag) => (
                                <button
                                    key={tag}
                                    onClick={() => setSearchQuery(tag)}
                                    className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-medium text-white/70 transition-all duration-300 hover:border-indigo-400/40 hover:bg-white/[0.10] hover:text-white"
                                >
                                    {tag}
                                </button>
                            ))}
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            <section className="relative w-full bg-white py-16 sm:py-20">
                <div className="container mx-auto w-full px-4 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-6xl">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                                duration: 0.6,
                                ease: [0.16, 1, 0.3, 1],
                            }}
                            className="flex flex-wrap items-center justify-center gap-2 sm:gap-3"
                        >
                            {categories.map((category) => (
                                <button
                                    key={category.id}
                                    onClick={() =>
                                        setActiveCategory(category.id)
                                    }
                                    className={`group relative flex items-center gap-2 rounded-full px-5 py-3 text-[11px] font-bold uppercase tracking-[0.12em] transition-all duration-300 sm:text-xs ${
                                        activeCategory === category.id
                                            ? "text-white shadow-lg shadow-indigo-500/25"
                                            : "border border-slate-200 bg-white text-slate-600 hover:border-indigo-200 hover:bg-indigo-50/30 hover:text-indigo-600"
                                    }`}
                                >
                                    {activeCategory === category.id && (
                                        <motion.div
                                            layoutId="activeCategory"
                                            className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600"
                                            transition={{
                                                type: "spring",
                                                stiffness: 400,
                                                damping: 30,
                                            }}
                                        />
                                    )}
                                    <span className="relative z-10 flex items-center gap-2">
                                        {category.icon}
                                        {category.label}
                                        <span
                                            className={`ml-1.5 rounded-full px-2 py-0.5 text-[9px] ${
                                                activeCategory === category.id
                                                    ? "bg-white/20 text-white"
                                                    : "bg-slate-100 text-slate-500"
                                            }`}
                                        >
                                            {category.count}
                                        </span>
                                    </span>
                                </button>
                            ))}
                        </motion.div>

                        <div className="mt-16 grid gap-10 lg:grid-cols-[1fr_420px] lg:gap-16">
                            <div className="space-y-4">
                                <AnimatePresence mode="wait">
                                    {filteredFaqs.length > 0 ? (
                                        <motion.div
                                            key={activeCategory + searchQuery}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -20 }}
                                            transition={{ duration: 0.3 }}
                                            className="space-y-4"
                                        >
                                            {filteredFaqs.map((faq, index) => (
                                                <motion.div
                                                    key={faq.id}
                                                    initial={{
                                                        opacity: 0,
                                                        y: 20,
                                                    }}
                                                    animate={{
                                                        opacity: 1,
                                                        y: 0,
                                                    }}
                                                    transition={{
                                                        duration: 0.5,
                                                        delay: index * 0.05,
                                                        ease: [0.16, 1, 0.3, 1],
                                                    }}
                                                    className={`group overflow-hidden rounded-2xl border transition-all duration-500 ${
                                                        openItems.includes(
                                                            faq.id,
                                                        )
                                                            ? "border-indigo-200 bg-gradient-to-br from-indigo-50/80 to-violet-50/30 shadow-[0_8px_30px_rgba(99,102,241,0.08)]"
                                                            : "border-slate-200 bg-white shadow-sm hover:border-indigo-200/60 hover:shadow-md"
                                                    }`}
                                                >
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            toggleItem(faq.id)
                                                        }
                                                        aria-expanded={openItems.includes(
                                                            faq.id,
                                                        )}
                                                        className="flex w-full items-center justify-between gap-4 p-6 text-left"
                                                    >
                                                        <div className="flex items-start gap-4">
                                                            <div
                                                                className={`mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-xs font-black transition-all duration-300 ${
                                                                    openItems.includes(
                                                                        faq.id,
                                                                    )
                                                                        ? "bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-500/25"
                                                                        : "bg-slate-100 text-slate-500 group-hover:bg-indigo-100 group-hover:text-indigo-600"
                                                                }`}
                                                            >
                                                                {String(
                                                                    index + 1,
                                                                ).padStart(
                                                                    2,
                                                                    "0",
                                                                )}
                                                            </div>
                                                            <div className="flex-1">
                                                                <div
                                                                    className={`mb-1.5 inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider transition-colors duration-300 ${
                                                                        openItems.includes(
                                                                            faq.id,
                                                                        )
                                                                            ? "bg-indigo-100 text-indigo-700"
                                                                            : "bg-slate-100 text-slate-500"
                                                                    }`}
                                                                >
                                                                    {categories.find(
                                                                        (c) =>
                                                                            c.id ===
                                                                            faq.category,
                                                                    )?.label ||
                                                                        "General"}
                                                                </div>
                                                                <h3 className="text-base font-black leading-snug tracking-[-0.01em] text-slate-900 sm:text-lg">
                                                                    {
                                                                        faq.question
                                                                    }
                                                                </h3>
                                                            </div>
                                                        </div>

                                                        <div
                                                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-all duration-300 ${
                                                                openItems.includes(
                                                                    faq.id,
                                                                )
                                                                    ? "rotate-180 bg-indigo-100 text-indigo-600"
                                                                    : "bg-slate-100 text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-500"
                                                            }`}
                                                        >
                                                            <HiOutlineChevronDown className="h-5 w-5" />
                                                        </div>
                                                    </button>

                                                    <AnimatePresence
                                                        initial={false}
                                                    >
                                                        {openItems.includes(
                                                            faq.id,
                                                        ) && (
                                                            <motion.div
                                                                initial={{
                                                                    height: 0,
                                                                    opacity: 0,
                                                                }}
                                                                animate={{
                                                                    height: "auto",
                                                                    opacity: 1,
                                                                }}
                                                                exit={{
                                                                    height: 0,
                                                                    opacity: 0,
                                                                }}
                                                                transition={{
                                                                    duration: 0.4,
                                                                    ease: [
                                                                        0.16, 1,
                                                                        0.3, 1,
                                                                    ],
                                                                }}
                                                                className="overflow-hidden"
                                                            >
                                                                <div className="px-6 pb-6 pl-[72px]">
                                                                    <p className="text-[15px] leading-[1.8] text-slate-600">
                                                                        {
                                                                            faq.answer
                                                                        }
                                                                    </p>

                                                                    <div className="mt-6 flex items-center justify-between border-t border-indigo-100/60 pt-4">
                                                                        <span className="text-xs font-semibold text-slate-500">
                                                                            Was
                                                                            this
                                                                            answer
                                                                            helpful?
                                                                        </span>
                                                                        <div className="flex items-center gap-2">
                                                                            <button
                                                                                onClick={(
                                                                                    e,
                                                                                ) => {
                                                                                    e.stopPropagation();
                                                                                    markHelpful(
                                                                                        faq.id,
                                                                                        true,
                                                                                    );
                                                                                }}
                                                                                className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition-all ${
                                                                                    helpfulItems[
                                                                                        faq
                                                                                            .id
                                                                                    ] ===
                                                                                    true
                                                                                        ? "bg-emerald-100 text-emerald-700"
                                                                                        : "bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-600"
                                                                                }`}
                                                                            >
                                                                                <HiOutlineCheck className="h-3.5 w-3.5" />
                                                                                Yes
                                                                            </button>
                                                                            <button
                                                                                onClick={(
                                                                                    e,
                                                                                ) => {
                                                                                    e.stopPropagation();
                                                                                    markHelpful(
                                                                                        faq.id,
                                                                                        false,
                                                                                    );
                                                                                }}
                                                                                className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition-all ${
                                                                                    helpfulItems[
                                                                                        faq
                                                                                            .id
                                                                                    ] ===
                                                                                    false
                                                                                        ? "bg-rose-100 text-rose-700"
                                                                                        : "bg-slate-100 text-slate-600 hover:bg-rose-50 hover:text-rose-600"
                                                                                }`}
                                                                            >
                                                                                <HiOutlineX className="h-3.5 w-3.5" />
                                                                                No
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </motion.div>
                                            ))}
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            initial={{
                                                opacity: 0,
                                                scale: 0.95,
                                            }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-slate-50 py-20 text-center"
                                        >
                                            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 text-slate-300">
                                                <HiOutlineSearch className="h-10 w-10" />
                                            </div>
                                            <h3 className="text-xl font-black text-slate-900">
                                                No results found
                                            </h3>
                                            <p className="mt-3 max-w-sm text-sm text-slate-500">
                                                We couldn&apos;t find any
                                                answers matching &quot;
                                                {searchQuery}&quot;. Try
                                                different keywords or browse by
                                                category.
                                            </p>
                                            <button
                                                onClick={() => {
                                                    setSearchQuery("");
                                                    setActiveCategory("all");
                                                }}
                                                className="mt-8 rounded-full bg-slate-950 px-8 py-3 text-xs font-extrabold uppercase tracking-[0.16em] text-white shadow-lg transition-all hover:bg-slate-800 hover:shadow-xl"
                                            >
                                                Clear Filters
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            <div className="space-y-6">
                                <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-8 shadow-[0_8px_30px_rgba(15,23,42,0.04)]">
                                    <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gradient-to-br from-indigo-50 to-violet-50 blur-3xl" />

                                    <div className="relative mb-8 flex items-center gap-4">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-500/20">
                                            <HiOutlineLightningBolt className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-black tracking-[-0.02em] text-slate-900">
                                                Popular Questions
                                            </h3>
                                            <p className="text-xs text-slate-500">
                                                Most viewed by our users
                                            </p>
                                        </div>
                                    </div>

                                    <div className="relative space-y-3">
                                        {popularFaqs.map((faq, idx) => (
                                            <button
                                                key={faq.id}
                                                onClick={() => {
                                                    setActiveCategory("all");
                                                    setOpenItems([faq.id]);
                                                    window.scrollTo({
                                                        top: 400,
                                                        behavior: "smooth",
                                                    });
                                                }}
                                                className="group flex w-full items-start gap-4 rounded-2xl border border-slate-100 bg-slate-50/50 p-4 text-left transition-all duration-300 hover:border-indigo-200 hover:bg-indigo-50/30"
                                            >
                                                <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-[10px] font-bold text-white shadow-md">
                                                    {idx + 1}
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-sm font-semibold leading-snug text-slate-800 transition-colors group-hover:text-indigo-700">
                                                        {faq.question}
                                                    </p>
                                                </div>
                                                <HiOutlineArrowRight className="mt-1 h-4 w-4 shrink-0 text-slate-300 transition-all group-hover:translate-x-1 group-hover:text-indigo-500" />
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-8 text-white shadow-2xl">
                                    <div className="pointer-events-none absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
                                    <div className="absolute -left-20 -top-20 h-40 w-40 rounded-full bg-indigo-500/30 blur-3xl" />
                                    <div className="absolute -bottom-20 -right-20 h-40 w-40 rounded-full bg-violet-500/30 blur-3xl" />

                                    <div className="relative mb-8">
                                        <div className="mb-2 flex items-center gap-2">
                                            <div className="flex h-2 w-2 animate-pulse rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
                                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-300">
                                                Live Support
                                            </span>
                                        </div>
                                        <h3 className="text-xl font-black tracking-[-0.02em]">
                                            Still need help?
                                        </h3>
                                        <p className="mt-2 text-sm leading-relaxed text-white/50">
                                            Our team is available 24/7 to assist
                                            you with any questions or concerns.
                                        </p>
                                    </div>

                                    <div className="relative space-y-4">
                                        <Link
                                            href="/contact"
                                            className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.05] p-5 backdrop-blur-sm transition-all duration-300 hover:border-emerald-400/30 hover:bg-emerald-500/10"
                                        >
                                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/20">
                                                <HiOutlineChatAlt2 className="h-6 w-6" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="text-sm font-bold text-white">
                                                    Live Chat
                                                </div>
                                                <div className="text-xs text-white/40">
                                                    Response time: &lt; 2 min
                                                </div>
                                            </div>
                                            <HiOutlineArrowRight className="h-5 w-5 text-white/20 transition-all duration-300 group-hover:translate-x-1 group-hover:text-emerald-400" />
                                        </Link>

                                        <Link
                                            href="mailto:support@auraspace.com"
                                            className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.05] p-5 backdrop-blur-sm transition-all duration-300 hover:border-indigo-400/30 hover:bg-indigo-500/10"
                                        >
                                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-500/20">
                                                <HiOutlineMail className="h-6 w-6" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="text-sm font-bold text-white">
                                                    Email Support
                                                </div>
                                                <div className="text-xs text-white/40">
                                                    Response time: &lt; 24 hours
                                                </div>
                                            </div>
                                            <HiOutlineArrowRight className="h-5 w-5 text-white/20 transition-all duration-300 group-hover:translate-x-1 group-hover:text-indigo-400" />
                                        </Link>

                                        <Link
                                            href="tel:+8801700000000"
                                            className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.05] p-5 backdrop-blur-sm transition-all duration-300 hover:border-fuchsia-400/30 hover:bg-fuchsia-500/10"
                                        >
                                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-fuchsia-500 to-pink-600 text-white shadow-lg shadow-fuchsia-500/20">
                                                <HiOutlinePhone className="h-6 w-6" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="text-sm font-bold text-white">
                                                    Phone Support
                                                </div>
                                                <div className="text-xs text-white/40">
                                                    Available 9 AM - 9 PM
                                                </div>
                                            </div>
                                            <HiOutlineArrowRight className="h-5 w-5 text-white/20 transition-all duration-300 group-hover:translate-x-1 group-hover:text-fuchsia-400" />
                                        </Link>
                                    </div>

                                    <div className="relative mt-8 rounded-2xl border border-white/5 bg-white/[0.03] p-4 backdrop-blur-sm">
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="text-white/40">
                                                Avg. response time
                                            </span>
                                            <span className="font-bold text-emerald-400">
                                                &lt; 2 hours
                                            </span>
                                        </div>
                                        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                                            <div className="h-full w-3/4 rounded-full bg-gradient-to-r from-emerald-500 to-teal-400" />
                                        </div>
                                    </div>
                                </div>

                                <div className="relative overflow-hidden rounded-3xl border border-indigo-100 bg-gradient-to-br from-indigo-50/80 to-violet-50/30 p-8">
                                    <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-indigo-200/50 blur-3xl" />

                                    <div className="relative flex items-start gap-5">
                                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white text-indigo-600 shadow-lg shadow-indigo-200">
                                            <HiOutlineGlobe className="h-7 w-7" />
                                        </div>
                                        <div>
                                            <h4 className="text-base font-black text-slate-900">
                                                Community Forum
                                            </h4>
                                            <p className="mt-2 text-sm leading-relaxed text-slate-600">
                                                Join discussions with other
                                                hosts and guests. Share tips,
                                                ask questions, and connect with
                                                our growing community.
                                            </p>
                                            <Link
                                                href="/community"
                                                className="mt-4 inline-flex items-center gap-2 rounded-full bg-indigo-600 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-indigo-500/20 transition-all hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-500/30"
                                            >
                                                Join Community
                                                <HiOutlineArrowRight className="h-3.5 w-3.5" />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="relative w-full overflow-hidden bg-white py-20 sm:py-24">
                <div className="container mx-auto w-full px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="mx-auto max-w-5xl rounded-[32px] bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 p-10 text-center text-white shadow-2xl sm:p-16"
                    >
                        <div className="pointer-events-none absolute inset-0 rounded-[32px] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />

                        <div className="relative">
                            <h2 className="text-3xl font-black tracking-[-0.03em] text-white sm:text-4xl md:text-5xl">
                                Can&apos;t find what you&apos;re{" "}
                                <span className="bg-gradient-to-r from-indigo-300 via-violet-300 to-fuchsia-300 bg-clip-text text-transparent">
                                    looking for?
                                </span>
                            </h2>

                            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/60">
                                Our dedicated support team is here to help you
                                with any questions or concerns you might have
                                about your booking.
                            </p>

                            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                                <Link
                                    href="/contact"
                                    className="group inline-flex h-14 items-center justify-center gap-3 rounded-full bg-white px-10 text-sm font-extrabold uppercase tracking-[0.16em] text-slate-950 shadow-[0_14px_40px_rgba(255,255,255,0.2)] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_18px_50px_rgba(255,255,255,0.3)]"
                                >
                                    Contact Support
                                    <HiOutlineArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                                </Link>

                                <Link
                                    href="/listings"
                                    className="inline-flex h-14 items-center justify-center gap-3 rounded-full border border-white/20 bg-white/[0.06] px-10 text-sm font-extrabold uppercase tracking-[0.16em] text-white backdrop-blur-md transition-all duration-300 hover:border-white/40 hover:bg-white/[0.12]"
                                >
                                    Explore Listings
                                </Link>
                            </div>

                            <div className="mt-12 grid grid-cols-3 gap-8 border-t border-white/10 pt-10">
                                <div className="text-center">
                                    <div className="bg-gradient-to-br from-white to-white/70 bg-clip-text text-3xl font-black text-transparent sm:text-4xl">
                                        &lt;2h
                                    </div>
                                    <div className="mt-2 text-[11px] font-bold uppercase tracking-[0.2em] text-white/40">
                                        Response Time
                                    </div>
                                </div>
                                <div className="text-center">
                                    <div className="bg-gradient-to-br from-white to-white/70 bg-clip-text text-3xl font-black text-transparent sm:text-4xl">
                                        24/7
                                    </div>
                                    <div className="mt-2 text-[11px] font-bold uppercase tracking-[0.2em] text-white/40">
                                        Support Hours
                                    </div>
                                </div>
                                <div className="text-center">
                                    <div className="bg-gradient-to-br from-white to-white/70 bg-clip-text text-3xl font-black text-transparent sm:text-4xl">
                                        99%
                                    </div>
                                    <div className="mt-2 text-[11px] font-bold uppercase tracking-[0.2em] text-white/40">
                                        Satisfaction
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>
        </main>
    );
};

export default FaqPage;