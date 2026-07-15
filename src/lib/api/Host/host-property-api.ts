import { apiClientFetch } from "@/lib/client-fetch"

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
        return apiClientFetch<{
            success: boolean;
            data: {
                properties: PropertyListItem[];
                pagination: { total: number; totalPages: number; currentPage: number; limit: number };
                statusSummary: Record<string, number>;
            };
        }>(`/api/properties/host/my-properties${query ? `?${query}` : ""}`);
    },

    getProperty: (id: string) =>
        apiClientFetch<{ success: boolean; data: { property: Record<string, unknown>; host: Record<string, unknown>; relatedProperties: Record<string, unknown>[] } }>(
            `/api/properties/${id}`,
        ),

    updateProperty: (id: string, data: Record<string, unknown>) =>
        apiClientFetch<{ success: boolean; data: Record<string, unknown>; message?: string }>(`/api/properties/${id}`, {
            method: "PUT",
            body: JSON.stringify(data),
        }),

    deleteProperty: (id: string) =>
        apiClientFetch<{ success: boolean; message: string }>(`/api/properties/${id}`, {
            method: "DELETE",
        }),

    duplicateProperty: (id: string) =>
        apiClientFetch<{ success: boolean; data: { id: string } }>(`/api/properties/${id}/duplicate`, {
            method: "POST",
        }),

    updatePropertyStatus: (id: string, status: string) =>
        apiClientFetch<{ success: boolean; data: { id: string; status: string } }>(`/api/properties/${id}/status`, {
            method: "PUT",
            body: JSON.stringify({ status }),
        }),
};
