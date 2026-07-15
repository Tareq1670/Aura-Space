"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Area,
  AreaChart,
} from "recharts"

type ChartType = "line" | "bar" | "pie" | "area"

interface ChartCardProps {
  title: string
  data: Record<string, unknown>[]
  type?: ChartType
  xKey?: string
  dataKey?: string
  colors?: string[]
  height?: number
  showTypeSelector?: boolean
  gradient?: boolean
  className?: string
}

const DEFAULT_COLORS = ["#8b5cf6", "#10b981", "#f59e0b", "#ef4444", "#06b6d4", "#ec4899", "#84cc16", "#6366f1"]

export default function ChartCard({
  title,
  data,
  type: initialType = "line",
  xKey = "name",
  dataKey = "value",
  colors = DEFAULT_COLORS,
  height = 250,
  showTypeSelector = false,
  gradient = false,
  className = "",
}: ChartCardProps) {
  const [chartType, setChartType] = useState<ChartType>(initialType)

  const isEmpty = !data || data.length === 0

  const chartTypes: { key: ChartType; label: string }[] = [
    { key: "line", label: "Line" },
    { key: "bar", label: "Bar" },
    { key: "area", label: "Area" },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl border border-gray-100 bg-white p-5 shadow-sm ${className}`}
    >
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
        {showTypeSelector && (
          <div className="flex gap-1 rounded-lg bg-gray-100 p-0.5">
            {chartTypes.map((t) => (
              <button
                key={t.key}
                onClick={() => setChartType(t.key)}
                className={`rounded-md px-2.5 py-1 text-xs font-medium transition-all ${
                  chartType === t.key
                    ? "bg-white text-violet-600 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {isEmpty ? (
        <div className="flex h-[200px] items-center justify-center text-sm text-gray-400">
          No data available
        </div>
      ) : (
        <div style={{ width: "100%", height }}>
          <ResponsiveContainer>
            {chartType === "line" ? (
              <LineChart data={data as Record<string, unknown>[]} margin={{ left: -10, right: 10, top: 5, bottom: 5 }}>
                {gradient && (
                  <defs>
                    <linearGradient id={`gradient-${title}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={colors[0]} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={colors[0]} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                )}
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey={xKey} tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: "1px solid #f0f0f0", fontSize: 13 }}
                />
                <Line type="monotone" dataKey={dataKey} stroke={colors[0]} strokeWidth={2} dot={{ fill: colors[0], r: 3 }} />
              </LineChart>
            ) : chartType === "area" ? (
              <AreaChart data={data as Record<string, unknown>[]} margin={{ left: -10, right: 10, top: 5, bottom: 5 }}>
                <defs>
                  <linearGradient id={`areaGrad-${title}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={colors[0]} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={colors[0]} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey={xKey} tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: "1px solid #f0f0f0", fontSize: 13 }}
                />
                <Area type="monotone" dataKey={dataKey} stroke={colors[0]} fill={`url(#areaGrad-${title})`} strokeWidth={2} />
              </AreaChart>
            ) : (
              <BarChart data={data as Record<string, unknown>[]} margin={{ left: -10, right: 10, top: 5, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey={xKey} tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: "1px solid #f0f0f0", fontSize: 13 }}
                />
                <Bar dataKey={dataKey} fill={colors[0]} radius={[4, 4, 0, 0]} />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      )}
    </motion.div>
  )
}
