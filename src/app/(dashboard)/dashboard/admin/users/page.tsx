"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@heroui/react";
import { ListBox, Select } from "@heroui/react";
import { toast } from "sonner";
import ConfirmModal from "@/Components/Dashboard/ConfirmModal";
import DataTable from "@/Components/Dashboard/DataTable";
import type { Column } from "@/Components/Dashboard/DataTable";
import {
  getUsersList,
  adminUpdateUserRole,
  adminUpdateUserStatus,
  adminDeleteUser,
} from "@/lib/action/admin-users";
import { exportUsersToCSV } from "@/lib/action/admin-actions";

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

type UserRecord = User & Record<string, unknown>;
type ModalType = "role" | "block" | "unblock" | "delete" | null;

const pageVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", damping: 22, stiffness: 200 },
  },
};

const roleConfig: Record<
  string,
  {
    bg: string;
    text: string;
    border: string;
    dot: string;
    icon: string;
  }
> = {
  admin: {
    bg: "bg-violet-50",
    text: "text-violet-700",
    border: "border-violet-200",
    dot: "bg-violet-500",
    icon: "👑",
  },
  host: {
    bg: "bg-indigo-50",
    text: "text-indigo-700",
    border: "border-indigo-200",
    dot: "bg-indigo-500",
    icon: "🏠",
  },
  guest: {
    bg: "bg-cyan-50",
    text: "text-cyan-700",
    border: "border-cyan-200",
    dot: "bg-cyan-500",
    icon: "✈️",
  },
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [modalType, setModalType] = useState<ModalType>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getUsersList();
      if (!result?.success) {
        setError(result?.message || "Failed to load users");
        toast.error(result?.message || "Failed to load users");
        return;
      }
      setUsers((result?.data?.users ?? []) as User[]);
      if (result?.data?.currentUserId) {
        setCurrentUserId(result.data.currentUserId as string);
      }
    } catch (err) {
      setError("Failed to load users");
      toast.error("Failed to load users. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const roles = useMemo(
    () => [...new Set(users.map((u) => u.role))].sort(),
    [users]
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
    [users]
  );

  const filteredUsers = useMemo(() => {
    let result = [...users];
    if (roleFilter !== "all")
      result = result.filter((u) => u.role === roleFilter);
    if (statusFilter === "blocked") result = result.filter((u) => u.banned);
    else if (statusFilter === "active")
      result = result.filter((u) => !u.banned);
    return result;
  }, [users, roleFilter, statusFilter]);

  const isSelf = useCallback(
    (userId: string) => currentUserId === userId,
    [currentUserId]
  );

  const openRoleModal = useCallback(
    (user: User) => {
      if (isSelf(user.id)) {
        toast.warning("You cannot change your own role", {
          description:
            "Ask another admin to change your role if needed.",
        });
        return;
      }
      setSelectedUser(user);
      setSelectedRole(user.role);
      setModalType("role");
    },
    [isSelf]
  );

  const openStatusModal = useCallback(
    (user: User) => {
      if (isSelf(user.id)) {
        toast.warning(
          user.banned
            ? "You cannot unblock yourself"
            : "You cannot block yourself",
          {
            description: "This action must be performed by another admin.",
          }
        );
        return;
      }
      setSelectedUser(user);
      setModalType(user.banned ? "unblock" : "block");
    },
    [isSelf]
  );

  const openDeleteModal = useCallback(
    (user: User) => {
      if (isSelf(user.id)) {
        toast.warning("You cannot delete your own account", {
          description:
            "Contact another admin if you need your account removed.",
        });
        return;
      }
      setSelectedUser(user);
      setModalType("delete");
    },
    [isSelf]
  );

  const closeModal = useCallback(() => {
    setModalType(null);
    setSelectedUser(null);
    setActionLoading(false);
  }, []);

  const handleRoleChange = async () => {
    if (!selectedUser || !selectedRole) return;
    if (isSelf(selectedUser.id)) {
      toast.warning("You cannot change your own role");
      closeModal();
      return;
    }
    setActionLoading(true);
    try {
      const res = await adminUpdateUserRole(selectedUser.id, selectedRole);
      if (res?.success) {
        setUsers((prev) =>
          prev.map((u) =>
            u.id === selectedUser.id ? { ...u, role: selectedRole } : u
          )
        );
        toast.success("Role updated successfully", {
          description: `${selectedUser.name}'s role changed to ${selectedRole}.`,
        });
        closeModal();
      } else {
        toast.error(res?.message || "Failed to update role");
        setActionLoading(false);
      }
    } catch {
      toast.error("Something went wrong while updating role");
      setActionLoading(false);
    }
  };

  const handleStatusChange = async () => {
    if (!selectedUser) return;
    if (isSelf(selectedUser.id)) {
      toast.warning("You cannot change your own status");
      closeModal();
      return;
    }
    setActionLoading(true);
    const isBlocking = !selectedUser.banned;
    try {
      const res = await adminUpdateUserStatus(
        selectedUser.id,
        isBlocking,
        isBlocking ? "Blocked by admin" : undefined
      );
      if (res?.success) {
        setUsers((prev) =>
          prev.map((u) =>
            u.id === selectedUser.id
              ? {
                  ...u,
                  banned: isBlocking,
                  banReason: isBlocking ? "Blocked by admin" : undefined,
                }
              : u
          )
        );
        if (isBlocking) {
          toast.success("User blocked successfully", {
            description: `${selectedUser.name} has been blocked and logged out.`,
          });
        } else {
          toast.success("User unblocked successfully", {
            description: `${selectedUser.name} can now access their account.`,
          });
        }
        closeModal();
      } else {
        toast.error(res?.message || "Failed to update status");
        setActionLoading(false);
      }
    } catch {
      toast.error("Something went wrong while updating status");
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedUser) return;
    if (isSelf(selectedUser.id)) {
      toast.warning("You cannot delete your own account");
      closeModal();
      return;
    }
    setActionLoading(true);
    try {
      const res = await adminDeleteUser(selectedUser.id);
      if (res?.success) {
        setUsers((prev) => prev.filter((u) => u.id !== selectedUser.id));
        toast.success("User deleted permanently", {
          description: `${selectedUser.name}'s account has been removed.`,
        });
        closeModal();
      } else {
        toast.error(res?.message || "Failed to delete user");
        setActionLoading(false);
      }
    } catch {
      toast.error("Something went wrong while deleting user");
      setActionLoading(false);
    }
  };

  const handleExport = useCallback(() => {
    try {
      exportUsersToCSV(
        filteredUsers as unknown as Record<string, unknown>[],
        "admin-users"
      );
      toast.success("Export started", {
        description: `Exporting ${filteredUsers.length} users to CSV.`,
      });
    } catch {
      toast.error("Failed to export users");
    }
  }, [filteredUsers]);

  const columns: Column<UserRecord>[] = useMemo(
    () => [
      {
        key: "user",
        header: "User",
        sortable: true,
        width: "280px",
        accessor: (u) => u.name,
        render: (u) => (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-400 to-indigo-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0 shadow-sm overflow-hidden">
              {u.image ? (
                <img
                  src={u.image}
                  alt={u.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                u.name?.charAt(0).toUpperCase()
              )}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <p className="font-semibold text-sm text-gray-900 truncate">
                  {u.name}
                </p>
                {isSelf(u.id as string) && (
                  <span className="px-1.5 py-0.5 text-[10px] font-bold bg-violet-100 text-violet-600 rounded-md">
                    YOU
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-400 truncate">{u.email}</p>
            </div>
          </div>
        ),
      },
      {
        key: "role",
        header: "Role",
        sortable: true,
        width: "130px",
        accessor: (u) => u.role,
        align: "center",
        render: (u) => {
          const rc = roleConfig[u.role as string] || roleConfig.guest;
          return (
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold capitalize border ${rc.bg} ${rc.text} ${rc.border}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${rc.dot}`} />
              {u.role as string}
            </span>
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
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
              u.banned
                ? "bg-red-50 text-red-600 border-red-200"
                : "bg-emerald-50 text-emerald-600 border-emerald-200"
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                u.banned ? "bg-red-500" : "bg-emerald-500"
              }`}
              style={{
                boxShadow: `0 0 6px ${u.banned ? "rgba(239,68,68,0.4)" : "rgba(16,185,129,0.4)"}`,
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
          <div className="flex items-center justify-center">
            {u.emailVerified ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-600 text-xs font-medium">
                <svg
                  className="w-3.5 h-3.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                Yes
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-gray-50 text-gray-400 text-xs font-medium">
                <svg
                  className="w-3.5 h-3.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                No
              </span>
            )}
          </div>
        ),
      },
      {
        key: "joined",
        header: "Joined",
        sortable: true,
        width: "140px",
        accessor: (u) => new Date(u.createdAt as string),
        render: (u) => (
          <span className="text-gray-500 text-xs">
            {new Date(u.createdAt as string).toLocaleDateString("en-US", {
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
        width: "180px",
        accessor: () => "",
        align: "center",
        render: (u) => {
          const self = isSelf(u.id as string);
          return (
            <div className="flex items-center gap-1.5 justify-center">
              <motion.button
                whileHover={{ scale: self ? 1 : 1.1 }}
                whileTap={{ scale: self ? 1 : 0.9 }}
                onClick={(e) => {
                  e.stopPropagation();
                  openRoleModal(u as User);
                }}
                title={self ? "Cannot change own role" : "Change Role"}
                className={`p-2 rounded-lg border transition-colors ${
                  self
                    ? "bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed"
                    : "bg-violet-50 hover:bg-violet-100 border-violet-100 text-violet-600 cursor-pointer"
                }`}
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </motion.button>

              <motion.button
                whileHover={{ scale: self ? 1 : 1.1 }}
                whileTap={{ scale: self ? 1 : 0.9 }}
                onClick={(e) => {
                  e.stopPropagation();
                  openStatusModal(u as User);
                }}
                title={
                  self
                    ? "Cannot change own status"
                    : u.banned
                      ? "Unblock User"
                      : "Block User"
                }
                className={`p-2 rounded-lg border transition-colors ${
                  self
                    ? "bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed"
                    : u.banned
                      ? "bg-emerald-50 hover:bg-emerald-100 border-emerald-100 text-emerald-600 cursor-pointer"
                      : "bg-amber-50 hover:bg-amber-100 border-amber-100 text-amber-600 cursor-pointer"
                }`}
              >
                {u.banned ? (
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                )}
              </motion.button>

              <motion.button
                whileHover={{ scale: self ? 1 : 1.1 }}
                whileTap={{ scale: self ? 1 : 0.9 }}
                onClick={(e) => {
                  e.stopPropagation();
                  openDeleteModal(u as User);
                }}
                title={self ? "Cannot delete own account" : "Delete User"}
                className={`p-2 rounded-lg border transition-colors ${
                  self
                    ? "bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed"
                    : "bg-red-50 hover:bg-red-100 border-red-100 text-red-500 cursor-pointer"
                }`}
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </motion.button>
            </div>
          );
        },
      },
    ],
    [openRoleModal, openStatusModal, openDeleteModal, isSelf]
  );

  const statCards = [
    {
      label: "Total Users",
      value: stats.total,
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      ),
      color: "text-indigo-600",
      bgIcon: "bg-indigo-50",
    },
    {
      label: "Admins",
      value: stats.admins,
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
          />
        </svg>
      ),
      color: "text-violet-600",
      bgIcon: "bg-violet-50",
    },
    {
      label: "Hosts",
      value: stats.hosts,
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      ),
      color: "text-indigo-600",
      bgIcon: "bg-indigo-50",
    },
    {
      label: "Guests",
      value: stats.guests,
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      color: "text-cyan-600",
      bgIcon: "bg-cyan-50",
    },
    {
      label: "Blocked",
      value: stats.blocked,
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
          />
        </svg>
      ),
      color: "text-red-600",
      bgIcon: "bg-red-50",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50/50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: "linear",
            }}
            className="w-10 h-10 border-3 border-violet-200 border-t-violet-600 rounded-full"
          />
          <p className="text-sm text-gray-400">Loading users...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50/50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mx-auto">
            <svg
              className="w-8 h-8 text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <p className="text-red-500 text-sm font-medium">{error}</p>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={fetchUsers}
            className="px-5 py-2.5 bg-gradient-to-r from-violet-500 to-indigo-600 text-white text-sm font-semibold rounded-xl shadow-lg shadow-violet-500/25 cursor-pointer"
          >
            Try Again
          </motion.button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-slate-50/50 p-4 sm:p-6 lg:p-8"
    >
      <div className="max-w-[1440px] mx-auto">
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8"
        >
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              User Management
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage all users, roles, and access permissions
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={fetchUsers}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:border-violet-200 transition-all cursor-pointer shadow-sm"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Refresh
          </motion.button>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-8"
        >
          {statCards.map((card) => (
            <motion.div
              key={card.label}
              whileHover={{ y: -2 }}
              transition={{
                type: "spring",
                damping: 18,
                stiffness: 300,
              }}
              className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-5 shadow-sm hover:shadow-md hover:border-violet-100 transition-all cursor-default group"
            >
              <div className="flex items-center justify-between mb-3">
                <div
                  className={`w-10 h-10 rounded-xl ${card.bgIcon} ${card.color} flex items-center justify-center group-hover:scale-110 transition-transform`}
                >
                  {card.icon}
                </div>
              </div>
              <p className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-none mb-1">
                {card.value}
              </p>
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">
                {card.label}
              </p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div variants={itemVariants}>
          <DataTable<UserRecord>
            data={filteredUsers as unknown as UserRecord[]}
            columns={columns}
            searchPlaceholder="Search by name or email..."
            searchFields={["name", "email", "role"]}
            pageSize={10}
            pageSizeOptions={[5, 10, 25, 50]}
            emptyMessage="No users match the current filters"
            emptyIcon="👤"
            headerGradient
            toolbar={
              <div className="flex items-center gap-2 flex-wrap">
                <Select
                  className="w-36"
                  placeholder="All Roles"
                  aria-label="Filter by role"
                  selectedKey={roleFilter}
                  onSelectionChange={(key) => setRoleFilter(String(key))}
                >
                  <Select.Trigger>
                    <Select.Value />
                    <Select.Indicator />
                  </Select.Trigger>
                  <Select.Popover>
                    <ListBox>
                      <ListBox.Item id="all" textValue="All Roles">
                        All Roles
                        <ListBox.ItemIndicator />
                      </ListBox.Item>
                      {roles.map((r) => (
                        <ListBox.Item
                          key={r}
                          id={r}
                          textValue={
                            r.charAt(0).toUpperCase() + r.slice(1)
                          }
                        >
                          {r.charAt(0).toUpperCase() + r.slice(1)}
                          <ListBox.ItemIndicator />
                        </ListBox.Item>
                      ))}
                    </ListBox>
                  </Select.Popover>
                </Select>

                <Select
                  className="w-36"
                  placeholder="All Status"
                  aria-label="Filter by status"
                  selectedKey={statusFilter}
                  onSelectionChange={(key) => setStatusFilter(String(key))}
                >
                  <Select.Trigger>
                    <Select.Value />
                    <Select.Indicator />
                  </Select.Trigger>
                  <Select.Popover>
                    <ListBox>
                      <ListBox.Item id="all" textValue="All Status">
                        All Status
                        <ListBox.ItemIndicator />
                      </ListBox.Item>
                      <ListBox.Item id="active" textValue="Active">
                        Active
                        <ListBox.ItemIndicator />
                      </ListBox.Item>
                      <ListBox.Item id="blocked" textValue="Blocked">
                        Blocked
                        <ListBox.ItemIndicator />
                      </ListBox.Item>
                    </ListBox>
                  </Select.Popover>
                </Select>

                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleExport}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-500 to-indigo-600 text-white text-xs font-semibold rounded-xl shadow-md shadow-violet-500/20 cursor-pointer hover:shadow-lg hover:shadow-violet-500/30 transition-all"
                >
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  Export
                </motion.button>
              </div>
            }
          />
        </motion.div>

        <AnimatePresence>
          {modalType === "role" && selectedUser && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
              className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/30 backdrop-blur-sm p-4"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.92, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.92, y: 20 }}
                transition={{
                  type: "spring",
                  damping: 25,
                  stiffness: 300,
                }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl border border-gray-100"
              >
                <div className="w-14 h-14 rounded-2xl bg-violet-50 border border-violet-100 flex items-center justify-center mx-auto mb-5">
                  <svg
                    className="w-7 h-7 text-violet-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>

                <h3 className="text-xl font-bold text-gray-900 text-center mb-1">
                  Change User Role
                </h3>
                <p className="text-sm text-gray-500 text-center mb-6">
                  Update role for{" "}
                  <span className="font-semibold text-gray-900">
                    {selectedUser.name}
                  </span>
                </p>

                <div className="flex flex-col gap-2.5 mb-7">
                  {(["admin", "host", "guest"] as const).map((r) => {
                    const rc = roleConfig[r] || roleConfig.guest;
                    const isSelected = selectedRole === r;
                    return (
                      <motion.button
                        key={r}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => setSelectedRole(r)}
                        className={`flex items-center gap-3 px-4 py-3.5 rounded-xl border-2 text-sm font-semibold capitalize transition-all cursor-pointer ${
                          isSelected
                            ? `${rc.bg} ${rc.text} ${rc.border} shadow-sm`
                            : "bg-gray-50 text-gray-500 border-transparent hover:border-gray-200"
                        }`}
                      >
                        <span
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                            isSelected ? rc.border : "border-gray-300"
                          }`}
                        >
                          {isSelected && (
                            <motion.span
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className={`w-2.5 h-2.5 rounded-full ${rc.dot}`}
                            />
                          )}
                        </span>
                        <span className="text-base">{rc.icon}</span>
                        {r}
                      </motion.button>
                    );
                  })}
                </div>

                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={closeModal}
                    disabled={actionLoading}
                    className="flex-1 py-2.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl text-gray-600 text-sm font-semibold cursor-pointer disabled:opacity-50 transition-all"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={!actionLoading ? { scale: 1.01 } : {}}
                    whileTap={!actionLoading ? { scale: 0.99 } : {}}
                    onClick={handleRoleChange}
                    disabled={
                      actionLoading || selectedRole === selectedUser.role
                    }
                    className="flex-1 py-2.5 bg-gradient-to-r from-violet-500 to-indigo-600 rounded-xl text-white text-sm font-semibold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-violet-500/25 flex items-center justify-center gap-2 transition-all"
                  >
                    {actionLoading && (
                      <motion.span
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                      />
                    )}
                    Update Role
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

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
                <strong className="text-gray-900">
                  {selectedUser?.name}
                </strong>
                ? They will be logged out and unable to access their
                account.
              </>
            ) : (
              <>
                Unblock{" "}
                <strong className="text-gray-900">
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

        <ConfirmModal
          isOpen={modalType === "delete" && !!selectedUser}
          onClose={closeModal}
          onConfirm={handleDelete}
          title="Delete User Permanently?"
          message={
            <>
              This will permanently delete{" "}
              <strong className="text-gray-900">
                {selectedUser?.name}
              </strong>
              &apos;s account including all their sessions and credentials.{" "}
              <span className="text-red-500 font-semibold">
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