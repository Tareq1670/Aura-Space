import { ReactNode } from "react";
import { requireHost } from "../../../../../route-guards";

export default async function HostLayout({
    children,
}: {
    children: ReactNode;
}) {
    await requireHost();
    return <>{children}</>;
}