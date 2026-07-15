import { apiClientFetch } from "@/lib/client-fetch"

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
    return apiClientFetch<GetWishlistResponse>(`/api/wishlist${qs}`, { method: "GET", cache: "no-store" });
}

export async function getLists(): Promise<GetListsResponse> {
    return apiClientFetch<GetListsResponse>("/api/wishlist/lists", { method: "GET", cache: "no-store" });
}
