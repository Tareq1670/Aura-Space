"use client";

import BlogFormPage from "@/Components/Blog/BlogFormPage";

export default function GuestCreateBlogPage() {
    return (
        <BlogFormPage
            backLink={{ list: "/dashboard/guest/blogs" }}
        />
    );
}
