// lib/validations/property.ts

export interface StepValidation {
    isValid: boolean;
    errors: Record<string, string>;
}

export function validateStep1(data: {
    propertyType: string;
    placeType: string;
}): StepValidation {
    const errors: Record<string, string> = {};
    if (!data.propertyType) errors.propertyType = "Property type is required";
    if (!data.placeType) errors.placeType = "Place type is required";
    return { isValid: Object.keys(errors).length === 0, errors };
}

export function validateStep2(data: {
    location: {
        address: string;
        city: string;
        state: string;
        country: string;
        zipCode: string;
    };
}): StepValidation {
    const errors: Record<string, string> = {};
    if (!data.location.address) errors.address = "Address is required";
    if (!data.location.city) errors.city = "City is required";
    if (!data.location.country) errors.country = "Country is required";
    if (!data.location.zipCode) errors.zipCode = "Zip code is required";
    return { isValid: Object.keys(errors).length === 0, errors };
}

export function validateStep3(data: {
    title: string;
    description: string;
    bedrooms: number;
    bathrooms: number;
    maxGuests: number;
}): StepValidation {
    const errors: Record<string, string> = {};
    if (!data.title || data.title.length < 5)
        errors.title = "Title must be at least 5 characters";
    if (!data.description || data.description.length < 20)
        errors.description = "Description must be at least 20 characters";
    if (data.bedrooms < 0) errors.bedrooms = "Invalid bedroom count";
    if (data.bathrooms < 0) errors.bathrooms = "Invalid bathroom count";
    if (data.maxGuests < 1) errors.maxGuests = "At least 1 guest required";
    return { isValid: Object.keys(errors).length === 0, errors };
}

export function validateStep4(data: { amenities: string[] }): StepValidation {
    const errors: Record<string, string> = {};
    // Amenities are optional, so no strict validation
    return { isValid: true, errors };
}

export function validateStep5(data: { photos: string[] }): StepValidation {
    const errors: Record<string, string> = {};
    if (data.photos.length < 3)
        errors.photos = "At least 3 photos are required";
    return { isValid: Object.keys(errors).length === 0, errors };
}

export function validateStep6(data: {
    pricing: { perNight: number };
}): StepValidation {
    const errors: Record<string, string> = {};
    if (!data.pricing.perNight || data.pricing.perNight < 1)
        errors.perNight = "Price per night is required";
    return { isValid: Object.keys(errors).length === 0, errors };
}

export function validateStep7(data: {
    availability: { minStay: number; maxStay: number };
}): StepValidation {
    const errors: Record<string, string> = {};
    if (data.availability.minStay < 1) errors.minStay = "Minimum 1 night";
    if (
        data.availability.maxStay > 0 &&
        data.availability.maxStay < data.availability.minStay
    )
        errors.maxStay = "Max stay must be greater than min stay";
    return { isValid: Object.keys(errors).length === 0, errors };
}

export function validateStep8(data: {
    houseRules: { checkInTime: string; checkOutTime: string };
}): StepValidation {
    const errors: Record<string, string> = {};
    if (!data.houseRules.checkInTime)
        errors.checkInTime = "Check-in time is required";
    if (!data.houseRules.checkOutTime)
        errors.checkOutTime = "Check-out time is required";
    return { isValid: Object.keys(errors).length === 0, errors };
}

export const stepValidators = [
    validateStep1,
    validateStep2,
    validateStep3,
    validateStep4,
    validateStep5,
    validateStep6,
    validateStep7,
    validateStep8,
    () => ({ isValid: true, errors: {} }), // Step 9 is preview, no validation needed
];