"use server";

import { getApiBase } from "@/lib/api-base";

const API_BASE = getApiBase();

// ============================================================
// TYPES
// ============================================================

export interface PublicProperty {
    id: string;
    title: string;
    description: string;
    category: string;
    placeType: string;
    location: {
        address: string;
        city: string;
        state: string;
        country: string;
        zipCode: string;
        coordinates?: { lat: number; lng: number };
    };
    price: {
        perNight: number;
        currency: string;
        cleaningFee?: number;
        serviceFee?: number;
    };
    details: {
        bedrooms: number;
        bathrooms: number;
        maxGuests: number;
        beds?: number;
    };
    amenities: string[];
    images: string[];
    houseRules?: {
        smokingAllowed: boolean;
        petsAllowed: boolean;
        partiesAllowed: boolean;
        checkInTime: string;
        checkOutTime: string;
        additionalRules?: string[];
    };
    rating: number;
    reviewCount: number;
    isFeatured: boolean;
    status: string;
    hostId: string;
    host?: {
        _id: string;
        name: string;
        email: string;
        image?: string;
        createdAt: string;
    };
    reviews?: PublicReview[];
    relatedProperties?: PublicProperty[];
    createdAt: string;
    updatedAt: string;
}

export interface PublicReview {
    id: string;
    guestId: string;
    guestName: string;
    guestImage?: string;
    rating: number;
    comment: string;
    createdAt: string;
}

export interface PaginationInfo {
    total: number;
    totalPages: number;
    currentPage: number;
    limit: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
}

export interface GetPropertiesParams {
    search?: string;
    category?: string;
    city?: string;
    country?: string;
    minPrice?: string;
    maxPrice?: string;
    minRating?: string;
    guests?: string;
    bedrooms?: string;
    bathrooms?: string;
    amenities?: string;
    featured?: string;
    sort?: string;
    page?: string;
    limit?: string;
}

interface ApiResponse<T = unknown> {
    success: boolean;
    data?: T;
    error?: string;
}

async function publicFetch<T = unknown>(
    endpoint: string,
    options: RequestInit = {}
): Promise<ApiResponse<T>> {
    const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
    const url = `${API_BASE}${cleanEndpoint}`;

    try {
        const res = await fetch(url, {
            ...options,
            headers: {
                "Content-Type": "application/json",
                ...(options.headers || {}),
            },
            cache: "no-store",
        });

        const contentType = res.headers.get("content-type");
        const isJson = contentType?.includes("application/json");
        const result = isJson ? await res.json() : await res.text();

        if (!res.ok) {
            const errorMsg =
                typeof result === "object"
                    ? result?.message || result?.error || `HTTP ${res.status}`
                    : `HTTP ${res.status}`;
            return { success: false, error: errorMsg };
        }

        return {
            success: true,
            data: (typeof result === "object" ? result?.data ?? result : result) as T,
        };
    } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Network error";
        console.error(`[API Network Error] URL: ${url} →`, msg);
        if (msg.includes("fetch failed") || msg.includes("ECONNREFUSED")) {
            return { success: false, error: "Cannot connect to server. Make sure backend is running." };
        }
        return { success: false, error: msg };
    }
}

export async function getPublicProperties(
    params: GetPropertiesParams = {}
): Promise<ApiResponse<{ properties: PublicProperty[]; pagination: PaginationInfo }>> {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
        if (value) query.set(key, value);
    });
    const qs = query.toString();
    return publicFetch(`/properties${qs ? `?${qs}` : ""}`);
}

export async function getFeaturedProperties(): Promise<ApiResponse<{ properties: PublicProperty[]; pagination: PaginationInfo }>> {
    return publicFetch("/properties?featured=true&limit=8");
}

export async function getPropertyDetail(
    id: string
): Promise<ApiResponse<PublicProperty>> {
    const raw = await publicFetch<Record<string, unknown>>(`/properties/${id}`);
    if (!raw.success || !raw.data) {
        return { success: false, error: raw.error || "Property not found" };
    }
    const d = raw.data;
    const prop = (d.property || d) as PublicProperty;
    if (d.host) prop.host = d.host as PublicProperty["host"];
    if (d.relatedProperties)
        prop.relatedProperties = d.relatedProperties as PublicProperty["relatedProperties"];
    return { success: true, data: prop };
}

export interface PopularDestination {
    city: string;
    country: string;
    count: number;
    image: string;
}

export async function getPopularDestinations(): Promise<ApiResponse<PopularDestination[]>> {
    return publicFetch("/properties/cities");
}

export interface HomepageStats {
    totalProperties: number;
    totalFeatured: number;
    avgRating: number;
    totalReviews: number;
    byCategory: Array<{ category: string; count: number; avgPrice: number }>;
    topCities: Array<{ city: string; country: string; count: number; avgPrice: number }>;
    priceRange: { min: number; max: number; avg: number };
}

export async function getHomepageStats(): Promise<ApiResponse<HomepageStats>> {
    return publicFetch("/properties/stats");
}
