"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export const getUsersList = async () => {
    const users = await auth.api.listUsers({
        query: {
            sortBy: "createdAt",
            sortDirection: "desc",
        },
        headers: await headers(),
    });
    return users;
};