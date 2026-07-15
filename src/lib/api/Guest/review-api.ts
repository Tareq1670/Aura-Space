const SERVER_URL =
  typeof window !== "undefined"
    ? window.location.origin.includes("localhost")
      ? process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000"
      : process.env.NEXT_PUBLIC_SERVER_URL || "https://aura-space-server.vercel.app"
    : process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000"

async function getAuthToken(): Promise<string> {
  try {
    const { authClient } = await import("@/lib/auth-client")
    const tokenResponse = await authClient.token()
    if (tokenResponse?.data?.token) return tokenResponse.data.token
    throw new Error("No token from authClient.token()")
  } catch {
    throw new Error("Login required.")
  }
}

async function apiFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const token = await getAuthToken()
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  }

  const res = await fetch(`${SERVER_URL}${endpoint}`, {
    ...options,
    headers: { ...headers, ...(options?.headers as Record<string, string>) },
  })

  const contentType = res.headers.get("content-type") || ""
  const body = contentType.includes("application/json") ? await res.json() : await res.text()

  if (!res.ok) {
    const message = body?.message || body?.error || `Request failed (${res.status})`
    throw new Error(message)
  }

  return body
}

export interface ReviewRecord {
  _id: string
  guestId: string
  hostId: string
  propertyId: string
  bookingId: string
  rating: number
  comment: string
  hostReply?: string
  hostReplyDate?: string
  isReported?: boolean
  createdAt: string
  guest?: { id: string; name: string; image?: string }
  propertyTitle?: string
  propertyImage?: string
}

export interface PendingBooking {
  _id: string
  propertyId: string
  propertyTitle: string
  propertyImage?: string
  checkIn: string
  checkOut: string
}

export interface ReviewStats {
  averageRating: number
  totalReviews: number
  breakdown: Record<string, number>
}

export interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

export const reviewAPI = {
  async getMyReviews(params?: { page?: number; limit?: number }) {
    const query = new URLSearchParams()
    if (params?.page) query.set("page", String(params.page))
    if (params?.limit) query.set("limit", String(params.limit))
    const qs = query.toString()
    const res = await apiFetch<{ success: boolean; data: { reviews: ReviewRecord[]; pending: PendingBooking[]; pagination: Pagination } }>(
      `/api/reviews/my-reviews${qs ? `?${qs}` : ""}`,
    )
    return res.data
  },

  async getHostReviews(params?: { page?: number; limit?: number; propertyId?: string; rating?: number }) {
    const query = new URLSearchParams()
    if (params?.page) query.set("page", String(params.page))
    if (params?.limit) query.set("limit", String(params.limit))
    if (params?.propertyId) query.set("propertyId", params.propertyId)
    if (params?.rating) query.set("rating", String(params.rating))
    const qs = query.toString()
    const res = await apiFetch<{ success: boolean; data: { reviews: ReviewRecord[]; stats: ReviewStats; pagination: Pagination } }>(
      `/api/reviews/host-reviews${qs ? `?${qs}` : ""}`,
    )
    return res.data
  },

  async getPropertyReviews(propertyId: string, params?: { page?: number; limit?: number }) {
    const query = new URLSearchParams()
    if (params?.page) query.set("page", String(params.page))
    if (params?.limit) query.set("limit", String(params.limit))
    const qs = query.toString()
    const res = await apiFetch<{ success: boolean; data: { reviews: ReviewRecord[]; pagination: Pagination } }>(
      `/api/reviews/property/${propertyId}${qs ? `?${qs}` : ""}`,
    )
    return res.data
  },

  async getAdminReviews(params?: { page?: number; limit?: number; reported?: string; rating?: number; propertyId?: string }) {
    const query = new URLSearchParams()
    if (params?.page) query.set("page", String(params.page))
    if (params?.limit) query.set("limit", String(params.limit))
    if (params?.reported) query.set("reported", params.reported)
    if (params?.rating) query.set("rating", String(params.rating))
    if (params?.propertyId) query.set("propertyId", params.propertyId)
    const qs = query.toString()
    const res = await apiFetch<{ success: boolean; data: { reviews: ReviewRecord[]; pagination: Pagination } }>(
      `/api/admin/reviews${qs ? `?${qs}` : ""}`,
    )
    return res.data
  },
}
