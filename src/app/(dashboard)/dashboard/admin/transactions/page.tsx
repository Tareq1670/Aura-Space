"use client"

import { useEffect, useState, useCallback } from "react"
import { motion } from "framer-motion"
import { toast } from "sonner"
import { Filter, Search, CheckCircle } from "lucide-react"
import { Label, ListBox, Pagination, Select, Skeleton } from "@heroui/react"
import ConfirmModal from "@/Components/Dashboard/ConfirmModal"
import { transactionAPI, type TransactionItem } from "@/lib/api/Guest/transaction-api"

const STATUS_STYLES: Record<string, string> = {
  success: "bg-emerald-50 text-emerald-700 border-emerald-200",
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  failed: "bg-red-50 text-red-700 border-red-200",
  refunded: "bg-purple-50 text-purple-700 border-purple-200",
}

const TYPE_STYLES: Record<string, string> = {
  payment: "bg-blue-50 text-blue-700 border-blue-200",
  payout: "bg-emerald-50 text-emerald-700 border-emerald-200",
  refund: "bg-purple-50 text-purple-700 border-purple-200",
  commission: "bg-gray-50 text-gray-700 border-gray-200",
}

const METHOD_LABELS: Record<string, string> = {
  card: "Card",
  bank: "Bank Transfer",
  paypal: "PayPal",
  bkash: "bKash",
}

const TYPE_OPTIONS = [
  { id: "", label: "All types" },
  { id: "payment", label: "Payment" },
  { id: "payout", label: "Payout" },
  { id: "refund", label: "Refund" },
  { id: "commission", label: "Commission" },
]

const STATUS_OPTIONS = [
  { id: "", label: "All statuses" },
  { id: "success", label: "Success" },
  { id: "pending", label: "Pending" },
  { id: "failed", label: "Failed" },
  { id: "refunded", label: "Refunded" },
]

const METHOD_OPTIONS = [
  { id: "", label: "All methods" },
  { id: "card", label: "Card" },
  { id: "bank", label: "Bank" },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.04, delayChildren: 0.1 },
  },
}

const rowVariants = {
  hidden: { opacity: 0, y: 12, filter: "blur(3px)" },
  visible: {
    opacity: 1, y: 0, filter: "blur(0px)",
    transition: { type: "spring" as const, stiffness: 110, damping: 22 },
  },
}

