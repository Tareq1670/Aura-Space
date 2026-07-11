"use client";

import React, { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import {
    motion,
    useInView,
    useReducedMotion,
} from "framer-motion";

interface ServiceCard {
    id: string;
    title: string;
    description: string;
    icon: React.ReactNode;
    image?: string;
    href: string;
    variant: "large" | "image" | "text";
    span: string;
}

const services: ServiceCard[] = [
    {
        id: "curated-stays",
        title: "Designing Spaces That Feel like Luxury Home",
        description:
            "Every property on AuraSpace is handpicked and verified. From luxury villas to urban penthouses — discover spaces that redefine comfort, style, and hospitality standards for every kind of traveler.",
        icon: (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
            </svg>
        ),
        image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1200&auto=format&fit=crop",
        href: "/listings",
        variant: "large",
        span: "sm:col-span-2 lg:col-span-2 lg:row-span-2",
    },
    {
        id: "smart-booking",
        title: "Thoughtful Design",
        description:
            "Book instantly with real-time availability, transparent pricing, and flexible cancellation policies.",
        icon: (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
            </svg>
        ),
        href: "/listings",
        variant: "text",
        span: "",
    },
    {
        id: "host-tools",
        title: "Timeless Spaces",
        description:
            "List your property in minutes with smart onboarding, analytics, and revenue tools built for hosts.",
        icon: (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z" />
            </svg>
        ),
        href: "/dashboard/properties/add",
        variant: "text",
        span: "",
    },
    {
        id: "lifestyle",
        title: "Tailored to Your Lifestyle",
        description:
            "From minimalist retreats to grand estates — every AuraSpace property is curated to match the way you love to live and travel.",
        icon: (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 01.778-.332 48.294 48.294 0 005.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
            </svg>
        ),
        href: "/listings",
        variant: "text",
        span: "",
    },
    {
        id: "event-venues",
        title: "From Concept to Completion",
        description:
            "Book stunning rooftops, historic halls, garden estates, and modern lofts for weddings, corporate retreats, and celebrations.",
        icon: (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
            </svg>
        ),
        image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=1200&auto=format&fit=crop",
        href: "/listings?category=events",
        variant: "image",
        span: "sm:col-span-2 lg:col-span-2",
    },
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.12, delayChildren: 0.15 },
    },
};

const cardVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.95, filter: "blur(12px)" },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        filter: "blur(0px)",
        transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
    },
};

const headerVariants = {
    hidden: { opacity: 0, y: 28, filter: "blur(10px)" },
    visible: {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] },
    },
};

