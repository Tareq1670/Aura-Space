import type { Metadata } from "next";
import { ReactNode } from "react";
import { requireHost } from "@/lib/route-guards";

export const metadata: Metadata = {
  title: "Host Dashboard",
  description: "Manage your listings, reservations, earnings, reviews, and account settings on AuraSpace.",
};

export const dynamic = "force-dynamic";

export default async function HostLayout({
    children,
}: {
    children: ReactNode;
}) {
    await requireHost();
    return <>{children}</>;
}