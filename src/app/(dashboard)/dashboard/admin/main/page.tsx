"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { toast } from "sonner"
import { Users, CalendarCheck, DollarSign, Activity, Building, Flag, AlertCircle, RefreshCw } from "lucide-react"
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, type PieLabelRenderProps,
} from "recharts"
import StatCard from "@/Components/Dashboard/StatCard"
import { getAdminDashboard, type AdminDashboardData } from "@/lib/actions/dashboard-admin"
import { formatCurrency } from "@/lib/currency"

const COLORS = ["#8b5cf6", "#10b981", "#f59e0b", "#ef4444", "#06b6d4", "#ec4899", "#84cc16", "#6366f1"]

const quickLinks = [
  { label: "Manage Users", href: "/dashboard/admin/users", color: "from-violet-500 to-purple-600" },
  { label: "Manage Properties", href: "/dashboard/admin/properties", color: "from-blue-500 to-indigo-600" },
  { label: "All Bookings", href: "/dashboard/admin/bookings", color: "from-emerald-500 to-teal-600" },
  { label: "Revenue", href: "/dashboard/admin/revenue", color: "from-amber-500 to-orange-600" },
  { label: "Transactions", href: "/dashboard/admin/transactions", color: "from-rose-500 to-pink-600" },
  { label: "Reviews", href: "/dashboard/admin/reviews", color: "from-cyan-500 to-sky-600" },
]

export default function AdminMainPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<AdminDashboardData | null>(null)

  useEffect(() => {
    let mounted = true
    setError(null)
    ;(async () => {
      setLoading(true)
      try {
        const res = await getAdminDashboard()
        if (!mounted) return
        if (res.success && res.data) {
          setData(res.data)
        } else {
          setError(res.message || "Failed to load dashboard")
          toast.error(res.message || "Failed to load dashboard")
        }
      } catch {
        if (!mounted) return
        setError("Failed to load dashboard data")
        toast.error("Failed to load dashboard data")
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => { mounted = false }
  }, [])

  if (error) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-gray-400">
        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50">
          <AlertCircle className="h-8 w-8 text-red-400" />
        </div>
        <p className="text-lg font-semibold text-gray-900">Failed to load dashboard</p>
        <p className="mt-1 text-sm text-gray-400">{error}</p>
        <button onClick={() => window.location.reload()} className="mt-6 flex items-center gap-2 rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800">
          <RefreshCw className="h-4 w-4" />
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-8 p-6 lg:p-8">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-gray-900 lg:text-3xl">Admin Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">Platform overview and management</p>
      </motion.div>

      {loading ? (
        <div>
          <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-28 animate-pulse rounded-2xl bg-gray-100" />
            ))}
          </div>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 animate-pulse rounded-2xl bg-gray-100" />
            ))}
          </div>
        </div>
      ) : data ? (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            <StatCard label="Total Users" value={data.totalUsers} gradient="from-violet-500 to-indigo-600" prefix="" formatter={(v) => String(v)} icon={<Users className="h-5 w-5 text-white" />} />
            <StatCard label="Total Properties" value={data.totalProperties} gradient="from-blue-500 to-cyan-600" prefix="" formatter={(v) => String(v)} icon={<Building className="h-5 w-5 text-white" />} />
            <StatCard label="Total Bookings" value={data.totalBookings} gradient="from-emerald-500 to-teal-600" prefix="" formatter={(v) => String(v)} icon={<CalendarCheck className="h-5 w-5 text-white" />} />
            <StatCard label="Platform Revenue" value={data.commissionEarned} gradient="from-amber-500 to-orange-600" icon={<DollarSign className="h-5 w-5 text-white" />} />
            <StatCard label="Pending Payouts" value={data.pendingPayouts} gradient="from-rose-500 to-pink-600" prefix="" formatter={(v) => formatCurrency(v)} icon={<Activity className="h-5 w-5 text-white" />} />
            {data.reportedReviews > 0 && (
              <Link href="/dashboard/admin/reports">
                <StatCard label="Reported Reviews" value={data.reportedReviews} gradient="from-rose-500 to-red-600" prefix="" formatter={(v) => String(v)} icon={<Flag className="h-5 w-5 text-white" />} />
              </Link>
            )}
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
            {data.signupTrend?.some((d) => d.signups > 0) && (
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                <h3 className="mb-4 text-sm font-semibold text-gray-900">New User Signups</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={data.signupTrend} margin={{ left: -10, right: 10, top: 5, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} allowDecimals={false} />
                    <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #f0f0f0", fontSize: 13 }} />
                    <Line type="monotone" dataKey="signups" stroke="#8b5cf6" strokeWidth={2} dot={{ fill: "#8b5cf6", r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </motion.div>
            )}

            {data.bookingStatusData?.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                <h3 className="mb-4 text-sm font-semibold text-gray-900">Booking Status Distribution</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={data.bookingStatusData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="count" nameKey="name" label={({ name, value }: PieLabelRenderProps) => `${name} (${value})`}>
                      {data.bookingStatusData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #f0f0f0", fontSize: 13 }} />
                  </PieChart>
                </ResponsiveContainer>
              </motion.div>
            )}

            {data.categoryData?.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                <h3 className="mb-4 text-sm font-semibold text-gray-900">Properties by Category</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={data.categoryData} margin={{ left: -10, right: 10, top: 5, bottom: 5 }} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis type="number" tick={{ fontSize: 11, fill: "#9ca3af" }} />
                    <YAxis dataKey="name" type="category" tick={{ fontSize: 10, fill: "#9ca3af" }} width={70} />
                    <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #f0f0f0", fontSize: 13 }} />
                    <Bar dataKey="count" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </motion.div>
            )}
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {data.recentBookings?.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                <h3 className="mb-4 text-sm font-semibold text-gray-900">Recent Activity</h3>
                <div className="space-y-3">
                  {(data.recentBookings as Record<string, unknown>[]).map((b: Record<string, unknown>) => (
                    <div key={b._id as string} className="flex items-center gap-3 rounded-xl border border-gray-50 bg-gray-50/50 p-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-100 to-indigo-100 text-xs font-bold text-violet-600">
                        {((b.propertyTitle as string)?.charAt(0)) || "B"}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-gray-900">{b.propertyTitle as string}</p>
                        <p className="text-xs text-gray-400">{((b.guest as Record<string, unknown>)?.name as string) || "Guest"} · {formatCurrency(Number(b.totalAmount as number))} · {b.status as string}</p>
                      </div>
                      <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${b.status === "confirmed" ? "bg-emerald-50 text-emerald-600" : b.status === "pending" ? "bg-amber-50 text-amber-600" : b.status === "completed" ? "bg-blue-50 text-blue-600" : "bg-red-50 text-red-600"}`}>
                        {b.status as string}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {quickLinks.map((link) => (
              <Link key={link.href} href={link.href} className={`rounded-xl bg-gradient-to-br ${link.color} p-5 text-white shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl`}>
                <h3 className="text-lg font-semibold">{link.label}</h3>
                <p className="mt-1 text-sm text-white/70">Click to manage</p>
              </Link>
            ))}
          </div>
        </>
      ) : null}
    </div>
  )
}