export default function OurServices() {
    const sectionRef = useRef<HTMLElement>(null);
    const isInView = useInView(sectionRef, { once: true, margin: "-80px" });
    const reduceMotion = useReducedMotion();

    return (
        <section
            ref={sectionRef}
            className="relative w-full overflow-hidden bg-white py-14 sm:py-20 md:py-24 lg:py-28"
        >
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <motion.div
                    className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-indigo-50 blur-3xl sm:h-96 sm:w-96"
                    animate={
                        reduceMotion
                            ? {}
                            : { scale: [1, 1.15, 0.95, 1], x: [0, 40, -20, 0], y: [0, 30, -10, 0] }
                    }
                    transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                    className="absolute -right-20 top-1/3 h-64 w-64 rounded-full bg-violet-50 blur-3xl sm:h-80 sm:w-80"
                    animate={
                        reduceMotion
                            ? {}
                            : { scale: [1.05, 0.9, 1.1, 1.05], x: [0, -30, 15, 0], y: [0, -20, 25, 0] }
                    }
                    transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                    className="absolute bottom-0 left-1/3 h-48 w-48 rounded-full bg-fuchsia-50/60 blur-3xl sm:h-64 sm:w-64"
                    animate={
                        reduceMotion
                            ? {}
                            : { scale: [0.9, 1.2, 1, 0.9], opacity: [0.4, 0.7, 0.5, 0.4] }
                    }
                    transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 3 }}
                />
            </div>

            <div className="relative z-10 mx-auto w-full container px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                    variants={containerVariants}
                    className="mb-10 sm:mb-12 md:mb-14 lg:mb-16"
                >
                    <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                        <div className="max-w-2xl">
                            <motion.div
                                variants={headerVariants}
                                className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50/80 px-3.5 py-1.5 backdrop-blur-sm sm:mb-5"
                            >
                                <motion.span
                                    className="h-1.5 w-1.5 rounded-full bg-indigo-500"
                                    animate={
                                        reduceMotion
                                            ? {}
                                            : {
                                                  scale: [1, 1.5, 1],
                                                  opacity: [0.7, 1, 0.7],
                                                  boxShadow: [
                                                      "0 0 0 rgba(99,102,241,0)",
                                                      "0 0 10px rgba(99,102,241,0.5)",
                                                      "0 0 0 rgba(99,102,241,0)",
                                                  ],
                                              }
                                    }
                                    transition={{ duration: 2, repeat: Infinity }}
                                />
                                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-600">
                                    Our Services
                                </span>
                            </motion.div>

                            <motion.h2
                                variants={headerVariants}
                                className="text-[26px] font-black leading-[1.08] tracking-[-0.03em] text-slate-950 sm:text-4xl md:text-[42px] lg:text-5xl"
                            >
                                Everything You Need for{" "}
                                <span className="relative inline-block">
                                    <span className="relative z-10 bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-500 bg-clip-text text-transparent">
                                        Extraordinary Stays
                                    </span>
                                    <motion.span
                                        initial={{ scaleX: 0 }}
                                        animate={isInView ? { scaleX: 1 } : {}}
                                        transition={{ duration: 0.9, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
                                        className="absolute -bottom-1 left-0 h-[3px] w-full origin-left rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-indigo-400 opacity-70"
                                    />
                                </span>
                            </motion.h2>

                            <motion.p
                                variants={headerVariants}
                                className="mt-4 max-w-xl text-sm leading-relaxed text-slate-500 sm:mt-5 sm:text-[15px]"
                            >
                                AuraSpace brings together premium properties, smart booking technology, and
                                world-class support — creating a seamless experience for travelers, hosts,
                                and event organizers alike.
                            </motion.p>
                        </div>

                        <motion.div variants={headerVariants} className="hidden shrink-0 md:block">
                            <Link
                                href="/listings"
                                className="group inline-flex items-center gap-2.5 rounded-full bg-slate-950 px-6 py-3 text-[11px] font-bold uppercase tracking-[0.15em] text-white shadow-lg shadow-slate-900/10 transition-all duration-300 hover:bg-indigo-600 hover:shadow-indigo-500/25"
                            >
                                View All
                                <motion.svg
                                    className="h-3.5 w-3.5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth="2.5"
                                    animate={reduceMotion ? {} : { x: [0, 3, 0] }}
                                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </motion.svg>
                            </Link>
                        </motion.div>
                    </div>
                </motion.div>

                <motion.div
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                    variants={containerVariants}
                    className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:auto-rows-[minmax(210px,auto)] lg:gap-5 xl:auto-rows-[minmax(230px,auto)] xl:gap-6"
                >
                    {services.map((service) => (
                        <motion.div
                            key={service.id}
                            variants={cardVariants}
                            className={`group ${service.span}`}
                        >
                            {service.variant === "large" && (
                                <LargeCard service={service} reduceMotion={!!reduceMotion} />
                            )}
                            {service.variant === "image" && <ImageCard service={service} />}
                            {service.variant === "text" && <TextCard service={service} />}
                        </motion.div>
                    ))}
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.7, delay: 0.5 }}
                    className="mt-8 md:hidden"
                >
                    <Link
                        href="/listings"
                        className="group flex w-full items-center justify-center gap-2.5 rounded-2xl bg-slate-950 px-6 py-3.5 text-[11px] font-bold uppercase tracking-[0.16em] text-white shadow-lg shadow-slate-900/10 transition-all duration-300 hover:bg-indigo-600"
                    >
                        View All Services
                        <svg
                            className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2.5"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}

