"use client"

import { useEffect, useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Select, ListBox, Skeleton } from "@heroui/react"
import { toast } from "sonner"
import DataTable from "@/Components/Dashboard/DataTable"
import type { Column } from "@/Components/Dashboard/DataTable"
import ConfirmModal from "@/Components/Dashboard/ConfirmModal"
import { exportToCSV } from "@/lib/utils/csv-export"
import {
    getAdminProperties,
    approveProperty,
    rejectProperty,
    toggleFeatured,
    deleteAdminProperty,
} from "@/lib/action/admin-properties"

interface PropertyRecord {
    id: string
    hostId: string
    hostName?: string
    title: string
    description: string
    category: string
    location: { address: string; city: string; country: string }
    price: { perNight: number; cleaningFee?: number; serviceFee?: number }
    details: { bedrooms: number; bathrooms: number; maxGuests: number }
    amenities: string[]
    images: string[]
    status: string
    rating: number
    reviewCount: number
    isFeatured: boolean
    rejectionReason: string | null
    createdAt: string
    updatedAt: string
}

type PropertyRow = PropertyRecord & Record<string, unknown>

const STATUS_CONFIG: Record<string, { bg: string; text: string; dot: string }> = {
    active: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" },
    inactive: { bg: "bg-gray-50", text: "text-gray-600", dot: "bg-gray-400" },
    pending: { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-400" },
    rejected: { bg: "bg-red-50", text: "text-red-700", dot: "bg-red-400" },
    draft: { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-400" },
    deleted: { bg: "bg-rose-50", text: "text-rose-700", dot: "bg-rose-400" },
}

const CATEGORY_LABELS: Record<string, string> = {
    hotel: "Hotel",
    apartment: "Apartment",
    villa: "Villa",
    "event-space": "Event Space",
}

const STATUS_OPTIONS = [
    { id: "all", label: "All Status" },
    { id: "pending", label: "Pending" },
    { id: "active", label: "Active" },
    { id: "inactive", label: "Inactive" },
    { id: "rejected", label: "Rejected" },
    { id: "draft", label: "Draft" },
]

const CATEGORY_OPTIONS = [
    { id: "all", label: "All Categories" },
    { id: "hotel", label: "Hotel" },
    { id: "apartment", label: "Apartment" },
    { id: "villa", label: "Villa" },
    { id: "event-space", label: "Event Space" },
]

function AdminPropertiesSkeleton() {
    return (
        <div className="p-6 lg:p-8">
            <div className="mb-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-2">
                        <Skeleton className="h-8 w-40 rounded-lg" />
                        <Skeleton className="h-4 w-64 rounded-lg" />
                    </div>
                    <Skeleton className="h-10 w-28 rounded-lg" />
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                    {["Total", "Active", "Pending", "Draft", "Rejected"].map((label) => (
                        <div key={label} className="rounded-xl bg-gray-50 p-4">
                            <Skeleton className="mb-2 h-8 w-12 rounded-lg" />
                            <Skeleton className="h-3 w-16 rounded-lg" />
                        </div>
                    ))}
                </div>

                <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
                    <Skeleton className="h-10 w-full sm:w-64 rounded-lg" />
                    <Skeleton className="h-10 w-full sm:w-44 rounded-lg" />
                    <Skeleton className="h-10 w-full sm:w-44 rounded-lg" />
                </div>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">
                <div className="flex flex-col items-start justify-between gap-3 border-b border-gray-100 p-4 sm:flex-row sm:items-center">
                    <Skeleton className="h-9 w-full sm:w-72 rounded-xl" />
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-9 w-24 rounded-xl" />
                        <Skeleton className="h-9 w-20 rounded-xl" />
                    </div>
                </div>

                <div className="hidden border-b border-gray-100 bg-gray-50/70 px-5 py-3 sm:grid sm:grid-cols-[80px_1fr_100px_1fr_100px_110px_100px_90px_90px_120px_100px]">
                    {["Image", "Title", "Host", "Location", "Price", "Status", "Featured", "Rating", "Bookings", "Created", "Actions"].map((h) => (
                        <Skeleton key={h} className="h-3 w-12 rounded" />
                    ))}
                </div>

                <div className="divide-y divide-gray-50">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div
                            key={i}
                            className="flex flex-col gap-3 px-4 py-4 sm:grid sm:grid-cols-[80px_1fr_100px_1fr_100px_110px_100px_90px_90px_120px_100px] sm:items-center sm:gap-4"
                        >
                            <Skeleton className="h-10 w-14 rounded-lg" />
                            <div className="space-y-2">
                                <Skeleton className="h-3 w-36 rounded-lg" />
                                <Skeleton className="h-3 w-20 rounded-lg" />
                            </div>
                            <Skeleton className="h-4 w-16 rounded-lg" />
                            <Skeleton className="h-4 w-24 rounded-lg" />
                            <Skeleton className="h-4 w-16 rounded-lg" />
                            <Skeleton className="h-6 w-20 rounded-full" />
                            <Skeleton className="h-5 w-10 rounded-full" />
                            <Skeleton className="h-4 w-12 rounded-lg" />
                            <Skeleton className="h-4 w-12 rounded-lg" />
                            <Skeleton className="h-4 w-24 rounded-lg" />
                            <div className="flex items-center gap-1">
                                <Skeleton className="h-8 w-8 rounded-lg" />
                                <Skeleton className="h-8 w-8 rounded-lg" />
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex flex-col items-center justify-between gap-3 border-t border-gray-100 px-5 py-4 sm:flex-row">
                    <Skeleton className="h-4 w-40 rounded-lg" />
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-8 w-8 rounded-lg" />
                        <Skeleton className="h-8 w-8 rounded-lg" />
                        <Skeleton className="h-8 w-8 rounded-lg" />
                        <Skeleton className="h-8 w-8 rounded-lg" />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function AdminPropertiesPage() {
    const [properties, setProperties] = useState<PropertyRecord[]>([])
    const [stats, setStats] = useState<Record<string, number>>({})
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")
    const [categoryFilter, setCategoryFilter] = useState("all")
    const [selectedProperty, setSelectedProperty] = useState<PropertyRecord | null>(null)
    const [approveId, setApproveId] = useState<string | null>(null)
    const [rejectId, setRejectId] = useState<string | null>(null)
    const [rejectReason, setRejectReason] = useState("")
    const [featuredLoading, setFeaturedLoading] = useState<string | null>(null)
    const [deleteId, setDeleteId] = useState<string | null>(null)
    const [processing, setProcessing] = useState(false)
    const [detailsModalOpen, setDetailsModalOpen] = useState(false)
    const [refreshKey, setRefreshKey] = useState(0)

    useEffect(() => {
        let mounted = true
        ;(async () => {
            try {
                const res = await getAdminProperties({
                    status: statusFilter !== "all" ? statusFilter : undefined,
                    category: categoryFilter !== "all" ? categoryFilter : undefined,
                    search: search || undefined,
                    limit: 100,
                })
                if (!mounted) return
                if (res.success && res.data) {
                    setProperties((res.data.properties as PropertyRecord[]) || [])
                    setStats((res.data.stats as Record<string, number>) || {})
                } else {
                    toast.error(res.message || "Failed to load properties")
                }
            } catch (err: any) {
                if (!mounted) return
                toast.error(err.message || "Failed to load properties")
            } finally {
                if (mounted) setLoading(false)
            }
        })()
        return () => { mounted = false }
    }, [statusFilter, categoryFilter, search, refreshKey])

    const pendingProperties = useMemo(
        () => properties.filter((p) => p.status === "pending"),
        [properties],
    )

    const handleApprove = useCallback(async () => {
        if (!approveId) return
        setProcessing(true)
        try {
            const res = await approveProperty(approveId)
            if (res.success) {
                toast.success("Property approved and published")
                setApproveId(null)
                setRefreshKey(k => k + 1)
            } else {
                toast.error(res.message || "Failed to approve property")
            }
        } catch {
            toast.error("Failed to approve property")
        } finally {
            setProcessing(false)
        }
    }, [approveId])

    const handleReject = useCallback(async () => {
        if (!rejectId || !rejectReason.trim()) return
        setProcessing(true)
        try {
            const res = await rejectProperty(rejectId, rejectReason.trim())
            if (res.success) {
                toast.success("Property rejected")
                setRejectId(null)
                setRejectReason("")
                setRefreshKey(k => k + 1)
            } else {
                toast.error(res.message || "Failed to reject property")
            }
        } catch {
            toast.error("Failed to reject property")
        } finally {
            setProcessing(false)
        }
    }, [rejectId, rejectReason])

    const handleToggleFeatured = useCallback(async (id: string, current: boolean) => {
        setFeaturedLoading(id)
        try {
            const res = await toggleFeatured(id, !current)
            if (res.success) {
                toast.success(current ? "Property unfeatured" : "Property featured")
                setProperties((prev) =>
                    prev.map((p) => (p.id === id ? { ...p, isFeatured: !current } : p)),
                )
            } else {
                toast.error(res.message || "Failed to toggle featured")
            }
        } catch {
            toast.error("Failed to toggle featured")
        } finally {
            setFeaturedLoading(null)
        }
    }, [])

    const handleDelete = useCallback(async () => {
        if (!deleteId) return
        setProcessing(true)
        try {
            const res = await deleteAdminProperty(deleteId)
            if (res.success) {
                toast.success("Property permanently deleted")
                setDeleteId(null)
                setRefreshKey(k => k + 1)
            } else {
                toast.error(res.message || "Failed to delete property")
            }
        } catch {
            toast.error("Failed to delete property")
        } finally {
            setProcessing(false)
        }
    }, [deleteId])

    const handleExport = useCallback(() => {
        const data = properties.map((p) => ({
            id: p.id,
            title: p.title,
            hostId: p.hostId,
            category: CATEGORY_LABELS[p.category] || p.category,
            city: p.location?.city || "",
            country: p.location?.country || "",
            price: p.price?.perNight || 0,
            status: p.status,
            isFeatured: p.isFeatured ? "Yes" : "No",
            rating: p.rating,
            bookings: p.reviewCount,
            createdAt: p.createdAt,
        }))
        exportToCSV(
            data as unknown as Record<string, unknown>[],
            [
                { key: "id", label: "ID" },
                { key: "title", label: "Title" },
                { key: "hostId", label: "Host ID" },
                { key: "category", label: "Category" },
                { key: "city", label: "City" },
                { key: "country", label: "Country" },
                { key: "price", label: "Price Per Night" },
                { key: "status", label: "Status" },
                { key: "isFeatured", label: "Featured" },
                { key: "rating", label: "Rating" },
                { key: "bookings", label: "Bookings" },
                { key: "createdAt", label: "Created" },
            ],
            "admin-properties",
        )
        toast.success(`Exported ${properties.length} properties to CSV`)
    }, [properties])

    const statCards = useMemo(
        () => [
            { label: "Total", value: stats.total ?? properties.length, color: "text-violet-600", bg: "bg-violet-50" },
            { label: "Active", value: stats.active ?? 0, color: "text-emerald-600", bg: "bg-emerald-50" },
            { label: "Pending", value: stats.pending ?? 0, color: "text-amber-600", bg: "bg-amber-50" },
            { label: "Draft", value: stats.draft ?? 0, color: "text-blue-600", bg: "bg-blue-50" },
            { label: "Rejected", value: stats.rejected ?? 0, color: "text-red-600", bg: "bg-red-50" },
        ],
        [stats, properties.length],
    )

    const columns: Column<PropertyRow>[] = useMemo(
        () => [
            {
                key: "image",
                header: "Image",
                accessor: (r) => r.images?.[0] || "",
                render: (r, val) => (
                    <div className="h-10 w-14 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                        {val ? (
                            <img src={val as string} alt={r.title as string} className="h-full w-full object-cover" />
                        ) : (
                            <div className="flex h-full items-center justify-center text-gray-400">
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                        )}
                    </div>
                ),
                width: "80px",
            },
            {
                key: "title",
                header: "Title",
                sortable: true,
                accessor: (r) => r.title,
                render: (r, val) => (
                    <div className="max-w-[200px]">
                        <p className="truncate text-sm font-medium text-gray-900">{val as string}</p>
                        <p className="text-xs text-gray-400">{CATEGORY_LABELS[r.category as string] || (r.category as string)}</p>
                    </div>
                ),
            },
            {
                key: "hostId",
                header: "Host",
                accessor: (r) => r.hostId,
                render: (r, val) => (
                    <span className="font-mono text-xs text-gray-400">{String(val).slice(-8)}</span>
                ),
                width: "100px",
            },
            {
                key: "location",
                header: "Location",
                accessor: (r) => r.location,
                render: (r) => {
                    const loc = r.location as { city?: string; country?: string } | undefined
                    return (
                        <span className="text-sm text-gray-600">
                            {loc?.city || "—"}{loc?.country ? `, ${loc.country}` : ""}
                        </span>
                    )
                },
            },
            {
                key: "price",
                header: "Price",
                sortable: true,
                accessor: (r) => r.price,
                render: (r) => {
                    const p = r.price as { perNight?: number } | undefined
                    return <span className="font-semibold text-gray-900">${p?.perNight ?? 0}/night</span>
                },
                width: "100px",
            },
            {
                key: "status",
                header: "Status",
                sortable: true,
                accessor: (r) => r.status,
                render: (r, val) => {
                    const s = val as string
                    const c = STATUS_CONFIG[s] || { bg: "bg-gray-50", text: "text-gray-600", dot: "bg-gray-400" }
                    return (
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${c.bg} ${c.text}`}>
                            <span className={`h-1.5 w-1.5 rounded-full ${c.dot}`} />
                            {s.charAt(0).toUpperCase() + s.slice(1)}
                        </span>
                    )
                },
                width: "110px",
            },
            {
                key: "isFeatured",
                header: "Featured",
                accessor: (r) => r.isFeatured,
                render: (r, val) => {
                    const id = r.id as string
                    const featured = Boolean(val)
                    const loading = featuredLoading === id
                    return (
                        <button
                            onClick={(e) => { e.stopPropagation(); handleToggleFeatured(id, featured) }}
                            disabled={loading}
                            className={`relative inline-flex h-6 w-10 items-center rounded-full transition-colors ${
                                featured ? "bg-amber-400" : "bg-gray-200"
                            } ${loading ? "opacity-50" : "cursor-pointer"}`}
                        >
                            <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${
                                    featured ? "translate-x-5" : "translate-x-1"
                                }`}
                            />
                        </button>
                    )
                },
                width: "100px",
            },
            {
                key: "rating",
                header: "Rating",
                sortable: true,
                accessor: (r) => r.rating,
                render: (r, val) => {
                    const rating = Number(val) || 0
                    return (
                        <span className="text-sm text-gray-700">
                            {rating > 0 ? `${rating.toFixed(1)} ★` : "—"}
                        </span>
                    )
                },
                width: "90px",
            },
            {
                key: "reviewCount",
                header: "Bookings",
                sortable: true,
                accessor: (r) => r.reviewCount,
                width: "90px",
            },
            {
                key: "createdAt",
                header: "Created",
                sortable: true,
                accessor: (r) => new Date(r.createdAt),
                render: (r, val) => (
                    <span className="text-xs text-gray-500">
                        {new Date(val as string).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                ),
                width: "120px",
            },
            {
                key: "actions",
                header: "Actions",
                accessor: (r) => r.id,
                render: (r) => {
                    const id = r.id as string
                    return (
                        <div className="flex items-center gap-1">
                            <button
                                onClick={(e) => { e.stopPropagation(); setSelectedProperty(r as unknown as PropertyRecord); setDetailsModalOpen(true) }}
                                className="rounded-lg border border-gray-200 p-1.5 text-gray-500 transition hover:bg-gray-50 hover:text-violet-600"
                                title="View Details"
                            >
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); setDeleteId(id) }}
                                className="rounded-lg border border-gray-200 p-1.5 text-gray-500 transition hover:bg-red-50 hover:text-red-600"
                                title="Delete"
                            >
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        </div>
                    )
                },
                width: "100px",
            },
        ],
        [featuredLoading, handleToggleFeatured],
    )

    if (loading) {
        return <AdminPropertiesSkeleton />
    }

    return (
        <div className="p-6 lg:p-8">
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Properties</h1>
                        <p className="mt-1 text-sm text-gray-500">Manage all properties across the platform</p>
                    </div>
                    <button
                        onClick={handleExport}
                        className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                    >
                        Export CSV
                    </button>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                    {statCards.map((card) => (
                        <div key={card.label} className={`rounded-xl ${card.bg} p-4`}>
                            <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
                            <p className="mt-1 text-xs font-medium text-gray-500">{card.label}</p>
                        </div>
                    ))}
                </div>

                <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
                    <div className="w-full sm:w-64">
                        <input
                            placeholder="Search by title..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-500"
                        />
                    </div>
                    <div className="w-full sm:w-44">
                        <Select
                            placeholder="All Status"
                            aria-label="Filter by status"
                            selectedKey={statusFilter}
                            onSelectionChange={(key) => setStatusFilter(String(key))}
                        >
                            <Select.Trigger className="bg-white border border-gray-200">
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
                    </div>
                    <div className="w-full sm:w-44">
                        <Select
                            placeholder="All Categories"
                            aria-label="Filter by category"
                            selectedKey={categoryFilter}
                            onSelectionChange={(key) => setCategoryFilter(String(key))}
                        >
                            <Select.Trigger className="bg-white border border-gray-200">
                                <Select.Value />
                                <Select.Indicator />
                            </Select.Trigger>
                            <Select.Popover>
                                <ListBox>
                                    {CATEGORY_OPTIONS.map((opt) => (
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

            {pendingProperties.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 rounded-2xl border border-amber-200 bg-amber-50/50 p-4"
                >
                    <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-amber-800">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-200 text-[10px] font-bold text-amber-700">
                            {pendingProperties.length}
                        </span>
                        Pending Approval
                    </h2>
                    <div className="space-y-2">
                        {pendingProperties.slice(0, 5).map((p) => (
                            <div key={p.id} className="flex items-center justify-between rounded-xl bg-white px-4 py-3 shadow-sm">
                                <div className="flex items-center gap-3">
                                    <div className="h-8 w-12 overflow-hidden rounded-lg bg-gray-100">
                                        {p.images?.[0] ? (
                                            <img src={p.images[0]} alt={p.title} className="h-full w-full object-cover" />
                                        ) : (
                                            <div className="flex h-full items-center justify-center text-gray-300">
                                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">{p.title}</p>
                                        <p className="text-xs text-gray-500">{p.location?.city || "—"}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setApproveId(p.id)}
                                        className="rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-emerald-600"
                                    >
                                        Approve
                                    </button>
                                    <button
                                        onClick={() => { setRejectId(p.id); setRejectReason("") }}
                                        className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-50"
                                    >
                                        Reject
                                    </button>
                                </div>
                            </div>
                        ))}
                        {pendingProperties.length > 5 && (
                            <p className="text-center text-xs text-amber-600">
                                +{pendingProperties.length - 5} more pending
                            </p>
                        )}
                    </div>
                </motion.div>
            )}

            <DataTable<PropertyRow>
                data={properties as PropertyRow[]}
                columns={columns}
                searchPlaceholder="Search properties..."
                emptyMessage="No properties found"
                pageSize={25}
                pageSizeOptions={[10, 25, 50, 100]}
            />

            <ConfirmModal
                isOpen={!!approveId}
                onClose={() => setApproveId(null)}
                onConfirm={handleApprove}
                title="Approve Property"
                message="This will publish the property and make it visible to guests."
                confirmText="Approve"
                variant="info"
                loading={processing}
            />

            <AnimatePresence>
                {!!rejectId && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => { setRejectId(null); setRejectReason("") }}
                        className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/30 backdrop-blur-sm p-4"
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.92, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.92, y: 20 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full max-w-md rounded-2xl border border-gray-100 bg-white p-8 shadow-2xl"
                        >
                            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-red-100 bg-red-50">
                                <svg className="h-7 w-7 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                            </div>
                            <h3 className="mb-1 text-center text-xl font-bold text-gray-900">Reject Property</h3>
                            <p className="mb-6 text-center text-sm text-gray-500">
                                Provide a reason for rejecting this property.
                            </p>
                            <textarea
                                value={rejectReason}
                                onChange={(e) => setRejectReason(e.target.value)}
                                placeholder="Enter rejection reason..."
                                rows={3}
                                className="mb-6 w-full rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm outline-none transition focus:border-red-300 focus:bg-white focus:ring-2 focus:ring-red-100"
                            />
                            <p className="-mt-4 mb-6 text-xs text-gray-400">
                                {rejectReason.length}/500 characters
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => { setRejectId(null); setRejectReason("") }}
                                    disabled={processing}
                                    className="flex-1 rounded-xl border border-gray-200 bg-gray-50 py-2.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-100 disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleReject}
                                    disabled={processing || !rejectReason.trim() || rejectReason.trim().length < 5}
                                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-500 to-red-600 py-2.5 text-sm font-semibold text-white shadow-lg shadow-red-500/25 transition disabled:opacity-50"
                                >
                                    {processing && (
                                        <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                    )}
                                    Reject
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <ConfirmModal
                isOpen={!!deleteId}
                onClose={() => setDeleteId(null)}
                onConfirm={handleDelete}
                title="Delete Property"
                message="This will permanently delete this property. Active bookings may prevent deletion."
                confirmText="Delete"
                variant="danger"
                loading={processing}
            />

            <AnimatePresence>
                {detailsModalOpen && selectedProperty && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setDetailsModalOpen(false)}
                        className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/30 backdrop-blur-sm p-4"
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.92, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.92, y: 20 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full max-w-2xl rounded-2xl border border-gray-100 bg-white shadow-2xl"
                        >
                            <div className="relative">
                                <div className="h-48 overflow-hidden rounded-t-2xl bg-gray-100">
                                    {selectedProperty.images?.[0] ? (
                                        <img src={selectedProperty.images[0]} alt={selectedProperty.title} className="h-full w-full object-cover" />
                                    ) : (
                                        <div className="flex h-full items-center justify-center text-gray-300">
                                            <svg className="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                    )}
                                </div>
                                <button
                                    onClick={() => setDetailsModalOpen(false)}
                                    className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-gray-600 backdrop-blur-sm transition hover:bg-white"
                                >
                                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                                <div className="absolute bottom-3 left-3">
                                    <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-gray-700 backdrop-blur-sm">
                                        {CATEGORY_LABELS[selectedProperty.category] || selectedProperty.category}
                                    </span>
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="mb-4 flex items-start justify-between">
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-900">{selectedProperty.title}</h2>
                                        <p className="text-sm text-gray-500">
                                            {selectedProperty.location?.city}, {selectedProperty.location?.country}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-2xl font-bold text-gray-900">${selectedProperty.price?.perNight || 0}</p>
                                        <p className="text-xs text-gray-500">per night</p>
                                    </div>
                                </div>

                                <p className="mb-4 text-sm text-gray-600 line-clamp-3">{selectedProperty.description}</p>

                                <div className="mb-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
                                    <div className="rounded-xl bg-gray-50 p-3 text-center">
                                        <p className="text-lg font-bold text-gray-900">{selectedProperty.details?.bedrooms || 0}</p>
                                        <p className="text-xs text-gray-500">Bedrooms</p>
                                    </div>
                                    <div className="rounded-xl bg-gray-50 p-3 text-center">
                                        <p className="text-lg font-bold text-gray-900">{selectedProperty.details?.bathrooms || 0}</p>
                                        <p className="text-xs text-gray-500">Bathrooms</p>
                                    </div>
                                    <div className="rounded-xl bg-gray-50 p-3 text-center">
                                        <p className="text-lg font-bold text-gray-900">{selectedProperty.details?.maxGuests || 0}</p>
                                        <p className="text-xs text-gray-500">Max Guests</p>
                                    </div>
                                    <div className="rounded-xl bg-gray-50 p-3 text-center">
                                        <p className="text-lg font-bold text-gray-900">{selectedProperty.rating > 0 ? selectedProperty.rating.toFixed(1) : "—"}</p>
                                        <p className="text-xs text-gray-500">Rating</p>
                                    </div>
                                </div>

                                <div className="flex flex-wrap items-center gap-2">
                                    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                                        (STATUS_CONFIG[selectedProperty.status] || { bg: "bg-gray-50", text: "text-gray-600" }).bg
                                    } ${
                                        (STATUS_CONFIG[selectedProperty.status] || { text: "text-gray-600" }).text
                                    }`}>
                                        <span className={`h-1.5 w-1.5 rounded-full ${
                                            (STATUS_CONFIG[selectedProperty.status] || { dot: "bg-gray-400" }).dot
                                        }`} />
                                        {selectedProperty.status.charAt(0).toUpperCase() + selectedProperty.status.slice(1)}
                                    </span>
                                    {selectedProperty.isFeatured && (
                                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                                            Featured
                                        </span>
                                    )}
                                    <span className="text-xs text-gray-400">
                                        ID: {selectedProperty.id.slice(-8)}
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
