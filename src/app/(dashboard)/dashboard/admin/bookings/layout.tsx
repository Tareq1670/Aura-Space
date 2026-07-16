import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bookings",
  description: "View and manage all bookings across the AuraSpace platform.",
};

export default function AdminBookingsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
