"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { toast } from "sonner"
import { Building2, Landmark, CreditCard, MapPin, Hash, Globe, Save } from "lucide-react"
import { getPayoutMethod, savePayoutMethod, type PayoutMethod } from "@/lib/api/Host/payout-api"

const inputClass = "w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-700 outline-none transition-all placeholder-gray-400 hover:border-violet-300 focus:border-violet-400 focus:ring-2 focus:ring-violet-100"

export default function HostPayoutSettingsPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [existing, setExisting] = useState<PayoutMethod | null>(null)
  const [form, setForm] = useState({
    accountHolder: "",
    bankName: "",
    accountNumber: "",
    routingNumber: "",
    swiftCode: "",
    bankAddress: "",
  })

  useEffect(() => {
    ;(async () => {
      try {
        const res = await getPayoutMethod()
        if (res.success && res.data) {
          setExisting(res.data)
          setForm({
            accountHolder: res.data.accountHolder || "",
            bankName: res.data.bankName || "",
            accountNumber: "",
            routingNumber: "",
            swiftCode: "",
            bankAddress: res.data.bankAddress || "",
          })
        }
      } catch (err: any) {
        toast.error(err.message || "Failed to load payout settings")
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.accountHolder.trim() || !form.bankName.trim() || !form.accountNumber.trim()) {
      toast.error("Account holder, bank name, and account number are required")
      return
    }
    setSaving(true)
    try {
      const res = await savePayoutMethod(form)
      if (res.success) {
        toast.success(res.message || "Payout method saved")
        const updated = await getPayoutMethod()
        if (updated.success && updated.data) setExisting(updated.data)
      } else {
        toast.error(res.message || "Failed to save")
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to save payout method")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-violet-50/40 p-6 lg:p-8">
        <div className="mb-8 h-8 w-56 animate-pulse rounded-lg bg-gray-200" />
        <div className="mx-auto max-w-2xl space-y-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-12 animate-pulse rounded-xl bg-gray-100" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-violet-50/40 p-6 lg:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="mb-8"
      >
        <h1 className="text-2xl font-bold text-gray-900">Payout Settings</h1>
        <p className="mt-1 text-sm text-gray-500">Manage your bank account details for receiving payouts</p>
      </motion.div>

      {existing && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08, type: "spring", stiffness: 100, damping: 20 }}
          className="mx-auto mb-8 max-w-2xl rounded-2xl border border-emerald-100 bg-emerald-50/50 p-5 shadow-sm"
        >
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-emerald-700">Currently Saved</h2>
          <dl className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
            <div><dt className="text-gray-500">Holder</dt><dd className="font-medium text-gray-900">{existing.accountHolder}</dd></div>
            <div><dt className="text-gray-500">Bank</dt><dd className="font-medium text-gray-900">{existing.bankName}</dd></div>
            <div><dt className="text-gray-500">Account</dt><dd className="font-medium text-gray-900">{existing.accountNumber}</dd></div>
            <div><dt className="text-gray-500">Routing</dt><dd className="font-medium text-gray-900">{existing.routingNumber}</dd></div>
            <div><dt className="text-gray-500">SWIFT</dt><dd className="font-medium text-gray-900">{existing.swiftCode}</dd></div>
            <div><dt className="text-gray-500">Address</dt><dd className="font-medium text-gray-900">{existing.bankAddress || "—"}</dd></div>
          </dl>
        </motion.div>
      )}

      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.12, type: "spring", stiffness: 100, damping: 20 }}
        className="mx-auto max-w-2xl space-y-5 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8"
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-500">Account Holder Name *</label>
            <div className="relative">
              <CreditCard className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                value={form.accountHolder}
                onChange={(e) => setForm({ ...form, accountHolder: e.target.value })}
                placeholder="John Doe"
                className={`${inputClass} pl-9`}
              />
            </div>
          </div>

          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-500">Bank Name *</label>
            <div className="relative">
              <Landmark className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                value={form.bankName}
                onChange={(e) => setForm({ ...form, bankName: e.target.value })}
                placeholder="Chase Bank"
                className={`${inputClass} pl-9`}
              />
            </div>
          </div>

          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-500">Account Number *</label>
            <div className="relative">
              <Building2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                value={form.accountNumber}
                onChange={(e) => setForm({ ...form, accountNumber: e.target.value })}
                placeholder="••••••••"
                type="text"
                className={`${inputClass} pl-9`}
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-500">Routing Number</label>
            <div className="relative">
              <Hash className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                value={form.routingNumber}
                onChange={(e) => setForm({ ...form, routingNumber: e.target.value })}
                placeholder="021000021"
                className={`${inputClass} pl-9`}
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-500">SWIFT Code</label>
            <div className="relative">
              <Globe className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                value={form.swiftCode}
                onChange={(e) => setForm({ ...form, swiftCode: e.target.value })}
                placeholder="BOFAUS3N"
                className={`${inputClass} pl-9`}
              />
            </div>
          </div>

          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-500">Bank Address</label>
            <div className="relative">
              <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                value={form.bankAddress}
                onChange={(e) => setForm({ ...form, bankAddress: e.target.value })}
                placeholder="123 Main St, New York, NY 10001"
                className={`${inputClass} pl-9`}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-gray-100 pt-5">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 to-indigo-500 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/30 transition-all hover:from-violet-600 hover:to-indigo-600 disabled:opacity-60"
          >
            <Save className="h-4 w-4" />
            {saving ? "Saving…" : existing ? "Update Payout Method" : "Save Payout Method"}
          </button>
        </div>
      </motion.form>
    </div>
  )
}
