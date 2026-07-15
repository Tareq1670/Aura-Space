"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { toast } from "sonner"
import { Users, CalendarCheck, DollarSign, Activity, Building, MapPin } from "lucide-react"
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, type PieLabelRenderProps,
} from "recharts"
import StatCard from "@/Components/Dashboard/StatCard"
import { bookingAPI, type BookingItem } from "@/lib/api/Guest/booking-api"
import { transactionAPI } from "@/lib/api/Guest/transaction-api"
import { getUsersList } from "@/lib/action/admin-users"

const COLORS = ["#8b5cf6", "#10b981", "#f59e0b", "#ef4444", "#06b6d4", "#ec4899", "#84cc16", "#6366f1"]
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

const quickLinks = [
  { label: "Manage Users", href: "/dashboard/admin/users", color: "from-violet-500 to-purple-600" },
  { label: "Manage Properties", href: "/dashboard/admin/properties", color: "from-blue-500 to-indigo-600" },
  { label: "All Bookings", href: "/dashboard/admin/bookings", color: "from-emerald-500 to-teal-600" },
  { label: "Revenue", href: "/dashboard/admin/revenue", color: "from-amber-500 to-orange-600" },
  { label: "Transactions", href: "/dashboard/admin/transactions", color: "from-rose-500 to-pink-600" },
  { label: "Reviews", href: "/dashboard/admin/reviews", color: "from-cyan-500 to-sky-600" },
]

interface PropertyStats {
  totalProperties: number
  totalFeatured: number
  avgRating: number
  totalReviews: number
  byCategory: { category: string; count: number; avgPrice: number }[]
  topCities: { city: string; country: string; count: number; avgPrice: number }[]
  priceRange: { min: number; max: number; avg: number }
}

