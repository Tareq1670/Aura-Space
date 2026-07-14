// components/property/steps/step-photos.tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { PropertyFormData } from "@/lib/actions/property";
import { uploadMultipleImages } from "@/lib/utils/image-upload";
import { useState, useCallback, useRef } from "react";
import {
    Upload,
    X,
    ImagePlus,
    GripVertical,
    Star,
    Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import Image from "next/image";

interface StepPhotosProps {
    formData: PropertyFormData;
    updateFormData: (updates: Partial<PropertyFormData>) => void;
    errors: Record<string, string>;
}

export default function StepPhotos({
    formData,
    updateFormData,
    errors,
}: StepPhotosProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState({ done: 0, total: 0 });
    const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const dragItem = useRef<number | null>(null);

    const handleFiles = useCallback(
        async (files: FileList | File[]) => {
            const fileArray = Array.from(files).filter((f) =>
                f.type.startsWith("image/")
            );
            if (fileArray.length === 0) return;

            setIsUploading(true);
            setUploadProgress({ done: 0, total: fileArray.length });

            try {
                const urls = await uploadMultipleImages(
                    fileArray,
                    (completed, total) => {
                        setUploadProgress({ done: completed, total });
                    }
                );
                updateFormData({
                    photos: [...formData.photos, ...urls],
                });
            } catch (error) {
                console.error("Upload failed:", error);
            } finally {
                setIsUploading(false);
                setUploadProgress({ done: 0, total: 0 });
            }
        },
        [formData.photos, updateFormData]
    );

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files.length > 0) {
            handleFiles(e.dataTransfer.files);
        }
    };

    const removePhoto = (index: number) => {
        const updated = formData.photos.filter((_, i) => i !== index);
        updateFormData({ photos: updated });
    };

    const handleReorderDragStart = (index: number) => {
        dragItem.current = index;
    };

    const handleReorderDragOver = (
        e: React.DragEvent,
        index: number
    ) => {
        e.preventDefault();
        setDragOverIndex(index);
    };

    const handleReorderDrop = (index: number) => {
        if (dragItem.current === null || dragItem.current === index) {
            setDragOverIndex(null);
            return;
        }
        const updated = [...formData.photos];
        const [removed] = updated.splice(dragItem.current, 1);
        updated.splice(index, 0, removed);
        updateFormData({ photos: updated });
        dragItem.current = null;
        setDragOverIndex(null);
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.4 }}
            className="space-y-8"
        >
            <div>
                <motion.h2
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-3xl font-bold text-gray-900 dark:text-white mb-2"
                >
                    Add photos of your place
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="text-gray-500 dark:text-gray-400"
                >
                    Upload at least 3 photos. The first photo will be your
                    cover image. Drag to reorder.
                </motion.p>
            </div>

            {errors.photos && (
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-red-500 text-sm flex items-center gap-1"
                >
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-500" />
                    {errors.photos}
                </motion.p>
            )}

            {/* Upload Zone */}
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => !isUploading && fileInputRef.current?.click()}
                className={cn(
                    "relative rounded-2xl border-2 border-dashed p-10 flex flex-col items-center justify-center gap-4 cursor-pointer transition-all min-h-[200px]",
                    isDragging
                        ? "border-rose-500 bg-rose-50 dark:bg-rose-950/20 scale-[1.01]"
                        : "border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/30 hover:border-gray-400 dark:hover:border-gray-500",
                    isUploading && "pointer-events-none opacity-70"
                )}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => {
                        if (e.target.files) handleFiles(e.target.files);
                        e.target.value = "";
                    }}
                    className="hidden"
                />

                {isUploading ? (
                    <div className="flex flex-col items-center gap-3">
                        <Loader2 className="w-10 h-10 text-rose-500 animate-spin" />
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                            Uploading {uploadProgress.done} of{" "}
                            {uploadProgress.total}...
                        </p>
                        <div className="w-48 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-rose-500 rounded-full"
                                initial={{ width: 0 }}
                                animate={{
                                    width: `${
                                        (uploadProgress.done /
                                            uploadProgress.total) *
                                        100
                                    }%`,
                                }}
                                transition={{ duration: 0.3 }}
                            />
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="p-4 rounded-full bg-rose-100 dark:bg-rose-900/30">
                            <Upload className="w-8 h-8 text-rose-500" />
                        </div>
                        <div className="text-center">
                            <p className="font-semibold text-gray-700 dark:text-gray-200">
                                Drag & drop your photos here
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                or click to browse • JPG, PNG, WebP
                            </p>
                        </div>
                    </>
                )}
            </motion.div>

            {/* Photo Grid */}
            <AnimatePresence>
                {formData.photos.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
                    >
                        {formData.photos.map((photo, index) => (
                            <motion.div
                                key={`${photo}-${index}`}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                layout
                                transition={{
                                    type: "spring",
                                    stiffness: 300,
                                    damping: 25,
                                }}
                                draggable
                                onDragStart={() =>
                                    handleReorderDragStart(index)
                                }
                                onDragOver={(e) =>
                                    handleReorderDragOver(e as unknown as React.DragEvent, index)
                                }
                                onDrop={() => handleReorderDrop(index)}
                                onDragEnd={() => setDragOverIndex(null)}
                                className={cn(
                                    "relative group rounded-xl overflow-hidden border-2 aspect-[4/3] cursor-grab active:cursor-grabbing",
                                    index === 0
                                        ? "col-span-2 row-span-2 sm:col-span-2 sm:row-span-2"
                                        : "",
                                    dragOverIndex === index
                                        ? "border-rose-500 scale-105"
                                        : "border-transparent"
                                )}
                            >
                                <Image
                                    src={photo}
                                    alt={`Property photo ${index + 1}`}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                />

                                {/* Overlay */}
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-200">
                                    <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <GripVertical className="w-5 h-5 text-white drop-shadow-lg" />
                                    </div>

                                    {index === 0 && (
                                        <div className="absolute top-2 left-8 group-hover:left-9">
                                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-white/90 dark:bg-gray-900/90 rounded-lg text-xs font-semibold text-gray-800 dark:text-gray-200">
                                                <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                                                Cover
                                            </span>
                                        </div>
                                    )}

                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            removePhoto(index);
                                        }}
                                        className="absolute top-2 right-2 w-8 h-8 bg-white/90 dark:bg-gray-900/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 dark:hover:bg-red-950"
                                    >
                                        <X className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                                    </motion.button>
                                </div>
                            </motion.div>
                        ))}

                        {/* Add More */}
                        <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="aspect-[4/3] rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 flex flex-col items-center justify-center gap-2 hover:border-rose-400 dark:hover:border-rose-600 transition-all bg-gray-50 dark:bg-gray-800/30"
                        >
                            <ImagePlus className="w-6 h-6 text-gray-400" />
                            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                                Add More
                            </span>
                        </motion.button>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}