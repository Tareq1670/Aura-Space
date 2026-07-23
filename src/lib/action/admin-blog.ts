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

export async function getAdminBlogs(params: {
    page?: string;
    limit?: string;
    status?: string;
    featured?: string;
    search?: string;
} = {}): Promise<ActionResponse> {
    try {
        const authHeaders = await getAuthHeaders();
        const query = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
            if (value) query.set(key, value);
        });
        const qs = query.toString();
        const res = await fetch(`${API_BASE}/admin/blogs${qs ? `?${qs}` : ""}`, {
            method: "GET",
            headers: authHeaders,
            cache: "no-store",
        });
        return await handleResponse(res);
    } catch (error) {
        console.error("[getAdminBlogs] Error:", error);
        return { success: false, message: "Network error. Failed to fetch blogs." };
    }
}

export async function toggleFeatureBlog(blogId: string): Promise<ActionResponse> {
    try {
        const authHeaders = await getAuthHeaders();
        const res = await fetch(`${API_BASE}/admin/blogs/${blogId}/feature`, {
            method: "PUT",
            headers: authHeaders,
            cache: "no-store",
        });
        return await handleResponse(res);
    } catch (error) {
        console.error("[toggleFeatureBlog] Error:", error);
        return { success: false, message: "Network error." };
    }
}

export async function adminDeleteBlog(blogId: string): Promise<ActionResponse> {
    try {
        const authHeaders = await getAuthHeaders();
        const res = await fetch(`${API_BASE}/admin/blogs/${blogId}`, {
            method: "DELETE",
            headers: authHeaders,
            cache: "no-store",
        });
        return await handleResponse(res);
    } catch (error) {
        console.error("[adminDeleteBlog] Error:", error);
        return { success: false, message: "Network error." };
    }
}
