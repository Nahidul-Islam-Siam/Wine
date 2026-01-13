'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import Image from 'next/image';

const brands = [
  { id: 1, name: "Winery", logo: "/images/brand-1.png" },
  { id: 2, name: "Wine House", logo: "/images/brand-2.png" },
  { id: 3, name: "The Hillside Winery", logo: "/images/brand-3.png" },
  { id: 4, name: "High Class Restaurant", logo: "/images/brand-4.png" },
  { id: 5, name: "Fortress Elegance", logo: "/images/brand-5.png" },
];

export default function TopBrandSlider() {
  return (
    <section className="py-12 md:py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1">
     <h1 className="text-4xl font-extrabold font-abhaya text-center text-[#6D0E0B] md:text-[48px] mb-8">
          Top Brands
        </h1>

        <div className="relative">
          <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={20}
            slidesPerView={2}
            pagination={{
              clickable: true,
              el: '.swiper-pagination',
            }}
            navigation={{
              nextEl: '.swiper-button-next',
              prevEl: '.swiper-button-prev',
            }}
            breakpoints={{
              640: { slidesPerView: 3 },
              1024: { slidesPerView: 5 },
            }}
            className="pb-8"
          >
            {brands.map((brand) => (
              <SwiperSlide key={brand.id}>
                <div className="flex items-center justify-center p-4 sm:p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow h-32 sm:h-36">
                  <Image
                    src={brand.logo}
                    alt={brand.name}
                    width={120}
                    height={80}
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* <button className="swiper-button-prev absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full w-10 h-10 flex items-center justify-center text-[#482817] shadow-md hover:bg-[#f5f5f5]">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>

          <button className="swiper-button-next absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full w-10 h-10 flex items-center justify-center text-[#482817] shadow-md hover:bg-[#f5f5f5]">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button> */}

          {/* Pagination Dots */}
          <div className="swiper-pagination flex justify-center mt-6 space-x-2"></div>
        </div>
      </div>
    </section>
  );
}