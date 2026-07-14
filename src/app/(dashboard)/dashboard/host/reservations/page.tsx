"use client"

import { useEffect, useState, useCallback } from "react"
import { motion } from "framer-motion"
import { Tabs, Tab } from "@heroui/react"
import { toast } from "sonner"
import StatusBadge from "@/Components/Booking/StatusBadge"
import ConfirmModal from "@/Components/Dashboard/ConfirmModal"
import { bookingAPI, type BookingItem } from "@/lib/api/Guest/booking-api"

const TABS = ["Pending", "Confirmed", "Completed", "Cancelled"]
const STATUS_MAP: Record<string, string | undefined> = {
  Pending: "pending",
  Confirmed: "confirmed",
  Completed: "completed",
  Cancelled: "cancelled",
}

export default function HostReservationsPage() {
  const [bookings, setBookings] = useState<BookingItem[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState("Pending")
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [actionId, setActionId] = useState<string | null>(null)
  const [actionType, setActionType] = useState<"confirm" | "cancel" | null>(null)
  const [processing, setProcessing] = useState(false)
  const limit = 10

  const fetchReservations = useCallback(async () => {
    setLoading(true)
    try {
      const res = await bookingAPI.getHostReservations({
        page,
        limit,
        status: STATUS_MAP[tab],
      })
      if (res.success && res.data) {
        setBookings(res.data.bookings)
        setTotal(res.data.pagination.total)
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to load reservations")
    } finally {
      setLoading(false)
    }
  }, [page, tab])

  useEffect(() => { fetchReservations() }, [fetchReservations])
  useEffect(() => { setPage(1) }, [tab])

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
        fetchReservations()
      } else {
        toast.error("Action failed")
      }
    } catch (err: any) {
      toast.error(err.message || "Action failed")
    } finally {
      setProcessing(false)
    }
  }

  const totalPages = Math.max(1, Math.ceil(total / limit))

  return (
    <div className="p-6 lg:p-8">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Reservations</h1>
        <p className="mt-1 text-sm text-gray-500">Manage booking requests from guests</p>
      </motion.div>

      <div className="mb-6">
        <Tabs
          selectedKey={tab}
          onSelectionChange={(k) => setTab(String(k))}
        >
          {TABS.map((t) => (
            <Tab key={t} id={t}>{t}</Tab>
          ))}
        </Tabs>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-28 animate-pulse rounded-xl bg-gray-100" />
          ))}
        </div>
      ) : bookings.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <svg className="mb-4 h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-sm font-medium">No reservations found</p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {bookings.map((b) => (
              <motion.div
                key={b._id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm"
              >
                <div className="flex gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gray-100 font-bold text-gray-600">
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
                        "{b.specialRequest}"
                      </p>
                    )}

                    {b.status === "pending" && (
                      <div className="mt-3 flex gap-2">
                        <button
                          onClick={() => { setActionId(b._id); setActionType("confirm") }}
                          className="rounded-lg bg-emerald-600 px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-emerald-700"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => { setActionId(b._id); setActionType("cancel") }}
                          className="rounded-lg border border-red-200 px-4 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-50"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-6 flex justify-center">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page <= 1}
                className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-40"
              >
                Previous
              </button>
              <span className="text-sm text-gray-500">Page {page} of {totalPages}</span>
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
