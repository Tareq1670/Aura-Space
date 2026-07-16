import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hosts",
  description: "View and manage all hosts registered on the AuraSpace platform.",
};

export default function HostsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
