// components/property/property-stepper.tsx
"use client";

import { cn } from "@/lib/utils/cn";
import { motion } from "framer-motion";
import {
    Home,
    MapPin,
    FileText,
    Sparkles,
    Camera,
    DollarSign,
    Calendar,
    BookOpen,
    Eye,
} from "lucide-react";
import { Check } from "lucide-react";

const STEPS = [
    { label: "Type", icon: Home },
    { label: "Location", icon: MapPin },
    { label: "Details", icon: FileText },
    { label: "Amenities", icon: Sparkles },
    { label: "Photos", icon: Camera },
    { label: "Pricing", icon: DollarSign },
    { label: "Availability", icon: Calendar },
    { label: "Rules", icon: BookOpen },
    { label: "Preview", icon: Eye },
];

interface PropertyStepperProps {
    currentStep: number;
    goToStep: (step: number) => void;
    completedSteps: Set<number>;
}

export default function PropertyStepper({
    currentStep,
    goToStep,
    completedSteps,
}: PropertyStepperProps) {
    const progress = ((currentStep + 1) / STEPS.length) * 100;

    return (
        <div className="w-full">
            {/* Progress Bar */}
            <div className="relative h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full mb-8 overflow-hidden">
                <motion.div
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                />
            </div>

            {/* Steps */}
            <div className="hidden lg:flex items-center justify-between relative">
                {/* Connector line */}
                <div className="absolute top-5 left-5 right-5 h-[2px] bg-gray-200 dark:bg-gray-700" />
                <div
                    className="absolute top-5 left-5 h-[2px] bg-gradient-to-r from-rose-500 to-pink-500 transition-all duration-500"
                    style={{
                        width: `${
                            (currentStep / (STEPS.length - 1)) * 100
                        }%`,
                        maxWidth: "calc(100% - 40px)",
                    }}
                />

                {STEPS.map((step, index) => {
                    const Icon = step.icon;
                    const isActive = index === currentStep;
                    const isCompleted = completedSteps.has(index);
                    const isPast = index < currentStep;

                    return (
                        <motion.button
                            key={step.label}
                            type="button"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => goToStep(index)}
                            className="relative z-10 flex flex-col items-center gap-2 group"
                        >
                            <div
                                className={cn(
                                    "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 border-2",
                                    isActive
                                        ? "bg-rose-500 border-rose-500 text-white shadow-lg shadow-rose-500/30 scale-110"
                                        : isCompleted || isPast
                                        ? "bg-rose-500 border-rose-500 text-white"
                                        : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-400"
                                )}
                            >
                                {isCompleted || isPast ? (
                                    <Check className="w-4 h-4" />
                                ) : (
                                    <Icon className="w-4 h-4" />
                                )}
                            </div>
                            <span
                                className={cn(
                                    "text-xs font-medium transition-colors",
                                    isActive
                                        ? "text-rose-600 dark:text-rose-400"
                                        : "text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200"
                                )}
                            >
                                {step.label}
                            </span>
                        </motion.button>
                    );
                })}
            </div>

            {/* Mobile stepper */}
            <div className="lg:hidden flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-rose-500 flex items-center justify-center text-white font-bold">
                        {currentStep + 1}
                    </div>
                    <div>
                        <p className="font-semibold text-gray-900 dark:text-white text-sm">
                            {STEPS[currentStep].label}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            Step {currentStep + 1} of {STEPS.length}
                        </p>
                    </div>
                </div>
                <div className="flex gap-1.5">
                    {STEPS.map((_, i) => (
                        <motion.button
                            key={i}
                            type="button"
                            onClick={() => goToStep(i)}
                            className={cn(
                                "w-2 h-2 rounded-full transition-all",
                                i === currentStep
                                    ? "w-6 bg-rose-500"
                                    : i < currentStep
                                    ? "bg-rose-300"
                                    : "bg-gray-300 dark:bg-gray-600"
                            )}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}