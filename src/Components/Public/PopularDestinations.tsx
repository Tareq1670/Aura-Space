"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import {
    motion,
    useInView,
    useReducedMotion,
    type Variants,
} from "framer-motion";
import { Skeleton } from "@heroui/react";
import { getPopularDestinations } from "@/lib/actions/property-public";
import type { PopularDestination } from "@/lib/actions/property-public";

const EASE = [0.16, 1, 0.3, 1] as const;

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.08, delayChildren: 0.06 },
    },
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 24, filter: "blur(4px)" },
    visible: {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        transition: { duration: 0.6, ease: EASE },
    },
};

export default function PopularDestinations() {
    const [destinations, setDestinations] = useState<PopularDestination[]>([]);
    const [loading, setLoading] = useState(true);
    const sectionRef = useRef<HTMLElement>(null);
    const isInView = useInView(sectionRef, { once: true, margin: "-60px" });
    const reduceMotion = !!useReducedMotion();

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await getPopularDestinations();
                if (res.success && res.data && res.data.length > 0) {
                    setDestinations(res.data);
                }
            } catch {
                // no fallback — component hides when empty
            }
            setLoading(false);
        }
        fetchData();
    }, []);

    return (
        <section
            ref={sectionRef}
            className="relative w-full overflow-hidden bg-slate-50/50 py-16 sm:py-20 lg:py-24"
        >
            <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                    variants={containerVariants}
                    className="mx-auto mb-10 max-w-2xl text-center sm:mb-12 lg:mb-14"
                >
                    <motion.div
                        variants={itemVariants}
                        className="mb-3 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50/80 px-4 py-1.5"
                    >
                        <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-indigo-600">
                            Explore Destinations
                        </span>
                    </motion.div>

                    <motion.h2
                        variants={itemVariants}
                        className="text-3xl font-black leading-[1.1] tracking-[-0.03em] text-slate-950 sm:text-4xl md:text-[44px]"
                    >
                        Popular{" "}
                        <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 bg-clip-text text-transparent">
                            Destinations
                        </span>
                    </motion.h2>

                    <motion.p
                        variants={itemVariants}
                        className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-slate-500 sm:text-[15px]"
                    >
                        Discover our most sought-after locations worldwide, each offering unique experiences and premium accommodations.
                    </motion.p>
                </motion.div>

                {loading ? (
                    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <div key={i} className="aspect-[4/5] rounded-2xl overflow-hidden">
                                <Skeleton className="h-full w-full rounded-none" />
                            </div>
                        ))}
                    </div>
                ) : destinations.length === 0 ? null : (
                    <motion.div
                        initial="hidden"
                        animate={isInView ? "visible" : "hidden"}
                        variants={containerVariants}
                        className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4"
                    >
                        {destinations.map((dest) => (
                            <motion.div
                                key={dest.city}
                                variants={itemVariants}
                                className="group"
                            >
                                <Link
                                    href={`/listings?city=${encodeURIComponent(dest.city)}`}
                                    className="block h-full"
                                >
                                    <div className="relative aspect-[4/5] overflow-hidden rounded-2xl">
                                        <img
                                            src={dest.image || "/placeholder-property.svg"}
                                            alt={dest.city}
                                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            loading="lazy"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = "/placeholder-property.svg";
                                            }}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />

                                        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
                                            <h3 className="text-base font-black text-white sm:text-lg">
                                                {dest.city}
                                            </h3>
                                            {dest.country && (
                                                <p className="mt-0.5 text-xs text-white/70">
                                                    {dest.country}
                                                </p>
                                            )}
                                            <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-white/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-sm">
                                                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                                                </svg>
                                                {dest.count} {dest.count === 1 ? "property" : "properties"}
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </div>
        </section>
    );
}
