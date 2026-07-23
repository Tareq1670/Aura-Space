"use client"

import { useEffect, useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import ModalPortal from "@/lib/modal-portal"
import { toast } from "sonner"
import { Flag, Trash2, X, AlertTriangle, Shield, Eye, Download, AlertCircle, RefreshCw } from "lucide-react"
import DataTable from "@/Components/Dashboard/DataTable"
import type { Column } from "@/Components/Dashboard/DataTable"
import ConfirmModal from "@/Components/Dashboard/ConfirmModal"
import RatingStars from "@/Components/Review/RatingStars"
import { reviewAPI, type ReviewRecord } from "@/lib/api/Guest/review-api"
import { deleteReview, dismissReviewReport } from "@/lib/actions/review"
import { exportToCSV } from "@/lib/utils/csv-export"

type ReviewRow = ReviewRecord & Record<string, unknown>

const FILTER_BTN = (active: boolean) =>
  `rounded-lg px-3.5 py-1.5 text-xs font-medium transition-all ${
    active
      ? "bg-gradient-to-r from-violet-500 to-indigo-600 text-white shadow-sm"
      : "bg-gray-50 text-gray-500 hover:bg-gray-100"
  }`

const REPORTED_OPTIONS = [
  { value: "all", label: "All Reviews" },
  { value: "true", label: "Reported Only" },
  { value: "false", label: "Not Reported" },
]

const RATING_OPTIONS = [
  { value: "all", label: "All Ratings" },
  { value: "5", label: "5 Stars" },
  { value: "4", label: "4 Stars" },
  { value: "3", label: "3 Stars" },
  { value: "2", label: "2 Stars" },
  { value: "1", label: "1 Star" },
]

const spring = { type: "spring" as const, stiffness: 260, damping: 22 }

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<ReviewRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [reportedFilter, setReportedFilter] = useState("all")
  const [ratingFilter, setRatingFilter] = useState("all")
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [dismissId, setDismissId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)
  const [detailReview, setDetailReview] = useState<ReviewRecord | null>(null)

  useEffect(() => {
    let mounted = true
    setLoading(true)
    setError(null)
    ;(async () => {
      try {
        const res = await reviewAPI.getAdminReviews({
          reported: reportedFilter !== "all" ? reportedFilter : undefined,
          rating: ratingFilter !== "all" ? Number(ratingFilter) : undefined,
          limit: 100,
        })
        if (!mounted) return
        setReviews(res.reviews)
      } catch (err) {
        if (!mounted) return
        setError(err instanceof Error ? err.message : "Failed to load reviews")
        toast.error(err instanceof Error ? err.message : "Failed to load reviews")
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => {
      mounted = false
    }
  }, [reportedFilter, ratingFilter, refreshKey])

  const reportedReviews = useMemo(() => reviews.filter((r) => r.isReported), [reviews])

  async function handleDelete() {
    if (!deleteId) return
    setDeleting(true)
    try {
      const res = await deleteReview(deleteId)
      if (res.success) {
        toast.success("Review deleted")
        setDeleteId(null)
        setRefreshKey((k) => k + 1)
      } else {
        toast.error((res as any).message || res.error || "Failed to delete review")
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete")
    } finally {
      setDeleting(false)
    }
  }

  async function handleDismiss() {
    if (!dismissId) return
    setDeleting(true)
    try {
      const res = await dismissReviewReport(dismissId)
      if (res.success) {
        toast.success("Report dismissed")
        setDismissId(null)
        setRefreshKey((k) => k + 1)
      } else {
        toast.error((res as any).message || (res as any).error || "Failed to dismiss report")
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to dismiss")
    } finally {
      setDeleting(false)
    }
  }

  const columns: Column<ReviewRow>[] = [
    {
      key: "guest",
      header: "Guest",
      accessor: (r) => r.guest?.name || "Anonymous",
      render: (r, val) => (
        <div className="flex items-center gap-2.5">
          {r.guest?.image ? (
            <img
              src={r.guest.image}
              alt={String(val)}
              className="h-7 w-7 rounded-full object-cover ring-2 ring-white shadow-sm"
            />
          ) : (
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-violet-100 to-indigo-100 text-xs font-bold text-violet-600 shadow-sm">
              {String(val).charAt(0)}
            </div>
          )}
          <span className="truncate text-sm font-medium text-gray-700">{String(val)}</span>
        </div>
      ),
    },
    {
      key: "rating",
      header: "Rating",
      accessor: (r) => r.rating,
      render: (r, val) => <RatingStars rating={Number(val)} readonly size="sm" />,
      width: "120px",
    },
    {
      key: "comment",
      header: "Comment",
      accessor: (r) => r.comment,
      render: (r) => (
        <div className="max-w-xs">
          <p className="truncate text-sm text-gray-500">{r.comment}</p>
        </div>
      ),
    },
    {
      key: "createdAt",
      header: "Date",
      accessor: (r) => r.createdAt,
      render: (r) => (
        <span className="text-xs text-gray-400">
          {new Date(r.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </span>
      ),
      width: "100px",
    },
    {
      key: "isReported",
      header: "Status",
      accessor: (r) => (r.isReported ? "Reported" : "OK"),
      render: (r) =>
        r.isReported ? (
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-600">
            <Flag className="h-3 w-3" />
            Reported
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-600">
            OK
          </span>
        ),
      width: "100px",
    },
    {
      key: "actions",
      header: "Actions",
      accessor: (r) => r._id,
      render: (r) => (
        <div className="flex items-center gap-1.5">
          <button
            onClick={(e) => {
              e.stopPropagation()
              setDetailReview(r)
            }}
            className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium text-violet-600 transition-all hover:bg-violet-50"
          >
            <Eye className="h-3.5 w-3.5" />
            View
          </button>
          {r.isReported && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                setDismissId(r._id)
              }}
              className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium text-emerald-500 transition-all hover:bg-emerald-50"
            >
              <Flag className="h-3.5 w-3.5" />
              Dismiss
            </button>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation()
              setDeleteId(r._id)
            }}
            className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium text-red-500 transition-all hover:bg-red-50"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      ),
      width: "180px",
      sortable: false,
    },
  ]

  const csvExportColumns = [
    { key: "_id" as keyof ReviewRow, label: "ID" },
    { key: "rating" as keyof ReviewRow, label: "Rating" },
    { key: "comment" as keyof ReviewRow, label: "Comment" },
    { key: "isReported" as keyof ReviewRow, label: "Reported" },
    { key: "createdAt" as keyof ReviewRow, label: "Date" },
  ]

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="relative overflow-hidden bg-white border-b border-gray-100">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-50/40 via-transparent to-indigo-50/30" />
        <div className="relative px-6 pt-8 pb-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={spring}
            className="flex items-center gap-4"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-lg shadow-violet-500/15">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 tracking-tight">Reviews Moderation</h1>
              <p className="mt-0.5 text-sm text-gray-400">
                Manage all reviews across the platform
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="px-6 py-6 lg:px-8">
        {/* Reported banner */}
        <AnimatePresence>
          {reportedReviews.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -8, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -8, height: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 22 }}
              className="mb-6 overflow-hidden"
            >
              <div className="rounded-2xl border border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50/50 px-5 py-4">
                <div className="flex items-center gap-3">
                  <motion.div
                    animate={{ rotate: [0, -8, 8, -8, 0] }}
                    transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                  >
                    <AlertTriangle className="h-5 w-5 text-amber-500" />
                  </motion.div>
                  <p className="text-sm text-amber-800">
                    <span className="font-bold">{reportedReviews.length}</span>{" "}
                    review{reportedReviews.length !== 1 ? "s" : ""} flagged for moderation
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
              Filters
            </span>
            <div className="flex flex-wrap gap-1.5">
              {REPORTED_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setReportedFilter(opt.value)}
                  className={FILTER_BTN(reportedFilter === opt.value)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            <div className="hidden sm:block h-5 w-px bg-gray-200" />
            <div className="flex flex-wrap gap-1.5">
              {RATING_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setRatingFilter(opt.value)}
                  className={FILTER_BTN(ratingFilter === opt.value)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() =>
              exportToCSV(reviews as ReviewRow[], csvExportColumns, "reviews-export")
            }
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs font-medium text-gray-500 transition-all hover:border-violet-200 hover:text-violet-600 hover:shadow-sm"
          >
            <Download className="h-3.5 w-3.5" />
            Export CSV
          </motion.button>
        </motion.div>

        {/* Table */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-16 animate-pulse rounded-xl bg-gray-100" />
              ))}
            </div>
          ) : error ? (
            <div className="flex min-h-[40vh] flex-col items-center justify-center text-gray-400">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50">
                <AlertCircle className="h-7 w-7 text-red-400" />
              </div>
              <p className="text-base font-semibold text-gray-900">Failed to load reviews</p>
              <p className="mt-1 text-sm text-gray-400">{error}</p>
              <button onClick={() => setRefreshKey(k => k + 1)} className="mt-5 flex items-center gap-2 rounded-xl bg-gray-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-800">
                <RefreshCw className="h-4 w-4" />
                Try Again
              </button>
            </div>
          ) : (
            <DataTable<ReviewRow>
              data={reviews as ReviewRow[]}
              columns={columns}
              searchPlaceholder="Search comments..."
              searchFields={["comment", "guest"]}
              pageSize={15}
              pageSizeOptions={[10, 15, 25, 50]}
              emptyMessage="No reviews found"
              headerGradient
              onRowClick={(row) => setDetailReview(row)}
            />
          )}
        </motion.div>
      </div>

      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Review"
        message="Are you sure you want to delete this review? This action cannot be undone."
        confirmText="Delete"
        variant="danger"
        loading={deleting}
      />

      <ConfirmModal
        isOpen={!!dismissId}
        onClose={() => setDismissId(null)}
        onConfirm={handleDismiss}
        title="Dismiss Report"
        message="Clear the report flag on this review? The review will remain visible."
        confirmText="Dismiss"
        variant="info"
        loading={deleting}
      />

      {/* Detail Modal */}
      <ModalPortal>
        <AnimatePresence>
          {detailReview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setDetailReview(null)}
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
              <div className="relative overflow-hidden bg-gradient-to-r from-violet-500 to-indigo-600 px-6 py-5 shrink-0">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
                <div className="relative flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Eye className="h-5 w-5 text-white/80" />
                    <h3 className="text-lg font-semibold text-white">Review Details</h3>
                  </div>
                  <button
                    onClick={() => setDetailReview(null)}
                    className="rounded-lg p-1.5 text-white/60 transition-colors hover:bg-white/15 hover:text-white"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="px-6 py-5">
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="mb-5 flex items-center gap-4"
                >
                  {detailReview.guest?.image ? (
                    <img
                      src={detailReview.guest.image}
                      alt={detailReview.guest.name}
                      className="h-12 w-12 shrink-0 rounded-full object-cover ring-2 ring-white shadow-md"
                    />
                  ) : (
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-100 to-indigo-100 text-base font-bold text-violet-600 shadow-md">
                      {(detailReview.guest?.name || "G").charAt(0)}
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {detailReview.guest?.name || "Anonymous"}
                    </p>
                    <div className="mt-1">
                      <RatingStars rating={detailReview.rating} readonly size="sm" animated />
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="mb-5 rounded-xl bg-gray-50 px-4 py-3.5"
                >
                  <p className="text-sm leading-relaxed text-gray-600">
                    {detailReview.comment}
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="rounded-xl border border-gray-100 bg-white px-4 py-3.5"
                >
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span className="font-mono">ID: {detailReview._id.slice(-8)}</span>
                    <span>
                      {new Date(detailReview.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  {detailReview.isReported && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.25 }}
                      className="mt-3 flex items-center gap-2 rounded-lg bg-amber-50 px-3 py-2 text-xs font-medium text-amber-700"
                    >
                      <Flag className="h-3.5 w-3.5" />
                      Reported for moderation
                    </motion.div>
                  )}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mt-5 flex gap-3"
                >
                  <button
                    onClick={() => setDetailReview(null)}
                    className="flex-1 rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-500 transition-all hover:bg-gray-50 hover:text-gray-700"
                  >
                    Close
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setDeleteId(detailReview._id)
                      setDetailReview(null)
                    }}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-500 to-rose-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-red-500/15 transition-all hover:shadow-xl"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </motion.button>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      </ModalPortal>
    </div>
  )
}
