// components/property/steps/step-location.tsx
"use client";

import { motion } from "framer-motion";
import { PropertyFormData } from "@/lib/actions/property";
import { COUNTRIES } from "@/lib/constants/property-options";
import { MapPin, Navigation } from "lucide-react";

interface StepLocationProps {
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

export default function StepLocation({
    formData,
    updateNestedField,
    errors,
}: StepLocationProps) {
    const handleGetCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    updateNestedField("location", {
                        coordinates: {
                            lat: position.coords.latitude,
                            lng: position.coords.longitude,
                        },
                    });
                },
                (error) => {
                    console.error("Error getting location:", error);
                }
            );
        }
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
                    Where&apos;s your place located?
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="text-gray-500 dark:text-gray-400"
                >
                    Your address is only shared with guests after they&apos;ve
                    made a reservation
                </motion.p>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-5"
            >
                {/* Country */}
                <div>
                    <label className={labelClass}>Country / Region</label>
                    <select
                        value={formData.location.country}
                        onChange={(e) =>
                            updateNestedField("location", {
                                country: e.target.value,
                            })
                        }
                        className={inputClass}
                    >
                        <option value="">Select a country</option>
                        {COUNTRIES.map((country) => (
                            <option key={country} value={country}>
                                {country}
                            </option>
                        ))}
                    </select>
                    {errors.country && (
                        <p className="text-red-500 text-xs mt-1.5">
                            {errors.country}
                        </p>
                    )}
                </div>

                {/* Street Address */}
                <div>
                    <label className={labelClass}>Street Address</label>
                    <div className="relative">
                        <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            value={formData.location.address}
                            onChange={(e) =>
                                updateNestedField("location", {
                                    address: e.target.value,
                                })
                            }
                            placeholder="123 Main Street, Apt 4B"
                            className={`${inputClass} pl-11`}
                        />
                    </div>
                    {errors.address && (
                        <p className="text-red-500 text-xs mt-1.5">
                            {errors.address}
                        </p>
                    )}
                </div>

                {/* City & State */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className={labelClass}>City</label>
                        <input
                            type="text"
                            value={formData.location.city}
                            onChange={(e) =>
                                updateNestedField("location", {
                                    city: e.target.value,
                                })
                            }
                            placeholder="Dhaka"
                            className={inputClass}
                        />
                        {errors.city && (
                            <p className="text-red-500 text-xs mt-1.5">
                                {errors.city}
                            </p>
                        )}
                    </div>
                    <div>
                        <label className={labelClass}>
                            State / Province
                        </label>
                        <input
                            type="text"
                            value={formData.location.state}
                            onChange={(e) =>
                                updateNestedField("location", {
                                    state: e.target.value,
                                })
                            }
                            placeholder="Dhaka Division"
                            className={inputClass}
                        />
                    </div>
                </div>

                {/* Zip Code */}
                <div>
                    <label className={labelClass}>ZIP / Postal Code</label>
                    <input
                        type="text"
                        value={formData.location.zipCode}
                        onChange={(e) =>
                            updateNestedField("location", {
                                zipCode: e.target.value,
                            })
                        }
                        placeholder="1205"
                        className={`${inputClass} max-w-xs`}
                    />
                    {errors.zipCode && (
                        <p className="text-red-500 text-xs mt-1.5">
                            {errors.zipCode}
                        </p>
                    )}
                </div>

                {/* Map placeholder & get location button */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="relative rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/30 overflow-hidden"
                >
                    <div className="h-52 flex flex-col items-center justify-center gap-4">
                        <div className="p-4 rounded-full bg-rose-100 dark:bg-rose-900/30">
                            <MapPin className="w-8 h-8 text-rose-500" />
                        </div>
                        {formData.location.coordinates.lat !== 0 ? (
                            <div className="text-center">
                                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Location set
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                    {formData.location.coordinates.lat.toFixed(
                                        4
                                    )}
                                    ,{" "}
                                    {formData.location.coordinates.lng.toFixed(
                                        4
                                    )}
                                </p>
                            </div>
                        ) : (
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Pin your property on the map (optional)
                            </p>
                        )}
                        <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            type="button"
                            onClick={handleGetCurrentLocation}
                            className="flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-200 hover:shadow-md transition-all"
                        >
                            <Navigation className="w-4 h-4" />
                            Use my current location
                        </motion.button>
                    </div>
                </motion.div>
            </motion.div>
        </motion.div>
    );
}