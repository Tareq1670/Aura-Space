"use server"

import { headers } from "next/headers"
import { auth } from "@/lib/auth"

const API_BASE = (() => {
  const raw =
    process.env.NEXT_PUBLIC_SERVER_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.API_BASE_URL ||
    "http://localhost:5000"
  const base = raw.replace(/\/$/, "")
  if (base.endsWith("/api")) return base
  return `${base}/api`
})()

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
    const headersList = await headers()
    const tokenRes = await auth.api.getToken({ headers: headersList })
    if (!tokenRes?.token) return { success: false, message: "Not authenticated" }

    const res = await fetch(`${API_BASE}/dashboard/guest`, {
      headers: { Authorization: `Bearer ${tokenRes.token}` },
      cache: "no-store",
    })
    const body = await res.json()
    if (!res.ok || !body.success) return { success: false, message: body.message || "Failed to fetch dashboard" }

    return { success: true, data: body.data as GuestDashboardData }
  } catch {
    return { success: false, message: "Network error fetching guest dashboard" }
  }
}
