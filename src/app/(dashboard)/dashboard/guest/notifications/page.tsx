"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { toast } from "sonner"
import { Bell, Calendar, MessageCircle, Star, RefreshCw, ExternalLink } from "lucide-react"
import { bookingAPI, type BookingItem } from "@/lib/api/Guest/booking-api"
import { reviewAPI, type ReviewRecord } from "@/lib/api/Guest/review-api"
import { getUnreadCount } from "@/lib/actions/message"
import { formatCurrency } from "@/lib/currency"

interface Notification {
  id: string
  type: "booking" | "review" | "message"
  title: string
  description: string
  time: string
  href: string
  icon: React.ReactNode
  color: string
}

export default function GuestNotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [unread, setUnread] = useState(0)

  useEffect(() => {
    let mounted = true
    async function fetchAll() {
      try {
        const [bookingRes, reviewRes, unreadRes] = await Promise.all([
          bookingAPI.getMyBookings({ limit: 10 }),
          reviewAPI.getMyReviews({ limit: 10 }),
          getUnreadCount(),
        ])

        if (!mounted) return
        const items: Notification[] = []

        if (bookingRes.success && bookingRes.data) {
          for (const b of bookingRes.data.bookings) {
            const iconMap: Record<string, React.ReactNode> = {
              pending: <Calendar className="h-4 w-4" />,
              confirmed: <Calendar className="h-4 w-4" />,
              completed: <Calendar className="h-4 w-4" />,
              cancelled: <Calendar className="h-4 w-4" />,
            }
            const titleMap: Record<string, string> = {
              pending: "Booking Request Pending",
              confirmed: "Booking Confirmed",
              completed: "Stay Completed",
              cancelled: "Booking Cancelled",
            }
            items.push({
              id: `booking-${b._id}`,
              type: "booking",
              title: titleMap[b.status] || `Booking ${b.status}`,
              description: `${b.propertyTitle} — ${formatCurrency(Number(b.totalAmount))}`,
              time: new Date(b.createdAt).toISOString(),
              href: "/dashboard/guest/bookings",
              icon: iconMap[b.status] || <Calendar className="h-4 w-4" />,
              color:
                b.status === "cancelled" ? "text-red-500 bg-red-100" :
                b.status === "confirmed" ? "text-emerald-500 bg-emerald-100" :
                b.status === "completed" ? "text-blue-500 bg-blue-100" :
                "text-amber-500 bg-amber-100",
            })
          }
        }

        if (reviewRes?.reviews) {
          for (const r of reviewRes.reviews as ReviewRecord[]) {
            items.push({
              id: `review-${r._id}`,
              type: "review",
              title: "Review Submitted",
              description: `You reviewed ${r.propertyTitle || "a property"} — ${r.rating}/5 stars`,
              time: r.createdAt,
              href: "/dashboard/guest/reviews",
              icon: <Star className="h-4 w-4" />,
              color: "text-amber-500 bg-amber-100",
            })
          }
        }

        if (unreadRes.success && unreadRes.data) {
          const count = typeof unreadRes.data === "object"
            ? Number((unreadRes.data as Record<string, unknown>).unreadCount ?? 0)
            : Number(unreadRes.data) || 0
          setUnread(count)
          if (count > 0) {
            items.push({
              id: "unread-messages",
              type: "message",
              title: "Unread Messages",
              description: `You have ${count} unread message${count !== 1 ? "s" : ""}`,
              time: new Date().toISOString(),
              href: "/dashboard/guest/messages",
              icon: <MessageCircle className="h-4 w-4" />,
              color: "text-violet-500 bg-violet-100",
            })
          }
        }

        items.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
        setNotifications(items)
      } catch {
        if (mounted) toast.error("Failed to load notifications")
      } finally {
        if (mounted) setLoading(false)
      }
    }

    fetchAll()
    const interval = setInterval(fetchAll, 30000)
    return () => { mounted = false; clearInterval(interval) }
  }, [])

  return (
    <div className="space-y-6 p-6">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100">
              <Bell className="h-5 w-5 text-violet-600" />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900">Notifications</h1>
              <p className="text-sm text-slate-500">
                {notifications.length} notification{notifications.length !== 1 ? "s" : ""}
                {unread > 0 && ` · ${unread} unread`}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-20 animate-pulse rounded-xl bg-slate-100" />
          ))}
        </div>
      ) : notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-100 bg-white py-20">
          <Bell className="h-10 w-10 text-slate-300" />
          <p className="mt-3 text-sm font-medium text-slate-500">No notifications yet</p>
          <p className="mt-1 text-xs text-slate-400">When you book a property or receive messages, they&apos;ll appear here</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((n, i) => (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.03 }}
            >
              <Link
                href={n.href}
                className="flex items-start gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition-all hover:border-violet-200 hover:shadow-md"
              >
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${n.color}`}>
                  {n.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-slate-900">{n.title}</p>
                  <p className="mt-0.5 text-sm text-slate-500 line-clamp-1">{n.description}</p>
                  <p className="mt-1 text-[10px] font-medium text-slate-400">
                    {new Date(n.time).toLocaleDateString("en-US", {
                      month: "short", day: "numeric",
                      hour: "numeric", minute: "2-digit",
                    })}
                  </p>
                </div>
                <ExternalLink className="mt-1 h-4 w-4 shrink-0 text-slate-300" />
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
