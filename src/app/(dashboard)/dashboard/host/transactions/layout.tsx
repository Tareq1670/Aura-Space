import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Transactions",
  description: "View your host payment history and transaction records on AuraSpace.",
};

export default function HostTransactionsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
