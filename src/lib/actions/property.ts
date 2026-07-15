"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";

// ============================================================
// API BASE URL
// ============================================================
function getApiBase(): string {
    const raw = process.env.NEXT_PUBLIC_SERVER_URL ||
                process.env.NEXT_PUBLIC_API_URL ||
                "http://localhost:5000";
    const base = raw.replace(/\/$/, "");
    if (base.endsWith("/api")) return base;
    return `${base}/api`;
}

const API_BASE = getApiBase();

// ============================================================
// SESSION TOKEN — from cookie via better-auth
// ============================================================
async function getSessionToken(): Promise<string> {
    const headersList = await headers();
    const tokenResponse = await auth.api.getToken({ headers: headersList });
    if (tokenResponse?.token) {
        return tokenResponse.token;
    }
    throw new Error("No session token found. Please login again.");
}

// ============================================================
// AUTH HEADERS
// ============================================================
async function getAuthHeaders(): Promise<Record<string, string>> {
    const token = await getSessionToken();
    return {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
    };
}

// ============================================================
// GENERIC FETCH
// ============================================================
interface ApiResponse<T = unknown> {
    success: boolean;
    data?: T;
    error?: string;
    statusCode?: number;
}

async function apiFetch<T = unknown>(
    endpoint: string,
    options: RequestInit = {}
): Promise<ApiResponse<T>> {
    // endpoint এ /api আছে কিনা চেক — double /api ঠেকাতে
    const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
    const url = `${API_BASE}${cleanEndpoint}`;

    try {
        const authHeaders = await getAuthHeaders();

        const res = await fetch(url, {
            ...options,
            headers: { ...authHeaders, ...(options.headers || {}) },
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
            return { success: false, statusCode: res.status, error: errorMsg };
        }

        return {
            success: true,
            statusCode: res.status,
            data: (typeof result === "object"
                ? result?.data ?? result
                : result) as T,
        };
    } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Network error";
        console.error(`[API Network Error] URL: ${url} →`, msg);

        // Backend চলছে না
        if (msg.includes("fetch failed") || msg.includes("ECONNREFUSED")) {
            return {
                success: false,
                error: `Cannot connect to server at ${url}. Make sure backend is running.`,
            };
        }

        return { success: false, error: msg };
    }
}

// ============================================================
// TYPES
// ============================================================
export interface PropertyFormData {
    propertyType: string;
    placeType: string;
    location: {
        address: string;
        city: string;
        state: string;
        country: string;
        zipCode: string;
        coordinates: { lat: number; lng: number };
    };
    title: string;
    description: string;
    bedrooms: number;
    bathrooms: number;
    beds: number;
    maxGuests: number;
    amenities: string[];
    photos: string[];
    pricing: {
        perNight: number;
        cleaningFee: number;
        serviceFee: number;
        weeklyDiscount: number;
        monthlyDiscount: number;
        currency: string;
    };
    availability: {
        minStay: number;
        maxStay: number;
        advanceNotice: number;
        availableFrom: string;
        availableTo: string;
        blockedDates: string[];
    };
    houseRules: {
        smokingAllowed: boolean;
        petsAllowed: boolean;
        partiesAllowed: boolean;
        checkInTime: string;
        checkOutTime: string;
        additionalRules: string[];
        quietHoursStart: string;
        quietHoursEnd: string;
    };
    status: "draft" | "published";
}

// ============================================================
// AMENITY NORMALIZER
// frontend amenity names → backend valid values
// ============================================================
import { AMENITY_MAP, VALID_AMENITIES } from "@/lib/constants/property-options";

function normalizeAmenities(amenities: string[] = []): string[] {
    const result = amenities
        .map((a) => {
            const key = String(a).toLowerCase().trim();
            const mapped = AMENITY_MAP[key];
            if (mapped) return mapped;
            // directly valid — use as-is
            if (VALID_AMENITIES.has(key)) return key;
            // invalid হলে skip (undefined return করো)
            console.warn(`[Amenity] Skipping invalid: "${a}"`);
            return null;
        })
        .filter((a): a is string => a !== null);

    // duplicate সরাও
    return [...new Set(result)];
}

