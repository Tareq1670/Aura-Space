import { apiClientFetch } from "@/lib/client-fetch";

export const userAPI = {
    getProfile: () =>
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        apiClientFetch<{ success: boolean; data: any }>("/api/users/profile"),

    updateProfile: (body: { name?: string; image?: string }) =>
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        apiClientFetch<{ success: boolean; data: any }>("/api/users/profile", {
            method: "PUT",
            body: JSON.stringify(body),
        }),

    updateProfileImage: (imageUrl: string) =>
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        apiClientFetch<{ success: boolean; data: any }>("/api/users/profile-image", {
            method: "PUT",
            body: JSON.stringify({ imageUrl }),
        }),

    changePassword: (body: {
        currentPassword: string;
        newPassword: string;
        confirmNewPassword: string;
    }) =>
        apiClientFetch<{ success: boolean; message: string }>(
            "/api/users/change-password",
            {
                method: "PUT",
                body: JSON.stringify(body),
            },
        ),

    deleteAccount: (password: string) =>
        apiClientFetch<{ success: boolean; message: string }>("/api/users/account", {
            method: "DELETE",
            body: JSON.stringify({ password }),
        }),
};