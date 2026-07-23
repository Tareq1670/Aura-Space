"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
    ArrowLeft, Save, Send, Loader2, Sparkles,
    PenLine, FileText, Tag,
} from "lucide-react";
import {
    createBlog,
    updateBlog,
    getMyBlogs,
    type Blog,
    type CreateBlogData,
} from "@/lib/actions/blog";
import BlogEditor from "@/Components/Blog/BlogEditor";
import BlogCoverUpload from "@/Components/Blog/BlogCoverUpload";
import AIBlogGenerator from "@/Components/Blog/AIBlogGenerator";
import type { AIBlogResponse } from "@/lib/actions/blog";

const TAG_SUGGESTIONS = [
    "travel", "tips", "destination", "guide",
    "culture", "food", "adventure", "budget", "luxury", "business",
];

const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { type: "spring" as const, stiffness: 100, damping: 15 },
    },
};

interface BlogFormPageProps {
    blogId?: string;
    backLink: {
        list: string;
    };
}

function FormSkeleton() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/40">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
                <div className="animate-pulse space-y-6">
                    <div className="h-4 w-28 bg-slate-200 rounded-lg" />
                    <div className="h-8 w-48 bg-slate-200 rounded-xl" />
                    <div className="h-48 bg-white rounded-3xl border border-slate-200/60" />
                    <div className="h-80 bg-white rounded-3xl border border-slate-200/60" />
                    <div className="h-40 bg-white rounded-3xl border border-slate-200/60" />
                </div>
            </div>
        </div>
    );
}

