import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Explore Spaces",
  description: "Browse and discover premium event spaces, venues, and properties available for booking on AuraSpace.",
};

export default function ListingsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
