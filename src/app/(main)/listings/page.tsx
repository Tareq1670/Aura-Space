"use client";

import React, { useEffect, useState, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
    Select,
    ListBox,
    Skeleton,
    Pagination,
    InputGroup,
} from "@heroui/react";
import { motion, AnimatePresence } from "framer-motion";
import { getPublicProperties } from "@/lib/actions/property-public";
import type { PublicProperty, PaginationInfo } from "@/lib/actions/property-public";

const CATEGORIES = [
    { key: "", label: "All Categories" },
    { key: "villa", label: "Villa" },
    { key: "suite", label: "Suite" },
    { key: "cabin", label: "Cabin" },
    { key: "event", label: "Event" },
    { key: "estate", label: "Estate" },
    { key: "resort", label: "Resort" },
    { key: "apartment", label: "Apartment" },
];

const SORT_OPTIONS = [
    { key: "", label: "Latest" },
    { key: "price-asc", label: "Price: Low to High" },
    { key: "price-desc", label: "Price: High to Low" },
    { key: "rating-desc", label: "Top Rated" },
    { key: "popular", label: "Most Popular" },
    { key: "featured", label: "Featured" },
];

const AMENITIES_LIST: { value: string; label: string }[] = [
    { value: "wifi", label: "Wi-Fi" },
    { value: "pool", label: "Pool" },
    { value: "air_conditioning", label: "AC" },
    { value: "parking", label: "Parking" },
    { value: "gym", label: "Gym" },
    { value: "kitchen", label: "Kitchen" },
    { value: "washer", label: "Washer" },
    { value: "pet-friendly", label: "Pet Friendly" },
];

const RATING_OPTIONS = [
    { key: "", label: "Any Rating" },
    { key: "4", label: "4+ Stars" },
    { key: "3", label: "3+ Stars" },
    { key: "2", label: "2+ Stars" },
];

