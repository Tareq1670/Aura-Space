import type { Metadata } from "next";
import Link from "next/link";
import { buttonClasses } from "@/Components/ui/Button";

export const metadata: Metadata = {
  title: "Access Denied",
  description: "You don't have permission to access this page. If you believe this is a mistake, please contact support.",
};

export default function UnauthorizedPage() {
    return (
        <div className="min-h-[95vh] flex items-center justify-center p-6">
            <div className="text-center max-w-md">
                <div className="text-7xl mb-4">🔒</div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
                <p className="text-gray-500 mb-6">
                    You don&apos;t have permission to access this area. If you believe this is a mistake, please contact support.
                </p>
                <div className="flex gap-3 justify-center">
                    <Link
                        href="/"
                        className={buttonClasses({ variant: "primary", size: "md" })}
                    >
                        Go Home
                    </Link>
                    <Link
                        href="/contact"
                        className={buttonClasses({ variant: "secondary", size: "md" })}
                    >
                        Contact Support
                    </Link>
                </div>
            </div>
        </div>
    );
}
