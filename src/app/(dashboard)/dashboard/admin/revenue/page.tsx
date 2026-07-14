"use client"

import { useEffect, useState, useCallback } from "react"
import { motion } from "framer-motion"
import { toast } from "sonner"
import { DollarSign, TrendingUp, Clock, Users } from "lucide-react"
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import StatCard from "@/Components/Dashboard/StatCard"
import { transactionAPI } from "@/lib/api/Guest/transaction-api"

const PIE_COLORS = ["#059669", "#3b82f6", "#f59e0b", "#8b5cf6"]

const categoryData = [
  { name: "Venues", value: 35 },
  { name: "Studios", value: 25 },
  { name: "Outdoor", value: 20 },
  { name: "Other", value: 20 },
]

const topHosts = [
  { name: "Sarah J.", earnings: 12450, properties: 3 },
  { name: "Mike R.", earnings: 9800, properties: 2 },
  { name: "Emily T.", earnings: 7200, properties: 5 },
  { name: "David K.", earnings: 5600, properties: 1 },
  { name: "Lisa M.", earnings: 4100, properties: 4 },
]

const topProperties = [
  { name: "Skyline Loft", earnings: 6200 },
  { name: "Garden Studio", earnings: 4900 },
  { name: "Rooftop Venue", earnings: 3800 },
  { name: "Cozy Cabin", earnings: 3100 },
  { name: "Beach House", earnings: 2800 },
]

export default function AdminRevenuePage() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ totalEarned: 0, commissionEarned: 0, pendingPayouts: 0, totalSpend: 0 })
  const [chartPeriod, setChartPeriod] = useState<"monthly" | "quarterly" | "yearly">("monthly")

  const fetchStats = useCallback(async () => {
    setLoading(true)
    try {
      const res = await transactionAPI.getTransactionStats()
      if (res.success && res.data) setStats(res.data as any)
    } catch (err: any) {
      toast.error(err.message || "Failed to load revenue data")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchStats() }, [fetchStats])

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  const revenueData = months.map((m, i) => ({
    name: m,
    revenue: i < new Date().getMonth() + 1 ? Math.round(stats.commissionEarned * 0.08 * (i + 1)) : 0,
    bookings: i < new Date().getMonth() + 1 ? Math.round(Math.random() * 15 + 5) : 0,
  }))

  if (loading) {
    return (
      <div className="p-6 lg:p-8 space-y-6">
        <div className="h-8 w-48 animate-pulse rounded-lg bg-gray-200" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => <div key={i} className="h-28 animate-pulse rounded-2xl bg-gray-100" />)}
        </div>
        <div className="h-80 animate-pulse rounded-xl bg-gray-100" />
      </div>
    )
  }

  return (
    <div className="p-6 lg:p-8">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Revenue Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">Platform-wide financial overview</p>
      </motion.div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={<DollarSign className="h-5 w-5" />} label="Total Revenue" value={stats.totalSpend} gradient="from-emerald-600 to-emerald-500" />
        <StatCard icon={<TrendingUp className="h-5 w-5" />} label="Commission Earned" value={stats.commissionEarned} gradient="from-blue-600 to-blue-500" />
        <StatCard icon={<Clock className="h-5 w-5" />} label="Pending Payouts" value={stats.pendingPayouts} gradient="from-amber-500 to-orange-500" />
        <StatCard icon={<Users className="h-5 w-5" />} label="Total Revenue (Gross)" value={stats.totalSpend + stats.commissionEarned} gradient="from-purple-600 to-purple-500" />
      </div>

      <div className="mb-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border bg-white p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Revenue Over Time</h2>
            <div className="flex gap-1 rounded-lg border p-0.5">
              {(["monthly", "quarterly", "yearly"] as const).map((p) => (
                <button key={p} onClick={() => setChartPeriod(p)} className={`rounded-md px-3 py-1 text-xs font-medium transition ${chartPeriod === p ? "bg-emerald-600 text-white" : "text-gray-500 hover:text-gray-700"}`}>
                  {p === "monthly" ? "Monthly" : p === "quarterly" ? "Quarterly" : "Yearly"}
                </button>
              ))}
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#9ca3af" />
                <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" tickFormatter={(v) => `$${v}`} />
                <Tooltip formatter={(v: any) => [`$${Number(v || 0).toFixed(2)}`, "Revenue"]} />
                <Line type="monotone" dataKey="revenue" stroke="#059669" strokeWidth={2} dot={{ fill: "#059669", r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Category-wise Revenue</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={categoryData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="value" label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {categoryData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Top Earning Hosts</h2>
          <div className="space-y-3">
            {topHosts.map((h, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700">{i + 1}</span>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{h.name}</p>
                    <p className="text-xs text-gray-500">{h.properties} properties</p>
                  </div>
                </div>
                <span className="text-sm font-semibold text-gray-900">${h.earnings.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Top Earning Properties</h2>
          <div className="space-y-3">
            {topProperties.map((p, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">{i + 1}</span>
                  <p className="text-sm font-medium text-gray-900">{p.name}</p>
                </div>
                <span className="text-sm font-semibold text-gray-900">${p.earnings.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