function StarRating({ rating, count }: { rating: number; count: number }) {
    return (
        <div className="flex items-center gap-1">
            <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                    <svg
                        key={i}
                        className={`h-3 w-3 ${i < Math.round(rating) ? "text-amber-400" : "text-slate-200"}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                    >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                ))}
            </div>
            <span className="text-[11px] font-semibold text-slate-500">({count})</span>
        </div>
    );
}

function PropertyCardSkeleton() {
    return (
        <div className="rounded-2xl border border-slate-100 bg-white overflow-hidden">
            <Skeleton className="aspect-[4/3] w-full rounded-none" />
            <div className="p-4 space-y-3">
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

    const hasActiveFilters =
        search || category || minPrice || maxPrice || minRating || guests || amenities.length > 0 || sort;

    return (
        <div className="min-h-screen bg-slate-50/30">
            <div className="border-b border-slate-200/80 bg-white shadow-sm">
                <div className="container mx-auto flex items-center justify-between px-4 py-2.5 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setMobileFiltersOpen(true)}
                            className="flex h-9 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50/80 px-3 text-xs font-bold uppercase tracking-wider text-slate-600 transition-colors hover:bg-slate-100 lg:hidden"
                        >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
                            </svg>
                            Filters
                        </button>
                        {pagination && (
                            <span className="text-sm text-slate-500">
                                <span className="font-semibold text-slate-700">{pagination.total}</span> properties
                            </span>
                        )}
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
                <div className="flex gap-6 lg:gap-8">
                    <aside className="hidden w-72 shrink-0 lg:block">
                        <div className="sticky top-24 space-y-6">
                            <InputGroup className="w-full">
                                <InputGroup.Prefix>
                                    <svg className="h-4 w-4 shrink-0 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                                    </svg>
                                </InputGroup.Prefix>
                                <InputGroup.Input
                                    aria-label="Search properties"
                                    placeholder="Search by title or country..."
                                    value={search}
                                    onChange={(e) => {
                                        setSearch(e.target.value);
                                        setPage(1);
                                    }}
                                />
                            </InputGroup>

                            <div>
                                <h3 className="mb-3 text-[11px] font-extrabold uppercase tracking-[0.16em] text-slate-400">Sort By</h3>
                                <Select
                                    aria-label="Sort"
                                    placeholder="Latest"
                                    selectedKey={sort}
                                    onSelectionChange={(key) => { setSort(key ? String(key) : ""); setPage(1); }}
                                    className="w-full"
                                >
                                    <Select.Trigger><Select.Value /><Select.Indicator /></Select.Trigger>
                                    <Select.Popover className="z-50 rounded-xl border border-slate-200 bg-white p-1 shadow-xl">
                                        <ListBox>
                                            {SORT_OPTIONS.map((opt) => (
                                                <ListBox.Item
                                                    key={opt.key || "latest"} id={opt.key || "latest"} textValue={opt.label}
                                                    className="cursor-pointer rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-indigo-50 hover:text-indigo-700 data-[selected]:bg-indigo-50 data-[selected]:text-indigo-700"
                                                >
                                                    {opt.label}
                                                    <ListBox.ItemIndicator />
                                                </ListBox.Item>
                                            ))}
                                        </ListBox>
                                    </Select.Popover>
                                </Select>
                            </div>

                            <hr className="border-slate-100" />

                            <div>
                                <h3 className="mb-3 text-[11px] font-extrabold uppercase tracking-[0.16em] text-slate-400">
                                    Category
                                </h3>
                                <Select
                                    aria-label="Category"
                                    placeholder="All Categories"
                                    selectedKey={category}
                                    onSelectionChange={(key) => {
                                        setCategory(key ? String(key) : "");
                                        setPage(1);
                                    }}
                                    className="w-full"
                                >
                                    <Select.Trigger>
                                        <Select.Value />
                                        <Select.Indicator />
                                    </Select.Trigger>
                                    <Select.Popover className="z-50 rounded-xl border border-slate-200 bg-white p-1 shadow-xl">
                                        <ListBox>
                                            {CATEGORIES.map((cat) => (
                                                <ListBox.Item
                                                    key={cat.key || "all"}
                                                    id={cat.key || "all"}
                                                    textValue={cat.label}
                                                    className="cursor-pointer rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-indigo-50 hover:text-indigo-700 data-[selected]:bg-indigo-50 data-[selected]:text-indigo-700"
                                                >
                                                    {cat.label}
                                                    <ListBox.ItemIndicator />
                                                </ListBox.Item>
                                            ))}
                                        </ListBox>
                                    </Select.Popover>
                                </Select>
                            </div>

                            <div>
                                <h3 className="mb-3 text-[11px] font-extrabold uppercase tracking-[0.16em] text-slate-400">
                                    Price Range
                                </h3>
                                <div className="flex items-center gap-2">
                                    <div className="relative flex h-10 flex-1 items-center rounded-xl border border-slate-200 bg-white shadow-sm">
                                        <span className="pl-3 text-xs text-slate-400">$</span>
                                        <input
                                            aria-label="Min price"
                                            type="number"
                                            placeholder="Min"
                                            value={minPrice}
                                            onChange={(e) => {
                                                setMinPrice(e.target.value);
                                                setPage(1);
                                            }}
                                            className="h-full w-full border-0 bg-transparent px-2 text-sm font-medium text-slate-700 outline-none placeholder:text-slate-400"
                                        />
                                    </div>
                                    <span className="text-slate-300">—</span>
                                    <div className="relative flex h-10 flex-1 items-center rounded-xl border border-slate-200 bg-white shadow-sm">
                                        <span className="pl-3 text-xs text-slate-400">$</span>
                                        <input
                                            aria-label="Max price"
                                            type="number"
                                            placeholder="Max"
                                            value={maxPrice}
                                            onChange={(e) => {
                                                setMaxPrice(e.target.value);
                                                setPage(1);
                                            }}
                                            className="h-full w-full border-0 bg-transparent px-2 text-sm font-medium text-slate-700 outline-none placeholder:text-slate-400"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="mb-3 text-[11px] font-extrabold uppercase tracking-[0.16em] text-slate-400">
                                    Min Rating
                                </h3>
                                <Select
                                    aria-label="Minimum rating"
                                    placeholder="Any Rating"
                                    selectedKey={minRating}
                                    onSelectionChange={(key) => {
                                        setMinRating(key ? String(key) : "");
                                        setPage(1);
                                    }}
                                    className="w-full"
                                >
                                    <Select.Trigger>
                                        <Select.Value />
                                        <Select.Indicator />
                                    </Select.Trigger>
                                    <Select.Popover className="z-50 rounded-xl border border-slate-200 bg-white p-1 shadow-xl">
                                        <ListBox>
                                            {RATING_OPTIONS.map((opt) => (
                                                <ListBox.Item
                                                    key={opt.key || "any"}
                                                    id={opt.key || "any"}
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
                            </div>

                            <div>
                                <h3 className="mb-3 text-[11px] font-extrabold uppercase tracking-[0.16em] text-slate-400">
                                    Max Guests
                                </h3>
                                <input
                                    aria-label="Max guests"
                                    type="number"
                                    placeholder="Any"
                                    value={guests}
                                    onChange={(e) => {
                                        setGuests(e.target.value);
                                        setPage(1);
                                    }}
                                    className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 outline-none placeholder:text-slate-400 transition-colors focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 shadow-sm"
                                />
                            </div>

                            <div>
                                <h3 className="mb-3 text-[11px] font-extrabold uppercase tracking-[0.16em] text-slate-400">
                                    Amenities
                                </h3>
                                <div className="space-y-2">
                                    {AMENITIES_LIST.map((amenity) => (
                                        <label
                                            key={amenity.value}
                                            className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 transition-colors hover:bg-slate-50"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={amenities.includes(amenity.value)}
                                                onChange={() => toggleAmenity(amenity.value)}
                                                className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                            />
                                            <span className="text-sm font-medium text-slate-700">
                                                {amenity.label}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {hasActiveFilters && (
                                <button
                                    onClick={clearFilters}
                                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-600 transition-colors hover:bg-slate-50 hover:text-rose-600"
                                >
                                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                    Clear Filters
                                </button>
                            )}
                        </div>
                    </aside>

                    <div className="flex-1 min-w-0">

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
                                <h3 className="text-lg font-bold text-slate-900">No properties found</h3>
                                <p className="mt-1 text-sm text-slate-500">
                                    Try adjusting your filters or search terms.
                                </p>
                                {hasActiveFilters && (
                                    <button
                                        onClick={clearFilters}
                                        className="mt-4 rounded-full bg-indigo-600 px-6 py-2 text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-indigo-600/20 transition-colors hover:bg-indigo-700"
                                    >
                                        Clear All Filters
                                    </button>
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
                                            <Link href={`/listings/${prop.id}`} className="group block h-full">
                                                <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-all duration-300 hover:shadow-md hover:border-indigo-200">
                                                    <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                                                        <img
                                                            src={prop.images?.[0] || "/placeholder-property.svg"}
                                                            alt={prop.title}
                                                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                            loading="lazy"
                                                            onError={(e) => {
                                                                (e.target as HTMLImageElement).src = "/placeholder-property.svg";
                                                            }}
                                                        />
                                                        <div className="absolute left-2.5 top-2.5 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-slate-700 backdrop-blur-sm">
                                                            {prop.category}
                                                        </div>
                                                        {prop.isFeatured && (
                                                            <div className="absolute right-2.5 top-2.5 inline-flex items-center gap-1 rounded-full bg-amber-400/90 px-2 py-0.5 text-[9px] font-bold text-amber-900 backdrop-blur-sm">
                                                                <svg className="h-2.5 w-2.5" fill="currentColor" viewBox="0 0 20 20">
                                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                                </svg>
                                                                Featured
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex flex-1 flex-col p-4">
                                                        <h3 className="text-sm font-bold leading-snug text-slate-900 line-clamp-1">
                                                            {prop.title}
                                                        </h3>
                                                        <p className="mt-0.5 text-xs text-slate-500">
                                                            {prop.location?.city}
                                                            {prop.location?.city && prop.location?.country ? ", " : ""}
                                                            {prop.location?.country}
                                                        </p>
                                                        <div className="mt-1 flex items-center gap-1">
                                                            <svg className="h-3 w-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                                                            </svg>
                                                            <span className="text-xs text-slate-400 line-clamp-1">
                                                                {prop.location?.address || ""}
                                                            </span>
                                                        </div>

                                                        <div className="mt-auto pt-3">
                                                            <div className="flex items-center justify-between">
                                                                <span className="text-base font-bold text-slate-900">
                                                                    ${prop.price?.perNight}{" "}
                                                                    <span className="text-xs font-normal text-slate-400">/ night</span>
                                                                </span>
                                                                <StarRating rating={prop.rating} count={prop.reviewCount} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>
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

            <AnimatePresence>
                {mobileFiltersOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/50 lg:hidden"
                        onClick={() => setMobileFiltersOpen(false)}
                    >
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            onClick={(e) => e.stopPropagation()}
                            className="absolute right-0 top-0 h-full w-80 max-w-[85vw] overflow-y-auto bg-white p-6 shadow-xl"
                        >
                            <div className="mb-6 flex items-center justify-between">
                                <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-700">
                                    Filters
                                </h2>
                                <button
                                    onClick={() => setMobileFiltersOpen(false)}
                                    className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-colors hover:bg-slate-200"
                                >
                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <div className="space-y-5">
                                <InputGroup className="w-full">
                                    <InputGroup.Prefix>
                                        <svg className="h-4 w-4 shrink-0 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                                        </svg>
                                    </InputGroup.Prefix>
                                    <InputGroup.Input
                                        aria-label="Search properties"
                                        placeholder="Search by title or country..."
                                        value={search}
                                        onChange={(e) => {
                                            setSearch(e.target.value);
                                            setPage(1);
                                        }}
                                    />
                                </InputGroup>

                                <div>
                                    <h3 className="mb-2 text-[10px] font-extrabold uppercase tracking-[0.16em] text-slate-400">Sort By</h3>
                                    <Select
                                        aria-label="Sort"
                                        placeholder="Latest"
                                        selectedKey={sort}
                                        onSelectionChange={(key) => { setSort(key ? String(key) : ""); setPage(1); }}
                                        className="w-full"
                                    >
                                        <Select.Trigger><Select.Value /><Select.Indicator /></Select.Trigger>
                                        <Select.Popover className="z-[60] rounded-xl border border-slate-200 bg-white p-1 shadow-xl">
                                            <ListBox>
                                                {SORT_OPTIONS.map((opt) => (
                                                    <ListBox.Item key={opt.key || "latest"} id={opt.key || "latest"} textValue={opt.label}
                                                        className="cursor-pointer rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 data-[selected]:bg-indigo-50 data-[selected]:text-indigo-700"
                                                    >
                                                        {opt.label}<ListBox.ItemIndicator />
                                                    </ListBox.Item>
                                                ))}
                                            </ListBox>
                                        </Select.Popover>
                                    </Select>
                                </div>

                                <hr className="border-slate-100" />

                                <div>
                                    <h3 className="mb-2 text-[10px] font-extrabold uppercase tracking-[0.16em] text-slate-400">Category</h3>
                                    <Select
                                        aria-label="Category"
                                        placeholder="All Categories"
                                        selectedKey={category}
                                        onSelectionChange={(key) => { setCategory(key ? String(key) : ""); setPage(1); }}
                                    >
                                        <Select.Trigger><Select.Value /><Select.Indicator /></Select.Trigger>
                                        <Select.Popover className="z-[60] rounded-xl border border-slate-200 bg-white p-1 shadow-xl">
                                            <ListBox>
                                                {CATEGORIES.map((cat) => (
                                                    <ListBox.Item key={cat.key || "all"} id={cat.key || "all"} textValue={cat.label}
                                                        className="cursor-pointer rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 data-[selected]:bg-indigo-50 data-[selected]:text-indigo-700"
                                                    >
                                                        {cat.label}
                                                        <ListBox.ItemIndicator />
                                                    </ListBox.Item>
                                                ))}
                                            </ListBox>
                                        </Select.Popover>
                                    </Select>
                                </div>

                                <div>
                                    <h3 className="mb-2 text-[10px] font-extrabold uppercase tracking-[0.16em] text-slate-400">Price Range</h3>
                                    <div className="flex items-center gap-2">
                                        <div className="relative flex h-10 flex-1 items-center rounded-xl border border-slate-200 bg-white">
                                            <span className="pl-3 text-xs text-slate-400">$</span>
                                            <input aria-label="Min" type="number" placeholder="Min" value={minPrice}
                                                onChange={(e) => { setMinPrice(e.target.value); setPage(1); }}
                                                className="h-full w-full border-0 bg-transparent px-2 text-sm font-medium text-slate-700 outline-none placeholder:text-slate-400"
                                            />
                                        </div>
                                        <span className="text-slate-300">—</span>
                                        <div className="relative flex h-10 flex-1 items-center rounded-xl border border-slate-200 bg-white">
                                            <span className="pl-3 text-xs text-slate-400">$</span>
                                            <input aria-label="Max" type="number" placeholder="Max" value={maxPrice}
                                                onChange={(e) => { setMaxPrice(e.target.value); setPage(1); }}
                                                className="h-full w-full border-0 bg-transparent px-2 text-sm font-medium text-slate-700 outline-none placeholder:text-slate-400"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="mb-2 text-[10px] font-extrabold uppercase tracking-[0.16em] text-slate-400">Min Rating</h3>
                                    <Select aria-label="Rating" placeholder="Any Rating" selectedKey={minRating}
                                        onSelectionChange={(key) => { setMinRating(key ? String(key) : ""); setPage(1); }}
                                    >
                                        <Select.Trigger><Select.Value /><Select.Indicator /></Select.Trigger>
                                        <Select.Popover className="z-[60] rounded-xl border border-slate-200 bg-white p-1 shadow-xl">
                                            <ListBox>
                                                {RATING_OPTIONS.map((opt) => (
                                                    <ListBox.Item key={opt.key || "any"} id={opt.key || "any"} textValue={opt.label}
                                                        className="cursor-pointer rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 data-[selected]:bg-indigo-50 data-[selected]:text-indigo-700"
                                                    >
                                                        {opt.label}<ListBox.ItemIndicator />
                                                    </ListBox.Item>
                                                ))}
                                            </ListBox>
                                        </Select.Popover>
                                    </Select>
                                </div>

                                <div>
                                    <h3 className="mb-2 text-[10px] font-extrabold uppercase tracking-[0.16em] text-slate-400">Max Guests</h3>
                                    <input aria-label="Guests" type="number" placeholder="Any" value={guests}
                                        onChange={(e) => { setGuests(e.target.value); setPage(1); }}
                                        className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 outline-none placeholder:text-slate-400 transition-colors focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20"
                                    />
                                </div>

                                <div>
                                    <h3 className="mb-2 text-[10px] font-extrabold uppercase tracking-[0.16em] text-slate-400">Amenities</h3>
                                    <div className="space-y-2">
                                        {AMENITIES_LIST.map((amenity) => (
                                            <label key={amenity.value} className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-slate-50">
                                                <input type="checkbox" checked={amenities.includes(amenity.value)}
                                                    onChange={() => toggleAmenity(amenity.value)}
                                                    className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                                />
                                                <span className="text-sm font-medium text-slate-700">{amenity.label}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 flex gap-3">
                                <button onClick={() => { clearFilters(); setMobileFiltersOpen(false); }}
                                    className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-600 transition-colors hover:bg-slate-50"
                                >
                                    Clear All
                                </button>
                                <button onClick={() => setMobileFiltersOpen(false)}
                                    className="flex-1 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-indigo-600/20 transition-colors hover:bg-indigo-700"
                                >
                                    Apply
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
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
