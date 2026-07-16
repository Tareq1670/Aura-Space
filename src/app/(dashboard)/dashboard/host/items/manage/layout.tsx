import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Listings",
  description: "View and manage all your property listings on AuraSpace.",
};

export default function ManageListingsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
