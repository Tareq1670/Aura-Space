"use client";

import { useCallback, useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ListBox, Pagination, Select, Skeleton } from "@heroui/react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { getPublicProperties } from "@/lib/actions/property-public";
import type { PublicProperty, PaginationInfo } from "@/lib/actions/property-public";
import PropertyCard from "@/Components/Public/PropertyCard";
import Button from "@/Components/ui/Button";
import {
    AMENITIES_LIST,
    CATEGORIES,
    FiltersDrawer,
    FiltersSidebar,
    SORT_OPTIONS,
    hasActiveFilters,
} from "@/Components/Public/ListingsFilters";
import type { FilterField, ListingsFilterState } from "@/Components/Public/ListingsFilters";

function PropertyCardSkeleton() {
    return (
        <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white">
            <Skeleton className="aspect-[4/3] w-full rounded-none" />
            <div className="space-y-3 p-4">
                <Skeleton className="h-4 w-3/4 rounded-lg" />
                <Skeleton className="h-3 w-1/2 rounded-lg" />
                <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-20 rounded-lg" />
                    <Skeleton className="h-3 w-16 rounded-lg" />
                </div>
            </div>
        </div>
    );
}

function useDebounce<T>(value: T, delay: number): T {
    const [debounced, setDebounced] = useState(value);
    useEffect(() => {
        const timer = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(timer);
    }, [value, delay]);
    return debounced;
}

function SortSelect({
    value,
    onChange,
    className,
}: {
    value: string;
    onChange: (value: string) => void;
    className?: string;
}) {
    return (
        <Select
            aria-label="Sort properties"
            placeholder="Latest"
            selectedKey={value}
            onSelectionChange={(key) => onChange(key ? String(key) : "")}
            className={className}
        >
            <Select.Trigger className="flex h-9 w-full items-center justify-between gap-2 rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold uppercase tracking-wider text-slate-600 shadow-sm outline-none transition-colors hover:border-indigo-300 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20">
                <Select.Value />
                <Select.Indicator className="shrink-0" />
            </Select.Trigger>
            <Select.Popover className="z-50 rounded-xl border border-slate-200 bg-white p-1 shadow-xl">
                <ListBox>
                    {SORT_OPTIONS.map((opt) => (
                        <ListBox.Item
                            key={opt.key || "latest"}
                            id={opt.key || "latest"}
                            textValue={opt.label}
                            className="cursor-pointer rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-indigo-50 hover:text-indigo-700 data-[selected]:bg-indigo-50 data-[selected]:text-indigo-700"
                        >
                            {opt.label}
                            <ListBox.ItemIndicator />
                        </ListBox.Item>
                    ))}
                </ListBox>
            </Select.Popover>
        </Select>
    );
}

interface FilterChip {
    key: string;
    label: string;
    onClear: () => void;
}

function ListingsContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [properties, setProperties] = useState<PublicProperty[]>([]);
    const [pagination, setPagination] = useState<PaginationInfo | null>(null);
    const [loading, setLoading] = useState(true);
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

    const [search, setSearch] = useState(searchParams.get("search") || "");
    const [category, setCategory] = useState(searchParams.get("category") || "");
    const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
    const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
    const [minRating, setMinRating] = useState(searchParams.get("minRating") || "");
    const [guests, setGuests] = useState(searchParams.get("guests") || "");
    const [amenities, setAmenities] = useState<string[]>(
        searchParams.get("amenities")?.split(",").filter(Boolean) || []
    );
    const [sort, setSort] = useState(searchParams.get("sort") || "");
    const [page, setPage] = useState(Number(searchParams.get("page")) || 1);

    const debouncedSearch = useDebounce(search, 400);

    const filterState: ListingsFilterState = {
        search,
        category,
        minPrice,
        maxPrice,
        minRating,
        guests,
        amenities,
        sort,
    };

    const buildParams = useCallback(() => {
        const params: Record<string, string> = {};
        if (debouncedSearch) params.search = debouncedSearch;
        if (category) params.category = category;
        if (minPrice) params.minPrice = minPrice;
        if (maxPrice) params.maxPrice = maxPrice;
        if (minRating) params.minRating = minRating;
        if (guests) params.guests = guests;
        if (amenities.length > 0) params.amenities = amenities.join(",");
        if (sort) params.sort = sort;
        params.page = String(page);
        return params;
    }, [debouncedSearch, category, minPrice, maxPrice, minRating, guests, amenities, sort, page]);

    useEffect(() => {
        const params = buildParams();
        const qs = new URLSearchParams(params).toString();
        router.replace(`/listings${qs ? `?${qs}` : ""}`, { scroll: false });
    }, [buildParams, router]);

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            const params = buildParams();
            const res = await getPublicProperties(params);
            if (res.success && res.data) {
                setProperties(res.data.properties);
                setPagination(res.data.pagination);
            } else {
                setProperties([]);
                setPagination(null);
            }
            setLoading(false);
        }
        fetchData();
    }, [buildParams]);

    const updateFilter = useCallback((field: FilterField, value: string) => {
        switch (field) {
            case "search":
                setSearch(value);
                break;
            case "sort":
                setSort(value);
                break;
            case "category":
                setCategory(value);
                break;
            case "minPrice":
                setMinPrice(value);
                break;
            case "maxPrice":
                setMaxPrice(value);
                break;
            case "minRating":
                setMinRating(value);
                break;
            case "guests":
                setGuests(value);
                break;
        }
        setPage(1);
    }, []);

    const clearFilters = () => {
        setSearch("");
        setCategory("");
        setMinPrice("");
        setMaxPrice("");
        setMinRating("");
        setGuests("");
        setAmenities([]);
        setSort("");
        setPage(1);
    };

    const toggleAmenity = (amenity: string) => {
        setAmenities((prev) =>
            prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity]
        );
        setPage(1);
    };

    const activeFilterCount =
        [search, category, minPrice, maxPrice, minRating, guests, sort].filter(Boolean).length +
        (amenities.length > 0 ? 1 : 0);

    const chips: FilterChip[] = [];
    if (search) chips.push({ key: "search", label: `Search: ${search}`, onClear: () => { setSearch(""); setPage(1); } });
    if (category) {
        const label = CATEGORIES.find((c) => c.key === category)?.label ?? category;
        chips.push({ key: "category", label: `Category: ${label}`, onClear: () => { setCategory(""); setPage(1); } });
    }
    if (minPrice || maxPrice) {
        chips.push({
            key: "price",
            label: `Price: ${minPrice || "0"} – ${maxPrice || "∞"}`,
            onClear: () => { setMinPrice(""); setMaxPrice(""); setPage(1); },
        });
    }
    if (minRating) {
        chips.push({ key: "rating", label: `${minRating}+ stars`, onClear: () => { setMinRating(""); setPage(1); } });
    }
    if (guests) {
        chips.push({ key: "guests", label: `${guests} guests max`, onClear: () => { setGuests(""); setPage(1); } });
    }
    if (amenities.length > 0) {
        const labels = amenities
            .map((a) => AMENITIES_LIST.find((x) => x.value === a)?.label ?? a)
            .join(", ");
        chips.push({
            key: "amenities",
            label: labels.length > 28 ? `Amenities: ${amenities.length}` : labels,
            onClear: () => { setAmenities([]); setPage(1); },
        });
    }
    if (sort) {
        const label = SORT_OPTIONS.find((s) => s.key === sort)?.label ?? sort;
        chips.push({ key: "sort", label: `Sort: ${label}`, onClear: () => { setSort(""); setPage(1); } });
    }

    return (
        <div className="min-h-screen bg-slate-50/30">
            <header className="border-b border-slate-200/80 bg-white shadow-sm">
                <div className="container mx-auto flex flex-wrap items-center justify-between gap-4 px-4 py-5 sm:px-6 lg:px-8">
                    <div>
                        <h1 className="text-2xl font-black leading-tight tracking-tight text-slate-900 sm:text-3xl">
                            Explore{" "}
                            <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 bg-clip-text text-transparent">
                                Stays
                            </span>
                        </h1>
                        <p className="mt-1 text-sm text-slate-500">
                            {pagination ? (
                                <>
                                    <span className="font-semibold text-slate-700">{pagination.total}</span>{" "}
                                    properties found
                                </>
                            ) : (
                                "Searching properties..."
                            )}
                        </p>
                    </div>

                    <div className="flex items-center gap-2.5">
                        <SortSelect
                            value={sort}
                            onChange={(v) => updateFilter("sort", v)}
                            className="w-36 lg:hidden"
                        />
                        <button
                            onClick={() => setMobileFiltersOpen(true)}
                            className="flex h-9 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50/80 px-3 text-xs font-bold uppercase tracking-wider text-slate-600 transition-colors hover:bg-slate-100 lg:hidden"
                        >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
                            </svg>
                            Filters
                            {activeFilterCount > 0 && (
                                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">
                                    {activeFilterCount}
                                </span>
                            )}
                        </button>

                        <div className="hidden items-center gap-2 lg:flex">
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                                Sort
                            </span>
                            <SortSelect
                                value={sort}
                                onChange={(v) => updateFilter("sort", v)}
                                className="w-44"
                            />
                        </div>
                    </div>
                </div>
            </header>

            {chips.length > 0 && (
                <div className="border-b border-slate-100 bg-white/60">
                    <div className="container mx-auto flex flex-wrap items-center gap-2 px-4 py-3 sm:px-6 lg:px-8">
                        {chips.map((chip) => (
                            <button
                                key={chip.key}
                                onClick={chip.onClear}
                                className="inline-flex items-center gap-1.5 rounded-full border border-indigo-100 bg-indigo-50/70 px-3 py-2 text-xs font-medium text-indigo-700 transition-colors hover:bg-indigo-100 touch-44"
                            >
                                {chip.label}
                                <X className="h-3 w-3" aria-hidden="true" />
                            </button>
                        ))}
                        <button
                            onClick={clearFilters}
                            className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-slate-500 transition-colors hover:text-rose-600 touch-44"
                        >
                            Clear all
                        </button>
                    </div>
                </div>
            )}

            <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
                <div className="flex gap-6 lg:gap-8">
                    <FiltersSidebar
                        state={filterState}
                        showSort={false}
                        onFieldChange={updateFilter}
                        onToggleAmenity={toggleAmenity}
                        onClear={clearFilters}
                    />

                    <div className="min-w-0 flex-1" aria-live="polite" aria-busy={loading}>
                        {loading ? (
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                                {Array.from({ length: 8 }).map((_, i) => (
                                    <PropertyCardSkeleton key={i} />
                                ))}
                            </div>
                        ) : properties.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 text-center">
                                <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-slate-100">
                                    <svg className="h-8 w-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                                    </svg>
                                </div>
                                <h2 className="text-lg font-bold text-slate-900">No properties found</h2>
<p className="mt-1 text-sm text-slate-500" aria-live="polite">
                                    Try adjusting your filters or search terms.
                                </p>
                                {hasActiveFilters(filterState) && (
                                    <Button
                                        onClick={clearFilters}
                                        className="mt-4"
                                    >
                                        Clear All Filters
                                    </Button>
                                )}
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                                    {properties.map((prop, index) => (
                                        <motion.div
                                            key={prop.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.4, delay: index * 0.04 }}
                                        >
                                            <PropertyCard property={prop} priority={index < 4} />
                                        </motion.div>
                                    ))}
                                </div>

                                {pagination && pagination.totalPages > 1 && (
                                    <div className="mt-10 flex justify-center">
                                        <Pagination>
                                            <Pagination.Content>
                                                <Pagination.Item>
                                                    <Pagination.Previous
                                                        isDisabled={page <= 1}
                                                        onPress={() => {
                                                            setPage(Math.max(1, page - 1));
                                                            window.scrollTo({ top: 0, behavior: "smooth" });
                                                        }}
                                                    >
                                                        <Pagination.PreviousIcon />
                                                    </Pagination.Previous>
                                                </Pagination.Item>
                                                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                                                    .slice(Math.max(0, page - 3), page + 2)
                                                    .map((p) => (
                                                        <Pagination.Item key={p}>
                                                            <Pagination.Link isActive={p === page} onPress={() => {
                                                                setPage(p);
                                                                window.scrollTo({ top: 0, behavior: "smooth" });
                                                            }}>
                                                                {p}
                                                            </Pagination.Link>
                                                        </Pagination.Item>
                                                    ))}
                                                <Pagination.Item>
                                                    <Pagination.Next
                                                        isDisabled={page >= pagination.totalPages}
                                                        onPress={() => {
                                                            setPage(Math.min(pagination.totalPages, page + 1));
                                                            window.scrollTo({ top: 0, behavior: "smooth" });
                                                        }}
                                                    >
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
                </div>
            </div>

            <FiltersDrawer
                open={mobileFiltersOpen}
                onClose={() => setMobileFiltersOpen(false)}
                state={filterState}
                onFieldChange={updateFilter}
                onToggleAmenity={toggleAmenity}
                onClearFilters={clearFilters}
            />
        </div>
    );
}

export default function ListingsPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-white pt-24">
                <div className="container mx-auto px-4 py-8">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <PropertyCardSkeleton key={i} />
                        ))}
                    </div>
                </div>
            </div>
        }>
            <ListingsContent />
        </Suspense>
    );
}