"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { toggleWishlist } from "@/lib/actions/wishlist";

interface WishlistButtonProps {
    propertyId: string;
    initialSaved?: boolean;
    onToggle?: (saved: boolean) => void;
    className?: string;
    size?: "sm" | "md" | "lg";
}

export default function WishlistButton({ propertyId, initialSaved = false, onToggle, className = "", size = "md" }: WishlistButtonProps) {
    const [saved, setSaved] = useState(initialSaved);
    const [loading, setLoading] = useState(false);

    const sizeClasses = {
        sm: "w-8 h-8",
        md: "w-10 h-10",
        lg: "w-12 h-12",
    };

    const iconSizes = {
        sm: "w-4 h-4",
        md: "w-5 h-5",
        lg: "w-6 h-6",
    };

    const handleClick = useCallback(async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (loading) return;

        setLoading(true);
        try {
            const res = await toggleWishlist(propertyId);
            if (res.success) {
                const action = (res.data as { action?: string })?.action;
                const isNowSaved = action === "added";
                setSaved(isNowSaved);
                onToggle?.(isNowSaved);
                toast.success(isNowSaved ? "Added to wishlist" : "Removed from wishlist");
            } else {
                toast.error(res.message || "Failed to update wishlist");
            }
        } catch {
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    }, [propertyId, loading, onToggle]);

    return (
        <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={handleClick}
            disabled={loading}
            className={`flex items-center justify-center rounded-full bg-white/80 backdrop-blur-sm shadow-sm transition-colors ${sizeClasses[size]} ${className}`}
            title={saved ? "Remove from wishlist" : "Add to wishlist"}
        >
            <motion.svg
                key={saved ? "filled" : "outline"}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className={iconSizes[size]}
                viewBox="0 0 24 24"
                fill={saved ? "#ef4444" : "none"}
                stroke={saved ? "#ef4444" : "#6b7280"}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </motion.svg>
        </motion.button>
    );
}
