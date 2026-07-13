"use client";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface ActionResponse {
    success: boolean;
    message?: string;
    data?: Record<string, unknown>;
}

function getSessionToken(): string | null {
    if (typeof document === "undefined") return null;
    const cookies = document.cookie.split(";").map((c) => c.trim());
    const sessionCookie = cookies.find((c) =>
        c.startsWith("better-auth.session_token="),
    );
    if (!sessionCookie) return null;
    return sessionCookie.split("=").slice(1).join("=");
}

function getHeaders(): HeadersInit {
    const headers: HeadersInit = {
        "Content-Type": "application/json",
    };
    const token = getSessionToken();
    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }
    return headers;
}

export async function updateUserRole(
    userId: string,
    role: string,
): Promise<ActionResponse> {
    try {
        const res = await fetch(`${API_BASE}/api/admin/users/${userId}/role`, {
            method: "PUT",
            headers: getHeaders(),
            credentials: "include",
            body: JSON.stringify({ role }),
        });

        const data = await res.json();
        return data;
    } catch (error) {
        console.error("Update role error:", error);
        return {
            success: false,
            message: "Network error. Please try again.",
        };
    }
}

export async function updateUserStatus(
    userId: string,
    banned: boolean,
    banReason?: string,
): Promise<ActionResponse> {
    try {
        const res = await fetch(
            `${API_BASE}/api/admin/users/${userId}/status`,
            {
                method: "PUT",
                headers: getHeaders(),
                credentials: "include",
                body: JSON.stringify({ banned, banReason }),
            },
        );

        const data = await res.json();
        return data;
    } catch (error) {
        console.error("Update status error:", error);
        return {
            success: false,
            message: "Network error. Please try again.",
        };
    }
}

export async function deleteUser(userId: string): Promise<ActionResponse> {
    try {
        const res = await fetch(`${API_BASE}/api/admin/users/${userId}`, {
            method: "DELETE",
            headers: getHeaders(),
            credentials: "include",
        });

        const data = await res.json();
        return data;
    } catch (error) {
        console.error("Delete user error:", error);
        return {
            success: false,
            message: "Network error. Please try again.",
        };
    }
}

export function exportUsersToCSV(
    users: Record<string, unknown>[],
    filename: string = "users-export",
): void {
    if (users.length === 0) return;

    const headers = ["Name", "Email", "Role", "Status", "Verified", "Joined"];
    const rows = users.map((user) => [
        String(user.name || ""),
        String(user.email || ""),
        String(user.role || ""),
        user.banned ? "Blocked" : "Active",
        user.emailVerified ? "Yes" : "No",
        user.createdAt
            ? new Date(user.createdAt as string).toLocaleDateString()
            : "",
    ]);

    const csvContent = [
        headers.join(","),
        ...rows.map((row) =>
            row
                .map((cell) => `"${String(cell).replace(/"/g, '""')}"`)
                .join(","),
        ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${filename}-${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}
