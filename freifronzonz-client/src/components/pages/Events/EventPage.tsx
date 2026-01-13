// components/EventPage.tsx
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
'use client';
import React, { useState, useMemo } from 'react';
import { useGetEventListQuery, Event } from '@/redux/service/admin/eventApi';
import EventList from './EventList';

export default function EventPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const { data: events, isLoading } = useGetEventListQuery();

  const today = new Date();

  // ✅ Properly typed arrays
  const { recentEvents, upcomingEvents, showTabs } = useMemo(() => {
    const allEvents = events?.data?.products || [];

    const recent: Event[] = [];
    const upcoming: Event[] = [];

    allEvents.forEach((event) => {
      // Handle date parsing safely
      const start = new Date(event.startDate);
      const end = new Date(event.endDate);

      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        // Skip invalid dates
        upcoming.push(event);
        return;
      }

      if (end < today) {
        recent.push(event);
      } else {
        upcoming.push(event);
      }
    });

    const shouldShowTabs = recent.length > 0 && upcoming.length > 0;

    return { 
      recentEvents: recent, 
      upcomingEvents: upcoming,
      showTabs: shouldShowTabs
    };
  }, [events]);

  const currentView = useMemo(() => {
    if (showTabs) return 'upcoming';
    if (upcomingEvents.length > 0) return 'upcoming';
    return 'recent';
  }, [showTabs, upcomingEvents.length, recentEvents.length]);

  const eventsToDisplay = currentView === 'upcoming' ? upcomingEvents : recentEvents;

  if (isLoading) {
    return <div className="text-center py-20">Loading events...</div>;
  }

  return (
    <section className="py-12 md:py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Search for Events"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-4 pr-24 py-4 border border-[#9E845C] focus:ring-2 focus:ring-[#AF6900] rounded-lg"
            />
            <button className="absolute right-0 top-0 bottom-0 px-6 bg-[#AF6900] text-white rounded-r-lg">
              Find Events
            </button>
          </div>
        </div>

        {showTabs && (
          <div className="mb-8">
            <div className="flex space-x-2">
              {['recent', 'upcoming'].map((tab) => (
                <button
                  key={tab}
                  className={`px-6 py-3 rounded-lg ${
                    currentView === tab
                      ? 'bg-[#AF6900] text-white'
                      : 'border border-[#AF6900] text-[#AF6900]'
                  }`}
                  disabled
                >
                  {tab === 'recent' ? 'Recent' : 'Upcoming'}
                </button>
              ))}
            </div>
          </div>
        )}

        <h2 className="text-3xl md:text-4xl font-extrabold text-center my-8">
          {upcomingEvents.length > 0 && recentEvents.length === 0 
            ? 'Upcoming Events' 
            : recentEvents.length > 0 && upcomingEvents.length === 0
              ? 'Recent Events'
              : 'Events'}
        </h2>

        <EventList 
          events={eventsToDisplay} 
          searchTerm={searchTerm} 
        />
      </div>
    </section>
  );
}