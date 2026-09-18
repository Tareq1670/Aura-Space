"use client";

import { useEffect } from "react";
import Button from "@/Components/ui/Button";

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
                <Button variant="primary" size="lg" onClick={reset}>
                    Try Again
                </Button>
            </div>
        </div>
    );
}
