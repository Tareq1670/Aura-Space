export function exportToCSV<T extends Record<string, unknown>>(
    data: T[],
    columns: { key: keyof T; label: string }[],
    filename: string = "export",
): void {
    if (data.length === 0 || columns.length === 0) return;

    const headers = columns.map((c) => c.label);
    const rows = data.map((row) =>
        columns.map((c) => String(row[c.key] ?? "").replace(/"/g, '""')),
    );

    const csvContent = [
        headers.join(","),
        ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
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
