// components/property/steps/step-details.tsx
"use client";

import { motion } from "framer-motion";
import { PropertyFormData } from "@/lib/actions/property";
import { Minus, Plus, BedDouble, Bath, Users, Bed, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useState } from "react";
import AIDescriptionGenerator from "@/Components/property/AIDescriptionGenerator";

interface StepDetailsProps {
    formData: PropertyFormData;
    updateFormData: (updates: Partial<PropertyFormData>) => void;
    errors: Record<string, string>;
}

interface CounterProps {
    label: string;
    sublabel: string;
    value: number;
    onChange: (value: number) => void;
    min?: number;
    max?: number;
    icon: React.ReactNode;
}

function Counter({
    label,
    sublabel,
    value,
    onChange,
    min = 0,
    max = 50,
    icon,
}: CounterProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between py-5 border-b border-gray-100 dark:border-gray-800"
        >
            <div className="flex items-center gap-4">
                <div className="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800">
                    {icon}
                </div>
                <div>
                    <p className="font-semibold text-gray-800 dark:text-gray-200">
                        {label}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        {sublabel}
                    </p>
                </div>
            </div>
            <div className="flex items-center gap-4">
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    type="button"
                    onClick={() => onChange(Math.max(min, value - 1))}
                    disabled={value <= min}
                    className={cn(
                        "w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all",
                        value <= min
                            ? "border-gray-200 dark:border-gray-700 text-gray-300 dark:text-gray-600 cursor-not-allowed"
                            : "border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-rose-500 hover:text-rose-500"
                    )}
                >
                    <Minus className="w-4 h-4" />
                </motion.button>
                <span className="w-8 text-center text-xl font-bold text-gray-900 dark:text-white tabular-nums">
                    {value}
                </span>
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    type="button"
                    onClick={() => onChange(Math.min(max, value + 1))}
                    disabled={value >= max}
                    className={cn(
                        "w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all",
                        value >= max
                            ? "border-gray-200 dark:border-gray-700 text-gray-300 dark:text-gray-600 cursor-not-allowed"
                            : "border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-rose-500 hover:text-rose-500"
                    )}
                >
                    <Plus className="w-4 h-4" />
                </motion.button>
            </div>
        </motion.div>
    );
}

const inputClass =
    "w-full px-4 py-3.5 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-rose-500 dark:focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 transition-all outline-none text-sm";

const labelClass =
    "block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2";

export default function StepDetails({
    formData,
    updateFormData,
    errors,
}: StepDetailsProps) {
    const [aiGeneratorOpen, setAiGeneratorOpen] = useState(false);
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
                    Tell guests about your place
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="text-gray-500 dark:text-gray-400"
                >
                    Share some basic info to help guests find your listing
                </motion.p>
            </div>

            {/* Title */}
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
            >
                <label className={labelClass}>Listing Title</label>
                <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                        updateFormData({ title: e.target.value })
                    }
                    placeholder="Cozy beachfront villa with stunning sunset views"
                    className={inputClass}
                    maxLength={100}
                />
                <div className="flex justify-between mt-1.5">
                    {errors.title ? (
                        <p className="text-red-500 text-xs">{errors.title}</p>
                    ) : (
                        <span />
                    )}
                    <span className="text-xs text-gray-400">
                        {formData.title.length}/100
                    </span>
                </div>
            </motion.div>

            {/* Description */}
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                <label className={labelClass}>Description</label>
                <textarea
                    value={formData.description}
                    onChange={(e) =>
                        updateFormData({ description: e.target.value })
                    }
                    placeholder="Describe what makes your place special. Mention the vibe, the best features, what's nearby, and why guests will love staying here..."
                    className={`${inputClass} min-h-[140px] resize-none`}
                    maxLength={2000}
                />
                <div className="flex justify-between mt-1.5">
                    {errors.description ? (
                        <p className="text-red-500 text-xs">
                            {errors.description}
                        </p>
                    ) : (
                        <span />
                    )}
                    <span className="text-xs text-gray-400">
                        {formData.description.length}/2000
                    </span>
                </div>
                <button
                    type="button"
                    onClick={() => setAiGeneratorOpen(true)}
                    className="mt-2 px-4 py-2 rounded-xl text-sm font-medium bg-gradient-to-r from-violet-500 to-indigo-500 text-white hover:shadow-lg hover:shadow-violet-500/25 transition-all flex items-center gap-2"
                >
                    <Sparkles className="w-4 h-4" />
                    Generate with AI
                </button>
            </motion.div>

            {/* Counters */}
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="bg-white dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700 p-6"
            >
                <Counter
                    label="Guests"
                    sublabel="Maximum number of guests"
                    value={formData.maxGuests}
                    onChange={(v) => updateFormData({ maxGuests: v })}
                    min={1}
                    max={20}
                    icon={
                        <Users className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    }
                />
                <Counter
                    label="Bedrooms"
                    sublabel="Number of bedrooms"
                    value={formData.bedrooms}
                    onChange={(v) => updateFormData({ bedrooms: v })}
                    min={0}
                    max={20}
                    icon={
                        <BedDouble className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    }
                />
                <Counter
                    label="Beds"
                    sublabel="Number of beds"
                    value={formData.beds}
                    onChange={(v) => updateFormData({ beds: v })}
                    min={1}
                    max={30}
                    icon={
                        <Bed className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    }
                />
                <Counter
                    label="Bathrooms"
                    sublabel="Number of bathrooms"
                    value={formData.bathrooms}
                    onChange={(v) => updateFormData({ bathrooms: v })}
                    min={0}
                    max={20}
                    icon={
                        <Bath className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    }
                />
            </motion.div>

            <AIDescriptionGenerator
                isOpen={aiGeneratorOpen}
                onClose={() => setAiGeneratorOpen(false)}
                formData={{
                    title: formData.title,
                    propertyType: formData.propertyType,
                    placeType: formData.placeType,
                    city: formData.location?.city,
                    country: formData.location?.country,
                    bedrooms: formData.bedrooms,
                    bathrooms: formData.bathrooms,
                    maxGuests: formData.maxGuests,
                    beds: formData.beds,
                    amenities: formData.amenities,
                }}
                onApply={(description) => {
                    updateFormData({ description });
                    setAiGeneratorOpen(false);
                }}
            />
        </motion.div>
    );
}