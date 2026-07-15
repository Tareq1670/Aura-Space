"use server";

import { getApiBase, getAuthHeaders } from "@/lib/api-base";

const API_BASE = getApiBase();

interface ActionResponse {
    success: boolean;
    message?: string;
    data?: Record<string, unknown>;
}

async function handleResponse(res: Response): Promise<ActionResponse> {
    const contentType = res.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
        const text = await res.text();
        console.error("[handleResponse] Non-JSON:", res.status, text);
        return { success: false, message: `Server error (${res.status}). Please try again.` };
    }
    return res.json();
}

export interface AdminPropertyParams {
    status?: string;
    category?: string;
    hostId?: string;
    isFeatured?: string;
    search?: string;
    sort?: string;
    page?: number;
    limit?: number;
}

export async function getAdminProperties(params?: AdminPropertyParams): Promise<ActionResponse> {
    try {
        const authHeaders = await getAuthHeaders();
        const query = new URLSearchParams();
        if (params?.status && params.status !== "all") query.set("status", params.status);
        if (params?.category && params.category !== "all") query.set("category", params.category);
        if (params?.hostId) query.set("hostId", params.hostId);
        if (params?.isFeatured) query.set("isFeatured", params.isFeatured);
        if (params?.search) query.set("search", params.search);
        if (params?.sort) query.set("sort", params.sort);
        if (params?.page) query.set("page", String(params.page));
        if (params?.limit) query.set("limit", String(params.limit));

        const qs = query.toString();
        const url = `${API_BASE}/admin/properties${qs ? `?${qs}` : ""}`;

        const res = await fetch(url, {
            method: "GET",
            headers: authHeaders,
            cache: "no-store",
        });
        return await handleResponse(res);
    } catch (error) {
        console.error("[getAdminProperties] Error:", error);
        return { success: false, message: "Network error. Failed to fetch properties." };
    }
}

export async function approveProperty(id: string): Promise<ActionResponse> {
    try {
        const authHeaders = await getAuthHeaders();
        const res = await fetch(`${API_BASE}/admin/properties/${id}/approve`, {
            method: "PUT",
            headers: authHeaders,
            cache: "no-store",
        });
        return await handleResponse(res);
    } catch (error) {
        console.error("[approveProperty] Error:", error);
        return { success: false, message: "Network error." };
    }
}

export async function rejectProperty(id: string, reason: string): Promise<ActionResponse> {
    try {
        const authHeaders = await getAuthHeaders();
        const res = await fetch(`${API_BASE}/admin/properties/${id}/reject`, {
            method: "PUT",
            headers: authHeaders,
            body: JSON.stringify({ reason }),
            cache: "no-store",
        });
        return await handleResponse(res);
    } catch (error) {
        console.error("[rejectProperty] Error:", error);
        return { success: false, message: "Network error." };
    }
}

export async function toggleFeatured(id: string, isFeatured: boolean): Promise<ActionResponse> {
    try {
        const authHeaders = await getAuthHeaders();
        const res = await fetch(`${API_BASE}/admin/properties/${id}/feature`, {
            method: "PUT",
            headers: authHeaders,
            body: JSON.stringify({ isFeatured }),
            cache: "no-store",
        });
        return await handleResponse(res);
    } catch (error) {
        console.error("[toggleFeatured] Error:", error);
        return { success: false, message: "Network error." };
    }
}

export async function deleteAdminProperty(id: string): Promise<ActionResponse> {
    try {
        const authHeaders = await getAuthHeaders();
        const res = await fetch(`${API_BASE}/admin/properties/${id}`, {
            method: "DELETE",
            headers: authHeaders,
            cache: "no-store",
        });
        return await handleResponse(res);
    } catch (error) {
        console.error("[deleteAdminProperty] Error:", error);
        return { success: false, message: "Network error." };
    }
}
