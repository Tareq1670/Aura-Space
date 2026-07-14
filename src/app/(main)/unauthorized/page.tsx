import Link from "next/link";

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
                        className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-indigo-500 text-white font-medium hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
                    >
                        Go Home
                    </Link>
                    <Link
                        href="/contact"
                        className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-all duration-200"
                    >
                        Contact Support
                    </Link>
                </div>
            </div>
        </div>
    );
}
