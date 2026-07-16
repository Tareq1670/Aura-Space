import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Wishlist",
  description: "View and manage your saved properties and wishlist on AuraSpace.",
};

export default function WishlistLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
