import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export async function requireAuth() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

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

    if (session.user.role !== "host" && session.user.role !== "admin") {
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