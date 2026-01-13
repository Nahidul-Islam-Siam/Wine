import React from "react";
import Image from "next/image";

interface HeroProps {
  title: string;
  backgroundImage: string;
  heightClass?: string; // Optional: e.g., "h-64", "h-96", etc.
}

export default function Hero({ 
  title, 
  backgroundImage, 
  heightClass = "h-64 md:h-80 lg:h-96" 
}: HeroProps) {
  return (
    <div>
      <div className={`relative w-full ${heightClass} overflow-hidden mb-8`}>
        {/* Optimized responsive background image */}
        <Image
          src={backgroundImage}
          alt={title}
          fill
          className="object-cover"
          sizes="100vw"
          priority={false} // set to true only if critical
        />
        
        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-black/50"></div>

        {/* Centered title */}
        <div className="relative z-10 flex items-center justify-center h-full px-4">
          <h1 className="font-abhaya font-extrabold text-white tracking-wide drop-shadow-lg text-4xl md:text-5xl lg:text-6xl">
            {title}
          </h1>
        </div>
      </div>
    </div>
  );
}