"use client";

import React, { useEffect, useState } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";

interface StatItem {
    id: number;
    value: string;
    label: string;
    description: string;
    icon: React.ReactNode;
}

const FALLBACK_STATS: StatItem[] = [
    {
        id: 1,
        value: "12,400+",
        label: "Premium Stays & Venues",
        description:
            "Verified luxury hotels, resorts, and exclusive event halls.",
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
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
            </svg>
        ),
    },
    {
        id: 2,
        value: "450K+",
        label: "Happy Guests",
        description:
            "Memorable experiences delivered worldwide with elevated comfort.",
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
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
            </svg>
        ),
    },
    {
        id: 3,
        value: "8,200+",
        label: "Verified Hosts",
        description:
            "Professional hosts managing premium spaces with custom decor support.",
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
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
            </svg>
        ),
    },
    {
        id: 4,
        value: "98.8%",
        label: "Successful Events",
        description:
            "Flawless execution of birthdays, anniversaries, and corporate events.",
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

const EASE = [0.16, 1, 0.3, 1] as const;

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.12,
            delayChildren: 0.1,
        },
    },
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30, filter: "blur(10px)" },
    visible: {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        transition: {
            duration: 0.75,
            ease: EASE,
        },
    },
};

function getServerUrl(): string {
    if (typeof window === "undefined") return "http://localhost:5000";
    return window.location.origin.includes("localhost")
        ? "http://localhost:5000"
        : "https://aura-space-server.vercel.app";
}

async function fetchStats(): Promise<{ totalProperties: number; totalReviews: number; avgRating: number } | null> {
    try {
        const res = await fetch(`${getServerUrl()}/api/properties/stats`);
        if (!res.ok) return null;
        const body = await res.json();
        if (body.success && body.data) {
            return {
                totalProperties: body.data.totalProperties || 0,
                totalReviews: body.data.totalReviews || 0,
                avgRating: body.data.avgRating || 0,
            };
        }
        return null;
    } catch {
        return null;
    }
}

export default function Statistics() {
    const reduceMotion = useReducedMotion();
    const [liveStats, setLiveStats] = useState<{ totalProperties: number; totalReviews: number } | null>(null);

    useEffect(() => {
        fetchStats().then((data) => {
            if (data) setLiveStats(data);
        });
    }, []);

    const statsData: StatItem[] = liveStats
        ? [
              {
                  ...FALLBACK_STATS[0],
                  value: `${(liveStats.totalProperties / 1000).toFixed(1)}K+`,
              },
              {
                  ...FALLBACK_STATS[1],
                  value: liveStats.totalReviews > 1000
                      ? `${(liveStats.totalReviews / 1000).toFixed(1)}K+`
                      : `${liveStats.totalReviews}+`,
              },
              FALLBACK_STATS[2],
              FALLBACK_STATS[3],
          ]
        : FALLBACK_STATS;

    return (
        <section className="relative w-full overflow-hidden bg-white py-16 text-slate-950 sm:py-20 lg:py-24">
            <div className="container relative z-10 mx-auto w-full px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.25 }}
                    variants={containerVariants}
                    className="mx-auto mb-12 max-w-3xl text-center sm:mb-14 lg:mb-16"
                >
                    <motion.h2
                        variants={itemVariants}
                        className="text-[28px] font-black leading-[1.08] tracking-[-0.03em] text-slate-950 sm:text-4xl md:text-[42px] lg:text-5xl"
                    >
                        Built for{" "}
                        <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-500 bg-clip-text text-transparent">
                            Premium Stays
                        </span>{" "}
                        & Exceptional Events
                    </motion.h2>

                    <motion.p
                        variants={itemVariants}
                        className="mt-4 text-sm leading-relaxed text-slate-500 sm:mt-5 sm:text-[15px]"
                    >
                        From luxury suite bookings to curated event experiences,
                        AuraSpace continues to earn trust through premium
                        spaces, seamless hosting, and elevated guest
                        satisfaction.
                    </motion.p>
                </motion.div>

                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    variants={containerVariants}
                    className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4 lg:gap-6"
                >
                    {statsData.map((stat) => (
                        <motion.article
                            key={stat.id}
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
                            className="group relative h-full overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_10px_35px_rgba(15,23,42,0.04)] transition-all duration-500 hover:border-indigo-200 hover:shadow-2xl hover:shadow-indigo-500/10 sm:rounded-3xl sm:p-6"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/80 via-white to-fuchsia-50/70 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                            <div className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 transition-transform duration-500 group-hover:scale-x-100" />
                            <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-indigo-50 blur-2xl transition-all duration-500 group-hover:scale-150 group-hover:bg-violet-100/70" />

                            <div className="relative z-10 flex h-full flex-col">
                                <motion.div
                                    whileHover={
                                        reduceMotion
                                            ? undefined
                                            : {
                                                  scale: 1.08,
                                                  rotate: 4,
                                                  transition: {
                                                      type: "spring",
                                                      stiffness: 400,
                                                      damping: 16,
                                                  },
                                              }
                                    }
                                    className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-50 via-violet-50 to-fuchsia-50 text-indigo-600 ring-1 ring-inset ring-indigo-100 shadow-sm"
                                >
                                    {stat.icon}
                                </motion.div>

                                <div className="mt-5 bg-gradient-to-r from-slate-950 via-indigo-700 to-violet-600 bg-clip-text text-3xl font-black tracking-[-0.03em] text-transparent sm:text-4xl">
                                    {stat.value}
                                </div>

                                <h3 className="mt-2 text-sm font-bold uppercase tracking-[0.12em] text-slate-800">
                                    {stat.label}
                                </h3>

                                <p className="mt-4 flex-1 border-t border-slate-200 pt-4 text-sm leading-relaxed text-slate-500">
                                    {stat.description}
                                </p>
                            </div>
                        </motion.article>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}