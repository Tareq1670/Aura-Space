import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Properties",
  description: "View and manage all property listings on the AuraSpace platform.",
};

export default function AdminPropertiesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
