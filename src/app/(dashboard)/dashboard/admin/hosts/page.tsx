"use client"

import { useEffect, useState, useCallback, useMemo } from "react"
import { motion } from "framer-motion"
import { toast } from "sonner"
import { Shield, Search, Ban, CheckCircle, MoreHorizontal } from "lucide-react"
import ConfirmModal from "@/Components/Dashboard/ConfirmModal"
import { getUsersList, adminUpdateUserStatus, adminUpdateUserRole } from "@/lib/action/admin-users"

interface Host {
  id: string
  name: string
  email: string
  emailVerified: boolean
  image: string | null
  role: string
  banned?: boolean
  banReason?: string
  createdAt: string
}

export default function AdminHostsPage() {
  const [hosts, setHosts] = useState<Host[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [actionHost, setActionHost] = useState<Host | null>(null)
  const [actionType, setActionType] = useState<"ban" | "unban" | null>(null)
  const [actionLoading, setActionLoading] = useState(false)

  const fetchHosts = useCallback(async () => {
    setLoading(true)
    try {
      const res = await getUsersList()
      if (res.success) {
        const all = (res.data?.users ?? []) as Host[]
        setHosts(all.filter((u) => u.role === "host"))
      } else {
        toast.error(res.message || "Failed to load hosts")
      }
    } catch {
      toast.error("Failed to load hosts")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchHosts() }, [fetchHosts])

  const filtered = useMemo(
    () => hosts.filter((h) => `${h.name} ${h.email}`.toLowerCase().includes(search.toLowerCase())),
    [hosts, search],
  )

  async function handleAction() {
    if (!actionHost || !actionType) return
    setActionLoading(true)
    try {
      const isBan = actionType === "ban"
      const res = await adminUpdateUserStatus(actionHost.id, isBan)
      if (res.success) {
        toast.success(isBan ? "Host banned" : "Host unbanned")
        setHosts((prev) => prev.map((h) => (h.id === actionHost.id ? { ...h, banned: isBan } : h)))
      } else {
        toast.error(res.message || "Action failed")
      }
    } catch {
      toast.error("Something went wrong")
    } finally {
      setActionLoading(false)
      setActionHost(null)
      setActionType(null)
    }
  }

  return (
    <div className="space-y-6 p-6">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100">
            <Shield className="h-5 w-5 text-purple-600" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900">Manage Hosts</h1>
            <p className="text-sm text-slate-500">{hosts.length} registered hosts</p>
          </div>
        </div>
      </motion.div>

      <div className="relative max-w-xs">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search hosts..."
          className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition-all focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
        />
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-16 animate-pulse rounded-xl bg-slate-100" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-100 bg-white py-16">
          <Shield className="h-10 w-10 text-slate-300" />
          <p className="mt-3 text-sm font-medium text-slate-500">{search ? "No hosts match your search" : "No hosts found"}</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
          <div className="divide-y divide-slate-50">
            {filtered.map((host, i) => (
              <motion.div
                key={host.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="flex items-center gap-4 px-6 py-4 transition-colors hover:bg-slate-50/50"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-purple-100 to-indigo-100 text-sm font-bold text-purple-600">
                  {host.image ? (
                    <img src={host.image} alt={host.name} className="h-full w-full object-cover" />
                  ) : (
                    host.name?.charAt(0)?.toUpperCase() || "H"
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-slate-900">{host.name}</p>
                  <p className="truncate text-xs text-slate-500">{host.email}</p>
                </div>
                <div className="hidden text-right text-xs text-slate-400 sm:block">
                  {new Date(host.createdAt).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-2">
                  {host.banned ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-red-600">
                      <Ban className="h-3 w-3" /> Banned
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-600">
                      <CheckCircle className="h-3 w-3" /> Active
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      setActionHost(host)
                      setActionType(host.banned ? "unban" : "ban")
                    }}
                    className={`rounded-lg p-2 text-xs font-semibold transition-colors ${
                      host.banned
                        ? "text-emerald-600 hover:bg-emerald-50"
                        : "text-red-500 hover:bg-red-50"
                    }`}
                    title={host.banned ? "Unban host" : "Ban host"}
                  >
                    {host.banned ? <CheckCircle className="h-4 w-4" /> : <Ban className="h-4 w-4" />}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={!!actionHost && !!actionType}
        onClose={() => { setActionHost(null); setActionType(null) }}
        onConfirm={handleAction}
        title={actionType === "ban" ? "Ban Host" : "Unban Host"}
        message={
          actionType === "ban"
            ? `Are you sure you want to ban ${actionHost?.name}? They will not be able to list properties.`
            : `Are you sure you want to unban ${actionHost?.name}? They will regain full access.`
        }
        confirmText={actionType === "ban" ? "Ban" : "Unban"}
        variant={actionType === "ban" ? "danger" : "info"}
        loading={actionLoading}
      />
    </div>
  )
}
