"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { getApiBase } from "@/lib/api-base";

const API_BASE = getApiBase();

interface ActionResponse {
    success: boolean;
    message?: string;
    data?: Record<string, unknown>;
}

async function getToken(): Promise<string | null> {
    try {
        const headersList = await headers();

        const tokenResponse = await (auth.api as any).getToken({
            headers: headersList,
        });

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
        return {
            success: false,
            message: `Server error (${res.status}). Please try again.`,
        };
    }

    return res.json();
}

export async function getUsersList(): Promise<ActionResponse> {
    const token = await getToken();

    if (!token) {
        return {
            success: false,
            message: "Not authenticated. Please login again.",
        };
    }

    try {
        const res = await fetch(`${API_BASE}/admin/users`, {
            method: "GET",
            headers: buildHeaders(token),
            cache: "no-store",
        });

        return await handleResponse(res);
    } catch (error) {
        console.error("[getUsersList] Error:", error);
        return {
            success: false,
            message: "Network error. Failed to fetch users.",
        };
    }
}

export async function adminUpdateUserRole(
    userId: string,
    role: string,
): Promise<ActionResponse> {
    const token = await getToken();
    if (!token) return { success: false, message: "Not authenticated." };

    try {
        const res = await fetch(`${API_BASE}/admin/users/${userId}/role`, {
            method: "PUT",
            headers: buildHeaders(token),
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
    const token = await getToken();
    if (!token) return { success: false, message: "Not authenticated." };

    try {
        const res = await fetch(
            `${API_BASE}/admin/users/${userId}/status`,
            {
                method: "PUT",
                headers: buildHeaders(token),
                body: JSON.stringify({ banned, banReason }),
                cache: "no-store",
            },
        );
        return await handleResponse(res);
    } catch (error) {
        console.error("[adminUpdateUserStatus] Error:", error);
        return { success: false, message: "Network error." };
    }
}

export async function adminDeleteUser(userId: string): Promise<ActionResponse> {
    const token = await getToken();
    if (!token) return { success: false, message: "Not authenticated." };

    try {
        const res = await fetch(`${API_BASE}/admin/users/${userId}`, {
            method: "DELETE",
            headers: buildHeaders(token),
            cache: "no-store",
        });
        return await handleResponse(res);
    } catch (error) {
        console.error("[adminDeleteUser] Error:", error);
        return { success: false, message: "Network error." };
    }
}