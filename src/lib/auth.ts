// lib/auth.ts
import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { admin, jwt } from "better-auth/plugins";
import { cookies } from "next/headers";

// ============================================================
// ✅ Fix: Serverless-safe MongoDB connection (connection pooling)
// Vercel serverless functions এ প্রতি request এ নতুন connection
// তৈরি হয় - global cache ছাড়া MongoDB Atlas connection limit
// শেষ হয়ে যায়
// ============================================================

declare global {
    // eslint-disable-next-line no-var
    var _mongoAuthClient: MongoClient | undefined;
}

function getMongoClient(): MongoClient {
    const uri = process.env.MONGODB_URI;

    if (!uri) {
        throw new Error(
            "MONGODB_URI environment variable is not set. " +
            "Please add it to your Vercel environment variables."
        );
    }

    // ✅ Reuse existing connection in development (hot reload safe)
    // ✅ Create new connection in production per cold start
    if (process.env.NODE_ENV === "development") {
        if (!global._mongoAuthClient) {
            global._mongoAuthClient = new MongoClient(uri, {
                maxPoolSize: 10,
                serverSelectionTimeoutMS: 5000,
                socketTimeoutMS: 45000,
            });
        }
        return global._mongoAuthClient;
    }

    // Production: create new client per serverless instance
    return new MongoClient(uri, {
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
    });
}

const client = getMongoClient();
const db = client.db(process.env.DB_NAME || "StayEase");

export const auth = betterAuth({
    database: mongodbAdapter(db, { client }),

    // ✅ Fix: baseURL must match your actual deployment URL
    baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",

    // ✅ Fix: trustedOrigins for cross-origin requests
    trustedOrigins: [
        "http://localhost:3000",
        "https://aura-space-atgv.vercel.app",
        // Add any preview deployment patterns
        "https://*.vercel.app",
    ],

    emailAndPassword: {
        enabled: true,
        // ✅ Auto-sign-in after registration disabled
        // (আপনি manually signOut করছেন register এর পরে)
        autoSignIn: false,
    },

    session: {
        // ✅ Fix: Vercel serverless এ cookie cache সমস্যা করে
        cookieCache: {
            enabled: false, // Production এ disable করুন
        },
        expiresIn: 60 * 60 * 24 * 30, // 30 days
        updateAge: 60 * 60 * 24,       // Update every 24h
    },

    // ✅ Fix: Cookie settings for cross-origin/HTTPS
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
            // ✅ JWT config for backend verification
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
                        // ✅ Fix: cookies() is async in Next.js 15
                        const cookieStore = await cookies();
                        const pendingRole = cookieStore.get("pending_role")?.value;

                        if (pendingRole && ["guest", "host"].includes(pendingRole)) {
                            role = pendingRole;
                        }
                    } catch (_err) {
                        // Cookie read failure is non-critical
                        // Default role "guest" will be used
                        void _err;
                    }

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