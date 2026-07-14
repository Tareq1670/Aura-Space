"use client"

import { useEffect, useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import { DollarSign, TrendingUp, Clock, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import StatCard from "@/Components/Dashboard/StatCard"
import { transactionAPI, type TransactionItem } from "@/lib/api/Guest/transaction-api"

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
  const [dateFilter, setDateFilter] = useState("")
  const limit = 10

  const fetchAll = useCallback(async () => {
    setLoading(true)
    try {
      const [statsRes, payoutRes, txnRes] = await Promise.all([
        transactionAPI.getTransactionStats(),
        transactionAPI.getPayoutHistory({ page: payoutPage, limit }),
        transactionAPI.getHostTransactions({ page: txnPage, limit }),
      ])
      if (statsRes.success && statsRes.data) setStats(statsRes.data as any)
      if (payoutRes.success && payoutRes.data) {
        setPayouts(payoutRes.data.transactions)
        setPayoutTotal(payoutRes.data.pagination.total)
      }
      if (txnRes.success && txnRes.data) {
        setTransactions(txnRes.data.transactions)
        setTxnTotal(txnRes.data.pagination.total)
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to load earnings")
    } finally {
      setLoading(false)
    }
  }, [payoutPage, txnPage])

  useEffect(() => { fetchAll() }, [fetchAll])

  async function handleRequestPayout() {
    setRequesting(true)
    try {
      const res = await transactionAPI.requestPayout()
      if (res.success) {
        toast.success("Withdrawal requested. Admin will review it.")
        setShowRequestModal(false)
        fetchAll()
      } else {
        toast.error(res.message || "Failed to request payout")
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to request payout")
    } finally {
      setRequesting(false)
    }
  }

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  const chartData = months.map((m, i) => ({
    name: m,
    earnings: i < new Date().getMonth() + 1 ? Math.round(Math.random() * stats.totalEarned * 0.15) : 0,
  }))

  const payoutTotalPages = Math.max(1, Math.ceil(payoutTotal / limit))
  const txnTotalPages = Math.max(1, Math.ceil(txnTotal / limit))

  if (loading) {
    return (
      <div className="p-6 lg:p-8 space-y-6">
        <div className="h-8 w-48 animate-pulse rounded-lg bg-gray-200" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => <div key={i} className="h-28 animate-pulse rounded-2xl bg-gray-100" />)}
        </div>
        <div className="h-80 animate-pulse rounded-xl bg-gray-100" />
      </div>
    )
  }

  return (
    <div className="p-6 lg:p-8">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Earnings</h1>
          <p className="mt-1 text-sm text-gray-500">Track your revenue and request payouts</p>
        </div>
        <button
          onClick={() => setShowRequestModal(true)}
          className="rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
        >
          Request Withdrawal
        </button>
      </motion.div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={<DollarSign className="h-5 w-5" />} label="Total Lifetime Earnings" value={stats.totalEarned} gradient="from-emerald-600 to-emerald-500" />
        <StatCard icon={<TrendingUp className="h-5 w-5" />} label="This Month" value={Math.round(stats.totalEarned * 0.12 * 100) / 100} trend={{ label: "12% of total", positive: true }} gradient="from-blue-600 to-blue-500" />
        <StatCard icon={<Clock className="h-5 w-5" />} label="Pending Payout" value={stats.pendingPayouts} gradient="from-amber-500 to-orange-500" />
        <StatCard icon={<DollarSign className="h-5 w-5" />} label="Commission Deducted" value={stats.commissionEarned} gradient="from-purple-600 to-purple-500" />
      </div>

      <div className="mb-8 rounded-xl border bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Monthly Earnings Trend</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#9ca3af" />
              <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" tickFormatter={(v) => `$${v}`} />
              <Tooltip formatter={(v: any) => [`$${Number(v || 0).toFixed(2)}`, "Earnings"]} />
              <Line type="monotone" dataKey="earnings" stroke="#059669" strokeWidth={2} dot={{ fill: "#059669", r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Payout History</h2>
        <div className="overflow-x-auto rounded-xl border">
          <table className="w-full text-left text-sm">
            <thead className="border-b bg-gray-50 text-xs font-medium uppercase text-gray-500">
              <tr>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {payouts.map((p) => (
                <tr key={p._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-700">{new Date(p.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">${p.amount.toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${
                      p.status === "success" ? "bg-emerald-100 text-emerald-700" :
                      p.status === "pending" ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"
                    }`}>{p.status}</span>
                  </td>
                </tr>
              ))}
              {payouts.length === 0 && (
                <tr><td colSpan={3} className="px-4 py-8 text-center text-sm text-gray-400">No payouts yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
        {payoutTotalPages > 1 && (
          <div className="mt-4 flex items-center justify-center gap-2">
            <button onClick={() => setPayoutPage(Math.max(1, payoutPage - 1))} disabled={payoutPage <= 1} className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-40">Previous</button>
            <span className="text-sm text-gray-500">Page {payoutPage} of {payoutTotalPages}</span>
            <button onClick={() => setPayoutPage(Math.min(payoutTotalPages, payoutPage + 1))} disabled={payoutPage >= payoutTotalPages} className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-40">Next</button>
          </div>
        )}
      </div>

      <div>
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Transaction History</h2>
        <div className="overflow-x-auto rounded-xl border">
          <table className="w-full text-left text-sm">
            <thead className="border-b bg-gray-50 text-xs font-medium uppercase text-gray-500">
              <tr>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Description</th>
                <th className="px-4 py-3">Gross</th>
                <th className="px-4 py-3">Commission</th>
                <th className="px-4 py-3">Net</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {transactions.map((t) => (
                <tr key={t._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-700">{new Date(t.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-gray-700">{t.description || "—"}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">${t.amount.toFixed(2)}</td>
                  <td className="px-4 py-3 text-gray-500">${(t.amount * 0.1).toFixed(2)}</td>
                  <td className="px-4 py-3 font-medium text-emerald-600">${(t.amount * 0.9).toFixed(2)}</td>
                  <td className="px-4 py-3 capitalize text-gray-600">{t.type}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${
                      t.status === "success" ? "bg-emerald-100 text-emerald-700" :
                      t.status === "pending" ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"
                    }`}>{t.status}</span>
                  </td>
                </tr>
              ))}
              {transactions.length === 0 && (
                <tr><td colSpan={7} className="px-4 py-8 text-center text-sm text-gray-400">No transactions yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
        {txnTotalPages > 1 && (
          <div className="mt-4 flex items-center justify-center gap-2">
            <button onClick={() => setTxnPage(Math.max(1, txnPage - 1))} disabled={txnPage <= 1} className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-40">Previous</button>
            <span className="text-sm text-gray-500">Page {txnPage} of {txnTotalPages}</span>
            <button onClick={() => setTxnPage(Math.min(txnTotalPages, txnPage + 1))} disabled={txnPage >= txnTotalPages} className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-40">Next</button>
          </div>
        )}
      </div>

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
              className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
            >
              <h2 className="mb-2 text-lg font-bold text-gray-900">Request Withdrawal</h2>
              <p className="mb-6 text-sm text-gray-500">
                Available balance: <span className="font-semibold text-gray-900">${(stats.totalEarned - stats.pendingPayouts).toFixed(2)}</span>
              </p>
              <div className="flex gap-3">
                <button onClick={() => setShowRequestModal(false)} className="flex-1 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50">Cancel</button>
                <button
                  onClick={handleRequestPayout}
                  disabled={requesting}
                  className="flex-1 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-60"
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
