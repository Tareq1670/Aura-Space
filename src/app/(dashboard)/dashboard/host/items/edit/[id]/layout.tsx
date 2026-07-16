import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Edit Property",
  description: "Update and manage your property listing details on AuraSpace.",
};

export default function EditPropertyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
