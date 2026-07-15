// lib/constants/property-options.ts

import {
    Home,
    Building2,
    Castle,
    Tent,
    TreePine,
    Warehouse,
    Hotel,
    Ship,
    Palmtree,
    Mountain,
    Waves,
    LandPlot,
    Wifi,
    Car,
    Tv,
    AirVent,
    Flame,
    UtensilsCrossed,
    WashingMachine,
    Dumbbell,
    ShieldCheck,
    Coffee,
    Heater,
    Monitor,
    Laptop,
    Cigarette,
    PartyPopper,
    type LucideIcon,
} from "lucide-react";

export interface PropertyTypeOption {
    id: string;
    label: string;
    icon: LucideIcon;
    description: string;
}

export const PROPERTY_TYPES: PropertyTypeOption[] = [
    {
        id: "house",
        label: "House",
        icon: Home,
        description: "A standalone residential building",
    },
    {
        id: "apartment",
        label: "Apartment",
        icon: Building2,
        description: "A unit within a larger building",
    },
    {
        id: "villa",
        label: "Villa",
        icon: Castle,
        description: "A luxurious standalone property",
    },
    {
        id: "cabin",
        label: "Cabin",
        icon: TreePine,
        description: "A cozy retreat in nature",
    },
    {
        id: "cottage",
        label: "Cottage",
        icon: Home,
        description: "A charming small house",
    },
    {
        id: "tent",
        label: "Glamping",
        icon: Tent,
        description: "Luxury camping experience",
    },
    {
        id: "loft",
        label: "Loft",
        icon: Warehouse,
        description: "An open-plan upper floor space",
    },
    {
        id: "hotel",
        label: "Hotel Room",
        icon: Hotel,
        description: "A room in a hotel property",
    },
    {
        id: "houseboat",
        label: "Houseboat",
        icon: Ship,
        description: "A floating home on water",
    },
    {
        id: "beachfront",
        label: "Beach House",
        icon: Palmtree,
        description: "Right on the beach",
    },
    {
        id: "mountain",
        label: "Mountain Retreat",
        icon: Mountain,
        description: "Nestled in the mountains",
    },
    {
        id: "lakefront",
        label: "Lakefront",
        icon: Waves,
        description: "Property by the lake",
    },
    {
        id: "farmhouse",
        label: "Farmhouse",
        icon: LandPlot,
        description: "Rural farm property",
    },
    {
        id: "event-space",
        label: "Event Space",
        icon: PartyPopper,
        description: "A venue for gatherings and events",
    },
];

export interface PlaceTypeOption {
    id: string;
    label: string;
    description: string;
}

export const PLACE_TYPES: PlaceTypeOption[] = [
    {
        id: "entire_place",
        label: "Entire Place",
        description: "Guests have the whole place to themselves",
    },
    {
        id: "private_room",
        label: "Private Room",
        description:
            "Guests have their own room but share some common spaces",
    },
    {
        id: "shared_room",
        label: "Shared Room",
        description:
            "Guests share a room or common area with others",
    },
];

export interface AmenityOption {
    id: string;
    label: string;
    icon: LucideIcon;
    category: string;
}

export const AMENITY_CATEGORIES = [
    "Essentials",
    "Features",
    "Kitchen",
    "Safety",
    "Outdoor",
    "Accessibility",
] as const;

export const AMENITIES: AmenityOption[] = [
    // Essentials
    { id: "wifi", label: "Wi-Fi", icon: Wifi, category: "Essentials" },
    { id: "tv", label: "TV", icon: Tv, category: "Essentials" },
    {
        id: "air_conditioning",
        label: "Air Conditioning",
        icon: AirVent,
        category: "Essentials",
    },
    {
        id: "heating",
        label: "Heating",
        icon: Heater,
        category: "Essentials",
    },
    {
        id: "washer",
        label: "Washer",
        icon: WashingMachine,
        category: "Essentials",
    },
    {
        id: "dryer",
        label: "Dryer",
        icon: WashingMachine,
        category: "Essentials",
    },

    // Features
    {
        id: "parking",
        label: "Free Parking",
        icon: Car,
        category: "Features",
    },
    {
        id: "pool",
        label: "Pool",
        icon: Waves,
        category: "Features",
    },
    {
        id: "gym",
        label: "Gym",
        icon: Dumbbell,
        category: "Features",
    },
    {
        id: "fireplace",
        label: "Fireplace",
        icon: Flame,
        category: "Features",
    },
    {
        id: "workspace",
        label: "Dedicated Workspace",
        icon: Laptop,
        category: "Features",
    },
    {
        id: "monitor",
        label: "Monitor",
        icon: Monitor,
        category: "Features",
    },

    // Kitchen
    {
        id: "kitchen",
        label: "Kitchen",
        icon: UtensilsCrossed,
        category: "Kitchen",
    },
    {
        id: "coffee_maker",
        label: "Coffee Maker",
        icon: Coffee,
        category: "Kitchen",
    },
    // Safety
    {
        id: "security_cameras",
        label: "Security Cameras",
        icon: ShieldCheck,
        category: "Safety",
    },
    // Outdoor
    {
        id: "garden",
        label: "Garden",
        icon: TreePine,
        category: "Outdoor",
    },
    {
        id: "beach_access",
        label: "Beach Access",
        icon: Palmtree,
        category: "Outdoor",
    },

    // Accessibility
    {
        id: "smoking_area",
        label: "Smoking Area",
        icon: Cigarette,
        category: "Accessibility",
    },
];

