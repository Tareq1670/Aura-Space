"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import { Star, Edit3, X, PenLine, Sparkles, Quote, MessageSquareText } from "lucide-react"
import ReviewCard from "@/Components/Review/ReviewCard"
import RatingStars from "@/Components/Review/RatingStars"
import ConfirmModal from "@/Components/Dashboard/ConfirmModal"
import { reviewAPI, type ReviewRecord, type PendingBooking } from "@/lib/api/Guest/review-api"
import { createReview, updateReview, deleteReview, reportReview } from "@/lib/actions/review"

const TABS = ["My Reviews", "Pending Reviews"]

const spring = { type: "spring" as const, stiffness: 260, damping: 22 }
const springStagger = { type: "spring" as const, stiffness: 200, damping: 20 }

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: springStagger,
  },
}

export default function GuestReviewsPage() {
  const [tab, setTab] = useState("My Reviews")
  const [reviews, setReviews] = useState<ReviewRecord[]>([])
  const [pending, setPending] = useState<PendingBooking[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [refreshKey, setRefreshKey] = useState(0)
  const limit = 10

  const [showWriteModal, setShowWriteModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editReview, setEditReview] = useState<ReviewRecord | null>(null)
  const [writeBooking, setWriteBooking] = useState<PendingBooking | null>(null)
  const [formRating, setFormRating] = useState(0)
  const [formComment, setFormComment] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const res = await reviewAPI.getMyReviews({ page, limit })
        if (!mounted) return
        setReviews(res.reviews)
        setPending(res.pending)
        setTotal(res.pagination?.total ?? 0)
      } catch (err) {
        if (!mounted) return
        toast.error(err instanceof Error ? err.message : "Failed to load reviews")
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => { mounted = false }
  }, [page, refreshKey])

  const totalPages = Math.max(1, Math.ceil(total / limit))
  const averageRating = reviews.length
    ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
    : 0

  function openWriteModal(booking: PendingBooking) {
    setWriteBooking(booking)
    setFormRating(0)
    setFormComment("")
    setShowWriteModal(true)
  }

  function openEditModal(review: ReviewRecord) {
    setEditReview(review)
    setFormRating(review.rating)
    setFormComment(review.comment)
    setShowEditModal(true)
  }

  async function handleSubmit() {
    if (!formRating || !formComment.trim()) {
      toast.error("Please provide a rating and comment")
      return
    }
    setSubmitting(true)
    try {
      if (showWriteModal && writeBooking) {
        const res = await createReview({
          bookingId: writeBooking._id,
          rating: formRating,
          comment: formComment,
        })
        if (res.success) {
          toast.success("Review submitted")
          setShowWriteModal(false)
          setWriteBooking(null)
          setRefreshKey((k) => k + 1)
        } else {
          toast.error((res as any).message || res.error || "Failed to submit review")
        }
      } else if (showEditModal && editReview) {
        const res = await updateReview(editReview._id, {
          rating: formRating,
          comment: formComment,
        })
        if (res.success) {
          toast.success("Review updated")
          setShowEditModal(false)
          setEditReview(null)
          setRefreshKey((k) => k + 1)
        } else {
          toast.error((res as any).message || res.error || "Failed to update review")
        }
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setSubmitting(false)
    }
  }

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

  async function handleReport(id: string) {
    try {
      const res = await reportReview(id)
      if (res.success) {
        toast.success("Review reported for moderation")
        setRefreshKey((k) => k + 1)
      } else {
        toast.error((res as any).message || res.error || "Failed to report review")
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to report")
    }
  }

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
              <MessageSquareText className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 tracking-tight">My Reviews</h1>
              <p className="mt-0.5 text-sm text-gray-400">
                Manage your reviews and rate your stays
              </p>
            </div>
          </motion.div>

          {/* Stats bar */}
          {reviews.length > 0 && !loading && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...spring, delay: 0.12 }}
              className="mt-6 flex flex-wrap items-center gap-5 rounded-2xl border border-gray-100 bg-white/70 backdrop-blur-sm px-5 py-4 shadow-sm"
            >
              <div className="flex items-center gap-3.5">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ ...spring, delay: 0.25 }}
                  className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50"
                >
                  <Star className="h-5 w-5 text-amber-500" />
                </motion.div>
                <div className="text-right">
                  <motion.p
                    key={averageRating.toFixed(1)}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xl font-bold text-gray-900 tabular-nums leading-none"
                  >
                    {averageRating.toFixed(1)}
                  </motion.p>
                  <p className="text-[11px] text-gray-400 mt-0.5">Average</p>
                </div>
              </div>
              <div className="hidden sm:block h-8 w-px bg-gray-100" />
              <RatingStars rating={averageRating} readonly size="sm" animated />
              <span className="text-sm text-gray-400">
                <span className="font-semibold text-gray-600">{reviews.length}</span>{" "}
                review{reviews.length !== 1 ? "s" : ""}
              </span>
            </motion.div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-6 lg:px-8">
        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="mb-6"
        >
          <div className="inline-flex rounded-xl bg-gray-50 p-1 gap-0.5">
            {TABS.map((t) => (
              <button
                key={t}
                onClick={() => {
                  setTab(t)
                  setPage(1)
                }}
                className={`relative rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ${
                  tab === t
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                {t === "My Reviews" && <Star className="inline h-3.5 w-3.5 mr-1.5 -mt-0.5" />}
                {t === "Pending Reviews" && <Edit3 className="inline h-3.5 w-3.5 mr-1.5 -mt-0.5" />}
                {t}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Content */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="h-36 rounded-2xl bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100 animate-pulse"
              />
            ))}
          </div>
        ) : tab === "My Reviews" ? (
          reviews.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={spring}
              className="flex flex-col items-center justify-center py-24"
            >
              <motion.div
                animate={{
                  y: [0, -8, 0],
                  rotate: [0, -3, 3, 0],
                }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                className="mb-5 flex h-20 w-20 items-center justify-center rounded-2xl bg-gray-50"
              >
                <Quote className="h-9 w-9 text-gray-200" />
              </motion.div>
              <p className="text-base font-semibold text-gray-400">No reviews yet</p>
              <p className="mt-1 text-sm text-gray-300">
                Reviews you write will appear here
              </p>
            </motion.div>
          ) : (
            <>
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-4"
              >
                <AnimatePresence mode="popLayout">
                  {reviews.map((review, i) => (
                    <ReviewCard
                      key={review._id}
                      review={review}
                      index={i}
                      onEdit={(r) => openEditModal(r)}
                      onDelete={(id) => setDeleteId(id)}
                      onReport={handleReport}
                    />
                  ))}
                </AnimatePresence>
              </motion.div>
              {totalPages > 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-8 flex items-center justify-center gap-2"
                >
                  <button
                    disabled={page === 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs font-medium text-gray-500 transition-all hover:border-violet-200 hover:text-violet-600 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`flex h-9 w-9 items-center justify-center rounded-xl text-xs font-medium transition-all ${
                        p === page
                          ? "bg-gradient-to-br from-violet-500 to-indigo-600 text-white shadow-md"
                          : "border border-gray-200 bg-white text-gray-500 hover:border-violet-200 hover:text-violet-600"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                  <button
                    disabled={page === totalPages}
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs font-medium text-gray-500 transition-all hover:border-violet-200 hover:text-violet-600 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </motion.div>
              )}
            </>
          )
        ) : (
          pending.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={spring}
              className="flex flex-col items-center justify-center py-24"
            >
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                className="mb-5 flex h-20 w-20 items-center justify-center rounded-2xl bg-gray-50"
              >
                <PenLine className="h-9 w-9 text-gray-200" />
              </motion.div>
              <p className="text-base font-semibold text-gray-400">No pending reviews</p>
              <p className="mt-1 text-sm text-gray-300">
                Complete a booking to leave a review
              </p>
            </motion.div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-4"
            >
              <AnimatePresence mode="popLayout">
                {pending.map((booking) => (
                  <motion.div
                    key={booking._id}
                    layout
                    variants={itemVariants}
                    exit={{ opacity: 0, y: -12, scale: 0.95 }}
                    whileHover={{
                      y: -2,
                      boxShadow: "0 12px 40px rgba(0,0,0,0.07)",
                    }}
                    className="group relative flex items-center gap-5 overflow-hidden rounded-2xl bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)] transition-shadow duration-300 hover:shadow-lg"
                  >
                    <div className="absolute left-0 top-0 h-full w-[3px] bg-gradient-to-b from-violet-400 to-indigo-500 opacity-40 group-hover:opacity-100 transition-opacity" />
                    <div className="flex w-full items-center gap-4 pl-5 pr-6 py-4">
                      {booking.propertyImage ? (
                        <img
                          src={booking.propertyImage}
                          alt={booking.propertyTitle}
                          className="h-16 w-16 shrink-0 rounded-xl object-cover ring-2 ring-white shadow-sm"
                        />
                      ) : (
                        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-100 to-indigo-100 shadow-sm">
                          <Star className="h-6 w-6 text-violet-400" />
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-gray-900">
                          {booking.propertyTitle}
                        </p>
                        <p className="mt-0.5 text-xs text-gray-400">
                          {new Date(booking.checkIn).toLocaleDateString()} –{" "}
                          {new Date(booking.checkOut).toLocaleDateString()}
                        </p>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => openWriteModal(booking)}
                        className="shrink-0 rounded-xl bg-gradient-to-r from-violet-500 to-indigo-600 px-5 py-2.5 text-xs font-semibold text-white shadow-lg shadow-violet-500/15 transition-all hover:shadow-xl hover:shadow-violet-500/25"
                      >
                        <span className="flex items-center gap-1.5">
                          <PenLine className="h-3.5 w-3.5" />
                          Write Review
                        </span>
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )
        )}
      </div>

      {/* Write / Edit Modal */}
      <AnimatePresence>
        {(showWriteModal || showEditModal) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              setShowWriteModal(false)
              setShowEditModal(false)
            }}
            className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/30 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 24 }}
              transition={{ type: "spring", stiffness: 300, damping: 26 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl"
            >
              {/* Modal header */}
              <div className="relative overflow-hidden bg-gradient-to-r from-violet-500 to-indigo-600 px-6 py-5">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
                <div className="relative flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Sparkles className="h-5 w-5 text-white/80" />
                    <h3 className="text-lg font-semibold text-white">
                      {showWriteModal ? "Write a Review" : "Edit Review"}
                    </h3>
                  </div>
                  <button
                    onClick={() => {
                      setShowWriteModal(false)
                      setShowEditModal(false)
                    }}
                    className="rounded-lg p-1.5 text-white/60 transition-colors hover:bg-white/15 hover:text-white"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                {showWriteModal && writeBooking && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative mt-2 text-sm text-white/70"
                  >
                    Reviewing:{" "}
                    <span className="font-medium text-white">
                      {writeBooking.propertyTitle}
                    </span>
                  </motion.p>
                )}
              </div>

              {/* Modal body */}
              <div className="px-6 py-5">
                <div className="mb-5">
                  <label className="mb-2.5 block text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Rating
                  </label>
                  <div className="inline-block rounded-xl bg-gray-50 px-4 py-3">
                    <RatingStars
                      rating={formRating}
                      onRate={setFormRating}
                      size="lg"
                      animated
                    />
                  </div>
                </div>

                <div className="mb-5">
                  <label className="mb-2.5 block text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Comment
                  </label>
                  <textarea
                    value={formComment}
                    onChange={(e) => setFormComment(e.target.value)}
                    rows={4}
                    placeholder="Share your experience..."
                    className="w-full resize-none rounded-xl border border-gray-200 bg-white p-3.5 text-sm text-gray-700 outline-none placeholder-gray-300 transition-all hover:border-violet-200 focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setShowWriteModal(false)
                      setShowEditModal(false)
                    }}
                    className="flex-1 rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-500 transition-all hover:bg-gray-50 hover:text-gray-700"
                  >
                    Cancel
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSubmit}
                    disabled={submitting || !formRating || !formComment.trim()}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/15 transition-all hover:shadow-xl disabled:opacity-40"
                  >
                    {submitting && (
                      <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                    )}
                    {showWriteModal ? "Submit Review" : "Save Changes"}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
    </div>
  )
}
