"use client"

import { useState } from "react"
import { motion } from "framer-motion"

interface RatingStarsProps {
  rating: number
  onRate?: (rating: number) => void
  size?: "sm" | "md" | "lg"
  readonly?: boolean
  showValue?: boolean
  animated?: boolean
}

const SIZE_MAP = {
  sm: "w-4 h-4",
  md: "w-5 h-5",
  lg: "w-7 h-7",
}

const starSpring = {
  type: "spring" as const,
  stiffness: 300,
  damping: 15,
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
}

const starVariants = {
  hidden: { scale: 0, rotate: -180, opacity: 0 },
  visible: (i: number) => ({
    scale: 1,
    rotate: 0,
    opacity: 1,
    transition: { ...starSpring, delay: i * 0.06 },
  }),
}

export default function RatingStars({
  rating,
  onRate,
  size = "md",
  readonly = false,
  showValue = false,
  animated = true,
}: RatingStarsProps) {
  const [hovered, setHovered] = useState(0)
  const [pulsing, setPulsing] = useState<number | null>(null)
  const display = hovered || rating
  const sizeClass = SIZE_MAP[size]

  function handleClick(star: number) {
    if (!readonly && onRate) {
      onRate(star)
      setPulsing(star)
      setTimeout(() => setPulsing(null), 400)
    }
  }

  return (
    <motion.div
      className="inline-flex items-center gap-0.5"
      variants={animated ? containerVariants : undefined}
      initial={animated ? "hidden" : undefined}
      animate={animated ? "visible" : undefined}
    >
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= display
        const halfFilled = !filled && star - 0.5 <= display
        return (
          <motion.button
            key={star}
            type="button"
            disabled={readonly}
            custom={star}
            variants={animated ? starVariants : undefined}
            whileHover={
              readonly
                ? {}
                : {
                    scale: 1.25,
                    transition: { type: "spring", stiffness: 400 },
                  }
            }
            whileTap={readonly ? {} : { scale: 0.8 }}
            onMouseEnter={() => !readonly && setHovered(star)}
            onMouseLeave={() => !readonly && setHovered(0)}
            onClick={() => handleClick(star)}
            className={`${sizeClass} ${readonly ? "cursor-default" : "cursor-pointer"} relative outline-none`}
          >
            <svg
              viewBox="0 0 24 24"
              className={`${sizeClass} transition-colors duration-200 ${
                filled
                  ? "text-amber-400"
                  : halfFilled
                    ? "text-amber-300"
                    : "text-gray-200"
              }`}
              fill={filled || halfFilled ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth={1.5}
              style={{
                filter: filled ? "drop-shadow(0 0 4px rgba(251,191,36,0.3))" : "none",
              }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
              />
            </svg>
            {hovered >= star && !readonly && (
              <motion.span
                layoutId="glow"
                className="absolute inset-0 rounded-full bg-amber-400/15"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 2 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
              />
            )}
            {pulsing === star && (
              <motion.span
                className="absolute inset-0 rounded-full bg-amber-400/20"
                initial={{ opacity: 0.6, scale: 0.8 }}
                animate={{ opacity: 0, scale: 2.5 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            )}
          </motion.button>
        )
      })}
      {showValue && (
        <motion.span
          key={display}
          initial={{ opacity: 0, y: -6, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={starSpring}
          className="ml-1.5 text-sm font-semibold text-gray-500 tabular-nums"
        >
          {display.toFixed(1)}
        </motion.span>
      )}
    </motion.div>
  )
}
