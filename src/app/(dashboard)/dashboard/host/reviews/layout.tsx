import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reviews",
  description: "View and respond to guest reviews for your property listings on AuraSpace.",
};

export default function HostReviewsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
