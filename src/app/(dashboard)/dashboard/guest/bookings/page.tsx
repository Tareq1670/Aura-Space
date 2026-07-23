"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import ModalPortal from "@/lib/modal-portal"
import { Tabs, TabList, Tab } from "@heroui/react"
import { toast } from "sonner"
import BookingCard from "@/Components/Booking/BookingCard"
import ConfirmModal from "@/Components/Dashboard/ConfirmModal"
import { bookingAPI, type BookingItem } from "@/lib/api/Guest/booking-api"
import { startConversation } from "@/lib/actions/message"
import { formatCurrency } from "@/lib/currency"

const TABS = ["All", "Upcoming", "Completed", "Cancelled"]
const STATUS_MAP: Record<string, string | undefined> = {
  All: undefined,
  Upcoming: "confirmed",
  Completed: "completed",
  Cancelled: "cancelled",
}

export default function GuestBookingsPage() {
  const router = useRouter()
  const [bookings, setBookings] = useState<BookingItem[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState("All")
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [cancelId, setCancelId] = useState<string | null>(null)
  const [detail, setDetail] = useState<BookingItem | null>(null)
  const [cancelling, setCancelling] = useState(false)
  const [messaging, setMessaging] = useState<string | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)
  const limit = 10

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const res = await bookingAPI.getMyBookings({
          page,
          limit,
          status: STATUS_MAP[tab],
          search: search || undefined,
        })
        if (!mounted) return
        if (res.success && res.data) {
          setBookings(res.data.bookings)
          setTotal(res.data.pagination.total)
        }
      } catch (err: any) {
        if (!mounted) return
        toast.error(err.message || "Failed to load bookings")
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => { mounted = false }
  }, [page, tab, search, refreshKey])
  async function handleContactHost(booking: BookingItem) {
    const hostId = booking.host?.id || booking.hostId
    if (!hostId || messaging) return
    setMessaging(booking._id)
    try {
      const res = await startConversation(hostId, booking._id, booking.propertyId)
      if (res.success) {
        toast.success("Conversation started with host")
        router.push("/dashboard/guest/messages")
      } else {
        toast.error((res as any).message || res.error || "Failed to start conversation")
      }
    } catch {
      toast.error("Something went wrong")
    } finally {
      setMessaging(null)
    }
  }

  async function handleCancel() {
    if (!cancelId) return
    setCancelling(true)
    try {
      const res = await bookingAPI.cancelBooking(cancelId)
      if (res.success) {
        toast.success("Booking cancelled")
        setCancelId(null)
        setRefreshKey(k => k + 1)
      } else {
        toast.error("Failed to cancel booking")
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to cancel")
    } finally {
      setCancelling(false)
    }
  }

  const totalPages = Math.max(1, Math.ceil(total / limit))

  return (
    <div className="p-6 lg:p-8">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Bookings</h1>
        <p className="mt-1 text-sm text-gray-500">View and manage your reservations</p>
      </motion.div>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
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

        <div className="w-full sm:w-64">
          <input
            placeholder="Search by property..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 animate-pulse rounded-xl bg-gray-100" />
          ))}
        </div>
      ) : bookings.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <svg className="mb-4 h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-sm font-medium">No bookings found</p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {bookings.map((b) => (
              <motion.div key={b._id} layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                <div onClick={() => setDetail(b)} className="cursor-pointer">
                  <BookingCard booking={b} onCancel={setCancelId} onMessage={handleContactHost} messageLoading={messaging === b._id} />
                </div>
              </motion.div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-center gap-2">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page <= 1}
                className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-40"
              >
                Previous
              </button>
              <span className="text-sm text-gray-500">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page >= totalPages}
                className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      <ConfirmModal
        isOpen={!!cancelId}
        onClose={() => setCancelId(null)}
        onConfirm={handleCancel}
        title="Cancel Booking"
        message="Are you sure you want to cancel this booking? This action cannot be undone."
        confirmText="Yes, Cancel"
        variant="danger"
        loading={cancelling}
      />

      <ModalPortal>
        <AnimatePresence>
          {detail && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDetail(null)}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4 backdrop-blur-sm"
            >
              <motion.div
                initial={{ scale: 0.95, y: 10 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 10 }}
                onClick={(e) => e.stopPropagation()}
                className="max-w-lg w-full max-h-[85vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-xl"
              >
                <div className="mb-4 flex items-start justify-between">
                  <h2 className="text-lg font-bold text-gray-900">{detail.propertyTitle}</h2>
                  <button onClick={() => setDetail(null)} className="text-gray-400 hover:text-gray-600">&times;</button>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between"><span className="text-gray-500">Status</span><span className="font-semibold capitalize">{detail.status}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Check-in</span><span>{new Date(detail.checkIn).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" })}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Check-out</span><span>{new Date(detail.checkOut).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" })}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Guests</span><span>{detail.numberOfGuests}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Total</span><span className="font-semibold">{formatCurrency(Number(detail.totalAmount))}</span></div>
                  {detail.specialRequest && <div className="border-t pt-3"><span className="text-gray-500">Special request:</span><p className="mt-1 text-gray-700">{detail.specialRequest}</p></div>}
                  {detail.cancellationReason && <div className="border-t pt-3"><span className="text-gray-500">Cancellation reason:</span><p className="mt-1 text-gray-700">{detail.cancellationReason}</p></div>}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </ModalPortal>
    </div>
  )
}
