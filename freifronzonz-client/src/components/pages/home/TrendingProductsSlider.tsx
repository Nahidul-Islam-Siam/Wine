/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"; // Required for Swiper hooks in Next.js App Router

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import ProductCard from "../cards/ProductCard";
import { products } from "../cards/ProductsDummyData";
import { useGetProductListQuery } from "@/redux/service/admin/productApi";
import { Spin } from "antd";
import Loaders from "@/lib/providers/Loaders";

// Sample product data (replace with your actual API/data)

export default function TrendingProductsSlider() {
  const {data:productsData, isLoading} = useGetProductListQuery({});

  console.log(productsData);
  
if( isLoading) {
  return <Loaders/>
}

  return (
    <section className="py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto  grid grid-cols-1">
     <h1 className="text-4xl font-extrabold font-abhaya text-center text-[#6D0E0B] md:text-[48px] mb-8">
          Trending Products
        </h1>

        <div className="relative ">
          {/* Swiper Container */}
          <Swiper
            modules={[Navigation,  Autoplay]}
            spaceBetween={20}
            slidesPerView={1}
            // pagination={{
            //   clickable: true,
            //   el: ".swiper-pagination",
            // }}
            navigation={{
              nextEl: ".swiper-button-next",
              prevEl: ".swiper-button-prev",
            }}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            breakpoints={{
              640: {
                slidesPerView: 2,
              },
              1024: {
                slidesPerView: 3,
              },
              1280: {
                slidesPerView: 4,
              },
            }}
            className="pb-8"
          >
            {productsData?.data?.products?.map((product: any) => (
              <SwiperSlide key={product.id}>
                <ProductCard product={product} />
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom Navigation Buttons */}
  <div className="absolute top-1/2 -translate-y-1/2 left-2 sm:-left-20 z-10">
            <button className="swiper-button-prev  w-10 h-10 flex items-center justify-center text-[#482817] hover:bg-gray-100 transition-colors">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="48"
                viewBox="0 0 24 48"
                fill="none"
              >
                <path
                  d="M19.096 13.16L16.974 11.04L5.41603 22.594C5.22972 22.7791 5.08186 22.9993 4.98096 23.2418C4.88007 23.4843 4.82812 23.7443 4.82812 24.007C4.82812 24.2696 4.88007 24.5297 4.98096 24.7722C5.08186 25.0147 5.22972 25.2348 5.41603 25.42L16.974 36.98L19.094 34.86L8.24603 24.01L19.096 13.16Z"
                  fill="black"
                />
              </svg>
            </button>
          </div>

    <div className="absolute top-1/2 -translate-y-1/2 right-2 sm:-right-20 z-10">
            <button className="swiper-button-next  w-10 h-10 flex items-center justify-center text-[#482817] hover:bg-gray-100 transition-colors">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="48"
                viewBox="0 0 24 48"
                fill="none"
              >
                <path
                  d="M4.90397 13.16L7.02597 11.04L18.584 22.594C18.7703 22.7791 18.9181 22.9993 19.019 23.2418C19.1199 23.4843 19.1719 23.7443 19.1719 24.007C19.1719 24.2696 19.1199 24.5297 19.019 24.7722C18.9181 25.0147 18.7703 25.2348 18.584 25.42L7.02597 36.98L4.90597 34.86L15.754 24.01L4.90397 13.16Z"
                  fill="black"
                />
              </svg>
            </button>
          </div>

          {/* Pagination Dots */}
          <div className="swiper-pagination mt-6 flex justify-center"></div>
        </div>
      </div>
    </section>
  );
}
