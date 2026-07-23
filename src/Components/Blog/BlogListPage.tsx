"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
    Plus,
    Eye,
    Edit3,
    Trash2,
    Clock,
    FileText,
    Loader2,
} from "lucide-react";
import { getMyBlogs, deleteBlog, type Blog, type PaginationInfo } from "@/lib/actions/blog";

const STATUS_OPTIONS = [
    { value: "", label: "All" },
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
            <div className="h-5 w-16 bg-slate-200 rounded-full shrink-0" />
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

interface BlogListPageProps {
    backLink: {
        create: string;
        edit: string;
        list: string;
    };
}

export default function BlogListPage({ backLink }: BlogListPageProps) {
    const router = useRouter();

    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [pagination, setPagination] = useState<PaginationInfo | null>(null);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState("");
    const [page, setPage] = useState(1);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [deleting, setDeleting] = useState(false);

    const fetchBlogs = useCallback(async () => {
        setLoading(true);
        try {
            const result = await getMyBlogs({
                page: String(page),
                limit: "10",
                status: statusFilter || undefined,
            });
            if (result.success && result.data) {
                setBlogs(result.data.blogs || []);
                setPagination(result.data.pagination || null);
            }
        } finally {
            setLoading(false);
        }
    }, [page, statusFilter]);

    useEffect(() => {
        fetchBlogs();
    }, [fetchBlogs]);

    const handleDelete = async () => {
        if (!deleteId) return;
        setDeleting(true);
        try {
            const result = await deleteBlog(deleteId);
            if (result.success) {
                toast.success("Blog deleted.");
                setDeleteId(null);
                fetchBlogs();
            } else {
                toast.error(result.error || "Failed to delete blog.");
            }
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div className="p-6 lg:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">My Blogs</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Manage your published and draft blog posts
                    </p>
                </div>
                <Link
                    href={backLink.create}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-xl hover:bg-indigo-700 transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    New Blog
                </Link>
            </div>

            <div className="flex items-center gap-2 mb-4">
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
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
                <div className="hidden md:grid md:grid-cols-[1fr_80px_70px_60px_110px_110px] lg:grid-cols-[1fr_90px_80px_70px_120px_130px] gap-2 lg:gap-4 px-3 lg:px-5 py-3 border-b border-gray-100 bg-gray-50/70 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <span>Title</span>
                    <span>Status</span>
                    <span>Views</span>
                    <span>Read</span>
                    <span>Created</span>
                    <span className="text-right">Actions</span>
                </div>

                {loading ? (
                    <div>
                        {Array.from({ length: 5 }).map((_, i) => (
                            <SkeletonRow key={i} />
                        ))}
                    </div>
                ) : blogs.length === 0 ? (
                    <div className="text-center py-16">
                        <FileText className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                        <p className="text-sm text-gray-500 mb-3">No blogs yet.</p>
                        <Link
                            href={backLink.create}
                            className="text-sm font-medium text-indigo-600 hover:underline"
                        >
                            Write your first blog
                        </Link>
                    </div>
                ) : (
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={`${page}-${statusFilter}`}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            {blogs.map((blog) => (
                                <div
                                    key={blog.id}
                                    className="px-3 lg:px-5 py-4 border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                                >
                                    <div className="flex items-center gap-3 min-w-0">
                                        {blog.coverImage ? (
                                            <img
                                                src={blog.coverImage}
                                                alt={blog.title}
                                                className="w-12 sm:w-16 h-10 rounded-lg object-cover shrink-0"
                                            />
                                        ) : (
                                            <div className="w-12 sm:w-16 h-10 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0">
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
                                        <span
                                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium capitalize ${STATUS_STYLES[blog.status] || "bg-gray-50 text-gray-600"}`}
                                        >
                                            {blog.status}
                                        </span>
                                        <span className="text-xs text-gray-500 flex items-center gap-1">
                                            <Eye className="w-3 h-3" />
                                            {blog.viewCount.toLocaleString()}
                                        </span>
                                        <span className="text-xs text-gray-500 flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {blog.readingTime}m
                                        </span>
                                        <span className="text-xs text-gray-400 ml-auto">
                                            {formatDate(blog.createdAt)}
                                        </span>
                                    </div>

                                    <div className="md:hidden flex items-center justify-end gap-1 mt-1">
                                        <Link
                                            href={`/blogs/${blog.slug}`}
                                            target="_blank"
                                            className="flex items-center justify-center w-7 h-7 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                                            title="View"
                                        >
                                            <Eye className="w-3.5 h-3.5" />
                                        </Link>
                                        <button
                                            onClick={() =>
                                                router.push(`${backLink.edit}/${blog.id}`)
                                            }
                                            className="flex items-center justify-center w-7 h-7 rounded-lg text-indigo-500 hover:text-indigo-700 hover:bg-indigo-50 transition-colors"
                                            title="Edit"
                                        >
                                            <Edit3 className="w-3.5 h-3.5" />
                                        </button>
                                        <button
                                            onClick={() => setDeleteId(blog.id)}
                                            className="flex items-center justify-center w-7 h-7 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                                            title="Delete"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>

                                    <div className="hidden md:grid md:grid-cols-[1fr_80px_70px_60px_110px_110px] lg:grid-cols-[1fr_90px_80px_70px_120px_130px] md:gap-2 lg:gap-4 md:items-center md:mt-2">
                                        <div></div>

                                        <span
                                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium capitalize w-fit ${STATUS_STYLES[blog.status] || "bg-gray-50 text-gray-600"}`}
                                        >
                                            {blog.status}
                                        </span>

                                        <span className="text-xs lg:text-sm text-gray-500 flex items-center gap-0.5 lg:gap-1">
                                            <Eye className="w-3 h-3 lg:w-3.5 lg:h-3.5" />
                                            {blog.viewCount.toLocaleString()}
                                        </span>

                                        <span className="text-xs lg:text-sm text-gray-500 flex items-center gap-0.5 lg:gap-1">
                                            <Clock className="w-3 h-3 lg:w-3.5 lg:h-3.5" />
                                            {blog.readingTime}m
                                        </span>

                                        <span className="text-[11px] lg:text-xs text-gray-400 truncate">
                                            {formatDate(blog.createdAt)}
                                        </span>

                                        <div className="flex items-center justify-end gap-1">
                                            <Link
                                                href={`/blogs/${blog.slug}`}
                                                target="_blank"
                                                className="flex items-center justify-center w-7 h-7 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                                                title="View"
                                            >
                                                <Eye className="w-3.5 h-3.5" />
                                            </Link>
                                            <button
                                                onClick={() =>
                                                    router.push(`${backLink.edit}/${blog.id}`)
                                                }
                                                className="flex items-center justify-center w-7 h-7 rounded-lg text-indigo-500 hover:text-indigo-700 hover:bg-indigo-50 transition-colors"
                                                title="Edit"
                                            >
                                                <Edit3 className="w-3.5 h-3.5" />
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
                            Page {pagination.currentPage} of {pagination.totalPages}
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
                                This action cannot be undone. The blog will be permanently removed.
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
