"use client"

import { useEffect, useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import { Star, MessageSquare, TrendingUp, X, Reply, Sparkles, BarChart3, LineChart } from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart as ReLineChart,
  Line,
} from "recharts"
import ReviewCard from "@/Components/Review/ReviewCard"
import StatCard from "@/Components/Dashboard/StatCard"
import { reviewAPI, type ReviewRecord, type ReviewStats } from "@/lib/api/Guest/review-api"
import { replyToReview } from "@/lib/actions/review"

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

const RATING_OPTIONS = [
  { value: "all", label: "All Ratings" },
  { value: "5", label: "5 Stars" },
  { value: "4", label: "4 Stars" },
  { value: "3", label: "3 Stars" },
  { value: "2", label: "2 Stars" },
  { value: "1", label: "1 Star" },
]

const spring = { type: "spring" as const, stiffness: 260, damping: 22 }

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
}

export default function HostReviewsPage() {
  const [reviews, setReviews] = useState<ReviewRecord[]>([])
  const [stats, setStats] = useState<ReviewStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [ratingFilter, setRatingFilter] = useState("all")
  const [refreshKey, setRefreshKey] = useState(0)
  const limit = 10

  const [replyId, setReplyId] = useState<string | null>(null)
  const [replyText, setReplyText] = useState("")
  const [replying, setReplying] = useState(false)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const res = await reviewAPI.getHostReviews({
          page,
          limit,
          rating: ratingFilter !== "all" ? Number(ratingFilter) : undefined,
        })
        if (!mounted) return
        setReviews(res.reviews)
        setStats(res.stats)
        setTotal(res.pagination?.total ?? 0)
      } catch (err) {
        if (!mounted) return
        toast.error(err instanceof Error ? err.message : "Failed to load reviews")
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => {
      mounted = false
    }
  }, [page, ratingFilter, refreshKey])

  const totalPages = Math.max(1, Math.ceil(total / limit))

  const breakdownChart = useMemo(() => {
    if (!stats) return []
    return [5, 4, 3, 2, 1].map((star) => ({
      name: `${star}`,
      label: `${star} Star${star !== 1 ? "s" : ""}`,
      count: stats.breakdown[String(star)] || 0,
    }))
  }, [stats])

  const trendChart = useMemo(() => {
    const monthMap: Record<number, number> = {}
    const now = new Date()
    reviews.forEach((r) => {
      const d = new Date(r.createdAt)
      if (d.getFullYear() === now.getFullYear()) {
        monthMap[d.getMonth()] = (monthMap[d.getMonth()] || 0) + 1
      }
    })
    return MONTHS.map((name, i) => ({
      name,
      reviews: monthMap[i] || 0,
    }))
  }, [reviews])

  async function handleReply(id: string) {
    if (!replyText.trim()) {
      toast.error("Please enter a reply")
      return
    }
    setReplying(true)
    try {
      const res = await replyToReview(id, replyText)
      if (res.success) {
        toast.success("Reply posted")
        setReplyId(null)
        setReplyText("")
        setRefreshKey((k) => k + 1)
      } else {
        toast.error(res.error || "Failed to post reply")
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to reply")
    } finally {
      setReplying(false)
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
              <MessageSquare className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 tracking-tight">Guest Reviews</h1>
              <p className="mt-0.5 text-sm text-gray-400">
                See what guests are saying about your properties
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="px-6 py-6 lg:px-8">
        {/* Stats */}
        {stats && (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.08 } },
            }}
            className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3"
          >
            {[
              {
                label: "Average Rating",
                value: stats.averageRating,
                gradient: "from-amber-500 to-orange-600",
                formatter: (v: number) => v.toFixed(1),
                icon: <Star className="h-5 w-5 text-white" />,
              },
              {
                label: "Total Reviews",
                value: stats.totalReviews,
                gradient: "from-violet-500 to-indigo-600",
                formatter: (v: number) => String(v),
                icon: <MessageSquare className="h-5 w-5 text-white" />,
              },
              {
                label: "Rating Trend",
                value:
                  stats.averageRating >= 4
                    ? "Excellent"
                    : stats.averageRating >= 3
                      ? "Good"
                      : "Needs Improvement",
                gradient: "from-emerald-500 to-teal-600",
                trend: {
                  label: `${stats.totalReviews} total reviews`,
                  positive: stats.averageRating >= 4,
                },
                icon: <TrendingUp className="h-5 w-5 text-white" />,
              },
            ].map((card) => (
              <motion.div
                key={card.label}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { type: "spring", stiffness: 180, damping: 20 },
                  },
                }}
              >
                <StatCard {...card} prefix="" />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Charts */}
        <div className="mb-6 grid grid-cols-1 gap-5 lg:grid-cols-2">
          {breakdownChart.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...spring, delay: 0.15 }}
              className="rounded-2xl border border-gray-100 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-50">
                  <BarChart3 className="h-4 w-4 text-amber-500" />
                </div>
                <h3 className="text-sm font-semibold text-gray-900">Rating Breakdown</h3>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={breakdownChart} layout="vertical" margin={{ left: 0, right: 20, top: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                  <YAxis
                    dataKey="label"
                    type="category"
                    tick={{ fontSize: 11, fill: "#9ca3af" }}
                    width={70}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 10,
                      border: "1px solid #f0f0f0",
                      fontSize: 12,
                      boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
                    }}
                    formatter={(value: number) => [value, "Reviews"]}
                  />
                  <Bar dataKey="count" fill="#8b5cf6" radius={[0, 6, 6, 0]} animationBegin={300} animationDuration={800} />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>
          )}

          {trendChart.some((d) => d.reviews > 0) && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...spring, delay: 0.25 }}
              className="rounded-2xl border border-gray-100 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-50">
                  <LineChart className="h-4 w-4 text-violet-500" />
                </div>
                <h3 className="text-sm font-semibold text-gray-900">Review Trend</h3>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <ReLineChart data={trendChart} margin={{ left: 0, right: 20, top: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} allowDecimals={false} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 10,
                      border: "1px solid #f0f0f0",
                      fontSize: 12,
                      boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
                    }}
                    formatter={(value: number) => [value, "Reviews"]}
                  />
                  <Line
                    type="monotone"
                    dataKey="reviews"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    dot={{ fill: "#8b5cf6", r: 3, strokeWidth: 0 }}
                    activeDot={{ r: 5, fill: "#8b5cf6", stroke: "white", strokeWidth: 2 }}
                    animationBegin={500}
                    animationDuration={1000}
                  />
                </ReLineChart>
              </ResponsiveContainer>
            </motion.div>
          )}
        </div>

        {/* Filter bar */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Filter</span>
            <div className="flex flex-wrap gap-1.5">
              {RATING_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => {
                    setRatingFilter(opt.value)
                    setPage(1)
                  }}
                  className={`rounded-lg px-3.5 py-1.5 text-xs font-medium transition-all ${
                    ratingFilter === opt.value
                      ? "bg-gradient-to-r from-violet-500 to-indigo-600 text-white shadow-sm"
                      : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
          {stats && (
            <p className="text-xs text-gray-400">
              Showing <span className="font-medium text-gray-600">{reviews.length}</span> of{" "}
              <span className="font-medium text-gray-600">{total}</span>
            </p>
          )}
        </motion.div>

        {/* Reviews */}
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
        ) : reviews.length === 0 ? (
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
              <MessageSquare className="h-9 w-9 text-gray-200" />
            </motion.div>
            <p className="text-base font-semibold text-gray-400">No reviews yet</p>
            <p className="mt-1 text-sm text-gray-300">Guest reviews will appear here</p>
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
                    isHost
                    index={i}
                    onReply={(id) => {
                      setReplyId(id)
                      setReplyText(review.hostReply || "")
                    }}
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
        )}
      </div>

      {/* Reply Modal */}
      <AnimatePresence>
        {replyId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setReplyId(null)}
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
              <div className="relative overflow-hidden bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-5">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
                <div className="relative flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Reply className="h-5 w-5 text-white/80" />
                    <h3 className="text-lg font-semibold text-white">Reply to Review</h3>
                  </div>
                  <button
                    onClick={() => setReplyId(null)}
                    className="rounded-lg p-1.5 text-white/60 transition-colors hover:bg-white/15 hover:text-white"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="px-6 py-5">
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  rows={4}
                  placeholder="Write your reply..."
                  className="mb-5 w-full resize-none rounded-xl border border-gray-200 bg-white p-3.5 text-sm text-gray-700 outline-none placeholder-gray-300 transition-all hover:border-emerald-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                />

                <div className="flex gap-3">
                  <button
                    onClick={() => setReplyId(null)}
                    className="flex-1 rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-500 transition-all hover:bg-gray-50 hover:text-gray-700"
                  >
                    Cancel
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleReply(replyId)}
                    disabled={replying || !replyText.trim()}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/15 transition-all hover:shadow-xl disabled:opacity-40"
                  >
                    {replying && (
                      <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                    )}
                    <Sparkles className="h-4 w-4" />
                    Post Reply
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