// ============================================================
// CATEGORY NORMALIZER
// ============================================================
const CATEGORY_MAP: Record<string, string> = {
    hotel: "hotel",
    apartment: "apartment",
    villa: "villa",
    "event-space": "event-space",
    event_space: "event-space",
    event: "event-space",
    house: "villa",
    condo: "apartment",
    flat: "apartment",
    room: "apartment",
    resort: "hotel",
    hostel: "hotel",
};

function normalizeCategory(type?: string): string {
    const key = String(type || "").toLowerCase().trim();
    return CATEGORY_MAP[key] || "apartment";
}

// ============================================================
// TIME FORMAT NORMALIZER
// "9:00 PM" → "21:00", "6:00 AM" → "06:00"
// ============================================================
function normalizeTime(timeStr?: string): string {
    if (!timeStr) return "";

    const trimmed = timeStr.trim();

    // Already in HH:MM format
    if (/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(trimmed)) {
        const [h, m] = trimmed.split(":");
        return `${h.padStart(2, "0")}:${m}`;
    }

    // 12-hour format: "9:00 PM", "6:00 AM", "12:30 PM"
    const match = trimmed.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    if (match) {
        let hour = parseInt(match[1]);
        const min = match[2];
        const period = match[3].toUpperCase();

        if (period === "AM") {
            if (hour === 12) hour = 0;
        } else {
            if (hour !== 12) hour += 12;
        }

        return `${String(hour).padStart(2, "0")}:${min}`;
    }

    // শুধু ঘণ্টা: "9", "21"
    const hourOnly = trimmed.match(/^(\d{1,2})$/);
    if (hourOnly) {
        const h = parseInt(hourOnly[1]);
        if (h >= 0 && h <= 23) return `${String(h).padStart(2, "0")}:00`;
    }

    console.warn(`[Time] Cannot parse: "${timeStr}", using default`);
    return "14:00";
}

// ============================================================
// TRANSFORMER: Frontend → Backend
// ============================================================
function transformToBackend(data: Partial<PropertyFormData>) {
    return {
        title: (data.title || "").trim(),
        description: (data.description || "").trim(),
        category: normalizeCategory(data.propertyType),
        placeType: (data.placeType || "").trim(),
        location: {
            address: (data.location?.address || "").trim(),
            city: (data.location?.city || "").trim(),
            state: (data.location?.state || "").trim(),
            country: (data.location?.country || "").trim(),
            zipCode: (data.location?.zipCode || "").trim(),
            ...(data.location?.coordinates &&
                data.location.coordinates.lat !== 0 &&
                data.location.coordinates.lng !== 0 && {
                    coordinates: {
                        lat: Number(data.location.coordinates.lat),
                        lng: Number(data.location.coordinates.lng),
                    },
                }),
        },
        price: {
            perNight: Number(data.pricing?.perNight) || 0,
            ...(data.pricing?.currency && { currency: data.pricing.currency.trim() }),
            cleaningFee: Number(data.pricing?.cleaningFee) || 0,
            serviceFee: Number(data.pricing?.serviceFee) || 0,
            weeklyDiscount: Number(data.pricing?.weeklyDiscount) || 0,
            monthlyDiscount: Number(data.pricing?.monthlyDiscount) || 0,
        },
        details: {
            bedrooms: Number(data.bedrooms) || 0,
            bathrooms: Number(data.bathrooms) || 0,
            maxGuests: Number(data.maxGuests) || 1,
            ...(data.beds && Number(data.beds) > 0 && {
                beds: Number(data.beds),
            }),
        },
        // Invalid amenities are filtered out by normalizeAmenities
        amenities: normalizeAmenities(data.amenities),
        images: Array.isArray(data.photos)
            ? data.photos.filter((p) => typeof p === "string" && p.trim())
            : [],
        houseRules: {
            smokingAllowed: Boolean(data.houseRules?.smokingAllowed),
            petsAllowed: Boolean(data.houseRules?.petsAllowed),
            partiesAllowed: Boolean(data.houseRules?.partiesAllowed),
            checkInTime: normalizeTime(data.houseRules?.checkInTime),
            checkOutTime: normalizeTime(data.houseRules?.checkOutTime),
            quietHoursStart: normalizeTime(data.houseRules?.quietHoursStart || ""),
            quietHoursEnd: normalizeTime(data.houseRules?.quietHoursEnd || ""),
            ...(Array.isArray(data.houseRules?.additionalRules) &&
                data.houseRules.additionalRules.length > 0 && {
                    additionalRules: data.houseRules.additionalRules.filter(
                        (r) => typeof r === "string" && r.trim()
                    ),
                }),
        },
        availabilitySettings: {
            minStay: Number(data.availability?.minStay) || 1,
            maxStay: Number(data.availability?.maxStay) || 30,
            advanceNotice: Number(data.availability?.advanceNotice) || 1,
            availableFrom: data.availability?.availableFrom || "",
            availableTo: data.availability?.availableTo || "",
        },
    };
}

