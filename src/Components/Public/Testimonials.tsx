"use client";

import React from "react";
import Marquee from "react-fast-marquee";
import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";

interface TestimonialItem {
    id: number;
    name: string;
    role: string;
    location: string;
    category: string;
    rating: number;
    quote: string;
    image: string;
}

const testimonials: TestimonialItem[] = [
    {
        id: 1,
        name: "Sophia Bennett",
        role: "Luxury Traveler",
        location: "London, UK",
        category: "Premium Stay",
        rating: 5,
        quote: "AuraSpace made our anniversary trip feel effortlessly luxurious. The villa looked even better in person, and every detail was handled with genuine care.",
        image: "https://i.pravatar.cc/160?img=32",
    },
    {
        id: 2,
        name: "Daniel Carter",
        role: "Event Planner",
        location: "New York, USA",
        category: "Event Venue",
        rating: 5,
        quote: "Finding a refined venue for our corporate retreat was surprisingly easy. The entire process felt premium, clear, and incredibly well managed.",
        image: "https://i.pravatar.cc/160?img=12",
    },
    {
        id: 3,
        name: "Ava Rahman",
        role: "Frequent Guest",
        location: "Dubai, UAE",
        category: "Luxury Suite",
        rating: 5,
        quote: "Everything felt beautifully curated. From the property design to the support team, AuraSpace delivered a polished experience from start to finish.",
        image: "https://i.pravatar.cc/160?img=47",
    },
    {
        id: 4,
        name: "James Holloway",
        role: "Property Host",
        location: "Sydney, Australia",
        category: "Host Experience",
        rating: 5,
        quote: "As a host, I value how elevated the platform feels. It presents premium properties beautifully and attracts the right audience.",
        image: "https://i.pravatar.cc/160?img=15",
    },
    {
        id: 5,
        name: "Emily Foster",
        role: "Wedding Client",
        location: "Toronto, Canada",
        category: "Celebration Venue",
        rating: 5,
        quote: "We booked a garden estate for our engagement celebration and it exceeded every expectation. Elegant, seamless, and truly unforgettable.",
        image: "https://i.pravatar.cc/160?img=5",
    },
    {
        id: 6,
        name: "Noah Williams",
        role: "Workation Guest",
        location: "Singapore",
        category: "Work & Stay",
        rating: 5,
        quote: "The platform blends practicality and luxury so well. I found a beautiful city penthouse with an excellent workspace in minutes.",
        image: "https://i.pravatar.cc/160?img=53",
    },
];

const featuredTestimonial = testimonials[0];
const marqueeTestimonials = testimonials.slice(1);

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.12,
            delayChildren: 0.08,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 24, filter: "blur(8px)" },
    visible: {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        transition: {
            duration: 0.75,
            ease: [0.16, 1, 0.3, 1],
        },
    },
};

function StarRating({ rating }: { rating: number }) {
    return (
        <div className="flex items-center gap-1">
            {Array.from({ length: rating }).map((_, index) => (
                <svg
                    key={index}
                    className="h-3.5 w-3.5 fill-amber-400 text-amber-400"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.176 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81H7.03a1 1 0 00.95-.69l1.07-3.292z" />
                </svg>
            ))}
        </div>
    );
}

