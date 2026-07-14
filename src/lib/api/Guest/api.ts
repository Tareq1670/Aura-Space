import { authClient } from "@/lib/auth-client";

const SERVER_URL =
    process.env.NEXT_PUBLIC_SERVER_URL ||
    (typeof window !== "undefined"
        ? window.location.origin.includes("localhost")
            ? "http://localhost:5000"
            : "https://aura-space-server.vercel.app"
        : "http://localhost:5000");

async function getAuthToken(): Promise<string> {
    try {
        const { data } = await authClient.token();
        if (data?.token) return data.token;
        throw new Error("No token from authClient.token()");
    } catch (err) {
        console.error("[getAuthToken] failed:", err);
        throw new Error("Login required.");
    }
}

async function apiFetch<T>(
    endpoint: string,
    options: RequestInit = {},
): Promise<T> {
    const token = await getAuthToken();

    const isFormData = options.body instanceof FormData;

    const res = await fetch(`${SERVER_URL}${endpoint}`, {
        ...options,
        headers: {
            ...(isFormData ? {} : { "Content-Type": "application/json" }),
            Authorization: `Bearer ${token}`,
            ...options.headers,
        },
    });

    const json = await res.json();

    if (!res.ok) {
        throw new Error(json.message || "Something went wrong.");
    }

    return json;
}

export const userAPI = {
    getProfile: () =>
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        apiFetch<{ success: boolean; data: any }>("/api/users/profile"),

    updateProfile: (body: { name?: string; image?: string }) =>
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        apiFetch<{ success: boolean; data: any }>("/api/users/profile", {
            method: "PUT",
            body: JSON.stringify(body),
        }),

    updateProfileImage: (imageUrl: string) =>
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        apiFetch<{ success: boolean; data: any }>("/api/users/profile-image", {
            method: "PUT",
            body: JSON.stringify({ imageUrl }),
        }),

    changePassword: (body: {
        currentPassword: string;
        newPassword: string;
        confirmNewPassword: string;
    }) =>
        apiFetch<{ success: boolean; message: string }>(
            "/api/users/change-password",
            {
                method: "PUT",
                body: JSON.stringify(body),
            },
        ),

    deleteAccount: (password: string) =>
        apiFetch<{ success: boolean; message: string }>("/api/users/account", {
            method: "DELETE",
            body: JSON.stringify({ password }),
        }),
};