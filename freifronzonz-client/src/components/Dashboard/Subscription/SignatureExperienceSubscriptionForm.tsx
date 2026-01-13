/* eslint-disable @typescript-eslint/no-explicit-any */
// components/SignatureExperienceSubscriptionForm.tsx
"use client";

import React, { useState } from "react";

interface SignatureExperienceFormProps {
  onSubmit: (values: any) => void;
}

export default function SignatureExperienceSubscriptionForm({
  onSubmit,
}: SignatureExperienceFormProps) {
  const [includes, setIncludes] = useState<string[]>(["Full studio reservation"]);
  const [newInclude, setNewInclude] = useState("");

  const predefinedItems = [
    "Full studio reservation",
    "60-minute private class with certified instructor",
    "Additional space for sharing after the practice",
    "Extra 40 minutes for celebration",
  ];

  const [formData, setFormData] = useState({
    subscriptionTitle: "",
    numberOfPerson: 1,
    price: 0,
    validityTime: 30,
  });

  const handleAddInclude = () => {
    if (newInclude.trim()) {
      setIncludes([...includes, newInclude.trim()]);
      setNewInclude("");
    }
  };

  const handleRemoveInclude = (item: string) => {
    setIncludes(includes.filter((i) => i !== item));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" ? parseFloat(value) || 0 : parseInt(value) || 0,
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, subscriptionTitle: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Signature Experience Submitted values:", formData);
    console.log("Includes:", includes);
    onSubmit({ ...formData, includes });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm space-y-6">
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
            onChange={handleInputChange}
            placeholder="Enter subscription title"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#A7997D] focus:outline-none"
          />
        </div>
      </div>

      {/* Number of Person & Price */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Number Of Person*
          </label>
          <input
            type="number"
            name="numberOfPerson"
            min="1"
            value={formData.numberOfPerson}
            onChange={handleChange}
            placeholder="Enter number of person"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#A7997D] focus:outline-none"
          />
        </div>
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
      </div>

      {/* Validity Time */}
      <div className="grid grid-cols-2 gap-4">
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

      {/* Includes Section */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Includes*</h2>

        {/* Add New Include Input */}
        <div className="mb-4 flex gap-2">
          <input
            type="text"
            value={newInclude}
            onChange={(e) => setNewInclude(e.target.value)}
            placeholder="Enter include item"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#A7997D] focus:outline-none"
          />
          <button
            type="button"
            onClick={handleAddInclude}
            className="px-4 py-2 bg-[#A7997D] hover:bg-[#8d7c68] text-white rounded-md font-medium transition-colors"
          >
            Add New
          </button>
        </div>

        {/* Selected Includes Display */}
        <div className="mb-4 p-4 bg-[#F3F3F5] rounded-md">
          <div className="flex flex-wrap gap-2">
            {includes.map((item) => (
              <span
                key={item}
                className="inline-flex items-center px-3 py-1 bg-white border border-gray-300 rounded-md text-sm"
              >
                {item}
                <button
                  type="button"
                  onClick={() => handleRemoveInclude(item)}
                  className="ml-2 text-xs text-gray-500 hover:text-red-500"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Predefined Checkboxes */}
        <div className="space-y-2">
          {predefinedItems.map((item) => (
            <div key={item} className="flex items-center">
              <input
                type="checkbox"
                id={`include-${item}`}
                checked={includes.includes(item)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setIncludes([...includes, item]);
                  } else {
                    setIncludes(includes.filter((i) => i !== item));
                  }
                }}
                className="mr-2 h-4 w-4 text-[#A7997D] border-gray-300 rounded focus:ring-2 focus:ring-[#A7997D]"
              />
              <label htmlFor={`include-${item}`} className="text-sm font-medium">
                {item}
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