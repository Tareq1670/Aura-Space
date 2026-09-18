"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { BedDouble, Users } from "lucide-react";
import type { PublicProperty } from "@/lib/actions/property-public";
import { formatCurrency } from "@/lib/currency";
import { cn } from "@/lib/utils/cn";

interface PropertyCardProps {
    property: PublicProperty;
    className?: string;
    priority?: boolean;
}

function Stars({ rating }: { rating: number }) {
    return (
        <span className="flex items-center gap-px" aria-hidden="true">
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
        </span>
    );
}

export default function PropertyCard({ property, className, priority = false }: PropertyCardProps) {
    const [imageSrc, setImageSrc] = useState(
        property.images?.[0] || "/placeholder-property.svg",
    );

    const perNight = property.price?.perNight ?? 0;
    const currency = property.price?.currency ?? "usd";
    const locationStr = property.location
        ? [property.location.city, property.location.country].filter(Boolean).join(", ")
        : "Location not available";

    return (
        <div
            className={cn(
                "group h-full overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-all duration-300 hover:border-indigo-100 hover:shadow-md",
                className,
            )}
        >
            <Link
                href={`/listings/${property.id}`}
                className="block"
                aria-label={`View ${property.title}`}
            >
                <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                    <Image
                        src={imageSrc}
                        alt={property.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        priority={priority}
                        loading={priority ? "eager" : "lazy"}
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        onError={() => setImageSrc("/placeholder-property.svg")}
                    />

                    <div className="absolute left-2 top-2 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider text-slate-700 backdrop-blur-sm">
                        {property.category}
                    </div>

                    {property.isFeatured && (
                        <div className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-full bg-amber-400/90 px-2 py-0.5 text-xs font-bold text-amber-900 backdrop-blur-sm">
                            <svg className="h-2.5 w-2.5" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            Featured
                        </div>
                    )}
                </div>

                <div className="p-4">
                    <h3 className="line-clamp-1 text-sm font-bold leading-snug text-slate-900">
                        {property.title}
                    </h3>
                    <p className="mt-0.5 truncate text-xs text-slate-500">{locationStr}</p>

                    <div className="mt-2.5 flex items-center gap-3 text-xs font-medium text-slate-500">
                        {!!property.details?.bedrooms && (
                            <span className="inline-flex items-center gap-1">
                                <BedDouble className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
                                {property.details.bedrooms} beds
                            </span>
                        )}
                        {!!property.details?.maxGuests && (
                            <span className="inline-flex items-center gap-1">
                                <Users className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
                                {property.details.maxGuests} guests
                            </span>
                        )}
                    </div>

                    <div className="mt-3 flex items-center justify-between border-t border-slate-50 pt-3">
                        <span className="text-sm font-bold text-slate-900">
                            {formatCurrency(perNight, currency)}{" "}
                            <span className="text-xs font-normal text-slate-500">/ night</span>
                        </span>

                        {property.rating > 0 && (
                            <span
                                className="flex items-center gap-1"
                                aria-label={`Rated ${property.rating.toFixed(1)} out of 5, ${property.reviewCount ?? 0} reviews`}
                                role="img"
                            >
                                <Stars rating={property.rating} />
                                <span className="text-xs font-semibold text-slate-700 tabular-nums">
                                    {property.rating.toFixed(1)}
                                </span>
                                <span className="text-xs text-slate-500">
                                    ({property.reviewCount ?? 0})
                                </span>
                            </span>
                        )}
                    </div>
                </div>
            </Link>
        </div>
    );
}