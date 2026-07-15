"use client";

import { motion } from "framer-motion";

export default function AdminHostsPage() {
    return (
        <div className="flex min-h-[60vh] items-center justify-center px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center"
            >
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-purple-100">
                    <svg className="h-10 w-10 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                    </svg>
                </div>
                <h1 className="text-2xl font-black text-slate-900">Manage Hosts</h1>
                <p className="mt-2 text-sm text-slate-500 max-w-md">
                    A comprehensive host management panel is on its way. Review, verify, and manage hosts from one place.
                </p>
            </motion.div>
        </div>
    );
}
