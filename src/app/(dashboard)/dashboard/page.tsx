import { redirect } from "next/navigation";
import { requireAuth } from "@/lib/route-guards";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
    const session = await requireAuth();

    if (session.user.role === "admin") {
        redirect("/dashboard/admin/main");
    }

    if (session.user.role === "host") {
        redirect("/dashboard/host/main");
    }

    redirect("/dashboard/guest/main");
}