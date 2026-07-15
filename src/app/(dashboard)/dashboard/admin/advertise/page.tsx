"use client";

import { motion } from "framer-motion";

export default function AdminAdvertisePage() {
    return (
        <div className="flex min-h-[60vh] items-center justify-center px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center"
            >
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-amber-100">
                    <svg className="h-10 w-10 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 110-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38a.551.551 0 01-.828-.441 15.396 15.396 0 01-.256-4.478m.256-4.478c-.254-.962-.584-1.892-.985-2.783a1.137 1.137 0 01.463-1.511l.657-.38a.55.55 0 01.828.441 15.402 15.402 0 01.256 4.478m0 0h4.23a3 3 0 00.933-.16l3.187-1.063A1.5 1.5 0 0121 8.61V12a1.5 1.5 0 01-1.35 1.473l-3.187 1.063a3 3 0 01-.933.16H10.34" />
                    </svg>
                </div>
                <h1 className="text-2xl font-black text-slate-900">Advertisements</h1>
                <p className="mt-2 text-sm text-slate-500 max-w-md">
                    The advertising management dashboard is coming soon. Manage campaigns, placements, and billing.
                </p>
            </motion.div>
        </div>
    );
}
