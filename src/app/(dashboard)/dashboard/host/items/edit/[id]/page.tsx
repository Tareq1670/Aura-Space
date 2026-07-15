"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { hostPropertyAPI } from "@/lib/api/Host/host-property-api";
import type { PropertyFormData } from "@/lib/actions/property";
import { AMENITIES, AMENITY_MAP } from "@/lib/constants/property-options";
import PropertyFormWizard from "@/Components/property/PropertyFormWizard";
import { Loader2 } from "lucide-react";

// Reverse map: backend amenity value → frontend amenity ID
function buildReverseAmenityMap(): Record<string, string> {
    const reverse: Record<string, string> = {};
    for (const amenity of AMENITIES) {
        const key = amenity.id.toLowerCase().trim();
        const mapped = AMENITY_MAP[key];
        const backendValue = mapped || key;
        reverse[backendValue] = amenity.id;
    }
    return reverse;
}

const REVERSE_AMENITY_MAP = buildReverseAmenityMap();

function to12HourTime(timeStr?: string): string {
    if (!timeStr) return "";
    const trimmed = timeStr.trim();
    if (/^\d{1,2}:\d{2}\s*(AM|PM)$/i.test(trimmed)) {
        return trimmed.toUpperCase();
    }
    const match = trimmed.match(/^(\d{1,2}):(\d{2})$/);
    if (match) {
        let hour = parseInt(match[1]);
        const min = match[2];
        const period = hour >= 12 ? "PM" : "AM";
        if (hour === 0) hour = 12;
        else if (hour > 12) hour -= 12;
        return `${hour}:${min} ${period}`;
    }
    return "";
}

function toFrontendAmenities(backendAmenities: string[]): string[] {
    return (backendAmenities || [])
        .map((a) => {
            const key = String(a).toLowerCase().trim();
            return REVERSE_AMENITY_MAP[key] || a;
        })
        .filter((a, i, arr) => arr.indexOf(a) === i);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapBackendToFormData(property: any): PropertyFormData {
    return {
        propertyType: property.category || property.propertyType || "",
        placeType: property.placeType || "",
        location: {
            address: property.location?.address || "",
            city: property.location?.city || "",
            state: property.location?.state || "",
            country: property.location?.country || "",
            zipCode: property.location?.zipCode || "",
            coordinates: {
                lat: property.location?.coordinates?.lat || 0,
                lng: property.location?.coordinates?.lng || 0,
            },
        },
        title: property.title || "",
        description: property.description || "",
        bedrooms: property.details?.bedrooms ?? 1,
        bathrooms: property.details?.bathrooms ?? 1,
        beds: property.details?.beds ?? 1,
        maxGuests: property.details?.maxGuests ?? 1,
        amenities: toFrontendAmenities(
            Array.isArray(property.amenities) ? property.amenities : []
        ),
        photos: Array.isArray(property.images) ? property.images : [],
        pricing: {
            perNight: property.price?.perNight || 0,
            cleaningFee: property.price?.cleaningFee || 0,
            serviceFee: property.price?.serviceFee || 0,
            weeklyDiscount: property.price?.weeklyDiscount || 0,
            monthlyDiscount: property.price?.monthlyDiscount || 0,
            currency: property.price?.currency || "BDT",
        },
        availability: {
            minStay: property.availabilitySettings?.minStay ??
                (typeof property.availability?.minStay === "number" ? property.availability.minStay : 1),
            maxStay: property.availabilitySettings?.maxStay ??
                (typeof property.availability?.maxStay === "number" ? property.availability.maxStay : 30),
            advanceNotice: property.availabilitySettings?.advanceNotice ??
                (typeof property.availability?.advanceNotice === "number" ? property.availability.advanceNotice : 1),
            availableFrom: property.availabilitySettings?.availableFrom || property.availability?.availableFrom || "",
            availableTo: property.availabilitySettings?.availableTo || property.availability?.availableTo || "",
            blockedDates: (() => {
                const avail = property.availability;
                if (Array.isArray(avail)) {
                    return avail
                        .filter((a: Record<string, unknown>) => a.isBlocked)
                        .map((a: Record<string, unknown>) => a.date as string);
                }
                if (avail && typeof avail === "object") {
                    const b = (avail as Record<string, unknown>).blockedDates;
                    return Array.isArray(b) ? b as string[] : [];
                }
                return [];
            })(),
        },
        houseRules: {
            smokingAllowed: !!property.houseRules?.smokingAllowed,
            petsAllowed: !!property.houseRules?.petsAllowed,
            partiesAllowed: !!property.houseRules?.partiesAllowed,
            checkInTime: to12HourTime(property.houseRules?.checkInTime) || "3:00 PM",
            checkOutTime: to12HourTime(property.houseRules?.checkOutTime) || "11:00 AM",
            additionalRules: Array.isArray(property.houseRules?.additionalRules)
                ? property.houseRules.additionalRules
                : [],
            quietHoursStart: to12HourTime(property.houseRules?.quietHoursStart) || "10:00 PM",
            quietHoursEnd: to12HourTime(property.houseRules?.quietHoursEnd) || "7:00 AM",
        },
        status: property.status === "active" || property.status === "published" ? "published" : "draft",
    };
}

export default function EditPropertyPage() {
    const params = useParams();
    const id = params?.id as string;

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;

        let cancelled = false;
        setLoading(true);
        setError(null);

        async function load() {
            try {
                const res = await hostPropertyAPI.getProperty(id);
                if (cancelled) return;
                const property = res.data?.property;
                if (!property) {
                    setError("Property not found.");
                    setLoading(false);
                    return;
                }
                const formData = mapBackendToFormData(property);
                if (typeof window !== "undefined") {
                    localStorage.setItem("property_draft", JSON.stringify(formData));
                }
                setLoading(false);
            } catch (err) {
                if (cancelled) return;
                setError(err instanceof Error ? err.message : "Failed to load property.");
                setLoading(false);
            }
        }

        load();
        return () => { cancelled = true; };
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-rose-500 mx-auto mb-4" />
                    <p className="text-gray-500">Loading property...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="text-center">
                    <p className="text-red-500 text-lg font-semibold mb-2">Error</p>
                    <p className="text-gray-500">{error}</p>
                </div>
            </div>
        );
    }

    return <PropertyFormWizard key={id} propertyId={id} />;
}
