import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Earnings",
  description: "Track your earnings, payouts, and revenue from your property listings on AuraSpace.",
};

export default function EarningsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
