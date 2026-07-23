"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import {
    motion,
    useInView,
    useReducedMotion,
    type Variants,
} from "framer-motion";
import { Clock, Eye, ArrowRight } from "lucide-react";
import { getPublicBlogs, type Blog } from "@/lib/actions/blog";

const EASE = [0.16, 1, 0.3, 1] as const;

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1, delayChildren: 0.08 },
    },
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 28, filter: "blur(6px)" },
    visible: {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        transition: { duration: 0.7, ease: EASE },
    },
};

function BlogCardSkeleton() {
    return (
        <div className="rounded-2xl border border-slate-100 bg-white overflow-hidden animate-pulse">
            <div className="aspect-[16/9] bg-slate-200" />
            <div className="p-4 space-y-2">
                <div className="flex gap-1.5">
                    <div className="h-4 w-14 bg-slate-200 rounded-full" />
                </div>
                <div className="h-4 w-3/4 bg-slate-200 rounded" />
                <div className="h-3 w-full bg-slate-200 rounded" />
                <div className="h-3 w-2/3 bg-slate-200 rounded" />
            </div>
        </div>
    );
}

export default function FeaturedBlogs() {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [loading, setLoading] = useState(true);
    const sectionRef = useRef<HTMLElement>(null);
    const isInView = useInView(sectionRef, { once: true, margin: "-60px" });
    const reduceMotion = !!useReducedMotion();

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await getPublicBlogs({ limit: "3", sort: "newest" });
                if (res.success && res.data?.blogs?.length) {
                    setBlogs(res.data.blogs);
                }
            } catch (e) {
                console.error("[FeaturedBlogs] fetch error:", e);
            }
            setLoading(false);
        }
        fetchData();
    }, []);

    if (loading || blogs.length === 0) return null;

    return (
        <section
            ref={sectionRef}
            className="relative w-full overflow-hidden bg-slate-50/50 py-16 sm:py-20 lg:py-24"
        >
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute -left-32 top-20 h-[350px] w-[350px] rounded-full bg-indigo-50/60 blur-3xl" />
                <div className="absolute -right-32 bottom-20 h-[350px] w-[350px] rounded-full bg-violet-50/50 blur-3xl" />
            </div>

            <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={reduceMotion ? {} : { opacity: 0, y: 24 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.7, ease: EASE }}
                    className="flex items-end justify-between mb-10"
                >
                    <div>
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold tracking-wide text-indigo-600 mb-3">
                            Blog &amp; Guides
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                            Latest from our blog
                        </h2>
                        <p className="mt-2 text-slate-500 text-sm sm:text-base max-w-lg">
                            Travel tips, destination guides, and hospitality insights from the AuraSpace community.
                        </p>
                    </div>
                    <Link
                        href="/blogs"
                        className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors shrink-0"
                    >
                        View all
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </motion.div>

                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <BlogCardSkeleton key={i} />
                        ))}
                    </div>
                ) : (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate={isInView ? "visible" : "hidden"}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
                    >
                        {blogs.slice(0, 3).map((blog) => (
                            <motion.div key={blog.id} variants={itemVariants}>
                                <Link
                                    href={`/blogs/${blog.slug}`}
                                    className="group block h-full"
                                >
                                    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-all duration-300 hover:shadow-md hover:border-indigo-200">
                                        <div className="relative aspect-[16/9] overflow-hidden bg-slate-100">
                                            <img
                                                src={
                                                    blog.coverImage ||
                                                    "/placeholder-property.svg"
                                                }
                                                alt={blog.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                onError={(e) => {
                                                    (
                                                        e.target as HTMLImageElement
                                                    ).src =
                                                        "/placeholder-property.svg";
                                                }}
                                            />
                                            {blog.isFeatured && (
                                                <span className="absolute top-3 right-3 bg-amber-400 text-amber-900 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
                                                    Featured
                                                </span>
                                            )}
                                        </div>

                                        <div className="flex flex-1 flex-col p-4">
                                            {blog.tags.length > 0 && (
                                                <div className="flex flex-wrap gap-1.5 mb-2">
                                                    {blog.tags
                                                        .slice(0, 2)
                                                        .map((tag) => (
                                                            <span
                                                                key={tag}
                                                                className="text-[10px] font-medium uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full"
                                                            >
                                                                {tag}
                                                            </span>
                                                        ))}
                                                </div>
                                            )}

                                            <h3 className="text-sm font-bold text-slate-900 leading-snug line-clamp-2 group-hover:text-indigo-600 transition-colors">
                                                {blog.title}
                                            </h3>

                                            <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 flex-1">
                                                {blog.excerpt}
                                            </p>

                                            <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
                                                <div className="flex items-center gap-1.5">
                                                    {blog.authorImage ? (
                                                        <img
                                                            src={
                                                                blog.authorImage
                                                            }
                                                            alt={
                                                                blog.authorName
                                                            }
                                                            className="w-5 h-5 rounded-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-5 h-5 rounded-full bg-slate-200" />
                                                    )}
                                                    <span className="text-[11px] text-slate-500 truncate max-w-[60px] sm:max-w-[100px]">
                                                        {blog.authorName}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2 text-[11px] text-slate-400">
                                                    <span className="flex items-center gap-0.5">
                                                        <Clock className="w-3 h-3" />
                                                        {blog.readingTime}m
                                                    </span>
                                                    <span className="flex items-center gap-0.5">
                                                        <Eye className="w-3 h-3" />
                                                        {blog.viewCount}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </motion.div>
                )}

                <div className="mt-8 text-center sm:hidden">
                    <Link
                        href="/blogs"
                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
                    >
                        View all blogs
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
