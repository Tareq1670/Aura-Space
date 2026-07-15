// components/property/steps/step-pricing.tsx
"use client";

import { motion } from "framer-motion";
import { PropertyFormData } from "@/lib/actions/property";
import { CURRENCIES } from "@/lib/constants/property-options";
import {
    DollarSign,
    Sparkles,
    TrendingDown,
    Calculator,
} from "lucide-react";

interface StepPricingProps {
    formData: PropertyFormData;
    updateNestedField: <K extends keyof PropertyFormData>(
        field: K,
        updates: Partial<PropertyFormData[K]>
    ) => void;
    errors: Record<string, string>;
}

const inputClass =
    "w-full px-4 py-3.5 rounded-xl border-2 border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 transition-all outline-none text-sm";

const labelClass =
    "block text-sm font-semibold text-gray-700 mb-2";

export default function StepPricing({
    formData,
    updateNestedField,
    errors,
}: StepPricingProps) {
    const selectedCurrency = CURRENCIES.find(
        (c) => c.code === formData.pricing.currency
    ) || CURRENCIES[0];

    const calculateGuestTotal = () => {
        const base = formData.pricing.perNight || 0;
        const cleaning = formData.pricing.cleaningFee || 0;
        const service = formData.pricing.serviceFee || 0;
        return base + cleaning + service;
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
                        className="text-3xl font-bold text-gray-900 mb-2"
                    >
                        Set your pricing
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="text-gray-500"
                    >
                        You can change these anytime. Competitive pricing helps
                        your listing stand out.
                    </motion.p>
                </div>

                {/* Currency Selection */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                >
                    <label className={labelClass}>Currency</label>
                    <select
                        value={formData.pricing.currency}
                        onChange={(e) =>
                            updateNestedField("pricing", {
                                currency: e.target.value,
                            })
                        }
                        className={`${inputClass} max-w-xs`}
                >
                    {CURRENCIES.map((currency) => (
                        <option key={currency.code} value={currency.code}>
                            {currency.symbol} {currency.code} -{" "}
                            {currency.label}
                        </option>
                    ))}
                </select>
            </motion.div>

            {/* Per Night Price - Main */}
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-950/20 dark:to-pink-950/20 rounded-2xl border border-rose-200 dark:border-rose-800/50 p-6"
            >
                <div className="flex items-center gap-2 mb-4">
                    <DollarSign className="w-5 h-5 text-rose-500" />
                    <h3 className="font-bold text-lg text-gray-900">
                        Price per night
                    </h3>
                </div>
                <div className="relative max-w-sm">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-gray-400">
                        {selectedCurrency.symbol}
                    </span>
                    <input
                        type="number"
                        value={formData.pricing.perNight ?? ""}
                        onChange={(e) =>
                            updateNestedField("pricing", {
                                perNight: Number(e.target.value),
                            })
                        }
                        placeholder="0"
                        min={0}
                        className="w-full pl-12 pr-4 py-5 rounded-xl border-2 border-rose-200 bg-white text-3xl font-bold text-gray-900 placeholder-gray-300 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 transition-all outline-none"
                    />
                </div>
                {errors.perNight && (
                    <p className="text-red-500 text-xs mt-2">
                        {errors.perNight}
                    </p>
                )}
            </motion.div>

            {/* Additional Fees */}
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5"
            >
                <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-5 h-5 text-amber-500" />
                    <h3 className="font-bold text-lg text-gray-900">
                        Additional Fees
                    </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                        <label className={labelClass}>Cleaning Fee</label>
                        <div className="relative">
                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 font-semibold">
                                {selectedCurrency.symbol}
                            </span>
                            <input
                                type="number"
                                value={formData.pricing.cleaningFee ?? ""}
                                onChange={(e) =>
                                    updateNestedField("pricing", {
                                        cleaningFee: Number(e.target.value),
                                    })
                                }
                                placeholder="0"
                                min={0}
                                className={`${inputClass} pl-9`}
                            />
                        </div>
                    </div>
                    <div>
                        <label className={labelClass}>Service Fee</label>
                        <div className="relative">
                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 font-semibold">
                                {selectedCurrency.symbol}
                            </span>
                            <input
                                type="number"
                                value={formData.pricing.serviceFee ?? ""}
                                onChange={(e) =>
                                    updateNestedField("pricing", {
                                        serviceFee: Number(e.target.value),
                                    })
                                }
                                placeholder="0"
                                min={0}
                                className={`${inputClass} pl-9`}
                            />
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Discounts */}
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5"
            >
                <div className="flex items-center gap-2 mb-2">
                    <TrendingDown className="w-5 h-5 text-green-500" />
                    <h3 className="font-bold text-lg text-gray-900">
                        Discounts
                    </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                        <label className={labelClass}>
                            Weekly Discount (%)
                        </label>
                        <div className="relative">
                            <input
                                type="number"
                                value={
                                    formData.pricing.weeklyDiscount ?? ""
                                }
                                onChange={(e) =>
                                    updateNestedField("pricing", {
                                        weeklyDiscount: Number(
                                            e.target.value
                                        ),
                                    })
                                }
                                placeholder="0"
                                min={0}
                                max={90}
                                className={inputClass}
                            />
                            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 font-semibold">
                                %
                            </span>
                        </div>
                    </div>
                    <div>
                        <label className={labelClass}>
                            Monthly Discount (%)
                        </label>
                        <div className="relative">
                            <input
                                type="number"
                                value={
                                    formData.pricing.monthlyDiscount ?? ""
                                }
                                onChange={(e) =>
                                    updateNestedField("pricing", {
                                        monthlyDiscount: Number(
                                            e.target.value
                                        ),
                                    })
                                }
                                placeholder="0"
                                min={0}
                                max={90}
                                className={inputClass}
                            />
                            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 font-semibold">
                                %
                            </span>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Price Preview */}
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="bg-white border border-gray-200 rounded-2xl p-6 text-gray-900"
            >
                <div className="flex items-center gap-2 mb-4">
                    <Calculator className="w-5 h-5 text-rose-500" />
                    <h3 className="font-bold text-lg">
                        Guest sees (1 night)
                    </h3>
                </div>
                <div className="space-y-3">
                    <div className="flex justify-between text-gray-600">
                        <span>Base price</span>
                        <span>
                            {selectedCurrency.symbol}
                            {formData.pricing.perNight || 0}
                        </span>
                    </div>
                    {formData.pricing.cleaningFee > 0 && (
                        <div className="flex justify-between text-gray-600">
                            <span>Cleaning fee</span>
                            <span>
                                {selectedCurrency.symbol}
                                {formData.pricing.cleaningFee}
                            </span>
                        </div>
                    )}
                    {formData.pricing.serviceFee > 0 && (
                        <div className="flex justify-between text-gray-600">
                            <span>Service fee</span>
                            <span>
                                {selectedCurrency.symbol}
                                {formData.pricing.serviceFee}
                            </span>
                        </div>
                    )}
                    <div className="border-t border-gray-200 pt-3 flex justify-between font-bold text-xl">
                        <span>Total</span>
                        <span className="text-rose-600">
                            {selectedCurrency.symbol}
                            {calculateGuestTotal()}
                        </span>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}