"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, Loader2, Wand2 } from "lucide-react";
import { toast } from "sonner";
import { generateBlogWithAI, type AIBlogResponse } from "@/lib/actions/blog";
import ModalPortal from "@/lib/modal-portal";

interface AIBlogGeneratorProps {
    isOpen: boolean;
    onClose: () => void;
    onGenerated: (data: AIBlogResponse) => void;
}

const TONES = [
    { value: "professional", label: "Professional" },
    { value: "casual", label: "Casual" },
    { value: "enthusiastic", label: "Enthusiastic" },
    { value: "informative", label: "Informative" },
    { value: "inspirational", label: "Inspirational" },
];

const STYLES = [
    { value: "blog-post", label: "Blog Post" },
    { value: "listicle", label: "Listicle" },
    { value: "how-to", label: "How-To Guide" },
    { value: "guide", label: "Travel Guide" },
    { value: "story", label: "Story" },
];

const LENGTHS = [
    { value: "short", label: "Short (400-600 words)" },
    { value: "medium", label: "Medium (800-1200 words)" },
    { value: "long", label: "Long (1500-2500 words)" },
];

export default function AIBlogGenerator({ isOpen, onClose, onGenerated }: AIBlogGeneratorProps) {
    const [topic, setTopic] = useState("");
    const [tone, setTone] = useState("professional");
    const [style, setStyle] = useState("blog-post");
    const [length, setLength] = useState("medium");
    const [isGenerating, setIsGenerating] = useState(false);

    const handleGenerate = async () => {
        if (!topic.trim() || topic.trim().length < 3) {
            toast.error("Topic must be at least 3 characters.");
            return;
        }

        setIsGenerating(true);
        try {
            const result = await generateBlogWithAI({ topic: topic.trim(), tone, style, length });
            if (result.success && result.data) {
                toast.success("Blog content generated!");
                onGenerated(result.data);
                onClose();
            } else {
                toast.error(result.error || "Failed to generate content. Please try again.");
            }
        } catch {
            toast.error("Something went wrong. Please try again.");
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <ModalPortal>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
                        onClick={(e) => {
                            if (e.target === e.currentTarget) onClose();
                        }}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden"
                        >
                        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                            <div className="flex items-center gap-2">
                                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-100">
                                    <Sparkles className="w-4 h-4 text-indigo-600" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold text-slate-900">AI Blog Generator</h3>
                                    <p className="text-xs text-slate-500">Generate content with AI assistance</p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="p-5 space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                                    Topic <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={topic}
                                    onChange={(e) => setTopic(e.target.value)}
                                    placeholder="e.g., Top 10 hidden gems in Bali"
                                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder:text-slate-400"
                                    disabled={isGenerating}
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-slate-700 mb-1.5">Tone</label>
                                <div className="flex flex-wrap gap-1.5">
                                    {TONES.map((t) => (
                                        <button
                                            key={t.value}
                                            type="button"
                                            onClick={() => setTone(t.value)}
                                            disabled={isGenerating}
                                            className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                                                tone === t.value
                                                    ? "bg-indigo-50 border-indigo-300 text-indigo-700"
                                                    : "border-slate-200 text-slate-600 hover:bg-slate-50"
                                            }`}
                                        >
                                            {t.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-slate-700 mb-1.5">Style</label>
                                <div className="flex flex-wrap gap-1.5">
                                    {STYLES.map((s) => (
                                        <button
                                            key={s.value}
                                            type="button"
                                            onClick={() => setStyle(s.value)}
                                            disabled={isGenerating}
                                            className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                                                style === s.value
                                                    ? "bg-indigo-50 border-indigo-300 text-indigo-700"
                                                    : "border-slate-200 text-slate-600 hover:bg-slate-50"
                                            }`}
                                        >
                                            {s.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-slate-700 mb-1.5">Length</label>
                                <div className="flex flex-wrap gap-1.5">
                                    {LENGTHS.map((l) => (
                                        <button
                                            key={l.value}
                                            type="button"
                                            onClick={() => setLength(l.value)}
                                            disabled={isGenerating}
                                            className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                                                length === l.value
                                                    ? "bg-indigo-50 border-indigo-300 text-indigo-700"
                                                    : "border-slate-200 text-slate-600 hover:bg-slate-50"
                                            }`}
                                        >
                                            {l.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-slate-100 bg-slate-50">
                            <button
                                onClick={onClose}
                                disabled={isGenerating}
                                className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleGenerate}
                                disabled={isGenerating || !topic.trim()}
                                className="flex items-center gap-2 px-5 py-2 bg-indigo-600 text-white text-xs font-medium rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isGenerating ? (
                                    <>
                                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                        Generating...
                                    </>
                                ) : (
                                    <>
                                        <Wand2 className="w-3.5 h-3.5" />
                                        Generate
                                    </>
                                )}
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
            </AnimatePresence>
        </ModalPortal>
    );
}
