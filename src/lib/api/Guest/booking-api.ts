import { apiClientFetch } from "@/lib/client-fetch";

export interface GetBookingsParams {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
}

export interface BookingItem {
    _id: string;
    guestId: string;
    hostId: string;
    propertyId: string;
    propertyTitle: string;
    propertyImage: string;
    checkIn: string;
    checkOut: string;
    numberOfGuests: number;
    numberOfNights: number;
    pricePerNight: number;
    totalAmount: number;
    platformFee: number;
    hostEarning: number;
    status: "pending" | "confirmed" | "cancelled" | "completed";
    specialRequest?: string;
    cancelledBy?: "guest" | "host" | "admin";
    cancellationReason?: string;
    createdAt: string;
    updatedAt: string;
    guest?: { id: string; name: string; image?: string | null };
    host?: { id: string; name: string; image?: string | null };
    property?: {
        id: string;
        title: string;
        images: string[];
        location: { city?: string; country?: string; address?: string };
        category: string;
    };
}

interface PaginationInfo {
    total: number;
    totalPages: number;
    currentPage: number;
    limit: number;
}

export const bookingAPI = {
    getMyBookings: (params: GetBookingsParams = {}) => {
        const qs = new URLSearchParams();
        if (params.page) qs.set("page", String(params.page));
        if (params.limit) qs.set("limit", String(params.limit));
        if (params.status) qs.set("status", params.status);
        if (params.search) qs.set("search", params.search);
        const query = qs.toString();
        return apiClientFetch<{
            success: boolean;
            data: { bookings: BookingItem[]; pagination: PaginationInfo };
        }>(`/api/bookings/my-bookings${query ? `?${query}` : ""}`);
    },

    getHostReservations: (params: GetBookingsParams & { propertyId?: string } = {}) => {
        const qs = new URLSearchParams();
        if (params.page) qs.set("page", String(params.page));
        if (params.limit) qs.set("limit", String(params.limit));
        if (params.status) qs.set("status", params.status);
        if (params.propertyId) qs.set("propertyId", params.propertyId);
        const query = qs.toString();
        return apiClientFetch<{
            success: boolean;
            data: { bookings: BookingItem[]; pagination: PaginationInfo };
        }>(`/api/bookings/host-reservations${query ? `?${query}` : ""}`);
    },

    getBookingDetail: (id: string) =>
        apiClientFetch<{ success: boolean; data: BookingItem }>(
            `/api/bookings/${id}`,
        ),

    getAdminBookings: (params: GetBookingsParams & { guestId?: string; hostId?: string; propertyId?: string } = {}) => {
        const qs = new URLSearchParams();
        if (params.page) qs.set("page", String(params.page));
        if (params.limit) qs.set("limit", String(params.limit));
        if (params.status) qs.set("status", params.status);
        if (params.search) qs.set("search", params.search);
        if (params.guestId) qs.set("guestId", params.guestId);
        if (params.hostId) qs.set("hostId", params.hostId);
        if (params.propertyId) qs.set("propertyId", params.propertyId);
        const query = qs.toString();
        return apiClientFetch<{
            success: boolean;
            data: { bookings: BookingItem[]; pagination: PaginationInfo };
        }>(`/api/admin/bookings${query ? `?${query}` : ""}`);
    },

    confirmBooking: (id: string) =>
        apiClientFetch<{ success: boolean; message: string; data: { id: string; status: string } }>(
            `/api/bookings/${id}/confirm`,
            { method: "PUT" },
        ),

    cancelBooking: (id: string, reason?: string) =>
        apiClientFetch<{ success: boolean; message: string; data: { id: string; status: string } }>(
            `/api/bookings/${id}/cancel`,
            { method: "PUT", body: JSON.stringify({ reason }) },
        ),

    completeBooking: (id: string) =>
        apiClientFetch<{ success: boolean; message: string; data: { id: string; status: string } }>(
            `/api/bookings/${id}/complete`,
            { method: "PUT" },
        ),

    forceCancelBooking: (id: string, reason?: string) =>
        apiClientFetch<{ success: boolean; message: string; data: { id: string; status: string } }>(
            `/api/admin/bookings/${id}/force-cancel`,
            { method: "PUT", body: JSON.stringify({ reason }) },
        ),
};
