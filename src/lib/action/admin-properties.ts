"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";

const API_BASE = (() => {
    const raw = process.env.NEXT_PUBLIC_SERVER_URL ||
                process.env.NEXT_PUBLIC_API_URL ||
                process.env.API_BASE_URL ||
                "http://localhost:5000";
    const base = raw.replace(/\/$/, "");
    if (base.endsWith("/api")) return base;
    return `${base}/api`;
})();

interface ActionResponse {
    success: boolean;
    message?: string;
    data?: Record<string, unknown>;
}

async function getToken(): Promise<string | null> {
    try {
        const headersList = await headers();
        const tokenResponse = await auth.api.getToken({ headers: headersList });
        if (!tokenResponse?.token) {
            console.warn("[getToken] No JWT token found");
            return null;
        }
        return tokenResponse.token;
    } catch (error) {
        console.error("[getToken] Error:", error);
        return null;
    }
}

function buildHeaders(token: string): HeadersInit {
    return {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
    };
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
    const token = await getToken();
    if (!token) return { success: false, message: "Not authenticated. Please login again." };

    try {
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
            headers: buildHeaders(token),
            cache: "no-store",
        });
        return await handleResponse(res);
    } catch (error) {
        console.error("[getAdminProperties] Error:", error);
        return { success: false, message: "Network error. Failed to fetch properties." };
    }
}

export async function approveProperty(id: string): Promise<ActionResponse> {
    const token = await getToken();
    if (!token) return { success: false, message: "Not authenticated." };

    try {
        const res = await fetch(`${API_BASE}/admin/properties/${id}/approve`, {
            method: "PUT",
            headers: buildHeaders(token),
            cache: "no-store",
        });
        return await handleResponse(res);
    } catch (error) {
        console.error("[approveProperty] Error:", error);
        return { success: false, message: "Network error." };
    }
}

export async function rejectProperty(id: string, reason: string): Promise<ActionResponse> {
    const token = await getToken();
    if (!token) return { success: false, message: "Not authenticated." };

    try {
        const res = await fetch(`${API_BASE}/admin/properties/${id}/reject`, {
            method: "PUT",
            headers: buildHeaders(token),
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
    const token = await getToken();
    if (!token) return { success: false, message: "Not authenticated." };

    try {
        const res = await fetch(`${API_BASE}/admin/properties/${id}/feature`, {
            method: "PUT",
            headers: buildHeaders(token),
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
    const token = await getToken();
    if (!token) return { success: false, message: "Not authenticated." };

    try {
        const res = await fetch(`${API_BASE}/admin/properties/${id}`, {
            method: "DELETE",
            headers: buildHeaders(token),
            cache: "no-store",
        });
        return await handleResponse(res);
    } catch (error) {
        console.error("[deleteAdminProperty] Error:", error);
        return { success: false, message: "Network error." };
    }
}
