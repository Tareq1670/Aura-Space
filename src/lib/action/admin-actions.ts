"use client";

export function exportUsersToCSV(
    users: Record<string, unknown>[],
    filename: string = "users-export",
): void {
    if (users.length === 0) return;

    const csvHeaders = [
        "Name",
        "Email",
        "Role",
        "Status",
        "Verified",
        "Joined",
    ];

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
        csvHeaders.join(","),
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