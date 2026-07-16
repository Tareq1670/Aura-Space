import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "View your admin dashboard overview with platform statistics and management tools on AuraSpace.",
};

export default function AdminMainLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
