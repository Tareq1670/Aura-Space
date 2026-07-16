import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Transactions",
  description: "View your payment history and transaction records on AuraSpace.",
};

export default function TransactionsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
