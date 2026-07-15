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

export async function getUsersList(): Promise<ActionResponse> {
    try {
        const authHeaders = await getAuthHeaders();
        const res = await fetch(`${API_BASE}/admin/users`, {
            method: "GET",
            headers: authHeaders,
            cache: "no-store",
        });
        return await handleResponse(res);
    } catch (error) {
        console.error("[getUsersList] Error:", error);
        return { success: false, message: "Network error. Failed to fetch users." };
    }
}

export async function adminUpdateUserRole(
    userId: string,
    role: string,
): Promise<ActionResponse> {
    try {
        const authHeaders = await getAuthHeaders();
        const res = await fetch(`${API_BASE}/admin/users/${userId}/role`, {
            method: "PUT",
            headers: authHeaders,
            body: JSON.stringify({ role }),
            cache: "no-store",
        });
        return await handleResponse(res);
    } catch (error) {
        console.error("[adminUpdateUserRole] Error:", error);
        return { success: false, message: "Network error." };
    }
}

export async function adminUpdateUserStatus(
    userId: string,
    banned: boolean,
    banReason?: string,
): Promise<ActionResponse> {
    try {
        const authHeaders = await getAuthHeaders();
        const res = await fetch(`${API_BASE}/admin/users/${userId}/status`, {
            method: "PUT",
            headers: authHeaders,
            body: JSON.stringify({ banned, banReason }),
            cache: "no-store",
        });
        return await handleResponse(res);
    } catch (error) {
        console.error("[adminUpdateUserStatus] Error:", error);
        return { success: false, message: "Network error." };
    }
}

export async function adminDeleteUser(userId: string): Promise<ActionResponse> {
    try {
        const authHeaders = await getAuthHeaders();
        const res = await fetch(`${API_BASE}/admin/users/${userId}`, {
            method: "DELETE",
            headers: authHeaders,
            cache: "no-store",
        });
        return await handleResponse(res);
    } catch (error) {
        console.error("[adminDeleteUser] Error:", error);
        return { success: false, message: "Network error." };
    }
}