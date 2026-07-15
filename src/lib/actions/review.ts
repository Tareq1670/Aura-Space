"use server"

import { getApiBase, getAuthHeaders } from "@/lib/api-base"

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

export async function createReview(data: CreateReviewData): Promise<ApiResponse<unknown>> {
  try {
    const API_BASE = getApiBase()
    const authHeaders = await getAuthHeaders()
    const res = await fetch(`${API_BASE}/reviews`, {
      method: "POST",
      headers: authHeaders,
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
    const API_BASE = getApiBase()
    const authHeaders = await getAuthHeaders()
    const res = await fetch(`${API_BASE}/reviews/${id}`, {
      method: "PUT",
      headers: authHeaders,
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
    const API_BASE = getApiBase()
    const authHeaders = await getAuthHeaders()
    const res = await fetch(`${API_BASE}/reviews/${id}`, {
      method: "DELETE",
      headers: authHeaders,
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
    const API_BASE = getApiBase()
    const authHeaders = await getAuthHeaders()
    const res = await fetch(`${API_BASE}/reviews/${id}/reply`, {
      method: "PUT",
      headers: authHeaders,
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
    const API_BASE = getApiBase()
    const authHeaders = await getAuthHeaders()
    const res = await fetch(`${API_BASE}/reviews/${id}/report`, {
      method: "PUT",
      headers: authHeaders,
      cache: "no-store",
    })
    const result = await res.json()
    if (!res.ok) return { success: false, error: result.message || result.error || "Failed to report review", statusCode: res.status }
    return { success: true, data: result }
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : "Failed to report review" }
  }
}