// ============================================================
// PRE-VALIDATION (backend এ পাঠানোর আগে)
// ============================================================
function preValidate(
    payload: ReturnType<typeof transformToBackend>
): string | null {
    if (!payload.title || payload.title.length < 5)
        return "Title must be at least 5 characters.";
    if (!payload.description || payload.description.length < 20)
        return "Description must be at least 20 characters.";
    if (!payload.location.address || payload.location.address.length < 3)
        return "Address is required (min 3 chars).";
    if (!payload.location.city || payload.location.city.length < 2)
        return "City is required.";
    if (!payload.location.country || payload.location.country.length < 2)
        return "Country is required.";
    if (!payload.price.perNight || payload.price.perNight <= 0)
        return "Price per night must be greater than 0.";
    if (payload.details.maxGuests < 1)
        return "Max guests must be at least 1.";
    return null;
}

// ============================================================
// EXPORTED ACTIONS
// ============================================================

export async function createProperty(data: PropertyFormData) {
    const payload = transformToBackend(data);

    const error = preValidate(payload);
    if (error) return { success: false, error };

    return apiFetch<{ id: string }>("/properties", {
        method: "POST",
        body: JSON.stringify(payload),
    });
}

export async function saveDraft(data: Partial<PropertyFormData>) {
    const payload = transformToBackend(data);

    if (!payload.title || payload.title.length < 3) {
        return {
            success: false,
            error: "Title is required to save draft (min 3 chars).",
        };
    }

    return apiFetch<{ id: string }>("/properties", {
        method: "POST",
        body: JSON.stringify({ ...payload, status: "draft" }),
    });
}

export async function updateDraft(
    id: string,
    data: Partial<PropertyFormData>
) {
    const payload = transformToBackend(data);
    return apiFetch<{ id: string }>(`/properties/${id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
    });
}

export async function updatePropertyStatus(
    id: string,
    status: "active" | "inactive"
) {
    return apiFetch<{ id: string; status: string }>(
        `/properties/${id}/status`,
        {
            method: "PUT",
            body: JSON.stringify({ status }),
        }
    );
}

export async function deleteProperty(id: string) {
    return apiFetch<{ id: string }>(`/properties/${id}`, {
        method: "DELETE",
    });
}

// Image upload — uses FormData, handled separately
export async function uploadPropertyImages(files: File[]) {
    try {
        const token = await getSessionToken();
        const formData = new FormData();
        files.forEach((file) => formData.append("images", file));

        const url = `${API_BASE}/properties/upload-images`;
        console.log(`[Upload] POST ${url}`);

        const res = await fetch(url, {
            method: "POST",
            // Don't set Content-Type — browser sets it with boundary for FormData
            headers: { Authorization: `Bearer ${token}` },
            body: formData,
        });

        const result = await res.json();

        if (!res.ok) {
            return {
                success: false,
                error: result?.message || "Upload failed",
            };
        }

        return {
            success: true,
            data: result.data as { urls: string[]; count: number },
        };
    } catch (err: unknown) {
        return {
            success: false,
            error: err instanceof Error ? err.message : "Upload error",
        };
    }
}