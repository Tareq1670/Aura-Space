import { ReactNode } from "react";
import { requireGuest } from "@/lib/route-guards";

export const dynamic = "force-dynamic";

export default async function GuestLayout({
    children,
}: {
    children: ReactNode;
}) {
    await requireGuest();
    return <>{children}</>;
}