"use client";

import { useState, useRef } from "react";
import { Upload, X, Loader2, ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { uploadBlogCover } from "@/lib/actions/blog";

interface BlogCoverUploadProps {
    value: string | null;
    onChange: (url: string | null) => void;
    className?: string;
}

export default function BlogCoverUpload({ value, onChange, className }: BlogCoverUploadProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFile = async (file: File) => {
        if (!file.type.startsWith("image/")) {
            toast.error("Only image files are allowed.");
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            toast.error("File must be smaller than 5MB.");
            return;
        }

        setIsUploading(true);
        try {
            const formData = new FormData();
            formData.append("cover", file);
            const result = await uploadBlogCover(formData);
            if (result.success && result.data) {
                onChange(result.data.url);
                toast.success("Cover image uploaded.");
            } else {
                toast.error(result.error || "Upload failed.");
            }
        } catch {
            toast.error("Upload failed. Please try again.");
        } finally {
            setIsUploading(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file) handleFile(file);
    };

    const handleRemove = (e: React.MouseEvent) => {
        e.stopPropagation();
        onChange(null);
        if (inputRef.current) inputRef.current.value = "";
    };

    return (
        <div className={className}>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">Cover Image</label>
            <div
                onClick={() => !isUploading && inputRef.current?.click()}
                onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={`relative cursor-pointer rounded-xl border-2 border-dashed transition-colors ${
                    isDragging
                        ? "border-indigo-400 bg-indigo-50"
                        : value
                            ? "border-slate-200 bg-white"
                            : "border-slate-300 bg-slate-50 hover:border-indigo-300 hover:bg-indigo-50/50"
                }`}
            >
                <input
                    ref={inputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFile(file);
                    }}
                />

                {value ? (
                    <div className="relative aspect-[16/9] overflow-hidden rounded-lg">
                        <img
                            src={value}
                            alt="Cover preview"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 hover:opacity-100">
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-medium text-white bg-black/50 px-3 py-1.5 rounded-lg backdrop-blur-sm">
                                    <ImageIcon className="w-3.5 h-3.5 inline mr-1" />
                                    Change
                                </span>
                            </div>
                        </div>
                        <button
                            onClick={handleRemove}
                            className="absolute top-2 right-2 flex items-center justify-center w-7 h-7 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-colors"
                        >
                            <X className="w-3.5 h-3.5 text-slate-600" />
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-10 px-4">
                        {isUploading ? (
                            <Loader2 className="w-8 h-8 text-indigo-500 animate-spin mb-2" />
                        ) : (
                            <Upload className="w-8 h-8 text-slate-400 mb-2" />
                        )}
                        <p className="text-sm font-medium text-slate-600">
                            {isUploading ? "Uploading..." : "Click or drag to upload"}
                        </p>
                        <p className="text-xs text-slate-400 mt-1">
                            JPEG, PNG, or WebP. Max 5MB.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
