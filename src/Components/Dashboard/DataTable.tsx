"use client";

import { useState, useMemo, useCallback, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Pagination } from "@heroui/react";

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
    searchPlaceholder?: string;
    searchFields?: string[];
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
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(initialPageSize);

    const filtered = useMemo(() => {
        if (!search.trim()) return data;
        const q = search.toLowerCase();
        return data.filter((row) => {
            if (searchFields && searchFields.length > 0) {
                return searchFields.some((field) => {
                    const val = row[field as string];
                    return val != null && String(val).toLowerCase().includes(q);
                });
            }
            return columns.some((col) => {
                const val = col.accessor(row);
                return val != null && String(val).toLowerCase().includes(q);
            });
        });
    }, [data, search, searchFields, columns]);

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

    const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));

    const paginated = useMemo(
        () => sorted.slice((page - 1) * pageSize, page * pageSize),
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
            setPage(1);
        },
        [sortField],
    );

    const handlePageSizeChange = useCallback((newSize: number) => {
        setPageSize(newSize);
        setPage(1);
    }, []);

    const handleSearchChange = useCallback((val: string) => {
        setSearch(val);
        setPage(1);
    }, []);

    const startItem = (page - 1) * pageSize + 1;
    const endItem = Math.min(page * pageSize, sorted.length);

    const getPageNumbers = (): (number | "ellipsis")[] => {
        const pages: (number | "ellipsis")[] = [];
        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
            return pages;
        }
        pages.push(1);
        if (page > 3) pages.push("ellipsis");
        const start = Math.max(2, page - 1);
        const end = Math.min(totalPages - 1, page + 1);
        for (let i = start; i <= end; i++) pages.push(i);
        if (page < totalPages - 2) pages.push("ellipsis");
        pages.push(totalPages);
        return pages;
    };

    return (
        <div className={className}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
                {/* ✅ @heroui Input সরিয়ে custom input দিয়ে replace করা হয়েছে */}
                <div className="relative w-full sm:w-72">
                    <svg
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                    </svg>
                    <input
                        aria-label="Search"
                        type="text"
                        placeholder={searchPlaceholder}
                        value={search}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-gray-200 rounded-xl text-gray-700 outline-none placeholder-gray-400 hover:border-violet-300 focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all"
                    />
                </div>

                <div className="flex items-center gap-3 flex-wrap w-full sm:w-auto">
                    {toolbar}

                    <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500 whitespace-nowrap">
                            Rows:
                        </span>
                        <select
                            value={pageSize}
                            onChange={(e) =>
                                handlePageSizeChange(Number(e.target.value))
                            }
                            className="px-2 py-1.5 text-xs bg-white border border-gray-200 rounded-lg text-gray-700 outline-none cursor-pointer hover:border-violet-300 focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all"
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

            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr
                                className={
                                    headerGradient
                                        ? "bg-gradient-to-r from-violet-50/80 via-indigo-50/50 to-cyan-50/80"
                                        : "bg-gray-50/80"
                                }
                            >
                                {columns.map((col) => (
                                    <th
                                        key={col.key}
                                        onClick={() =>
                                            col.sortable !== false &&
                                            handleSort(col.key)
                                        }
                                        className={`px-5 py-3.5 text-xs font-semibold uppercase tracking-wider whitespace-nowrap border-b border-gray-100 transition-colors ${
                                            col.sortable !== false
                                                ? "cursor-pointer hover:text-violet-600"
                                                : "cursor-default"
                                        } ${
                                            sortField === col.key
                                                ? "text-violet-600"
                                                : "text-gray-500"
                                        }`}
                                        style={{
                                            textAlign: col.align || "left",
                                            width: col.width,
                                        }}
                                    >
                                        <span className="inline-flex items-center gap-1.5">
                                            {col.header}
                                            {col.sortable !== false &&
                                                sortField === col.key && (
                                                    <span className="text-violet-500 text-[10px]">
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
                                            className="py-16 text-center"
                                        >
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="flex flex-col items-center gap-3"
                                            >
                                                {emptyIcon && (
                                                    <div className="text-5xl opacity-30">
                                                        {emptyIcon}
                                                    </div>
                                                )}
                                                <p className="text-gray-400 text-sm">
                                                    {emptyMessage}
                                                </p>
                                            </motion.div>
                                        </td>
                                    </tr>
                                ) : (
                                    paginated.map((row, i) => (
                                        <motion.tr
                                            key={String(row.id || i)}
                                            layout
                                            initial={{ opacity: 0, y: 6 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -6 }}
                                            transition={{
                                                duration: 0.2,
                                                delay: i * 0.02,
                                            }}
                                            onClick={() => onRowClick?.(row)}
                                            className={`border-b border-gray-50 transition-colors hover:bg-violet-50/30 ${
                                                onRowClick
                                                    ? "cursor-pointer"
                                                    : ""
                                            }`}
                                        >
                                            {columns.map((col) => {
                                                const val = col.accessor(row);
                                                return (
                                                    <td
                                                        key={col.key}
                                                        className="px-5 py-3.5 text-sm text-gray-700 whitespace-nowrap"
                                                        style={{
                                                            textAlign:
                                                                col.align ||
                                                                "left",
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

                {sorted.length > 0 && (
                    <div className="px-5 py-3.5 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                        <p className="text-xs text-gray-500">
                            Showing{" "}
                            <span className="font-semibold text-gray-700">
                                {startItem}
                            </span>
                            –
                            <span className="font-semibold text-gray-700">
                                {endItem}
                            </span>{" "}
                            of{" "}
                            <span className="font-semibold text-gray-700">
                                {sorted.length}
                            </span>{" "}
                            results
                        </p>

                        <Pagination className="w-auto">
                            <Pagination.Content>
                                <Pagination.Item>
                                    <Pagination.Previous
                                        isDisabled={page === 1}
                                        onPress={() =>
                                            setPage((p) => Math.max(1, p - 1))
                                        }
                                    >
                                        <Pagination.PreviousIcon />
                                        <span className="hidden sm:inline">
                                            Previous
                                        </span>
                                    </Pagination.Previous>
                                </Pagination.Item>

                                {getPageNumbers().map((p, i) =>
                                    p === "ellipsis" ? (
                                        <Pagination.Item
                                            key={`ellipsis-${i}`}
                                        >
                                            <Pagination.Ellipsis />
                                        </Pagination.Item>
                                    ) : (
                                        <Pagination.Item key={p}>
                                            <Pagination.Link
                                                isActive={p === page}
                                                onPress={() =>
                                                    setPage(p as number)
                                                }
                                            >
                                                {p}
                                            </Pagination.Link>
                                        </Pagination.Item>
                                    ),
                                )}

                                <Pagination.Item>
                                    <Pagination.Next
                                        isDisabled={page === totalPages}
                                        onPress={() =>
                                            setPage((p) =>
                                                Math.min(totalPages, p + 1),
                                            )
                                        }
                                    >
                                        <span className="hidden sm:inline">
                                            Next
                                        </span>
                                        <Pagination.NextIcon />
                                    </Pagination.Next>
                                </Pagination.Item>
                            </Pagination.Content>
                        </Pagination>
                    </div>
                )}
            </div>
        </div>
    );
}