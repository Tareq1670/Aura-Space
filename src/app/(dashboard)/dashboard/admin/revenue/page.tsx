"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { toast } from "sonner"
import { DollarSign, TrendingUp, Clock, Users, Trophy, Building2, ArrowUp, ArrowDown } from "lucide-react"
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Select, Label, ListBox, Skeleton } from "@heroui/react"
import StatCard from "@/Components/Dashboard/StatCard"
import { getAdminRevenue, type AdminRevenueData } from "@/lib/actions/dashboard-admin"
import { formatCurrency } from "@/lib/currency"

const PIE_COLORS = ["#7c3aed", "#3b82f6", "#f59e0b", "#059669", "#ef4444", "#ec4899"]
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
const PERIOD_OPTIONS = [
  { id: "monthly", label: "Monthly" },
  { id: "quarterly", label: "Quarterly" },
  { id: "yearly", label: "Yearly" },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.05 },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 20, filter: "blur(4px)" },
  visible: {
    opacity: 1, y: 0, filter: "blur(0px)",
    transition: { type: "spring" as const, stiffness: 100, damping: 20 },
  },
}

const listRowVariants = {
  hidden: { opacity: 0, x: -12 },
  visible: (i: number) => ({
    opacity: 1, x: 0,
    transition: { delay: i * 0.05, type: "spring" as const, stiffness: 120, damping: 18 },
  }),
}

