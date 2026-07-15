"use server"

import { getApiBase, getAuthHeaders } from "@/lib/api-base"

const API_BASE = getApiBase()

export interface AdminDashboardData {
  totalUsers: number
  totalProperties: number
  totalBookings: number
  commissionEarned: number
  pendingPayouts: number
  reportedReviews: number
  recentBookings: Record<string, unknown>[]
  signupTrend: { month: string; signups: number }[]
  bookingStatusData: { name: string; count: number }[]
  categoryData: { name: string; count: number }[]
}

export async function getAdminDashboard(): Promise<{
  success: boolean
  data?: AdminDashboardData
  message?: string
}> {
  try {
    const authHeaders = await getAuthHeaders()
    const res = await fetch(`${API_BASE}/dashboard/admin`, {
      headers: authHeaders,
      cache: "no-store",
    })
    const body = await res.json()
    if (!res.ok || !body.success) return { success: false, message: body.message || "Failed to fetch dashboard" }

    return { success: true, data: body.data as AdminDashboardData }
  } catch {
    return { success: false, message: "Network error fetching admin dashboard" }
  }
}
