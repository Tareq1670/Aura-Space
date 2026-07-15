"use server";

export async function validatePasswordServer(password: string): Promise<{ valid: boolean; error?: string }> {
    if (!password || password.length < 8) return { valid: false, error: "Password must be at least 8 characters." };
    if (!/[A-Z]/.test(password)) return { valid: false, error: "Password must have at least one uppercase letter." };
    if (!/[0-9]/.test(password)) return { valid: false, error: "Password must have at least one number." };
    return { valid: true };
}
