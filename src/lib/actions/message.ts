"use server"

interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  statusCode?: number
}

async function getApiBase(): Promise<string> {
  return (process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000") + "/api"
}

async function getSessionToken(): Promise<string> {
  const { auth } = await import("@/lib/auth")
  const { headers } = await import("next/headers")
  const headersList = await headers()
  const tokenResponse = await auth.api.getToken({ headers: headersList })
  if (tokenResponse?.token) return tokenResponse.token
  throw new Error("No session token found. Please login again.")
}

async function getAuthHeaders(): Promise<Record<string, string>> {
  const token = await getSessionToken()
  return { "Content-Type": "application/json", Authorization: `Bearer ${token}` }
}

export async function startConversation(participantId: string, bookingId?: string, propertyId?: string): Promise<ApiResponse<unknown>> {
  try {
    const [API_BASE, headers] = await Promise.all([getApiBase(), getAuthHeaders()])
    const res = await fetch(`${API_BASE}/conversations`, {
      method: "POST",
      headers,
      body: JSON.stringify({ participantId, bookingId, propertyId }),
      cache: "no-store",
    })
    const result = await res.json()
    if (!res.ok) return { success: false, error: result.message || result.error || "Failed to start conversation", statusCode: res.status }
    return { success: true, data: result.data ?? result }
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : "Failed to start conversation" }
  }
}

export async function sendMessage(conversationId: string, content: string): Promise<ApiResponse<unknown>> {
  try {
    const [API_BASE, headers] = await Promise.all([getApiBase(), getAuthHeaders()])
    const res = await fetch(`${API_BASE}/messages`, {
      method: "POST",
      headers,
      body: JSON.stringify({ conversationId, content }),
      cache: "no-store",
    })
    const result = await res.json()
    if (!res.ok) return { success: false, error: result.message || result.error || "Failed to send message", statusCode: res.status }
    return { success: true, data: result.data ?? result }
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : "Failed to send message" }
  }
}

export async function getConversations(page = 1, limit = 20): Promise<ApiResponse<unknown>> {
  try {
    const [API_BASE, headers] = await Promise.all([getApiBase(), getAuthHeaders()])
    const res = await fetch(`${API_BASE}/conversations?page=${page}&limit=${limit}`, {
      method: "GET",
      headers,
      cache: "no-store",
    })
    const result = await res.json()
    if (!res.ok) return { success: false, error: result.message || "Failed to fetch conversations", statusCode: res.status }
    return { success: true, data: result.data ?? result, statusCode: res.status }
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : "Failed to fetch conversations" }
  }
}

export async function getMessages(conversationId: string, page = 1, limit = 50): Promise<ApiResponse<unknown>> {
  try {
    const [API_BASE, headers] = await Promise.all([getApiBase(), getAuthHeaders()])
    const res = await fetch(`${API_BASE}/messages/${conversationId}?page=${page}&limit=${limit}`, {
      method: "GET",
      headers,
      cache: "no-store",
    })
    const result = await res.json()
    if (!res.ok) return { success: false, error: result.message || "Failed to fetch messages", statusCode: res.status }
    return { success: true, data: result.data ?? result, statusCode: res.status }
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : "Failed to fetch messages" }
  }
}

export async function markAsRead(messageId: string): Promise<ApiResponse<unknown>> {
  try {
    const [API_BASE, headers] = await Promise.all([getApiBase(), getAuthHeaders()])
    const res = await fetch(`${API_BASE}/messages/${messageId}/read`, {
      method: "PUT",
      headers,
      cache: "no-store",
    })
    const result = await res.json()
    if (!res.ok) return { success: false, error: result.message || "Failed to mark as read", statusCode: res.status }
    return { success: true, data: result }
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : "Failed to mark message as read" }
  }
}

export async function markAllAsRead(conversationId: string): Promise<ApiResponse<unknown>> {
  try {
    const [API_BASE, headers] = await Promise.all([getApiBase(), getAuthHeaders()])
    const res = await fetch(`${API_BASE}/conversations/${conversationId}/read-all`, {
      method: "PUT",
      headers,
      cache: "no-store",
    })
    const result = await res.json()
    if (!res.ok) return { success: false, error: result.message || "Failed to mark all as read", statusCode: res.status }
    return { success: true, data: result }
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : "Failed to mark all as read" }
  }
}

export async function getUnreadCount(): Promise<ApiResponse<unknown>> {
  try {
    const [API_BASE, headers] = await Promise.all([getApiBase(), getAuthHeaders()])
    const res = await fetch(`${API_BASE}/messages/unread-count`, {
      method: "GET",
      headers,
      cache: "no-store",
    })
    const result = await res.json()
    if (!res.ok) return { success: false, error: result.message || "Failed to fetch unread count", statusCode: res.status }
    return { success: true, data: result.data ?? result }
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : "Failed to fetch unread count" }
  }
}
