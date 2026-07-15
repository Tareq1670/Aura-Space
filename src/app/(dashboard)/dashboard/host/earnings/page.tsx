"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import { DollarSign, TrendingUp, Clock, Wallet, X } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Pagination, Skeleton } from "@heroui/react"
import StatCard from "@/Components/Dashboard/StatCard"
import { transactionAPI, type TransactionItem } from "@/lib/api/Guest/transaction-api"
import { formatCurrency } from "@/lib/currency"

const STATUS_STYLES: Record<string, string> = {
  success: "bg-emerald-50 text-emerald-700 border-emerald-200",
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  failed: "bg-red-50 text-red-700 border-red-200",
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
}

const rowVariants = {
  hidden: { opacity: 0, y: 12, filter: "blur(3px)" },
  visible: {
    opacity: 1, y: 0, filter: "blur(0px)",
    transition: { type: "spring" as const, stiffness: 110, damping: 22 },
  },
}

export default function HostEarningsPage() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ totalEarned: 0, totalSpend: 0, commissionEarned: 0, pendingPayouts: 0 })
  const [payouts, setPayouts] = useState<TransactionItem[]>([])
  const [payoutPage, setPayoutPage] = useState(1)
  const [payoutTotal, setPayoutTotal] = useState(0)
  const [requesting, setRequesting] = useState(false)
  const [showRequestModal, setShowRequestModal] = useState(false)
  const [transactions, setTransactions] = useState<TransactionItem[]>([])
  const [txnPage, setTxnPage] = useState(1)
  const [txnTotal, setTxnTotal] = useState(0)
  const [chartData, setChartData] = useState<{ name: string; earnings: number }[]>([])
  const limit = 10

  const buildChartData = (allTxns: TransactionItem[]) => {
    const monthMap: Record<number, number> = {}
    const now = new Date()
    allTxns.forEach((t) => {
      const d = new Date(t.createdAt)
      if (d.getFullYear() === now.getFullYear()) {
        monthMap[d.getMonth()] = (monthMap[d.getMonth()] || 0) + t.amount
      }
    })
    return MONTHS.map((name, i) => ({
      name,
      earnings: monthMap[i] || 0,
    }))
  }

  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const [statsRes, payoutRes, txnRes, allRes] = await Promise.all([
          transactionAPI.getTransactionStats(),
          transactionAPI.getPayoutHistory({ page: payoutPage, limit }),
          transactionAPI.getHostTransactions({ page: txnPage, limit }),
          transactionAPI.getHostTransactions({ page: 1, limit: 500 }),
        ])
        if (!mounted) return
        if (statsRes.success && statsRes.data) setStats(statsRes.data as any)
        if (payoutRes.success && payoutRes.data) {
          setPayouts(payoutRes.data.transactions)
          setPayoutTotal(payoutRes.data.pagination.total)
        }
        if (txnRes.success && txnRes.data) {
          setTransactions(txnRes.data.transactions)
          setTxnTotal(txnRes.data.pagination.total)
        }
        if (allRes.success && allRes.data?.transactions) {
          setChartData(buildChartData(allRes.data.transactions))
        }
      } catch (err: any) {
        if (!mounted) return
        toast.error(err.message || "Failed to load earnings")
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => { mounted = false }
  }, [payoutPage, txnPage, refreshKey])

  async function handleRequestPayout() {
    setRequesting(true)
    try {
      const res = await transactionAPI.requestPayout()
      if (res.success) {
        toast.success("Withdrawal requested. Admin will review it.")
        setShowRequestModal(false)
        setRefreshKey(k => k + 1)
      } else {
        toast.error(res.message || "Failed to request payout")
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to request payout")
    } finally {
      setRequesting(false)
    }
  }

  const availableBalance = stats.totalEarned - stats.pendingPayouts
  const payoutTotalPages = Math.max(1, Math.ceil(payoutTotal / limit))
  const txnTotalPages = Math.max(1, Math.ceil(txnTotal / limit))

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-violet-50/40 p-6 lg:p-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Skeleton className="mb-2 h-7 w-40 rounded-lg" />
            <Skeleton className="h-4 w-56 rounded-lg" />
          </div>
          <Skeleton className="h-11 w-44 rounded-xl" />
        </div>
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-28 rounded-2xl" />
          ))}
        </div>
        <Skeleton className="mb-8 h-64 rounded-2xl" />
        <Skeleton className="mb-8 h-56 rounded-2xl" />
        <Skeleton className="h-56 rounded-2xl" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-violet-50/40 p-6 lg:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Earnings</h1>
          <p className="mt-1 text-sm text-gray-500">Track your revenue and request payouts</p>
        </div>
        <button
          onClick={() => setShowRequestModal(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 to-indigo-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/30 transition-all hover:from-violet-600 hover:to-indigo-600 active:scale-[0.97]"
        >
          <Wallet className="h-4 w-4" />
          Request Withdrawal
        </button>
      </motion.div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        <motion.div variants={rowVariants}>
          <StatCard icon={<DollarSign className="h-5 w-5" />} label="Total Lifetime Earnings" value={stats.totalEarned} gradient="from-emerald-600 to-emerald-500" />
        </motion.div>
        <motion.div variants={rowVariants}>
          <StatCard icon={<TrendingUp className="h-5 w-5" />} label="This Month" value={chartData[new Date().getMonth()]?.earnings || 0} gradient="from-blue-600 to-blue-500" />
        </motion.div>
        <motion.div variants={rowVariants}>
          <StatCard icon={<Clock className="h-5 w-5" />} label="Pending Payout" value={stats.pendingPayouts} gradient="from-amber-500 to-orange-500" />
        </motion.div>
        <motion.div variants={rowVariants}>
          <StatCard icon={<DollarSign className="h-5 w-5" />} label="Commission Deducted" value={stats.commissionEarned} gradient="from-purple-600 to-purple-500" />
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.18, type: "spring", stiffness: 80, damping: 18 }}
        className="mb-8 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
      >
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Monthly Earnings Trend</h2>
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.4, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="h-64 origin-left"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#9ca3af" />
              <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" tickFormatter={(v) => formatCurrency(v)} />
              <Tooltip formatter={(v: any) => [formatCurrency(Number(v || 0)), "Earnings"]} />
              <Line type="monotone" dataKey="earnings" stroke="#7c3aed" strokeWidth={2} dot={{ fill: "#7c3aed", r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, type: "spring", stiffness: 80, damping: 18 }}
        className="mb-8"
      >
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Payout History</h2>
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-gradient-to-r from-violet-50/80 via-indigo-50/50 to-cyan-50/80">
                  <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500">Date</th>
                  <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500">Amount</th>
                  <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {payouts.map((p, i) => (
                  <motion.tr
                    key={p._id}
                    variants={rowVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: i * 0.04 }}
                    className="transition-colors hover:bg-violet-50/30"
                  >
                    <td className="whitespace-nowrap px-5 py-3.5 text-gray-700">{new Date(p.createdAt).toLocaleDateString()}</td>
                    <td className="whitespace-nowrap px-5 py-3.5 font-semibold text-gray-900">{formatCurrency(p.amount)}</td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${STATUS_STYLES[p.status] || "bg-gray-50 text-gray-700 border-gray-200"}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${
                          p.status === "success" ? "bg-emerald-500" :
                          p.status === "pending" ? "bg-amber-500" : "bg-red-500"
                        }`} />
                        {p.status}
                      </span>
                    </td>
                  </motion.tr>
                ))}
                {payouts.length === 0 && (
                  <tr><td colSpan={3} className="px-5 py-8 text-center text-sm text-gray-400">No payouts yet</td></tr>
                )}
              </tbody>
            </table>
          </div>
          {payoutTotalPages > 1 && (
            <div className="flex items-center justify-between border-t border-gray-100 px-5 py-3.5">
              <Pagination className="w-full">
                <Pagination.Summary className="text-xs text-gray-500">
                  Showing {(payoutPage - 1) * limit + 1}–{Math.min(payoutPage * limit, payoutTotal)} of {payoutTotal} results
                </Pagination.Summary>
                <Pagination.Content>
                  <Pagination.Item>
                    <Pagination.Previous
                      isDisabled={payoutPage <= 1}
                      onPress={() => setPayoutPage(Math.max(1, payoutPage - 1))}
                    >
                      <Pagination.PreviousIcon />
                    </Pagination.Previous>
                  </Pagination.Item>
                  {Array.from({ length: payoutTotalPages }, (_, i) => i + 1)
                    .slice(Math.max(0, payoutPage - 3), payoutPage + 2)
                    .map((p) => (
                      <Pagination.Item key={p}>
                        <Pagination.Link isActive={p === payoutPage} onPress={() => setPayoutPage(p)}>
                          {p}
                        </Pagination.Link>
                      </Pagination.Item>
                    ))}
                  <Pagination.Item>
                    <Pagination.Next
                      isDisabled={payoutPage >= payoutTotalPages}
                      onPress={() => setPayoutPage(Math.min(payoutTotalPages, payoutPage + 1))}
                    >
                      <Pagination.NextIcon />
                    </Pagination.Next>
                  </Pagination.Item>
                </Pagination.Content>
              </Pagination>
            </div>
          )}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.32, type: "spring", stiffness: 80, damping: 18 }}
      >
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Transaction History</h2>
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-gradient-to-r from-violet-50/80 via-indigo-50/50 to-cyan-50/80">
                  <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500">Date</th>
                  <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500">Description</th>
                  <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500">Gross</th>
                  <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500">Commission</th>
                  <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500">Net</th>
                  <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500">Type</th>
                  <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {transactions.map((t, i) => (
                  <motion.tr
                    key={t._id}
                    variants={rowVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: i * 0.03 }}
                    className="transition-colors hover:bg-violet-50/30"
                  >
                    <td className="whitespace-nowrap px-5 py-3.5 text-gray-700">{new Date(t.createdAt).toLocaleDateString()}</td>
                    <td className="px-5 py-3.5 text-gray-700">{t.description || "—"}</td>
                    <td className="whitespace-nowrap px-5 py-3.5 font-semibold text-gray-900">{formatCurrency(t.amount)}</td>
                    <td className="whitespace-nowrap px-5 py-3.5 text-gray-500">{formatCurrency(t.amount * 0.1)}</td>
                    <td className="whitespace-nowrap px-5 py-3.5 font-semibold text-emerald-600">{formatCurrency(t.amount * 0.9)}</td>
                    <td className="whitespace-nowrap px-5 py-3.5 capitalize text-gray-600">{t.type}</td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${STATUS_STYLES[t.status] || "bg-gray-50 text-gray-700 border-gray-200"}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${
                          t.status === "success" ? "bg-emerald-500" :
                          t.status === "pending" ? "bg-amber-500" : "bg-red-500"
                        }`} />
                        {t.status}
                      </span>
                    </td>
                  </motion.tr>
                ))}
                {transactions.length === 0 && (
                  <tr><td colSpan={7} className="px-5 py-8 text-center text-sm text-gray-400">No transactions yet</td></tr>
                )}
              </tbody>
            </table>
          </div>
          {txnTotalPages > 1 && (
            <div className="flex items-center justify-between border-t border-gray-100 px-5 py-3.5">
              <Pagination className="w-full">
                <Pagination.Summary className="text-xs text-gray-500">
                  Showing {(txnPage - 1) * limit + 1}–{Math.min(txnPage * limit, txnTotal)} of {txnTotal} results
                </Pagination.Summary>
                <Pagination.Content>
                  <Pagination.Item>
                    <Pagination.Previous
                      isDisabled={txnPage <= 1}
                      onPress={() => setTxnPage(Math.max(1, txnPage - 1))}
                    >
                      <Pagination.PreviousIcon />
                    </Pagination.Previous>
                  </Pagination.Item>
                  {Array.from({ length: txnTotalPages }, (_, i) => i + 1)
                    .slice(Math.max(0, txnPage - 3), txnPage + 2)
                    .map((p) => (
                      <Pagination.Item key={p}>
                        <Pagination.Link isActive={p === txnPage} onPress={() => setTxnPage(p)}>
                          {p}
                        </Pagination.Link>
                      </Pagination.Item>
                    ))}
                  <Pagination.Item>
                    <Pagination.Next
                      isDisabled={txnPage >= txnTotalPages}
                      onPress={() => setTxnPage(Math.min(txnTotalPages, txnPage + 1))}
                    >
                      <Pagination.NextIcon />
                    </Pagination.Next>
                  </Pagination.Item>
                </Pagination.Content>
              </Pagination>
            </div>
          )}
        </div>
      </motion.div>

      <AnimatePresence>
        {showRequestModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowRequestModal(false)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-2xl border border-gray-100 bg-white p-6 shadow-2xl"
            >
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900">Request Withdrawal</h2>
                <button onClick={() => setShowRequestModal(false)} className="rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <p className="mb-6 text-sm text-gray-500">
                Available balance: <span className="font-semibold text-gray-900">{formatCurrency(availableBalance)}</span>
              </p>
              <div className="flex gap-3">
                <button onClick={() => setShowRequestModal(false)} className="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50">Cancel</button>
                <button
                  onClick={handleRequestPayout}
                  disabled={requesting}
                  className="flex-1 rounded-xl bg-gradient-to-r from-violet-500 to-indigo-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/30 transition-all hover:from-violet-600 hover:to-indigo-600 disabled:opacity-60"
                >
                  {requesting ? "Requesting…" : "Confirm Withdrawal"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
