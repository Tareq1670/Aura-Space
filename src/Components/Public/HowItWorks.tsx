"use client";

import React, { useRef } from "react";
import Link from "next/link";
import {
    motion,
    useInView,
    useReducedMotion,
    useScroll,
    useTransform,
    type Variants,
} from "framer-motion";

interface Step {
    id: number;
    step: string;
    title: string;
    description: string;
    icon: React.ReactNode;
    highlight: string;
}

const steps: Step[] = [
    {
        id: 1,
        step: "01",
        title: "Search Your Dream Stay",
        description:
            "Browse curated luxury villas, premium suites, urban penthouses, and exclusive event venues across the globe with smart filters.",
        highlight: "Discover",
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
                    d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                />
            </svg>
        ),
    },
    {
        id: 2,
        step: "02",
        title: "Choose Verified Property",
        description:
            "Every listing is handpicked and verified. View real photos, transparent pricing, detailed amenities, and authentic guest reviews.",
        highlight: "Verify",
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
        id: 3,
        step: "03",
        title: "Book Instantly & Securely",
        description:
            "Reserve your stay with real-time availability, flexible cancellation options, and secure payment processing in just a few clicks.",
        highlight: "Reserve",
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
                    d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
                />
            </svg>
        ),
    },
    {
        id: 4,
        step: "04",
        title: "Enjoy Premium Experience",
        description:
            "Arrive and experience luxury living at its finest with dedicated host support, curated amenities, and unforgettable moments.",
        highlight: "Experience",
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
                    d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                />
            </svg>
        ),
    },
];

const stats = [
    { value: "50K+", label: "Properties Listed" },
    { value: "120+", label: "Countries Covered" },
    { value: "4.9★", label: "Guest Rating" },
    { value: "99%", label: "Satisfied Users" },
];

const EASE = [0.16, 1, 0.3, 1] as const;

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.14,
            delayChildren: 0.06,
        },
    },
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 32, filter: "blur(8px)" },
    visible: {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        transition: {
            duration: 0.75,
            ease: EASE,
            type: "tween",
        },
    },
};

function ConnectorLine({ reduceMotion }: { reduceMotion: boolean }) {
    const dotPositions = [0, 33.33, 66.66, 100];

    return (
        <div
            className="pointer-events-none absolute left-0 right-0 top-[56px] z-0 mx-auto hidden lg:block"
            style={{ width: "calc(100% - 140px)", marginLeft: "70px" }}
        >
            <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{
                    duration: 1.1,
                    delay: 0.3,
                    ease: EASE,
                    type: "tween",
                }}
                className="h-[2px] origin-left bg-gradient-to-r from-indigo-200 via-violet-200 to-indigo-200"
            />
            {!reduceMotion && (
                <motion.div
                    className="absolute inset-y-0 left-0 h-[2px] w-20 bg-gradient-to-r from-transparent via-indigo-400/60 to-transparent"
                    animate={{ x: ["-8%", "110%"] }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "linear",
                        type: "tween",
                    }}
                />
            )}
            {dotPositions.map((left, i) => (
                <motion.div
                    key={i}
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{
                        duration: 0.4,
                        delay: 0.55 + i * 0.1,
                        type: "spring",
                        stiffness: 280,
                        damping: 20,
                    }}
                    className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2"
                    style={{ left: `${left}%` }}
                >
                    <span className="absolute inset-0 rounded-full border-2 border-white bg-gradient-to-br from-indigo-500 to-violet-500 shadow-sm" />
                    {!reduceMotion && (
                        <motion.span
                            className="absolute inset-0 rounded-full border border-indigo-400/50"
                            animate={{ scale: [1, 2], opacity: [0.6, 0] }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeOut",
                                type: "tween",
                                delay: i * 0.25,
                            }}
                        />
                    )}
                </motion.div>
            ))}
        </div>
    );
}

