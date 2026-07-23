"use client";

import { useParams } from "next/navigation";
import BlogFormPage from "@/Components/Blog/BlogFormPage";

export default function GuestEditBlogPage() {
    const params = useParams();
    const blogId = params.id as string;

    return (
        <BlogFormPage
            blogId={blogId}
            backLink={{ list: "/dashboard/guest/blogs" }}
        />
    );
}
