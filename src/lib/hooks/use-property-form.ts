// lib/hooks/use-property-form.ts
"use client";

import { useState, useCallback, useEffect } from "react";
import { PropertyFormData } from "@/lib/actions/property";

const initialFormData: PropertyFormData = {
    propertyType: "",
    placeType: "",
    location: {
        address: "",
        city: "",
        state: "",
        country: "",
        zipCode: "",
        coordinates: { lat: 0, lng: 0 },
    },
    title: "",
    description: "",
    bedrooms: 1,
    bathrooms: 1,
    beds: 1,
    maxGuests: 1,
    amenities: [],
    photos: [],
    pricing: {
        perNight: 0,
        cleaningFee: 0,
        serviceFee: 0,
        weeklyDiscount: 0,
        monthlyDiscount: 0,
        currency: "BDT",
    },
    availability: {
        minStay: 1,
        maxStay: 30,
        advanceNotice: 1,
        availableFrom: "",
        availableTo: "",
        blockedDates: [],
    },
    houseRules: {
        smokingAllowed: false,
        petsAllowed: false,
        partiesAllowed: false,
        checkInTime: "3:00 PM",
        checkOutTime: "11:00 AM",
        additionalRules: [],
        quietHoursStart: "10:00 PM",
        quietHoursEnd: "7:00 AM",
    },
    status: "draft",
};

export function usePropertyForm() {
    const [formData, setFormData] = useState<PropertyFormData>(() => {
        try {
            const saved = localStorage.getItem("property_draft");
            if (saved) {
                try {
                    return { ...initialFormData, ...JSON.parse(saved) };
                } catch {
                    // corrupted data, use defaults
                }
            }
        } catch {
            // localStorage unavailable
        }
        return initialFormData;
    });
    const [hydrated, setHydrated] = useState(true);
    const [currentStep, setCurrentStep] = useState(0);
    const [draftId, setDraftId] = useState<string | null>(null);

    const updateFormData = useCallback(
        (updates: Partial<PropertyFormData>) => {
            setFormData((prev) => {
                const newData = { ...prev, ...updates };
                try {
                    localStorage.setItem(
                        "property_draft",
                        JSON.stringify(newData)
                    );
                } catch {
                    // localStorage unavailable
                }
                return newData;
            });
        },
        []
    );

    const updateNestedField = useCallback(
        <K extends keyof PropertyFormData>(
            field: K,
            updates: Partial<PropertyFormData[K]>
        ) => {
            setFormData((prev) => {
                const newData = {
                    ...prev,
                    [field]: { ...(prev[field] as object), ...updates },
                };
                try {
                    localStorage.setItem(
                        "property_draft",
                        JSON.stringify(newData)
                    );
                } catch {
                    // localStorage unavailable
                }
                return newData;
            });
        },
        []
    );

    const nextStep = useCallback(() => {
        setCurrentStep((prev) => Math.min(prev + 1, 8));
    }, []);

    const prevStep = useCallback(() => {
        setCurrentStep((prev) => Math.max(prev - 1, 0));
    }, []);

    const goToStep = useCallback((step: number) => {
        setCurrentStep(Math.max(0, Math.min(step, 8)));
    }, []);

    const resetForm = useCallback(() => {
        setFormData(initialFormData);
        setCurrentStep(0);
        setDraftId(null);
        try {
            localStorage.removeItem("property_draft");
        } catch {
            // localStorage unavailable
        }
    }, []);

    return {
        formData,
        hydrated,
        currentStep,
        draftId,
        setDraftId,
        updateFormData,
        updateNestedField,
        nextStep,
        prevStep,
        goToStep,
        resetForm,
        setCurrentStep,
    };
}