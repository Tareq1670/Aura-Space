"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { toast } from "sonner"
import { AlertCircle, RefreshCw } from "lucide-react"
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area, CartesianGrid,
} from "recharts"
import { getHostDashboard, type HostDashboardData } from "@/lib/actions/dashboard-host"
import { formatCurrency } from "@/lib/currency"
import {
  TrendingUp, Building2, CalendarCheck, Star, DollarSign, Users,
} from "lucide-react"

export default function HostAnalyticsPage() {
  const [data, setData] = useState<HostDashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    setError(null)
    ;(async () => {
      try {
        const res = await getHostDashboard()
        if (!mounted) return
        if (res.success && res.data) {
          setData(res.data)
        } else {
          setError(res.message || "Failed to load analytics")
          toast.error(res.message || "Failed to load analytics")
        }
      } catch {
        if (mounted) {
          setError("Failed to load analytics")
          toast.error("Failed to load analytics")
        }
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
        <p className="text-lg font-semibold text-gray-900">Failed to load analytics</p>
        <p className="mt-1 text-sm text-gray-400">{error}</p>
        <button onClick={() => window.location.reload()} className="mt-6 flex items-center gap-2 rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800">
          <RefreshCw className="h-4 w-4" />
          Try Again
        </button>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <div className="h-8 w-48 animate-pulse rounded-lg bg-slate-100" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-28 animate-pulse rounded-2xl bg-slate-100" />
          ))}
        </div>
        <div className="h-80 animate-pulse rounded-2xl bg-slate-100" />
      </div>
    )
  }

  if (!data) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-slate-400">
        No analytics data available
      </div>
    )
  }

  const monthlyData = data.monthlyIncome?.length ? data.monthlyIncome : []

  const stats = [
    { icon: Building2, label: "Properties", value: String(data.totalProperties), color: "text-violet-600", bg: "bg-violet-100" },
    { icon: CalendarCheck, label: "Active Bookings", value: String(data.activeBookings), color: "text-blue-600", bg: "bg-blue-100" },
    { icon: TrendingUp, label: "Occupancy Rate", value: `${Math.round(data.occupancyRate)}%`, color: "text-emerald-600", bg: "bg-emerald-100" },
    { icon: Star, label: "Avg Rating", value: data.averageRating.toFixed(1), color: "text-amber-600", bg: "bg-amber-100" },
    { icon: DollarSign, label: "This Month", value: formatCurrency(data.thisMonthIncome), color: "text-indigo-600", bg: "bg-indigo-100" },
  ]

  return (
    <div className="space-y-8 p-6">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100">
            <TrendingUp className="h-5 w-5 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900">Analytics</h1>
            <p className="text-sm text-slate-500">Track your property performance</p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{stat.label}</p>
                <p className="mt-1 text-2xl font-black text-slate-900">{stat.value}</p>
              </div>
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.bg}`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {monthlyData.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm"
          >
            <div className="mb-6 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-slate-400" />
              <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-400">Monthly Revenue</h2>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyData}>
                  <defs>
                    <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
                  <Tooltip
                    contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}
                    formatter={(value) => [formatCurrency(Number(value)), "Revenue"]}
                  />
                  <Area type="monotone" dataKey="income" stroke="#7c3aed" strokeWidth={2.5} fill="url(#revenueGradient)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm"
        >
          <div className="mb-6 flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-slate-400" />
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-400">Revenue Summary</h2>
          </div>
          <div className="space-y-5">
            <div>
              <p className="text-xs font-semibold text-slate-400">Total Revenue</p>
              <p className="mt-0.5 text-3xl font-black text-slate-900">{formatCurrency(data.totalIncome)}</p>
            </div>
            <div className="h-px bg-slate-100" />
            <div>
              <p className="text-xs font-semibold text-slate-400">This Month</p>
              <p className="mt-0.5 text-2xl font-black text-emerald-600">{formatCurrency(data.thisMonthIncome)}</p>
            </div>
            <div className="h-px bg-slate-100" />
            <div>
              <p className="text-xs font-semibold text-slate-400">Average Rating</p>
              <div className="mt-1 flex items-center gap-2">
                <span className="text-2xl font-black text-slate-900">{data.averageRating.toFixed(1)}</span>
                <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                <span className="text-sm text-slate-400">({data.totalReviews} reviews)</span>
              </div>
            </div>
            <div className="h-px bg-slate-100" />
            <div>
              <p className="text-xs font-semibold text-slate-400">Occupancy Rate</p>
              <div className="mt-2 flex items-center gap-3">
                <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 transition-all duration-700"
                    style={{ width: `${Math.min(data.occupancyRate, 100)}%` }}
                  />
                </div>
                <span className="text-sm font-bold text-slate-700">{Math.round(data.occupancyRate)}%</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm"
      >
        <div className="mb-4 flex items-center gap-2">
          <Users className="h-4 w-4 text-slate-400" />
          <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-400">At a Glance</h2>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: "Total Properties", value: data.totalProperties, color: "text-violet-600" },
            { label: "Active Bookings", value: data.activeBookings, color: "text-blue-600" },
            { label: "Pending Bookings", value: data.pendingBookings?.length || 0, color: "text-amber-600" },
            { label: "Total Reviews", value: data.totalReviews, color: "text-emerald-600" },
          ].map((item) => (
            <div key={item.label} className="rounded-xl bg-slate-50 p-4 text-center">
              <p className={`text-2xl font-black ${item.color}`}>{item.value}</p>
              <p className="mt-1 text-xs font-medium text-slate-500">{item.label}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
