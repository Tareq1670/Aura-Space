import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Add Property",
  description: "List a new property on AuraSpace with our step-by-step form wizard.",
};

export default function AddPropertyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
