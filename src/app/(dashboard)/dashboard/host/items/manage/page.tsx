"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Plus, LayoutGrid, List, AlertCircle, SearchIcon } from "lucide-react";
import { InputGroup, Select, ListBox, Skeleton } from "@heroui/react";
import { hostPropertyAPI, type PropertyListItem } from "@/lib/api/Host/host-property-api";
import PropertyCard from "@/Components/property/PropertyCard";
import PropertyDataTable from "@/Components/Dashboard/PropertyDataTable";
import ConfirmModal from "@/Components/Dashboard/ConfirmModal";
import { cn } from "@/lib/utils/cn";

function SkeletonCard() {
    return (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
            <Skeleton className="h-44 w-full rounded-none" />
            <div className="p-4 space-y-3">
                <Skeleton className="h-4 w-4/5 rounded-lg" />
                <Skeleton className="h-3 w-3/5 rounded-lg" />
                <Skeleton className="h-4 w-2/5 rounded-lg" />
                <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                    <Skeleton className="h-3 w-16 rounded-lg" />
                    <Skeleton className="h-3 w-12 rounded-lg" />
                </div>
                <div className="flex items-center gap-2 pt-1">
                    <Skeleton className="h-7 w-14 rounded-lg" />
                    <Skeleton className="h-7 w-7 rounded-lg" />
                    <Skeleton className="h-7 w-7 rounded-lg" />
                    <Skeleton className="h-7 w-7 rounded-lg ml-auto" />
                </div>
            </div>
        </div>
    );
}

function SkeletonTableRow() {
    return (
        <div className="flex items-center gap-4 px-5 py-3.5 border-b border-gray-50">
            <Skeleton className="h-9 w-12 rounded-lg shrink-0" />
            <div className="flex-1 space-y-1.5">
                <Skeleton className="h-3.5 w-2/5 rounded" />
                <Skeleton className="h-3 w-1/4 rounded" />
            </div>
            <Skeleton className="h-3.5 w-20 rounded shrink-0" />
            <Skeleton className="h-5 w-16 rounded-full shrink-0" />
            <Skeleton className="h-3.5 w-8 rounded shrink-0" />
            <Skeleton className="h-3.5 w-16 rounded shrink-0" />
            <div className="flex items-center gap-1 shrink-0">
                <Skeleton className="h-7 w-7 rounded-lg" />
                <Skeleton className="h-7 w-7 rounded-lg" />
                <Skeleton className="h-7 w-7 rounded-lg" />
                <Skeleton className="h-7 w-7 rounded-lg" />
            </div>
        </div>
    );
}

