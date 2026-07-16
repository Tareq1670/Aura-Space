import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "View your host dashboard overview with listings, reservations, and earnings on AuraSpace.",
};

export default function HostMainLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
