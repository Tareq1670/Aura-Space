import { createAuthClient } from "better-auth/react";
import {
    jwtClient,
    adminClient,
    inferAdditionalFields,
} from "better-auth/client/plugins";
import type { auth } from "./auth";

function getBaseURL(): string {
    if (typeof window !== "undefined") {
        return (
            process.env.NEXT_PUBLIC_BETTER_AUTH_URL ||
            window.location.origin
        );
    }

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
    fetchOptions: {
        credentials: "include",
    },
});

export const { signIn, signUp, signOut, useSession, getSession } = authClient;