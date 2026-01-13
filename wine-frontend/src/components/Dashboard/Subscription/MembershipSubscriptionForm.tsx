/* eslint-disable @typescript-eslint/no-explicit-any */
// components/MembershipSubscriptionForm.tsx
"use client";

import React, { useState } from "react";

interface MembershipFormProps {
  onSubmit: (values: any) => void;
}

export default function MembershipSubscriptionForm({ onSubmit }: MembershipFormProps) {
  const mockClasses = [
    "Hot Pilates",
    "Soul Pack",
    "Yoga Flow",
    "Barre Blast",
    "Meditation Hour",
    "HIIT Core",
    "Dance Cardio",
    "Stretch & Restore",
  ];

  const [classList, setClassList] = useState<string[]>(["Hot Pilates"]);
  const [newClassName, setNewClassName] = useState("");
  const [formData, setFormData] = useState({
    subscriptionTitle: "",
    numberOfClass: 1,
    numberOfCredit: 1,
    price: 0,
    validityTime: 30,
  });

  const handleAddClass = () => {
    if (newClassName.trim()) {
      setClassList([...classList, newClassName.trim()]);
      setNewClassName("");
    }
  };

  const handleRemoveClass = (className: string) => {
    setClassList(classList.filter((c) => c !== className));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" ? parseFloat(value) || 0 : parseInt(value) || 0,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Membership Submitted values:", formData);
    console.log("Selected classes:", classList);
    onSubmit({ ...formData, selectedClasses: classList });
  };

  return (
    <form onSubmit={handleSubmit} className=" p-6 rounded-lg shadow-sm space-y-6">
      {/* Subscription Plan Section */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Subscription Plan</h2>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Subscription Title*
          </label>
          <input
            type="text"
            name="subscriptionTitle"
            value={formData.subscriptionTitle}
            onChange={(e) => setFormData({ ...formData, subscriptionTitle: e.target.value })}
            placeholder="Enter subscription title"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#A7997D] focus:outline-none"
          />
        </div>
      </div>

      {/* Number of Class & Credit */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Number Of Class*
          </label>
          <input
            type="number"
            name="numberOfClass"
            min="1"
            value={formData.numberOfClass}
            onChange={handleChange}
            placeholder="Enter number of class"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#A7997D] focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Number Of Credit*
          </label>
          <input
            type="number"
            name="numberOfCredit"
            min="1"
            value={formData.numberOfCredit}
            onChange={handleChange}
            placeholder="Enter number of credit"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#A7997D] focus:outline-none"
          />
        </div>
      </div>

      {/* Price & Validity */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Price $*
          </label>
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-gray-500">$</span>
            <input
              type="number"
              name="price"
              min="0"
              step="0.01"
              value={formData.price}
              onChange={handleChange}
              placeholder="Enter price"
              required
              className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#A7997D] focus:outline-none"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Validity Time*
          </label>
          <div className="relative">
            <input
              type="number"
              name="validityTime"
              min="1"
              value={formData.validityTime}
              onChange={handleChange}
              placeholder="Enter days"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#A7997D] focus:outline-none"
            />
            <span className="absolute right-3 top-2.5 text-gray-500">days</span>
          </div>
        </div>
      </div>

      {/* Class List Section */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Class List*</h2>

        {/* Add New Class Input */}
        <div className="mb-4 flex gap-2">
          <input
            type="text"
            value={newClassName}
            onChange={(e) => setNewClassName(e.target.value)}
            placeholder="Enter class name"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#A7997D] focus:outline-none"
          />
          <button
            type="button"
            onClick={handleAddClass}
            className="px-4 py-2 bg-[#A7997D] hover:bg-[#8d7c68] text-white rounded-md font-medium transition-colors"
          >
            Add New
          </button>
        </div>

        {/* Selected Classes Display */}
        <div className="mb-4 p-4 bg-[#F3F3F5] rounded-md">
          <div className="flex flex-wrap gap-2">
            {classList.map((className) => (
              <span
                key={className}
                className="inline-flex items-center px-3 py-1 bg-white border border-gray-300 rounded-md text-sm"
              >
                {className}
                <button
                  type="button"
                  onClick={() => handleRemoveClass(className)}
                  className="ml-2 text-xs text-gray-500 hover:text-red-500"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Class Selection Grid */}
        <div className="grid grid-cols-2 gap-4">
          {mockClasses.map((className) => (
            <div key={className} className="flex items-center">
              <input
                type="checkbox"
                id={`class-${className}`}
                checked={classList.includes(className)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setClassList([...classList, className]);
                  } else {
                    setClassList(classList.filter((c) => c !== className));
                  }
                }}
                className="mr-2 h-4 w-4 text-[#A7997D] border-gray-300 rounded focus:ring-2 focus:ring-[#A7997D]"
              />
              <label htmlFor={`class-${className}`} className="text-sm font-medium">
                {className}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end pt-6">
        <button
          type="submit"
          className="px-8 py-2 bg-[#A7997D] hover:bg-[#8d7c68] text-white rounded-md font-medium transition-colors"
        >
          Add
        </button>
      </div>
    </form>
  );
}