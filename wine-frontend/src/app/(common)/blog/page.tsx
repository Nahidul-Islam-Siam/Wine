// app/blog/page.tsx
'use client';

import BlogHighlightCard from "@/components/pages/Blog/BlogCard3";
import Hero from "@/components/shared/Hero2";
// import BlogHighlightCard from "@/components/pages/Blog/BlogHighlightCard";
import { useGetBlogQuery } from "@/redux/service/admin/cmsApi";
import React from "react";

export default function BlogPage() {
  const { data: blogsData, isLoading, isError } = useGetBlogQuery();

  if (isLoading) {
    return (
      <div>
        <Hero title="Blog" backgroundImage="/images/h2.png" />
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <p>Loading blogs...</p>
        </div>
      </div>
    );
  }

  if (isError || !blogsData?.data?.blogs) {
    return (
      <div>
        <Hero title="Blog" backgroundImage="/images/h2.png" />
        <div className="max-w-7xl mx-auto px-4 py-16 text-center text-red-500">
          Failed to load blogs.
        </div>
      </div>
    );
  }

  const blogs = blogsData.data.blogs;

  return (
    <div>
      <Hero title="Blog" backgroundImage="/images/h2.png" />
      
      {/* Dynamically render highlight cards */}
      {blogs.map((post, index) => (
        <BlogHighlightCard key={post.id} post={post} index={index} />
      ))}
    </div>
  );
}