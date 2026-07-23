"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { toast } from "sonner"
import { CreditCard, Search, AlertCircle, RefreshCw } from "lucide-react"
import { Label, ListBox, Pagination, Select, Skeleton } from "@heroui/react"
import { transactionAPI, type TransactionItem } from "@/lib/api/Guest/transaction-api"
import StatCard from "@/Components/Dashboard/StatCard"
import { formatCurrency } from "@/lib/currency"

const STATUS_CONFIG: Record<string, { dot: string; label: string }> = {
  success: { dot: "bg-emerald-500", label: "Success" },
  pending: { dot: "bg-amber-500", label: "Pending" },
  failed: { dot: "bg-red-500", label: "Failed" },
  refunded: { dot: "bg-purple-500", label: "Refunded" },
}

const METHOD_OPTIONS = [
  { id: "", label: "All methods" },
  { id: "card", label: "Card" },
  { id: "bank", label: "Bank Transfer" },
]

const STATUS_OPTIONS = [
  { id: "", label: "All statuses" },
  { id: "success", label: "Success" },
  { id: "pending", label: "Pending" },
  { id: "failed", label: "Failed" },
  { id: "refunded", label: "Refunded" },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 16, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { type: "spring" as const, stiffness: 120, damping: 20 },
  },
}

const STATUS_STYLES: Record<string, { border: string; bg: string; text: string }> = {
  success: { border: "border-emerald-200", bg: "bg-emerald-50", text: "text-emerald-700" },
  pending: { border: "border-amber-200", bg: "bg-amber-50", text: "text-amber-700" },
  failed: { border: "border-red-200", bg: "bg-red-50", text: "text-red-700" },
  refunded: { border: "border-purple-200", bg: "bg-purple-50", text: "text-purple-700" },
}

