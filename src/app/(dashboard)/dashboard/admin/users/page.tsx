"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getUsersList } from "@/lib/action/admin-users";
import ConfirmModal from "@/Components/Dashboard/ConfirmModal";
import DataTable from "@/Components/Dashboard/DataTable";
import {
    updateUserRole,
    updateUserStatus,
    deleteUser,
    exportUsersToCSV,
} from "@/lib/action/admin-actions";

// ─── Types ────────────────────────────────────────────────────────

interface User {
    id: string;
    name: string;
    email: string;
    emailVerified: boolean;
    image: string | null;
    role: string;
    banned?: boolean;
    banReason?: string;
    createdAt: string;
    updatedAt?: string;
}

type ModalType = "role" | "block" | "unblock" | "delete" | null;

// ─── Animation Variants ───────────────────────────────────────────

const pageVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.08, delayChildren: 0.1 },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { type: "spring", damping: 20, stiffness: 200 },
    },
};

// ─── Theme ────────────────────────────────────────────────────────

const t = {
    bg: {
        page: "#0a0a12",
        glass: "rgba(255, 255, 255, 0.03)",
        glassHover: "rgba(255, 255, 255, 0.06)",
        input: "rgba(255, 255, 255, 0.05)",
    },
    border: {
        default: "rgba(255, 255, 255, 0.08)",
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

// ─── Role Badge Colors ────────────────────────────────────────────

const roleColors: Record<string, { bg: string; text: string; glow: string }> = {
    admin: {
        bg: "linear-gradient(135deg, rgba(168,85,247,0.2), rgba(139,92,246,0.2))",
        text: "#c084fc",
        glow: "rgba(168,85,247,0.15)",
    },
    host: {
        bg: "linear-gradient(135deg, rgba(34,211,238,0.2), rgba(59,130,246,0.2))",
        text: "#22d3ee",
        glow: "rgba(34,211,238,0.15)",
    },
    guest: {
        bg: "linear-gradient(135deg, rgba(52,211,153,0.2), rgba(16,185,129,0.2))",
        text: "#34d399",
        glow: "rgba(52,211,153,0.15)",
    },
};

// ─── Main Component ───────────────────────────────────────────────

export default function AdminUsersPage() {
    // Data
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Filters
    const [roleFilter, setRoleFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");

    // Modal
    const [modalType, setModalType] = useState<ModalType>(null);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [actionLoading, setActionLoading] = useState(false);
    const [selectedRole, setSelectedRole] = useState("");

    // ─── Fetch Users ──────────────────────────────────────────────

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await getUsersList();
            if (result.error) {
                setError(result.error);
            } else {
                setUsers(result.users as User[]);
            }
        } catch (err) {
            setError("Failed to load users");
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    // ─── Derived Data ─────────────────────────────────────────────

    const roles = useMemo(
        () => [...new Set(users.map((u) => u.role))].sort(),
        [users],
    );

    const stats = useMemo(
        () => ({
            total: users.length,
            admins: users.filter((u) => u.role === "admin").length,
            hosts: users.filter((u) => u.role === "host").length,
            guests: users.filter((u) => u.role === "guest").length,
            blocked: users.filter((u) => u.banned).length,
            verified: users.filter((u) => u.emailVerified).length,
        }),
        [users],
    );

    const filteredUsers = useMemo(() => {
        let result = [...users];
        if (roleFilter !== "all") {
            result = result.filter((u) => u.role === roleFilter);
        }
        if (statusFilter === "blocked") {
            result = result.filter((u) => u.banned);
        } else if (statusFilter === "active") {
            result = result.filter((u) => !u.banned);
        }
        return result;
    }, [users, roleFilter, statusFilter]);

    // ─── Modal Handlers ───────────────────────────────────────────

    const openRoleModal = (user: User) => {
        setSelectedUser(user);
        setSelectedRole(user.role);
        setModalType("role");
    };

    const openStatusModal = (user: User) => {
        setSelectedUser(user);
        setModalType(user.banned ? "unblock" : "block");
    };

    const openDeleteModal = (user: User) => {
        setSelectedUser(user);
        setModalType("delete");
    };

    const closeModal = () => {
        setModalType(null);
        setSelectedUser(null);
        setActionLoading(false);
    };

    // ─── Actions ──────────────────────────────────────────────────

    const handleRoleChange = async () => {
        if (!selectedUser || !selectedRole) return;
        setActionLoading(true);
        try {
            const res = await updateUserRole(
                selectedUser.id,
                selectedRole as any,
            );
            if (res.success) {
                setUsers((prev) =>
                    prev.map((u) =>
                        u.id === selectedUser.id
                            ? { ...u, role: selectedRole }
                            : u,
                    ),
                );
                closeModal();
            } else {
                alert(res.message || "Failed to update role");
                setActionLoading(false);
            }
        } catch {
            alert("Something went wrong");
            setActionLoading(false);
        }
    };

    const handleStatusChange = async () => {
        if (!selectedUser) return;
        setActionLoading(true);
        const isBlocking = !selectedUser.banned;
        try {
            const res = await updateUserStatus(
                selectedUser.id,
                isBlocking,
                isBlocking ? "Blocked by admin" : undefined,
            );
            if (res.success) {
                setUsers((prev) =>
                    prev.map((u) =>
                        u.id === selectedUser.id
                            ? {
                                  ...u,
                                  banned: isBlocking,
                                  banReason: isBlocking
                                      ? "Blocked by admin"
                                      : undefined,
                              }
                            : u,
                    ),
                );
                closeModal();
            } else {
                alert(res.message || "Failed to update status");
                setActionLoading(false);
            }
        } catch {
            alert("Something went wrong");
            setActionLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!selectedUser) return;
        setActionLoading(true);
        try {
            const res = await deleteUser(selectedUser.id);
            if (res.success) {
                setUsers((prev) =>
                    prev.filter((u) => u.id !== selectedUser.id),
                );
                closeModal();
            } else {
                alert(res.message || "Failed to delete user");
                setActionLoading(false);
            }
        } catch {
            alert("Something went wrong");
            setActionLoading(false);
        }
    };

    const handleExport = useCallback(() => {
        exportUsersToCSV(
            filteredUsers as unknown as Record<string, unknown>[],
            "admin-users",
        );
    }, [filteredUsers]);

    // ─── Columns ──────────────────────────────────────────────────

    const columns: Column<User>[] = useMemo(
        () => [
            {
                key: "user",
                header: "User",
                sortable: true,
                width: "280px",
                accessor: (u) => u.name,
                render: (u) => (
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 14,
                        }}
                    >
                        <div
                            style={{
                                width: 42,
                                height: 42,
                                borderRadius: 12,
                                background: u.image
                                    ? `url(${u.image}) center/cover`
                                    : "linear-gradient(135deg, #22d3ee, #a855f7)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: 16,
                                fontWeight: 700,
                                color: "#fff",
                                flexShrink: 0,
                                boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                            }}
                        >
                            {!u.image && u.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <div
                                style={{
                                    fontWeight: 600,
                                    fontSize: 14,
                                    color: t.text.primary,
                                    lineHeight: 1.3,
                                }}
                            >
                                {u.name}
                            </div>
                            <div
                                style={{
                                    fontSize: 12,
                                    color: t.text.muted,
                                    marginTop: 2,
                                }}
                            >
                                {u.email}
                            </div>
                        </div>
                    </div>
                ),
            },
            {
                key: "role",
                header: "Role",
                sortable: true,
                width: "120px",
                accessor: (u) => u.role,
                align: "center",
                render: (u) => {
                    const rc = roleColors[u.role] || roleColors.guest;
                    return (
                        <motion.span
                            whileHover={{ scale: 1.05 }}
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 6,
                                padding: "5px 14px",
                                borderRadius: 20,
                                background: rc.bg,
                                color: rc.text,
                                fontSize: 12,
                                fontWeight: 600,
                                textTransform: "capitalize" as const,
                                border: `1px solid ${rc.glow}`,
                                cursor: "default",
                            }}
                        >
                            <span
                                style={{
                                    width: 6,
                                    height: 6,
                                    borderRadius: "50%",
                                    background: rc.text,
                                }}
                            />
                            {u.role}
                        </motion.span>
                    );
                },
            },
            {
                key: "status",
                header: "Status",
                sortable: true,
                width: "120px",
                accessor: (u) => (u.banned ? "Blocked" : "Active"),
                align: "center",
                render: (u) => (
                    <span
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 6,
                            padding: "5px 14px",
                            borderRadius: 20,
                            background: u.banned
                                ? "rgba(239,68,68,0.1)"
                                : "rgba(52,211,153,0.1)",
                            color: u.banned ? "#ef4444" : "#34d399",
                            fontSize: 12,
                            fontWeight: 600,
                            border: `1px solid ${u.banned ? "rgba(239,68,68,0.2)" : "rgba(52,211,153,0.2)"}`,
                        }}
                    >
                        <span
                            style={{
                                width: 6,
                                height: 6,
                                borderRadius: "50%",
                                background: u.banned ? "#ef4444" : "#34d399",
                                boxShadow: `0 0 6px ${u.banned ? "rgba(239,68,68,0.5)" : "rgba(52,211,153,0.5)"}`,
                            }}
                        />
                        {u.banned ? "Blocked" : "Active"}
                    </span>
                ),
            },
            {
                key: "verified",
                header: "Verified",
                sortable: true,
                width: "100px",
                accessor: (u) => (u.emailVerified ? "Yes" : "No"),
                align: "center",
                render: (u) => (
                    <span
                        style={{
                            fontSize: 16,
                            filter: u.emailVerified
                                ? "drop-shadow(0 0 4px rgba(52,211,153,0.5))"
                                : "none",
                        }}
                    >
                        {u.emailVerified ? "✅" : "❌"}
                    </span>
                ),
            },
            {
                key: "joined",
                header: "Joined",
                sortable: true,
                width: "140px",
                accessor: (u) => new Date(u.createdAt),
                render: (u) => (
                    <span style={{ color: t.text.secondary, fontSize: 13 }}>
                        {new Date(u.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                        })}
                    </span>
                ),
            },
            {
                key: "actions",
                header: "Actions",
                sortable: false,
                width: "200px",
                accessor: () => "",
                align: "center",
                render: (u) => (
                    <div
                        style={{
                            display: "flex",
                            gap: 6,
                            justifyContent: "center",
                            flexWrap: "nowrap",
                        }}
                    >
                        {/* Role Change */}
                        <motion.button
                            whileHover={{ scale: 1.08 }}
                            whileTap={{ scale: 0.92 }}
                            onClick={(e) => {
                                e.stopPropagation();
                                openRoleModal(u);
                            }}
                            title="Change Role"
                            style={{
                                padding: "7px 10px",
                                background: "rgba(168,85,247,0.1)",
                                border: "1px solid rgba(168,85,247,0.2)",
                                borderRadius: 8,
                                color: "#c084fc",
                                cursor: "pointer",
                                fontSize: 14,
                                transition: "all 0.15s",
                            }}
                        >
                            👑
                        </motion.button>

                        {/* Block/Unblock */}
                        <motion.button
                            whileHover={{ scale: 1.08 }}
                            whileTap={{ scale: 0.92 }}
                            onClick={(e) => {
                                e.stopPropagation();
                                openStatusModal(u);
                            }}
                            title={u.banned ? "Unblock User" : "Block User"}
                            style={{
                                padding: "7px 10px",
                                background: u.banned
                                    ? "rgba(52,211,153,0.1)"
                                    : "rgba(245,158,11,0.1)",
                                border: `1px solid ${u.banned ? "rgba(52,211,153,0.2)" : "rgba(245,158,11,0.2)"}`,
                                borderRadius: 8,
                                color: u.banned ? "#34d399" : "#fbbf24",
                                cursor: "pointer",
                                fontSize: 14,
                                transition: "all 0.15s",
                            }}
                        >
                            {u.banned ? "🔓" : "🔒"}
                        </motion.button>

                        {/* Delete */}
                        <motion.button
                            whileHover={{ scale: 1.08 }}
                            whileTap={{ scale: 0.92 }}
                            onClick={(e) => {
                                e.stopPropagation();
                                openDeleteModal(u);
                            }}
                            title="Delete User"
                            style={{
                                padding: "7px 10px",
                                background: "rgba(239,68,68,0.1)",
                                border: "1px solid rgba(239,68,68,0.2)",
                                borderRadius: 8,
                                color: "#ef4444",
                                cursor: "pointer",
                                fontSize: 14,
                                transition: "all 0.15s",
                            }}
                        >
                            🗑️
                        </motion.button>
                    </div>
                ),
            },
        ],
        [],
    );

    // ─── Stat Cards Config ────────────────────────────────────────

    const statCards = [
        {
            label: "Total Users",
            value: stats.total,
            icon: "👥",
            gradient: "linear-gradient(135deg, #22d3ee, #3b82f6)",
            glow: "rgba(34, 211, 238, 0.15)",
        },
        {
            label: "Admins",
            value: stats.admins,
            icon: "👑",
            gradient: "linear-gradient(135deg, #a855f7, #7c3aed)",
            glow: "rgba(168, 85, 247, 0.15)",
        },
        {
            label: "Hosts",
            value: stats.hosts,
            icon: "🏠",
            gradient: "linear-gradient(135deg, #3b82f6, #2563eb)",
            glow: "rgba(59, 130, 246, 0.15)",
        },
        {
            label: "Guests",
            value: stats.guests,
            icon: "✈️",
            gradient: "linear-gradient(135deg, #34d399, #10b981)",
            glow: "rgba(52, 211, 153, 0.15)",
        },
        {
            label: "Blocked",
            value: stats.blocked,
            icon: "🚫",
            gradient: "linear-gradient(135deg, #ef4444, #dc2626)",
            glow: "rgba(239, 68, 68, 0.15)",
        },
    ];

    // ─── Render ───────────────────────────────────────────────────

    if (loading) {
        return (
            <div
                style={{
                    minHeight: "100vh",
                    background: t.bg.page,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                    style={{
                        width: 48,
                        height: 48,
                        border: `3px solid ${t.border.default}`,
                        borderTopColor: t.accent.cyan,
                        borderRadius: "50%",
                    }}
                />
            </div>
        );
    }

    if (error) {
        return (
            <div
                style={{
                    minHeight: "100vh",
                    background: t.bg.page,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column",
                    gap: 16,
                }}
            >
                <p style={{ color: "#ef4444", fontSize: 18 }}>{error}</p>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={fetchUsers}
                    style={{
                        padding: "10px 24px",
                        background: "linear-gradient(135deg, #22d3ee, #3b82f6)",
                        border: "none",
                        borderRadius: 10,
                        color: "#fff",
                        fontWeight: 600,
                        cursor: "pointer",
                    }}
                >
                    Retry
                </motion.button>
            </div>
        );
    }

    return (
        <motion.div
            variants={pageVariants}
            initial="hidden"
            animate="visible"
            style={{
                minHeight: "100vh",
                background: t.bg.page,
                padding: "32px 24px",
            }}
        >
            <div style={{ maxWidth: 1400, margin: "0 auto" }}>
                {/* ─── Header ─────────────────────────────────────── */}
                <motion.div
                    variants={itemVariants}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: 32,
                        flexWrap: "wrap",
                        gap: 16,
                    }}
                >
                    <div>
                        <h1
                            style={{
                                fontSize: 32,
                                fontWeight: 800,
                                background:
                                    "linear-gradient(135deg, #22d3ee, #a855f7, #3b82f6)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                                marginBottom: 4,
                            }}
                        >
                            👥 User Management
                        </h1>
                        <p style={{ color: t.text.secondary, fontSize: 15 }}>
                            Manage all users, roles, and access permissions
                        </p>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.96 }}
                        onClick={fetchUsers}
                        style={{
                            padding: "10px 20px",
                            background: t.bg.glass,
                            border: `1px solid ${t.border.default}`,
                            borderRadius: 12,
                            color: t.text.primary,
                            fontSize: 14,
                            fontWeight: 600,
                            cursor: "pointer",
                            backdropFilter: "blur(10px)",
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                        }}
                    >
                        🔄 Refresh
                    </motion.button>
                </motion.div>

                {/* ─── Stats ──────────────────────────────────────── */}
                <motion.div
                    variants={itemVariants}
                    style={{
                        display: "grid",
                        gridTemplateColumns:
                            "repeat(auto-fit, minmax(200px, 1fr))",
                        gap: 16,
                        marginBottom: 32,
                    }}
                >
                    {statCards.map((card) => (
                        <motion.div
                            key={card.label}
                            whileHover={{
                                scale: 1.03,
                                y: -4,
                            }}
                            transition={{
                                type: "spring",
                                damping: 15,
                                stiffness: 300,
                            }}
                            style={{
                                background: t.bg.glass,
                                border: `1px solid ${t.border.default}`,
                                borderRadius: 16,
                                padding: "22px 24px",
                                backdropFilter: "blur(20px)",
                                cursor: "default",
                                position: "relative",
                                overflow: "hidden",
                            }}
                        >
                            {/* Glow */}
                            <div
                                style={{
                                    position: "absolute",
                                    top: -20,
                                    right: -20,
                                    width: 80,
                                    height: 80,
                                    borderRadius: "50%",
                                    background: card.glow,
                                    filter: "blur(30px)",
                                    pointerEvents: "none",
                                }}
                            />

                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    marginBottom: 12,
                                }}
                            >
                                <span style={{ fontSize: 24 }}>
                                    {card.icon}
                                </span>
                                <div
                                    style={{
                                        padding: "4px 10px",
                                        borderRadius: 8,
                                        background: card.glow,
                                        fontSize: 11,
                                        fontWeight: 600,
                                        color: "rgba(255,255,255,0.7)",
                                        textTransform: "uppercase" as const,
                                        letterSpacing: "0.05em",
                                    }}
                                >
                                    {card.label.split(" ")[0]}
                                </div>
                            </div>
                            <div
                                style={{
                                    fontSize: 32,
                                    fontWeight: 800,
                                    background: card.gradient,
                                    WebkitBackgroundClip: "text",
                                    WebkitTextFillColor: "transparent",
                                    lineHeight: 1,
                                }}
                            >
                                {card.value}
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* ─── Data Table ─────────────────────────────────── */}
                <motion.div variants={itemVariants}>
                    <DataTable
                        data={filteredUsers}
                        columns={columns}
                        searchPlaceholder="Search by name or email..."
                        searchFields={["name", "email", "role"]}
                        pageSize={10}
                        pageSizeOptions={[5, 10, 25, 50]}
                        emptyMessage="No users match the current filters"
                        emptyIcon="👤"
                        headerGradient
                        toolbar={
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 10,
                                    flexWrap: "wrap",
                                }}
                            >
                                {/* Role Filter */}
                                <select
                                    value={roleFilter}
                                    onChange={(e) =>
                                        setRoleFilter(e.target.value)
                                    }
                                    style={{
                                        padding: "9px 14px",
                                        background: t.bg.input,
                                        border: `1px solid ${t.border.default}`,
                                        borderRadius: 10,
                                        color: t.text.primary,
                                        fontSize: 13,
                                        outline: "none",
                                        cursor: "pointer",
                                        minWidth: 120,
                                    }}
                                >
                                    <option value="all">All Roles</option>
                                    {roles.map((r) => (
                                        <option key={r} value={r}>
                                            {r.charAt(0).toUpperCase() +
                                                r.slice(1)}
                                        </option>
                                    ))}
                                </select>

                                {/* Status Filter */}
                                <select
                                    value={statusFilter}
                                    onChange={(e) =>
                                        setStatusFilter(e.target.value)
                                    }
                                    style={{
                                        padding: "9px 14px",
                                        background: t.bg.input,
                                        border: `1px solid ${t.border.default}`,
                                        borderRadius: 10,
                                        color: t.text.primary,
                                        fontSize: 13,
                                        outline: "none",
                                        cursor: "pointer",
                                        minWidth: 120,
                                    }}
                                >
                                    <option value="all">All Status</option>
                                    <option value="active">Active</option>
                                    <option value="blocked">Blocked</option>
                                </select>

                                {/* Export CSV */}
                                <motion.button
                                    whileHover={{ scale: 1.04 }}
                                    whileTap={{ scale: 0.96 }}
                                    onClick={handleExport}
                                    style={{
                                        padding: "9px 18px",
                                        background:
                                            "linear-gradient(135deg, #22d3ee, #3b82f6)",
                                        border: "none",
                                        borderRadius: 10,
                                        color: "#fff",
                                        fontSize: 13,
                                        fontWeight: 600,
                                        cursor: "pointer",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 6,
                                        boxShadow:
                                            "0 4px 16px rgba(34, 211, 238, 0.25)",
                                    }}
                                >
                                    📥 Export CSV
                                </motion.button>
                            </div>
                        }
                    />
                </motion.div>

                {/* ─── Modals ─────────────────────────────────────── */}

                {/* Role Change Modal */}
                <AnimatePresence>
                    {modalType === "role" && selectedUser && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={closeModal}
                            style={{
                                position: "fixed",
                                inset: 0,
                                zIndex: 1000,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                background: "rgba(0, 0, 0, 0.6)",
                                backdropFilter: "blur(4px)",
                                padding: 16,
                            }}
                        >
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                                transition={{
                                    type: "spring",
                                    damping: 25,
                                    stiffness: 300,
                                }}
                                onClick={(e) => e.stopPropagation()}
                                style={{
                                    background: "rgba(15, 15, 25, 0.95)",
                                    border: "1px solid rgba(168,85,247,0.2)",
                                    borderRadius: 20,
                                    padding: "32px",
                                    maxWidth: 420,
                                    width: "100%",
                                    backdropFilter: "blur(20px)",
                                    boxShadow:
                                        "0 25px 60px rgba(0, 0, 0, 0.5), 0 0 40px rgba(168,85,247,0.15)",
                                }}
                            >
                                <div
                                    style={{
                                        width: 56,
                                        height: 56,
                                        borderRadius: 16,
                                        background: "rgba(168,85,247,0.1)",
                                        border: "1px solid rgba(168,85,247,0.2)",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        margin: "0 auto 20px",
                                        fontSize: 28,
                                    }}
                                >
                                    👑
                                </div>

                                <h3
                                    style={{
                                        fontSize: 20,
                                        fontWeight: 700,
                                        color: t.text.primary,
                                        textAlign: "center",
                                        marginBottom: 8,
                                    }}
                                >
                                    Change User Role
                                </h3>
                                <p
                                    style={{
                                        fontSize: 14,
                                        color: t.text.secondary,
                                        textAlign: "center",
                                        marginBottom: 24,
                                    }}
                                >
                                    Update role for{" "}
                                    <strong style={{ color: t.text.primary }}>
                                        {selectedUser.name}
                                    </strong>
                                </p>

                                {/* Role Options */}
                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: 10,
                                        marginBottom: 28,
                                    }}
                                >
                                    {["admin", "host", "guest"].map((r) => {
                                        const rc =
                                            roleColors[r] || roleColors.guest;
                                        const isSelected = selectedRole === r;
                                        return (
                                            <motion.button
                                                key={r}
                                                whileHover={{ scale: 1.01 }}
                                                whileTap={{ scale: 0.99 }}
                                                onClick={() =>
                                                    setSelectedRole(r)
                                                }
                                                style={{
                                                    padding: "14px 18px",
                                                    background: isSelected
                                                        ? rc.bg
                                                        : t.bg.glass,
                                                    border: `2px solid ${isSelected ? rc.text : t.border.default}`,
                                                    borderRadius: 12,
                                                    color: isSelected
                                                        ? rc.text
                                                        : t.text.secondary,
                                                    fontSize: 14,
                                                    fontWeight: 600,
                                                    cursor: "pointer",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: 12,
                                                    textTransform:
                                                        "capitalize" as const,
                                                    transition: "all 0.15s",
                                                    boxShadow: isSelected
                                                        ? `0 0 20px ${rc.glow}`
                                                        : "none",
                                                }}
                                            >
                                                <span
                                                    style={{
                                                        width: 20,
                                                        height: 20,
                                                        borderRadius: "50%",
                                                        border: `2px solid ${isSelected ? rc.text : t.text.muted}`,
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent:
                                                            "center",
                                                    }}
                                                >
                                                    {isSelected && (
                                                        <motion.span
                                                            initial={{
                                                                scale: 0,
                                                            }}
                                                            animate={{
                                                                scale: 1,
                                                            }}
                                                            style={{
                                                                width: 10,
                                                                height: 10,
                                                                borderRadius:
                                                                    "50%",
                                                                background:
                                                                    rc.text,
                                                            }}
                                                        />
                                                    )}
                                                </span>
                                                {r === "admin" && "👑 "}
                                                {r === "host" && "🏠 "}
                                                {r === "guest" && "✈️ "}
                                                {r}
                                            </motion.button>
                                        );
                                    })}
                                </div>

                                {/* Buttons */}
                                <div style={{ display: "flex", gap: 12 }}>
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={closeModal}
                                        disabled={actionLoading}
                                        style={{
                                            flex: 1,
                                            padding: "12px",
                                            background: t.bg.glass,
                                            border: `1px solid ${t.border.default}`,
                                            borderRadius: 12,
                                            color: t.text.secondary,
                                            fontSize: 14,
                                            fontWeight: 600,
                                            cursor: "pointer",
                                        }}
                                    >
                                        Cancel
                                    </motion.button>
                                    <motion.button
                                        whileHover={
                                            !actionLoading
                                                ? { scale: 1.02 }
                                                : undefined
                                        }
                                        whileTap={
                                            !actionLoading
                                                ? { scale: 0.98 }
                                                : undefined
                                        }
                                        onClick={handleRoleChange}
                                        disabled={
                                            actionLoading ||
                                            selectedRole === selectedUser.role
                                        }
                                        style={{
                                            flex: 1,
                                            padding: "12px",
                                            background:
                                                "linear-gradient(135deg, #a855f7, #7c3aed)",
                                            border: "none",
                                            borderRadius: 12,
                                            color: "#fff",
                                            fontSize: 14,
                                            fontWeight: 600,
                                            cursor:
                                                actionLoading ||
                                                selectedRole ===
                                                    selectedUser.role
                                                    ? "not-allowed"
                                                    : "pointer",
                                            opacity:
                                                actionLoading ||
                                                selectedRole ===
                                                    selectedUser.role
                                                    ? 0.5
                                                    : 1,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            gap: 8,
                                            boxShadow:
                                                "0 4px 20px rgba(168,85,247,0.3)",
                                        }}
                                    >
                                        {actionLoading && (
                                            <motion.span
                                                animate={{ rotate: 360 }}
                                                transition={{
                                                    duration: 1,
                                                    repeat: Infinity,
                                                    ease: "linear",
                                                }}
                                                style={{
                                                    display: "inline-block",
                                                    width: 16,
                                                    height: 16,
                                                    border: "2px solid rgba(255,255,255,0.3)",
                                                    borderTopColor: "#fff",
                                                    borderRadius: "50%",
                                                }}
                                            />
                                        )}
                                        Update Role
                                    </motion.button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Block/Unblock Confirmation */}
                <ConfirmModal
                    isOpen={
                        (modalType === "block" || modalType === "unblock") &&
                        !!selectedUser
                    }
                    onClose={closeModal}
                    onConfirm={handleStatusChange}
                    title={
                        modalType === "block" ? "Block User?" : "Unblock User?"
                    }
                    message={
                        modalType === "block" ? (
                            <>
                                Are you sure you want to block{" "}
                                <strong style={{ color: t.text.primary }}>
                                    {selectedUser?.name}
                                </strong>
                                ? They will be logged out and unable to access
                                their account.
                            </>
                        ) : (
                            <>
                                Unblock{" "}
                                <strong style={{ color: t.text.primary }}>
                                    {selectedUser?.name}
                                </strong>
                                ? They will regain full access to their account.
                            </>
                        )
                    }
                    confirmText={
                        modalType === "block" ? "Block User" : "Unblock"
                    }
                    variant={modalType === "block" ? "warning" : "info"}
                    loading={actionLoading}
                    icon={modalType === "block" ? "🔒" : "🔓"}
                />

                {/* Delete Confirmation */}
                <ConfirmModal
                    isOpen={modalType === "delete" && !!selectedUser}
                    onClose={closeModal}
                    onConfirm={handleDelete}
                    title="Delete User Permanently?"
                    message={
                        <>
                            This will permanently delete{" "}
                            <strong style={{ color: t.text.primary }}>
                                {selectedUser?.name}
                            </strong>
                            &apos;s account including all their sessions and
                            credentials.{" "}
                            <span style={{ color: "#ef4444", fontWeight: 600 }}>
                                This action cannot be undone.
                            </span>
                        </>
                    }
                    confirmText="Delete Forever"
                    variant="danger"
                    loading={actionLoading}
                    icon="🗑️"
                />
            </div>
        </motion.div>
    );
}
