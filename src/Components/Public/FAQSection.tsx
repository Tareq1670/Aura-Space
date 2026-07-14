"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import {
    AnimatePresence,
    motion,
    useInView,
    useReducedMotion,
    type Variants,
} from "framer-motion";

interface FAQItem {
    id: number;
    question: string;
    answer: string;
    category: string;
}

const faqItems: FAQItem[] = [
    {
        id: 1,
        category: "Booking",
        question: "How do I book a premium stay on AuraSpace?",
        answer: "Search your destination, choose your preferred property, review availability and details, then complete your reservation through our secure booking flow. Once confirmed, you will receive all stay information and host contact details.",
    },
    {
        id: 2,
        category: "Verification",
        question: "Are AuraSpace properties verified?",
        answer: "Yes. AuraSpace is designed around trusted and curated experiences. Listings are reviewed for quality, accuracy, amenities, photos, pricing transparency, and guest suitability before being highlighted on the platform.",
    },
    {
        id: 3,
        category: "Payments",
        question: "Is payment secure on AuraSpace?",
        answer: "Absolutely. AuraSpace supports a secure checkout experience with modern payment standards. Your payment details are processed safely, and booking information is handled with privacy and reliability in mind.",
    },
    {
        id: 4,
        category: "Cancellation",
        question: "Can I cancel or modify my booking?",
        answer: "Cancellation and modification options depend on the property's policy. You can review the cancellation terms before booking, and your reservation details will show the available options after confirmation.",
    },
    {
        id: 5,
        category: "Events",
        question: "Can I book venues for events or celebrations?",
        answer: "Yes. AuraSpace supports premium event venues including rooftops, garden estates, luxury halls, private villas, and corporate spaces. You can browse event-friendly listings and request details based on your occasion.",
    },
    {
        id: 6,
        category: "Hosting",
        question: "How can I list my property on AuraSpace?",
        answer: "Hosts can list their property by submitting property details, images, location, amenities, pricing, and availability. After review, approved listings can start receiving booking requests from premium guests.",
    },
];

const categories = Array.from(new Set(faqItems.map((item) => item.category)));

const supportItems = [
    {
        title: "Verified Listings",
        text: "Curated premium stays and event-ready venues.",
        icon: (
            <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
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
        title: "Secure Payments",
        text: "Reliable checkout with clear and transparent pricing.",
        icon: (
            <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
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
        title: "Guest Support",
        text: "Help with reservations, hosting, and stay guidance.",
        icon: (
            <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M12 2.25a9.75 9.75 0 109.75 9.75A9.75 9.75 0 0012 2.25z"
                />
            </svg>
        ),
    },
];

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.06,
        },
    },
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 22 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.65,
            ease: EASE,
            type: "tween",
        },
    },
};

const cardClass =
    "relative overflow-hidden rounded-[24px] border border-slate-200/80 bg-white shadow-[0_16px_40px_rgba(15,23,42,0.05)]";

