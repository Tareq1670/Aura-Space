"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    ArrowLeft,
    Clock,
    Eye,
    User,
    Calendar,
    Share2,
    Copy,
    CheckCircle2,
    Loader2,
} from "lucide-react";
import { getBlogBySlug, getPublicBlogs, type Blog } from "@/lib/actions/blog";
import BlogCard from "@/Components/Blog/BlogCard";

function DetailSkeleton() {
    return (
        <div className="min-h-screen bg-white animate-pulse">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
                <div className="h-4 w-24 bg-slate-200 rounded mb-8" />
                <div className="h-8 w-3/4 bg-slate-200 rounded mb-4" />
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 rounded-full bg-slate-200" />
                    <div className="h-3 w-24 bg-slate-200 rounded" />
                    <div className="h-3 w-16 bg-slate-200 rounded" />
                </div>
                <div className="aspect-[16/9] bg-slate-200 rounded-2xl mb-8" />
                <div className="space-y-3">
                    <div className="h-4 w-full bg-slate-200 rounded" />
                    <div className="h-4 w-5/6 bg-slate-200 rounded" />
                    <div className="h-4 w-4/6 bg-slate-200 rounded" />
                </div>
            </div>
        </div>
    );
}

function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}

export default function BlogDetailPage() {
    const params = useParams();
    const slug = params.slug as string;

    const [blog, setBlog] = useState<Blog | null>(null);
    const [relatedBlogs, setRelatedBlogs] = useState<Blog[]>([]);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (!slug) return;
        let cancelled = false;

        async function fetchBlog() {
            setLoading(true);
            try {
                const result = await getBlogBySlug(slug);
                if (cancelled) return;
                if (result.success && result.data) {
                    setBlog(result.data.blog);
                } else {
                    setNotFound(true);
                }
            } catch {
                if (!cancelled) setNotFound(true);
            } finally {
                if (!cancelled) setLoading(false);
            }
        }
        fetchBlog();
        return () => {
            cancelled = true;
        };
    }, [slug]);

    useEffect(() => {
        if (!blog) return;
        let cancelled = false;

        async function fetchRelated() {
            try {
                const result = await getPublicBlogs({ limit: "3" });
                if (!cancelled && result.success && result.data) {
                    setRelatedBlogs(
                        (result.data.blogs || []).filter(
                            (b) => b.id !== blog?.id
                        ).slice(0, 3)
                    );
                }
            } catch {
                // silent
            }
        }
        fetchRelated();
        return () => {
            cancelled = true;
        };
    }, [blog]);

    const handleShare = () => {
        const url = window.location.href;
        navigator.clipboard.writeText(url).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    if (loading) return <DetailSkeleton />;

    if (notFound || !blog) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-slate-900 mb-2">Blog not found</h1>
                    <p className="text-slate-500 text-sm mb-4">
                        The blog you&apos;re looking for doesn&apos;t exist or has been removed.
                    </p>
                    <Link
                        href="/blogs"
                        className="text-indigo-600 text-sm font-medium hover:underline"
                    >
                        Back to blogs
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
                <Link
                    href="/blogs"
                    className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-indigo-600 transition-colors mb-6"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to blogs
                </Link>

                <motion.article
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {blog.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-3">
                            {blog.tags.map((tag) => (
                                <span
                                    key={tag}
                                    className="text-[10px] font-medium uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full capitalize"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}

                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-tight mb-4">
                        {blog.title}
                    </h1>

                    <div className="flex items-center flex-wrap gap-4 text-sm text-slate-500 mb-6">
                        <div className="flex items-center gap-2">
                            {blog.authorImage ? (
                                <img
                                    src={blog.authorImage}
                                    alt={blog.authorName}
                                    className="w-7 h-7 rounded-full object-cover"
                                />
                            ) : (
                                <User className="w-5 h-5 text-slate-400" />
                            )}
                            <span className="font-medium text-slate-700">{blog.authorName}</span>
                        </div>
                        <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            {formatDate(blog.createdAt)}
                        </span>
                        <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {blog.readingTime} min read
                        </span>
                        <span className="flex items-center gap-1">
                            <Eye className="w-3.5 h-3.5" />
                            {blog.viewCount.toLocaleString()} views
                        </span>
                        <button
                            onClick={handleShare}
                            className="flex items-center gap-1 text-indigo-600 hover:text-indigo-700 transition-colors ml-auto"
                            title="Copy link"
                        >
                            {copied ? (
                                <CheckCircle2 className="w-3.5 h-3.5" />
                            ) : (
                                <Share2 className="w-3.5 h-3.5" />
                            )}
                            <span className="text-xs">{copied ? "Copied!" : "Share"}</span>
                        </button>
                    </div>

                    {blog.coverImage && (
                        <div className="aspect-[16/9] overflow-hidden rounded-2xl mb-8 bg-slate-100">
                            <img
                                src={blog.coverImage}
                                alt={blog.title}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    )}

                    <div
                        className="prose prose-slate max-w-none prose-headings:text-slate-900 prose-p:text-slate-700 prose-a:text-indigo-600 prose-img:rounded-xl"
                        dangerouslySetInnerHTML={{ __html: blog.content }}
                    />
                </motion.article>

                {relatedBlogs.length > 0 && (
                    <div className="mt-16 pt-8 border-t border-slate-100">
                        <h2 className="text-lg font-bold text-slate-900 mb-5">Related articles</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {relatedBlogs.map((b, i) => (
                                <BlogCard key={b.id} blog={b} index={i} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
