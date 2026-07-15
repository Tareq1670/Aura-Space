// components/property/steps/step-preview.tsx
"use client";

import { motion } from "framer-motion";
import { PropertyFormData } from "@/lib/actions/property";
import {
    PROPERTY_TYPES,
    PLACE_TYPES,
    AMENITIES,
    CURRENCIES,
} from "@/lib/constants/property-options";
import {
    MapPin,
    Users,
    BedDouble,
    Bath,
    Bed,
    Star,
    Check,
    Clock,
    Moon,
    Shield,
    Calendar,
    Pencil,
} from "lucide-react";
import Image from "next/image";

interface StepPreviewProps {
    formData: PropertyFormData;
    goToStep: (step: number) => void;
}

function SectionHeader({
    title,
    step,
    goToStep,
}: {
    title: string;
    step: number;
    goToStep: (s: number) => void;
}) {
    return (
        <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                {title}
            </h3>
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={() => goToStep(step)}
                className="flex items-center gap-1.5 text-sm font-medium text-rose-500 hover:text-rose-600 transition-colors"
            >
                <Pencil className="w-3.5 h-3.5" />
                Edit
            </motion.button>
        </div>
    );
}

export default function StepPreview({
    formData,
    goToStep,
}: StepPreviewProps) {
    const propertyType = PROPERTY_TYPES.find(
        (t) => t.id === formData.propertyType
    );
    const placeType = PLACE_TYPES.find(
        (t) => t.id === formData.placeType
    );
    const selectedAmenities = AMENITIES.filter((a) =>
        formData.amenities.includes(a.id)
    );
    const currency =
        CURRENCIES.find((c) => c.code === formData.pricing.currency) ||
        CURRENCIES[0];

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
                    Review your listing
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="text-gray-500 dark:text-gray-400"
                >
                    Here&apos;s a summary of your listing. Review everything
                    before publishing.
                </motion.p>
            </div>

            {/* Cover Photo & Gallery */}
            {formData.photos.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="rounded-2xl overflow-hidden"
                >
                    <div className="grid grid-cols-4 grid-rows-2 gap-2 h-80">
                        <div className="col-span-2 row-span-2 relative">
                            <Image
                                src={formData.photos[0]}
                                alt="Cover"
                                fill
                                className="object-cover rounded-l-2xl"
                            />
                            <span className="absolute top-3 left-3 inline-flex items-center gap-1 px-2.5 py-1 bg-white/90 dark:bg-gray-900/90 rounded-lg text-xs font-semibold">
                                <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                                Cover
                            </span>
                        </div>
                        {formData.photos.slice(1, 5).map((photo, idx) => (
                            <div key={idx} className="relative">
                                <Image
                                    src={photo}
                                    alt={`Photo ${idx + 2}`}
                                    fill
                                    className={`object-cover ${
                                        idx === 1
                                            ? "rounded-tr-2xl"
                                            : idx === 3
                                            ? "rounded-br-2xl"
                                            : ""
                                    }`}
                                />
                            </div>
                        ))}
                    </div>
                    {formData.photos.length > 5 && (
                        <p className="text-center text-sm text-gray-500 mt-2">
                            +{formData.photos.length - 5} more photos
                        </p>
                    )}
                </motion.div>
            )}

            {/* Title & Type */}
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700 p-6"
            >
                <SectionHeader
                    title="Property Info"
                    step={0}
                    goToStep={goToStep}
                />
                <h4 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {formData.title || "Untitled Listing"}
                </h4>
                <div className="flex flex-wrap gap-2 mb-4">
                    {propertyType && (
                        <span className="px-3 py-1 bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 rounded-full text-sm font-medium">
                            {propertyType.label}
                        </span>
                    )}
                    {placeType && (
                        <span className="px-3 py-1 bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 rounded-full text-sm font-medium">
                            {placeType.label}
                        </span>
                    )}
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                    {formData.description || "No description provided"}
                </p>
            </motion.div>

            {/* Location */}
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="bg-white dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700 p-6"
            >
                <SectionHeader
                    title="Location"
                    step={1}
                    goToStep={goToStep}
                />
                <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-rose-500 mt-0.5 flex-shrink-0" />
                    <div>
                        <p className="text-gray-800 dark:text-gray-200 font-medium">
                            {formData.location.address}
                        </p>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">
                            {[
                                formData.location.city,
                                formData.location.state,
                                formData.location.country,
                                formData.location.zipCode,
                            ]
                                .filter(Boolean)
                                .join(", ")}
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* Details */}
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700 p-6"
            >
                <SectionHeader
                    title="Details"
                    step={2}
                    goToStep={goToStep}
                />
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[
                        {
                            icon: Users,
                            label: "Guests",
                            value: formData.maxGuests,
                        },
                        {
                            icon: BedDouble,
                            label: "Bedrooms",
                            value: formData.bedrooms,
                        },
                        {
                            icon: Bed,
                            label: "Beds",
                            value: formData.beds,
                        },
                        {
                            icon: Bath,
                            label: "Bathrooms",
                            value: formData.bathrooms,
                        },
                    ].map((item) => (
                        <div
                            key={item.label}
                            className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl"
                        >
                            <item.icon className="w-5 h-5 text-gray-500" />
                            <div>
                                <p className="font-bold text-gray-900 dark:text-white">
                                    {item.value}
                                </p>
                                <p className="text-xs text-gray-500">
                                    {item.label}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* Amenities */}
            {selectedAmenities.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 }}
                    className="bg-white dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700 p-6"
                >
                    <SectionHeader
                        title={`Amenities (${selectedAmenities.length})`}
                        step={3}
                        goToStep={goToStep}
                    />
                    <div className="flex flex-wrap gap-2">
                        {selectedAmenities.map((amenity) => {
                            const Icon = amenity.icon;
                            return (
                                <span
                                    key={amenity.id}
                                    className="inline-flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-xl text-sm text-gray-700 dark:text-gray-300"
                                >
                                    <Icon className="w-4 h-4" />
                                    {amenity.label}
                                </span>
                            );
                        })}
                    </div>
                </motion.div>
            )}

            {/* Pricing */}
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white border border-gray-200 rounded-2xl p-6"
            >
                <SectionHeader
                    title="Pricing"
                    step={5}
                    goToStep={goToStep}
                />
                <div className="text-4xl font-bold mb-4">
                    <span className="text-rose-600">
                        {currency.symbol}
                        {formData.pricing.perNight}
                    </span>
                    <span className="text-lg font-normal text-gray-400 ml-2">
                        / night
                    </span>
                </div>
                {formData.pricing.serviceFee > 0 && (
                    <div className="flex justify-between text-sm text-gray-500">
                        <span>Service fee</span>
                        <span>
                            {currency.symbol}
                            {formData.pricing.serviceFee}
                        </span>
                    </div>
                )}
                <div className="space-y-2 text-sm text-gray-500">
                    {formData.pricing.cleaningFee > 0 && (
                        <div className="flex justify-between">
                            <span>Cleaning fee</span>
                            <span>
                                {currency.symbol}
                                {formData.pricing.cleaningFee}
                            </span>
                        </div>
                    )}
                    {formData.pricing.weeklyDiscount > 0 && (
                        <div className="flex justify-between text-green-600">
                            <span>Weekly discount</span>
                            <span>
                                {formData.pricing.weeklyDiscount}%
                            </span>
                        </div>
                    )}
                    {formData.pricing.monthlyDiscount > 0 && (
                        <div className="flex justify-between text-green-600">
                            <span>Monthly discount</span>
                            <span>
                                {formData.pricing.monthlyDiscount}%
                            </span>
                        </div>
                    )}
                </div>
            </motion.div>

            {/* Availability */}
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 }}
                className="bg-white dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700 p-6"
            >
                <SectionHeader
                    title="Availability"
                    step={6}
                    goToStep={goToStep}
                />
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <div>
                            <p className="text-xs text-gray-500">Min stay</p>
                            <p className="font-semibold text-gray-900 dark:text-white">
                                {formData.availability.minStay} nights
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <div>
                            <p className="text-xs text-gray-500">Max stay</p>
                            <p className="font-semibold text-gray-900 dark:text-white">
                                {formData.availability.maxStay} nights
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                        <Shield className="w-4 h-4 text-gray-500" />
                        <div>
                            <p className="text-xs text-gray-500">
                                Blocked dates
                            </p>
                            <p className="font-semibold text-gray-900 dark:text-white">
                                {formData.availability.blockedDates.length}
                            </p>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* House Rules */}
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700 p-6"
            >
                <SectionHeader
                    title="House Rules"
                    step={7}
                    goToStep={goToStep}
                />
                <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {[
                            {
                                label: "Smoking",
                                allowed: formData.houseRules.smokingAllowed,
                            },
                            {
                                label: "Pets",
                                allowed: formData.houseRules.petsAllowed,
                            },
                            {
                                label: "Parties",
                                allowed: formData.houseRules.partiesAllowed,
                            },
                        ].map((rule) => (
                            <div
                                key={rule.label}
                                className={`flex items-center gap-2 p-3 rounded-xl ${
                                    rule.allowed
                                        ? "bg-green-50 dark:bg-green-950/20"
                                        : "bg-red-50 dark:bg-red-950/20"
                                }`}
                            >
                                <Check
                                    className={`w-4 h-4 ${
                                        rule.allowed
                                            ? "text-green-500"
                                            : "text-red-500"
                                    }`}
                                />
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    {rule.label}{" "}
                                    {rule.allowed
                                        ? "allowed"
                                        : "not allowed"}
                                </span>
                            </div>
                        ))}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 pt-2">
                        <div className="flex items-center gap-1.5">
                            <Clock className="w-4 h-4" />
                            Check-in: {formData.houseRules.checkInTime}
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Clock className="w-4 h-4" />
                            Check-out: {formData.houseRules.checkOutTime}
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Moon className="w-4 h-4" />
                            Quiet:{" "}
                            {formData.houseRules.quietHoursStart} -{" "}
                            {formData.houseRules.quietHoursEnd}
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}