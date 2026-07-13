// lib/auth-middleware.ts
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function authMiddleware() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user) {
        return {
            success: false,
            error: "Unauthorized. Please login again.",
            status: 401,
        };
    }

    return {
        success: true,
        user: session.user,
        session,
    };
}