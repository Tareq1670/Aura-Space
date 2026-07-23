"use client";

import BlogListPage from "@/Components/Blog/BlogListPage";

const backLink = {
    create: "/dashboard/guest/blogs/create",
    edit: "/dashboard/guest/blogs/edit",
    list: "/dashboard/guest/blogs",
};

export default function GuestBlogsPage() {
    return <BlogListPage backLink={backLink} />;
}