export default function AdminTransactionsPage() {
  const [transactions, setTransactions] = useState<TransactionItem[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [typeFilter, setTypeFilter] = useState<string>("")
  const [statusFilter, setStatusFilter] = useState<string>("")
  const [methodFilter, setMethodFilter] = useState<string>("")
  const [search, setSearch] = useState("")
  const [processId, setProcessId] = useState<string | null>(null)
  const [processing, setProcessing] = useState(false)
  const limit = 20

  const fetchTransactions = useCallback(async () => {
    setLoading(true)
    try {
      const res = await transactionAPI.getAdminTransactions({
        page, limit,
        type: typeFilter || undefined,
        status: statusFilter || undefined,
        method: methodFilter || undefined,
      })
      if (res.success && res.data) {
        setTransactions(res.data.transactions)
        setTotal(res.data.pagination.total)
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to load transactions")
    } finally {
      setLoading(false)
    }
  }, [page, typeFilter, statusFilter, methodFilter])

  useEffect(() => { fetchTransactions() }, [fetchTransactions])
  useEffect(() => { setPage(1) }, [typeFilter, statusFilter, methodFilter, search])

  async function handleProcessPayout() {
    if (!processId) return
    setProcessing(true)
    try {
      const res = await transactionAPI.processPayout(processId)
      if (res.success) {
        toast.success("Payout processed successfully")
        setProcessId(null)
        fetchTransactions()
      } else {
        toast.error(res.message || "Failed to process payout")
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to process payout")
    } finally {
      setProcessing(false)
    }
  }

  const filtered = search
    ? transactions.filter((t) =>
        t.transactionId?.toLowerCase().includes(search.toLowerCase()) ||
        t.userId?.toLowerCase().includes(search.toLowerCase())
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
        <h1 className="text-2xl font-bold text-gray-900">All Transactions</h1>
        <p className="mt-1 text-sm text-gray-500">Full transaction log — payments, payouts, refunds, commissions</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08, type: "spring", stiffness: 100, damping: 20 }}
        className="mb-6 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5"
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex-1">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                aria-label="Search transactions"
                placeholder="Search by Transaction or User ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-white py-2 pl-9 pr-4 text-sm text-gray-700 outline-none transition-all placeholder-gray-400 hover:border-violet-300 focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
              />
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Filter className="h-4 w-4" />
              <span className="hidden sm:inline text-xs font-medium uppercase tracking-wider text-gray-400">Filters</span>
            </div>
            <Select
              className="w-32"
              placeholder="All types"
              selectedKey={typeFilter}
              onSelectionChange={(key) => setTypeFilter((key as string) || "")}
            >

              <Select.Trigger>
                <Select.Value />
                <Select.Indicator />
              </Select.Trigger>
              <Select.Popover>
                <ListBox>
                  {TYPE_OPTIONS.map((opt) => (
                    <ListBox.Item key={opt.id} id={opt.id} textValue={opt.label}>
                      {opt.label}
                      <ListBox.ItemIndicator />
                    </ListBox.Item>
                  ))}
                </ListBox>
              </Select.Popover>
            </Select>
            <Select
              className="w-32"
              placeholder="All statuses"
              selectedKey={statusFilter}
              onSelectionChange={(key) => setStatusFilter((key as string) || "")}
            >
 
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
              className="w-32"
              placeholder="All methods"
              selectedKey={methodFilter}
              onSelectionChange={(key) => setMethodFilter((key as string) || "")}
            >

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
        </div>
      </motion.div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-14 rounded-xl" />
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
          <p className="mt-1 text-sm text-gray-400">Try adjusting your filters or search</p>
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
                  <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500">Date</th>
                  <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500">Transaction ID</th>
                  <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500">User ID</th>
                  <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500">Description</th>
                  <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500">Amount</th>
                  <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500">Method</th>
                  <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500">Type</th>
                  <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500">Status</th>
                  <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((t) => (
                  <motion.tr
                    key={t._id}
                    variants={rowVariants}
                    className={`transition-colors hover:bg-violet-50/30 ${t.status === "failed" ? "bg-red-50/40" : ""}`}
                  >
                    <td className="whitespace-nowrap px-5 py-3.5 text-gray-700">{new Date(t.createdAt).toLocaleDateString()}</td>
                    <td className="whitespace-nowrap px-5 py-3.5 font-mono text-xs text-gray-500">{t.transactionId?.slice(0, 16)}…</td>
                    <td className="whitespace-nowrap px-5 py-3.5 font-mono text-xs text-gray-500">{t.userId?.slice(0, 12)}…</td>
                    <td className="px-5 py-3.5 text-gray-700">{t.description || "—"}</td>
                    <td className="whitespace-nowrap px-5 py-3.5 font-semibold text-gray-900">${t.amount.toFixed(2)}</td>
                    <td className="whitespace-nowrap px-5 py-3.5 text-gray-600">{METHOD_LABELS[t.method] || t.method}</td>
                    <td className="whitespace-nowrap px-5 py-3.5">
                      <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${TYPE_STYLES[t.type] || "bg-gray-50 text-gray-700 border-gray-200"}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${
                          t.type === "payment" ? "bg-blue-500" :
                          t.type === "payout" ? "bg-emerald-500" :
                          t.type === "refund" ? "bg-purple-500" : "bg-gray-400"
                        }`} />
                        {t.type}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${STATUS_STYLES[t.status] || "bg-gray-50 text-gray-700 border-gray-200"}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${
                          t.status === "success" ? "bg-emerald-500" :
                          t.status === "pending" ? "bg-amber-500" :
                          t.status === "failed" ? "bg-red-500" :
                          t.status === "refunded" ? "bg-purple-500" : "bg-gray-400"
                        }`} />
                        {t.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      {t.type === "payout" && t.status === "pending" && (
                        <button
                          onClick={() => setProcessId(t.transactionId)}
                          className="inline-flex items-center gap-1 rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition-all hover:from-emerald-600 hover:to-emerald-700 active:scale-[0.97]"
                        >
                          <CheckCircle className="h-3 w-3" />
                          Process
                        </button>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex flex-col items-center justify-between gap-3 border-t border-gray-100 px-5 py-3.5 sm:flex-row">
              <Pagination className="w-full sm:w-auto">
                <Pagination.Summary className="text-xs text-gray-500">
                  Showing {(page - 1) * limit + 1}–{Math.min(page * limit, total)} of {total} results
                </Pagination.Summary>
                <Pagination.Content>
                  <Pagination.Item>
                    <Pagination.Previous
                      isDisabled={page <= 1}
                      onPress={() => setPage(Math.max(1, page - 1))}
                    >
                      <Pagination.PreviousIcon />
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
                      onPress={() => setPage(Math.min(totalPages, page + 1))}
                    >
                      <Pagination.NextIcon />
                    </Pagination.Next>
                  </Pagination.Item>
                </Pagination.Content>
              </Pagination>
            </div>
          )}
        </motion.div>
      )}

      <ConfirmModal
        isOpen={!!processId}
        onClose={() => setProcessId(null)}
        onConfirm={handleProcessPayout}
        title="Process Payout"
        message="Mark this payout as completed? This action will update the transaction status to 'success'."
        confirmText="Process Payout"
        variant="warning"
        loading={processing}
      />
    </div>
  )
}
