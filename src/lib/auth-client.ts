// lib/auth-client.ts
import { createAuthClient } from "better-auth/react";
import {
    jwtClient,
    adminClient,
    inferAdditionalFields,
} from "better-auth/client/plugins";
import type { auth } from "./auth";

// ✅ Fix: সঠিক baseURL - NEXT_PUBLIC_ prefix ছাড়া
// client-side এ access করতে NEXT_PUBLIC_ লাগবে
function getBaseURL(): string {
    // Client-side: NEXT_PUBLIC_ variable
    if (typeof window !== "undefined") {
        return (
            process.env.NEXT_PUBLIC_BETTER_AUTH_URL ||
            window.location.origin
        );
    }
    // Server-side
    return (
        process.env.BETTER_AUTH_URL ||
        process.env.NEXT_PUBLIC_BETTER_AUTH_URL ||
        "http://localhost:3000"
    );
}

export const authClient = createAuthClient({
    baseURL: getBaseURL(),
    plugins: [
        jwtClient(),
        adminClient(),
        inferAdditionalFields<typeof auth>(),
    ],
    // ✅ Fix: fetch options for cross-origin
    fetchOptions: {
        credentials: "include", // Cookie পাঠানোর জন্য
    },
});

export const { signIn, signUp, signOut, useSession, getSession } = authClient;