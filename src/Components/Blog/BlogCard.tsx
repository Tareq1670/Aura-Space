"use client";

import { motion } from "framer-motion";
import { Clock, Eye, User } from "lucide-react";
import Link from "next/link";
import type { Blog } from "@/lib/actions/blog";

interface BlogCardProps {
    blog: Blog;
    index?: number;
}

export default function BlogCard({ blog, index = 0 }: BlogCardProps) {
    const coverImage = blog.coverImage || "/placeholder-property.svg";

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
        >
            <Link href={`/blogs/${blog.slug}`} className="group block h-full">
                <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-all duration-300 hover:shadow-md hover:border-indigo-200">
                    <div className="relative aspect-[16/9] overflow-hidden bg-slate-100">
                        <img
                            src={coverImage}
                            alt={blog.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = "/placeholder-property.svg";
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
                                {blog.tags.slice(0, 3).map((tag) => (
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
                                        src={blog.authorImage}
                                        alt={blog.authorName}
                                        className="w-5 h-5 rounded-full object-cover"
                                    />
                                ) : (
                                    <User className="w-4 h-4 text-slate-400" />
                                )}
                                <span className="text-[11px] text-slate-500 truncate max-w-[80px] sm:max-w-[120px]">
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
    );
}
