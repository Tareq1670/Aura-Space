import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Analytics",
  description: "View detailed analytics and performance metrics for your property listings on AuraSpace.",
};

export default function AnalyticsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
