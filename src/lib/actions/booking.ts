"use server";

import { getApiBase, getAuthHeaders } from "@/lib/api-base";

const API_BASE = getApiBase();

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
        if (msg.includes("fetch failed") || msg.includes("ECONNREFUSED")) {
            return {
                success: false,
                error: `Cannot connect to server at ${url}. Make sure backend is running.`,
            };
        }
        return { success: false, error: msg };
    }
}

export interface CreateBookingData {
    propertyId: string;
    checkIn: string;
    checkOut: string;
    numberOfGuests: number;
    specialRequest?: string;
}

export async function createBooking(data: CreateBookingData) {
    return apiFetch("/bookings", {
        method: "POST",
        body: JSON.stringify(data),
    });
}

export async function confirmBooking(id: string) {
    return apiFetch(`/bookings/${id}/confirm`, {
        method: "PUT",
    });
}

export async function cancelBooking(id: string, reason?: string) {
    return apiFetch(`/bookings/${id}/cancel`, {
        method: "PUT",
        body: JSON.stringify({ reason }),
    });
}

export async function completeBooking(id: string) {
    return apiFetch(`/bookings/${id}/complete`, {
        method: "PUT",
    });
}

export async function forceCancelBooking(id: string, reason?: string) {
    return apiFetch(`/admin/bookings/${id}/force-cancel`, {
        method: "PUT",
        body: JSON.stringify({ reason }),
    });
}
