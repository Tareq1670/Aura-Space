"use client";

import BlogFormPage from "@/Components/Blog/BlogFormPage";

export default function HostCreateBlogPage() {
    return (
        <BlogFormPage
            backLink={{ list: "/dashboard/host/blogs" }}
        />
    );
}
