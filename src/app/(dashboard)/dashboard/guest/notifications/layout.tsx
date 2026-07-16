import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Notifications",
  description: "View your recent notifications and stay updated with your AuraSpace activity.",
};

export default function NotificationsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