function FeaturedCard({
    item,
    reduceMotion,
}: {
    item: TestimonialItem;
    reduceMotion: boolean;
}) {
    return (
        <motion.div
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
            className="relative overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.06)]"
        >
            <motion.div
                className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500"
                animate={
                    reduceMotion
                        ? {}
                        : {
                              backgroundPosition: [
                                  "0% 50%",
                                  "100% 50%",
                                  "0% 50%",
                              ],
                          }
                }
                transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                style={{ backgroundSize: "200% 200%" }}
            />
            <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[1.4fr_0.8fr] lg:gap-8 lg:p-10">
                <div>
                    <div className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-indigo-700">
                        <motion.span
                            className="h-1.5 w-1.5 rounded-full bg-indigo-500"
                            animate={
                                reduceMotion
                                    ? {}
                                    : {
                                          scale: [1, 1.45, 1],
                                          opacity: [0.7, 1, 0.7],
                                      }
                            }
                            transition={{ duration: 2, repeat: Infinity }}
                        />
                        Featured Review
                    </div>

                    <div className="mt-5 flex items-center gap-3">
                        <StarRating rating={item.rating} />
                        <span className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">
                            Trusted Experience
                        </span>
                    </div>

                    <motion.p
                        initial={{ opacity: 0, y: 12 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, delay: 0.15 }}
                        className="mt-5 max-w-2xl text-lg font-medium leading-relaxed text-slate-700 sm:text-xl lg:text-[1.45rem] lg:leading-relaxed"
                    >
                        “{item.quote}”
                    </motion.p>

                    <div className="mt-6 flex items-center gap-4 border-t border-slate-200 pt-5">
                        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl ring-1 ring-slate-200">
                            <Image
                                height={140}
                                width={140}
                                src={item.image}
                                alt={item.name}
                                className="h-full w-full object-cover"
                                loading="lazy"
                            />
                        </div>
                        <div className="min-w-0">
                            <h3 className="truncate text-base font-black tracking-[-0.02em] text-slate-950">
                                {item.name}
                            </h3>
                            <p className="mt-0.5 text-sm font-medium text-slate-500">
                                {item.role}
                            </p>
                            <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-400">
                                <span>{item.location}</span>
                                <span className="h-1 w-1 rounded-full bg-slate-300" />
                                <span>{item.category}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <motion.div
                    initial={{ opacity: 0, x: 16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                    className="flex h-full flex-col justify-between rounded-[24px] border border-slate-200 bg-gradient-to-br from-slate-50 to-indigo-50/50 p-5 sm:p-6"
                >
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-500 text-white shadow-lg shadow-indigo-500/20">
                            <svg
                                className="h-5 w-5"
                                fill="currentColor"
                                viewBox="0 0 32 32"
                                aria-hidden="true"
                            >
                                <path d="M10.7 8C6.98 8 4 11.08 4 14.8c0 3.28 2.3 5.74 5.46 5.74.22 0 .44-.02.66-.06-.48 1.84-1.8 3.52-4.18 5.02l1.26 2.5c5.7-2.52 9.28-7.08 9.28-13.08C16.48 11.1 14.04 8 10.7 8zm12 0c-3.72 0-6.7 3.08-6.7 6.8 0 3.28 2.3 5.74 5.46 5.74.22 0 .44-.02.66-.06-.48 1.84-1.8 3.52-4.18 5.02l1.26 2.5c5.7-2.52 9.28-7.08 9.28-13.08C28.48 11.1 26.04 8 22.7 8z" />
                            </svg>
                        </div>
                        <div className="rounded-full border border-indigo-100 bg-white px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-indigo-700 shadow-sm">
                            5-Star Review
                        </div>
                    </div>

                    <div className="mt-6 space-y-3">
                        <div className="rounded-2xl border border-white bg-white/90 px-4 py-3 shadow-sm">
                            <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                                Experience
                            </div>
                            <div className="mt-1 text-sm font-semibold text-slate-800">
                                Seamless premium booking
                            </div>
                        </div>
                        <div className="rounded-2xl border border-white bg-white/90 px-4 py-3 shadow-sm">
                            <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                                Best For
                            </div>
                            <div className="mt-1 text-sm font-semibold text-slate-800">
                                Luxury stays, venues, curated hosting
                            </div>
                        </div>
                        <div className="rounded-2xl border border-white bg-white/90 px-4 py-3 shadow-sm">
                            <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                                Trust Signal
                            </div>
                            <div className="mt-1 text-sm font-semibold text-slate-800">
                                Verified guests and premium properties
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
}

function MarqueeCard({
    item,
    reduceMotion,
}: {
    item: TestimonialItem;
    reduceMotion: boolean;
}) {
    return (
        <motion.article
            whileHover={
                reduceMotion
                    ? undefined
                    : {
                          y: -6,
                          scale: 1.01,
                          transition: {
                              type: "spring",
                              stiffness: 280,
                              damping: 22,
                          },
                      }
            }
            className="group relative mx-3 w-[290px] overflow-hidden rounded-[26px] border border-slate-200 bg-white p-5 shadow-[0_14px_35px_rgba(15,23,42,0.05)] transition-all duration-500 hover:border-indigo-200 hover:shadow-[0_20px_50px_rgba(99,102,241,0.10)] sm:w-[320px]"
        >
            <div className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 transition-transform duration-500 group-hover:scale-x-100" />

            <div className="flex items-center justify-between gap-3">
                <div className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-indigo-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                    {item.category}
                </div>
                <StarRating rating={item.rating} />
            </div>

            <div className="mt-4">
                <svg
                    className="h-7 w-7 text-indigo-100"
                    fill="currentColor"
                    viewBox="0 0 32 32"
                    aria-hidden="true"
                >
                    <path d="M10.7 8C6.98 8 4 11.08 4 14.8c0 3.28 2.3 5.74 5.46 5.74.22 0 .44-.02.66-.06-.48 1.84-1.8 3.52-4.18 5.02l1.26 2.5c5.7-2.52 9.28-7.08 9.28-13.08C16.48 11.1 14.04 8 10.7 8zm12 0c-3.72 0-6.7 3.08-6.7 6.8 0 3.28 2.3 5.74 5.46 5.74.22 0 .44-.02.66-.06-.48 1.84-1.8 3.52-4.18 5.02l1.26 2.5c5.7-2.52 9.28-7.08 9.28-13.08C28.48 11.1 26.04 8 22.7 8z" />
                </svg>
            </div>

            <p className="mt-3 min-h-[96px] text-sm leading-relaxed text-slate-600">
                {item.quote}
            </p>

            <div className="mt-5 flex items-center gap-3 border-t border-slate-200 pt-4">
                <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-2xl ring-1 ring-slate-200">
                    <Image
                        height={110}
                        width={110}
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover"
                        loading="lazy"
                    />
                </div>
                <div className="min-w-0">
                    <h3 className="truncate text-sm font-black tracking-[-0.02em] text-slate-950">
                        {item.name}
                    </h3>
                    <p className="mt-0.5 truncate text-xs font-medium text-slate-500">
                        {item.role}
                    </p>
                    <div className="mt-1 flex items-center gap-2 text-[11px] text-slate-400">
                        <span className="truncate">{item.location}</span>
                    </div>
                </div>
            </div>
        </motion.article>
    );
}

export default function Testimonials() {
    const reduceMotion = useReducedMotion();

    return (
        <section className="w-full bg-white py-16 sm:py-20 lg:py-24">
            <div className="mx-auto w-full container px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.25 }}
                    variants={containerVariants}
                    className="mx-auto mb-10 max-w-3xl text-center sm:mb-12 lg:mb-14"
                >
                    <motion.h2
                        variants={itemVariants}
                        className="text-[28px] font-black leading-[1.08] tracking-[-0.03em] text-slate-950 sm:text-4xl md:text-[42px] lg:text-5xl"
                    >
                        Trusted by Guests, Hosts{" "}
                        <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-500 bg-clip-text text-transparent">
                            & Event Clients
                        </span>
                    </motion.h2>

                    <motion.p
                        variants={itemVariants}
                        className="mt-4 text-sm leading-relaxed text-slate-500 sm:mt-5 sm:text-[15px]"
                    >
                        Discover how AuraSpace creates refined stays, elevated
                        venues, and memorable experiences for modern travelers
                        and hosts.
                    </motion.p>
                </motion.div>

                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    variants={containerVariants}
                    className="mx-auto max-w-6xl"
                >
                    <FeaturedCard
                        item={featuredTestimonial}
                        reduceMotion={!!reduceMotion}
                    />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{
                        duration: 0.75,
                        delay: 0.15,
                        ease: [0.16, 1, 0.3, 1],
                    }}
                    className="relative mt-8 sm:mt-10"
                >
                    <div className="pointer-events-none absolute inset-y-0 left-0 z-10 hidden w-16 bg-gradient-to-r from-white to-transparent lg:block" />
                    <div className="pointer-events-none absolute inset-y-0 right-0 z-10 hidden w-16 bg-gradient-to-l from-white to-transparent lg:block" />

                    <Marquee
                        gradient={false}
                        speed={reduceMotion ? 0 : 26}
                        pauseOnHover
                        play={!reduceMotion}
                        autoFill
                    >
                        {marqueeTestimonials.map((item) => (
                            <MarqueeCard
                                key={item.id}
                                item={item}
                                reduceMotion={!!reduceMotion}
                            />
                        ))}
                    </Marquee>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.65, delay: 0.15 }}
                    className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:mt-10"
                >
                    <div className="rounded-full border border-slate-200 bg-white px-4 py-2 text-[11px] font-bold uppercase tracking-[0.14em] text-slate-600 shadow-sm">
                        4.9/5 Average Rating
                    </div>
                    <div className="rounded-full border border-indigo-100 bg-indigo-50 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.14em] text-indigo-700 shadow-sm">
                        Premium Verified Listings
                    </div>
                    <div className="rounded-full border border-violet-100 bg-violet-50 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.14em] text-violet-700 shadow-sm">
                        Trusted Worldwide
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
