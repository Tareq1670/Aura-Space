"use client";

import React, { useEffect, useRef } from "react";
import { InputGroup, ListBox, Select } from "@heroui/react";
import { AnimatePresence, motion } from "framer-motion";
import { getCurrencySymbol } from "@/lib/currency";
import { cn } from "@/lib/utils/cn";
import Button from "@/Components/ui/Button";

export const CATEGORIES = [
    { key: "", label: "All Categories" },
    { key: "villa", label: "Villa" },
    { key: "suite", label: "Suite" },
    { key: "cabin", label: "Cabin" },
    { key: "event", label: "Event" },
    { key: "estate", label: "Estate" },
    { key: "resort", label: "Resort" },
    { key: "apartment", label: "Apartment" },
];

export const SORT_OPTIONS = [
    { key: "", label: "Latest" },
    { key: "price-asc", label: "Price: Low to High" },
    { key: "price-desc", label: "Price: High to Low" },
    { key: "rating-desc", label: "Top Rated" },
    { key: "popular", label: "Most Popular" },
    { key: "featured", label: "Featured" },
];

export const AMENITIES_LIST: { value: string; label: string }[] = [
    { value: "wifi", label: "Wi-Fi" },
    { value: "pool", label: "Pool" },
    { value: "air_conditioning", label: "AC" },
    { value: "parking", label: "Parking" },
    { value: "gym", label: "Gym" },
    { value: "kitchen", label: "Kitchen" },
    { value: "washer", label: "Washer" },
    { value: "pet-friendly", label: "Pet Friendly" },
];

export const RATING_OPTIONS = [
    { key: "", label: "Any Rating" },
    { key: "4", label: "4+ Stars" },
    { key: "3", label: "3+ Stars" },
    { key: "2", label: "2+ Stars" },
];

export interface ListingsFilterState {
    search: string;
    category: string;
    minPrice: string;
    maxPrice: string;
    minRating: string;
    guests: string;
    amenities: string[];
    sort: string;
}

export type FilterField =
    | "search"
    | "sort"
    | "category"
    | "minPrice"
    | "maxPrice"
    | "minRating"
    | "guests";

export function hasActiveFilters(state: ListingsFilterState): boolean {
    return !!(
        state.search ||
        state.category ||
        state.minPrice ||
        state.maxPrice ||
        state.minRating ||
        state.guests ||
        state.amenities.length > 0 ||
        state.sort
    );
}

interface FilterFieldsProps {
    state: ListingsFilterState;
    variant: "sidebar" | "drawer";
    showSort?: boolean;
    onFieldChange: (field: FilterField, value: string) => void;
    onToggleAmenity: (amenity: string) => void;
}

function FilterFields({
    state,
    variant,
    showSort = true,
    onFieldChange,
    onToggleAmenity,
}: FilterFieldsProps) {
    const labelClass =
        variant === "sidebar"
            ? "mb-3 text-xs font-bold uppercase tracking-wider text-slate-500"
            : "mb-2 text-xs font-bold uppercase tracking-wider text-slate-500";
    const popoverClass =
        variant === "sidebar"
            ? "z-50 rounded-xl border border-slate-200 bg-white p-1 shadow-xl"
            : "z-[60] rounded-xl border border-slate-200 bg-white p-1 shadow-xl";
    const currencySymbol = getCurrencySymbol();

    const renderSelect = (
        label: string,
        ariaLabel: string,
        field: FilterField,
        options: { key: string; label: string }[],
        emptyKeyLabel: string,
    ) => (
        <div>
            <h3 className={labelClass}>{label}</h3>
            <Select
                aria-label={ariaLabel}
                placeholder={emptyKeyLabel}
                selectedKey={state[field]}
                onSelectionChange={(key) => onFieldChange(field, key ? String(key) : "")}
                className="w-full"
            >
                <Select.Trigger className="flex h-10 w-full items-center justify-between gap-2 rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 shadow-sm outline-none transition-colors hover:border-indigo-300 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 data-[placeholder]:text-slate-400">
                    <Select.Value />
                    <Select.Indicator className="shrink-0" />
                </Select.Trigger>
                <Select.Popover className={popoverClass}>
                    <ListBox>
                        {options.map((opt) => (
                            <ListBox.Item
                                key={opt.key || "empty"}
                                id={opt.key || "empty"}
                                textValue={opt.label}
                                className="cursor-pointer rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-indigo-50 hover:text-indigo-700 data-[selected]:bg-indigo-50 data-[selected]:text-indigo-700"
                            >
                                {opt.label}
                                <ListBox.ItemIndicator />
                            </ListBox.Item>
                        ))}
                    </ListBox>
                </Select.Popover>
            </Select>
        </div>
    );

    return (
        <>
            <InputGroup className="w-full">
                <InputGroup.Prefix>
                    <svg className="h-4 w-4 shrink-0 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                    </svg>
                </InputGroup.Prefix>
                <InputGroup.Input
                    aria-label="Search properties"
                    placeholder="Search by title or country..."
                    value={state.search}
                    onChange={(e) => onFieldChange("search", e.target.value)}
                />
            </InputGroup>

            {showSort && renderSelect("Sort By", "Sort", "sort", SORT_OPTIONS, "Latest")}

            {showSort && <hr className="border-slate-100" />}

            {renderSelect("Category", "Category", "category", CATEGORIES, "All Categories")}

            <div>
                <h3 className={labelClass}>Price Range</h3>
                <div className="flex items-center gap-2">
                    <div className="relative flex h-10 flex-1 items-center rounded-xl border border-slate-200 bg-white shadow-sm transition-colors focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-400/20">
                        <span className="pl-3 text-xs text-slate-400">{currencySymbol}</span>
                        <input
                            aria-label="Min price"
                            type="number"
                            placeholder="Min"
                            value={state.minPrice}
                            onChange={(e) => onFieldChange("minPrice", e.target.value)}
                            className="h-full w-full border-0 bg-transparent px-2 text-sm font-medium text-slate-700 outline-none placeholder:text-slate-400"
                        />
                    </div>
                    <span className="text-slate-300">—</span>
                    <div className="relative flex h-10 flex-1 items-center rounded-xl border border-slate-200 bg-white shadow-sm transition-colors focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-400/20">
                        <span className="pl-3 text-xs text-slate-400">{currencySymbol}</span>
                        <input
                            aria-label="Max price"
                            type="number"
                            placeholder="Max"
                            value={state.maxPrice}
                            onChange={(e) => onFieldChange("maxPrice", e.target.value)}
                            className="h-full w-full border-0 bg-transparent px-2 text-sm font-medium text-slate-700 outline-none placeholder:text-slate-400"
                        />
                    </div>
                </div>
            </div>

            {renderSelect("Min Rating", "Minimum rating", "minRating", RATING_OPTIONS, "Any Rating")}

            <div>
                <h3 className={labelClass}>Max Guests</h3>
                <input
                    aria-label="Max guests"
                    type="number"
                    placeholder="Any"
                    value={state.guests}
                    onChange={(e) => onFieldChange("guests", e.target.value)}
                    className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 outline-none placeholder:text-slate-400 transition-colors focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 shadow-sm"
                />
            </div>

            <div>
                <h3 className={labelClass}>Amenities</h3>
                <div className="space-y-2">
                    {AMENITIES_LIST.map((amenity) => (
                        <label
                            key={amenity.value}
                            className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 transition-colors hover:bg-slate-50"
                        >
                            <input
                                type="checkbox"
                                checked={state.amenities.includes(amenity.value)}
                                onChange={() => onToggleAmenity(amenity.value)}
                                className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                            />
                            <span className="text-sm font-medium text-slate-700">
                                {amenity.label}
                            </span>
                        </label>
                    ))}
                </div>
            </div>
        </>
    );
}

