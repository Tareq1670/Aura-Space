"use server"

import { getApiBase, getAuthHeaders } from "@/lib/api-base"

const API_BASE = getApiBase()

export interface GuestDashboardData {
  totalBookings: number
  upcomingTrips: number
  wishlistCount: number
  totalSpent: number
  upcomingBookings: Record<string, unknown>[]
  recentTransactions: Record<string, unknown>[]
  monthlySpend: { month: string; spend: number }[]
}

export async function getGuestDashboard(): Promise<{
  success: boolean
  data?: GuestDashboardData
  message?: string
}> {
  try {
    const authHeaders = await getAuthHeaders()
    const res = await fetch(`${API_BASE}/dashboard/guest`, {
      headers: authHeaders,
      cache: "no-store",
    })
    const body = await res.json()
    if (!res.ok || !body.success) return { success: false, message: body.message || "Failed to fetch dashboard" }

    return { success: true, data: body.data as GuestDashboardData }
  } catch {
    return { success: false, message: "Network error fetching guest dashboard" }
  }
}