function FAQAccordionItem({
    item,
    isOpen,
    onToggle,
    reduceMotion,
}: {
    item: FAQItem;
    isOpen: boolean;
    onToggle: () => void;
    reduceMotion: boolean;
}) {
    return (
        <motion.div
            layout
            variants={itemVariants}
            whileHover={
                reduceMotion
                    ? undefined
                    : {
                          y: -3,
                          transition: {
                              type: "spring",
                              stiffness: 260,
                              damping: 22,
                          },
                      }
            }
            className={`${cardClass} group transition-all duration-300 hover:border-indigo-200 hover:shadow-[0_22px_50px_rgba(99,102,241,0.08)]`}
        >
            <button
                type="button"
                onClick={onToggle}
                aria-expanded={isOpen}
                aria-controls={`faq-answer-${item.id}`}
                className="flex w-full items-start justify-between gap-4 px-5 py-5 text-left sm:px-6 sm:py-6"
            >
                <div className="min-w-0">
                    <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1">
                        <motion.span
                            className="h-1.5 w-1.5 rounded-full bg-indigo-500"
                            animate={
                                reduceMotion || !isOpen
                                    ? undefined
                                    : {
                                          scale: [1, 1.35, 1],
                                          opacity: [0.7, 1, 0.7],
                                      }
                            }
                            transition={{
                                duration: 1.8,
                                repeat: Infinity,
                                ease: "easeInOut",
                                type: "tween",
                            }}
                        />
                        <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-indigo-700">
                            {item.category}
                        </span>
                    </div>

                    <h3 className="text-[15px] font-black leading-snug tracking-[-0.02em] text-slate-950 sm:text-[17px]">
                        {item.question}
                    </h3>
                </div>

                <motion.span
                    animate={isOpen ? { rotate: 180 } : { rotate: 0 }}
                    transition={
                        reduceMotion
                            ? { duration: 0 }
                            : {
                                  duration: 0.3,
                                  ease: EASE,
                                  type: "tween",
                              }
                    }
                    className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-700 transition-colors duration-300 group-hover:border-indigo-100 group-hover:bg-indigo-50 group-hover:text-indigo-600"
                >
                    <svg
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2.5"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19 9l-7 7-7-7"
                        />
                    </svg>
                </motion.span>
            </button>

            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        id={`faq-answer-${item.id}`}
                        initial={
                            reduceMotion
                                ? { opacity: 1, height: "auto" }
                                : { opacity: 0, height: 0 }
                        }
                        animate={{ opacity: 1, height: "auto" }}
                        exit={
                            reduceMotion
                                ? { opacity: 1, height: "auto" }
                                : { opacity: 0, height: 0 }
                        }
                        transition={{
                            duration: 0.28,
                            ease: EASE,
                            type: "tween",
                        }}
                        className="overflow-hidden"
                    >
                        <div className="px-5 pb-5 sm:px-6 sm:pb-6">
                            <div className="border-t border-slate-200 pt-4">
                                <p className="text-sm leading-[1.8] text-slate-500 sm:text-[15px]">
                                    {item.answer}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

export default function FAQSection() {
    const [openId, setOpenId] = useState<number | null>(1);
    const reduceMotion = !!useReducedMotion();
    const sectionRef = useRef<HTMLElement>(null);
    const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

    return (
        <section
            ref={sectionRef}
            className="relative w-full overflow-hidden bg-gradient-to-b from-white via-slate-50/40 to-white py-16 sm:py-20 lg:py-24"
        >
            <div className="absolute inset-0">
                <div className="absolute -left-24 top-10 h-[300px] w-[300px] rounded-full bg-indigo-50/80 blur-3xl" />
                <div className="absolute -right-24 bottom-10 h-[300px] w-[300px] rounded-full bg-violet-50/80 blur-3xl" />
            </div>

            <div className="container relative mx-auto w-full px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                    variants={containerVariants}
                    className="mx-auto mb-10 max-w-3xl text-center sm:mb-12 lg:mb-14"
                >
                    <motion.h2
                        variants={itemVariants}
                        className="text-[28px] font-black leading-[1.08] tracking-[-0.03em] text-slate-950 sm:text-4xl md:text-[42px] lg:text-5xl"
                    >
                        Everything You Need to Know About{" "}
                        <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 bg-clip-text text-transparent">
                            AuraSpace
                        </span>
                    </motion.h2>

                    <motion.p
                        variants={itemVariants}
                        className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-slate-500 sm:mt-5 sm:text-[15px]"
                    >
                        Clear answers about booking premium stays, verified
                        listings, secure payments, hosting, guest support, and
                        event-ready venues.
                    </motion.p>

                    <motion.div
                        variants={itemVariants}
                        className="mt-6 flex flex-wrap items-center justify-center gap-2.5"
                    >
                        {categories.map((category) => (
                            <span
                                key={category}
                                className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500 shadow-sm"
                            >
                                {category}
                            </span>
                        ))}
                    </motion.div>
                </motion.div>

                <div className="grid gap-6 lg:grid-cols-[340px_minmax(0,1fr)] xl:grid-cols-[360px_minmax(0,1fr)]">
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        animate={
                            isInView
                                ? { opacity: 1, y: 0 }
                                : { opacity: 0, y: 24 }
                        }
                        transition={{
                            duration: 0.7,
                            ease: EASE,
                            type: "tween",
                        }}
                        className={`h-fit ${cardClass} lg:sticky lg:top-24`}
                    >
                        <div className="p-5 sm:p-6">
                            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1">
                                <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                                <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-indigo-700">
                                    Support Center
                                </span>
                            </div>

                            <h3 className="mt-5 text-[24px] font-black leading-tight tracking-[-0.03em] text-slate-950">
                                Need help with your booking journey?
                            </h3>

                            <p className="mt-3 text-sm leading-[1.8] text-slate-500">
                                AuraSpace keeps premium booking simple,
                                transparent, and reliable for guests, hosts, and
                                event organizers.
                            </p>

                            <div className="mt-6 grid grid-cols-2 gap-3">
                                <div className="rounded-[20px] border border-slate-200 bg-slate-50 p-4 text-center">
                                    <div className="text-2xl font-black tracking-tight text-slate-950">
                                        <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                                            {faqItems.length}
                                        </span>
                                    </div>
                                    <div className="mt-1 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                                        Answers
                                    </div>
                                </div>

                                <div className="rounded-[20px] border border-slate-200 bg-slate-50 p-4 text-center">
                                    <div className="text-2xl font-black tracking-tight text-slate-950">
                                        <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                                            {categories.length}
                                        </span>
                                    </div>
                                    <div className="mt-1 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                                        Topics
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 space-y-3">
                                {supportItems.map((supportItem) => (
                                    <div
                                        key={supportItem.title}
                                        className="rounded-[20px] border border-slate-200 bg-slate-50 p-4 transition-all duration-300 hover:border-indigo-200 hover:bg-indigo-50/40"
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-sm shadow-indigo-500/20">
                                                {supportItem.icon}
                                            </div>
                                            <div>
                                                <div className="text-sm font-black text-slate-900">
                                                    {supportItem.title}
                                                </div>
                                                <div className="mt-1 text-[13px] leading-relaxed text-slate-500">
                                                    {supportItem.text}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-6 flex flex-col gap-3">
                                <motion.div
                                    whileHover={
                                        reduceMotion
                                            ? undefined
                                            : { y: -2, scale: 1.01 }
                                    }
                                    whileTap={
                                        reduceMotion
                                            ? undefined
                                            : { scale: 0.98 }
                                    }
                                >
                                    <Link
                                        href="/listings"
                                        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-3 text-[11px] font-extrabold uppercase tracking-[0.15em] text-white shadow-[0_12px_28px_rgba(99,102,241,0.18)] transition-all duration-300 hover:from-indigo-700 hover:to-violet-700"
                                    >
                                        Browse Listings
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
                                    whileHover={
                                        reduceMotion
                                            ? undefined
                                            : { y: -2, scale: 1.01 }
                                    }
                                    whileTap={
                                        reduceMotion
                                            ? undefined
                                            : { scale: 0.98 }
                                    }
                                >
                                    <Link
                                        href="/contact"
                                        className="inline-flex w-full items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-3 text-[11px] font-extrabold uppercase tracking-[0.15em] text-slate-900 transition-all duration-300 hover:border-indigo-200 hover:bg-indigo-50/50 hover:text-indigo-700"
                                    >
                                        Contact Support
                                    </Link>
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial="hidden"
                        animate={isInView ? "visible" : "hidden"}
                        variants={containerVariants}
                        className="space-y-4"
                    >
                        {faqItems.map((item) => (
                            <FAQAccordionItem
                                key={item.id}
                                item={item}
                                isOpen={openId === item.id}
                                onToggle={() =>
                                    setOpenId(
                                        openId === item.id ? null : item.id,
                                    )
                                }
                                reduceMotion={reduceMotion}
                            />
                        ))}
                    </motion.div>
                </div>
            </div>
        </section>
    );
}