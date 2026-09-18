import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export interface BetterAuthServerUser {
    id: string;
    name?: string;
    email?: string;
    role?: string;
}

export interface BetterAuthApi {
    getToken: (args: { headers: Headers }) => Promise<{ token?: string }>;
    getSession: (
        args: { headers: Headers }
    ) => Promise<{ user: BetterAuthServerUser | null } | null>;
}

export const authApi = auth.api as unknown as BetterAuthApi;

export function getApiBase(): string {
    const raw = process.env.NEXT_PUBLIC_SERVER_URL ||
                process.env.NEXT_PUBLIC_API_URL ||
                "http://localhost:5000";
    const base = raw.replace(/\/$/, "");
    if (base.endsWith("/api")) return base;
    return `${base}/api`;
}

export async function getSessionToken(): Promise<string> {
    const headersList = await headers();
    const tokenResponse = await authApi.getToken({ headers: headersList });
    if (tokenResponse?.token) {
        return tokenResponse.token;
    }
    throw new Error("No session token found. Please login again.");
}

export async function getAuthHeaders(): Promise<Record<string, string>> {
    const token = await getSessionToken();
    return {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
    };
}
