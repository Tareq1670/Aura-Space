"use client"

import { motion } from "framer-motion"
import RatingStars from "@/Components/Review/RatingStars"
import { Star, MessageSquare, Flag, Edit3, Trash2, Reply, Clock } from "lucide-react"

export interface ReviewItem {
  _id: string
  guestId: string
  hostId: string
  propertyId: string
  bookingId: string
  rating: number
  comment: string
  hostReply?: string
  hostReplyDate?: string
  isReported?: boolean
  createdAt: string
  guest?: { id: string; name: string; image?: string }
  propertyTitle?: string
  propertyImage?: string
}

interface ReviewCardProps {
  review: ReviewItem
  isHost?: boolean
  onEdit?: (review: ReviewItem) => void
  onDelete?: (id: string) => void
  onReply?: (id: string) => void
  onReport?: (id: string) => void
  index?: number
}

const ACCENT_COLORS = [
  "from-violet-500 to-indigo-500",
  "from-amber-400 to-orange-500",
  "from-emerald-400 to-teal-500",
  "from-rose-400 to-pink-500",
  "from-sky-400 to-cyan-500",
  "from-fuchsia-400 to-purple-500",
]

const AVATAR_BGS = [
  "from-violet-100 to-indigo-100",
  "from-amber-100 to-orange-100",
  "from-emerald-100 to-teal-100",
  "from-rose-100 to-pink-100",
  "from-sky-100 to-cyan-100",
  "from-fuchsia-100 to-purple-100",
]

const AVATAR_TXT = [
  "text-violet-600",
  "text-orange-600",
  "text-teal-600",
  "text-pink-600",
  "text-cyan-600",
  "text-purple-600",
]

export default function ReviewCard({
  review,
  isHost = false,
  onEdit,
  onDelete,
  onReply,
  onReport,
  index = 0,
}: ReviewCardProps) {
  const ci = index % ACCENT_COLORS.length
  const accentGrad = ACCENT_COLORS[ci]
  const avatarBg = AVATAR_BGS[ci]
  const avatarTxt = AVATAR_TXT[ci]

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 24, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -16, scale: 0.94 }}
      transition={{
        type: "spring",
        stiffness: 220,
        damping: 24,
        delay: index * 0.05,
      }}
      whileHover={{
        y: -3,
        boxShadow: "0 12px 40px rgba(0,0,0,0.07)",
        transition: { type: "spring", stiffness: 300 },
      }}
      className="group relative overflow-hidden rounded-2xl bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)] transition-shadow duration-300 hover:shadow-lg"
    >
      <div className={`absolute left-0 top-0 h-full w-[3px] bg-gradient-to-b ${accentGrad} opacity-40 group-hover:opacity-100 transition-opacity duration-300`} />

      <div className="pl-5 pr-6 py-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3.5 min-w-0">
            {review.guest?.image ? (
              <img
                src={review.guest.image}
                alt={review.guest.name}
                className="h-10 w-10 shrink-0 rounded-full object-cover ring-2 ring-white shadow-md"
              />
            ) : (
              <motion.div
                whileHover={{ scale: 1.08, rotate: 4 }}
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${avatarBg} shadow-md`}
              >
                <span className={`text-sm font-bold ${avatarTxt}`}>
                  {(review.guest?.name || "G").charAt(0).toUpperCase()}
                </span>
              </motion.div>
            )}
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className="truncate text-sm font-semibold text-gray-900">
                  {review.guest?.name || "Anonymous"}
                </p>
                {!isHost && (
                  <span className="shrink-0 rounded-full bg-violet-50 px-2 py-0.5 text-[10px] font-medium text-violet-600">
                    Guest
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1.5 mt-0.5 text-xs text-gray-400">
                <Clock className="h-3 w-3" />
                <span>
                  {new Date(review.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
            </div>
          </div>
          <RatingStars rating={review.rating} readonly size="sm" animated />
        </div>

        {review.propertyTitle && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.08 }}
            className="mt-3.5 flex items-center gap-2 text-xs text-gray-400"
          >
            <div className="flex h-5 w-5 items-center justify-center rounded-md bg-violet-50">
              <Star className="h-3 w-3 text-violet-400" />
            </div>
            <span className="truncate font-medium text-gray-500">{review.propertyTitle}</span>
          </motion.div>
        )}

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.12 }}
          className="mt-3.5 text-sm leading-[1.7] text-gray-600"
        >
          {review.comment}
        </motion.p>

        {review.hostReply && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ type: "spring", stiffness: 200, damping: 24 }}
            className="mt-4 overflow-hidden"
          >
            <div className="relative rounded-xl border border-emerald-100 bg-gradient-to-br from-emerald-50/60 to-teal-50/40 p-4">
              <div className="absolute left-0 top-0 h-full w-[2px] rounded-l-xl bg-gradient-to-b from-emerald-400 to-teal-400" />
              <div className="pl-3">
                <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
                  <Reply className="h-3 w-3 text-emerald-500" />
                  Host reply
                  {review.hostReplyDate && (
                    <span className="text-gray-400">
                      · {new Date(review.hostReplyDate).toLocaleDateString()}
                    </span>
                  )}
                </div>
                <p className="mt-1.5 text-sm leading-relaxed text-gray-600">{review.hostReply}</p>
              </div>
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.18 }}
          className="mt-4 flex items-center gap-1 border-t border-gray-100 pt-3.5"
        >
          {!isHost && onEdit && (
            <button
              onClick={() => onEdit(review)}
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-gray-400 transition-all hover:bg-violet-50 hover:text-violet-600"
            >
              <Edit3 className="h-3.5 w-3.5" />
              Edit
            </button>
          )}
          {!isHost && onDelete && (
            <button
              onClick={() => onDelete(review._id)}
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-gray-400 transition-all hover:bg-red-50 hover:text-red-500"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete
            </button>
          )}
          {isHost && onReply && (
            <button
              onClick={() => onReply(review._id)}
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-gray-400 transition-all hover:bg-emerald-50 hover:text-emerald-600"
            >
              <MessageSquare className="h-3.5 w-3.5" />
              Reply
            </button>
          )}
          {!isHost && onReport && !review.isReported && (
            <button
              onClick={() => onReport(review._id)}
              className="ml-auto flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-gray-400 transition-all hover:bg-amber-50 hover:text-amber-600"
            >
              <Flag className="h-3.5 w-3.5" />
              Report
            </button>
          )}
          {review.isReported && (
            <motion.span
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="ml-auto flex items-center gap-1.5 rounded-lg bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-600"
            >
              <Flag className="h-3.5 w-3.5" />
              Reported
            </motion.span>
          )}
        </motion.div>
      </div>
    </motion.div>
  )
}
