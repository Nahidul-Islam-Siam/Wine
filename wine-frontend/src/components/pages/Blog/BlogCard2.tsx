import Image from "next/image";
import Link from "next/link";
import React from "react";


export default function BlogCard2() {
  return (
    <section className=" py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Text Content */}
                <div className="relative">
          <div className="aspect-[4/3] bg-gradient-to-br from-amber-200 to-rose-300  shadow-xl">
            {/* Placeholder for your actual image */}
            <div className="w-full h-full flex items-center justify-center text-amber-900 font-bold">
              <Image
                src="/images/tradition.png"
                alt="Tradition"
                width={400}
                height={400}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
        
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-black font-abhaya mb-6">
            Where Tradition Meets Winemaking
          </h1>
          <div className="space-y-4 text-[#968F8F] font-normal text-sm md:text-base mb-8">
            <p>
              Our wines are crafted with patience and passion, honoring
              centuries-old techniques while embracing modern innovation. Every
              bottle tells a story of balance, collaboration, and dedication.
            </p>
            <p>
              We work alongside master winemakers to create exceptional vintages
              that reflect both heritage and contemporary excellence.
            </p>
          </div>
          <Link href="/blog/1" className="px-8 py-3 border-2 border-amber-700 text-[#482817] font-semibold hover:bg-amber-700 hover:text-white transition-colors">
            Read More
          </Link>
        </div>

        {/* Hero Image */}

      </div>
    </section>
  );
}