export default function AdminMainPage() {
  const [loading, setLoading] = useState(true)

  const [totalUsers, setTotalUsers] = useState(0)
  const [propertyStats, setPropertyStats] = useState<PropertyStats | null>(null)
  const [totalBookings, setTotalBookings] = useState(0)
  const [commissionEarned, setCommissionEarned] = useState(0)
  const [pendingPayouts, setPendingPayouts] = useState(0)

  const [recentActivity, setRecentActivity] = useState<BookingItem[]>([])
  const [signupTrend, setSignupTrend] = useState<Record<string, unknown>[]>([])
  const [bookingStatusData, setBookingStatusData] = useState<Record<string, unknown>[]>([])

  function getApiBase(): string {
    const raw = process.env.NEXT_PUBLIC_SERVER_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
    const base = raw.replace(/\/$/, "")
    if (base.endsWith("/api")) return base
    return `${base}/api`
  }

  useEffect(() => {
    let mounted = true
    ;(async () => {
      setLoading(true)
      try {
        const [usersRes, propsStatsRes, bookingsRes, statsRes, recentRes] = await Promise.all([
          getUsersList(),
          fetch(`${getApiBase()}/properties/stats`).then((r) => r.json()),
          bookingAPI.getAdminBookings({ page: 1, limit: 1 }),
          transactionAPI.getTransactionStats(),
          bookingAPI.getAdminBookings({ page: 1, limit: 5 }),
        ])
        if (!mounted) return

        if (usersRes.success) {
          const total = (usersRes.data as { total?: number })?.total || 0
          setTotalUsers(total)

          const users = (usersRes.data as { users?: { createdAt: string }[] })?.users || []
          const monthMap: Record<string, number> = {}
          const now = new Date()
          users.forEach((u) => {
            const d = new Date(u.createdAt)
            if (d.getFullYear() === now.getFullYear()) {
              monthMap[MONTHS[d.getMonth()]] = (monthMap[MONTHS[d.getMonth()]] || 0) + 1
            }
          })
          setSignupTrend(MONTHS.map((m) => ({ name: m, signups: monthMap[m] || 0 })))
        }

        if (propsStatsRes.success) {
          setPropertyStats(propsStatsRes.data)
        }

        setTotalBookings(bookingsRes.data?.pagination?.total || 0)
        setCommissionEarned(statsRes.data?.commissionEarned || 0)
        setPendingPayouts(statsRes.data?.pendingPayouts || 0)
        setRecentActivity(recentRes.data?.bookings || [])

        const statusCounts: Record<string, number> = {}
        if (recentRes.data?.bookings) {
          recentRes.data.bookings.forEach((b: BookingItem) => {
            statusCounts[b.status] = (statusCounts[b.status] || 0) + 1
          })
        }

        const allBookingsRes = await bookingAPI.getAdminBookings({ page: 1, limit: 100 })
        if (mounted) {
          const allStatus: Record<string, number> = {}
          ;(allBookingsRes.data?.bookings || []).forEach((b: BookingItem) => {
            allStatus[b.status] = (allStatus[b.status] || 0) + 1
          })
          setBookingStatusData(
            Object.entries(allStatus).map(([name, count]) => ({ name, count })),
          )
        }
      } catch {
        if (!mounted) return
        toast.error("Failed to load dashboard data")
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => { mounted = false }
  }, [])

  return (
    <div className="space-y-8 p-6 lg:p-8">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-gray-900 lg:text-3xl">Admin Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">Platform overview and management</p>
      </motion.div>

      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-28 animate-pulse rounded-2xl bg-gray-100" />
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            <StatCard
              label="Total Users"
              value={totalUsers}
              gradient="from-violet-500 to-indigo-600"
              prefix=""
              formatter={(v) => String(v)}
              icon={<Users className="h-5 w-5 text-white" />}
            />
            <StatCard
              label="Total Properties"
              value={propertyStats?.totalProperties || 0}
              gradient="from-blue-500 to-cyan-600"
              prefix=""
              formatter={(v) => String(v)}
              icon={<Building className="h-5 w-5 text-white" />}
            />
            <StatCard
              label="Total Bookings"
              value={totalBookings}
              gradient="from-emerald-500 to-teal-600"
              prefix=""
              formatter={(v) => String(v)}
              icon={<CalendarCheck className="h-5 w-5 text-white" />}
            />
            <StatCard
              label="Platform Revenue"
              value={commissionEarned}
              gradient="from-amber-500 to-orange-600"
              icon={<DollarSign className="h-5 w-5 text-white" />}
            />
            <StatCard
              label="Pending Payouts"
              value={pendingPayouts}
              gradient="from-rose-500 to-pink-600"
              prefix=""
              formatter={(v) => `$${v.toLocaleString("en-US", { minimumFractionDigits: 2 })}`}
              icon={<Activity className="h-5 w-5 text-white" />}
            />
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
            {signupTrend.some((d) => Number((d as Record<string, unknown>).signups || 0) > 0) && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
              >
                <h3 className="mb-4 text-sm font-semibold text-gray-900">New User Signups</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={signupTrend as Record<string, unknown>[]} margin={{ left: -10, right: 10, top: 5, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} allowDecimals={false} />
                    <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #f0f0f0", fontSize: 13 }} />
                    <Line type="monotone" dataKey="signups" stroke="#8b5cf6" strokeWidth={2} dot={{ fill: "#8b5cf6", r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </motion.div>
            )}

            {bookingStatusData.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
              >
                <h3 className="mb-4 text-sm font-semibold text-gray-900">Booking Status Distribution</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={bookingStatusData as Record<string, unknown>[]}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      dataKey="count"
                      nameKey="name"
                      label={({ name, value }: PieLabelRenderProps) => `${name} (${value})`}
                    >
                      {(bookingStatusData as Record<string, unknown>[]).map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #f0f0f0", fontSize: 13 }} />
                  </PieChart>
                </ResponsiveContainer>
              </motion.div>
            )}

            {propertyStats && propertyStats.byCategory.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
              >
                <h3 className="mb-4 text-sm font-semibold text-gray-900">Properties by Category</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={propertyStats.byCategory as Record<string, unknown>[]} margin={{ left: -10, right: 10, top: 5, bottom: 5 }} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis type="number" tick={{ fontSize: 11, fill: "#9ca3af" }} />
                    <YAxis dataKey="category" type="category" tick={{ fontSize: 10, fill: "#9ca3af" }} width={70} />
                    <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #f0f0f0", fontSize: 13 }} />
                    <Bar dataKey="count" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </motion.div>
            )}
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {propertyStats && propertyStats.topCities.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
              >
                <div className="mb-4 flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-violet-500" />
                  <h3 className="text-sm font-semibold text-gray-900">Top Locations</h3>
                </div>
                <div className="space-y-3">
                  {propertyStats.topCities.slice(0, 6).map((city, i) => (
                    <div key={city.city} className="flex items-center gap-3">
                      <span className="w-5 text-xs font-bold text-gray-400">{i + 1}</span>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700">{city.city}</span>
                          <span className="text-xs text-gray-400">{city.count} properties</span>
                        </div>
                        <div className="mt-1 h-1.5 w-full rounded-full bg-gray-100">
                          <div
                            className="h-1.5 rounded-full bg-gradient-to-r from-violet-500 to-indigo-500"
                            style={{ width: `${(city.count / Math.max(...propertyStats.topCities.map((c) => c.count))) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {recentActivity.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
              >
                <h3 className="mb-4 text-sm font-semibold text-gray-900">Recent Activity</h3>
                <div className="space-y-3">
                  {recentActivity.map((b) => (
                    <div key={b._id} className="flex items-center gap-3 rounded-xl border border-gray-50 bg-gray-50/50 p-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-100 to-indigo-100 text-xs font-bold text-violet-600">
                        {b.propertyTitle?.charAt(0) || "B"}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-gray-900">{b.propertyTitle}</p>
                        <p className="text-xs text-gray-400">
                          {b.guest?.name || "Guest"} · ${b.totalAmount} · {b.status}
                        </p>
                      </div>
                      <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
                        b.status === "confirmed" ? "bg-emerald-50 text-emerald-600" :
                        b.status === "pending" ? "bg-amber-50 text-amber-600" :
                        b.status === "completed" ? "bg-blue-50 text-blue-600" :
                        "bg-red-50 text-red-600"
                      }`}>
                        {b.status}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {quickLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-xl bg-gradient-to-br ${link.color} p-5 text-white shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl`}
              >
                <h3 className="text-lg font-semibold">{link.label}</h3>
                <p className="mt-1 text-sm text-white/70">Click to manage</p>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
