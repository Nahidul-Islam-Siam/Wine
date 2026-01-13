// components/ProfileSection.jsx
'use client';
import { useState } from 'react';
import { Edit } from 'lucide-react';
import Image from 'next/image';

export default function ProfileSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Mock profile data (replace with real state or API)
  const [profile, setProfile] = useState({
    name: "Joahn Emily Carter",
    id: "44856-8",
    contact: "+84-037-5497-950",
    email: "ghanhmagsun@gmail.com",
    address: "Dhaka Bangladesh",
    avatar: "/avatar3.png"
  });

  // Form state for modal
  const [formData, setFormData] = useState({
    name: profile.name,
    contact: profile.contact,
    email: profile.email,
    address: profile.address,
    avatar: profile.avatar
  });

  const handleEditClick = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    // Reset form to current profile
    setFormData({
      name: profile.name,
      contact: profile.contact,
      email: profile.email,
      address: profile.address,
      avatar: profile.avatar
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Update profile
    setProfile(prev => ({
      ...prev,
      name: formData.name,
      contact: formData.contact,
      email: formData.email,
      address: formData.address,
      avatar: formData.avatar
    }));
    setIsModalOpen(false);
    console.log("Updated profile:", formData);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-8 max-w-5xl">
      <div className="flex flex-col items-center">
        <div className="relative">
          <Image
            width={100}
            height={100}
            src={profile.avatar}
            alt="Profile"
            className="w-36 h-36 rounded-full object-cover"
          />
          <button
            onClick={handleEditClick}
            className="absolute top-0 right-0 bg-white rounded-full p-2 shadow-md hover:shadow-lg transition-shadow"
          >
            <Edit className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        <h1 className="mt-6 text-2xl font-semibold text-gray-900">{profile.name}</h1>
        <p className="text-sm text-gray-500 mt-1">Id: {profile.id}</p>

        <div className="mt-6 space-y-3 w-full max-w-sm">
          <div className="flex items-center gap-3 text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-gray-600">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            <span className="font-medium text-gray-700 w-20">Contact</span>
            <span className="text-gray-600">{profile.contact}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-gray-600">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
            <span className="font-medium text-gray-700 w-20">Email</span>
            <span className="text-gray-600">{profile.email}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-gray-600">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span className="font-medium text-gray-700 w-20">Address</span>
            <span className="text-gray-600">{profile.address}</span>
          </div>
        </div>
      </div>

      {/* Modal */}
   {isModalOpen && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg">
      <h2 className="text-2xl font-abhaya font-extrabold text-center text-[#000000] mb-6">
        Profile Edit
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Avatar + Upload */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-5.656-3.907A4 4 0 0 0 12 12a4 4 0 0 0-2.344 1.093A4 4 0 0 0 4 17v2" />
              <rect x="2" y="3" width="20" height="14" rx="2" />
            </svg>
          </div>
          <label className="text-sm font-medium text-gray-700 cursor-pointer hover:text-[#AF6900]">
            📎 Upload Picture
            <input type="file" className="hidden" accept="image/*" />
          </label>
        </div>

        {/* Form Fields - 2 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-xs font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter Name"
              className="w-full px-3 py-2 bg-gray-100 border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-[#AF6900] focus:border-[#AF6900]"
            />
          </div>

          {/* Contact */}
          <div>
            <label htmlFor="contact" className="block text-xs font-medium text-gray-700 mb-1">
              Contact
            </label>
            <input
              type="text"
              id="contact"
              name="contact"
              value={formData.contact}
              onChange={handleInputChange}
              placeholder="Enter Contact"
              className="w-full px-3 py-2 bg-gray-100 border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-[#AF6900] focus:border-[#AF6900]"
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-xs font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter Email"
              className="w-full px-3 py-2 bg-gray-100 border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-[#AF6900] focus:border-[#AF6900]"
            />
          </div>

          {/* Address */}
          <div>
            <label htmlFor="address" className="block text-xs font-medium text-gray-700 mb-1">
              Address
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              placeholder="Address"
              className="w-full px-3 py-2 bg-gray-100 border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-[#AF6900] focus:border-[#AF6900]"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-center gap-4 pt-4">
          <button
            type="submit"
            className="px-6 py-2 bg-[#AF6900] text-white rounded-md font-medium hover:bg-[#9E845C] transition-colors"
          >
            Submit Now
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="px-6 py-2 border border-gray-300 rounded-md font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>

      </form>
    </div>
  </div>
)}
    </div>
  );
}