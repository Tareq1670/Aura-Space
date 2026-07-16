import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Advertise",
  description: "Learn about advertising and promotional opportunities on AuraSpace.",
};

export default function AdvertiseLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
