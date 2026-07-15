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
    } catch {
        throw new Error("Login required.");
    }
}

async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = await getAuthToken();
    const res = await fetch(`${SERVER_URL}${endpoint}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
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

export interface WishlistItem {
    _id: string;
    propertyId: string;
    listName?: string;
    createdAt: string;
    property: {
        id: string;
        title: string;
        images: string[];
        price: { perNight: number; cleaningFee?: number; serviceFee?: number; currency?: string };
        location: { address?: string; city?: string; country?: string };
        category: string;
        rating: number;
    } | null;
}

export interface GetWishlistResponse {
    success: boolean;
    data: {
        items: WishlistItem[];
        pagination: {
            total: number;
            totalPages: number;
            currentPage: number;
            limit: number;
        };
    };
}

export interface GetListsResponse {
    success: boolean;
    data: {
        lists: string[];
    };
}

export async function getWishlist(listName?: string): Promise<GetWishlistResponse> {
    const qs = listName ? `?listName=${encodeURIComponent(listName)}` : "";
    return apiFetch<GetWishlistResponse>(`/api/wishlist${qs}`, { method: "GET", cache: "no-store" });
}

export async function getLists(): Promise<GetListsResponse> {
    return apiFetch<GetListsResponse>("/api/wishlist/lists", { method: "GET", cache: "no-store" });
}
