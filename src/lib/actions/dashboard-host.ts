"use server"

import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { getApiBase } from "@/lib/api-base"

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
    const headersList = await headers()
    const tokenRes = await (auth.api as any).getToken({ headers: headersList })
    if (!tokenRes?.token) return { success: false, message: "Not authenticated" }

    const res = await fetch(`${API_BASE}/dashboard/host`, {
      headers: { Authorization: `Bearer ${tokenRes.token}` },
      cache: "no-store",
    })
    const body = await res.json()
    if (!res.ok || !body.success) return { success: false, message: body.message || "Failed to fetch dashboard" }

    return { success: true, data: body.data as HostDashboardData }
  } catch {
    return { success: false, message: "Network error fetching host dashboard" }
  }
}
