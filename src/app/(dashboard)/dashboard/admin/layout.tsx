import { ReactNode } from "react";
import { requireAdmin } from "../../../../../route-guards";

export default async function AdminLayout({
    children,
}: {
    children: ReactNode;
}) {
    await requireAdmin();
    return <>{children}</>;
}