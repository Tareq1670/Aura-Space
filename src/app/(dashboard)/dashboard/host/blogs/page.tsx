"use client";

import BlogListPage from "@/Components/Blog/BlogListPage";

const backLink = {
    create: "/dashboard/host/blogs/create",
    edit: "/dashboard/host/blogs/edit",
    list: "/dashboard/host/blogs",
};

export default function HostBlogsPage() {
    return <BlogListPage backLink={backLink} />;
}
