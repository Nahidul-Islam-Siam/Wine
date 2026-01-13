'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation,  } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import TestimonialCard from '../cards/TestimonialCard';


// Sample data — replace with real CMS or API later
const testimonials = [
  {
    id: 1,
    quote: "Great vineyard tour and tasting!",
    excerpt:
      "Blood bank canine teeth larynx occupational therapist oncologist optician plaque spinal tap stat strep screen violence joints symptoms...",
    rating: 4.5,
    name: "Sara Colinton",
    avatar: "/images/a1.png",
  },
  {
    id: 2,
    quote: "Fabulous Grounds",
    excerpt:
      "Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Donec velit neque, auctor sit amet aliquam vel, ullamcorper sit amet ligula.",
    rating: 4.5,
    name: "Saitama One",
    avatar: "/images/a1.png",
  },
  {
    id: 3,
    quote: "Great vineyard tour and tasting!",
    excerpt:
      "Blood bank canine teeth larynx occupational therapist oncologist optician plaque spinal tap stat strep screen violence joints symptoms...",
    rating: 4.5,
    name: "Sara Colinton",
       avatar: "/images/a1.png",
  },
  {
    id: 4,
    quote: "Exceptional Service",
    excerpt:
      "Curabitur arcu erat, accumsan id imperdiet et, porttitor at sem. Vivamus magna justo, lacinia eget consectetur sed, convallis at tellus.",
    rating: 4.8,
    name: "John Doe",
    avatar: "/images/a1.png",
  },
];

export default function TestimonialsSection() {
  return (
    <section className="py-12 md:py-24 px-4 sm:px-6 lg:px-8 ">
      <div className="container mx-auto grid grid-cols-1">
      <h1 className="text-4xl font-extrabold font-abhaya text-center text-[#6D0E0B] md:text-[48px] mb-8">
      Our Happy Clients
        </h1>

        <div className="relative">
          <Swiper
            modules={[Navigation]}
            spaceBetween={20}
            slidesPerView={1}
            // pagination={{
            //   clickable: true,
            //   el: '.swiper-pagination',
            // }}
            navigation={{
              nextEl: '.swiper-button-next',
              prevEl: '.swiper-button-prev',
            }}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            className="pb-10"
          >
            {testimonials.map((testimonial) => (
              <SwiperSlide key={testimonial.id}>
                <TestimonialCard testimonial={testimonial} />
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom Navigation Arrows */}
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