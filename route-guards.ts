import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

// ✅ Optional Auth - session থাকলে return করবে, না থাকলে null
export async function getOptionalAuth() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    return session;
}

// ✅ Required Auth - session না থাকলে login এ redirect
export async function requireAuth() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user) {
        redirect("/login");
    }

    return session;
}

// ✅ Admin Only
export async function requireAdmin() {
    const session = await requireAuth();

    if (session.user.role !== "admin") {
        redirect("/unauthorized");
    }

    return session;
}

// ✅ Host or Admin
export async function requireHost() {
    const session = await requireAuth();

    if (session.user.role !== "host" && session.user.role !== "admin") {
        redirect("/unauthorized");
    }

    return session;
}

// ✅ Guest Only (if needed)
export async function requireGuest() {
    const session = await requireAuth();

    if (session.user.role !== "guest") {
        redirect("/unauthorized");
    }

    return session;
}

// ✅ Any authenticated user
export async function requireAnyRole() {
    const session = await requireAuth();
    return session;
}