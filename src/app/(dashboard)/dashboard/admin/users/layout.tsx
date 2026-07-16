import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Users",
  description: "View and manage all users registered on the AuraSpace platform.",
};

export default function UsersLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
