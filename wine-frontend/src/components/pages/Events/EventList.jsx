// components/EventList.jsx
'use client';
import React from "react";
import Image from "next/image";

export default function EventList({ events, searchTerm }) {
  // Filter events based on search term
  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {filteredEvents.map((event) => (
        <div
          key={event.id}
          className="flex flex-col sm:flex-row gap-6 p-6 border-1 border-[#000000] rounded-[18px] shadow-sm hover:shadow-md transition-shadow"
        >
          {/* Left Content */}
          <div className="sm:w-1/2 flex justify-between flex-col">
            <div>
              <div className="md:text-xl text-lg font-normal text-[#9E845C]">
                {event.date}
              </div>
              <h3 className="text-2xl md:text-3xl font-abhaya font-extrabold text-[#000000]">
                {event.title}
              </h3>
              <div className="flex items-center gap-2 text-xs md:text-base text-[#968F8F] font-normal">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="11"
                  height="14"
                  viewBox="0 0 11 14"
                  fill="none"
                >
                  <path
                    d="M0.105469 10.7663C0.105469 10.4955 0.114409 10.2312 0.132289 9.9732C0.150169 9.71522 0.185929 9.4368 0.239568 9.13795C0.293208 8.8391 0.360897 8.56196 0.442633 8.30653C0.52437 8.0511 0.634204 7.80206 0.772135 7.55941C0.910066 7.31675 1.06843 7.10985 1.24723 6.93872C1.42603 6.76758 1.64442 6.63093 1.9024 6.52875C2.16039 6.42658 2.44519 6.3755 2.75681 6.3755C2.80279 6.3755 2.91007 6.43041 3.07865 6.54025C3.24723 6.65008 3.43752 6.77269 3.64953 6.90806C3.86153 7.04344 4.1374 7.16605 4.47712 7.27588C4.81683 7.38572 5.15783 7.44063 5.5001 7.44063C5.84238 7.44063 6.18337 7.38572 6.52309 7.27588C6.86281 7.16605 7.13867 7.04344 7.35068 6.90806C7.56268 6.77269 7.75298 6.65008 7.92156 6.54025C8.09014 6.43041 8.19742 6.3755 8.2434 6.3755C8.55502 6.3755 8.83982 6.42658 9.09781 6.52875C9.35579 6.63093 9.57418 6.76758 9.75298 6.93872C9.93178 7.10985 10.0901 7.31675 10.2281 7.55941C10.366 7.80206 10.4758 8.0511 10.5576 8.30653C10.6393 8.56196 10.707 8.8391 10.7606 9.13795C10.8143 9.4368 10.85 9.71522 10.8679 9.9732C10.8858 10.2312 10.8947 10.4955 10.8947 10.7663C10.8947 11.3793 10.7083 11.8634 10.3354 12.2184C9.96243 12.5735 9.4669 12.751 8.84876 12.751H2.15145C1.53331 12.751 1.03778 12.5735 0.664856 12.2184C0.291931 11.8634 0.105469 11.3793 0.105469 10.7663ZM3.41964 6.00385C3.41964 6.00385 3.27597 5.86017 2.98861 5.57282C2.70125 5.28546 2.55758 4.73565 2.55758 3.92339C2.55758 3.11113 2.84493 2.41764 3.41964 1.84293C3.99436 1.26822 4.68784 0.980862 5.5001 0.980862C6.31236 0.980862 7.00585 1.26822 7.58056 1.84293C8.15528 2.41764 8.44263 3.11113 8.44263 3.92339C8.44263 4.73565 8.15528 5.42914 7.58056 6.00385C7.00585 6.57856 6.31236 6.86592 5.5001 6.86592C4.68784 6.86592 3.99436 6.57856 3.41964 6.00385Z"
                    fill="#968F8F"
                  />
                </svg>
                Audience size: {event.audienceSize}
              </div>
              <p className="text-sm md:text-base text-[#968F8F] font-medium line-clamp-3">
                {event.description}
              </p>
            </div>
            <div className="flex items-center gap-4 mt-4">
              <span className="text-2xl md:text-3xl font-extrabold font-abhaya text-[#AF6900]">
                ${event.price}
                <span className="text-sm font-medium text-[#482817]">
                  {" "}
                  (1 person)
                </span>
              </span>
              <button className="px-4 py-2  text-[#AF6900] border border-[#AF6900] rounded-lg font-medium  hover:bg-[#AF6900] hover:text-white transition-colors">
                Join Now
              </button>
            </div>
          </div>

          {/* Right Image */}
          <div className="sm:w-1/2 relative aspect-video rounded-lg overflow-hidden">
            <Image
              src={event.image}
              alt={event.title}
              fill
              className="object-cover"
              priority={event.id === 1} // Optional: prioritize first image
            />
            {/* Share & Copy Link Icons */}
            <div className="absolute top-3 right-3 flex space-x-2">
              <button className="bg-white/80 backdrop-blur-sm p-2 rounded-full text-gray-600 hover:text-gray-900 transition-colors">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M19.59 12L15 7.41V9.87L14.14 10C9.83 10.61 6.91 12.87 5.24 16.33C7.56 14.69 10.44 13.9 14 13.9H15V16.59M13 14.92C8.53 15.13 5.33 16.74 3 20C4 15 7 10 14 9V5L21 12L14 19V14.9C13.67 14.9 13.34 14.91 13 14.92Z"
                    fill="#AF6900"
                  />
                </svg>
              </button>
              <button className="bg-white/80 backdrop-blur-sm p-2 rounded-full text-gray-600 hover:text-gray-900 transition-colors">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                >
                  <path
                    d="M5.83301 8.056C5.83301 7.46655 6.06716 6.90125 6.48396 6.48445C6.90076 6.06765 7.46606 5.8335 8.05551 5.8335H15.2772C15.569 5.8335 15.858 5.89098 16.1277 6.00267C16.3973 6.11437 16.6423 6.27807 16.8487 6.48445C17.0551 6.69083 17.2188 6.93584 17.3305 7.20548C17.4422 7.47513 17.4997 7.76413 17.4997 8.056V15.2777C17.4997 15.5695 17.4422 15.8585 17.3305 16.1282C17.2188 16.3978 17.0551 16.6428 16.8487 16.8492C16.6423 17.0556 16.3973 17.2193 16.1277 17.331C15.858 17.4427 15.569 17.5002 15.2772 17.5002H8.05551C7.76364 17.5002 7.47464 17.4427 7.20499 17.331C6.93535 17.2193 6.69034 17.0556 6.48396 16.8492C6.27758 16.6428 6.11388 16.3978 6.00219 16.1282C5.89049 15.8585 5.83301 15.5695 5.83301 15.2777V8.056Z"
                    stroke="#AF6900"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M3.34333 13.9475C3.0875 13.8021 2.87471 13.5916 2.72658 13.3374C2.57846 13.0832 2.50028 12.7942 2.5 12.5V4.16667C2.5 3.25 3.25 2.5 4.16667 2.5H12.5C13.125 2.5 13.465 2.82083 13.75 3.33333"
                    stroke="#AF6900"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}