// components/pages/Blog/BlogHighlightCard.tsx
'use client';

import Image from "next/image";
import Link from "next/link";
import React from "react";

interface BlogPost {
  id: string;
  title: string;
  des: string;
  images: string[];
}

export default function BlogHighlightCard({ 
  post, 
  index 
}: { 
  post: BlogPost; 
  index: number; 
}) {
  const isImageLeft = index % 2 === 1; // Card 2 (index 1) has image on left

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Conditionally render image first if left */}
        {isImageLeft && (
          <div className="relative">
            <div className="aspect-[4/3] bg-gradient-to-br from-amber-200 to-rose-300 shadow-xl">
              {post.images && post.images.length > 0 ? (
                <Image
                  src={post.images[0]}
                  alt={post.title}
                  width={400}
                  height={400}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-gray-400">No Image</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Text Content */}
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-black font-abhaya mb-6">
            {post.title}
          </h1>
          <div className="space-y-4 text-[#968F8F] font-normal text-sm md:text-base mb-8">
            <p>{post.des}</p>
          </div>
          <Link 
            href={`/blog/${post.id}`} 
            className="px-8 py-3 border-2 border-amber-700 text-[#482817] font-semibold hover:bg-amber-700 hover:text-white transition-colors"
          >
            Read More
          </Link>
        </div>

        {/* Conditionally render image last if right */}
        {!isImageLeft && (
          <div className="relative">
            <div className="aspect-[4/3] bg-gradient-to-br from-amber-200 to-rose-300 shadow-xl">
              {post.images && post.images.length > 0 ? (
  <Image
    src={post.images[0]}
    alt={post.title}
    width={400}
    height={400}
    className="w-full h-full object-cover"
  />
) : (
  <div className="w-full h-full flex items-center justify-center">
    <span className="text-gray-400">No Image</span>
  </div>
)}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}