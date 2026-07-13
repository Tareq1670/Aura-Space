import { authClient } from "@/lib/auth-client";

const SERVER_URL =
    process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

async function getAuthToken(): Promise<string> {
    const { data } = await authClient.token();
    if (!data?.token) throw new Error("Login required.");
    return data.token;
}

async function apiFetch<T>(
    endpoint: string,
    options: RequestInit = {},
): Promise<T> {
    const token = await getAuthToken();

    const res = await fetch(`${SERVER_URL}${endpoint}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
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
        apiFetch<{ success: boolean; data: any }>("/api/users/profile"),

    updateProfile: (body: { name?: string; image?: string }) =>
        apiFetch<{ success: boolean; data: any }>("/api/users/profile", {
            method: "PUT",
            body: JSON.stringify(body),
        }),

    updateProfileImage: (imageUrl: string) =>
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
