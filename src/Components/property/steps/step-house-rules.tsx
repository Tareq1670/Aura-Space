
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { PropertyFormData } from "@/lib/actions/property";
import { TIME_OPTIONS } from "@/lib/constants/property-options";
import {
    Cigarette,
    PawPrint,
    PartyPopper,
    Clock,
    Moon,
    Plus,
    X,
    Shield,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useState } from "react";

interface StepHouseRulesProps {
    formData: PropertyFormData;
    updateNestedField: <K extends keyof PropertyFormData>(
        field: K,
        updates: Partial<PropertyFormData[K]>
    ) => void;
    errors: Record<string, string>;
}

const inputClass =
    "w-full px-4 py-3.5 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-rose-500 dark:focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 transition-all outline-none text-sm";

const labelClass =
    "block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2";

interface ToggleRuleProps {
    icon: React.ReactNode;
    label: string;
    description: string;
    checked: boolean;
    onChange: (val: boolean) => void;
}

function ToggleRule({
    icon,
    label,
    description,
    checked,
    onChange,
}: ToggleRuleProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between py-5 border-b border-gray-100 dark:border-gray-800 last:border-0"
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
                        {description}
                    </p>
                </div>
            </div>
            <motion.button
                type="button"
                whileTap={{ scale: 0.95 }}
                onClick={() => onChange(!checked)}
                className={cn(
                    "relative w-14 h-8 rounded-full transition-colors duration-200 flex-shrink-0",
                    checked
                        ? "bg-rose-500"
                        : "bg-gray-300 dark:bg-gray-600"
                )}
            >
                <motion.div
                    layout
                    transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 30,
                    }}
                    className={cn(
                        "absolute top-1 w-6 h-6 bg-white rounded-full shadow-md",
                        checked ? "left-7" : "left-1"
                    )}
                />
            </motion.button>
        </motion.div>
    );
}