export const CURRENCIES = [
    { code: "BDT", symbol: "৳", label: "Bangladeshi Taka" },
    { code: "USD", symbol: "$", label: "US Dollar" },
    { code: "EUR", symbol: "€", label: "Euro" },
    { code: "GBP", symbol: "£", label: "British Pound" },
    { code: "INR", symbol: "₹", label: "Indian Rupee" },
];

export const TIME_OPTIONS = [
    "12:00 AM", "1:00 AM", "2:00 AM", "3:00 AM", "4:00 AM", "5:00 AM",
    "6:00 AM", "7:00 AM", "8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM",
    "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM",
    "6:00 PM", "7:00 PM", "8:00 PM", "9:00 PM", "10:00 PM", "11:00 PM",
];

// ============================================================
// AMENITY MAPPING (shared between server actions and client)
// Frontend IDs → backend valid values
// ============================================================
export const AMENITY_MAP: Record<string, string> = {
    // Direct valid values
    wifi: "wifi",
    pool: "pool",
    ac: "ac",
    parking: "parking",
    gym: "gym",
    kitchen: "kitchen",
    washer: "washer",
    dryer: "dryer",
    tv: "tv",
    heating: "heating",
    workspace: "workspace",
    elevator: "elevator",
    balcony: "balcony",
    garden: "garden",
    bbq: "bbq",
    fireplace: "fireplace",
    "security-camera": "security-camera",
    "smoke-alarm": "smoke-alarm",
    "first-aid": "first-aid",
    "fire-extinguisher": "fire-extinguisher",

    // Frontend alternatives → backend valid
    "air-conditioning": "ac",
    "air conditioning": "ac",
    air_conditioning: "ac",
    airconditioning: "ac",
    "air conditioner": "ac",
    "swimming-pool": "pool",
    "swimming pool": "pool",
    swimming_pool: "pool",
    internet: "wifi",
    "free-parking": "parking",
    free_parking: "parking",
    "smoke alarm": "smoke-alarm",
    smoke_alarm: "smoke-alarm",
    smokealarm: "smoke-alarm",
    "first aid": "first-aid",
    first_aid: "first-aid",
    "fire extinguisher": "fire-extinguisher",
    fire_extinguisher: "fire-extinguisher",
    "security camera": "security-camera",
    security_camera: "security-camera",
    "security cameras": "security-camera",
    security_cameras: "security-camera",
    cctv: "security-camera",
    monitor: "workspace",
    coffee_maker: "kitchen",
    beach_access: "garden",
    smoking_area: "bbq",
    "hot-water": "hot-water",
    hot_water: "hot-water",
    hotwater: "hot-water",
    refrigerator: "refrigerator",
    fridge: "refrigerator",
    lock: "lock",
    "pet-friendly": "pet-friendly",
    pet_friendly: "pet-friendly",
    petfriendly: "pet-friendly",
    "pets allowed": "pet-friendly",
    "pets_allowed": "pet-friendly",
    "baby-friendly": "baby-friendly",
    baby_friendly: "baby-friendly",
    babyfriendly: "baby-friendly",
    "wheelchair-accessible": "wheelchair-accessible",
    wheelchair_accessible: "wheelchair-accessible",
    wheelchairaccessible: "wheelchair-accessible",
    "wheelchair accessible": "wheelchair-accessible",
    resort: "pool",
    hostel: "wifi",
};

export const VALID_AMENITIES = new Set([
    "wifi", "pool", "ac", "parking", "gym", "kitchen", "washer", "dryer",
    "tv", "heating", "workspace", "elevator", "balcony", "garden", "bbq",
    "fireplace", "security-camera", "smoke-alarm", "first-aid", "fire-extinguisher",
    "hot-water", "refrigerator", "lock", "pet-friendly", "baby-friendly",
    "wheelchair-accessible",
]);

export const COUNTRIES = [
    "Bangladesh", "India", "United States", "United Kingdom", "Canada",
    "Australia", "Germany", "France", "Japan", "Singapore", "Malaysia",
    "Thailand", "Indonesia", "Philippines", "Vietnam", "Nepal", "Sri Lanka",
    "Pakistan", "UAE", "Saudi Arabia", "Turkey", "Italy", "Spain",
    "Netherlands", "Switzerland", "Sweden", "Norway", "Denmark", "Brazil",
    "Mexico", "South Korea", "China",
];