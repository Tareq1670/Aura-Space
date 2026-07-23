"use server"

import { getApiBase, getAuthHeaders } from "@/lib/api-base"

interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  statusCode?: number
}

export interface RecommendationItem {
  propertyId: string
  title: string
  reason: string
  matchScore: number
  images: string
  pricePerNight: number
  currency: string
  location: {
    city: string
    country: string
  }
  rating: number
  reviewCount: number
  category: string
  details: {
    bedrooms: number
    bathrooms: number
    maxGuests: number
  }
}

export interface ChatMessage {
  role: "user" | "assistant"
  content: string
  createdAt: string
}

export interface ChatConversation {
  conversationId: string
  messages: ChatMessage[]
  createdAt: string
  updatedAt: string
}

export interface ChatConversationSummary {
  conversationId: string
  lastMessage: string
  createdAt: string
  updatedAt: string
}

export async function getRecommendations(preferences?: {
  location?: string
  budget?: number
  guests?: number
  propertyType?: string
}): Promise<ApiResponse<{ recommendations: RecommendationItem[] }>> {
  try {
    const API_BASE = getApiBase()
    const authHeaders = await getAuthHeaders()
    const params = new URLSearchParams()
    if (preferences?.location) params.set("location", preferences.location)
    if (preferences?.budget) params.set("budget", String(preferences.budget))
    if (preferences?.guests) params.set("guests", String(preferences.guests))
    if (preferences?.propertyType) params.set("propertyType", preferences.propertyType)
    const qs = params.toString()
    const res = await fetch(`${API_BASE}/ai/recommendations${qs ? `?${qs}` : ""}`, {
      method: "GET",
      headers: authHeaders,
      cache: "no-store",
    })
    const result = await res.json()
    if (!res.ok) return { success: false, error: result.message || "Failed to get recommendations", statusCode: res.status }
    return { success: true, data: result.data }
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : "Failed to get recommendations" }
  }
}

export async function sendChatMessage(
  message: string,
  conversationId?: string
): Promise<ApiResponse<{ reply: string; conversationId: string | null; suggestions: string[] }>> {
  try {
    const API_BASE = getApiBase()
    let headers: Record<string, string> = { "Content-Type": "application/json" }
    try {
      const authHeaders = await getAuthHeaders()
      headers = authHeaders
    } catch {
      // Not logged in — send without auth, backend handles guest mode
    }
    const res = await fetch(`${API_BASE}/ai/chat`, {
      method: "POST",
      headers,
      body: JSON.stringify({ message, conversationId }),
      cache: "no-store",
    })
    const result = await res.json()
    if (!res.ok) return { success: false, error: result.message || "Failed to send message", statusCode: res.status }
    return { success: true, data: result.data ?? result }
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : "Failed to send message" }
  }
}

export async function getChatHistory(conversationId?: string): Promise<
  ApiResponse<{
    conversationId?: string
    messages?: ChatMessage[]
    conversations?: ChatConversationSummary[]
    createdAt?: string
    updatedAt?: string
  }>
> {
  try {
    const API_BASE = getApiBase()
    const authHeaders = await getAuthHeaders()
    const qs = conversationId ? `?conversationId=${conversationId}` : ""
    const res = await fetch(`${API_BASE}/ai/chat/history${qs}`, {
      method: "GET",
      headers: authHeaders,
      cache: "no-store",
    })
    const result = await res.json()
    if (!res.ok) return { success: false, error: result.message || "Failed to fetch history", statusCode: res.status }
    return { success: true, data: result.data ?? result }
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : "Failed to fetch history" }
  }
}

export async function deleteChatConversation(conversationId: string): Promise<ApiResponse<null>> {
  try {
    const API_BASE = getApiBase()
    const authHeaders = await getAuthHeaders()
    const res = await fetch(`${API_BASE}/ai/chat/${conversationId}`, {
      method: "DELETE",
      headers: authHeaders,
      cache: "no-store",
    })
    const result = await res.json()
    if (!res.ok) return { success: false, error: result.message || "Failed to delete", statusCode: res.status }
    return { success: true, data: null }
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : "Failed to delete conversation" }
  }
}

export async function generateDescription(
  details: {
    title: string
    propertyType?: string
    placeType?: string
    city?: string
    country?: string
    bedrooms?: number
    bathrooms?: number
    guests?: number
    beds?: number
    amenities?: string[]
    tone?: string
    length?: string
  }
): Promise<ApiResponse<{ description: string }>> {
  try {
    const API_BASE = getApiBase()
    const authHeaders = await getAuthHeaders()
    const res = await fetch(`${API_BASE}/ai/generate-description`, {
      method: "POST",
      headers: authHeaders,
      body: JSON.stringify(details),
      cache: "no-store",
    })
    const result = await res.json()
    if (!res.ok) return { success: false, error: result.message || "Failed to generate description", statusCode: res.status }
    return { success: true, data: result.data ?? result }
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : "Failed to generate description" }
  }
}
