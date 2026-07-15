import { redirect } from "next/navigation";
import { requireAuth } from "@/lib/route-guards";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
    const session = await requireAuth();

    const role = (session.user as Record<string, unknown>).role as string;

    if (role === "admin") {
        redirect("/dashboard/admin/main");
    }

    if (role === "host") {
        redirect("/dashboard/host/main");
    }

    redirect("/dashboard/guest/main");
}