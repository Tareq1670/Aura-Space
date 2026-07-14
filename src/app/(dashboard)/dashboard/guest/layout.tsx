import { ReactNode } from "react";
import { requireGuest } from "../../../../../route-guards";

export default async function GuestLayout({
    children,
}: {
    children: ReactNode;
}) {
    await requireGuest();
    return <>{children}</>;
}