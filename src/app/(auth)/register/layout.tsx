import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register",
  description: "Create your AuraSpace account to start booking or hosting premium event spaces.",
};

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
