import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

const client = new MongoClient(process.env.MONGODB_URI as string);
const db = client.db(process.env.DB_NAME || "StayEase");

export const auth = betterAuth({
    database: mongodbAdapter(db, {
        client,
    }),
    emailAndPassword: {
        enabled: true,
    },
    user: {
        additionalFields: {
            role: {
                type: "string",
                required: false,
                defaultValue: "guest",
                input: true,
            },
        },
    },
    databaseHooks: {
        user: {
            create: {
                before: async (user) => {
                    const requestedRole = (user as { role?: string }).role;
                    const safeRole =
                        requestedRole === "host" ? "host" : "guest";

                    return {
                        data: {
                            ...user,
                            role: safeRole,
                        },
                    };
                },
            },
        },
    },
});
