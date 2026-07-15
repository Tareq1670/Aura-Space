"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Select, ListBox } from "@heroui/react"
import { toast } from "sonner"
import DataTable from "@/Components/Dashboard/DataTable"
import type { Column } from "@/Components/Dashboard/DataTable"
import StatusBadge from "@/Components/Booking/StatusBadge"
import ConfirmModal from "@/Components/Dashboard/ConfirmModal"
import { bookingAPI, type BookingItem } from "@/lib/api/Guest/booking-api"
import { exportToCSV } from "@/lib/utils/csv-export"

type BookingRecord = BookingItem & Record<string, unknown>

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<BookingItem[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [cancelId, setCancelId] = useState<string | null>(null)
  const [processing, setProcessing] = useState(false)

  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    let mounted = true
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
        }
      } catch (err: any) {
        if (!mounted) return
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
        <span className="font-semibold text-gray-900">${Number(val).toFixed(2)}</span>
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
        <button
          onClick={() => setCancelId(r._id)}
          className="rounded-lg border border-red-200 px-3 py-1 text-xs font-semibold text-red-600 transition hover:bg-red-50"
        >
          Force Cancel
        </button>
      ),
      width: "120px",
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

      <DataTable
        data={bookings as BookingRecord[]}
        columns={columns}
        searchPlaceholder="Search..."
        emptyMessage="No bookings found"
        pageSize={25}
        pageSizeOptions={[10, 25, 50, 100]}
      />

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
    </div>
  )
}