export default function AdminRevenuePage() {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<AdminRevenueData | null>(null)
  const [chartPeriod, setChartPeriod] = useState<string>("monthly")

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const res = await getAdminRevenue()
        if (!mounted) return
        if (res.success && res.data) {
          setData(res.data)
        } else {
          toast.error(res.message || "Failed to load revenue data")
        }
      } catch (err: any) {
        if (!mounted) return
        toast.error(err.message || "Failed to load revenue data")
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => { mounted = false }
  }, [])

  const period = chartPeriod || "monthly"

  const displayedData: { name: string; revenue: number; bookings: number }[] = data
    ? period === "yearly"
      ? [{ name: "This Year", revenue: data.revenueByMonth.reduce((s, d) => s + d.revenue, 0), bookings: data.revenueByMonth.reduce((s, d) => s + d.bookings, 0) }]
      : period === "quarterly"
        ? [
            { name: "Q1", revenue: data.revenueByMonth.slice(0, 3).reduce((s, d) => s + d.revenue, 0), bookings: data.revenueByMonth.slice(0, 3).reduce((s, d) => s + d.bookings, 0) },
            { name: "Q2", revenue: data.revenueByMonth.slice(3, 6).reduce((s, d) => s + d.revenue, 0), bookings: data.revenueByMonth.slice(3, 6).reduce((s, d) => s + d.bookings, 0) },
            { name: "Q3", revenue: data.revenueByMonth.slice(6, 9).reduce((s, d) => s + d.revenue, 0), bookings: data.revenueByMonth.slice(6, 9).reduce((s, d) => s + d.bookings, 0) },
            { name: "Q4", revenue: data.revenueByMonth.slice(9, 12).reduce((s, d) => s + d.revenue, 0), bookings: data.revenueByMonth.slice(9, 12).reduce((s, d) => s + d.bookings, 0) },
          ]
        : data.revenueByMonth.map((d) => ({ name: d.month, revenue: d.revenue, bookings: d.bookings }))
    : []

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-violet-50/40 p-6 lg:p-8">
        <div className="mb-6">
          <Skeleton className="mb-2 h-7 w-48 rounded-lg" />
          <Skeleton className="h-4 w-56 rounded-lg" />
        </div>
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-28 rounded-2xl" />)}
        </div>
        <div className="mb-8 grid gap-6 lg:grid-cols-2">
          <Skeleton className="h-80 rounded-2xl" />
          <Skeleton className="h-80 rounded-2xl" />
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <Skeleton className="h-64 rounded-2xl" />
          <Skeleton className="h-64 rounded-2xl" />
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center p-6">
        <p className="text-gray-400">No revenue data available</p>
      </div>
    )
  }

  const { summary } = data

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-violet-50/40 p-6 lg:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="mb-6"
      >
        <h1 className="text-2xl font-bold text-gray-900">Revenue Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">Platform-wide financial overview</p>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        <motion.div variants={cardVariants}>
          <StatCard icon={<DollarSign className="h-5 w-5" />} label="Total Revenue" value={summary.totalRevenue} gradient="from-emerald-600 to-emerald-500" />
        </motion.div>
        <motion.div variants={cardVariants}>
          <StatCard icon={<TrendingUp className="h-5 w-5" />} label="Commission Earned" value={summary.commissionEarned} gradient="from-blue-600 to-blue-500" />
        </motion.div>
        <motion.div variants={cardVariants}>
          <StatCard icon={<Clock className="h-5 w-5" />} label="Pending Payouts" value={summary.pendingPayouts} gradient="from-amber-500 to-orange-500" />
        </motion.div>
        <motion.div variants={cardVariants}>
          <StatCard icon={<DollarSign className="h-5 w-5" />} label="This Month" value={summary.thisMonthRevenue} gradient="from-purple-600 to-purple-500" />
        </motion.div>
      </motion.div>

      <div className="mb-8 grid gap-6 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 80, damping: 18 }}
          className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Revenue Over Time</h2>
            <Select
              className="w-32"
              placeholder="Monthly"
              selectedKey={chartPeriod}
              onSelectionChange={(key) => setChartPeriod((key as string) || "")}
            >
              <Label>Period</Label>
              <Select.Trigger className="min-h-0 h-8">
                <Select.Value />
                <Select.Indicator />
              </Select.Trigger>
              <Select.Popover>
                <ListBox>
                  {PERIOD_OPTIONS.map((opt) => (
                    <ListBox.Item key={opt.id} id={opt.id} textValue={opt.label}>
                      {opt.label}
                      <ListBox.ItemIndicator />
                    </ListBox.Item>
                  ))}
                </ListBox>
              </Select.Popover>
            </Select>
          </div>
          <div className="mb-4 flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1.5">
              {summary.revenueGrowth >= 0 ? (
                <ArrowUp className="h-4 w-4 text-emerald-500" />
              ) : (
                <ArrowDown className="h-4 w-4 text-red-500" />
              )}
              <span className={summary.revenueGrowth >= 0 ? "text-emerald-600 font-semibold" : "text-red-600 font-semibold"}>
                {summary.revenueGrowth >= 0 ? "+" : ""}{summary.revenueGrowth}%
              </span>
              <span className="text-gray-400">vs last month</span>
            </div>
          </div>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.5, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="h-64 origin-left"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={displayedData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#9ca3af" />
                <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" tickFormatter={(v) => formatCurrency(v)} />
                <Tooltip formatter={(v: any) => [formatCurrency(Number(v || 0)), "Revenue"]} />
                <Line type="monotone" dataKey="revenue" stroke="#7c3aed" strokeWidth={2} dot={{ fill: "#7c3aed", r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.28, type: "spring", stiffness: 80, damping: 18 }}
          className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
        >
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Revenue by Category</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: "Bookings", value: summary.totalRevenue },
                    { name: "Commission", value: summary.commissionEarned },
                    { name: "Pending Payouts", value: summary.pendingPayouts },
                    { name: "Net Revenue", value: Math.max(0, summary.netRevenue) },
                  ]}
                  cx="50%" cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  dataKey="value"
                  label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {PIE_COLORS.slice(0, 4).map((c, i) => <Cell key={i} fill={c} />)}
                </Pie>
                <Tooltip formatter={(v: any) => [formatCurrency(Number(v || 0)), "Amount"]} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="grid gap-6 lg:grid-cols-2"
      >
        <motion.div variants={cardVariants} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <Trophy className="h-5 w-5 text-amber-500" />
            <h2 className="text-lg font-semibold text-gray-900">Top Earning Hosts</h2>
          </div>
          <div className="space-y-3">
            {data.topHosts.length === 0 ? (
              <p className="py-6 text-center text-sm text-gray-400">No host data available</p>
            ) : (
              data.topHosts.map((h, i) => (
                <motion.div
                  key={h.userId}
                  custom={i}
                  variants={listRowVariants}
                  initial="hidden"
                  animate="visible"
                  className="flex items-center justify-between rounded-xl bg-gray-50 p-3 transition-colors hover:bg-violet-50/50"
                >
                  <div className="flex items-center gap-3">
                    <span className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                      i === 0 ? "bg-amber-100 text-amber-700" :
                      i === 1 ? "bg-gray-200 text-gray-600" :
                      i === 2 ? "bg-orange-100 text-orange-700" :
                      "bg-violet-100 text-violet-700"
                    }`}>{i + 1}</span>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{h.name}</p>
                      <p className="text-xs text-gray-500">{h.count} transactions</p>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">{formatCurrency(h.earnings)}</span>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>

        <motion.div variants={cardVariants} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <Building2 className="h-5 w-5 text-violet-500" />
            <h2 className="text-lg font-semibold text-gray-900">Top Earning Properties</h2>
          </div>
          <div className="space-y-3">
            {data.topProperties.length === 0 ? (
              <p className="py-6 text-center text-sm text-gray-400">No property data available</p>
            ) : (
              data.topProperties.map((p, i) => (
                <motion.div
                  key={p.name}
                  custom={i}
                  variants={listRowVariants}
                  initial="hidden"
                  animate="visible"
                  className="flex items-center justify-between rounded-xl bg-gray-50 p-3 transition-colors hover:bg-violet-50/50"
                >
                  <div className="flex items-center gap-3">
                    <span className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                      i === 0 ? "bg-amber-100 text-amber-700" :
                      i === 1 ? "bg-gray-200 text-gray-600" :
                      i === 2 ? "bg-orange-100 text-orange-700" :
                      "bg-blue-100 text-blue-700"
                    }`}>{i + 1}</span>
                    <p className="text-sm font-medium text-gray-900">{p.name}</p>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">{formatCurrency(p.earnings)}</span>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
