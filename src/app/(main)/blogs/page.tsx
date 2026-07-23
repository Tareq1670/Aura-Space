"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Search, X, Loader2 } from "lucide-react";
import { getPublicBlogs, type Blog, type PaginationInfo } from "@/lib/actions/blog";
import BlogCard from "@/Components/Blog/BlogCard";

const SORT_OPTIONS = [
    { value: "newest", label: "Latest" },
    { value: "popular", label: "Most Popular" },
];

const TAG_OPTIONS = [
    "travel",
    "tips",
    "destination",
    "guide",
    "culture",
    "food",
    "adventure",
    "budget",
    "luxury",
    "business",
];

function useDebounce<T>(value: T, delay: number): T {
    const [debounced, setDebounced] = useState(value);
    useEffect(() => {
        const timer = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(timer);
    }, [value, delay]);
    return debounced;
}

function BlogCardSkeleton() {
    return (
        <div className="rounded-2xl border border-slate-100 bg-white overflow-hidden shadow-sm animate-pulse">
            <div className="aspect-[16/9] bg-slate-200" />
            <div className="p-4 space-y-2">
                <div className="flex gap-1.5">
                    <div className="h-4 w-14 bg-slate-200 rounded-full" />
                    <div className="h-4 w-10 bg-slate-200 rounded-full" />
                </div>
                <div className="h-4 w-3/4 bg-slate-200 rounded" />
                <div className="h-3 w-full bg-slate-200 rounded" />
                <div className="h-3 w-2/3 bg-slate-200 rounded" />
                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    <div className="flex items-center gap-1.5">
                        <div className="w-5 h-5 rounded-full bg-slate-200" />
                        <div className="h-3 w-16 bg-slate-200 rounded" />
                    </div>
                    <div className="h-3 w-12 bg-slate-200 rounded" />
                </div>
            </div>
        </div>
    );
}

function BlogsContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [pagination, setPagination] = useState<PaginationInfo | null>(null);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState(searchParams.get("search") || "");
    const [selectedTag, setSelectedTag] = useState(searchParams.get("tag") || "");
    const [sort, setSort] = useState(searchParams.get("sort") || "newest");
    const [page, setPage] = useState(parseInt(searchParams.get("page") || "1"));

    const debouncedSearch = useDebounce(search, 400);

    useEffect(() => {
        const params = new URLSearchParams();
        if (debouncedSearch) params.set("search", debouncedSearch);
        if (selectedTag) params.set("tag", selectedTag);
        if (sort !== "newest") params.set("sort", sort);
        if (page > 1) params.set("page", String(page));
        const qs = params.toString();
        router.replace(`/blogs${qs ? `?${qs}` : ""}`, { scroll: false });
    }, [debouncedSearch, selectedTag, sort, page, router]);

    useEffect(() => {
        let cancelled = false;
        async function fetchBlogs() {
            setLoading(true);
            try {
                const result = await getPublicBlogs({
                    search: debouncedSearch || undefined,
                    tag: selectedTag || undefined,
                    sort: sort !== "newest" ? sort : undefined,
                    page: String(page),
                    limit: "12",
                });
                if (!cancelled && result.success && result.data) {
                    setBlogs(result.data.blogs || []);
                    setPagination(result.data.pagination || null);
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        }
        fetchBlogs();
        return () => {
            cancelled = true;
        };
    }, [debouncedSearch, selectedTag, sort, page]);

    const clearFilters = () => {
        setSearch("");
        setSelectedTag("");
        setSort("newest");
        setPage(1);
    };

    const hasFilters = debouncedSearch || selectedTag || sort !== "newest";

    return (
        <div className="min-h-screen bg-slate-50/50">
            <section className="bg-gradient-to-b from-indigo-600 to-indigo-800 text-white">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-center"
                    >
                        <h1 className="text-3xl sm:text-4xl font-bold mb-3">
                            Blog & Travel Guides
                        </h1>
                        <p className="text-indigo-200 text-sm sm:text-base max-w-lg mx-auto">
                            Tips, stories, and guides from the AuraSpace community
                        </p>
                    </motion.div>
                </div>
            </section>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
                <div className="flex flex-col sm:flex-row gap-3 mb-6">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setPage(1);
                            }}
                            placeholder="Search blogs..."
                            className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder:text-slate-400"
                        />
                        {search && (
                            <button
                                onClick={() => setSearch("")}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                    <select
                        value={sort}
                        onChange={(e) => {
                            setSort(e.target.value);
                            setPage(1);
                        }}
                        className="px-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700"
                    >
                        {SORT_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex gap-2 mb-6 overflow-x-auto pb-1 flex-nowrap md:flex-wrap md:overflow-visible">
                    {TAG_OPTIONS.map((tag) => (
                        <button
                            key={tag}
                            onClick={() => {
                                setSelectedTag(selectedTag === tag ? "" : tag);
                                setPage(1);
                            }}
                            className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors capitalize ${
                                selectedTag === tag
                                    ? "bg-indigo-600 border-indigo-600 text-white"
                                    : "border-slate-200 text-slate-600 hover:bg-slate-100 bg-white"
                            }`}
                        >
                            {tag}
                        </button>
                    ))}
                    {hasFilters && (
                        <button
                            onClick={clearFilters}
                            className="px-3 py-1.5 text-xs font-medium text-red-600 hover:text-red-700 transition-colors"
                        >
                            Clear all
                        </button>
                    )}
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <BlogCardSkeleton key={i} />
                        ))}
                    </div>
                ) : blogs.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-slate-500 text-sm">No blogs found.</p>
                        {hasFilters && (
                            <button
                                onClick={clearFilters}
                                className="mt-3 text-indigo-600 text-sm font-medium hover:underline"
                            >
                                Clear filters
                            </button>
                        )}
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                            {blogs.map((blog, index) => (
                                <BlogCard key={blog.id} blog={blog} index={index} />
                            ))}
                        </div>

                        {pagination && pagination.totalPages > 1 && (
                            <div className="flex items-center justify-center gap-2 mt-10">
                                <button
                                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                                    disabled={!pagination.hasPrevPage}
                                    className="px-4 py-2 text-sm font-medium rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                    Previous
                                </button>
                                <span className="text-sm text-slate-500 px-3">
                                    Page {pagination.currentPage} of {pagination.totalPages}
                                </span>
                                <button
                                    onClick={() => setPage((p) => p + 1)}
                                    disabled={!pagination.hasNextPage}
                                    className="px-4 py-2 text-sm font-medium rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

export default function BlogsPage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen bg-slate-50/50 flex items-center justify-center">
                    <Loader2 className="w-6 h-6 text-indigo-500 animate-spin" />
                </div>
            }
        >
            <BlogsContent />
        </Suspense>
    );
}
