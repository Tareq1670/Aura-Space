"use client";

import { cn } from "@/lib/utils/cn";

interface StatusBadgeProps {
    status: string;
    size?: "sm" | "md" | "lg";
}

const statusColors: Record<string, string> = {
    active: "bg-green-50 text-green-700 border-green-200",
    inactive: "bg-gray-50 text-gray-600 border-gray-200",
    draft: "bg-amber-50 text-amber-700 border-amber-200",
    pending: "bg-blue-50 text-blue-700 border-blue-200",
    rejected: "bg-red-50 text-red-700 border-red-200",
    deleted: "bg-gray-100 text-gray-400 border-gray-200",
};

const sizeClasses: Record<string, string> = {
    sm: "px-2 py-0.5 text-[10px]",
    md: "px-2.5 py-1 text-xs",
    lg: "px-3 py-1.5 text-sm",
};

export default function StatusBadge({ status, size = "md" }: StatusBadgeProps) {
    const s = status.toLowerCase();
    return (
        <span
            className={cn(
                "inline-flex items-center gap-1.5 font-semibold rounded-full border",
                statusColors[s] || "bg-gray-50 text-gray-600 border-gray-200",
                sizeClasses[size],
            )}
        >
            <span
                className={cn(
                    "w-1.5 h-1.5 rounded-full",
                    s === "active" && "bg-green-500",
                    s === "inactive" && "bg-gray-400",
                    s === "draft" && "bg-amber-500",
                    s === "pending" && "bg-blue-500",
                    s === "rejected" && "bg-red-500",
                    s === "deleted" && "bg-gray-300",
                    !["active", "inactive", "draft", "pending", "rejected", "deleted"].includes(s) && "bg-gray-400",
                )}
            />
            {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
    );
}
