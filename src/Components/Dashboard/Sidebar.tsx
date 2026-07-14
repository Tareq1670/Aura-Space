"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    HiSquares2X2,
    HiUser,
    HiHome,
    HiCalendarDays,
    HiHeart,
    HiPlusCircle,
    HiBuildingOffice2,
    HiUsers,
    HiClipboardDocumentList,
    HiChartBar,
    HiCog6Tooth,
    HiArrowRightOnRectangle,
    HiChevronLeft,
    HiXMark,
    HiSparkles,
    HiMagnifyingGlass,
    HiArrowUpRight,
    HiBanknotes,
    HiStar,
    HiBellAlert,
    HiChatBubbleLeftRight,
    HiCurrencyDollar,
    HiShieldCheck,
    HiFlag,
    HiMegaphone,
    HiPresentationChartLine,
} from "react-icons/hi2";
import { authClient } from "@/lib/auth-client";

interface User {
    id: string;
    name: string;
    email: string;
    emailVerified: boolean;
    image?: string | null;
    role?: string | null;
    createdAt: Date;
    updatedAt: Date;
}

interface NavItem {
    label: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: number;
    badgeColor?: "violet" | "red" | "emerald";
}

interface NavSection {
    section: string;
    items: NavItem[];
}

interface DashboardSidebarProps {
    user?: User | null;
    isOpen: boolean;
    onClose: () => void;
}

type RoleKey = "user" | "host" | "admin";

const NAV_LINKS: Record<RoleKey, NavSection[]> = {
    user: [
        {
            section: "Overview",
            items: [
                {
                    label: "Dashboard",
                    href: "/dashboard/guest/main",
                    icon: HiSquares2X2,
                },
                {
                    label: "My Profile",
                    href: "/dashboard/guest/profile",
                    icon: HiUser,
                },
            ],
        },
        {
            section: "My Stays",
            items: [
                {
                    label: "My Bookings",
                    href: "/dashboard/guest/bookings",
                    icon: HiCalendarDays,
                    badge: 2,
                    badgeColor: "violet",
                },
                {
                    label: "Wishlist",
                    href: "/dashboard/guest/wishlist",
                    icon: HiHeart,
                },
                {
                    label: "My Reviews",
                    href: "/dashboard/guest/reviews",
                    icon: HiStar,
                },
            ],
        },
        {
            section: "Finance",
            items: [
                {
                    label: "Transaction History",
                    href: "/dashboard/guest/transactions",
                    icon: HiBanknotes,
                },
            ],
        },
        {
            section: "Communication",
            items: [
                {
                    label: "Messages",
                    href: "/dashboard/guest/messages",
                    icon: HiChatBubbleLeftRight,
                    badge: 3,
                    badgeColor: "red",
                },
                {
                    label: "Notifications",
                    href: "/dashboard/guest/notifications",
                    icon: HiBellAlert,
                },
            ],
        },
    ],
    host: [
        {
            section: "Overview",
            items: [
                {
                    label: "Dashboard",
                    href: "/dashboard/host/main",
                    icon: HiSquares2X2,
                },
                {
                    label: "My Profile",
                    href: "/dashboard/host/profile",
                    icon: HiUser,
                },
            ],
        },
        {
            section: "Property Management",
            items: [
                {
                    label: "Add New Property",
                    href: "/dashboard/host/items/add",
                    icon: HiPlusCircle,
                },
                {
                    label: "Manage Properties",
                    href: "/dashboard/host/items/manage",
                    icon: HiHome,
                },
                {
                    label: "Reservations",
                    href: "/dashboard/host/reservations",
                    icon: HiClipboardDocumentList,
                    badge: 5,
                    badgeColor: "violet",
                },
            ],
        },
        {
            section: "Finance",
            items: [
                {
                    label: "Earnings",
                    href: "/dashboard/host/earnings",
                    icon: HiCurrencyDollar,
                },
                {
                    label: "Transactions",
                    href: "/dashboard/host/transactions",
                    icon: HiBanknotes,
                },
                {
                    label: "Analytics",
                    href: "/dashboard/host/analytics",
                    icon: HiPresentationChartLine,
                },
            ],
        },
        {
            section: "Communication",
            items: [
                {
                    label: "Guest Reviews",
                    href: "/dashboard/host/reviews",
                    icon: HiStar,
                },
                {
                    label: "Messages",
                    href: "/dashboard/host/messages",
                    icon: HiChatBubbleLeftRight,
                    badge: 8,
                    badgeColor: "red",
                },
            ],
        },
    ],
    admin: [
        {
            section: "Overview",
            items: [
                {
                    label: "My Profile",
                    href: "/dashboard/admin/profile",
                    icon: HiUser,
                },
                {
                    label: "Analytics Overview",
                    href: "/dashboard/admin/main",
                    icon: HiChartBar,
                },
            ],
        },
        {
            section: "Platform Management",
            items: [
                {
                    label: "Manage Users",
                    href: "/dashboard/admin/users",
                    icon: HiUsers,
                },
                {
                    label: "Manage Hosts",
                    href: "/dashboard/admin/hosts",
                    icon: HiShieldCheck,
                },
                {
                    label: "All Properties",
                    href: "/dashboard/admin/properties",
                    icon: HiBuildingOffice2,
                },
                {
                    label: "All Bookings",
                    href: "/dashboard/admin/bookings",
                    icon: HiCalendarDays,
                },
            ],
        },
        {
            section: "Moderation",
            items: [
                {
                    label: "Reported Content",
                    href: "/dashboard/admin/reports",
                    icon: HiFlag,
                    badge: 12,
                    badgeColor: "red",
                },
                {
                    label: "Reviews",
                    href: "/dashboard/admin/reviews",
                    icon: HiStar,
                },
                {
                    label: "Advertisements",
                    href: "/dashboard/admin/advertise",
                    icon: HiMegaphone,
                },
            ],
        },
        {
            section: "Finance",
            items: [
                {
                    label: "Revenue Reports",
                    href: "/dashboard/admin/revenue",
                    icon: HiCurrencyDollar,
                },
                {
                    label: "Transactions",
                    href: "/dashboard/admin/transactions",
                    icon: HiBanknotes,
                },
            ],
        },
    ],
};