function StepCard({
    step,
    index,
    total,
    reduceMotion,
}: {
    step: Step;
    index: number;
    total: number;
    reduceMotion: boolean;
}) {
    const cardRef = useRef<HTMLDivElement>(null);

    return (
        <motion.div
            ref={cardRef}
            variants={itemVariants}
            whileHover={
                reduceMotion
                    ? undefined
                    : {
                          y: -8,
                          transition: {
                              type: "spring",
                              stiffness: 280,
                              damping: 22,
                          },
                      }
            }
            className="group relative"
        >
            <div className="absolute -inset-px rounded-[24px] bg-gradient-to-br from-indigo-500/0 via-violet-500/0 to-indigo-500/0 opacity-0 blur-xl transition-all duration-500 group-hover:from-indigo-500/10 group-hover:via-violet-500/10 group-hover:to-indigo-500/10 group-hover:opacity-100" />

            <div className="relative flex h-full flex-col overflow-hidden rounded-[24px] border border-slate-200 bg-white p-6 shadow-[0_1px_3px_rgba(15,23,42,0.04)] transition-all duration-500 hover:border-indigo-200 hover:shadow-[0_20px_50px_rgba(99,102,241,0.08)] sm:p-7">
                <div className="flex items-start justify-between gap-3">
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
                        className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-md shadow-indigo-500/20"
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
                                    delay: index * 0.2,
                                }}
                            />
                        )}
                        {step.icon}
                    </motion.div>

                    <span className="bg-gradient-to-br from-indigo-500 to-violet-500 bg-clip-text text-[48px] font-black leading-none tracking-[-0.06em] text-transparent opacity-8 transition-opacity duration-500 group-hover:opacity-20 sm:text-[56px]">
                        {step.step}
                    </span>
                </div>

                <div className="mt-5 flex-1">
                    <div className="mb-2.5 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50/80 px-3 py-1">
                        <motion.span
                            className="h-1.5 w-1.5 rounded-full bg-indigo-500"
                            animate={
                                reduceMotion ? undefined : { scale: [1, 1.4, 1] }
                            }
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut",
                                type: "tween",
                            }}
                        />
                        <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-indigo-600">
                            Step {step.step}
                        </span>
                    </div>

                    <h3 className="text-lg font-black leading-tight tracking-[-0.02em] text-slate-900 sm:text-xl">
                        {step.title}
                    </h3>

                    <p className="mt-2.5 text-[13px] leading-[1.75] text-slate-500">
                        {step.description}
                    </p>
                </div>

                <div className="mt-5 inline-flex items-center gap-2">
                    <div className="h-px w-5 bg-indigo-300/50 transition-all duration-300 group-hover:w-8 group-hover:bg-indigo-400" />
                    <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400 transition-colors duration-300 group-hover:text-indigo-600">
                        {step.highlight}
                    </span>
                    <motion.svg
                        className="h-3.5 w-3.5 text-slate-400 transition-colors duration-300 group-hover:text-indigo-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        animate={reduceMotion ? undefined : { x: [0, 3, 0] }}
                        transition={{
                            duration: 1.4,
                            repeat: Infinity,
                            ease: "easeInOut",
                            type: "tween",
                        }}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M13 7l5 5m0 0l-5 5m5-5H6"
                        />
                    </motion.svg>
                </div>
            </div>

            {index < total - 1 && (
                <div className="mx-auto mt-3 hidden h-10 w-px bg-gradient-to-b from-indigo-200 to-transparent lg:block" />
            )}
        </motion.div>
    );
}

