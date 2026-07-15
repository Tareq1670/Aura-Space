"use client"

import { useEffect, useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Tabs, TabList, Tab, Pagination, Skeleton } from "@heroui/react"
import { toast } from "sonner"
import { Search, Download, Calendar, MessageCircle } from "lucide-react"
import StatusBadge from "@/Components/Booking/StatusBadge"
import ConfirmModal from "@/Components/Dashboard/ConfirmModal"
import { bookingAPI, type BookingItem } from "@/lib/api/Guest/booking-api"
import { startConversation } from "@/lib/actions/message"

const TABS = ["Pending", "Confirmed", "Completed", "Cancelled"]
const STATUS_MAP: Record<string, string | undefined> = {
  Pending: "pending",
  Confirmed: "confirmed",
  Completed: "completed",
  Cancelled: "cancelled",
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 16, filter: "blur(3px)" },
  visible: {
    opacity: 1, y: 0, filter: "blur(0px)",
    transition: { type: "spring" as const, stiffness: 110, damping: 22 },
  },
}

export default function HostReservationsPage() {
  const router = useRouter()
  const [bookings, setBookings] = useState<BookingItem[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState("Pending")
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [actionId, setActionId] = useState<string | null>(null)
  const [actionType, setActionType] = useState<"confirm" | "cancel" | null>(null)
  const [processing, setProcessing] = useState(false)
  const [messaging, setMessaging] = useState<Record<string, boolean>>({})
  const [search, setSearch] = useState("")
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")
  const limit = 10
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const res = await bookingAPI.getHostReservations({
          page, limit,
          status: STATUS_MAP[tab],
        })
        if (!mounted) return
        if (res.success && res.data) {
          setBookings(res.data.bookings)
          setTotal(res.data.pagination.total)
        }
      } catch (err: any) {
        if (!mounted) return
        toast.error(err.message || "Failed to load reservations")
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => { mounted = false }
  }, [page, tab, refreshKey])
  const filtered = useMemo(() => {
    let result = bookings
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter((b) =>
        b.propertyTitle?.toLowerCase().includes(q) ||
        b.guest?.name?.toLowerCase().includes(q)
      )
    }
    if (dateFrom) {
      const from = new Date(dateFrom)
      result = result.filter((b) => new Date(b.checkIn) >= from)
    }
    if (dateTo) {
      const to = new Date(dateTo)
      to.setHours(23, 59, 59, 999)
      result = result.filter((b) => new Date(b.checkOut) <= to)
    }
    return result
  }, [bookings, search, dateFrom, dateTo])

  const totalPages = Math.max(1, Math.ceil(total / limit))

  function handleExportCSV() {
    const headers = ["Guest Name", "Property", "Check-In", "Check-Out", "Guests", "Amount", "Status", "Special Request"]
    const rows = filtered.map((b) => [
      b.guest?.name || "",
      b.propertyTitle || "",
      new Date(b.checkIn).toLocaleDateString(),
      new Date(b.checkOut).toLocaleDateString(),
      String(b.numberOfGuests || ""),
      `$${Number(b.totalAmount).toFixed(2)}`,
      b.status,
      b.specialRequest ? `"${b.specialRequest.replace(/"/g, '""')}"` : "",
    ])
    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n")
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `reservations-${tab.toLowerCase()}.csv`
    a.click()
    URL.revokeObjectURL(url)
    toast.success("CSV exported")
  }

  async function handleContactGuest(booking: BookingItem) {
    const guestId = booking.guest?.id || booking.guestId
    if (!guestId || messaging[booking._id]) return
    setMessaging((prev) => ({ ...prev, [booking._id]: true }))
    try {
      const res = await startConversation(guestId, booking._id, booking.propertyId)
      if (res.success) {
        toast.success("Conversation started with " + (booking.guest?.name || "guest"))
        router.push("/dashboard/host/messages")
      } else {
        toast.error(res.error || "Failed to start conversation")
      }
    } catch {
      toast.error("Something went wrong")
    } finally {
      setMessaging((prev) => ({ ...prev, [booking._id]: false }))
    }
  }

  async function handleAction() {
    if (!actionId || !actionType) return
    setProcessing(true)
    try {
      const res = actionType === "confirm"
        ? await bookingAPI.confirmBooking(actionId)
        : await bookingAPI.cancelBooking(actionId, "Cancelled by host")
      if (res.success) {
        toast.success(actionType === "confirm" ? "Reservation confirmed" : "Reservation cancelled")
        setActionId(null)
        setActionType(null)
        setRefreshKey(k => k + 1)
      } else {
        toast.error("Action failed")
      }
    } catch (err: any) {
      toast.error(err.message || "Action failed")
    } finally {
      setProcessing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-violet-50/40 p-6 lg:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reservations</h1>
          <p className="mt-1 text-sm text-gray-500">Manage booking requests from guests</p>
        </div>
        <button
          onClick={handleExportCSV}
          className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition hover:border-violet-300 hover:text-violet-600 active:scale-[0.97]"
        >
          <Download className="h-4 w-4" />
          Export CSV
        </button>
      </motion.div>

      <div className="mb-6">
        <Tabs
          selectedKey={tab}
          onSelectionChange={(k) => { setTab(String(k)); setPage(1); }}
        >
          <TabList>
            {TABS.map((t) => (
              <Tab key={t} id={t}>{t}</Tab>
            ))}
          </TabList>
        </Tabs>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.06, type: "spring", stiffness: 100, damping: 20 }}
        className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            aria-label="Search by property or guest"
            placeholder="Search by property or guest..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-white py-2 pl-9 pr-4 text-sm text-gray-700 outline-none transition-all placeholder-gray-400 hover:border-violet-300 focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
          />
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-gray-400" />
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 outline-none transition-all hover:border-violet-300 focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
          />
          <span className="text-xs text-gray-400">to</span>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 outline-none transition-all hover:border-violet-300 focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
          />
        </div>
      </motion.div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
          className="flex flex-col items-center justify-center py-20 text-gray-400"
        >
          <svg className="mb-4 h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-sm font-medium text-gray-900">No reservations found</p>
          <p className="mt-1 text-xs text-gray-400">Try adjusting your filters</p>
        </motion.div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-4"
        >
          {filtered.map((b) => (
            <motion.div
              key={b._id}
              variants={cardVariants}
              className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm"
            >
              <div className="flex gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-100 to-indigo-100 font-bold text-violet-700">
                  {b.guest?.name?.charAt(0)?.toUpperCase() || "G"}
                </div>
                <div className="flex flex-1 flex-col">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-900">{b.guest?.name || "Guest"}</span>
                        <StatusBadge status={b.status} />
                      </div>
                      <p className="mt-0.5 text-sm text-gray-500">{b.propertyTitle}</p>
                    </div>
                    <span className="whitespace-nowrap font-semibold text-gray-900">${Number(b.totalAmount).toFixed(2)}</span>
                  </div>

                  <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-600">
                    <span>
                      {new Date(b.checkIn).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      {" — "}
                      {new Date(b.checkOut).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                    <span>{b.numberOfGuests} guest{b.numberOfGuests !== 1 ? "s" : ""}</span>
                  </div>

                  {b.specialRequest && (
                    <p className="mt-2 rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-600 italic">
                      &ldquo;{b.specialRequest}&rdquo;
                    </p>
                  )}

                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => handleContactGuest(b)}
                      disabled={messaging[b._id]}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-violet-200 px-3 py-1.5 text-xs font-semibold text-violet-600 transition hover:bg-violet-50 active:scale-[0.97] disabled:opacity-50"
                    >
                      <MessageCircle className="h-3.5 w-3.5" />
                      {messaging[b._id] ? "..." : "Message"}
                    </button>
                  </div>

                  {b.status === "pending" && (
                    <div className="mt-3 flex gap-2">
                      <button
                        onClick={() => { setActionId(b._id); setActionType("confirm") }}
                        className="rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 px-4 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:from-emerald-600 hover:to-emerald-700 active:scale-[0.97]"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => { setActionId(b._id); setActionType("cancel") }}
                        className="rounded-lg border border-red-200 px-4 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-50 active:scale-[0.97]"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}

          {totalPages > 1 && (
            <div className="flex items-center justify-center pt-2">
              <Pagination>
                <Pagination.Content>
                  <Pagination.Item>
                    <Pagination.Previous
                      isDisabled={page <= 1}
                      onPress={() => setPage(Math.max(1, page - 1))}
                    >
                      <Pagination.PreviousIcon />
                    </Pagination.Previous>
                  </Pagination.Item>
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .slice(Math.max(0, page - 3), page + 2)
                    .map((p) => (
                      <Pagination.Item key={p}>
                        <Pagination.Link isActive={p === page} onPress={() => setPage(p)}>
                          {p}
                        </Pagination.Link>
                      </Pagination.Item>
                    ))}
                  <Pagination.Item>
                    <Pagination.Next
                      isDisabled={page >= totalPages}
                      onPress={() => setPage(Math.min(totalPages, page + 1))}
                    >
                      <Pagination.NextIcon />
                    </Pagination.Next>
                  </Pagination.Item>
                </Pagination.Content>
              </Pagination>
            </div>
          )}
        </motion.div>
      )}

      <ConfirmModal
        isOpen={!!actionId}
        onClose={() => { setActionId(null); setActionType(null) }}
        onConfirm={handleAction}
        title={actionType === "confirm" ? "Confirm Reservation" : "Reject Reservation"}
        message={actionType === "confirm" ? "Confirm this booking request?" : "Reject this booking request?"}
        confirmText={actionType === "confirm" ? "Confirm" : "Reject"}
        variant={actionType === "confirm" ? "info" : "danger"}
        loading={processing}
      />
    </div>
  )
}
