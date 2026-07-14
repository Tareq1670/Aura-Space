"use client";

import { exportToCSV } from "@/lib/utils/csv-export";

export function exportUsersToCSV(
    users: Record<string, unknown>[],
    filename: string = "users-export",
): void {
    exportToCSV(users, [
        { key: "name", label: "Name" },
        { key: "email", label: "Email" },
        { key: "role", label: "Role" },
        { key: "banned", label: "Status" },
        { key: "emailVerified", label: "Verified" },
        { key: "createdAt", label: "Joined" },
    ], filename);
}