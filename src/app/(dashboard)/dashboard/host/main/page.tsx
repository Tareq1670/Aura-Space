"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { toast } from "sonner"
import { Home, CalendarCheck, DollarSign, TrendingUp, Star, Plus, Bell, ArrowRight } from "lucide-react"
import StatCard from "@/Components/Dashboard/StatCard"
import ChartCard from "@/Components/Dashboard/ChartCard"
import ConfirmModal from "@/Components/Dashboard/ConfirmModal"
import { hostPropertyAPI } from "@/lib/api/Host/host-property-api"
import { bookingAPI, type BookingItem } from "@/lib/api/Guest/booking-api"
import { transactionAPI } from "@/lib/api/Guest/transaction-api"
import { reviewAPI } from "@/lib/api/Guest/review-api"

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

export default function HostMainPage() {
  const [loading, setLoading] = useState(true)

  const [totalProperties, setTotalProperties] = useState(0)
  const [activeBookings, setActiveBookings] = useState(0)
  const [monthIncome, setMonthIncome] = useState(0)
  const [occupancyRate, setOccupancyRate] = useState(0)
  const [averageRating, setAverageRating] = useState(0)
  const [totalReviews, setTotalReviews] = useState(0)

  const [pendingBookings, setPendingBookings] = useState<BookingItem[]>([])
  const [recentReservations, setRecentReservations] = useState<BookingItem[]>([])
  const [topProperty, setTopProperty] = useState<{ title: string; earnings: number; image?: string } | null>(null)
  const [incomeChart, setIncomeChart] = useState<Record<string, unknown>[]>([])

  const [confirmId, setConfirmId] = useState<string | null>(null)
  const [confirming, setConfirming] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)
  useEffect(() => {
    let mounted = true
    ;(async () => {
      setLoading(true)
      try {
        const [propsRes, pendingRes, recentRes, statsRes, reviewRes, hostTransRes] = await Promise.all([
          hostPropertyAPI.getMyProperties({ page: 1, limit: 1 }),
          bookingAPI.getHostReservations({ page: 1, limit: 5, status: "pending" }),
          bookingAPI.getHostReservations({ page: 1, limit: 5 }),
          transactionAPI.getTransactionStats(),
          reviewAPI.getHostReviews({ page: 1, limit: 1 }),
          transactionAPI.getHostTransactions({ page: 1, limit: 100 }),
        ])
        if (!mounted) return

        setTotalProperties(propsRes.data?.pagination?.total || 0)
        setPendingBookings(pendingRes.data?.bookings || [])
        setRecentReservations(recentRes.data?.bookings?.slice(0, 5) || [])

        const activeRes = await bookingAPI.getHostReservations({ page: 1, limit: 1, status: "confirmed" })
        if (mounted) setActiveBookings(activeRes.data?.pagination?.total || 0)

        const payoutsRes = await transactionAPI.getPayoutHistory({ page: 1, limit: 100 })
        if (mounted) {
          const thisMonth = new Date().getMonth()
          const thisYear = new Date().getFullYear()
          let monthlyIncome = 0
          const monthMap: Record<string, number> = {}

          ;(payoutsRes.data?.transactions || [])
            .filter((t) => t.status === "success")
            .forEach((t) => {
              const d = new Date(t.createdAt)
              const key = `${MONTHS[d.getMonth()]} ${d.getFullYear()}`
              monthMap[key] = (monthMap[key] || 0) + t.amount
              if (d.getMonth() === thisMonth && d.getFullYear() === thisYear) {
                monthlyIncome += t.amount
              }
            })

          setMonthIncome(monthlyIncome)

          setIncomeChart(
            MONTHS.map((m) => ({
              name: m,
              income: monthMap[`${m} ${thisYear}`] || 0,
            })),
          )
        }

        if (reviewRes?.stats) {
          setAverageRating(reviewRes.stats.averageRating)
          setTotalReviews(reviewRes.stats.totalReviews)
        }

        const allHostProps = await hostPropertyAPI.getMyProperties({ page: 1, limit: 50 })
        if (mounted && allHostProps.data?.properties) {
          const props = allHostProps.data.properties
          const propertyEarnings: Record<string, { title: string; earnings: number; image?: string }> = {}

          ;(hostTransRes.data?.transactions || [])
            .filter((t) => t.status === "success" && t.description)
            .forEach((t) => {
              const prop = props.find((p) => t.description?.includes(p.title))
              if (prop) {
                propertyEarnings[prop.id] = propertyEarnings[prop.id] || { title: prop.title, earnings: 0, image: prop.images?.[0] }
                propertyEarnings[prop.id].earnings += t.amount
              }
            })

          const sorted = Object.values(propertyEarnings).sort((a, b) => b.earnings - a.earnings)
          if (sorted.length > 0) setTopProperty(sorted[0])
        }

        const totalProps = allHostProps?.data?.properties?.length || 0
        const totalPendings = pendingRes.data?.pagination?.total || 0
        const totalConfirmeds = activeRes?.data?.pagination?.total || 0
        const totalBookedUnits = totalPendings + totalConfirmeds
        setOccupancyRate(totalProps > 0 ? Math.round((totalBookedUnits / totalProps) * 100) : 0)
      } catch {
        if (!mounted) return
        toast.error("Failed to load dashboard data")
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => { mounted = false }
  }, [refreshKey])

  async function handleConfirm(id: string) {
    setConfirming(true)
    try {
      const res = await bookingAPI.confirmBooking(id)
      if (res.success) {
        toast.success("Booking confirmed")
        setConfirmId(null)
        setRefreshKey(k => k + 1)
      } else {
        toast.error("Failed to confirm booking")
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to confirm")
    } finally {
      setConfirming(false)
    }
  }

  return (
    <div className="space-y-8 p-6 lg:p-8">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-gray-900 lg:text-3xl">Host Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">Manage your properties and earnings</p>
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
              label="Total Properties"
              value={totalProperties}
              gradient="from-violet-500 to-indigo-600"
              prefix=""
              formatter={(v) => String(v)}
              icon={<Home className="h-5 w-5 text-white" />}
            />
            <StatCard
              label="Active Bookings"
              value={activeBookings}
              gradient="from-blue-500 to-cyan-600"
              prefix=""
              formatter={(v) => String(v)}
              icon={<CalendarCheck className="h-5 w-5 text-white" />}
            />
            <StatCard
              label="This Month Income"
              value={monthIncome}
              gradient="from-emerald-500 to-teal-600"
              icon={<DollarSign className="h-5 w-5 text-white" />}
            />
            <StatCard
              label="Occupancy Rate"
              value={`${occupancyRate}%`}
              gradient="from-amber-500 to-orange-600"
              prefix=""
              icon={<TrendingUp className="h-5 w-5 text-white" />}
            />
            <StatCard
              label="Average Rating"
              value={averageRating}
              gradient="from-rose-500 to-pink-600"
              prefix=""
              formatter={(v) => v.toFixed(1)}
              icon={<Star className="h-5 w-5 text-white" />}
              trend={{
                label: `${totalReviews} reviews`,
                positive: averageRating >= 4,
              }}
            />
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {incomeChart.some((d) => Number(d.income || 0) > 0) && (
              <ChartCard
                title="Monthly Income"
                data={incomeChart}
                type="bar"
                dataKey="income"
                height={220}
                showTypeSelector
              />
            )}

            {pendingBookings.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border border-amber-100 bg-white p-5 shadow-sm"
              >
                <div className="mb-4 flex items-center gap-2">
                  <Bell className="h-4 w-4 text-amber-500" />
                  <h3 className="text-sm font-semibold text-gray-900">Pending Booking Requests</h3>
                  <span className="ml-auto rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
                    {pendingBookings.length}
                  </span>
                </div>
                <div className="space-y-3">
                  {pendingBookings.map((b) => (
                    <div
                      key={b._id}
                      className="flex items-center gap-3 rounded-xl border border-gray-50 bg-gray-50/50 p-3"
                    >
                      <div className="h-12 w-16 shrink-0 overflow-hidden rounded-lg">
                        <img
                          src={b.propertyImage || "/placeholder.svg"}
                          alt={b.propertyTitle}
                          className="h-full w-full object-cover"
                          onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder.svg" }}
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-gray-900">{b.propertyTitle}</p>
                        <p className="text-xs text-gray-400">
                          {b.guest?.name || "Guest"} · {new Date(b.checkIn).toLocaleDateString()}
                        </p>
                      </div>
                      <button
                        onClick={() => setConfirmId(b._id)}
                        className="shrink-0 rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-emerald-600"
                      >
                        Accept
                      </button>
                    </div>
                  ))}
                  <Link
                    href="/dashboard/host/reservations"
                    className="flex items-center justify-center gap-1 rounded-lg py-2 text-xs font-medium text-violet-600 transition-colors hover:bg-violet-50"
                  >
                    View all requests
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </motion.div>
            )}
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {recentReservations.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
              >
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-gray-900">Recent Reservations</h3>
                  <Link
                    href="/dashboard/host/reservations"
                    className="text-xs font-medium text-violet-600 hover:text-violet-700"
                  >
                    View all
                  </Link>
                </div>
                <div className="space-y-3">
                  {recentReservations.map((b) => (
                    <div
                      key={b._id}
                      className="flex items-center gap-3 rounded-xl border border-gray-50 bg-gray-50/50 p-3"
                    >
                      <div className="h-12 w-16 shrink-0 overflow-hidden rounded-lg">
                        <img
                          src={b.propertyImage || "/placeholder.svg"}
                          alt={b.propertyTitle}
                          className="h-full w-full object-cover"
                          onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder.svg" }}
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-gray-900">{b.propertyTitle}</p>
                        <p className="text-xs text-gray-400">
                          {b.guest?.name || "Guest"} · {new Date(b.checkIn).toLocaleDateString()} – {new Date(b.checkOut).toLocaleDateString()}
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

            {topProperty && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border border-gray-100 bg-gradient-to-br from-violet-50/50 to-indigo-50/50 p-5 shadow-sm"
              >
                <h3 className="mb-4 text-sm font-semibold text-gray-900">Top Earning Property</h3>
                <div className="flex items-center gap-4">
                  <div className="h-16 w-24 shrink-0 overflow-hidden rounded-xl">
                    <img
                      src={topProperty.image || "/placeholder.svg"}
                      alt={topProperty.title}
                      className="h-full w-full object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder.svg" }}
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{topProperty.title}</p>
                    <p className="mt-1 text-2xl font-bold text-emerald-600">
                      ${topProperty.earnings.toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-400">Total earnings</p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          <div className="flex flex-wrap gap-4">
            <Link
              href="/dashboard/host/items/add"
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 to-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/20 transition-all hover:shadow-xl"
            >
              <Plus className="h-4 w-4" />
              Add Property
            </Link>
            <Link
              href="/dashboard/host/reservations"
              className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-700 shadow-sm transition-all hover:border-violet-300 hover:text-violet-600"
            >
              <CalendarCheck className="h-4 w-4" />
              View Requests
            </Link>
            <Link
              href="/dashboard/host/earnings"
              className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-700 shadow-sm transition-all hover:border-violet-300 hover:text-violet-600"
            >
              <DollarSign className="h-4 w-4" />
              View Earnings
            </Link>
          </div>
        </>
      )}

      <ConfirmModal
        isOpen={!!confirmId}
        onClose={() => setConfirmId(null)}
        onConfirm={() => confirmId && handleConfirm(confirmId)}
        title="Accept Booking"
        message="Are you sure you want to accept this booking request?"
        confirmText="Accept"
        variant="info"
        loading={confirming}
      />
    </div>
  )
}
