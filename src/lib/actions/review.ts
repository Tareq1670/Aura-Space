"use server"

interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  statusCode?: number
}

interface CreateReviewData {
  bookingId: string
  rating: number
  comment: string
}

interface UpdateReviewData {
  rating?: number
  comment?: string
}

async function getApiBase(): Promise<string> {
  return (process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000") + "/api"
}

async function getSessionToken(): Promise<string> {
  const { auth } = await import("@/lib/auth")
  const { headers } = await import("next/headers")
  const headersList = await headers()
  const tokenResponse = await auth.api.getToken({ headers: headersList })
  if (tokenResponse?.token) {
    return tokenResponse.token
  }
  throw new Error("No session token found. Please login again.")
}

async function getAuthHeaders(): Promise<Record<string, string>> {
  const token = await getSessionToken()
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  }
}

export async function createReview(data: CreateReviewData): Promise<ApiResponse<unknown>> {
  try {
    const [API_BASE, headers] = await Promise.all([getApiBase(), getAuthHeaders()])
    const res = await fetch(`${API_BASE}/reviews`, {
      method: "POST",
      headers,
      body: JSON.stringify(data),
      cache: "no-store",
    })
    const result = await res.json()
    if (!res.ok) return { success: false, error: result.message || result.error || "Failed to create review", statusCode: res.status }
    return { success: true, data: result.data ?? result }
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : "Failed to create review" }
  }
}

export async function updateReview(id: string, data: UpdateReviewData): Promise<ApiResponse<unknown>> {
  try {
    const [API_BASE, headers] = await Promise.all([getApiBase(), getAuthHeaders()])
    const res = await fetch(`${API_BASE}/reviews/${id}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(data),
      cache: "no-store",
    })
    const result = await res.json()
    if (!res.ok) return { success: false, error: result.message || result.error || "Failed to update review", statusCode: res.status }
    return { success: true, data: result }
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : "Failed to update review" }
  }
}

export async function deleteReview(id: string): Promise<ApiResponse<unknown>> {
  try {
    const [API_BASE, headers] = await Promise.all([getApiBase(), getAuthHeaders()])
    const res = await fetch(`${API_BASE}/reviews/${id}`, {
      method: "DELETE",
      headers,
      cache: "no-store",
    })
    const result = await res.json()
    if (!res.ok) return { success: false, error: result.message || result.error || "Failed to delete review", statusCode: res.status }
    return { success: true, data: result }
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : "Failed to delete review" }
  }
}

export async function replyToReview(id: string, reply: string): Promise<ApiResponse<unknown>> {
  try {
    const [API_BASE, headers] = await Promise.all([getApiBase(), getAuthHeaders()])
    const res = await fetch(`${API_BASE}/reviews/${id}/reply`, {
      method: "PUT",
      headers,
      body: JSON.stringify({ reply }),
      cache: "no-store",
    })
    const result = await res.json()
    if (!res.ok) return { success: false, error: result.message || result.error || "Failed to reply", statusCode: res.status }
    return { success: true, data: result }
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : "Failed to reply to review" }
  }
}

export async function reportReview(id: string): Promise<ApiResponse<unknown>> {
  try {
    const [API_BASE, headers] = await Promise.all([getApiBase(), getAuthHeaders()])
    const res = await fetch(`${API_BASE}/reviews/${id}/report`, {
      method: "PUT",
      headers,
      cache: "no-store",
    })
    const result = await res.json()
    if (!res.ok) return { success: false, error: result.message || result.error || "Failed to report review", statusCode: res.status }
    return { success: true, data: result }
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : "Failed to report review" }
  }
}
