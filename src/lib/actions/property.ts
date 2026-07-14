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
    try {
        const headersList = await headers();
        const tokenResponse = await auth.api.getToken({ headers: headersList });
        if (tokenResponse?.token) {
            return tokenResponse.token;
        }
    } catch (err) {
        console.warn("[Auth] getToken failed:", err);
    }

    // Fallback: read cookies directly
    try {
        const { cookies } = await import("next/headers");
        const cookieStore = await cookies();
        const tokenNames = [
            "better-auth.session_token",
            "__Secure-better-auth.session_token",
            "better-auth.session-token",
            "__Secure-better-auth.session-token",
        ];

        for (const name of tokenNames) {
            const val = cookieStore.get(name)?.value;
            if (val) return val;
        }
    } catch (err) {
        console.warn("[Auth] Cookie fallback failed:", err);
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

    console.log(`[API] ${options.method || "GET"} ${url}`);

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

        console.log(`[API] Response ${res.status}:`, result);

        if (!res.ok) {
            const errorMsg =
                typeof result === "object"
                    ? result?.message || result?.error || `HTTP ${res.status}`
                    : `HTTP ${res.status}`;
            console.error(`[API Error]:`, errorMsg);
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
const AMENITY_MAP: Record<string, string> = {
    // Direct valid values
    wifi: "wifi",
    pool: "pool",
    ac: "ac",
    parking: "parking",
    gym: "gym",
    kitchen: "kitchen",
    washer: "washer",
    dryer: "dryer",
    tv: "tv",
    heating: "heating",
    workspace: "workspace",
    elevator: "elevator",
    balcony: "balcony",
    garden: "garden",
    bbq: "bbq",
    fireplace: "fireplace",
    "security-camera": "security-camera",
    "smoke-alarm": "smoke-alarm",
    "first-aid": "first-aid",
    "fire-extinguisher": "fire-extinguisher",

    // Frontend alternatives → backend valid
    "air-conditioning": "ac",
    "air conditioning": "ac",
    air_conditioning: "ac",
    airconditioning: "ac",
    "air conditioner": "ac",
    "swimming-pool": "pool",
    "swimming pool": "pool",
    "swimming_pool": "pool",
    internet: "wifi",
    "free-parking": "parking",
    free_parking: "parking",
    "smoke alarm": "smoke-alarm",
    smoke_alarm: "smoke-alarm",
    smokealarm: "smoke-alarm",
    "first aid": "first-aid",
    first_aid: "first-aid",
    "fire extinguisher": "fire-extinguisher",
    fire_extinguisher: "fire-extinguisher",
    "security camera": "security-camera",
    security_camera: "security-camera",
    "security cameras": "security-camera",
    security_cameras: "security-camera",
    cctv: "security-camera",
    monitor: "workspace",        // monitor → workspace
    coffee_maker: "kitchen",     // coffee_maker → kitchen
    beach_access: "balcony",     // beach_access → balcony (closest match)
    smoking_area: "bbq",         // smoking_area → bbq (closest match)
    resort: "pool",
    hostel: "wifi",
};

const VALID_AMENITIES = new Set([
    "wifi", "pool", "ac", "parking", "gym", "kitchen", "washer", "dryer",
    "tv", "heating", "workspace", "elevator", "balcony", "garden", "bbq",
    "fireplace", "security-camera", "smoke-alarm", "first-aid", "fire-extinguisher",
]);

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
    if (!timeStr) return "14:00";

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
        location: {
            address: (data.location?.address || "").trim(),
            city: (data.location?.city || "").trim(),
            country: (data.location?.country || "").trim(),
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
            ...(Number(data.pricing?.cleaningFee) > 0 && {
                cleaningFee: Number(data.pricing?.cleaningFee),
            }),
            ...(Number(data.pricing?.serviceFee) > 0 && {
                serviceFee: Number(data.pricing?.serviceFee),
            }),
            ...(Number(data.pricing?.weeklyDiscount) > 0 && {
                weeklyDiscount: Number(data.pricing?.weeklyDiscount),
            }),
            ...(Number(data.pricing?.monthlyDiscount) > 0 && {
                monthlyDiscount: Number(data.pricing?.monthlyDiscount),
            }),
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
            // ✅ Time format normalize
            checkInTime: normalizeTime(data.houseRules?.checkInTime),
            checkOutTime: normalizeTime(data.houseRules?.checkOutTime),
            ...(data.houseRules?.quietHoursStart && {
                quietHoursStart: normalizeTime(data.houseRules.quietHoursStart),
            }),
            ...(data.houseRules?.quietHoursEnd && {
                quietHoursEnd: normalizeTime(data.houseRules.quietHoursEnd),
            }),
            ...(Array.isArray(data.houseRules?.additionalRules) &&
                data.houseRules.additionalRules.length > 0 && {
                    additionalRules: data.houseRules.additionalRules.filter(
                        (r) => typeof r === "string" && r.trim()
                    ),
                }),
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

    console.log(
        "[createProperty] Final payload:",
        JSON.stringify(payload, null, 2)
    );

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