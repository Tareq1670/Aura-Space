"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
    Search,
    Star,
    StarOff,
    Trash2,
    Eye,
    FileText,
    Loader2,
    X,
} from "lucide-react";
import {
    getAdminBlogs,
    toggleFeatureBlog,
    adminDeleteBlog,
} from "@/lib/action/admin-blog";
import type { Blog, PaginationInfo } from "@/lib/actions/blog";

const STATUS_OPTIONS = [
    { value: "all", label: "All Status" },
    { value: "published", label: "Published" },
    { value: "draft", label: "Draft" },
];

const STATUS_STYLES: Record<string, string> = {
    published: "bg-emerald-50 text-emerald-700",
    draft: "bg-amber-50 text-amber-700",
};

function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

function SkeletonRow() {
    return (
        <div className="flex items-center gap-4 px-5 py-4 border-b border-gray-50 animate-pulse">
            <div className="w-16 h-10 bg-slate-200 rounded-lg shrink-0" />
            <div className="flex-1 space-y-2">
                <div className="h-4 w-2/5 bg-slate-200 rounded" />
                <div className="h-3 w-1/4 bg-slate-200 rounded" />
            </div>
            <div className="h-3 w-20 bg-slate-200 rounded shrink-0" />
            <div className="h-5 w-16 bg-slate-200 rounded-full shrink-0" />
            <div className="h-5 w-10 bg-slate-200 rounded-full shrink-0" />
            <div className="h-3 w-12 bg-slate-200 rounded shrink-0" />
            <div className="h-3 w-16 bg-slate-200 rounded shrink-0" />
            <div className="flex items-center gap-1 shrink-0">
                <div className="w-7 h-7 bg-slate-200 rounded-lg" />
                <div className="w-7 h-7 bg-slate-200 rounded-lg" />
                <div className="w-7 h-7 bg-slate-200 rounded-lg" />
            </div>
        </div>
    );
}

