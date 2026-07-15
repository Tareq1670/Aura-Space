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

export interface AdminDashboardData {
  totalUsers: number
  totalProperties: number
  totalBookings: number
  commissionEarned: number
  pendingPayouts: number
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
    const headersList = await headers()
    const tokenRes = await auth.api.getToken({ headers: headersList })
    if (!tokenRes?.token) return { success: false, message: "Not authenticated" }

    const res = await fetch(`${API_BASE}/dashboard/admin`, {
      headers: { Authorization: `Bearer ${tokenRes.token}` },
      cache: "no-store",
    })
    const body = await res.json()
    if (!res.ok || !body.success) return { success: false, message: body.message || "Failed to fetch dashboard" }

    return { success: true, data: body.data as AdminDashboardData }
  } catch {
    return { success: false, message: "Network error fetching admin dashboard" }
  }
}
