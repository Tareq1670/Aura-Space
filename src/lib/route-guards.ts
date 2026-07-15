import { cache } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export const getServerSession = cache(async () => {
    return await auth.api.getSession({
        headers: await headers(),
    });
});

export async function getOptionalAuth() {
    return await getServerSession();
}

export async function requireAuth() {
    const session = await getServerSession();

    if (!session?.user) {
        redirect("/login");
    }

    return session;
}

export async function requireAdmin() {
    const session = await requireAuth();

    if (session.user.role !== "admin") {
        redirect("/unauthorized");
    }

    return session;
}

export async function requireHost() {
    const session = await requireAuth();

    if (session.user.role !== "host") {
        redirect("/unauthorized");
    }

    return session;
}

export async function requireGuest() {
    const session = await requireAuth();

    if (session.user.role !== "guest") {
        redirect("/unauthorized");
    }

    return session;
}

export async function requireAnyRole() {
    return await requireAuth();
}

export async function requireRole(allowedRoles: string[]) {
    const session = await requireAuth();
    const role = session.user.role ?? "";

    if (!allowedRoles.includes(role)) {
        redirect("/unauthorized");
    }

    return session;
}
