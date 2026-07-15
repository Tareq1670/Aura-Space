"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { toast } from "sonner"
import { CalendarDays, Heart, CreditCard, MapPin, ArrowRight } from "lucide-react"
import StatCard from "@/Components/Dashboard/StatCard"
import ChartCard from "@/Components/Dashboard/ChartCard"
import { getGuestDashboard, type GuestDashboardData } from "@/lib/actions/dashboard-guest"
import { formatCurrency } from "@/lib/currency"

const quickLinks = [
  { label: "Browse Spaces", href: "/spaces", color: "from-violet-500 to-purple-600" },
  { label: "My Bookings", href: "/dashboard/guest/bookings", color: "from-blue-500 to-indigo-600" },
  { label: "Wishlist", href: "/dashboard/guest/wishlist", color: "from-rose-500 to-pink-600" },
  { label: "My Reviews", href: "/dashboard/guest/reviews", color: "from-emerald-500 to-teal-600" },
  { label: "Transactions", href: "/dashboard/guest/transactions", color: "from-amber-500 to-orange-600" },
  { label: "Profile", href: "/dashboard/guest/profile", color: "from-cyan-500 to-sky-600" },
]

export default function GuestMainPage() {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<GuestDashboardData | null>(null)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const res = await getGuestDashboard()
        if (!mounted) return
        if (res.success && res.data) {
          setData(res.data)
        } else {
          toast.error(res.message || "Failed to load dashboard")
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
        <h1 className="text-2xl font-bold text-gray-900 lg:text-3xl">Welcome back</h1>
        <p className="mt-1 text-sm text-gray-500">Here&apos;s your stay overview</p>
      </motion.div>

      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 animate-pulse rounded-2xl bg-gray-100" />
          ))}
        </div>
      ) : (
        <>
          {data && (
            <>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard label="Total Bookings" value={data.totalBookings} gradient="from-violet-500 to-indigo-600" prefix="" formatter={(v) => String(v)} icon={<CalendarDays className="h-5 w-5 text-white" />} />
                <StatCard label="Upcoming Trips" value={data.upcomingTrips} gradient="from-emerald-500 to-teal-600" prefix="" formatter={(v) => String(v)} icon={<MapPin className="h-5 w-5 text-white" />} />
                <StatCard label="Wishlist Items" value={data.wishlistCount} gradient="from-rose-500 to-pink-600" prefix="" formatter={(v) => String(v)} icon={<Heart className="h-5 w-5 text-white" />} />
                <StatCard label="Total Spent" value={data.totalSpent} gradient="from-amber-500 to-orange-600" icon={<CreditCard className="h-5 w-5 text-white" />} />
              </div>

              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {data.monthlySpend?.some((d) => d.spend > 0) && (
                  <ChartCard title="Monthly Spending" data={data.monthlySpend as unknown as Record<string, unknown>[]} type="area" dataKey="spend" height={220} gradient />
                )}

                {data.upcomingBookings?.length > 0 && (
                  <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-gray-900">Upcoming Trips</h3>
                      <Link href="/dashboard/guest/bookings" className="text-xs font-medium text-violet-600 hover:text-violet-700">View all</Link>
                    </div>
                    <div className="space-y-3">
                      {(data.upcomingBookings as Record<string, unknown>[]).map((b: Record<string, unknown>) => (
                        <Link key={b._id as string} href="/dashboard/guest/bookings" className="flex items-center gap-3 rounded-xl border border-gray-50 bg-gray-50/50 p-3 transition-colors hover:bg-gray-100">
                          <div className="h-12 w-16 shrink-0 overflow-hidden rounded-lg">
                            <img src={(b.propertyImage as string) || "/placeholder.svg"} alt={b.propertyTitle as string} className="h-full w-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder.svg" }} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-gray-900">{b.propertyTitle as string}</p>
                            <p className="text-xs text-gray-400">{new Date(b.checkIn as string).toLocaleDateString()} – {new Date(b.checkOut as string).toLocaleDateString()}</p>
                          </div>
                          <ArrowRight className="h-4 w-4 shrink-0 text-gray-300" />
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>

              {data.recentTransactions?.length > 0 && (
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-gray-900">Recent Transactions</h3>
                    <Link href="/dashboard/guest/transactions" className="text-xs font-medium text-violet-600 hover:text-violet-700">View all</Link>
                  </div>
                  <div className="space-y-2">
                    {(data.recentTransactions as Record<string, unknown>[]).slice(0, 5).map((t: Record<string, unknown>) => (
                      <div key={t._id as string} className="flex items-center justify-between rounded-lg px-3 py-2 text-sm">
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-medium text-gray-900">{(t.description as string) || (t.type as string)}</p>
                          <p className="text-xs text-gray-400">{new Date(t.createdAt as string).toLocaleDateString()} · {t.type as string}</p>
                        </div>
                        <span className={`ml-3 shrink-0 font-semibold ${t.type === "payment" ? "text-red-500" : "text-emerald-500"}`}>
                          {t.type === "payment" ? "-" : "+"}{formatCurrency(t.amount as number)}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </>
          )}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {quickLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-xl bg-gradient-to-br ${link.color} p-5 text-white shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl`}
              >
                <h3 className="text-lg font-semibold">{link.label}</h3>
                <p className="mt-1 text-sm text-white/70">Click to explore</p>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
