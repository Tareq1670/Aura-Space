"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { toast } from "sonner"
import { ArrowUpDown } from "lucide-react"
import { ListBox, Pagination, Select, Skeleton } from "@heroui/react"
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
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.1 },
  },
}

const rowVariants = {
  hidden: { opacity: 0, y: 12, filter: "blur(3px)" },
  visible: {
    opacity: 1, y: 0, filter: "blur(0px)",
    transition: { type: "spring" as const, stiffness: 110, damping: 22 },
  },
}

export default function HostTransactionsPage() {
  const [transactions, setTransactions] = useState<TransactionItem[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [typeFilter, setTypeFilter] = useState<string>("")
  const [statusFilter, setStatusFilter] = useState<string>("")
  const limit = 15

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const res = await transactionAPI.getHostTransactions({
          page, limit,
          type: typeFilter || undefined,
          status: statusFilter || undefined,
        })
        if (!mounted) return
        if (res.success && res.data) {
          setTransactions(res.data.transactions)
          setTotal(res.data.pagination.total)
        }
      } catch (err: any) {
        if (!mounted) return
        toast.error(err.message || "Failed to load transactions")
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => { mounted = false }
  }, [page, typeFilter, statusFilter])
  const totalPages = Math.max(1, Math.ceil(total / limit))

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-violet-50/40 p-6 lg:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="mb-6"
      >
        <h1 className="text-2xl font-bold text-gray-900">Transaction History</h1>
        <p className="mt-1 text-sm text-gray-500">Accounting-friendly view of all your transactions</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08, type: "spring", stiffness: 100, damping: 20 }}
        className="mb-6 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5"
      >
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs font-medium uppercase tracking-wider text-gray-400">Filters</span>
          <Select
            className="w-36"
            placeholder="All types"
            selectedKey={typeFilter}
            onSelectionChange={(key) => { setTypeFilter((key as string) || ""); setPage(1); }}
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
            className="w-36"
            placeholder="All statuses"
            selectedKey={statusFilter}
            onSelectionChange={(key) => { setStatusFilter((key as string) || ""); setPage(1); }}
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
          <span className="ml-auto text-xs text-gray-400">{total} total transactions</span>
        </div>
      </motion.div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-14 rounded-xl" />
          ))}
        </div>
      ) : transactions.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
          className="flex flex-col items-center justify-center py-20 text-gray-400"
        >
          <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100">
            <ArrowUpDown className="h-8 w-8 text-gray-400" />
          </div>
          <p className="text-lg font-semibold text-gray-900">No transactions found</p>
          <p className="mt-1 text-sm text-gray-400">Your transaction history will appear here</p>
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
                  <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500">Description</th>
                  <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500">Gross Amount</th>
                  <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500">Commission (10%)</th>
                  <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500">Net Amount</th>
                  <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500">Type</th>
                  <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {transactions.map((t) => (
                  <motion.tr
                    key={t._id}
                    variants={rowVariants}
                    className="transition-colors hover:bg-violet-50/30"
                  >
                    <td className="whitespace-nowrap px-5 py-3.5 text-gray-700">{new Date(t.createdAt).toLocaleDateString()}</td>
                    <td className="px-5 py-3.5 text-gray-700">{t.description || "—"}</td>
                    <td className="whitespace-nowrap px-5 py-3.5 font-semibold text-gray-900">${t.amount.toFixed(2)}</td>
                    <td className="whitespace-nowrap px-5 py-3.5 text-gray-500">${(t.amount * 0.1).toFixed(2)}</td>
                    <td className="whitespace-nowrap px-5 py-3.5 font-semibold text-emerald-600">${(t.amount * 0.9).toFixed(2)}</td>
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
                          t.status === "pending" ? "bg-amber-500" : "bg-red-500"
                        }`} />
                        {t.status}
                      </span>
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
    </div>
  )
}