function LargeCard({ service, reduceMotion }: { service: ServiceCard; reduceMotion: boolean }) {
    return (
        <motion.div
            whileHover={reduceMotion ? undefined : { y: -6, transition: { type: "spring", stiffness: 300, damping: 20 } }}
            className="relative flex h-full min-h-[340px] w-full flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white transition-all duration-500 group-hover:border-indigo-200 group-hover:shadow-2xl group-hover:shadow-indigo-500/10 sm:min-h-[400px] sm:rounded-3xl lg:min-h-0"
        >
            {service.image && (
                <div className="absolute inset-0 z-0">
                    <Image
                        src={service.image}
                        alt={service.title}
                        fill
                        sizes="(max-width: 639px) 100vw, (max-width: 1023px) 100vw, 66vw"
                        className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-white via-white/85 to-white/30" />
                    <div className="absolute inset-0 bg-gradient-to-br from-white/95 via-white/60 to-transparent" />
                </div>
            )}

            <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-[3px] origin-left scale-x-0 bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 transition-transform duration-500 group-hover:scale-x-100" />

            <div className="relative z-10 flex h-full flex-col p-6 sm:p-8 lg:p-9">
                <div className="mb-5 flex flex-wrap items-center gap-3 sm:mb-6">
                    <motion.div
                        className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-500/30 sm:h-12 sm:w-12"
                        whileHover={reduceMotion ? undefined : { scale: 1.1, rotate: 5 }}
                        transition={{ type: "spring", stiffness: 400, damping: 15 }}
                    >
                        {service.icon}
                    </motion.div>
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-100 bg-indigo-50/90 px-3 py-1 text-[9px] font-bold uppercase tracking-wider text-indigo-700 backdrop-blur-sm">
                        <motion.span
                            className="h-1 w-1 rounded-full bg-indigo-500"
                            animate={reduceMotion ? {} : { scale: [1, 1.6, 1], opacity: [0.6, 1, 0.6] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                        />
                        Featured
                    </span>
                </div>

                <h3 className="max-w-lg text-xl font-black leading-tight tracking-[-0.02em] text-slate-950 sm:text-2xl md:text-[28px] lg:text-[32px]">
                    {service.title}
                </h3>

                <p className="mt-3 max-w-xl flex-1 text-sm leading-relaxed text-slate-500 sm:mt-4 sm:text-[15px]">
                    {service.description}
                </p>

                <motion.div
                    className="mt-5 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.15em] text-indigo-600 sm:mt-6"
                    whileHover={reduceMotion ? undefined : { x: 4 }}
                >
                    <span>Learn More</span>
                    <motion.svg
                        className="h-3.5 w-3.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        animate={reduceMotion ? {} : { x: [0, 4, 0] }}
                        transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </motion.svg>
                </motion.div>
            </div>

            <div className="pointer-events-none absolute -right-12 -bottom-12 z-0 h-44 w-44 rounded-full border border-indigo-100/60 transition-transform duration-700 group-hover:scale-110" />
            <div className="pointer-events-none absolute -right-7 -bottom-7 z-0 h-32 w-32 rounded-full border border-indigo-100/80" />
            <div className="pointer-events-none absolute -right-3 -bottom-3 z-0 h-20 w-20 rounded-full border border-indigo-100" />
        </motion.div>
    );
}

function ImageCard({ service }: { service: ServiceCard }) {
    return (
        <motion.div
            whileHover={{ y: -6, transition: { type: "spring", stiffness: 300, damping: 20 } }}
            className="relative flex h-full min-h-[240px] w-full flex-col overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 transition-all duration-500 group-hover:border-indigo-400/40 group-hover:shadow-2xl group-hover:shadow-indigo-500/20 sm:min-h-[260px] sm:rounded-3xl lg:min-h-0"
        >
            {service.image && (
                <div className="absolute inset-0 z-0 overflow-hidden">
                    <Image
                        src={service.image}
                        alt={service.title}
                        fill
                        sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 66vw"
                        className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/20" />
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 via-transparent to-violet-600/15 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                    <motion.div
                        className="absolute -left-1/3 top-0 h-full w-1/4 -skew-x-12 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                        initial={{ x: "-100%" }}
                        whileHover={{ x: "500%" }}
                        transition={{ duration: 0.8, ease: "easeInOut" }}
                    />
                </div>
            )}

            <div className="relative z-10 flex h-full flex-col justify-end p-5 sm:p-7 lg:p-8">
                <motion.div
                    className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-white ring-1 ring-inset ring-white/20 backdrop-blur-md sm:mb-4"
                    whileHover={{ scale: 1.1, backgroundColor: "rgba(99,102,241,0.8)" }}
                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                >
                    {service.icon}
                </motion.div>

                <h3 className="text-lg font-black leading-tight tracking-[-0.02em] text-white sm:text-xl md:text-2xl">
                    {service.title}
                </h3>

                <p className="mt-2 max-w-md text-[13px] leading-relaxed text-slate-300 sm:text-sm">
                    {service.description}
                </p>

                <motion.div
                    className="mt-3 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.15em] text-indigo-300 sm:mt-4"
                    whileHover={{ x: 4 }}
                >
                    <span>Explore</span>
                    <svg
                        className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2.5"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                </motion.div>
            </div>
        </motion.div>
    );
}

function TextCard({ service }: { service: ServiceCard }) {
    return (
        <motion.div
            whileHover={{ y: -6, transition: { type: "spring", stiffness: 300, damping: 20 } }}
            className="relative flex h-full min-h-[200px] w-full flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 transition-all duration-500 group-hover:border-indigo-200 group-hover:shadow-2xl group-hover:shadow-indigo-500/10 sm:min-h-[220px] sm:rounded-3xl sm:p-6 lg:p-7 lg:min-h-0"
        >
            <div className="pointer-events-none absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 transition-transform duration-500 group-hover:scale-x-100" />

            <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-indigo-50/80 blur-2xl transition-all duration-700 group-hover:scale-150 group-hover:bg-indigo-100/60" />

            <div className="relative z-10 flex h-full flex-col">
                <motion.div
                    className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-50 to-violet-50 text-indigo-600 ring-1 ring-inset ring-indigo-100 sm:mb-5 sm:h-11 sm:w-11"
                    whileHover={{
                        scale: 1.1,
                        backgroundColor: "rgb(99,102,241)",
                        color: "white",
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                >
                    {service.icon}
                </motion.div>

                <h3 className="text-base font-black leading-tight tracking-[-0.02em] text-slate-950 sm:text-lg md:text-xl">
                    {service.title}
                </h3>

                <p className="mt-2 flex-1 text-[13px] leading-relaxed text-slate-500">
                    {service.description}
                </p>

                <motion.div
                    className="mt-3 inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400 transition-colors duration-300 group-hover:text-indigo-600 sm:mt-4"
                    whileHover={{ x: 4 }}
                >
                    <span>Discover</span>
                    <svg
                        className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2.5"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                </motion.div>
            </div>
        </motion.div>
    );
}