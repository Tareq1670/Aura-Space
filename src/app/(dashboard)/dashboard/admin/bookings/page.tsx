"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Select, ListBox } from "@heroui/react"
import { toast } from "sonner"
import { AlertCircle, Eye, RefreshCw, X, CheckCircle2 } from "lucide-react"
import ModalPortal from "@/lib/modal-portal"
import DataTable from "@/Components/Dashboard/DataTable"
import type { Column } from "@/Components/Dashboard/DataTable"
import StatusBadge from "@/Components/Booking/StatusBadge"
import ConfirmModal from "@/Components/Dashboard/ConfirmModal"
import { bookingAPI, type BookingItem } from "@/lib/api/Guest/booking-api"
import { exportToCSV } from "@/lib/utils/csv-export"
import { formatCurrency } from "@/lib/currency"

type BookingRecord = BookingItem & Record<string, unknown>

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<BookingItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [cancelId, setCancelId] = useState<string | null>(null)
  const [completeId, setCompleteId] = useState<string | null>(null)
  const [processing, setProcessing] = useState(false)
  const [detailBooking, setDetailBooking] = useState<BookingItem | null>(null)

  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    let mounted = true
    setError(null)
    setLoading(true)
    ;(async () => {
      try {
        const res = await bookingAPI.getAdminBookings({
          status: statusFilter !== "all" ? statusFilter : undefined,
          search: search || undefined,
          limit: 100,
        })
        if (!mounted) return
        if (res.success && res.data) {
          setBookings(res.data.bookings)
        } else {
          setError("Failed to load bookings")
          toast.error("Failed to load bookings")
        }
      } catch (err: any) {
        if (!mounted) return
        setError(err.message || "Failed to load bookings")
        toast.error(err.message || "Failed to load bookings")
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => { mounted = false }
  }, [statusFilter, search, refreshKey])

  async function handleForceCancel() {
    if (!cancelId) return
    setProcessing(true)
    try {
      const res = await bookingAPI.forceCancelBooking(cancelId)
      if (res.success) {
        toast.success("Booking force cancelled")
        setCancelId(null)
        setRefreshKey(k => k + 1)
      } else {
        toast.error("Failed to cancel booking")
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to cancel")
    } finally {
      setProcessing(false)
    }
  }

  async function handleComplete() {
    if (!completeId) return
    setProcessing(true)
    try {
      const res = await bookingAPI.completeBooking(completeId)
      if (res.success) {
        toast.success("Booking marked as completed")
        setCompleteId(null)
        setRefreshKey(k => k + 1)
      } else {
        toast.error("Failed to complete booking")
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to complete")
    } finally {
      setProcessing(false)
    }
  }

  const columns: Column<BookingRecord>[] = [
    {
      key: "_id",
      header: "ID",
      accessor: (r) => r._id,
      render: (r, val) => (
        <span className="font-mono text-xs text-gray-400">{String(val).slice(-8)}</span>
      ),
      width: "80px",
    },
    {
      key: "guest",
      header: "Guest",
      accessor: (r) => r.guest?.name || "—",
      render: (r, val) => (
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 text-xs font-bold text-gray-600">
            {(r.guest?.name?.charAt(0) || "?").toUpperCase()}
          </div>
          <span className="text-sm">{r.guest?.name || "—"}</span>
        </div>
      ),
    },
    {
      key: "propertyTitle",
      header: "Property",
      accessor: (r) => r.propertyTitle,
      render: (r) => (
        <div className="text-sm font-medium text-gray-900">{r.propertyTitle}</div>
      ),
    },
    {
      key: "dates",
      header: "Dates",
      accessor: (r) => r.checkIn,
      render: (r) => (
        <span className="text-sm text-gray-600">
          {new Date(r.checkIn).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
          {" — "}
          {new Date(r.checkOut).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
        </span>
      ),
    },
    {
      key: "totalAmount",
      header: "Amount",
      accessor: (r) => r.totalAmount,
      render: (r, val) => (
        <span className="font-semibold text-gray-900">{formatCurrency(Number(val))}</span>
      ),
      align: "right",
      width: "100px",
    },
    {
      key: "status",
      header: "Status",
      accessor: (r) => r.status,
      render: (r, val) => <StatusBadge status={String(val)} />,
      width: "110px",
    },
    {
      key: "actions",
      header: "",
      accessor: (r) => r._id,
      render: (r) => (
        <div className="flex items-center gap-1">
          <button
            onClick={(e) => { e.stopPropagation(); setDetailBooking(r) }}
            className="rounded-lg border border-gray-200 px-2.5 py-1 text-xs font-semibold text-gray-600 transition hover:bg-gray-50"
          >
            <Eye className="h-3.5 w-3.5" />
          </button>
          {r.status === "confirmed" && (
            <button
              onClick={(e) => { e.stopPropagation(); setCompleteId(r._id) }}
              className="rounded-lg border border-emerald-200 px-2.5 py-1 text-xs font-semibold text-emerald-600 transition hover:bg-emerald-50"
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
            </button>
          )}
          <button
            onClick={(e) => { e.stopPropagation(); setCancelId(r._id) }}
            className="rounded-lg border border-red-200 px-2.5 py-1 text-xs font-semibold text-red-600 transition hover:bg-red-50"
          >
            Force Cancel
          </button>
        </div>
      ),
      width: "160px",
    },
  ]

  return (
    <div className="p-6 lg:p-8">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">All Bookings</h1>
            <p className="mt-1 text-sm text-gray-500">Manage all bookings across the platform</p>
          </div>

          <button
            onClick={() => exportToCSV(
              bookings as BookingRecord[],
              [
                { key: "_id", label: "ID" },
                { key: "propertyTitle", label: "Property" },
                { key: "totalAmount", label: "Amount" },
                { key: "status", label: "Status" },
              ],
              "bookings-export",
            )}
            className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
          >
            Export CSV
          </button>
        </div>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="w-full sm:w-64">
            <input
              placeholder="Search by property..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-500"
            />
          </div>
          <div className="w-full sm:w-44">
            <Select
              placeholder="All Status"
              aria-label="Filter by status"
              selectedKey={statusFilter}
              onSelectionChange={(key) => setStatusFilter(String(key))}
            >
              <Select.Trigger className="bg-white border border-gray-200">
                <Select.Value />
                <Select.Indicator />
              </Select.Trigger>
              <Select.Popover>
                <ListBox>
                  <ListBox.Item id="all">All Status<ListBox.ItemIndicator /></ListBox.Item>
                  <ListBox.Item id="pending">Pending<ListBox.ItemIndicator /></ListBox.Item>
                  <ListBox.Item id="confirmed">Confirmed<ListBox.ItemIndicator /></ListBox.Item>
                  <ListBox.Item id="completed">Completed<ListBox.ItemIndicator /></ListBox.Item>
                  <ListBox.Item id="cancelled">Cancelled<ListBox.ItemIndicator /></ListBox.Item>
                </ListBox>
              </Select.Popover>
            </Select>
          </div>
        </div>
      </motion.div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-14 animate-pulse rounded-xl bg-gray-100" />
          ))}
        </div>
      ) : error ? (
        <div className="flex min-h-[40vh] flex-col items-center justify-center text-gray-400">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50">
            <AlertCircle className="h-7 w-7 text-red-400" />
          </div>
          <p className="text-base font-semibold text-gray-900">Failed to load bookings</p>
          <p className="mt-1 text-sm text-gray-400">{error}</p>
          <button onClick={() => setRefreshKey(k => k + 1)} className="mt-5 flex items-center gap-2 rounded-xl bg-gray-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-800">
            <RefreshCw className="h-4 w-4" />
            Try Again
          </button>
        </div>
      ) : (
        <>
          <DataTable
            data={bookings as BookingRecord[]}
            columns={columns}
            searchPlaceholder="Search..."
            emptyMessage="No bookings found"
            pageSize={25}
            pageSizeOptions={[10, 25, 50, 100]}
          />
        </>
      )}

      <ConfirmModal
        isOpen={!!cancelId}
        onClose={() => setCancelId(null)}
        onConfirm={handleForceCancel}
        title="Force Cancel Booking"
        message="This will cancel the booking immediately. The guest will be notified. This action cannot be undone."
        confirmText="Force Cancel"
        variant="danger"
        loading={processing}
      />

      <ConfirmModal
        isOpen={!!completeId}
        onClose={() => setCompleteId(null)}
        onConfirm={handleComplete}
        title="Mark Booking Completed"
        message="Mark this booking as completed? The host will receive their payout according to the platform schedule."
        confirmText="Complete"
        variant="warning"
        loading={processing}
      />

      <ModalPortal>
        <AnimatePresence>
          {detailBooking && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDetailBooking(null)}
              className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/30 backdrop-blur-sm p-4"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.92, y: 24 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.92, y: 24 }}
                transition={{ type: "spring", stiffness: 300, damping: 26 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-2xl bg-white shadow-2xl"
              >
                <div className="relative bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-5 shrink-0">
                  <div className="relative flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Eye className="h-5 w-5 text-white/80" />
                      <h3 className="text-lg font-semibold text-white">Booking Details</h3>
                    </div>
                    <button onClick={() => setDetailBooking(null)} className="rounded-lg p-1.5 text-white/60 transition-colors hover:bg-white/15 hover:text-white">
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                <div className="px-6 py-5 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-sm font-bold text-gray-600">
                      {(detailBooking.guest?.name?.charAt(0) || "?").toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{detailBooking.guest?.name || "—"}</p>
                      <p className="text-xs text-gray-400">Guest</p>
                    </div>
                  </div>

                  <div className="rounded-xl bg-gray-50 p-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Property</span>
                      <span className="font-medium text-gray-900">{detailBooking.propertyTitle}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Check-in</span>
                      <span className="font-medium text-gray-900">{new Date(detailBooking.checkIn).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" })}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Check-out</span>
                      <span className="font-medium text-gray-900">{new Date(detailBooking.checkOut).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" })}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Guests</span>
                      <span className="font-medium text-gray-900">{detailBooking.numberOfGuests}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Total</span>
                      <span className="font-semibold text-gray-900">{formatCurrency(detailBooking.totalAmount)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Platform Fee</span>
                      <span className="font-medium text-gray-900">{formatCurrency(detailBooking.platformFee)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Status</span>
                      <StatusBadge status={detailBooking.status} />
                    </div>
                  </div>

                  {detailBooking.specialRequest && (
                    <div>
                      <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Special Request</p>
                      <p className="text-sm text-gray-700 bg-gray-50 rounded-xl p-3">{detailBooking.specialRequest}</p>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-xs text-gray-400 pt-2">
                    <span className="font-mono">ID: {detailBooking._id.slice(-8)}</span>
                    <span>Created {new Date(detailBooking.createdAt).toLocaleDateString()}</span>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button onClick={() => setDetailBooking(null)} className="flex-1 rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-500 transition-all hover:bg-gray-50">
                      Close
                    </button>
                    {detailBooking.status === "confirmed" && (
                      <button onClick={() => { setCompleteId(detailBooking._id); setDetailBooking(null) }} className="flex-1 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/15 transition-all hover:shadow-xl">
                        Complete
                      </button>
                    )}
                    <button onClick={() => { setCancelId(detailBooking._id); setDetailBooking(null) }} className="flex-1 rounded-xl bg-gradient-to-r from-red-500 to-rose-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-red-500/15 transition-all hover:shadow-xl">
                      Cancel
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </ModalPortal>
    </div>
  )
}
