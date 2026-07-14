// components/property/steps/step-availability.tsx
"use client";

import { motion } from "framer-motion";
import { PropertyFormData } from "@/lib/actions/property";
import { Calendar, Clock, Info } from "lucide-react";
import { useState, useMemo } from "react";
import { cn } from "@/lib/utils/cn";

interface StepAvailabilityProps {
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

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function StepAvailability({
    formData,
    updateNestedField,
    errors,
}: StepAvailabilityProps) {
    const [calendarMonth, setCalendarMonth] = useState(() => {
        const now = new Date();
        return { year: now.getFullYear(), month: now.getMonth() };
    });

    const calendarDays = useMemo(() => {
        const { year, month } = calendarMonth;
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const days: (number | null)[] = [];
        for (let i = 0; i < firstDay; i++) days.push(null);
        for (let i = 1; i <= daysInMonth; i++) days.push(i);
        return days;
    }, [calendarMonth]);

    const isBlocked = (day: number) => {
        const dateStr = `${calendarMonth.year}-${String(
            calendarMonth.month + 1
        ).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
        return formData.availability.blockedDates.includes(dateStr);
    };

    const isPast = (day: number) => {
        const date = new Date(
            calendarMonth.year,
            calendarMonth.month,
            day
        );
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return date < today;
    };

    const toggleDate = (day: number) => {
        if (isPast(day)) return;
        const dateStr = `${calendarMonth.year}-${String(
            calendarMonth.month + 1
        ).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
        const current = formData.availability.blockedDates;
        const updated = current.includes(dateStr)
            ? current.filter((d) => d !== dateStr)
            : [...current, dateStr];
        updateNestedField("availability", { blockedDates: updated });
    };

    const navigateMonth = (direction: number) => {
        setCalendarMonth((prev) => {
            let newMonth = prev.month + direction;
            let newYear = prev.year;
            if (newMonth < 0) {
                newMonth = 11;
                newYear--;
            } else if (newMonth > 11) {
                newMonth = 0;
                newYear++;
            }
            return { year: newYear, month: newMonth };
        });
    };

    const monthName = new Date(
        calendarMonth.year,
        calendarMonth.month
    ).toLocaleDateString("en-US", { month: "long", year: "numeric" });

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
                    Set your availability
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="text-gray-500 dark:text-gray-400"
                >
                    Choose your booking preferences and block dates when
                    you&apos;re not available
                </motion.p>
            </div>

            {/* Stay Duration */}
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="bg-white dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 space-y-5"
            >
                <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-rose-500" />
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                        Stay Duration
                    </h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    <div>
                        <label className={labelClass}>
                            Minimum nights
                        </label>
                        <input
                            type="number"
                            value={formData.availability.minStay}
                            onChange={(e) =>
                                updateNestedField("availability", {
                                    minStay: Number(e.target.value),
                                })
                            }
                            min={1}
                            className={inputClass}
                        />
                        {errors.minStay && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.minStay}
                            </p>
                        )}
                    </div>
                    <div>
                        <label className={labelClass}>
                            Maximum nights
                        </label>
                        <input
                            type="number"
                            value={formData.availability.maxStay}
                            onChange={(e) =>
                                updateNestedField("availability", {
                                    maxStay: Number(e.target.value),
                                })
                            }
                            min={0}
                            className={inputClass}
                        />
                        {errors.maxStay && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.maxStay}
                            </p>
                        )}
                    </div>
                    <div>
                        <label className={labelClass}>
                            Advance notice (days)
                        </label>
                        <input
                            type="number"
                            value={formData.availability.advanceNotice}
                            onChange={(e) =>
                                updateNestedField("availability", {
                                    advanceNotice: Number(e.target.value),
                                })
                            }
                            min={0}
                            className={inputClass}
                        />
                    </div>
                </div>
            </motion.div>

            {/* Date Range */}
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 space-y-5"
            >
                <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-rose-500" />
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                        Available Range
                    </h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                        <label className={labelClass}>
                            Available from
                        </label>
                        <input
                            type="date"
                            value={formData.availability.availableFrom}
                            onChange={(e) =>
                                updateNestedField("availability", {
                                    availableFrom: e.target.value,
                                })
                            }
                            className={inputClass}
                        />
                    </div>
                    <div>
                        <label className={labelClass}>Available to</label>
                        <input
                            type="date"
                            value={formData.availability.availableTo}
                            onChange={(e) =>
                                updateNestedField("availability", {
                                    availableTo: e.target.value,
                                })
                            }
                            className={inputClass}
                        />
                    </div>
                </div>
            </motion.div>

            {/* Calendar */}
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="bg-white dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700 p-6"
            >
                <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                        Block Dates
                    </h3>
                    <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                        <Info className="w-3.5 h-3.5" />
                        Click dates to block/unblock
                    </div>
                </div>

                {/* Month Navigator */}
                <div className="flex items-center justify-between mb-5">
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        type="button"
                        onClick={() => navigateMonth(-1)}
                        className="w-10 h-10 rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                        ‹
                    </motion.button>
                    <h4 className="font-bold text-gray-800 dark:text-gray-200">
                        {monthName}
                    </h4>
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        type="button"
                        onClick={() => navigateMonth(1)}
                        className="w-10 h-10 rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                        ›
                    </motion.button>
                </div>

                {/* Day Headers */}
                <div className="grid grid-cols-7 mb-2">
                    {DAYS.map((day) => (
                        <div
                            key={day}
                            className="text-center text-xs font-semibold text-gray-400 dark:text-gray-500 py-2"
                        >
                            {day}
                        </div>
                    ))}
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-1">
                    {calendarDays.map((day, idx) => {
                        if (day === null) {
                            return <div key={`empty-${idx}`} />;
                        }
                        const past = isPast(day);
                        const blocked = isBlocked(day);
                        return (
                            <motion.button
                                key={day}
                                type="button"
                                whileHover={!past ? { scale: 1.1 } : {}}
                                whileTap={!past ? { scale: 0.95 } : {}}
                                onClick={() => toggleDate(day)}
                                disabled={past}
                                className={cn(
                                    "aspect-square rounded-lg flex items-center justify-center text-sm font-medium transition-all relative",
                                    past
                                        ? "text-gray-300 dark:text-gray-600 cursor-not-allowed"
                                        : blocked
                                        ? "bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400 border-2 border-red-300 dark:border-red-800"
                                        : "text-gray-700 dark:text-gray-300 hover:bg-rose-50 dark:hover:bg-rose-950/20 cursor-pointer"
                                )}
                            >
                                {day}
                                {blocked && (
                                    <span className="absolute inset-0 flex items-center justify-center">
                                        <span className="absolute w-[70%] h-[1px] bg-red-400 dark:bg-red-600 rotate-45" />
                                    </span>
                                )}
                            </motion.button>
                        );
                    })}
                </div>

                {formData.availability.blockedDates.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800"
                    >
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            <span className="font-semibold text-red-500">
                                {formData.availability.blockedDates.length}
                            </span>{" "}
                            date(s) blocked
                        </p>
                    </motion.div>
                )}
            </motion.div>
        </motion.div>
    );
}