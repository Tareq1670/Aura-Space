import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "View your guest dashboard overview with bookings, messages, and notifications on AuraSpace.",
};

export default function GuestMainLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