export default function HowItWorks() {
    const sectionRef = useRef<HTMLElement>(null);
    const isInView = useInView(sectionRef, { once: true, margin: "-80px" });
    const reduced = useReducedMotion();
    const reduceMotion = !!reduced;

    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"],
    });

    const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);

    return (
        <section
            ref={sectionRef}
            className="relative w-full overflow-hidden bg-white py-20 sm:py-24 lg:py-28"
        >
            <motion.div className="absolute inset-0" style={{ y: bgY }}>
                <div className="absolute -left-24 top-16 h-[380px] w-[380px] rounded-full bg-indigo-50/70 blur-3xl" />
                <div className="absolute -right-24 bottom-16 h-[380px] w-[380px] rounded-full bg-violet-50/60 blur-3xl" />
            </motion.div>

            <div className="container relative mx-auto w-full px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                    variants={containerVariants}
                    className="mx-auto mb-12 max-w-2xl text-center sm:mb-14 lg:mb-16"
                >
                    <motion.h2
                        variants={itemVariants}
                        className="text-3xl font-black leading-[1.1] tracking-[-0.03em] text-slate-950 sm:text-4xl md:text-[44px] lg:text-5xl"
                    >
                        Book Your{" "}
                        <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 bg-clip-text text-transparent">
                            Perfect Stay
                        </span>{" "}
                        in 4 Simple Steps
                    </motion.h2>

                    <motion.p
                        variants={itemVariants}
                        className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-slate-500 sm:text-[15px]"
                    >
                        From discovery to checkout, AuraSpace makes booking
                        premium properties and event venues effortless, secure,
                        and refined.
                    </motion.p>

                    <motion.div
                        variants={itemVariants}
                        className="mx-auto mt-6 flex items-center justify-center gap-2"
                    >
                        <div className="h-px w-10 bg-gradient-to-r from-transparent to-indigo-300" />
                        <motion.div
                            className="h-2 w-2 rotate-45 rounded-sm bg-gradient-to-br from-indigo-500 to-violet-500"
                            animate={
                                reduceMotion
                                    ? undefined
                                    : { rotate: [45, 225, 405] }
                            }
                            transition={{
                                duration: 8,
                                repeat: Infinity,
                                ease: "linear",
                                type: "tween",
                            }}
                        />
                        <div className="h-px w-10 bg-gradient-to-r from-violet-300 to-transparent" />
                    </motion.div>
                </motion.div>

                <div className="relative">
                    <ConnectorLine reduceMotion={reduceMotion} />

                    <motion.div
                        initial="hidden"
                        animate={isInView ? "visible" : "hidden"}
                        variants={containerVariants}
                        className="relative z-10 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4"
                    >
                        {steps.map((step, index) => (
                            <StepCard
                                key={step.id}
                                step={step}
                                index={index}
                                total={steps.length}
                                reduceMotion={reduceMotion}
                            />
                        ))}
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={
                        isInView
                            ? { opacity: 1, y: 0 }
                            : { opacity: 0, y: 20 }
                    }
                    transition={{
                        duration: 0.7,
                        delay: 0.5,
                        ease: EASE,
                        type: "tween",
                    }}
                    className="mx-auto mt-12 max-w-4xl sm:mt-14"
                >
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
                        {stats.map((stat, i) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, y: 12 }}
                                animate={
                                    isInView
                                        ? { opacity: 1, y: 0 }
                                        : { opacity: 0, y: 12 }
                                }
                                transition={{
                                    duration: 0.5,
                                    delay: 0.6 + i * 0.07,
                                    ease: EASE,
                                    type: "tween",
                                }}
                                whileHover={
                                    reduceMotion
                                        ? undefined
                                        : { y: -3, scale: 1.01 }
                                }
                                className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 text-center shadow-sm transition-all duration-300 hover:border-indigo-200 hover:shadow-md sm:p-5"
                            >
                                <div className="text-xl font-black tracking-tight sm:text-2xl">
                                    <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                                        {stat.value}
                                    </span>
                                </div>
                                <div className="mt-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400 sm:text-[11px]">
                                    {stat.label}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={
                        isInView
                            ? { opacity: 1, y: 0 }
                            : { opacity: 0, y: 20 }
                    }
                    transition={{
                        duration: 0.75,
                        delay: 0.65,
                        ease: EASE,
                        type: "tween",
                    }}
                    className="mx-auto mt-10 max-w-3xl sm:mt-12"
                >
                    <div className="relative overflow-hidden rounded-[24px] border border-white/10 bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.06] via-transparent to-transparent" />

                        <div className="relative z-10 flex flex-col items-center gap-5 p-7 text-center sm:flex-row sm:gap-6 sm:p-8 sm:text-left">
                            <motion.div
                                animate={
                                    reduceMotion
                                        ? undefined
                                        : { y: [0, -5, 0] }
                                }
                                transition={{
                                    duration: 3,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                    type: "tween",
                                }}
                                className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/[0.08] ring-1 ring-white/[0.1] backdrop-blur-sm"
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

                            <div className="flex-1">
                                <h3 className="text-xl font-black leading-tight tracking-[-0.02em] text-white sm:text-2xl">
                                    Ready to explore premium stays?
                                </h3>
                                <p className="mt-2 text-sm leading-relaxed text-white/60">
                                    Start browsing curated properties or list
                                    your own space and join the AuraSpace
                                    community.
                                </p>
                            </div>

                            <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
                                <motion.div
                                    whileHover={
                                        reduceMotion
                                            ? undefined
                                            : {
                                                  scale: 1.03,
                                                  boxShadow:
                                                      "0 10px 28px rgba(99,102,241,0.25)",
                                              }
                                    }
                                    whileTap={
                                        reduceMotion
                                            ? undefined
                                            : { scale: 0.97 }
                                    }
                                >
                                    <Link
                                        href="/listings"
                                        className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-2.5 text-[11px] font-extrabold uppercase tracking-[0.14em] text-slate-950 shadow-lg transition-colors duration-300 hover:bg-indigo-50"
                                    >
                                        Explore Now
                                        <motion.svg
                                            className="h-3.5 w-3.5"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            strokeWidth="2.5"
                                            animate={
                                                reduceMotion
                                                    ? undefined
                                                    : { x: [0, 3, 0] }
                                            }
                                            transition={{
                                                duration: 1.3,
                                                repeat: Infinity,
                                                ease: "easeInOut",
                                                type: "tween",
                                            }}
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M13 7l5 5m0 0l-5 5m5-5H6"
                                            />
                                        </motion.svg>
                                    </Link>
                                </motion.div>

                                <motion.div
                                    whileHover={
                                        reduceMotion
                                            ? undefined
                                            : {
                                                  scale: 1.03,
                                                  borderColor:
                                                      "rgba(255,255,255,0.3)",
                                              }
                                    }
                                    whileTap={
                                        reduceMotion
                                            ? undefined
                                            : { scale: 0.97 }
                                    }
                                >
                                    <Link
                                        href="/dashboard/host/items/add"
                                        className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.07] px-6 py-2.5 text-[11px] font-extrabold uppercase tracking-[0.14em] text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/[0.12]"
                                    >
                                        List Property
                                    </Link>
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}