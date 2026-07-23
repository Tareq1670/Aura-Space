import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Blog & Travel Guides",
    description:
        "Discover travel tips, destination guides, and hospitality insights from the AuraSpace community.",
};

export default function BlogsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
