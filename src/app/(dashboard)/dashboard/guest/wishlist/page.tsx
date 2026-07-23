"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Label, ListBox, Pagination, Select, Skeleton, Input } from "@heroui/react";
import { toast } from "sonner";
import Link from "next/link";
import { getWishlist, getLists } from "@/lib/api/Guest/wishlist-api";
import { removeFromWishlist, createList } from "@/lib/actions/wishlist";
import WishlistButton from "@/Components/Wishlist/WishlistButton";
import type { WishlistItem } from "@/lib/api/Guest/wishlist-api";
import { formatCurrency } from "@/lib/currency";

type SortKey = "date-desc" | "date-asc" | "price-asc" | "price-desc" | "rating-desc";

const SORT_OPTIONS = [
    { id: "date-desc" as SortKey, label: "Newest First" },
    { id: "date-asc" as SortKey, label: "Oldest First" },
    { id: "price-asc" as SortKey, label: "Price: Low to High" },
    { id: "price-desc" as SortKey, label: "Price: High to Low" },
    { id: "rating-desc" as SortKey, label: "Highest Rated" },
];

export default function WishlistPage() {
    const [items, setItems] = useState<WishlistItem[]>([]);
    const [lists, setLists] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeList, setActiveList] = useState<string | null>(null);
    const [sortBy, setSortBy] = useState<SortKey>("date-desc");
    const [showCreateList, setShowCreateList] = useState(false);
    const [newListName, setNewListName] = useState("");
    const [removingId, setRemovingId] = useState<string | null>(null);

    const [page, setPage] = useState(1);
    const limit = 12;

    const fetchWishlist = useCallback(async (listName?: string | null) => {
        setLoading(true);
        try {
            const res = await getWishlist(listName || undefined);
            if (res.success) {
                setItems(res.data.items);
                setPage(1);
            } else {
                toast.error("Failed to load wishlist");
            }
        } catch {
            toast.error("Failed to load wishlist");
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchLists = useCallback(async () => {
        try {
            const res = await getLists();
            if (res.success) {
                setLists(res.data.lists);
            }
        } catch {}
    }, []);

    // eslint-disable-next-line react-hooks/set-state-in-effect
    useEffect(() => { fetchWishlist(activeList); fetchLists(); }, [activeList, fetchWishlist, fetchLists]);

    const handleRemove = useCallback(async (id: string) => {
        setRemovingId(id);
        try {
            const res = await removeFromWishlist(id);
            if (res.success) {
                setItems((prev) => prev.filter((i) => i._id !== id));
                toast.success("Removed from wishlist");
            } else {
                toast.error(res.message || "Failed to remove");
            }
        } catch {
            toast.error("Failed to remove");
        } finally {
            setRemovingId(null);
        }
    }, []);

    const handleCreateList = useCallback(async () => {
        const name = newListName.trim();
        if (!name) return;
        if (lists.includes(name)) {
            toast.error(`List "${name}" already exists`);
            return;
        }
        try {
            const res = await createList(name);
            if (res.success) {
                setLists((prev) => [...prev, name]);
                setActiveList(name);
                setNewListName("");
                setShowCreateList(false);
                toast.success(`List "${name}" created`);
            } else {
                toast.error(res.message || "Failed to create list");
            }
        } catch {
            toast.error("Failed to create list");
        }
    }, [newListName, lists]);

    const handleShare = useCallback(async () => {
        const url = window.location.href;
        try {
            await navigator.clipboard.writeText(url);
            toast.success("Wishlist link copied!");
        } catch {
            toast.error("Failed to copy link");
        }
    }, []);

    const sortedItems = useMemo(() => {
        const sorted = [...items];
        switch (sortBy) {
            case "date-desc":
                sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                break;
            case "date-asc":
                sorted.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
                break;
            case "price-asc":
                sorted.sort((a, b) => (a.property?.price?.perNight ?? Infinity) - (b.property?.price?.perNight ?? Infinity));
                break;
            case "price-desc":
                sorted.sort((a, b) => (b.property?.price?.perNight ?? 0) - (a.property?.price?.perNight ?? 0));
                break;
            case "rating-desc":
                sorted.sort((a, b) => (b.property?.rating ?? 0) - (a.property?.rating ?? 0));
                break;
        }
        return sorted;
    }, [items, sortBy]);

    const paginatedItems = useMemo(() => {
        const start = (page - 1) * limit;
        return sortedItems.slice(start, start + limit);
    }, [sortedItems, page, limit]);

    const totalPages = Math.max(1, Math.ceil(sortedItems.length / limit));

    const getPageNumbers = useCallback(() => {
        const pages: (number | "ellipsis")[] = [];
        pages.push(1);
        if (page > 3) pages.push("ellipsis");
        const start = Math.max(2, page - 1);
        const end = Math.min(totalPages - 1, page + 1);
        for (let i = start; i <= end; i++) pages.push(i);
        if (page < totalPages - 2) pages.push("ellipsis");
        pages.push(totalPages);
        return pages;
    }, [page, totalPages]);

    return (
        <div className="p-6 lg:p-8">
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">My Wishlist</h1>
                        <p className="mt-1 text-sm text-gray-500">{items.length} saved {items.length === 1 ? "property" : "properties"}</p>
                    </div>
                    <button
                        onClick={handleShare}
                        className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                    >
                        Share
                    </button>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-2">
                    <button
                        onClick={() => { setActiveList(null); setPage(1); }}
                        className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                            activeList === null
                                ? "bg-emerald-500 text-white shadow-sm"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                    >
                        All
                    </button>
                    {lists.map((list) => (
                        <button
                            key={list}
                            onClick={() => { setActiveList(list); setPage(1); }}
                            className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                                activeList === list
                                    ? "bg-emerald-500 text-white shadow-sm"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }`}
                        >
                            {list}
                        </button>
                    ))}
                    <button
                        onClick={() => setShowCreateList(!showCreateList)}
                        className="rounded-full border border-dashed border-gray-300 px-4 py-1.5 text-sm font-medium text-gray-500 transition hover:border-emerald-400 hover:text-emerald-600"
                    >
                        + New List
                    </button>
                </div>

                <AnimatePresence>
                    {showCreateList && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-3 flex items-center gap-2 overflow-hidden"
                        >
                            <Input
                                aria-label="List name"
                                placeholder="Enter list name..."
                                value={newListName}
                                onChange={(e) => setNewListName(e.target.value)}
                                onKeyDown={(e) => { if (e.key === "Enter") handleCreateList(); }}
                                className="w-64"
                            />
                            <button
                                onClick={handleCreateList}
                                className="rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-600"
                            >
                                Create
                            </button>
                            <button
                                onClick={() => { setShowCreateList(false); setNewListName(""); }}
                                className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="mt-4 flex items-center gap-2">
                    <span className="text-xs font-medium text-gray-400">Sort by:</span>
                    <Select
                        className="w-48"
                        aria-label="Sort by"
                        selectedKey={sortBy}
                        onSelectionChange={(key) => setSortBy((key as SortKey) || "date-desc")}
                    >
                        <Label>Sort</Label>
                        <Select.Trigger>
                            <Select.Value />
                            <Select.Indicator />
                        </Select.Trigger>
                        <Select.Popover>
                            <ListBox>
                                {SORT_OPTIONS.map((opt) => (
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

            {loading ? (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="rounded-2xl border border-gray-100 bg-white overflow-hidden shadow-sm">
                            <Skeleton className="aspect-[4/3] rounded-none" />
                            <div className="p-4 space-y-3">
                                <Skeleton className="h-4 w-3/4 rounded-lg" />
                                <Skeleton className="h-3 w-1/2 rounded-lg" />
                                <Skeleton className="h-4 w-1/4 rounded-lg" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : sortedItems.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white px-6 py-16 text-center"
                >
                    <svg className="mb-4 h-16 w-16 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                    <h3 className="text-lg font-semibold text-gray-900">Your wishlist is empty</h3>
                    <p className="mt-1 text-sm text-gray-500">Save properties you love and come back to them anytime.</p>
                    <Link
                        href="/listings"
                        className="mt-6 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition hover:shadow-emerald-500/40"
                    >
                        Browse Properties
                    </Link>
                </motion.div>
            ) : (
                <>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        <AnimatePresence>
                            {paginatedItems.map((item) => {
                                const prop = item.property;
                                return (
                                    <motion.div
                                        key={item._id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:shadow-md"
                                    >
                                        <Link href={`/space/${item.propertyId}`} className="block">
                                            <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                                                {prop?.images?.[0] ? (
                                                    <img
                                                        src={prop.images[0]}
                                                        alt={prop.title}
                                                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                                                        onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder-property.svg"; }}
                                                    />
                                                ) : (
                                                    <div className="flex h-full items-center justify-center text-gray-300">
                                                        <svg className="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                    </div>
                                                )}
                                                <div className="absolute right-2 top-2">
                                                    <WishlistButton
                                                        propertyId={item.propertyId}
                                                        initialSaved={true}
                                                        onToggle={(saved) => { if (!saved) handleRemove(item._id); }}
                                                        size="sm"
                                                    />
                                                </div>
                                                {item.listName && (
                                                    <div className="absolute bottom-2 left-2">
                                                        <span className="rounded-full bg-white/80 px-2.5 py-0.5 text-[10px] font-medium text-gray-600 backdrop-blur-sm">
                                                            {item.listName}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </Link>

                                        <div className="p-4">
                                            <Link href={`/space/${item.propertyId}`}>
                                                <h3 className="truncate text-sm font-semibold text-gray-900">{prop?.title || "Untitled"}</h3>
                                                <p className="mt-0.5 truncate text-xs text-gray-500">
                                                    {[prop?.location?.city, prop?.location?.country].filter(Boolean).join(", ") || "Location not set"}
                                                </p>
                                                <div className="mt-2 flex items-center gap-2">
                                                    <span className="text-lg font-bold text-gray-900">
                                                        ${prop?.price?.perNight ?? 0}
                                                    </span>
                                                    <span className="text-xs text-gray-400">/night</span>
                                                    {prop?.rating != null && prop.rating > 0 && (
                                                        <span className="ml-auto flex items-center gap-1 text-xs text-amber-500">
                                                            <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 20 20">
                                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                            </svg>
                                                            {prop.rating.toFixed(1)}
                                                        </span>
                                                    )}
                                                </div>
                                            </Link>

                                            <div className="mt-3 flex items-center gap-2">
                                                <Link
                                                    href={`/checkout?propertyId=${item.propertyId}`}
                                                    className="flex-1 rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 py-2 text-center text-xs font-semibold text-white shadow-sm transition hover:from-emerald-600 hover:to-emerald-700"
                                                >
                                                    Book Now
                                                </Link>
                                                <button
                                                    onClick={() => handleRemove(item._id)}
                                                    className="rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-gray-500 transition hover:bg-red-50 hover:text-red-500"
                                                >
                                                    {removingId === item._id ? (
                                                        <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
                                                    ) : (
                                                        "Remove"
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </div>

                    {totalPages > 1 && (
                        <div className="mt-8 flex justify-center">
                            <Pagination className="w-full sm:w-auto">
                                <Pagination.Summary>
                                    Showing {(page - 1) * limit + 1}–{Math.min(page * limit, sortedItems.length)} of {sortedItems.length} results
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
                                    {getPageNumbers().map((p, i) =>
                                        p === "ellipsis" ? (
                                            <Pagination.Item key={`ellipsis-${i}`}>
                                                <Pagination.Ellipsis />
                                            </Pagination.Item>
                                        ) : (
                                            <Pagination.Item key={p}>
                                                <Pagination.Link isActive={p === page} onPress={() => setPage(p)}>
                                                    {p}
                                                </Pagination.Link>
                                            </Pagination.Item>
                                        ),
                                    )}
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
                </>
            )}
        </div>
    );
}