interface FiltersSidebarProps {
    state: ListingsFilterState;
    showSort?: boolean;
    onFieldChange: (field: FilterField, value: string) => void;
    onToggleAmenity: (amenity: string) => void;
    onClear: () => void;
    className?: string;
}

export function FiltersSidebar({
    state,
    showSort = true,
    onFieldChange,
    onToggleAmenity,
    onClear,
    className,
}: FiltersSidebarProps) {
    return (
        <aside className={cn("hidden w-72 shrink-0 lg:block", className)}>
            <div className="sticky top-24 space-y-6">
                <FilterFields
                    state={state}
                    variant="sidebar"
                    showSort={showSort}
                    onFieldChange={onFieldChange}
                    onToggleAmenity={onToggleAmenity}
                />

                {hasActiveFilters(state) && (
                    <Button
                        onClick={onClear}
                        variant="ghost"
                        fullWidth
                        leftIcon={
                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        }
                    >
                        Clear Filters
                    </Button>
                )}
            </div>
        </aside>
    );
}

interface FiltersDrawerProps {
    open: boolean;
    onClose: () => void;
    state: ListingsFilterState;
    onFieldChange: (field: FilterField, value: string) => void;
    onToggleAmenity: (amenity: string) => void;
    onClearFilters: () => void;
}

export function FiltersDrawer({
    open,
    onClose,
    state,
    onFieldChange,
    onToggleAmenity,
    onClearFilters,
}: FiltersDrawerProps) {
    const panelRef = useRef<HTMLDivElement>(null);
    const closeBtnRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        if (!open) return;
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        closeBtnRef.current?.focus();

        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", onKey);
        return () => {
            document.body.style.overflow = prevOverflow;
            window.removeEventListener("keydown", onKey);
        };
    }, [open, onClose]);

    const trapFocus = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key !== "Tab") return;
        const panel = panelRef.current;
        if (!panel) return;
        const focusables = panel.querySelectorAll<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
        }
    };

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 bg-black/50 lg:hidden"
                    onClick={onClose}
                >
                    <motion.div
                        ref={panelRef}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="filters-drawer-title"
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        onClick={(e) => e.stopPropagation()}
                        onKeyDown={trapFocus}
                        className="absolute right-0 top-0 h-full w-80 max-w-[85vw] overflow-y-auto bg-white p-6 shadow-xl outline-none"
                    >
                        <div className="mb-6 flex items-center justify-between">
                            <h2 id="filters-drawer-title" className="text-sm font-extrabold uppercase tracking-wider text-slate-700">
                                Filters
                            </h2>
                            <button
                                ref={closeBtnRef}
                                onClick={onClose}
                                aria-label="Close filters"
                                className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-colors hover:bg-slate-200 touch-44"
                            >
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="space-y-5">
                            <FilterFields
                                state={state}
                                variant="drawer"
                                onFieldChange={onFieldChange}
                                onToggleAmenity={onToggleAmenity}
                            />
                        </div>

                        <div className="mt-6 flex gap-3">
                            <Button
                                variant="secondary"
                                className="flex-1"
                                leftIcon={
                                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                }
                                onClick={() => {
                                    onClearFilters();
                                    onClose();
                                }}
                            >
                                Clear All
                            </Button>
                            <Button className="flex-1" onClick={onClose}>
                                Done
                            </Button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}