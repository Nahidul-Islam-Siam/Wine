'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import BlogCard from '../cards/BlogCard';
import { useGetBlogQuery } from '@/redux/service/admin/cmsApi';

export default function RecentBlogSlider() {
  const { data: blogPosts, isLoading, isError } = useGetBlogQuery();

  // Handle loading/error states
  if (isLoading) {
    return (
      <section className="py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl font-extrabold font-abhaya text-center text-[#6D0E0B] md:text-[48px] mb-8">
            Recent Blog
          </h1>
          <p className="text-gray-500">Loading blogs...</p>
        </div>
      </section>
    );
  }

  if (isError || !blogPosts?.data?.blogs) {
    return (
      <section className="py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl font-extrabold font-abhaya text-center text-[#6D0E0B] md:text-[48px] mb-8">
            Recent Blog
          </h1>
          <p className="text-red-500">Failed to load blogs.</p>
        </div>
      </section>
    );
  }

  const blogs = blogPosts.data.blogs;

  return (
    <section className="py-10 px-4 sm:px-6 lg:px-8 grid grid-cols-1">
      <div className="container mx-auto grid grid-cols-1">
        <h1 className="text-4xl font-extrabold font-abhaya text-center text-[#6D0E0B] md:text-[48px] mb-8">
          Recent Blog
        </h1>

        <div className="relative">
          <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={20}
            slidesPerView={1}
            pagination={{
              clickable: true,
            }}
            navigation
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            className="pb-10"
          >
            {blogs.map((post) => (
              <SwiperSlide key={post.id}>
                <BlogCard post={post} />
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Pagination Dots */}
          <div className="swiper-pagination flex justify-center mt-6 space-x-2"></div>
        </div>
      </div>
    </section>
  );
}