"use server"

import { getApiBase, getAuthHeaders } from "@/lib/api-base"

const API_BASE = getApiBase()

export interface HostDashboardData {
  totalProperties: number
  activeBookings: number
  thisMonthIncome: number
  occupancyRate: number
  averageRating: number
  totalReviews: number
  totalIncome: number
  pendingBookings: Record<string, unknown>[]
  recentReservations: Record<string, unknown>[]
  monthlyIncome: { month: string; income: number }[]
}

export async function getHostDashboard(): Promise<{
  success: boolean
  data?: HostDashboardData
  message?: string
}> {
  try {
    const authHeaders = await getAuthHeaders()
    const res = await fetch(`${API_BASE}/dashboard/host`, {
      headers: authHeaders,
      cache: "no-store",
    })
    const body = await res.json()
    if (!res.ok || !body.success) return { success: false, message: body.message || "Failed to fetch dashboard" }

    return { success: true, data: body.data as HostDashboardData }
  } catch {
    return { success: false, message: "Network error fetching host dashboard" }
  }
}
