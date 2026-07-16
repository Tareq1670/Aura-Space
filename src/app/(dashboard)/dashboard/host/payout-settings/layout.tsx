import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Payout Settings",
  description: "Manage your payout methods and payment settings on AuraSpace.",
};

export default function PayoutSettingsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
