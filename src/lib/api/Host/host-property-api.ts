import { authClient } from "@/lib/auth-client";

const SERVER_URL =
    process.env.NEXT_PUBLIC_SERVER_URL ||
    (typeof window !== "undefined"
        ? window.location.origin.includes("localhost")
            ? "http://localhost:5000"
            : "https://aura-space-server.vercel.app"
        : "http://localhost:5000");

async function getAuthToken(): Promise<string> {
    try {
        const { data } = await authClient.token();
        if (data?.token) return data.token;
        throw new Error("No token from authClient.token()");
    } catch (err) {
        console.error("[getAuthToken] failed:", err);
        throw new Error("Login required.");
    }
}

async function apiFetch<T>(
    endpoint: string,
    options: RequestInit = {},
): Promise<T> {
    const token = await getAuthToken();
    const isFormData = options.body instanceof FormData;
    const res = await fetch(`${SERVER_URL}${endpoint}`, {
        ...options,
        headers: {
            ...(isFormData ? {} : { "Content-Type": "application/json" }),
            Authorization: `Bearer ${token}`,
            ...options.headers,
        },
    });
    const contentType = res.headers.get("content-type") || "";
    const isJson = contentType.includes("application/json");
    const body = isJson ? await res.json() : await res.text();
    if (!res.ok) {
        const message = isJson ? (body.message || body.error || "Something went wrong.") : `HTTP ${res.status}`;
        throw new Error(message);
    }
    return body;
}

export interface GetMyPropertiesParams {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    category?: string;
    sortBy?: string;
}

export interface PropertyListItem {
    id: string;
    title: string;
    location: { city: string; country: string };
    price: { perNight: number; currency: string };
    images: string[];
    status: string;
    bookingCount?: number;
    createdAt: string;
    updatedAt: string;
    rating?: number;
    reviewCount?: number;
    [key: string]: unknown;
}

export const hostPropertyAPI = {
    getMyProperties: (params: GetMyPropertiesParams = {}) => {
        const qs = new URLSearchParams();
        if (params.page) qs.set("page", String(params.page));
        if (params.limit) qs.set("limit", String(params.limit));
        if (params.search) qs.set("search", params.search);
        if (params.status) qs.set("status", params.status);
        if (params.category) qs.set("category", params.category);
        if (params.sortBy) qs.set("sort", params.sortBy);
        const query = qs.toString();
        return apiFetch<{
            success: boolean;
            data: {
                properties: PropertyListItem[];
                pagination: { total: number; totalPages: number; currentPage: number; limit: number };
                statusSummary: Record<string, number>;
            };
        }>(`/api/properties/host/my-properties${query ? `?${query}` : ""}`);
    },

    getProperty: (id: string) =>
        apiFetch<{ success: boolean; data: { property: Record<string, unknown>; host: Record<string, unknown>; relatedProperties: Record<string, unknown>[] } }>(
            `/api/properties/${id}`,
        ),

    updateProperty: (id: string, data: Record<string, unknown>) =>
        apiFetch<{ success: boolean; data: Record<string, unknown>; message?: string }>(`/api/properties/${id}`, {
            method: "PUT",
            body: JSON.stringify(data),
        }),

    deleteProperty: (id: string) =>
        apiFetch<{ success: boolean; message: string }>(`/api/properties/${id}`, {
            method: "DELETE",
        }),

    duplicateProperty: (id: string) =>
        apiFetch<{ success: boolean; data: { id: string } }>(`/api/properties/${id}/duplicate`, {
            method: "POST",
        }),

    updatePropertyStatus: (id: string, status: string) =>
        apiFetch<{ success: boolean; data: { id: string; status: string } }>(`/api/properties/${id}/status`, {
            method: "PUT",
            body: JSON.stringify({ status }),
        }),
};
