// components/property/steps/step-amenities.tsx
"use client";

import { motion } from "framer-motion";
import { PropertyFormData } from "@/lib/actions/property";
import {
    AMENITIES,
    AMENITY_CATEGORIES,
} from "@/lib/constants/property-options";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface StepAmenitiesProps {
    formData: PropertyFormData;
    updateFormData: (updates: Partial<PropertyFormData>) => void;
    errors: Record<string, string>;
}

export default function StepAmenities({
    formData,
    updateFormData,
}: StepAmenitiesProps) {
    const toggleAmenity = (amenityId: string) => {
        const current = formData.amenities;
        const updated = current.includes(amenityId)
            ? current.filter((a) => a !== amenityId)
            : [...current, amenityId];
        updateFormData({ amenities: updated });
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
                    What amenities do you offer?
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="text-gray-500 dark:text-gray-400"
                >
                    Select all amenities available at your property. You can
                    always add more later.
                </motion.p>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.15 }}
                    className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 bg-rose-50 dark:bg-rose-950/30 rounded-full"
                >
                    <span className="text-sm font-medium text-rose-600 dark:text-rose-400">
                        {formData.amenities.length} selected
                    </span>
                </motion.div>
            </div>

            {AMENITY_CATEGORIES.map((category, catIdx) => {
                const categoryAmenities = AMENITIES.filter(
                    (a) => a.category === category
                );
                if (categoryAmenities.length === 0) return null;

                return (
                    <motion.div
                        key={category}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 + catIdx * 0.05 }}
                    >
                        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-4">
                            {category}
                        </h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                            {categoryAmenities.map((amenity) => {
                                const Icon = amenity.icon;
                                const isSelected =
                                    formData.amenities.includes(amenity.id);
                                return (
                                    <motion.button
                                        key={amenity.id}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.97 }}
                                        type="button"
                                        onClick={() =>
                                            toggleAmenity(amenity.id)
                                        }
                                        className={cn(
                                            "relative flex items-center gap-3 p-4 rounded-xl border-2 transition-all cursor-pointer text-left",
                                            isSelected
                                                ? "border-rose-500 bg-rose-50 dark:bg-rose-950/30"
                                                : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 hover:border-gray-300 dark:hover:border-gray-600"
                                        )}
                                    >
                                        {isSelected && (
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                className="absolute top-1.5 right-1.5 w-5 h-5 bg-rose-500 rounded-full flex items-center justify-center"
                                            >
                                                <Check className="w-3 h-3 text-white" />
                                            </motion.div>
                                        )}
                                        <Icon
                                            className={cn(
                                                "w-5 h-5 flex-shrink-0",
                                                isSelected
                                                    ? "text-rose-600 dark:text-rose-400"
                                                    : "text-gray-500 dark:text-gray-400"
                                            )}
                                        />
                                        <span
                                            className={cn(
                                                "text-sm font-medium",
                                                isSelected
                                                    ? "text-rose-700 dark:text-rose-300"
                                                    : "text-gray-700 dark:text-gray-300"
                                            )}
                                        >
                                            {amenity.label}
                                        </span>
                                    </motion.button>
                                );
                            })}
                        </div>
                    </motion.div>
                );
            })}
        </motion.div>
    );
}