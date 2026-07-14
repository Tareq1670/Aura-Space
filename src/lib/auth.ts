import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { admin, jwt } from "better-auth/plugins";
import { cookies } from "next/headers";

declare global {
    var _mongoAuthClient: MongoClient | undefined;
}

function getMongoClient(): MongoClient {
    const uri = process.env.MONGODB_URI;

    if (!uri) {
        throw new Error("MONGODB_URI environment variable is not set.");
    }

    if (process.env.NODE_ENV !== "production") {
        if (!global._mongoAuthClient) {
            global._mongoAuthClient = new MongoClient(uri, {
                maxPoolSize: 10,
                serverSelectionTimeoutMS: 5000,
                socketTimeoutMS: 45000,
            });
        }
        return global._mongoAuthClient;
    }

    return new MongoClient(uri, {
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
    });
}

const client = getMongoClient();
const db = client.db(process.env.DB_NAME || "StayEase");

const allowedOrigins = [
    "http://localhost:3000",
    "http://localhost:5000",
    process.env.BETTER_AUTH_URL,
    process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
    process.env.FRONTEND_URL,
    process.env.CLIENT_URL,
    "https://aura-space-ochre.vercel.app",
    "https://aura-space-atgv.vercel.app",
    "https://aura-space-server.vercel.app",
].filter(Boolean) as string[];

export const auth = betterAuth({
    database: mongodbAdapter(db, { client }),
    baseURL:
        process.env.BETTER_AUTH_URL ||
        process.env.NEXT_PUBLIC_BETTER_AUTH_URL ||
        "http://localhost:3000",
    secret: process.env.BETTER_AUTH_SECRET,
    trustedOrigins: allowedOrigins,
    emailAndPassword: {
        enabled: true,
        autoSignIn: false,
    },
    session: {
        cookieCache: {
            enabled: false,
        },
        expiresIn: 60 * 60 * 24 * 30,
        updateAge: 60 * 60 * 24,
    },
    advanced: {
        useSecureCookies: process.env.NODE_ENV === "production",
        crossSubDomainCookies: {
            enabled: false,
        },
        defaultCookieAttributes: {
            secure: process.env.NODE_ENV === "production",
            httpOnly: true,
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            path: "/",
        },
    },
    plugins: [
        admin({
            defaultRole: "guest",
            adminRoles: ["admin"],
        }),
        jwt({
            jwt: {
                expirationTime: "7d",
            },
        }),
    ],
    user: {
        additionalFields: {
            phone: {
                type: "string",
                required: false,
                input: true,
            },
            address: {
                type: "string",
                required: false,
                input: true,
            },
            dob: {
                type: "string",
                required: false,
                input: true,
            },
        },
    },
    databaseHooks: {
        user: {
            create: {
                before: async (user) => {
                    let role = "guest";

                    try {
                        const cookieStore = await cookies();
                        const pendingRole =
                            cookieStore.get("pending_role")?.value;

                        if (
                            pendingRole &&
                            ["guest", "host"].includes(pendingRole)
                        ) {
                            role = pendingRole;
                        }
                    } catch {}

                    return {
                        data: {
                            ...user,
                            role,
                        },
                    };
                },
            },
        },
    },
});