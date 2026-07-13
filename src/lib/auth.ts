import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { admin, jwt } from "better-auth/plugins";
import { cookies } from "next/headers";

const client = new MongoClient(process.env.MONGODB_URI as string);
const db = client.db(process.env.DB_NAME || "StayEase");

export const auth = betterAuth({
    database: mongodbAdapter(db, {
        client,
    }),

    emailAndPassword: {
        enabled: true,
    },

    session: {
        cookieCache: {
            enabled: true,
            maxAge: 60 * 60 * 24 * 30,
        },
    },

    plugins: [
        admin({
            defaultRole: "guest",
            adminRoles: ["admin"],
        }),
        jwt(),
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
                    } catch (_err) {
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

    trustedOrigins: [
        process.env.BETTER_AUTH_URL || "http://localhost:3000",
    ],
});