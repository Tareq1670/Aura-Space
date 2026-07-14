"use client"

import { motion } from "framer-motion"
import type { ReactNode } from "react"

interface Props {
  icon?: ReactNode
  label: string
  value: string | number
  trend?: { label: string; positive: boolean }
  gradient: string
}

export default function StatCard({ icon, label, value, trend, gradient }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl bg-gradient-to-br ${gradient} p-5 text-white shadow-lg`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-white/70">{label}</p>
          <p className="mt-1 text-2xl font-bold">${Number(value).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        </div>
        {icon && (
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20">
            {icon}
          </div>
        )}
      </div>
      {trend && (
        <p className={`mt-3 text-xs font-medium ${trend.positive ? "text-emerald-200" : "text-red-200"}`}>
          {trend.positive ? "↑" : "↓"} {trend.label}
        </p>
      )}
    </motion.div>
  )
}
