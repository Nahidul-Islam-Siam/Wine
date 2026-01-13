// components/EventPage.jsx
'use client';
import React, { useState } from 'react';
import RecentEvents from './RecentEvents';
import UpcomingEvents from './UpcomingEvents';

export default function EventPage() {
  const [activeTab, setActiveTab] = useState('recent'); // 'recent' or 'upcoming'
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <section className="py-12 md:py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

        {/* Search Bar & Tabs */}
        <div className="mb-8 flex flex-col gap-4 items-start justify-between">
          <div className="flex-1 w-full">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for Events"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-4 pr-10 py-4 border border-[#9E845C] focus:outline-none focus:ring-2 focus:ring-[#AF6900] focus:border-transparent"
              />
              <button className="absolute border border-[#9E845C] right-0 top-0 bottom-0 px-8 py-3 md:text-xl text-base font-medium transition-colors bg-[#AF6900] text-white">
                Find Events
              </button>
            </div>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTab('recent')}
              className={`px-6 py-3 md:text-xl text-base font-medium transition-colors ${
                activeTab === 'recent'
                  ? 'bg-[#AF6900] text-white'
                  : 'bg-white text-[#AF6900] border border-[#AF6900]'
              }`}
            >
              Recent
            </button>
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`px-6 py-3 md:text-xl text-base font-medium transition-colors ${
                activeTab === 'upcoming'
                  ? 'bg-[#AF6900] text-white'
                  : 'bg-white text-[#AF6900] border border-[#AF6900]'
              }`}
            >
              Upcoming
            </button>
          </div>
        </div>


        
        {/* Dynamic Heading */}
        <h2 className="text-3xl md:text-4xl font-abhaya text-center font-extrabold text-[#000000] my-8">
          {activeTab === 'recent' ? 'Recent Events' : 'Upcoming Events'}
        </h2>


        {/* Render Active Tab Content */}
        {activeTab === 'recent' && <RecentEvents searchTerm={searchTerm} />}
        {activeTab === 'upcoming' && <UpcomingEvents searchTerm={searchTerm} />}

      </div>
    </section>
  );
}