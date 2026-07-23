import type { Metadata } from "next";
import { getApiBase } from "@/lib/api-base";

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    try {
        const base = getApiBase();
        const res = await fetch(`${base}/blogs/${encodeURIComponent(slug)}`, {
            next: { revalidate: 60 },
        });
        if (!res.ok) {
            return { title: "Blog Post" };
        }
        const body = await res.json();
        const blog = body?.data?.blog;
        if (!blog) return { title: "Blog Post" };

        return {
            title: blog.title,
            description: (blog.excerpt || "").slice(0, 155),
            openGraph: {
                title: blog.title,
                description: (blog.excerpt || "").slice(0, 155),
                images: blog.coverImage ? [blog.coverImage] : [],
            },
        };
    } catch {
        return { title: "Blog Post" };
    }
}

export default function BlogDetailLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