export default function GuestTransactionsPage() {
  const [transactions, setTransactions] = useState<TransactionItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalSpend, setTotalSpend] = useState(0)
  const [thisMonthSpend, setThisMonthSpend] = useState<number | null>(null)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [statusFilter, setStatusFilter] = useState<string>("")
  const [methodFilter, setMethodFilter] = useState<string>("")
  const [search, setSearch] = useState("")
  const limit = 15

  useEffect(() => {
    let mounted = true
    setError(null)
    ;(async () => {
      try {
        const [txnRes, statsRes] = await Promise.all([
          transactionAPI.getMyTransactions({
            page, limit,
            status: statusFilter || undefined,
            method: methodFilter || undefined,
          }),
          transactionAPI.getTransactionStats(),
        ])
        if (!mounted) return
        if (txnRes.success && txnRes.data) {
          setTransactions(txnRes.data.transactions)
          setTotal(txnRes.data.pagination.total)
        }
        if (statsRes.success && statsRes.data) {
          setTotalSpend(statsRes.data.totalSpend ?? 0)
          setThisMonthSpend(statsRes.data.thisMonthSpend ?? null)
        }
      } catch (err: any) {
        if (!mounted) return
        setError(err.message || "Failed to load transactions")
        toast.error(err.message || "Failed to load transactions")
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => { mounted = false }
  }, [page, statusFilter, methodFilter])
  const filtered = search
    ? transactions.filter((t) =>
        t.transactionId?.toLowerCase().includes(search.toLowerCase())
      )
    : transactions

  const totalPages = Math.max(1, Math.ceil(total / limit))

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-violet-50/40 p-6 lg:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="mb-6"
      >
        <h1 className="text-2xl font-bold text-gray-900">My Transactions</h1>
        <p className="mt-1 text-sm text-gray-500">View your payment and refund history</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08, type: "spring", stiffness: 100, damping: 20 }}
        className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        <StatCard icon={<CreditCard className="h-5 w-5" />} label="Total Spend" value={totalSpend} gradient="from-emerald-600 to-emerald-500" />
        <StatCard icon={<CreditCard className="h-5 w-5" />} label="Transactions" value={total} gradient="from-violet-600 to-violet-500" prefix="" formatter={(v) => String(v)} />
        <StatCard icon={<CreditCard className="h-5 w-5" />} label="Avg per Transaction" value={total > 0 ? totalSpend / total : 0} gradient="from-blue-600 to-blue-500" />
        <StatCard icon={<CreditCard className="h-5 w-5" />} label="This Month" value={thisMonthSpend !== null ? thisMonthSpend : 0} gradient="from-amber-500 to-orange-500" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.12, type: "spring", stiffness: 100, damping: 20 }}
        className="mb-6 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5"
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex-1">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                aria-label="Search transactions"
                placeholder="Search by Transaction ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-white py-2 pl-9 pr-4 text-sm text-gray-700 outline-none transition-all placeholder-gray-400 hover:border-violet-300 focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
              />
            </div>
          </div>
          <Select
            className="w-full sm:w-44"
            placeholder="All statuses"
            selectedKey={statusFilter}
            onSelectionChange={(key) => { setStatusFilter((key as string) || ""); setPage(1); }}
          >
            <Label>Status</Label>
            <Select.Trigger>
              <Select.Value />
              <Select.Indicator />
            </Select.Trigger>
            <Select.Popover>
              <ListBox>
                {STATUS_OPTIONS.map((opt) => (
                  <ListBox.Item key={opt.id} id={opt.id} textValue={opt.label}>
                    {opt.label}
                    <ListBox.ItemIndicator />
                  </ListBox.Item>
                ))}
              </ListBox>
            </Select.Popover>
          </Select>
          <Select
            className="w-full sm:w-44"
            placeholder="All methods"
            selectedKey={methodFilter}
            onSelectionChange={(key) => { setMethodFilter((key as string) || ""); setPage(1); }}
          >
            <Label>Method</Label>
            <Select.Trigger>
              <Select.Value />
              <Select.Indicator />
            </Select.Trigger>
            <Select.Popover>
              <ListBox>
                {METHOD_OPTIONS.map((opt) => (
                  <ListBox.Item key={opt.id} id={opt.id} textValue={opt.label}>
                    {opt.label}
                    <ListBox.ItemIndicator />
                  </ListBox.Item>
                ))}
              </ListBox>
            </Select.Popover>
          </Select>
        </div>
      </motion.div>

      {error ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center py-20 text-gray-400"
        >
          <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50">
            <AlertCircle className="h-8 w-8 text-red-400" />
          </div>
          <p className="text-lg font-semibold text-gray-900">Failed to load transactions</p>
          <p className="mt-1 text-sm text-gray-400">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 flex items-center gap-2 rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </button>
        </motion.div>
      ) : loading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
              <Skeleton className="h-10 w-20 rounded-lg" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-3 w-2/5 rounded-lg" />
                <Skeleton className="h-3 w-3/5 rounded-lg" />
              </div>
              <Skeleton className="h-8 w-16 rounded-lg" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
          className="flex flex-col items-center justify-center py-20 text-gray-400"
        >
          <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100">
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <p className="text-lg font-semibold text-gray-900">No transactions found</p>
          <p className="mt-1 text-sm text-gray-400">Your payment history will appear here</p>
        </motion.div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-gradient-to-r from-violet-50/80 via-indigo-50/50 to-cyan-50/80">
                  <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500">Transaction ID</th>
                  <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500">Date</th>
                  <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500">Description</th>
                  <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500">Amount</th>
                  <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500">Method</th>
                  <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((t) => {
                  const statusCfg = STATUS_CONFIG[t.status] || { dot: "bg-gray-400", label: t.status }
                  return (
                    <motion.tr
                      key={t._id}
                      variants={itemVariants}
                      className="transition-colors hover:bg-violet-50/40"
                    >
                      <td className="px-5 py-3.5 font-mono text-xs text-gray-500">{t.transactionId?.slice(0, 20)}…</td>
                      <td className="whitespace-nowrap px-5 py-3.5 text-gray-700">{new Date(t.createdAt).toLocaleDateString()}</td>
                      <td className="px-5 py-3.5 text-gray-700">{t.description || "—"}</td>
                      <td className={`whitespace-nowrap px-5 py-3.5 font-semibold ${t.type === "refund" ? "text-red-600" : "text-gray-900"}`}>
                        {t.type === "refund" ? "-" : "+"}{formatCurrency(t.amount)}
                      </td>
                      <td className="whitespace-nowrap px-5 py-3.5 capitalize text-gray-600">{t.method}</td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold capitalize ${STATUS_STYLES[t.status]?.border || "border-gray-200"} ${STATUS_STYLES[t.status]?.bg || "bg-gray-50"} ${STATUS_STYLES[t.status]?.text || "text-gray-700"}`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${statusCfg.dot}`} />
                          {statusCfg.label}
                        </span>
                      </td>
                    </motion.tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex flex-col items-center justify-between gap-3 border-t border-gray-100 px-5 py-4 sm:flex-row">
              <Pagination className="w-full sm:w-auto">
                <Pagination.Summary>
                  Showing {(page - 1) * limit + 1}–{Math.min(page * limit, total)} of {total} results
                </Pagination.Summary>
                <Pagination.Content>
                  <Pagination.Item>
                    <Pagination.Previous
                      isDisabled={page === 1}
                      onPress={() => setPage((p) => Math.max(1, p - 1))}
                    >
                      <Pagination.PreviousIcon />
                      <span>Previous</span>
                    </Pagination.Previous>
                  </Pagination.Item>
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .slice(Math.max(0, page - 3), page + 2)
                    .map((p) => (
                      <Pagination.Item key={p}>
                        <Pagination.Link isActive={p === page} onPress={() => setPage(p)}>
                          {p}
                        </Pagination.Link>
                      </Pagination.Item>
                    ))}
                  <Pagination.Item>
                    <Pagination.Next
                      isDisabled={page >= totalPages}
                      onPress={() => setPage((p) => Math.min(totalPages, p + 1))}
                    >
                      <span>Next</span>
                      <Pagination.NextIcon />
                    </Pagination.Next>
                  </Pagination.Item>
                </Pagination.Content>
              </Pagination>
            </div>
          )}
        </motion.div>
      )}
    </div>
  )
}