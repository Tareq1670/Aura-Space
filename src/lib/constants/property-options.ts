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
    Snowflake,
    Coffee,
    Bath,
    Heater,
    Monitor,
    Laptop,
    Lock,
    Cigarette,
    PawPrint,
    Baby,
    Accessibility,
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
        id: "hot_water",
        label: "Hot Water",
        icon: Bath,
        category: "Essentials",
    },
    {
        id: "washer",
        label: "Washer",
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
    {
        id: "refrigerator",
        label: "Refrigerator",
        icon: Snowflake,
        category: "Kitchen",
    },

    // Safety
    {
        id: "security_cameras",
        label: "Security Cameras",
        icon: ShieldCheck,
        category: "Safety",
    },
    {
        id: "lock",
        label: "Lock on Door",
        icon: Lock,
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
    {
        id: "pet_friendly",
        label: "Pet Friendly",
        icon: PawPrint,
        category: "Accessibility",
    },
    {
        id: "baby_friendly",
        label: "Baby Friendly",
        icon: Baby,
        category: "Accessibility",
    },
    {
        id: "wheelchair_accessible",
        label: "Wheelchair Accessible",
        icon: Accessibility,
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

export const COUNTRIES = [
    "Bangladesh", "India", "United States", "United Kingdom", "Canada",
    "Australia", "Germany", "France", "Japan", "Singapore", "Malaysia",
    "Thailand", "Indonesia", "Philippines", "Vietnam", "Nepal", "Sri Lanka",
    "Pakistan", "UAE", "Saudi Arabia", "Turkey", "Italy", "Spain",
    "Netherlands", "Switzerland", "Sweden", "Norway", "Denmark", "Brazil",
    "Mexico", "South Korea", "China",
];