import { getSessions } from "@/lib/get-session";


export default async function DashboardPage() {
    const session = await getSessions();


    return (
        <div>
            <h1>Welcome, {session?.user.name}</h1>
            <p>Role: {session?.user.role}</p>
        </div>
    );
}