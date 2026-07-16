import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Revenue",
  description: "View platform revenue, fees, and financial summaries on AuraSpace.",
};

export default function RevenueLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
