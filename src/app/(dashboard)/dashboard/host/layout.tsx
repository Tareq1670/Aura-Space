import { ReactNode } from "react";
import { requireHost } from "@/lib/route-guards";

export const dynamic = "force-dynamic";

export default async function HostLayout({
    children,
}: {
    children: ReactNode;
}) {
    await requireHost();
    return <>{children}</>;
}