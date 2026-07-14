"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { HiBars3, HiBell, HiSparkles } from "react-icons/hi2";
import Image from "next/image";
import DashboardSidebar from "@/Components/Dashboard/Sidebar";
import { authClient } from "@/lib/auth-client";

const pageVariants: Variants = {
    initial: {
        opacity: 0,
        y: 20,
        filter: "blur(6px)",
    },
    animate: {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        transition: {
            duration: 0.45,
            ease: [0.22, 1, 0.36, 1],
        },
    },
    exit: {
        opacity: 0,
        y: -15,
        filter: "blur(4px)",
        transition: {
            duration: 0.3,
            ease: [0.22, 1, 0.36, 1],
        },
    },
};

const pulseRing: Variants = {
    animate: {
        scale: [1, 1.4, 1],
        opacity: [0.5, 0, 0.5],
        transition: {
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
        },
    },
};

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
    const pathname = usePathname();
    const router = useRouter();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { data, isPending } = authClient.useSession();

    const sessionUser = data?.user;

    useEffect(() => {
        if (!isPending && !sessionUser) {
            const currentPath = `${window.location.pathname}${window.location.search}`;
            router.replace(
                `/login?redirect=${encodeURIComponent(currentPath)}`,
            );
        }
    }, [sessionUser, isPending, router]);

    const prevPath = useRef(pathname);
    useEffect(() => {
        if (prevPath.current !== pathname) {
            setSidebarOpen(false);
            prevPath.current = pathname;
        }
    }, [pathname]);

    useEffect(() => {
        document.body.style.overflow = sidebarOpen ? "hidden" : "";
        return () => {
            document.body.style.overflow = "";
        };
    }, [sidebarOpen]);

    const user = sessionUser
        ? {
              id: sessionUser.id,
              name: sessionUser.name,
              email: sessionUser.email,
              emailVerified: sessionUser.emailVerified,
              image: sessionUser.image ?? null,
              role: (sessionUser as { role?: string | null }).role ?? "guest",
              createdAt: sessionUser.createdAt,
              updatedAt: sessionUser.updatedAt,
          }
        : null;

    const roleLabel =
        user?.role === "host"
            ? "Host"
            : user?.role === "admin"
              ? "Admin"
              : "Guest";

    if (isPending) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-violet-50/40">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="flex flex-col items-center gap-5"
                >
                    <div className="relative">
                        <motion.div
                            variants={pulseRing}
                            animate="animate"
                            className="absolute inset-0 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600"
                        />
                        <motion.div
                            initial={{ scale: 0, rotate: 0 }}
                            animate={{ scale: 1, rotate: 360 }}
                            transition={{
                                scale: {
                                    duration: 0.5,
                                    ease: [0.22, 1, 0.36, 1],
                                },
                                rotate: {
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "linear",
                                },
                            }}
                            className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 via-indigo-500 to-purple-600 flex items-center justify-center shadow-2xl shadow-violet-500/30"
                        >
                            <HiSparkles className="w-7 h-7 text-white" />
                        </motion.div>
                    </div>
                    <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.4 }}
                        className="flex items-center gap-1"
                    >
                        <span className="text-sm font-semibold text-gray-600">
                            Loading your dashboard
                        </span>
                        {[0, 1, 2].map((i) => (
                            <motion.span
                                key={i}
                                animate={{
                                    opacity: [0.3, 1, 0.3],
                                    y: [0, -4, 0],
                                }}
                                transition={{
                                    duration: 1.2,
                                    repeat: Infinity,
                                    delay: i * 0.15,
                                    ease: "easeInOut",
                                }}
                                className="text-sm font-semibold text-violet-500"
                            >
                                .
                            </motion.span>
                        ))}
                    </motion.div>
                </motion.div>
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-violet-50/40">
            <DashboardSidebar
                user={user}
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            <div className="lg:ml-[272px] transition-[margin] duration-300 ease-out">
                <motion.header
                    initial={{ y: -60, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="lg:hidden sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-gray-100 px-4 py-3 shadow-sm"
                >
                    <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                            <motion.button
                                onClick={() => setSidebarOpen(true)}
                                whileTap={{ scale: 0.9 }}
                                className="w-10 h-10 rounded-xl bg-white border border-gray-200 shadow-sm flex items-center justify-center text-gray-700 hover:bg-gray-50 hover:border-violet-200 hover:text-violet-600 transition-colors"
                                aria-label="Open menu"
                            >
                                <HiBars3 className="w-5 h-5" />
                            </motion.button>

                            <Link href="/" className="flex items-center gap-2">
                                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 via-indigo-500 to-purple-600 flex items-center justify-center shadow-md shadow-violet-500/30">
                                    <HiSparkles className="w-4 h-4 text-white" />
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <span className="text-base font-bold text-gray-900 tracking-tight">
                                        AuraSpace
                                    </span>
                                    <span className="px-1.5 py-0.5 rounded-md bg-gradient-to-r from-violet-500 to-indigo-500 text-[8px] font-bold text-white uppercase">
                                        {roleLabel}
                                    </span>
                                </div>
                            </Link>
                        </div>

                        <div className="flex items-center gap-2">
                            <button className="relative w-10 h-10 rounded-xl bg-white border border-gray-200 shadow-sm flex items-center justify-center text-gray-700 hover:bg-gray-50 hover:text-violet-600 transition-colors">
                                <HiBell className="w-4 h-4" />
                                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white" />
                            </button>

                            <button
                                onClick={() => setSidebarOpen(true)}
                                className="relative"
                            >
                                {user.image ? (
                                    <Image
                                        width={40}
                                        height={40}
                                        src={user.image}
                                        alt={user.name || "User"}
                                        className="w-10 h-10 rounded-xl object-cover ring-2 ring-white shadow-md"
                                    />
                                ) : (
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center text-white font-bold text-sm shadow-md ring-2 ring-white">
                                        {user.name?.charAt(0).toUpperCase() ||
                                            "U"}
                                    </div>
                                )}
                                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-white" />
                            </button>
                        </div>
                    </div>
                </motion.header>

                <AnimatePresence mode="wait">
                    <motion.main
                        key={pathname}
                        variants={pageVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        className="min-h-[calc(100vh-64px)] lg:min-h-screen"
                    >
                        {children}
                    </motion.main>
                </AnimatePresence>
            </div>
        </div>
    );
};

export default DashboardLayout;