export default function ManagePropertiesPage() {
    const router = useRouter();

    const [properties, setProperties] = useState<PropertyListItem[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("");
    const [categoryFilter] = useState("");
    const [sortBy, setSortBy] = useState<string>("createdAt");
    const [page, setPage] = useState(1);
    const limit = 12;

    const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
    const [deleting, setDeleting] = useState(false);

    const statusOptions = ["active", "inactive", "draft", "pending", "rejected"] as const;
    const sortOptions = [
        { value: "createdAt", label: "Newest" },
        { value: "-createdAt", label: "Oldest" },
        { value: "price", label: "Price: Low to High" },
        { value: "-price", label: "Price: High to Low" },
        { value: "bookings", label: "Most Bookings" },
        { value: "-bookings", label: "Least Bookings" },
    ] as const;

    useEffect(() => {
        let cancelled = false;
        async function load() {
            setLoading(true);
            setError(null);
            try {
                const res = await hostPropertyAPI.getMyProperties({
                    page,
                    limit,
                    search: search || undefined,
                    status: statusFilter || undefined,
                    category: categoryFilter || undefined,
                    sortBy: sortBy || undefined,
                });
                if (cancelled) return;
                setProperties(res.data.properties || []);
                setTotal(res.data.pagination?.total || 0);
            } catch (err) {
                if (cancelled) return;
                setError(err instanceof Error ? err.message : "Failed to load properties.");
            } finally {
                if (!cancelled) setLoading(false);
            }
        }
        load();
        return () => { cancelled = true; };
    }, [page, search, statusFilter, categoryFilter, sortBy, limit]);

    const fetchProperties = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await hostPropertyAPI.getMyProperties({
                page,
                limit,
                search: search || undefined,
                status: statusFilter || undefined,
                category: categoryFilter || undefined,
                sortBy: sortBy || undefined,
            });
            setProperties(res.data.properties || []);
            setTotal(res.data.pagination?.total || 0);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load properties.");
        } finally {
            setLoading(false);
        }
    }, [page, search, statusFilter, categoryFilter, sortBy, limit]);

    const handleDelete = useCallback(async () => {
        if (!deleteTarget) return;
        setDeleting(true);
        try {
            await hostPropertyAPI.deleteProperty(deleteTarget);
            toast.success("Property deleted.");
            setDeleteTarget(null);
            fetchProperties();
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Failed to delete property.");
        } finally {
            setDeleting(false);
        }
    }, [deleteTarget, fetchProperties]);

    const handleDuplicate = useCallback(async (id: string) => {
        try {
            await hostPropertyAPI.duplicateProperty(id);
            toast.success("Property duplicated as draft.");
            fetchProperties();
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Failed to duplicate property.");
        }
    }, [fetchProperties]);

    const handleStatusToggle = useCallback(async (id: string, currentStatus: string) => {
        const newStatus = currentStatus === "active" ? "inactive" : "active";
        try {
            await hostPropertyAPI.updatePropertyStatus(id, newStatus);
            toast.success(`Property ${newStatus === "active" ? "activated" : "deactivated"}.`);
            setProperties((prev) =>
                prev.map((p) => (p.id === id ? { ...p, status: newStatus } : p)),
            );
        } catch (err) {
            toast.error(err instanceof Error ? err.message : `Failed to ${newStatus === "active" ? "activate" : "deactivate"} property.`);
        }
    }, []);

    const totalPages = Math.ceil(total / limit);

    const selectedStatusKey = statusFilter || null;
    const selectedSortKey = sortBy;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6"
                >
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">My Properties</h1>
                        {!loading && !error && (
                            <p className="text-sm text-gray-500 mt-0.5">
                                {total} {total === 1 ? "property" : "properties"} total
                            </p>
                        )}
                    </div>
                    <button
                        type="button"
                        onClick={() => router.push("/dashboard/host/items/add")}
                        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white rounded-xl font-semibold text-sm shadow-lg shadow-rose-500/20 transition-all active:scale-[0.97]"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Add New Property</span>
                    </button>
                </motion.div>

                {/* Filters */}
                <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 }}
                    className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-5 mb-8 shadow-sm"
                >
                    <div className="flex flex-col sm:flex-row sm:items-end gap-3 sm:gap-4">
                        <div className="flex-1 w-full sm:min-w-[200px]">
                            <InputGroup className="w-full">
                                <InputGroup.Prefix>
                                    <SearchIcon className="w-4 h-4 text-gray-400" />
                                </InputGroup.Prefix>
                                <InputGroup.Input
                                    aria-label="Search properties"
                                    placeholder="Search by title..."
                                    value={search}
                                    onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                                />
                            </InputGroup>
                        </div>

                        <div className="w-full sm:w-[140px]">
                            <span className="block text-xs font-medium text-gray-500 mb-1 leading-none">Status</span>
                            <Select
                                placeholder="All Status"
                                selectedKey={selectedStatusKey}
                                onSelectionChange={(key) => {
                                    setStatusFilter((key as string) || "");
                                    setPage(1);
                                }}
                                className="w-full"
                                aria-label="Filter by status"
                            >
                                <Select.Trigger>
                                    <Select.Value />
                                    <Select.Indicator />
                                </Select.Trigger>
                                <Select.Popover>
                                    <ListBox>
                                        <ListBox.Item id="" textValue="All Status">
                                            All Status
                                            <ListBox.ItemIndicator />
                                        </ListBox.Item>
                                        {statusOptions.map((s) => (
                                            <ListBox.Item key={s} id={s} textValue={s.charAt(0).toUpperCase() + s.slice(1)}>
                                                {s.charAt(0).toUpperCase() + s.slice(1)}
                                                <ListBox.ItemIndicator />
                                            </ListBox.Item>
                                        ))}
                                    </ListBox>
                                </Select.Popover>
                            </Select>
                        </div>

                        <div className="w-full sm:w-[160px]">
                            <span className="block text-xs font-medium text-gray-500 mb-1 leading-none">Sort</span>
                            <Select
                                placeholder="Sort by"
                                selectedKey={selectedSortKey}
                                onSelectionChange={(key) => {
                                    setSortBy((key as string) || "createdAt");
                                }}
                                className="w-full"
                                aria-label="Sort properties"
                            >
                                <Select.Trigger>
                                    <Select.Value />
                                    <Select.Indicator />
                                </Select.Trigger>
                                <Select.Popover>
                                    <ListBox>
                                        {sortOptions.map((opt) => (
                                            <ListBox.Item key={opt.value} id={opt.value} textValue={opt.label}>
                                                {opt.label}
                                                <ListBox.ItemIndicator />
                                            </ListBox.Item>
                                        ))}
                                    </ListBox>
                                </Select.Popover>
                            </Select>
                        </div>

                        <div className="flex items-center h-9 min-h-9 bg-gray-50 border border-gray-200 rounded-xl shadow-sm shrink-0">
                            <button
                                type="button"
                                onClick={() => setViewMode("grid")}
                                className={cn(
                                    "flex items-center justify-center size-7 rounded-lg text-sm transition-all mx-0.5",
                                    viewMode === "grid"
                                        ? "bg-white text-violet-600 shadow-sm"
                                        : "text-gray-400 hover:text-gray-600"
                                )}
                                title="Grid view"
                            >
                                <LayoutGrid className="size-3.5" />
                            </button>
                            <button
                                type="button"
                                onClick={() => setViewMode("table")}
                                className={cn(
                                    "flex items-center justify-center size-7 rounded-lg text-sm transition-all mx-0.5",
                                    viewMode === "table"
                                        ? "bg-white text-violet-600 shadow-sm"
                                        : "text-gray-400 hover:text-gray-600"
                                )}
                                title="Table view"
                            >
                                <List className="size-3.5" />
                            </button>
                        </div>
                    </div>
                </motion.div>

                {/* Content */}
                {loading ? (
                    viewMode === "grid" ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                            {Array.from({ length: 8 }).map((_, i) => (
                                <SkeletonCard key={i} />
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                            <div className="px-5 py-3.5 bg-gray-50/80 border-b border-gray-100">
                                <div className="flex items-center gap-4">
                                    <Skeleton className="h-3.5 w-12 rounded" />
                                    <Skeleton className="h-3.5 w-24 rounded flex-1" />
                                    <Skeleton className="h-3.5 w-16 rounded" />
                                    <Skeleton className="h-3.5 w-14 rounded" />
                                    <Skeleton className="h-3.5 w-10 rounded" />
                                    <Skeleton className="h-3.5 w-14 rounded" />
                                    <Skeleton className="h-3.5 w-20 rounded" />
                                </div>
                            </div>
                            {Array.from({ length: 6 }).map((_, i) => (
                                <SkeletonTableRow key={i} />
                            ))}
                        </div>
                    )
                ) : error ? (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col items-center justify-center py-20 text-center"
                    >
                        <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mb-5">
                            <AlertCircle className="w-8 h-8 text-red-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">Failed to load properties</h3>
                        <p className="text-sm text-gray-400 mb-6 max-w-sm">{error}</p>
                        <button
                            type="button"
                            onClick={fetchProperties}
                            className="px-5 py-2.5 bg-violet-50 text-violet-700 rounded-xl text-sm font-medium hover:bg-violet-100 transition-all active:scale-[0.97]"
                        >
                            Try Again
                        </button>
                    </motion.div>
                ) : properties.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col items-center justify-center py-20 text-center"
                    >
                        <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-5">
                            <span className="text-3xl">🏠</span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">No properties yet</h3>
                        <p className="text-sm text-gray-400 mb-6">
                            {search || statusFilter || categoryFilter
                                ? "No properties match your filters."
                                : "Create your first property listing to get started."}
                        </p>
                        {!search && !statusFilter && !categoryFilter && (
                            <button
                                type="button"
                                onClick={() => router.push("/dashboard/host/items/add")}
                                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-rose-500 to-pink-600 text-white rounded-xl font-semibold text-sm shadow-lg shadow-rose-500/20 transition-all active:scale-[0.97]"
                            >
                                <Plus className="w-4 h-4" />
                                Add New Property
                            </button>
                        )}
                    </motion.div>
                ) : (
                    <>
                        <AnimatePresence mode="wait">
                            {viewMode === "grid" ? (
                                <motion.div
                                    key="grid"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
                                >
                                    {properties.map((p) => (
                                        <PropertyCard
                                            key={p.id}
                                            property={p}
                                            onDelete={setDeleteTarget}
                                            onDuplicate={handleDuplicate}
                                            onStatusToggle={handleStatusToggle}
                                        />
                                    ))}
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="table"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                >
                                    <PropertyDataTable
                                        properties={properties}
                                        onDelete={setDeleteTarget}
                                        onDuplicate={handleDuplicate}
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-center gap-2 mt-8">
                                <button
                                    type="button"
                                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                                    disabled={page <= 1}
                                    className="px-3 py-1.5 text-sm bg-white border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                                >
                                    Previous
                                </button>
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                                    <button
                                        key={p}
                                        type="button"
                                        onClick={() => setPage(p)}
                                        className={cn(
                                            "px-3 py-1.5 text-sm rounded-lg font-medium transition-all",
                                            p === page
                                                ? "bg-violet-600 text-white shadow-sm"
                                                : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                                        )}
                                    >
                                        {p}
                                    </button>
                                ))}
                                <button
                                    type="button"
                                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                    disabled={page >= totalPages}
                                    className="px-3 py-1.5 text-sm bg-white border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>

            <ConfirmModal
                isOpen={!!deleteTarget}
                onClose={() => setDeleteTarget(null)}
                onConfirm={handleDelete}
                title="Delete Property"
                message="Are you sure you want to delete this property? This action cannot be undone. All active bookings for this property will be cancelled."
                confirmText="Delete"
                cancelText="Cancel"
                variant="danger"
                loading={deleting}
                icon={<span>🗑️</span>}
            />
        </div>
    );
}