export default function StepHouseRules({
    formData,
    updateNestedField,
    errors,
}: StepHouseRulesProps) {
    const [newRule, setNewRule] = useState("");

    const addRule = () => {
        const trimmed = newRule.trim();
        if (!trimmed) return;
        updateNestedField("houseRules", {
            additionalRules: [
                ...formData.houseRules.additionalRules,
                trimmed,
            ],
        });
        setNewRule("");
    };

    const removeRule = (index: number) => {
        const updated = formData.houseRules.additionalRules.filter(
            (_, i) => i !== index
        );
        updateNestedField("houseRules", { additionalRules: updated });
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
                    Set house rules
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="text-gray-500 dark:text-gray-400"
                >
                    Clear rules help set expectations for guests and protect
                    your property.
                </motion.p>
            </div>

            {/* Toggle Rules */}
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="bg-white dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700 p-6"
            >
                <ToggleRule
                    icon={
                        <Cigarette className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    }
                    label="Smoking allowed"
                    description="Guests can smoke inside the property"
                    checked={formData.houseRules.smokingAllowed}
                    onChange={(v) =>
                        updateNestedField("houseRules", {
                            smokingAllowed: v,
                        })
                    }
                />
                <ToggleRule
                    icon={
                        <PawPrint className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    }
                    label="Pets allowed"
                    description="Guests can bring their pets"
                    checked={formData.houseRules.petsAllowed}
                    onChange={(v) =>
                        updateNestedField("houseRules", {
                            petsAllowed: v,
                        })
                    }
                />
                <ToggleRule
                    icon={
                        <PartyPopper className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    }
                    label="Parties & events allowed"
                    description="Guests can host events at the property"
                    checked={formData.houseRules.partiesAllowed}
                    onChange={(v) =>
                        updateNestedField("houseRules", {
                            partiesAllowed: v,
                        })
                    }
                />
            </motion.div>

            {/* Check-in / Check-out */}
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 space-y-5"
            >
                <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-rose-500" />
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                        Check-in & Check-out
                    </h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                        <label className={labelClass}>Check-in time</label>
                        <select
                            value={formData.houseRules.checkInTime}
                            onChange={(e) =>
                                updateNestedField("houseRules", {
                                    checkInTime: e.target.value,
                                })
                            }
                            className={inputClass}
                        >
                            {TIME_OPTIONS.map((time) => (
                                <option key={`in-${time}`} value={time}>
                                    {time}
                                </option>
                            ))}
                        </select>
                        {errors.checkInTime && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.checkInTime}
                            </p>
                        )}
                    </div>
                    <div>
                        <label className={labelClass}>
                            Check-out time
                        </label>
                        <select
                            value={formData.houseRules.checkOutTime}
                            onChange={(e) =>
                                updateNestedField("houseRules", {
                                    checkOutTime: e.target.value,
                                })
                            }
                            className={inputClass}
                        >
                            {TIME_OPTIONS.map((time) => (
                                <option key={`out-${time}`} value={time}>
                                    {time}
                                </option>
                            ))}
                        </select>
                        {errors.checkOutTime && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.checkOutTime}
                            </p>
                        )}
                    </div>
                </div>
            </motion.div>

            {/* Quiet Hours */}
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="bg-white dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 space-y-5"
            >
                <div className="flex items-center gap-2">
                    <Moon className="w-5 h-5 text-indigo-500" />
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                        Quiet Hours
                    </h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                        <label className={labelClass}>From</label>
                        <select
                            value={formData.houseRules.quietHoursStart}
                            onChange={(e) =>
                                updateNestedField("houseRules", {
                                    quietHoursStart: e.target.value,
                                })
                            }
                            className={inputClass}
                        >
                            {TIME_OPTIONS.map((time) => (
                                <option key={`qs-${time}`} value={time}>
                                    {time}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className={labelClass}>To</label>
                        <select
                            value={formData.houseRules.quietHoursEnd}
                            onChange={(e) =>
                                updateNestedField("houseRules", {
                                    quietHoursEnd: e.target.value,
                                })
                            }
                            className={inputClass}
                        >
                            {TIME_OPTIONS.map((time) => (
                                <option key={`qe-${time}`} value={time}>
                                    {time}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </motion.div>

            {/* Additional Rules */}
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 space-y-5"
            >
                <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-emerald-500" />
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                        Additional Rules
                    </h3>
                </div>
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={newRule}
                        onChange={(e) => setNewRule(e.target.value)}
                        onKeyDown={(e) =>
                            e.key === "Enter" && (e.preventDefault(), addRule())
                        }
                        placeholder="e.g., No shoes inside the house"
                        className={`${inputClass} flex-1`}
                    />
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="button"
                        onClick={addRule}
                        disabled={!newRule.trim()}
                        className="px-4 py-3.5 bg-rose-500 hover:bg-rose-600 disabled:bg-gray-300 dark:disabled:bg-gray-700 text-white rounded-xl transition-colors flex-shrink-0"
                    >
                        <Plus className="w-5 h-5" />
                    </motion.button>
                </div>

                <AnimatePresence mode="popLayout">
                    {formData.houseRules.additionalRules.map(
                        (rule, index) => (
                            <motion.div
                                key={`${rule}-${index}`}
                                initial={{ opacity: 0, height: 0, y: -10 }}
                                animate={{ opacity: 1, height: "auto", y: 0 }}
                                exit={{ opacity: 0, height: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                                className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl"
                            >
                                <span className="w-6 h-6 rounded-full bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 flex items-center justify-center text-xs font-bold flex-shrink-0">
                                    {index + 1}
                                </span>
                                <span className="flex-1 text-sm text-gray-700 dark:text-gray-300">
                                    {rule}
                                </span>
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    type="button"
                                    onClick={() => removeRule(index)}
                                    className="w-7 h-7 rounded-full hover:bg-red-100 dark:hover:bg-red-950/30 flex items-center justify-center transition-colors"
                                >
                                    <X className="w-4 h-4 text-gray-400 hover:text-red-500" />
                                </motion.button>
                            </motion.div>
                        )
                    )}
                </AnimatePresence>
            </motion.div>
        </motion.div>
    );
}