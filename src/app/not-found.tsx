import Link from "next/link";

export default function NotFoundPage() {
    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-gray-50 via-white to-violet-50/40">
            <div className="text-center max-w-md">
                <div className="text-8xl mb-4 font-bold bg-gradient-to-r from-violet-500 to-indigo-500 bg-clip-text text-transparent">
                    404
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Page Not Found</h1>
                <p className="text-gray-500 mb-6">
                    The page you&apos;re looking for doesn&apos;t exist or has been moved.
                </p>
                <Link
                    href="/"
                    className="inline-block px-6 py-3 rounded-xl bg-gradient-to-r from-violet-500 to-indigo-500 text-white font-medium hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
                >
                    Go Home
                </Link>
            </div>
        </div>
    );
}