export default function BlogFormPage({ blogId, backLink }: BlogFormPageProps) {
    const router = useRouter();
    const isEditing = !!blogId;

    const [loadingData, setLoadingData] = useState(isEditing);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [excerpt, setExcerpt] = useState("");
    const [tags, setTags] = useState<string[]>([]);
    const [tagInput, setTagInput] = useState("");
    const [coverImage, setCoverImage] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);
    const [aiOpen, setAiOpen] = useState(false);

    useEffect(() => {
        if (!isEditing || !blogId) return;
        let cancelled = false;

        async function fetchBlog() {
            try {
                const result = await getMyBlogs({ limit: "100" });
                if (cancelled) return;
                if (result.success && result.data) {
                    const found = (result.data.blogs || []).find((b) => b.id === blogId);
                    if (found) {
                        setTitle(found.title);
                        setContent(found.content);
                        setExcerpt(found.excerpt);
                        setTags(found.tags);
                        setCoverImage(found.coverImage);
                    } else {
                        toast.error("Blog not found.");
                        router.push(backLink.list);
                    }
                }
            } catch {
                if (!cancelled) {
                    toast.error("Failed to load blog.");
                    router.push(backLink.list);
                }
            } finally {
                if (!cancelled) setLoadingData(false);
            }
        }
        fetchBlog();
        return () => { cancelled = true; };
    }, [blogId, isEditing, router, backLink.list]);

    const addTag = (tag: string) => {
        const t = tag.trim().toLowerCase();
        if (t && !tags.includes(t) && tags.length < 10) {
            setTags([...tags, t]);
        }
        setTagInput("");
    };

    const removeTag = (tag: string) => {
        setTags(tags.filter((t) => t !== tag));
    };

    const handleAIGenerated = (data: AIBlogResponse) => {
        if (data.title) setTitle(data.title);
        if (data.content) setContent(data.content);
        if (data.excerpt) setExcerpt(data.excerpt);
        if (data.tags?.length) setTags(data.tags.slice(0, 10));
        toast.success("AI content loaded into editor.");
    };

    const handleSubmit = async (publishStatus: "published" | "draft") => {
        if (!title.trim() || title.trim().length < 3) {
            toast.error("Title must be at least 3 characters.");
            return;
        }
        const strippedContent = content.replace(/<[^>]*>/g, "").trim();
        if (strippedContent.length < 10) {
            toast.error("Content must be at least 10 characters.");
            return;
        }

        setSaving(true);
        try {
            const data: Partial<CreateBlogData> = {
                title: title.trim(),
                content,
                excerpt: excerpt.trim() || undefined,
                tags,
                coverImage,
                status: publishStatus,
            };

            let result;
            if (isEditing && blogId) {
                result = await updateBlog(blogId, data);
            } else {
                result = await createBlog(data as CreateBlogData);
            }

            if (result.success) {
                toast.success(
                    isEditing
                        ? "Blog updated."
                        : publishStatus === "published"
                            ? "Blog published!"
                            : "Draft saved."
                );
                router.push(backLink.list);
            } else {
                toast.error(result.error || "Failed to save blog.");
            }
        } finally {
            setSaving(false);
        }
    };

    if (loadingData) return <FormSkeleton />;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/40">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <Link
                        href={backLink.list}
                        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-indigo-600 transition-colors mb-6 font-medium"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to My Blogs
                    </Link>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8"
                >
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                            {isEditing ? "Edit Blog" : "Create Blog"}
                        </h1>
                        <p className="text-sm text-slate-500 mt-1">
                            {isEditing ? "Update your blog post" : "Write and publish your blog post"}
                        </p>
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setAiOpen(true)}
                        className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white text-xs sm:text-sm font-semibold rounded-lg sm:rounded-xl shadow-lg shadow-indigo-500/30 transition-all shrink-0"
                    >
                        <Sparkles className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
                        AI Generate
                    </motion.button>
                </motion.div>

                <div className="space-y-6">
                    {/* ── Card: Content (Title + Cover) ── */}
                    <motion.div
                        variants={cardVariants}
                        initial="hidden"
                        animate="visible"
                        whileHover={{ y: -2 }}
                        className="bg-white rounded-3xl shadow-xl shadow-indigo-950/5 border border-slate-200/60 overflow-hidden"
                    >
                        <div className="p-5 sm:p-8">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 shrink-0">
                                    <PenLine className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-base sm:text-lg font-bold text-slate-900">
                                        Content
                                    </h3>
                                    <p className="text-xs text-slate-500">
                                        Blog title and cover image
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-5">
                                <div>
                                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 block">
                                        Title <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder="Enter a compelling title..."
                                        className="w-full px-4 py-3 text-lg font-semibold border-2 border-slate-200 bg-slate-50 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition placeholder:text-slate-400"
                                    />
                                </div>

                                <BlogCoverUpload value={coverImage} onChange={setCoverImage} />
                            </div>
                        </div>
                    </motion.div>

                    {/* ── Card: Body (Editor) ── */}
                    <motion.div
                        variants={cardVariants}
                        initial="hidden"
                        animate="visible"
                        whileHover={{ y: -2 }}
                        className="bg-white rounded-3xl shadow-xl shadow-indigo-950/5 border border-slate-200/60 overflow-hidden"
                    >
                        <div className="p-5 sm:p-8">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/30 shrink-0">
                                    <FileText className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-base sm:text-lg font-bold text-slate-900">
                                        Body
                                    </h3>
                                    <p className="text-xs text-slate-500">
                                        Write your blog content <span className="text-red-500">*</span>
                                    </p>
                                </div>
                            </div>

                            <BlogEditor
                                content={content}
                                onChange={setContent}
                                placeholder="Start writing your blog..."
                            />
                        </div>
                    </motion.div>

                    {/* ── Card: Details (Excerpt + Tags) ── */}
                    <motion.div
                        variants={cardVariants}
                        initial="hidden"
                        animate="visible"
                        whileHover={{ y: -2 }}
                        className="bg-white rounded-3xl shadow-xl shadow-indigo-950/5 border border-slate-200/60 overflow-hidden"
                    >
                        <div className="p-5 sm:p-8">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/30 shrink-0">
                                    <Tag className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-base sm:text-lg font-bold text-slate-900">
                                        Details
                                    </h3>
                                    <p className="text-xs text-slate-500">
                                        Excerpt and tags for your blog
                                    </p>
                                </div>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-5 sm:gap-6">
                                {/* Excerpt */}
                                <div className="sm:col-span-2 lg:col-span-1">
                                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 block">
                                        Excerpt
                                    </label>
                                    <textarea
                                        value={excerpt}
                                        onChange={(e) => setExcerpt(e.target.value)}
                                        placeholder="Brief summary (auto-generated if left empty)"
                                        rows={4}
                                        maxLength={300}
                                        className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition placeholder:text-slate-400 resize-none"
                                    />
                                    <div className="flex justify-end mt-1">
                                        <span className="text-xs text-slate-400">{excerpt.length}/300</span>
                                    </div>
                                </div>

                                {/* Tags */}
                                <div className="sm:col-span-2 lg:col-span-1">
                                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 block">
                                        Tags
                                    </label>
                                    <div className="flex flex-wrap gap-1.5 mb-3 min-h-[28px]">
                                        {tags.map((tag) => (
                                            <span
                                                key={tag}
                                                className="inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-50 text-indigo-700 text-xs font-medium rounded-full capitalize border border-indigo-200"
                                            >
                                                {tag}
                                                <button
                                                    onClick={() => removeTag(tag)}
                                                    className="text-indigo-400 hover:text-indigo-600 leading-none"
                                                >
                                                    &times;
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={tagInput}
                                            onChange={(e) => setTagInput(e.target.value)}
                                            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(tagInput); } }}
                                            placeholder="Type a tag + Enter"
                                            className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition placeholder:text-slate-400"
                                        />
                                    </div>
                                    {TAG_SUGGESTIONS.filter((t) => !tags.includes(t)).length > 0 && (
                                        <div className="flex flex-wrap gap-1.5 mt-3">
                                            <span className="text-[11px] text-slate-400 font-medium uppercase tracking-wider self-center mr-1">
                                                Suggest:
                                            </span>
                                            {TAG_SUGGESTIONS.filter((t) => !tags.includes(t)).slice(0, 6).map((tag) => (
                                                <button
                                                    key={tag}
                                                    onClick={() => addTag(tag)}
                                                    className="px-2.5 py-1 text-[11px] font-medium text-slate-500 border border-slate-200 rounded-full hover:bg-slate-50 hover:border-indigo-300 hover:text-indigo-600 capitalize transition-colors"
                                                >
                                                    + {tag}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* ── Sticky action bar ── */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.4 }}
                    className="sticky bottom-4 sm:bottom-6 z-10 mt-8"
                >
                    <div className="bg-white/90 backdrop-blur-xl rounded-xl sm:rounded-2xl shadow-xl shadow-indigo-950/10 border border-slate-200/60 px-3 sm:px-8 py-3 sm:py-4 flex items-center justify-end gap-2 sm:gap-3">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleSubmit("draft")}
                        disabled={saving}
                        className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 border-2 border-slate-200 text-xs sm:text-sm font-semibold text-slate-600 rounded-lg sm:rounded-xl hover:bg-slate-50 transition disabled:opacity-50"
                    >
                        <Save className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
                        Save Draft
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleSubmit("published")}
                        disabled={saving}
                        className="flex items-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-2 sm:py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-xs sm:text-sm font-semibold rounded-lg sm:rounded-xl shadow-lg shadow-indigo-600/30 transition disabled:opacity-50"
                    >
                        {saving ? (
                            <Loader2 className="w-3.5 sm:w-4 h-3.5 sm:h-4 animate-spin" />
                        ) : (
                            <Send className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
                        )}
                        {isEditing ? "Update" : "Publish"}
                    </motion.button>
                    </div>
                </motion.div>
            </div>

            <AIBlogGenerator isOpen={aiOpen} onClose={() => setAiOpen(false)} onGenerated={handleAIGenerated} />
        </div>
    );
}
