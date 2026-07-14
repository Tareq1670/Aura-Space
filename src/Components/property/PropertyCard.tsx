"use client";

import { motion } from "framer-motion";
import { Edit, Trash2, Copy, ExternalLink, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils/cn";
import StatusBadge from "@/Components/property/StatusBadge";
import type { PropertyListItem } from "@/lib/api/Host/host-property-api";

interface PropertyCardProps {
    property: PropertyListItem;
    onDelete: (id: string) => void;
    onDuplicate: (id: string) => void;
    onStatusToggle: (id: string, currentStatus: string) => void;
}

export default function PropertyCard({ property, onDelete, onDuplicate, onStatusToggle }: PropertyCardProps) {
    const p = property;
    const isActive = p.status === "active";
    const coverImage = Array.isArray(p.images) && p.images.length > 0
        ? p.images[0]
        : "/placeholder-property.jpg";
    const locationStr = [p.location?.city, p.location?.country].filter(Boolean).join(", ") || "Location not set";
    const priceStr = p.price?.perNight
        ? `${p.price.currency || "BDT"} ${p.price.perNight.toLocaleString()}/night`
        : "Price not set";

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="group bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
        >
            <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                <img
                    src={coverImage}
                    alt={p.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = "/placeholder-property.jpg";
                    }}
                />
                <div className="absolute top-3 left-3">
                    <StatusBadge status={p.status} size="sm" />
                </div>
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Link
                        href={`/items/${p.id}`}
                        target="_blank"
                        className="flex items-center justify-center w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-colors"
                        title="View live listing"
                    >
                        <ExternalLink className="w-4 h-4 text-gray-600" />
                    </Link>
                </div>
            </div>

            <div className="p-4">
                <h3 className="font-semibold text-gray-900 text-sm leading-snug line-clamp-1 mb-1">
                    {p.title || "Untitled"}
                </h3>
                <p className="text-xs text-gray-500 mb-1 truncate">{locationStr}</p>
                <p className="text-sm font-bold text-gray-900 mb-3">{priceStr}</p>

                <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
                    <span>{p.bookingCount ?? 0} bookings</span>
                    {p.rating != null && p.rating > 0 && (
                        <span>{"★".repeat(Math.round(p.rating))} {p.rating.toFixed(1)}</span>
                    )}
                </div>

                <div className="flex items-center gap-1.5 pt-3 border-t border-gray-50">
                    <Link
                        href={`/dashboard/host/items/edit/${p.id}`}
                        className={cn(
                            "flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium",
                            "bg-violet-50 text-violet-700 hover:bg-violet-100 transition-colors"
                        )}
                    >
                        <Edit className="w-3.5 h-3.5" />
                        Edit
                    </Link>
                    <button
                        type="button"
                        onClick={() => onDuplicate(p.id)}
                        className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
                        title="Duplicate property"
                    >
                        <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                        type="button"
                        onClick={() => onStatusToggle(p.id, p.status)}
                        className={cn(
                            "flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
                            isActive
                                ? "bg-green-50 text-green-700 hover:bg-green-100"
                                : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                        )}
                        title={isActive ? "Deactivate" : "Activate"}
                    >
                        {isActive ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    </button>
                    <button
                        type="button"
                        onClick={() => onDelete(p.id)}
                        className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-red-50 text-red-600 hover:bg-red-100 transition-colors ml-auto"
                        title="Delete property"
                    >
                        <Trash2 className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
