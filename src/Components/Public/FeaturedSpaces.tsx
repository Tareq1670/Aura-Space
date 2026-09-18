"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import {
    motion,
    useInView,
    type Variants,
} from "framer-motion";
import { Skeleton } from "@heroui/react";
import { getFeaturedProperties } from "@/lib/actions/property-public";
import type { PublicProperty } from "@/lib/actions/property-public";
import SectionHeading from "@/Components/Public/SectionHeading";
import PropertyCard from "@/Components/Public/PropertyCard";
import { buttonClasses } from "@/Components/ui/Button";
import { formatCurrency } from "@/lib/currency";

const EASE = [0.16, 1, 0.3, 1] as const;

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.12, delayChildren: 0.08 },
    },
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 28, filter: "blur(6px)" },
    visible: {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        transition: { duration: 0.7, ease: EASE },
    },
};

function StarRating({ rating }: { rating: number }) {
    return (
        <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
                <svg
                    key={i}
                    className={`h-3 w-3 ${i < Math.round(rating) ? "text-amber-400" : "text-slate-300"}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
            ))}
            <span className="ml-1 text-xs font-semibold text-slate-500">({rating.toFixed(1)})</span>
        </div>
    );
}

function FeaturedCardSkeleton() {
    return (
        <div className="rounded-2xl border border-slate-100 bg-white overflow-hidden">
            <Skeleton className="aspect-[4/3] w-full rounded-none" />
            <div className="p-4 space-y-3">
                <Skeleton className="h-4 w-3/4 rounded-lg" />
                <Skeleton className="h-3 w-1/2 rounded-lg" />
                <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-20 rounded-lg" />
                    <Skeleton className="h-3 w-16 rounded-lg" />
                </div>
            </div>
        </div>
    );
}

export default function FeaturedSpaces() {
    const [properties, setProperties] = useState<PublicProperty[]>([]);
    const [loading, setLoading] = useState(true);
    const sectionRef = useRef<HTMLElement>(null);
    const isInView = useInView(sectionRef, { once: true, margin: "-60px" });

    useEffect(() => {
        async function fetchData() {
            const res = await getFeaturedProperties();
            if (res.success && res.data?.properties) {
                setProperties(res.data.properties);
            }
            setLoading(false);
        }
        fetchData();
    }, []);

    const heroProp = properties[0];
    const sideProps = properties.slice(1, 4);

    return (
        <section
            ref={sectionRef}
            className="relative w-full overflow-hidden bg-white py-16 sm:py-20 lg:py-24"
        >
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute -left-32 top-20 h-[400px] w-[400px] rounded-full bg-indigo-50/60 blur-3xl" />
                <div className="absolute -right-32 bottom-20 h-[400px] w-[400px] rounded-full bg-violet-50/50 blur-3xl" />
            </div>

            <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                    variants={containerVariants}
                    className="mb-10 sm:mb-12 lg:mb-14"
                >
                    <motion.div variants={itemVariants}>
                        <SectionHeading
                            eyebrow="Premium Collection"
                            title="Featured "
                            highlight="Luxury Spaces"
                            subtitle="Handpicked premium properties with exceptional amenities and stunning locations, curated for the most discerning travelers."
                            align="center"
                            action={
                                <Link
                                    href="/listings"
                                    className={buttonClasses({ variant: "secondary", size: "sm" })}
                                >
                                    View all
                                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </Link>
                            }
                        />
                    </motion.div>
                </motion.div>

                {loading ? (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:grid-rows-2">
                        <div className="sm:col-span-2 lg:col-span-2 lg:row-span-2">
                            <FeaturedCardSkeleton />
                        </div>
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div key={i}>
                                <FeaturedCardSkeleton />
                            </div>
                        ))}
                    </div>
                ) : properties.length === 0 ? null : (
                    <motion.div
                        initial="hidden"
                        animate={isInView ? "visible" : "hidden"}
                        variants={containerVariants}
                        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:grid-rows-2"
                    >
                        {heroProp && (
                            <motion.div
                                variants={itemVariants}
                                className="group relative sm:col-span-2 lg:col-span-2 lg:row-span-2"
                            >
                                <Link href={`/listings/${heroProp.id}`} className="block h-full">
                                    <div className="relative h-full min-h-[300px] overflow-hidden rounded-2xl sm:min-h-[400px] lg:min-h-[460px]">
                                        <Image
                                            src={heroProp.images?.[0] || "/placeholder-property.svg"}
                                            alt={heroProp.title}
                                            fill
                                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 50vw"
                                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                                            onError={(e) => {
                                                (e.currentTarget as HTMLImageElement).src = "/placeholder-property.svg";
                                            }}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />

                                        <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 lg:p-7">
                                            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white backdrop-blur-md">
                                                {heroProp.category}
                                            </div>
                                            <h3 className="text-xl font-black text-white sm:text-2xl lg:text-3xl">
                                                {heroProp.title}
                                            </h3>
                                            <p className="mt-1 text-sm text-white/80">
                                                {heroProp.location?.city}, {heroProp.location?.country}
                                            </p>
                                            <div className="mt-3 flex items-center gap-4">
                                                <span className="text-lg font-bold text-white">
                                                    {formatCurrency(heroProp.price?.perNight ?? 0, heroProp.price?.currency)}{" "}
                                                    <span className="text-sm font-normal text-white/70">/ night</span>
                                                </span>
                                                <StarRating rating={heroProp.rating} />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        )}

                        {sideProps.map((prop) => (
                            <motion.div
                                key={prop.id}
                                variants={itemVariants}
                                className="group h-full"
                            >
                                <PropertyCard property={prop} />
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </div>
        </section>
    );
}
