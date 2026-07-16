import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reservations",
  description: "View and manage incoming booking requests and confirmed reservations on AuraSpace.",
};

export default function ReservationsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
