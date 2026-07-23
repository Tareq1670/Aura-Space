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

export interface AdminRevenueData {
  summary: {
    totalRevenue: number
    commissionEarned: number
    pendingPayouts: number
    netRevenue: number
    thisMonthRevenue: number
    revenueGrowth: number
  }
  revenueByMonth: { month: string; revenue: number; bookings: number }[]
  topHosts: { userId: string; name: string; earnings: number; count: number }[]
  topProperties: { name: string; earnings: number }[]
}

export async function getAdminRevenue(): Promise<{
  success: boolean
  data?: AdminRevenueData
  message?: string
}> {
  try {
    const authHeaders = await getAuthHeaders()
    const res = await fetch(`${API_BASE}/admin/revenue`, {
      headers: authHeaders,
      cache: "no-store",
    })
    const body = await res.json()
    if (!res.ok || !body.success) return { success: false, message: body.message || "Failed to fetch revenue data" }

    return { success: true, data: body.data as AdminRevenueData }
  } catch {
    return { success: false, message: "Network error fetching admin revenue" }
  }
}

export interface AdvertiseStats {
  monthlyActiveUsers: number
  monthlyPageViews: number
  avgBookingValue: number
  totalBookings: number
  totalUsers: number
}

export async function getAdvertiseStats(): Promise<{
  success: boolean
  data?: AdvertiseStats
  message?: string
}> {
  try {
    const authHeaders = await getAuthHeaders()
    const res = await fetch(`${API_BASE}/admin/advertise/stats`, {
      headers: authHeaders,
      cache: "no-store",
    })
    const body = await res.json()
    if (!res.ok || !body.success) return { success: false, message: body.message || "Failed to fetch advertise stats" }

    return { success: true, data: body.data as AdvertiseStats }
  } catch {
    return { success: false, message: "Network error fetching advertise stats" }
  }
}

export async function joinAdvertiseWaitlist(name: string, email: string): Promise<{
  success: boolean
  data?: { waitlistCount: number }
  message?: string
}> {
  try {
    const authHeaders = await getAuthHeaders()
    const res = await fetch(`${API_BASE}/admin/advertise/waitlist`, {
      method: "POST",
      headers: { ...authHeaders, "Content-Type": "application/json" },
      body: JSON.stringify({ name, email }),
      cache: "no-store",
    })
    const body = await res.json()
    return { success: body.success, data: body.data, message: body.message }
  } catch {
    return { success: false, message: "Network error joining waitlist" }
  }
}
