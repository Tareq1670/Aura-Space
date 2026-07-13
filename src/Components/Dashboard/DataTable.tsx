"use client";

import { useState, useMemo, useCallback, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Types ────────────────────────────────────────────────────────

export interface Column<T> {
    key: string;
    header: string;
    accessor: (row: T) => unknown;
    render?: (row: T, value: unknown) => ReactNode;
    sortable?: boolean;
    width?: string;
    align?: "left" | "center" | "right";
}

interface DataTableProps<T> {
    data: T[];
    columns: Column<T>[];
    searchable?: boolean;
    searchPlaceholder?: string;
    searchFields?: (keyof T)[];
    pageSize?: number;
    pageSizeOptions?: number[];
    emptyMessage?: string;
    emptyIcon?: ReactNode;
    headerGradient?: boolean;
    onRowClick?: (row: T) => void;
    className?: string;
    toolbar?: ReactNode;
}

type SortDirection = "asc" | "desc";

// ─── Theme Tokens ─────────────────────────────────────────────────

const theme = {
    bg: {
        primary: "#0a0a12",
        card: "rgba(255, 255, 255, 0.03)",
        hover: "rgba(255, 255, 255, 0.06)",
        input: "rgba(255, 255, 255, 0.05)",
    },
    border: {
        default: "rgba(255, 255, 255, 0.08)",
        hover: "rgba(255, 255, 255, 0.15)",
        focus: "#22d3ee",
    },
    text: {
        primary: "#f1f5f9",
        secondary: "#94a3b8",
        muted: "#64748b",
    },
    accent: {
        cyan: "#22d3ee",
        purple: "#a855f7",
        blue: "#3b82f6",
    },
};

// ─── Component ────────────────────────────────────────────────────

export default function DataTable<T extends Record<string, unknown>>({
    data,
    columns,
    searchPlaceholder = "Search...",
    searchFields,
    pageSize: initialPageSize = 10,
    pageSizeOptions = [5, 10, 25, 50],
    emptyMessage = "No data found",
    emptyIcon,
    headerGradient = false,
    onRowClick,
    className = "",
    toolbar,
}: DataTableProps<T>) {
    const [search, setSearch] = useState("");
    const [sortField, setSortField] = useState<string | null>(null);
    const [sortDir, setSortDir] = useState<SortDirection>("asc");
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(initialPageSize);

    // Search filtering
    const filtered = useMemo(() => {
        if (!search.trim()) return data;
        const q = search.toLowerCase();
        return data.filter((row) => {
            const fields = searchFields
                ? searchFields.map((f) => row[f])
                : columns.map((c) => c.accessor(row));
            return fields.some(
                (val) => val != null && String(val).toLowerCase().includes(q),
            );
        });
    }, [data, search, searchFields, columns]);

    // Sorting
    const sorted = useMemo(() => {
        if (!sortField) return filtered;
        const col = columns.find((c) => c.key === sortField);
        if (!col) return filtered;

        return [...filtered].sort((a, b) => {
            const aVal = col.accessor(a);
            const bVal = col.accessor(b);

            if (aVal == null && bVal == null) return 0;
            if (aVal == null) return sortDir === "asc" ? -1 : 1;
            if (bVal == null) return sortDir === "asc" ? 1 : -1;

            if (aVal instanceof Date && bVal instanceof Date) {
                return sortDir === "asc"
                    ? aVal.getTime() - bVal.getTime()
                    : bVal.getTime() - aVal.getTime();
            }

            if (typeof aVal === "number" && typeof bVal === "number") {
                return sortDir === "asc" ? aVal - bVal : bVal - aVal;
            }

            const cmp = String(aVal).localeCompare(String(bVal));
            return sortDir === "asc" ? cmp : -cmp;
        });
    }, [filtered, sortField, sortDir, columns]);

    // Pagination
    const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
    const paginated = useMemo(
        () => sorted.slice(page * pageSize, (page + 1) * pageSize),
        [sorted, page, pageSize],
    );

    const handleSort = useCallback(
        (key: string) => {
            if (sortField === key) {
                setSortDir((d) => (d === "asc" ? "desc" : "asc"));
            } else {
                setSortField(key);
                setSortDir("asc");
            }
            setPage(0);
        },
        [sortField],
    );

    const handlePageSizeChange = useCallback((newSize: number) => {
        setPageSize(newSize);
        setPage(0);
    }, []);

    // Reset page when search changes
    const handleSearchChange = useCallback((val: string) => {
        setSearch(val);
        setPage(0);
    }, []);

    return (
        <div className={className}>
            {/* Search & Toolbar */}
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 16,
                    marginBottom: 16,
                    flexWrap: "wrap",
                }}
            >
                <input
                    type="text"
                    placeholder={searchPlaceholder}
                    value={search}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    style={{
                        padding: "10px 16px",
                        background: theme.bg.input,
                        border: `1px solid ${theme.border.default}`,
                        borderRadius: 10,
                        color: theme.text.primary,
                        fontSize: 14,
                        outline: "none",
                        minWidth: 260,
                        transition: "border-color 0.2s",
                    }}
                    onFocus={(e) =>
                        (e.currentTarget.style.borderColor = theme.border.focus)
                    }
                    onBlur={(e) =>
                        (e.currentTarget.style.borderColor =
                            theme.border.default)
                    }
                />

                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    {toolbar}

                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                        }}
                    >
                        <span
                            style={{
                                fontSize: 13,
                                color: theme.text.muted,
                            }}
                        >
                            Show
                        </span>
                        <select
                            value={pageSize}
                            onChange={(e) =>
                                handlePageSizeChange(Number(e.target.value))
                            }
                            style={{
                                padding: "6px 10px",
                                background: theme.bg.input,
                                border: `1px solid ${theme.border.default}`,
                                borderRadius: 8,
                                color: theme.text.primary,
                                fontSize: 13,
                                outline: "none",
                                cursor: "pointer",
                            }}
                        >
                            {pageSizeOptions.map((size) => (
                                <option key={size} value={size}>
                                    {size}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div
                style={{
                    background: theme.bg.card,
                    border: `1px solid ${theme.border.default}`,
                    borderRadius: 16,
                    overflow: "hidden",
                    backdropFilter: "blur(20px)",
                }}
            >
                <div style={{ overflowX: "auto" }}>
                    <table
                        style={{
                            width: "100%",
                            borderCollapse: "collapse",
                        }}
                    >
                        <thead>
                            <tr
                                style={{
                                    background: headerGradient
                                        ? "linear-gradient(135deg, rgba(34,211,238,0.1), rgba(168,85,247,0.1))"
                                        : "rgba(255, 255, 255, 0.02)",
                                    borderBottom: `1px solid ${theme.border.default}`,
                                }}
                            >
                                {columns.map((col) => (
                                    <th
                                        key={col.key}
                                        onClick={() =>
                                            col.sortable !== false &&
                                            handleSort(col.key)
                                        }
                                        style={{
                                            padding: "14px 20px",
                                            textAlign: col.align || "left",
                                            fontSize: 12,
                                            fontWeight: 600,
                                            color: theme.text.secondary,
                                            textTransform: "uppercase" as const,
                                            letterSpacing: "0.05em",
                                            whiteSpace: "nowrap",
                                            cursor:
                                                col.sortable !== false
                                                    ? "pointer"
                                                    : "default",
                                            userSelect: "none",
                                            width: col.width,
                                            transition: "color 0.2s",
                                        }}
                                        onMouseEnter={(e) => {
                                            if (col.sortable !== false)
                                                e.currentTarget.style.color =
                                                    theme.accent.cyan;
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.color =
                                                theme.text.secondary;
                                        }}
                                    >
                                        <span
                                            style={{
                                                display: "inline-flex",
                                                alignItems: "center",
                                                gap: 6,
                                            }}
                                        >
                                            {col.header}
                                            {col.sortable !== false &&
                                                sortField === col.key && (
                                                    <span
                                                        style={{
                                                            color: theme.accent
                                                                .cyan,
                                                            fontSize: 10,
                                                        }}
                                                    >
                                                        {sortDir === "asc"
                                                            ? "▲"
                                                            : "▼"}
                                                    </span>
                                                )}
                                        </span>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            <AnimatePresence mode="popLayout">
                                {paginated.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={columns.length}
                                            style={{
                                                padding: "60px 20px",
                                                textAlign: "center",
                                            }}
                                        >
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                style={{
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    alignItems: "center",
                                                    gap: 12,
                                                }}
                                            >
                                                {emptyIcon && (
                                                    <div
                                                        style={{
                                                            fontSize: 48,
                                                            opacity: 0.3,
                                                        }}
                                                    >
                                                        {emptyIcon}
                                                    </div>
                                                )}
                                                <p
                                                    style={{
                                                        color: theme.text.muted,
                                                        fontSize: 15,
                                                    }}
                                                >
                                                    {emptyMessage}
                                                </p>
                                            </motion.div>
                                        </td>
                                    </tr>
                                ) : (
                                    paginated.map((row, i) => (
                                        <motion.tr
                                            key={String(
                                                (row as Record<string, unknown>)
                                                    .id || i,
                                            )}
                                            layout
                                            initial={{ opacity: 0, y: 8 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -8 }}
                                            transition={{
                                                duration: 0.2,
                                                delay: i * 0.03,
                                            }}
                                            onClick={() => onRowClick?.(row)}
                                            style={{
                                                borderBottom: `1px solid ${theme.border.default}`,
                                                cursor: onRowClick
                                                    ? "pointer"
                                                    : "default",
                                                transition: "background 0.15s",
                                            }}
                                            whileHover={{
                                                backgroundColor: theme.bg.hover,
                                            }}
                                        >
                                            {columns.map((col) => {
                                                const val = col.accessor(row);
                                                return (
                                                    <td
                                                        key={col.key}
                                                        style={{
                                                            padding:
                                                                "14px 20px",
                                                            fontSize: 14,
                                                            color: theme.text
                                                                .primary,
                                                            textAlign:
                                                                col.align ||
                                                                "left",
                                                            whiteSpace:
                                                                "nowrap",
                                                        }}
                                                    >
                                                        {col.render
                                                            ? col.render(
                                                                  row,
                                                                  val,
                                                              )
                                                            : val != null
                                                              ? String(val)
                                                              : "—"}
                                                    </td>
                                                );
                                            })}
                                        </motion.tr>
                                    ))
                                )}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {sorted.length > 0 && (
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            padding: "14px 20px",
                            borderTop: `1px solid ${theme.border.default}`,
                            fontSize: 13,
                            color: theme.text.secondary,
                        }}
                    >
                        <span>
                            Showing{" "}
                            <span style={{ color: theme.text.primary }}>
                                {page * pageSize + 1}
                            </span>
                            –
                            <span style={{ color: theme.text.primary }}>
                                {Math.min((page + 1) * pageSize, sorted.length)}
                            </span>{" "}
                            of{" "}
                            <span style={{ color: theme.text.primary }}>
                                {sorted.length}
                            </span>
                        </span>

                        <div style={{ display: "flex", gap: 6 }}>
                            <PaginationBtn
                                onClick={() =>
                                    setPage((p) => Math.max(0, p - 1))
                                }
                                disabled={page === 0}
                            >
                                ‹
                            </PaginationBtn>

                            {Array.from({ length: totalPages }, (_, i) => {
                                if (
                                    totalPages > 7 &&
                                    i !== 0 &&
                                    i !== totalPages - 1 &&
                                    Math.abs(i - page) > 2
                                ) {
                                    if (i === page - 3 || i === page + 3) {
                                        return (
                                            <span
                                                key={i}
                                                style={{
                                                    color: theme.text.muted,
                                                    padding: "0 4px",
                                                }}
                                            >
                                                …
                                            </span>
                                        );
                                    }
                                    return null;
                                }
                                return (
                                    <PaginationBtn
                                        key={i}
                                        active={i === page}
                                        onClick={() => setPage(i)}
                                    >
                                        {i + 1}
                                    </PaginationBtn>
                                );
                            })}

                            <PaginationBtn
                                onClick={() =>
                                    setPage((p) =>
                                        Math.min(totalPages - 1, p + 1),
                                    )
                                }
                                disabled={page >= totalPages - 1}
                            >
                                ›
                            </PaginationBtn>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

// ─── Pagination Button ────────────────────────────────────────────

function PaginationBtn({
    children,
    active,
    disabled,
    onClick,
}: {
    children: ReactNode;
    active?: boolean;
    disabled?: boolean;
    onClick: () => void;
}) {
    return (
        <motion.button
            whileHover={!disabled ? { scale: 1.05 } : undefined}
            whileTap={!disabled ? { scale: 0.95 } : undefined}
            onClick={onClick}
            disabled={disabled}
            style={{
                padding: "6px 12px",
                background: active
                    ? "linear-gradient(135deg, #22d3ee, #3b82f6)"
                    : "rgba(255, 255, 255, 0.05)",
                border: `1px solid ${active ? "transparent" : "rgba(255, 255, 255, 0.1)"}`,
                borderRadius: 8,
                color: active ? "#0a0a12" : "#94a3b8",
                fontSize: 13,
                fontWeight: active ? 700 : 500,
                cursor: disabled ? "not-allowed" : "pointer",
                opacity: disabled ? 0.4 : 1,
                transition: "all 0.15s",
            }}
        >
            {children}
        </motion.button>
    );
}
