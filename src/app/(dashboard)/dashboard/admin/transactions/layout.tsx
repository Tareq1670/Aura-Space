import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Transactions",
  description: "View all platform transactions and payment records on AuraSpace.",
};

export default function AdminTransactionsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
