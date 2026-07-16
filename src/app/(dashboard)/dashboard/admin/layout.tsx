import type { Metadata } from "next";
import { ReactNode } from "react";
import { requireAdmin } from "@/lib/route-guards";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Manage users, properties, bookings, revenue, and platform settings on AuraSpace.",
};

export const dynamic = "force-dynamic";

export default async function AdminLayout({
    children,
}: {
    children: ReactNode;
}) {
    await requireAdmin();
    return <>{children}</>;
}