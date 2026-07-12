import { headers } from "next/headers";
import { auth } from "../auth";

type Session = Awaited<ReturnType<typeof auth.api.getSession>>;
type User = NonNullable<Session>["user"];

export const getUser = async (): Promise<User | null> => {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    return session?.user ?? null;
};
