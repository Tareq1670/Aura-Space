import type { Metadata } from "next";
import { ReactNode } from "react";
import { requireGuest } from "@/lib/route-guards";

export const metadata: Metadata = {
  title: "Guest Dashboard",
  description: "Manage your bookings, messages, reviews, wishlist, and account settings on AuraSpace.",
};

export const dynamic = "force-dynamic";

export default async function GuestLayout({
    children,
}: {
    children: ReactNode;
}) {
    await requireGuest();
    return <>{children}</>;
}