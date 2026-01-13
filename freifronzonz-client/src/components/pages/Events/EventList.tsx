/* eslint-disable @typescript-eslint/no-explicit-any */
// components/EventList.tsx
'use client';
import React, { useState } from "react";
import Image from "next/image";
import { useCreateEventBookingMutation } from "@/redux/service/admin/eventApi";
import { Event } from "@/redux/service/admin/eventApi"; // ✅ Import Event type
import Swal from "sweetalert2";

interface EventListProps {
  events: Event[]; // ✅ Proper type instead of any
  searchTerm: string;
}

export default function EventList({ events, searchTerm }: EventListProps) {
  const [createBooking] = useCreateEventBookingMutation();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null); // ✅ Typed
  const [personCount, setPersonCount] = useState("1");
  const [isBooking, setIsBooking] = useState(false);

  const filteredEvents = events.filter(event =>
    event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.des.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openBookingModal = (event: Event) => { // ✅ Typed parameter
    setSelectedEvent(event);
    setPersonCount("1");
    setIsModalOpen(true);
  };

  const closeBookingModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
    setPersonCount("1");
  };

  const handleBookingSubmit = async () => {
    if (!selectedEvent || !personCount || parseInt(personCount) <= 0) {
      Swal.fire("Warning", "Please enter a valid number of persons.", "warning");
      return;
    }

    setIsBooking(true);
    const payload = {
      eventId: selectedEvent.id,
      paymentMethod: "CARD" as const, // ✅ Type assertion for literal type
      person: personCount,
    };

    try {
      const response = await createBooking(payload).unwrap();
      
      if (response.status === true) {
        Swal.fire("Success", response.message, "success");
 window.open(response.data.payment.url, "_blank");
        closeBookingModal();
      } else {
        Swal.fire("Error", response.message || "Failed to create booking.", "error");
      }
    } catch (err: any) {
      console.error("Booking error:", err);
      Swal.fire(
        "Booking Failed",
        err?.data?.message || "Failed to create booking. Please try again.",
        "error"
      );
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <div className="space-y-6">
      {filteredEvents.map((event) => (
        <div
          key={event.id}
          className="flex flex-col sm:flex-row gap-6 p-6 border border-[#000000] rounded-[18px] shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="sm:w-1/2 flex justify-between flex-col">
            <div>
              <div className="md:text-xl text-lg font-normal text-[#9E845C]">
                {new Date(event.startDate).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric', 
                  year: 'numeric' 
                })} –{" "}
                {new Date(event.endDate).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric', 
                  year: 'numeric' 
                })}
              </div>

              <h3 className="text-2xl md:text-3xl font-abhaya font-extrabold text-[#000000] mt-2">
                {event.name}
              </h3>

              <div className="flex items-center gap-2 text-xs md:text-base text-[#968F8F] font-normal mt-2">
                Audience size: {event.audienceSize}
              </div>

              <p className="text-sm md:text-base text-[#968F8F] font-medium line-clamp-3 mt-3">
                {event.des}
              </p>
            </div>

            <div className="flex items-center gap-4 mt-6">
              <span className="text-2xl md:text-3xl font-extrabold font-abhaya text-[#AF6900]">
                ${event.price}
                <span className="text-sm font-medium text-[#482817] ml-1">
                  (1 person)
                </span>
              </span>

              <button 
                onClick={() => openBookingModal(event)}
                className="px-4 py-2 text-[#AF6900] border border-[#AF6900] rounded-lg font-medium hover:bg-[#AF6900] hover:text-white transition-colors"
              >
                Join Now
              </button>
            </div>
          </div>

          <div className="sm:w-1/2 relative aspect-video rounded-lg overflow-hidden">
            {event.images && event.images.length > 0 ? (
              <Image
                src={event.images[0]}
                alt={event.name}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, 50vw"
              />
            ) : (
              <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                <span className="text-gray-400">No Image</span>
              </div>
            )}
          </div>
        </div>
      ))}

      {filteredEvents.length === 0 && (
        <p className="text-center text-gray-500 py-12">No events found</p>
      )}

      {isModalOpen && selectedEvent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">Book Event</h3>
                <button 
                  onClick={closeBookingModal}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  &times;
                </button>
              </div>

              <div className="mb-6">
                <h4 className="font-medium text-lg mb-2">{selectedEvent.name}</h4>
                <p className="text-gray-600">
                  ${selectedEvent.price} per person
                </p>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Persons *
                </label>
                <input
                  type="number"
                  min="1"
                  max={parseInt(selectedEvent.audienceSize)}
                  value={personCount}
                  onChange={(e) => setPersonCount(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#AF6900] focus:outline-none"
                  placeholder="Enter number of persons"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Available spots: {selectedEvent.audienceSize}
                </p>
              </div>

              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between">
                  <span>Price per person:</span>
                  <span>${selectedEvent.price}</span>
                </div>
                <div className="flex justify-between mt-2">
                  <span>Persons:</span>
                  <span>{personCount}</span>
                </div>
                <div className="flex justify-between font-bold mt-3 pt-2 border-t">
                  <span>Total:</span>
                  <span>
                    ${(parseFloat(selectedEvent.price) * parseInt(personCount || "1")).toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={closeBookingModal}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBookingSubmit}
                  disabled={isBooking || parseInt(personCount) <= 0}
                  className={`flex-1 px-4 py-2 rounded-lg text-white font-medium ${
                    isBooking
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-[#AF6900] hover:bg-[#8d5a00]"
                  }`}
                >
                  {isBooking ? "Processing..." : "Proceed to Payment"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}