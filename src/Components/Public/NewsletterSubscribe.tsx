"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import {
    motion,
    useInView,
    useReducedMotion,
    type Variants,
} from "framer-motion";

const benefits = [
    "Exclusive premium stay deals",
    "New verified listings every week",
    "Event venue and hosting insights",
];

const avatars = [
    {
        src: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces&auto=format&q=80",
        alt: "Subscriber avatar",
    },
    {
        src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces&auto=format&q=80",
        alt: "Subscriber avatar",
    },
    {
        src: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=faces&auto=format&q=80",
        alt: "Subscriber avatar",
    },
    {
        src: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=faces&auto=format&q=80",
        alt: "Subscriber avatar",
    },
];

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
            ease: [0.16, 1, 0.3, 1],
            type: "tween",
        },
    },
};

export default function NewsletterSubscribe() {
    const reduceMotion = !!useReducedMotion();
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
    const sectionRef = useRef<HTMLElement>(null);
    const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const trimmed = email.trim();
        const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
        if (!valid) {
            setStatus("error");
            return;
        }
        setStatus("success");
        setEmail("");
    };

    return (
        <section
            ref={sectionRef}
            className="relative w-full overflow-hidden bg-white py-16 sm:py-20 lg:py-24"
        >
            <div className="absolute inset-0">
                <div className="absolute -left-24 top-10 h-[300px] w-[300px] rounded-full bg-indigo-50/80 blur-3xl" />
                <div className="absolute -right-24 bottom-10 h-[300px] w-[300px] rounded-full bg-violet-50/80 blur-3xl" />
            </div>

            <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                    variants={containerVariants}
                    className="relative overflow-hidden rounded-[28px] border border-white/10 bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 shadow-[0_28px_80px_rgba(15,23,42,0.16)]"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-white/[0.06] via-transparent to-transparent" />

                    <div className="relative z-10 grid gap-8 p-6 sm:p-8 lg:grid-cols-2 lg:items-center lg:gap-10 lg:p-10 xl:p-12">
                        <motion.div
                            variants={containerVariants}
                            className="flex flex-col"
                        >
                            

                            <motion.h2
                                variants={itemVariants}
                                className="text-[28px] font-black leading-[1.1] tracking-[-0.03em] text-white sm:text-4xl md:text-[40px]"
                            >
                                Get Curated{" "}
                                <span className="bg-gradient-to-r from-indigo-300 via-violet-300 to-indigo-200 bg-clip-text text-transparent">
                                    Premium Stay
                                </span>{" "}
                                Updates First
                            </motion.h2>

                            <motion.p
                                variants={itemVariants}
                                className="mt-4 max-w-md text-sm leading-[1.8] text-white/60 sm:text-[15px]"
                            >
                                Subscribe to receive handpicked luxury
                                properties, exclusive event venue updates,
                                hosting tips, and premium travel insights
                                directly from AuraSpace.
                            </motion.p>

                            <motion.div
                                variants={containerVariants}
                                className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3"
                            >
                                {benefits.map((benefit) => (
                                    <motion.div
                                        key={benefit}
                                        variants={itemVariants}
                                        className="flex h-full items-start gap-3 rounded-[16px] border border-white/10 bg-white/[0.07] px-4 py-4 backdrop-blur-sm transition-colors duration-300 hover:border-indigo-400/30 hover:bg-white/[0.10]"
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
                                        <p className="text-[13px] font-semibold leading-[1.5] text-white/80">
                                            {benefit}
                                        </p>
                                    </motion.div>
                                ))}
                            </motion.div>
                        </motion.div>

                        <motion.div variants={itemVariants} className="w-full">
                            <div className="rounded-[24px] border border-white/10 bg-white/[0.05] p-3 backdrop-blur-md sm:p-4">
                                <div className="rounded-[18px] border border-slate-200/80 bg-white p-5 shadow-[0_20px_50px_rgba(15,23,42,0.10)] sm:p-6">
                                    <div className="flex items-start gap-4">
                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/20">
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
                                                    d="M21.75 6.75v10.5A2.25 2.25 0 0119.5 19.5h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0l-7.5-4.615a2.25 2.25 0 01-1.07-1.916V6.75"
                                                />
                                            </svg>
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <h3 className="text-xl font-black tracking-[-0.02em] text-slate-950 sm:text-2xl">
                                                Join the premium list
                                            </h3>
                                            <p className="mt-1.5 text-[13px] leading-[1.7] text-slate-500 sm:text-sm">
                                                No spam. Only curated updates
                                                and exclusive AuraSpace
                                                opportunities.
                                            </p>
                                        </div>
                                    </div>

                                    <form
                                        onSubmit={handleSubmit}
                                        noValidate
                                        className="mt-6 space-y-3"
                                    >
                                        <div>
                                            <label
                                                htmlFor="newsletter-email"
                                                className="sr-only"
                                            >
                                                Email address
                                            </label>
                                            <input
                                                id="newsletter-email"
                                                type="email"
                                                value={email}
                                                onChange={(e) => {
                                                    setEmail(e.target.value);
                                                    if (status !== "idle")
                                                        setStatus("idle");
                                                }}
                                                placeholder="Enter your email address"
                                                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-900 outline-none transition-all duration-300 placeholder:font-normal placeholder:text-slate-400 focus:border-indigo-300 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                                                style={{ height: "52px" }}
                                            />
                                        </div>

                                        <motion.button
                                            type="submit"
                                            whileHover={
                                                reduceMotion
                                                    ? undefined
                                                    : {
                                                          scale: 1.01,
                                                          boxShadow:
                                                              "0 12px 32px rgba(99,102,241,0.30)",
                                                      }
                                            }
                                            whileTap={
                                                reduceMotion
                                                    ? undefined
                                                    : { scale: 0.98 }
                                            }
                                            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 text-[11px] font-extrabold uppercase tracking-[0.18em] text-white shadow-[0_8px_24px_rgba(99,102,241,0.20)] transition-all duration-300 hover:from-indigo-700 hover:to-violet-700"
                                            style={{ height: "52px" }}
                                        >
                                            Subscribe Now
                                            <motion.svg
                                                className="h-4 w-4"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                                strokeWidth="2.5"
                                                animate={
                                                    reduceMotion
                                                        ? undefined
                                                        : { x: [0, 4, 0] }
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
                                        </motion.button>
                                    </form>

                                    <div className="mt-4 min-h-[24px]">
                                        {status === "success" && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 6 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{
                                                    duration: 0.4,
                                                    type: "tween",
                                                }}
                                                className="flex items-center gap-2"
                                            >
                                                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100">
                                                    <svg
                                                        className="h-3 w-3 text-emerald-600"
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
                                                <p className="text-[13px] font-semibold text-emerald-600">
                                                    Thank you for subscribing to
                                                    AuraSpace updates.
                                                </p>
                                            </motion.div>
                                        )}

                                        {status === "error" && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 6 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{
                                                    duration: 0.4,
                                                    type: "tween",
                                                }}
                                                className="flex items-center gap-2"
                                            >
                                                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-rose-100">
                                                    <svg
                                                        className="h-3 w-3 text-rose-600"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                        strokeWidth="2.5"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="M6 18L18 6M6 6l12 12"
                                                        />
                                                    </svg>
                                                </div>
                                                <p className="text-[13px] font-semibold text-rose-600">
                                                    Please enter a valid email
                                                    address.
                                                </p>
                                            </motion.div>
                                        )}

                                        {status === "idle" && (
                                            <p className="text-xs leading-relaxed text-slate-400">
                                                By subscribing, you agree to
                                                receive curated AuraSpace
                                                emails. Unsubscribe anytime.
                                            </p>
                                        )}
                                    </div>

                                    <div className="mt-5 flex items-center gap-3 border-t border-slate-100 pt-5">
                                        <div className="flex -space-x-2.5">
                                            {avatars.map((avatar, i) => (
                                                <div
                                                    key={i}
                                                    className="relative h-8 w-8 overflow-hidden rounded-full border-2 border-white bg-slate-100 shadow-sm ring-1 ring-slate-200/50"
                                                >
                                                    <Image
                                                        src={avatar.src}
                                                        alt={avatar.alt}
                                                        fill
                                                        sizes="32px"
                                                        className="object-cover"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                        <p className="text-xs text-slate-500">
                                            <span className="font-bold text-slate-900">
                                                2,400+
                                            </span>{" "}
                                            hosts and guests already subscribed
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
