import { authClient } from "@/lib/auth-client";

export function getApiBaseClient(): string {
    const raw = process.env.NEXT_PUBLIC_SERVER_URL ||
        process.env.NEXT_PUBLIC_API_URL ||
        "http://localhost:5000";
    const base = raw.replace(/\/$/, "");
    if (base.endsWith("/api")) return base;
    return base;
}

export async function getClientToken(): Promise<string> {
    const { data } = await authClient.token();
    if (!data?.token) throw new Error("Login required.");
    return data.token;
}

export async function apiClientFetch<T>(
    endpoint: string,
    options: RequestInit = {},
): Promise<T> {
    const token = await getClientToken();
    const isFormData = options.body instanceof FormData;
    const res = await fetch(`${getApiBaseClient()}${endpoint}`, {
        ...options,
        headers: {
            ...(isFormData ? {} : { "Content-Type": "application/json" }),
            Authorization: `Bearer ${token}`,
            ...options.headers,
        },
    });
    const contentType = res.headers.get("content-type") || "";
    const isJson = contentType.includes("application/json");
    const body = isJson ? await res.json() : await res.text();
    if (!res.ok) {
        const message = isJson
            ? (body.message || body.error || "Something went wrong.")
            : `HTTP ${res.status}`;
        throw new Error(message);
    }
    return body as T;
}
