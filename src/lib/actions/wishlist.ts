"use server";

import { getApiBase, getAuthHeaders, getSessionToken } from "@/lib/api-base";

const API_BASE = getApiBase();

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
