import { getSessions } from "@/lib/get-session";
import Link from "next/link";

export const dynamic = "force-dynamic";

const quickLinks = [
    { label: "Manage Users", href: "/dashboard/admin/users", color: "from-violet-500 to-purple-600" },
    { label: "Manage Properties", href: "/dashboard/admin/properties", color: "from-blue-500 to-indigo-600" },
    { label: "All Bookings", href: "/dashboard/admin/bookings", color: "from-emerald-500 to-teal-600" },
    { label: "Revenue", href: "/dashboard/admin/revenue", color: "from-amber-500 to-orange-600" },
    { label: "Transactions", href: "/dashboard/admin/transactions", color: "from-rose-500 to-pink-600" },
    { label: "Reviews", href: "/dashboard/admin/reviews", color: "from-cyan-500 to-sky-600" },
];

export default async function AdminMainPage() {
    const session = await getSessions();

    return (
        <div className="p-6 lg:p-8 space-y-8">
            <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                    Welcome back, {session?.user.name}
                </h1>
                <p className="text-gray-500 mt-1">Admin Dashboard — manage your platform</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {quickLinks.map((link) => (
                    <Link
                        key={link.href}
                        href={link.href}
                        className={`rounded-xl bg-gradient-to-br ${link.color} p-5 text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200`}
                    >
                        <h3 className="font-semibold text-lg">{link.label}</h3>
                        <p className="text-white/70 text-sm mt-1">Click to manage</p>
                    </Link>
                ))}
            </div>
        </div>
    );
}
