import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Reviews",
  description: "View and manage reviews you've written for properties you've booked on AuraSpace.",
};

export default function ReviewsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
