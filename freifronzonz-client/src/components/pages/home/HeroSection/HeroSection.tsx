// components/HeroSection.tsx
"use client";
import { useGetHeroDataQuery } from "@/redux/service/admin/cmsApi";
import Image from "next/image";
import Link from "next/link";

export default function HeroSection() {
  const { data: heroData, isLoading } = useGetHeroDataQuery();

  // Fallback values while loading or if data missing
  const title = heroData?.data?.title || "Discover Exceptional Wines From Every Corner of the Globe";
  const subTitle = heroData?.data?.subTitle || "The Art & Heritage of Winemaking";
  const imageUrl = heroData?.data?.image || "/hero.png";
  const intro = heroData?.data?.intro || "";

  // Optional: Show loader during initial load (or just use fallback image)
  if (isLoading && !heroData) {
    // You can show a simple loader or just render with fallbacks
    // We'll proceed with fallbacks for smoother UX
  }

  return (
    <div className="relative w-full h-[80vh] sm:h-[70vh] md:h-[80vh] lg:h-[80vh] overflow-hidden">
      {/* Background Image — from CMS or fallback */}
      <div className="absolute inset-0">
        <Image
          src={imageUrl}
          alt="Wine Heritage"
          fill
          className="object-cover object-center"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 text-center text-white">
        {/* Subtitle (from CMS) */}
        <p className="text-xs sm:text-sm md:text-[20px] font-medium tracking-wider mb-2 text-[#AF6900]">
          {subTitle}
        </p>

        {/* Headline (from CMS) */}
        <h1 className="text-4xl sm:text-5xl md:text-[64px] font-abhaya font-bold leading-tight md:leading-[94px] mb-4 max-w-5xl text-center">
          {title}
        </h1>

        {/* Description (hardcoded — your API doesn't provide it) */}
        <p className="text-xs font-medium sm:text-sm md:text-[20px] max-w-5xl mb-8 md:leading-normal text-center opacity-90">
       {intro}
        </p>

        {/* Button */}
        <Link
          href="/shop"
          className="px-6 py-2 sm:px-8 sm:py-3 text-base md:text-2xl hover:bg-amber-700 border border-white bg-[#AF6900] text-white font-medium rounded-md font-abhaya font-bold transition-colors shadow-lg hover:shadow-xl sm:text-base"
        >
          Shop Now
        </Link>
      </div>
    </div>
  );
}