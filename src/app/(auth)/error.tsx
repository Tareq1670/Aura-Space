"use client";

import { useEffect } from "react";
import Button from "@/Components/ui/Button";

export default function AuthErrorPage({
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
                <h1 className="mb-2 text-2xl font-bold text-gray-900">Authentication error</h1>
                <p className="mb-6 text-gray-500">An unexpected error occurred. Please try again.</p>
                <Button variant="primary" size="lg" onClick={reset}>
                    Try Again
                </Button>
            </div>
        </div>
    );
}
