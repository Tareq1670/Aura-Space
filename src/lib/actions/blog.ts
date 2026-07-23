"use server";

import { getApiBase, getAuthHeaders } from "@/lib/api-base";

const API_BASE = getApiBase();

// ============================================================
// TYPES
// ============================================================

export interface Blog {
    id: string;
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    coverImage: string | null;
    tags: string[];
    authorId: string;
    authorName: string;
    authorImage: string | null;
    status: "published" | "draft";
    isFeatured: boolean;
    viewCount: number;
    readingTime: number;
    createdAt: string;
    updatedAt: string;
}

export interface PaginationInfo {
    total: number;
    totalPages: number;
    currentPage: number;
    limit: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
}

interface ApiResponse<T = unknown> {
    success: boolean;
    data?: T;
    error?: string;
    statusCode?: number;
}

// ============================================================
// HELPERS
// ============================================================

async function publicFetch<T = unknown>(
    endpoint: string,
    options: RequestInit = {}
): Promise<ApiResponse<T>> {
    const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
    const url = `${API_BASE}${cleanEndpoint}`;
    try {
        const res = await fetch(url, {
            ...options,
            headers: {
                "Content-Type": "application/json",
                ...(options.headers || {}),
            },
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
            return { success: false, error: errorMsg };
        }
        return {
            success: true,
            data: (typeof result === "object" ? result?.data ?? result : result) as T,
        };
    } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Network error";
        if (msg.includes("fetch failed") || msg.includes("ECONNREFUSED")) {
            return { success: false, error: "Cannot connect to server. Make sure backend is running." };
        }
        return { success: false, error: msg };
    }
}

async function authFetch<T = unknown>(
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
            data: (typeof result === "object" ? result?.data ?? result : result) as T,
        };
    } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Network error";
        if (msg.includes("fetch failed") || msg.includes("ECONNREFUSED")) {
            return { success: false, error: "Cannot connect to server. Make sure backend is running." };
        }
        return { success: false, error: msg };
    }
}

// ============================================================
// PUBLIC ACTIONS
// ============================================================

export async function getPublicBlogs(params: {
    page?: string;
    limit?: string;
    tag?: string;
    search?: string;
    sort?: string;
} = {}): Promise<ApiResponse<{ blogs: Blog[]; pagination: PaginationInfo }>> {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
        if (value) query.set(key, value);
    });
    const qs = query.toString();
    return publicFetch(`/blogs${qs ? `?${qs}` : ""}`);
}

export async function getFeaturedBlogs(): Promise<ApiResponse<{ blogs: Blog[] }>> {
    return publicFetch("/blogs/featured");
}

export async function getBlogBySlug(
    slug: string
): Promise<ApiResponse<{ blog: Blog }>> {
    return publicFetch(`/blogs/${encodeURIComponent(slug)}`);
}

// ============================================================
// AUTHENTICATED ACTIONS
// ============================================================

export interface CreateBlogData {
    title: string;
    content: string;
    excerpt?: string;
    tags?: string[];
    coverImage?: string | null;
    status?: "published" | "draft";
}

export async function createBlog(data: CreateBlogData): Promise<ApiResponse<Blog>> {
    return authFetch("/blogs", {
        method: "POST",
        body: JSON.stringify(data),
    });
}

export async function updateBlog(
    id: string,
    data: Partial<CreateBlogData>
): Promise<ApiResponse<Blog>> {
    return authFetch(`/blogs/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
    });
}

export async function deleteBlog(id: string): Promise<ApiResponse<void>> {
    return authFetch(`/blogs/${id}`, {
        method: "DELETE",
    });
}

export async function getMyBlogs(params: {
    page?: string;
    limit?: string;
    status?: string;
} = {}): Promise<ApiResponse<{ blogs: Blog[]; pagination: PaginationInfo }>> {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
        if (value) query.set(key, value);
    });
    const qs = query.toString();
    return authFetch(`/blogs/my/blogs${qs ? `?${qs}` : ""}`);
}

export async function uploadBlogCover(
    formData: FormData
): Promise<ApiResponse<{ url: string }>> {
    try {
        const authHeaders = await getAuthHeaders();
        const res = await fetch(`${API_BASE}/blogs/upload-cover-local`, {
            method: "POST",
            headers: {
                Authorization: authHeaders.Authorization,
            },
            body: formData,
            cache: "no-store",
        });
        const result = await res.json();
        if (!res.ok || !result.success) {
            return { success: false, error: result.message || "Upload failed." };
        }
        return { success: true, data: result.data };
    } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Network error";
        if (msg.includes("fetch failed") || msg.includes("ECONNREFUSED")) {
            return { success: false, error: "Cannot connect to server. Make sure backend is running." };
        }
        return { success: false, error: msg };
    }
}

// ============================================================
// AI BLOG GENERATOR
// ============================================================

export interface AIBlogRequest {
    topic: string;
    tone?: string;
    style?: string;
    length?: string;
}

export interface AIBlogResponse {
    title: string;
    content: string;
    excerpt: string;
    tags: string[];
}

export async function generateBlogWithAI(
    data: AIBlogRequest
): Promise<ApiResponse<AIBlogResponse>> {
    return authFetch("/ai/blog-generator", {
        method: "POST",
        body: JSON.stringify(data),
    });
}
