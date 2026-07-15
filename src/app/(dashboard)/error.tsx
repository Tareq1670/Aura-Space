"use client";

import { useEffect } from "react";

export default function DashboardErrorPage({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="flex min-h-[60vh] items-center justify-center p-6">
            <div className="max-w-md text-center">
                <div className="mb-4 text-6xl">⚠️</div>
                <h1 className="mb-2 text-2xl font-bold text-gray-900">Dashboard error</h1>
                <p className="mb-6 text-gray-500">An unexpected error occurred. Please try again.</p>
                <button
                    onClick={reset}
                    className="cursor-pointer rounded-xl bg-gradient-to-r from-violet-500 to-indigo-500 px-6 py-3 font-medium text-white shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl"
                >
                    Try Again
                </button>
            </div>
        </div>
    );
}
