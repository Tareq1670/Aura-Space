import { getSessions } from "@/lib/get-session";
import Link from "next/link";

export const dynamic = "force-dynamic";

const quickLinks = [
    { label: "Browse Spaces", href: "/spaces", color: "from-violet-500 to-purple-600" },
    { label: "My Bookings", href: "/dashboard/guest/bookings", color: "from-blue-500 to-indigo-600" },
    { label: "Wishlist", href: "/dashboard/guest/wishlist", color: "from-rose-500 to-pink-600" },
    { label: "My Reviews", href: "/dashboard/guest/reviews", color: "from-emerald-500 to-teal-600" },
    { label: "Transactions", href: "/dashboard/guest/transactions", color: "from-amber-500 to-orange-600" },
    { label: "Profile", href: "/dashboard/guest/profile", color: "from-cyan-500 to-sky-600" },
];

export default async function GuestMainPage() {
    const session = await getSessions();

    return (
        <div className="p-6 lg:p-8 space-y-8">
            <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                    Welcome back, {session?.user.name}
                </h1>
                <p className="text-gray-500 mt-1">Find your perfect space</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {quickLinks.map((link) => (
                    <Link
                        key={link.href}
                        href={link.href}
                        className={`rounded-xl bg-gradient-to-br ${link.color} p-5 text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200`}
                    >
                        <h3 className="font-semibold text-lg">{link.label}</h3>
                        <p className="text-white/70 text-sm mt-1">Click to explore</p>
                    </Link>
                ))}
            </div>
        </div>
    );
}
