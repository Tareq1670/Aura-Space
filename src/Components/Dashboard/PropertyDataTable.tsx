"use client";

import { Edit, Trash2, Copy, ExternalLink } from "lucide-react";
import Link from "next/link";
import DataTable, { type Column } from "@/Components/Dashboard/DataTable";
import StatusBadge from "@/Components/property/StatusBadge";
import type { PropertyListItem } from "@/lib/api/Host/host-property-api";

interface PropertyDataTableProps {
    properties: PropertyListItem[];
    onDelete: (id: string) => void;
    onDuplicate: (id: string) => void;
}

export default function PropertyDataTable({ properties, onDelete, onDuplicate }: PropertyDataTableProps) {
    const columns: Column<PropertyListItem>[] = [
        {
            key: "image",
            header: "Image",
            accessor: (row) => row.images?.[0] || "",
            render: (row, val) => (
                <img
                    src={String(val) || "/placeholder-property.svg"}
                    alt={row.title}
                    className="w-12 h-9 rounded-lg object-cover bg-gray-100"
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = "/placeholder-property.svg";
                    }}
                />
            ),
            sortable: false,
            width: "70px",
        },
        {
            key: "title",
            header: "Title",
            accessor: (row) => row.title || "Untitled",
            render: (row) => (
                <div className="flex flex-col">
                    <span className="font-medium text-gray-900 text-sm">{row.title || "Untitled"}</span>
                    <span className="text-xs text-gray-400">
                        {[row.location?.city, row.location?.country].filter(Boolean).join(", ") || "—"}
                    </span>
                </div>
            ),
        },
        {
            key: "price",
            header: "Price",
            accessor: (row) => row.price?.perNight || 0,
            render: (r, val) => (
                <span className="font-semibold text-gray-900">
                    {val ? `${r.price?.currency || "BDT"} ${Number(val).toLocaleString()}/night` : "—"}
                </span>
            ),
            align: "right",
            width: "130px",
        },
        {
            key: "status",
            header: "Status",
            accessor: (row) => row.status,
            render: (_, val) => <StatusBadge status={String(val)} size="sm" />,
            width: "100px",
        },
        {
            key: "bookings",
            header: "Bookings",
            accessor: (row) => row.bookingCount ?? 0,
            render: (_, val) => <span className="text-sm text-gray-600">{String(val)}</span>,
            align: "center",
            width: "80px",
        },
        {
            key: "createdAt",
            header: "Created",
            accessor: (row) => row.createdAt ? new Date(row.createdAt) : new Date(0),
            render: (_, val) => (
                <span className="text-sm text-gray-500">
                    {val instanceof Date && val.getTime() > 0
                        ? val.toLocaleDateString()
                        : "—"}
                </span>
            ),
            width: "100px",
        },
        {
            key: "actions",
            header: "Actions",
            accessor: (row) => row.id,
            render: (row) => (
                <div className="flex items-center gap-1">
                    <Link
                        href={`/dashboard/host/items/edit/${row.id}`}
                        className="p-1.5 rounded-lg text-violet-600 hover:bg-violet-50 transition-colors"
                        title="Edit"
                    >
                        <Edit className="w-4 h-4" />
                    </Link>
                    <button
                        type="button"
                        onClick={() => onDuplicate(row.id)}
                        className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                        title="Duplicate"
                    >
                        <Copy className="w-4 h-4" />
                    </button>
                    <Link
                        href={`/listings/${row.id}`}
                        target="_blank"
                        className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-50 transition-colors"
                        title="View live listing"
                    >
                        <ExternalLink className="w-4 h-4" />
                    </Link>
                    <button
                        type="button"
                        onClick={() => onDelete(row.id)}
                        className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                        title="Delete"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            ),
            sortable: false,
            width: "130px",
        },
    ];

    return (
        <DataTable<PropertyListItem>
            data={properties}
            columns={columns}
            searchPlaceholder="Search by title or location..."
            searchFields={["title"]}
            emptyMessage="No properties found"
            emptyIcon={<span>📋</span>}
            headerGradient
        />
    );
}
