"use client"

import { useEffect, useState, useCallback } from "react"
import { motion } from "framer-motion"
import { toast } from "sonner"
import { transactionAPI, type TransactionItem } from "@/lib/api/Guest/transaction-api"

const STATUS_STYLES: Record<string, string> = {
  success: "bg-emerald-100 text-emerald-700",
  pending: "bg-amber-100 text-amber-700",
  failed: "bg-red-100 text-red-700",
  refunded: "bg-purple-100 text-purple-700",
}

const METHOD_LABELS: Record<string, string> = {
  card: "Card",
  bank: "Bank Transfer",
  paypal: "PayPal",
  bkash: "bKash",
}

export default function GuestTransactionsPage() {
  const [transactions, setTransactions] = useState<TransactionItem[]>([])
  const [loading, setLoading] = useState(true)
  const [totalSpend, setTotalSpend] = useState(0)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [statusFilter, setStatusFilter] = useState("")
  const [methodFilter, setMethodFilter] = useState("")
  const [search, setSearch] = useState("")
  const limit = 15

  const fetchTransactions = useCallback(async () => {
    setLoading(true)
    try {
      const [txnRes, statsRes] = await Promise.all([
        transactionAPI.getMyTransactions({ page, limit, status: statusFilter || undefined, method: methodFilter || undefined }),
        transactionAPI.getTransactionStats(),
      ])
      if (txnRes.success && txnRes.data) {
        setTransactions(txnRes.data.transactions)
        setTotal(txnRes.data.pagination.total)
      }
      if (statsRes.success && statsRes.data) {
        setTotalSpend(statsRes.data.totalSpend ?? 0)
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to load transactions")
    } finally {
      setLoading(false)
    }
  }, [page, statusFilter, methodFilter])

  useEffect(() => { fetchTransactions() }, [fetchTransactions])
  useEffect(() => { setPage(1) }, [statusFilter, methodFilter])

  const filtered = search
    ? transactions.filter((t) => t.transactionId?.toLowerCase().includes(search.toLowerCase()))
    : transactions

  const totalPages = Math.max(1, Math.ceil(total / limit))

  return (
    <div className="p-6 lg:p-8">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Transactions</h1>
        <p className="mt-1 text-sm text-gray-500">View your payment and refund history</p>
      </motion.div>

      <div className="mb-6 rounded-xl border bg-gradient-to-r from-emerald-500 to-emerald-600 p-5 text-white shadow-lg">
        <p className="text-sm font-medium text-white/70">Total Spend</p>
        <p className="mt-1 text-3xl font-bold">${totalSpend.toLocaleString("en-US", { minimumFractionDigits: 2 })}</p>
      </div>

      <div className="mb-5 flex flex-wrap gap-3">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-500"
        >
          <option value="">All statuses</option>
          <option value="success">Success</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
          <option value="refunded">Refunded</option>
        </select>
        <select
          value={methodFilter}
          onChange={(e) => setMethodFilter(e.target.value)}
          className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-500"
        >
          <option value="">All methods</option>
          <option value="card">Card</option>
          <option value="bank">Bank</option>
        </select>
        <input
          placeholder="Search by Transaction ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-64 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-500"
        />
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-14 animate-pulse rounded-xl bg-gray-100" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <svg className="mb-4 h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p className="text-sm font-medium">No transactions found</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto rounded-xl border">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-gray-50 text-xs font-medium uppercase text-gray-500">
                <tr>
                  <th className="px-4 py-3">Transaction ID</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Description</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Method</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filtered.map((t) => (
                  <tr key={t._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-xs text-gray-500">{t.transactionId?.slice(0, 20)}…</td>
                    <td className="px-4 py-3 text-gray-700">{new Date(t.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-gray-700">{t.description || "—"}</td>
                    <td className={`px-4 py-3 font-medium ${t.type === "refund" ? "text-red-600" : "text-gray-900"}`}>
                      {t.type === "refund" ? "-" : "+"}${t.amount.toFixed(2)}
                    </td>
                    <td className="px-4 py-3">{METHOD_LABELS[t.method] || t.method}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${STATUS_STYLES[t.status] || ""}`}>
                        {t.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-center gap-2">
              <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page <= 1} className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-40">Previous</button>
              <span className="text-sm text-gray-500">Page {page} of {totalPages}</span>
              <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page >= totalPages} className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-40">Next</button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