const roleConfig: Record<RoleKey, { label: string; gradient: string }> = {
    user: { label: "Guest", gradient: "from-violet-500 to-indigo-500" },
    host: { label: "Host", gradient: "from-indigo-500 to-purple-500" },
    admin: { label: "Admin", gradient: "from-purple-500 to-pink-500" },
};

const SidebarInner = ({
    user,
    role,
    currentRole,
    navSections,
    isMinimized,
    isLoggingOut,
    pathname,
    router,
    inDrawer,
    onClose,
    onToggleMinimize,
    handleLogout,
    searchQuery,
    onSearchChange,
}: {
    user?: User | null;
    role: RoleKey;
    currentRole: { label: string; gradient: string };
    navSections: NavSection[];
    isMinimized: boolean;
    isLoggingOut: boolean;
    pathname: string;
    router: ReturnType<typeof useRouter>;
    inDrawer?: boolean;
    onClose?: () => void;
    onToggleMinimize?: () => void;
    handleLogout: () => Promise<void>;
    searchQuery: string;
    onSearchChange: (query: string) => void;
}) => {
    const showLabels = inDrawer || !isMinimized;
    const userInitial = user?.name?.charAt(0)?.toUpperCase() || "U";

    const isItemActive = (href: string) => {
        if (pathname === href) return true;
        if (href === "/dashboard" || href === "/admin/dashboard") return false;
        return pathname.startsWith(href);
    };

    return (
        <div className="relative h-full flex flex-col bg-[#0A0A0F] overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-violet-500/10 via-indigo-500/[0.04] to-transparent pointer-events-none" />
            <div className="absolute -top-32 -left-24 w-64 h-64 rounded-full bg-violet-500/20 blur-3xl pointer-events-none" />
            <div className="absolute bottom-40 -right-20 w-48 h-48 rounded-full bg-indigo-500/15 blur-3xl pointer-events-none" />
            <div className="absolute top-1/3 -left-10 w-32 h-32 rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />
            <div className="absolute inset-0 opacity-[0.03] [background-image:linear-gradient(to_right,rgba(255,255,255,0.4)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.4)_1px,transparent_1px)] [background-size:32px_32px] pointer-events-none" />

            <div className="relative flex-shrink-0 px-4 pt-5 pb-4 border-b border-white/[0.06]">
                    <div
                        className={`flex items-center ${
                            showLabels ? "justify-between" : "justify-center"
                        }`}
                    >
                        <Link
                            href="/"
                            className="flex items-center gap-3 group"
                        >
                            <div className="relative flex-shrink-0">
                                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 blur-lg opacity-60 group-hover:opacity-80 transition-opacity" />
                                <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 via-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/40 overflow-hidden group-hover:scale-105 transition-transform duration-300">
                                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/20" />
                                    <HiSparkles className="w-5 h-5 text-white relative z-10" />
                                </div>
                            </div>

                            <AnimatePresence mode="wait" initial={false}>
                                {showLabels && (
                                    <motion.div
                                        key="brand-text"
                                        initial={{ opacity: 0, width: 0 }}
                                        animate={{ opacity: 1, width: "auto" }}
                                        exit={{ opacity: 0, width: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="flex items-center gap-1.5">
                                            <h1 className="text-[15px] font-bold text-white tracking-tight leading-none whitespace-nowrap">
                                                AuraSpace
                                            </h1>
                                            <span
                                                className={`px-1.5 py-0.5 rounded-md bg-gradient-to-r ${currentRole.gradient} text-[8px] font-bold text-white tracking-wider uppercase whitespace-nowrap shadow-sm`}
                                            >
                                                {currentRole.label}
                                            </span>
                                        </div>
                                        <p className="text-[10px] text-white/40 font-medium mt-1 tracking-wider uppercase whitespace-nowrap">
                                            Dashboard
                                        </p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </Link>

                        {inDrawer && (
                            <button
                                onClick={onClose}
                                className="w-8 h-8 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/[0.06] transition-colors"
                                aria-label="Close menu"
                            >
                                <HiXMark className="w-5 h-5" />
                            </button>
                        )}
                    </div>

                    {!inDrawer && (
                        <button
                            onClick={onToggleMinimize}
                            className="mt-4 w-full h-8 rounded-lg flex items-center justify-center gap-1.5 text-xs font-semibold text-white/40 hover:text-violet-300 hover:bg-violet-500/10 border border-white/[0.04] hover:border-violet-500/20 transition-all"
                        >
                            <motion.div
                                animate={{ rotate: isMinimized ? 180 : 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <HiChevronLeft className="w-3.5 h-3.5" />
                            </motion.div>
                            <AnimatePresence mode="wait" initial={false}>
                                {showLabels && (
                                    <motion.span
                                        key="collapse-text"
                                        initial={{ opacity: 0, width: 0 }}
                                        animate={{ opacity: 1, width: "auto" }}
                                        exit={{ opacity: 0, width: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="overflow-hidden whitespace-nowrap"
                                    >
                                        Collapse
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </button>
                    )}
                </div>

                <div className="relative px-4 py-4 flex-shrink-0">
                    {showLabels ? (
                        <div className="relative group">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-violet-400 transition-colors">
                                <HiMagnifyingGlass className="w-4 h-4" />
                            </div>
                            <input
                                id="sidebar-search-input"
                                type="text"
                                value={searchQuery}
                                onChange={(e) => onSearchChange(e.target.value)}
                                placeholder="Search..."
                                className="w-full h-9 pl-9 pr-14 rounded-xl bg-white/[0.04] border border-white/[0.06] text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-violet-500/30 focus:bg-white/[0.06] focus:ring-2 focus:ring-violet-500/10 transition-all"
                            />
                        </div>
                    ) : (
                        <button
                            onClick={() => {
                                onToggleMinimize?.();
                                setTimeout(() => {
                                    document.getElementById("sidebar-search-input")?.focus();
                                }, 350);
                            }}
                            className="w-full h-9 rounded-xl bg-white/[0.04] hover:bg-violet-500/10 border border-white/[0.06] hover:border-violet-500/20 flex items-center justify-center text-white/40 hover:text-violet-300 transition-colors"
                            aria-label="Expand and search"
                        >
                            <HiMagnifyingGlass className="w-4 h-4" />
                        </button>
                    )}
                </div>

                <nav className="relative flex-1 overflow-y-auto overflow-x-hidden px-3 pb-2 [scrollbar-width:thin] [scrollbar-color:rgba(255,255,255,0.1)_transparent]">
                    {navSections.map((section, sectionIdx) => (
                        <div
                            key={section.section}
                            className={sectionIdx > 0 ? "mt-5" : ""}
                        >
                            <AnimatePresence mode="wait" initial={false}>
                                {showLabels && (
                                    <motion.div
                                        key={`section-${section.section}`}
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="flex items-center gap-2 px-3 mb-2">
                                            <p className="text-[10px] font-bold text-white/30 tracking-[0.15em] uppercase whitespace-nowrap">
                                                {section.section}
                                            </p>
                                            <div className="flex-1 h-px bg-gradient-to-r from-white/[0.08] to-transparent" />
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {!showLabels && sectionIdx > 0 && (
                                <div className="mx-3 my-3 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
                            )}

                            <ul className="flex flex-col gap-0.5">
                                {section.items.map((item) => {
                                    const active = isItemActive(item.href);
                                    const Icon = item.icon;
                                    return (
                                        <li key={`${section.section}-${item.label}`} className="relative group/item">
                                            <Link
                                                href={item.href}
                                                onClick={inDrawer ? onClose : undefined}
                                                className={`relative flex items-center rounded-xl transition-colors duration-200 ${
                                                    showLabels ? "gap-3 px-3 py-2.5" : "p-2.5 justify-center"
                                                } ${
                                                    active ? "text-white" : "text-white/60 hover:text-white hover:bg-white/[0.04]"
                                                }`}
                                            >
                                                {active && (
                                                    <motion.div
                                                        layoutId={inDrawer ? "activeMobile" : "activeDesktop"}
                                                        className="absolute inset-0 bg-gradient-to-r from-violet-500 to-indigo-500 rounded-xl shadow-lg shadow-violet-500/30"
                                                        transition={{ type: "spring", stiffness: 350, damping: 30 }}
                                                    />
                                                )}

                                                {active && (
                                                    <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none">
                                                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/20" />
                                                    </div>
                                                )}

                                                <div className="relative flex items-center justify-center flex-shrink-0 z-10">
                                                    <Icon className={`transition-colors duration-200 ${
                                                        showLabels ? "w-[18px] h-[18px]" : "w-5 h-5"
                                                    } ${
                                                        active ? "text-white" : "text-white/50 group-hover/item:text-violet-300"
                                                    }`} />
                                                </div>

                                                {showLabels && (
                                                    <span className="relative flex-1 text-left text-sm font-medium whitespace-nowrap truncate z-10">
                                                        {item.label}
                                                    </span>
                                                )}
                                            </Link>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    ))}
                </nav>

                <div className="relative flex-shrink-0 border-t border-white/[0.06]">
                    <div className="border-t border-white/[0.06] p-3">
                        <div className={`flex items-center rounded-xl bg-gradient-to-br from-violet-500/[0.08] to-indigo-500/[0.06] border border-violet-500/[0.15] backdrop-blur-sm ${
                            showLabels ? "gap-3 p-2.5" : "p-1.5 justify-center"
                        }`}>
                            <div className="relative flex-shrink-0">
                                {user?.image ? (
                                    <Image
                                        src={user.image}
                                        alt={user.name || "User"}
                                        width={36}
                                        height={36}
                                        className="w-9 h-9 rounded-xl object-cover ring-2 ring-white/10 shadow-md"
                                    />
                                ) : (
                                    <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${currentRole.gradient} flex items-center justify-center text-white text-sm font-bold shadow-md ring-2 ring-white/10 relative overflow-hidden`}>
                                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent to-white/20" />
                                        <span className="relative">{userInitial}</span>
                                    </div>
                                )}
                                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#0A0A0F]" />
                            </div>

                            {showLabels && (
                                <div className="flex-1 text-left min-w-0 overflow-hidden">
                                    <p className="text-sm font-semibold text-white truncate leading-tight">
                                        {user?.name || "User"}
                                    </p>
                                    <div className="flex items-center gap-1 mt-0.5">
                                        <span className="w-1 h-1 rounded-full bg-emerald-400" />
                                        <p className="text-[10px] text-white/50 truncate leading-tight capitalize">
                                            {currentRole.label} · Online
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

const DashboardSidebar = ({ user, isOpen, onClose }: DashboardSidebarProps) => {
    const pathname = usePathname();
    const router = useRouter();
    const [isMinimized, setIsMinimized] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const rawRole = user?.role ?? "user";
    const role: RoleKey =
        rawRole === "host" || rawRole === "admin" ? rawRole : "user";

    const navSections = NAV_LINKS[role];
    const currentRole = roleConfig[role];

    const handleLogout = async () => {
        if (isLoggingOut) return;
        setIsLoggingOut(true);
        try {
            await authClient.signOut({
                fetchOptions: {
                    onSuccess: () => {
                        router.push("/login");
                    },
                    onError: () => {
                        router.push("/login");
                    },
                },
            });
        } catch {
            router.push("/login");
        } finally {
            setIsLoggingOut(false);
        }
    };

    const toggleMinimize = () => setIsMinimized((prev) => !prev);

    const filteredSections = searchQuery.trim()
        ? navSections
              .map((section) => ({
                  ...section,
                  items: section.items.filter((item) =>
                      item.label.toLowerCase().includes(searchQuery.toLowerCase().trim())
                  ),
              }))
              .filter((section) => section.items.length > 0)
        : navSections;

    const sidebarProps = {
        user,
        role,
        currentRole,
        navSections: filteredSections,
        isMinimized,
        isLoggingOut,
        pathname,
        router,
        handleLogout,
        onToggleMinimize: toggleMinimize,
        searchQuery,
        onSearchChange: setSearchQuery,
    };

    return (
        <>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/70 backdrop-blur-md z-40 lg:hidden"
                    />
                )}
            </AnimatePresence>

            <motion.aside
                animate={{ width: isMinimized ? 76 : 272 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="hidden lg:flex fixed top-0 left-0 h-screen border-r border-white/[0.06] z-30 shadow-[0_0_60px_-12px_rgba(139,92,246,0.15)]"
            >
                <SidebarInner {...sidebarProps} />
            </motion.aside>

            <AnimatePresence>
                {isOpen && (
                    <motion.aside
                        initial={{ x: "-100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "-100%" }}
                        transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 30,
                        }}
                        className="lg:hidden fixed top-0 left-0 h-full w-[300px] max-w-[85vw] z-50 shadow-2xl shadow-black/50"
                    >
                        <SidebarInner {...sidebarProps} inDrawer onClose={onClose} />
                    </motion.aside>
                )}
            </AnimatePresence>
        </>
    );
};

export default DashboardSidebar;
