
import { getSession } from "@/lib/get-session";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
    const session = await getSession();


    return (
        <div>
            <h1>Welcome, {session.user.name}</h1>
            <p>Role: {session.user.role}</p>
        </div>
    );
}