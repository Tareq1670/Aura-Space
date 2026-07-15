"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";

function getApiBase(): string {
    const raw = process.env.NEXT_PUBLIC_SERVER_URL ||
                process.env.NEXT_PUBLIC_API_URL ||
                "http://localhost:5000";
    const base = raw.replace(/\/$/, "");
    if (base.endsWith("/api")) return base;
    return `${base}/api`;
}

const API_BASE = getApiBase();

async function getSessionToken(): Promise<string> {
    const headersList = await headers();
    const tokenResponse = await auth.api.getToken({ headers: headersList });
    if (tokenResponse?.token) {
        return tokenResponse.token;
    }
    throw new Error("No session token found. Please login again.");
}

async function getAuthHeaders(): Promise<Record<string, string>> {
    const token = await getSessionToken();
    return {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
    };
}

interface ActionResponse {
    success: boolean;
    message?: string;
    data?: Record<string, unknown>;
}

async function handleResponse(res: Response): Promise<ActionResponse> {
    const contentType = res.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
        return { success: false, message: `Server error (${res.status}).` };
    }
    return res.json();
}

export async function toggleWishlist(propertyId: string, listName?: string): Promise<ActionResponse> {
    try {
        const headers = await getAuthHeaders();
        const res = await fetch(`${API_BASE}/wishlist/toggle`, {
            method: "POST",
            headers,
            body: JSON.stringify({ propertyId, listName }),
            cache: "no-store",
        });
        return await handleResponse(res);
    } catch (error: unknown) {
        return { success: false, message: error instanceof Error ? error.message : "Network error." };
    }
}

export async function getWishlist(listName?: string): Promise<ActionResponse> {
    try {
        const headers = await getAuthHeaders();
        const qs = listName ? `?listName=${encodeURIComponent(listName)}` : "";
        const res = await fetch(`${API_BASE}/wishlist${qs}`, {
            method: "GET",
            headers,
            cache: "no-store",
        });
        return await handleResponse(res);
    } catch (error: unknown) {
        return { success: false, message: error instanceof Error ? error.message : "Network error." };
    }
}

export async function checkWishlist(propertyId: string): Promise<ActionResponse> {
    try {
        const headers = await getAuthHeaders();
        const res = await fetch(`${API_BASE}/wishlist/check/${propertyId}`, {
            method: "GET",
            headers,
            cache: "no-store",
        });
        return await handleResponse(res);
    } catch (error: unknown) {
        return { success: false, message: error instanceof Error ? error.message : "Network error." };
    }
}

export async function updateListName(id: string, listName: string): Promise<ActionResponse> {
    try {
        const headers = await getAuthHeaders();
        const res = await fetch(`${API_BASE}/wishlist/${id}/list`, {
            method: "PUT",
            headers,
            body: JSON.stringify({ listName }),
            cache: "no-store",
        });
        return await handleResponse(res);
    } catch (error: unknown) {
        return { success: false, message: error instanceof Error ? error.message : "Network error." };
    }
}

export async function removeFromWishlist(id: string): Promise<ActionResponse> {
    try {
        const headers = await getAuthHeaders();
        const res = await fetch(`${API_BASE}/wishlist/${id}`, {
            method: "DELETE",
            headers,
            cache: "no-store",
        });
        return await handleResponse(res);
    } catch (error: unknown) {
        return { success: false, message: error instanceof Error ? error.message : "Network error." };
    }
}