export default function AdminBlogsPage() {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [pagination, setPagination] = useState<PaginationInfo | null>(null);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [featuredFilter, setFeaturedFilter] = useState<string>("");
    const [page, setPage] = useState(1);
    const [featuredLoading, setFeaturedLoading] = useState<string | null>(null);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [deleting, setDeleting] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);

    const fetchBlogs = useCallback(async () => {
        setLoading(true);
        try {
            const result = await getAdminBlogs({
                page: String(page),
                limit: "15",
                status: statusFilter !== "all" ? statusFilter : undefined,
                featured: featuredFilter || undefined,
                search: search || undefined,
            });
            if (result.success && result.data) {
                setBlogs((result.data.blogs as Blog[]) || []);
                setPagination(result.data.pagination as PaginationInfo || null);
            } else {
                toast.error(result.message || "Failed to load blogs.");
            }
        } catch {
            toast.error("Failed to load blogs.");
        } finally {
            setLoading(false);
        }
    }, [page, statusFilter, featuredFilter, search, refreshKey]);

    useEffect(() => {
        fetchBlogs();
    }, [fetchBlogs]);

    const handleToggleFeatured = useCallback(
        async (blogId: string) => {
            setFeaturedLoading(blogId);
            try {
                const result = await toggleFeatureBlog(blogId);
                if (result.success) {
                    toast.success(result.message || "Updated.");
                    setRefreshKey((k) => k + 1);
                } else {
                    toast.error(result.message || "Failed.");
                }
            } finally {
                setFeaturedLoading(null);
            }
        },
        []
    );

    const handleDelete = useCallback(async () => {
        if (!deleteId) return;
        setDeleting(true);
        try {
            const result = await adminDeleteBlog(deleteId);
            if (result.success) {
                toast.success("Blog deleted.");
                setDeleteId(null);
                setRefreshKey((k) => k + 1);
            } else {
                toast.error(result.message || "Failed to delete.");
            }
        } finally {
            setDeleting(false);
        }
    }, [deleteId]);

    const stats = useMemo(() => {
        const published = blogs.filter((b) => b.status === "published").length;
        const draft = blogs.filter((b) => b.status === "draft").length;
        const featured = blogs.filter((b) => b.isFeatured).length;
        return { published, draft, featured };
    }, [blogs]);

    return (
        <div className="p-6 lg:p-8">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Blog Management</h1>
                <p className="text-sm text-gray-500 mt-1">
                    Review, feature, and manage all blog posts
                </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-3 mb-6">
                {[
                    { label: "Published", value: stats.published, color: "text-emerald-600" },
                    { label: "Drafts", value: stats.draft, color: "text-amber-600" },
                    { label: "Featured", value: stats.featured, color: "text-indigo-600" },
                ].map((s) => (
                    <div key={s.label} className="rounded-xl bg-gray-50 p-4">
                        <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
                    </div>
                ))}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center mb-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setPage(1);
                        }}
                        placeholder="Search blogs or authors..."
                        className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder:text-gray-400"
                    />
                    {search && (
                        <button
                            onClick={() => setSearch("")}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    {STATUS_OPTIONS.map((opt) => (
                        <button
                            key={opt.value}
                            onClick={() => {
                                setStatusFilter(opt.value);
                                setPage(1);
                            }}
                            className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                                statusFilter === opt.value
                                    ? "bg-indigo-50 border-indigo-300 text-indigo-700"
                                    : "border-gray-200 text-gray-600 hover:bg-gray-50"
                            }`}
                        >
                            {opt.label}
                        </button>
                    ))}
                    <select
                        value={featuredFilter}
                        onChange={(e) => {
                            setFeaturedFilter(e.target.value);
                            setPage(1);
                        }}
                        className="px-3 py-1.5 text-xs font-medium border border-gray-200 rounded-lg bg-white text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value="">All</option>
                        <option value="true">Featured</option>
                        <option value="false">Not Featured</option>
                    </select>
                </div>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
                <div className="hidden md:grid md:grid-cols-[1fr_60px_70px_60px_80px_100px_100px] lg:grid-cols-[1fr_100px_90px_80px_100px_120px_130px] gap-2 lg:gap-4 px-3 lg:px-5 py-3 border-b border-gray-100 bg-gray-50/70 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <span>Title / Author</span>
                    <span>Author</span>
                    <span>Status</span>
                    <span>Views</span>
                    <span>Featured</span>
                    <span>Created</span>
                    <span className="text-right">Actions</span>
                </div>

                {loading ? (
                    <div>
                        {Array.from({ length: 8 }).map((_, i) => (
                            <SkeletonRow key={i} />
                        ))}
                    </div>
                ) : blogs.length === 0 ? (
                    <div className="text-center py-16">
                        <FileText className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                        <p className="text-sm text-gray-500">No blogs found.</p>
                    </div>
                ) : (
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={`${page}-${statusFilter}-${featuredFilter}-${refreshKey}`}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            {blogs.map((blog) => (
                                <div
                                    key={blog.id}
                                    className="px-5 py-4 border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                                >
                                    <div className="flex items-center gap-3 min-w-0">
                                        {blog.coverImage ? (
                                            <img
                                                src={blog.coverImage}
                                                alt={blog.title}
                                                className="w-16 h-10 rounded-lg object-cover shrink-0"
                                            />
                                        ) : (
                                            <div className="w-16 h-10 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0">
                                                <FileText className="w-4 h-4 text-indigo-400" />
                                            </div>
                                        )}
                                        <div className="min-w-0 flex-1">
                                            <p className="text-sm font-semibold text-gray-900 truncate">
                                                {blog.title}
                                            </p>
                                            <p className="text-xs text-gray-400 truncate">
                                                {blog.tags.slice(0, 3).join(", ")}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex md:hidden items-center gap-2 mt-2 flex-wrap">
                                        <div className="flex items-center gap-1.5 min-w-0">
                                            {blog.authorImage ? (
                                                <img
                                                    src={blog.authorImage}
                                                    alt={blog.authorName}
                                                    className="w-4 h-4 rounded-full object-cover shrink-0"
                                                />
                                            ) : (
                                                <div className="w-4 h-4 rounded-full bg-gray-200 shrink-0" />
                                            )}
                                            <span className="text-xs text-gray-500 truncate max-w-[80px]">
                                                {blog.authorName}
                                            </span>
                                        </div>
                                        <span
                                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium capitalize ${STATUS_STYLES[blog.status] || "bg-gray-50 text-gray-600"}`}
                                        >
                                            {blog.status}
                                        </span>
                                        <span className="text-xs text-gray-500 flex items-center gap-1">
                                            <Eye className="w-3 h-3" />
                                            {blog.viewCount.toLocaleString()}
                                        </span>
                                        <span className="text-xs text-gray-400 ml-auto">
                                            {formatDate(blog.createdAt)}
                                        </span>
                                    </div>

                                    <div className="md:hidden flex items-center justify-between mt-2">
                                        <button
                                            onClick={() => handleToggleFeatured(blog.id)}
                                            disabled={featuredLoading === blog.id}
                                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium transition-colors ${
                                                blog.isFeatured
                                                    ? "bg-amber-50 text-amber-700 hover:bg-amber-100"
                                                    : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                                            } disabled:opacity-50`}
                                            title={blog.isFeatured ? "Unfeature" : "Feature"}
                                        >
                                            {featuredLoading === blog.id ? (
                                                <Loader2 className="w-3 h-3 animate-spin" />
                                            ) : blog.isFeatured ? (
                                                <Star className="w-3 h-3 fill-amber-400" />
                                            ) : (
                                                <StarOff className="w-3 h-3" />
                                            )}
                                            {blog.isFeatured ? "Featured" : "Feature"}
                                        </button>
                                        <div className="flex items-center gap-1">
                                            <a
                                                href={`/blogs/${blog.slug}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center justify-center w-7 h-7 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                                                title="View"
                                            >
                                                <Eye className="w-3.5 h-3.5" />
                                            </a>
                                            <button
                                                onClick={() => handleToggleFeatured(blog.id)}
                                                disabled={featuredLoading === blog.id}
                                                className={`flex items-center justify-center w-7 h-7 rounded-lg transition-colors ${
                                                    blog.isFeatured
                                                        ? "text-amber-500 hover:text-amber-700 hover:bg-amber-50"
                                                        : "text-gray-400 hover:text-amber-500 hover:bg-amber-50"
                                                } disabled:opacity-50`}
                                                title={blog.isFeatured ? "Unfeature" : "Feature"}
                                            >
                                                {featuredLoading === blog.id ? (
                                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                                ) : (
                                                    <Star
                                                        className={`w-3.5 h-3.5 ${blog.isFeatured ? "fill-amber-400" : ""}`}
                                                    />
                                                )}
                                            </button>
                                            <button
                                                onClick={() => setDeleteId(blog.id)}
                                                className="flex items-center justify-center w-7 h-7 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                                                title="Delete"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="hidden md:grid md:grid-cols-[1fr_60px_70px_60px_80px_100px_100px] lg:grid-cols-[1fr_100px_90px_80px_100px_120px_130px] md:gap-2 lg:gap-4 md:items-center md:mt-2">
                                        <div></div>

                                        <div className="flex items-center gap-1 min-w-0">
                                            {blog.authorImage ? (
                                                <img
                                                    src={blog.authorImage}
                                                    alt={blog.authorName}
                                                    className="w-4 lg:w-5 h-4 lg:h-5 rounded-full object-cover shrink-0"
                                                />
                                            ) : (
                                                <div className="w-4 lg:w-5 h-4 lg:h-5 rounded-full bg-gray-200 shrink-0" />
                                            )}
                                            <span className="text-[11px] lg:text-xs text-gray-500 truncate max-w-[40px] lg:max-w-none">
                                                {blog.authorName}
                                            </span>
                                        </div>

                                        <span
                                            className={`inline-flex items-center px-1.5 lg:px-2.5 py-0.5 rounded-full text-[10px] lg:text-[11px] font-medium capitalize w-fit ${STATUS_STYLES[blog.status] || "bg-gray-50 text-gray-600"}`}
                                        >
                                            {blog.status}
                                        </span>

                                        <span className="text-xs lg:text-sm text-gray-500 flex items-center gap-0.5 lg:gap-1">
                                            <Eye className="w-3 h-3 lg:w-3.5 lg:h-3.5" />
                                            {blog.viewCount.toLocaleString()}
                                        </span>

                                        <button
                                            onClick={() => handleToggleFeatured(blog.id)}
                                            disabled={featuredLoading === blog.id}
                                            className={`inline-flex items-center gap-1 px-1.5 lg:px-2.5 py-1 rounded-full text-[10px] lg:text-[11px] font-medium transition-colors ${
                                                blog.isFeatured
                                                    ? "bg-amber-50 text-amber-700 hover:bg-amber-100"
                                                    : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                                            } disabled:opacity-50`}
                                            title={blog.isFeatured ? "Unfeature" : "Feature"}
                                        >
                                            {featuredLoading === blog.id ? (
                                                <Loader2 className="w-2.5 lg:w-3 h-2.5 lg:h-3 animate-spin" />
                                            ) : blog.isFeatured ? (
                                                <Star className="w-2.5 lg:w-3 h-2.5 lg:h-3 fill-amber-400" />
                                            ) : (
                                                <StarOff className="w-2.5 lg:w-3 h-2.5 lg:h-3" />
                                            )}
                                            <span className="hidden lg:inline">{blog.isFeatured ? "Featured" : "Feature"}</span>
                                        </button>

                                        <span className="text-[11px] lg:text-xs text-gray-400 truncate">
                                            {formatDate(blog.createdAt)}
                                        </span>

                                        <div className="flex items-center justify-end gap-1">
                                            <a
                                                href={`/blogs/${blog.slug}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center justify-center w-7 h-7 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                                                title="View"
                                            >
                                                <Eye className="w-3.5 h-3.5" />
                                            </a>
                                            <button
                                                onClick={() => handleToggleFeatured(blog.id)}
                                                disabled={featuredLoading === blog.id}
                                                className={`flex items-center justify-center w-7 h-7 rounded-lg transition-colors ${
                                                    blog.isFeatured
                                                        ? "text-amber-500 hover:text-amber-700 hover:bg-amber-50"
                                                        : "text-gray-400 hover:text-amber-500 hover:bg-amber-50"
                                                } disabled:opacity-50`}
                                                title={blog.isFeatured ? "Unfeature" : "Feature"}
                                            >
                                                {featuredLoading === blog.id ? (
                                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                                ) : (
                                                    <Star
                                                        className={`w-3.5 h-3.5 ${blog.isFeatured ? "fill-amber-400" : ""}`}
                                                    />
                                                )}
                                            </button>
                                            <button
                                                onClick={() => setDeleteId(blog.id)}
                                                className="flex items-center justify-center w-7 h-7 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                                                title="Delete"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    </AnimatePresence>
                )}

                {pagination && pagination.totalPages > 1 && (
                    <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100">
                        <span className="text-xs text-gray-500">
                            Page {pagination.currentPage} of {pagination.totalPages} ({pagination.total} total)
                        </span>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                disabled={!pagination.hasPrevPage}
                                className="px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40"
                            >
                                Previous
                            </button>
                            <button
                                onClick={() => setPage((p) => p + 1)}
                                disabled={!pagination.hasNextPage}
                                className="px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <AnimatePresence>
                {deleteId && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
                        onClick={(e) => {
                            if (e.target === e.currentTarget) setDeleteId(null);
                        }}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-6"
                        >
                            <h3 className="text-base font-semibold text-gray-900 mb-2">
                                Delete blog?
                            </h3>
                            <p className="text-sm text-gray-500 mb-6">
                                This will permanently remove this blog post. This action cannot be
                                undone.
                            </p>
                            <div className="flex items-center justify-end gap-2">
                                <button
                                    onClick={() => setDeleteId(null)}
                                    disabled={deleting}
                                    className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDelete}
                                    disabled={deleting}
                                    className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                                >
                                    {deleting ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <Trash2 className="w-4 h-4" />
                                    )}
                                    Delete
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
