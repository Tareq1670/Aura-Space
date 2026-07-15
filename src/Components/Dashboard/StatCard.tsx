"use client"

import { motion } from "framer-motion"
import type { ReactNode } from "react"
import { getCurrencySymbol } from "@/lib/currency"

interface Props {
  icon?: ReactNode
  label: string
  value: string | number
  trend?: { label: string; positive: boolean }
  gradient: string
  prefix?: string
  formatter?: (value: number) => string
}

export default function StatCard({ icon, label, value, trend, gradient, prefix, formatter }: Props) {
  const currencyPrefix = prefix ?? getCurrencySymbol()
  const displayValue = typeof value === "number"
    ? formatter
      ? formatter(value)
      : `${currencyPrefix}${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    : value

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl bg-gradient-to-br ${gradient} p-5 text-white shadow-lg`}
    >
      <div className="flex items-start justify-between">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-white/70">{label}</p>
          <p className="mt-1 truncate text-2xl font-bold">{displayValue}</p>
        </div>
        {icon && (
          <div className="ml-3 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/20">
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
