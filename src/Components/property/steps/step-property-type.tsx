// components/property/steps/step-property-type.tsx
"use client";

import { motion } from "framer-motion";
import { PROPERTY_TYPES, PLACE_TYPES } from "@/lib/constants/property-options";
import { PropertyFormData } from "@/lib/actions/property";
import { cn } from "@/lib/utils/cn";
import { Check } from "lucide-react";

interface StepPropertyTypeProps {
    formData: PropertyFormData;
    updateFormData: (updates: Partial<PropertyFormData>) => void;
    errors: Record<string, string>;
}

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.04 },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { type: "spring", stiffness: 300, damping: 24 },
    },
} as const;

export default function StepPropertyType({
    formData,
    updateFormData,
    errors,
}: StepPropertyTypeProps) {
    return (
        <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.4 }}
            className="space-y-10"
        >
            {/* Property Type */}
            <div>
                <motion.h2
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-3xl font-bold text-gray-900 dark:text-white mb-2"
                >
                    What type of place will guests have?
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="text-gray-500 dark:text-gray-400 mb-6"
                >
                    Choose the option that best describes your property
                </motion.p>

                {errors.propertyType && (
                    <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="text-red-500 text-sm mb-4 flex items-center gap-1"
                    >
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-500" />
                        {errors.propertyType}
                    </motion.p>
                )}

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
                >
                    {PROPERTY_TYPES.map((type) => {
                        const Icon = type.icon;
                        const isSelected = formData.propertyType === type.id;
                        return (
                            <motion.button
                                key={type.id}
                                variants={itemVariants}
                                whileHover={{ scale: 1.03, y: -2 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={() =>
                                    updateFormData({ propertyType: type.id })
                                }
                                className={cn(
                                    "relative flex flex-col items-center gap-3 p-5 rounded-2xl border-2 transition-all duration-200 cursor-pointer group",
                                    isSelected
                                        ? "border-rose-500 bg-rose-50 dark:bg-rose-950/30 shadow-lg shadow-rose-500/10"
                                        : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-800/50"
                                )}
                            >
                                {isSelected && (
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="absolute top-2 right-2 w-6 h-6 bg-rose-500 rounded-full flex items-center justify-center"
                                    >
                                        <Check className="w-3.5 h-3.5 text-white" />
                                    </motion.div>
                                )}
                                <div
                                    className={cn(
                                        "p-3 rounded-xl transition-colors",
                                        isSelected
                                            ? "bg-rose-100 dark:bg-rose-900/40"
                                            : "bg-gray-100 dark:bg-gray-700 group-hover:bg-gray-200 dark:group-hover:bg-gray-600"
                                    )}
                                >
                                    <Icon
                                        className={cn(
                                            "w-7 h-7 transition-colors",
                                            isSelected
                                                ? "text-rose-600 dark:text-rose-400"
                                                : "text-gray-600 dark:text-gray-300"
                                        )}
                                    />
                                </div>
                                <span
                                    className={cn(
                                        "font-semibold text-sm text-center transition-colors",
                                        isSelected
                                            ? "text-rose-700 dark:text-rose-300"
                                            : "text-gray-700 dark:text-gray-300"
                                    )}
                                >
                                    {type.label}
                                </span>
                                <span className="text-xs text-gray-400 dark:text-gray-500 text-center leading-tight">
                                    {type.description}
                                </span>
                            </motion.button>
                        );
                    })}
                </motion.div>
            </div>

            {/* Place Type */}
            <div>
                <motion.h3
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-2xl font-bold text-gray-900 dark:text-white mb-2"
                >
                    What type of space will guests have?
                </motion.h3>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.35 }}
                    className="text-gray-500 dark:text-gray-400 mb-6"
                >
                    Select the arrangement that matches your listing
                </motion.p>

                {errors.placeType && (
                    <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="text-red-500 text-sm mb-4 flex items-center gap-1"
                    >
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-500" />
                        {errors.placeType}
                    </motion.p>
                )}

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="space-y-3"
                >
                    {PLACE_TYPES.map((type) => {
                        const isSelected = formData.placeType === type.id;
                        return (
                            <motion.button
                                key={type.id}
                                variants={itemVariants}
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                                onClick={() =>
                                    updateFormData({ placeType: type.id })
                                }
                                className={cn(
                                    "w-full flex items-center justify-between p-5 rounded-2xl border-2 transition-all cursor-pointer text-left",
                                    isSelected
                                        ? "border-rose-500 bg-rose-50 dark:bg-rose-950/30 shadow-lg shadow-rose-500/10"
                                        : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-800/50"
                                )}
                            >
                                <div>
                                    <h4
                                        className={cn(
                                            "font-semibold text-lg",
                                            isSelected
                                                ? "text-rose-700 dark:text-rose-300"
                                                : "text-gray-800 dark:text-gray-200"
                                        )}
                                    >
                                        {type.label}
                                    </h4>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                        {type.description}
                                    </p>
                                </div>
                                <div
                                    className={cn(
                                        "w-7 h-7 rounded-full border-2 flex items-center justify-center flex-shrink-0 ml-4 transition-all",
                                        isSelected
                                            ? "border-rose-500 bg-rose-500"
                                            : "border-gray-300 dark:border-gray-600"
                                    )}
                                >
                                    {isSelected && (
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                        >
                                            <Check className="w-4 h-4 text-white" />
                                        </motion.div>
                                    )}
                                </div>
                            </motion.button>
                        );
                    })}
                </motion.div>
            </div>
        </motion.div>
    );
}