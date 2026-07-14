"use client";

import { useEffect } from "react";

export default function ErrorPage({
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
        <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-gray-50 via-white to-violet-50/40">
            <div className="text-center max-w-md">
                <div className="text-7xl mb-4">⚠️</div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h1>
                <p className="text-gray-500 mb-6">
                    An unexpected error occurred. Please try again.
                </p>
                <button
                    onClick={reset}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-violet-500 to-indigo-500 text-white font-medium hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
                >
                    Try Again
                </button>
            </div>
        </div>
    );
}
