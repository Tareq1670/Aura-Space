"use client"

import { useEffect, useState, useCallback } from "react"
import { motion } from "framer-motion"
import { toast } from "sonner"
import { Flag, Trash2, XCircle, Search, RefreshCw } from "lucide-react"
import ConfirmModal from "@/Components/Dashboard/ConfirmModal"
import { reviewAPI, type ReviewRecord } from "@/lib/api/Guest/review-api"
import { deleteReview, dismissReviewReport } from "@/lib/actions/review"

export default function AdminReportsPage() {
  const [reviews, setReviews] = useState<ReviewRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [actionReview, setActionReview] = useState<ReviewRecord | null>(null)
  const [actionType, setActionType] = useState<"delete" | "dismiss" | null>(null)
  const [actionLoading, setActionLoading] = useState(false)

  const fetchReported = useCallback(async () => {
    setLoading(true)
    try {
      const res = await reviewAPI.getAdminReviews({ reported: "true", limit: 50 })
      if (res) {
        setReviews(res.reviews)
      } else {
        toast.error("Failed to load reported reviews")
      }
    } catch {
      toast.error("Failed to load reported reviews")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchReported() }, [fetchReported])

  const filtered = search.trim()
    ? reviews.filter((r) =>
        [r.comment, r.propertyTitle, r.guest?.name].some((f) =>
          f?.toLowerCase().includes(search.toLowerCase()),
        ),
      )
    : reviews

  async function handleAction() {
    if (!actionReview || !actionType) return
    setActionLoading(true)
    try {
      const res = actionType === "delete"
        ? await deleteReview(actionReview._id)
        : await dismissReviewReport(actionReview._id)

      if (res.success) {
        toast.success(actionType === "delete" ? "Review deleted" : "Report dismissed")
        setReviews((prev) =>
          actionType === "delete"
            ? prev.filter((r) => r._id !== actionReview._id)
            : prev.map((r) => (r._id === actionReview._id ? { ...r, isReported: false } : r)),
        )
      } else {
        toast.error((res as any).error || (res as any).message || "Action failed")
      }
    } catch {
      toast.error("Something went wrong")
    } finally {
      setActionLoading(false)
      setActionReview(null)
      setActionType(null)
    }
  }

  return (
    <div className="space-y-6 p-6">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-100">
              <Flag className="h-5 w-5 text-rose-600" />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900">Reported Content</h1>
              <p className="text-sm text-slate-500">{reviews.length} reported review{reviews.length !== 1 ? "s" : ""}</p>
            </div>
          </div>
          <button
            onClick={fetchReported}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-600 transition hover:border-rose-300 hover:text-rose-600"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Refresh
          </button>
        </div>
      </motion.div>

      <div className="relative max-w-xs">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search reviews..."
          className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition-all focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
        />
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 animate-pulse rounded-xl bg-slate-100" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-100 bg-white py-20">
          <Flag className="h-10 w-10 text-slate-300" />
          <p className="mt-3 text-sm font-medium text-slate-500">
            {search ? "No reviews match your search" : "No reported reviews"}
          </p>
          <p className="mt-1 text-xs text-slate-400">All clear — nothing needs moderation</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((review, i) => (
            <motion.div
              key={review._id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-rose-100 text-sm font-bold text-rose-600">
                      {review.guest?.image ? (
                        <img src={review.guest.image} alt={review.guest.name} className="h-full w-full object-cover" />
                      ) : (
                        review.guest?.name?.charAt(0)?.toUpperCase() || "G"
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-slate-900">{review.guest?.name || "Unknown"}</p>
                      <p className="truncate text-xs text-slate-500">{review.propertyTitle || "Unknown property"}</p>
                    </div>
                    <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-rose-600">
                      <Flag className="h-3 w-3" />
                      Reported
                    </span>
                  </div>

                  <div className="mt-3 flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg
                        key={star}
                        className={`h-4 w-4 ${star <= review.rating ? "fill-amber-400 text-amber-400" : "fill-slate-200 text-slate-200"}`}
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                    <span className="text-xs text-slate-400">{new Date(review.createdAt).toLocaleDateString()}</span>
                  </div>

                  <p className="mt-2 text-sm leading-relaxed text-slate-700">{review.comment}</p>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2 border-t border-slate-50 pt-3">
                {review.isReported && (
                  <button
                    onClick={() => { setActionReview(review); setActionType("dismiss") }}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 px-3 py-1.5 text-xs font-semibold text-emerald-600 transition hover:bg-emerald-50"
                  >
                    <XCircle className="h-3.5 w-3.5" />
                    Dismiss Report
                  </button>
                )}
                <button
                  onClick={() => { setActionReview(review); setActionType("delete") }}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-50"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete Review
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <ConfirmModal
        isOpen={!!actionReview && !!actionType}
        onClose={() => { setActionReview(null); setActionType(null) }}
        onConfirm={handleAction}
        title={actionType === "delete" ? "Delete Review" : "Dismiss Report"}
        message={
          actionType === "delete"
            ? `Permanently delete this review by ${actionReview?.guest?.name || "this guest"}? This cannot be undone.`
            : `Clear the report flag on this review? The review will remain visible.`
        }
        confirmText={actionType === "delete" ? "Delete" : "Dismiss"}
        variant={actionType === "delete" ? "danger" : "info"}
        loading={actionLoading}
      />
    </div>
  )
}
