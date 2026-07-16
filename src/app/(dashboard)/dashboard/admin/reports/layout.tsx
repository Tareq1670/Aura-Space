import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reports",
  description: "View platform reports, analytics, and insights on AuraSpace.",
};

export default function ReportsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
